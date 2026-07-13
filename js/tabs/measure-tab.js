'use strict';
// Depends on: core/dom-utils.js (setExplainer), app.js state
// (qubitMeasure, measureCounts).

// ═══════════════════════════════════════════════════════════════════
// MEASURE TAB
// ═══════════════════════════════════════════════════════════════════
function initMeasureTab() {
  document.getElementById('btn-measure').addEventListener('click', doMeasure);
  document.getElementById('btn-reset-stats').addEventListener('click', resetStats);
  document.querySelectorAll('#tab-measure .preset-btn').forEach(btn => {
    const theta = parseFloat(btn.dataset.thetaMult) * Math.PI;
    const phi   = parseFloat(btn.dataset.phiMult)   * Math.PI;
    btn.addEventListener('click', () => setMeasureState(theta, phi));
  });
  document.querySelectorAll('[data-measure-n]').forEach(btn => {
    const n = parseInt(btn.dataset.measureN, 10);
    btn.addEventListener('click', () => measureMany(n));
  });
}

const MEASURE_OPENERS = [
  'The universe rolled its dice —',
  'No more hedging —',
  'The coin finally landed —',
  'Asked, and answered —',
  'The blur snapped into focus —'
];

function setMeasureState(theta, phi) {
  qubitMeasure.setState(theta, phi);
  measureCounts = { 0: 0, 1: 0 };
  resetStats();
  updateMeasureUI();
  setExplainer('measure-explainer', 'Right now the qubit hasn\'t committed to anything — it genuinely holds both |0⟩ and |1⟩ at once, weighted by the bars on the left. Hit MEASURE and you\'re forcing it to answer a yes/no question it was actively avoiding.');
}

function updateMeasureUI() {
  const p0 = qubitMeasure.prob0() * 100;
  const p1 = qubitMeasure.prob1() * 100;
  document.getElementById('formula-measure').textContent = qubitMeasure.getFormula();
  document.getElementById('vbar0').style.height = p0 + '%';
  document.getElementById('vbar1').style.height = p1 + '%';
  document.getElementById('vpct0').textContent  = Math.round(p0) + '%';
  document.getElementById('vpct1').textContent  = Math.round(p1) + '%';
}

function doMeasure() {
  const p0before = Math.round(qubitMeasure.prob0() * 100);
  const p1before = Math.round(qubitMeasure.prob1() * 100);
  const result = qubitMeasure.measure();
  measureCounts[result]++;

  const resEl = document.getElementById('measure-result');
  resEl.style.color   = result === 0 ? 'var(--zero)' : 'var(--one)';
  resEl.style.opacity = '0';
  resEl.textContent   = result === 0 ? '|0⟩' : '|1⟩';
  requestAnimationFrame(() => { resEl.style.opacity = '1'; });
  updateHistogram();

  const opener = MEASURE_OPENERS[Math.floor(Math.random() * MEASURE_OPENERS.length)];
  const color  = result === 0 ? 'var(--zero)' : 'var(--one)';
  setExplainer('measure-explainer',
    `${opener} <strong style="color:${color}">|${result}⟩</strong>. A split second ago the odds were ${p0before}% / ${p1before}%, and both were equally real possibilities — not "secretly already |${result}⟩ and we just didn't know." The click is what forced a choice; the superposition is gone for good. Want to see it happen again? You'll need to re-prepare the exact same state from scratch.`
  );
}

function measureMany(n) {
  for (let i = 0; i < n; i++) measureCounts[qubitMeasure.measure()]++;
  const total = measureCounts[0] + measureCounts[1];
  const resEl = document.getElementById('measure-result');
  resEl.style.color = 'var(--text2)';
  resEl.textContent = `${total} total`;
  updateHistogram();

  const p0 = Math.round((measureCounts[0] / total) * 100);
  const p1 = Math.round((measureCounts[1] / total) * 100);
  setExplainer('measure-explainer',
    `Just sent ${n} identical, freshly-prepared qubits through the same measurement — think of it as asking ${n} exact copies of the same question. None of them talk to each other or "remember" the last answer; each collapses on its own. Across ${total} trials so far the split landed near ${p0}% / ${p1}%, and it'll keep creeping toward the true odds the more you run.`
  );
}

function updateHistogram() {
  const total = measureCounts[0] + measureCounts[1];
  if (total === 0) return;
  const p0 = (measureCounts[0] / total) * 100;
  const p1 = (measureCounts[1] / total) * 100;
  document.getElementById('hist0').style.height = p0 + '%';
  document.getElementById('hist1').style.height = p1 + '%';
  document.getElementById('hpct0').textContent  = Math.round(p0) + '%';
  document.getElementById('hpct1').textContent  = Math.round(p1) + '%';
  document.getElementById('trial-count').textContent = `· ${total} trials`;

  const exp0 = Math.round(qubitMeasure.prob0() * 100);
  const exp1 = Math.round(qubitMeasure.prob1() * 100);
  document.getElementById('convergence-note').textContent =
    total >= 20 ? `Quantum prediction: |0⟩ → ${exp0}%  |1⟩ → ${exp1}%` : '';
}

function resetStats() {
  measureCounts = { 0: 0, 1: 0 };
  ['hist0','hist1'].forEach(id => document.getElementById(id).style.height = '0%');
  document.getElementById('hpct0').textContent          = '—';
  document.getElementById('hpct1').textContent          = '—';
  document.getElementById('trial-count').textContent    = '';
  document.getElementById('measure-result').textContent = '';
  document.getElementById('convergence-note').textContent = '';
}
