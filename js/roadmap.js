'use strict';
// Roadmap mode — a cross-cutting, non-simulation feature (parallel to
// tour.js): lets users read a short lesson per simulation tab, track
// completion, and take a quiz. NOT part of the tabs/TABS registry — it
// has its own top-level mode toggle (Simulations/Roadmap) in the header,
// entirely independent of switchToTab()'s tab-content sweep (see the
// header comment in app.js's switchToTab for why that matters). Depends
// on app.js's switchToTab()/currentTab, only inside the "Try it" click
// handler — called long after all scripts run, so it's safe regardless
// of load order, same reasoning as tour.js.
// Depends on js/roadmap-content.js (ROADMAP_LESSONS, ROADMAP_QUIZ), which
// loads first — see index.html — and holds this feature's lesson/quiz
// content, deliberately kept out of this file.

// ═══════════════════════════════════════════════════════════════════
// PROGRESS PERSISTENCE (localStorage — same convention as theme.js/tour.js)
// ═══════════════════════════════════════════════════════════════════
const ROADMAP_STORAGE_KEY = 'qe-roadmap-progress';

function loadRoadmapProgress() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(ROADMAP_STORAGE_KEY)); } catch (e) { raw = null; }
  return {
    completedLessons: Array.isArray(raw && raw.completedLessons) ? raw.completedLessons : [],
    quizBestScore: (raw && typeof raw.quizBestScore === 'number') ? raw.quizBestScore : null,
    quizBestTotal: (raw && typeof raw.quizBestTotal === 'number') ? raw.quizBestTotal : null,
    // Per-lesson "Quick check" answers: { [lessonId]: chosenOptionIndex }
    quizAnswers: (raw && typeof raw.quizAnswers === 'object' && raw.quizAnswers !== null) ? raw.quizAnswers : {}
  };
}

function saveRoadmapProgress() {
  localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmapProgress));
}

let roadmapProgress = loadRoadmapProgress();

// ═══════════════════════════════════════════════════════════════════
// MODE SWITCHING
// ═══════════════════════════════════════════════════════════════════
/** Top-level Simulations/Roadmap switch. Only reads .tab-content/currentTab
 *  state (via inline style.display) — never mutates which one carries
 *  .active, so returning to 'sim' restores exactly the tab that was
 *  active before, with no extra bookkeeping. */
function setAppMode(mode) {
  document.querySelectorAll('.mode-btn[data-app-mode]').forEach(b =>
    b.classList.toggle('active', b.dataset.appMode === mode));
  document.getElementById('tab-sidebar').style.display = mode === 'sim' ? '' : 'none';
  document.querySelectorAll('.tab-content').forEach(s => { s.style.display = mode === 'sim' ? '' : 'none'; });
  document.getElementById('roadmap-view').classList.toggle('active', mode === 'roadmap');
  // #roadmap-view (and everything in it, including #roadmap-mindmap) sits
  // at display:none until this toggle — any earlier renderRoadmapMindmap()
  // call (e.g. the one at page load, in initRoadmap()) measured a 0x0
  // container and fell back to a default size. Re-render now that it's
  // actually visible so the mind-map's geometry matches its real box
  // rather than that fallback.
  if (mode === 'roadmap' && document.getElementById('roadmap-mindmap').style.display !== 'none') {
    renderRoadmapMindmap();
  }
}

/** Lessons/Progress/Quiz sub-switch — mirrors circuit2-tab.js's setCircuitMode(). */
function setRoadmapMode(mode) {
  document.querySelectorAll('.mode-btn[data-roadmap-mode]').forEach(b =>
    b.classList.toggle('active', b.dataset.roadmapMode === mode));
  document.getElementById('roadmap-lessons-panel').style.display  = mode === 'lessons'  ? '' : 'none';
  document.getElementById('roadmap-progress-panel').style.display = mode === 'progress' ? '' : 'none';
  document.getElementById('roadmap-quiz-panel').style.display     = mode === 'quiz'     ? '' : 'none';
  // The mind-map lives in the shared hero (alongside the heading/toggle,
  // not inside #roadmap-lessons-panel) so it can be centered as one block
  // filling the viewport — see .roadmap-hero--full in style.css. Only
  // Lessons gets the full-viewport treatment; Progress/Quiz stay compact.
  document.getElementById('roadmap-mindmap').style.display = mode === 'lessons' ? '' : 'none';
  document.getElementById('roadmap-hero').classList.toggle('roadmap-hero--full', mode === 'lessons');
  if (mode === 'progress') renderRoadmapProgress();
  if (mode === 'quiz') renderRoadmapQuiz();
  // The mind-map measures its own container size to lay itself out, which
  // reads as 0x0 while hidden — re-render on every re-entry so a resize
  // that happened while on Progress/Quiz doesn't leave it stale.
  if (mode === 'lessons') renderRoadmapMindmap();
}

