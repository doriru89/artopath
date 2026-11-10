window.DNAGraph = window.DNAGraph || {};

// Edge colors borrowed from old dna-canvas.js edgeStyles (lines 1059-1091)
DNAGraph.EDGE_STYLES = {
  work_person: { color: 'rgba(124,58,237,0.5)', width: 1.5, dash: '' },
  work_work: { color: 'rgba(229,184,74,0.5)', width: 1.5, dash: '8,4' },
  person_work: { color: 'rgba(124,58,237,0.3)', width: 1, dash: '' },
  person_person: { color: 'rgba(34,197,94,0.6)', width: 1.5, dash: '6,3' }
};

DNAGraph.renderEdges = function (container, links) {
  const edgeGroup = container.append('g').attr('class', 'edges');

  const lines = edgeGroup.selectAll('line')
    .data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`)
    .join('line')
    .attr('stroke', d => (DNAGraph.EDGE_STYLES[d.edgeType] || DNAGraph.EDGE_STYLES.work_work).color)
    .attr('stroke-width', d => (DNAGraph.EDGE_STYLES[d.edgeType] || DNAGraph.EDGE_STYLES.work_work).width)
    .attr('stroke-dasharray', d => (DNAGraph.EDGE_STYLES[d.edgeType] || DNAGraph.EDGE_STYLES.work_work).dash);

  const labels = edgeGroup.selectAll('text.edge-label')
    .data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`)
    .join('text')
    .attr('class', 'edge-label')
    .attr('text-anchor', 'middle')
    .attr('fill', '#8a7a6a')
    .attr('font-size', '9px')
    .attr('font-family', 'Inter, system-ui, sans-serif')
    .text(d => DNAGraph._formatEdgeLabel(d.label));

  return { lines, labels };
};

DNAGraph._formatEdgeLabel = function (label) {
  if (!label) return '';
  return label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};
