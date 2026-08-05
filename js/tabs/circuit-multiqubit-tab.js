'use strict';
// needs GATES (gates.js), blochVectorLabel (qubit.js), TwoQubitState/
// ThreeQubitState, setExplainer/renderTryMe/buildGatePalette (dom-utils),
// delay (utils.js), rendererCircuit2/rendererCircuit3 from app.js.
//
// 2-qubit and 3-qubit circuit builders, toggled via the mode switch at the
// top of the panel (setCircuitMode below). used to be two separate files
// (circuit2-tab.js/circuit3-tab.js) that were like 90% identical - same
// gate-entry model, same grid diagram algorithm, same run/status/explainer
// flow - so I merged them into one implementation driven by a small config
// per qubit count (CIRCUIT2_CONFIG/CIRCUIT3_CONFIG). makeMultiQubitCircuit(cfg)
// just returns a plain instance object holding the mutable state; functions
// take it as the first arg instead of being methods, same as everywhere else
// in this codebase — classes are reserved for things with real invariants
// (TwoQubitState, BlochRenderer etc), this is just UI wiring.
//
// single-qubit circuit-tab.js is NOT folded into this — different UI
// entirely (linear checkpoint wire, one Bloch sphere, no CNOT), not worth
// bending its markup to fit this grid shape just to save a few lines.

const CIRCUIT_MULTIQUBIT_MAX_STEPS = 10;

const CIRCUIT3_KETS = ['000', '001', '010', '011', '100', '101', '110', '111'];

// three 2-qubit presets: a standard Bell pair, a same-basis flip with no
// entanglement, and an anti-correlated variant (X before CNOT flips which
// pairs show up)
const CIRCUIT2_PRESETS = [
  { name: 'Bell Pair',       gates: [{ type: 'single', qubit: 0, key: 'H' }, { type: 'cnot', control: 0, target: 1 }] },
  { name: 'Flip Both',       gates: [{ type: 'single', qubit: 0, key: 'X' }, { type: 'single', qubit: 1, key: 'X' }] },
  { name: 'Anti-Correlated', gates: [{ type: 'single', qubit: 0, key: 'H' }, { type: 'single', qubit: 1, key: 'X' }, { type: 'cnot', control: 0, target: 1 }] }
];

// three 3-qubit presets: a GHZ state (one H, CNOT fanning out to each
// qubit), plain triple flip, and a Bell pair on just two of the three
// wires - entanglement doesn't have to touch every qubit
const CIRCUIT3_PRESETS = [
  { name: 'GHZ State',        gates: [{ type: 'single', qubit: 0, key: 'H' }, { type: 'cnot', control: 0, target: 1 }, { type: 'cnot', control: 0, target: 2 }] },
  { name: 'Flip All Three',   gates: [{ type: 'single', qubit: 0, key: 'X' }, { type: 'single', qubit: 1, key: 'X' }, { type: 'single', qubit: 2, key: 'X' }] },
  { name: 'Partial Entangle', gates: [{ type: 'single', qubit: 0, key: 'H' }, { type: 'cnot', control: 0, target: 1 }] }
];

const CIRCUIT2_CONFIG = {
  n: 2,
  prefix: '2q',
  StateClass: TwoQubitState,
  kets: ['00', '01', '10', '11'],
  presets: CIRCUIT2_PRESETS,
  paletteId: 'circuit-2q-palette',
  // 2Q uses data-target-qubit, 3Q uses data-target-qubit3 (different
  // attr name, not just value) - that's what stops an unscoped
  // querySelectorAll from grabbing both panels' buttons at once
  targetQubitSelector: '.mode-btn[data-target-qubit]',
  targetQubitDatasetKey: 'targetQubit',
  // only 2 CNOT directions possible with 2 qubits so fixed buttons work;
  // 3Q needs the <select> pair since there are 6 possible pairs
  wireCnotControls(inst) {
    document.getElementById('btn-add-cnot-01').addEventListener('click', () => addGate(inst, { type: 'cnot', control: 0, target: 1 }));
    document.getElementById('btn-add-cnot-10').addEventListener('click', () => addGate(inst, { type: 'cnot', control: 1, target: 0 }));
  },
  startMessage: 'Both qubits start at |00⟩ and step through the sequence in order…',
  clearMessage: 'Two qubits, no entanglement yet. Try adding H to Qubit 0, then CNOT Q0→Q1, then press Run — that\'s the exact recipe behind the Bell state you saw in the Entangle tab, except this time you built it gate by gate.',
  describeOutcome(state) {
    const p00 = state.prob(0), p11 = state.prob(3);
    const entangled = p00 > 0.001 && p11 > 0.001 && state.prob(1) < 0.001 && state.prob(2) < 0.001;
    return entangled
      ? `That's an entangled pair: only |00⟩ (${Math.round(p00 * 100)}%) and |11⟩ (${Math.round(p11 * 100)}%) show up — measuring one qubit instantly tells you the other, exactly like the Entangle tab, except this time H + CNOT built it from scratch.`
      : `Sequence complete. Final state: ${state.getFormula()}.`;
  }
};

