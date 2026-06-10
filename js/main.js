/**
 * main.js — Entry point for builder.html. Wires together all modules,
 * restores wizard state from localStorage, and binds event handlers.
 */

let currentMarkdown = '';
let enableDelayTimer = null;

/**
 * Returns all tagline input values from the DOM.
 * @returns {string[]}
 */
function readTaglinesFromForm() {
  return Array.from(document.querySelectorAll('.tagline-input')).map((input) => input.value.trim());
}

/**
 * Reads Step 2 form values from the DOM.
 * @returns {{ name: string, taglines: string[], about: string, skills: string, linkedin: string }}
 */
function readUserDetailsForm() {
  return {
    name: document.getElementById('input-name').value.trim(),
    taglines: readTaglinesFromForm(),
    about: document.getElementById('input-about').value.trim(),
    skills: document.getElementById('input-skills').value.trim(),
    linkedin: document.getElementById('input-linkedin').value.trim(),
  };
}

/**
 * Creates a tagline input row element.
 * @param {string} value
 * @param {boolean} showRemove
 * @returns {HTMLElement}
 */
function createTaglineRow(value, showRemove) {
  const row = document.createElement('div');
  row.className = 'tagline-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-input tagline-input';
  input.placeholder = 'A short one-liner about you';
  input.value = value || '';

  row.appendChild(input);

  if (showRemove) {
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove-tagline';
    removeBtn.setAttribute('aria-label', 'Remove tagline');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      row.remove();
      updateAddTaglineButton();
    });
    row.appendChild(removeBtn);
  }

  return row;
}

/**
 * Renders tagline inputs (1 to MAX_TAGLINES).
 * @param {string[]} taglines
 */
function renderTaglinesList(taglines) {
  const list = document.getElementById('taglines-list');
  list.innerHTML = '';

  const values = taglines.length > 0 ? taglines : [''];
  const count = Math.min(values.length, CONFIG.MAX_TAGLINES);

  for (let i = 0; i < count; i++) {
    list.appendChild(createTaglineRow(values[i], i > 0));
  }

  updateAddTaglineButton();
}

/**
 * Enables/disables the add-tagline button based on current count.
 */
function updateAddTaglineButton() {
  const btn = document.getElementById('btn-add-tagline');
  const count = document.querySelectorAll('.tagline-input').length;
  btn.disabled = count >= CONFIG.MAX_TAGLINES;
}

/**
 * Populates Step 2 form fields from saved data.
 * @param {object} details
 */
function populateUserDetailsForm(details) {
  const normalized = normalizeUserDetails(details);
  document.getElementById('input-name').value = normalized.name || '';
  document.getElementById('input-about').value = normalized.about || '';
  document.getElementById('input-skills').value = normalized.skills || '';
  document.getElementById('input-linkedin').value = normalized.linkedin || '';
  renderTaglinesList(normalized.taglines);
}

/**
 * Shows the results section with the live preview.
 */
