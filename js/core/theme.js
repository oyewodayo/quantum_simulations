'use strict';
// No file dependencies at load time. toggleTheme() reaches into renderers/draw
// functions defined in later files (tabs/*.js, app.js), but only when the
// theme button is actually clicked — long after every script has run.

// ─── THEME SYSTEM ────────────────────────────────────────────────────
const THEME_STORAGE_KEY = 'qe-theme';

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

// Sets the header icon to match whatever data-theme is currently active
// (called once on load, after the inline anti-flash script in <head> has
// already applied any saved preference — see index.html).
function syncThemeIcon() {
  const dark = document.documentElement.getAttribute('data-theme') !== 'light';
  document.getElementById('theme-icon').textContent = dark ? '☀' : '☾';
}

function toggleTheme() {
  const root = document.documentElement;
  isDark = root.getAttribute('data-theme') !== 'light';
  const newTheme = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
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
