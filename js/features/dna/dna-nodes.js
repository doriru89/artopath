window.DNAGraph = window.DNAGraph || {};

// Palette borrowed from old dna-canvas.js nodeStyles (lines 994-1040)
DNAGraph.STYLES = {
  work: { fill: '#e5b84a', stroke: '#f5d47a', glow: 'rgba(229,184,74,0.4)', textFill: '#5a4a3a' },
  person: { fill: '#7c3aed', stroke: '#a78bfa', glow: 'rgba(124,58,237,0.4)', textFill: '#4a3a5a' }
};

DNAGraph.renderDefs = function (svg) {
  const defs = svg.append('defs');

  // Drop-shadow filter for center node
  const filter = defs.append('filter').attr('id', 'center-glow');
  filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 6);
  filter.append('feOffset').attr('dx', 0).attr('dy', 0);
  filter.append('feComponentTransfer').append('feFuncA').attr('type', 'linear').attr('slope', 0.4);
  const merge = filter.append('feMerge');
  merge.append('feMergeNode');
  merge.append('feMergeNode').attr('in', 'SourceGraphic');

  return defs;
};

DNAGraph.renderNodes = function (container, defs, nodes) {
  const groups = container.selectAll('g.node')
    .data(nodes, d => d.id)
    .join('g')
    .attr('class', d => `node ${d.type}${d.isCenter ? ' center' : ''}`);

  groups.each(function (d) {
    const g = d3.select(this);
    g.selectAll('*').remove();

    const style = DNAGraph.STYLES[d.type];
    const clipId = `clip-${d.id.replace(/[^a-zA-Z0-9]/g, '-')}`;

    // Clip path
    const clip = defs.append('clipPath').attr('id', clipId);

    if (d.shape === 'circle') {
      clip.append('circle').attr('r', d.radius);

      // Background circle
      g.append('circle')
        .attr('r', d.radius)
        .attr('fill', style.fill)
        .attr('stroke', style.stroke)
        .attr('stroke-width', d.isCenter ? 3 : 1.5);

      if (d.isCenter) {
        g.attr('filter', 'url(#center-glow)');
      }

      // Image or initials
      if (d.imageUrl) {
        g.append('image')
          .attr('href', d.imageUrl)
          .attr('x', -d.radius)
          .attr('y', -d.radius)
          .attr('width', d.radius * 2)
          .attr('height', d.radius * 2)
          .attr('clip-path', `url(#${clipId})`)
          .attr('preserveAspectRatio', 'xMidYMid slice');
      } else {
        g.append('text')
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .attr('fill', '#fff')
          .attr('font-size', `${Math.round(d.radius * 0.8)}px`)
          .attr('font-weight', 'bold')
          .attr('font-family', 'Inter, system-ui, sans-serif')
          .text((d.label || '?').charAt(0).toUpperCase());
      }

      // Label below
      g.append('text')
        .attr('class', 'node-label')
        .attr('y', d.radius + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', style.textFill)
        .attr('font-size', '11px')
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .text(DNAGraph._truncateLabel(d.label, 18));

    } else {
      // Work: rounded rectangle
      const hw = d.width / 2;
      const hh = d.height / 2;

      clip.append('rect')
        .attr('x', -hw).attr('y', -hh)
        .attr('width', d.width).attr('height', d.height)
        .attr('rx', 4);

      g.append('rect')
        .attr('x', -hw).attr('y', -hh)
        .attr('width', d.width).attr('height', d.height)
        .attr('rx', 4)
        .attr('fill', style.fill)
        .attr('stroke', style.stroke)
        .attr('stroke-width', d.isCenter ? 3 : 1.5);

      if (d.isCenter) {
        g.attr('filter', 'url(#center-glow)');
      }

      if (d.imageUrl) {
        g.append('image')
          .attr('href', d.imageUrl)
          .attr('x', -hw).attr('y', -hh)
          .attr('width', d.width).attr('height', d.height)
          .attr('clip-path', `url(#${clipId})`)
          .attr('preserveAspectRatio', 'xMidYMid slice');
      } else {
        g.append('text')
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .attr('fill', '#fff')
          .attr('font-size', `${Math.round(Math.min(d.width, d.height) * 0.4)}px`)
          .attr('font-weight', 'bold')
          .attr('font-family', 'Inter, system-ui, sans-serif')
          .text((d.label || '?').charAt(0).toUpperCase());
      }

      // 3-tier work node styling: Loved > Vault (enriched) > Lineage stub
      if (d.type === 'work' && d.isLoved) {
        g.select('rect').attr('stroke', 'var(--accent-rust, #c17c5a)').attr('stroke-width', 2.5);
      } else if (d.type === 'work' && d.inVault && !d.isLoved) {
        g.select('rect').attr('stroke', 'var(--accent-sage, #5d8a6b)').attr('stroke-width', 1.5);
      } else if (d.type === 'work' && !d.inVault) {
        g.attr('opacity', 0.3);
        g.select('rect')
          .attr('stroke-dasharray', '3,3')
          .attr('stroke', 'rgba(168, 212, 230, 0.5)')
          .attr('stroke-width', 1);
        g.attr('transform', `scale(0.7)`);

        // "+" badge to indicate clickable add-to-vault
        const badgeR = 8;
        const badgeG = g.append('g')
          .attr('class', 'add-badge')
          .attr('transform', `translate(${hw - 2}, ${-hh + 2})`);
        badgeG.append('circle')
          .attr('r', badgeR)
          .attr('fill', '#5d8a6b')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
        badgeG.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('fill', '#fff')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text('+');
      }

      // Label below
      g.append('text')
        .attr('class', 'node-label')
        .attr('y', hh + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', style.textFill)
        .attr('font-size', '11px')
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .text(DNAGraph._truncateLabel(d.label, 16));
    }
  });

  return groups;
};

DNAGraph._truncateLabel = function (text, maxLen) {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen - 1) + '…' : text;
};