// ═══════════════════════════════════════════════════════════════════
// LESSONS
// ═══════════════════════════════════════════════════════════════════
/** Shared per-lesson template — used both by the card grid (tryIt:true,
 *  wrapped in a .card) and the lesson modal's info panel (tryIt:false,
 *  since the live simulation sits right below it there). Single source
 *  of truth so the grid card and the modal can't drift out of sync; all
 *  interactive bits are wired up via the delegated listener in
 *  initRoadmap(), not attached here, since this HTML can end up on the
 *  page in more than one place (grid + modal) at once. */
function buildLessonInfoHTML(lesson, { tryIt }) {
  const done = roadmapProgress.completedLessons.includes(lesson.id);
  return `
    <div class="card-title">${lesson.title}${done ? ' — read' : ''}</div>
    <p class="bit-explainer">${lesson.body}</p>
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
      ${tryIt ? `<button class="btn-run" data-lesson-tryit="${lesson.id}">Try it</button>` : ''}
      <button class="btn-secondary${done ? ' is-done' : ''}" data-lesson-done="${lesson.id}">${done ? 'Mark unread' : 'Mark as read'}</button>
    </div>
    ${buildQuickCheckHTML(lesson)}`;
}

function renderRoadmapLessons() {
  const grid = document.getElementById('roadmap-lesson-grid');
  grid.innerHTML = ROADMAP_LESSONS.map(l =>
    `<div class="card">${buildLessonInfoHTML(l, { tryIt: true })}</div>`
  ).join('');
}

// ═══════════════════════════════════════════════════════════════════
// MIND-MAP (Lessons panel overview — "Quantum" center, one branch per
// lesson, curved connectors). Positions are computed from the
// container's measured pixel size rather than fixed percentages, so the
// layout stays correct at any width down to the 760px breakpoint where
// it's hidden in favor of the card grid (see .roadmap-mindmap in
// style.css). Node clicks reuse [data-lesson-tryit], the same attribute
// the grid's "Try it" button uses, so both open the same lesson modal.
// ═══════════════════════════════════════════════════════════════════
let mindmapResizeTimer = null;

