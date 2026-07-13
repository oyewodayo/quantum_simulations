'use strict';
// Depends on: app.js state (classicalBit, classicalFlips, classicalHistory).
// initClassicalBit() is called from app.js's DOMContentLoaded handler.

// ═══════════════════════════════════════════════════════════════════
// CLASSICAL BIT
// ═══════════════════════════════════════════════════════════════════
function initClassicalBit() {
  const toggle = document.getElementById('bit-toggle');
  toggle.addEventListener('change', () => {
    classicalBit = toggle.checked ? 1 : 0;
    classicalFlips++;
    classicalHistory.unshift(classicalBit);
    if (classicalHistory.length > 10) classicalHistory.pop();
    updateClassicalUI();
  });
}

function updateClassicalUI() {
  const display = document.getElementById('classical-display');
  display.textContent = classicalBit;

  // Dim when 0, full brightness when 1 — visual metaphor for off/on
  display.classList.toggle('is-zero', classicalBit === 0);

  document.getElementById('flip-count').textContent = classicalFlips;

  // Side labels: highlight the active side
  document.getElementById('lbl-zero').classList.toggle('active', classicalBit === 0);
  document.getElementById('lbl-one').classList.toggle('active',  classicalBit === 1);

  // History trail
  const trail = document.getElementById('bit-history');
  trail.innerHTML = classicalHistory.map((v, i) =>
    `<div class="history-pip${i === 0 ? ' pip-current' : ''}">${v}</div>`
  ).join('');
}
