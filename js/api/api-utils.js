/**
 * API Utilities for Artopath POC
 * Fetches works from Django backend and merges with local POC data
 */

// Debug mode - only log in development
const DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Require live API: disable silent offline mode for this POC
const FORCE_API_MODE = true;

// Environment-aware API base - single source of truth for all modules
const _host = window.location.hostname;
const _isLocal = _host === 'localhost' || _host === '127.0.0.1' || _host === 'host.docker.internal';
const API_BASE = window.ARTOPATH_API_BASE ||
  (_isLocal ? `http://${_host}:8000/api` : 'https://artopath-api-435255581180.us-east4.run.app/api');

// Export globally for other modules (streaming-ui.js, etc.)
window.API_BASE = API_BASE;

// Cache for API works to avoid re-fetching
let apiWorksCache = null;
let apiWorksCacheTime = 0;
let apiCacheVersion = 0;
const CACHE_DURATION = 60000; // 1 minute

// ============================================
// TYPE MAPPING CONSTANTS
// Consistent mapping between Django API types and POC display types
// ============================================
const TYPE_MAPPING = {
  // Django type -> POC type (for display/filtering)
  toPOC: {
    // Artwork types
    painting: 'artwork',
    drawing: 'artwork',
    sculpture: 'artwork',
    photograph: 'artwork',
    installation: 'artwork',
    print: 'artwork',
    // Film types
    film: 'movie',
    movie: 'movie',
    animation: 'movie',
    tv_series: 'movie',
    tv: 'movie',
    documentary: 'movie'
  },
  // POC type -> Django types (for API queries)
  toDjango: {
    artwork: ['painting', 'drawing', 'sculpture', 'photograph', 'installation', 'print'],
    movie: ['film', 'movie', 'animation', 'tv_series', 'tv', 'documentary']
  }
};

/**
 * Normalize a Django API type to POC display type
 * @param {string} djangoType - Type from API response
 * @returns {string} POC type (artwork or movie)
 */
function normalizeToPOC(djangoType) {
  return TYPE_MAPPING.toPOC[djangoType] || djangoType;
}

/**
 * Get Django types for a POC type (for API filtering)
 * @param {string} pocType - POC type (artwork or movie)
 * @returns {string[]} Array of Django types
 */
function getDjangoTypes(pocType) {
  return TYPE_MAPPING.toDjango[pocType] || [pocType];
}

/**
 * Normalize title for fuzzy matching.
 * Lowercases, trims, and strips non-alphanumeric except spaces.
 * @param {string} title
 * @returns {string}
 */
function normalizeTitleForMatch(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
window.normalizeTitleForMatch = normalizeTitleForMatch;

/**
 * Simple similarity score using token overlap and length ratio.
 * @param {string} a
 * @param {string} b
 * @returns {number} 0-1 score
 */
function similarityScore(a, b) {
  const aNorm = normalizeTitleForMatch(a);
  const bNorm = normalizeTitleForMatch(b);
  if (!aNorm || !bNorm) return 0;
  if (aNorm === bNorm) return 1;

  const aTokens = new Set(aNorm.split(' '));
  const bTokens = new Set(bNorm.split(' '));
  const intersection = [...aTokens].filter(t => bTokens.has(t));
  const overlap = intersection.length;
  const denom = Math.max(aTokens.size, bTokens.size, 1);
  const tokenScore = overlap / denom;

  // Length ratio dampens mismatched strings
  const lenRatio = Math.min(aNorm.length, bNorm.length) / Math.max(aNorm.length, bNorm.length);

  return (tokenScore * 0.7) + (lenRatio * 0.3);
}
window.similarityScore = similarityScore;

/**
 * Determine canonical title used for dedupe/identity.
 * Prefers display title, then stored fallback fields.
 * @param {Object} work
 * @returns {string} lowercased canonical title or ''
 */
function getCanonicalTitle(work) {
  if (!work) return '';
  const title = work.title_display || work.title || work.title_original || '';
  return title ? title.trim().toLowerCase() : '';
}
window.getCanonicalTitle = getCanonicalTitle;

/**
 * Map incoming type (POC or API) to media_type for ingest endpoint.
 * Ensures artworks keep their original types instead of collapsing into movies.
 * @param {string} workType
 * @returns {string}
 */
function resolveMediaTypeForIngest(workType) {
  if (!workType) return null;
  const normalized = workType.toLowerCase();
  if (TYPE_MAPPING.toPOC[normalized]) {
    // Already a Django type we understand (painting, film, etc.)
    return normalized;
  }
  if (TYPE_MAPPING.toDjango[normalized] && TYPE_MAPPING.toDjango[normalized].length) {
    return TYPE_MAPPING.toDjango[normalized][0];
  }
  if (normalized === 'artwork') return 'painting';
  return normalized;
}
window.resolveMediaTypeForIngest = resolveMediaTypeForIngest;

/**
 * Find canonical ID for a candidate work using hard/soft/fuzzy match.
 * Order: tmdb_id (hard) -> wikidata/met_id (soft) -> title_normalized + year (fuzzy).
 * Returns best match with reason and score; does not mutate inputs.
 * @param {Object} candidate - work candidate with ids/title/year
 * @param {Array} haystack - works to search (defaults to window.ALL_WORKS)
 * @returns {{match: Object|null, reason: string, score: number}}
 */
function findCanonicalId(candidate, haystack) {
  const works = Array.isArray(haystack) && haystack.length
    ? haystack
    : (Array.isArray(window.ALL_WORKS) ? window.ALL_WORKS : []);

  if (!candidate || !works.length) {
    return { match: null, reason: 'no_data', score: 0 };
  }

  // Hard match: tmdb_id
  if (candidate.tmdb_id) {
    const match = works.find(w => w.tmdb_id && `${w.tmdb_id}` === `${candidate.tmdb_id}`);
    if (match) return { match, reason: 'tmdb_id', score: 1 };
  }

  // Soft match: wikidata or met_id
  if (candidate.wikidata_id) {
    const match = works.find(w => w.wikidata_id && `${w.wikidata_id}` === `${candidate.wikidata_id}`);
    if (match) return { match, reason: 'wikidata_id', score: 0.95 };
  }
  if (candidate.met_id) {
    const match = works.find(w => w.met_id && `${w.met_id}` === `${candidate.met_id}`);
    if (match) return { match, reason: 'met_id', score: 0.9 };
  }

  // Fuzzy: title_normalized + year proximity
  const candTitle = candidate.title_normalized || candidate.title_display || candidate.title || '';
  const candYear = candidate.date_created_year || candidate.year || null;
  let best = { match: null, reason: 'none', score: 0 };

  const candIsDb = candidate.id && String(candidate.id).startsWith('aw');

  works.forEach(w => {
    // Two DB-resolved works with different IDs: skip fuzzy (identity already resolved by backend)
    if (candIsDb && w.id && String(w.id).startsWith('aw') && w.id !== candidate.id) return;

    const workTitle = w.title_normalized || w.title_display || w.title || '';
    const titleScore = similarityScore(candTitle, workTitle);
    if (titleScore < 0.5) return; // low confidence, skip

    const workYear = w.date_created_year || w.year || null;
    const yearPenalty = (candYear && workYear && candYear !== workYear) ? 0.3 : 0;
    const score = titleScore - yearPenalty;
    if (score > best.score) {
      best = { match: w, reason: 'fuzzy_title_year', score };
    }
  });

  return best;
}
window.findCanonicalId = findCanonicalId;

/**
 * Invalidate API cache (call after adding new work)
 * This should be called when streaming completes to ensure
 * the next fetchAPIWorks() gets fresh data including the new work.
 */
function invalidateAPICache() {
  apiWorksCache = null;
  apiCacheVersion++;
  if (DEBUG) console.log('[API] Cache invalidated, version:', apiCacheVersion);
}

// Expose invalidateAPICache globally for streaming-ui.js
window.invalidateAPICache = invalidateAPICache;

// Offline detection for better UX
let isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
    invalidateAPICache(); // Refresh when back online
    if (DEBUG) console.log('[API] Online - cache invalidated');
  });

  window.addEventListener('offline', () => {
    isOffline = true;
    if (DEBUG) console.log('[API] Offline mode');
  });
}

/**
 * Fetch all works from the API
 * Returns { works: [], isConnected: boolean }
 */
async function fetchAPIWorks(scope = 'vault') {
  // Check offline status first
  if (isOffline) {
    if (DEBUG) console.log('[API] Offline mode - using local data only');
    if (FORCE_API_MODE) {
      showApiConnectionError('Browser reports offline. Connect to the Django API to use AI and live data.');
    }
    return { works: [], isConnected: false, error: 'Offline' };
  }

  // Check cache (only use cache when scope matches)
  if (apiWorksCache && (Date.now() - apiWorksCacheTime) < CACHE_DURATION && scope === 'vault') {
    return { works: apiWorksCache, isConnected: true };
  }

  const MAX_RETRIES = 3;
  const BACKOFF = [1000, 2000, 4000];
  const MAX_PAGES = 10;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      let allResults = [];
      let pageUrl = `${API_BASE}/core/works/?page_size=100&scope=${scope}`;
      let pageCount = 0;

      while (pageUrl && pageCount < MAX_PAGES) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(pageUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (pageCount === 0) throw new Error(`HTTP ${response.status}`);
          break;
        }

        const data = await response.json();
        allResults = allResults.concat(data.results || []);
        pageUrl = data.next;
        pageCount++;
      }

      apiWorksCache = allResults
        .map(work => {
          const primaryImage = work.primary_image_url || work.image || work.image_url || null;
          const normalizedType = normalizeToPOC(work.type);
          return {
            ...work,
            primary_image_url: primaryImage,
            image: primaryImage,
            type: normalizedType,
            originalType: work.type,
            source: 'api',
            fromAPI: true
          };
        });
      apiWorksCacheTime = Date.now();

      if (DEBUG) console.log(`[API] Loaded ${apiWorksCache.length} works from database (cache v${apiCacheVersion})`);
      return { works: apiWorksCache, isConnected: true };
    } catch (error) {
      if (attempt < MAX_RETRIES - 1) {
        if (DEBUG) console.log(`[API] Attempt ${attempt + 1} failed, retrying in ${BACKOFF[attempt]}ms...`);
        await new Promise(r => setTimeout(r, BACKOFF[attempt]));
        continue;
      }
      if (DEBUG) console.log('[API] Backend unavailable after 3 retries');
      if (FORCE_API_MODE) {
        showApiConnectionError(`Cannot reach API (${API_BASE}). Start Django and check CORS.`);
      }
      return { works: [], isConnected: false, error: error.message };
    }
  }
}


