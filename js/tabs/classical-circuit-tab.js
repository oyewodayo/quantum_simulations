'use strict';
// needs setExplainer (dom-utils.js), delay (utils.js). same palette/wire/
// Run/Clear interaction as the 1-qubit quantum circuit (circuit-tab.js) -
// reuses its CSS directly - just walking a classical bit instead of a
// qubit. AND/OR/XOR gates need a second input, so each one binds the
// current Companion bit toggle value at the moment it's added (shown in
// the slot, e.g. "AND w/1") - keeps the whole sequence a pure function of
// just the start bit, which is what the 2-row truth table relies on.

const CLASSICAL_GATES = {
  NOT:  { name: 'NOT',  inputs: 1, fn: (a) => 1 - a,        desc: 'Flips the single input',
    explain: 'NOT takes one input and flips it — the only gate here that doesn\'t need a second input at all. 0 becomes 1, 1 becomes 0, no exceptions.' },
  AND:  { name: 'AND',  inputs: 2, fn: (a, b) => a & b,     desc: 'Both must be 1',
    explain: 'AND only outputs 1 when every input is 1 — a strict, all-or-nothing gate. One 0 anywhere and the whole thing collapses to 0.' },
  OR:   { name: 'OR',   inputs: 2, fn: (a, b) => a | b,     desc: 'Either can be 1',
    explain: 'OR outputs 1 as soon as at least one input is 1 — the easiest gate to satisfy. Only both inputs being 0 gives a 0.' },
  XOR:  { name: 'XOR',  inputs: 2, fn: (a, b) => a ^ b,     desc: 'Exactly one is 1',
    explain: 'XOR (exclusive OR) outputs 1 only when the inputs disagree — one 0 and one 1. Two matching inputs, either 0,0 or 1,1, give a 0.' },
  NAND: { name: 'NAND', inputs: 2, fn: (a, b) => 1 - (a & b), desc: 'Opposite of AND',
    explain: 'NAND is AND with the output flipped — 0 only when both inputs are 1, and 1 in every other case. It\'s "universal": every other classical gate can be built from NANDs alone.' },
  NOR:  { name: 'NOR',  inputs: 2, fn: (a, b) => 1 - (a | b), desc: 'Opposite of OR',
    explain: 'NOR is OR with the output flipped — 1 only when both inputs are 0, and 0 as soon as either input is 1.' },
  XNOR: { name: 'XNOR', inputs: 2, fn: (a, b) => 1 - (a ^ b), desc: 'Opposite of XOR',
    explain: 'XNOR is XOR with the output flipped — 1 when the inputs agree (0,0 or 1,1), 0 when they differ. It\'s a literal equality check.' }
};

// standard schematic shapes - AND's D-shape, OR/XOR's curved shield (XOR
// gets an extra back line), NOT's triangle+bubble. N-prefixed negations
// just reuse the un-negated body plus an output bubble. using real symbols
// instead of letters so this actually looks like a logic circuit.
// monochrome on purpose - real schematics don't color-code gates like the
// quantum gates elsewhere in this app do.
const CLASSICAL_GATE_SHAPES = {
  NOT:  { body: 'not', bubble: true }, // the bubble is intrinsic to NOT's own symbol, not an "added negation" like N*-family gates below
  AND:  { body: 'and' },
  NAND: { body: 'and', bubble: true },
  OR:   { body: 'or' },
  NOR:  { body: 'or', bubble: true },
  XOR:  { body: 'xor' },
  XNOR: { body: 'xor', bubble: true }
};

