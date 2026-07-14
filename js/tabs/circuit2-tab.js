'use strict';
// Depends on: core/gates.js (GATES), core/two-qubit.js (TwoQubitState),
// core/dom-utils.js (setExplainer), core/utils.js (delay).
//
// A second, independent circuit builder for two qubits, reachable via the
// "2 Qubits" mode toggle at the top of the Circuit tab. Unlike the
// single-qubit circuit (tabs/circuit-tab.js), gates target a specific
// wire (qubit 0 or 1) chosen via a toggle, and CNOT is added as its own
// two-wire step. circuit2Gates[] stays a flat, sequential array (index =
// diagram column) — renderCircuit2Sequence() below is what turns that
// into an actual two-wire circuit diagram, so the underlying model is
// still as simple as the single-qubit circuit's.

const CIRCUIT2_MAX_STEPS = 10;

let circuit2Gates       = []; // { type: 'single', qubit, key } | { type: 'cnot', control, target }
let circuit2TargetQubit = 0;
let circuit2State       = new TwoQubitState();

function initCircuit2Tab() {
  document.querySelectorAll('.mode-btn[data-circuit-mode]').forEach(btn => {
    btn.addEventListener('click', () => setCircuitMode(btn.dataset.circuitMode));
  });
  document.querySelectorAll('.mode-btn[data-target-qubit]').forEach(btn => {
    btn.addEventListener('click', () => {
      circuit2TargetQubit = parseInt(btn.dataset.targetQubit, 10);
      document.querySelectorAll('.mode-btn[data-target-qubit]').forEach(b =>
        b.classList.toggle('active', b === btn));
    });
  });

  buildCircuit2Palette();
  document.getElementById('btn-add-cnot-01').addEventListener('click', () => addCircuit2Gate({ type: 'cnot', control: 0, target: 1 }));
  document.getElementById('btn-add-cnot-10').addEventListener('click', () => addCircuit2Gate({ type: 'cnot', control: 1, target: 0 }));
  document.getElementById('btn-run-circuit-2q').addEventListener('click', runCircuit2);
  document.getElementById('btn-clear-circuit-2q').addEventListener('click', clearCircuit2);

  renderCircuit2Sequence();
  updateCircuit2UI();
}

function setCircuitMode(mode) {
  document.querySelectorAll('.mode-btn[data-circuit-mode]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.circuitMode === mode));
  document.getElementById('circuit-1q-panel').style.display = mode === '1q' ? '' : 'none';
  document.getElementById('circuit-2q-panel').style.display = mode === '2q' ? '' : 'none';
}

function buildCircuit2Palette() {
  const palette = document.getElementById('circuit-2q-palette');
  Object.entries(GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className         = 'circuit-gate-btn';
    btn.textContent       = gate.name;
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '55';
    btn.title   = gate.desc;
    // Reads circuit2TargetQubit at click time (not capture time), so
    // switching the target-qubit toggle after building the palette
    // still routes new gates to the currently-selected wire.
    btn.addEventListener('click', () => addCircuit2Gate({ type: 'single', qubit: circuit2TargetQubit, key }));
    palette.appendChild(btn);
  });
}

function addCircuit2Gate(entry) {
  if (circuit2Gates.length >= CIRCUIT2_MAX_STEPS) {
    setCircuit2Status('Sequence full — clear to reset');
    return;
  }
  circuit2Gates.push(entry);
  renderCircuit2Sequence();
  setCircuit2Status('');
}

function removeCircuit2Gate(i) {
  circuit2Gates.splice(i, 1);
  renderCircuit2Sequence();
}

function circuit2EntryLabel(entry) {
  if (entry.type === 'cnot') return `CNOT Q${entry.control}→Q${entry.target}`;
  return `${GATES[entry.key].name} on Q${entry.qubit}`;
}

/**
 * Renders circuit2Gates[] as an actual two-wire circuit diagram: one CSS
 * Grid with 2 rows (Qubit 0, Qubit 1) and CIRCUIT2_MAX_STEPS columns.
 * Each gates[] entry owns one column, shared by both rows — a CNOT's
 * control dot, target ⊕, and connecting line are three separate grid
 * items placed in that same grid-column (rows 1, 2, and 1/3 respectively),
 * which is what makes them line up under each other automatically
 * without any manual pixel math. Columns past circuit2Gates.length are
 * empty dashed placeholders, matching the single-qubit wire's slots.
 */
