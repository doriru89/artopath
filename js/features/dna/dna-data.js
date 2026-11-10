window.DNAGraph = window.DNAGraph || {};

DNAGraph.API_BASE = window.API_BASE || 'http://localhost:8000/api';

DNAGraph.fetchEgoGraph = async function (workId) {
  const resp = await fetch(`${DNAGraph.API_BASE}/graph/ego/${workId}/`);
  if (!resp.ok) throw new Error(`Ego graph API error: ${resp.status}`);
  return resp.json();
};

DNAGraph.fetchVaultGraph = async function (workIds) {
  var vaultParam = workIds.join(',');
  var resp = await fetch(
    DNAGraph.API_BASE + '/graph/vault/?vault_ids=' + vaultParam + '&depth=2&top_n=3'
  );
  if (!resp.ok) throw new Error('Vault graph API error: ' + resp.status);
  var data = await resp.json();
  data.centerIds = new Set(data.center_ids || []);
  return data;
};

DNAGraph.fetchLineageWorks = async function (workIds) {
  const vaultParam = workIds.join(',');
  const results = [];

  for (const id of workIds) {
    try {
      const resp = await fetch(`${DNAGraph.API_BASE}/graph/works/${id}/lineage/?vault_ids=${vaultParam}&filter=beyond&include_persons=true`);
      if (resp.ok) results.push(await resp.json());
    } catch (e) {
      console.warn(`[DNA] Lineage fetch failed for ${id}:`, e);
    }
  }
  return results;
};

DNAGraph.transformData = function (apiData) {
  const centerId = apiData.center?.id;
  const centerIds = apiData.centerIds || (centerId ? new Set([centerId]) : new Set());

  const nodes = apiData.nodes
    .filter(n => n.type === 'work' || n.type === 'person')
    .map(n => {
      const isCenter = centerIds.has?.(n.id) || n.id === centerId;
      const scale = isCenter ? 1.3 : 1;
      if (n.type === 'person') {
        return {
          id: n.id,
          originalId: n.original_id || n.id.replace('person_', ''),
          type: 'person',
          label: n.label || n.name_display || '',
          nameNative: n.name_native || '',
          imageUrl: n.image_url || null,
          isCenter,
          radius: Math.round(28 * scale),
          shape: 'circle'
        };
      }
      return {
        id: n.id,
        originalId: n.original_id || n.id.replace('work_', ''),
        type: 'work',
        label: n.label || n.title_display || '',
        imageUrl: n.image_url || n.primary_image_url || null,
        workType: n.work_type || '',
        isCenter,
        radius: Math.round(30 * scale),
        width: Math.round(44 * scale),
        height: Math.round(60 * scale),
        shape: 'rect',
        inVault: n.in_collection !== false
      };
    });

  const nodeIds = new Set(nodes.map(n => n.id));

  const links = apiData.edges
    .filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
    .map(e => ({
      source: e.source,
      target: e.target,
      label: e.role_type || e.relation_type || e.type,
      edgeType: e.type
    }));

  return { nodes, links };
};
