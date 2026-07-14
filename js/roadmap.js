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

// ═══════════════════════════════════════════════════════════════════
// LESSON + QUIZ CONTENT
// ═══════════════════════════════════════════════════════════════════
const ROADMAP_LESSONS = [
  { id: 'qubit', title: 'The Qubit', tab: 'qubit',
    body: 'A classical bit is always definitively 0 or 1. A qubit can be in a superposition of both at once, described by two amplitudes rather than a single value. The Bloch sphere gives every possible qubit state a point on its surface.' },
  { id: 'gates', title: 'Quantum Gates', tab: 'gates',
    body: 'Gates are the operations that move a qubit around the Bloch sphere — reversible rotations rather than the destructive logic of classical gates. Each one (H, X, Y, Z, S, T) has a precise geometric effect you can watch happen.' },
  { id: 'circuit', title: 'Circuits', tab: 'circuit',
    body: 'A circuit is a sequence of gates applied left to right. Order matters — running the same gates in a different sequence can land the qubit in a completely different state, just like turns in a route.' },
  { id: 'measure', title: 'Measurement', tab: 'measure',
    body: 'Measuring a qubit forces it to commit to a definite outcome, 0 or 1, with probabilities set by its amplitudes just before measurement. This is the collapse of superposition — irreversible and probabilistic, not a hidden pre-existing value.' },
  { id: 'statevec', title: 'The State Vector', tab: 'statevec',
    body: 'Underneath the Bloch sphere picture is a pair of complex numbers, the state vector, whose squared magnitudes are the measurement probabilities. This lesson connects the geometric picture to the underlying numbers.' },
  { id: 'entangle', title: 'Entanglement', tab: 'entangle',
    body: 'Two qubits can be linked so that measuring one instantly determines the other\'s outcome, no matter how far apart they are. This correlation is stronger than anything possible between classical bits.' },
  { id: 'tunnel', title: 'Quantum Tunneling', tab: 'tunnel',
    body: 'A quantum wave packet has a nonzero chance of appearing on the far side of a barrier it classically shouldn\'t be able to cross, because its probability cloud extends through the barrier rather than stopping at it.' },
  { id: 'interference', title: 'Interference', tab: 'interference',
    body: 'When two paths to the same outcome are indistinguishable, their probability amplitudes combine and can reinforce or cancel — producing stripes on a screen instead of two simple piles. Marking which path was taken destroys the pattern.' }
];

// One question per lesson (lessonId matches ROADMAP_LESSONS[].id) — used
// both as a "Quick check" embedded directly in that lesson's card, and
// as the sequence for the standalone Quiz tab. `explanation` is shown
// after answering, regardless of whether the pick was right or wrong.
const ROADMAP_QUIZ = [
  { lessonId: 'qubit',
    q: 'A classical bit and a qubit both start in a definite state. What is the key difference between them?',
    options: ['Qubits can hold a superposition of 0 and 1 at once', 'Qubits are just faster bits', 'Qubits can only be measured once, ever', 'There is no real difference'],
    correct: 0,
    explanation: 'A qubit\'s amplitudes let it genuinely be a mix of both basis states until measured — a classical bit never has that option.' },
  { lessonId: 'gates',
    q: 'What does the Hadamard (H) gate do to a qubit starting at |0⟩?',
    options: ['Flips it directly to |1⟩', 'Puts it into an equal superposition of |0⟩ and |1⟩', 'Measures it immediately', 'Entangles it with another qubit'],
    correct: 1,
    explanation: 'H rotates |0⟩ to the equator of the Bloch sphere — 50/50 odds, with a fixed phase relationship between the two amplitudes.' },
  { lessonId: 'circuit',
    q: 'In a quantum circuit, why does the order of gates matter?',
    options: ['It doesn\'t — gates always commute', 'Each gate rotates the state, and rotations generally don\'t commute', 'Only the last gate has any effect', 'Order only matters for measurement'],
    correct: 1,
    explanation: 'Each gate is a rotation of the Bloch sphere, and 3D rotations don\'t generally commute — X then Z lands somewhere different than Z then X.' },
  { lessonId: 'measure',
    q: 'What happens to a qubit\'s superposition when you measure it?',
    options: ['Nothing changes', 'It collapses to a single definite outcome', 'It splits into two qubits', 'It becomes entangled automatically'],
    correct: 1,
    explanation: 'There\'s no hidden fact about which outcome it "really" was beforehand — measuring is what produces a definite answer, weighted by the amplitudes.' },
  { lessonId: 'statevec',
    q: 'What determines the probability of measuring 0 vs 1?',
    options: ['A coin flip independent of the qubit', 'The squared magnitude of each state\'s amplitude', 'The order gates were clicked in', 'The color of the Bloch sphere'],
    correct: 1,
    explanation: 'Amplitudes are complex numbers; squaring their magnitude (not the raw amplitude) is what turns them into a valid probability that sums to 100%.' },
  { lessonId: 'entangle',
    q: 'Two qubits are entangled. You measure the first and get |1⟩. What happens to the second?',
    options: ['Nothing — they are independent', 'Its outcome is now instantly correlated with the first, per their entangled state', 'It is destroyed', 'It becomes a classical bit'],
    correct: 1,
    explanation: 'Their amplitudes were linked the moment they became entangled — measuring one doesn\'t send a signal, it just reveals a correlation baked in from the start.' },
  { lessonId: 'tunnel',
    q: 'What is quantum tunneling?',
    options: ['A qubit teleporting instantly across space', 'A wave packet having nonzero probability of appearing beyond a classically-forbidden barrier', 'A gate that deletes a qubit', 'A measurement error'],
    correct: 1,
    explanation: 'The wavefunction doesn\'t stop dead at a barrier — it decays exponentially inside it, so a thin enough barrier still leaves nonzero amplitude on the far side.' },
  { lessonId: 'interference',
    q: 'In the double-slit experiment, what causes the interference stripes on the screen?',
    options: ['Two separate particles colliding', 'Probability amplitudes from indistinguishable paths adding or canceling', 'The screen material', 'Measurement collapse happening early'],
    correct: 1,
    explanation: 'Each screen point has two possible paths; when they\'re indistinguishable their amplitudes add and can reinforce or cancel, producing the fringes.' }
];

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
  document.querySelector('nav').style.display = mode === 'sim' ? '' : 'none';
  document.querySelectorAll('.tab-content').forEach(s => { s.style.display = mode === 'sim' ? '' : 'none'; });
  document.getElementById('roadmap-view').classList.toggle('active', mode === 'roadmap');
}