/**
 * Validate localStorage vault entries against API
 * Removes entries that return 404 (deleted from database)
 * BUT preserves entries that exist in local seed data (WORKS/MOVIES)
 * Runs asynchronously without blocking vault rendering
 * Updated to work with sync-ready vault format (ADR-020)
 */
async function validateVaultEntries() {
  if (isOffline) {
    if (DEBUG) console.log('[API] Offline - skipping vault validation');
    return;
  }

  // Use getVaultData helper if available, otherwise parse manually
  var vaultData;
  var works = [];
  try {
    if (typeof getVaultData === 'function') {
      vaultData = getVaultData();
      works = vaultData.works || [];
    } else {
      return;
    }
  } catch (e) {
    if (DEBUG) console.log('[API] Error parsing vault:', e);
    return;
  }

  if (works.length === 0) {
    return;
  }

  // Build set of local seed IDs - these should never be removed
  var localSeedIds = new Set();
  if (typeof WORKS !== 'undefined' && Array.isArray(WORKS)) {
    WORKS.forEach(function(w) { if (w.id) localSeedIds.add(w.id); });
  }
  if (typeof MOVIES !== 'undefined' && Array.isArray(MOVIES)) {
    MOVIES.forEach(function(w) { if (w.id) localSeedIds.add(w.id); });
  }

  if (DEBUG) console.log('[API] Validating ' + works.length + ' vault entries (' + localSeedIds.size + ' protected by local seed)...');

  var invalidIds = [];

  // Check each vault entry against the API
  await Promise.allSettled(works.map(async function(work) {
    if (!work.id) return;

    // Skip validation for entries that exist in local seed data
    if (localSeedIds.has(work.id)) {
      if (DEBUG) console.log('[API] Vault entry preserved (in local seed): ' + work.id);
      return;
    }

    try {
      var response = await fetch(API_BASE + '/core/works/' + work.id + '/');
      if (response.status === 404) {
        if (DEBUG) console.log('[API] Vault entry not found in DB: ' + work.id);
        invalidIds.push(work.id);
      }
    } catch (error) {
      // Network error - don't remove the entry
      if (DEBUG) console.log('[API] Validation network error for ' + work.id + ':', error.message);
    }
  }));

  // Remove invalid entries if any were found
  if (invalidIds.length > 0) {
    var validWorks = works.filter(function(w) { return !invalidIds.includes(w.id); });

    // Update localStorage cache with validated entries
    if (vaultData) {
      vaultData.works = validWorks;
      vaultData.lastModified = new Date().toISOString();
      localStorage.setItem('artopath_vault', JSON.stringify(vaultData));
    }

    if (DEBUG) console.log('[API] Removed ' + invalidIds.length + ' stale vault entries:', invalidIds);

    // Dispatch event so vault.html can refresh
    window.dispatchEvent(new CustomEvent('vaultValidated', {
      detail: { removedIds: invalidIds, remainingCount: validWorks.length }
    }));
  } else {
    if (DEBUG) console.log('[API] All vault entries are valid');
  }
}

// Expose validateVaultEntries globally
window.validateVaultEntries = validateVaultEntries;

/**
 * Get combined locations from API works
 * For use in Explore map
 */
// USE CASE: Extract places from API works for Explore map
// INTENTION: Use canonical latitude/longitude fields (per ADR-018)
// VISION: Consistent coordinate access across all modules
// TRADE-OFF: Must handle both canonical and legacy field names during transition
function getAPIWorkPlaces(apiWorks) {
  const places = [];

  apiWorks.forEach(work => {
    if (work.places && work.places.length > 0) {
      work.places.forEach((place, idx) => {
        // Use canonical latitude/longitude with legacy fallback
        const lat = place.latitude !== undefined ? place.latitude : place.lat;
        const lng = place.longitude !== undefined ? place.longitude : place.lng;

        if (lat !== undefined && lng !== undefined) {
          places.push({
            id: `api-${work.id}-place-${idx}`,
            workId: work.id,
            title: place.name_display || place.name,
            type: work.type,
            // Output canonical field names
            latitude: lat,
            longitude: lng,
            // Keep legacy aliases for backward compatibility during transition
            lat: lat,
            lng: lng,
            locationName: place.name_display || place.name,
            city: place.location,
            image: work.image,
            glance: place.connection,
            connection: place.connection,
            visitable: place.visitable,
            workTitle: work.title_display || work.title || '',
            workImage: work.primary_image_url || work.image || '',
            workYear: work.date_created_year || work.year,
            workCreator: getCreator(work) || work.creator,
            source: 'api',
            // Database place ID for API visit tracking
            dbPlaceId: place.id || place.place_id,
            placeId: place.id || place.place_id
          });
        }
      });
    }
  });

  return places;
}

/**
 * Get places from AI-generated content in localStorage
 * Only returns places for LOVED works (per spec §1.3)
 * Called by explore.html to merge with static place data
 */
function getLocalStorageGeneratedPlaces(collectionMode) {
  var places = [];

  // Get vault to check loved status (handles both old and new format)
  var works = [];
  try {
    if (typeof getVaultData === 'function') {
      works = getVaultData().works || [];
    } else {
      return places;
    }
  } catch (e) {
    console.warn('[API] Error parsing vault:', e);
    return places;
  }

  // Build eligible work IDs based on collection mode
  var eligibleIds;
  if (collectionMode === 'all') {
    // All works in vault
    eligibleIds = new Set(works.map(function(w) { return w.id; }));
  } else {
    // Only loved works (default)
    eligibleIds = new Set(works.filter(function(w) { return w.loved === true; }).map(function(w) { return w.id; }));
  }

  // Iterate localStorage for artopath_generated_* keys
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (!key || !key.startsWith('artopath_generated_')) continue;

    var workId = key.replace('artopath_generated_', '');

    // Only include if work is eligible for current collection mode
    if (!eligibleIds.has(workId)) continue;

    try {
      var data = JSON.parse(localStorage.getItem(key));
      var workPlaces = (data && data.content && data.content.places) || [];
      var vaultWork = works.find(function(w) { return w.id === workId; });

      workPlaces.forEach(function(place, idx) {
        // Use canonical latitude/longitude with legacy fallback (per ADR-018)
        var lat = place.latitude !== undefined ? place.latitude : place.lat;
        var lng = place.longitude !== undefined ? place.longitude : place.lng;

        if (lat !== undefined && lng !== undefined) {
          places.push({
            id: 'gen-' + workId + '-' + idx,
            workId: workId,
            title: place.name_display || place.name || place.title,
            type: (vaultWork && vaultWork.type) || 'movie',
            // Output canonical field names
            latitude: lat,
            longitude: lng,
            // Keep legacy aliases for backward compatibility
            lat: lat,
            lng: lng,
            locationName: place.name_display || place.name || place.title,
            city: place.city || place.location,
            image: vaultWork && vaultWork.image,
            glance: place.connection || place.description,
            connection: place.connection || place.description,
            workTitle: vaultWork && vaultWork.title,
            workImage: vaultWork && vaultWork.image,
            workYear: vaultWork && vaultWork.year,
            workCreator: vaultWork && vaultWork.creator,
            source: 'ai_generated',
            confidence: place.confidence || 'corroborated'
          });
        }
      });
    } catch (e) {
      console.warn('[API] Error reading generated places:', key, e);
    }
  }

  if (DEBUG) console.log('[API] Found ' + places.length + ' AI-generated places from ' + eligibleIds.size + ' eligible works (mode: ' + (collectionMode || 'loved') + ')');
  return places;
}
window.getLocalStorageGeneratedPlaces = getLocalStorageGeneratedPlaces;

/**
 * Initialize ALL_WORKS with API data
 * Call this after page load
 * Updated to work with sync-ready vault format (ADR-020)
 */
