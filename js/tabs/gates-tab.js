'use strict';
// Depends on: core/gates.js (GATES, ROTATION_GATES, rotationMatrix),
// core/complex.js (C.fmt), core/dom-utils.js (setExplainer),
// core/tab-registry.js (registerTab), app.js state (qubitMain, gateHistory,
// rendererGates), tabs/qubit-tab.js (updateQubitUI, called after applying a gate).
//
// gateHistory entries are plain { label, color } display objects (not gate
// keys) so the same history rendering works for both fixed gates (looked
// up from GATES) and rotation gates (built with a runtime angle, so there
// is no fixed key to look back up later).

// ═══════════════════════════════════════════════════════════════════
// GATES TAB
// ═══════════════════════════════════════════════════════════════════
function buildGateButtons() {
  const grid = document.getElementById('gate-grid');
  Object.entries(GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className = 'gate-btn';
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '44';
    btn.innerHTML = `${gate.name}<span class="gate-sub">${gate.desc}</span>`;
    btn.addEventListener('click', () => applyGate(key));
    grid.appendChild(btn);
  });
  document.getElementById('btn-reset-gates').addEventListener('click', resetGates);
  buildRotationButtons();

  // The Gates-tab sphere mirrors qubitMain but is otherwise idle between
  // visits, so jump its animation state to the current qubit on entry
  // instead of tweening in from wherever it was last left.
  registerTab('gates', {
    onEnter: () => {
      const b = qubitMain.getBloch();
      rendererGates.cur = { ...b };
      rendererGates.draw(b.x, b.y, b.z);
      document.getElementById('label-gates').textContent = qubitMain.getLabel();
    }
  });
}

function applyGate(key) {
  const gate = GATES[key];
  qubitMain.applyGate(gate.matrix);
  gateHistory.push({ label: gate.name, color: gate.color });
  showMatrix(key);
  updateGatesUI();
  updateQubitUI();

  const p0 = Math.round(qubitMain.prob0() * 100);
  const p1 = Math.round(qubitMain.prob1() * 100);
  setExplainer('gate-explainer',
    `<strong style="color:${gate.color}">${gate.name} — ${gate.desc}.</strong> ${gate.explain} <br><br>New odds: ${p0}% |0⟩, ${p1}% |1⟩ — state is now <span style="font-family:'JetBrains Mono',monospace">${qubitMain.getFormula()}</span>.`
  );
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

// ─── ROTATION GATES ───────────────────────────────────────────────────
function buildRotationButtons() {
  const grid = document.getElementById('rotation-gate-grid');
  Object.entries(ROTATION_GATES).forEach(([axis, gate]) => {
    const btn = document.createElement('button');
    btn.className = 'gate-btn';
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '44';
    btn.innerHTML = `${gate.label}<span class="gate-sub">${gate.desc}</span>`;
    btn.addEventListener('click', () => {
      const angleDeg = parseInt(document.getElementById('rotation-angle').value, 10);
      applyRotationGate(axis, angleDeg);
    });
    grid.appendChild(btn);
  });
  document.getElementById('rotation-angle').addEventListener('input', updateRotationAngleLabel);
}

function updateRotationAngleLabel() {
  const val = document.getElementById('rotation-angle').value;
  document.getElementById('rotation-angle-val').textContent = val + '°';
}

function applyRotationGate(axis, angleDeg) {
  const gate = ROTATION_GATES[axis];
  const matrix = rotationMatrix(axis, angleDeg);
  qubitMain.applyGate(matrix);
  gateHistory.push({ label: `${gate.label}(${angleDeg}°)`, color: gate.color });
  showRotationMatrix(axis, angleDeg, matrix);
  updateGatesUI();
  updateQubitUI();

  const p0 = Math.round(qubitMain.prob0() * 100);
  const p1 = Math.round(qubitMain.prob1() * 100);
  setExplainer('gate-explainer',
    `<strong style="color:${gate.color}">${gate.label}(${angleDeg}°) — ${gate.desc}.</strong> Unlike the fixed gates above, you choose exactly how far this one turns — drag the angle slider and apply it again to see the difference. <br><br>New odds: ${p0}% |0⟩, ${p1}% |1⟩ — state is now <span style="font-family:'JetBrains Mono',monospace">${qubitMain.getFormula()}</span>.`
  );
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

function updateGatesUI() {
  const b = qubitMain.getBloch();
  rendererGates.animateTo(b.x, b.y, b.z);
  document.getElementById('bloch-gates').setAttribute('aria-label',
    `Bloch sphere. State: ${qubitMain.getFormula()}.`);
  document.getElementById('label-gates').textContent = qubitMain.getLabel();

  const hist = document.getElementById('gate-history');
  hist.innerHTML = gateHistory.length
    ? gateHistory.map(entry =>
        `<span class="hist-tag" style="color:${entry.color};border-color:${entry.color}44">${entry.label}</span>`
      ).join('')
    : '<span class="muted-text">—</span>';
}

function resetGates() {
  qubitMain   = new Qubit();
  gateHistory = [];
  document.getElementById('matrix-display').innerHTML = '<span class="muted-text">← select a gate</span>';
  setExplainer('gate-explainer', 'Back to |0⟩ — the qubit points straight up on the sphere, no gates applied yet. Click one to send it rotating.');
  updateGatesUI();
  updateQubitUI();
}
