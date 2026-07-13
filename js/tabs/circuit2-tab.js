'use strict';
// Depends on: core/gates.js (GATES), core/two-qubit.js (TwoQubitState),
// core/dom-utils.js (setExplainer), core/utils.js (delay).
//
// A second, independent circuit builder for two qubits, reachable via the
// "2 Qubits" mode toggle at the top of the Circuit tab. Unlike the
// single-qubit circuit (tabs/circuit-tab.js), gates target a specific
// wire (qubit 0 or 1) chosen via a toggle, and CNOT is added as its own
// two-wire step — this keeps the same flat, sequential gate-list model
// as the single-qubit circuit instead of a full 2D circuit-diagram
// renderer, while still being able to build a real Bell pair by hand
// (H on Q0, then CNOT Q0→Q1) and watch entanglement appear in the
// |00⟩/|01⟩/|10⟩/|11⟩ probability bars.

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
  return `${GATES[entry.key].name}·Q${entry.qubit}`;
}

function circuit2EntryColor(entry) {
  return entry.type === 'cnot' ? 'var(--text)' : GATES[entry.key].color;
}

function renderCircuit2Sequence() {
  const el = document.getElementById('circuit-2q-sequence');
  el.innerHTML = circuit2Gates.length
    ? circuit2Gates.map((entry, i) => {
        const color = circuit2EntryColor(entry);
        return `<span class="hist-tag" data-i="${i}" style="color:${color};border-color:${color}44;cursor:pointer" title="Click to remove">${circuit2EntryLabel(entry)}</span>`;
      }).join('')
    : '<span class="muted-text">—</span>';
  el.querySelectorAll('.hist-tag').forEach(tag => {
    tag.addEventListener('click', () => removeCircuit2Gate(parseInt(tag.dataset.i, 10)));
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

  const tags = document.querySelectorAll('#circuit-2q-sequence .hist-tag');
  for (let i = 0; i < circuit2Gates.length; i++) {
    const entry = circuit2Gates[i];
    if (tags[i]) tags[i].style.boxShadow = '0 0 12px currentColor';
    setCircuit2Explainer(`Step ${i + 1} of ${circuit2Gates.length}: ${circuit2EntryLabel(entry)}.`);
    await delay(320);
    if (entry.type === 'cnot') {
      circuit2State.applyCNOT(entry.control, entry.target);
    } else {
      circuit2State.applySingleQubitGate(entry.qubit, GATES[entry.key].matrix);
    }
    updateCircuit2UI();
    await delay(130);
    if (tags[i]) tags[i].style.boxShadow = '';
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