async function initializeWithAPIWorks(scope = 'vault') {
  // Ensure vault cache is loaded before assembling works (E-ART-008)
  await loadVaultCache();

  var result = await fetchAPIWorks(scope);
  var apiWorks = result.works;
  var isConnected = result.isConnected;

  // Helper to get localStorage vault metadata (loved, explored, notes)
  function getLocalStorageVaultWorks() {
    if (typeof getVaultData === 'function') {
      return getVaultData().works || [];
    }
    return [];
  }

  // Apply vault metadata overlay (loved, explored, etc.) to any work
  var vaultEntries = getLocalStorageVaultWorks();
  var vaultById = new Map();
  vaultEntries.forEach(function(entry) {
    if (entry && entry.id) vaultById.set(entry.id, entry);
  });

  function applyVaultMetadata(work) {
    var vaultEntry = vaultById.get(work.id);
    if (vaultEntry) {
      return Object.assign({}, work, {
        loved: vaultEntry.loved,
        lovedAt: vaultEntry.lovedAt,
        explored: vaultEntry.explored,
        exploredAt: vaultEntry.exploredAt,
        addedAt: vaultEntry.addedAt,
        notes: vaultEntry.notes,
        rating: vaultEntry.rating,
        visitedAt: vaultEntry.visitedAt,
        visitedPlaces: vaultEntry.visitedPlaces
      });
    }
    return work;
  }

  // =====================================================================
  // Data assembly: DB is the single source of truth.
  // Seeds are offline fallback only (when API unavailable).
  // Vault metadata (localStorage) is an overlay on top of either source.
  // =====================================================================

  var finalWorks;
  var seedCount = 0;
  var apiCount = apiWorks.length;

  if (isConnected && apiWorks.length > 0) {
    // API connected: use API data as the complete dataset
    finalWorks = apiWorks.map(applyVaultMetadata);

    if (DEBUG) console.log('[API] Using database as source of truth: ' + apiWorks.length + ' works');
  } else {
    // API unavailable: fall back to seeds
    if (FORCE_API_MODE) {
      window.WORKS = [];
      window.MOVIES = [];
      window.ALL_WORKS = [];
      return [];
    }
    var seedWorks = typeof WORKS !== 'undefined' ? WORKS : [];
    var seedMovies = typeof MOVIES !== 'undefined' ? MOVIES : [];
    seedCount = seedWorks.length + seedMovies.length;
    finalWorks = seedWorks.concat(seedMovies).map(applyVaultMetadata);

    if (DEBUG) console.log('[API] Offline fallback: ' + seedCount + ' seed works');
  }

  // Vault-only works: only relevant when offline (seeds + localStorage fill in).
  // When API is connected, DB is the complete source of truth — no vault-only additions.
  // localStorage entries outside the DB are stale cache from previous DB states.
  if (!isConnected) {
    var finalIds = new Set(finalWorks.map(function(w) { return w.id; }));
    var vaultOnlyWorks = vaultEntries
      .filter(function(entry) {
        return entry && entry.id && !finalIds.has(entry.id);
      })
      .map(function(entry) {
        return Object.assign({}, entry, {
          title_display: entry.title_display || entry.title || '',
          primary_image_url: entry.primary_image_url || entry.image || '',
          date_created_year: entry.date_created_year || entry.year || '',
          work_type: entry.work_type || entry.type || 'unknown',
          title: entry.title || entry.title_display || '',
          image: entry.image || entry.primary_image_url || '',
          year: entry.year || entry.date_created_year || '',
          type: entry.type || entry.work_type || 'unknown',
          person_roles: entry.person_roles || (entry.creator ? [{
            person: { name_display: entry.creator },
            role_type: (entry.type === 'movie' || entry.work_type === 'film') ? 'director' : 'artist'
          }] : [])
        });
      });

    if (vaultOnlyWorks.length > 0) {
      if (DEBUG) console.log('[API] Offline: adding ' + vaultOnlyWorks.length + ' vault-only works');
      finalWorks = finalWorks.concat(vaultOnlyWorks);
    }
  }

  // Update global ALL_WORKS
  window.ALL_WORKS = finalWorks;
  if (typeof backfillVaultCanonicalIds === 'function') {
    try {
      backfillVaultCanonicalIds(window.ALL_WORKS);
    } catch (e) {
      console.warn('[Identity] Vault canonical backfill failed:', e);
    }
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('allWorksUpdated', { detail: { works: window.ALL_WORKS } }));
  }

  if (DEBUG) console.log('[Artopath] Total works: ' + finalWorks.length + (isConnected ? ' (from DB)' : ' (' + seedCount + ' seeds)'));

  showConnectionStatus(isConnected, seedCount, apiCount);

  return window.ALL_WORKS;
}

/**
 * Show connection status indicator
 * Makes it obvious when Django/API is connected vs offline
 */
function showConnectionStatus(isConnected, seedCount, syncedCount) {
  // Remove existing indicator
  const existing = document.getElementById('apiStatusIndicator');
  if (existing) existing.remove();

  // Create status indicator
  const indicator = document.createElement('div');
  indicator.id = 'apiStatusIndicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
    cursor: pointer;
  `;

  if (isConnected) {
    indicator.style.background = 'linear-gradient(135deg, #2d4a3e, #1a2f1a)';
    indicator.style.color = '#a8e6c4';
    indicator.style.border = '1px solid #3d5a4e';
    indicator.innerHTML = `
      <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite;"></span>
      <span>Django Connected</span>
      <span style="opacity: 0.7;">${seedCount} local + ${syncedCount} synced</span>
    `;
  } else {
    indicator.style.background = 'linear-gradient(135deg, #4a3d2d, #2f2a1a)';
    indicator.style.color = '#e6c4a8';
    indicator.style.border = '1px solid #5a4d3d';
    indicator.innerHTML = `
      <span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span>
      <span>${FORCE_API_MODE ? 'Backend Required' : 'Offline Mode'}</span>
      <span style="opacity: 0.7;">${FORCE_API_MODE ? 'Start Django to load works' : seedCount + ' local works only'}</span>
    `;
  }

  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);

  // Click to dismiss
  indicator.onclick = () => {
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 300);
  };

  document.body.appendChild(indicator);

  // Auto-hide after 5 seconds if connected
  if (isConnected) {
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
      }
    }, 5000);
  }
}

/**
 * Blocking overlay when API is required but unavailable.
 */
function showApiConnectionError(message) {
  if (document.getElementById('apiRequiredOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'apiRequiredOverlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, rgba(18,18,18,0.96), rgba(12,20,16,0.96));
    color: #f8f8f2;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-align: center;
    padding: 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  `;

  const title = document.createElement('div');
  title.style.fontSize = '20px';
  title.style.fontWeight = '700';
  title.textContent = 'Backend required';

  const msg = document.createElement('div');
  msg.style.maxWidth = '520px';
  msg.style.opacity = '0.9';
  msg.textContent = message || 'Start the Django API to stream AI content and sync data.';

  const steps = document.createElement('div');
  steps.style.fontSize = '13px';
  steps.style.opacity = '0.85';
  steps.innerHTML = `
    <div>1) Start backend: <code>source venv/bin/activate && python manage.py runserver</code></div>
    <div>2) Verify <code>${API_BASE}</code> is reachable</div>
    <div>3) Set <code>window.ARTOPATH_API_BASE</code> if using a different host</div>
  `;

  const retryBtn = document.createElement('button');
  retryBtn.textContent = 'Retry Connection';
  retryBtn.style.cssText = `
    margin-top: 12px;
    padding: 10px 24px;
    background: #d4a847;
    color: #1a2f1a;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  `;
  retryBtn.onclick = () => { overlay.remove(); location.reload(); };

  overlay.appendChild(title);
  overlay.appendChild(msg);
  overlay.appendChild(steps);
  overlay.appendChild(retryBtn);
  document.body.appendChild(overlay);
}

// ============================================
// VISIT STATE API FUNCTIONS
// For tracking user visits to places
// ============================================

// Cache for user places
let userPlacesCache = null;
let userPlacesCacheTime = 0;
const USER_PLACES_CACHE_DURATION = 30000; // 30 seconds

/**
 * Mark a place as visited or want_to_visit via API
 * Falls back to localStorage if API unavailable
 * @param {number|string} placeId - Database place ID
 * @param {string} status - 'visited' or 'want_to_visit'
 * @param {string} notes - Optional notes
 * @returns {Promise<object>} API response or localStorage result
 */
