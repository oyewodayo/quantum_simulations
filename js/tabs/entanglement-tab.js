'use strict';
// Depends on: core/utils.js (delay), core/theme.js (isDark, onThemeChange),
// core/tab-registry.js (registerTab),
// app.js state (coin1State, coin2State, coinAnimating, entangleCounts).

function initEntangle() {
  drawCoin('coin1', null);
  drawCoin('coin2', null);
  document.getElementById('btn-measure-both').addEventListener('click', flipEntangled);
  document.getElementById('btn-measure-a').addEventListener('click', measureCoinA);
  document.getElementById('btn-reset-entangle').addEventListener('click', resetEntangle);

  const redrawCoins = () => {
    drawCoin('coin1', coin1State);
    drawCoin('coin2', coin2State);
  };
  // redraw needed for two separate reasons - entering the tab (onEnter)
  // and theme changing while it might be visible (onThemeChange) - both
  // just call this since draw() always reads the live isDark/coin state
  registerTab('entangle', { onEnter: redrawCoins });
  onThemeChange(redrawCoins);
}

// null = superposition(?), 0 or 1 otherwise. styled as an actual gold coin
// (gradient body, raised rim, reeded edge, glare) instead of a flat disc -
// the coin itself doesn't change with theme (gold looks like gold either
// way), just the engraved 0/1 digits follow --zero/--one. canvas
// fillStyle can't read CSS custom properties so those hex values are
// just hardcoded per theme below.
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

  // gold body: radial gradient offset toward upper-left for a light
  // source, bright highlight fading to a deeper amber edge
  const bodyGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.08, cx, cy, r);
  bodyGrad.addColorStop(0,    '#FFEFB8');
  bodyGrad.addColorStop(0.45, '#F4C430');
  bodyGrad.addColorStop(1,    '#B8860B');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Raised rim — two concentric strokes, mimicking a real coin's milled edge.
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#8B6508';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 5, 0, 2 * Math.PI);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(139,101,8,0.55)';
  ctx.stroke();

  // Reeded edge — short radial ticks around the circumference, like the
  // ridged side of a real coin.
  ctx.strokeStyle = 'rgba(139,101,8,0.4)';
  ctx.lineWidth = 1;
  const tickCount = 36;
  for (let i = 0; i < tickCount; i++) {
    const a  = (i / tickCount) * 2 * Math.PI;
    const x1 = cx + Math.cos(a) * (r - 1),   y1 = cy + Math.sin(a) * (r - 1);
    const x2 = cx + Math.cos(a) * (r - 4.5), y2 = cy + Math.sin(a) * (r - 4.5);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Glare — a soft bright ellipse near the light source, for a metallic sheen.
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.32, cy - r * 0.38, r * 0.42, r * 0.22, -0.5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();
  ctx.restore();

  // engraved digits: a faint dark offset shadow underneath gives the
  // stamped-into-metal look instead of sitting flat on top
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const engrave = (ch, x, y, size, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = '#5C3D00';
    ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
    ctx.fillText(ch, x + 1, y + 1.5);
    ctx.restore();
  };

  if (state === null) {
    // Superposition — faint overlapping 0 and 1
    const size = r * 0.52;
    engrave('0', cx - r * 0.14, cy, size, 0.5);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#5B8DEF' : '#0033A0';
    ctx.fillText('0', cx - r * 0.14, cy);
    ctx.restore();

    engrave('1', cx + r * 0.14, cy, size, 0.5);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#F472B6' : '#BE185D';
    ctx.fillText('1', cx + r * 0.14, cy);
    ctx.restore();

    // "?" on top
    ctx.font = `bold ${r * 0.5}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = 'rgba(92,61,0,0.55)';
    ctx.fillText('?', cx, cy);
  } else if (state === 0) {
    const size = r * 0.62;
    engrave('0', cx, cy, size);
    ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#5B8DEF' : '#0033A0';
    ctx.fillText('0', cx, cy);
  } else {
    const size = r * 0.62;
    engrave('1', cx, cy, size);
    ctx.font = `bold ${size}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#F472B6' : '#BE185D';
    ctx.fillText('1', cx, cy);
  }
}

// rapidly alternates coin faces to fake a flip
async function animateCoinFlip(canvasId, flips = 10, intervalMs = 55) {
  for (let i = 0; i < flips; i++) {
    drawCoin(canvasId, i % 2);
    await delay(intervalMs);
  }
}

// measure both coins at once - simultaneous collapse of the Bell state
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

// measure only A - shows the nonlocal correlation with B
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
