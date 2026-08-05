'use strict';
// Depends on: core/gates.js (GATES, ROTATION_GATES, rotationMatrix),
// core/complex.js (C.fmt), core/dom-utils.js (setExplainer),
// core/tab-registry.js (registerTab), app.js state (qubitMain, gateHistory,
// rendererGates), tabs/qubit-tab.js (updateQubitUI, called after applying a gate).
//
// gateHistory entries carry a label/color, a snapshot of the qubit's exact
// (theta, phi) right after that step, the explainer HTML shown at the
// time, and enough to redraw the matrix (matrixKey for fixed gates,
// matrix/rotationAxis/rotationAngle for rotation gates) - see
// restoreGateHistoryStep() below. using snapshots instead of replayable
// ops because entries come from two different places that behave
// differently: manual clicks compound on the previous state, but a Try Me
// run resets to |0⟩ before each step (initGatesTryMe()). snapshotting the
// result means rollback doesn't need to care which kind it's restoring.
// gateHistoryCursor is whichever entry's currently on screen, not
// necessarily the last one once you've clicked a rollback chip.

// Classical Gates/Quantum Gates/Compare switch - same multi-panel pattern
// as Circuits' domain toggle, plus a third Compare panel (item 14) whose
// truth tables only need building once, on first visit.
function setGatesDomain(domain) {
  document.querySelectorAll('.mode-btn[data-gates-domain]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.gatesDomain === domain));
  document.getElementById('gates-classical-panel').style.display = domain === 'classical' ? '' : 'none';
  document.getElementById('gates-quantum-panel').style.display   = domain === 'quantum'   ? '' : 'none';
  document.getElementById('gates-compare-panel').style.display   = domain === 'compare'   ? '' : 'none';
  syncSidebarSub('gates', { gatesDomain: domain });
}

function buildGateButtons() {
  document.querySelectorAll('.mode-btn[data-gates-domain]').forEach(btn =>
    btn.addEventListener('click', () => setGatesDomain(btn.dataset.gatesDomain)));
  syncSidebarSub('gates', { gatesDomain: 'quantum' }); // matches the panel already active by default in index.html

  renderGateGrid();
  document.getElementById('btn-reset-gates').addEventListener('click', resetGates);
  buildRotationButtons();
  buildGateReference();
  initGatesTryMe();
  buildQuantumGateTruthTable('gates-truth-table');
  buildQuantumGateTruthTable('gates-compare-quantum-table');
  buildAllClassicalGatesTruthTables('gates-compare-classical-table');

  // this sphere mirrors qubitMain but sits idle between visits, so jump
  // its animation state on entry instead of tweening from wherever it
  // was left last time
  registerTab('gates', {
    onEnter: () => {
      const b = qubitMain.getBloch();
      rendererGates.cur = { ...b };
      rendererGates.draw(b.x, b.y, b.z, qubitMain.getLabel());
      document.getElementById('label-gates').textContent = qubitMain.getLabel();
    }
  });

  // gate.desc/formalName go through t(), so a language switch needs these
  // rebuilt - each clears its own container first so it's safe to call again
  onLangChange(() => {
    renderGateGrid();
    buildRotationButtons();
    buildGateReference();
    buildQuantumGateTruthTable('gates-truth-table');
    buildQuantumGateTruthTable('gates-compare-quantum-table');
    buildAllClassicalGatesTruthTables('gates-compare-classical-table');
  });
}

// truth table stuff (item 13)
// formats a basis-state output as a ket sum, e.g. (0.707)|0⟩ + (-0.707)|1⟩
// - a coefficient of exactly 1 shows as a bare ket (|1⟩ not (1)|1⟩) since
// that's the common case for X/Z/S/T on a basis state
function formatKetOutput(c0, c1) {
  const parts = [];
  [c0, c1].forEach((c, k) => {
    if (C.mag(c) <= 0.0005) return;
    const coef = C.fmt(c);
    parts.push(coef === '1' ? `|${k}⟩` : `(${coef})|${k}⟩`);
  });
  return parts.length ? parts.join(' + ') : '0';
}

// renders a Gate/Input/Output table into targetId - every fixed gate's
// action on |0⟩ and |1⟩, straight from its matrix (matrix[0][basis]/
// matrix[1][basis] are exactly the output amplitudes for a basis-state
// input since multiplying by a basis vector just picks out that column).
// rotation gates skipped, no fixed table to show when the matrix depends
// on a runtime angle. called for both the main table (item 13) and the
// Compare panel's quantum table (item 14), plus again on language change.
function buildQuantumGateTruthTable(targetId) {
  const table = document.getElementById(targetId);
  if (!table) return;
  const rows = [];
  Object.entries(GATES).forEach(([key, gate]) => {
    [0, 1].forEach(basis => {
      const c0 = gate.matrix[0][basis];
      const c1 = gate.matrix[1][basis];
      rows.push({ gate, input: basis, output: formatKetOutput(c0, c1) });
    });
  });
  table.innerHTML = `<tr><th>${t('common.gate', 'Gate')}</th><th>${t('common.input', 'Input')}</th><th>${t('common.output', 'Output')}</th></tr>` +
    rows.map(r => `<tr><td style="color:${r.gate.color};font-weight:700;">${r.gate.name}</td><td>|${r.input}⟩</td><td>${r.output}</td></tr>`).join('');
}

// split out from buildGateButtons() so a language switch can rebuild just
// this - clears the grid first so re-calling doesn't duplicate buttons
function renderGateGrid() {
  const grid = document.getElementById('gate-grid');
  grid.innerHTML = '';
  Object.entries(GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className = 'gate-btn';
    btn.dataset.gateKey = key;
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '44';
    btn.innerHTML = `${gate.name}<span class="gate-sub">${t(`gates.${key}.desc`, gate.desc)}</span>`;
    btn.addEventListener('click', () => applyGate(key, btn));
    grid.appendChild(btn);
  });
}