async function markPlaceVisitAPI(placeId, status = 'visited', notes = '') {
  if (isOffline) {
    if (DEBUG) console.log('[API] Offline - using localStorage fallback');
    return { success: false, offline: true };
  }

  try {
    const response = await fetch(`${API_BASE}/places/${placeId}/visit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
        notes: notes
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Invalidate cache
    userPlacesCache = null;

    if (DEBUG) console.log(`[API] Place ${placeId} marked as ${status}`);
    return { success: true, data: data };
  } catch (error) {
    if (DEBUG) console.log('[API] Visit API unavailable:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get all user's visited places from API
 * Falls back to localStorage if API unavailable
 * @param {string} status - Optional filter: 'visited' or 'want_to_visit'
 * @returns {Promise<object[]>} Array of user places
 */
async function getUserPlacesAPI(status = null) {
  if (isOffline) {
    if (DEBUG) console.log('[API] Offline - returning empty');
    return [];
  }

  // Check cache
  const cacheKey = status || 'all';
  if (userPlacesCache && userPlacesCache[cacheKey] &&
      (Date.now() - userPlacesCacheTime) < USER_PLACES_CACHE_DURATION) {
    return userPlacesCache[cacheKey];
  }

  try {
    let url = `${API_BASE}/user/places/`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Cache result
    if (!userPlacesCache) userPlacesCache = {};
    userPlacesCache[cacheKey] = data.places || [];
    userPlacesCacheTime = Date.now();

    if (DEBUG) console.log(`[API] Loaded ${data.places?.length || 0} user places`);
    return data.places || [];
  } catch (error) {
    if (DEBUG) console.log('[API] User places API unavailable:', error.message);
    return [];
  }
}

/**
 * Get user place statistics from API
 * @returns {Promise<object>} Stats object with visited/want_to_visit counts
 */
async function getUserPlaceStatsAPI() {
  if (isOffline) {
    return { visited: 0, want_to_visit: 0, total: 0 };
  }

  try {
    const response = await fetch(`${API_BASE}/user/places/stats/`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (DEBUG) console.log('[API] Stats API unavailable:', error.message);
    return { visited: 0, want_to_visit: 0, total: 0 };
  }
}

/**
 * Check if a place is visited (API-first with localStorage fallback)
 * @param {number|string} placeId - Place ID to check
 * @returns {Promise<boolean>} True if visited
 */
async function isPlaceVisitedAPI(placeId) {
  // Try API first
  const places = await getUserPlacesAPI('visited');
  const found = places.find(p =>
    String(p.place_id) === String(placeId) ||
    p.id === placeId
  );
  return !!found;
}

/**
 * Remove a place from user's list
 * @param {number} userPlaceId - The UserPlace record ID (not place_id)
 * @returns {Promise<object>} Result
 */
async function removeUserPlaceAPI(userPlaceId) {
  if (isOffline) {
    return { success: false, offline: true };
  }

  try {
    const response = await fetch(`${API_BASE}/user/places/${userPlaceId}/`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Invalidate cache
    userPlacesCache = null;

    if (DEBUG) console.log(`[API] Removed user place ${userPlaceId}`);
    return { success: true };
  } catch (error) {
    if (DEBUG) console.log('[API] Remove failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Expose visit state functions globally
window.markPlaceVisitAPI = markPlaceVisitAPI;
window.getUserPlacesAPI = getUserPlacesAPI;
window.getUserPlaceStatsAPI = getUserPlaceStatsAPI;
window.isPlaceVisitedAPI = isPlaceVisitedAPI;
window.removeUserPlaceAPI = removeUserPlaceAPI;

// ============================================
// GRAPH API FUNCTIONS
// For DNA visualization (persons, works, lineage)
// ============================================

// Cache for graph data
let graphDataCache = {};
let graphCacheTime = 0;
const GRAPH_CACHE_DURATION = 120000; // 2 minutes

/**
 * Fetch person graph (connections to other persons)
 * @param {number} personId - Person ID
 * @param {object} options - Query options (depth, include_works)
 * @returns {Promise<object>} Graph data with nodes and edges
 */
async function fetchPersonGraph(personId, options = {}) {
  if (isOffline) return null;

  const cacheKey = `person-${personId}`;
  if (graphDataCache[cacheKey] && (Date.now() - graphCacheTime) < GRAPH_CACHE_DURATION) {
    return graphDataCache[cacheKey];
  }

  try {
    let url = `${API_BASE}/graph/persons/${personId}/`;
    const params = new URLSearchParams();
    if (options.depth) params.append('depth', options.depth);
    if (options.include_works) params.append('include_works', 'true');
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    graphDataCache[cacheKey] = data;
    graphCacheTime = Date.now();

    if (DEBUG) console.log(`[API] Loaded person graph for ${personId}:`, data.stats);
    return data;
  } catch (error) {
    if (DEBUG) console.log('[API] Person graph unavailable:', error.message);
    return null;
  }
}

/**
 * Fetch cast network (all person connections)
 * @param {object} options - Query options (limit, work_type)
 * @returns {Promise<object>} Network data with nodes and edges
 */
async function fetchCastNetwork(options = {}) {
  if (isOffline) return null;

  const cacheKey = `cast-${options.limit || 100}-${options.work_type || 'all'}`;
  if (graphDataCache[cacheKey] && (Date.now() - graphCacheTime) < GRAPH_CACHE_DURATION) {
    return graphDataCache[cacheKey];
  }

  try {
    let url = `${API_BASE}/graph/cast/`;
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.work_type) params.append('work_type', options.work_type);
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    graphDataCache[cacheKey] = data;
    graphCacheTime = Date.now();

    if (DEBUG) console.log(`[API] Loaded cast network:`, data.stats);
    return data;
  } catch (error) {
    if (DEBUG) console.log('[API] Cast network unavailable:', error.message);
    return null;
  }
}

/**
 * Fetch work lineage graph (cultural influence connections)
 * @param {string} workId - Work ID
 * @param {object} options - Query options (depth, include_persons)
 * @returns {Promise<object>} Lineage data with nodes and edges
 */
async function fetchWorkLineage(workId, options = {}) {
  if (isOffline) return null;

  const cacheKey = `lineage-${workId}`;
  if (graphDataCache[cacheKey] && (Date.now() - graphCacheTime) < GRAPH_CACHE_DURATION) {
    return graphDataCache[cacheKey];
  }

  try {
    let url = `${API_BASE}/graph/works/${workId}/lineage/`;
    const params = new URLSearchParams();
    if (options.depth) params.append('depth', options.depth);
    if (options.include_persons) params.append('include_persons', 'true');
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    graphDataCache[cacheKey] = data;
    graphCacheTime = Date.now();

    if (DEBUG) console.log(`[API] Loaded work lineage for ${workId}:`, data.stats);
    return data;
  } catch (error) {
    if (DEBUG) console.log('[API] Work lineage unavailable:', error.message);
    return null;
  }
}

/**
 * Fetch full knowledge graph (works + persons + relations)
 * @param {object} options - Query options (work_type, limit)
 * @returns {Promise<object>} Full graph data
 */
async function fetchFullNetwork(options = {}) {
  if (isOffline) return null;

  const cacheKey = `network-${options.limit || 50}-${options.work_type || 'all'}`;
  if (graphDataCache[cacheKey] && (Date.now() - graphCacheTime) < GRAPH_CACHE_DURATION) {
    return graphDataCache[cacheKey];
  }

  try {
    let url = `${API_BASE}/graph/network/`;
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.work_type) params.append('work_type', options.work_type);
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    graphDataCache[cacheKey] = data;
    graphCacheTime = Date.now();

    if (DEBUG) console.log(`[API] Loaded full network:`, data.stats);
    return data;
  } catch (error) {
    if (DEBUG) console.log('[API] Full network unavailable:', error.message);
    return null;
  }
}

/**
 * Fetch lineage relations for multiple works
 * USE CASE: DNA graph needs to show phantom nodes connected via lineage
 * INTENTION: Reveal cultural connections beyond the vault
 * @param {string[]} workIds - Array of work IDs to fetch lineage for
 * @returns {Promise<object>} { nodes: [], edges: [] } with phantom works
 */
async function fetchLineageRelations(workIds) {
  if (isOffline) return null;

  if (!workIds || workIds.length === 0) {
    if (DEBUG) console.log('[API] No work IDs provided for lineage fetch');
    return { nodes: [], edges: [] };
  }

  const cacheKey = `lineage-${workIds.sort().join(',')}`;
  if (graphDataCache[cacheKey] && (Date.now() - graphCacheTime) < GRAPH_CACHE_DURATION) {
    return graphDataCache[cacheKey];
  }

  try {
    const url = `${API_BASE}/graph/lineage/?work_ids=${workIds.join(',')}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (DEBUG) console.log('[API] Lineage API error:', response.status);
      return null;
    }

    const data = await response.json();
    graphDataCache[cacheKey] = data;
    graphCacheTime = Date.now();

    if (DEBUG) console.log(`[API] Loaded lineage for ${workIds.length} works:`, data.nodes?.length || 0, 'nodes,', data.edges?.length || 0, 'edges');
    return data;
  } catch (error) {
    if (DEBUG) console.log('[API] Lineage API unavailable:', error.message);
    return null;
  }
}

/**
 * Convert API graph data to DNA canvas format
 * @param {object} apiGraph - Graph data from API
 * @returns {object} Format compatible with dna-canvas.js
 */
function convertGraphToDNAFormat(apiGraph) {
  if (!apiGraph) return null;

  const nodes = [];
  const edges = [];

  // Convert nodes
  (apiGraph.nodes || []).forEach(node => {
    const dnaNode = {
      id: node.id,
      name: node.label || node.name || node.title,
      type: node.type || node.node_type,
      // Add position hints if available
      x: node.x || Math.random() * 800,
      y: node.y || Math.random() * 600
    };

    // Add type-specific data
    if (node.type === 'work') {
      dnaNode.year = node.year;
      dnaNode.work_type = node.work_type;
    } else if (node.type === 'person') {
      dnaNode.nationality = node.nationality;
      dnaNode.birth_year = node.birth_year;
    }

    nodes.push(dnaNode);
  });

  // Convert edges
  (apiGraph.edges || []).forEach(edge => {
    edges.push({
      source: edge.source,
      target: edge.target,
      type: edge.type || edge.relation,
      label: edge.label,
      // Confidence mapping
      confidence: edge.confidence || 'verified'
    });
  });

  return { nodes, edges, stats: apiGraph.stats };
}

/**
 * Fetch all people (Person nodes) from the database with their work relationships
 * USE CASE: DNA graph needs to display Person nodes from Django API
 * INTENTION: Show DB persons connected to works via WorkPersonRole
 * @returns {Promise<object>} { people: [], isConnected: boolean }
 */
async function fetchDBPeople() {
  if (isOffline) {
    if (DEBUG) console.log('[API] Offline - skipping DB people fetch');
    return { people: [], isConnected: false };
  }

  try {
    // Fetch the full network which includes both works and persons
    const networkData = await fetchFullNetwork({ limit: 100 });

    if (!networkData || !networkData.nodes) {
      return { people: [], isConnected: false };
    }

    // Extract person nodes
    const personNodes = networkData.nodes.filter(n => n.type === 'person');

    // Extract work-person edges (these connect persons to works)
    const workPersonEdges = networkData.edges.filter(e => e.type === 'work_person');

    // Build person data with their work connections
    const people = personNodes.map(person => {
      // Find all works this person is connected to
      const personWorkEdges = workPersonEdges.filter(e => e.target === person.id);
      const roles = personWorkEdges.map(edge => ({
        work_id: edge.source,
        role_type: edge.role || 'cast'
      }));

      return {
        id: person.id,
        name: person.label || person.name,
        nationality: person.nationality || null,
        birth_year: person.birth_year || null,
        roles: roles
      };
    });

    if (DEBUG) console.log(`[API] Fetched ${people.length} DB people with ${workPersonEdges.length} work connections`);
    return { people, isConnected: true, workPersonEdges };
  } catch (error) {
    if (DEBUG) console.log('[API] Error fetching DB people:', error.message);
    return { people: [], isConnected: false };
  }
}

/**
 * Fetch people data specifically for DNA graph visualization
 * Returns nodes and edges in DNA-compatible format
 * USE CASE: DNA page needs person nodes from DB with work-person edges
 * INTENTION: Display DB persons as purple nodes connected to gold work nodes
 * @returns {Promise<object>} { nodes: [], edges: [] } in DNA format
 */
