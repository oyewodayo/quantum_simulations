'use strict';
// Depends on: core/theme.js (isDark, BLOCH_COLORS), read inside draw() at
// call time — kept after theme.js in load order for readability only.
// enableTooltips() also depends on core/dom-utils.js (showBlochTooltip/
// hideBlochTooltip), which loads before this file.

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
    this.hotspots = [];   // axis-label screen positions, refreshed each draw() — used for hover tooltips
    this._dragPrev = null; // last 3D point during an active drag — used by unproject() for continuity
  }

  /**
   * Projects a 3D Bloch-sphere point to 2D canvas coordinates using a
   * fixed viewing angle (azimuth -30°, elevation 18°). Returns the
   * rotated depth `d` alongside screen coords `sx`/`sy` — `d` is used
   * by drawCircle() to split each great-circle into a solid front arc
   * (d > 0, facing the viewer) and a dashed back arc (d <= 0).
   */
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
    const posX = p.sx + (p.sx > this.cx ?  off*0.7 : -off*0.7);
    const posY = p.sy + (p.sy < this.cy ? -off*0.4 :  off*0.4);
    const negX = n.sx + (n.sx > this.cx ?  off*0.7 : -off*0.7);
    const negY = n.sy + (n.sy < this.cy ? -off*0.4 :  off*0.4);
    ctx.fillText(posLabel, posX, posY);
    ctx.fillText(negLabel, negX, negY);
    ctx.restore();

    this.hotspots.push({ sx: posX, sy: posY, text: posLabel });
    this.hotspots.push({ sx: negX, sy: negY, text: negLabel });
  }

  draw(bx, by, bz) {
    const ctx = this.ctx;
    const { cx, cy, r } = this;
    const BC  = BLOCH_COLORS;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hotspots.length = 0;

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

  /**
   * Inverse of project(): given a screen point, reconstructs the unit
   * Bloch vector whose projection lands there. The projection collapses
   * one dimension (depth), so each screen point actually matches two
   * possible sphere points (near/far side) — the ambiguity is resolved
   * by picking whichever candidate is closer to `_dragPrev` (the point
   * from the previous call), so a continuous drag traces a smooth path
   * across the sphere instead of snapping to a fixed hemisphere.
   */
  unproject(mx, my) {
    const az = -Math.PI / 6;
    const el =  Math.PI / 10;
    let dx = (mx - this.cx) / this.r;
    let dz = (this.cy - my) / this.r;
    const rad2 = dx * dx + dz * dz;
    if (rad2 > 1) {
      const s = 1 / Math.sqrt(rad2);
      dx *= s; dz *= s;
    }
    const depth = Math.sqrt(Math.max(0, 1 - dx * dx - dz * dz));

    const toPoint = y2 => {
      const y1 =  y2 * Math.cos(el) + dz * Math.sin(el);
      const z1 = -y2 * Math.sin(el) + dz * Math.cos(el);
      const x1 = dx;
      return {
        x: x1 * Math.cos(az) - y1 * Math.sin(az),
        y: x1 * Math.sin(az) + y1 * Math.cos(az),
        z: z1
      };
    };

    let best = toPoint(depth);
    if (depth > 1e-6 && this._dragPrev) {
      const far = toPoint(-depth);
      const dot = p => p.x * this._dragPrev.x + p.y * this._dragPrev.y + p.z * this._dragPrev.z;
      if (dot(far) > dot(best)) best = far;
    }
    this._dragPrev = best;

    const theta = Math.acos(Math.min(1, Math.max(-1, best.z)));
    let phi = Math.atan2(best.y, best.x);
    if (phi < 0) phi += 2 * Math.PI;
    return { theta, phi };
  }

  /**
   * Makes the sphere directly draggable: mousedown/touchstart begins
   * tracking from the currently-displayed arrow position (`this.cur`),
   * and onDrag(theta, phi) fires on every subsequent move.
   */
  enableDrag(onDrag) {
    const canvas = this.canvas;
    let dragging = false;

    const localPos = e => {
      const rect = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { mx: p.clientX - rect.left, my: p.clientY - rect.top };
    };
    const move = e => {
      if (!dragging) return;
      const { mx, my } = localPos(e);
      const { theta, phi } = this.unproject(mx, my);
      onDrag(theta, phi);
      e.preventDefault();
    };
    const start = e => {
      dragging = true;
      this._dragPrev = { ...this.cur };
      canvas.classList.add('dragging');
      move(e);
    };
    const end = () => {
      dragging = false;
      canvas.classList.remove('dragging');
    };

    canvas.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  /** Shows a small tooltip explaining an axis ket when the mouse hovers its label. */
  enableTooltips() {
    const canvas = this.canvas;
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = this.hotspots.find(h => Math.hypot(h.sx - mx, h.sy - my) < 16);
      if (hit) {
        showBlochTooltip(BLOCH_KET_MEANINGS[hit.text] || hit.text, e.clientX, e.clientY);
      } else {
        hideBlochTooltip();
      }
    });
    canvas.addEventListener('mouseleave', hideBlochTooltip);
  }
}

// Plain-language meaning of each basis-state label drawn on the sphere,
// shown in the hover tooltip enabled by enableTooltips().
const BLOCH_KET_MEANINGS = {
  '|0⟩':  'Definite 0 — the north pole. A classical bit can only ever be here or at |1⟩.',
  '|1⟩':  'Definite 1 — the south pole.',
  '|+⟩':  'Equal superposition (|0⟩ + |1⟩)/√2 — 50/50 odds, phase 0°.',
  '|-⟩':  'Equal superposition (|0⟩ − |1⟩)/√2 — 50/50 odds, phase 180°.',
  '|i⟩':  'Equal superposition (|0⟩ + i|1⟩)/√2 — 50/50 odds, phase 90°.',
  '|-i⟩': 'Equal superposition (|0⟩ − i|1⟩)/√2 — 50/50 odds, phase 270°.'
};