// renders one gate's schematic symbol as an inline SVG string - shared by
// the Classical Gates tab palette (classical-gates-tab.js, same reuse as
// CLASSICAL_GATES) and this tab's palette + wire slots. companion (0/1) is
// optional; when a gate's actually on the wire (not just a palette
// preview) it gets drawn as a small label on the second input stub so you
// can see the bound value without hovering.
function classicalGateIconSVG(key, companion) {
  const shape     = CLASSICAL_GATE_SHAPES[key].body;
  const hasBubble = !!CLASSICAL_GATE_SHAPES[key].bubble;
  const twoInput  = shape !== 'not';

  let body, tipX, backX;
  if (shape === 'not') {
    body  = '<path d="M16,6 L16,34 L44,20 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
    tipX  = 44; backX = 16;
  } else if (shape === 'and') {
    body  = '<path d="M16,6 H32 A14,14 0 0 1 32,34 H16 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
    tipX  = 46; backX = 16;
  } else {
    // OR/XOR: a curved "shield" — concave back, pointed front.
    body  = '<path d="M18,7 C28,7 40,10 50,20 C40,30 28,33 18,33 C24,26 24,14 18,7 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
    if (shape === 'xor') {
      body += '<path d="M12,7 C18,14 18,26 12,33" fill="none" stroke="currentColor" stroke-width="2"/>';
    }
    tipX  = 50; backX = 18;
  }

  let outX = tipX, bubble = '';
  if (hasBubble) {
    bubble = `<circle cx="${tipX + 4}" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/>`;
    outX   = tipX + 8;
  }

  const inputs = twoInput
    ? `<line x1="0" y1="13" x2="${backX}" y2="13" stroke="currentColor" stroke-width="2"/>
       <line x1="0" y1="27" x2="${backX}" y2="27" stroke="currentColor" stroke-width="2"/>`
    : `<line x1="0" y1="20" x2="${backX}" y2="20" stroke="currentColor" stroke-width="2"/>`;

  const companionLabel = (twoInput && companion !== undefined)
    ? `<text x="1" y="24" font-size="9" font-family="'JetBrains Mono',monospace" fill="currentColor">${companion}</text>`
    : '';

  const outputLine = `<line x1="${outX}" y1="20" x2="64" y2="20" stroke="currentColor" stroke-width="2"/>`;

  return `<svg viewBox="0 0 64 40" class="classical-gate-icon" aria-hidden="true">${inputs}${body}${bubble}${outputLine}${companionLabel}</svg>`;
}

const CLASSICAL_SLOT_COUNT = 8;

let classicalWireGates    = []; // { key, companion: 0|1 } — companion unused/omitted for NOT
let classicalStartBit     = 1;
let classicalCompanionBit = 1;

// NOT's self-cancellation, AND's all-or-nothing squash, XOR's cipher-like
// cancel-with-same-key trick - each one picked to show off its gate
// family's signature behavior
const CLASSICAL_PRESETS = [
  { name: 'Double NOT', startBit: 1, gates: [{ key: 'NOT' }, { key: 'NOT' }] },
  { name: 'AND Gate',   startBit: 1, gates: [{ key: 'AND', companion: 0 }] },
  { name: 'XOR Cipher', startBit: 0, gates: [{ key: 'XOR', companion: 1 }, { key: 'XOR', companion: 1 }] }
];

function loadClassicalPreset(preset) {
  classicalWireGates = preset.gates.map(g => ({ ...g }));
  classicalStartBit  = preset.startBit;
  document.getElementById('cc-start-bit').checked = classicalStartBit === 1;
  updateClassicalWireUI();
  renderClassicalGateSlots();
  setClassicalCircuitStatus('');
  runClassicalCircuit();
}

function initClassicalCircuitTab() {
  buildClassicalGatePalette();
  buildClassicalGateSlots();
  renderTryMe('classical-try-me', CLASSICAL_PRESETS, loadClassicalPreset);

  document.getElementById('cc-start-bit').addEventListener('change', e => {
    classicalStartBit = e.target.checked ? 1 : 0;
    updateClassicalWireUI();
  });
  document.getElementById('cc-companion-bit').addEventListener('change', e => {
    classicalCompanionBit = e.target.checked ? 1 : 0;
    document.getElementById('cc-companion-lbl0').classList.toggle('active', classicalCompanionBit === 0);
    document.getElementById('cc-companion-lbl1').classList.toggle('active', classicalCompanionBit === 1);
  });
  document.getElementById('btn-run-classical-circuit').addEventListener('click', runClassicalCircuit);
  document.getElementById('btn-clear-classical-circuit').addEventListener('click', clearClassicalCircuit);

  updateClassicalWireUI();
}

function buildClassicalGatePalette() {
  const palette = document.getElementById('classical-gate-palette');
  Object.entries(CLASSICAL_GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className  = 'circuit-gate-btn classical-gate-palette-btn';
    btn.innerHTML  = `${classicalGateIconSVG(key)}<span class="circuit-gate-btn-label">${gate.name}</span>`;
    btn.title      = gate.desc;
    btn.addEventListener('click', () => addClassicalGate(key));
    palette.appendChild(btn);
  });
}

function buildClassicalGateSlots() {
  const el = document.getElementById('classical-gate-slots');
  el.innerHTML = '';
  for (let i = 0; i < CLASSICAL_SLOT_COUNT; i++) {
    const slot = document.createElement('div');
    slot.className     = 'gate-slot empty';
    slot.dataset.index = i;
    slot.title         = 'Click to remove';
    slot.addEventListener('click', () => removeClassicalGate(i));
    el.appendChild(slot);
  }
  renderClassicalGateSlots();
}

// full label with the bound companion bit (e.g. "AND w/1") - just for the
// hover tooltip, that detail isn't needed anywhere read constantly
function classicalGateLabel(entry) {
  const gate = CLASSICAL_GATES[entry.key];
  return gate.inputs === 1 ? 'NOT' : `${gate.name} w/${entry.companion}`;
}

