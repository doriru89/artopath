/**
 * ============================================
 * HERO-CANVAS.JS - Watercolor Flow Field Background
 * Inspired by: Impressionist + Ghibli Forest aesthetic
 * Features: Simplex noise flow, mouse interaction, spirit particles
 * ============================================
 */

(function() {
  // ----------------------------------------
  // SIMPLEX NOISE ALGORITHM
  // Generates smooth, natural randomness for flow field
  // ----------------------------------------
  const SimplexNoise = (function() {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    const p = new Uint8Array(256);
    for(let i = 0; i < 256; i++) p[i] = i;

    // Shuffle
    for(let i = 255; i > 0; i--) {
      const r = (i * 131) % 256;
      const t = p[i]; p[i] = p[r]; p[r] = t;
    }

    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for(let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }

    const grad3 = new Float32Array([
      1,1,0, -1,1,0, 1,-1,0, -1,-1,0,
      1,0,1, -1,0,1, 1,0,-1, -1,0,-1,
      0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1
    ]);

    return {
      noise2D: function(xin, yin) {
        let n0, n1, n2;
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        let i1, j1;
        if(x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        const gi0 = permMod12[ii + perm[jj]];
        const gi1 = permMod12[ii + i1 + perm[jj + j1]];
        const gi2 = permMod12[ii + 1 + perm[jj + 1]];
        let t0 = 0.5 - x0*x0 - y0*y0;
        if(t0 < 0) n0 = 0.0;
        else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0*3]*x0 + grad3[gi0*3+1]*y0); }
        let t1 = 0.5 - x1*x1 - y1*y1;
        if(t1 < 0) n1 = 0.0;
        else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1*3]*x1 + grad3[gi1*3+1]*y1); }
        let t2 = 0.5 - x2*x2 - y2*y2;
        if(t2 < 0) n2 = 0.0;
        else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2*3]*x2 + grad3[gi2*3+1]*y2); }
        return 70.0 * (n0 + n1 + n2);
      }
    };
  })();

  // ----------------------------------------
  // WATERCOLOR FLOW ENGINE
  // ----------------------------------------
  // ========================================
  // PERFORMANCE UTILITIES
  // ========================================
  const throttle = (fn, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  };

  /**
 * FILE: hero-canvas.js
 * PURPOSE: Visual Effects (Watercolor Flow)
 * CONTEXT: Implements the simplex noise flow field animation for the landing page.
 */
  class GhibliFlowEngine {
    constructor() {
      this.canvas = document.getElementById('heroCanvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.animationFrame = null;
      this.eventListeners = [];
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      // Visibility tracking (for performance - stop when not visible)
      this.isVisible = true;
      this.isInViewport = true;

      // Mouse interaction
      this.mouse = { x: -1000, y: -1000, active: false };

      // Ghibli Forest Palette
      this.palette = {
        bg: [26, 47, 26],           // forest-deep
        flow: [
          [45, 74, 62],              // forest-mid (Totoro forest)
          [74, 107, 93],             // forest-light
          [168, 212, 230],           // spirit-glow
          [155, 142, 196],           // spirit-purple
        ],
        spirit: [168, 212, 230],     // spirit particles
        gold: [212, 168, 71]         // accent-gold
      };

      // Flow particles
      this.particles = [];

      // Spirit particles (floating dust/fireflies)
      this.spirits = [];

      this.init();
    }

    init() {
      this.resize();

      // Store event listeners for cleanup
      const resizeHandler = throttle(() => this.resize(), 100); // Throttle resize
      const mouseMoveHandler = throttle((e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
      }, 16); // Throttle to ~60fps
      const mouseLeaveHandler = () => {
        this.mouse.active = false;
      };

      // Page Visibility API - stop animation when tab is hidden
      const visibilityHandler = () => {
        this.isVisible = !document.hidden;
        if (this.isVisible && this.isInViewport) {
          this.start();
        } else {
          this.stop();
        }
      };

      window.addEventListener('resize', resizeHandler);
      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseleave', mouseLeaveHandler);
      document.addEventListener('visibilitychange', visibilityHandler);

      // Store for cleanup
      this.eventListeners = [
        { target: window, type: 'resize', handler: resizeHandler },
        { target: window, type: 'mousemove', handler: mouseMoveHandler },
        { target: window, type: 'mouseleave', handler: mouseLeaveHandler },
        { target: document, type: 'visibilitychange', handler: visibilityHandler }
      ];

      // Intersection Observer - stop animation when scrolled out of view
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          this.isInViewport = entries[0].isIntersecting;
          if (this.isInViewport && this.isVisible) {
            this.start();
          } else {
            this.stop();
          }
        }, { threshold: 0.1 });
        this.observer.observe(this.canvas);
      }

      this.initParticles();
      this.initSpirits();
      this.start();
    }

    // Start animation loop (if not already running)
    start() {
      if (!this.animationFrame && this.isVisible && this.isInViewport) {
        this.animate();
      }
    }

    // Stop animation loop
    stop() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Clear on resize
      const bg = this.palette.bg;
      this.ctx.fillStyle = `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`;
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.initParticles();
      this.initSpirits();
    }

    initParticles() {
      this.particles = [];

      // Adaptive particle count based on device capability
      const isMobile = this.width < 600;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const isHighDPI = devicePixelRatio > 1.5;

      // Reduce particles on mobile and high-DPI displays
      let count = 800; // Base count
      if (isMobile) {
        count = 400;
      } else if (isHighDPI) {
        count = 600; // Reduce on retina displays
      }

      // Simple performance check - reduce if frame time is high
      if (window.performance && window.performance.now) {
        const testStart = performance.now();
        for (let i = 0; i < 1000; i++) {
          Math.random() * Math.sin(i);
        }
        const testTime = performance.now() - testStart;
        if (testTime > 2) { // Slow device detected
          count = Math.floor(count * 0.7);
        }
      }

      for(let i = 0; i < count; i++) {
        // Pick random color from flow palette
        const colorIdx = Math.floor(Math.random() * this.palette.flow.length);
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: 0,
          vy: 0,
          baseSpeed: 0.3 + Math.random() * 1.0,
          color: this.palette.flow[colorIdx],
          alpha: 0.02 + Math.random() * 0.04
        });
      }
    }

    initSpirits() {
      this.spirits = [];
      // Adaptive spirit count
      const isMobile = this.width < 600;
      const count = isMobile ? 15 : 35; // Reduced from 20/50

      for(let i = 0; i < count; i++) {
        // Mix between spirit-glow and gold
        const isGold = Math.random() > 0.7;
        this.spirits.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: 1 + Math.random() * 2.5,
          speedY: -0.15 - Math.random() * 0.3,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.008 + Math.random() * 0.015,
          alpha: 0.4 + Math.random() * 0.5,
          pulse: Math.random() * Math.PI * 2,
          color: isGold ? this.palette.gold : this.palette.spirit
        });
      }
    }

    drawBackground() {
      // Semi-transparent overlay creates trail effect
      const bg = this.palette.bg;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.fillStyle = `rgba(${bg[0]}, ${bg[1]}, ${bg[2]}, 0.08)`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawFlowField(now) {
      const time = now * 0.00008;

      // Screen blend mode for glowing effect
      this.ctx.globalCompositeOperation = 'screen';

      this.particles.forEach(p => {
        // 1. Calculate flow angle using Simplex Noise
        const noiseScale = 0.0015;
        const theta = SimplexNoise.noise2D(
          p.x * noiseScale,
          p.y * noiseScale + time
        ) * Math.PI * 2;

        // 2. Mouse repulsion (gentle push)
        if(this.mouse.active) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if(dist < 180) {
            const force = (180 - dist) / 180;
            p.vx += (dx / dist) * force * 1.5;
            p.vy += (dy / dist) * force * 1.5;
          }
        }

        // 3. Apply flow vector
        p.vx += Math.cos(theta) * 0.08;
        p.vy += Math.sin(theta) * 0.08;

        // 4. Friction (drag)
        p.vx *= 0.97;
        p.vy *= 0.97;

        // 5. Move particle
        p.x += p.vx + Math.cos(theta) * p.baseSpeed;
        p.y += p.vy + Math.sin(theta) * p.baseSpeed;

        // 6. Wrap around edges
        if(p.x < 0) p.x = this.width;
        if(p.x > this.width) p.x = 0;
        if(p.y < 0) p.y = this.height;
        if(p.y > this.height) p.y = 0;

        // 7. Draw particle
        this.ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    drawSpirits() {
      // Additive blend for glow
      this.ctx.globalCompositeOperation = 'lighter';

      this.spirits.forEach(s => {
        // Update position
        s.y += s.speedY;
        s.x += Math.sin(s.wobble) * 0.4;
        s.wobble += s.wobbleSpeed;
        s.pulse += 0.025;

        // Reset if off screen
        if(s.y < -10) {
          s.y = this.height + 10;
          s.x = Math.random() * this.width;
        }

        // Pulsing alpha
        const pulseAlpha = s.alpha * (0.6 + Math.sin(s.pulse) * 0.4);

        // Glow effect (outer ring)
        const c = s.color;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${pulseAlpha * 0.15})`;
        this.ctx.fill();

        // Core particle
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${pulseAlpha})`;
        this.ctx.fill();
      });
    }

    drawCenterGlow(now) {
      // Portal glow in center
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      const time = now * 0.001;

      this.ctx.globalCompositeOperation = 'lighter';

      const glowIntensity = 0.06 + Math.sin(time * 0.5) * 0.03;
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 50,
        centerX, centerY, 350
      );

      gradient.addColorStop(0, `rgba(168, 212, 230, ${glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(168, 212, 230, ${glowIntensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(168, 212, 230, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    animate() {
      // Only animate if visible and in viewport
      if (!this.isVisible || !this.isInViewport) {
        this.animationFrame = null;
        return;
      }

      // Get timestamp once per frame (avoid multiple Date.now() calls)
      const now = Date.now();

      this.drawBackground();
      this.drawFlowField(now);
      this.drawSpirits();
      this.drawCenterGlow(now);

      this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    // Cleanup method to stop animation and remove event listeners
    destroy() {
      // Cancel animation
      this.stop();

      // Disconnect intersection observer
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      // Remove event listeners
      this.eventListeners.forEach(({ target, type, handler }) => {
        target.removeEventListener(type, handler);
      });
      this.eventListeners = [];

      // Clear particles
      this.particles = [];
      this.spirits = [];

      // Clear canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  // Initialize and expose for potential cleanup
  window.heroCanvasEngine = new GhibliFlowEngine();
})();
