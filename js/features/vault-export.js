// ========================================
// VAULT EXPORT/IMPORT UTILITY
// Obsidian-style data portability
// ========================================

// Debug flag - only log in development
const DEBUG_VAULT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Note: VAULT_STORAGE_KEY is defined in api-utils.js as 'artopath_vault'
// This constant is for export-specific storage (different purpose)
const VAULT_EXPORT_KEY = 'artopath_user_vault';
const EXPORT_VERSION = '1.0.0';
const STORAGE_UTILS = window.StorageUtils || {};
const safeParseLocalStorage = STORAGE_UTILS.safeParseLocalStorage ||
  function(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('[Vault Export] Failed to parse', key, error);
      return fallback;
    }
  };
const safeSetLocalStorage = STORAGE_UTILS.safeSetLocalStorage || null;
const notifyStorageLimit = STORAGE_UTILS.notifyStorageLimit || function() {};

function writeLocalJSON(key, value, context) {
  const payload = JSON.stringify(value);
  if (typeof safeSetLocalStorage === 'function') {
    const success = safeSetLocalStorage(key, payload, { context });
    if (!success && typeof showNotification === 'function') {
      showNotification('Storage is full. Export or clear older vault entries.', 'error');
    }
    return success;
  }
  try {
    localStorage.setItem(key, payload);
    return true;
  } catch (error) {
    console.error('[Vault Export] Failed to persist', key, error);
    if (typeof STORAGE_UTILS.isQuotaError === 'function' && STORAGE_UTILS.isQuotaError(error)) {
      notifyStorageLimit(context || key);
    }
    return false;
  }
}

// ========================================
// CORE EXPORT FUNCTIONS
// ========================================

/**
 * Export user's complete vault data as JSON
 * Includes: viewed works, ratings, notes, visited places, preferences
 */
function exportVaultData() {
  const vaultData = {
    version: EXPORT_VERSION,
    export_date: new Date().toISOString(),
    user_info: {
      export_id: generateExportId(),
      total_works: 0,
      total_places: 0
    },
    vault: {
      viewed_works: getViewedWorksData(),
      visited_places: getVisitedPlaces(),
      user_preferences: getUserPreferences(),
      work_notes: getWorkNotes()
    },
    metadata: {
      app_version: 'early-poc',
      format: 'artopath-vault-v1'
    }
  };

  // Update counts
  vaultData.user_info.total_works = vaultData.vault.viewed_works.length;
  vaultData.user_info.total_places = vaultData.vault.visited_places.length;

  return vaultData;
}

/**
 * Get all viewed works with full data
 */
function getViewedWorksData() {
  const viewedWorks = safeParseLocalStorage('artopath_viewed_works', []);
  const workRatings = safeParseLocalStorage('artopath_work_ratings', {});

  // Guard: ALL_WORKS must be available
  if (typeof ALL_WORKS === 'undefined' || !Array.isArray(ALL_WORKS)) {
    if (DEBUG_VAULT) console.warn('[Vault Export] ALL_WORKS not available');
    return [];
  }

  // Enrich viewed works with full data from ALL_WORKS
  return viewedWorks.map(workId => {
    const work = ALL_WORKS.find(w => w.id === workId);
    if (!work) return null;

    // USE CASE: Export work data for vault backup/portability
    // INTENTION: Use direct field access for consistent data access
    // NOTE: Export format uses legacy field names for backward compatibility
    // Guard: Check helper function availability
    const creator = (typeof getCreator === 'function' ? getCreator(work) : null) || work.creator;
    const typeCategory = (typeof getTypeCategory === 'function' ? getTypeCategory(work) : null) || work.type;
    const tags = (typeof getAllTags === 'function' ? getAllTags(work) : null) || work.tags || {};

    return {
      work_id: work.id,
      title: work.title_display || work.title,
      creator: creator,
      year: work.date_created_year || work.year,
      type: typeCategory,
      viewed_date: new Date().toISOString(), // Note: Currently uses export time; full view tracking requires backend
      rating: workRatings[workId] || null,
      tags: tags,
      image: work.primary_image_url || work.image,
      // Include DNA graph connections if available
      dna_connections: getDNAConnectionsForWork(workId)
    };
  }).filter(Boolean);
}

/**
 * Get DNA graph connections for a work
 */
function getDNAConnectionsForWork(workId) {
  // This is a placeholder - you'll populate this with actual DNA graph data
  // when you integrate with the DNA canvas module
  return {
    influences: [],
    adaptations: [],
    locations: [],
    collaborators: []
  };
}

/**
 * Get user preferences
 */
