/**
 * Storage & initialization utilities shared across the Early POC.
 * Provides safe JSON parsing, quota notifications, and async guards.
 */

// One-time migration: clear stale seed-era localStorage entries.
// DB is now the single source of truth (Session 10, Phase 1).
(function() {
  var MIGRATION_KEY = 'artopath_storage_v2';
  if (!localStorage.getItem(MIGRATION_KEY)) {
    localStorage.removeItem('artopath_vault');
    localStorage.removeItem('viewedWorks');
    // Preserve artopath_visited_places (legitimate user data)
    localStorage.setItem(MIGRATION_KEY, new Date().toISOString());
    console.log('[Migration] Cleared stale seed-era localStorage. DB is source of truth.');
  }
})();

(function(window) {
  const warnedContexts = new Set();

  function isQuotaError(error) {
    if (!error) return false;
    return error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22;
  }

  function notifyStorageLimit(context, detail) {
    const message = detail ||
      'Your browser storage is full. Please remove saved works or export data.';

    if (!warnedContexts.has(context)) {
      warnedContexts.add(context);
      if (typeof showNotification === 'function') {
        showNotification(message, 'warning');
      } else {
        console.warn(`[StorageUtils] ${message}`);
      }
      window.dispatchEvent(new CustomEvent('artopathStorageWarning', {
        detail: { context, message }
      }));
    }
  }

  function safeParseLocalStorage(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`[StorageUtils] Failed to parse ${key}, clearing entry.`, error);
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.warn('[StorageUtils] Failed to remove corrupt key:', removeError);
      }
      return fallback;
    }
  }

  function safeSetLocalStorage(key, value, { context, onError } = {}) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (isQuotaError(error)) {
        notifyStorageLimit(context || key);
      } else {
        console.error(`[StorageUtils] Failed to write ${key}:`, error);
      }
      if (typeof onError === 'function') {
        onError(error);
      }
      return false;
    }
  }

  async function guardAsyncInitialization(label, initializer, fallbackFactory) {
    try {
      return await initializer();
    } catch (error) {
      console.error(`[StorageUtils] ${label} failed:`, error);
      if (typeof showNotification === 'function') {
        showNotification('We hit a loading issue. Showing cached data.', 'warning');
      }
      if (typeof fallbackFactory === 'function') {
        try {
          return await fallbackFactory(error);
        } catch (fallbackError) {
          console.error(`[StorageUtils] ${label} fallback failed:`, fallbackError);
        }
      }
      return [];
    }
  }

  window.StorageUtils = {
    safeParseLocalStorage,
    safeSetLocalStorage,
    notifyStorageLimit,
    guardAsyncInitialization,
    isQuotaError
  };

  // Auto-register global storage warning banner listener
  // Provides consistent UI across all pages when storage quota is hit
  window.addEventListener('artopathStorageWarning', function(event) {
    const { context, message } = event.detail || {};

    // Prevent duplicate banners
    if (document.querySelector('.storage-warning-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'storage-warning-banner';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, rgba(180, 83, 9, 0.95), rgba(146, 64, 14, 0.95));
      color: white;
      padding: 12px 20px;
      font-size: 0.9rem;
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      animation: slideDown 0.3s ease;
    `;

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.2rem;">⚠️</span>
        <div>
          <strong>Storage Full</strong>
          <span style="opacity: 0.9; margin-left: 8px;">${message || 'Export or remove old data to free space.'}</span>
        </div>
      </div>
      <button style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
        Dismiss
      </button>
    `;

    // Add animation keyframes if not present
    if (!document.getElementById('storageWarningStyles')) {
      const style = document.createElement('style');
      style.id = 'storageWarningStyles';
      style.textContent = `
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    // Dismiss handler
    banner.querySelector('button').addEventListener('click', function() {
      banner.style.animation = 'slideDown 0.3s ease reverse';
      setTimeout(function() { banner.remove(); }, 300);
    });

    document.body.appendChild(banner);

    // Auto-dismiss after 10 seconds
    setTimeout(function() {
      if (banner.parentNode) {
        banner.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(function() { banner.remove(); }, 300);
      }
    }, 10000);
  });
})(window);
