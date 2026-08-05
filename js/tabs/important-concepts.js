'use strict';
// mostly a static glossary page - the only interactive bits are the live
// search box that filters as you type (initImportantConceptsSearch) and
// tapping a card to zoom it into a centered overlay, closed via its own
// button, Esc, or backdrop click (initImportantConceptsZoom/
// openConceptZoom). the zoom overlay mirrors showConfirmModal's pattern in
// dom-utils.js (fixed backdrop, Esc/backdrop close, fresh element per open
// rather than a reused hidden one). no registerTab() here since there's no
// simulation state to enter/leave, just these two handlers.

// filters by re-reading each card's live textContent on every keystroke -
// already translated by i18n's applyTranslations() so no separate search
// index needed, just an onLangChange() re-run below to stay correct if you
// switch language mid-search. a group's label + grid hide together once
// every card in it gets filtered out, so you don't get an empty heading
// floating above nothing.
function initImportantConceptsSearch() {
  const input = document.getElementById('concept-search');
  if (!input) return;
  const clearBtn = document.getElementById('concept-search-clear');
  const emptyMsg = document.getElementById('concept-search-empty');
  const grids = Array.from(document.querySelectorAll('#tab-important-concepts .intro-glossary-grid'));
  const labels = Array.from(document.querySelectorAll('#tab-important-concepts .section-label'));

  function applyFilter() {
    const query = input.value.trim().toLowerCase();
    clearBtn.style.display = query ? '' : 'none';

    let totalVisible = 0;
    grids.forEach((grid, i) => {
      let groupVisible = 0;
      grid.querySelectorAll('.card').forEach(card => {
        const matches = !query || card.textContent.toLowerCase().includes(query);
        card.classList.toggle('concept-hidden', !matches);
        if (matches) groupVisible++;
      });
      grid.classList.toggle('concept-hidden', groupVisible === 0);
      if (labels[i]) labels[i].classList.toggle('concept-hidden', groupVisible === 0);
      totalVisible += groupVisible;
    });

    emptyMsg.style.display = totalVisible === 0 ? '' : 'none';
    if (totalVisible === 0) {
      emptyMsg.textContent = t('concepts.searchNoResults', 'No concepts match "{query}".').replace('{query}', input.value.trim());
    }
  }

  input.addEventListener('input', applyFilter);
  clearBtn.addEventListener('click', () => { input.value = ''; applyFilter(); input.focus(); });
  // re-render the "no results" message so a language switch mid-search
  // doesn't leave stale English text sitting there
  onLangChange(applyFilter);
}

// one delegated click handler on the whole section instead of one per
// card, so it still works no matter how many cards get added later
function initImportantConceptsZoom() {
  const section = document.getElementById('tab-important-concepts');
  if (!section) return;
  section.addEventListener('click', (e) => {
    const card = e.target.closest('.intro-glossary-grid .card');
    if (card) openConceptZoom(card);
  });
}

let activeConceptZoom = null; // { close } while a zoom overlay is open, else null

// FLIP transition: build the overlay at its real centered size first,
// instantly transform it (translate+scale) to sit exactly over the
// clicked card, then animate that transform back to identity - so frame
// one looks like the grid card and it visibly grows into the overlay
// instead of just fading in. closing plays the same transform forward so
// it shrinks back into the same spot.
function openConceptZoom(card) {
  if (activeConceptZoom) return; // one overlay at a time
  const startRect = card.getBoundingClientRect();

  const backdrop = document.createElement('div');
  backdrop.className = 'concept-zoom-backdrop';
  backdrop.innerHTML = `
    <div class="concept-zoom-card" role="dialog" aria-modal="true">
      <button class="concept-zoom-close" type="button" aria-label="Close" data-zoom-close>✕</button>
      <div class="concept-zoom-body">${card.innerHTML}</div>
    </div>`;
  document.body.appendChild(backdrop);
  const modal = backdrop.querySelector('.concept-zoom-card');

  const endRect = modal.getBoundingClientRect();
  const scaleX = startRect.width / endRect.width;
  const scaleY = startRect.height / endRect.height;
  const dx = (startRect.left + startRect.width / 2) - (endRect.left + endRect.width / 2);
  const dy = (startRect.top + startRect.height / 2) - (endRect.top + endRect.height / 2);
  const fromCardTransform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    modal.style.transform = fromCardTransform;
    modal.style.opacity = '0.4';
  }
  void modal.offsetWidth; // force layout so the transform above paints before the transition below starts
  backdrop.classList.add('visible');
  requestAnimationFrame(() => {
    modal.style.transform = '';
    modal.style.opacity = '';
  });

  function close() {
    document.removeEventListener('keydown', onKey);
    activeConceptZoom = null;
    if (reduceMotion) { backdrop.remove(); return; }
    modal.style.transform = fromCardTransform;
    modal.style.opacity = '0.4';
    backdrop.classList.remove('visible');
    modal.addEventListener('transitionend', () => backdrop.remove(), { once: true });
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  modal.querySelector('[data-zoom-close]').addEventListener('click', close);
  document.addEventListener('keydown', onKey);

  activeConceptZoom = { close };
}