function applyGate(key, btn) {
  const gate = GATES[key];
  qubitMain.applyGate(gate.matrix);
  showMatrix(key);
  updateQubitUI();
  if (btn) pulseElement(btn, 'pulsing');
  pulseElement(document.querySelector('#tab-gates .bloch-wrap'), 'pulsing', 550);

  const p0 = Math.round(qubitMain.prob0() * 100);
  const p1 = Math.round(qubitMain.prob1() * 100);
  const explain = `<strong style="color:${gate.color}">${gate.name} — ${gate.desc}.</strong> ${gate.explain} <br><br>New odds: ${p0}% |0⟩, ${p1}% |1⟩ — state is now <span style="font-family:'JetBrains Mono',monospace">${qubitMain.getFormula()}</span>.`;
  setExplainer('gate-explainer', explain);

  const b = qubitMain.getBloch();
  gateHistory.push({ label: gate.name, color: gate.color, theta: b.theta, phi: b.phi, matrixKey: key, explain });
  gateHistoryCursor = gateHistory.length - 1;
  updateGatesUI();
}

function showMatrix(key) {
  const gate = GATES[key];
  const [[a, b], [c, d]] = gate.matrixStr;
  document.getElementById('matrix-display').innerHTML = `
    <div class="matrix-name">${gate.name} =</div>
    <div class="matrix-body">
      <span class="matrix-bracket">[</span>
      <div class="matrix-cells">
        <span class="matrix-cell" style="color:${gate.color}">${a}</span>
        <span class="matrix-cell" style="color:${gate.color}">${b}</span>
        <span class="matrix-cell" style="color:${gate.color}">${c}</span>
        <span class="matrix-cell" style="color:${gate.color}">${d}</span>
      </div>
      <span class="matrix-bracket">]</span>
    </div>
  `;
}