const CIRCUIT3_CONFIG = {
  n: 3,
  prefix: '3q',
  StateClass: ThreeQubitState,
  kets: CIRCUIT3_KETS,
  presets: CIRCUIT3_PRESETS,
  paletteId: 'circuit-3q-palette',
  targetQubitSelector: '.mode-btn[data-target-qubit3]',
  targetQubitDatasetKey: 'targetQubit3',
  wireCnotControls(inst) {
    const control = document.getElementById('cnot3-control');
    const target  = document.getElementById('cnot3-target');
    [control, target].forEach(sel => {
      sel.innerHTML = [0, 1, 2].map(q => `<option value="${q}">Qubit ${q}</option>`).join('');
    });
    target.value = '1'; // default control=0, target=1 — a usable pair out of the box
    document.getElementById('btn-add-cnot3').addEventListener('click', () => {
      const c = parseInt(control.value, 10);
      const t = parseInt(target.value, 10);
      if (c === t) { setStatus(inst, 'Control and target must be different qubits'); return; }
      addGate(inst, { type: 'cnot', control: c, target: t });
    });
  },
  startMessage: 'All three qubits start at |000⟩ and step through the sequence in order…',
  clearMessage: 'Three qubits, all starting at |000⟩. Try H on Qubit 0, then CNOT Q0→Q1, then CNOT Q0→Q2 — that recipe spreads one qubit\'s coin flip across all three, a three-way GHZ state.',
  describeOutcome(state) {
    const p000 = state.prob(0), p111 = state.prob(7);
    const others = [1, 2, 3, 4, 5, 6].every(i => state.prob(i) < 0.001);
    const ghz = p000 > 0.001 && p111 > 0.001 && others;
    return ghz
      ? `That's a GHZ state: only |000⟩ (${Math.round(p000 * 100)}%) and |111⟩ (${Math.round(p111 * 100)}%) show up — measuring any one of the three qubits instantly tells you all three, a three-way version of the entangled pair from the Entangle tab.`
      : `Sequence complete. Final state: ${state.getFormula()}.`;
  }
};

let circuit2, circuit3; // live instances, built by initCircuit2Tab()/initCircuit3Tab()

