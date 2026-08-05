'use strict';
// uses registerTab (tab-registry.js) and t() (i18n.js). the "measure the
// pair" coin-flip demo already lives on the Entangle tab, so no point
// duplicating it here for Phi+ specifically - this tab instead covers all
// four states at once: circuit diagram, same/opposite taxonomy grid, and
// the exact Born-rule split (not sampled) for whichever one's selected.

const BELL_STATES = {
  phiplus:  { symbol: 'Φ⁺', ketA: '00', ketB: '11', correlation: 'same',
              formula: '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2', needsXA: false, needsXB: false },
  phiminus: { symbol: 'Φ⁻', ketA: '00', ketB: '11', correlation: 'same',
              formula: '|Φ⁻⟩ = (|00⟩ − |11⟩) / √2', needsXA: true,  needsXB: false },
  psiplus:  { symbol: 'Ψ⁺', ketA: '01', ketB: '10', correlation: 'opposite',
              formula: '|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2', needsXA: false, needsXB: true },
  psiminus: { symbol: 'Ψ⁻', ketA: '01', ketB: '10', correlation: 'opposite',
              formula: '|Ψ⁻⟩ = (|01⟩ − |10⟩) / √2', needsXA: true,  needsXB: true }
};

// English fallback for t() — actual copy lives in js/locales/*.js under
// the same bellstates.recipe.<key> keys.
const BELL_RECIPE_FALLBACK = {
  phiplus:  'Start at |00⟩, apply H to qubit A, then CNOT (A → B).',
  phiminus: 'Start at |00⟩, apply X to qubit A, then H to qubit A, then CNOT (A → B).',
  psiplus:  'Start at |00⟩, apply X to qubit B, then H to qubit A, then CNOT (A → B).',
  psiminus: 'Start at |00⟩, apply X to both qubits, then H to qubit A, then CNOT (A → B).'
};

let currentBellState = 'phiplus';

function initBellStatesTab() {
  document.querySelectorAll('#bellstate-picker [data-bell], #bellstate-family [data-bell]').forEach(btn => {
    btn.addEventListener('click', () => setBellState(btn.dataset.bell));
  });

  registerTab('bellstates', {});
  updateBellStateDisplay();
}

function setBellState(key) {
  currentBellState = key;
  updateBellStateDisplay();
}

// updates formula, recipe text, circuit X gates, picker/family highlight,
// and the probability split - everything tied to the selected Bell state
function updateBellStateDisplay() {
  const s = BELL_STATES[currentBellState];

  document.getElementById('bellstate-formula').textContent = s.formula;
  document.getElementById('bellstate-recipe').textContent =
    t(`bellstates.recipe.${currentBellState}`, BELL_RECIPE_FALLBACK[currentBellState]);

  document.getElementById('bellstate-gate-xa').classList.toggle('circuit-gate-off', !s.needsXA);
  document.getElementById('bellstate-gate-xb').classList.toggle('circuit-gate-off', !s.needsXB);

  document.querySelectorAll('[data-bell]').forEach(b =>
    b.classList.toggle('active', b.dataset.bell === currentBellState));

  document.getElementById('bellstate-distribution-note').textContent =
    t('bellstates.distributionNote', 'Exact Born-rule probabilities for {symbol} — no sampling needed, these follow directly from squaring each amplitude.')
      .replace('{symbol}', `|${s.symbol}⟩`);

  ['00', '01', '10', '11'].forEach(k => {
    const pct = (k === s.ketA || k === s.ketB) ? 50 : 0;
    document.getElementById(`bstat-fill-${k}`).style.width = pct + '%';
    document.getElementById(`bstat-pct-${k}`).textContent = pct + '%';
  });

  document.querySelectorAll('#bell-stats-rows .prob-row').forEach(row => {
    const possible = row.dataset.ket === s.ketA || row.dataset.ket === s.ketB;
    row.classList.toggle('bell-impossible', !possible);
  });
}