async function fetchDBPeopleForDNA() {
  if (isOffline) {
    return { nodes: [], edges: [] };
  }

  try {
    // Use the full network endpoint which has both works and persons
    const networkData = await fetchFullNetwork({ limit: 100 });

    if (!networkData || !networkData.nodes) {
      return { nodes: [], edges: [] };
    }

    const nodes = [];
    const edges = [];

    // Helper to create consistent IDs (matches dna-canvas.js slugify format)
    const slugify = str => str.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    // Convert person nodes to DNA format
    networkData.nodes.forEach(node => {
      if (node.type === 'person') {
        // Use person_ prefix to match dna-canvas.js convention
        const personId = `person_${slugify(node.label || node.name || node.id)}`;
        nodes.push({
          id: personId,
          originalId: node.id,  // Keep DB UUID for API calls
          label: node.label || node.name,
          type: 'person',
          nationality: node.nationality,
          birth_year: node.birth_year,
          fromDB: true  // Flag as DB-sourced person
        });
      }
    });

    // Convert work-person edges to DNA format
    // The API returns edges with source=work_id, target=person_id
    networkData.edges.forEach(edge => {
      if (edge.type === 'work_person') {
        // Convert IDs to match DNA format
        const workNode = networkData.nodes.find(n => n.id === edge.source && n.type === 'work');
        const personNode = networkData.nodes.find(n => n.id === edge.target && n.type === 'person');

        if (workNode && personNode) {
          const workId = `work_${slugify(workNode.label || workNode.id)}`;
          const personId = `person_${slugify(personNode.label || personNode.name || personNode.id)}`;

          // Map role to edge relation type
          const roleType = edge.role || 'created';
          const relationMap = {
            'director': 'directed',
            'actor': 'appeared_in',
            'cast': 'appeared_in',
            'writer': 'wrote',
            'composer': 'composed',
            'producer': 'produced',
            'animator': 'animated',
            'artist': 'created'
          };
          const relation = relationMap[roleType] || 'created';

          edges.push({
            source: personId,
            target: workId,
            relation: relation,
            role: roleType,
            fromDB: true
          });
        }
      }
    });

    if (DEBUG) console.log(`[API] Converted ${nodes.length} DB persons and ${edges.length} work-person edges for DNA`);
    return { nodes, edges };
  } catch (error) {
    if (DEBUG) console.log('[API] Error fetching DB people for DNA:', error.message);
    return { nodes: [], edges: [] };
  }
}

// Expose graph functions globally
window.fetchPersonGraph = fetchPersonGraph;
window.fetchCastNetwork = fetchCastNetwork;
window.fetchWorkLineage = fetchWorkLineage;
window.fetchFullNetwork = fetchFullNetwork;
window.fetchLineageRelations = fetchLineageRelations;
window.convertGraphToDNAFormat = convertGraphToDNAFormat;
window.fetchDBPeople = fetchDBPeople;
window.fetchDBPeopleForDNA = fetchDBPeopleForDNA;

// ============================================
// CANONICAL SHAPE HELPER FUNCTIONS
// Access canonical fields only (ADR-018 clean break)
// ============================================

/**
 * Get the primary creator name from a work object.
 * Derives from canonical person_roles field only.
 * USE CASE: Display creator name on work cards, detail pages
 * INTENTION: Single source of truth from person_roles
 * @param {Object} work - Work object
 * @returns {string} Creator name or empty string
 */
function getCreator(work) {
  // Canonical only: derive from person_roles
  if (work.person_roles && work.person_roles.length > 0) {
    var priorityRoles = ['director', 'creator', 'artist'];
    for (var i = 0; i < priorityRoles.length; i++) {
      var roleType = priorityRoles[i];
      var match = work.person_roles.find(function(pr) {
        return pr.role_type === roleType;
      });
      if (match) {
        return match.person?.name_display || match.person?.name || '';
      }
    }
    // Fallback to first person
    var first = work.person_roles[0];
    return first.person?.name_display || first.person?.name || '';
  }
  return '';
}

/**
 * Get tags of a specific type from a work object.
 * Reads from canonical tag_relations field only.
 * USE CASE: Display theme/emotion tags on work cards
 * INTENTION: Single source of truth from tag_relations
 * @param {Object} work - Work object
 * @param {string} tagType - Tag type: 'theme', 'emotion', 'geo', 'genre'
 * @returns {string[]} Array of tag labels
 */
function getTagsByType(work, tagType) {
  if (work.tag_relations && Array.isArray(work.tag_relations)) {
    return work.tag_relations
      .filter(function(tr) { return tr.tag_type === tagType; })
      .map(function(tr) { return sanitizeTagLabel(tr.tag_label); });
  }
  return [];
}

/**
 * Sanitize a tag_label that may be a Python dict string.
 * Extracts the 'name' value from strings like "{'name': 'America', 'confidence': 'high'}"
 */
function sanitizeTagLabel(label) {
  if (typeof label === 'string' && label.startsWith('{') && label.includes("'name'")) {
    var nameMatch = label.match(/'name'\s*:\s*'([^']+)'/);
    if (nameMatch) return nameMatch[1];
  }
  return label;
}

/**
 * Get all tags from a work, organized by type.
 * USE CASE: Display full tag breakdown on work detail pages
 * INTENTION: Consistent access to all tags regardless of source shape
 * @param {Object} work - Work object
 * @returns {Object} Tags organized by type {theme: [], emotion: [], geo: [], genre: []}
 */
function getAllTags(work) {
  return {
    theme: getTagsByType(work, 'theme'),
    emotion: getTagsByType(work, 'emotion'),
    geo: getTagsByType(work, 'geo'),
    genre: getTagsByType(work, 'genre')
  };
}

/**
 * Get works that influenced this work.
 * Reads from canonical work_relations field only.
 * USE CASE: Display cultural lineage on DNA graph and work detail
 * INTENTION: Single source of truth from work_relations
 * @param {Object} work - Work object
 * @returns {Array} Array of influence objects
 */
function getInfluencedBy(work) {
  // Relation types that indicate "this work was influenced BY the target"
  // Includes rich seed data types like acknowledged_influence, conceptual_genealogy, etc.
  var INFLUENCED_BY_TYPES = [
    'inspired_by', 'influenced_by', 'acknowledged_influence',
    'conceptual_genealogy', 'technological_consciousness', 'visual_reference',
    'narrative_structure', 'aesthetic_influence', 'thematic_kinship',
    'draws_from', 'visual_influence', 'stylistic_influence',
    'philosophical_basis', 'cultural_foundation', 'cyberpunk_genealogy',
    'direct_homage', 'explicit_reference', 'primary_model',
    'martial_arts_choreography', 'female_action_precedent', 'operatic_violence',
    'conceptual_source', 'contemporaneous_influence', 'evolved_from',
    'directly_inspired', 'differentiated_from', 'action_vocabulary',
    'visual_vocabulary', 'technological_genealogy', 'practical_action_evolution',
    'spiritual_sibling', 'remake_of'
  ];

  // Check canonical work_relations first (Django API format)
  if (work.work_relations && Array.isArray(work.work_relations)) {
    return work.work_relations
      .filter(function(wr) {
        // Include all "influenced by" types, exclude "influenced" (outgoing)
        return INFLUENCED_BY_TYPES.indexOf(wr.relation_type) !== -1;
      })
      .map(function(wr) {
        return {
          id: wr.to_work?.id,
          title: wr.to_work?.title_display || wr.to_work?.title,
          relation: wr.relation_type,
          note: wr.note,
          confidence: wr.confidence,
          isInternalWork: wr.to_work?.id ? true : false
        };
      });
  }
  // Fallback to AI-generated lineage format
  if (work.lineage && Array.isArray(work.lineage.influencedBy)) {
    return work.lineage.influencedBy.map(function(item) {
      return {
        id: item.id,
        title: item.title,
        relation: item.path || 'inspired_by',
        note: item.note,
        confidence: item.confidence,
        year: item.year,
        creator: item.creator,
        isInternalWork: item.id ? true : false
      };
    });
  }
  return [];
}

/**
 * Get works that this work influenced.
 * Reads from canonical work_relations field only.
 * USE CASE: Display forward influence on DNA graph
 * INTENTION: Single source of truth from work_relations
 * @param {Object} work - Work object
 * @returns {Array} Array of influence objects
 */
function getInfluences(work) {
  // Check canonical work_relations first (Django API format)
  if (work.work_relations && Array.isArray(work.work_relations)) {
    return work.work_relations
      .filter(function(wr) { return wr.relation_type === 'influenced'; })
      .map(function(wr) {
        return {
          id: wr.to_work?.id,
          title: wr.to_work?.title_display || wr.to_work?.title,
          relation: wr.relation_type,
          note: wr.note,
          isInternalWork: wr.to_work?.id ? true : false
        };
      });
  }
  // Fallback to AI-generated lineage format
  if (work.lineage && Array.isArray(work.lineage.influences)) {
    return work.lineage.influences.map(function(item) {
      return {
        id: item.id,
        title: item.title,
        relation: item.path || 'influenced',
        note: item.note,
        confidence: item.confidence,
        year: item.year,
        creator: item.creator,
        isInternalWork: item.id ? true : false
      };
    });
  }
  return [];
}

// Simple wrapper helpers removed - use canonical fields directly:
// - work.title_display (was getTitle)
// - work.title_original (was getTitleOriginal)
// - work.date_created_year (was getYear)
// - work.work_type (was getWorkType)
// - work.primary_image_url (was getImage)
// - place.latitude (was getLatitude)
// - place.longitude (was getLongitude)
// - place.name_display (was getPlaceName)
// - work.person_roles (was getPersonRoles)

/**
 * Normalize a work type to a display category.
 * Maps canonical work_type values to POC display categories.
 * USE CASE: Filtering works in vault and DNA views
 * INTENTION: Group detailed types into user-friendly categories
 * @param {Object} work - Work object
 * @returns {string} Category: 'movie', 'artwork', or the raw type
 */
function getTypeCategory(work) {
  var workType = work.work_type || work.type || '';

  // Map canonical types to POC categories
  var movieTypes = ['film', 'animation', 'movie', 'documentary', 'short_film', 'tv_series', 'tv'];
  var artworkTypes = ['painting', 'sculpture', 'photograph', 'drawing', 'print', 'artwork', 'installation'];

  if (movieTypes.indexOf(workType.toLowerCase()) !== -1) {
    return 'movie';
  }
  if (artworkTypes.indexOf(workType.toLowerCase()) !== -1) {
    return 'artwork';
  }

  return workType;
}

/**
 * Check if content section is AI-generated.
 * USE CASE: Display AI indicator badges on content
 * INTENTION: Enable trust indicators per ADR-017
 * @param {Object} work - Work object with ai_sources
 * @param {string} section - 'glance' | 'story' | 'deep_dive'
 * @returns {boolean}
 */
function isAiGenerated(work, section) {
  return work.ai_sources?.[section]?.source_type === 'ai_generated';
}

