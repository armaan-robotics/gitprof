/**
 * instructions.js — Populates the instructions page with the saved
 * GitHub username from localStorage.
 */

function initInstructions() {
  const username = getUsername();
  document.querySelectorAll('[data-username-slot]').forEach((el) => {
    el.textContent = username || 'your-username';
  });
}

document.addEventListener('DOMContentLoaded', initInstructions);
