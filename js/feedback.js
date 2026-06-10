/**
 * feedback.js — Injects a floating feedback button linking to the
 * GitProf feedback form. Included on all pages.
 */

const FEEDBACK_URL = 'https://forms.gle/kJL2T8fajRwpjq1C7';

function initFeedbackButton() {
  if (document.getElementById('feedback-fab')) return;

  const link = document.createElement('a');
  link.id = 'feedback-fab';
  link.className = 'feedback-fab';
  link.href = FEEDBACK_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Send feedback');
  link.title = 'Send feedback';

  link.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
    </svg>
  `;

  document.body.appendChild(link);
}

document.addEventListener('DOMContentLoaded', initFeedbackButton);