function buildRotationButtons() {
  const grid = document.getElementById('rotation-gate-grid');
  grid.innerHTML = '';
  Object.entries(ROTATION_GATES).forEach(([axis, gate]) => {
    const btn = document.createElement('button');
    btn.className = 'gate-btn';
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '44';
    btn.innerHTML = `${gate.label}<span class="gate-sub">${t(`rotationGates.${axis}.desc`, gate.desc)}</span>`;
    btn.addEventListener('click', () => {
      const angleDeg = parseInt(document.getElementById('rotation-angle').value, 10);
      applyRotationGate(axis, angleDeg, btn);
    });
    grid.appendChild(btn);
  });
  document.getElementById('rotation-angle').addEventListener('input', updateRotationAngleLabel);
}

function updateRotationAngleLabel() {
  const val = document.getElementById('rotation-angle').value;
  document.getElementById('rotation-angle-val').textContent = val + '°';
}

// always-visible glossary of what each gate letter actually stands for -
// the buttons above only show nicknames, this is the one place to see
// formal names without hovering or applying a gate first
function buildGateReference() {
  const rows = [
    ...Object.entries(GATES).map(([key, g]) => ({ key, ns: 'gates', name: g.name, color: g.color, formalName: g.formalName, desc: g.desc })),
    ...Object.entries(ROTATION_GATES).map(([key, g]) => ({ key, ns: 'rotationGates', name: g.label, color: g.color, formalName: g.formalName, desc: g.desc }))
  ];
  document.getElementById('gate-reference-list').innerHTML = rows.map(g => `
    <div class="gate-reference-row">
      <span class="gate-reference-symbol" style="color:${g.color}">${g.name}</span>
      <span class="gate-reference-formal">${t(`${g.ns}.${g.key}.formalName`, g.formalName)}</span>
      <span class="gate-reference-nick">${t(`${g.ns}.${g.key}.desc`, g.desc)}</span>
    </div>
  `).join('');
}

function applyRotationGate(axis, angleDeg, btn) {
  const gate = ROTATION_GATES[axis];
  const matrix = rotationMatrix(axis, angleDeg);
  qubitMain.applyGate(matrix);
  showRotationMatrix(axis, angleDeg, matrix);
  updateQubitUI();
  if (btn) pulseElement(btn, 'pulsing');
  pulseElement(document.querySelector('#tab-gates .bloch-wrap'), 'pulsing', 550);

  const p0 = Math.round(qubitMain.prob0() * 100);
  const p1 = Math.round(qubitMain.prob1() * 100);
  const explain = `<strong style="color:${gate.color}">${gate.label}(${angleDeg}°) — ${gate.desc}.</strong> Unlike the fixed gates above, you choose exactly how far this one turns — drag the angle slider and apply it again to see the difference. <br><br>New odds: ${p0}% |0⟩, ${p1}% |1⟩ — state is now <span style="font-family:'JetBrains Mono',monospace">${qubitMain.getFormula()}</span>.`;
  setExplainer('gate-explainer', explain);

  const b = qubitMain.getBloch();
  gateHistory.push({ label: `${gate.label}(${angleDeg}°)`, color: gate.color, theta: b.theta, phi: b.phi, matrix, rotationAxis: axis, rotationAngle: angleDeg, explain });
  gateHistoryCursor = gateHistory.length - 1;
  updateGatesUI();
}

function showRotationMatrix(axis, angleDeg, matrix) {
  const gate = ROTATION_GATES[axis];
  const cells = [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]].map(z => C.fmt(z));
  document.getElementById('matrix-display').innerHTML = `
    <div class="matrix-name">${gate.label}(${angleDeg}°) =</div>
    <div class="matrix-body">
      <span class="matrix-bracket">[</span>
      <div class="matrix-cells">
        <span class="matrix-cell" style="color:${gate.color}">${cells[0]}</span>
        <span class="matrix-cell" style="color:${gate.color}">${cells[1]}</span>
        <span class="matrix-cell" style="color:${gate.color}">${cells[2]}</span>
        <span class="matrix-cell" style="color:${gate.color}">${cells[3]}</span>
      </div>
      <span class="matrix-bracket">]</span>
    </div>
  `;
}

