/* ═══════════════════════════════════════════════════════════════════
   QUANTUM EXPLORER v2  ·  Pure JavaScript Quantum Simulation Engine
   New: theme-aware Bloch renderer · Classical bit comparison · Dark/light toggle
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ─── THEME SYSTEM ────────────────────────────────────────────────────
let isDark = false;
let BLOCH_COLORS = {};

function refreshThemeColors() {
  isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const s = getComputedStyle(document.documentElement);
  const g = name => s.getPropertyValue(name).trim();
  BLOCH_COLORS = {
    arrow:       g('--bloch-arrow'),
    sphereBg:    g('--bloch-sphere-bg'),
    sphereRing:  g('--bloch-sphere-ring'),
    grid:        g('--bloch-grid'),
    gridBack:    g('--bloch-grid-back'),
    axisZ:       g('--bloch-axis-z'),
    axisMuted:   g('--bloch-axis-other'),
    proj:        g('--bloch-proj'),
    tip:         g('--bloch-tip'),
  };
}

function toggleTheme() {
  const root = document.documentElement;
  isDark = root.getAttribute('data-theme') !== 'light';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-icon').textContent = isDark ? '☾' : '☀';
  refreshThemeColors();
  // Redraw all visible spheres immediately
  [rendererMain, rendererGates, rendererCircuit].forEach(r => {
    if (r) r.draw(r.cur.x, r.cur.y, r.cur.z);
  });
  // Redraw theme-sensitive canvases
  drawClassicalSV(classicalSVState);
  drawQuantumSV(svTheta);
  drawCoin('coin1', coin1State);
  drawCoin('coin2', coin2State);
}

// ─── COMPLEX ARITHMETIC ──────────────────────────────────────────────
const C = {
  add:   (a, b)     => ({ r: a.r + b.r, i: a.i + b.i }),
  mul:   (a, b)     => ({ r: a.r*b.r - a.i*b.i, i: a.r*b.i + a.i*b.r }),
  scale: (a, s)     => ({ r: a.r * s,   i: a.i * s }),
  mag:   (a)        => Math.sqrt(a.r*a.r + a.i*a.i),
  arg:   (a)        => Math.atan2(a.i, a.r),
  polar: (r, theta) => ({ r: r * Math.cos(theta), i: r * Math.sin(theta) }),
  fmt: (a) => {
    const re = Math.round(a.r * 1000) / 1000;
    const im = Math.round(a.i * 1000) / 1000;
    if (Math.abs(im) < 0.0005) return `${re}`;
    if (Math.abs(re) < 0.0005) return `${im}i`;
    return `${re}${im >= 0 ? '+' : ''}${im}i`;
  }
};

// ─── QUBIT ────────────────────────────────────────────────────────────
class Qubit {
  constructor() {
    this.alpha = { r: 1, i: 0 };
    this.beta  = { r: 0, i: 0 };
  }

  setState(theta, phi) {
    this.alpha = C.polar(Math.cos(theta / 2), 0);
    this.beta  = C.polar(Math.sin(theta / 2), phi);
    this._normalize();
  }

  applyGate(mat) {
    const na = C.add(C.mul(mat[0][0], this.alpha), C.mul(mat[0][1], this.beta));
    const nb = C.add(C.mul(mat[1][0], this.alpha), C.mul(mat[1][1], this.beta));
    this.alpha = na;
    this.beta  = nb;
    this._normalize();
  }

  _normalize() {
    const mag = Math.sqrt(C.mag(this.alpha)**2 + C.mag(this.beta)**2);
    if (mag > 1e-10) {
      this.alpha = C.scale(this.alpha, 1 / mag);
      this.beta  = C.scale(this.beta,  1 / mag);
    }
  }

  prob0() { return C.mag(this.alpha) ** 2; }
  prob1() { return C.mag(this.beta)  ** 2; }

  getTheta() {
    return 2 * Math.acos(Math.min(1, Math.max(0, C.mag(this.alpha))));
  }

  getPhi() {
    if (C.mag(this.alpha) < 0.001) return 0;
    const p = C.arg(this.beta) - C.arg(this.alpha);
    return ((p % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  }

  getBloch() {
    const theta = this.getTheta();
    const phi   = this.getPhi();
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
      theta, phi
    };
  }

  measure() { return Math.random() < this.prob0() ? 0 : 1; }

  getLabel() {
    const p0  = this.prob0();
    const phi = this.getPhi();
    const eps = 0.012;
    if (p0 > 1 - eps) return '|0⟩';
    if (p0 < eps)     return '|1⟩';
    if (Math.abs(p0 - 0.5) < eps) {
      if (phi < eps || phi > 2*Math.PI - eps) return '|+⟩';
      if (Math.abs(phi - Math.PI)     < eps)  return '|-⟩';
      if (Math.abs(phi - Math.PI/2)   < eps)  return '|i⟩';
      if (Math.abs(phi - 3*Math.PI/2) < eps)  return '|-i⟩';
    }
    return '|ψ⟩';
  }

  getFormula() {
    const label = this.getLabel();
    if (label !== '|ψ⟩') return `|ψ⟩ = ${label}`;
    const a      = round2(Math.sqrt(this.prob0()));
    const b      = round2(Math.sqrt(this.prob1()));
    const phiDeg = Math.round(this.getPhi() * 180 / Math.PI);
    if (phiDeg === 0)   return `|ψ⟩ = ${a}|0⟩ + ${b}|1⟩`;
    if (phiDeg === 180) return `|ψ⟩ = ${a}|0⟩ − ${b}|1⟩`;
    return `|ψ⟩ = ${a}|0⟩ + e^(i${phiDeg}°)${b}|1⟩`;
  }

  clone() {
    const q = new Qubit();
    q.alpha = { ...this.alpha };
    q.beta  = { ...this.beta  };
    return q;
  }
}

function round2(x) { return Math.round(x * 100) / 100; }

/* Shared helper — briefly dims an explainer box then swaps its text in,
   so updates read as a soft "beat" rather than an abrupt jump-cut. */
function setExplainer(elId, html) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.opacity = '0.25';
  requestAnimationFrame(() => {
    el.innerHTML = html;
    el.style.opacity = '1';
  });
}

