'use strict';
// Depends on: app.js state (qubitMain, rendererMain), core/dom-utils.js
// (copyShareLink). initQubitTab() wires up the preset buttons, sliders,
// and share button declared in index.html — called once from app.js's
// DOMContentLoaded.

// ═══════════════════════════════════════════════════════════════════
// QUBIT TAB
// ═══════════════════════════════════════════════════════════════════
function initQubitTab() {
  document.querySelectorAll('#tab-qubit .preset-btn').forEach(btn => {
    const theta = parseFloat(btn.dataset.thetaMult) * Math.PI;
    const phi   = parseFloat(btn.dataset.phiMult)   * Math.PI;
    btn.addEventListener('click', () => setMainState(theta, phi));
  });
  document.getElementById('sl-theta').addEventListener('input', sliderUpdate);
  document.getElementById('sl-phi').addEventListener('input', sliderUpdate);

  document.getElementById('btn-share-qubit').addEventListener('click', e => {
    const b = qubitMain.getBloch();
    copyShareLink({ tab: 'qubit', theta: b.theta.toFixed(4), phi: b.phi.toFixed(4) }, e.currentTarget);
  });

  // Keyboard control: the sphere is drag-only otherwise, which locks out
  // anyone not using a mouse/touchscreen. Arrow keys nudge theta/phi in
  // small steps; hold Shift for bigger steps.
  document.getElementById('bloch-main').addEventListener('keydown', e => {
    const step = e.shiftKey ? Math.PI / 6 : Math.PI / 36; // 30° or 5°
    const b = qubitMain.getBloch();
    let theta = b.theta, phi = b.phi;
    switch (e.key) {
      case 'ArrowUp':    theta = Math.max(0, theta - step); break;
      case 'ArrowDown':  theta = Math.min(Math.PI, theta + step); break;
      case 'ArrowLeft':  phi -= step; break;
      case 'ArrowRight': phi += step; break;
      default: return;
    }
    phi = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    e.preventDefault();
    setMainState(theta, phi);
  });
}

function setMainState(theta, phi) {
  qubitMain.setState(theta, phi);
  document.getElementById('sl-theta').value = Math.round(theta * 1000);
  document.getElementById('sl-phi').value   = Math.round(phi   * 1000);
  updateQubitUI();
}

function sliderUpdate() {
  const theta = parseInt(document.getElementById('sl-theta').value) / 1000;
  const phi   = parseInt(document.getElementById('sl-phi').value)   / 1000;
  document.getElementById('val-theta').textContent = Math.round(theta * 180 / Math.PI) + '°';
  document.getElementById('val-phi').textContent   = Math.round(phi   * 180 / Math.PI) + '°';
  qubitMain.setState(theta, phi);
  updateQubitUI();
}

function updateQubitUI() {
  const b  = qubitMain.getBloch();
  const p0 = qubitMain.prob0() * 100;
  const p1 = qubitMain.prob1() * 100;

  rendererMain.animateTo(b.x, b.y, b.z);
  document.getElementById('bloch-main').setAttribute('aria-label',
    `Bloch sphere. State: ${qubitMain.getFormula()}. Draggable, or focus and use arrow keys, to set the qubit's state.`);
  document.getElementById('label-main').textContent   = qubitMain.getLabel();
  document.getElementById('formula-main').textContent = qubitMain.getFormula();
  document.getElementById('fill0-main').style.width   = p0 + '%';
  document.getElementById('fill1-main').style.width   = p1 + '%';
  document.getElementById('pct0-main').textContent    = Math.round(p0) + '%';
  document.getElementById('pct1-main').textContent    = Math.round(p1) + '%';
  document.getElementById('val-theta').textContent    = Math.round(b.theta * 180 / Math.PI) + '°';
  document.getElementById('val-phi').textContent      = Math.round(b.phi   * 180 / Math.PI) + '°';
}