function getUserPreferences() {
  return {
    current_filter: localStorage.getItem('artopath_current_filter') || 'all',
    current_view: localStorage.getItem('artopath_current_view') || 'grid',
    theme: localStorage.getItem('artopath_theme') || 'default'
  };
}

/**
 * Get work notes (user annotations)
 */
function getWorkNotes() {
  return safeParseLocalStorage('artopath_work_notes', {});
}

/**
 * Generate unique export ID
 */
function generateExportId() {
  return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ========================================
// DOWNLOAD FUNCTIONS
// ========================================

/**
 * Download vault data as JSON file
 */
function downloadVaultAsJSON() {
  const vaultData = exportVaultData();
  const filename = `artopath-vault-${new Date().toISOString().split('T')[0]}.json`;

  const blob = new Blob([JSON.stringify(vaultData, null, 2)], {
    type: 'application/json'
  });

  downloadBlob(blob, filename);

  // Show success message
  showNotification(`Vault exported successfully! ${vaultData.user_info.total_works} works, ${vaultData.user_info.total_places} places.`);

  if (DEBUG_VAULT) console.log('[Vault Export]', {
    works: vaultData.user_info.total_works,
    places: vaultData.user_info.total_places,
    size: `${(blob.size / 1024).toFixed(2)} KB`
  });
}

/**
 * Download vault data as Markdown (Obsidian-compatible)
 */
function downloadVaultAsMarkdown() {
  const vaultData = exportVaultData();
  const markdown = generateMarkdownVault(vaultData);
  const filename = `artopath-vault-${new Date().toISOString().split('T')[0]}.md`;

  const blob = new Blob([markdown], { type: 'text/markdown' });
  downloadBlob(blob, filename);

  showNotification('Vault exported as Markdown!');
}

/**
 * Download vault data as CSV
 */
function downloadVaultAsCSV() {
  const vaultData = exportVaultData();
  const csv = generateCSVVault(vaultData);
  const filename = `artopath-vault-${new Date().toISOString().split('T')[0]}.csv`;

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, filename);

  showNotification('Vault exported as CSV!');
}

/**
 * Helper: Download blob as file
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ========================================
// FORMAT GENERATORS
// ========================================

/**
 * Generate Markdown format (Obsidian-compatible)
 */
function generateMarkdownVault(vaultData) {
  let md = `# Artopath Vault Export\n\n`;
  md += `**Export Date**: ${new Date(vaultData.export_date).toLocaleDateString()}\n`;
  md += `**Total Works**: ${vaultData.user_info.total_works}\n`;
  md += `**Total Places**: ${vaultData.user_info.total_places}\n\n`;
  md += `---\n\n`;

  // Viewed Works
  md += `## Viewed Works\n\n`;
  vaultData.vault.viewed_works.forEach(work => {
    const title = work.title_display || work.title;
    const creator = (typeof getCreator === 'function' ? getCreator(work) : null) || work.creator;
    const year = work.date_created_year || work.year;
    md += `### ${title}\n\n`;
    md += `**Creator**: ${creator}\n`;
    md += `**Year**: ${year}\n`;
    md += `**Type**: ${work.type}\n`;
    if (work.rating) {
      md += `**Rating**: ${'⭐'.repeat(work.rating)}\n`;
    }
    md += `**Viewed**: ${new Date(work.viewed_date).toLocaleDateString()}\n\n`;

    if (work.tags) {
      md += `**Tags**:\n`;
      if (work.tags.theme) md += `- Theme: ${work.tags.theme.join(', ')}\n`;
      if (work.tags.emotion) md += `- Emotion: ${work.tags.emotion.join(', ')}\n`;
      if (work.tags.geo) md += `- Geo: ${work.tags.geo.join(', ')}\n`;
      md += `\n`;
    }

    md += `---\n\n`;
  });

  // Visited Places
  if (vaultData.vault.visited_places.length > 0) {
    md += `## Visited Places\n\n`;
    vaultData.vault.visited_places.forEach(place => {
      md += `### ${place.title}\n\n`;
      md += `**Location**: ${place.locationName}, ${place.city}\n`;
      md += `**Visited**: ${new Date(place.visitedAt).toLocaleDateString()}\n\n`;
      md += `---\n\n`;
    });
  }

  return md;
}

/**
 * Generate CSV format
 */