function renderRoadmapMindmap() {
  const container = document.getElementById('roadmap-mindmap');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const w = rect.width  || 760;
  const h = rect.height || 380;
  const cx = w / 2, cy = h / 2;
  const r  = Math.min(w, h) / 2 * 0.82;

  const n = ROADMAP_LESSONS.length;
  const nodes = ROADMAP_LESSONS.map((lesson, i) => {
    const angle = (-90 + i * (360 / n)) * Math.PI / 180;
    return { lesson, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const paths = nodes.map(({ x, y }) => {
    // Bow the connector's midpoint perpendicular to the node→center line,
    // for the gentle curve rather than a straight spoke.
    const dx = x - cx, dy = y - cy;
    const len = Math.hypot(dx, dy) || 1;
    const offset = len * 0.12;
    const px = (x + cx) / 2 + (-dy / len) * offset;
    const py = (y + cy) / 2 + (dx / len) * offset;
    return `<path d="M ${cx} ${cy} Q ${px} ${py} ${x} ${y}"></path>`;
  }).join('');

  const nodesHTML = nodes.map(({ lesson, x, y }) => {
    const done = roadmapProgress.completedLessons.includes(lesson.id);
    const tip = `${lesson.title}${done ? ' — read' : ''}: ${firstSentence(lesson.body)}`;
    return `<button class="mindmap-node${done ? ' is-done' : ''}" data-lesson-tryit="${lesson.id}" data-tooltip="${tip}" style="left:${x}px;top:${y}px;">${lesson.title}</button>`;
  }).join('');

  container.innerHTML =
    `<svg>${paths}</svg>` +
    `<div class="mindmap-center" data-tooltip="${MINDMAP_CENTER_TOOLTIP}" style="left:${cx}px;top:${cy}px;">Quantum</div>` +
    nodesHTML;
}

const MINDMAP_CENTER_TOOLTIP =
  `${ROADMAP_LESSONS.length} core quantum computing concepts, from a single qubit to entanglement and wave interference — click any topic to explore it.`;

/** First sentence of a lesson body, used for the mind-map's hover
 *  tooltip so it stays short (the tooltip's box is sized for a one-liner
 *  like the Bloch axis tooltips it reuses — see showBlochTooltip below —
 *  not a full paragraph). */
function firstSentence(text) {
  const m = text.match(/^[^.]*\./);
  return m ? m[0] : text;
}

/** One-question "Quick check" embedded directly under a lesson's body —
 *  immediate right/wrong feedback plus a short explanation, so it's a
 *  learning check in the moment rather than only at the end in the Quiz
 *  tab (which reuses this same ROADMAP_QUIZ data — see renderRoadmapQuiz). */
function buildQuickCheckHTML(lesson) {
  const q = ROADMAP_QUIZ.find(item => item.lessonId === lesson.id);
  if (!q) return '';

  const answered = roadmapProgress.quizAnswers[lesson.id];
  if (answered === undefined) {
    return `
      <div class="roadmap-quickcheck">
        <div class="roadmap-quickcheck-label">Quick check</div>
        <p class="roadmap-quickcheck-q">${q.q}</p>
        <div class="roadmap-quiz-options" data-quickcheck-lesson="${lesson.id}">
          ${q.options.map((opt, i) => `<button class="preset-btn" data-choice="${i}">${opt}</button>`).join('')}
        </div>
      </div>`;
  }

  const correct = answered === q.correct;
  return `
    <div class="roadmap-quickcheck">
      <div class="roadmap-quickcheck-label">Quick check — ${correct ? 'correct' : 'review'}</div>
      <p class="roadmap-quickcheck-q">${q.q}</p>
      <div class="roadmap-quiz-options">
        ${q.options.map((opt, i) => {
          let cls = 'preset-btn';
          if (i === q.correct) cls += ' quiz-correct';
          else if (i === answered) cls += ' quiz-incorrect';
          return `<button class="${cls}" disabled>${opt}</button>`;
        }).join('')}
      </div>
      <p class="bit-explainer" style="margin-top:8px;">${q.explanation}</p>
    </div>`;
}

/** Keeps the header "Roadmap" toggle showing live progress (e.g.
 *  "Roadmap · 3/8") so it's visible without opening the Roadmap view. */
function updateRoadmapBadge() {
  const btn = document.getElementById('btn-roadmap-toggle');
  const done = roadmapProgress.completedLessons.length;
  // The count lives in its own span (hidden below ~480px, see style.css)
  // so narrow headers can reclaim that space for the tab nav instead.
  btn.innerHTML = `Roadmap<span class="roadmap-badge-count"> · ${done}/${ROADMAP_LESSONS.length}</span>`;
}

/** Re-renders every surface that shows lesson state (mind-map, card grid,
 *  and the modal's info panel if one is open) — called after any mutation
 *  (mark-as-read, quick-check answer) so all three stay in sync no matter
 *  which one the user interacted with. */
function refreshLessonUI() {
  renderRoadmapMindmap();
  renderRoadmapLessons();
  if (lessonModalState) {
    const lesson = ROADMAP_LESSONS.find(l => l.id === lessonModalState.lessonId);
    document.getElementById('lesson-modal-info').innerHTML = buildLessonInfoHTML(lesson, { tryIt: false });
  }
  updateRoadmapBadge();
}

// ═══════════════════════════════════════════════════════════════════
// LESSON MODAL
// ═══════════════════════════════════════════════════════════════════
// Rather than duplicating a simulation tab's live canvas/renderer inside
// the modal, we reparent the real #tab-{name} section into the modal and
// move it back out on close. Two things make this safe (see roadmap.js's
// header comment / the plan this was built from):
//   - Every simulation is a plain 2D canvas with fixed pixel width/height
//     attributes — nothing sizes itself from its parent, so being
//     temporarily moved to a different container doesn't break anything.
//   - setAppMode('roadmap') already leaves every .tab-content with an
//     inline `display:none` regardless of app mode — reparenting alone
//     wouldn't make the section visible, so open/close explicitly clears
//     and restores that inline style.
let lessonModalState = null; // { lessonId, tabName, section, originalParent, originalNextSibling, originalDisplay }

function openLessonModal(lessonId) {
  if (lessonModalState) closeLessonModal();

  const lesson = ROADMAP_LESSONS.find(l => l.id === lessonId);
  if (!lesson) return;

  const section = document.getElementById(`tab-${lesson.tab}`);
  const state = {
    lessonId: lesson.id,
    tabName: lesson.tab,
    section,
    originalParent: section.parentNode,
    originalNextSibling: section.nextSibling,
    originalDisplay: section.style.display
  };

  // Fires the tab's onEnter (redraws/restarts its animation loop) exactly
  // like the old "Try it" navigation did before switching pages. We
  // deliberately do NOT call the matching onLeave() on close below — see
  // the comment there.
  switchToTab(lesson.tab);

  section.style.display = '';
  document.getElementById('lesson-modal-simhost').appendChild(section);

  document.getElementById('lesson-modal-title').textContent = lesson.title;
  document.getElementById('lesson-modal-info').innerHTML = buildLessonInfoHTML(lesson, { tryIt: false });

  document.getElementById('lesson-modal').classList.add('open');
  document.body.classList.add('modal-open');

  lessonModalState = state;
}

function closeLessonModal() {
  if (!lessonModalState) return;
  const { section, originalParent, originalNextSibling, originalDisplay } = lessonModalState;

  document.getElementById('lesson-modal').classList.remove('open');
  document.body.classList.remove('modal-open');

  // Moves the section back to its exact original position (insertBefore
  // with a null reference node is just appendChild, covering the "was the
  // last tab-content" case) and restores the roadmap-mode display:none
  // that setAppMode had set on it. We don't call the tab's onLeave() here
  // — only switchToTab() manages onEnter/onLeave anywhere in this app, and
  // that's also true today for a tab backgrounded via setAppMode, so this
  // isn't a new gap.
  originalParent.insertBefore(section, originalNextSibling);
  section.style.display = originalDisplay;

  lessonModalState = null;
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS TRACKING
// ═══════════════════════════════════════════════════════════════════
function renderRoadmapProgress() {
  const total = ROADMAP_LESSONS.length;
  const done  = roadmapProgress.completedLessons.length;
  const pct   = Math.round(100 * done / total);

  document.getElementById('roadmap-progress-fill').style.width = pct + '%';
  document.getElementById('roadmap-progress-pct').textContent  = `${done}/${total}`;

  document.getElementById('roadmap-quiz-best-text').textContent =
    roadmapProgress.quizBestScore === null
      ? 'Not attempted yet.'
      : `${roadmapProgress.quizBestScore} / ${roadmapProgress.quizBestTotal}`;

  document.getElementById('roadmap-checklist').innerHTML = ROADMAP_LESSONS.map(l => {
    const done = roadmapProgress.completedLessons.includes(l.id);
    return `<label class="roadmap-checklist-row">
      <input type="checkbox" disabled ${done ? 'checked' : ''}>
      <span>${l.title}</span>
    </label>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════════
// `answered` holds the chosen option index for the current question, or
// null before it's been answered — splitting "answered" from "current"
// is what lets renderRoadmapQuiz() show a feedback+explanation state
// (Next button, no auto-advance) instead of jumping straight to the
// next question the instant you click.
let quizState = { current: 0, score: 0, finished: false, answered: null };

function renderRoadmapQuiz() {
  const card = document.getElementById('roadmap-quiz-card');

  if (quizState.finished) {
    card.innerHTML = `
      <div class="card-title">Quiz Complete</div>
      <p class="bit-explainer">Score: ${quizState.score} / ${ROADMAP_QUIZ.length}</p>
      <button class="btn-run" id="roadmap-quiz-retry" style="margin-top:10px;">Retry</button>`;
    document.getElementById('roadmap-quiz-retry').addEventListener('click', () => {
      quizState = { current: 0, score: 0, finished: false, answered: null };
      renderRoadmapQuiz();
    });
    return;
  }

  const q = ROADMAP_QUIZ[quizState.current];
  const isLast = quizState.current === ROADMAP_QUIZ.length - 1;

  if (quizState.answered === null) {
    card.innerHTML = `
      <div class="card-title">Question ${quizState.current + 1} of ${ROADMAP_QUIZ.length}</div>
      <p class="bit-explainer">${q.q}</p>
      <div class="roadmap-quiz-options">
        ${q.options.map((opt, i) => `<button class="preset-btn" data-quiz-option="${i}">${opt}</button>`).join('')}
      </div>`;
    card.querySelectorAll('[data-quiz-option]').forEach(btn => {
      btn.addEventListener('click', () => submitRoadmapQuizAnswer(parseInt(btn.dataset.quizOption, 10)));
    });
    return;
  }

  const correct = quizState.answered === q.correct;
  card.innerHTML = `
    <div class="card-title">Question ${quizState.current + 1} of ${ROADMAP_QUIZ.length} — ${correct ? 'correct' : 'not quite'}</div>
    <p class="bit-explainer">${q.q}</p>
    <div class="roadmap-quiz-options">
      ${q.options.map((opt, i) => {
        let cls = 'preset-btn';
        if (i === q.correct) cls += ' quiz-correct';
        else if (i === quizState.answered) cls += ' quiz-incorrect';
        return `<button class="${cls}" disabled>${opt}</button>`;
      }).join('')}
    </div>
    <p class="bit-explainer" style="margin-top:8px;">${q.explanation}</p>
    <button class="btn-run" id="roadmap-quiz-next" style="margin-top:10px;">${isLast ? 'See Results' : 'Next Question'}</button>`;
  document.getElementById('roadmap-quiz-next').addEventListener('click', advanceRoadmapQuiz);
}

function submitRoadmapQuizAnswer(choice) {
  const q = ROADMAP_QUIZ[quizState.current];
  quizState.answered = choice;
  if (choice === q.correct) quizState.score++;
  renderRoadmapQuiz();
}

function advanceRoadmapQuiz() {
  quizState.current++;
  quizState.answered = null;

  if (quizState.current >= ROADMAP_QUIZ.length) {
    quizState.finished = true;
    if (roadmapProgress.quizBestScore === null || quizState.score > roadmapProgress.quizBestScore) {
      roadmapProgress.quizBestScore = quizState.score;
      roadmapProgress.quizBestTotal = ROADMAP_QUIZ.length;
      saveRoadmapProgress();
    }
  }
  renderRoadmapQuiz();
}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
function initRoadmap() {
  document.querySelectorAll('.mode-btn[data-app-mode]').forEach(btn =>
    btn.addEventListener('click', () => setAppMode(btn.dataset.appMode)));
  document.querySelectorAll('.mode-btn[data-roadmap-mode]').forEach(btn =>
    btn.addEventListener('click', () => setRoadmapMode(btn.dataset.roadmapMode)));

  // Delegated (rather than attached-per-render) because the same lesson's
  // controls can now exist in up to three places at once — the card grid,
  // the mind-map, and the modal's info panel — and re-binding all three on
  // every render would be easy to get out of sync.
  document.addEventListener('click', (e) => {
    const tryItBtn = e.target.closest('[data-lesson-tryit]');
    if (tryItBtn) { openLessonModal(tryItBtn.dataset.lessonTryit); return; }

    const doneBtn = e.target.closest('[data-lesson-done]');
    if (doneBtn) {
      const id = doneBtn.dataset.lessonDone;
      const idx = roadmapProgress.completedLessons.indexOf(id);
      if (idx === -1) roadmapProgress.completedLessons.push(id);
      else roadmapProgress.completedLessons.splice(idx, 1);
      saveRoadmapProgress();
      refreshLessonUI();
      return;
    }

    const choiceBtn = e.target.closest('[data-choice]');
    if (choiceBtn) {
      const optionsEl = choiceBtn.closest('[data-quickcheck-lesson]');
      if (optionsEl) {
        roadmapProgress.quizAnswers[optionsEl.dataset.quickcheckLesson] = parseInt(choiceBtn.dataset.choice, 10);
        saveRoadmapProgress();
        refreshLessonUI();
      }
      return;
    }

    if (e.target.closest('#lesson-modal-backdrop') || e.target.closest('#lesson-modal-close')) {
      closeLessonModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lessonModalState) closeLessonModal();
  });

  // The mind-map measures its own container to lay itself out, so a
  // resize needs to trigger a re-layout — but only while it's actually
  // visible (it reads 0x0 while hidden, e.g. on Progress/Quiz or below the
  // 760px breakpoint where it's hidden entirely).
  window.addEventListener('resize', () => {
    clearTimeout(mindmapResizeTimer);
    mindmapResizeTimer = setTimeout(() => {
      const container = document.getElementById('roadmap-mindmap');
      if (container && container.offsetParent !== null) renderRoadmapMindmap();
    }, 150);
  });

  // Hover tooltips on the mind-map's center + topic nodes — reuses the
  // same floating tooltip element/CSS as the Bloch sphere's axis-label
  // hover (core/dom-utils.js), just fed from [data-tooltip] instead of a
  // hotspot hit-test. Attached to the container (survives its innerHTML
  // being replaced on every renderRoadmapMindmap() re-render) rather than
  // to individual nodes, so it doesn't need re-binding per render.
  const mindmapEl = document.getElementById('roadmap-mindmap');
  mindmapEl.addEventListener('mousemove', (e) => {
    const node = e.target.closest('[data-tooltip]');
    if (node) showBlochTooltip(node.dataset.tooltip, e.clientX, e.clientY);
    else hideBlochTooltip();
  });
  mindmapEl.addEventListener('mouseleave', hideBlochTooltip);

  renderRoadmapLessons();
  renderRoadmapMindmap();
  updateRoadmapBadge();
}
