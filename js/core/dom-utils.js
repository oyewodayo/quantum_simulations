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