/**
 * Get confidence level for a content section.
 * USE CASE: Display confidence stars on AI content
 * INTENTION: Support trust indicators per ADR-017
 * @param {Object} work - Work object with ai_sources
 * @param {string} section - 'glance' | 'story' | 'deep_dive'
 * @returns {string} 'verified' | 'corroborated' | 'unverified' | 'rumor' | 'unknown'
 */
function getConfidence(work, section) {
  return work.ai_sources?.[section]?.confidence || 'unknown';
}

/**
 * Get AI narrative content (glance/story/deep_dive).
 * Works with both legacy (work.glance) and canonical (work.ai.glance) shapes.
 * USE CASE: Display narrative content on work detail page
 * INTENTION: Abstract away AI content structure changes
 * @param {Object} work - Work object
 * @param {string} section - 'glance' | 'story' | 'deep_dive'
 * @returns {string|Object|null} Content or null
 */
const legacyShapeWarnings = new Set();

function warnLegacyShape(work, field, fallback) {
  if (!DEBUG) return;
  const id = work?.id || 'unknown';
  const key = `${id}:${field}:${fallback}`;
  if (legacyShapeWarnings.has(key)) return;
  legacyShapeWarnings.add(key);
  console.warn(`[LegacyDataShape] Work ${id} missing canonical "${field}" (fell back to ${fallback}).`);
}

function getAiContent(work, section) {
  if (!work) return null;

  // Canonical shape: top-level fields (glance, story, deep_dive)
  if (Object.prototype.hasOwnProperty.call(work, section) && work[section] !== undefined) {
    return work[section];
  }
  if (section === 'deep_dive' && Object.prototype.hasOwnProperty.call(work, 'deep_dive')) {
    return work.deep_dive;
  }

  // Legacy: nested ai object
  if (work.ai && work.ai[section] !== undefined) {
    warnLegacyShape(work, section, 'work.ai');
    return work.ai[section];
  }

  // Legacy camelCase (deepDive, etc.)
  var legacyField = section === 'deep_dive' ? 'deepDive' : section;
  if (work[legacyField] !== undefined) {
    warnLegacyShape(work, section, legacyField);
    return work[legacyField];
  }

  return null;
}

/**
 * Ensure canonical narrative fields exist on work objects.
 * Populates work.glance, work.story, and work.deep_dive from
 * legacy sources (ai object, narratives field) if needed.
 * @param {Object} work
 * @returns {Object} work
 */
function normalizeStoryObject(story) {
  if (!story || typeof story !== 'object') return story;
  const mappings = [
    ['surface_layer', 'surfaceLayer'],
    ['type_aesthetic', 'typeAesthetic'],
    ['core_philosophy', 'corePhilosophy'],
    ['cultural_context', 'culturalContext'],
    ['what_your_seeing', 'whatYourSeeing'],
    ['what_its_saying', 'whatItsSaying'],
    ['observation_details', 'observationDetails'],
    ['why_it_matters', 'whyItMatters'],
    ['story_surface', 'surfaceLayer'],
    ['story_meaning', 'corePhilosophy']
  ];
  mappings.forEach(([legacy, canonical]) => {
    if (story[legacy] !== undefined && story[canonical] === undefined) {
      story[canonical] = story[legacy];
    }
  });
  return story;
}

function ensureCanonicalNarrative(work) {
  if (!work) return work;

  if (work.narratives) {
    if (work.glance === undefined && work.narratives.glance !== undefined) {
      work.glance = work.narratives.glance;
    }
    if (work.story === undefined && work.narratives.story !== undefined) {
      work.story = work.narratives.story;
    }
    const deepField = work.narratives.deep_dive ?? work.narratives.deepDive;
    if (work.deep_dive === undefined && deepField !== undefined) {
      work.deep_dive = deepField;
    }
  }

  if (work.ai) {
    if (work.glance === undefined && work.ai.glance !== undefined) {
      work.glance = work.ai.glance;
    }
    if (work.story === undefined && work.ai.story !== undefined) {
      work.story = work.ai.story;
    }
    const legacyDeep = work.ai.deep_dive ?? work.ai.deepDive;
    if (work.deep_dive === undefined && legacyDeep !== undefined) {
      work.deep_dive = legacyDeep;
    }
  }

  if (work.story) {
    work.story = normalizeStoryObject(work.story);
  }

  return work;
}

/**
 * Update canonical narrative section and keep legacy ai object in sync.
 * @param {Object} work
 * @param {string} section - 'glance' | 'story' | 'deep_dive'
 * @param {*} content
 */
function setNarrativeContent(work, section, content) {
  if (!work) return;
  const canonicalKey = section === 'deep_dive' ? 'deep_dive' : section;
  work[canonicalKey] = content;

  if (!work.ai) {
    work.ai = {};
  }

  if (section === 'deep_dive') {
    work.ai.deep_dive = content;
    work.ai.deepDive = content;
  } else {
    work.ai[section] = content;
  }
}

/**
 * Ensure tags map exists using canonical tag_relations.
 * Populates work.tags grouped by tag_type (theme/emotion/geo/genre/etc.)
 */
function ensureCanonicalTags(work) {
  if (!work) return work;

  if (!work.tags || typeof work.tags !== 'object') {
    work.tags = {};
  }

  // Ensure existing tag buckets are always arrays
  Object.keys(work.tags).forEach(function(key) {
    if (!Array.isArray(work.tags[key])) {
      work.tags[key] = work.tags[key] ? [work.tags[key]] : [];
    }
  });

  const relations = Array.isArray(work.tag_relations) ? work.tag_relations : [];

  relations.forEach(function(rel) {
    if (!rel || !rel.tag_type || !rel.tag_label) return;
    const type = rel.tag_type;
    // Sanitize tag_label: extract name from Python dict strings
    let label = sanitizeTagLabel(rel.tag_label);
    if (!work.tags[type]) {
      work.tags[type] = [];
    }
    if (!work.tags[type].includes(label)) {
      work.tags[type].push(label);
    }
  });

  // Always expose the primary buckets so UI code can depend on them
  ['theme', 'emotion', 'geo', 'genre'].forEach(function(type) {
    if (!work.tags[type]) {
      work.tags[type] = [];
    }
  });

  return work;
}

/**
 * Normalize work structure (narratives, tags, etc.)
 * @param {Object} work
 * @returns {Object} work
 */
function normalizeWork(work) {
  ensureCanonicalNarrative(work);
  ensureCanonicalTags(work);
  return work;
}

// ============================================
// SSOT NORMALIZATION LAYER
// One function sits between ALL data sources and currentWork.
// No raw data ever reaches render functions.
// Sources: api, sse_section, sse_seed, localStorage, seed, list_api
// ============================================

function transformCastToPersonRoles(cast) {
  if (!Array.isArray(cast)) return [];
  return cast.map(function(p) {
    return {
      person: {
        id: p.id || null,
        name_display: p.name || '',
        name_native: null,
        image_url: p.image_url || null
      },
      role_type: (p.role || 'creator').toLowerCase().replace(/\s+/g, '_'),
      role_display: p.role || 'Creator',
      bio: p.bio || '',
      character: p.character || ''
    };
  });
}

function transformLineageToWorkRelations(lineage) {
  if (!lineage) return [];
  var relations = [];
  (lineage.influencedBy || []).forEach(function(item) {
    relations.push({
      relation_type: item.path || 'inspired_by',
      to_work: { id: item.id || null, title_display: item.title || '' },
      confidence: item.confidence || 'unverified',
      note: item.note || '',
      year: item.year || null,
      creator: item.creator || ''
    });
  });
  (lineage.influences || []).forEach(function(item) {
    relations.push({
      relation_type: item.path || 'influenced',
      to_work: { id: item.id || null, title_display: item.title || '' },
      confidence: item.confidence || 'unverified',
      note: item.note || '',
      year: item.year || null,
      creator: item.creator || ''
    });
  });
  return relations;
}

function transformTagsToTagRelations(tags) {
  if (!tags) return [];
  var relations = [];
  ['theme', 'emotion', 'geo', 'genre'].forEach(function(type) {
    (tags[type] || []).forEach(function(item) {
      var label = typeof item === 'string' ? item : (item.name || item.label || '');
      if (label) relations.push({ tag_type: type, tag_label: label });
    });
  });
  return relations;
}

function normalizeVoices(voices) {
  if (!voices) return null;
  return {
    expert: voices.expert || [],
    creator: voices.creator || [],
    cultural: voices.cultural || voices.community || voices.passerby || []
  };
}

function normalizePlaces(places) {
  if (!Array.isArray(places)) return [];
  return places.map(function(p) {
    return {
      id: p.id || null,
      name_display: p.name_display || p.name || p.title || '',
      latitude: p.latitude != null ? p.latitude : (p.lat != null ? p.lat : null),
      longitude: p.longitude != null ? p.longitude : (p.lng != null ? p.lng : null),
      connection: p.connection || p.description || '',
      place_type: p.place_type || p.location_type || p.relation_type || 'filming_location',
      address: p.address || '',
      city: p.city || '',
      country: p.country || '',
      visitable: p.visitable != null ? p.visitable : true,
      confidence: p.confidence || 'unverified'
    };
  });
}

function deriveTagsFromRelations(tagRelations, existingTags) {
  var tags = { theme: [], emotion: [], geo: [], genre: [] };
  if (existingTags) {
    ['theme', 'emotion', 'geo', 'genre'].forEach(function(t) {
      tags[t] = [].concat(existingTags[t] || []);
    });
  }
  (tagRelations || []).forEach(function(rel) {
    if (!rel || !rel.tag_type || !rel.tag_label) return;
    var type = rel.tag_type;
    var label = typeof sanitizeTagLabel === 'function' ? sanitizeTagLabel(rel.tag_label) : rel.tag_label;
    if (tags[type] && tags[type].indexOf(label) === -1) {
      tags[type].push(label);
    }
  });
  return tags;
}