let gateHistoryCursor = -1; // entry currently on screen, not always the last one

function updateGatesUI() {
  const b = qubitMain.getBloch();
  rendererGates.animateTo(b.x, b.y, b.z, qubitMain.getLabel());
  document.getElementById('bloch-gates').setAttribute('aria-label',
    `Bloch sphere. State: ${qubitMain.getFormula()}.`);
  document.getElementById('label-gates').textContent = qubitMain.getLabel();
  renderGateHistory();
}

// clickable rollback chips, same .hist-tag/.is-current styling as every
// other Try Me history (components.css) - works for manual clicks or a
// Try Me run alike, restoreGateHistoryStep() below just restores the snapshot
function renderGateHistory() {
  const hist = document.getElementById('gate-history');
  if (!gateHistory.length) {
    hist.innerHTML = '<span class="muted-text">—</span>';
    return;
  }
  hist.innerHTML = '';
  gateHistory.forEach((entry, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'hist-tag' + (i === gateHistoryCursor ? ' is-current' : '');
    chip.style.color = entry.color;
    chip.style.borderColor = entry.color + '44';
    chip.textContent = entry.label;
    chip.title = 'Click to revisit this step and re-read its explanation';
    chip.addEventListener('click', () => {
      // Try Me disables the gate/rotation buttons while running, so this
      // doubles as the guard against a rollback click fighting the next
      // auto-play tick - same trick every other Try Me uses
      if (document.getElementById('btn-gates-tryme').disabled) return;
      restoreGateHistoryStep(i);
    });
    hist.appendChild(chip);
  });
}

// jumps straight to entry i's recorded (theta, phi) instead of replaying
// gates, works the same whether it came from a manual sequence or a Try
// Me step that reset to |0⟩ first. also restores the matrix display and
// explainer text. doesn't push a new history entry - just navigates.
function restoreGateHistoryStep(i) {
  const entry = gateHistory[i];
  if (!entry) return;
  gateHistoryCursor = i;
  qubitMain.setState(entry.theta, entry.phi);
  if (entry.rotationAxis) showRotationMatrix(entry.rotationAxis, entry.rotationAngle, entry.matrix);
  else showMatrix(entry.matrixKey);
  setExplainer('gate-explainer', entry.explain);
  updateGatesUI();
  updateQubitUI();
}

const GATES_TRYME_INTERVAL_MS = 2800; // explainer paragraph's a few sentences, needs actual reading time

// tours H, X, Y, Z, S, T once each, resetting to |0⟩ before every one so
// each effect shows against the same baseline instead of compounding -
// matches this tab's "pick one gate, see the effect" framing rather than
// building a sequence. reuses runTryMeSequence() from qubit-tab.js instead
// of duplicating the disable/loop/interval bookkeeping.
function initGatesTryMe() {
  document.getElementById('btn-gates-tryme').addEventListener('click', () => {
    const gateBtns = document.querySelectorAll('#gate-grid .gate-btn');
    runTryMeSequence({
      button: document.getElementById('btn-gates-tryme'),
      disableEls: [
        ...gateBtns,
        ...document.querySelectorAll('#rotation-gate-grid .gate-btn'),
        document.getElementById('rotation-angle'),
        document.getElementById('btn-reset-gates')
      ],
      states: Object.keys(GATES),
      applyState: key => {
        qubitMain = new Qubit();
        applyGate(key, document.querySelector(`#gate-grid [data-gate-key="${key}"]`));
      },
      intervalMs: GATES_TRYME_INTERVAL_MS
    });
  });
}

function resetGates() {
  qubitMain   = new Qubit();
  gateHistory = [];
  gateHistoryCursor = -1;
  document.getElementById('matrix-display').innerHTML = '<span class="muted-text">← select a gate</span>';
  setExplainer('gate-explainer', 'Back to |0⟩ — the qubit points straight up on the sphere, no gates applied yet. Click one to send it rotating.');
  updateGatesUI();
  updateQubitUI();
}
