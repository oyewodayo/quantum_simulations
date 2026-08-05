'use strict';
// theme-sensitive tabs/app.js register their own redraw via onThemeChange()
// below, during their own init (always runs inside DOMContentLoaded, before
// toggleTheme() could ever fire from a click), so this file never needs to
// know which tabs exist or what they draw. Same registration trick as
// tab-registry.js's onEnter/onLeave.

const THEME_STORAGE_KEY = 'qe-theme';

let isDark = false;
let BLOCH_COLORS = {};

// canvases mostly, anything with theme-dependent colors registers its
// redraw here instead of us having to call into tab-specific draw fns by name
const themeChangeCallbacks = [];
function onThemeChange(fn) { themeChangeCallbacks.push(fn); }

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

// syncs the header icon to whatever data-theme is already active, called
// once on load, after the inline anti-flash script in <head> applies the
// saved preference (see index.html)
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
  themeChangeCallbacks.forEach(fn => fn());
}
