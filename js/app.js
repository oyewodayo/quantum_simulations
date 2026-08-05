'use strict';
// bootstrap file - has to be the LAST <script> tag in index.html. declares
// the shared app state (used by every tabs/*.js file) and wires up theme
// toggle, tab switching, and initial UI render inside one DOMContentLoaded
// listener, calling into every core/*.js and tabs/*.js build/init function.
// keeping one linear init here instead of scattering DOMContentLoaded
// listeners across the tab files makes the init order easy to reason about,
// since there's no module system to make per-file registration order
// predictable.
// needs core/tab-registry.js (TABS) for switchToTab().

let qubitMain    = new Qubit();
let qubitCircuit = new Qubit();
let qubitMeasure = new Qubit();

// Two Qubits panel (Qubit tab) - independent, not entangled; see
// updateQubit2UI() in qubit-tab.js for the product-state math
let qubit2A = new Qubit();
let qubit2B = new Qubit();

// Three Qubits panel - same independent-not-entangled deal as qubit2A/B,
// just one more; see updateQubit3UI() in qubit-tab.js
let qubit3A = new Qubit();
let qubit3B = new Qubit();
let qubit3C = new Qubit();

let rendererMain    = null;
let rendererGates   = null;
let rendererCircuit = null;
let rendererQubit2A = null;
let rendererQubit2B = null;
let rendererQubit3A = null;
let rendererQubit3B = null;
let rendererQubit3C = null;

// reduced single-qubit Bloch spheres for the 2Q/3Q circuit builders (see
// TwoQubitState/ThreeQubitState.getSingleQubitBloch() and updateUI() in
// tabs/circuit-multiqubit-tab.js) - read-only outputs of each builder's own
// instance state, not independent state like rendererQubit2A/B
let rendererCircuit2 = [null, null];
let rendererCircuit3 = [null, null, null];

let gateHistory  = [];
let circuitGates = [];
const SLOT_COUNT = 8;

let measureCounts = { 0: 0, 1: 0 };

let currentTab = 'qubit'; // matches the initially-active .tab/.tab-content in index.html

let classicalBit     = 1;

// Statevector widget, embedded in Maths Concept's State Vector section
// (see tabs/statevector-tab.js)
let classicalSVState = 1;   // 0 or 1
let svTheta          = 0;   // angle controlling quantum state vector

// Entanglement tab
let coin1State     = null;  // null=unmeasured, 0, 1
let coin2State     = null;
let coinAnimating  = false;
let entangleCounts = { '00': 0, '11': 0 };

// highlights whichever sidebar sub-link(s) under `tab` match `state` -
// called from each tab's own mode setter (setQubitMode/setQubitSubmode,
// setGatesDomain, setMathsSection) after it updates that tab's in-page
// toggle, so the sidebar stays correct regardless of whether the change
// came from the sidebar itself, the in-page toggle, or roadmap nav. `state`
// maps each *mode* dataset key a .tab-sub might carry to its current value;
// a sub-link matches only if every mode key IT declares agrees (a link with
// just gatesDomain ignores qubitSubmode etc).
//
// MODE_KEYS is an explicit allowlist rather than "every dataset key but
// tab" on purpose - every .tab-sub also carries a data-i18n translation key
// (applyTranslations() in i18n.js reads it, unrelated to nav state), and an
// every()-over-all-keys match used to silently fail forever because
// state.i18n is never set. no sidebar sub-link ever highlighted, on any
// tab, once i18n.js started tagging these buttons. took a while to find.
const SIDEBAR_SUB_MODE_KEYS = ['qubitMode', 'qubitSubmode', 'gatesDomain', 'mathsSection'];
function syncSidebarSub(tab, state) {
  document.querySelectorAll(`.tab-sub[data-tab="${tab}"]`).forEach(btn => {
    const keys = SIDEBAR_SUB_MODE_KEYS.filter(k => btn.dataset[k] !== undefined);
    const match = keys.length > 0 && keys.every(k => btn.dataset[k] === state[k]);
    btn.classList.toggle('active', match);
  });
}

