/**
 * preview-renderer.js — Renders markdown into HTML using marked.js
 * inside a github-markdown-css container for accurate GitHub-style preview.
 */

/**
 * Renders markdown string into the preview container.
 * @param {string} markdown
 * @param {HTMLElement} container
 */
function renderPreview(markdown, container) {
  if (!container) return;

  const html = typeof marked !== 'undefined'
    ? marked.parse(markdown, { gfm: true, breaks: true })
    : `<p>Preview unavailable — marked.js not loaded.</p>`;

  container.innerHTML = html;
}

/**
 * Shows the preview section.
 * @param {HTMLElement} section
 */
function showPreviewSection(section) {
  if (section) {
    section.classList.add('preview-section--visible');
  }
}