function deriveLineageFromRelations(workRelations, existingLineage) {
  var lineage = {
    influencedBy: [].concat((existingLineage && existingLineage.influencedBy) || []),
    influences: [].concat((existingLineage && existingLineage.influences) || [])
  };
  var seenTitles = new Set();
  lineage.influencedBy.forEach(function(i) { if (i.title) seenTitles.add(i.title.toLowerCase()); });
  lineage.influences.forEach(function(i) { if (i.title) seenTitles.add(i.title.toLowerCase()); });

  (workRelations || []).forEach(function(rel) {
    var title = rel.to_work && rel.to_work.title_display;
    if (!title || seenTitles.has(title.toLowerCase())) return;
    seenTitles.add(title.toLowerCase());
    var item = {
      id: rel.to_work.id,
      title: title,
      note: rel.note || '',
      confidence: rel.confidence,
      year: rel.year || null,
      creator: rel.creator || ''
    };
    if (rel.relation_type === 'inspired_by' || rel.relation_type === 'based_on' ||
        rel.relation_type === 'reinterpretation_of') {
      lineage.influencedBy.push(item);
    } else {
      lineage.influences.push(item);
    }
  });
  return lineage;
}

function mergeSseSection(work, section, content) {
  switch (section) {
    case 'glance':
      work.glance = content;
      setNarrativeContent(work, 'glance', content);
      break;
    case 'whyItMatters':
      work.whyItMatters = content;
      setNarrativeContent(work, 'whyItMatters', content);
      break;
    case 'story':
      work.story = typeof content === 'object' ? normalizeStoryObject(content) : content;
      setNarrativeContent(work, 'story', work.story);
      break;
    case 'people':
      var newRoles = transformCastToPersonRoles(content.cast || content);
      var existingNames = new Set(
        (work.person_roles || []).map(function(pr) {
          return (pr.person && pr.person.name_display || '').toLowerCase();
        })
      );
      work.person_roles = (work.person_roles || []).concat(
        newRoles.filter(function(r) {
          return !existingNames.has((r.person && r.person.name_display || '').toLowerCase());
        })
      );
      work.people = content;
      break;
    case 'lineage':
      var newRelations = transformLineageToWorkRelations(content);
      work.work_relations = (work.work_relations || []).concat(newRelations);
      work.lineage = deriveLineageFromRelations(work.work_relations);
      break;
    case 'voices':
      work.voices = normalizeVoices(content);
      break;
    case 'tags':
      var newTagRels = transformTagsToTagRelations(content);
      work.tag_relations = (work.tag_relations || []).concat(newTagRels);
      work.tags = deriveTagsFromRelations(work.tag_relations);
      break;
    case 'places':
      work.places = normalizePlaces(Array.isArray(content) ? content : (content.locations || [content]));
      break;
    case 'deepDive':
      work.deep_dive = content;
      setNarrativeContent(work, 'deep_dive', content);
      break;
  }
}

function normalizeToCanonical(raw, source, existing) {
  var work = Object.assign({}, existing || {});

  switch (source) {
    case 'api':
      Object.assign(work, raw);
      ensureCanonicalNarrative(work);
      // Normalize non-canonical people shapes — detect by checking for person.name_display
      var hasCanonicalPeople = work.person_roles && work.person_roles.length &&
        work.person_roles[0] && work.person_roles[0].person && work.person_roles[0].person.name_display;
      if (!hasCanonicalPeople) {
        var castSource = (work.people && work.people.cast) || work.person_roles || [];
        if (castSource.length && !castSource[0].person) {
          work.person_roles = transformCastToPersonRoles(castSource);
        }
      }
      if ((!work.work_relations || !work.work_relations.length) && work.lineage) {
        work.work_relations = transformLineageToWorkRelations(work.lineage);
      }
      if (work.voices) {
        work.voices = normalizeVoices(work.voices);
      }
      if (work.places && work.places.length && work.places[0].lat !== undefined) {
        work.places = normalizePlaces(work.places);
      }
      if ((!work.tag_relations || !work.tag_relations.length) && work.tags) {
        work.tag_relations = transformTagsToTagRelations(work.tags);
      }
      break;

    case 'sse_section':
      mergeSseSection(work, raw.section, raw.content);
      break;

    case 'sse_seed':
      work.id = work.id || raw.id;
      work.title_display = raw.title || raw.title_display || work.title_display || '';
      work.title_original = raw.titleOriginal || raw.title_original || work.title_original || '';
      work.work_type = raw.type || raw.work_type || work.work_type || 'other';
      work.date_created_year = raw.year || raw.date_created_year || work.date_created_year;
      work.primary_image_url = raw.image || raw.primary_image_url || work.primary_image_url || '';
      work.quality_tier = raw.quality_tier || raw.tier || work.quality_tier || 'skeleton';
      work.creator = raw.creator || work.creator || '';
      break;

    case 'localStorage':
      var c = raw.content || raw;
      var narr = c.narratives || c.ai || {};
      if (narr.glance) work.glance = narr.glance;
      if (narr.story) work.story = normalizeStoryObject(narr.story);
      if (narr.deep_dive || narr.deepDive) work.deep_dive = narr.deep_dive || narr.deepDive;
      if (c.people && c.people.cast) {
        work.person_roles = transformCastToPersonRoles(c.people.cast);
      }
      if (c.lineage || c.culturalLineage) {
        work.work_relations = transformLineageToWorkRelations(c.lineage || c.culturalLineage);
      }
      if (c.tags) {
        work.tag_relations = transformTagsToTagRelations(c.tags);
      }
      if (c.voices) work.voices = normalizeVoices(c.voices);
      if (c.places) work.places = normalizePlaces(c.places);
      break;

    case 'seed':
      Object.assign(work, raw);
      if (raw.story) work.story = normalizeStoryObject(raw.story);
      break;

    case 'list_api':
      work.id = raw.id;
      work.title_display = raw.title || raw.title_display || '';
      work.title_original = raw.titleOriginal || raw.title_original || '';
      work.work_type = raw.type || raw.work_type || 'other';
      work.date_created_year = raw.year || raw.date_created_year;
      work.primary_image_url = raw.image || raw.primary_image_url || '';
      work.quality_tier = raw.tier || raw.quality_tier || 'skeleton';
      if (raw.ai) {
        work.glance = raw.ai.glance || null;
        work.story = raw.ai.story ? normalizeStoryObject(raw.ai.story) : null;
        work.deep_dive = raw.ai.deep_dive || raw.ai.deepDive || null;
      }
      if (raw.people && raw.people.cast) work.person_roles = transformCastToPersonRoles(raw.people.cast);
      if (raw.lineage) work.work_relations = transformLineageToWorkRelations(raw.lineage);
      if (raw.tags) work.tag_relations = transformTagsToTagRelations(raw.tags);
      if (raw.voices) work.voices = normalizeVoices(raw.voices);
      if (raw.places) work.places = normalizePlaces(raw.places);
      break;
  }

  work.person_roles = work.person_roles || [];
  work.work_relations = work.work_relations || [];
  work.tag_relations = work.tag_relations || [];
  work.places = work.places || [];
  if (work.voices === undefined) work.voices = null;

  if (!work.tags || source === 'sse_section') {
    work.tags = deriveTagsFromRelations(work.tag_relations, work.tags);
  }
  if (!work.lineage || source === 'sse_section') {
    work.lineage = deriveLineageFromRelations(work.work_relations, source !== 'sse_section' ? work.lineage : null);
  }

  ensureCanonicalTags(work);

  return work;
}

// ============================================
// PERSON IMAGE HELPER (ADR-019)
// Get person image URL with 3-level fallback chain:
// 1. person.image_url (from DB/ETL)
// 2. creatorImages.js lookup
// 3. Placeholder image
// ============================================

/**
 * Get person image URL with fallback chain (ADR-019).
 * Priority: 1. person.image_url  2. creatorImages.js  3. placeholder
 * USE CASE: Display person images on DNA graph, work detail pages
 * INTENTION: Single source of truth for person image resolution
 * VISION: Gradual migration from hardcoded images to ETL-populated DB
 * TRADE-OFF: Extra function call, but consistent behavior everywhere
 * @param {Object} person - Person object (from API, person_roles, or node data)
 * @returns {string} Image URL or placeholder
 */
// Data URI placeholder - reliable fallback that doesn't require network
var PERSON_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#2d4a3e" width="100" height="100"/><circle fill="#4a6b5d" cx="50" cy="35" r="20"/><ellipse fill="#4a6b5d" cx="50" cy="85" rx="30" ry="25"/><text x="50" y="42" text-anchor="middle" fill="#a8d4e6" font-size="24" font-family="sans-serif">?</text></svg>');

function getPersonImage(person) {
  if (!person) {
    return PERSON_PLACEHOLDER;
  }

  // 1. Direct image_url from API/ETL (highest priority)
  if (person.image_url) return person.image_url;

  // Also check imageUrl (camelCase variant from some contexts)
  if (person.imageUrl) return person.imageUrl;

  // Check nested person object (for person_roles structure)
  if (person.person && person.person.image_url) {
    return person.person.image_url;
  }

  // 2. Fallback to creatorImages.js lookup
  var personName = person.name_display || person.name || person.label || '';
  if (personName && typeof getCreatorImage === 'function') {
    var fallbackImage = getCreatorImage(personName);
    if (fallbackImage) return fallbackImage;
  }

  // 3. Placeholder
  return PERSON_PLACEHOLDER;
}

// Expose canonical shape helpers globally
window.getCreator = getCreator;
window.getTagsByType = getTagsByType;
window.getAllTags = getAllTags;
window.getInfluencedBy = getInfluencedBy;
window.getInfluences = getInfluences;
window.getTypeCategory = getTypeCategory;
window.isAiGenerated = isAiGenerated;
window.getConfidence = getConfidence;
window.getAiContent = getAiContent;
window.ensureCanonicalNarrative = ensureCanonicalNarrative;
window.ensureCanonicalTags = ensureCanonicalTags;
window.normalizeWork = normalizeWork;
window.normalizeToCanonical = normalizeToCanonical;
window.normalizeVoices = normalizeVoices;
window.normalizePlaces = normalizePlaces;
window.transformCastToPersonRoles = transformCastToPersonRoles;
window.transformLineageToWorkRelations = transformLineageToWorkRelations;
window.transformTagsToTagRelations = transformTagsToTagRelations;
window.deriveTagsFromRelations = deriveTagsFromRelations;
window.deriveLineageFromRelations = deriveLineageFromRelations;
window.mergeSseSection = mergeSseSection;
window.setNarrativeContent = setNarrativeContent;
window.getPersonImage = getPersonImage;
window.PERSON_PLACEHOLDER = PERSON_PLACEHOLDER;

