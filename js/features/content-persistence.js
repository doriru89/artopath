/**
 * Content Persistence Module for Artopath
 *
 * Handles dual-storage persistence of AI-generated content:
 * 1. localStorage for immediate persistence (fast, offline)
 * 2. Backend API sync for cross-device persistence
 *
 * Per ARTOPATH_SPEC.md §1.2: "AI-generated content: localStorage → Django API"
 * Per ARTOPATH_SPEC.md §3.4: All AI content must include source_type and model_version
 */

const STORAGE_HELPERS = window.StorageUtils || {};
const safeParseLocalStorage = STORAGE_HELPERS.safeParseLocalStorage ||
  function(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('[ContentPersistence] Failed to parse localStorage key:', key, error);
      return fallback;
    }
  };
const notifyStorageLimit = STORAGE_HELPERS.notifyStorageLimit || function() {};
const safeSetLocalStorage = STORAGE_HELPERS.safeSetLocalStorage || null;
const isQuotaError = STORAGE_HELPERS.isQuotaError || function(error) {
  return error?.name === 'QuotaExceededError';
};

const ContentPersistence = {
  STORAGE_PREFIX: 'artopath_generated_',
  SCHEMA_VERSION: 1,
  DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

  _normalizeContentStructure(content = {}) {
    const narrativeSource = content.narratives || content.ai || {};
    const normalizedNarratives = {
      glance: narrativeSource.glance || '',
      story: narrativeSource.story || null,
      deep_dive: narrativeSource.deep_dive ?? narrativeSource.deepDive ?? null
    };
    return {
      ...content,
      narratives: normalizedNarratives
    };
  },

  // ============================================
  // LOCAL STORAGE OPERATIONS
  // ============================================

  /**
   * Save generated content to localStorage
   * @param {string} workId - Work ID (slug-based)
   * @param {Object} content - Generated content (ai, lineage, places, people, voices, tags)
   * @param {Object} attribution - AI attribution (source_type, model_version)
   */
  saveToLocal(workId, content, attribution = {}) {
    if (!workId || !content) {
      console.warn('[ContentPersistence] saveToLocal: missing workId or content');
      return false;
    }

    const key = this.STORAGE_PREFIX + workId;
    const normalizedContent = this._normalizeContentStructure(content);
    const data = {
      version: this.SCHEMA_VERSION,
      workId: workId,
      generatedAt: Date.now(),
      syncStatus: 'pending',
      syncedAt: null,
      attribution: {
        source_type: attribution.source_type || 'ai',
        model_version: attribution.model_version || 'streaming-gpt-4',
        generated_at: attribution.generated_at || new Date().toISOString()
      },
      content: normalizedContent
    };

    const payload = JSON.stringify(data);
    const writeToLocalStorage = () => {
      if (typeof safeSetLocalStorage === 'function') {
        return safeSetLocalStorage(key, payload, { context: 'content-persistence' });
      }
      localStorage.setItem(key, payload);
      return true;
    };

    try {
      if (writeToLocalStorage()) {
        if (this.DEBUG) console.log('[ContentPersistence] Saved to localStorage:', workId);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[ContentPersistence] localStorage save failed:', e);
      if (isQuotaError(e)) {
        this.cleanupOldEntries();
        try {
          if (writeToLocalStorage()) {
            return true;
          }
        } catch (retryError) {
          console.error('[ContentPersistence] Still failed after cleanup:', retryError);
        }
        notifyStorageLimit('content-persistence');
        if (typeof showNotification === 'function') {
          showNotification('Save failed — storage is full. Export or remove older works.', 'error');
        }
        this.showQuotaWarning();
      }
      return false;
    }
  },

  /**
   * Load generated content from localStorage
   * @param {string} workId - Work ID
   * @returns {Object|null} Stored data or null
   */
  loadFromLocal(workId) {
    if (!workId) return null;

    const key = this.STORAGE_PREFIX + workId;
    try {
      const data = safeParseLocalStorage
        ? safeParseLocalStorage(key, null)
        : JSON.parse(localStorage.getItem(key) || 'null');

      if (!data) return null;

      // Validate schema version
      if (data.version !== this.SCHEMA_VERSION) {
        if (this.DEBUG) console.log('[ContentPersistence] Schema mismatch, clearing:', workId);
        localStorage.removeItem(key);
        return null;
      }

      data.content = this._normalizeContentStructure(data.content);
      if (this.DEBUG) console.log('[ContentPersistence] Loaded from localStorage:', workId);
      return data;
    } catch (e) {
      console.error('[ContentPersistence] localStorage load failed:', e);
      return null;
    }
  },

  /**
   * Check if content exists in localStorage
   * @param {string} workId - Work ID
   * @returns {boolean}
   */
  hasLocalContent(workId) {
    if (!workId) return false;
    const key = this.STORAGE_PREFIX + workId;
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get all enriched works from localStorage
   * Used by DNA page to include localStorage-enriched lineage/people data
   * @returns {Array} Array of enriched content objects with workId and content
   */
  getAllEnrichedWorks() {
    const enrichedWorks = [];
    const prefix = this.STORAGE_PREFIX;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const data = safeParseLocalStorage
            ? safeParseLocalStorage(key, null)
            : JSON.parse(localStorage.getItem(key) || 'null');
          if (data && data.content) {
            // Extract lineage data (use 'lineage' or 'culturalLineage')
            const lineage = data.content.lineage || data.content.culturalLineage;
            const people = data.content.people || data.content.peopleGraph;

            enrichedWorks.push({
              workId: data.workId,
              lineage: lineage,
              people: people,
              tags: data.content.tags,
              generatedAt: data.generatedAt
            });
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    }

    if (this.DEBUG) console.log('[ContentPersistence] Found', enrichedWorks.length, 'enriched works in localStorage');
    return enrichedWorks;
  },

  /**
   * Mark content as synced to backend
   * @param {string} workId - Work ID
   * @param {string} backendId - Backend ID if different from workId
   */
  markSynced(workId, backendId = null) {
    const data = this.loadFromLocal(workId);
    if (data) {
      data.syncStatus = 'synced';
      data.syncedAt = Date.now();
      if (backendId) data.backendId = backendId;

      const key = this.STORAGE_PREFIX + workId;
      const payload = JSON.stringify(data);
      if (typeof safeSetLocalStorage === 'function') {
        safeSetLocalStorage(key, payload, { context: 'content-persistence-sync' });
      } else {
        localStorage.setItem(key, payload);
      }
      if (this.DEBUG) console.log('[ContentPersistence] Marked synced:', workId);
    }
  },

  /**
   * Mark sync as failed for retry
   * @param {string} workId - Work ID
   * @param {string} error - Error message
   */
  markSyncFailed(workId, error) {
    const data = this.loadFromLocal(workId);
    if (data) {
      data.syncStatus = 'failed';
      data.syncError = error;
      data.syncAttempts = (data.syncAttempts || 0) + 1;

      const key = this.STORAGE_PREFIX + workId;
      const payload = JSON.stringify(data);
      if (typeof safeSetLocalStorage === 'function') {
        safeSetLocalStorage(key, payload, { context: 'content-persistence-sync-failed' });
      } else {
        localStorage.setItem(key, payload);
      }
      if (this.DEBUG) console.log('[ContentPersistence] Marked sync failed:', workId, error);
    }
  },

  /**
   * Cleanup old entries to free storage
   * USE CASE: Prune localStorage to prevent bloat from unloved/old generated content
   * INTENTION: Keep storage clean while preserving recent exploration cache
   *
   * Cleans up entries that are:
   * 1. Synced and older than 7 days (backend has it, local cache unnecessary)
   * 2. Pending/failed sync and older than 7 days (user never loved it)
   * 3. Invalid/corrupted entries
   */
  cleanupOldEntries() {
    const maxAgeSynced = 30 * 24 * 60 * 60 * 1000; // 30 days for synced (reduce data loss)
    const maxAgePending = 7 * 24 * 60 * 60 * 1000; // 7 days for pending
    const now = Date.now();
    let cleaned = 0;

    // Build list of keys to check (can't modify during iteration)
    const keysToCheck = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX)) {
        keysToCheck.push(key);
      }
    }

    for (const key of keysToCheck) {
      try {
        const data = safeParseLocalStorage
          ? safeParseLocalStorage(key, null)
          : JSON.parse(localStorage.getItem(key) || 'null');

        if (!data || !data.generatedAt) {
          // Invalid entry, remove it
          localStorage.removeItem(key);
          cleaned++;
          continue;
        }

        const age = now - data.generatedAt;

        // Clean up if:
        // 1. Synced and older than 30 days (backend has it, longer TTL)
        // 2. Never synced (pending) and older than 7 days (user abandoned it)
        const threshold = data.syncStatus === 'synced' ? maxAgeSynced : maxAgePending;
        if (age > threshold) {
          if (data.syncStatus === 'synced' || data.syncStatus === 'pending' || !data.syncStatus) {
            localStorage.removeItem(key);
            cleaned++;
            if (this.DEBUG) console.log('[ContentPersistence] Cleaned up old entry:', key, `(${data.syncStatus}, ${Math.round(age / 86400000)} days old)`);
          }
        }
      } catch (e) {
        // Invalid entry, remove it
        localStorage.removeItem(key);
        cleaned++;
      }
    }

    if (cleaned > 0 && this.DEBUG) {
      console.log('[ContentPersistence] Cleanup complete:', cleaned, 'entries removed');
    }
    return cleaned;
  },

  /**
   * Show user warning when storage quota is exceeded
   * USE CASE: User has too much AI-generated content stored locally
   * INTENTION: Inform user gracefully without breaking the app
   */
  showQuotaWarning() {
    // Prevent duplicate warnings
    if (document.querySelector('.quota-warning-toast')) return;

    const toast = document.createElement('div');
    toast.className = 'quota-warning-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(180, 83, 9, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 0.9rem;
      z-index: 10000;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    `;
    toast.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px;">Storage Full</div>
      <div style="opacity: 0.9;">Your browser storage is full. Some AI content may not be saved. Try exporting your vault or clearing old data.</div>
    `;

    // Add animation keyframes if not present
    if (!document.getElementById('quotaWarningStyles')) {
      const style = document.createElement('style');
      style.id = 'quotaWarningStyles';
      style.textContent = `
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      toast.style.animation = 'slideUp 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 6000);
  },

  // ============================================
  // BACKEND SYNC OPERATIONS
  // ============================================

  /**
   * Sync content to backend API with exponential backoff retry
   * USE CASE: Sync AI-generated content to backend after local save
   * INTENTION: Reliable sync with automatic retry on transient failures
   * VISION: Offline-first persistence that gracefully handles network issues
   * TRADE-OFF: Added complexity for better reliability
   * @param {string} workId - Work ID
   * @param {number} maxRetries - Max retry attempts (default 3)
   * @returns {Promise<boolean>} Success status
   */
  async syncToBackend(workId, maxRetries = 3) {
    const data = this.loadFromLocal(workId);
    if (!data) {
      console.warn('[ContentPersistence] No local data to sync:', workId);
      return false;
    }

    // Skip if already synced
    if (data.syncStatus === 'synced') {
      if (this.DEBUG) console.log('[ContentPersistence] Already synced:', workId);
      return true;
    }

    // Legacy failed entries: _performSync is now a no-op (server-side save),
    // so clear stale failure state from previous sync implementation
    if (data.syncAttempts >= 5) {
      data.syncAttempts = 0;
      data.syncStatus = 'pending';
      this.saveToLocal(workId, data.content, data);
    }

    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const success = await this._performSync(workId, data);
        if (success) {
          // Clear from pending syncs queue if it was there
          this._removeFromPendingQueue(workId);
          return true;
        }

        // If sync returned false but didn't throw, treat as non-retryable error
        if (attempt === maxRetries) {
          this._addToPendingQueue(workId, data);
          return false;
        }
      } catch (error) {
        if (attempt === maxRetries) {
          console.error('[ContentPersistence] Max retries reached, marking as pending:', workId, error);
          this.markSyncFailed(workId, error.message);
          this._addToPendingQueue(workId, data);
          return false;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`[ContentPersistence] Retry ${attempt + 1}/${maxRetries} in ${delay}ms for ${workId}:`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return false;
  },

  /**
   * Perform the actual sync operation (separated for retry logic)
   * @param {string} workId - Work ID
   * @param {Object} data - Local data to sync
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async _performSync(workId, _data) {
    // Content is now saved server-side during SSE streaming via ContentSaver.
    // Frontend POST to /save-generated/ has been removed — this is a no-op.
    this.markSynced(workId, null);
    if (this.DEBUG) console.log('[ContentPersistence] Server-side save (no frontend POST needed):', workId);
    return true;
  },

  /**
   * Load content from backend API
   * @param {string} workId - Work ID
   * @returns {Promise<Object|null>} Backend data or null
   */
  async loadFromBackend(workId) {
    if (!workId) return null;

    const apiBase = window.API_BASE || 'http://localhost:8000/api';
    const url = `${apiBase}/core/works/${workId}/`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (this.DEBUG) console.log('[ContentPersistence] Backend load failed:', response.status);
        return null;
      }

      const work = await response.json();

      // Use SSOT normalizer instead of weak ensureCanonical helpers
      const normalized = typeof normalizeToCanonical === 'function'
        ? normalizeToCanonical(work, 'api')
        : work;

      const narratives = {
        glance: normalized.glance || '',
        story: normalized.story || null,
        deep_dive: normalized.deep_dive || null
      };

      const hasNarrative =
        !!(narratives.glance && narratives.glance.trim?.() !== '') ||
        !!narratives.story ||
        !!narratives.deep_dive;

      if (hasNarrative || normalized.lineage || normalized.places?.length > 0) {
        if (this.DEBUG) console.log('[ContentPersistence] Loaded from backend:', workId);
        return {
          workId: workId,
          content: this._normalizeContentStructure({
            narratives,
            lineage: normalized.lineage,
            places: normalized.places,
            people: normalized.people,
            voices: normalized.voices,
            tags: normalized.tags
          })
        };
      }

      return null;
    } catch (e) {
      console.error('[ContentPersistence] Backend load failed:', e);
      return null;
    }
  },

  // ============================================
  // COMBINED LOADING
  // ============================================

  /**
   * Load content with priority: localStorage → backend → null
   * @param {string} workId - Work ID
   * @returns {Promise<Object|null>} Content data with source info
   */
  async loadContent(workId) {
    // 1. Check localStorage first (fast, works offline)
    const localData = this.loadFromLocal(workId);

    // 2. Check backend (parallel for performance, but we wait)
    let backendData = null;
    try {
      backendData = await this.loadFromBackend(workId);
    } catch (e) {
      // Ignore backend errors, use local
    }

    // 3. Conflict resolution
    if (localData && backendData) {
      // Local has pending changes -> use local
      if (localData.syncStatus === 'pending') {
        return { data: localData, source: 'local', needsSync: true };
      }
      // Both synced -> use backend as source of truth
      return { data: backendData, source: 'backend', needsSync: false };
    }

    // Return whichever exists
    if (localData) {
      return { data: localData, source: 'local', needsSync: localData.syncStatus !== 'synced' };
    }

    if (backendData) {
      // Cache backend data to localStorage for offline access
      this.saveToLocal(workId, backendData.content, { source_type: 'ai' });
      this.markSynced(workId);
      return { data: backendData, source: 'backend', needsSync: false };
    }

    return null; // No content anywhere
  },

  /**
   * Get all works with pending syncs
   * @returns {string[]} Array of workIds needing sync
   */
  getPendingSyncs() {
    const pending = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX)) {
        try {
          const data = safeParseLocalStorage
            ? safeParseLocalStorage(key, null)
            : JSON.parse(localStorage.getItem(key) || 'null');
          if (data.syncStatus === 'pending' || data.syncStatus === 'failed') {
            pending.push(data.workId);
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    }
    return pending;
  },

  /**
   * Retry all pending syncs (includes both localStorage and pending queue)
   * USE CASE: Process failed syncs when network comes back online
   * INTENTION: Automatic background sync recovery
   * @returns {Promise<number>} Count of successful syncs
   */
  async retryPendingSyncs() {
    // Get pending from localStorage (old approach)
    const localStoragePending = this.getPendingSyncs();

    // Get pending from queue (new approach with exponential backoff tracking)
    const queuePending = this._getPendingQueueWorkIds();

    // Combine and deduplicate
    const allPending = [...new Set([...localStoragePending, ...queuePending])];

    if (allPending.length === 0) return 0;

    if (this.DEBUG) console.log('[ContentPersistence] Retrying pending syncs:', allPending.length);

    let successCount = 0;
    for (const workId of allPending) {
      // Use fewer retries for background sync (2 instead of 3)
      const success = await this.syncToBackend(workId, 2);
      if (success) successCount++;
    }

    if (this.DEBUG) console.log('[ContentPersistence] Sync retry complete:', successCount, '/', allPending.length);
    return successCount;
  },

  // ============================================
  // PENDING SYNC QUEUE MANAGEMENT
  // ============================================

  /**
   * Add work to pending sync queue
   * USE CASE: Network failure during sync, queue for retry when online
   * INTENTION: Track failed syncs separately from localStorage items
   * @param {string} workId - Work ID
   * @param {Object} data - Content data (optional, for tracking)
   * @private
   */
  _addToPendingQueue(workId, data = null) {
    const pendingKey = 'artopath_pending_syncs';
    const pending = safeParseLocalStorage
      ? safeParseLocalStorage(pendingKey, {})
      : JSON.parse(localStorage.getItem(pendingKey) || '{}');

    pending[workId] = {
      timestamp: Date.now(),
      attempts: (pending[workId]?.attempts || 0) + 1,
      lastError: data?.syncError || null
    };

    const payload = JSON.stringify(pending);
    if (typeof safeSetLocalStorage === 'function') {
      safeSetLocalStorage(pendingKey, payload, { context: 'content-persistence-pending-queue' });
    } else {
      localStorage.setItem(pendingKey, payload);
    }

    if (this.DEBUG) console.log('[ContentPersistence] Added to pending queue:', workId, `(attempt ${pending[workId].attempts})`);
  },

  /**
   * Remove work from pending sync queue
   * @param {string} workId - Work ID
   * @private
   */
  _removeFromPendingQueue(workId) {
    const pendingKey = 'artopath_pending_syncs';
    const pending = safeParseLocalStorage
      ? safeParseLocalStorage(pendingKey, {})
      : JSON.parse(localStorage.getItem(pendingKey) || '{}');

    if (pending[workId]) {
      delete pending[workId];
      const payload = JSON.stringify(pending);
      if (typeof safeSetLocalStorage === 'function') {
        safeSetLocalStorage(pendingKey, payload, { context: 'content-persistence-pending-queue' });
      } else {
        localStorage.setItem(pendingKey, payload);
      }

      if (this.DEBUG) console.log('[ContentPersistence] Removed from pending queue:', workId);
    }
  },

  /**
   * Get all workIds in pending sync queue
   * @returns {string[]} Array of workIds
   * @private
   */
  _getPendingQueueWorkIds() {
    const pendingKey = 'artopath_pending_syncs';
    const pending = safeParseLocalStorage
      ? safeParseLocalStorage(pendingKey, {})
      : JSON.parse(localStorage.getItem(pendingKey) || '{}');

    // Filter out items with too many attempts (>5)
    const validPending = [];
    for (const [workId, data] of Object.entries(pending)) {
      if (data.attempts <= 5) {
        validPending.push(workId);
      } else {
        if (this.DEBUG) console.warn('[ContentPersistence] Abandoning pending sync after 5 attempts:', workId);
      }
    }

    return validPending;
  },

  /**
   * Get pending queue status (for debugging/UI)
   * @returns {Object} Pending queue data
   */
  getPendingQueueStatus() {
    const pendingKey = 'artopath_pending_syncs';
    const pending = safeParseLocalStorage
      ? safeParseLocalStorage(pendingKey, {})
      : JSON.parse(localStorage.getItem(pendingKey) || '{}');

    const status = {
      total: Object.keys(pending).length,
      byAttempts: {},
      items: []
    };

    for (const [workId, data] of Object.entries(pending)) {
      const attempts = data.attempts || 0;
      status.byAttempts[attempts] = (status.byAttempts[attempts] || 0) + 1;
      status.items.push({
        workId,
        attempts,
        timestamp: data.timestamp,
        lastError: data.lastError
      });
    }

    return status;
  }
};

// Expose globally
window.ContentPersistence = ContentPersistence;

// Auto-retry pending syncs and cleanup old entries on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Skip if streaming is active — streaming supersedes cache
      if (typeof StreamingUI !== 'undefined' && StreamingUI.isStreaming) return;
      // First cleanup old entries to free space
      ContentPersistence.cleanupOldEntries();
      // Then retry any pending syncs
      ContentPersistence.retryPendingSyncs();
    }, 5000); // Wait 5 seconds after page load
  });

  // Also retry when coming back online
  window.addEventListener('online', () => {
    ContentPersistence.retryPendingSyncs();
  });
}
