/**
 * DOM Utility Functions
 * Shared utilities for HTML escaping and text highlighting
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Raw text to escape
 * @returns {string} HTML-safe escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Escape special regex characters in a string
 * @param {string} string - String to escape
 * @returns {string} Regex-safe string
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlight matching text within a string
 * @param {string} text - Full text to search in
 * @param {string} query - Search query to highlight
 * @param {string} [tag='mark'] - HTML tag to wrap matches (default: 'mark')
 * @param {string} [className=''] - Optional CSS class for the wrapper
 * @returns {string} HTML string with matches wrapped
 */
function highlightMatch(text, query, tag = 'mark', className = '') {
  if (!text) return '';
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const classAttr = className ? ` class="${className}"` : '';
  return escaped.replace(regex, `<${tag}${classAttr}>$1</${tag}>`);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.escapeHtml = escapeHtml;
  window.escapeRegex = escapeRegex;
  window.highlightMatch = highlightMatch;
}
