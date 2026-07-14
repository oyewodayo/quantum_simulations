'use strict';
// No dependencies. Used by nearly every tabs/*.js file.

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

// ─── SHARED TOOLTIP (used by BlochRenderer.enableTooltips) ───────────
let _blochTooltipEl = null;

function showBlochTooltip(text, clientX, clientY) {
  if (!_blochTooltipEl) {
    _blochTooltipEl = document.createElement('div');
    _blochTooltipEl.className = 'bloch-tooltip';
    document.body.appendChild(_blochTooltipEl);
  }
  _blochTooltipEl.textContent = text;
  _blochTooltipEl.style.left = clientX + 'px';
  _blochTooltipEl.style.top  = (clientY - 14) + 'px';
  _blochTooltipEl.classList.add('visible');
}

function hideBlochTooltip() {
  if (_blochTooltipEl) _blochTooltipEl.classList.remove('visible');
}

// ─── SHAREABLE STATE LINKS ────────────────────────────────────────────
/* Builds a URL encoding `params` as a query string, copies it to the
   clipboard, and briefly swaps btn's own text to confirm — reused by the
   Qubit and Circuit tabs' "Share" buttons. */
async function copyShareLink(params, btn) {
  const url = `${location.origin}${location.pathname}?${new URLSearchParams(params).toString()}`;
  const original = btn.textContent;
  try {
    await navigator.clipboard.writeText(url);
    btn.textContent = 'Copied!';
  } catch (e) {
    btn.textContent = 'Copy failed';
  }
  setTimeout(() => { btn.textContent = original; }, 1400);
}

// ─── ONE-SHOT PULSE ANIMATION ─────────────────────────────────────────
/* Adds `className` to `el` just long enough to play its CSS animation,
   then removes it — forcing a reflow first so re-triggering the same
   pulse on an element that's still mid-animation restarts it cleanly
   instead of being a no-op (adding a class that's already present
   doesn't restart a running CSS animation). Reused for gate-apply and
   measurement-collapse pulses. */
function pulseElement(el, className, duration = 450) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

// ─── SEGMENTED-CONTROL SLIDING INDICATOR ──────────────────────────────
/**
 * Gives every `.mode-grid` toggle group (Simulations/Roadmap, 1 Qubit/
 * 2 Qubits, Lessons/Progress/Quiz, the Interference mode switch, etc.) a
 * single sliding highlight instead of each button drawing its own
 * background — a MutationObserver watches the whole page for `class`
 * changes and repositions every thumb, so none of the five different
 * functions that toggle `.active` (setAppMode, setCircuitMode, the
 * target-qubit handler, setRoadmapMode, setInterferenceMode) need to
 * know this animation exists. Watching the whole document rather than
 * each grid individually also catches the case a grid's *ancestor*
 * becomes visible (e.g. switching to the Circuit or Interference tab,
 * or into Roadmap mode) — most `.mode-grid`s start inside hidden
 * content, so their buttons report zero size until their tab/view is
 * actually shown; re-syncing on every class change (tab switches
 * included) catches that moment instead of leaving a stuck 0×0 thumb.
 * Called once from app.js's DOMContentLoaded, after all `.mode-grid`
 * markup already exists in the DOM.
 */
function initModeGridThumbs() {
  const grids  = [...document.querySelectorAll('.mode-grid')];
  const thumbs = grids.map(grid => {
    const thumb = document.createElement('div');
    thumb.className = 'mode-grid-thumb';
    grid.insertBefore(thumb, grid.firstChild);
    return thumb;
  });

  const syncAll = () => {
    grids.forEach((grid, i) => {
      const thumb  = thumbs[i];
      const active = grid.querySelector('.mode-btn.active');
      if (!active || active.offsetWidth === 0) { thumb.style.opacity = '0'; return; }
      thumb.style.opacity   = '1';
      thumb.style.width     = active.offsetWidth + 'px';
      thumb.style.height    = active.offsetHeight + 'px';
      thumb.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    });
  };

  new MutationObserver(syncAll).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  syncAll();
  window.addEventListener('resize', syncAll);
}
