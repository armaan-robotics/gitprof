/**
 * storage.js — localStorage get/set/clear helpers for wizard state,
 * GitHub data, user details, and generated markdown persistence.
 */

function saveUsername(username) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, username);
}

function getUsername() {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME) || '';
}

function saveGitHubData(user, repos) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  localStorage.setItem(CONFIG.STORAGE_KEYS.REPO_DATA, JSON.stringify(repos));
}

function getGitHubUserData() {
  const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
  return raw ? JSON.parse(raw) : null;
}

function getGitHubRepoData() {
  const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.REPO_DATA);
  return raw ? JSON.parse(raw) : null;
}

function saveUserDetails(details) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
}

function getDefaultUserDetails() {
  return { name: '', taglines: [''], about: '', skills: '', linkedin: '' };
}

function normalizeUserDetails(details) {
  const normalized = { ...getDefaultUserDetails(), ...details };

  if (details.tagline && !details.taglines) {
    normalized.taglines = [details.tagline];
  }

  if (!Array.isArray(normalized.taglines) || normalized.taglines.length === 0) {
    normalized.taglines = [''];
  }

  delete normalized.tagline;
  return normalized;
}

function getUserDetails() {
  const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DETAILS);
  if (!raw) return getDefaultUserDetails();
  return normalizeUserDetails(JSON.parse(raw));
}

function saveCurrentStep(step) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_STEP, String(step));
}

function getCurrentStep() {
  const step = parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_STEP), 10);
  return Number.isNaN(step) ? CONFIG.WIZARD.STEP_GITHUB : step;
}

function saveGeneratedMarkdown(markdown) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.GENERATED_MARKDOWN, markdown);
}

function getGeneratedMarkdown() {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.GENERATED_MARKDOWN) || '';
}

function clearAllStorage() {
  Object.values(CONFIG.STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
