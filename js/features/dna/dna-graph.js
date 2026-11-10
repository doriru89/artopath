window.DNAGraph = window.DNAGraph || {};

DNAGraph._mode = 'single'; // 'single' | 'vault'

window.buildDNAGraph = async function (containerId, defaultWorkId) {
  DNAGraph._mode = 'single';
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 600;

  const svg = d3.select(container).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background', 'transparent');

  const defs = DNAGraph.renderDefs(svg);
  const g = svg.append('g');

  try {
    const apiData = await DNAGraph.fetchEgoGraph(defaultWorkId);
    const { nodes, links } = DNAGraph.transformData(apiData);
    console.log(`[DNA] Loaded: ${nodes.length} nodes, ${links.length} edges for ${defaultWorkId}`);
    DNAGraph._renderGraph(svg, g, defs, nodes, links, width, height, containerId);
  } catch (err) {
    console.error('[DNA] Failed to load ego graph:', err);
    DNAGraph._showError(g, width, height);
  }
};

window.buildVaultDNAGraph = async function (containerId, workIds) {
  DNAGraph._mode = 'vault';
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 600;

  const svg = d3.select(container).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background', 'transparent');

  const defs = DNAGraph.renderDefs(svg);
  const g = svg.append('g');

  try {
    const apiData = await DNAGraph.fetchVaultGraph(workIds);
    let { nodes, links } = DNAGraph.transformData(apiData);

    // Mark vault/loved status on work nodes
    const vaultIdSet = new Set(workIds.map(id => `work_${id}`));
    const lovedIdSet = new Set(
      (typeof ALL_WORKS !== 'undefined' ? ALL_WORKS : [])
        .filter(w => w.loved === true)
        .map(w => `work_${w.id}`)
    );
    nodes.forEach(n => {
      if (n.type === 'work') {
        n.inVault = vaultIdSet.has(n.id);
        n.isLoved = lovedIdSet.has(n.id);
      }
    });

    // If lineage scope is active, fetch and merge lineage works
    if (window._lineageScope === 'lineage') {
      try {
        const lineageResults = await DNAGraph.fetchLineageWorks(workIds);
        for (const result of lineageResults) {
          const lineageData = DNAGraph.transformData(result);
          for (const node of lineageData.nodes) {
            if (!nodes.some(n => n.id === node.id)) {
              node.inVault = vaultIdSet.has(node.id);
              node.isLoved = lovedIdSet.has(node.id);
              nodes.push(node);
            }
          }
          for (const link of lineageData.links) {
            const key = `${link.source}|${link.target}`;
            if (!links.some(l => `${l.source.id || l.source}|${l.target.id || l.target}` === key)) {
              links.push(link);
            }
          }
        }
        console.log(`[DNA] Lineage expanded: ${nodes.length} nodes, ${links.length} edges`);
      } catch (e) {
        console.warn('[DNA] Lineage expansion failed:', e);
      }
    }

    console.log(`[DNA] Vault: ${nodes.length} nodes, ${links.length} edges from ${workIds.length} works`);
    DNAGraph._renderGraph(svg, g, defs, nodes, links, width, height, containerId);
  } catch (err) {
    console.error('[DNA] Failed to load vault graph:', err);
    DNAGraph._showError(g, width, height);
  }
};

DNAGraph._renderGraph = function (svg, g, defs, nodes, links, width, height, containerId) {
  const sim = DNAGraph.createSimulation(nodes, links, width, height);
  const { lines: edgeLines, labels: edgeLabels } = DNAGraph.renderEdges(g, links);
  const nodeGroups = DNAGraph.renderNodes(g, defs, nodes);

  DNAGraph.setupZoom(svg, g);
  DNAGraph.setupDrag(sim)(nodeGroups);
  DNAGraph.setupClick(nodeGroups);

  sim.on('tick', () => {
    DNAGraph.updatePositions(nodeGroups, edgeLines, edgeLabels);
  });

  DNAGraph._state = { svg, g, sim, nodes, links, container: document.getElementById(containerId), defs, width, height };
};

DNAGraph._showError = function (g, width, height) {
  g.append('text')
    .attr('x', width / 2).attr('y', height / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#8a7a6a').attr('font-size', '14px')
    .attr('font-family', 'Inter, system-ui, sans-serif')
    .text('Could not load graph data. Check API connection.');
};

window.reCenterDNAGraph = async function (workId) {
  if (!DNAGraph._state) return;
  DNAGraph._mode = 'single';
  const { g, defs, width, height } = DNAGraph._state;

  try {
    const apiData = await DNAGraph.fetchEgoGraph(workId);
    const { nodes, links } = DNAGraph.transformData(apiData);
    console.log(`[DNA] Re-center: ${nodes.length} nodes, ${links.length} edges for ${workId}`);

    g.selectAll('*').remove();
    const sim = DNAGraph.createSimulation(nodes, links, width, height);
    const { lines: edgeLines, labels: edgeLabels } = DNAGraph.renderEdges(g, links);
    const nodeGroups = DNAGraph.renderNodes(g, defs, nodes);

    DNAGraph.setupDrag(sim)(nodeGroups);
    DNAGraph.setupClick(nodeGroups);
    sim.on('tick', () => { DNAGraph.updatePositions(nodeGroups, edgeLines, edgeLabels); });

    DNAGraph._state.sim = sim;
    DNAGraph._state.nodes = nodes;
    DNAGraph._state.links = links;
  } catch (err) {
    console.error('[DNA] Re-center failed:', err);
  }
};

// Tab filter: multi-select toggle (people, works)
DNAGraph._activeTabs = ['people', 'works'];
DNAGraph._tabToType = { people: 'person', works: 'work' };

window.switchTab = function (tabName) {
  const tabs = DNAGraph._activeTabs;
  const idx = tabs.indexOf(tabName);

  if (idx === -1) {
    tabs.push(tabName);
  } else if (tabs.length > 1) {
    tabs.splice(idx, 1);
  }

  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.classList.toggle('active', tabs.includes(btn.dataset.tab));
  });

  const activeTypes = tabs.map(t => DNAGraph._tabToType[t]).filter(Boolean);
  DNAGraph.filterByType(activeTypes);
};

DNAGraph.filterByType = function (types) {
  if (!DNAGraph._state) return;
  const { g } = DNAGraph._state;

  g.selectAll('g.node')
    .attr('display', d => types.includes(d.type) ? null : 'none');

  g.selectAll('line')
    .attr('display', d => {
      const srcType = d.source.type;
      const tgtType = d.target.type;
      return types.includes(srcType) && types.includes(tgtType) ? null : 'none';
    });

  g.selectAll('text.edge-label')
    .attr('display', d => {
      const srcType = d.source.type;
      const tgtType = d.target.type;
      return types.includes(srcType) && types.includes(tgtType) ? null : 'none';
    });
};