function showPreviewResults() {
  const section = document.getElementById('results-section');
  section.classList.add('results-section--visible');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Shows the Enable button after a short delay.
 * @param {boolean} immediate — skip delay when restoring saved state
 */
function showEnableButton(immediate) {
  const enableSection = document.getElementById('enable-section');

  if (enableDelayTimer) {
    clearTimeout(enableDelayTimer);
    enableDelayTimer = null;
  }

  const reveal = () => {
    enableSection.style.display = 'block';
    requestAnimationFrame(() => {
      enableSection.classList.add('enable-section--visible');
      enableSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  if (immediate) {
    reveal();
    return;
  }

  enableDelayTimer = setTimeout(reveal, CONFIG.ENABLE_DELAY_MS);
}

/**
 * Hides preview and enable sections.
 */
function hideResults() {
  if (enableDelayTimer) {
    clearTimeout(enableDelayTimer);
    enableDelayTimer = null;
  }

  document.getElementById('results-section').classList.remove('results-section--visible');
  const enableSection = document.getElementById('enable-section');
  enableSection.classList.remove('enable-section--visible');
  enableSection.style.display = 'none';
  document.getElementById('preview-content').innerHTML = '';
}

/**
 * Generates markdown, renders preview, then reveals Enable after a delay.
 * @param {boolean} showEnableImmediately
 */
async function generateAndShowResults(showEnableImmediately) {
  const user = getGitHubUserData();
  const repos = getGitHubRepoData();
  const details = getUserDetails();

  if (!user || !repos) return false;

  try {
    currentMarkdown = await generateMarkdown({ user, repos, details });
    saveGeneratedMarkdown(currentMarkdown);

    renderPreview(currentMarkdown, document.getElementById('preview-content'));
    const enableSection = document.getElementById('enable-section');
    enableSection.classList.remove('enable-section--visible');
    enableSection.style.display = 'none';
    showPreviewResults();
    showEnableButton(showEnableImmediately);

    return true;
  } catch {
    showError(
      document.getElementById('error-step2'),
      'Failed to generate your README. Please try again.'
    );
    return false;
  }
}

/**
 * Downloads the README and navigates to the instructions page.
 */
function handleEnable() {
  const markdown = currentMarkdown || getGeneratedMarkdown();
  if (!markdown) return;

  downloadReadme(markdown);
  window.location.href = 'instructions.html';
}

/**
 * Handles Step 1 Next button click — fetches GitHub data.
 */
async function handleStep1Next() {
  const usernameInput = document.getElementById('input-username');
  const nextBtn = document.getElementById('btn-step1-next');
  const errorBanner = document.getElementById('error-step1');
  const username = usernameInput.value.trim();

  hideError(errorBanner);

  const validation = validateStep1(username);
  if (!validation.valid) {
    showError(errorBanner, validation.message);
    return;
  }

  const previousUsername = getUsername();
  const hasCachedData = getGitHubUserData() && previousUsername === username;

  if (hasCachedData) {
    saveUsername(username);
    showStep(CONFIG.WIZARD.STEP_DETAILS);
    return;
  }

  setButtonLoading(nextBtn, true, 'Fetching your profile...');

  try {
    const { user, repos } = await fetchGitHubData(username);
    saveUsername(username);
    saveGitHubData(user, repos);
    showStep(CONFIG.WIZARD.STEP_DETAILS);
  } catch (error) {
    showError(errorBanner, getGitHubErrorMessage(error));
  } finally {
    setButtonLoading(nextBtn, false, '');
    nextBtn.disabled = !usernameInput.value.trim();
  }
}

/**
 * Handles Step 2 Enter button click — validates, saves, generates README.
 */
async function handleStep2Submit() {
  const errorBanner = document.getElementById('error-step2');
  hideError(errorBanner);

  const details = readUserDetailsForm();
  const validation = validateStep2(details);

  if (!validation.valid) {
    showError(errorBanner, validation.message);
    return;
  }

  saveUserDetails(details);
  await generateAndShowResults(false);
}

/**
 * Handles Start Over — clears storage and resets wizard.
 */
function handleStartOver() {
  clearAllStorage();
  currentMarkdown = '';
  hideResults();

  document.getElementById('input-username').value = '';
  populateUserDetailsForm(getDefaultUserDetails());

  hideError(document.getElementById('error-step1'));
  hideError(document.getElementById('error-step2'));

  const nextBtn = document.getElementById('btn-step1-next');
  nextBtn.disabled = true;
  showStep(CONFIG.WIZARD.STEP_GITHUB);
}

/**
 * Restores wizard state from localStorage on page load.
 */
async function restoreState() {
  const username = getUsername();
  const details = getUserDetails();
  const step = getCurrentStep();
  const savedMarkdown = getGeneratedMarkdown();
  const hasTagline = details.taglines.some((t) => t.trim());

  if (username) {
    document.getElementById('input-username').value = username;
    document.getElementById('btn-step1-next').disabled = false;
  }

  populateUserDetailsForm(details);

  if (step >= CONFIG.WIZARD.STEP_DETAILS && getGitHubUserData()) {
    showStep(CONFIG.WIZARD.STEP_DETAILS);

    if (savedMarkdown && details.name && hasTagline) {
      currentMarkdown = savedMarkdown;
      renderPreview(currentMarkdown, document.getElementById('preview-content'));
      showPreviewResults();
      showEnableButton(true);
    }
  } else {
    showStep(CONFIG.WIZARD.STEP_GITHUB);
  }
}

/**
 * Binds all event listeners and initializes the builder page.
 */
function initBuilder() {
  const usernameInput = document.getElementById('input-username');
  const nextBtn = document.getElementById('btn-step1-next');
  const backBtn = document.getElementById('btn-step2-back');
  const submitBtn = document.getElementById('btn-step2-submit');
  const enableBtn = document.getElementById('btn-enable');
  const resetBtn = document.getElementById('btn-start-over');
  const addTaglineBtn = document.getElementById('btn-add-tagline');

  bindStep1InputValidation(usernameInput, nextBtn);

  addTaglineBtn.addEventListener('click', () => {
    const list = document.getElementById('taglines-list');
    const count = list.querySelectorAll('.tagline-input').length;
    if (count >= CONFIG.MAX_TAGLINES) return;
    list.appendChild(createTaglineRow('', true));
    updateAddTaglineButton();
  });

  nextBtn.addEventListener('click', handleStep1Next);
  usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !nextBtn.disabled) handleStep1Next();
  });

  backBtn.addEventListener('click', () => showStep(CONFIG.WIZARD.STEP_GITHUB));

  submitBtn.addEventListener('click', handleStep2Submit);
  enableBtn.addEventListener('click', handleEnable);
  resetBtn.addEventListener('click', handleStartOver);

  restoreState();
}

document.addEventListener('DOMContentLoaded', initBuilder);
