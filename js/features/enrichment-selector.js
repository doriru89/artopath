/**
 * Enrichment Selector Module for Artopath
 *
 * USE CASE: Bottom sheet for selecting which sections to generate with AI
 * INTENTION: Allow granular control over AI generation instead of all-or-nothing
 * VISION: Supports "template first + AI on demand" flow where users can selectively enrich sections
 * TRADE-OFF: Additional UI step before generation vs immediate generation on FAB click
 *
 * This module handles:
 * 1. Bottom sheet UI with section checkboxes
 * 2. Quick action presets (Fill Missing, Deep Dive Everything)
 * 3. Mode toggle (Standard vs Deep Research)
 * 4. Pre-selection of missing sections based on content completeness
 */

// USE CASE: Section definitions for AI enrichment selection
// INTENTION: Single source of truth for section metadata
// VISION: Each section maps to Work Template sections from ARTOPATH_SPEC
// NOTE: places has layered=true for 3-layer enrichment (local > API > AI)
const ENRICHMENT_SECTIONS = [
  { id: 'glance', label: 'Glance', description: 'One-line summary' },
  { id: 'whyItMatters', label: 'Why It Matters', description: 'Cultural significance' },
  { id: 'story', label: 'Story', description: 'Context + themes' },
  { id: 'culturalLineage', label: 'Cultural Lineage', description: 'Influences + timeline' },
  { id: 'people', label: 'People Graph', description: 'Creators + cast' },
  { id: 'places', label: 'Places', description: 'Locations + maps', layered: true, allowAIAddition: true },
  { id: 'voices', label: 'Voices', description: 'Quotes + reviews' },
  { id: 'tags', label: 'Tags', description: 'Theme, emotion, genre' },
  { id: 'observations', label: 'Observations', description: 'Visual details' },
  { id: 'deepDive', label: 'Deep Dive', description: 'Extended analysis' }
];