// ─── GATES ────────────────────────────────────────────────────────────
const INV2 = 1 / Math.SQRT2;
const GATES = {
  H: {
    name: 'H', color: '#60A5FA', desc: 'The Coin Spinner',
    explain: 'Picture flicking a coin into the air with so much spin it never lands — that\'s what Hadamard does to a definite qubit. It takes a state that "knows" what it is and throws it into a perfect, dizzy 50/50 blur of |0⟩ and |1⟩. Flick it again and — oddly — the spin cancels out and it lands back exactly where it started.',
    matrix: [
      [{ r: INV2, i: 0 }, { r:  INV2, i: 0 }],
      [{ r: INV2, i: 0 }, { r: -INV2, i: 0 }]
    ],
    matrixStr: [['1/√2', '1/√2'], ['1/√2', '-1/√2']]
  },
  X: {
    name: 'X', color: '#F472B6', desc: 'The Light Switch',
    explain: 'This is the blunt instrument of the gate world — a full, no-nonsense swap. Whatever the qubit believed about being |0⟩, it now believes about being |1⟩, and vice versa. No blur, no hesitation, just an instant identity swap, like flicking a light switch from off to on.',
    matrix: [
      [{ r: 0, i: 0 }, { r: 1, i: 0 }],
      [{ r: 1, i: 0 }, { r: 0, i: 0 }]
    ],
    matrixStr: [['0', '1'], ['1', '0']]
  },
  Y: {
    name: 'Y', color: '#A78BFA', desc: 'The Cartwheel',
    explain: 'Y does everything X does — flips the bit completely — but adds a twist mid-flip, like a coin doing a cartwheel instead of a simple flop. That extra twist is a phase change, invisible in the probability bars but very real: it changes how this qubit will interact with the next gate down the line.',
    matrix: [
      [{ r: 0, i:  0 }, { r: 0, i: -1 }],
      [{ r: 0, i:  1 }, { r: 0, i:  0 }]
    ],
    matrixStr: [['0', '-i'], ['i', '0']]
  },
  Z: {
    name: 'Z', color: '#94A3B8', desc: 'The Ghost Move',
    explain: 'Z is the sneakiest gate here — it does something to the qubit and yet the probability bars won\'t twitch at all. It marks the |1⟩ part of the state with an invisible minus sign, like writing in invisible ink. That mark does nothing on its own — but hand this qubit to a Hadamard afterward, and the ink suddenly shows.',
    matrix: [
      [{ r: 1, i: 0 }, { r:  0, i: 0 }],
      [{ r: 0, i: 0 }, { r: -1, i: 0 }]
    ],
    matrixStr: [['1', '0'], ['0', '-1']]
  },
  S: {
    name: 'S', color: '#34D399', desc: 'The Quarter Turn',
    explain: 'Think of a compass needle sitting on the equator of the sphere — S rotates it a crisp quarter turn (90°) around the vertical axis. Like Z, it\'s invisible to the probability bars; it only reveals itself once the state gets mixed with another gate.',
    matrix: [
      [{ r: 1, i: 0 }, { r: 0, i: 0 }],
      [{ r: 0, i: 0 }, { r: 0, i: 1 }]
    ],
    matrixStr: [['1', '0'], ['0', 'i']]
  },
  T: {
    name: 'T', color: '#FBBF24', desc: 'The Whisper Nudge',
    explain: 'T is S\'s quieter sibling — an eighth-turn (45°) instead of a quarter. It\'s the smallest standard nudge available, the kind of fine adjustment you\'d use to dial in a telescope rather than swing a door. Chain enough of these together and you can build almost any rotation.',
    matrix: [
      [{ r: 1, i: 0 }, { r: 0, i: 0 }],
      [{ r: 0, i: 0 }, C.polar(1, Math.PI / 4)]
    ],
    matrixStr: [['1', '0'], ['0', 'e^(iπ/4)']]
  }
};

