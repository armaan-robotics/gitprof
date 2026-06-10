/**
 * download.js — Handles README.md file download via Blob generation.
 * Triggers a browser download of the final generated markdown string.
 */

/**
 * Downloads the given markdown content as README.md.
 * @param {string} markdown
 */
function downloadReadme(markdown) {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'README.md';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
