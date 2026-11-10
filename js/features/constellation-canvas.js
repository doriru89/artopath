/**
 * ============================================
 * CONSTELLATION-CANVAS.JS - Vault Star Map View
 *
 * USE CASE: Third view mode for Vault - visualize the user's
 *           personal collection as an interactive star map with
 *           expandable cards connected by relationship edges.
 *
 * INTENTION: Transform static collection into living, explorable
 *            visualization revealing hidden connections between works.
 *
 * VISION: Like DNA graph but with richer cards that expand in place.
 *         Cards show poster/image, metadata, and connections.
 *         "Second Art Brain" comes alive as constellation of knowledge.
 *
 * TRADE-OFF: Canvas rendering vs DOM cards - canvas for performance
 *            with many cards, but loses native CSS/accessibility.
 *            Mitigate with keyboard navigation and ARIA labels.
 * ============================================
 */

(function() {
  'use strict';

  // Debug flag
  const DEBUG_CONSTELLATION = false;

  // ========================================
  // CONSTANTS
  // ========================================

  // Card sizes for three expansion states
  const CARD_SIZES = {
    COLLAPSED: { width: 120, height: 160 },
    GLANCE: { width: 168, height: 224 },
    FULL: { width: 240, height: 320 }
  };

  // Edge styling by relationship type
  const EDGE_STYLES = {
    creator: { color: '#9b8ec4', dash: [], width: 1.5 },           // Same creator - solid purple
    lineage: { color: '#d4a847', dash: [8, 4], width: 2 },         // Influence - dashed gold
    theme: { color: '#a8d4e6', dash: [3, 3], width: 1 },           // Shared themes - dotted blue
    genre: { color: '#a8e6c4', dash: [6, 3, 2, 3], width: 1 }      // Same genre - dash-dot green
  };

  // Animation timing
  const ANIMATION = {
    EXPANSION_DURATION: 300,      // ms for card expansion
    CLUSTER_DURATION: 600,        // ms for cluster transition
    PHYSICS_DAMPING: 0.92,        // Velocity decay per frame
    PHYSICS_ITERATIONS: 50        // Max physics iterations before stable
  };

  // Layout configuration
  const LAYOUT = {
    CLUSTER_RADIUS: 250,          // Base radius for cluster positioning
    CARD_SPACING: 180,            // Minimum spacing between cards in cluster
    BOUNDARY_MARGIN: 80           // Distance from canvas edge
  };

  // ========================================
  // STATE
  // ========================================
  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;

  // Card data
  let cards = [];
  let edges = [];
  let cardMap = new Map();        // id -> card for O(1) lookup

  // View state
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;

  // Interaction state
  let expandedCard = null;        // Currently expanded card (only one at a time)
  let hoveredCard = null;         // Card under mouse
  let selectedCard = null;        // Keyboard-selected card

  // Clustering state
  let clusterMode = 'creator';    // 'none', 'creator', 'genre', 'theme'
  let clusters = new Map();       // clusterId -> { cards, centerX, centerY }

  // Pan/drag state
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panStartPanX = 0;
  let panStartPanY = 0;
  let didPan = false;

  // Animation state
  let animationId = null;
  let isAnimating = false;
  let physicsIterations = 0;
  let needsRedraw = true;

  // Image cache
  const imageCache = new Map();
  const imageLoadingStatus = new Map();

  // ========================================
  // INITIALIZATION
  // ========================================

  /**
   * Initialize the constellation view
   * USE CASE: Called when user switches to constellation view in vault
   * INTENTION: Set up canvas, build card data, compute edges, render
   *
   * @param {string} canvasId - ID of canvas element
   * @param {Array} works - Array of work objects from ALL_WORKS
   */
  function initConstellation(canvasId, works) {
    if (DEBUG_CONSTELLATION) console.log('[Constellation] Initializing with', works.length, 'works');

    canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('[Constellation] Canvas not found:', canvasId);
      return;
    }

    ctx = canvas.getContext('2d');

    // Set up canvas size
    resizeCanvas();
    window.addEventListener('resize', CanvasUtils.debounce(resizeCanvas, 200));

    // Build card data from works
    buildCardsFromWorks(works);

    // Compute relationship edges
    computeEdges();

    // Initial clustering and positioning
    clusterBy(clusterMode);

    // Resolve initial collisions
    runPhysics();

    // Set up event listeners
    setupEventListeners();

    // Preload images
    preloadAllImages();

    // Start animation loop
    startAnimation();

    if (DEBUG_CONSTELLATION) console.log('[Constellation] Initialized:', cards.length, 'cards,', edges.length, 'edges');
  }

  /**
   * Resize canvas to fill container
   */
  function resizeCanvas() {
    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || (window.innerHeight - 200);

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    needsRedraw = true;

    if (DEBUG_CONSTELLATION) console.log('[Constellation] Resized to', width, 'x', height);
  }

  // ========================================
  // DATA BUILDING
  // ========================================

  /**
   * Build card objects from work data
   * USE CASE: Transform flat work array into renderable card objects
   * INTENTION: Each card has position, size, expansion state, and work reference
   *
   * @param {Array} works - Array of work objects
   */
  function buildCardsFromWorks(works) {
    cards = [];
    cardMap.clear();

    // Filter to actual works (not locations)
    const validWorks = works.filter(w => {
      return (w.work_type || '') !== 'location';
    });

    validWorks.forEach((work, index) => {
      const card = {
        id: work.id,
        work: work,
        // Position (will be set by clustering)
        x: width / 2 + (Math.random() - 0.5) * 400,
        y: height / 2 + (Math.random() - 0.5) * 400,
        // Velocity for physics
        vx: 0,
        vy: 0,
        // Size
        width: CARD_SIZES.COLLAPSED.width,
        height: CARD_SIZES.COLLAPSED.height,
        scale: 1.0,
        // Expansion state
        expansionState: 'collapsed',  // 'collapsed' | 'glance' | 'full'
        expansionProgress: 0,         // 0-1 for animation
        targetExpansion: 0,           // Target expansion progress
        // Clustering
        clusterId: null,
        // Image
        imageLoaded: false,
        cachedImage: null,
        // Connections
        connectionCount: 0,
        // Animation
        animationStartTime: 0,
        // Hover state
        isHovered: false
      };

      cards.push(card);
      cardMap.set(work.id, card);
    });

    if (DEBUG_CONSTELLATION) console.log('[Constellation] Built', cards.length, 'cards');
  }

  /**
   * Compute edges between cards based on relationships
   * USE CASE: Draw lines showing connections between works
   * INTENTION: Visual representation of cultural lineage, shared creators, themes
   */
  function computeEdges() {
    edges = [];
    const edgeSet = new Set(); // Prevent duplicates

    cards.forEach(card => {
      // 1. Same creator edges
      cards.forEach(otherCard => {
        if (card.id === otherCard.id) return;

        const edgeKey = [card.id, otherCard.id].sort().join('::');
        if (edgeSet.has(edgeKey)) return;

        // Use defensive pattern: canonical helper if available, fallback to legacy field
        const creator1 = (typeof getCreator === 'function' ? getCreator(card.work) : card.work.creator)?.toLowerCase() || '';
        const creator2 = (typeof getCreator === 'function' ? getCreator(otherCard.work) : otherCard.work.creator)?.toLowerCase() || '';

        if (creator1 && creator1 === creator2) {
          const creatorLabel = typeof getCreator === 'function' ? getCreator(card.work) : card.work.creator;
          edges.push({
            source: card.id,
            target: otherCard.id,
            type: 'creator',
            label: creatorLabel
          });
          edgeSet.add(edgeKey);
          card.connectionCount++;
          otherCard.connectionCount++;
        }
      });

      // 2. Lineage edges (influencedBy / influences)
      const lineage = card.work.culturalLineage || card.work.lineage;
      if (lineage) {
        // Check influencedBy
        const influencedBy = lineage.influencedBy || [];
        influencedBy.forEach(influence => {
          const influenceTitle = typeof influence === 'string' ? influence : influence.title;
          if (!influenceTitle) return;

          // Find matching card by title
          const matchedCard = cards.find(c => {
            return (c.work.title_display || '')?.toLowerCase() === influenceTitle.toLowerCase();
          });

          if (matchedCard) {
            const edgeKey = [card.id, matchedCard.id].sort().join('::');
            if (!edgeSet.has(edgeKey)) {
              edges.push({
                source: matchedCard.id,  // Influence flows from source to target
                target: card.id,
                type: 'lineage',
                label: 'influenced'
              });
              edgeSet.add(edgeKey);
              card.connectionCount++;
              matchedCard.connectionCount++;
            }
          }
        });

        // Check influences
        const influences = lineage.influences || [];
        influences.forEach(influence => {
          const influenceTitle = typeof influence === 'string' ? influence : influence.title;
          if (!influenceTitle) return;

          const matchedCard = cards.find(c => {
            return (c.work.title_display || '')?.toLowerCase() === influenceTitle.toLowerCase();
          });

          if (matchedCard) {
            const edgeKey = [card.id, matchedCard.id].sort().join('::');
            if (!edgeSet.has(edgeKey)) {
              edges.push({
                source: card.id,
                target: matchedCard.id,
                type: 'lineage',
                label: 'influenced'
              });
              edgeSet.add(edgeKey);
              card.connectionCount++;
              matchedCard.connectionCount++;
            }
          }
        });
      }

      // 3. Shared theme edges (2+ shared themes)
      cards.forEach(otherCard => {
        if (card.id === otherCard.id) return;

        const edgeKey = [card.id, otherCard.id].sort().join('::');
        if (edgeSet.has(edgeKey)) return;

        const themes1 = card.work.tags?.theme || [];
        const themes2 = otherCard.work.tags?.theme || [];

        const sharedThemes = themes1.filter(t =>
          themes2.some(t2 => t.toLowerCase() === t2.toLowerCase())
        );

        if (sharedThemes.length >= 2) {
          edges.push({
            source: card.id,
            target: otherCard.id,
            type: 'theme',
            label: sharedThemes.slice(0, 2).join(', ')
          });
          edgeSet.add(edgeKey);
          card.connectionCount++;
          otherCard.connectionCount++;
        }
      });

      // 4. Same genre/type edges
      cards.forEach(otherCard => {
        if (card.id === otherCard.id) return;

        const edgeKey = [card.id, otherCard.id].sort().join('::');
        if (edgeSet.has(edgeKey)) return;

        // Normalize types
        const type1 = normalizeType(card.work.work_type || '');
        const type2 = normalizeType(otherCard.work.work_type || '');

        if (type1 && type1 === type2) {
          edges.push({
            source: card.id,
            target: otherCard.id,
            type: 'genre',
            label: type1
          });
          edgeSet.add(edgeKey);
          // Don't increment connection count for genre - too many edges
        }
      });
    });

    if (DEBUG_CONSTELLATION) console.log('[Constellation] Computed', edges.length, 'edges');
  }

  /**
   * Normalize work type for comparison
   */
  function normalizeType(type) {
    if (!type) return null;
    const t = type.toLowerCase();
    if (['movie', 'film', 'animation', 'tv'].includes(t)) return 'film';
    if (['artwork', 'painting', 'drawing', 'sculpture'].includes(t)) return 'art';
    return t;
  }

  // ========================================
  // CLUSTERING
  // ========================================

  /**
   * Cluster cards by mode and position clusters radially
   * USE CASE: User selects cluster mode (Creator/Genre/Theme/Free)
   * INTENTION: Group related works visually for exploration
   *
   * @param {string} mode - 'none', 'creator', 'genre', 'theme'
   */
  function clusterBy(mode) {
    clusterMode = mode;
    clusters.clear();

    if (mode === 'none') {
      // Free mode: random scatter from center
      cards.forEach(card => {
        card.clusterId = null;
        card.x = width / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.6;
        card.y = height / 2 + (Math.random() - 0.5) * Math.min(width, height) * 0.6;
      });
      needsRedraw = true;
      runPhysics();
      return;
    }

    // Group cards by cluster key
    let groups;
    switch (mode) {
      case 'creator':
        groups = groupByCreator(cards);
        break;
      case 'genre':
        groups = groupByGenre(cards);
        break;
      case 'theme':
        groups = groupByTheme(cards);
        break;
      case 'graph':
        groups = groupByConnectedComponent(cards);
        break;
      default:
        groups = new Map();
    }

    // Position cluster centers radially
    positionClusterCenters(groups);

    // Position cards within their clusters
    groups.forEach((clusterCards, clusterId) => {
      const cluster = clusters.get(clusterId);
      if (!cluster) return;

      clusterCards.forEach((card, index) => {
        card.clusterId = clusterId;

        // Position cards in a circle within cluster
        const angle = (index / clusterCards.length) * Math.PI * 2;
        const radius = Math.min(LAYOUT.CARD_SPACING * Math.sqrt(clusterCards.length) / 2, LAYOUT.CLUSTER_RADIUS * 0.8);
        card.x = cluster.centerX + Math.cos(angle) * radius;
        card.y = cluster.centerY + Math.sin(angle) * radius;
      });
    });

    needsRedraw = true;
    runPhysics();
  }

  /**
   * Group cards by creator
   */
  function groupByCreator(cardList) {
    const groups = new Map();

    cardList.forEach(card => {
      // Use defensive pattern: canonical helper if available, fallback to legacy field
      const creator = (typeof getCreator === 'function' ? getCreator(card.work) : card.work.creator) || 'Unknown';
      if (!groups.has(creator)) {
        groups.set(creator, []);
      }
      groups.get(creator).push(card);
    });

    return groups;
  }

  /**
   * Group cards by genre/type
   */
  function groupByGenre(cardList) {
    const groups = new Map();

    cardList.forEach(card => {
      const genre = normalizeType(card.work.work_type || '') || 'Other';
      if (!groups.has(genre)) {
        groups.set(genre, []);
      }
      groups.get(genre).push(card);
    });

    return groups;
  }

  /**
   * Group cards by primary theme
   */
  function groupByTheme(cardList) {
    const groups = new Map();

    cardList.forEach(card => {
      const themes = card.work.tags?.theme || [];
      const primaryTheme = themes[0] || 'Uncategorized';
      if (!groups.has(primaryTheme)) {
        groups.set(primaryTheme, []);
      }
      groups.get(primaryTheme).push(card);
    });

    return groups;
  }

  /**
   * Group cards by connected component via BFS.
   * Each connected subgraph becomes a cluster, named by its focus node.
   */
  function groupByConnectedComponent(cardList) {
    const groups = new Map();
    const visited = new Set();
    const cardMap = new Map(cardList.map(c => [c.id, c]));
    const adj = new Map();

    cardList.forEach(c => adj.set(c.id, []));
    edges.forEach(e => {
      if (adj.has(e.source) && adj.has(e.target)) {
        adj.get(e.source).push(e.target);
        adj.get(e.target).push(e.source);
      }
    });

    cardList.forEach(card => {
      if (visited.has(card.id)) return;
      const component = [];
      const queue = [card.id];
      visited.add(card.id);
      while (queue.length > 0) {
        const current = queue.shift();
        const c = cardMap.get(current);
        if (c) component.push(c);
        for (const neighbor of (adj.get(current) || [])) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      const focus = pickClusterFocus(component);
      const label = focus.work.title_display || focus.work.title || `Cluster ${groups.size + 1}`;
      groups.set(label, component);
    });

    return groups;
  }

  /**
   * Pick the card with highest degree (most edges) as cluster center.
   */
  function pickClusterFocus(component) {
    return component.reduce((best, card) =>
      (card.connectionCount || 0) > (best.connectionCount || 0) ? card : best
    , component[0]);
  }

  /**
   * Find bridge nodes connecting different clusters.
   * A bridge node has edges to cards in more than one connected component.
   */
  function detectBridgeNodes() {
    const componentOf = new Map();
    const visited = new Set();
    const cardMap = new Map(cards.map(c => [c.id, c]));
    const adj = new Map();

    cards.forEach(c => adj.set(c.id, []));
    edges.forEach(e => {
      if (adj.has(e.source) && adj.has(e.target)) {
        adj.get(e.source).push(e.target);
        adj.get(e.target).push(e.source);
      }
    });

    let compId = 0;
    cards.forEach(card => {
      if (visited.has(card.id)) return;
      const queue = [card.id];
      visited.add(card.id);
      while (queue.length > 0) {
        const current = queue.shift();
        componentOf.set(current, compId);
        for (const neighbor of (adj.get(current) || [])) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      compId++;
    });

    const bridges = [];
    cards.forEach(card => {
      const myComp = componentOf.get(card.id);
      const neighborComps = new Set();
      for (const e of edges) {
        if (e.source === card.id) neighborComps.add(componentOf.get(e.target));
        if (e.target === card.id) neighborComps.add(componentOf.get(e.source));
      }
      neighborComps.delete(myComp);
      if (neighborComps.size > 0) bridges.push(card);
    });

    return bridges;
  }

  /**
   * Position cluster centers radially around canvas center
   */
  function positionClusterCenters(groups) {
    const clusterCount = groups.size;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.35;

    let index = 0;
    groups.forEach((clusterCards, clusterId) => {
      const angle = (index / clusterCount) * Math.PI * 2 - Math.PI / 2;
      const radius = clusterCount === 1 ? 0 : maxRadius;

      clusters.set(clusterId, {
        id: clusterId,
        cards: clusterCards,
        centerX: centerX + Math.cos(angle) * radius,
        centerY: centerY + Math.sin(angle) * radius,
        label: clusterId
      });

      index++;
    });
  }

  // ========================================
  // PHYSICS
  // ========================================

  /**
   * Run physics simulation to resolve collisions and settle layout
   */
  function runPhysics() {
    physicsIterations = 0;
    isAnimating = true;
    startAnimation();
  }

  /**
   * Single physics simulation step
   */
  function simulateStep() {
    let totalMovement = 0;

    // Apply collision avoidance
    if (typeof CanvasUtils !== 'undefined') {
      CanvasUtils.applyRectCollisionAvoidance(cards, {
        padding: 20,
        iterations: 3,
        strength: 0.4,
        boundaryMargin: LAYOUT.BOUNDARY_MARGIN,
        canvasWidth: width,
        canvasHeight: height
      });
    }

    // Apply velocity and damping
    cards.forEach(card => {
      if (card === expandedCard) return; // Don't move expanded card

      card.x += card.vx;
      card.y += card.vy;
      card.vx *= ANIMATION.PHYSICS_DAMPING;
      card.vy *= ANIMATION.PHYSICS_DAMPING;

      totalMovement += Math.abs(card.vx) + Math.abs(card.vy);
    });

    physicsIterations++;

    // Check if simulation has stabilized
    if (totalMovement < 0.1 || physicsIterations > ANIMATION.PHYSICS_ITERATIONS) {
      return true; // Stabilized
    }

    return false;
  }

  /**
   * Push cards away from an expanding card
   */
  function pushCardsAway(sourceCard) {
    const pushRadius = sourceCard.width * 1.5;

    cards.forEach(card => {
      if (card === sourceCard) return;

      const dx = card.x - sourceCard.x;
      const dy = card.y - sourceCard.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pushRadius && dist > 0) {
        const pushStrength = (pushRadius - dist) / pushRadius * 5;
        card.vx += (dx / dist) * pushStrength;
        card.vy += (dy / dist) * pushStrength;
      }
    });

    runPhysics();
  }

  // ========================================
  // RENDERING
  // ========================================

  /**
   * Main render loop
   */
  function draw() {
    if (!ctx) return;

    // Clear canvas with background
    ctx.fillStyle = '#1a2f1a';
    ctx.fillRect(0, 0, width, height);

    // Apply zoom and pan transform
    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-width / 2, -height / 2);

    // Draw edges FIRST (behind cards)
    drawEdges();

    // Draw cluster labels (behind cards)
    drawClusterLabels();

    // Draw cards (sorted so expanded card is on top)
    const sortedCards = [...cards].sort((a, b) => {
      if (a === expandedCard) return 1;
      if (b === expandedCard) return -1;
      if (a === hoveredCard) return 1;
      if (b === hoveredCard) return -1;
      return 0;
    });

    sortedCards.forEach(card => {
      // Viewport culling
      const screenPos = getScreenPosition(card.x, card.y);
      if (!CanvasUtils.isInViewport(screenPos.x, screenPos.y, card.width * zoomLevel, card.height * zoomLevel, width, height, 100)) {
        return;
      }

      drawCard(card);
    });

    ctx.restore();

    // Draw UI overlays (not transformed)
    drawZoomIndicator();
  }

  /**
   * Draw all edges between cards
   */
  function drawEdges() {
    edges.forEach(edge => {
      const sourceCard = cardMap.get(edge.source);
      const targetCard = cardMap.get(edge.target);

      if (!sourceCard || !targetCard) return;

      const style = EDGE_STYLES[edge.type] || EDGE_STYLES.genre;

      ctx.beginPath();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.width;

      if (style.dash && style.dash.length > 0) {
        ctx.setLineDash(style.dash);
      } else {
        ctx.setLineDash([]);
      }

      ctx.moveTo(sourceCard.x, sourceCard.y);
      ctx.lineTo(targetCard.x, targetCard.y);
      ctx.stroke();

      ctx.setLineDash([]);
    });
  }

  /**
   * Draw cluster labels
   */
  function drawClusterLabels() {
    if (clusterMode === 'none') return;

    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    clusters.forEach(cluster => {
      // Draw label above cluster center
      const labelY = cluster.centerY - LAYOUT.CLUSTER_RADIUS * 0.6;

      // Background pill
      const text = cluster.label;
      const metrics = ctx.measureText(text);
      const padding = 12;
      const pillWidth = metrics.width + padding * 2;
      const pillHeight = 24;

      ctx.fillStyle = 'rgba(45, 74, 62, 0.8)';
      CanvasUtils.roundRect(ctx, cluster.centerX - pillWidth / 2, labelY - pillHeight / 2, pillWidth, pillHeight, 12);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(168, 212, 230, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text
      ctx.fillStyle = 'rgba(245, 240, 232, 0.8)';
      ctx.fillText(text, cluster.centerX, labelY);
    });
  }

  /**
   * Draw a single card
   */
  function drawCard(card) {
    const { x, y, width: cardWidth, height: cardHeight, expansionState, isHovered } = card;

    // Calculate actual size based on expansion state and progress
    let targetWidth, targetHeight;
    switch (expansionState) {
      case 'glance':
        targetWidth = CARD_SIZES.GLANCE.width;
        targetHeight = CARD_SIZES.GLANCE.height;
        break;
      case 'full':
        targetWidth = CARD_SIZES.FULL.width;
        targetHeight = CARD_SIZES.FULL.height;
        break;
      default:
        targetWidth = CARD_SIZES.COLLAPSED.width;
        targetHeight = CARD_SIZES.COLLAPSED.height;
    }

    // Animate size
    card.width = CanvasUtils.lerp(card.width, targetWidth, 0.15);
    card.height = CanvasUtils.lerp(card.height, targetHeight, 0.15);

    // Card position (top-left)
    const cardX = x - card.width / 2;
    const cardY = y - card.height / 2;

    // Draw shadow
    ctx.shadowColor = isHovered ? 'rgba(168, 212, 230, 0.4)' : 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = isHovered ? 20 : 10;
    ctx.shadowOffsetY = isHovered ? 6 : 4;

    // Card background
    ctx.fillStyle = '#2d4a3e';
    CanvasUtils.roundRect(ctx, cardX, cardY, card.width, card.height, 8);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Border
    ctx.strokeStyle = isHovered ? 'rgba(168, 212, 230, 0.6)' : 'rgba(168, 212, 230, 0.2)';
    ctx.lineWidth = isHovered ? 2 : 1;
    ctx.stroke();

    // Render content based on expansion state
    switch (expansionState) {
      case 'collapsed':
        drawCollapsedCard(card, cardX, cardY);
        break;
      case 'glance':
        drawGlanceCard(card, cardX, cardY);
        break;
      case 'full':
        drawFullCard(card, cardX, cardY);
        break;
    }
  }

  /**
   * Draw collapsed card content (120x160)
   * Shows: Image (80%), Title, Creator/Year
   */
  function drawCollapsedCard(card, x, y) {
    const work = card.work;
    const imgHeight = card.height * 0.7;
    const padding = 8;

    // Image area
    ctx.save();
    ctx.beginPath();
    CanvasUtils.roundRect(ctx, x + 4, y + 4, card.width - 8, imgHeight - 4, 6);
    ctx.clip();

    const img = getCachedImage(card.id);
    if (img) {
      // Draw image to cover
      const imgAspect = img.width / img.height;
      const areaAspect = (card.width - 8) / (imgHeight - 4);

      let drawWidth, drawHeight, drawX, drawY;
      if (imgAspect > areaAspect) {
        drawHeight = imgHeight - 4;
        drawWidth = drawHeight * imgAspect;
        drawX = x + 4 + (card.width - 8 - drawWidth) / 2;
        drawY = y + 4;
      } else {
        drawWidth = card.width - 8;
        drawHeight = drawWidth / imgAspect;
        drawX = x + 4;
        drawY = y + 4 + (imgHeight - 4 - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
      // Placeholder
      ctx.fillStyle = '#1a2f1a';
      ctx.fillRect(x + 4, y + 4, card.width - 8, imgHeight - 4);

      // Initial
      const initial = (work.title_display || '?').charAt(0).toUpperCase();
      ctx.fillStyle = '#a8d4e6';
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, x + card.width / 2, y + imgHeight / 2);
    }

    ctx.restore();

    const workType = work.work_type || '';
    const workTitle = work.title_display || '';
    const workCreator = typeof getCreator === 'function' ? getCreator(work) : work.creator;
    const workYear = work.date_created_year || '';

    // Type badge
    const typeColors = {
      movie: '#9b8ec4',
      film: '#9b8ec4',
      artwork: '#d4a847',
      painting: '#d4a847'
    };
    const badgeColor = typeColors[workType?.toLowerCase()] || '#a8d4e6';
    ctx.fillStyle = badgeColor;
    CanvasUtils.roundRect(ctx, x + 8, y + 8, 40, 16, 4);
    ctx.fill();

    ctx.fillStyle = '#1a2f1a';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(workType || 'work', x + 28, y + 16);

    // Title
    const textY = y + imgHeight + padding;
    ctx.fillStyle = '#f5f0e8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const title = truncateText(workTitle || 'Untitled', card.width - 16, ctx);
    ctx.fillText(title, x + card.width / 2, textY);

    // Creator/Year
    ctx.fillStyle = '#b8b0a4';
    ctx.font = '10px Inter, sans-serif';
    const meta = `${workCreator || 'Unknown'} · ${workYear || '?'}`;
    const truncMeta = truncateText(meta, card.width - 16, ctx);
    ctx.fillText(truncMeta, x + card.width / 2, textY + 16);
  }

  /**
   * Draw glance card content (168x224)
   * Shows: Image (60%), Title, Creator/Year, Glance text, Stats
   */
  function drawGlanceCard(card, x, y) {
    const work = card.work;
    const imgHeight = card.height * 0.5;
    const padding = 10;

    // Image area
    ctx.save();
    ctx.beginPath();
    CanvasUtils.roundRect(ctx, x + 4, y + 4, card.width - 8, imgHeight - 4, 6);
    ctx.clip();

    const img = getCachedImage(card.id);
    if (img) {
      const imgAspect = img.width / img.height;
      const areaAspect = (card.width - 8) / (imgHeight - 4);

      let drawWidth, drawHeight, drawX, drawY;
      if (imgAspect > areaAspect) {
        drawHeight = imgHeight - 4;
        drawWidth = drawHeight * imgAspect;
        drawX = x + 4 + (card.width - 8 - drawWidth) / 2;
        drawY = y + 4;
      } else {
        drawWidth = card.width - 8;
        drawHeight = drawWidth / imgAspect;
        drawX = x + 4;
        drawY = y + 4 + (imgHeight - 4 - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
      ctx.fillStyle = '#1a2f1a';
      ctx.fillRect(x + 4, y + 4, card.width - 8, imgHeight - 4);

      // Initial
      const initial = (work.title_display || '?').charAt(0).toUpperCase();
      ctx.fillStyle = '#a8d4e6';
      ctx.font = 'bold 40px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, x + card.width / 2, y + imgHeight / 2);
    }

    ctx.restore();

    const workTitle = work.title_display || '';
    const workCreator = typeof getCreator === 'function' ? getCreator(work) : work.creator;
    const workYear = work.date_created_year || '';

    // Title
    let textY = y + imgHeight + padding;
    ctx.fillStyle = '#f5f0e8';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const title = truncateText(workTitle || 'Untitled', card.width - 16, ctx);
    ctx.fillText(title, x + card.width / 2, textY);
    textY += 18;

    // Creator/Year
    ctx.fillStyle = '#b8b0a4';
    ctx.font = '11px Inter, sans-serif';
    const meta = `${workCreator || 'Unknown'} · ${workYear || '?'}`;
    ctx.fillText(truncateText(meta, card.width - 16, ctx), x + card.width / 2, textY);
    textY += 18;

    // Divider
    ctx.strokeStyle = 'rgba(168, 212, 230, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 12, textY);
    ctx.lineTo(x + card.width - 12, textY);
    ctx.stroke();
    textY += 8;

    // Glance text
    const glance = (typeof getAiContent === 'function' ? getAiContent(work, 'glance') : work.glance) || 'No description available';
    ctx.fillStyle = '#b8b0a4';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    const lines = wrapText(glance, card.width - 20, ctx);
    lines.slice(0, 3).forEach(line => {
      ctx.fillText(line, x + 10, textY);
      textY += 13;
    });

    // Stats row at bottom
    const statsY = y + card.height - 20;
    ctx.fillStyle = '#a8d4e6';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';

    const placesCount = work.places?.length || 0;
    const connectionsCount = card.connectionCount || 0;

    ctx.fillText(`Places: ${placesCount}`, x + 10, statsY);
    ctx.fillText(`Links: ${connectionsCount}`, x + card.width - 50, statsY);
  }

  /**
   * Draw full card content (240x320)
   * Shows: Image (50%), Title, Creator/Year, Glance, Connections, Action buttons
   */
  function drawFullCard(card, x, y) {
    const work = card.work;
    const imgHeight = card.height * 0.45;
    const padding = 12;

    // Image area
    ctx.save();
    ctx.beginPath();
    CanvasUtils.roundRect(ctx, x + 4, y + 4, card.width - 8, imgHeight - 4, 6);
    ctx.clip();

    const img = getCachedImage(card.id);
    if (img) {
      const imgAspect = img.width / img.height;
      const areaAspect = (card.width - 8) / (imgHeight - 4);

      let drawWidth, drawHeight, drawX, drawY;
      if (imgAspect > areaAspect) {
        drawHeight = imgHeight - 4;
        drawWidth = drawHeight * imgAspect;
        drawX = x + 4 + (card.width - 8 - drawWidth) / 2;
        drawY = y + 4;
      } else {
        drawWidth = card.width - 8;
        drawHeight = drawWidth / imgAspect;
        drawX = x + 4;
        drawY = y + 4 + (imgHeight - 4 - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
      ctx.fillStyle = '#1a2f1a';
      ctx.fillRect(x + 4, y + 4, card.width - 8, imgHeight - 4);

      // Initial
      const initial = (work.title_display || '?').charAt(0).toUpperCase();
      ctx.fillStyle = '#a8d4e6';
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, x + card.width / 2, y + imgHeight / 2);
    }

    ctx.restore();

    const workTitle = work.title_display || '';
    const workCreator = typeof getCreator === 'function' ? getCreator(work) : work.creator;
    const workYear = work.date_created_year || '';

    // Title
    let textY = y + imgHeight + padding;
    ctx.fillStyle = '#f5f0e8';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(truncateText(workTitle || 'Untitled', card.width - 20, ctx), x + card.width / 2, textY);
    textY += 22;

    // Creator/Year
    ctx.fillStyle = '#b8b0a4';
    ctx.font = '12px Inter, sans-serif';
    const meta = `${workCreator || 'Unknown'} · ${workYear || '?'}`;
    ctx.fillText(meta, x + card.width / 2, textY);
    textY += 20;

    // Divider
    ctx.strokeStyle = 'rgba(168, 212, 230, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 16, textY);
    ctx.lineTo(x + card.width - 16, textY);
    ctx.stroke();
    textY += 10;

    // Glance section
    ctx.fillStyle = '#d4a847';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('GLANCE', x + 12, textY);
    textY += 14;

    // Glance text
    const glance = (typeof getAiContent === 'function' ? getAiContent(work, 'glance') : work.glance) || 'No description available';
    ctx.fillStyle = '#b8b0a4';
    ctx.font = '10px Inter, sans-serif';
    const lines = wrapText(glance, card.width - 24, ctx);
    lines.slice(0, 2).forEach(line => {
      ctx.fillText(line, x + 12, textY);
      textY += 13;
    });
    textY += 6;

    // Connected works section
    const connectedEdges = edges.filter(e => e.source === card.id || e.target === card.id);
    if (connectedEdges.length > 0) {
      ctx.fillStyle = '#9b8ec4';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('CONNECTED', x + 12, textY);
      textY += 14;

      ctx.fillStyle = '#b8b0a4';
      ctx.font = '10px Inter, sans-serif';
      const connectedTitles = connectedEdges.slice(0, 3).map(e => {
        const otherId = e.source === card.id ? e.target : e.source;
        const otherCard = cardMap.get(otherId);
        return otherCard ? (otherCard.work.title_display || 'Unknown') : 'Unknown';
      });
      ctx.fillText(truncateText(connectedTitles.join(', '), card.width - 24, ctx), x + 12, textY);
    }

    // Action buttons at bottom
    const btnY = y + card.height - 34;
    const btnWidth = (card.width - 36) / 3;
    const btnHeight = 24;

    ['Story', 'Deep Dive', 'Map'].forEach((label, i) => {
      const btnX = x + 12 + i * (btnWidth + 6);

      // Button background
      ctx.fillStyle = i === 1 ? 'rgba(212, 168, 71, 0.3)' : 'rgba(168, 212, 230, 0.15)';
      CanvasUtils.roundRect(ctx, btnX, btnY, btnWidth, btnHeight, 4);
      ctx.fill();

      // Button border
      ctx.strokeStyle = i === 1 ? 'rgba(212, 168, 71, 0.5)' : 'rgba(168, 212, 230, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Button text
      ctx.fillStyle = i === 1 ? '#d4a847' : '#a8d4e6';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, btnX + btnWidth / 2, btnY + btnHeight / 2);
    });
  }

  /**
   * Draw zoom indicator
   */
  function drawZoomIndicator() {
    const zoomText = `${Math.round(zoomLevel * 100)}%`;
    ctx.fillStyle = 'rgba(45, 74, 62, 0.8)';
    CanvasUtils.roundRect(ctx, 16, height - 40, 50, 24, 4);
    ctx.fill();

    ctx.fillStyle = '#a8d4e6';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(zoomText, 41, height - 28);
  }

  // ========================================
  // TEXT HELPERS
  // ========================================

  /**
   * Truncate text to fit width with ellipsis
   */
  function truncateText(text, maxWidth, context) {
    const metrics = context.measureText(text);
    if (metrics.width <= maxWidth) return text;

    let truncated = text;
    while (context.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
  }

  /**
   * Wrap text to multiple lines
   */
  function wrapText(text, maxWidth, context) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (context.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // ========================================
  // IMAGE HANDLING
  // ========================================

  /**
   * Preload all card images
   */
  function preloadAllImages() {
    cards.forEach(card => {
      const imageUrl = card.work.primary_image_url || '';
      if (imageUrl) {
        preloadImage(imageUrl, card.id);
      }
    });
  }

  /**
   * Preload a single image
   */
  function preloadImage(url, cardId) {
    if (!url || imageCache.has(cardId) || imageLoadingStatus.get(cardId) === 'loading') {
      return;
    }

    imageLoadingStatus.set(cardId, 'loading');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function() {
      imageCache.set(cardId, img);
      imageLoadingStatus.set(cardId, 'loaded');
      needsRedraw = true;
    };

    img.onerror = function() {
      imageLoadingStatus.set(cardId, 'failed');
    };

    img.src = url;
  }

  /**
   * Get cached image for a card
   */
  function getCachedImage(cardId) {
    if (imageLoadingStatus.get(cardId) === 'loaded') {
      return imageCache.get(cardId);
    }
    return null;
  }

  // ========================================
  // INTERACTION
  // ========================================

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', CanvasUtils.throttle(handleMouseMove, 16));
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dblclick', handleDoubleClick);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyDown);

    // Cluster toggle buttons
    document.querySelectorAll('.cluster-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.cluster;
        document.querySelectorAll('.cluster-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        clusterBy(mode);
      });
    });
  }

  /**
   * Get screen position from graph position
   */
  function getScreenPosition(graphX, graphY) {
    const screenX = (graphX - width / 2) * zoomLevel + width / 2 + panX;
    const screenY = (graphY - height / 2) * zoomLevel + height / 2 + panY;
    return { x: screenX, y: screenY };
  }

  /**
   * Get graph position from screen position
   */
  function getGraphPosition(screenX, screenY) {
    const graphX = (screenX - width / 2 - panX) / zoomLevel + width / 2;
    const graphY = (screenY - height / 2 - panY) / zoomLevel + height / 2;
    return { x: graphX, y: graphY };
  }

  /**
   * Find card at screen position
   */
  function getCardAtPosition(screenX, screenY) {
    const graphPos = getGraphPosition(screenX, screenY);

    // Check in reverse order (top card first)
    for (let i = cards.length - 1; i >= 0; i--) {
      const card = cards[i];
      const halfW = card.width / 2;
      const halfH = card.height / 2;

      if (graphPos.x >= card.x - halfW && graphPos.x <= card.x + halfW &&
          graphPos.y >= card.y - halfH && graphPos.y <= card.y + halfH) {
        return card;
      }
    }

    return null;
  }

  function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const card = getCardAtPosition(x, y);

    if (!card) {
      // Start panning
      isPanning = true;
      panStartX = x;
      panStartY = y;
      panStartPanX = panX;
      panStartPanY = panY;
      didPan = false;
      canvas.style.cursor = 'grabbing';
    }
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning) {
      const dx = x - panStartX;
      const dy = y - panStartY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        didPan = true;
      }

      panX = panStartPanX + dx;
      panY = panStartPanY + dy;
      needsRedraw = true;
      return;
    }

    // Update hovered card
    const card = getCardAtPosition(x, y);

    if (hoveredCard !== card) {
      if (hoveredCard) hoveredCard.isHovered = false;
      hoveredCard = card;
      if (hoveredCard) hoveredCard.isHovered = true;
      needsRedraw = true;
    }

    canvas.style.cursor = card ? 'pointer' : 'grab';
  }

  function handleMouseUp() {
    isPanning = false;
    canvas.style.cursor = hoveredCard ? 'pointer' : 'grab';
  }

  function handleMouseLeave() {
    isPanning = false;
    if (hoveredCard) {
      hoveredCard.isHovered = false;
      hoveredCard = null;
      needsRedraw = true;
    }
    canvas.style.cursor = 'default';
  }

  function handleClick(e) {
    if (didPan) {
      didPan = false;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const card = getCardAtPosition(x, y);

    if (card) {
      // Check if clicked on a button in full expansion state
      if (card.expansionState === 'full') {
        const buttonClicked = detectButtonClick(card, x, y);
        if (buttonClicked) {
          handleButtonAction(card, buttonClicked);
          return;
        }
      }

      // Cycle expansion state
      if (card === expandedCard) {
        // Already expanded - cycle through states
        switch (card.expansionState) {
          case 'collapsed':
            card.expansionState = 'glance';
            pushCardsAway(card);
            break;
          case 'glance':
            card.expansionState = 'full';
            pushCardsAway(card);
            break;
          case 'full':
            card.expansionState = 'collapsed';
            expandedCard = null;
            break;
        }
      } else {
        // Collapse previously expanded card
        if (expandedCard) {
          expandedCard.expansionState = 'collapsed';
        }
        // Expand this card to glance
        card.expansionState = 'glance';
        expandedCard = card;
        pushCardsAway(card);
      }

      needsRedraw = true;
    } else {
      // Click on empty space - collapse expanded card
      if (expandedCard) {
        expandedCard.expansionState = 'collapsed';
        expandedCard = null;
        needsRedraw = true;
      }
    }
  }

  /**
   * Detect which button was clicked in a full card
   * @returns {string|null} 'story', 'deepdive', 'map', or null
   */
  function detectButtonClick(card, screenX, screenY) {
    const graphPos = getGraphPosition(screenX, screenY);

    // Button dimensions (from drawFullCard)
    const cardX = card.x - card.width / 2;
    const cardY = card.y - card.height / 2;
    const btnY = cardY + card.height - 34;
    const btnWidth = (card.width - 36) / 3;
    const btnHeight = 24;

    // Check if click is in button row
    if (graphPos.y < btnY || graphPos.y > btnY + btnHeight) {
      return null;
    }

    // Check each button
    const buttons = ['story', 'deepdive', 'map'];
    for (let i = 0; i < 3; i++) {
      const btnX = cardX + 12 + i * (btnWidth + 6);
      if (graphPos.x >= btnX && graphPos.x <= btnX + btnWidth) {
        return buttons[i];
      }
    }

    return null;
  }

  /**
   * Handle button action in full card
   */
  function handleButtonAction(card, button) {
    const work = card.work;
    const sourceParam = work.source === 'api' ? '&source=api' : '';

    switch (button) {
      case 'story':
        // Navigate to work detail with story section focused
        window.location.href = `work-detail.html?id=${work.id}${sourceParam}#story`;
        break;
      case 'deepdive':
        // Navigate to work detail with deep dive section focused
        window.location.href = `work-detail.html?id=${work.id}${sourceParam}#deepdive`;
        break;
      case 'map':
        // Navigate to explore page with work's places shown
        if (work.places && work.places.length > 0) {
          // Store work ID to highlight on explore page
          sessionStorage.setItem('explore_focus_work', work.id);
          window.location.href = `explore.html?work=${work.id}`;
        } else {
          // Work has no places - navigate to explore anyway
          window.location.href = 'explore.html';
        }
        break;
    }
  }

  function handleDoubleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const card = getCardAtPosition(x, y);

    if (card) {
      // Navigate to work detail page
      const sourceParam = card.work.source === 'api' ? '&source=api' : '';
      window.location.href = `work-detail.html?id=${card.work.id}${sourceParam}`;
    }
  }

  function handleWheel(e) {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom
    const delta = -e.deltaY * CanvasUtils.ZOOM_CONFIG.ZOOM_SENSITIVITY;
    const newZoom = CanvasUtils.clamp(
      zoomLevel * (1 + delta),
      CanvasUtils.ZOOM_CONFIG.MIN_ZOOM,
      CanvasUtils.ZOOM_CONFIG.MAX_ZOOM
    );

    // Zoom toward mouse position
    const zoomFactor = newZoom / zoomLevel;
    panX = mouseX - (mouseX - panX) * zoomFactor;
    panY = mouseY - (mouseY - panY) * zoomFactor;

    zoomLevel = newZoom;
    needsRedraw = true;
  }

  // Touch handling
  let lastTouchDist = 0;
  let lastTouchCenter = { x: 0, y: 0 };

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      isPanning = true;
      panStartX = touch.clientX - rect.left;
      panStartY = touch.clientY - rect.top;
      panStartPanX = panX;
      panStartPanY = panY;
      didPan = false;
    } else if (e.touches.length === 2) {
      // Pinch zoom start
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      lastTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      lastTouchCenter = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };
    }
    e.preventDefault();
  }

  function handleTouchMove(e) {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const dx = x - panStartX;
      const dy = y - panStartY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        didPan = true;
      }

      panX = panStartPanX + dx;
      panY = panStartPanY + dy;
      needsRedraw = true;
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const center = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };

      const scale = dist / lastTouchDist;
      const newZoom = CanvasUtils.clamp(
        zoomLevel * scale,
        CanvasUtils.ZOOM_CONFIG.MIN_ZOOM,
        CanvasUtils.ZOOM_CONFIG.MAX_ZOOM
      );

      const rect = canvas.getBoundingClientRect();
      const centerX = center.x - rect.left;
      const centerY = center.y - rect.top;

      const zoomFactor = newZoom / zoomLevel;
      panX = centerX - (centerX - panX) * zoomFactor;
      panY = centerY - (centerY - panY) * zoomFactor;

      zoomLevel = newZoom;
      lastTouchDist = dist;
      lastTouchCenter = center;
      needsRedraw = true;
    }
    e.preventDefault();
  }

  function handleTouchEnd(e) {
    if (e.touches.length === 0) {
      if (!didPan) {
        // Treat as click
        const rect = canvas.getBoundingClientRect();
        const x = panStartX;
        const y = panStartY;
        const card = getCardAtPosition(x, y);

        if (card) {
          if (card === expandedCard) {
            switch (card.expansionState) {
              case 'collapsed':
                card.expansionState = 'glance';
                pushCardsAway(card);
                break;
              case 'glance':
                card.expansionState = 'full';
                pushCardsAway(card);
                break;
              case 'full':
                card.expansionState = 'collapsed';
                expandedCard = null;
                break;
            }
          } else {
            if (expandedCard) {
              expandedCard.expansionState = 'collapsed';
            }
            card.expansionState = 'glance';
            expandedCard = card;
            pushCardsAway(card);
          }
          needsRedraw = true;
        }
      }
      isPanning = false;
      didPan = false;
    }
  }

  function handleKeyDown(e) {
    // Only handle if constellation view is active
    const container = document.getElementById('constellationContainer');
    if (!container || container.style.display === 'none') return;

    switch (e.key) {
      case 'Escape':
        if (expandedCard) {
          expandedCard.expansionState = 'collapsed';
          expandedCard = null;
          needsRedraw = true;
        }
        break;
      case '+':
      case '=':
        zoomLevel = CanvasUtils.clamp(zoomLevel * 1.2, CanvasUtils.ZOOM_CONFIG.MIN_ZOOM, CanvasUtils.ZOOM_CONFIG.MAX_ZOOM);
        needsRedraw = true;
        break;
      case '-':
        zoomLevel = CanvasUtils.clamp(zoomLevel / 1.2, CanvasUtils.ZOOM_CONFIG.MIN_ZOOM, CanvasUtils.ZOOM_CONFIG.MAX_ZOOM);
        needsRedraw = true;
        break;
      case '0':
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        needsRedraw = true;
        break;
    }
  }

  // ========================================
  // ANIMATION LOOP
  // ========================================

  function startAnimation() {
    if (animationId) return;
    animate();
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function animate() {
    // Run physics if needed
    let physicsStabilized = true;
    if (isAnimating) {
      physicsStabilized = simulateStep();
      if (physicsStabilized) {
        isAnimating = false;
      }
      needsRedraw = true;
    }

    // Check if any cards are animating size
    let cardsAnimating = false;
    cards.forEach(card => {
      let targetWidth, targetHeight;
      switch (card.expansionState) {
        case 'glance':
          targetWidth = CARD_SIZES.GLANCE.width;
          targetHeight = CARD_SIZES.GLANCE.height;
          break;
        case 'full':
          targetWidth = CARD_SIZES.FULL.width;
          targetHeight = CARD_SIZES.FULL.height;
          break;
        default:
          targetWidth = CARD_SIZES.COLLAPSED.width;
          targetHeight = CARD_SIZES.COLLAPSED.height;
      }

      if (Math.abs(card.width - targetWidth) > 1 || Math.abs(card.height - targetHeight) > 1) {
        cardsAnimating = true;
      }
    });

    if (cardsAnimating) {
      needsRedraw = true;
    }

    // Render
    if (needsRedraw) {
      draw();
      needsRedraw = false;
    }

    // Continue animation if needed
    if (isAnimating || cardsAnimating || needsRedraw) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
    }
  }

  // ========================================
  // CLEANUP
  // ========================================

  /**
   * Clean up constellation view
   * USE CASE: Called when switching away from constellation view
   */
  function destroyConstellation() {
    stopAnimation();

    // Remove event listeners
    if (canvas) {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dblclick', handleDoubleClick);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    }

    document.removeEventListener('keydown', handleKeyDown);

    // Clear state
    cards = [];
    edges = [];
    cardMap.clear();
    clusters.clear();
    imageCache.clear();
    imageLoadingStatus.clear();

    expandedCard = null;
    hoveredCard = null;

    if (DEBUG_CONSTELLATION) console.log('[Constellation] Destroyed');
  }

  // ========================================
  // PUBLIC API
  // ========================================
  window.Constellation = {
    init: initConstellation,
    destroy: destroyConstellation,
    clusterBy: clusterBy,
    detectBridgeNodes: detectBridgeNodes,
    refresh: function() {
      needsRedraw = true;
      if (!animationId) startAnimation();
    },
    /**
     * Update works displayed in constellation
     * USE CASE: Apply status filter (loved/explored) without full reinit
     */
    setWorks: function(newWorks) {
      if (DEBUG_CONSTELLATION) console.log('[Constellation] setWorks with', newWorks.length, 'works');
      // Rebuild cards and edges with new works
      buildCardsFromWorks(newWorks);
      computeEdges();
      clusterBy(clusterMode);
      runPhysics();
      preloadAllImages();
      needsRedraw = true;
    }
  };

})();
