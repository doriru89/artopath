/**
 * Work Enrichment Module for Artopath
 *
 * USE CASE: FAB (Floating Action Button) on work-detail page to generate AI content
 * INTENTION: Extract enrichment logic into reusable module with callback-based DOM updates
 * VISION: Enables "template first + AI generate" flow (core UX pattern per ARTOPATH_SPEC)
 * TRADE-OFF: Uses SSE streaming for live updates (per ADR-001 decision)
 *
 * This module handles:
 * 1. Content completeness checking (which sections need AI generation)
 * 2. Existing data lookup (localStorage -> API -> AI generation)
 * 3. SSE streaming AI generation with section-by-section callbacks
 * 4. Toast notifications
 *
 * Per ADR-001: FAB uses inline SSE streaming for real-time typewriter effect.
 * StreamingUI is for different purposes - do NOT merge these approaches.
 */

const WorkEnrichment = {
  // Configuration
  DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

  // State
  config: {
    workId: null,
    work: null,
    fabElement: null,
    headless: false, // Skip FAB updates (for DNA page usage)
    onSectionUpdate: null,
    onComplete: null,
    onError: null
  },

  // Active EventSource for SSE
  eventSource: null,
  connectionTimeout: null,

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize the enrichment module
   * @param {Object} options - Configuration options
   * @param {string} options.workId - Work ID (slug-based)
   * @param {Object} options.work - Current work object with existing content
   * @param {HTMLElement} options.fabElement - FAB button DOM element (optional if headless)
   * @param {boolean} options.headless - Skip FAB updates (for DNA page usage)
   * @param {Function} options.onSectionUpdate - Callback (section, content) => void
   * @param {Function} options.onComplete - Callback () => void
   * @param {Function} options.onError - Callback (error) => void
   */
  init(options) {
    if (!options.workId) {
      console.warn('[WorkEnrichment] init: missing workId');
      return false;
    }

    this.config = {
      workId: options.workId,
      work: options.work || {},
      fabElement: options.fabElement || null,
      headless: options.headless || false,
      onSectionUpdate: options.onSectionUpdate || (() => {}),
      onComplete: options.onComplete || (() => {}),
      onError: options.onError || (() => {})
    };

    if (this.DEBUG) {
      console.log('[WorkEnrichment] Initialized for work:', this.config.workId,
                  this.config.headless ? '(headless mode)' : '');
    }

    return true;
  },

  /**
   * Update the work reference (call when currentWork changes)
   * @param {Object} work - Updated work object
   */
  updateWork(work) {
    this.config.work = work || {};
    if (this.DEBUG) {
      console.log('[WorkEnrichment] Work updated:', work?.id || work?.title_display || '');
    }
  },

  // ============================================
  // CONTENT COMPLETENESS CHECK
  // ============================================

  /**
   * Check which content sections are missing and need generation
   * @param {Object} work - Work object to check (uses config.work if not provided)
   * @returns {Object} { needsGeneration: boolean, missing: string[], has: string[] }
   */
  checkContentCompleteness(work = null) {
    const w = work || this.config.work;
    if (!w) {
      return { needsGeneration: true, missing: ['all'], has: [] };
    }

    if (typeof ensureCanonicalNarrative === 'function') {
      ensureCanonicalNarrative(w);
    }
    if (typeof ensureCanonicalTags === 'function') {
      ensureCanonicalTags(w);
    }

    const getTextPresence = (value) => {
      if (!value) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'object') {
        // Narrative objects (story, deep_dive) should count if any field has text
        return Object.values(value).some(v => {
          if (typeof v === 'string') return v.trim() !== '';
          if (Array.isArray(v)) return v.length > 0;
          if (v && typeof v === 'object') {
            return Object.values(v).some(inner => typeof inner === 'string' ? inner.trim() !== '' : !!inner);
          }
          return !!v;
        });
      }
      return false;
    };

    const glanceValue = typeof getAiContent === 'function'
      ? (getAiContent(w, 'glance') ?? w.glance)
      : w.glance;
    const storyValue = typeof getAiContent === 'function'
      ? (getAiContent(w, 'story') ?? w.story)
      : w.story;
    const deepValue = typeof getAiContent === 'function'
      ? (getAiContent(w, 'deep_dive') ?? w.deep_dive)
      : w.deep_dive;
    const tagBuckets = w.tags || {};
    const tagCount = ['theme', 'emotion', 'geo', 'genre']
      .reduce((sum, type) => sum + (Array.isArray(tagBuckets[type]) ? tagBuckets[type].length : 0), 0) ||
      (Array.isArray(w.tag_relations) ? w.tag_relations.length : 0);
    const personCount = (Array.isArray(w.person_roles) ? w.person_roles.length : 0) ||
      (w.people?.cast?.length || 0);
    const lineageCount = (w.lineage?.influencedBy?.length || 0) +
      (w.lineage?.influences?.length || 0) ||
      (Array.isArray(w.work_relations) ? w.work_relations.length : 0);
    const voicesCount = (w.voices?.expert?.length || 0) +
      (w.voices?.passerby?.length || 0) +
      (w.voices?.community?.length || 0);

    const checks = {
      glance: getTextPresence(glanceValue),
      story: getTextPresence(storyValue),
      deepDive: getTextPresence(deepValue),
      lineage: lineageCount > 0,
      people: personCount > 0,
      tags: tagCount > 0,
      places: Array.isArray(w.places) && w.places.length > 0,
      voices: voicesCount > 0
    };

    const has = Object.entries(checks).filter(([, v]) => v).map(([k]) => k);
    const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
    const needsGeneration = missing.length > 0;

    if (this.DEBUG) {
      console.log('[WorkEnrichment] Content check:', { has, missing, needsGeneration });
    }

    return { needsGeneration, missing, has };
  },

  /**
   * Update FAB visibility - always show for on-demand AI enrichment
   * User can enrich any section at any time (local-first, AI on demand)
   */
  updateFabVisibility() {
    const fab = this.config.fabElement;
    if (!fab) {
      if (this.DEBUG) console.warn('[WorkEnrichment] FAB element not set');
      return;
    }

    if (!this.config.work) {
      if (this.DEBUG) console.warn('[WorkEnrichment] Work not set');
      return;
    }

    // Always show FAB - user can enrich any section on demand
    // Local data is shown first, AI enrichment is optional enhancement
    fab.style.display = 'flex';

    if (this.DEBUG) {
      const { needsGeneration, missing } = this.checkContentCompleteness();
      console.log('[WorkEnrichment] FAB visible. Missing sections:', missing);
    }
  },

  // ============================================
  // EXISTING DATA CHECK
  // ============================================

  /**
   * Check for existing data before AI generation
   * Priority: API/DB -> localStorage enrichments -> local data arrays -> AI generation
   * Per user requirement: API first, local second, AI only if nothing else exists
   * @param {string} workId - Work ID to check
   * @param {string} title - Work title for API lookup
   * @returns {Promise<{source: string, data: Object}|null>} Existing data or null
  */
  async checkExistingData(workId = null, title = null) {
    const id = workId || this.config.workId;
    const work = this.config.work || {};
    // Use canonical field directly
    const workTitle = title || work.title_display || '';
    const apiBase = window.API_BASE || '';

    // Extract disambiguation fields (use what we have, skip what we don't)
    const creator = (typeof getCreator === 'function' ? getCreator(work) : null) || work.creator || work.artist || '';
    const year = work.date_created_year || work.year || '';
    const workType = work.work_type || work.type || '';

    const normalizeAPIWork = (apiWork) => {
      if (!apiWork) return null;
      const normalized = { ...apiWork };

      // Normalize narrative fields from ai/narratives blocks
      if (typeof ensureCanonicalNarrative === 'function') {
        ensureCanonicalNarrative(normalized);
      }

      // Normalize image fields so UI can render poster/thumbnail
      const primaryImage = normalized.primary_image_url || normalized.image || normalized.image_url || '';
      normalized.primary_image_url = primaryImage;
      normalized.image = normalized.image || primaryImage;

      // Normalize tags from tag_relations (API canonical shape)
      if (!normalized.tags && Array.isArray(normalized.tag_relations)) {
        normalized.tags = {
          theme: [],
          emotion: [],
          geo: [],
          genre: []
        };
        normalized.tag_relations.forEach(rel => {
          if (rel && normalized.tags[rel.tag_type]) {
            normalized.tags[rel.tag_type].push(rel.tag_label);
          }
        });
      }

      // Normalize lineage from work_relations (API canonical shape)
      if (!normalized.lineage && Array.isArray(normalized.work_relations)) {
        const influencedBy = [];
        const influences = [];
        normalized.work_relations.forEach(rel => {
          if (!rel) return;
          const relationType = rel.relation_type || '';
          const payload = {
            id: rel.to_work?.id || null,
            title: rel.to_work?.title_display || rel.to_work?.title || '',
            relation: relationType,
            note: rel.note || '',
            confidence: rel.confidence || ''
          };
          if (relationType === 'influenced' || relationType === 'echoed_in' || relationType === 'directly_influenced') {
            influences.push(payload);
          } else {
            influencedBy.push(payload);
          }
        });
        normalized.lineage = { influencedBy, influences };
      }

      // Normalize people from person_roles (API canonical shape)
      if (!normalized.people && Array.isArray(normalized.person_roles)) {
        normalized.people = {
          cast: normalized.person_roles.map(role => ({
            id: role.person?.id || role.id || null,
            name: role.person?.name_display || role.person?.name || role.name || '',
            role: role.role_display || role.role_type || 'Creator',
            roleType: role.role_type || 'creator',
            bio: role.person?.bio_short || role.person?.bio || ''
          }))
        };
      }

      return normalized;
    };

    const hasMeaningfulContent = (workObj) => {
      if (!workObj) return false;
      // Require at least one narrative section before considering content "meaningful"
      const narrativeGlance = typeof getAiContent === 'function'
        ? (getAiContent(workObj, 'glance') || getAiContent(workObj, 'story') || getAiContent(workObj, 'deep_dive'))
        : (workObj.glance || workObj.story || workObj.deep_dive);
      if (!narrativeGlance || (typeof narrativeGlance === 'string' && narrativeGlance.trim() === '')) {
        return false;
      }

      if (typeof getAiContent === 'function') {
        if (getAiContent(workObj, 'glance')) return true;
        if (getAiContent(workObj, 'story')) return true;
        if (getAiContent(workObj, 'deep_dive')) return true;
      }
      if (workObj.glance && workObj.glance.trim?.() !== '') return true;
      if (workObj.story) return true;
      if (workObj.deep_dive) return true;
      if (workObj.lineage?.influencedBy?.length || workObj.lineage?.influences?.length) return true;
      if (Array.isArray(workObj.people?.cast) && workObj.people.cast.length > 0) return true;
      if (Array.isArray(workObj.person_roles) && workObj.person_roles.length > 0) return true;
      if (Array.isArray(workObj.places) && workObj.places.length > 0) return true;
      return false;
    };

    if (this.DEBUG) {
      console.log('[WorkEnrichment] Checking existing data for:', workTitle);
      console.log('[WorkEnrichment] Priority: API -> localStorage -> local files -> AI');
    }

    // 1a. Check API/DB by ID first (most reliable)
    if (apiBase && id) {
      try {
        const directResponse = await fetch(`${apiBase}/core/works/${encodeURIComponent(id)}/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (directResponse.ok) {
          const apiWorkRaw = await directResponse.json();
          const apiWork = normalizeAPIWork(apiWorkRaw);
          if (apiWork && hasMeaningfulContent(apiWork)) {
            if (this.DEBUG) console.log('[WorkEnrichment] Found in Core API by id');
            return { source: 'api', data: apiWork };
          }
        }
      } catch (e) {
        if (this.DEBUG) console.log('[WorkEnrichment] API ID check failed, continuing...');
      }
    }

    // 1b. Check API/DB via search when ID is missing or ID lookup returned no content
    if (apiBase && workTitle) {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('q', workTitle);
        searchParams.append('limit', '5');
        if (year) searchParams.append('year', year);
        if (workType) searchParams.append('type', workType);
        if (creator) searchParams.append('creator', creator);

        const searchUrl = `${apiBase}/core/works/?${searchParams.toString()}`;
        if (this.DEBUG) console.log('[WorkEnrichment] API search URL:', searchUrl);

        const workResponse = await fetch(searchUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (workResponse.ok) {
          const workData = await workResponse.json();
          const candidates = workData.works || workData.results || [];
          if (candidates.length > 0) {
            let bestMatch = null;
            for (const candidate of candidates) {
              const normalized = normalizeAPIWork(candidate);
              if (!hasMeaningfulContent(normalized)) continue;

              // Strict identity guard: reject candidates with different IDs
              if (id && normalized.id && normalized.id !== id) {
                console.error(
                  `[WorkEnrichment] IDENTITY MISMATCH: target=${id}, candidate=${normalized.id} ("${normalized.title_display || ''}"). Skipping.`
                );
                continue;
              }

              bestMatch = normalized;
              break;
            }

            if (bestMatch) {
              if (this.DEBUG) console.log('[WorkEnrichment] Found in Core API via search:', bestMatch.id);
              return { source: 'api', data: bestMatch };
            }
          }
        }
      } catch (e) {
        if (this.DEBUG) console.log('[WorkEnrichment] API check failed (offline?), continuing to local sources');
      }
    }

    // 2. Check localStorage enrichments via ContentPersistence
    if (typeof ContentPersistence !== 'undefined') {
      const enriched = ContentPersistence.loadFromLocal(id);
      if (enriched?.content) {
        const normalized = ContentPersistence._normalizeContentStructure
          ? ContentPersistence._normalizeContentStructure(enriched.content)
          : enriched.content;
        const hasNarrative = normalized.narratives?.glance ||
          normalized.narratives?.story ||
          normalized.narratives?.deep_dive;
        if (hasNarrative || normalized.lineage || normalized.people) {
          if (this.DEBUG) console.log('[WorkEnrichment] Found localStorage enrichment');
          return { source: 'localStorage', data: normalized };
        }
      }
    }

    // 3. Check local data.js/movies.js for full entries
    if (typeof WORKS !== 'undefined') {
      const localWork = WORKS.find(w => {
        const wTitle = w.title_display || '';
        return w.id === id || wTitle.toLowerCase() === workTitle?.toLowerCase();
      });
      if (localWork) {
        if (typeof ensureCanonicalNarrative === 'function') {
          ensureCanonicalNarrative(localWork);
        }
        if (localWork.glance) {
          if (this.DEBUG) console.log('[WorkEnrichment] Found in WORKS array');
          return { source: 'local', data: localWork };
        }
      }
    }
    if (typeof MOVIES !== 'undefined') {
      const localMovie = MOVIES.find(m => {
        const mTitle = m.title_display || '';
        return m.id === id || mTitle.toLowerCase() === workTitle?.toLowerCase();
      });
      if (localMovie) {
        if (typeof ensureCanonicalNarrative === 'function') {
          ensureCanonicalNarrative(localMovie);
        }
        if (localMovie.glance) {
          if (this.DEBUG) console.log('[WorkEnrichment] Found in MOVIES array');
          return { source: 'local', data: localMovie };
        }
      }
    }

    // 4. No existing data found - will trigger AI generation
    if (this.DEBUG) console.log('[WorkEnrichment] No existing data found, AI generation needed');
    return null;
  },

  // ============================================
  // AI GENERATION VIA SSE STREAMING
  // ============================================

  /**
   * Start generation for specific sections with a given mode
   * Called by EnrichmentSelector after user makes selections
   * @param {string} workId - Work ID to generate for
   * @param {Object} options - Generation options
   * @param {string[]} options.sections - Array of section IDs to generate
   * @param {string} options.mode - 'standard' | 'deep_research'
   * @param {boolean} options.addAIToPlaces - Whether to add AI locations on top of existing
   * @returns {Promise<boolean>} Success status
   */
  async startGeneration(workId, options = {}) {
    const sections = options.sections || [];
    const mode = options.mode || 'standard';
    const addAIToPlaces = options.addAIToPlaces || false;

    if (this.DEBUG) {
      console.log('[WorkEnrichment] startGeneration called:', { workId, sections, mode, addAIToPlaces });
    }

    // Validate we have sections to generate
    if (sections.length === 0) {
      console.warn('[WorkEnrichment] No sections specified for generation');
      return false;
    }

    // ========================================
    // 3-LAYER CHECK: Run before AI generation
    // Layer 1: API/DB, Layer 2: localStorage, Layer 3: local files
    // Only proceed to AI (Layer 4) if no existing content found
    // ========================================
    const checkingTimer = setTimeout(() => this._updateFabState('checking'), 400);

    const existingData = await this.checkExistingData(workId);
    if (existingData) {
      clearTimeout(checkingTimer);
      if (this.DEBUG) {
        console.log('[WorkEnrichment] 3-layer check found existing data from:', existingData.source);
      }

      // Populate UI with existing data for requested sections
      const data = existingData.data;
      if (typeof ensureCanonicalNarrative === 'function') {
        ensureCanonicalNarrative(data);
      }

      const narratives = data.narratives || {
        glance: typeof getAiContent === 'function' ? getAiContent(data, 'glance') : data.glance,
        story: typeof getAiContent === 'function' ? getAiContent(data, 'story') : data.story,
        deep_dive: typeof getAiContent === 'function' ? getAiContent(data, 'deep_dive') : data.deep_dive
      };

      // Only populate sections that were requested AND have data
      const requestedSet = new Set(sections);
      let populatedCount = 0;

      if (requestedSet.has('glance') && narratives?.glance) {
        this.config.onSectionUpdate('glance', narratives.glance);
        populatedCount++;
      }
      if (requestedSet.has('story') && narratives?.story) {
        this.config.onSectionUpdate('story', narratives.story);
        populatedCount++;
      }
      if ((requestedSet.has('culturalLineage') || requestedSet.has('lineage')) && data.lineage) {
        this.config.onSectionUpdate('lineage', data.lineage);
        populatedCount++;
      }
      if (requestedSet.has('people') && data.people) {
        this.config.onSectionUpdate('people', data.people);
        populatedCount++;
      }
      if (requestedSet.has('voices') && data.voices) {
        this.config.onSectionUpdate('voices', data.voices);
        populatedCount++;
      }
      if (requestedSet.has('tags') && data.tags) {
        this.config.onSectionUpdate('tags', data.tags);
        populatedCount++;
      }
      if (requestedSet.has('places') && data.places?.length > 0) {
        this.config.onSectionUpdate('places', { places: data.places, source: existingData.source });
        populatedCount++;
      }
      if ((requestedSet.has('deepDive') || requestedSet.has('deep_dive')) && narratives?.deep_dive) {
        this.config.onSectionUpdate('deepDive', narratives.deep_dive);
        populatedCount++;
      }

      // If we populated all requested sections, we're done (no AI needed)
      if (populatedCount >= sections.length) {
        if (this.DEBUG) {
          console.log(`[WorkEnrichment] All ${populatedCount} requested sections found in existing data, skipping AI`);
        }
        this._updateFabState('loaded');
        this.showToast(`Loaded from ${existingData.source}`);
        this.config.onComplete();
        return true;
      }

      // Some sections still missing - filter to only generate missing ones
      const missingSections = sections.filter(s => {
        if (s === 'glance') return !narratives?.glance;
        if (s === 'story') return !narratives?.story;
        if (s === 'culturalLineage' || s === 'lineage') return !data.lineage;
        if (s === 'people') return !data.people;
        if (s === 'voices') return !data.voices;
        if (s === 'tags') return !data.tags;
        if (s === 'places') return !data.places?.length;
        if (s === 'deepDive' || s === 'deep_dive') return !narratives?.deep_dive;
        return true; // Unknown section, generate it
      });

      if (missingSections.length === 0) {
        if (this.DEBUG) console.log('[WorkEnrichment] No missing sections after 3-layer check');
        this._updateFabState('loaded');
        this.config.onComplete();
        return true;
      }

      if (this.DEBUG) {
        console.log('[WorkEnrichment] Missing sections after 3-layer check:', missingSections);
      }
      options.sections = missingSections;
    }

    // ========================================
    // Continue to AI generation for missing sections
    // ========================================

    // Handle places section specially - use 3-layer location enrichment
    if (options.sections.includes('places')) {
      const placesResult = await this._enrichPlaces(workId, addAIToPlaces);
      if (placesResult && placesResult.places && placesResult.places.length > 0) {
        // Call callback with places data
        this.config.onSectionUpdate('places', {
          places: placesResult.places,
          source: placesResult.source,
          layer: placesResult.layer,
          badge_color: placesResult.badge_color
        });
        if (this.DEBUG) {
          console.log(`[WorkEnrichment] Places enriched from Layer ${placesResult.layer} (${placesResult.source}): ${placesResult.places.length} locations`);
        }
      }
      // Remove places from sections to avoid duplicate AI generation
      const otherSections = options.sections.filter(s => s !== 'places');
      if (otherSections.length === 0) {
        // Only places was requested, we're done
        this.config.onComplete();
        return true;
      }
      // Continue with other sections
      options.sections = otherSections;
    }

    // Map mode to depth parameter
    const depth = mode === 'deep_research' ? 'deep' : 'standard';

    // Store the sections filter for later use
    this.sectionsFilter = new Set(options.sections);

    // Call generateWithAI with the mapped depth
    return this.generateWithAI(null, { depth, sections: options.sections });
  },

  /**
   * Enrich places using the 3-layer location enrichment system
   * Layer 1: Local data (movie-geo.js, artwork-geo.js)
   * Layer 2: API/web search (Anitabi, IMDB, etc.)
   * Layer 3: AI generation (last resort)
   * @private
   */
  async _enrichPlaces(workId, addAIOnTop = false) {
    const work = this.config.work;
    if (!work) return null;

    // Layer 1: Check local geo enrichments first
    if (typeof getGeoEnrichmentsForWork === 'function') {
      const localPlaces = getGeoEnrichmentsForWork(workId);
      if (localPlaces && localPlaces.length > 0) {
        if (this.DEBUG) console.log('[WorkEnrichment] Layer 1 hit: Local geo enrichments');
        // Convert to standard places format
        const places = localPlaces.map(p => ({
          name: p.placeName || p.name,
          lat: p.lat,
          lng: p.lng,
          city: p.location,
          connection: p.connection,
          visitable: p.visitable,
          source: 'curated'
        }));
        return {
          places: places,
          source: 'curated',
          layer: 1,
          badge_color: '#2E7D32'
        };
      }
    }

    // Also check MOVIE_GEO_ENRICHMENTS for movies
    if (typeof MOVIE_GEO_ENRICHMENTS !== 'undefined') {
      const moviePlaces = [];
      Object.values(MOVIE_GEO_ENRICHMENTS).forEach(entry => {
        if (entry.movieId === workId) {
          moviePlaces.push({
            name: entry.placeName || entry.location,
            lat: entry.lat,
            lng: entry.lng,
            city: entry.location,
            connection: entry.connection,
            visitable: entry.visitable,
            source: entry.source || 'curated'
          });
        }
      });
      if (moviePlaces.length > 0) {
        if (this.DEBUG) console.log('[WorkEnrichment] Layer 1 hit: Movie geo enrichments');
        return {
          places: moviePlaces,
          source: moviePlaces[0].source,
          layer: 1,
          badge_color: '#2E7D32'
        };
      }
    }

    // Layer 2: Try API location enrichment endpoint
    const apiBase = window.API_BASE || '';
    if (apiBase) {
      try {
        // Optional: location enrichment endpoint; ignore missing endpoint or failures
        const enrichUrl = `${apiBase}/pilgrimage/locations/enrich/?work_id=${encodeURIComponent(workId)}&add_ai=${addAIOnTop}`;
        const response = await fetch(enrichUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            if (this.DEBUG) console.log(`[WorkEnrichment] Layer ${data.layer} hit: ${data.source}`);
            return data;
          }
        } else if (response.status === 404 && this.DEBUG) {
          console.log('[WorkEnrichment] Location enrichment endpoint not available, continuing to AI');
        }
      } catch (e) {
        if (this.DEBUG) console.warn('[WorkEnrichment] Location enrichment API failed:', e);
      }
    }

    // Layer 3: Let AI generation handle it (return null to let streaming continue)
    if (this.DEBUG) console.log('[WorkEnrichment] No local/API places, will use AI generation');
    return null;
  },

  /**
   * Generate content with AI using SSE streaming
   * Uses real-time token streaming per ADR-001 decision
   * @param {Function} onSectionUpdate - Override callback for section updates
   * @param {Object} options - Additional options
   * @param {string} options.depth - 'quick' | 'standard' | 'deep' (default: 'standard')
   * @param {string[]} options.sections - Optional array of section IDs to filter
   * @returns {Promise<boolean>} Success status
   */
  async generateWithAI(onSectionUpdate = null, options = {}) {
    const fab = this.config.fabElement;
    const work = this.config.work;
    const callback = onSectionUpdate || this.config.onSectionUpdate;
    const depth = options.depth || 'standard';

    if (!work) {
      console.error('[WorkEnrichment] No work configured');
      return false;
    }

    // Skip cache if forceRegenerate is set
    const forceRegenerate = options.forceRegenerate || false;

    // Try to load from ContentPersistence first (local storage sync) to render immediately
    if (!forceRegenerate && typeof ContentPersistence !== 'undefined' && work.id) {
      const persisted = ContentPersistence.loadFromLocal(work.id);
      if (persisted?.content) {
        const normalized = ContentPersistence._normalizeContentStructure
          ? ContentPersistence._normalizeContentStructure(persisted.content)
          : persisted.content;
        if (typeof ensureCanonicalNarrative === 'function') ensureCanonicalNarrative(normalized);
        if (typeof ensureCanonicalTags === 'function') ensureCanonicalTags(normalized);
        const persistedNarratives = normalized.narratives || {};
        const hasNarr = (persistedNarratives.glance && persistedNarratives.glance.trim()) ||
          (persistedNarratives.story) || (persistedNarratives.deep_dive);
        if (hasNarr) {
          callback('glance', persistedNarratives.glance);
          if (persistedNarratives.story) callback('story', persistedNarratives.story);
          if (normalized.lineage) callback('lineage', normalized.lineage);
          if (normalized.people) callback('people', normalized.people);
          if (normalized.voices) callback('voices', normalized.voices);
          if (normalized.tags) callback('tags', normalized.tags);
          if (normalized.places) callback('places', normalized.places);
          if (persistedNarratives.deep_dive) callback('deepDive', persistedNarratives.deep_dive);
          this._updateFabState('loaded');
          if (fab) fab.style.display = 'none';
          this.config.onComplete();
          return true;
        }
      }
    }

    // Update FAB to checking state
    this._updateFabState('checking');

    try {
      // DATA PRIORITY: Check for existing data first (skip if force regenerating)
      const existing = forceRegenerate ? null : await this.checkExistingData();

      // Check if specific sections were requested
      const requestedSections = options.sections || (this.sectionsFilter ? Array.from(this.sectionsFilter) : null);

      // Helper to check if existing data has a specific section
      const hasSection = (data, section) => {
        switch (section) {
          case 'lineage':
          case 'culturalLineage':
            return data.lineage && (data.lineage.influencedBy?.length > 0 || data.lineage.influences?.length > 0);
          case 'voices':
            return data.voices && (data.voices.creator?.length > 0 || data.voices.expert?.length > 0 || data.voices.passerby?.length > 0);
          case 'people':
          case 'peopleGraph':
            return (data.people?.cast?.length > 0) || (data.person_roles?.length > 0);
          case 'places':
            return data.places?.length > 0;
          case 'tags':
            return data.tags && Object.keys(data.tags).some(k => data.tags[k]?.length > 0);
          case 'glance':
          case 'whyItMatters':
            const glance = data.narratives?.glance || (typeof getAiContent === 'function' ? getAiContent(data, 'glance') : data.glance);
            return glance && glance.trim?.();
          case 'story':
            const story = data.narratives?.story || (typeof getAiContent === 'function' ? getAiContent(data, 'story') : data.story);
            return story && (typeof story === 'string' ? story.trim() : Object.keys(story).length > 0);
          case 'deepDive':
          case 'deep_dive':
          case 'observations':
            const dd = data.narratives?.deep_dive || (typeof getAiContent === 'function' ? getAiContent(data, 'deep_dive') : data.deep_dive);
            return dd && dd.trim?.();
          default:
            // Unknown section - assume missing to trigger generation
            return false;
        }
      };

      if (existing) {
        const data = existing.data;
        if (typeof ensureCanonicalNarrative === 'function') {
          ensureCanonicalNarrative(data);
        }
        if (typeof ensureCanonicalTags === 'function') {
          ensureCanonicalTags(data);
        }

        // If specific sections requested, check if they need AI generation
        let missingSections = [];
        if (requestedSections && requestedSections.length > 0) {
          missingSections = requestedSections.filter(s => !hasSection(data, s));
          if (this.DEBUG) {
            console.log('[WorkEnrichment] Requested sections:', requestedSections);
            console.log('[WorkEnrichment] Missing from existing data:', missingSections);
          }
        }

        // If all requested sections exist in cache, use cached data
        if (!requestedSections || missingSections.length === 0) {
          if (this.DEBUG) console.log('[WorkEnrichment] Using existing data from:', existing.source);
          this._updateFabState('loading-cached');

          // Call callback for each section that has data
          const narratives = data.narratives || {
            glance: typeof getAiContent === 'function' ? getAiContent(data, 'glance') : data.glance,
            story: typeof getAiContent === 'function' ? getAiContent(data, 'story') : data.story,
            deep_dive: typeof getAiContent === 'function' ? getAiContent(data, 'deep_dive') : data.deep_dive
          };
          if (narratives?.glance) callback('glance', narratives.glance);
          if (narratives?.story) callback('story', narratives.story);
          if (data.lineage) callback('lineage', data.lineage);
          if (data.people) callback('people', data.people);
          if (data.voices) callback('voices', data.voices);
          if (data.tags) callback('tags', data.tags);
          if (data.places) callback('places', data.places);
          if (narratives?.deep_dive) callback('deepDive', narratives.deep_dive);

          // Success state
          this._updateFabState('loaded');
          setTimeout(() => {
            if (fab) fab.style.display = 'none';
          }, 1500);

          this.config.onComplete();
          return true;
        }

        // Some requested sections are missing - update options to only generate those
        if (this.DEBUG) console.log('[WorkEnrichment] Will generate missing sections via AI:', missingSections);
        options.sections = missingSections;

        // First render what we have from existing data
        const narratives = data.narratives || {
          glance: typeof getAiContent === 'function' ? getAiContent(data, 'glance') : data.glance,
          story: typeof getAiContent === 'function' ? getAiContent(data, 'story') : data.story,
          deep_dive: typeof getAiContent === 'function' ? getAiContent(data, 'deep_dive') : data.deep_dive
        };
        if (narratives?.glance && !missingSections.includes('glance')) callback('glance', narratives.glance);
        if (narratives?.story && !missingSections.includes('story')) callback('story', narratives.story);
        if (data.lineage && !missingSections.includes('lineage')) callback('lineage', data.lineage);
        if (data.people && !missingSections.includes('people')) callback('people', data.people);
        if (data.voices && !missingSections.includes('voices')) callback('voices', data.voices);
        if (data.tags && !missingSections.includes('tags')) callback('tags', data.tags);
        if (data.places && !missingSections.includes('places')) callback('places', data.places);
        if (narratives?.deep_dive && !missingSections.includes('deepDive')) callback('deepDive', narratives.deep_dive);

        // Continue to AI generation for missing sections (don't return here)
      }

      // Ask user to confirm before triggering online search + AI generation
      const confirmed = await this._showConfirmModal(work);
      if (!confirmed) {
        this._updateFabState('error', 'Cancelled');
        return false;
      }

      // No existing data - proceed with AI generation
      this._updateFabState('generating');

      const apiBase = window.API_BASE || '';
      if (!apiBase) {
        console.error('[WorkEnrichment] API_BASE not configured');
        this._updateFabState('error', 'No API');
        return false;
      }

      // Build a richer search query to avoid wrong-work matches (include creator/year if present)
      const creator = (typeof getCreator === 'function' ? getCreator(work) : null) || work.creator || work.artist || '';
      const year = work.date_created_year || work.year || '';
      const workType = work.work_type || work.type || 'unknown';
      const workTitleForSearch = [work.title_display || '', creator, year].filter(Boolean).join(' ').trim();

      // Guardrail: if we have no contextual anchors, confirm before hitting AI search
      if (!creator && !year) {
        const proceed = window.confirm(`No saved content found for "${work.title_display || ''}". Continue with web search + AI generation?`);
        if (!proceed) {
          this._updateFabState('error', 'Cancelled');
          return false;
        }
      }

      // Unified streaming endpoint — pass work_id when available, fall back to search query
      const searchQuery = encodeURIComponent(workTitleForSearch || (work.title_display || ''));
      let streamUrl = `${apiBase}/stream/?q=${searchQuery}&depth=${depth}`;
      if (work.id) {
        streamUrl += `&work_id=${encodeURIComponent(work.id)}`;
      }
      if (workType) {
        streamUrl += `&type=${encodeURIComponent(workType)}`;
      }
      if (year) {
        streamUrl += `&year=${encodeURIComponent(year)}`;
      }
      if (creator) {
        streamUrl += `&creator=${encodeURIComponent(creator)}`;
      }

      // Add sections parameter if specific sections were requested
      const sections = options.sections || (this.sectionsFilter ? Array.from(this.sectionsFilter) : null);
      if (sections && sections.length > 0) {
        streamUrl += `&sections=${encodeURIComponent(sections.join(','))}`;
      }

      if (this.DEBUG) {
        console.log('[WorkEnrichment] Using depth:', depth);
        if (sections) console.log('[WorkEnrichment] Filtering sections:', sections);
      }

      if (this.DEBUG) {
        // Use canonical field for logging
        const logTitle = work.title_display || '';
        console.log('[WorkEnrichment] Starting AI generation for:', logTitle);
        console.log('[WorkEnrichment] Stream URL:', streamUrl);
      }

      // Drop the health check (endpoint not available); rely on SSE error handling instead

      // Create SSE connection
      return new Promise((resolve) => {
        this._startSSEStream(streamUrl, callback, resolve);
      });

    } catch (error) {
      console.error('[WorkEnrichment] Generation failed:', error);
      this._updateFabState('error', 'Retry');
      this.config.onError(error);
      return false;
    }
  },

  /**
   * Start SSE stream for AI generation
   * @private
   */
  _startSSEStream(streamUrl, callback, resolve) {
    // Close existing connection if any
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(streamUrl);
    const work = this.config.work;

    // Safety: close hung connections after 300s to avoid indefinite waits.
    // Full 8-section Gemini 2.5 Pro generation takes 2-4 minutes.
    // Server sends keepalive pings between sections to prevent proxy timeouts.
    const SSE_TIMEOUT_MS = 300000;
    const resetConnectionTimeout = () => {
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      this.connectionTimeout = setTimeout(() => {
        if (this.eventSource) {
          console.error('[WorkEnrichment] SSE timed out, closing connection.');
          this.eventSource.close();
          this.eventSource = null;
        }
        if (typeof window.StreamingUI !== 'undefined') {
          window.StreamingUI.hideStreamingIndicator();
        }
        this._updateFabState('error', 'Timed out');
        this.showToast('AI stream timed out. Please retry.', 'error');
        this.config.onError(new Error('SSE timed out'));
        resolve(false);
      }, SSE_TIMEOUT_MS);
    };
    resetConnectionTimeout();

    // Show streaming banner (Phase 3: replaces popup progress panel)
    if (typeof window.StreamingUI !== 'undefined') {
      window.StreamingUI.showStreamingIndicator();
    }

    // Handle seed event (initial work data)
    this.eventSource.addEventListener('seed', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.DEBUG) console.log('[WorkEnrichment] Received seed:', data);
        // Update work ID if backend provides a new one
        if (data.id && work) {
          work.backendId = data.id;
        }
      } catch (e) {
        console.error('[WorkEnrichment] Error parsing seed:', e);
      }
    });

    // Handle keepalive pings (reset timeout on each ping)
    this.eventSource.addEventListener('ping', () => {
      resetConnectionTimeout();
    });

    // Handle real-time text chunks (true token streaming for glance, deepDive)
    this.eventSource.addEventListener('text_chunk', (event) => {
      resetConnectionTimeout();
      try {
        const data = JSON.parse(event.data);
        if (typeof window.StreamingUI !== 'undefined') {
          window.StreamingUI.handleTextChunk(data);
        }
      } catch (e) {
        console.error('[WorkEnrichment] Error parsing text_chunk:', e);
      }
    });

    // Handle section events (progressive content updates)
    this.eventSource.addEventListener('section', (event) => {
      resetConnectionTimeout();
      try {
        const data = JSON.parse(event.data);
        const sectionKey = data.section === 'deep_dive' ? 'deepDive' : data.section;
        if (this.DEBUG) console.log('[WorkEnrichment] Received section:', sectionKey);

        // Update streaming banner progress
        if (typeof window.StreamingUI !== 'undefined') {
          window.StreamingUI.updateStreamingIndicator(sectionKey);
        }

        // Call the callback with section name and content
        callback(sectionKey, data.content);
        // Persist incremental content so reloads show it without a new stream
        if (this.config.work && this.config.work.id && typeof ContentPersistence !== 'undefined') {
          const payload = ContentPersistence.loadFromLocal(this.config.work.id)?.content || {};
          const narratives = payload.narratives || {};
          if (sectionKey === 'glance') narratives.glance = data.content;
          if (sectionKey === 'story') narratives.story = data.content;
          if (sectionKey === 'deepDive' || sectionKey === 'deep_dive') narratives.deep_dive = data.content;
          const merged = {
            ...payload,
            narratives,
            lineage: sectionKey === 'lineage' ? data.content : (payload.lineage || payload.culturalLineage),
            people: sectionKey === 'people' ? data.content : payload.people,
            voices: sectionKey === 'voices' ? data.content : payload.voices,
            tags: sectionKey === 'tags' ? data.content : payload.tags,
            places: sectionKey === 'places' ? data.content : payload.places,
          };
          ContentPersistence.saveToLocal(this.config.work.id, merged, {
            source_type: 'ai',
            model_version: 'streaming-gpt-4'
          });
        }

      } catch (e) {
        console.error('[WorkEnrichment] Error parsing section:', e, event.data);
      }
    });

    // Handle backend "error" SSE events (LLM/RAG failures)
    this.eventSource.addEventListener('error', (event) => {
      if (this._sseErrored) return;
      this._sseErrored = true;

      let errMessage = 'Generation failed';
      try {
        if (event?.data) {
          const data = JSON.parse(event.data);
          errMessage = data.message || errMessage;
          this._updateFabState('error', errMessage);
          this.showToast(errMessage, 'error');
        } else {
          errMessage = 'Server error';
          this._updateFabState('error', errMessage);
          this.showToast('Server error during streaming', 'error');
        }
      } catch (e) {
        this._updateFabState('error', errMessage);
      }
      // Close stream and resolve as failure
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      this.config.onError(new Error(errMessage));
      resolve(false);
    });

    // Handle completion
    this.eventSource.addEventListener('complete', async () => {
      if (this.DEBUG) console.log('[WorkEnrichment] Generation complete');
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      this.eventSource.close();
      this.eventSource = null;

      // Hide streaming banner on completion
      if (typeof window.StreamingUI !== 'undefined') {
        window.StreamingUI.hideStreamingIndicator();
      }

      // Save to persistence layer
      this._saveGeneratedContent();

      // Refresh work data from API to get updated image/metadata
      await this._refreshWorkFromAPI();

      // Ensure work is in vault as explored even when not in search mode
      if (this.config.work && this.config.work.id) {
        this._saveToVault(this.config.work);
      }

      // Update FAB state and notify
      if (this.config.fabElement) {
        this.config.fabElement.style.display = 'none';
      }
      this.showToast('Content generated and saved!');
      this.config.onComplete();
      resolve(true);
    });

    // Rely on SSE error event handler; no additional onerror hook to avoid double handling
  },

  /**
   * Save generated content to persistence layer
   * Also ensures work is added to vault so DNA/Explore pages can find it
   * @private
   */
  _saveGeneratedContent() {
    const work = this.config.work;
    if (!work || typeof ContentPersistence === 'undefined') {
      return;
    }

    const narrativePayload = {
      glance: work.glance || '',
      story: work.story || null,
      deep_dive: work.deep_dive || null
    };

    const contentToSave = {
      narratives: narrativePayload,
      lineage: work.lineage,
      places: work.places,
      people: work.people,
      voices: work.voices,
      tags: work.tags
    };

    // Save to localStorage immediately (fast, synchronous)
    ContentPersistence.saveToLocal(work.id, contentToSave, {
      source_type: 'ai',
      model_version: 'streaming-gpt-4'
    });

    // Also save/update work in vault so DNA and Explore can find it
    this._saveToVault(work);

    // Sync to backend in background (async, non-blocking)
    ContentPersistence.syncToBackend(work.id);

    if (this.DEBUG) console.log('[WorkEnrichment] Content saved to persistence layer and vault');
  },

  /**
   * Save or update work in artopath_vault
   * Ensures DNA and Explore pages can find enriched works
   * @private
   */
  _saveToVault(work) {
    if (!work || !work.id) return;

    try {
      let vault = typeof getVaultData === 'function'
        ? getVaultData().works || []
        : [];
      const existingIndex = vault.findIndex(w => w.id === work.id);

      // Read from canonical fields directly, write to legacy vault format
      // This ensures backward compatibility with existing vault data
      const titleValue = work.title_display || '';
      const titleOriginalValue = work.title_original || '';
      const imageValue = work.primary_image_url || '';
      const typeValue = work.work_type || 'unknown';
      const yearValue = work.date_created_year || '';
      const creatorValue = typeof getCreator === 'function' ? getCreator(work) : (work.creator || work.artist);

      // Build a complete work object for the vault (legacy format for compatibility)
      const vaultWork = {
        id: work.id,
        title: titleValue || work.title || '',
        titleOriginal: titleOriginalValue || work.titleOriginal || '',
        image: imageValue || work.image || '',
        type: typeValue || work.type || 'unknown',
        year: yearValue || work.year || '',
        creator: creatorValue || work.creator || work.artist || '',
        glance: work.glance || '',
        story: work.story || null,
        deep_dive: work.deep_dive || null,
        lineage: work.lineage,
        places: work.places,
        people: work.people,
        tags: work.tags,
        voices: work.voices,
        explored: true,
        // IMPORTANT: Don't default loved to false here - preserve from existing vault entry
        savedAt: Date.now(),
        source: 'ai-enriched'
      };

      if (existingIndex >= 0) {
        // Update existing entry - preserve user's loved/explored status
        // User flow: searched -> explored -> loved (one-way progression)
        var existingEntry = vault[existingIndex];
        vault[existingIndex] = {
          ...existingEntry,
          ...vaultWork,
          // CRITICAL: Preserve user status - AI enrichment should not change these
          explored: true,
          exploredAt: existingEntry.exploredAt || new Date().toISOString(),
          loved: existingEntry.loved === true ? true : (work.loved || false),
          lovedAt: existingEntry.lovedAt || (existingEntry.loved ? existingEntry.lovedAt : (work.loved ? new Date().toISOString() : null))
        };
      } else {
        // Add new entry - default to explored but not loved
        vaultWork.explored = work.explored !== false ? true : false;
        vaultWork.exploredAt = new Date().toISOString();
        vaultWork.loved = work.loved || false;
        vaultWork.lovedAt = work.loved ? new Date().toISOString() : null;
        vault.push(vaultWork);
      }

      if (this.DEBUG) console.log('[WorkEnrichment] Saved to vault:', work.id);
    } catch (e) {
      console.error('[WorkEnrichment] Failed to save to vault:', e);
    }
  },

  /**
   * Refresh work data from API to get updated fields (image, creator, etc.)
   * Called after SSE completion to ensure vault has latest enriched data
   * USE CASE: After ingestion, backend may have added image/creator via ETL
   * INTENTION: Keep vault and explored tab in sync with backend enrichments
   * VISION: Frontend reflects all backend enrichments automatically
   * TRADE-OFF: Extra API call but ensures data consistency
   * @private
   */
  async _refreshWorkFromAPI() {
    const work = this.config.work;
    const workId = this.config.workId;

    if (!workId || !work) {
      if (this.DEBUG) console.log('[WorkEnrichment] No work to refresh');
      return;
    }

    const apiBase = window.API_BASE || '';
    if (!apiBase) {
      if (this.DEBUG) console.log('[WorkEnrichment] No API_BASE configured, skipping refresh');
      return;
    }

    try {
      if (this.DEBUG) console.log('[WorkEnrichment] Refreshing work data from API:', workId);

      const response = await fetch(`${apiBase}/core/works/${encodeURIComponent(workId)}/`);

      if (!response.ok) {
        if (this.DEBUG) console.log('[WorkEnrichment] API refresh failed:', response.status);
        return;
      }

      const freshWork = await response.json();

      // Extract updated fields (image is the critical one)
      const updatedFields = {
        image: freshWork.primary_image_url || freshWork.image || null,
        creator: typeof getCreator === 'function' ? getCreator(freshWork) : (freshWork.creator || null),
        year: freshWork.date_created_year || freshWork.year || null,
        type: freshWork.work_type || freshWork.type || null
      };

      if (this.DEBUG) {
        console.log('[WorkEnrichment] Image updated:', updatedFields.image || '(none)');
        console.log('[WorkEnrichment] Creator updated:', updatedFields.creator || '(none)');
      }

      // Update vault with fresh metadata
      if (typeof updateWorkInVault === 'function') {
        updateWorkInVault(workId, updatedFields);

        if (this.DEBUG) console.log('[WorkEnrichment] Vault updated with fresh API data');

        // Dispatch event so vault.html can refresh the UI
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('workMetadataUpdated', {
            detail: { workId, fields: updatedFields }
          }));
        }
      }

      // Invalidate API cache so next vault load gets fresh data
      if (typeof invalidateAPICache === 'function') {
        invalidateAPICache();
        if (this.DEBUG) console.log('[WorkEnrichment] API cache invalidated');
      }

    } catch (error) {
      // Non-critical error - don't break the flow
      console.warn('[WorkEnrichment] Failed to refresh work data:', error);
    } finally {
      // Ensure work is in vault as explored, even outside search mode
      if (work && typeof this._saveToVault === 'function') {
        this._saveToVault(work);
      }
    }
  },

  // ============================================
  // FAB STATE MANAGEMENT
  // ============================================

  /**
   * Update FAB visual state
   * @private
   * @param {string} state - checking | loading-cached | generating | loaded | error
   * @param {string} errorMessage - Optional error message for error state
   */
  _updateFabState(state, errorMessage = '') {
    // Skip FAB updates in headless mode (DNA page)
    if (this.config.headless) return;

    // Skip "checking" state when streaming is active — streaming supersedes cache
    if (state === 'checking' && typeof StreamingUI !== 'undefined' && StreamingUI.isStreaming) return;

    const fab = this.config.fabElement;
    if (!fab) return;

    const states = {
      'checking': {
        class: 'fab-generating',
        icon: '&#x1F50D;', // magnifying glass
        text: 'Checking...'
      },
      'loading-cached': {
        class: 'fab-generating',
        icon: '&#x1F4E6;', // package
        text: 'Loading cached...'
      },
      'generating': {
        class: 'fab-generating',
        icon: '&#x23F3;', // hourglass
        text: 'Generating...'
      },
      'loaded': {
        class: '',
        icon: '&#x2713;', // checkmark
        text: 'Loaded!'
      },
      'error': {
        class: '',
        icon: '&#x26A0;', // warning
        text: errorMessage || 'Error'
      }
    };

    const s = states[state] || states['error'];

    // Toggle generating class
    if (s.class) {
      fab.classList.add('fab-generating');
    } else {
      fab.classList.remove('fab-generating');
    }

    fab.innerHTML = `<span class="fab-icon">${s.icon}</span><span class="fab-text">${s.text}</span>`;
  },

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Notification type (default: 'success')
   */
  showToast(message, type = 'success') {
    // Remove existing toast if any
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--forest-mid);
      color: var(--text-light);
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 0.9rem;
      z-index: 1001;
      animation: toast-in 0.3s ease;
    `;

    // Ensure toast animations are available
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // ============================================
  // REGENERATION (Wrong Work Correction)
  // ============================================

  /**
   * Show the "Wrong work generated?" button
   * Called after AI content is generated
   */
  showWrongWorkButton: function() {
    var container = document.getElementById('wrongWorkContainer');
    if (container) {
      container.style.display = 'block';
    }
  },

  /**
   * Show regeneration panel
   */
  showRegenerationPanel: function() {
    var overlay = document.getElementById('regenerationOverlay');
    var panel = document.getElementById('regenerationPanel');

    if (overlay) {
      overlay.style.display = 'block';
    }

    if (panel) {
      panel.style.display = 'block';
    }

    // Close on Escape key
    var self = this;
    var escapeHandler = function(e) {
      if (e.key === 'Escape') {
        self.hideRegenerationPanel();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    this._escapeHandler = escapeHandler;

    if (this.DEBUG) {
      console.log('[WorkEnrichment] Showing regeneration panel');
    }
  },

  /**
   * Hide regeneration panel
   */
  hideRegenerationPanel: function() {
    var overlay = document.getElementById('regenerationOverlay');
    var panel = document.getElementById('regenerationPanel');

    if (overlay) {
      overlay.style.display = 'none';
    }

    if (panel) {
      panel.style.display = 'none';
    }

    // Clean up escape handler
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
      this._escapeHandler = null;
    }
  },

  /**
   * Regenerate a single section
   * @param {string} sectionName - The section to regenerate (glance, story, deepDive, etc.)
   */
  regenerateSection: function(sectionName) {
    // Get current work info from page
    var workTitle = document.querySelector('.work-title')?.textContent || '';
    var workYear = document.querySelector('.work-year')?.textContent || '';
    var workType = window.currentWorkType || window.currentWork?.type || 'movie';
    // Prefer canonical creator for stronger disambiguation
    var workCreator = typeof getCreator === 'function'
      ? (getCreator(window.currentWork) || '')
      : (window.currentWork?.creator || window.currentWork?.artist || '');

    if (this.DEBUG) {
      console.log('[WorkEnrichment] Regenerating ' + sectionName + ' for: ' + workTitle + ' (' + workYear + ') [' + workType + ']');
    }

    // Show loading state for this section
    var sectionElement = document.querySelector('[data-section="' + sectionName + '"]');
    if (sectionElement) {
      sectionElement.classList.add('regenerating');
    }

    // Call the API to regenerate this section
    var apiBase = window.API_BASE || 'http://localhost:8000/api';
    var self = this;

    fetch(apiBase + '/regenerate-section/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        section: sectionName,
        title: workTitle,
        year: workYear,
        type: workType,
        creator: workCreator,
        force_regenerate: true
      })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.content) {
        self.updateSectionContent(sectionName, data.content);
        self.showToast('Section regenerated successfully!');
      }
      if (sectionElement) {
        sectionElement.classList.remove('regenerating');
      }
    })
    .catch(function(error) {
      console.error('[WorkEnrichment] Error regenerating ' + sectionName + ':', error);
      self.showToast('Failed to regenerate section', 'error');
      if (sectionElement) {
        sectionElement.classList.remove('regenerating');
      }
    });
  },

  /**
   * Regenerate all selected sections
   */
  regenerateSelected: function() {
    var checkboxes = document.querySelectorAll('.regeneration-section input[type="checkbox"]:checked');
    var sections = Array.from(checkboxes).map(function(cb) {
      return cb.value;
    });

    if (sections.length === 0) {
      this.showToast('Please select at least one section to regenerate', 'warning');
      return;
    }

    if (this.DEBUG) {
      console.log('[WorkEnrichment] Regenerating selected sections:', sections);
    }

    // Regenerate each selected section
    var self = this;
    sections.forEach(function(section) {
      self.regenerateSection(section);
    });

    this.hideRegenerationPanel();
  },

  /**
   * Update section content after regeneration
   * @param {string} sectionName - The section name
   * @param {string|object} content - The new content
   */
  updateSectionContent: function(sectionName, content) {
    var sectionMap = {
      'glance': '#workGlance',
      'story': '#storyContent',
      'deepDive': '#deepTabDeepDive',
      'peopleGraph': '#peopleGrid',
      'culturalLineage': '#deepTabCultural',
      'places': '#deepTabPlaces',
      'voices': '#deepTabVoices'
    };

    var selector = sectionMap[sectionName];
    if (selector) {
      var element = document.querySelector(selector);
      if (element) {
        if (typeof content === 'string') {
          element.textContent = content;
        } else {
          // Handle structured content (e.g., peopleGraph, places)
          element.innerHTML = this.formatSectionContent(sectionName, content);
        }
      }
    }
  },

  /**
   * Format structured content for a section
   * @param {string} sectionName - The section name
   * @param {object} content - The content object
   * @returns {string} HTML string
   */
  formatSectionContent: function(sectionName, content) {
    // Basic formatting for structured content
    // More sophisticated rendering can be added as needed
    if (typeof content === 'string') {
      return this.escapeHtml(content);
    }
    return '<pre>' + this.escapeHtml(JSON.stringify(content, null, 2)) + '</pre>';
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml: function(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ============================================
  // CLEANUP
  // ============================================

  /**
   * Clean up resources (call on page unload or work change)
   */
  destroy() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.config = {
      workId: null,
      work: null,
      fabElement: null,
      onSectionUpdate: () => {},
      onComplete: () => {},
      onError: () => {}
    };
    if (this.DEBUG) console.log('[WorkEnrichment] Destroyed');
  },

  /**
   * Show confirmation modal before AI generation with key work metadata
   * @private
   * @param {Object} work
   * @returns {Promise<boolean>}
   */
  _showConfirmModal(work) {
    return new Promise((resolve) => {
      const existing = document.getElementById('aiConfirmOverlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'aiConfirmOverlay';
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;

      const modal = document.createElement('div');
      modal.style.cssText = `
        background: #10241c;
        color: #e6f4ee;
        padding: 24px;
        border-radius: 12px;
        width: min(420px, 90%);
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        border: 1px solid #214434;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;

      const title = document.createElement('div');
      title.textContent = 'Confirm AI Generation';
      title.style.cssText = 'font-size: 1.1rem; font-weight: 600; margin-bottom: 12px;';

      const metaList = document.createElement('div');
      metaList.style.cssText = 'display: grid; row-gap: 6px; font-size: 0.95rem;';
      const creator = (typeof getCreator === 'function' ? getCreator(work) : null) || work.creator || work.artist || 'Unknown';
      const rows = [
        ['Title', work.title_display || work.title || ''],
        ['Type', work.work_type || work.type || ''],
        ['Year', work.date_created_year || work.year || 'Unknown'],
        ['Creator', creator || 'Unknown']
      ];
      rows.forEach(([label, value]) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:space-between; gap:12px; align-items:center;';
        const l = document.createElement('span');
        l.textContent = label;
        l.style.cssText = 'color:#8fb7a5; font-weight:500;';
        const v = document.createElement('span');
        v.textContent = value || 'Unknown';
        v.style.cssText = 'color:#e6f4ee; text-align:right;';
        row.appendChild(l);
        row.appendChild(v);
        metaList.appendChild(row);
      });

      const warning = document.createElement('div');
      warning.textContent = 'Verify this matches the work you expect. AI will search online if local data is missing.';
      warning.style.cssText = 'margin:12px 0 16px; font-size:0.9rem; color:#f9d47c;';

      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex; justify-content:flex-end; gap:10px;';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.cssText = `
        background: transparent;
        color: #e6f4ee;
        border: 1px solid #2f4f40;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
      `;

      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Generate';
      confirmBtn.style.cssText = `
        background: linear-gradient(135deg, #3aa374, #2c7a55);
        color: #0b1a13;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      `;

      const cleanup = (answer) => {
        overlay.remove();
        resolve(answer);
      };

      cancelBtn.onclick = () => cleanup(false);
      confirmBtn.onclick = () => cleanup(true);
      overlay.onclick = (e) => {
        if (e.target === overlay) cleanup(false);
      };
      document.addEventListener('keydown', function escHandler(evt) {
        if (evt.key === 'Escape') {
          document.removeEventListener('keydown', escHandler);
          cleanup(false);
        }
      });

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);
      modal.appendChild(title);
      modal.appendChild(metaList);
      modal.appendChild(warning);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    });
  }
};

// Expose globally (per early-poc pattern - no ES6 modules)
window.WorkEnrichment = WorkEnrichment;
