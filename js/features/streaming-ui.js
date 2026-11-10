/**
 * Streaming UI for Artopath Work Detail Page
 *
 * Provides ChatGPT-like streaming experience when AI generates content
 * for newly added works. Uses Server-Sent Events (SSE) to receive
 * progressive updates from the backend.
 *
 * Usage:
 *   work-detail.html?id=new-work-123&stream=true
 *
 * The backend sends SSE events in this format:
 *   event: section
 *   data: {"section": "glance", "content": "...", "done": false}
 *
 * Sections stream in order: glance -> tags -> story -> lineage -> people -> places -> voices -> deepDive
 */

// ============================================
// STREAMING STATE MANAGEMENT
// ============================================

const StreamingUI = {
  // Configuration - uses global API_BASE from api-utils.js
  API_BASE: window.API_BASE || 'http://localhost:8000/api',
  TYPING_SPEED: 8, // ms per character (fast, smooth streaming)
  SECTION_DELAY: 150, // ms delay between sections
  SCROLL_THROTTLE: 200, // ms between scroll updates
  CONNECTION_TIMEOUT: 300000, // 300 second timeout for AI generation
  DEBUG_STREAMING: false, // Set to true for console logs

  // State
  isStreaming: false,
  eventSource: null,
  currentSection: null,
  sectionQueue: [],
  typingTimeout: null,
  connectionTimeout: null,
  lastScrollTime: 0,
  workData: {},
  boundCleanup: null,
  hasReceivedContent: false, // Track when first content arrives
  revealTimeouts: [], // P2-7: Track reveal timeouts for cleanup

  // Section order for progressive reveal
  SECTION_ORDER: [
    'glance',
    'whyItMatters',
    'tags',
    'story',
    'lineage',
    'people',
    'places',
    'voices',
    'deepDive'
  ],

  // Section element mapping
  SECTION_ELEMENTS: {
    glance: 'workGlance',
    whyItMatters: 'whyItMatters',
    story: 'storyContent',
    lineage: 'deepTabCultural',
    places: 'deepTabPlaces',
    people: 'peopleGrid',
    voices: 'deepTabVoices',
    tags: 'workTags',
    deepDive: 'deepTabDeepDive'
  },

  // Tracks sections currently being streamed via text_chunk events
  _streamingSections: {},

  // Story subsection mapping (for typing into pre-existing placeholder blocks)
  STORY_SUBSECTIONS: {
    'whatYourSeeing': 'storySurface',
    'surfaceLayer': 'storySurface',
    'whatItsSaying': 'storyMeaning',
    'corePhilosophy': 'storyMeaning',
    'culturalContext': 'storyContext'
  },

  // Narrative sections that should use typing animation (not batch render)
  TYPING_SECTIONS: ['glance', 'whyItMatters', 'story', 'deepDive'],

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize streaming mode for a work
   * @param {string} workIdOrQuery - The work ID or search query to stream content for
   * @param {Object} initialData - Initial work data (title, image, etc)
   * @param {Object} options - Optional settings { isSearch: boolean }
   */
  init(workIdOrQuery, initialData = {}, options = {}) {
    const isSearch = options.isSearch || false;
    if (this.DEBUG_STREAMING) console.log('[StreamingUI] Initializing for', isSearch ? 'search:' : 'work:', workIdOrQuery);

    this.isStreaming = true;
    this.workData = initialData;
    this.hasReceivedContent = false;
    this.isSearchMode = isSearch;
    this.searchQuery = isSearch ? workIdOrQuery : null;
    this._streamingSections = {};

    // Show loading overlay with title immediately
    this.showLoadingOverlay(initialData.title_display || initialData.title || 'Searching...');

    // Show skeleton UI for sections
    this.showSkeletonUI();

    // Render initial data (title only at start, image comes with seed)
    this.renderInitialData(initialData);

    // Setup cleanup handlers (P0-1 fix: prevent zombie connections)
    this.boundCleanup = () => this.destroy();
    window.addEventListener('beforeunload', this.boundCleanup);
    window.addEventListener('pagehide', this.boundCleanup);

    // Connection timeout (prevent infinite waiting)
    this.connectionTimeout = setTimeout(() => {
      if (this.isStreaming) {
        console.warn('[StreamingUI] Connection timeout after', this.CONNECTION_TIMEOUT, 'ms');
        this.handleStreamError({ type: 'timeout', message: 'AI generation took too long' });
      }
    }, this.CONNECTION_TIMEOUT);

    // Connect to SSE stream (search or work endpoint)
    this.connectToStream(workIdOrQuery, isSearch);

    // Add streaming indicator (will be shown after loading overlay hides)
    this.showStreamingIndicator();
  },

  /**
   * Show loading overlay with work title
   */
  showLoadingOverlay(title) {
    const overlay = document.getElementById('aiLoadingOverlay');
    const titleEl = document.getElementById('aiLoadingTitle');
    const statusEl = document.getElementById('aiLoadingStatus');

    if (overlay) {
      if (titleEl) titleEl.textContent = title || 'Loading...';
      if (statusEl) statusEl.textContent = 'Searching databases...';
      overlay.classList.remove('hidden');
    }
  },

  /**
   * Hide loading overlay (called when first content arrives)
   */
  hideLoadingOverlay() {
    const overlay = document.getElementById('aiLoadingOverlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  },

  /**
   * Update loading overlay status text
   */
  updateLoadingStatus(status) {
    const statusEl = document.getElementById('aiLoadingStatus');
    if (statusEl) {
      statusEl.textContent = status;
    }
  },

  /**
   * Check if we should enter streaming mode
   * @returns {Object} {shouldStream, workId, searchQuery}
   */
  checkStreamingMode() {
    const params = new URLSearchParams(window.location.search);
    const stream = params.get('stream') === 'true';
    const workId = params.get('id');
    const search = params.get('search'); // For AI search results

    return {
      shouldStream: stream,
      workId: workId,
      searchQuery: search
    };
  },

  // ============================================
  // SKELETON UI
  // ============================================

  /**
   * Display skeleton loading states for all sections
   */
  showSkeletonUI() {
    // Add skeleton class to body for global styling
    document.body.classList.add('streaming-mode');

    // Show skeleton for each section (except story - it uses placeholder blocks)
    Object.entries(this.SECTION_ELEMENTS).forEach(([section, elementId]) => {
      const element = document.getElementById(elementId);
      if (element) {
        // Story section: keep the placeholder blocks, don't replace with skeleton
        if (section === 'story') {
          // Just add shimmer effect to story blocks
          element.querySelectorAll('.story-block').forEach(block => {
            block.classList.add('skeleton-shimmer');
          });
        } else {
          element.innerHTML = this.getSkeletonHTML(section);
          element.classList.add('skeleton-container');
        }
      }
    });

    // Special handling for hero section
    const heroGlance = document.getElementById('workGlance');
    if (heroGlance) {
      heroGlance.innerHTML = '<span class="skeleton-text skeleton-text-long"></span>';
      heroGlance.classList.add('skeleton-container');
    }
  },

  /**
   * Get skeleton HTML for a specific section
   */
  getSkeletonHTML(section) {
    const skeletons = {
      glance: `
        <span class="skeleton-text skeleton-text-long"></span>
        <span class="skeleton-text skeleton-text-medium"></span>
      `,
      whyItMatters: `
        <div class="why-it-matters skeleton-container">
          <div class="skeleton-text skeleton-text-short" style="width: 80px; margin-bottom: 8px;"></div>
          <div class="skeleton-text skeleton-text-long"></div>
          <div class="skeleton-text skeleton-text-medium"></div>
        </div>
      `,
      story: `
        <div class="story-grid">
          ${this.getStoryBlockSkeleton()}
          ${this.getStoryBlockSkeleton()}
          ${this.getStoryBlockSkeleton()}
          ${this.getStoryBlockSkeleton()}
        </div>
      `,
      lineage: `
        <div class="lineage-two-columns">
          <div class="lineage-column">
            <div class="lineage-column-header left skeleton-shimmer">
              <span class="skeleton-text" style="width: 100px;"></span>
            </div>
            ${this.getLineageCardSkeleton()}
            ${this.getLineageCardSkeleton()}
          </div>
          <div class="lineage-column">
            <div class="lineage-column-header right skeleton-shimmer">
              <span class="skeleton-text" style="width: 80px;"></span>
            </div>
            ${this.getLineageCardSkeleton()}
            ${this.getLineageCardSkeleton()}
          </div>
        </div>
      `,
      places: `
        <div class="places-grid">
          ${this.getPlaceCardSkeleton()}
          ${this.getPlaceCardSkeleton()}
          ${this.getPlaceCardSkeleton()}
        </div>
      `,
      people: `
        <div class="people-grid">
          ${this.getPersonCardSkeleton()}
          ${this.getPersonCardSkeleton()}
          ${this.getPersonCardSkeleton()}
        </div>
      `,
      voices: `
        <div class="voices-grid">
          ${this.getVoiceCardSkeleton()}
          ${this.getVoiceCardSkeleton()}
        </div>
      `,
      deepDive: `
        <div class="deep-block skeleton-container">
          <div class="skeleton-text skeleton-text-short" style="width: 120px; margin-bottom: 12px;"></div>
          <div class="skeleton-text skeleton-text-long"></div>
          <div class="skeleton-text skeleton-text-long"></div>
          <div class="skeleton-text skeleton-text-medium"></div>
        </div>
      `,
      tags: `
        <div class="chips-container" style="justify-content: center;">
          <span class="skeleton-chip"></span>
          <span class="skeleton-chip"></span>
          <span class="skeleton-chip"></span>
          <span class="skeleton-chip"></span>
          <span class="skeleton-chip"></span>
        </div>
      `
    };

    return skeletons[section] || '<div class="skeleton-text skeleton-text-long"></div>';
  },

  getStoryBlockSkeleton() {
    return `
      <div class="story-block skeleton-container">
        <div class="skeleton-text skeleton-text-short" style="width: 100px; margin-bottom: 12px;"></div>
        <div class="skeleton-text skeleton-text-long"></div>
        <div class="skeleton-text skeleton-text-long"></div>
        <div class="skeleton-text skeleton-text-medium"></div>
      </div>
    `;
  },

  getLineageCardSkeleton() {
    return `
      <div class="lineage-card skeleton-container" style="pointer-events: none;">
        <div class="skeleton-text" style="width: 60px; height: 10px; margin-bottom: 8px;"></div>
        <div class="skeleton-text" style="width: 80%; height: 16px; margin-bottom: 8px;"></div>
        <div class="skeleton-text skeleton-text-medium"></div>
      </div>
    `;
  },

  getPlaceCardSkeleton() {
    return `
      <div class="place-card skeleton-container" style="pointer-events: none;">
        <div class="skeleton-text" style="width: 70%; height: 18px; margin-bottom: 8px;"></div>
        <div class="skeleton-text" style="width: 50%; height: 14px; margin-bottom: 12px;"></div>
        <div class="skeleton-text skeleton-text-long"></div>
      </div>
    `;
  },

  getPersonCardSkeleton() {
    return `
      <div class="person-card skeleton-container" style="pointer-events: none;">
        <div class="skeleton-avatar"></div>
        <div class="person-info">
          <div class="skeleton-text" style="width: 120px; height: 18px; margin-bottom: 8px;"></div>
          <div class="skeleton-text" style="width: 80px; height: 12px; margin-bottom: 8px;"></div>
          <div class="skeleton-text skeleton-text-long"></div>
        </div>
      </div>
    `;
  },

  getVoiceCardSkeleton() {
    return `
      <div class="voice-card skeleton-container">
        <div class="skeleton-text skeleton-text-long" style="margin-left: 24px;"></div>
        <div class="skeleton-text skeleton-text-long" style="margin-left: 24px;"></div>
        <div class="skeleton-text skeleton-text-medium" style="margin-left: 24px;"></div>
        <div class="skeleton-text" style="width: 100px; margin-top: 12px; margin-left: 24px;"></div>
      </div>
    `;
  },

  // ============================================
  // STREAMING INDICATOR
  // ============================================

  showStreamingIndicator() {
    // P2-1: Remove existing indicator if present to prevent duplicates
    const existing = document.getElementById('streamingIndicator');
    if (existing) existing.remove();

    // Create enhanced banner indicator
    const indicator = document.createElement('div');
    indicator.id = 'streamingIndicator';
    indicator.className = 'streaming-indicator';
    indicator.setAttribute('aria-live', 'polite'); // P3-2: Screen reader support
    indicator.setAttribute('role', 'status');
    indicator.innerHTML = `
      <div class="streaming-indicator-content">
        <div class="streaming-dots">
          <span></span><span></span><span></span>
        </div>
        <span class="streaming-text">AI is generating content</span>
        <span class="streaming-section-label" id="streamingSectionLabel">Initializing</span>
        <div class="streaming-progress-container">
          <div class="streaming-progress-bar" id="streamingProgressBar" style="width: 0%"></div>
        </div>
      </div>
    `;
    document.body.appendChild(indicator);

    // Animate in
    requestAnimationFrame(() => {
      indicator.classList.add('visible');
    });
  },

  updateStreamingIndicator(section) {
    const textEl = document.querySelector('.streaming-text');
    const labelEl = document.getElementById('streamingSectionLabel');
    const progressBar = document.getElementById('streamingProgressBar');

    // Section labels and progress percentages
    // Order matches NarrativeStreamingGenerator: glance→whyItMatters→tags→story→lineage→people→places→voices→deepDive
    const sectionInfo = {
      glance: { label: 'Summary', text: 'Writing summary...', progress: 5 },
      whyItMatters: { label: 'Significance', text: 'Assessing significance...', progress: 8 },
      tags: { label: 'Tags', text: 'Classifying themes...', progress: 10 },
      story: { label: 'Story', text: 'Crafting the story...', progress: 30 },
      lineage: { label: 'Lineage', text: 'Tracing cultural lineage...', progress: 50 },
      people: { label: 'People', text: 'Researching creators...', progress: 65 },
      places: { label: 'Deep Dive', text: 'Mapping real-world locations...', progress: 78 },
      voices: { label: 'Deep Dive', text: 'Gathering perspectives...', progress: 88 },
      deepDive: { label: 'Deep Dive', text: 'Writing analysis...', progress: 95 }
    };

    const info = sectionInfo[section] || { label: 'Processing', text: 'Generating content...', progress: 50 };

    if (textEl) {
      textEl.textContent = info.text;
    }

    if (labelEl) {
      labelEl.textContent = info.label;
    }

    if (progressBar) {
      progressBar.style.width = `${info.progress}%`;
    }
  },

  hideStreamingIndicator() {
    const indicator = document.getElementById('streamingIndicator');
    if (indicator) {
      indicator.classList.remove('visible');
      setTimeout(() => indicator.remove(), 300);
    }
  },

  // ============================================
  // SSE CONNECTION
  // ============================================

  /**
   * Connect to Server-Sent Events stream
   * @param {string} workIdOrQuery - Work ID or search query
   * @param {boolean} isSearch - If true, use search endpoint; if false, use work endpoint
   */
  connectToStream(workIdOrQuery, isSearch = false) {
    let url;
    if (isSearch) {
      url = `${this.API_BASE}/stream/?q=${encodeURIComponent(workIdOrQuery)}`;
    } else {
      url = `${this.API_BASE}/stream/?work_id=${encodeURIComponent(workIdOrQuery)}`;
    }

    if (this.DEBUG_STREAMING) console.log('[StreamingUI] Connecting to SSE:', url);

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      if (this.DEBUG_STREAMING) console.log('[StreamingUI] SSE connection opened');
    };

    this.eventSource.onmessage = (event) => {
      this.handleStreamEvent(event);
    };

    // Handle specific event types with safe JSON parsing (P1-4 fix)
    this.eventSource.addEventListener('seed', (event) => {
      try {
        const data = JSON.parse(event.data);
        const seedTitle = data.title_display || data.title;
        const seedImage = data.primary_image_url || data.image;
        if (this.DEBUG_STREAMING) console.log('[StreamingUI] Received seed:', seedTitle, 'image:', seedImage);

        // Update loading overlay status
        this.updateLoadingStatus('Found! Generating content...');

        // Update workData with seed info (for vault persistence)
        // Note: We preserve legacy field names for vault format compatibility
        if (this.workData) {
          if (data.id) this.workData.id = data.id;
          const title = data.title_display || data.title;
          if (title) this.workData.title = title;
          const titleOriginal = data.title_original || data.titleOriginal;
          if (titleOriginal) this.workData.titleOriginal = titleOriginal;
          const image = data.primary_image_url || data.image;
          if (image) this.workData.image = image;
          const year = data.date_created_year || data.year;
          if (year) this.workData.year = year;
          const type = data.work_type || data.type;
          if (type) this.workData.type = type;
          const creator = getCreator(data) || data.creator;
          if (creator) this.workData.creator = creator;
        }

        // Note: Disambiguation feature removed - replaced by regeneration panel
        // See work-enrichment.js for showRegenerationPanel()

        // Update title/image if provided in seed
        if (seedTitle || seedImage) this.renderInitialData(data);

        // Hide loading overlay after short delay to show "Found!" message
        setTimeout(() => {
          this.hideLoadingOverlay();
        }, 500);

        // Immediately persist to vault in search mode so the work shows as explored
        if (this.isSearchMode && this.workData && this.workData.id) {
          this.addToVault(this.workData);
        }

      } catch (e) {
        console.error('[StreamingUI] Failed to parse seed event:', e);
      }
    });

    this.eventSource.addEventListener('text_chunk', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.DEBUG_STREAMING) console.log('[StreamingUI] Text chunk:', data.section, data.chunk?.length, 'chars');
        this.handleTextChunk(data);
      } catch (e) {
        console.error('[StreamingUI] Failed to parse text_chunk event:', e);
      }
    });

    this.eventSource.addEventListener('section', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.DEBUG_STREAMING) console.log('[StreamingUI] Received section:', data.section, 'hasContent:', !!data.content);
        this.handleSectionEvent(data);
      } catch (e) {
        console.error('[StreamingUI] Failed to parse section event:', e, event.data);
      }
    });

    this.eventSource.addEventListener('complete', (event) => {
      try {
        this.handleComplete(JSON.parse(event.data));
      } catch (e) {
        console.error('[StreamingUI] Failed to parse complete event:', e);
        // Still mark as complete even if parse fails
        this.handleComplete({});
      }
    });

    // Handle server-sent "error" events (LLM/RAG errors) separately from connection failures
    this.eventSource.addEventListener('error', (event) => {
      if (event?.data) {
        try {
          const data = JSON.parse(event.data);
          this.handleStreamError(data);
          return;
        } catch (e) {
          this.handleStreamError({ message: 'Stream error occurred' });
          return;
        }
      }
      // If no data, treat as connection error
      this.handleStreamError({ message: 'Connection lost', type: 'connection' });
    });

    // Connection-level errors (network, CORS, etc.)
    this.eventSource.onerror = (error) => {
      console.error('[StreamingUI] SSE connection error:', error);
      // Only handle if we're still streaming (not already completed)
      if (this.isStreaming) {
        this.handleStreamError({ message: 'Connection lost', type: 'connection' });
      }
    };
  },

  /**
   * Handle incoming stream events
   */
  handleStreamEvent(event) {
    try {
      const data = JSON.parse(event.data);
      if (this.DEBUG_STREAMING) console.log('[StreamingUI] Received event:', data);

      if (data.section) {
        this.handleSectionEvent(data);
      } else if (data.complete) {
        this.handleComplete(data);
      }
    } catch (e) {
      console.error('[StreamingUI] Error parsing event:', e);
    }
  },

  /**
   * Handle real-time text chunk from backend token streaming.
   * Appends text directly to the DOM element — no fake typing animation.
   */
  handleTextChunk(data) {
    const section = data.section;
    const chunk = data.chunk;
    if (!chunk) return;

    if (!this.hasReceivedContent) {
      this.hasReceivedContent = true;
      this.hideLoadingOverlay();
    }

    this.updateStreamingIndicator(section);

    const elementId = this.SECTION_ELEMENTS[section];
    if (!elementId) return;

    const el = document.getElementById(elementId);
    if (!el) return;

    if (!this._streamingSections[section]) {
      this._streamingSections[section] = true;
      el.textContent = '';
      el.style.display = 'block';
    }

    el.textContent += chunk;
  },

  /**
   * Handle section content event (batch — full content in one event)
   */
  handleSectionEvent(data) {
    const rawSection = data.section;
    const section = rawSection === 'deep_dive' ? 'deepDive' : rawSection;
    const { content, chunk, done } = data;

    if (!this.hasReceivedContent) {
      this.hasReceivedContent = true;
      this.hideLoadingOverlay();
    }

    this.updateStreamingIndicator(section);

    // If this section was already streamed via text_chunk, skip re-rendering
    if (this._streamingSections[section] && done) {
      this.markSectionComplete(section);
      return;
    }

    if (chunk) {
      this.appendChunk(section, chunk);
    } else if (content) {
      if (this.TYPING_SECTIONS.includes(section)) {
        this.typeNarrativeContent(section, content);
      } else {
        this.renderSection(section, content, done);
      }
    }

    if (done) {
      this.markSectionComplete(section);
    }
  },

  /**
   * Type narrative content into pre-existing placeholder blocks
   * Provides ChatGPT-like real-time typing effect for glance, story, deep dive
   */
  typeNarrativeContent(section, content) {
    if (section === 'story' && typeof content === 'object') {
      // Story has multiple subsections - type each into its block
      this.typeStorySubsections(content);
    } else if (section === 'glance' && typeof content === 'string') {
      this.typeIntoElement('workGlance', content);
    } else if (section === 'whyItMatters' && typeof content === 'string') {
      this.typeIntoElement('whyItMatters', content);
    } else if (section === 'deepDive') {
      const text = typeof content === 'string'
        ? content
        : (content.observation || content.overview || content.text || '');
      if (text) {
        const introEl = document.getElementById('deepDiveIntro');
        if (introEl) {
          introEl.style.display = 'block';
          this.typeIntoElement('deepDiveIntro', text);
        }
      }
    } else if (typeof content === 'string') {
      // Fallback for any string content
      const elementId = this.SECTION_ELEMENTS[section];
      if (elementId) {
        this.typeIntoElement(elementId, content);
      }
    }
  },

  /**
   * Type story subsections into their respective placeholder blocks
   */
  typeStorySubsections(story) {
    // Define subsection groups: first matching property for each element wins
    const subsectionGroups = [
      {
        elementId: 'storySurface',
        props: ['whatYourSeeing', 'surfaceLayer', 'typeAesthetic']
      },
      {
        elementId: 'storyMeaning',
        props: ['whatItsSaying', 'corePhilosophy', 'meaning']
      },
      {
        elementId: 'storyContext',
        props: ['culturalContext']
      }
    ];

    // Type each subsection sequentially with a delay between them
    let delay = 0;
    const SUBSECTION_DELAY = 300; // ms between starting each subsection

    for (const group of subsectionGroups) {
      // Find first matching property
      const matchingProp = group.props.find(prop => story[prop]);
      if (matchingProp && story[matchingProp]) {
        const content = story[matchingProp];
        const elementId = group.elementId;

        setTimeout(() => {
          const blockEl = document.getElementById(elementId);
          if (blockEl) {
            // Find the content container within the block
            const contentEl = blockEl.querySelector('.story-block-content');
            if (contentEl) {
              // Clear placeholder text and start typing
              contentEl.innerHTML = '';
              contentEl.classList.add('streaming');
              this.typeIntoElementDirect(contentEl, content);
            }
          }
        }, delay);
        delay += SUBSECTION_DELAY;
      }
    }
  },

  /**
   * Type text into an element by ID with typing animation
   */
  typeIntoElement(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clear existing content and any skeleton
    element.classList.remove('skeleton-container');
    element.innerHTML = '';
    element.classList.add('streaming');

    this.typeIntoElementDirect(element, text);
  },

  /**
   * Type text directly into an element with character-by-character animation
   */
  typeIntoElementDirect(element, text, callback) {
    if (!element || !text) return;

    // Create typing container
    const typingContainer = document.createElement('span');
    typingContainer.className = 'typing-content';
    element.appendChild(typingContainer);

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '▌';
    element.appendChild(cursor);

    // Type each character
    let index = 0;
    const typeNext = () => {
      if (index < text.length) {
        typingContainer.textContent += text[index];
        index++;

        // Throttled scroll
        const now = Date.now();
        if (now - this.lastScrollTime > this.SCROLL_THROTTLE) {
          cursor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          this.lastScrollTime = now;
        }

        this.typingTimeout = setTimeout(typeNext, this.TYPING_SPEED);
      } else {
        // Typing complete - remove cursor, mark complete
        cursor.remove();
        element.classList.remove('streaming');
        element.classList.add('typed-complete');
        if (callback) callback();
      }
    };

    typeNext();
  },

  /**
   * Handle stream completion
   */
  handleComplete(data) {
    if (this.DEBUG_STREAMING) console.log('[StreamingUI] Stream complete');

    this.isStreaming = false;

    // Clear connection timeout
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    // Clear any pending typing animation
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    // Hide loading overlay if still visible
    this.hideLoadingOverlay();

    this.hideStreamingIndicator();

    // Close SSE connection
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // Remove page unload listeners
    if (this.boundCleanup) {
      window.removeEventListener('beforeunload', this.boundCleanup);
      window.removeEventListener('pagehide', this.boundCleanup);
    }

    // Remove streaming mode class
    document.body.classList.remove('streaming-mode');

    // Invalidate caches so vault/explore/DNA get fresh data with new work
    if (typeof window.invalidateAPICache === 'function') {
      window.invalidateAPICache();
    }
    if (typeof window.invalidateDNACache === 'function') {
      window.invalidateDNACache();
    }

    // Show completion animation
    this.showCompletionAnimation();

    // Store complete work data
    if (data.work) {
      this.workData = data.work;
    }

    // Save to ContentPersistence (localStorage + backend sync)
    if (this.workData && this.workData.id) {
      if (typeof ensureCanonicalNarrative === 'function') {
        ensureCanonicalNarrative(this.workData);
      }
    }

    if (this.workData && this.workData.id && typeof ContentPersistence !== 'undefined') {
      const narrativePayload = {
        glance: this.workData.glance || '',
        story: this.workData.story || null,
        deep_dive: this.workData.deep_dive || null
      };
      ContentPersistence.saveToLocal(this.workData.id, {
        narratives: narrativePayload,
        lineage: this.workData.lineage || this.workData.culturalLineage,
        places: this.workData.places,
        people: this.workData.people || this.workData.peopleGraph,
        voices: this.workData.voices,
        tags: this.workData.tags
      }, {
        source_type: 'ai',
        model_version: 'streaming-gpt-4'
      });
      if (this.DEBUG_STREAMING) console.log('[StreamingUI] Saved to ContentPersistence:', this.workData.id);
    }

    // Add to vault if this is a search-mode work
    if (this.workData && this.workData.id && this.isSearchMode) {
      this.addToVault(this.workData);
    }

    // Update global currentWork reference for work-detail.html
    // This is critical for search-mode works where loadWork() returns early
    if (this.workData) {
      window.currentWork = this.workData;
      if (this.DEBUG_STREAMING) console.log('[StreamingUI] Set window.currentWork:', this.workData.id);

      // Update URL and navigation links that loadWork() skipped in search mode
      if (this.isSearchMode && this.workData.id) {
        const newUrl = `work-detail.html?id=${this.workData.id}&source=api`;
        window.history.replaceState({}, '', newUrl);
        const mapLink = document.getElementById('mapLink');
        if (mapLink) mapLink.href = `explore.html?work=${this.workData.id}`;
        const quickMapLink = document.getElementById('quickMapLink');
        if (quickMapLink) quickMapLink.href = `explore.html?work=${this.workData.id}`;
      }
    }

    // Update WorkEnrichment with the new work data
    if (typeof WorkEnrichment !== 'undefined' && this.workData) {
      WorkEnrichment.updateWork(this.workData);
    }

    // Update FAB visibility - show if content still missing
    if (typeof updateFabVisibility === 'function') {
      updateFabVisibility();
    }

    // Initialize Love button (Add to Constellation) for streaming works
    // This is needed because loadWork() returns early for search-mode works
    if (typeof initLoveButton === 'function') {
      initLoveButton();
    }

    // Show "Wrong work generated?" button after AI content is generated
    if (typeof WorkEnrichment !== 'undefined' && WorkEnrichment.showWrongWorkButton) {
      WorkEnrichment.showWrongWorkButton();
    }
  },

  /**
   * Add a work to the localStorage vault for persistence across sessions
   */
  addToVault(work) {
    if (!work || !work.id) return;

    let vault = [];
    try {
      vault = typeof getVaultData === 'function'
        ? getVaultData().works || []
        : [];
    } catch (e) {
      vault = [];
    }

    // Check if already in vault
    if (vault.find(w => w.id === work.id)) {
      if (this.DEBUG_STREAMING) console.log('[StreamingUI] Work already in vault:', work.id);
      return;
    }

    // Add to vault with essential fields
    // WRITE operation: Use legacy field names for vault format compatibility
    // READ operation: Use direct field access (canonical or legacy fields)
    vault.push({
      id: work.id,
      title: work.title_display || work.title,
      titleOriginal: work.title_original || work.titleOriginal,
      type: work.work_type || work.type || 'movie',
      year: work.date_created_year || work.year,
      image: work.primary_image_url || work.image,
      creator: getCreator(work) || work.creator,
      source: 'search',
      explored: true,  // Per spec §1.3: searched works start as explored
      loved: false,    // User must click Love to promote to DNA/Constellation visibility
      addedAt: Date.now()
    });

    if (this.DEBUG_STREAMING) console.log('[StreamingUI] Added to vault:', work.id);
  },

  handleStreamError(error) {
    console.error('[StreamingUI] Stream error:', error);

    // Fallback: load work normally
    this.isStreaming = false;

    // Clear timeouts
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    // Hide loading overlay
    this.hideLoadingOverlay();

    this.hideStreamingIndicator();

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // Ensure search-mode works are persisted as explored even on error
    if (this.isSearchMode && this.workData && this.workData.id) {
      this.addToVault(this.workData);
    }

    // Show error state with message
    this.showErrorState(error.message || 'Connection error');
  },

  // ============================================
  // CONTENT RENDERING WITH TYPING EFFECT
  // ============================================

  /**
   * Render initial data (title, image, basic metadata)
   * USE CASE: Display work title, poster, and metadata during streaming
   * INTENTION: Use direct field access with fallback to legacy field names
   */
  renderInitialData(data) {
    // Title - use canonical field with legacy fallback
    const titleEl = document.getElementById('workTitle');
    const displayTitle = data.title_display || data.title;
    if (titleEl && displayTitle) {
      titleEl.textContent = displayTitle;
    }

    // Original title - use canonical field with legacy fallback
    const origTitleEl = document.getElementById('workOriginalTitle');
    const originalTitle = data.title_original || data.titleOriginal;
    if (origTitleEl && originalTitle) {
      origTitleEl.textContent = originalTitle;
    }

    // Poster - use canonical field with legacy fallback
    const posterEl = document.getElementById('workPoster');
    const imageUrl = data.primary_image_url || data.image;
    if (posterEl && imageUrl) {
      posterEl.src = imageUrl;
      posterEl.alt = displayTitle || 'Work poster';
    }

    // Metadata chips (if available) - use canonical fields with legacy fallback
    const year = data.date_created_year || data.year;
    const type = data.work_type || data.type;
    if (year || type) {
      this.renderBasicMetadata(data);
    }
  },

  renderBasicMetadata(data) {
    const container = document.getElementById('metadataChips');
    if (!container) return;

    let html = '';

    // Use canonical field with legacy fallback
    const year = data.date_created_year || data.year;
    if (year) {
      html += `
        <span class="metadata-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${year}
        </span>
      `;
    }

    // Use canonical field with legacy fallback
    const type = data.work_type || data.type;
    if (type) {
      const typeLabel = type === 'movie' ? 'Film' :
                       type.charAt(0).toUpperCase() + type.slice(1);
      html += `
        <span class="metadata-chip type-chip">
          ${typeLabel}
        </span>
      `;
    }

    container.innerHTML = html;
  },

  /**
   * Append a chunk of text with typing effect
   */
  appendChunk(section, chunk) {
    const elementId = this.SECTION_ELEMENTS[section];
    const element = document.getElementById(elementId);

    if (!element) return;

    // P1-1 fix: Clear any existing typing animation before starting new one
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    // Remove skeleton if present
    if (element.classList.contains('skeleton-container')) {
      element.classList.remove('skeleton-container');
      element.innerHTML = '<span class="typing-cursor"></span>';
    }

    // Find or create typing container
    let typingContainer = element.querySelector('.typing-content');
    if (!typingContainer) {
      typingContainer = document.createElement('span');
      typingContainer.className = 'typing-content';
      element.insertBefore(typingContainer, element.querySelector('.typing-cursor'));
    }

    // Type each character
    this.typeText(typingContainer, chunk);
  },

  /**
   * Type text character by character (ChatGPT-style)
   */
  typeText(container, text, index = 0) {
    if (index >= text.length) return;

    container.textContent += text[index];

    // P1-3 fix: Throttle scrollIntoView to prevent layout thrashing
    const now = Date.now();
    if (now - this.lastScrollTime > this.SCROLL_THROTTLE) {
      const cursor = container.parentElement?.querySelector('.typing-cursor');
      if (cursor) {
        cursor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      this.lastScrollTime = now;
    }

    this.typingTimeout = setTimeout(() => {
      this.typeText(container, text, index + 1);
    }, this.TYPING_SPEED);
  },

  /**
   * Render a complete section with reveal animation
   */
  renderSection(section, content, done = false) {
    const elementId = this.SECTION_ELEMENTS[section];
    const element = document.getElementById(elementId);

    // Debug logging to diagnose rendering issues
    if (this.DEBUG_STREAMING) console.log('[StreamingUI] renderSection:', section, '→', elementId, 'element:', !!element);

    if (!element) {
      console.warn('[StreamingUI] Element not found for section:', section);
      return;
    }

    // Clear skeleton
    element.classList.remove('skeleton-container');

    // Generate HTML based on section type
    const html = this.generateSectionHTML(section, content);

    // Apply with fade-in animation
    element.style.opacity = '0';
    element.innerHTML = html;

    requestAnimationFrame(() => {
      element.style.transition = 'opacity 0.5s ease';
      element.style.opacity = '1';
    });

    // Mark section parent as revealed (must use 'revealed' class to match CSS rule)
    const sectionParent = element.closest('.detail-section');
    if (sectionParent) {
      sectionParent.classList.add('revealed');
    }
  },

  /**
   * Generate HTML for a section based on content type
   */
  generateSectionHTML(section, content) {
    switch (section) {
      case 'glance':
        return `<span class="typed-text">${this.escapeHtml(content)}</span>`;

      case 'whyItMatters':
        return `
          <div class="why-it-matters-label">Why It Matters</div>
          <div class="why-it-matters-text typed-text">${this.escapeHtml(content)}</div>
        `;

      case 'story':
        return this.generateStoryHTML(content);

      case 'tags':
        return this.generateTagsHTML(content);

      case 'places':
        return this.generatePlacesHTML(content);

      case 'people':
        return this.generatePeopleHTML(content);

      case 'lineage':
        return this.generateLineageHTML(content);

      case 'voices':
        return this.generateVoicesHTML(content);

      case 'deepDive':
        return this.generateDeepDiveHTML(content);

      default:
        return `<div class="typed-text">${this.escapeHtml(content)}</div>`;
    }
  },

  // Section-specific HTML generators
  generateStoryHTML(story) {
    if (!story) return '';

    let html = '<div class="story-grid">';
    let hasContent = false;

    // Section 3.1: What You See (Surface Layer)
    // Handle multiple possible property names from different data sources
    const surfaceContent = story.whatYourSeeing || story.surfaceLayer || story.typeAesthetic;
    if (surfaceContent) {
      hasContent = true;
      html += `
        <div class="story-block story-block-surface story-block-full reveal-item">
          <div class="story-block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="story-block-title">What You See</span>
          </div>
          <div class="story-block-content typed-text">${this.escapeHtml(surfaceContent)}</div>
        </div>
      `;
    }

    // Section 3.2: What It Means (Core Philosophy / Meaning)
    const meaningContent = story.whatItsSaying || story.corePhilosophy || story.meaning;
    if (meaningContent) {
      hasContent = true;
      html += `
        <div class="story-block story-block-meaning reveal-item">
          <div class="story-block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18h6M10 22h4M9 14v-1a2 2 0 0 0 .586-1.414A8 8 0 1 1 15 14v1"></path>
            </svg>
            <span class="story-block-title">What It Means</span>
          </div>
          <div class="story-block-content typed-text">${this.escapeHtml(meaningContent)}</div>
        </div>
      `;
    }

    // Section 3.3: Why It Exists (Cultural Context)
    if (story.culturalContext) {
      hasContent = true;
      html += `
        <div class="story-block story-block-context reveal-item">
          <div class="story-block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span class="story-block-title">Why It Exists</span>
          </div>
          <div class="story-block-content typed-text">${this.escapeHtml(story.culturalContext)}</div>
        </div>
      `;
    }

    // Section 3.4: Type & Aesthetic (only if different from surface content)
    const aestheticContent = story.aesthetic || story.style;
    if (aestheticContent && aestheticContent !== surfaceContent) {
      hasContent = true;
      html += `
        <div class="story-block story-block-aesthetic reveal-item">
          <div class="story-block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span class="story-block-title">Type & Aesthetic</span>
          </div>
          <div class="story-block-content typed-text">${this.escapeHtml(aestheticContent)}</div>
        </div>
      `;
    }

    // Key Insight / Receipt (Notable quote or source)
    const receiptContent = story.receipt || story.keyInsight || story.quote;
    if (receiptContent) {
      hasContent = true;
      html += `
        <div class="story-block story-block-quote story-block-full reveal-item">
          <div class="story-block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="story-block-title">Key Insight</span>
          </div>
          <blockquote class="story-quote typed-text">"${this.escapeHtml(receiptContent)}"</blockquote>
        </div>
      `;
    }

    // Why It Matters (if available and different from cultural context)
    if (story.whyItMatters && story.whyItMatters !== story.culturalContext) {
      hasContent = true;
      html += `
        <div class="story-block story-block-significance story-block-full reveal-item">
          <div class="story-block-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span class="story-block-title">Why It Matters</span>
          </div>
          <div class="story-block-content typed-text">${this.escapeHtml(story.whyItMatters)}</div>
        </div>
      `;
    }

    html += '</div>';

    // If no content was generated, show a helpful message
    if (!hasContent) {
      return '<p class="text-muted">Story content is being generated...</p>';
    }

    return html;
  },

  // USE CASE: Render tags from canonical tag_relations[]
  // INTENTION: Use canonical field access pattern per ADR-018
  // VISION: Display themed tag chips grouped by type
  // TRADE-OFF: Accepts both canonical tag_relations[] and legacy tags{} for backward compatibility
  generateTagsHTML(tagRelations) {
    // Handle both canonical tag_relations[] array and legacy tags{} object
    if (!tagRelations) return '<p class="text-muted">No tags yet.</p>';

    // If legacy format (object with theme/emotion arrays), convert to canonical
    if (!Array.isArray(tagRelations)) {
      const legacyTags = tagRelations;
      tagRelations = [];
      if (legacyTags.theme) {
        legacyTags.theme.forEach(t => tagRelations.push({ tag_type: 'theme', tag_label: t }));
      }
      if (legacyTags.emotion) {
        legacyTags.emotion.forEach(t => tagRelations.push({ tag_type: 'emotion', tag_label: t }));
      }
      if (legacyTags.geo) {
        legacyTags.geo.forEach(t => tagRelations.push({ tag_type: 'geo', tag_label: t }));
      }
      if (legacyTags.genre) {
        legacyTags.genre.forEach(t => tagRelations.push({ tag_type: 'genre', tag_label: t }));
      }
    }

    if (!tagRelations.length) {
      return '<p class="text-muted">No tags yet.</p>';
    }

    // Group by tag type
    const themes = tagRelations.filter(r => r.tag_type === 'theme');
    const emotions = tagRelations.filter(r => r.tag_type === 'emotion');
    const genres = tagRelations.filter(r => r.tag_type === 'genre');
    const geos = tagRelations.filter(r => r.tag_type === 'geo');

    let html = '';

    const renderTagGroup = (tags, label, chipClass) => {
      if (!tags.length) return '';
      return `
        <div class="tag-group">
          <span class="tag-group-label">${label}:</span>
          ${tags.map(t => {
            const tagLabel = t.tag_label || t.tag?.label || '';
            return `<span class="chip chip-${chipClass} reveal-chip">${this.escapeHtml(tagLabel)}</span>`;
          }).join('')}
        </div>
      `;
    };

    html += '<div class="chips-container" style="justify-content: center; flex-wrap: wrap;">';
    html += renderTagGroup(themes, 'Themes', 'theme');
    html += renderTagGroup(emotions, 'Emotions', 'emotion');
    html += renderTagGroup(genres, 'Genres', 'genre');
    html += renderTagGroup(geos, 'Places', 'geo');
    html += '</div>';

    // If no tags rendered, show placeholder
    if (!themes.length && !emotions.length && !genres.length && !geos.length) {
      return '<p class="text-muted">No tags yet.</p>';
    }

    return html;
  },

  generatePlacesHTML(places) {
    if (!places || !places.length) return '<p class="text-muted">No places found yet.</p>';

    // USE CASE: Render place cards with links to Explore map
    // INTENTION: Use direct field access with legacy fallbacks for coordinates
    return places.map(place => {
      // Get coordinates using canonical fields with legacy fallbacks
      const lat = place.latitude !== null && place.latitude !== undefined ? place.latitude : place.lat;
      const lng = place.longitude !== null && place.longitude !== undefined ? place.longitude : place.lng;
      const name = place.name_display || place.name || place.title || place.locationName || 'Unknown Location';
      const location = place.location || place.city || place.country || '';

      return `
        <div class="place-card reveal-item" onclick="window.location.href='explore.html?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}'">
          <div class="place-name">${this.escapeHtml(name)}</div>
          <div class="place-location">${this.escapeHtml(location)}</div>
          <div class="place-connection typed-text">${this.escapeHtml(place.connection || '')}</div>
          ${place.visitable ? '<div class="place-visitable">Open to visitors</div>' : ''}
        </div>
      `;
    }).join('');
  },

  // USE CASE: Render person cards from canonical person_roles[] array
  // INTENTION: Use canonical field access pattern per ADR-018
  // VISION: Display people connected to work via WorkPersonRole
  // TRADE-OFF: Breaking change from legacy people.cast[] format
  generatePeopleHTML(personRoles) {
    // Accept canonical person_roles[] array
    if (!personRoles?.length) return '<p class="text-muted">No people information yet.</p>';

    return personRoles.map(role => {
      // Extract person data from role.person (canonical structure)
      const person = role.person || {};
      const personName = person.name_display || person.name || 'Unknown';
      const personImage = person.image_url || this.getInitialPlaceholder(personName);
      const roleType = role.role_type || '';
      const personBio = person.bio || '';

      return `
      <div class="person-card reveal-item" onclick="openPersonDNA('${this.escapeHtml(personName).replace(/'/g, "\\'")}')">
        <img class="person-image"
             src="${this.escapeHtml(personImage)}"
             alt="${this.escapeHtml(personName)}"
             onerror="this.src='${this.getInitialPlaceholder(personName)}'">
        <div class="person-info">
          <div class="person-name">${this.escapeHtml(personName)}</div>
          <div class="person-role">${this.escapeHtml(roleType)}</div>
          ${personBio ? `<div class="person-bio typed-text">${this.escapeHtml(personBio)}</div>` : ''}
        </div>
      </div>
    `;
    }).join('');
  },

  // USE CASE: Render cultural lineage from canonical work_relations[]
  // INTENTION: Use canonical field access pattern per ADR-018
  // VISION: Display influence relationships with work connections
  // TRADE-OFF: Accepts both canonical work_relations[] and legacy lineage{} for backward compatibility
  generateLineageHTML(workRelations) {
    if (!workRelations) return '<p class="text-muted">No lineage information yet.</p>';

    // Handle both canonical work_relations[] array and legacy lineage{} object
    let influencedBy = [];
    let influences = [];

    if (Array.isArray(workRelations)) {
      // Canonical format: work_relations[] array
      influencedBy = workRelations.filter(r =>
        ['inspired_by', 'influenced_by', 'remake_of', 'adaptation_of'].includes(r.relation_type)
      );
      influences = workRelations.filter(r =>
        ['influences', 'inspired', 'directly_influenced'].includes(r.relation_type)
      );
    } else {
      // Legacy format: lineage{} object with influencedBy/influences arrays
      influencedBy = workRelations.influencedBy || [];
      influences = workRelations.influences || [];
    }

    const hasIncoming = influencedBy.length > 0;
    const hasOutgoing = influences.length > 0;

    if (!hasIncoming && !hasOutgoing) {
      return '<p class="text-muted">Lineage being researched...</p>';
    }

    let html = '<div class="lineage-two-columns">';

    // Left column: Influenced By
    html += `
      <div class="lineage-column">
        <div class="lineage-column-header left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Influenced By</span>
        </div>
        <div class="lineage-cards-list">
    `;

    if (hasIncoming) {
      influencedBy.forEach(item => {
        // Handle both canonical and legacy formats
        const relationType = item.relation_type || item.path || 'inspired_by';
        const work = item.to_work || item.related_work || item;
        const title = work.title_display || work.title || 'Unknown';
        const note = item.note || item.description || '';
        const path = this.escapeHtml(relationType);

        html += `
          <div class="lineage-card reveal-item" data-path="${path}">
            <div class="lineage-card-category">${path.replace(/_/g, ' ').toUpperCase()}</div>
            <div class="lineage-card-title">${this.escapeHtml(title)}</div>
            <div class="lineage-card-note typed-text">${this.escapeHtml(note)}</div>
          </div>
        `;
      });
    } else {
      html += '<div class="lineage-empty">No influences found</div>';
    }

    html += '</div></div>';

    // Right column: Influences
    html += `
      <div class="lineage-column">
        <div class="lineage-column-header right">
          <span>Influences</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
        <div class="lineage-cards-list">
    `;

    if (hasOutgoing) {
      influences.forEach(item => {
        // Handle both canonical and legacy formats
        const relationType = item.relation_type || item.path || 'directly_influenced';
        const work = item.to_work || item.related_work || item;
        const title = work.title_display || work.title || 'Unknown';
        const note = item.note || item.description || '';
        const path = this.escapeHtml(relationType);

        html += `
          <div class="lineage-card influenced reveal-item" data-path="${path}">
            <div class="lineage-card-category">${path.replace(/_/g, ' ').toUpperCase()}</div>
            <div class="lineage-card-title">${this.escapeHtml(title)}</div>
            <div class="lineage-card-note typed-text">${this.escapeHtml(note)}</div>
          </div>
        `;
      });
    } else {
      html += '<div class="lineage-empty">No influences found</div>';
    }

    html += '</div></div></div>';

    return html;
  },

  generateVoicesHTML(voices) {
    if (!voices) return '<p class="text-muted">No voices yet.</p>';

    let html = '<div class="voices-grid">';
    let hasContent = false;

    const expertList = Array.isArray(voices.expert) ? voices.expert : (voices.expert ? [voices.expert] : []);
    const passerbyList = Array.isArray(voices.passerby) ? voices.passerby : (voices.passerby ? [voices.passerby] : []);

    expertList.forEach(v => {
      hasContent = true;
      const quote = typeof v === 'string' ? v : (v.quote || '');
      const source = typeof v === 'string' ? 'Expert perspective' : (v.source || 'Expert perspective');
      html += `
        <div class="voice-card reveal-item">
          <div class="voice-quote typed-text">${this.escapeHtml(quote)}</div>
          <div class="voice-source">— ${this.escapeHtml(source)}</div>
        </div>
      `;
    });

    passerbyList.forEach(v => {
      hasContent = true;
      const quote = typeof v === 'string' ? v : (v.quote || '');
      const source = typeof v === 'string' ? 'Visitor perspective' : (v.context || 'Visitor perspective');
      html += `
        <div class="voice-card passerby reveal-item">
          <div class="voice-quote typed-text">${this.escapeHtml(quote)}</div>
          <div class="voice-source">— ${this.escapeHtml(source)}</div>
        </div>
      `;
    });

    html += '</div>';

    return hasContent ? html : '<p class="text-muted">No voices yet.</p>';
  },

  generateDeepDiveHTML(deepDive) {
    if (!deepDive) return '<p class="text-muted">Deep dive content being generated...</p>';

    let html = '';

    if (deepDive.overview) {
      html += `
        <div class="deep-block reveal-item">
          <div class="deep-block-title">Overview</div>
          <div class="deep-block-content typed-text">${this.escapeHtml(deepDive.overview)}</div>
        </div>
      `;
    }

    if (deepDive.observation) {
      html += `
        <div class="deep-block reveal-item">
          <div class="deep-block-title">Observation</div>
          <div class="deep-block-content typed-text">${this.escapeHtml(deepDive.observation)}</div>
        </div>
      `;
    }

    return html || '<p class="text-muted">Deep dive content being generated...</p>';
  },

  // Utility functions
  getInitialPlaceholder(name, size = 70) {
    const initial = (name || '?').charAt(0).toUpperCase();
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Crect fill='%232d4a3e' width='${size}' height='${size}' rx='${size / 2}'/%3E%3Ctext x='${size / 2}' y='${size / 2 + size / 5}' text-anchor='middle' fill='%23a8d4e6' font-size='${Math.floor(size / 2.5)}' font-family='system-ui'%3E${initial}%3C/text%3E%3C/svg%3E`;
  },

  markSectionComplete(section) {
    const elementId = this.SECTION_ELEMENTS[section];
    const element = document.getElementById(elementId);

    if (element) {
      // Remove typing cursor from all elements
      element.querySelectorAll('.typing-cursor').forEach(cursor => cursor.remove());

      // Remove shimmer effect from story blocks
      if (section === 'story') {
        element.querySelectorAll('.story-block').forEach(block => {
          block.classList.remove('skeleton-shimmer');
        });
      }

      // Add completed class
      element.classList.add('section-complete');

      // P2-7: Track reveal timeouts for cleanup
      // Trigger reveal animations for child elements
      element.querySelectorAll('.reveal-item').forEach((item, index) => {
        const timeout = setTimeout(() => {
          item.classList.add('revealed');
        }, index * 100);
        this.revealTimeouts.push(timeout);
      });

      // Trigger chip animations
      element.querySelectorAll('.reveal-chip').forEach((chip, index) => {
        const timeout = setTimeout(() => {
          chip.classList.add('revealed');
        }, index * 50);
        this.revealTimeouts.push(timeout);
      });
    }
  },

  showCompletionAnimation() {
    // Add enhanced completion banner
    const toast = document.createElement('div');
    toast.className = 'streaming-complete-toast';
    toast.innerHTML = `
      <div class="success-checkmark-circle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="complete-text">Content generated successfully!</span>
      <span class="complete-subtext">All sections are now ready to explore</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },

  showErrorState(message = 'Connection lost') {
    // Show error message and offer retry
    const indicator = document.getElementById('streamingIndicator');
    if (indicator) {
      indicator.innerHTML = `
        <div class="streaming-indicator-content streaming-error" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>${this.escapeHtml(message)}. <button onclick="location.reload()">Retry</button></span>
        </div>
      `;
      indicator.classList.add('visible');
    }
  },

  /**
   * Escape HTML to prevent XSS (P2-3 fix)
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ============================================
  // CLEANUP
  // ============================================

  destroy() {
    if (this.DEBUG_STREAMING) console.log('[StreamingUI] Cleaning up...');

    this.isStreaming = false;

    // Close SSE connection
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // Clear all timeouts
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    // P2-7: Clear reveal animation timeouts
    this.revealTimeouts.forEach(clearTimeout);
    this.revealTimeouts = [];

    // Remove page unload listeners
    if (this.boundCleanup) {
      window.removeEventListener('beforeunload', this.boundCleanup);
      window.removeEventListener('pagehide', this.boundCleanup);
      this.boundCleanup = null;
    }

    // Hide loading overlay if still visible
    this.hideLoadingOverlay();

    this.hideStreamingIndicator();
    document.body.classList.remove('streaming-mode');
  }
};

// Export for use in other files
window.StreamingUI = StreamingUI;

// ============================================
// NOTE: NarrativeStreamUI was removed (dead code)
// AI generation now handled by WorkEnrichment module
// See: js/features/work-enrichment.js
// ============================================