// ─── BLOCH RENDERER (theme-aware) ────────────────────────────────────
class BlochRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.cx     = canvas.width  / 2;
    this.cy     = canvas.height / 2;
    this.r      = Math.min(canvas.width, canvas.height) * 0.37;
    this.cur    = { x: 0, y: 0, z: 1 };
    this.tgt    = { x: 0, y: 0, z: 1 };
    this.animId = null;
  }

  project(x, y, z) {
    const az = -Math.PI / 6;
    const el =  Math.PI / 10;
    const x1 =  x * Math.cos(az) + y * Math.sin(az);
    const y1 = -x * Math.sin(az) + y * Math.cos(az);
    const z1 = z;
    const x2 = x1;
    const y2 = y1 * Math.cos(el) - z1 * Math.sin(el);
    const z2 = y1 * Math.sin(el) + z1 * Math.cos(el);
    return {
      sx: this.cx + x2 * this.r,
      sy: this.cy - z2 * this.r,
      d:  y2
    };
  }

  animateTo(x, y, z) {
    this.tgt = { x, y, z };
    if (this.animId) cancelAnimationFrame(this.animId);
    const step = () => {
      const t    = 0.14;
      this.cur.x = this.cur.x + (this.tgt.x - this.cur.x) * t;
      this.cur.y = this.cur.y + (this.tgt.y - this.cur.y) * t;
      this.cur.z = this.cur.z + (this.tgt.z - this.cur.z) * t;
      this.draw(this.cur.x, this.cur.y, this.cur.z);
      const dist = Math.abs(this.cur.x - this.tgt.x)
                 + Math.abs(this.cur.y - this.tgt.y)
                 + Math.abs(this.cur.z - this.tgt.z);
      if (dist > 0.0008) {
        this.animId = requestAnimationFrame(step);
      } else {
        this.cur = { ...this.tgt };
        this.draw(this.cur.x, this.cur.y, this.cur.z);
        this.animId = null;
      }
    };
    step();
  }

  drawCircle(paramFn, colorFront, colorBack, wFront = 1, wBack = 0.6) {
    const ctx = this.ctx;
    const N   = 128;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const [x, y, z] = paramFn(t);
      pts.push(this.project(x, y, z));
    }

    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = colorBack;
    ctx.lineWidth   = wBack;
    ctx.beginPath();
    let inPath = false;
    for (let i = 0; i < pts.length; i++) {
      if (pts[i].d > 0) { inPath = false; continue; }
      if (!inPath) { ctx.moveTo(pts[i].sx, pts[i].sy); inPath = true; }
      else ctx.lineTo(pts[i].sx, pts[i].sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = colorFront;
    ctx.lineWidth   = wFront;
    ctx.beginPath();
    inPath = false;
    for (let i = 0; i < pts.length; i++) {
      if (pts[i].d <= 0) { inPath = false; continue; }
      if (!inPath) { ctx.moveTo(pts[i].sx, pts[i].sy); inPath = true; }
      else ctx.lineTo(pts[i].sx, pts[i].sy);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawAxis(pos, neg, color, posLabel, negLabel) {
    const ctx = this.ctx;
    const p   = this.project(...pos);
    const n   = this.project(...neg);
    const o   = this.project(0, 0, 0);
    const fs  = Math.max(9, this.r * 0.088);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.3;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(o.sx, o.sy); ctx.lineTo(p.sx, p.sy); ctx.stroke();

    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(o.sx, o.sy); ctx.lineTo(n.sx, n.sy); ctx.stroke();
    ctx.setLineDash([]);

    ctx.font         = `${fs}px "JetBrains Mono", monospace`;
    ctx.fillStyle    = color;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    const off = this.r * 0.16;
    ctx.fillText(posLabel,
      p.sx + (p.sx > this.cx ?  off*0.7 : -off*0.7),
      p.sy + (p.sy < this.cy ? -off*0.4 :  off*0.4)
    );
    ctx.fillText(negLabel,
      n.sx + (n.sx > this.cx ?  off*0.7 : -off*0.7),
      n.sy + (n.sy < this.cy ? -off*0.4 :  off*0.4)
    );
    ctx.restore();
  }

  draw(bx, by, bz) {
    const ctx = this.ctx;
    const { cx, cy, r } = this;
    const BC  = BLOCH_COLORS;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // ── Sphere ────────────────────────────────────────
    const grd = ctx.createRadialGradient(cx - r*0.18, cy - r*0.28, r*0.04, cx, cy, r);
    grd.addColorStop(0, BC.sphereBg);
    grd.addColorStop(1, isDark ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle   = grd;
    ctx.fill();
    ctx.strokeStyle = BC.sphereRing;
    ctx.lineWidth   = 1;
    ctx.stroke();

    // ── Great circles ──────────────────────────────────
    const gridDim = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    this.drawCircle(t => [Math.cos(t), Math.sin(t), 0], BC.grid, BC.gridBack);
    this.drawCircle(t => [Math.cos(t), 0, Math.sin(t)], gridDim, BC.gridBack);
    this.drawCircle(t => [0, Math.cos(t), Math.sin(t)], gridDim, BC.gridBack);

    // ── Axes ───────────────────────────────────────────
    this.drawAxis([0, 0, 1.12], [0, 0, -1.12], BC.axisZ,     '|0⟩', '|1⟩');
    this.drawAxis([1.12,0,0], [-1.12,0,0],      BC.axisMuted, '|+⟩', '|-⟩');
    this.drawAxis([0, 1.12,0], [0,-1.12,0],     BC.axisMuted, '|i⟩', '|-i⟩');

    // ── Projection dashes ──────────────────────────────
    const o    = this.project(0,  0,  0);
    const tip  = this.project(bx, by, bz);
    const proj = this.project(bx, by, 0);

    ctx.save();
    ctx.strokeStyle = BC.proj;
    ctx.lineWidth   = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(o.sx, o.sy);    ctx.lineTo(proj.sx, proj.sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(proj.sx, proj.sy); ctx.lineTo(tip.sx,  tip.sy);  ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Equatorial shadow dot
    ctx.beginPath();
    ctx.arc(proj.sx, proj.sy, 2.5, 0, 2*Math.PI);
    ctx.fillStyle = BC.proj;
    ctx.fill();

    // ── State vector arrow (glow in dark, crisp in light) ──
    ctx.save();
    if (isDark) {
      ctx.shadowBlur  = 16;
      ctx.shadowColor = BC.arrow;
    }
    ctx.strokeStyle = BC.arrow;
    ctx.lineWidth   = 2.4;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(o.sx, o.sy);
    ctx.lineTo(tip.sx, tip.sy);
    ctx.stroke();

    // Arrowhead
    const ang = Math.atan2(tip.sy - o.sy, tip.sx - o.sx);
    const as  = r * 0.082;
    ctx.beginPath();
    ctx.moveTo(tip.sx, tip.sy);
    ctx.lineTo(tip.sx - as * Math.cos(ang - 0.4), tip.sy - as * Math.sin(ang - 0.4));
    ctx.lineTo(tip.sx - as * Math.cos(ang + 0.4), tip.sy - as * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fillStyle = BC.arrow;
    ctx.fill();

    // Tip dot
    if (isDark) ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(tip.sx, tip.sy, r * 0.030, 0, 2 * Math.PI);
    ctx.fillStyle = BC.tip;
    ctx.fill();
    ctx.restore();

    // Origin dot
    ctx.beginPath();
    ctx.arc(o.sx, o.sy, 2, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.32)';
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════════════════════
let qubitMain    = new Qubit();
let qubitCircuit = new Qubit();
let qubitMeasure = new Qubit();

let rendererMain    = null;
let rendererGates   = null;
let rendererCircuit = null;

let gateHistory  = [];
let circuitGates = [];
const SLOT_COUNT = 8;

let measureCounts = { 0: 0, 1: 0 };

// ── Classical bit state ────────────────────────────────────────────
let classicalBit     = 1;
let classicalFlips   = 0;
let classicalHistory = [1];

// ── Statevector tab ────────────────────────────────────────────────
let classicalSVState = 1;   // 0 or 1
let svTheta          = 0;   // angle controlling quantum state vector

// ── Entanglement tab ───────────────────────────────────────────────
let coin1State     = null;  // null=unmeasured, 0, 1
let coin2State     = null;
let coinAnimating  = false;
let entangleCounts = { '00': 0, '11': 0 };

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Theme init
  refreshThemeColors();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Tab switching
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');

      if (btn.dataset.tab === 'statevec') {
        drawClassicalSV(classicalSVState);
        drawQuantumSV(svTheta);
      }
      if (btn.dataset.tab === 'entangle') {
        drawCoin('coin1', coin1State);
        drawCoin('coin2', coin2State);
      }
      if (btn.dataset.tab === 'gates') {
        const b = qubitMain.getBloch();
        rendererGates.cur = { ...b };
        rendererGates.draw(b.x, b.y, b.z);
      }

      // Continuous simulations only run while their tab is visible
      if (btn.dataset.tab === 'tunnel') {
        ensureTunnelStarted();
      } else if (tunnelAnimId) {
        cancelAnimationFrame(tunnelAnimId);
        tunnelAnimId = null;
      }
      if (btn.dataset.tab === 'interference') {
        ensureInterferenceStarted();
      } else if (interferenceAnimId) {
        cancelAnimationFrame(interferenceAnimId);
        interferenceAnimId = null;
      }
    });
  });

  // Bloch renderers
  rendererMain    = new BlochRenderer(document.getElementById('bloch-main'));
  rendererGates   = new BlochRenderer(document.getElementById('bloch-gates'));
  rendererCircuit = new BlochRenderer(document.getElementById('bloch-circuit'));

  // Build UI
  buildGateButtons();
  buildCircuitPalette();
  buildCircuitSlots();
  initClassicalBit();
  initStatevecTab();
  initEntangle();

  // Initial renders
  const b0 = qubitMain.getBloch();
  rendererMain.draw(b0.x, b0.y, b0.z);
  rendererGates.draw(b0.x, b0.y, b0.z);
  const bc = qubitCircuit.getBloch();
  rendererCircuit.draw(bc.x, bc.y, bc.z);

  updateQubitUI();
  updateGatesUI();
  updateCircuitUI();
  updateMeasureUI();
  updateClassicalUI();
});

// ═══════════════════════════════════════════════════════════════════
// CLASSICAL BIT
// ═══════════════════════════════════════════════════════════════════
function initClassicalBit() {
  const toggle = document.getElementById('bit-toggle');
  toggle.addEventListener('change', () => {
    classicalBit = toggle.checked ? 1 : 0;
    classicalFlips++;
    classicalHistory.unshift(classicalBit);
    if (classicalHistory.length > 10) classicalHistory.pop();
    updateClassicalUI();
  });
}

function updateClassicalUI() {
  const display = document.getElementById('classical-display');
  display.textContent = classicalBit;

  // Dim when 0, full brightness when 1 — visual metaphor for off/on
  display.classList.toggle('is-zero', classicalBit === 0);

  document.getElementById('flip-count').textContent = classicalFlips;

  // Side labels: highlight the active side
  document.getElementById('lbl-zero').classList.toggle('active', classicalBit === 0);
  document.getElementById('lbl-one').classList.toggle('active',  classicalBit === 1);

  // History trail
  const trail = document.getElementById('bit-history');
  trail.innerHTML = classicalHistory.map((v, i) =>
    `<div class="history-pip${i === 0 ? ' pip-current' : ''}">${v}</div>`
  ).join('');
}

// ═══════════════════════════════════════════════════════════════════
// QUBIT TAB
// ═══════════════════════════════════════════════════════════════════
function setMainState(theta, phi) {
  qubitMain.setState(theta, phi);
  document.getElementById('sl-theta').value = Math.round(theta * 1000);
  document.getElementById('sl-phi').value   = Math.round(phi   * 1000);
  updateQubitUI();
}

function sliderUpdate() {
  const theta = parseInt(document.getElementById('sl-theta').value) / 1000;
  const phi   = parseInt(document.getElementById('sl-phi').value)   / 1000;
  document.getElementById('val-theta').textContent = Math.round(theta * 180 / Math.PI) + '°';
  document.getElementById('val-phi').textContent   = Math.round(phi   * 180 / Math.PI) + '°';
  qubitMain.setState(theta, phi);
  updateQubitUI();
}

function updateQubitUI() {
  const b  = qubitMain.getBloch();
  const p0 = qubitMain.prob0() * 100;
  const p1 = qubitMain.prob1() * 100;

  rendererMain.animateTo(b.x, b.y, b.z);
  document.getElementById('label-main').textContent   = qubitMain.getLabel();
  document.getElementById('formula-main').textContent = qubitMain.getFormula();
  document.getElementById('fill0-main').style.width   = p0 + '%';
  document.getElementById('fill1-main').style.width   = p1 + '%';
  document.getElementById('pct0-main').textContent    = Math.round(p0) + '%';
  document.getElementById('pct1-main').textContent    = Math.round(p1) + '%';
  document.getElementById('val-theta').textContent    = Math.round(b.theta * 180 / Math.PI) + '°';
  document.getElementById('val-phi').textContent      = Math.round(b.phi   * 180 / Math.PI) + '°';
}

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
    btn.onclick   = () => applyGate(key);
    grid.appendChild(btn);
  });
}

