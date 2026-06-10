/**
 * error-handler.js — Centralized UI error banner display and message mapping.
 * Shows styled error messages below form inputs in the wizard.
 */

const ERROR_MESSAGES = {
  empty_username: 'Please enter a GitHub username.',
  not_found: (username) =>
    `GitHub user '${username}' not found. Please check the username and try again.`,
  rate_limit: 'GitHub API rate limit reached. Please wait a few minutes and try again.',
  network: 'Something went wrong while fetching your GitHub data. Please check your connection and try again.',
  empty_name: 'Please enter your name.',
  empty_tagline: 'Please enter at least one tagline.',
};

/**
 * Displays an error banner with the given message.
 * @param {HTMLElement} bannerEl
 * @param {string} message
 */
function showError(bannerEl, message) {
  if (!bannerEl) return;
  bannerEl.textContent = message;
  bannerEl.classList.add('error-banner--visible');
}

/**
 * Hides the error banner.
 * @param {HTMLElement} bannerEl
 */
function hideError(bannerEl) {
  if (!bannerEl) return;
  bannerEl.textContent = '';
  bannerEl.classList.remove('error-banner--visible');
}

/**
 * Maps a GitHub API error object to a user-facing message.
 * @param {object} error
 * @returns {string}
 */
function getGitHubErrorMessage(error) {
  switch (error.type) {
    case 'not_found':
      return ERROR_MESSAGES.not_found(error.username);
    case 'rate_limit':
      return ERROR_MESSAGES.rate_limit;
    case 'network':
    default:
      return ERROR_MESSAGES.network;
  }
}
