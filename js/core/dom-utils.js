'use strict';
// buildGatePalette() below reads GATES (core/gates.js, loaded after this
// file) but only from inside a function body called during DOMContentLoaded,
// long after every script has run - so load order doesn't actually matter
// here. used by nearly every tabs/*.js file.

// briefly dims an explainer box then swaps its text in, so updates read as
// a soft "beat" instead of an abrupt jump-cut
function setExplainer(elId, html) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.opacity = '0.25';
  requestAnimationFrame(() => {
    el.innerHTML = html;
    el.style.opacity = '1';
  });
}

// used by BlochRenderer.enableTooltips
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

// replacement for the browser's native confirm() popup, styled to match the
// app instead of OS/browser chrome. can't block synchronously like the real
// thing, so the result comes back via onConfirm instead of a return value -
// cancel (button, backdrop click, Esc) just does nothing. builds a fresh
// backdrop element on every call and removes it after, so there's never a
// stale listener left over from a previous open. pass danger: true to tint
// the confirm button for destructive stuff (see resetRoadmapProgress() in
// roadmap.js)
function showConfirmModal({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm }) {
  const el = document.createElement('div');
  el.className = 'confirm-modal-backdrop';
  el.innerHTML = `
    <div class="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div class="confirm-modal-title" id="confirm-modal-title">${title}</div>
      <p class="confirm-modal-message">${message}</p>
      <div class="confirm-modal-actions">
        <button class="btn-secondary" data-confirm-cancel>${cancelLabel}</button>
        <button class="btn-confirm${danger ? ' danger' : ''}" data-confirm-ok>${confirmLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));

  function close() {
    document.removeEventListener('keydown', onKey);
    el.remove();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  el.addEventListener('click', e => { if (e.target === el) close(); });
  el.querySelector('[data-confirm-cancel]').addEventListener('click', close);
  el.querySelector('[data-confirm-ok]').addEventListener('click', () => { close(); onConfirm(); });
  document.addEventListener('keydown', onKey);
  el.querySelector('[data-confirm-cancel]').focus();
}

// builds a URL encoding params as a query string, copies to clipboard, and
// briefly swaps btn's text to confirm - reused by the Qubit and Circuit
// tabs' Share buttons
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

// adds className to el just long enough to play its CSS animation then
// removes it. forces a reflow first so re-triggering the same pulse on an
// element that's still mid-animation restarts it cleanly instead of being a
// no-op (adding a class that's already present doesn't restart a running
// animation). used for gate-apply and measurement-collapse pulses.
function pulseElement(el, className, duration = 450) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

// builds one colored gate-palette button per GATES entry inside
// containerId, calling onKeyClick(key) when clicked - this used to be a
// copy-pasted loop in every quantum circuit builder (1/2/3-qubit).
// deliberately narrow to GATES' own styling convention (color + colored
// border, plain textContent, title tooltip): the classical circuit/gate
// tabs use a different table (CLASSICAL_GATES, no per-gate color) and
// gates-tab.js's own palette uses a richer name+subtitle button, so neither
// goes through here - forcing them through one flag-laden function would
// cost more readability than the duplication saves
function buildGatePalette(containerId, onKeyClick) {
  const container = document.getElementById(containerId);
  Object.entries(GATES).forEach(([key, gate]) => {
    const btn = document.createElement('button');
    btn.className         = 'circuit-gate-btn';
    btn.textContent       = gate.name;
    btn.style.color       = gate.color;
    btn.style.borderColor = gate.color + '55';
    btn.title             = t(`gates.${key}.desc`, gate.desc);
    btn.addEventListener('click', () => onKeyClick(key));
    container.appendChild(btn);
  });
}

// renders a collapsed "Try me" toggle into containerId that expands to a
// row of named preset buttons - reused by all four circuit builders
// (classical, 1Q/2Q/3Q quantum) so each just supplies its own preset data
// and a callback to load+run it. presets is [{ name, ... }], the rest of
// each preset object is opaque here and passed straight to onSelect.
function renderTryMe(containerId, presets, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <button class="try-me-toggle" type="button">${t('common.tryMePresets', '🎲 Try me — preset circuits')}</button>
    <div class="try-me-presets" style="display:none;"></div>
  `;
  const toggle = container.querySelector('.try-me-toggle');
  const presetsWrap = container.querySelector('.try-me-presets');
  presetsWrap.innerHTML = presets.map((p, i) =>
    `<button class="try-preset-btn" data-i="${i}">${p.name}</button>`
  ).join('');
  toggle.addEventListener('click', () => {
    const isOpen = presetsWrap.style.display !== 'none';
    presetsWrap.style.display = isOpen ? 'none' : 'flex';
    toggle.classList.toggle('active', !isOpen);
  });
  presetsWrap.querySelectorAll('[data-i]').forEach(btn => {
    btn.addEventListener('click', () => onSelect(presets[parseInt(btn.dataset.i, 10)]));
  });
}

// gives every .mode-grid toggle group (Concepts/Home, 1 Qubit/2 Qubits, the
// Interference mode switch, etc) a single sliding highlight instead of each
// button drawing its own background. a MutationObserver watches the whole
// page for class changes and repositions every thumb, so none of the
// functions that toggle .active (setAppMode, setCircuitMode, the
// target-qubit handler, setInterferenceMode) need to know this exists.
// watching the whole document instead of each grid individually also
// catches a grid's *ancestor* becoming visible (switching to the Circuit or
// Interference tab, or into Roadmap mode) - most .mode-grids start inside
// hidden content, so their buttons report zero size until their tab/view is
// actually shown. re-syncing on every class change catches that moment
// instead of leaving a stuck 0x0 thumb. called once from app.js's
// DOMContentLoaded, after all .mode-grid markup already exists in the DOM.
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