function applyGate(key) {
  const gate = GATES[key];
  qubitMain.applyGate(gate.matrix);
  gateHistory.push(key);
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

function updateGatesUI() {
  const b = qubitMain.getBloch();
  rendererGates.animateTo(b.x, b.y, b.z);
  document.getElementById('label-gates').textContent = qubitMain.getLabel();

  const hist = document.getElementById('gate-history');
  hist.innerHTML = gateHistory.length
    ? gateHistory.map(k => {
        const g = GATES[k];
        return `<span class="hist-tag" style="color:${g.color};border-color:${g.color}44">${g.name}</span>`;
      }).join('')
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

// ═══════════════════════════════════════════════════════════════════
// CIRCUIT TAB
// ═══════════════════════════════════════════════════════════════════
function buildCircuitPalette() {
  const palette = document.getElementById('circuit-palette');
  Object.entries(GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className         = 'circuit-gate-btn';
    btn.textContent       = gate.name;
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '55';
    btn.title   = gate.desc;
    btn.onclick = () => addGateToCircuit(key);
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
    slot.onclick       = () => removeCircuitGate(i);
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
  document.getElementById('label-circuit').textContent = qubitCircuit.getLabel();
  document.getElementById('cfill0').style.width = p0 + '%';
  document.getElementById('cfill1').style.width = p1 + '%';
  document.getElementById('cpct0').textContent  = Math.round(p0) + '%';
  document.getElementById('cpct1').textContent  = Math.round(p1) + '%';
}

function setCircuitStatus(msg) {
  document.getElementById('circuit-status').textContent = msg;
}

// ═══════════════════════════════════════════════════════════════════
// MEASURE TAB
// ═══════════════════════════════════════════════════════════════════
const MEASURE_OPENERS = [
  'The universe rolled its dice —',
  'No more hedging —',
  'The coin finally landed —',
  'Asked, and answered —',
  'The blur snapped into focus —'
];

function setMeasureState(theta, phi) {
  qubitMeasure.setState(theta, phi);
  measureCounts = { 0: 0, 1: 0 };
  resetStats();
  updateMeasureUI();
  setExplainer('measure-explainer', 'Right now the qubit hasn\'t committed to anything — it genuinely holds both |0⟩ and |1⟩ at once, weighted by the bars on the left. Hit MEASURE and you\'re forcing it to answer a yes/no question it was actively avoiding.');
}

function updateMeasureUI() {
  const p0 = qubitMeasure.prob0() * 100;
  const p1 = qubitMeasure.prob1() * 100;
  document.getElementById('formula-measure').textContent = qubitMeasure.getFormula();
  document.getElementById('vbar0').style.height = p0 + '%';
  document.getElementById('vbar1').style.height = p1 + '%';
  document.getElementById('vpct0').textContent  = Math.round(p0) + '%';
  document.getElementById('vpct1').textContent  = Math.round(p1) + '%';
}

function doMeasure() {
  const p0before = Math.round(qubitMeasure.prob0() * 100);
  const p1before = Math.round(qubitMeasure.prob1() * 100);
  const result = qubitMeasure.measure();
  measureCounts[result]++;

  const resEl = document.getElementById('measure-result');
  resEl.style.color   = result === 0 ? 'var(--zero)' : 'var(--one)';
  resEl.style.opacity = '0';
  resEl.textContent   = result === 0 ? '|0⟩' : '|1⟩';
  requestAnimationFrame(() => { resEl.style.opacity = '1'; });
  updateHistogram();

  const opener = MEASURE_OPENERS[Math.floor(Math.random() * MEASURE_OPENERS.length)];
  const color  = result === 0 ? 'var(--zero)' : 'var(--one)';
  setExplainer('measure-explainer',
    `${opener} <strong style="color:${color}">|${result}⟩</strong>. A split second ago the odds were ${p0before}% / ${p1before}%, and both were equally real possibilities — not "secretly already |${result}⟩ and we just didn't know." The click is what forced a choice; the superposition is gone for good. Want to see it happen again? You'll need to re-prepare the exact same state from scratch.`
  );
}

function measureMany(n) {
  for (let i = 0; i < n; i++) measureCounts[qubitMeasure.measure()]++;
  const total = measureCounts[0] + measureCounts[1];
  const resEl = document.getElementById('measure-result');
  resEl.style.color = 'var(--text2)';
  resEl.textContent = `${total} total`;
  updateHistogram();

  const p0 = Math.round((measureCounts[0] / total) * 100);
  const p1 = Math.round((measureCounts[1] / total) * 100);
  setExplainer('measure-explainer',
    `Just sent ${n} identical, freshly-prepared qubits through the same measurement — think of it as asking ${n} exact copies of the same question. None of them talk to each other or "remember" the last answer; each collapses on its own. Across ${total} trials so far the split landed near ${p0}% / ${p1}%, and it'll keep creeping toward the true odds the more you run.`
  );
}

function updateHistogram() {
  const total = measureCounts[0] + measureCounts[1];
  if (total === 0) return;
  const p0 = (measureCounts[0] / total) * 100;
  const p1 = (measureCounts[1] / total) * 100;
  document.getElementById('hist0').style.height = p0 + '%';
  document.getElementById('hist1').style.height = p1 + '%';
  document.getElementById('hpct0').textContent  = Math.round(p0) + '%';
  document.getElementById('hpct1').textContent  = Math.round(p1) + '%';
  document.getElementById('trial-count').textContent = `· ${total} trials`;

  const exp0 = Math.round(qubitMeasure.prob0() * 100);
  const exp1 = Math.round(qubitMeasure.prob1() * 100);
  document.getElementById('convergence-note').textContent =
    total >= 20 ? `Quantum prediction: |0⟩ → ${exp0}%  |1⟩ → ${exp1}%` : '';
}

function resetStats() {
  measureCounts = { 0: 0, 1: 0 };
  ['hist0','hist1'].forEach(id => document.getElementById(id).style.height = '0%');
  document.getElementById('hpct0').textContent          = '—';
  document.getElementById('hpct1').textContent          = '—';
  document.getElementById('trial-count').textContent    = '';
  document.getElementById('measure-result').textContent = '';
  document.getElementById('convergence-note').textContent = '';
}

// ═══════════════════════════════════════════════════════════════════
// STATEVECTOR TAB
// ═══════════════════════════════════════════════════════════════════
function initStatevecTab() {
  drawClassicalSV(classicalSVState);
  drawQuantumSV(svTheta);
  updateSVFormulas();
}

function toggleClassicalSV() {
  classicalSVState = 1 - classicalSVState;
  drawClassicalSV(classicalSVState);
  document.getElementById('sv-classical-formula').textContent =
    `State = |${classicalSVState}⟩`;
}

function svSliderUpdate() {
  svTheta = parseInt(document.getElementById('sv-theta-slider').value) / 1000;
  document.getElementById('sv-theta-val').textContent =
    Math.round(svTheta * 180 / Math.PI) + '°';
  drawQuantumSV(svTheta);
  updateSVFormulas();
}

function updateSVFormulas() {
  const alpha = Math.cos(svTheta / 2);
  const beta  = Math.sin(svTheta / 2);
  const p0    = alpha * alpha * 100;
  const p1    = beta  * beta  * 100;
  const aStr  = round2(alpha), bStr = round2(beta);
  document.getElementById('sv-quantum-formula').textContent =
    `|ψ⟩ = ${aStr}|0⟩ + ${bStr}|1⟩`;
  document.getElementById('sv-fill0').style.width = p0 + '%';
  document.getElementById('sv-fill1').style.width = p1 + '%';
  document.getElementById('sv-pct0').textContent  = Math.round(p0) + '%';
  document.getElementById('sv-pct1').textContent  = Math.round(p1) + '%';
}

/* Classical state-vector canvas — vertical line, only two valid points */
function drawClassicalSV(state) {
  const canvas = document.getElementById('sv-classical');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const axisX = w / 2;
  const margin = 52;
  const topY   = margin;        // |1⟩
  const botY   = h - margin;    // |0⟩
  const midY   = (topY + botY) / 2;

  // Forbidden-zone shading between the two endpoints
  const fgrd = ctx.createLinearGradient(axisX - 28, 0, axisX + 28, 0);
  fgrd.addColorStop(0,   'transparent');
  fgrd.addColorStop(0.5, isDark ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.018)');
  fgrd.addColorStop(1,   'transparent');
  ctx.fillStyle = fgrd;
  ctx.fillRect(axisX - 28, topY, 56, botY - topY);

  // Crosshatch lines inside forbidden zone
  ctx.save();
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.055)';
  ctx.lineWidth = 1;
  for (let y = topY + 14; y < botY - 4; y += 16) {
    ctx.beginPath();
    ctx.moveTo(axisX - 24, y);
    ctx.lineTo(axisX + 24, y + 16);
    ctx.stroke();
  }
  ctx.restore();

  // "Forbidden" label
  ctx.font = `9px 'Space Grotesk', sans-serif`;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.60)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('forbidden', axisX, midY - 8);
  ctx.fillText('zone', axisX, midY + 8);

  // Axis spine
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.24)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(axisX, topY - 14);
  ctx.lineTo(axisX, botY + 14);
  ctx.stroke();

  // Ticks + ket labels
  [{ y: topY, ket: '|1⟩' }, { y: botY, ket: '|0⟩' }].forEach(({ y, ket }) => {
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(axisX - 10, y);
    ctx.lineTo(axisX + 10, y);
    ctx.stroke();
    ctx.font = `13px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.48)' : 'rgba(0,0,0,0.42)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(ket, axisX + 16, y);
  });

  // State dot — large, bold, solid
  const stateY = state === 1 ? topY : botY;
  ctx.beginPath();
  ctx.arc(axisX, stateY, 13, 0, 2 * Math.PI);
  ctx.fillStyle = isDark ? '#EFEFEF' : '#0B0B0B';
  ctx.fill();

  // Digit inside dot
  ctx.font = `bold 12px 'JetBrains Mono', monospace`;
  ctx.fillStyle = isDark ? '#0B0B0B' : '#EFEFEF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state, axisX, stateY);
}

/* Quantum state-vector canvas — 2D amplitude space with unit arc */
function drawQuantumSV(theta) {
  const canvas = document.getElementById('sv-quantum');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const margin  = 52;
  const originX = margin;
  const originY = h - margin;
  const size    = Math.min(w - margin * 1.7, h - margin * 1.7);

  const alpha = Math.cos(theta / 2);
  const beta  = Math.sin(theta / 2);
  const tipX  = originX + alpha * size;
  const tipY  = originY - beta  * size;

  // ── Unit quarter-circle arc (the full state space) ──────────────
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.14)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(originX, originY, size, -Math.PI / 2, 0, false);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Axes ──────────────────────────────────────────────────────────
  const axCol = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  ctx.strokeStyle = axCol;
  ctx.lineWidth = 1.5;
  // X axis → |0⟩
  ctx.beginPath();
  ctx.moveTo(originX - 8, originY);
  ctx.lineTo(originX + size + 24, originY);
  ctx.stroke();
  // Y axis ↑ |1⟩
  ctx.beginPath();
  ctx.moveTo(originX, originY + 8);
  ctx.lineTo(originX, originY - size - 24);
  ctx.stroke();

  // Axis arrowheads
  const ah = 7;
  ctx.fillStyle = axCol;
  ctx.beginPath(); // X →
  ctx.moveTo(originX + size + 24, originY);
  ctx.lineTo(originX + size + 24 - ah, originY - 4);
  ctx.lineTo(originX + size + 24 - ah, originY + 4);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); // Y ↑
  ctx.moveTo(originX, originY - size - 24);
  ctx.lineTo(originX - 4, originY - size - 24 + ah);
  ctx.lineTo(originX + 4, originY - size - 24 + ah);
  ctx.closePath(); ctx.fill();

  // Unit marks at 1.0
  ctx.strokeStyle = axCol;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(originX + size, originY - 5); ctx.lineTo(originX + size, originY + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(originX - 5, originY - size); ctx.lineTo(originX + 5, originY - size); ctx.stroke();

  // Axis labels
  ctx.font = `13px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillStyle = BLOCH_COLORS.axisZ;
  ctx.fillText('|0⟩', originX + size + 28, originY + 18);
  ctx.textBaseline = 'top';
  ctx.fillText('|1⟩', originX, originY - size - 28);

  // ── Projection dashes from tip to axes ───────────────────────────
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(tipX, originY);    ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(originX, tipY);    ctx.stroke();
  ctx.setLineDash([]);

  // Projection dots on axes
  const pdot = isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.28)';
  ctx.fillStyle = pdot;
  ctx.beginPath(); ctx.arc(tipX,    originY, 3, 0, 2*Math.PI); ctx.fill();
  ctx.beginPath(); ctx.arc(originX, tipY,    3, 0, 2*Math.PI); ctx.fill();

  // α and β labels on axes
  if (alpha > 0.06) {
    ctx.font = `11px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#4ADE80' : '#15803D';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(`α=${round2(alpha)}`, tipX, originY + 8);
  }
  if (beta > 0.06) {
    ctx.font = `11px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? '#F472B6' : '#BE185D';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(`β=${round2(beta)}`, originX - 8, tipY);
  }

  // θ/2 angle arc
  if (theta > 0.05) {
    const arcR = 34;
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.26)' : 'rgba(0,0,0,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(originX, originY, arcR, -Math.PI / 2, -(Math.PI / 2 - theta / 2), false);
    ctx.stroke();
    const midAng = -Math.PI / 2 + theta / 4;
    ctx.font = `10px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.34)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lr = arcR + 14;
    ctx.fillText('θ/2', originX + lr * Math.cos(midAng), originY + lr * Math.sin(midAng));
  }

  // ── State vector arrow ───────────────────────────────────────────
  ctx.save();
  if (isDark) { ctx.shadowBlur = 14; ctx.shadowColor = BLOCH_COLORS.arrow; }
  ctx.strokeStyle = BLOCH_COLORS.arrow;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  const ang = Math.atan2(tipY - originY, tipX - originX);
  const as  = 10;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - as * Math.cos(ang - 0.4), tipY - as * Math.sin(ang - 0.4));
  ctx.lineTo(tipX - as * Math.cos(ang + 0.4), tipY - as * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fillStyle = BLOCH_COLORS.arrow;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(tipX, tipY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = BLOCH_COLORS.tip;
  ctx.fill();
  ctx.restore();

  // Origin dot
  ctx.beginPath();
  ctx.arc(originX, originY, 3.5, 0, 2 * Math.PI);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.38)';
  ctx.fill();
}

// ═══════════════════════════════════════════════════════════════════
// ENTANGLEMENT TAB
// ═══════════════════════════════════════════════════════════════════
function initEntangle() {
  drawCoin('coin1', null);
  drawCoin('coin2', null);
}

/* Draw a single qubit coin — null=superposition(?), 0 or 1 */
function drawCoin(canvasId, state) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
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
    ctx.fillStyle = isDark ? '#4ADE80' : '#15803D';
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
    ctx.fillStyle = isDark ? '#4ADE80' : '#15803D';
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

  const ket = result === 0 ? '|0⟩' : '|1⟩';
  document.getElementById('coin1-label').textContent = ket;
  document.getElementById('coin2-label').textContent = ket;
  setEntangleNote('Both collapsed to the same state');

  const resEl = document.getElementById('entangle-result');
  resEl.textContent = `Outcome: |${result}${result}⟩`;
  resEl.style.color = result === 0 ? 'var(--zero)' : 'var(--one)';

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
  document.getElementById('coin1-label').textContent =
    `A = ${result === 0 ? '|0⟩' : '|1⟩'}`;

  setEntangleNote('A collapsed — B instantly determined!');

  await delay(580); // dramatic pause — represents "spooky action"

  // B collapses to same value with no communication
  coin2State = result;
  drawCoin('coin2', result);
  document.getElementById('coin2-label').textContent =
    `B = ${result === 0 ? '|0⟩' : '|1⟩'}`;

  const resEl = document.getElementById('entangle-result');
  resEl.textContent = `|${result}${result}⟩ — no signal sent to B`;
  resEl.style.color = result === 0 ? 'var(--zero)' : 'var(--one)';
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

// ─── UTILITY ──────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════════════════════════════
// QUANTUM TUNNELING TAB
// Real time-dependent Schrodinger solver (staggered leapfrog), not a
// fake animation. Units: hbar = m = 1, so H = -0.5 d^2/dx^2 + V(x).
// Validated separately: probability stays conserved to <0.3% over a
// full run, and transmission falls off correctly as V0/E increases
// (23% at V0=E down to 0.1% at V0=2.5E).
// ═══════════════════════════════════════════════════════════════════
const TUNNEL_N   = 320;
const TUNNEL_DX  = 1 / TUNNEL_N;
const TUNNEL_DT  = 0.4 * TUNNEL_DX * TUNNEL_DX;
const TUNNEL_K0  = 90;              // carrier wavenumber -> E = k0^2 / 2
const TUNNEL_SIGMA = 0.045;         // initial packet width
const TUNNEL_X0   = 0.16;           // launch position
const TUNNEL_BARRIER_FRAC = 0.55;   // barrier center, fraction of domain
const TUNNEL_SUBSTEPS = 12;         // physics steps per rendered frame
const TUNNEL_MAX_STEPS = 3200;      // stop before packet reaches the wall

let tunnelPsiR = null, tunnelPsiI = null, tunnelV = null, tunnelHtmp = null;
let tunnelCanvas = null, tunnelCtx = null;
let tunnelAnimId = null;
let tunnelPlaying = true;
let tunnelSettled = false;
let tunnelCrossed = false;
let tunnelElapsedSteps = 0;
let tunnelDrawScale = 1;
let tunnelBarrier = null; // { heightRatio, widthCells, V0, center, half }
let tunnelInitialized = false;

function tunnelEnergy() { return TUNNEL_K0 * TUNNEL_K0 / 2; }

function tunnelHpsi(psi, out) {
  const c = 0.5 / (TUNNEL_DX * TUNNEL_DX);
  for (let j = 1; j < TUNNEL_N - 1; j++) {
    out[j] = -c * (psi[j + 1] - 2 * psi[j] + psi[j - 1]) + tunnelV[j] * psi[j];
  }
  out[0] = 0; out[TUNNEL_N - 1] = 0;
}

function tunnelBuildBarrier() {
  const heightRatio = parseInt(document.getElementById('tunnel-height').value) / 100;
  const widthCells  = parseInt(document.getElementById('tunnel-width').value);
  const V0     = heightRatio * tunnelEnergy();
  const center = Math.floor(TUNNEL_N * TUNNEL_BARRIER_FRAC);
  const half   = Math.floor(widthCells / 2);
  tunnelV.fill(0);
  for (let j = Math.max(0, center - half); j < Math.min(TUNNEL_N, center + half); j++) tunnelV[j] = V0;
  return { heightRatio, widthCells, V0, center, half };
}

function tunnelLaunchWave() {
  for (let j = 0; j < TUNNEL_N; j++) {
    const x = j * TUNNEL_DX;
    const env = Math.exp(-((x - TUNNEL_X0) ** 2) / (2 * TUNNEL_SIGMA * TUNNEL_SIGMA));
    tunnelPsiR[j] = env * Math.cos(TUNNEL_K0 * x);
    tunnelPsiI[j] = env * Math.sin(TUNNEL_K0 * x);
  }
  let norm = 0;
  for (let j = 0; j < TUNNEL_N; j++) norm += (tunnelPsiR[j] ** 2 + tunnelPsiI[j] ** 2) * TUNNEL_DX;
  norm = Math.sqrt(norm);
  for (let j = 0; j < TUNNEL_N; j++) { tunnelPsiR[j] /= norm; tunnelPsiI[j] /= norm; }

  // stagger psi_i by half a time step (required for the leapfrog scheme)
  tunnelHpsi(tunnelPsiR, tunnelHtmp);
  for (let j = 0; j < TUNNEL_N; j++) tunnelPsiI[j] -= 0.5 * TUNNEL_DT * tunnelHtmp[j];

  // scale the draw height so the packet's peak fills ~70% of the plot on launch
  let peak = 0;
  for (let j = 0; j < TUNNEL_N; j++) {
    const p = tunnelPsiR[j] ** 2 + tunnelPsiI[j] ** 2;
    if (p > peak) peak = p;
  }
  tunnelDrawScale = peak > 0 ? (0.62 * 0.68) / peak : 1; // 0.68 of canvas height reserved for the plot

  tunnelSettled = false;
  tunnelCrossed = false;
  tunnelElapsedSteps = 0;
}

function tunnelStep() {
  tunnelHpsi(tunnelPsiI, tunnelHtmp);
  for (let j = 0; j < TUNNEL_N; j++) tunnelPsiR[j] += TUNNEL_DT * tunnelHtmp[j];
  tunnelHpsi(tunnelPsiR, tunnelHtmp);
  for (let j = 0; j < TUNNEL_N; j++) tunnelPsiI[j] -= TUNNEL_DT * tunnelHtmp[j];
}

function tunnelSplitProbs() {
  let pLeft = 0, pRight = 0;
  const splitIdx = tunnelBarrier.center + tunnelBarrier.half + 2;
  for (let j = 0; j < TUNNEL_N; j++) {
    const p = (tunnelPsiR[j] ** 2 + tunnelPsiI[j] ** 2) * TUNNEL_DX;
    if (j < splitIdx) pLeft += p; else pRight += p;
  }
  return { pLeft, pRight };
}

function tunnelPeakIndex() {
  let best = 0, bestVal = -1;
  for (let j = 0; j < TUNNEL_N; j++) {
    const p = tunnelPsiR[j] ** 2 + tunnelPsiI[j] ** 2;
    if (p > bestVal) { bestVal = p; best = j; }
  }
  return best;
}

function drawTunnel() {
  const ctx = tunnelCtx;
  const w = tunnelCanvas.width, h = tunnelCanvas.height;
  ctx.clearRect(0, 0, w, h);

  const baseline = h * 0.86;

  // ── barrier ─────────────────────────────────────────
  const bx1 = (tunnelBarrier.center - tunnelBarrier.half) / TUNNEL_N * w;
  const bx2 = (tunnelBarrier.center + tunnelBarrier.half) / TUNNEL_N * w;
  const barrierPxH = 14 + (tunnelBarrier.heightRatio / 2.5) * h * 0.55;

  ctx.fillStyle   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.045)';
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.24)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(bx1, baseline - barrierPxH, Math.max(2, bx2 - bx1), barrierPxH);
  ctx.fill(); ctx.stroke();

  ctx.font = `11px 'JetBrains Mono', monospace`;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('V₀', (bx1 + bx2) / 2, baseline - barrierPxH - 5);

  // ── baseline axis ───────────────────────────────────
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)';
  ctx.beginPath(); ctx.moveTo(0, baseline); ctx.lineTo(w, baseline); ctx.stroke();

  // ── |psi(x)|^2 filled probability cloud ─────────────
  const glow = BLOCH_COLORS.arrow || (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(10,10,10,0.85)');
  ctx.beginPath();
  ctx.moveTo(0, baseline);
  for (let j = 0; j < TUNNEL_N; j++) {
    const prob = (tunnelPsiR[j] ** 2 + tunnelPsiI[j] ** 2) * tunnelDrawScale;
    const px = (j / TUNNEL_N) * w;
    const py = baseline - prob * h;
    ctx.lineTo(px, py);
  }
  ctx.lineTo(w, baseline);
  ctx.closePath();

  ctx.save();
  if (isDark) { ctx.shadowBlur = 16; ctx.shadowColor = glow; }
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';
  ctx.fill();
  ctx.strokeStyle = glow;
  ctx.lineWidth = 1.7;
  ctx.stroke();
  ctx.restore();

  // ── faint oscillating carrier wave inside the envelope ──
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  const carrierScale = Math.sqrt(tunnelDrawScale) * h * 0.42;
  for (let j = 0; j < TUNNEL_N; j++) {
    const px = (j / TUNNEL_N) * w;
    const py = baseline - h * 0.02 - tunnelPsiR[j] * carrierScale * 0.5 - h * 0.02;
    if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function updateTunnelStats(pLeft, pRight) {
  document.getElementById('tunnel-refl').textContent  = Math.round(pLeft * 100) + '%';
  document.getElementById('tunnel-trans').textContent = Math.round(pRight * 100) + '%';
}

function updateTunnelPlayButton() {
  const btn = document.getElementById('tunnel-play-btn');
  if (btn) btn.textContent = tunnelPlaying ? '⏸ Pause' : '▶ Play';
}

function fireTunnelPacket() {
  tunnelBarrier = tunnelBuildBarrier();
  tunnelLaunchWave();
  tunnelPlaying = true;
  updateTunnelPlayButton();
  const el = document.getElementById('tunnel-height-val');
  if (el) el.textContent = tunnelBarrier.heightRatio.toFixed(2) + '×E';
  const wEl = document.getElementById('tunnel-width-val');
  if (wEl) wEl.textContent = tunnelBarrier.widthCells;
  updateTunnelStats(1, 0);

  setExplainer('tunnel-explainer',
    tunnelBarrier.heightRatio < 0.02
      ? 'No barrier at all right now — the packet should sail through essentially untouched. Bump the V₀ slider up to put a wall in its way.'
      : `Launching a wave packet at a barrier <strong>${tunnelBarrier.heightRatio.toFixed(2)}×</strong> its own energy. Classically that\'s an unbreakable wall — no bounce, no chance, full stop. Let\'s see what quantum mechanics has to say about that.`
  );
}

function toggleTunnelPlay() {
  tunnelPlaying = !tunnelPlaying;
  updateTunnelPlayButton();
}

function onTunnelSliderChange() {
  fireTunnelPacket();
}

function tunnelAnimate() {
  if (tunnelPlaying && !tunnelSettled) {
    for (let s = 0; s < TUNNEL_SUBSTEPS; s++) tunnelStep();
    tunnelElapsedSteps += TUNNEL_SUBSTEPS;

    // narrative beat: packet has entered the classically forbidden zone
    if (!tunnelCrossed && tunnelBarrier.heightRatio > 0.02) {
      const peakIdx = tunnelPeakIndex();
      if (peakIdx >= tunnelBarrier.center - tunnelBarrier.half) {
        tunnelCrossed = true;
        setExplainer('tunnel-explainer',
          'Now inside the barrier — the classically forbidden zone. Notice the cloud doesn\'t vanish here, it just decays. If the wall is thin enough, there\'s still some wave left by the time it reaches the far side.'
        );
      }
    }
  }

  drawTunnel();
  const { pLeft, pRight } = tunnelSplitProbs();
  updateTunnelStats(pLeft, pRight);

  if (!tunnelSettled && tunnelElapsedSteps >= TUNNEL_MAX_STEPS) {
    tunnelSettled = true;
    const transPct = Math.round(pRight * 100);
    const reflPct  = Math.round(pLeft * 100);
    if (tunnelBarrier.heightRatio < 0.02) {
      setExplainer('tunnel-explainer', `No barrier, no contest — ${transPct}% sailed straight through. Turn up V₀ to actually test the wall.`);
    } else {
      setExplainer('tunnel-explainer',
        `Final tally: <strong style="color:var(--one)">${transPct}% tunneled</strong> clean through a wall it classically had no business crossing, and <strong style="color:var(--zero)">${reflPct}% bounced back</strong> as expected. Push the barrier higher and the escape odds shrink toward zero — but in principle, never quite reach it.`
      );
    }
  }

  tunnelAnimId = requestAnimationFrame(tunnelAnimate);
}

function ensureTunnelStarted() {
  if (!tunnelInitialized) {
    tunnelCanvas = document.getElementById('tunnel-canvas');
    tunnelCtx    = tunnelCanvas.getContext('2d');
    tunnelPsiR = new Float64Array(TUNNEL_N);
    tunnelPsiI = new Float64Array(TUNNEL_N);
    tunnelV    = new Float64Array(TUNNEL_N);
    tunnelHtmp = new Float64Array(TUNNEL_N);
    tunnelInitialized = true;
    fireTunnelPacket();
  }
  if (!tunnelAnimId) tunnelAnimId = requestAnimationFrame(tunnelAnimate);
}

// ═══════════════════════════════════════════════════════════════════
// WAVE INTERFERENCE TAB
// Two coherent point sources ripple in real time on the left; the
// right-hand "screen" accumulates individual hits sampled from the
// exact two-source intensity I = |e^(ikr1) + e^(ikr2)|^2, rejection-
// sampled point by point — the classic "one particle at a time"
// build-up demonstration, not a pre-rendered fringe image.
// ═══════════════════════════════════════════════════════════════════
const INTERFERENCE_WAVE_SPEED = 70;   // px per time unit
const INTERFERENCE_DT         = 0.045;
const INTERFERENCE_HITS_PER_FRAME = 3;
const INTERFERENCE_SOURCE_X   = 26;   // x position of the slit plate
const INTERFERENCE_GAP_HALF   = 6;    // half-width of each slit opening

let interferenceMode = 'double'; // 'double' | 'single' | 'which-path'
let interferenceTime = 0;
let interferenceHitCount = 0;
let interferenceAnimId = null;
let interferenceInitialized = false;
let rippleCanvas = null, rippleCtx = null, rippleImageData = null;
let screenCanvas = null, screenCtx = null;

function interferenceSlitSep()  { return parseInt(document.getElementById('slit-sep').value); }
function interferenceWavelen()  { return parseInt(document.getElementById('wavelength').value); }

function interferenceGeometry() {
  const h = rippleCanvas.height;
  const centerY = h / 2;
  const sep = interferenceSlitSep();
  return {
    centerY,
    y1: centerY - sep / 2,
    y2: centerY + sep / 2,
    sourceX: INTERFERENCE_SOURCE_X,
    screenX: rippleCanvas.width - 4,
  };
}

/* Exact two-source intensity at a screen point, before normalization.
   'double'     -> coherent sum, produces fringes: I = 2 + 2cos(k*dr)
   'single'     -> only one slit contributes, no partner to interfere with
   'which-path' -> both slits open, but path info is known, so the
                   amplitudes add incoherently (no cross term) -> flat */
function interferenceIntensity(y, geo, mode) {
  const k = 2 * Math.PI / interferenceWavelen();
  const r1 = Math.hypot(geo.screenX - geo.sourceX, y - geo.y1);
  if (mode === 'single') return 1;
  const r2 = Math.hypot(geo.screenX - geo.sourceX, y - geo.y2);
  if (mode === 'which-path') return 2; // |A1|^2 + |A2|^2, cross term erased
  return 2 + 2 * Math.cos(k * (r1 - r2)); // coherent double-slit, range [0,4]
}

function interferenceMaxIntensity(mode) {
  return mode === 'single' ? 1 : mode === 'which-path' ? 2 : 4;
}

function drawSlitPlate(geo) {
  const ctx = rippleCtx;
  const h = rippleCanvas.height;
  ctx.save();
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(geo.sourceX, 0);
  ctx.lineTo(geo.sourceX, geo.y1 - INTERFERENCE_GAP_HALF);
  if (interferenceMode === 'single') {
    ctx.moveTo(geo.sourceX, geo.y1 + INTERFERENCE_GAP_HALF);
    ctx.lineTo(geo.sourceX, h);
  } else {
    ctx.moveTo(geo.sourceX, geo.y1 + INTERFERENCE_GAP_HALF);
    ctx.lineTo(geo.sourceX, geo.y2 - INTERFERENCE_GAP_HALF);
    ctx.moveTo(geo.sourceX, geo.y2 + INTERFERENCE_GAP_HALF);
    ctx.lineTo(geo.sourceX, h);
  }
  ctx.stroke();

  // small detector markers at each open slit in which-path mode
  if (interferenceMode === 'which-path') {
    ctx.fillStyle = isDark ? '#F472B6' : '#BE185D';
    [geo.y1, geo.y2].forEach(y => {
      ctx.beginPath();
      ctx.arc(geo.sourceX - 10, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawRipple(geo) {
  const w = rippleCanvas.width, h = rippleCanvas.height;
  if (!rippleImageData || rippleImageData.width !== w || rippleImageData.height !== h) {
    rippleImageData = rippleCtx.createImageData(w, h);
  }
  const data = rippleImageData.data;
  data.fill(0); // fully transparent by default

  const k = 2 * Math.PI / interferenceWavelen();
  const w_ = k * INTERFERENCE_WAVE_SPEED;
  const rgb = isDark ? [255, 255, 255] : [10, 10, 10];
  const step = 2; // sample every 2px, fill 2x2 blocks — 4x fewer sin() calls

  for (let py = 0; py < h; py += step) {
    for (let px = geo.sourceX; px < w; px += step) {
      const r1 = Math.hypot(px - geo.sourceX, py - geo.y1);
      let val = Math.sin(k * r1 - w_ * interferenceTime);
      let maxAmp = 1;
      if (interferenceMode !== 'single') {
        const r2 = Math.hypot(px - geo.sourceX, py - geo.y2);
        val += Math.sin(k * r2 - w_ * interferenceTime);
        maxAmp = 2;
      }
      const bright = Math.max(0, (val + maxAmp) / (2 * maxAmp)); // -> [0,1]
      const alpha = Math.floor(Math.pow(bright, 1.6) * 235);

      for (let yy = 0; yy < step && py + yy < h; yy++) {
        for (let xx = 0; xx < step && px + xx < w; xx++) {
          const idx = ((py + yy) * w + (px + xx)) * 4;
          data[idx]     = rgb[0];
          data[idx + 1] = rgb[1];
          data[idx + 2] = rgb[2];
          data[idx + 3] = alpha;
        }
      }
    }
  }
  rippleCtx.putImageData(rippleImageData, 0, 0);
  drawSlitPlate(geo);
}

function interferenceAddHits(geo) {
  const h = rippleCanvas.height;
  const Imax = interferenceMaxIntensity(interferenceMode);
  const dotColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';
  screenCtx.fillStyle = dotColor;

  for (let i = 0; i < INTERFERENCE_HITS_PER_FRAME; i++) {
    // rejection sampling against the exact intensity curve
    let y, accepted = false, tries = 0;
    while (!accepted && tries < 12) {
      y = Math.random() * h;
      const I = interferenceIntensity(y, geo, interferenceMode);
      if (Math.random() * Imax < I) accepted = true;
      tries++;
    }
    if (!accepted) continue;
    const x = screenCanvas.width / 2 + (Math.random() - 0.5) * (screenCanvas.width * 0.5);
    screenCtx.beginPath();
    screenCtx.arc(x, y, 1.1, 0, 2 * Math.PI);
    screenCtx.fill();
    interferenceHitCount++;
  }
  if (interferenceHitCount % 15 < INTERFERENCE_HITS_PER_FRAME) {
    const el = document.getElementById('interference-count');
    if (el) el.textContent = `· ${interferenceHitCount} detected`;
  }
}

function interferenceAnimate() {
  interferenceTime += INTERFERENCE_DT;
  const geo = interferenceGeometry();
  drawRipple(geo);
  interferenceAddHits(geo);
  interferenceAnimId = requestAnimationFrame(interferenceAnimate);
}

function resetScreen() {
  if (screenCtx) screenCtx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
  interferenceHitCount = 0;
  const el = document.getElementById('interference-count');
  if (el) el.textContent = '';
}

const INTERFERENCE_MODE_COPY = {
  double: 'Both slits are open and the paths are indistinguishable. Watch the dots pile up — one at a time, at random-looking positions — and slowly reveal stripes. That pattern is only possible because each particle had two paths available.',
  single: 'Only one path exists now — no partner wave to interfere with. The dots pile into a single soft blob, no stripes, exactly like tossing pebbles at a wall with one hole.',
  'which-path': 'Both slits are still open, but a detector at each one is now tagging which path every particle took. The stripes vanish, replaced by a plain double-humped pile — knowing the path, even in principle, is enough to destroy the interference.'
};

function setInterferenceMode(mode) {
  interferenceMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  resetScreen();
  setExplainer('interference-explainer', INTERFERENCE_MODE_COPY[mode]);
}

function onInterferenceSliderChange() {
  document.getElementById('slit-sep-val').textContent   = interferenceSlitSep();
  document.getElementById('wavelength-val').textContent = interferenceWavelen();
  resetScreen();
}

function ensureInterferenceStarted() {
  if (!interferenceInitialized) {
    rippleCanvas = document.getElementById('ripple-canvas');
    rippleCtx    = rippleCanvas.getContext('2d');
    screenCanvas = document.getElementById('screen-canvas');
    screenCtx    = screenCanvas.getContext('2d');
    interferenceInitialized = true;
  }
  if (!interferenceAnimId) interferenceAnimId = requestAnimationFrame(interferenceAnimate);
}