// just the gate name, for the route/checkpoint text that already shows
// the companion bit elsewhere - no need to repeat it
function classicalGateShortName(entry) {
  return CLASSICAL_GATES[entry.key].name;
}

function addClassicalGate(key) {
  if (classicalWireGates.length >= CLASSICAL_SLOT_COUNT) {
    setClassicalCircuitStatus('Circuit full — clear to reset');
    return;
  }
  const gate = CLASSICAL_GATES[key];
  classicalWireGates.push(gate.inputs === 1 ? { key } : { key, companion: classicalCompanionBit });
  renderClassicalGateSlots();
  setClassicalCircuitStatus('');
  setClassicalExplainer(
    classicalWireGates.length === 1
      ? `${classicalGateShortName(classicalWireGates[0])} takes the first checkpoint on the wire. The bit hasn't moved yet, though — it's still sitting at ${classicalStartBit} until you hit Run and send it walking down the line.`
      : `Checkpoint ${classicalWireGates.length} is now ${classicalGateShortName(classicalWireGates[classicalWireGates.length - 1])}. The route so far: ${classicalWireGates.map(classicalGateShortName).join(' → ')}. Hit Run and the bit will walk it start to finish.`
  );
}

function removeClassicalGate(i) {
  if (i < classicalWireGates.length) {
    classicalWireGates.splice(i, 1);
    renderClassicalGateSlots();
    setClassicalExplainer(
      classicalWireGates.length
        ? `Checkpoint removed. Remaining route: ${classicalWireGates.map(classicalGateShortName).join(' → ')}.`
        : 'Route cleared — the wire is empty. Click gates above to lay down a new path.'
    );
  }
}

function renderClassicalGateSlots() {
  const slots = document.querySelectorAll('#classical-gate-slots .gate-slot');
  slots.forEach((slot, i) => {
    const entry = classicalWireGates[i];
    if (entry) {
      // real schematic symbol instead of plain text name - companion bit
      // (AND/OR/XOR-family) gets drawn right on the input stub
      const gate = CLASSICAL_GATES[entry.key];
      slot.innerHTML  = classicalGateIconSVG(entry.key, gate.inputs === 2 ? entry.companion : undefined);
      slot.title      = `${classicalGateLabel(entry)} — click to remove`;
      slot.setAttribute('aria-label', `${classicalGateLabel(entry)} — click to remove`);
      slot.className  = 'gate-slot filled classical-gate-slot-filled';
    } else if (i === 0 && classicalWireGates.length === 0) {
      // Empty-state hint, same convention as the quantum wire's first slot.
      slot.textContent = '+';
      slot.title        = 'Click to remove';
      slot.removeAttribute('aria-label');
      slot.className = 'gate-slot empty gate-slot-hint';
    } else {
      slot.textContent = '';
      slot.title        = 'Click to remove';
      slot.removeAttribute('aria-label');
      slot.className = 'gate-slot empty';
    }
  });
  // The truth table is a pure function of the current sequence, so any
  // add/remove/clear needs to refresh it too, not just a start-bit toggle.
  renderClassicalTruthTable();
}

// pure walk of startBit through a gate sequence, no animation/DOM - used by
// the live truth table and as the logic runClassicalCircuit() animates through
function simulateClassicalSequence(startBit, sequence) {
  let bit = startBit;
  for (const entry of sequence) {
    const gate = CLASSICAL_GATES[entry.key];
    bit = gate.inputs === 1 ? gate.fn(bit) : gate.fn(bit, entry.companion);
  }
  return bit;
}

// Run History (rollback), see runClassicalCircuit()/renderClassicalHistory()
// below. no per-gate color like the quantum chips get - CLASSICAL_GATES was
// never color-coded (schematics don't color-code), so these just use
// .hist-tag's plain default look.
let classicalRunHistory    = [];
let classicalHistoryCursor = -1;
let classicalCircuitRunning = false;

