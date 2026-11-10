(function() {
  const DEBUG_IDENTITY = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const IDENTITY_SIGNAL_KEY = 'artopath_identity_signals';
  const MAX_SIGNALS = 50;

  let overlayEl = null;
  let overlayMatchesEl = null;
  let overlayCandidateEl = null;
  let pendingResolve = null;
  let currentMatches = [];

  function safeText(value) {
    if (typeof escapeHtml === 'function') {
      return escapeHtml(value || '');
    }
    return (value || '').toString();
  }

  function ensureOverlay() {
    if (overlayEl) return overlayEl;

    const styleId = 'identityOverlayStyles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .identity-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          padding: 20px;
        }
        .identity-overlay.active {
          display: flex;
        }
        .identity-modal {
          background: var(--forest-deep, #0f1914);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          width: min(600px, 100%);
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .identity-header {
          padding: 20px 24px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .identity-header h2 {
          margin: 0 0 8px;
          font-size: 1.1rem;
          color: var(--text-light, #f4f1ec);
        }
        .identity-header p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-muted, rgba(244, 241, 236, 0.7));
        }
        .identity-candidate {
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .identity-candidate strong {
          color: var(--accent-gold, #f7c978);
        }
        .identity-matches {
          flex: 1;
          overflow-y: auto;
        }
        .identity-match-card {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .identity-match-card:last-child {
          border-bottom: none;
        }
        .identity-match-title {
          font-weight: 600;
          color: var(--text-light, #f4f1ec);
        }
        .identity-match-meta {
          font-size: 0.85rem;
          color: var(--text-muted, rgba(244, 241, 236, 0.7));
        }
        .identity-match-actions {
          margin-top: 8px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .identity-pill {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted, rgba(244, 241, 236, 0.7));
        }
        .identity-match-button {
          margin-left: auto;
          background: var(--spirit-glow, #9de8c6);
          color: var(--forest-deep, #0f1914);
          border: none;
          border-radius: 999px;
          font-weight: 600;
          padding: 6px 16px;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .identity-match-button:hover {
          opacity: 0.85;
        }
        .identity-footer {
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .identity-dismiss-button {
          background: transparent;
          color: var(--text-light, #f4f1ec);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          padding: 8px 20px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .identity-dismiss-button:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .identity-empty {
          padding: 24px;
          text-align: center;
          color: var(--text-muted, rgba(244, 241, 236, 0.7));
        }
        .identity-close {
          background: none;
          border: none;
          color: var(--text-muted, rgba(244, 241, 236, 0.7));
          font-size: 1.2rem;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    }

    overlayEl = document.createElement('div');
    overlayEl.className = 'identity-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.setAttribute('aria-hidden', 'true');
    overlayEl.innerHTML = `
      <div class="identity-modal">
        <div class="identity-header">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
            <div>
              <h2>Does this match?</h2>
              <p>We spotted possible duplicates. Confirm the right work to keep your vault clean.</p>
            </div>
            <button class="identity-close" aria-label="Close" data-identity-action="dismiss">×</button>
          </div>
        </div>
        <div class="identity-candidate"></div>
        <div class="identity-matches"></div>
        <div class="identity-footer">
          <span style="font-size:0.85rem;color:var(--text-muted, rgba(244,241,236,0.7));">No match? Create a new master record.</span>
          <button class="identity-dismiss-button" data-identity-action="create">No match — add new</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlayEl);

    overlayCandidateEl = overlayEl.querySelector('.identity-candidate');
    overlayMatchesEl = overlayEl.querySelector('.identity-matches');

    overlayEl.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscapeKey);

    return overlayEl;
  }

  function handleEscapeKey(event) {
    if (event.key === 'Escape' && overlayEl && overlayEl.classList.contains('active')) {
      resolveWith({ type: 'create' });
    }
  }

  function handleOverlayClick(event) {
    const actionTarget = event.target.closest('[data-identity-action]');
    if (!actionTarget) {
      if (event.target === overlayEl) {
        resolveWith({ type: 'create' });
      }
      return;
    }

    const action = actionTarget.getAttribute('data-identity-action');
    if (action === 'dismiss') {
      resolveWith({ type: 'create' });
      return;
    }

    if (action === 'create') {
      resolveWith({ type: 'create' });
      return;
    }

    if (action === 'select') {
      const matchId = actionTarget.getAttribute('data-match-id');
      const selected = currentMatches.find(entry => `${entry.match.id}` === matchId);
      if (selected) {
        resolveWith({ type: 'match', match: selected.match, score: selected.score, reason: selected.reason });
      } else {
        resolveWith({ type: 'create' });
      }
    }
  }

  function resolveWith(result) {
    if (pendingResolve) {
      pendingResolve(result);
      pendingResolve = null;
    }
    closeOverlay();
  }

  function closeOverlay() {
    if (!overlayEl) return;
    overlayEl.classList.remove('active');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openIdentityModal(candidate, matches) {
    ensureOverlay();
    currentMatches = matches || [];
    const title = candidate && (candidate.title_display || candidate.title || 'Untitled');
    const year = candidate && (candidate.date_created_year || candidate.year || '');
    overlayCandidateEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="font-size:0.8rem;color:var(--text-muted, rgba(244,241,236,0.7));">Incoming work</span>
        <strong>${safeText(title)}</strong>
        ${year ? `<span style="font-size:0.85rem;color:var(--text-muted, rgba(244,241,236,0.7));">${safeText(year)}</span>` : ''}
      </div>
    `;

    if (!matches || matches.length === 0) {
      overlayMatchesEl.innerHTML = `<div class="identity-empty">No confident matches found. Add as new?</div>`;
    } else {
      overlayMatchesEl.innerHTML = matches.map(entry => {
        const creator = (typeof getCreator === 'function' ? getCreator(entry.match) : entry.match.creator) || 'Unknown';
        const matchYear = entry.match.date_created_year || entry.match.year || '';
        const type = entry.match.type || entry.match.work_type || 'work';
        const score = Math.round((entry.score || 0) * 100);
        return `
          <div class="identity-match-card">
            <div class="identity-match-title">${safeText(entry.match.title_display || entry.match.title || '')}</div>
            <div class="identity-match-meta">${safeText(creator)}${matchYear ? ' · ' + safeText(matchYear) : ''}</div>
            <div class="identity-match-actions">
              <span class="identity-pill">${safeText(type)}</span>
              <span class="identity-pill">${score}% match</span>
              <button class="identity-match-button" data-identity-action="select" data-match-id="${safeText(entry.match.id)}">This matches</button>
            </div>
          </div>
        `;
      }).join('');
    }

    overlayEl.classList.add('active');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    return new Promise(resolve => {
      pendingResolve = resolve;
    });
  }

  function getRankedCandidates(candidate, haystack, limit) {
    if (!candidate || !Array.isArray(haystack)) return [];
    const max = typeof limit === 'number' ? limit : 5;
    const matches = [];
    const seen = new Set();

    function pushMatch(work, reason, score) {
      if (!work || !work.id || seen.has(work.id)) return;
      matches.push({ match: work, reason: reason, score: score });
      seen.add(work.id);
    }

    if (candidate.tmdb_id) {
      const tmdbMatch = haystack.find(w => w.tmdb_id && `${w.tmdb_id}` === `${candidate.tmdb_id}`);
      if (tmdbMatch) {
        pushMatch(tmdbMatch, 'tmdb_id', 1);
      }
    }
    if (candidate.wikidata_id) {
      const wikiMatch = haystack.find(w => w.wikidata_id && `${w.wikidata_id}` === `${candidate.wikidata_id}`);
      if (wikiMatch) {
        pushMatch(wikiMatch, 'wikidata_id', 0.95);
      }
    }
    if (candidate.met_id) {
      const metMatch = haystack.find(w => w.met_id && `${w.met_id}` === `${candidate.met_id}`);
      if (metMatch) {
        pushMatch(metMatch, 'met_id', 0.9);
      }
    }

    const candTitle = candidate.title_normalized || candidate.title_display || candidate.title || '';
    const candYear = candidate.date_created_year || candidate.year || null;

    haystack.forEach(work => {
      const workTitle = work.title_normalized || work.title_display || work.title || '';
      if (!workTitle) return;

      const score = typeof similarityScore === 'function'
        ? similarityScore(candTitle, workTitle)
        : 0;
      if (score < 0.5) return;
      const workYear = work.date_created_year || work.year || null;
      const yearPenalty = (candYear && workYear && candYear !== workYear) ? 0.1 : 0;
      pushMatch(work, 'fuzzy_title_year', Math.max(score - yearPenalty, 0));
    });

    matches.sort((a, b) => (b.score || 0) - (a.score || 0));
    return matches.slice(0, max);
  }

  function logIdentitySignal(type, payload) {
    try {
      const raw = localStorage.getItem(IDENTITY_SIGNAL_KEY);
      const events = raw ? JSON.parse(raw) : [];
      events.push({
        type: type,
        timestamp: new Date().toISOString(),
        ...payload
      });
      while (events.length > MAX_SIGNALS) {
        events.shift();
      }
      localStorage.setItem(IDENTITY_SIGNAL_KEY, JSON.stringify(events));
      if (DEBUG_IDENTITY) {
        console.log('[Identity]', type, payload);
      }
    } catch (err) {
      console.warn('[Identity] Failed to log signal:', err);
    }
  }

  async function resolveCandidate(candidate, options) {
    const settings = options || {};
    const haystack = Array.isArray(settings.haystack) && settings.haystack.length
      ? settings.haystack
      : (Array.isArray(window.ALL_WORKS) ? window.ALL_WORKS : []);

    if (!candidate || !haystack.length || typeof findCanonicalId !== 'function') {
      return { action: 'create', reason: 'no_reference', score: 0 };
    }

    const identityResult = findCanonicalId(candidate, haystack);

    if (!identityResult.match) {
      logIdentitySignal('no_match', { candidate: candidate.title_display || candidate.title });
      return { action: 'create', reason: identityResult.reason, score: identityResult.score };
    }

    if (identityResult.reason !== 'fuzzy_title_year') {
      logIdentitySignal('auto_merge', {
        candidate: candidate.title_display || candidate.title,
        reason: identityResult.reason,
        score: identityResult.score,
        canonical_id: identityResult.match.id
      });
      return {
        action: 'existing',
        match: identityResult.match,
        reason: identityResult.reason,
        score: identityResult.score
      };
    }

    // Fuzzy match requires confirmation
    const rankedMatches = getRankedCandidates(candidate, haystack, settings.limit || 5);
    const confirmation = await openIdentityModal(candidate, rankedMatches);

    if (confirmation && confirmation.type === 'match' && confirmation.match) {
      logIdentitySignal('user_confirmed', {
        candidate: candidate.title_display || candidate.title,
        canonical_id: confirmation.match.id,
        score: confirmation.score
      });
      return {
        action: 'existing',
        match: confirmation.match,
        reason: confirmation.reason || 'user_confirmed',
        score: confirmation.score || identityResult.score
      };
    }

    logIdentitySignal('user_declined', {
      candidate: candidate.title_display || candidate.title,
      reason: identityResult.reason,
      score: identityResult.score
    });
    return { action: 'create', reason: 'user_declined', score: identityResult.score };
  }

  function hydrateVaultWithCanonical(work) {
    if (!work || typeof addWorkToVault !== 'function') {
      return null;
    }
    return addWorkToVault(work);
  }

  function backfillVault(works) {
    if (typeof backfillVaultCanonicalIds === 'function') {
      try {
        backfillVaultCanonicalIds(works);
      } catch (err) {
        console.warn('[Identity] Vault backfill error:', err);
      }
    }
  }

  function initListeners() {
    if (typeof window === 'undefined') return;
    window.addEventListener('allWorksUpdated', function(event) {
      if (event && event.detail && Array.isArray(event.detail.works)) {
        backfillVault(event.detail.works);
      }
    });
    if (Array.isArray(window.ALL_WORKS) && window.ALL_WORKS.length) {
      backfillVault(window.ALL_WORKS);
    }
  }

  initListeners();

  window.IdentityEngine = {
    resolveCandidate: resolveCandidate,
    logIdentitySignal: logIdentitySignal,
    hydrateVaultWithCanonical: hydrateVaultWithCanonical,
    backfillVault: backfillVault
  };
})();
