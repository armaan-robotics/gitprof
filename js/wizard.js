/**
 * wizard.js — Step navigation, progress bar updates, validation,
 * and show/hide logic for the multi-step builder wizard.
 */

/**
 * Updates the progress bar and step label.
 * @param {number} currentStep
 * @param {number} totalSteps
 */
function updateProgressBar(currentStep, totalSteps) {
  const label = document.getElementById('step-label');
  const fill = document.getElementById('progress-fill');

  if (label) {
    label.textContent = `Step ${currentStep} of ${totalSteps}`;
  }

  if (fill) {
    const percent = (currentStep / totalSteps) * 100;
    fill.style.width = `${percent}%`;
  }
}

/**
 * Shows the specified wizard step and hides others.
 * @param {number} step
 */
function showStep(step) {
  document.querySelectorAll('.wizard-step').forEach((el) => {
    const stepNum = parseInt(el.dataset.step, 10);
    el.classList.toggle('wizard-step--active', stepNum === step);
  });
  updateProgressBar(step, CONFIG.WIZARD.TOTAL_STEPS);
  saveCurrentStep(step);
}

/**
 * Validates Step 1 username field.
 * @param {string} username
 * @returns {{ valid: boolean, message?: string }}
 */
function validateStep1(username) {
  if (!username.trim()) {
    return { valid: false, message: ERROR_MESSAGES.empty_username };
  }
  return { valid: true };
}

/**
 * Validates Step 2 user details.
 * @param {{ name: string, taglines: string[] }} details
 * @returns {{ valid: boolean, message?: string }}
 */
function validateStep2(details) {
  if (!details.name.trim()) {
    return { valid: false, message: ERROR_MESSAGES.empty_name };
  }

  const filledTaglines = (details.taglines || []).filter((t) => t.trim());
  if (filledTaglines.length === 0) {
    return { valid: false, message: ERROR_MESSAGES.empty_tagline };
  }

  return { valid: true };
}

/**
 * Toggles the Next button disabled state based on input value.
 * @param {HTMLInputElement} input
 * @param {HTMLButtonElement} button
 */
function bindStep1InputValidation(input, button) {
  function updateButton() {
    button.disabled = !input.value.trim();
  }
  input.addEventListener('input', updateButton);
  updateButton();
}

/**
 * Sets loading state on a button.
 * @param {HTMLButtonElement} button
 * @param {boolean} isLoading
 * @param {string} loadingText
 */
function setButtonLoading(button, isLoading, loadingText) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.classList.add('btn--loading');
    button.disabled = true;
    button.innerHTML = `<span class="btn__spinner"></span> ${loadingText}`;
  } else {
    button.classList.remove('btn--loading');
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}