function renderCircuit2Sequence() {
  const container = document.getElementById('circuit-2q-diagram');
  let html = '';

  html += `<div class="circuit2-ket" style="grid-column:1;grid-row:1;">|0⟩</div>`;
  html += `<div class="circuit2-ket" style="grid-column:1;grid-row:2;">|0⟩</div>`;
  html += `<div class="circuit2-wire" style="grid-column:2/-1;grid-row:1;"></div>`;
  html += `<div class="circuit2-wire" style="grid-column:2/-1;grid-row:2;"></div>`;

  for (let c = 0; c < CIRCUIT2_MAX_STEPS; c++) {
    const col   = c + 2; // grid-column 1 is the |0⟩ label
    const entry = circuit2Gates[c];

    if (!entry) {
      const isHint = c === 0 && circuit2Gates.length === 0;
      html += `<div class="circuit2-cell empty${isHint ? ' circuit2-cell-hint' : ''}" style="grid-column:${col};grid-row:1;">${isHint ? '+' : ''}</div>`;
      html += `<div class="circuit2-cell empty" style="grid-column:${col};grid-row:2;"></div>`;
      continue;
    }

    if (entry.type === 'single') {
      const g   = GATES[entry.key];
      const row = entry.qubit + 1;
      html += `<button class="circuit2-cell circuit2-gate" data-i="${c}" style="grid-column:${col};grid-row:${row};color:${g.color};border-color:${g.color}" title="${circuit2EntryLabel(entry)} — click to remove">${g.name}</button>`;
    } else {
      const controlRow = entry.control + 1;
      const targetRow  = entry.target + 1;
      html += `<div class="circuit2-cnot-line" style="grid-column:${col};grid-row:1/3;"></div>`;
      html += `<button class="circuit2-cell circuit2-cnot-dot" data-i="${c}" style="grid-column:${col};grid-row:${controlRow};" title="${circuit2EntryLabel(entry)} — click to remove"></button>`;
      html += `<button class="circuit2-cell circuit2-cnot-target" data-i="${c}" style="grid-column:${col};grid-row:${targetRow};" title="${circuit2EntryLabel(entry)} — click to remove">⊕</button>`;
    }
  }

  container.innerHTML = html;
  container.querySelectorAll('[data-i]').forEach(el => {
    el.addEventListener('click', () => removeCircuit2Gate(parseInt(el.dataset.i, 10)));
  });
}

async function runCircuit2() {
  if (circuit2Gates.length === 0) {
    setCircuit2Status('Add gates first');
    return;
  }
  circuit2State = new TwoQubitState();
  setCircuit2Status('Running…');
  setCircuit2Explainer('Both qubits start at |00⟩ and step through the sequence in order…');

  for (let i = 0; i < circuit2Gates.length; i++) {
    const entry = circuit2Gates[i];
    const stepEls = document.querySelectorAll(`#circuit-2q-diagram [data-i="${i}"]`);
    stepEls.forEach(el => el.classList.add('running'));
    setCircuit2Explainer(`Step ${i + 1} of ${circuit2Gates.length}: ${circuit2EntryLabel(entry)}.`);
    await delay(320);
    if (entry.type === 'cnot') {
      circuit2State.applyCNOT(entry.control, entry.target);
    } else {
      circuit2State.applySingleQubitGate(entry.qubit, GATES[entry.key].matrix);
    }
    updateCircuit2UI();
    await delay(130);
    stepEls.forEach(el => el.classList.remove('running'));
  }

  setCircuit2Status('Done');
  const p00 = circuit2State.prob(0), p11 = circuit2State.prob(3);
  const entangled = p00 > 0.001 && p11 > 0.001 && circuit2State.prob(1) < 0.001 && circuit2State.prob(2) < 0.001;
  setCircuit2Explainer(
    entangled
      ? `That's an entangled pair: only |00⟩ (${Math.round(p00 * 100)}%) and |11⟩ (${Math.round(p11 * 100)}%) show up — measuring one qubit instantly tells you the other, exactly like the Entangle tab, except this time H + CNOT built it from scratch.`
      : `Sequence complete. Final state: ${circuit2State.getFormula()}.`
  );
}

function clearCircuit2() {
  circuit2Gates = [];
  circuit2State = new TwoQubitState();
  renderCircuit2Sequence();
  updateCircuit2UI();
  setCircuit2Status('');
  setCircuit2Explainer('Two qubits, no entanglement yet. Try adding H to Qubit 0, then CNOT Q0→Q1, then press Run — that\'s the exact recipe behind the Bell state you saw in the Entangle tab, except this time you built it gate by gate.');
}

function setCircuit2Status(msg) {
  document.getElementById('circuit-2q-status').textContent = msg;
}

function setCircuit2Explainer(msg) {
  setExplainer('circuit-2q-explainer', msg);
}

function updateCircuit2UI() {
  const kets = ['00', '01', '10', '11'];
  document.getElementById('circuit-2q-formula').textContent = circuit2State.getFormula();
  kets.forEach((ket, i) => {
    const pct = circuit2State.prob(i) * 100;
    document.getElementById(`c2-fill-${ket}`).style.width = pct + '%';
    document.getElementById(`c2-pct-${ket}`).textContent   = Math.round(pct) + '%';
  });
}
