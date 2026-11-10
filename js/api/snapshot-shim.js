/**
 * Frozen-demo shim (single-account showcase).
 *
 * Wraps window.fetch for calls to the Artopath API:
 *  - GET with a frozen copy in snapshot/index.json  -> served from GitHub Pages (fast, no backend)
 *  - vault/place writes                              -> faked 200, kept in this visitor's localStorage
 *  - everything else (search, AI, stream)            -> live API, unchanged
 *
 * Built by scripts/export_snapshot.py. Delete this file + its <script> tags to go back to fully live.
 */
(function () {
  if (window.__snapshotShim) return;
  window.__snapshotShim = true;

  // Frozen demo: hide AI generation controls (generation would write to the shared account).
  const hide = document.createElement('style');
  hide.textContent = '#generateFab,.fab-generate,#enrichFAB,.enrichment-fab,#regenerationOverlay,.regen-btn{display:none!important}';
  document.head.appendChild(hide);

  const realFetch = window.fetch.bind(window);
  const OVERLAY_KEY = 'artopath_demo_vault_v1';
  let indexPromise = null;

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = realFetch('snapshot/index.json')
        .then(r => (r.ok ? r.json() : {}))
        .catch(() => ({}));
    }
    return indexPromise;
  }
  loadIndex();

  function apiKey(url) {
    // Returns path relative to ".../api/" + sorted query, or null if not an API call.
    const base = window.API_BASE;
    if (!base) return null;
    let u, b;
    try { u = new URL(url, location.href); b = new URL(base, location.href); } catch (e) { return null; }
    const prefix = b.pathname.replace(/\/?$/, '/');
    if (u.origin !== b.origin || !u.pathname.startsWith(prefix)) return null;
    // Comma ID lists are order-insensitive (export_snapshot.py sorts them the same way).
    const params = [...u.searchParams.entries()].map(([k, v]) =>
      (k === 'vault_ids' || k === 'work_ids') ? [k, v.split(',').sort().join(',')] : [k, v]
    ).sort((x, y) =>
      x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0);
    const q = new URLSearchParams(params).toString();
    return u.pathname.slice(prefix.length) + (q ? '?' + q : '');
  }

  function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status, headers: { 'Content-Type': 'application/json', 'X-Artopath-Snapshot': '1' },
    });
  }

  function readOverlay() {
    try { return JSON.parse(localStorage.getItem(OVERLAY_KEY)) || {}; } catch (e) { return {}; }
  }
  function writeOverlay(o) {
    try { localStorage.setItem(OVERLAY_KEY, JSON.stringify(o)); } catch (e) { /* private mode */ }
  }

  function applyVaultOverlay(data) {
    const o = readOverlay();
    const ids = Object.keys(o);
    if (!ids.length || !data || !Array.isArray(data.works)) return data;
    const works = data.works.map(w => ({ ...w }));
    const byId = new Map(works.map(w => [String(w.work_id || w.id), w]));
    for (const id of ids) {
      const stage = o[id];
      const w = byId.get(id);
      if (w) { w.stage = stage; w.is_loved = stage === 'loved'; }
      else works.push({ work_id: id, id, stage, is_loved: stage === 'loved' });
    }
    const counts = {};
    works.forEach(w => { counts[w.stage] = (counts[w.stage] || 0) + 1; });
    return { ...data, works, stage_counts: counts };
  }

  function fakeWrite(key, method, body) {
    let m = key.match(/^user\/vault\/([^/]+)\/stage\/$/);
    if (m) {
      let stage = 'vault';
      try { stage = JSON.parse(body || '{}').stage || stage; } catch (e) { /* keep default */ }
      const o = readOverlay(); o[decodeURIComponent(m[1])] = stage; writeOverlay(o);
      return json({ work_id: m[1], stage, is_loved: stage === 'loved', demo: true });
    }
    if (/^places\/[^/]+\/visit\/$/.test(key) || /^user\/places\/[^/]+\/$/.test(key) || key === 'user/vault/sync/') {
      return method === 'DELETE' ? new Response(null, { status: 204 }) : json({ success: true, demo: true });
    }
    return null;
  }

  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || String(input);
    const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    const key = apiKey(url);
    if (!key) return realFetch(input, init);

    if (method !== 'GET') {
      const faked = fakeWrite(key.split('?')[0], method, init && init.body);
      return faked || realFetch(input, init);
    }

    const index = await loadIndex();
    const file = index[key];
    if (!file) {
      console.debug('[snapshot] miss', key);
      return realFetch(input, init);
    }
    try {
      const r = await realFetch('snapshot/' + file);
      if (!r.ok) throw new Error(r.status);
      let data = await r.json();
      if (key.startsWith('user/vault/')) data = applyVaultOverlay(data);
      return json(data);
    } catch (e) {
      return realFetch(input, init);
    }
  };
})();