/** Lessons/Progress/Quiz sub-switch — mirrors circuit2-tab.js's setCircuitMode(). */
function setRoadmapMode(mode) {
  document.querySelectorAll('.mode-btn[data-roadmap-mode]').forEach(b =>
    b.classList.toggle('active', b.dataset.roadmapMode === mode));
  document.getElementById('roadmap-lessons-panel').style.display  = mode === 'lessons'  ? '' : 'none';
  document.getElementById('roadmap-progress-panel').style.display = mode === 'progress' ? '' : 'none';
  document.getElementById('roadmap-quiz-panel').style.display     = mode === 'quiz'     ? '' : 'none';
  if (mode === 'progress') renderRoadmapProgress();
  if (mode === 'quiz') renderRoadmapQuiz();
}

// ═══════════════════════════════════════════════════════════════════
// LESSONS
// ═══════════════════════════════════════════════════════════════════
function renderRoadmapLessons() {
  const grid = document.getElementById('roadmap-lesson-grid');
  grid.innerHTML = ROADMAP_LESSONS.map(l => {
    const done = roadmapProgress.completedLessons.includes(l.id);
    return `
      <div class="card">
        <div class="card-title">${l.title}${done ? ' — read' : ''}</div>
        <p class="bit-explainer">${l.body}</p>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button class="btn-run" data-lesson-tryit="${l.id}">Try it</button>
          <button class="btn-secondary" data-lesson-done="${l.id}">${done ? 'Mark unread' : 'Mark as read'}</button>
        </div>
        ${buildQuickCheckHTML(l)}
      </div>`;
  }).join('');

  grid.querySelectorAll('[data-lesson-tryit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lesson = ROADMAP_LESSONS.find(l => l.id === btn.dataset.lessonTryit);
      setAppMode('sim');
      switchToTab(lesson.tab);
    });
  });

  grid.querySelectorAll('[data-lesson-done]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.lessonDone;
      const idx = roadmapProgress.completedLessons.indexOf(id);
      if (idx === -1) roadmapProgress.completedLessons.push(id);
      else roadmapProgress.completedLessons.splice(idx, 1);
      saveRoadmapProgress();
      renderRoadmapLessons();
      updateRoadmapBadge();
    });
  });

  grid.querySelectorAll('[data-quickcheck-lesson]').forEach(optionsEl => {
    const lessonId = optionsEl.dataset.quickcheckLesson;
    optionsEl.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        roadmapProgress.quizAnswers[lessonId] = parseInt(btn.dataset.choice, 10);
        saveRoadmapProgress();
        renderRoadmapLessons();
      });
    });
  });
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
  renderRoadmapLessons();
  updateRoadmapBadge();
}