function makeMultiQubitCircuit(cfg) {
  const inst = {
    n: cfg.n,
    prefix: cfg.prefix,
    kets: cfg.kets,
    cfg,
    gates: [],
    targetQubit: 0,
    state: new cfg.StateClass(),
    // Run History (rollback) — see runSequence()/renderHistory() below.
    history: [],
    historyCursor: -1,
    running: false
  };

  document.querySelectorAll(cfg.targetQubitSelector).forEach(btn => {
    btn.addEventListener('click', () => {
      inst.targetQubit = parseInt(btn.dataset[cfg.targetQubitDatasetKey], 10);
      document.querySelectorAll(cfg.targetQubitSelector).forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  buildGatePalette(cfg.paletteId, key => addGate(inst, { type: 'single', qubit: inst.targetQubit, key }));
  cfg.wireCnotControls(inst);
  document.getElementById(`btn-run-circuit-${cfg.prefix}`).addEventListener('click', () => runSequence(inst));
  document.getElementById(`btn-clear-circuit-${cfg.prefix}`).addEventListener('click', () => clearSequence(inst));
  renderTryMe(`circuit-${cfg.prefix}-try-me`, cfg.presets, preset => loadPreset(inst, preset));

  renderDiagram(inst);
  updateUI(inst);
  renderHistory(inst);

  return inst;
}

// 1Q/2Q/3Q panel switch inside the Quantum Circuit builder (see the
// "Quantum" domain of setCircuitDomain() in circuit-tab.js). wired once
// from initCircuit2Tab() below since it's not tied to either instance.
function setCircuitMode(mode) {
  document.querySelectorAll('.mode-btn[data-circuit-mode]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.circuitMode === mode));
  document.getElementById('circuit-1q-panel').style.display = mode === '1q' ? '' : 'none';
  document.getElementById('circuit-2q-panel').style.display = mode === '2q' ? '' : 'none';
  document.getElementById('circuit-3q-panel').style.display = mode === '3q' ? '' : 'none';
}

function initCircuit2Tab() {
  document.querySelectorAll('.mode-btn[data-circuit-mode]').forEach(btn => {
    btn.addEventListener('click', () => setCircuitMode(btn.dataset.circuitMode));
  });
  circuit2 = makeMultiQubitCircuit(CIRCUIT2_CONFIG);
}

function initCircuit3Tab() {
  circuit3 = makeMultiQubitCircuit(CIRCUIT3_CONFIG);
}

function entryLabel(entry) {
  if (entry.type === 'cnot') return `CNOT Q${entry.control}→Q${entry.target}`;
  return `${GATES[entry.key].name} on Q${entry.qubit}`;
}

function addGate(inst, entry) {
  if (inst.gates.length >= CIRCUIT_MULTIQUBIT_MAX_STEPS) {
    setStatus(inst, 'Sequence full — clear to reset');
    return;
  }
  inst.gates.push(entry);
  renderDiagram(inst);
  setStatus(inst, '');
}

function removeGate(inst, i) {
  inst.gates.splice(i, 1);
  renderDiagram(inst);
}

function loadPreset(inst, preset) {
  inst.gates = preset.gates.map(g => ({ ...g }));
  renderDiagram(inst);
  runSequence(inst);
}

// renders inst.gates[] as an N-wire diagram: one CSS grid, inst.n rows,
// CIRCUIT_MULTIQUBIT_MAX_STEPS columns. each gate owns one column shared
// across rows - a CNOT's control dot, target symbol, and connecting line
// are separate grid items in that column, which is what lines them up
// without any manual pixel math. columns past gates.length stay empty
// dashed placeholders.
//
// note: n>2 fills the other rows at a single-gate column with empty
// placeholders too (full-height dashed grid); n=2 doesn't bother. that's
// a real pre-existing difference between the two diagrams from before
// the merge, left alone on purpose rather than forced to match.
function renderDiagram(inst) {
  const container = document.getElementById(`circuit-${inst.prefix}-diagram`);
  let html = '';

  for (let row = 1; row <= inst.n; row++) {
    html += `<div class="circuit2-ket" style="grid-column:1;grid-row:${row};">|0⟩</div>`;
    html += `<div class="circuit2-wire" style="grid-column:2/-1;grid-row:${row};"></div>`;
  }

  for (let c = 0; c < CIRCUIT_MULTIQUBIT_MAX_STEPS; c++) {
    const col   = c + 2; // grid-column 1 is the |0⟩ label
    const entry = inst.gates[c];

    if (!entry) {
      const isHint = c === 0 && inst.gates.length === 0;
      for (let row = 1; row <= inst.n; row++) {
        html += `<div class="circuit2-cell empty${isHint && row === 1 ? ' circuit2-cell-hint' : ''}" style="grid-column:${col};grid-row:${row};">${isHint && row === 1 ? '+' : ''}</div>`;
      }
      continue;
    }

    if (entry.type === 'single') {
      const g   = GATES[entry.key];
      const row = entry.qubit + 1;
      html += `<button class="circuit2-cell circuit2-gate" data-i="${c}" style="grid-column:${col};grid-row:${row};color:${g.color};border-color:${g.color}" title="${entryLabel(entry)} — click to remove">${g.name}</button>`;
      if (inst.n > 2) {
        for (let row2 = 1; row2 <= inst.n; row2++) {
          if (row2 === row) continue;
          html += `<div class="circuit2-cell empty" style="grid-column:${col};grid-row:${row2};"></div>`;
        }
      }
    } else {
      const controlRow = entry.control + 1;
      const targetRow  = entry.target + 1;
      const lineStart  = Math.min(controlRow, targetRow);
      const lineEnd    = Math.max(controlRow, targetRow) + 1;
      html += `<div class="circuit2-cnot-line" style="grid-column:${col};grid-row:${lineStart}/${lineEnd};"></div>`;
      html += `<button class="circuit2-cell circuit2-cnot-dot" data-i="${c}" style="grid-column:${col};grid-row:${controlRow};" title="${entryLabel(entry)} — click to remove"></button>`;
      html += `<button class="circuit2-cell circuit2-cnot-target" data-i="${c}" style="grid-column:${col};grid-row:${targetRow};" title="${entryLabel(entry)} — click to remove">⊕</button>`;
      // Any row that's neither control nor target gets an empty
      // placeholder too — zero iterations at n=2 (both rows are always
      // control/target at that size), exactly one at n=3.
      for (let row2 = 1; row2 <= inst.n; row2++) {
        if (row2 === controlRow || row2 === targetRow) continue;
        html += `<div class="circuit2-cell empty" style="grid-column:${col};grid-row:${row2};"></div>`;
      }
    }
  }

  container.innerHTML = html;
  container.querySelectorAll('[data-i]').forEach(el => {
    el.addEventListener('click', () => removeGate(inst, parseInt(el.dataset.i, 10)));
  });
}

// A CNOT step has no single GATES entry of its own to borrow a color
// from (it spans two qubits) — this is just a fixed, theme-legible blue
// for its history chip, not tied to any GATES color.
const CNOT_HIST_COLOR = '#5B8DEF';

async function runSequence(inst) {
  if (inst.running) return;
  if (inst.gates.length === 0) {
    setStatus(inst, 'Add gates first');
    return;
  }
  inst.running = true;
  inst.state = new inst.cfg.StateClass();
  setStatus(inst, 'Running…');
  setExplainerFor(inst, inst.cfg.startMessage);
  inst.history = [];
  inst.historyCursor = -1;
  renderHistory(inst);

  for (let i = 0; i < inst.gates.length; i++) {
    const entry = inst.gates[i];
    const stepEls = document.querySelectorAll(`#circuit-${inst.prefix}-diagram [data-i="${i}"]`);
    stepEls.forEach(el => el.classList.add('running'));
    setExplainerFor(inst, `Step ${i + 1} of ${inst.gates.length}: ${entryLabel(entry)}.`);
    await delay(320);
    if (entry.type === 'cnot') {
      inst.state.applyCNOT(entry.control, entry.target);
    } else {
      inst.state.applySingleQubitGate(entry.qubit, GATES[entry.key].matrix);
    }
    updateUI(inst);
    const color = entry.type === 'cnot' ? CNOT_HIST_COLOR : GATES[entry.key].color;
    const explain = entry.type === 'cnot'
      ? `<strong style="color:${color}">Step ${i + 1}: ${entryLabel(entry)}.</strong> Flips Q${entry.target}'s bit whenever Q${entry.control} is |1⟩ — the entangling move behind every Bell pair and GHZ state. ` +
        `<br><br>State is now <span style="font-family:'JetBrains Mono',monospace">${inst.state.getFormula()}</span>.`
      : `<strong style="color:${color}">Step ${i + 1}: ${entryLabel(entry)} — ${GATES[entry.key].desc}.</strong> ${GATES[entry.key].explain} ` +
        `<br><br>State is now <span style="font-family:'JetBrains Mono',monospace">${inst.state.getFormula()}</span>.`;
    inst.history.push({
      amps: inst.state.amps.map(a => ({ ...a })), // cloned — later steps mutate inst.state.amps in place
      label: String(i + 1),
      color,
      title: `Step ${i + 1}: ${entryLabel(entry)} — ${inst.state.getFormula()}`,
      explain
    });
    inst.historyCursor = inst.history.length - 1;
    renderHistory(inst);
    await delay(130);
    stepEls.forEach(el => el.classList.remove('running'));
  }

  inst.running = false;
  setStatus(inst, 'Done');
  setExplainerFor(inst, inst.cfg.describeOutcome(inst.state));
}

// same .hist-tag/.is-current pattern as every other Run History trail
function renderHistory(inst) {
  const hist = document.getElementById(`circuit-${inst.prefix}-history`);
  if (!hist) return;
  if (!inst.history.length) { hist.innerHTML = '<span class="muted-text">—</span>'; return; }
  hist.innerHTML = '';
  inst.history.forEach((entry, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'hist-tag' + (i === inst.historyCursor ? ' is-current' : '');
    chip.style.color = entry.color;
    chip.style.borderColor = entry.color + '44';
    chip.textContent = entry.label;
    chip.title = entry.title;
    chip.addEventListener('click', () => {
      if (inst.running) return;
      restoreHistoryStep(inst, i);
    });
    hist.appendChild(chip);
  });
}

// restores step i's cloned amplitude snapshot directly instead of replaying
// gates, so it's correct no matter how entangled things got along the way.
// also puts the explainer text back to what it said at that step.
function restoreHistoryStep(inst, i) {
  const entry = inst.history[i];
  if (!entry) return;
  inst.historyCursor = i;
  inst.state.amps = entry.amps.map(a => ({ ...a }));
  updateUI(inst);
  renderHistory(inst);
  setStatus(inst, `Step ${entry.label} of ${inst.history.length}`);
  setExplainerFor(inst, entry.explain);
}

function clearSequence(inst) {
  inst.gates = [];
  inst.state = new inst.cfg.StateClass();
  renderDiagram(inst);
  updateUI(inst);
  setStatus(inst, '');
  setExplainerFor(inst, inst.cfg.clearMessage);
  inst.history = [];
  inst.historyCursor = -1;
  renderHistory(inst);
}

function setStatus(inst, msg) {
  document.getElementById(`circuit-${inst.prefix}-status`).textContent = msg;
}

function setExplainerFor(inst, msg) {
  setExplainer(`circuit-${inst.prefix}-explainer`, msg);
}

// updates the formula line, per-qubit mini Bloch spheres (reduced states
// via getSingleQubitBloch()), and the joint-probability table - rebuilt
// from inst.kets every call. circuit-2q-probs/circuit-3q-probs are just
// empty containers in index.html, no point hand-writing 2Q's 4 rows
// separately when they generate the same way as 3Q's 8.
function updateUI(inst) {
  document.getElementById(`circuit-${inst.prefix}-formula`).textContent = inst.state.getFormula();

  const renderers = inst.n === 2 ? rendererCircuit2 : rendererCircuit3;
  for (let i = 0; i < inst.n; i++) {
    const b = inst.state.getSingleQubitBloch(i);
    const label = blochVectorLabel(b.x, b.y, b.z);
    renderers[i].animateTo(b.x, b.y, b.z, label);
    document.getElementById(`mini-label-${inst.prefix}-${i}`).textContent = label;
  }

  const last = inst.kets.length - 1;
  const container = document.getElementById(`circuit-${inst.prefix}-probs`);
  container.innerHTML = inst.kets.map((ket, i) => {
    const pct       = inst.state.prob(i) * 100;
    const color     = i === 0 ? 'var(--zero)' : i === last ? 'var(--one)' : 'var(--text2)';
    const fillClass = i === 0 ? 'zero-fill'   : i === last ? 'one-fill'   : '';
    const fillStyle = fillClass ? '' : 'background:var(--text2);';
    return `
      <div class="prob-row">
        <span class="ket" style="color:${color}">|${ket}⟩</span>
        <div class="track"><div class="fill ${fillClass}" style="${fillStyle}width:${pct}%" id="c${inst.n}-fill-${ket}"></div></div>
        <span class="pct" id="c${inst.n}-pct-${ket}">${Math.round(pct)}%</span>
      </div>`;
  }).join('');
}