async function runClassicalCircuit() {
  if (classicalCircuitRunning) return;
  if (classicalWireGates.length === 0) {
    setClassicalCircuitStatus('Add gates first');
    setClassicalExplainer('The wire is empty — there\'s no path to walk yet. Click gates in the palette above to lay one down, then press Run.');
    return;
  }
  classicalCircuitRunning = true;
  let bit = classicalStartBit;
  const slots = document.querySelectorAll('#classical-gate-slots .gate-slot');
  setClassicalCircuitStatus('Running…');
  setClassicalExplainer(`The bit steps onto the wire at ${bit} and starts walking the line, left to right…`);
  updateClassicalOutputDisplay(null);
  classicalRunHistory = [];
  classicalHistoryCursor = -1;
  renderClassicalHistory();

  for (let i = 0; i < classicalWireGates.length; i++) {
    const entry = classicalWireGates[i];
    const gate  = CLASSICAL_GATES[entry.key];
    slots[i].classList.add('running');
    setClassicalExplainer(`Checkpoint ${i + 1} of ${classicalWireGates.length}: ${classicalGateShortName(entry)} — ${gate.desc.toLowerCase()}. ${gate.explain.split('.')[0]}.`);
    await delay(320);
    bit = gate.inputs === 1 ? gate.fn(bit) : gate.fn(bit, entry.companion);
    updateClassicalOutputDisplay(bit);
    const explain = `<strong>Step ${i + 1}: ${classicalGateShortName(entry)} — ${gate.desc}.</strong> ${gate.explain} <br><br>Output is now <span style="font-family:'JetBrains Mono',monospace">${bit}</span>.`;
    classicalRunHistory.push({ bit, label: String(i + 1), title: `Step ${i + 1}: ${classicalGateShortName(entry)} → ${bit}`, explain });
    classicalHistoryCursor = classicalRunHistory.length - 1;
    renderClassicalHistory();
    await delay(130);
    slots[i].classList.remove('running');
  }

  classicalCircuitRunning = false;
  setClassicalCircuitStatus(`Done · output ${bit}`);
  setClassicalExplainer(`Journey complete. Starting from ${classicalStartBit} and passing through ${classicalWireGates.map(classicalGateShortName).join(' → ')}, the bit arrives at ${bit}.`);
}

function renderClassicalHistory() {
  const hist = document.getElementById('classical-circuit-history');
  if (!hist) return;
  if (!classicalRunHistory.length) { hist.innerHTML = '<span class="muted-text">—</span>'; return; }
  hist.innerHTML = '';
  classicalRunHistory.forEach((entry, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'hist-tag' + (i === classicalHistoryCursor ? ' is-current' : '');
    chip.textContent = entry.label;
    chip.title = entry.title;
    chip.addEventListener('click', () => {
      if (classicalCircuitRunning) return;
      restoreClassicalHistoryStep(i);
    });
    hist.appendChild(chip);
  });
}

// restores step i's recorded bit value directly - a classical bit's whole
// state is just that one value, nothing else to snapshot - plus the
// explainer text from that step
function restoreClassicalHistoryStep(i) {
  const entry = classicalRunHistory[i];
  if (!entry) return;
  classicalHistoryCursor = i;
  updateClassicalOutputDisplay(entry.bit);
  renderClassicalHistory();
  setClassicalCircuitStatus(`Step ${entry.label} of ${classicalRunHistory.length}`);
  setClassicalExplainer(entry.explain);
}

function clearClassicalCircuit() {
  classicalWireGates = [];
  buildClassicalGateSlots();
  updateClassicalOutputDisplay(null);
  setClassicalCircuitStatus('');
  setClassicalExplainer('Route cleared. Lay down a path by clicking gates above — each one claims the next checkpoint on the wire. Press Run and the start bit walks it end to end, one stop at a time.');
  classicalRunHistory = [];
  classicalHistoryCursor = -1;
  renderClassicalHistory();
}

function setClassicalCircuitStatus(msg) {
  document.getElementById('classical-circuit-status').textContent = msg;
}

function setClassicalExplainer(msg) {
  setExplainer('classical-circuit-explainer', msg);
}

function updateClassicalOutputDisplay(bit) {
  const display = document.getElementById('cc-output-display');
  display.textContent = bit === null ? '—' : bit;
  display.classList.toggle('is-zero', bit === 0);
}

// refreshes everything tied to classicalStartBit/companion that doesn't
// need a Run: start-bit label, toggle highlighting, truth table (always
// accurate since it's a pure function of the sequence, even pre-Run)
function updateClassicalWireUI() {
  document.getElementById('cc-wire-start').textContent = classicalStartBit;
  document.getElementById('cc-start-lbl0').classList.toggle('active', classicalStartBit === 0);
  document.getElementById('cc-start-lbl1').classList.toggle('active', classicalStartBit === 1);
  renderClassicalTruthTable();
}

function renderClassicalTruthTable() {
  const table = document.getElementById('cc-truth-table');
  const rows = [0, 1].map(start => ({ start, out: simulateClassicalSequence(start, classicalWireGates) }));
  let html = '<tr><th>Start</th><th>Output</th></tr>';
  html += rows.map(r =>
    `<tr class="${r.start === classicalStartBit ? 'truth-row-active' : ''}"><td>${r.start}</td><td>${r.out}</td></tr>`
  ).join('');
  table.innerHTML = html;
}
