/**
 * ============================================
 * CANVAS-UTILS.JS - Shared Canvas Utilities
 *
 * USE CASE: Provide reusable zoom/pan, coordinate transforms,
 *           collision avoidance, and animation utilities for
 *           canvas-based visualizations (DNA, Constellation)
 *
 * INTENTION: DRY principle - extract common canvas patterns
 *            to avoid duplication across dna-canvas.js and
 *            constellation-canvas.js
 *
 * VISION: Foundation for immersive, performant visualizations
 *         that capture the "Second Art Brain" aesthetic
 *
 * TRADE-OFF: Module pattern vs ES6 modules - using IIFE for
 *            browser compatibility without build step
 * ============================================
 */

// Expose CanvasUtils globally for other modules to use
window.CanvasUtils = (function() {
  'use strict';

  // ========================================
  // ZOOM/PAN CONSTANTS
  // ========================================
  const ZOOM_CONFIG = {
    MIN_ZOOM: 0.3,
    MAX_ZOOM: 3,
    ZOOM_SENSITIVITY: 0.001,
    DEFAULT_ZOOM: 1
  };

  // ========================================
  // COORDINATE TRANSFORMATION
  // ========================================

  /**
   * Convert screen coordinates to graph/canvas coordinates
   * USE CASE: Click/touch events need to map to actual canvas positions
   * INTENTION: Account for zoom level and pan offset
   *
   * @param {number} screenX - X position in screen/client space
   * @param {number} screenY - Y position in screen/client space
   * @param {number} panX - Current horizontal pan offset
   * @param {number} panY - Current vertical pan offset
   * @param {number} zoomLevel - Current zoom level
   * @param {HTMLCanvasElement} canvas - Canvas element for bounds
   * @returns {{x: number, y: number}} Graph coordinates
   */
  function screenToGraphCoords(screenX, screenY, panX, panY, zoomLevel, canvas) {
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Get screen-relative position
    const relativeX = screenX - rect.left;
    const relativeY = screenY - rect.top;

    // Transform to graph coordinates
    const graphX = (relativeX - centerX - panX) / zoomLevel + centerX;
    const graphY = (relativeY - centerY - panY) / zoomLevel + centerY;

    return { x: graphX, y: graphY };
  }

  /**
   * Convert graph/canvas coordinates to screen coordinates
   * USE CASE: Position tooltips or overlays at node/card locations
   * INTENTION: Reverse of screenToGraphCoords
   *
   * @param {number} graphX - X position in graph space
   * @param {number} graphY - Y position in graph space
   * @param {number} panX - Current horizontal pan offset
   * @param {number} panY - Current vertical pan offset
   * @param {number} zoomLevel - Current zoom level
   * @param {HTMLCanvasElement} canvas - Canvas element for bounds
   * @returns {{x: number, y: number}} Screen coordinates
   */
  function graphToScreenCoords(graphX, graphY, panX, panY, zoomLevel, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const screenX = (graphX - centerX) * zoomLevel + centerX + panX;
    const screenY = (graphY - centerY) * zoomLevel + centerY + panY;

    return { x: screenX, y: screenY };
  }

  // ========================================
  // VIEWPORT CULLING
  // ========================================

  /**
   * Check if an element is within the visible viewport
   * USE CASE: Skip rendering off-screen elements for performance
   * INTENTION: Only draw what the user can see
   *
   * @param {number} x - Element center X
   * @param {number} y - Element center Y
   * @param {number} width - Element width
   * @param {number} height - Element height
   * @param {number} viewportWidth - Canvas width
   * @param {number} viewportHeight - Canvas height
   * @param {number} margin - Extra margin for smooth scrolling (default: 100)
   * @returns {boolean} True if element is in viewport
   */
  function isInViewport(x, y, width, height, viewportWidth, viewportHeight, margin = 100) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return (
      x + halfWidth + margin > 0 &&
      x - halfWidth - margin < viewportWidth &&
      y + halfHeight + margin > 0 &&
      y - halfHeight - margin < viewportHeight
    );
  }

  // ========================================
  // COLLISION AVOIDANCE (Rectangle-based)
  // ========================================

  /**
   * Apply collision avoidance to prevent rectangular cards from overlapping
   * USE CASE: Constellation view cards should not overlap
   * INTENTION: Push cards apart when they collide
   *
   * @param {Array} items - Array of objects with x, y, width, height properties
   * @param {Object} config - Configuration options
   * @param {number} config.padding - Minimum gap between items (default: 15)
   * @param {number} config.iterations - Resolution passes (default: 10)
   * @param {number} config.strength - Push strength 0-1 (default: 0.5)
   * @param {number} config.boundaryMargin - Distance from canvas edge (default: 50)
   * @param {number} config.canvasWidth - Canvas width for boundaries
   * @param {number} config.canvasHeight - Canvas height for boundaries
   */
  function applyRectCollisionAvoidance(items, config = {}) {
    const {
      padding = 15,
      iterations = 10,
      strength = 0.5,
      boundaryMargin = 50,
      canvasWidth = 1920,
      canvasHeight = 1080
    } = config;

    for (let iter = 0; iter < iterations; iter++) {
      let hasOverlap = false;

      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i];
          const b = items[j];

          // Skip if either is hidden or locked
          if (a._hidden || b._hidden) continue;

          // Calculate overlap using AABB (Axis-Aligned Bounding Box)
          const aHalfW = (a.width || 120) / 2 + padding / 2;
          const aHalfH = (a.height || 160) / 2 + padding / 2;
          const bHalfW = (b.width || 120) / 2 + padding / 2;
          const bHalfH = (b.height || 160) / 2 + padding / 2;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const overlapX = aHalfW + bHalfW - Math.abs(dx);
          const overlapY = aHalfH + bHalfH - Math.abs(dy);

          // Check if overlapping
          if (overlapX > 0 && overlapY > 0) {
            hasOverlap = true;

            // Push in the direction of least overlap
            let pushX = 0;
            let pushY = 0;

            if (overlapX < overlapY) {
              // Push horizontally
              pushX = overlapX * strength * (dx >= 0 ? 1 : -1);
            } else {
              // Push vertically
              pushY = overlapY * strength * (dy >= 0 ? 1 : -1);
            }

            // Apply push (split between both items)
            if (a._locked) {
              b.x += pushX * 2;
              b.y += pushY * 2;
            } else if (b._locked) {
              a.x -= pushX * 2;
              a.y -= pushY * 2;
            } else {
              a.x -= pushX;
              a.y -= pushY;
              b.x += pushX;
              b.y += pushY;
            }
          }
        }
      }

      // Early exit if no overlaps
      if (!hasOverlap) break;
    }

    // Apply boundary constraints
    items.forEach(item => {
      if (item._locked) return;
      const halfW = (item.width || 120) / 2;
      const halfH = (item.height || 160) / 2;

      item.x = Math.max(boundaryMargin + halfW, Math.min(canvasWidth - boundaryMargin - halfW, item.x));
      item.y = Math.max(boundaryMargin + halfH, Math.min(canvasHeight - boundaryMargin - halfH, item.y));
    });
  }

  // ========================================
  // THROTTLE UTILITY
  // ========================================

  /**
   * Throttle a function to limit execution frequency
   * USE CASE: Mouse move handlers, scroll handlers
   * INTENTION: Prevent performance degradation from rapid events
   *
   * @param {Function} fn - Function to throttle
   * @param {number} delay - Minimum milliseconds between calls
   * @returns {Function} Throttled function
   */
  function throttle(fn, delay) {
    let lastCall = 0;
    let timeoutId = null;

    return function throttled(...args) {
      const now = Date.now();
      const remaining = delay - (now - lastCall);

      if (remaining <= 0) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        lastCall = now;
        fn.apply(this, args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          timeoutId = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  /**
   * Debounce a function to delay execution until idle
   * USE CASE: Search input, resize handlers
   * INTENTION: Wait for user to stop typing/resizing before acting
   *
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Milliseconds to wait after last call
   * @returns {Function} Debounced function
   */
  function debounce(fn, delay) {
    let timeoutId = null;

    return function debounced(...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        fn.apply(this, args);
      }, delay);
    };
  }

  // ========================================
  // EASING FUNCTIONS
  // ========================================

  /**
   * Ease-out cubic: fast start, slow end
   * USE CASE: Card expansion, fly-to animations
   * INTENTION: Natural deceleration feel
   *
   * @param {number} t - Progress 0-1
   * @returns {number} Eased value 0-1
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Ease-in-out cubic: slow start and end
   * USE CASE: Smooth transitions, cluster animations
   * INTENTION: Natural acceleration and deceleration
   *
   * @param {number} t - Progress 0-1
   * @returns {number} Eased value 0-1
   */
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Ease-out back: overshoot then settle
   * USE CASE: Playful card entrance
   * INTENTION: Adds personality to animations
   *
   * @param {number} t - Progress 0-1
   * @returns {number} Eased value (can exceed 1 briefly)
   */
  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /**
   * Linear interpolation
   * USE CASE: Smooth value transitions
   *
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} t - Progress 0-1
   * @returns {number} Interpolated value
   */
  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  // ========================================
  // CANVAS HELPERS
  // ========================================

  /**
   * Set up canvas for high-DPI displays
   * USE CASE: Crisp rendering on Retina displays
   * INTENTION: Prevent blurry canvas on modern screens
   *
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   * @param {number} width - Desired logical width
   * @param {number} height - Desired logical height
   * @returns {{width: number, height: number}} Actual pixel dimensions
   */
  function setupHiDPICanvas(canvas, ctx, width, height) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    return { width: width * dpr, height: height * dpr };
  }

  /**
   * Clear canvas with optional background color
   * USE CASE: Frame rendering
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {string} bgColor - Background color (default: transparent)
   */
  function clearCanvas(ctx, width, height, bgColor = null) {
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  /**
   * Draw a rounded rectangle
   * USE CASE: Card backgrounds, buttons
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Top-left X
   * @param {number} y - Top-left Y
   * @param {number} width - Rectangle width
   * @param {number} height - Rectangle height
   * @param {number} radius - Corner radius
   */
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // ========================================
  // PHYSICS HELPERS
  // ========================================

  /**
   * Calculate distance between two points
   *
   * @param {number} x1 - First point X
   * @param {number} y1 - First point Y
   * @param {number} x2 - Second point X
   * @param {number} y2 - Second point Y
   * @returns {number} Distance
   */
  function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Clamp a value between min and max
   *
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum
   * @param {number} max - Maximum
   * @returns {number} Clamped value
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  // ========================================
  // PUBLIC API
  // ========================================
  return {
    // Config
    ZOOM_CONFIG,

    // Coordinate transforms
    screenToGraphCoords,
    graphToScreenCoords,

    // Viewport
    isInViewport,

    // Collision
    applyRectCollisionAvoidance,

    // Utilities
    throttle,
    debounce,
    clamp,
    distance,
    lerp,

    // Easing
    easeOutCubic,
    easeInOutCubic,
    easeOutBack,

    // Canvas helpers
    setupHiDPICanvas,
    clearCanvas,
    roundRect
  };
})();
