window.DNAGraph = window.DNAGraph || {};

// Zoom limits from old dna-canvas.js (lines 976-977)
DNAGraph.MIN_ZOOM = 0.3;
DNAGraph.MAX_ZOOM = 3;

DNAGraph.setupZoom = function (svg, g) {
  const zoom = d3.zoom()
    .scaleExtent([DNAGraph.MIN_ZOOM, DNAGraph.MAX_ZOOM])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Expose for programmatic zoom (e.g., fit-to-view)
  DNAGraph._zoom = zoom;
  return zoom;
};

DNAGraph.setupDrag = function (simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return function (nodeGroups) {
    nodeGroups.call(
      d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );
  };
};

DNAGraph.setupClick = function (nodeGroups) {
  nodeGroups.on('click', (event, d) => {
    event.stopPropagation();
    if (d.type === 'work') {
      if (d.inVault === false && typeof addWorkToVault === 'function') {
        // Ghost lineage node — add to vault
        addWorkToVault({
          id: d.originalId,
          title_display: d.label,
          work_type: d.workType || '',
          primary_image_url: d.imageUrl || '',
        });
        // Visual feedback: change opacity and remove + badge
        d.inVault = true;
        const nodeG = d3.select(event.currentTarget);
        nodeG.transition().duration(400).attr('opacity', 1);
        nodeG.select('rect').attr('stroke-dasharray', null).attr('stroke', DNAGraph.STYLES.work.stroke);
        nodeG.select('.add-badge').transition().duration(300).attr('opacity', 0).remove();
        console.log(`[DNA] Added lineage work to vault: ${d.label}`);
      } else {
        window.location.href = `work-detail.html?id=${d.originalId}`;
      }
    } else if (d.type === 'person') {
      DNAGraph._highlightPersonEdges(d.id);
    }
  });

  nodeGroups.style('cursor', d => {
    if (d.type === 'work' && d.inVault === false) return 'cell';
    return d.type === 'work' ? 'pointer' : 'default';
  });
};

DNAGraph._highlightPersonEdges = function (personId) {
  if (!DNAGraph._state) return;
  const { g } = DNAGraph._state;

  g.selectAll('line')
    .attr('stroke-opacity', d => {
      const src = d.source.id || d.source;
      const tgt = d.target.id || d.target;
      return (src === personId || tgt === personId) ? 1 : 0.15;
    });

  g.selectAll('text.edge-label')
    .attr('opacity', d => {
      const src = d.source.id || d.source;
      const tgt = d.target.id || d.target;
      return (src === personId || tgt === personId) ? 1 : 0.15;
    });

  g.selectAll('g.node')
    .attr('opacity', d => {
      if (d.id === personId) return 1;
      const connected = DNAGraph._state.links.some(l => {
        const src = l.source.id || l.source;
        const tgt = l.target.id || l.target;
        return (src === personId && tgt === d.id) || (tgt === personId && src === d.id);
      });
      return connected ? 1 : 0.3;
    });

  // Click background to reset
  DNAGraph._state.svg.on('click.reset', () => {
    g.selectAll('line').attr('stroke-opacity', 1);
    g.selectAll('text.edge-label').attr('opacity', 1);
    g.selectAll('g.node').attr('opacity', 1);
    DNAGraph._state.svg.on('click.reset', null);
  });
};