function generateCSVVault(vaultData) {
  const headers = ['Title', 'Creator', 'Year', 'Type', 'Rating', 'Viewed Date', 'Theme Tags', 'Emotion Tags'];
  let csv = headers.join(',') + '\n';

  vaultData.vault.viewed_works.forEach(work => {
    const title = work.title_display || work.title;
    const creator = (typeof getCreator === 'function' ? getCreator(work) : null) || work.creator;
    const year = work.date_created_year || work.year;
    const row = [
      `"${title}"`,
      `"${creator}"`,
      year,
      work.type,
      work.rating || '',
      new Date(work.viewed_date).toLocaleDateString(),
      work.tags?.theme ? `"${work.tags.theme.join(', ')}"` : '',
      work.tags?.emotion ? `"${work.tags.emotion.join(', ')}"` : ''
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
}

// ========================================
// IMPORT FUNCTIONS
// ========================================

/**
 * Import vault data from JSON file
 */
function importVaultFromJSON(file) {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);

      // Validate format
      if (!importedData.version || !importedData.vault) {
        throw new Error('Invalid vault format');
      }

      // Merge with existing data
      mergeVaultData(importedData);

      showNotification(`Vault imported successfully! ${importedData.user_info.total_works} works, ${importedData.user_info.total_places} places.`);

      // Refresh page to show imported data
      setTimeout(() => {
        if (typeof renderWorks === 'function') {
          renderWorks(currentFilter || 'all');
        }
      }, 500);

    } catch (error) {
      console.error('[Vault Import Error]', error);
      showNotification('Import failed: Invalid file format', 'error');
    }
  };

  reader.readAsText(file);
}

/**
 * Merge imported vault data with existing data
 */
function mergeVaultData(importedData) {
  const mergeStrategy = 'keep_newer'; // Options: 'keep_newer', 'overwrite', 'keep_existing'

  // Merge viewed works
  const existingViewed = safeParseLocalStorage('artopath_viewed_works', []);
  const importedWorkIds = importedData.vault.viewed_works.map(w => w.work_id);
  const mergedViewed = [...new Set([...existingViewed, ...importedWorkIds])];
  writeLocalJSON('artopath_viewed_works', mergedViewed, 'vault-import:viewed');

  // Merge ratings
  const existingRatings = safeParseLocalStorage('artopath_work_ratings', {});
  const importedRatings = {};
  importedData.vault.viewed_works.forEach(work => {
    if (work.rating) {
      importedRatings[work.work_id] = work.rating;
    }
  });
  const mergedRatings = { ...existingRatings, ...importedRatings };
  writeLocalJSON('artopath_work_ratings', mergedRatings, 'vault-import:ratings');

  // Merge visited places
  const existingPlaces = getVisitedPlaces();
  const importedPlaces = importedData.vault.visited_places;
  const mergedPlaces = [...existingPlaces];

  importedPlaces.forEach(place => {
    if (!mergedPlaces.find(p => p.id === place.id)) {
      mergedPlaces.push(place);
    }
  });

  writeLocalJSON('artopath_visited_places', mergedPlaces, 'vault-import:places');

  // Merge preferences (overwrite with imported)
  if (importedData.vault.user_preferences) {
    Object.entries(importedData.vault.user_preferences).forEach(([key, value]) => {
      let saved = true;
      if (typeof safeSetLocalStorage === 'function') {
        saved = safeSetLocalStorage(`artopath_${key}`, value, { context: 'vault-import:preferences' });
      } else {
        try {
          localStorage.setItem(`artopath_${key}`, value);
        } catch (error) {
          saved = false;
          console.warn('[Vault Import] Failed to save preference:', key, error);
        }
      }
      if (!saved && typeof showNotification === 'function') {
        showNotification('Storage full while saving preferences. Some settings may not persist.', 'warning');
      }
    });
  }

  if (DEBUG_VAULT) console.log('[Vault Merge]', {
    works: mergedViewed.length,
    ratings: Object.keys(mergedRatings).length,
    places: mergedPlaces.length
  });

  if (typeof backfillVaultCanonicalIds === 'function') {
    try {
      backfillVaultCanonicalIds(Array.isArray(window.ALL_WORKS) ? window.ALL_WORKS : null);
    } catch (err) {
      console.warn('[Vault Merge] Canonical backfill after import failed:', err);
    }
  }
}

// ========================================
// UI HELPERS
// ========================================

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.vault-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `vault-notification vault-notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Show export modal with format options
 */
function showExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close export modal
 */
function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Trigger file input for import
 */
function triggerImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importVaultFromJSON(file);
    }
  };
  input.click();
}

// ========================================
// HELPER: Get visited places (from vault.html)
// ========================================
function getVisitedPlaces() {
  return safeParseLocalStorage('artopath_visited_places', []);
}