// ============================================
// VAULT API LAYER
// API-backed vault with in-memory cache.
// All vault state lives in the Django DB (UserVaultEntry).
// Cache is populated on page load, sync reads use cache,
// mutations hit API then update cache.
// ============================================

let _vaultCache = null;
let _vaultCacheLoading = null;

/**
 * Load vault cache from API. Call once on page init.
 * Returns a promise that resolves when cache is ready.
 * Safe to call multiple times — deduplicates concurrent calls.
 */
async function loadVaultCache() {
  if (_vaultCache) return _vaultCache;
  if (_vaultCacheLoading) return _vaultCacheLoading;

  _vaultCacheLoading = (async () => {
    try {
      const resp = await fetch(`${API_BASE}/user/vault/?stage=all&limit=200`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      _vaultCache = {
        works: (data.works || []).map(w => ({
          ...w,
          id: w.work_id || w.id,
          loved: w.is_loved || w.stage === 'loved',
          explored: true,
        })),
        stage_counts: data.stage_counts || {},
        lastModified: new Date().toISOString(),
        syncStatus: 'api',
        version: 2,
      };
      if (DEBUG) console.log('[Vault] Loaded', _vaultCache.works.length, 'entries from API');
    } catch (e) {
      console.warn('[Vault] API load failed, falling back to empty cache:', e.message);
      _vaultCache = { works: [], stage_counts: {}, lastModified: null, syncStatus: 'error', version: 2 };
    }
    _vaultCacheLoading = null;
    return _vaultCache;
  })();

  return _vaultCacheLoading;
}

function _findInCache(workId) {
  if (!_vaultCache) return null;
  return _vaultCache.works.find(w => w.id === workId || w.work_id === workId);
}

/**
 * Get vault data (sync read from cache).
 * Same signature as the old localStorage version.
 */
function getVaultData() {
  if (_vaultCache) return _vaultCache;
  console.warn('[Vault] getVaultData() called before loadVaultCache() — auto-initializing');
  loadVaultCache();
  return { works: [], stage_counts: {}, lastModified: null, syncStatus: 'loading', version: 2 };
}

/**
 * Add a work to the vault via API.
 * Creates a vault entry at "vault" stage.
 */
function addWorkToVault(work) {
  const workId = work.id || work.work_id;
  if (!workId) return getVaultData();

  if (_findInCache(workId)) {
    if (DEBUG) console.log('[Vault] Work already in vault:', workId);
    return getVaultData();
  }

  // Optimistic cache update
  if (_vaultCache) {
    _vaultCache.works.push({
      id: workId,
      work_id: workId,
      title: work.title_display || work.title || '',
      work_type: work.work_type || work.type || 'unknown',
      year: work.date_created_year || work.year || '',
      quality_tier: work.quality_tier || 'skeleton',
      stage: 'vault',
      is_loved: false,
      loved: false,
      explored: true,
      added_at: new Date().toISOString(),
    });
  }

  // Fire-and-forget API call
  fetch(`${API_BASE}/user/vault/${workId}/stage/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage: 'vault' }),
  }).then(resp => {
    if (!resp.ok) console.error('[Vault] Failed to add work via API:', resp.status);
    else if (DEBUG) console.log('[Vault] Added work via API:', workId);
  }).catch(e => console.error('[Vault] API error adding work:', e.message));

  return getVaultData();
}

/**
 * Update a work in the vault cache.
 * For stage changes, use setVaultStage() instead.
 */
function updateWorkInVault(workId, updates) {
  const entry = _findInCache(workId);
  if (entry) {
    Object.assign(entry, updates);
    if (updates.loved === true) entry.stage = 'loved';
    if (updates.loved === false && entry.stage === 'loved') entry.stage = 'vault';
  }
  return getVaultData();
}

function removeWorkFromVault(workId) {
  if (_vaultCache) {
    _vaultCache.works = _vaultCache.works.filter(w => w.id !== workId && w.work_id !== workId);
  }
  return getVaultData();
}

function backfillVaultCanonicalIds() {
  return { updated: false, removed: 0 };
}
window.backfillVaultCanonicalIds = backfillVaultCanonicalIds;

function getVaultWorks() {
  return getVaultData().works;
}

function isInVault(workId) {
  return !!_findInCache(workId);
}

function isWorkLovedInVault(workId) {
  const entry = _findInCache(workId);
  return entry ? (entry.loved === true || entry.stage === 'loved') : false;
}

/**
 * Toggle loved status via API.
 * Toggles between 'loved' and 'vault' stages.
 */
function toggleVaultWorkLoved(workId) {
  const entry = _findInCache(workId);
  if (!entry) return null;

  const wasLoved = entry.loved === true || entry.stage === 'loved';
  const newStage = wasLoved ? 'vault' : 'loved';

  // Optimistic update
  entry.loved = !wasLoved;
  entry.is_loved = !wasLoved;
  entry.stage = newStage;
  entry.loved_at = wasLoved ? null : new Date().toISOString();

  // API call
  fetch(`${API_BASE}/user/vault/${workId}/stage/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage: newStage }),
  }).then(resp => {
    if (!resp.ok) {
      console.error('[Vault] Failed to toggle love via API:', resp.status);
      // Revert on failure
      entry.loved = wasLoved;
      entry.is_loved = wasLoved;
      entry.stage = wasLoved ? 'loved' : 'vault';
    } else if (DEBUG) {
      console.log('[Vault] Toggled love via API:', workId, '->', newStage);
    }
  }).catch(e => console.error('[Vault] API error toggling love:', e.message));

  window.dispatchEvent(new CustomEvent('vaultStageChanged', {
    detail: { workId, stage: newStage, loved: !wasLoved }
  }));

  return !wasLoved;
}

/**
 * Set vault stage for a work via API.
 * New function for the 3-stage lifecycle (discovery/vault/loved).
 */
async function setVaultStage(workId, stage) {
  if (!workId || !['discovery', 'vault', 'loved'].includes(stage)) return null;

  // Optimistic cache update
  let entry = _findInCache(workId);
  if (entry) {
    entry.stage = stage;
    entry.loved = stage === 'loved';
    entry.is_loved = stage === 'loved';
  } else if (_vaultCache) {
    entry = { id: workId, work_id: workId, stage, loved: stage === 'loved', is_loved: stage === 'loved' };
    _vaultCache.works.push(entry);
  }

  try {
    const resp = await fetch(`${API_BASE}/user/vault/${workId}/stage/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (DEBUG) console.log('[Vault] Stage set via API:', workId, '->', stage);

    window.dispatchEvent(new CustomEvent('vaultStageChanged', {
      detail: { workId, stage, loved: stage === 'loved' }
    }));

    return data;
  } catch (e) {
    console.error('[Vault] Failed to set stage:', e.message);
    return null;
  }
}

function getVaultSyncStatus() {
  const vault = getVaultData();
  return {
    syncStatus: vault.syncStatus,
    lastModified: vault.lastModified,
    workCount: vault.works.length,
  };
}

function getLovedWorks() {
  return getVaultData().works.filter(w => w.loved === true || w.stage === 'loved');
}

function getExploredOnlyWorks() {
  return getVaultData().works.filter(w => w.loved !== true && w.stage !== 'loved');
}

// ============================================
// LOCATION GATING HELPERS (ADR-030)
// Love-to-unlock system: locations visible only when work is loved
// States: hidden (not in vault) -> locked (in vault) -> unlocked (loved)
// ============================================

function isWorkLoved(workId) {
  if (!workId) return false;
  return isWorkLovedInVault(workId);
}

function getLocationVisibility(workId) {
  if (!workId) return 'hidden';
  const entry = _findInCache(workId);
  if (!entry) return 'hidden';
  if (entry.loved === true || entry.stage === 'loved') return 'unlocked';
  return 'locked';
}

function getLocationCount(work) {
  if (!work) return 0;
  return (work.places || []).length;
}

function loveWorkAndUnlock(workId, onUnlock) {
  if (!workId) return false;

  const entry = _findInCache(workId);
  if (!entry) {
    if (DEBUG) console.log('[Vault] Cannot love work not in vault:', workId);
    return false;
  }
  if (entry.loved === true || entry.stage === 'loved') {
    if (DEBUG) console.log('[Vault] Work already loved:', workId);
    return true;
  }

  // Set to loved via toggle
  toggleVaultWorkLoved(workId);

  if (typeof onUnlock === 'function') onUnlock(entry);

  window.dispatchEvent(new CustomEvent('workLoved', {
    detail: { workId, work: entry }
  }));

  return true;
}

// Expose location gating helpers globally
window.isWorkLoved = isWorkLoved;
window.getLocationVisibility = getLocationVisibility;
window.getLocationCount = getLocationCount;
window.loveWorkAndUnlock = loveWorkAndUnlock;

// Expose vault helpers globally (same signatures as old localStorage version)
window.loadVaultCache = loadVaultCache;
window.setVaultStage = setVaultStage;
window.getVaultData = getVaultData;

window.addWorkToVault = addWorkToVault;
window.updateWorkInVault = updateWorkInVault;
window.removeWorkFromVault = removeWorkFromVault;
window.getVaultWorks = getVaultWorks;
window.isInVault = isInVault;
window.isWorkLovedInVault = isWorkLovedInVault;
window.toggleVaultWorkLoved = toggleVaultWorkLoved;
window.getVaultSyncStatus = getVaultSyncStatus;
window.getLovedWorks = getLovedWorks;
window.getExploredOnlyWorks = getExploredOnlyWorks;
