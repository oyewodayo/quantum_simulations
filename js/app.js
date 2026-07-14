'use strict';
// Bootstrap file — must be the LAST <script> tag in index.html. It declares
// the shared app state (used by every tabs/*.js file) and wires up the
// theme toggle, tab switching, and initial UI render inside a single
// DOMContentLoaded listener, calling into every core/*.js and tabs/*.js
// build/init function. Keeping one linear init function here (rather than
// scattering DOMContentLoaded listeners across the tab files) makes the
// init order easy to reason about, since there's no module system to make
// per-file registration order predictable.
// Depends on: core/tab-registry.js (TABS) for switchToTab().

// ═══════════════════════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════════════════════
let qubitMain    = new Qubit();
let qubitCircuit = new Qubit();
let qubitMeasure = new Qubit();

let rendererMain    = null;
let rendererGates   = null;
let rendererCircuit = null;

let gateHistory  = [];
let circuitGates = [];
const SLOT_COUNT = 8;

let measureCounts = { 0: 0, 1: 0 };

let currentTab = 'qubit'; // matches the initially-active .tab/.tab-content in index.html

/** Switches the visible tab and fires the outgoing/incoming tab's
 *  registerTab() hooks (see core/tab-registry.js). */
function switchToTab(name) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${name}`));

  const leaving = TABS[currentTab];
  if (leaving && leaving.onLeave) leaving.onLeave();

  currentTab = name;
  const entering = TABS[currentTab];
  if (entering && entering.onEnter) entering.onEnter();
}

// ── Classical bit state ────────────────────────────────────────────
let classicalBit     = 1;
let classicalFlips   = 0;
let classicalHistory = [1];

// ── Statevector tab ────────────────────────────────────────────────
let classicalSVState = 1;   // 0 or 1
let svTheta          = 0;   // angle controlling quantum state vector

// ── Entanglement tab ───────────────────────────────────────────────
let coin1State     = null;  // null=unmeasured, 0, 1
let coin2State     = null;
let coinAnimating  = false;
let entangleCounts = { '00': 0, '11': 0 };

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Theme init — data-theme itself was already restored from localStorage
  // by the anti-flash script in index.html's <head>, before first paint.
  refreshThemeColors();
  syncThemeIcon();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Tab switching — each tab declares its own onEnter/onLeave via
  // registerTab() (see core/tab-registry.js), so this handler never needs
  // to know which tabs care about being entered/left, or why. Adding a
  // new tab means calling registerTab() once in its own file, not editing
  // this switch.
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => switchToTab(btn.dataset.tab));
  });

  // Bloch renderers
  rendererMain    = new BlochRenderer(document.getElementById('bloch-main'));
  rendererGates   = new BlochRenderer(document.getElementById('bloch-gates'));
  rendererCircuit = new BlochRenderer(document.getElementById('bloch-circuit'));

  // Only the Qubit tab's sphere is a free-form input (Gates/Circuit spheres
  // are read-only outputs of applying gates, so dragging them wouldn't map
  // back to a meaningful action).
  rendererMain.enableDrag((theta, phi) => setMainState(theta, phi));
  [rendererMain, rendererGates, rendererCircuit].forEach(r => r.enableTooltips());

  // Build UI
  buildGateButtons();
  buildCircuitPalette();
  buildCircuitSlots();
  initClassicalBit();
  initQubitTab();
  initCircuitTab();
  initCircuit2Tab();
  initMeasureTab();
  initStatevecTab();
  initEntangle();
  initTunnelControls();
  initInterferenceControls();

  // Initial renders
  const b0 = qubitMain.getBloch();
  rendererMain.draw(b0.x, b0.y, b0.z);
  rendererGates.draw(b0.x, b0.y, b0.z);
  const bc = qubitCircuit.getBloch();
  rendererCircuit.draw(bc.x, bc.y, bc.z);

  updateQubitUI();
  updateGatesUI();
  updateCircuitUI();
  updateMeasureUI();
  updateClassicalUI();
  initRoadmap();
  initModeGridThumbs();

  applySharedStateFromURL();
  startTourIfFirstVisit();
});

/** Restores a qubit state and/or circuit gate sequence encoded in the
 *  URL by copyShareLink() (see core/dom-utils.js), so a shared link
 *  reproduces what the sender saw. Unrecognized/missing params are
 *  silently ignored rather than treated as errors. */
function applySharedStateFromURL() {
  const params = new URLSearchParams(location.search);

  const theta = params.get('theta');
  const phi   = params.get('phi');
  if (theta !== null && phi !== null) {
    setMainState(parseFloat(theta), parseFloat(phi));
  }

  const circuit = params.get('circuit');
  if (circuit) {
    circuitGates = circuit.split(',').filter(key => GATES[key]).slice(0, SLOT_COUNT);
    buildCircuitSlots();
    updateCircuitUI();
  }

  const tab = params.get('tab');
  if (tab && document.querySelector(`.tab[data-tab="${tab}"]`)) {
    switchToTab(tab);
  }
}
