window.DNAGraph = window.DNAGraph || {};

DNAGraph.createSimulation = function (nodes, links, width, height) {
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(140))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => (d.radius || 30) + 14))
    .force('x', d3.forceX(width / 2).strength(0.04))
    .force('y', d3.forceY(height / 2).strength(0.04));
};

DNAGraph.updatePositions = function (nodeGroups, edgeGroups, edgeLabelGroups) {
  nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);

  edgeGroups
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  if (edgeLabelGroups) {
    edgeLabelGroups
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 - 6);
  }
};