const EnrichmentSelector = {
  // Configuration
  DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

  // State
  isOpen: false,
  currentWork: null,
  selectedSections: new Set(),
  selectedMode: 'standard', // 'standard' | 'deep_research'
  addAIToPlaces: false, // Whether to add AI locations on top of existing
  placesLocalData: null, // Cached local places data for display

  // DOM references (cached on open)
  elements: {
    sheet: null,
    backdrop: null,
    checkboxes: null,
    generateBtn: null,
    modeRadios: null
  },

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Open the enrichment selector bottom sheet
   * @param {Object} work - The current work object
   */
  open(work) {
    if (!work) {
      console.warn('[EnrichmentSelector] Cannot open without work object');
      return;
    }

    this.currentWork = work;
    this.isOpen = true;

    // Render the bottom sheet if not already in DOM
    this._ensureSheetExists();

    // Pre-select missing sections
    this._preselectMissingSections();

    // Update the UI
    this._updateUI();

    // Show with animation
    this._show();

    if (this.DEBUG) {
      console.log('[EnrichmentSelector] Opened for work:', work.title_display || work.title);
    }
  },

  /**
   * Close the bottom sheet
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this._hide();

    if (this.DEBUG) {
      console.log('[EnrichmentSelector] Closed');
    }
  },

  /**
   * Get current selection state
   * @returns {Object} { sections: string[], mode: string, addAIToPlaces: boolean }
   */
  getSelection() {
    return {
      sections: Array.from(this.selectedSections),
      mode: this.selectedMode,
      addAIToPlaces: this.addAIToPlaces
    };
  },

  // ============================================
  // RENDERING
  // ============================================

  /**
   * Ensure the bottom sheet HTML exists in the DOM
   * @private
   */
  _ensureSheetExists() {
    if (document.getElementById('enrichmentSheet')) {
      this._cacheElements();
      return;
    }

    const sheetHTML = this._renderSheetHTML();
    document.body.insertAdjacentHTML('beforeend', sheetHTML);
    this._cacheElements();
    this._attachEventListeners();
  },

  /**
   * Render the complete bottom sheet HTML
   * @private
   */
  _renderSheetHTML() {
    // USE CASE: Render bottom sheet with work title
    // INTENTION: Use direct field access for consistent field access
    const workTitle = this._escapeHtml(
      (this.currentWork ? (this.currentWork.title_display || this.currentWork.title) : '') || 'this work'
    );

    return `
    <!-- Enrichment Selector Backdrop -->
    <div id="enrichmentBackdrop" class="enrichment-backdrop" aria-hidden="true"></div>

    <!-- Enrichment Selector Bottom Sheet -->
    <div id="enrichmentSheet" class="enrichment-sheet" role="dialog" aria-modal="true" aria-labelledby="enrichmentTitle">
      <div class="enrichment-sheet-inner">
        <!-- Drag handle for mobile -->
        <div class="enrichment-drag-handle" aria-hidden="true"></div>

        <!-- Header -->
        <header class="enrichment-header">
          <h2 id="enrichmentTitle" class="enrichment-title">
            <span class="enrichment-title-icon">&#x1F3A8;</span>
            Enrich "<span id="enrichmentWorkTitle">${workTitle}</span>"
          </h2>
        </header>

        <!-- Quick Actions -->
        <section class="enrichment-quick-actions" aria-label="Quick actions">
          <button type="button" class="enrichment-preset enrichment-preset-missing" id="presetMissing">
            <span class="preset-icon">&#x26A1;</span>
            <span class="preset-text">Fill Missing Sections</span>
          </button>
          <button type="button" class="enrichment-preset enrichment-preset-deep" id="presetDeep">
            <span class="preset-icon">&#x1F52C;</span>
            <span class="preset-text">Deep Dive Everything</span>
          </button>
        </section>

        <!-- Section Checkboxes -->
        <section class="enrichment-sections" aria-label="Choose sections to generate">
          <p class="enrichment-sections-label">Or choose sections:</p>
          <div class="enrichment-checkbox-list" id="enrichmentCheckboxList">
            ${this._renderCheckboxes()}
          </div>
        </section>

        <!-- Mode Toggle -->
        <section class="enrichment-mode" aria-label="Generation mode">
          <span class="enrichment-mode-label">Mode:</span>
          <div class="enrichment-mode-options">
            <label class="enrichment-mode-option">
              <input type="radio" name="enrichmentMode" value="standard" checked>
              <span class="mode-radio-custom"></span>
              <span class="mode-text">Standard</span>
            </label>
            <label class="enrichment-mode-option">
              <input type="radio" name="enrichmentMode" value="deep_research">
              <span class="mode-radio-custom"></span>
              <span class="mode-text">Deep Research</span>
            </label>
          </div>
        </section>

        <!-- Footer Actions -->
        <footer class="enrichment-footer">
          <button type="button" class="enrichment-btn enrichment-btn-cancel" id="enrichmentCancel">
            Cancel
          </button>
          <button type="button" class="enrichment-btn enrichment-btn-generate" id="enrichmentGenerate" disabled>
            <span class="btn-text">Generate Selected</span>
            <span class="btn-count" id="enrichmentCount">(0)</span>
          </button>
        </footer>
      </div>
    </div>
    `;
  },

  /**
   * Render checkbox items for each section
   * @private
   */
  _renderCheckboxes() {
    return ENRICHMENT_SECTIONS.map(section => {
      // Check if section already has content
      const hasContent = this._sectionHasContent(section.id);

      // Check if this is a layered section (places)
      const layerInfo = section.layered ? this._getLayerStatus(section.id) : null;

      // Build additional info string (e.g., "12 from Anitabi")
      let extraInfo = '';
      let showAIAddition = false;

      if (layerInfo) {
        if (layerInfo.count > 0) {
          extraInfo = `<span class="checkbox-layer-badge" style="background: ${layerInfo.badgeColor}">${layerInfo.count} from ${layerInfo.sourceName}</span>`;
          showAIAddition = section.allowAIAddition;
        } else {
          extraInfo = '<span class="checkbox-layer-info">Will search APIs, then AI</span>';
        }
      } else if (hasContent) {
        // Non-layered section with content - show enriched badge
        extraInfo = '<span class="enriched-badge">Enriched</span>';
      }

      // AI addition checkbox (only for places with existing local data)
      const aiAdditionHtml = showAIAddition ? `
        <label class="enrichment-ai-addition" data-parent-section="${section.id}">
          <input type="checkbox" class="enrichment-ai-addition-checkbox" value="${section.id}_add_ai">
          <span class="checkbox-custom checkbox-custom-small"></span>
          <span class="ai-addition-text">Add more locations with AI</span>
        </label>
      ` : '';

      // Build CSS classes for checkbox item
      const itemClasses = [
        'enrichment-checkbox-item',
        layerInfo && layerInfo.count > 0 ? 'has-local-data' : '',
        hasContent ? 'already-enriched' : ''
      ].filter(Boolean).join(' ');

      return `
        <label class="${itemClasses}" data-section="${section.id}">
          <input type="checkbox" name="section" value="${section.id}" class="enrichment-checkbox">
          <span class="checkbox-custom"></span>
          <span class="checkbox-label">
            <span class="checkbox-label-main">${this._escapeHtml(section.label)}</span>
            <span class="checkbox-label-desc">${this._escapeHtml(section.description)}</span>
            ${extraInfo}
          </span>
        </label>
        ${aiAdditionHtml}
      `;
    }).join('');
  },

  /**
   * Check if a section already has content
   * Uses canonical field patterns from ADR-018
   * @param {string} sectionId - The section ID to check
   * @returns {boolean} True if section has content
   * @private
   */
  _sectionHasContent(sectionId) {
    const work = this.currentWork;
    if (!work) return false;

    const getNarrative = (section) => {
      if (typeof getAiContent === 'function') {
        return getAiContent(work, section);
      }
      const key = section === 'deep_dive' ? 'deep_dive' : section;
      return work[key];
    };

    switch (sectionId) {
      case 'glance':
        const glance = getNarrative('glance');
        return typeof glance === 'string' ? glance.trim() !== '' : !!glance;

      case 'whyItMatters':
        const storyForWhy = getNarrative('story');
        return !!(storyForWhy?.whyItMatters || storyForWhy?.why_it_matters);

      case 'story':
        const storyContent = getNarrative('story');
        if (!storyContent) return false;
        if (typeof storyContent === 'string') return storyContent.trim() !== '';
        return Object.values(storyContent).some(val =>
          val && (typeof val !== 'string' || val.trim() !== '')
        );

      case 'culturalLineage':
        // Use canonical work_relations[] (per ADR-018)
        return work.work_relations?.some(r =>
          ['inspired_by', 'influenced_by', 'influences'].includes(r.relation_type)
        );

      case 'people':
        // Use canonical person_roles[] (per ADR-018)
        return work.person_roles?.length > 0;

      case 'places':
        return work.places?.length > 0;

      case 'voices':
        return !!(work.voices?.expert || work.voices?.passerby);

      case 'tags':
        // Use canonical tag_relations[] (per ADR-018)
        return work.tag_relations?.some(r =>
          ['theme', 'emotion'].includes(r.tag_type)
        );

      case 'observations':
        return !!(work.observations || getNarrative('story')?.observationDetails || getNarrative('story')?.observation_details);

      case 'deepDive':
        const deepDiveContent = getNarrative('deep_dive');
        return typeof deepDiveContent === 'string'
          ? deepDiveContent.trim() !== ''
          : !!deepDiveContent;

      default:
        return false;
    }
  },

  /**
   * Get layer status for a layered section
   * @private
   */
  _getLayerStatus(sectionId) {
    if (sectionId !== 'places') return null;

    const work = this.currentWork;
    if (!work) return { count: 0, sourceName: '', badgeColor: '#757575' };

    // Check work.places for existing data
    const places = work.places || [];
    if (places.length === 0) {
      return { count: 0, sourceName: '', badgeColor: '#757575' };
    }

    // Determine source from the first place (simplified - could be improved)
    const firstPlace = places[0];
    const source = firstPlace.source || 'local';

    // Source badge colors from location_sources.py
    const SOURCE_COLORS = {
      'curated': '#2E7D32',
      'anitabi': '#FF6B6B',
      'imdb': '#F5C518',
      'set_jetter': '#4CAF50',
      'atlas_of_wonders': '#2196F3',
      'movie_locations': '#9C27B0',
      'ai_generated': '#757575',
      'local': '#2E7D32'
    };

    const SOURCE_NAMES = {
      'curated': 'Curated',
      'anitabi': 'Anitabi',
      'imdb': 'IMDB',
      'imdb_locations': 'IMDB',
      'set_jetter': 'Set-Jetter',
      'atlas_of_wonders': 'Atlas',
      'movie_locations': 'Movie-Locs',
      'ai_generated': 'AI Generated',
      'ai': 'AI Generated',
      'local': 'Curated',
      'api': 'Database',
      'vault': 'AI Enriched',
      'etl': 'Imported',
      'pilgrimage_api': 'Anitabi'
    };

    return {
      count: places.length,
      sourceName: SOURCE_NAMES[source] || 'Local',
      badgeColor: SOURCE_COLORS[source] || '#757575'
    };
  },

  /**
   * Cache DOM element references
   * @private
   */
  _cacheElements() {
    this.elements.sheet = document.getElementById('enrichmentSheet');
    this.elements.backdrop = document.getElementById('enrichmentBackdrop');
    this.elements.checkboxList = document.getElementById('enrichmentCheckboxList');
    this.elements.generateBtn = document.getElementById('enrichmentGenerate');
    this.elements.countSpan = document.getElementById('enrichmentCount');
    this.elements.cancelBtn = document.getElementById('enrichmentCancel');
    this.elements.presetMissing = document.getElementById('presetMissing');
    this.elements.presetDeep = document.getElementById('presetDeep');
    this.elements.workTitle = document.getElementById('enrichmentWorkTitle');
  },

  // ============================================
  // EVENT HANDLING
  // ============================================

  /**
   * Attach all event listeners
   * @private
   */
  _attachEventListeners() {
    // Backdrop click to close
    this.elements.backdrop?.addEventListener('click', () => this.close());

    // Cancel button
    this.elements.cancelBtn?.addEventListener('click', () => this.close());

    // Generate button
    this.elements.generateBtn?.addEventListener('click', () => this._handleGenerate());

    // Preset buttons
    this.elements.presetMissing?.addEventListener('click', () => this._handlePresetMissing());
    this.elements.presetDeep?.addEventListener('click', () => this._handlePresetDeep());

    // Checkbox changes
    this.elements.checkboxList?.addEventListener('change', (e) => {
      if (e.target.classList.contains('enrichment-checkbox')) {
        this._handleCheckboxChange(e.target);
      }
      // Handle AI addition checkbox
      if (e.target.classList.contains('enrichment-ai-addition-checkbox')) {
        this._handleAIAdditionChange(e.target);
      }
    });

    // Mode radio changes
    const modeRadios = document.querySelectorAll('input[name="enrichmentMode"]');
    modeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedMode = e.target.value;
        if (this.DEBUG) console.log('[EnrichmentSelector] Mode changed to:', this.selectedMode);
      });
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Swipe down to close (touch devices)
    this._setupSwipeToClose();
  },

  /**
   * Setup swipe-to-close for touch devices
   * @private
   */
  _setupSwipeToClose() {
    const sheet = this.elements.sheet;
    if (!sheet) return;

    let startY = 0;
    let currentY = 0;

    sheet.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    sheet.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Only allow swipe down
      if (deltaY > 0) {
        sheet.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    sheet.addEventListener('touchend', () => {
      const deltaY = currentY - startY;

      // Close if swiped down more than 100px
      if (deltaY > 100) {
        this.close();
      } else {
        // Reset position
        sheet.style.transform = '';
      }

      startY = 0;
      currentY = 0;
    }, { passive: true });
  },

  /**
   * Handle checkbox change
   * @private
   */
  _handleCheckboxChange(checkbox) {
    const sectionId = checkbox.value;

    if (checkbox.checked) {
      this.selectedSections.add(sectionId);
    } else {
      this.selectedSections.delete(sectionId);
    }

    this._updateGenerateButton();
  },

  /**
   * Handle AI addition checkbox change (for places section)
   * @private
   */
  _handleAIAdditionChange(checkbox) {
    this.addAIToPlaces = checkbox.checked;

    if (this.DEBUG) {
      console.log('[EnrichmentSelector] Add AI to places:', this.addAIToPlaces);
    }
  },

  /**
   * Handle "Fill Missing Sections" preset
   * @private
   */
  _handlePresetMissing() {
    // Get missing sections
    const missing = this._getMissingSections();

    // Clear and select only missing
    this.selectedSections.clear();
    missing.forEach(id => this.selectedSections.add(id));

    // Use standard mode
    this.selectedMode = 'standard';
    this._setModeRadio('standard');

    this._updateCheckboxes();
    this._updateGenerateButton();

    if (this.DEBUG) console.log('[EnrichmentSelector] Preset: Fill Missing -', missing);
  },

  /**
   * Handle "Deep Dive Everything" preset
   * @private
   */
  _handlePresetDeep() {
    // Select ALL sections
    this.selectedSections.clear();
    ENRICHMENT_SECTIONS.forEach(s => this.selectedSections.add(s.id));

    // Force deep research mode
    this.selectedMode = 'deep_research';
    this._setModeRadio('deep_research');

    this._updateCheckboxes();
    this._updateGenerateButton();

    if (this.DEBUG) console.log('[EnrichmentSelector] Preset: Deep Dive Everything');
  },

  /**
   * Handle generate button click
   * @private
   */
  _handleGenerate() {
    if (this.selectedSections.size === 0) {
      console.warn('[EnrichmentSelector] No sections selected');
      return;
    }

    const selection = this.getSelection();

    if (this.DEBUG) {
      console.log('[EnrichmentSelector] Starting generation:', selection);
    }

    // Close the sheet
    this.close();

    // Call WorkEnrichment with the selection
    if (typeof WorkEnrichment !== 'undefined') {
      WorkEnrichment.startGeneration(this.currentWork?.id, selection);
    } else {
      console.error('[EnrichmentSelector] WorkEnrichment module not found');
    }
  },

  // ============================================
  // UI STATE MANAGEMENT
  // ============================================

  /**
   * Pre-select sections that are missing content
   * @private
   */
  _preselectMissingSections() {
    const missing = this._getMissingSections();
    this.selectedSections.clear();
    missing.forEach(id => this.selectedSections.add(id));
  },

  /**
   * Get list of missing section IDs
   * @private
   */
  _getMissingSections() {
    if (typeof WorkEnrichment !== 'undefined') {
      const completeness = WorkEnrichment.checkContentCompleteness(this.currentWork);
      return completeness.missing || [];
    }

    // Fallback: check manually using canonical field patterns (ADR-018)
    const work = this.currentWork;
    if (!work) return ENRICHMENT_SECTIONS.map(s => s.id);

    const missing = [];

    const getNarrative = (section) => {
      if (typeof getAiContent === 'function') {
        return getAiContent(work, section);
      }
      const key = section === 'deep_dive' ? 'deep_dive' : section;
      return work[key];
    };

    // Check each section using canonical fields
    const glance = getNarrative('glance');
    if (!glance || (typeof glance === 'string' && glance.trim() === '')) missing.push('glance');

    const storyForMissing = getNarrative('story');
    if (!(storyForMissing?.whyItMatters || storyForMissing?.why_it_matters)) {
      missing.push('whyItMatters');
    }

    const hasStory = (() => {
      if (!storyForMissing) return false;
      if (typeof storyForMissing === 'string') return storyForMissing.trim() !== '';
      return Object.values(storyForMissing).some(val =>
        val && (typeof val !== 'string' || val.trim() !== '')
      );
    })();
    if (!hasStory) missing.push('story');

    // Cultural Lineage - use canonical work_relations[] (per ADR-018)
    const hasLineage = work.work_relations?.some(r =>
      ['inspired_by', 'influenced_by', 'influences'].includes(r.relation_type)
    );
    if (!hasLineage) missing.push('culturalLineage');

    // People - use canonical person_roles[] (per ADR-018)
    if (!work.person_roles?.length) missing.push('people');

    if (!work.places?.length) missing.push('places');
    if (!work.voices?.expert && !work.voices?.passerby) missing.push('voices');

    // Tags - use canonical tag_relations[] (per ADR-018)
    const hasTags = work.tag_relations?.some(r =>
      ['theme', 'emotion'].includes(r.tag_type)
    );
    if (!hasTags) missing.push('tags');

    if (!work.observations && !(storyForMissing?.observationDetails || storyForMissing?.observation_details)) {
      missing.push('observations');
    }
    if (!work.deep_dive) missing.push('deepDive');

    return missing;
  },

  /**
   * Update all UI elements to match current state
   * @private
   */
  _updateUI() {
    // Update work title using direct field access
    if (this.elements.workTitle && this.currentWork) {
      this.elements.workTitle.textContent = this.currentWork.title_display || this.currentWork.title || 'this work';
    }

    this._updateCheckboxes();
    this._updateGenerateButton();
  },

  /**
   * Update checkbox states to match selectedSections
   * @private
   */
  _updateCheckboxes() {
    const checkboxes = document.querySelectorAll('.enrichment-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = this.selectedSections.has(cb.value);
    });
  },

  /**
   * Update generate button state and count
   * @private
   */
  _updateGenerateButton() {
    const count = this.selectedSections.size;
    const btn = this.elements.generateBtn;
    const countSpan = this.elements.countSpan;

    if (btn) {
      btn.disabled = count === 0;
    }

    if (countSpan) {
      countSpan.textContent = `(${count})`;
    }
  },

  /**
   * Set the mode radio button
   * @private
   */
  _setModeRadio(mode) {
    const radio = document.querySelector(`input[name="enrichmentMode"][value="${mode}"]`);
    if (radio) {
      radio.checked = true;
    }
  },

  // ============================================
  // ANIMATIONS
  // ============================================

  /**
   * Show the bottom sheet with animation
   * @private
   */
  _show() {
    const sheet = this.elements.sheet;
    const backdrop = this.elements.backdrop;

    if (backdrop) {
      backdrop.classList.add('visible');
      backdrop.setAttribute('aria-hidden', 'false');
    }

    if (sheet) {
      // Reset any swipe transform
      sheet.style.transform = '';
      sheet.classList.add('visible');
      sheet.setAttribute('aria-hidden', 'false');

      // Focus the first interactive element for accessibility
      requestAnimationFrame(() => {
        const firstCheckbox = sheet.querySelector('.enrichment-checkbox');
        if (firstCheckbox) firstCheckbox.focus();
      });
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  },

  /**
   * Hide the bottom sheet with animation
   * @private
   */
  _hide() {
    const sheet = this.elements.sheet;
    const backdrop = this.elements.backdrop;

    if (backdrop) {
      backdrop.classList.remove('visible');
      backdrop.setAttribute('aria-hidden', 'true');
    }

    if (sheet) {
      sheet.classList.remove('visible');
      sheet.setAttribute('aria-hidden', 'true');
    }

    // Restore body scroll
    document.body.style.overflow = '';
  },

  // ============================================
  // UTILITIES
  // ============================================

  /**
   * Escape HTML to prevent XSS
   * @private
   */
  _escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Expose globally (per early-poc pattern - no ES6 modules)
window.EnrichmentSelector = EnrichmentSelector;
window.ENRICHMENT_SECTIONS = ENRICHMENT_SECTIONS;
