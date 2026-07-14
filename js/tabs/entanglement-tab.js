'use strict';
// Depends on: core/utils.js (delay), core/theme.js (isDark),
// core/tab-registry.js (registerTab),
// app.js state (coin1State, coin2State, coinAnimating, entangleCounts).

// ═══════════════════════════════════════════════════════════════════
// ENTANGLEMENT TAB
// ═══════════════════════════════════════════════════════════════════
function initEntangle() {
  drawCoin('coin1', null);
  drawCoin('coin2', null);
  document.getElementById('btn-measure-both').addEventListener('click', flipEntangled);
  document.getElementById('btn-measure-a').addEventListener('click', measureCoinA);
  document.getElementById('btn-reset-entangle').addEventListener('click', resetEntangle);

  // Redraw on entry in case the theme changed while this tab was hidden.
  registerTab('entangle', {
    onEnter: () => {
      drawCoin('coin1', coin1State);
      drawCoin('coin2', coin2State);
    }
  });
}

/* Draw a single qubit coin — null=superposition(?), 0 or 1 */
function drawCoin(canvasId, state) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const who = canvasId === 'coin1' ? 'Qubit A' : 'Qubit B';
  canvas.setAttribute('aria-label',
    state === null ? `${who}: unmeasured, in superposition.` : `${who}: measured as |${state}⟩.`);

  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;
  const r  = Math.min(w, h) / 2 - 6;

  ctx.clearRect(0, 0, w, h);

  // Coin body
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = isDark ? '#1A1A1A' : '#E8E8E8';
  ctx.fill();
  ctx.strokeStyle = isDark ? '#363636' : '#C2C2C2';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Inner ring detail
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, 2 * Math.PI);
  ctx.strokeStyle = isDark ? '#262626' : '#D6D6D6';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Content
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (state === null) {
    // Superposition — draw faint overlapping 0 and 1
    ctx.font = `bold ${r * 0.52}px 'JetBrains Mono', monospace`;
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = isDark ? '#5B8DEF' : '#0033A0';
    ctx.fillText('0', cx - r * 0.14, cy);
    ctx.fillStyle = isDark ? '#F472B6' : '#BE185D';
    ctx.fillText('1', cx + r * 0.14, cy);
    ctx.globalAlpha = 1;
    // "?" on top
    ctx.font = `bold ${r * 0.5}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.2)';
    ctx.fillText('?', cx, cy);
  } else if (state === 0) {
    ctx.font = `bold ${r * 0.62}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#5B8DEF' : '#0033A0';
    ctx.fillText('0', cx, cy);
  } else {
    ctx.font = `bold ${r * 0.62}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#F472B6' : '#BE185D';
    ctx.fillText('1', cx, cy);
  }
}

/* Flip animation helper — rapidly alternates coin faces */
async function animateCoinFlip(canvasId, flips = 10, intervalMs = 55) {
  for (let i = 0; i < flips; i++) {
    drawCoin(canvasId, i % 2);
    await delay(intervalMs);
  }
}

/* MEASURE BOTH — simultaneous collapse of Bell state */
async function flipEntangled() {
  if (coinAnimating) return;
  coinAnimating = true;

  setEntangleNote('Measuring…');
  document.getElementById('entangle-result').textContent = '';
  document.getElementById('coin1-label').textContent = '…';
  document.getElementById('coin2-label').textContent = '…';

  // Both coins show superposition oscillation
  for (let i = 0; i < 10; i++) {
    drawCoin('coin1', i % 2);
    drawCoin('coin2', 1 - (i % 2));
    await delay(55);
  }

  // Wavefunction collapses — both get identical result
  const result = Math.random() < 0.5 ? 0 : 1;
  coin1State = result;
  coin2State = result;

  drawCoin('coin1', result);
  drawCoin('coin2', result);
  pulseElement(document.getElementById('coin1'), 'collapsing');
  pulseElement(document.getElementById('coin2'), 'collapsing');

  const ket = result === 0 ? '|0⟩' : '|1⟩';
  document.getElementById('coin1-label').textContent = ket;
  document.getElementById('coin2-label').textContent = ket;
  setEntangleNote('Both collapsed to the same state');

  const resEl = document.getElementById('entangle-result');
  resEl.textContent = `Outcome: |${result}${result}⟩`;
  resEl.style.color = result === 0 ? 'var(--zero)' : 'var(--one)';
  pulseElement(resEl, 'collapsing', 500);

  entangleCounts[result === 0 ? '00' : '11']++;
  updateEntangleStats();
  coinAnimating = false;
}

/* MEASURE A ONLY — demonstrates nonlocal correlation */
async function measureCoinA() {
  if (coinAnimating) return;
  coinAnimating = true;

  // Reset B to superposition while A is being measured
  coin1State = null;
  coin2State = null;
  drawCoin('coin2', null);
  document.getElementById('coin2-label').textContent = 'Entangled…';
  setEntangleNote('Measuring A…');
  document.getElementById('entangle-result').textContent = '';
  document.getElementById('coin1-label').textContent = 'Measuring…';

  // Animate only coin A
  await animateCoinFlip('coin1', 9, 62);

  const result = Math.random() < 0.5 ? 0 : 1;
  coin1State = result;
  drawCoin('coin1', result);
  pulseElement(document.getElementById('coin1'), 'collapsing');
  document.getElementById('coin1-label').textContent =
    `A = ${result === 0 ? '|0⟩' : '|1⟩'}`;

  setEntangleNote('A collapsed — B instantly determined!');

  await delay(580); // dramatic pause — represents "spooky action"

  // B collapses to same value with no communication
  coin2State = result;
  drawCoin('coin2', result);
  pulseElement(document.getElementById('coin2'), 'collapsing');
  document.getElementById('coin2-label').textContent =
    `B = ${result === 0 ? '|0⟩' : '|1⟩'}`;

  const resEl = document.getElementById('entangle-result');
  resEl.textContent = `|${result}${result}⟩ — no signal sent to B`;
  resEl.style.color = result === 0 ? 'var(--zero)' : 'var(--one)';
  pulseElement(resEl, 'collapsing', 500);
  setEntangleNote('Correlation holds regardless of distance');

  entangleCounts[result === 0 ? '00' : '11']++;
  updateEntangleStats();
  coinAnimating = false;
}

function resetEntangle() {
  if (coinAnimating) return;
  coin1State = null;
  coin2State = null;
  drawCoin('coin1', null);
  drawCoin('coin2', null);
  document.getElementById('coin1-label').textContent = 'Unmeasured';
  document.getElementById('coin2-label').textContent = 'Unmeasured';
  document.getElementById('entangle-result').textContent = '';
  setEntangleNote('Measuring A instantly determines B');
}

function setEntangleNote(msg) {
  const el = document.getElementById('entangle-note');
  if (el) el.innerHTML = msg;
}

function updateEntangleStats() {
  const n00   = entangleCounts['00'];
  const n11   = entangleCounts['11'];
  const total = n00 + n11;
  const p00   = total ? n00 / total * 100 : 0;
  const p11   = total ? n11 / total * 100 : 0;

  document.getElementById('estat-fill-00').style.width = p00 + '%';
  document.getElementById('estat-fill-11').style.width = p11 + '%';
  document.getElementById('estat-pct-00').textContent  = total ? Math.round(p00) + '%' : '—';
  document.getElementById('estat-pct-11').textContent  = total ? Math.round(p11) + '%' : '—';
  document.getElementById('entangle-trial-count').textContent = total ? `· ${total} trials` : '';

  if (total >= 10) {
    document.getElementById('entangle-convergence').textContent =
      `Always |00⟩ or |11⟩ — the perfect quantum correlation converges to 50/50`;
  }
}
