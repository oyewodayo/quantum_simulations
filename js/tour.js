'use strict';
// first-run guided tour, shown once per browser (tracked in localStorage).
// needs switchToTab()/currentTab from app.js, which is loaded after this
// file and kicks the tour off on DOMContentLoaded once everything else
// is initialized

const TOUR_STORAGE_KEY = 'qe-tour-seen';

const TOUR_STEPS = [
  {
    tab: 'qubit',
    selector: '#tab-sidebar',
    text: 'Each tab explores one quantum concept, building from a single qubit up to entanglement and wave phenomena. Click through them anytime.'
  },
  {
    tab: 'qubit',
    selector: '#bloch-main',
    text: 'This is the Bloch sphere. Try dragging the arrow directly — it sets the qubit\'s state in real time.'
  },
  {
    tab: 'qubit',
    selector: '#theme-toggle',
    text: 'Toggle light or dark mode here — your choice is remembered next time you visit.'
  }
];

let tourIndex = 0;
let tourBackdrop = null;
let tourPopover  = null;
let tourHighlightEl = null;

function startTourIfFirstVisit() {
  if (localStorage.getItem(TOUR_STORAGE_KEY)) return;
  tourIndex = 0;
  // steps target Concepts-page elements, but Roadmap is the default landing
  // view, so switch modes explicitly here or the tour tries to highlight
  // something that's hidden with 0x0 dimensions
  setAppMode('sim');
  buildTourDOM();
  showTourStep();
}

function buildTourDOM() {
  tourBackdrop = document.createElement('div');
  tourBackdrop.className = 'tour-backdrop';
  tourPopover = document.createElement('div');
  tourPopover.className = 'tour-popover';
  document.body.appendChild(tourBackdrop);
  document.body.appendChild(tourPopover);
}

function clearTourHighlight() {
  if (tourHighlightEl) tourHighlightEl.classList.remove('tour-highlight');
  tourHighlightEl = null;
  document.querySelectorAll('.tour-raise-header').forEach(el => el.classList.remove('tour-raise-header'));
}

function showTourStep() {
  clearTourHighlight();
  const step = TOUR_STEPS[tourIndex];
  if (currentTab !== step.tab) switchToTab(step.tab);

  requestAnimationFrame(() => {
    const target = document.querySelector(step.selector);
    if (!target) { endTour(); return; }

    target.classList.add('tour-highlight');
    tourHighlightEl = target;
    // header is position:fixed with its own z-index / stacking context, so
    // a highlighted child inside it can't out-rank the backdrop on its own -
    // have to raise the whole header
    const headerAncestor = target.closest('header');
    if (headerAncestor) headerAncestor.classList.add('tour-raise-header');

    const rect = target.getBoundingClientRect();
    tourPopover.innerHTML = `
      <div class="tour-step-count">Step ${tourIndex + 1} of ${TOUR_STEPS.length}</div>
      <p>${step.text}</p>
      <div class="tour-actions">
        <button class="btn-secondary" id="tour-skip">Skip</button>
        <button class="btn-run" id="tour-next">${tourIndex === TOUR_STEPS.length - 1 ? 'Done' : 'Next'}</button>
      </div>
    `;
    // normally anchors below the target, but something tall like the
    // full-height sidebar leaves no room, so fall back to the side instead
    // of letting it run off screen
    const popoverH = 170;
    let top, left;
    if (rect.bottom + 12 + popoverH <= window.innerHeight) {
      top  = rect.bottom + 12;
      left = Math.min(window.innerWidth - 300, Math.max(12, rect.left));
    } else {
      top  = Math.min(window.innerHeight - popoverH - 12, Math.max(12, rect.top));
      left = Math.min(window.innerWidth - 300, rect.right + 12);
    }
    tourPopover.style.top  = top + 'px';
    tourPopover.style.left = left + 'px';

    document.getElementById('tour-next').addEventListener('click', nextTourStep);
    document.getElementById('tour-skip').addEventListener('click', endTour);
  });
}

function nextTourStep() {
  tourIndex++;
  if (tourIndex >= TOUR_STEPS.length) { endTour(); return; }
  showTourStep();
}

function endTour() {
  clearTourHighlight();
  if (tourBackdrop) tourBackdrop.remove();
  if (tourPopover) tourPopover.remove();
  tourBackdrop = null;
  tourPopover  = null;
  localStorage.setItem(TOUR_STORAGE_KEY, '1');
}