// opens one sidebar subnav group (Bits & Qubits / Maths Concept / Gates),
// closing every other one first - accordion behavior so the dock never
// shows two expanded groups at once
function openSidebarGroup(group) {
  document.querySelectorAll('.tab-group.open').forEach(g => {
    if (g !== group) g.classList.remove('open');
  });
  group.classList.add('open');
}

// switches the visible tab and fires the outgoing/incoming tab's
// registerTab() hooks (core/tab-registry.js)
function switchToTab(name) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${name}`));

  const leaving = TABS[currentTab];
  if (leaving && leaving.onLeave) leaving.onLeave();

  currentTab = name;
  const entering = TABS[currentTab];
  if (entering && entering.onEnter) entering.onEnter();
}

// fills in the footer's copyright year with the real current year instead
// of a hardcoded one that quietly goes stale - same
// t(key, fallback).replace('{token}', value) pattern roadmap.js uses
// wherever a translated string needs a runtime value spliced in.
// registered with onLangChange() since this text isn't reachable by the
// plain [data-i18n] walk in applyTranslations().
function renderFooter() {
  const el = document.getElementById('footer-copyright');
  if (!el) return;
  el.textContent = t('footer.copyright', 'Copyright © {year} CERN').replace('{year}', new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', () => {

  // data-theme itself was already restored from localStorage by the
  // anti-flash script in index.html's <head>, before first paint
  refreshThemeColors();
  syncThemeIcon();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // runs after every js/locales/*.js file has already registered itself
  // (script order in index.html), so every language is available the first
  // time applyTranslations() runs
  initI18n();
  document.getElementById('lang-select').addEventListener('change', e => setLanguage(e.target.value));
  renderFooter();
  onLangChange(renderFooter);

  // each tab declares its own onEnter/onLeave via registerTab(), so this
  // handler never needs to know which tabs care about being entered/left.
  // adding a tab just means calling registerTab() once, not editing this.
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      switchToTab(btn.dataset.tab);
      const group = btn.closest('.tab-group');
      if (group) openSidebarGroup(group);
    });
  });

  // sidebar sub-links (Bits & Qubits / Maths Concept / Gates) each carry
  // data-tab plus whichever mode/domain/section attribute its target tab
  // understands - mirrors the fields goToLessonSimulation() in roadmap.js
  // applies for mind-map navigation
  document.querySelectorAll('.tab-chevron').forEach(chevron => {
    chevron.addEventListener('click', e => {
      e.stopPropagation();
      const group = chevron.closest('.tab-group');
      if (group.classList.contains('open')) group.classList.remove('open');
      else openSidebarGroup(group);
    });
  });
  document.querySelectorAll('.tab-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      switchToTab(btn.dataset.tab);
      if (btn.dataset.qubitMode)     setQubitMode(btn.dataset.qubitMode);
      if (btn.dataset.qubitSubmode)  setQubitSubmode(btn.dataset.qubitSubmode);
      if (btn.dataset.gatesDomain)   setGatesDomain(btn.dataset.gatesDomain);
      if (btn.dataset.mathsSection)  setMathsSection(btn.dataset.mathsSection);
    });
  });

  // these have to exist before the initXTab() calls below - e.g.
  // initCircuit2Tab()/initCircuit3Tab() call updateUI() during their own
  // init, which reaches straight into rendererCircuit2/rendererCircuit3 to
  // draw the per-qubit mini-spheres
  rendererMain    = new BlochRenderer(document.getElementById('bloch-main'));
  rendererGates   = new BlochRenderer(document.getElementById('bloch-gates'));
  rendererCircuit = new BlochRenderer(document.getElementById('bloch-circuit'));
  rendererQubit2A = new BlochRenderer(document.getElementById('bloch-2q-a'));
  rendererQubit2B = new BlochRenderer(document.getElementById('bloch-2q-b'));
  rendererQubit3A = new BlochRenderer(document.getElementById('bloch-3q-a'));
  rendererQubit3B = new BlochRenderer(document.getElementById('bloch-3q-b'));
  rendererQubit3C = new BlochRenderer(document.getElementById('bloch-3q-c'));
  rendererCircuit2 = [0, 1].map(i => new BlochRenderer(document.getElementById(`bloch-circuit-2q-${i}`)));
  rendererCircuit3 = [0, 1, 2].map(i => new BlochRenderer(document.getElementById(`bloch-circuit-3q-${i}`)));

  // only free-form inputs get drag - the Gates/Circuit spheres are
  // read-only outputs of applying gates, dragging them wouldn't map to
  // anything meaningful. Two/Three Qubits spheres are inputs same as main.
  rendererMain.enableDrag((theta, phi) => setMainState(theta, phi));
  rendererQubit2A.enableDrag((theta, phi) => { qubit2A.setState(theta, phi); updateQubit2UI(); });
  rendererQubit2B.enableDrag((theta, phi) => { qubit2B.setState(theta, phi); updateQubit2UI(); });
  rendererQubit3A.enableDrag((theta, phi) => { qubit3A.setState(theta, phi); updateQubit3UI(); });
  rendererQubit3B.enableDrag((theta, phi) => { qubit3B.setState(theta, phi); updateQubit3UI(); });
  rendererQubit3C.enableDrag((theta, phi) => { qubit3C.setState(theta, phi); updateQubit3UI(); });
  [rendererMain, rendererGates, rendererCircuit, rendererQubit2A, rendererQubit2B,
   rendererQubit3A, rendererQubit3B, rendererQubit3C,
   ...rendererCircuit2, ...rendererCircuit3].forEach(r => r.enableTooltips());

  // redraw every sphere in place (same x/y/z, new theme colors) whenever
  // the theme toggles
  onThemeChange(() => {
    [rendererMain, rendererGates, rendererCircuit, rendererQubit2A, rendererQubit2B,
     rendererQubit3A, rendererQubit3B, rendererQubit3C,
     ...rendererCircuit2, ...rendererCircuit3].forEach(r => {
      if (r) r.draw(r.cur.x, r.cur.y, r.cur.z);
    });
  });

  // Build UI
  buildGateButtons();
  buildCircuitPalette();
  buildCircuitSlots();
  initClassicalBit();
  initQubitTab();
  initMathsConceptTab();
  initCircuitTab();
  initCircuit2Tab();
  initCircuit3Tab();
  initClassicalCircuitTab();
  initClassicalGatesTab();
  initMeasureTab();
  initStatevecTab();
  initEntangle();
  initBellStatesTab();
  initTunnelControls();
  initInterferenceControls();
  initBeamSplitterTab();
  initImportantConceptsZoom();
  initImportantConceptsSearch();
  initSternGerlachTab();

  // Initial renders
  const b0 = qubitMain.getBloch();
  rendererMain.draw(b0.x, b0.y, b0.z, qubitMain.getLabel());
  rendererGates.draw(b0.x, b0.y, b0.z, qubitMain.getLabel());
  const bc = qubitCircuit.getBloch();
  rendererCircuit.draw(bc.x, bc.y, bc.z, qubitCircuit.getLabel());
  const b2a = qubit2A.getBloch(), b2b = qubit2B.getBloch();
  rendererQubit2A.draw(b2a.x, b2a.y, b2a.z, qubit2A.getLabel());
  rendererQubit2B.draw(b2b.x, b2b.y, b2b.z, qubit2B.getLabel());
  updateQubit2UI();
  const b3a = qubit3A.getBloch(), b3b = qubit3B.getBloch(), b3c = qubit3C.getBloch();
  rendererQubit3A.draw(b3a.x, b3a.y, b3a.z, qubit3A.getLabel());
  rendererQubit3B.draw(b3b.x, b3b.y, b3b.z, qubit3B.getLabel());
  rendererQubit3C.draw(b3c.x, b3c.y, b3c.z, qubit3C.getLabel());
  updateQubit3UI();

  updateQubitUI();
  updateGatesUI();
  updateCircuitUI();
  updateMeasureUI();
  updateClassicalUI();
  initRoadmap();
  // roadmap is the default landing view - index.html has matching hardcoded
  // defaults (nav hidden, #roadmap-view .active) so there's no Concepts-page
  // flash before this line runs
  setAppMode('roadmap');
  initModeGridThumbs();

  applySharedStateFromURL();
  startTourIfFirstVisit();
});

// restores a qubit state and/or circuit gate sequence encoded in the URL by
// copyShareLink() (core/dom-utils.js), so a shared link reproduces what the
// sender saw. unrecognized/missing params are just ignored, not errors.
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
