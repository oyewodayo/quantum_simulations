'use strict';
// Depends on: core/gates.js (GATES), core/utils.js (delay),
// core/dom-utils.js (copyShareLink),
// app.js state (circuitGates, SLOT_COUNT, qubitCircuit, rendererCircuit).

// ═══════════════════════════════════════════════════════════════════
// CIRCUIT TAB
// ═══════════════════════════════════════════════════════════════════
function initCircuitTab() {
  document.getElementById('btn-run-circuit').addEventListener('click', runCircuit);
  document.getElementById('btn-clear-circuit').addEventListener('click', clearCircuit);
  document.getElementById('btn-share-circuit').addEventListener('click', e => {
    copyShareLink({ tab: 'circuit', circuit: circuitGates.join(',') }, e.currentTarget);
  });
}

function buildCircuitPalette() {
  const palette = document.getElementById('circuit-palette');
  Object.entries(GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className         = 'circuit-gate-btn';
    btn.textContent       = gate.name;
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '55';
    btn.title   = gate.desc;
    btn.addEventListener('click', () => addGateToCircuit(key));
    palette.appendChild(btn);
  });
}

function buildCircuitSlots() {
  const el = document.getElementById('gate-slots');
  el.innerHTML = '';
  for (let i = 0; i < SLOT_COUNT; i++) {
    const slot = document.createElement('div');
    slot.className     = 'gate-slot empty';
    slot.dataset.index = i;
    slot.title         = 'Click to remove';
    slot.addEventListener('click', () => removeCircuitGate(i));
    el.appendChild(slot);
  }
  renderCircuitSlots();
}

function addGateToCircuit(key) {
  if (circuitGates.length >= SLOT_COUNT) {
    setCircuitStatus('Circuit full — clear to reset');
    return;
  }
  circuitGates.push(key);
  renderCircuitSlots();
  setCircuitStatus('');
  setCircuitExplainer(
    circuitGates.length === 1
      ? `${GATES[key].name} takes the first checkpoint on the wire. The qubit hasn't moved yet, though — it's still sitting at |0⟩ until you hit Run and send it walking down the line.`
      : `Checkpoint ${circuitGates.length} is now ${GATES[key].name}. The route so far: ${circuitGates.map(k => GATES[k].name).join(' → ')}. Hit Run and the qubit will walk it start to finish.`
  );
}

function removeCircuitGate(i) {
  if (i < circuitGates.length) {
    circuitGates.splice(i, 1);
    renderCircuitSlots();
    setCircuitExplainer(
      circuitGates.length
        ? `Checkpoint removed. Remaining route: ${circuitGates.map(k => GATES[k].name).join(' → ')}.`
        : 'Route cleared — the wire is empty. Click gates above to lay down a new path.'
    );
  }
}

function renderCircuitSlots() {
  const slots = document.querySelectorAll('.gate-slot');
  slots.forEach((slot, i) => {
    const key = circuitGates[i];
    if (key) {
      const g = GATES[key];
      slot.textContent      = g.name;
      slot.style.color       = g.color;
      slot.style.borderColor = g.color;
      slot.className = 'gate-slot filled';
    } else {
      slot.textContent       = '';
      slot.style.color       = '';
      slot.style.borderColor = '';
      slot.className = 'gate-slot empty';
    }
  });
}

async function runCircuit() {
  if (circuitGates.length === 0) {
    setCircuitStatus('Add gates first');
    setCircuitExplainer('The wire is empty — there\'s no path to walk yet. Click gates in the palette above to lay one down, then press Run.');
    return;
  }
  qubitCircuit = new Qubit();
  const slots  = document.querySelectorAll('.gate-slot');
  setCircuitStatus('Running…');
  setCircuitExplainer('The qubit steps onto the wire at |0⟩ and starts walking the line, left to right…');

  for (let i = 0; i < circuitGates.length; i++) {
    const key  = circuitGates[i];
    const gate = GATES[key];
    slots[i].classList.add('running');
    slots[i].style.color = gate.color;
    setCircuitExplainer(`Checkpoint ${i + 1} of ${circuitGates.length}: ${gate.name} — ${gate.desc.toLowerCase()}. ${gate.explain.split('.')[0]}.`);
    await delay(320);
    qubitCircuit.applyGate(gate.matrix);
    updateCircuitUI();
    await delay(130);
    slots[i].classList.remove('running');
    slots[i].style.boxShadow = '';
  }
  setCircuitStatus(`Done · ${qubitCircuit.getLabel()}`);
  const p0 = Math.round(qubitCircuit.prob0() * 100);
  const p1 = Math.round(qubitCircuit.prob1() * 100);
  setCircuitExplainer(`Journey complete. After passing through ${circuitGates.map(k => GATES[k].name).join(' → ')}, the qubit arrives at ${qubitCircuit.getFormula()} — a ${p0}% / ${p1}% shot at |0⟩ vs |1⟩ if you measured it right now.`);
}

function clearCircuit() {
  circuitGates = [];
  qubitCircuit = new Qubit();
  buildCircuitSlots();
  updateCircuitUI();
  setCircuitStatus('');
  setCircuitExplainer('Route cleared. Lay down a path by clicking gates above — each one claims the next checkpoint on the wire. Press Run and the qubit walks it from |0⟩ to the end, one stop at a time.');
}

function setCircuitExplainer(msg) {
  setExplainer('circuit-explainer', msg);
}

function updateCircuitUI() {
  const b  = qubitCircuit.getBloch();
  const p0 = qubitCircuit.prob0() * 100;
  const p1 = qubitCircuit.prob1() * 100;
  rendererCircuit.animateTo(b.x, b.y, b.z);
  document.getElementById('bloch-circuit').setAttribute('aria-label',
    `Bloch sphere showing the circuit's output state. State: ${qubitCircuit.getFormula()}.`);
  document.getElementById('label-circuit').textContent = qubitCircuit.getLabel();
  document.getElementById('cfill0').style.width = p0 + '%';
  document.getElementById('cfill1').style.width = p1 + '%';
  document.getElementById('cpct0').textContent  = Math.round(p0) + '%';
  document.getElementById('cpct1').textContent  = Math.round(p1) + '%';
}

function setCircuitStatus(msg) {
  document.getElementById('circuit-status').textContent = msg;
}
