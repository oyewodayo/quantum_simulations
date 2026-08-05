'use strict';
// Roadmap mode = the home page. Mind-map by default, click a node and
// goToLessonSimulation() below switches app mode + jumps to that tab
// (see switchToTab() in app.js). Each tab then embeds its own lesson +
// "mark as read" + quiz at the bottom via renderEmbeddedLessons(), into
// the #lesson-embed-<tab> spot in index.html. "My Progress" is just a
// read-only view of the same completedLessons/quizAnswers state.
// Not part of the tabs/TABS registry - has its own Concepts/Home toggle
// in the header. Only touches app.js's switchToTab()/currentTab from
// inside goToLessonSimulation(), which only runs on click, long after
// every script has loaded - so load order doesn't matter here.

// lesson + quiz content
const ROADMAP_LESSONS = [
  { id: 'qubit', title: 'Bits', tab: 'qubit',
    body: 'A classical bit is always definitively 0 or 1. A qubit can be in a superposition of both at once, described by two amplitudes rather than a single value. The Bloch sphere gives every possible qubit state a point on its surface.' },
  // the 5 Maths Concept sections each get their own lesson+quiz (id !== tab,
  // they all share tab: 'mathsconcept') since each is its own topic worth
  // checking separately, unlike everything else here
  { id: 'maths-complex', title: 'Complex Numbers', tab: 'mathsconcept',
    body: 'A qubit\'s amplitudes are complex numbers, not just real ones — each has a real and imaginary part, z = a + bi. Only the squared modulus |z|² is directly observable as a probability; the phase is invisible to a single measurement but is exactly what drives interference.' },
  { id: 'maths-vectors', title: 'Vectors', tab: 'mathsconcept',
    body: 'A qubit\'s state is a column vector [α, β] in a 2D complex vector space, with |0⟩ and |1⟩ as the basis. Normalization |α|² + |β|² = 1 keeps total probability at 100%, and the inner product measures how much two states overlap.' },
  { id: 'maths-matrices', title: 'Matrices', tab: 'mathsconcept',
    body: 'Every quantum gate is a unitary matrix (U†U = I) acting on the state vector by matrix multiplication. Unitarity guarantees a gate never destroys or creates probability — which is exactly why every quantum gate is reversible.' },
  { id: 'maths-statevector', title: 'State Vector', tab: 'mathsconcept',
    body: 'The state vector |ψ⟩ = α|0⟩ + β|1⟩ is the complete description of a qubit. In Bloch-sphere form, |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ — θ and φ are exactly the two sliders on the Bits & Qubits Bloch sphere.' },
  { id: 'maths-dirac', title: 'Dirac Notation', tab: 'mathsconcept',
    body: 'Dirac\'s bra-ket notation is shorthand for vectors and their inner products: |ψ⟩ is a ket, ⟨ψ| its bra, and ⟨φ|ψ⟩ their inner product. |0⟩ and |1⟩ are orthonormal — ⟨0|1⟩ = 0, ⟨0|0⟩ = ⟨1|1⟩ = 1.' },
  { id: 'maths-tensor', title: 'Tensor Products', tab: 'mathsconcept',
    body: 'Two independent vectors combine via the tensor product (⊗) into one larger joint vector — stack every entry of the first against every entry of the second, multiplying each pair. Two qubits combine this way into a 4-entry joint state; not every joint state can be split back apart, and the ones that can\'t are exactly the entangled ones.' },
  { id: 'gates', title: 'Quantum Gates', tab: 'gates',
    body: 'Gates are the operations that move a qubit around the Bloch sphere — reversible rotations rather than the destructive logic of classical gates. Each one (H, X, Y, Z, S, T) has a precise geometric effect you can watch happen.' },
  { id: 'circuit', title: 'Circuits', tab: 'circuit',
    body: 'A circuit is a sequence of gates applied left to right. In a classical circuit, logic gates like AND/OR/XOR combine bits by strict rules — the same input always gives the same output. In a quantum circuit, order matters in a deeper way: running the same gates in a different sequence can land the qubit in a completely different state, just like turns in a route. Switch to 2 or 3 Qubits and add CNOT to build entangled states — Bell pairs and GHZ states — gate by gate, the same recipes behind the Entangle tab.' },
  { id: 'bellstates', title: 'Bell States', tab: 'bellstates',
    body: 'The four Bell states — Φ⁺, Φ⁻, Ψ⁺, and Ψ⁻ — are the maximally entangled two-qubit states, all built from the same Hadamard-then-CNOT recipe starting from a different one of the four basis states. Φ⁺/Φ⁻ always measure to matching outcomes, Ψ⁺/Ψ⁻ always to opposite ones — the relative phase behind each ± sign is invisible to a direct measurement, only showing up once the qubits are interfered with each other.' },
  { id: 'measure', title: 'Measurement', tab: 'measure',
    body: 'Measuring a qubit forces it to commit to a definite outcome, 0 or 1, with probabilities set by its amplitudes just before measurement. This is the collapse of superposition — irreversible and probabilistic, not a hidden pre-existing value.' },
  { id: 'entangle', title: 'Entanglement', tab: 'entangle',
    body: 'Two qubits can be linked so that measuring one instantly determines the other\'s outcome, no matter how far apart they are. This correlation is stronger than anything possible between classical bits.' },
  { id: 'tunnel', title: 'Quantum Tunneling', tab: 'tunnel',
    body: 'A quantum wave packet has a nonzero chance of appearing on the far side of a barrier it classically shouldn\'t be able to cross, because its probability cloud extends through the barrier rather than stopping at it.' },
  { id: 'interference', title: 'Interference', tab: 'interference',
    body: 'When two paths to the same outcome are indistinguishable, their probability amplitudes combine and can reinforce or cancel — producing stripes on a screen instead of two simple piles. Marking which path was taken destroys the pattern.' },
  { id: 'beamsplitter', title: 'Beam Splitter', tab: 'beamsplitter',
    body: 'A 50/50 beam splitter sends a single photon down one of two paths with equal probability — reflected to one detector or transmitted to the other. The photon isn\'t secretly divided between both paths; only one detector ever clicks per photon, and which one is genuinely random each time.' },
  { id: 'sterngerlach', title: 'Stern–Gerlach Experiment', tab: 'sterngerlach',
    body: 'A beam of silver atoms passing through an inhomogeneous magnetic field splits into exactly two discrete spots, never a continuous smear — direct evidence that spin is quantized, with only two possible outcomes along any measurement axis, exactly like a qubit\'s own |0⟩/|1⟩ measurement results.' }
];

// one question per lesson, lessonId matches ROADMAP_LESSONS[].id.
// explanation shows after answering either way, right or wrong
const ROADMAP_QUIZ = [
  { lessonId: 'qubit',
    q: 'A classical bit and a qubit both start in a definite state. What is the key difference between them?',
    options: ['Qubits can hold a superposition of 0 and 1 at once', 'Qubits are just faster bits', 'Qubits can only be measured once, ever', 'There is no real difference'],
    correct: 0,
    explanation: 'A qubit\'s amplitudes let it genuinely be a mix of both basis states until measured — a classical bit never has that option.' },
  { lessonId: 'maths-complex',
    q: 'Why do qubit amplitudes need to be complex numbers rather than just real numbers?',
    options: ['Complex numbers are more precise than real numbers', 'The extra phase in a complex number is what makes interference between paths possible', 'Real numbers can\'t be negative', 'It\'s just a mathematical convention with no physical meaning'],
    correct: 1,
    explanation: 'Two real amplitudes could still cancel by sign, but only a complex phase lets amplitudes reinforce or cancel at any relative angle — that richer freedom is exactly what interference exploits.' },
  { lessonId: 'maths-vectors',
    q: 'What does the normalization condition |α|² + |β|² = 1 guarantee about a qubit state?',
    options: ['That the qubit is entangled', 'That the total measurement probability across |0⟩ and |1⟩ adds up to exactly 100%', 'That the qubit has been measured', 'That α and β are both real numbers'],
    correct: 1,
    explanation: 'P(0) + P(1) = |α|² + |β|² must equal 1 for the Born rule to make sense as a probability distribution — every valid point on the Bloch sphere already satisfies this automatically.' },
  { lessonId: 'maths-matrices',
    q: 'What property must every valid quantum gate matrix U satisfy?',
    options: ['det(U) = 0', 'U†U = I (U is unitary)', 'U must be a real-valued matrix', 'U must have exactly two rows'],
    correct: 1,
    explanation: 'Unitarity is what keeps the state vector normalized after the gate is applied — it\'s also exactly the condition that makes every quantum gate reversible, unlike a classical AND gate.' },
  { lessonId: 'maths-statevector',
    q: 'In the Bloch-sphere form |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, what do θ and φ correspond to?',
    options: ['Two independent qubits', 'The exact same θ/φ sliders used to set a state on the Bloch sphere', 'The number of gates applied so far', 'The measurement outcome'],
    correct: 1,
    explanation: 'Every point on the Bloch sphere is just this equation with one (θ,φ) pair plugged in — the sphere is a picture of the formula, not a separate thing.' },
  { lessonId: 'maths-dirac',
    q: 'What does it mean that ⟨0|1⟩ = 0?',
    options: ['|0⟩ and |1⟩ are the same state', '|0⟩ and |1⟩ are orthogonal — completely distinguishable outcomes', 'The qubit is in superposition', 'A measurement error occurred'],
    correct: 1,
    explanation: 'Orthogonality is exactly why measurement always returns a clean 0 or 1, never something "in between" — |0⟩ and |1⟩ share zero overlap.' },
  { lessonId: 'maths-tensor',
    q: 'Two independent qubits, each a 2-entry vector, combine via the tensor product into a joint state. How many entries does that joint state have?',
    options: ['2', '4', '8', 'It depends on the qubits\' amplitudes'],
    correct: 1,
    explanation: 'The tensor product of a 2-entry vector with another 2-entry vector always has 2×2 = 4 entries — one for each combination of basis outcomes, |00⟩, |01⟩, |10⟩, |11⟩ — regardless of what the actual amplitudes are.' },
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
  { lessonId: 'bellstates',
    q: 'Φ⁺ = (|00⟩ + |11⟩)/√2 and Φ⁻ = (|00⟩ − |11⟩)/√2 are different states, yet measuring either one in this demo gives identical statistics. Why?',
    options: ['They are actually the same state written two ways', 'A relative phase (the − sign) doesn\'t change any computational-basis probability, only |amplitude|² does', 'The demo has a bug and can\'t tell them apart', 'Only Φ⁺ is a real Bell state'],
    correct: 1,
    explanation: 'Probabilities come from |amplitude|², which is identical for +1/√2 and −1/√2. The two states are still physically distinct — the phase becomes visible once the qubits are interfered with each other, e.g. by applying a Hadamard to each before measuring.' },
  { lessonId: 'measure',
    q: 'What happens to a qubit\'s superposition when you measure it?',
    options: ['Nothing changes', 'It collapses to a single definite outcome', 'It splits into two qubits', 'It becomes entangled automatically'],
    correct: 1,
    explanation: 'There\'s no hidden fact about which outcome it "really" was beforehand — measuring is what produces a definite answer, weighted by the amplitudes.' },
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
    explanation: 'Each screen point has two possible paths; when they\'re indistinguishable their amplitudes add and can reinforce or cancel, producing the fringes.' },
  { lessonId: 'beamsplitter',
    q: 'A single photon hits a 50/50 beam splitter. What actually happens?',
    options: ['The photon splits in half, with half going to each detector', 'The photon goes to exactly one detector, chosen at random with 50/50 odds', 'Both detectors always click together', 'Neither detector clicks unless you measure twice'],
    correct: 1,
    explanation: 'A photon is never divided between paths — the beam splitter puts it into a superposition of "reflected" and "transmitted", and measuring (the detector clicking) forces one definite outcome, same as measuring a qubit.' },
  { lessonId: 'sterngerlach',
    q: 'A beam of silver atoms passes through a Stern–Gerlach magnet. What does the experiment actually show on the detector screen?',
    options: ['A continuous smear from one extreme to the other', 'Exactly two discrete spots, never anything in between', 'A single spot in the exact center', 'No pattern at all — the atoms are absorbed'],
    correct: 1,
    explanation: 'Classically, a randomly-oriented magnetic dipole should deflect by any amount, producing a continuous smear. Stern and Gerlach found only two discrete spots — direct evidence that spin, like a qubit\'s own measurement outcomes, is quantized into just two possibilities along any axis.' }
];

// progress persistence, localStorage, same convention as theme.js/tour.js
const ROADMAP_STORAGE_KEY = 'qe-roadmap-progress';

function loadRoadmapProgress() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(ROADMAP_STORAGE_KEY)); } catch (e) { raw = null; }
  return {
    completedLessons: Array.isArray(raw && raw.completedLessons) ? raw.completedLessons : [],
    quizAnswers: (raw && typeof raw.quizAnswers === 'object' && raw.quizAnswers !== null) ? raw.quizAnswers : {}  // { [lessonId]: chosenOptionIndex }
  };
}

function saveRoadmapProgress() {
  localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmapProgress));
}

// this is destructive and can't be undone with one more click like toggling
// a single lesson can, so confirm first (showConfirmModal, dom-utils.js)
function resetRoadmapProgress() {
  showConfirmModal({
    title: 'Reset all progress?',
    message: 'This clears every lesson\'s "read" status and quiz answer, including all five Maths Concept sections. This can\'t be undone.',
    confirmLabel: 'Reset progress',
    danger: true,
    onConfirm: () => {
      roadmapProgress = { completedLessons: [], quizAnswers: {} };
      saveRoadmapProgress();
      refreshLessonUI();
    }
  });
}

let roadmapProgress = loadRoadmapProgress();

// mode switching
// top-level Concepts/Home switch. only toggles inline style.display, never
// touches which tab carries .active - so switching back to 'sim' restores
// whatever tab was active before, no bookkeeping needed
function setAppMode(mode) {
  document.querySelectorAll('.mode-btn[data-app-mode]').forEach(b =>
    b.classList.toggle('active', b.dataset.appMode === mode));
  document.getElementById('tab-sidebar').style.display = mode === 'sim' ? '' : 'none';
  document.querySelectorAll('.tab-content').forEach(s => { s.style.display = mode === 'sim' ? '' : 'none'; });
  document.getElementById('roadmap-view').classList.toggle('active', mode === 'roadmap');
  // both the mind-map and progress panel are display:none until this runs,
  // so any earlier render would've measured a hidden 0x0 container -
  // re-render now that it's actually visible
  if (mode === 'roadmap') {
    if (roadmapSubMode === 'map') renderRoadmapMindmap();
    else renderRoadmapProgress();
  }
}

let roadmapSubMode = 'map';

// Concept Map / My Progress sub-switch, mirrors setCircuitMode() in
// circuit-multiqubit-tab.js. mind-map gets the full-viewport treatment,
// progress summary is just a compact card list
function setRoadmapMode(mode) {
  roadmapSubMode = mode;
  document.querySelectorAll('.mode-btn[data-roadmap-mode]').forEach(b =>
    b.classList.toggle('active', b.dataset.roadmapMode === mode));
  document.getElementById('roadmap-mindmap').style.display = mode === 'map' ? '' : 'none';
  document.getElementById('roadmap-mindmap-fallback').style.display = mode === 'map' ? '' : 'none';
  document.getElementById('roadmap-progress-panel').style.display = mode === 'progress' ? '' : 'none';
  document.getElementById('roadmap-hero').classList.toggle('roadmap-hero--full', mode === 'map');
  if (mode === 'map') renderRoadmapMindmap();
  else renderRoadmapProgress();
}

// lessons embed at the bottom of each concept's own tab (see the
// #lesson-embed-<tab> spots in index.html) rather than a separate grid

// shared template so mark-as-read/quick-check markup doesn't drift between
// lessons. click handling is wired up separately, in initRoadmap()
function buildLessonInfoHTML(lesson) {
  const done  = roadmapProgress.completedLessons.includes(lesson.id);
  const title = t(`lessons.${lesson.id}.title`, lesson.title);
  const body  = t(`lessons.${lesson.id}.body`, lesson.body);
  return `
    <div class="card-title">${title}${done ? ' — ' + t('roadmap.read', 'read') : ''}</div>
    <p class="bit-explainer">${body}</p>
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
      <button class="btn-secondary${done ? ' is-done' : ''}" data-lesson-done="${lesson.id}">${done ? t('roadmap.markUnread', 'Mark unread') : t('roadmap.markAsRead', 'Mark as read')}</button>
    </div>
    ${buildQuickCheckHTML(lesson)}`;
}


// keyed by lesson.id not lesson.tab, since the 5 maths lessons all share
// one tab but each needs its own placeholder inside its own .maths-panel
function renderEmbeddedLessons() {
  ROADMAP_LESSONS.forEach(lesson => {
    const host = document.getElementById(`lesson-embed-${lesson.id}`);
    if (!host) return;
    host.innerHTML = `<div class="card">${buildLessonInfoHTML(lesson)}</div>`;
  });
}

// Introduction tab's "Suggested learning path" list - reads ROADMAP_LESSONS
// directly instead of duplicating the copy, and reuses the same
// [data-lesson-tryit] handler the mind-map uses (see initRoadmap below)
function renderIntroLearningPath() {
  const host = document.getElementById('intro-learning-path');
  if (!host) return;
  host.innerHTML = ROADMAP_LESSONS.map((lesson, i) => {
    const title = t(`lessons.${lesson.id}.title`, lesson.title);
    const body  = t(`lessons.${lesson.id}.body`, lesson.body);
    return `
    <div class="intro-path-item">
      <div class="intro-path-num">${i + 1}</div>
      <div class="intro-path-body">
        <div class="intro-path-title">${title}</div>
        <div class="intro-path-desc">${firstSentence(body)}</div>
      </div>
      <button class="btn-secondary" data-lesson-tryit="${lesson.id}">${t('roadmap.start', 'Start →')}</button>
    </div>`;
  }).join('');
}

// mind-map (home page) - "Quantum World" center with branches fanning out
// left/right, based on a yFiles diagram someone put together. MINDMAP_TREE
// is that branch tree. Introduction and Circuits' sub-branches carry a
// `tab` field (+ circuitDomain/circuitMode for Circuits) and are actually
// navigable, per goToLessonSimulation() below. Qubit's and Gates' sub-
// branches stay collapse/expand-only since nothing on those tabs actually
// distinguishes e.g. a "One Qubit" page from the tab itself.
// this doesn't reorder ROADMAP_LESSONS - that array's own order still
// drives the lesson-content lists independently of this layout.
// node positions come from the container's measured pixel size rather than
// fixed percentages so it stays correct down to the 760px breakpoint,
// where it's replaced by a plain link list instead (.roadmap-mindmap-fallback,
// see roadmap.css + renderMindmapFallback below - no room for absolutely
// positioned nodes or a multi-level tree on a narrow screen).
//
// numbering matches #tab-sidebar's order. Bell States sits right after
// Circuits (where it's actually built) instead of after Entangle, and
// that's also what keeps the left/right column split an even 6-and-6 -
// it was 5-and-5 until Stern-Gerlach got added and tipped it to 5-and-6.
// doesn't mean anything beyond visual balance, feel free to rebalance if
// the count changes again - just keep each side in ascending `number`
// order since layoutColumn() renders a side in array order, not sorted.
// State Vector isn't its own top-level branch, it only shows up under
// Maths Concept's own children below.
//
// translation keys for tree nodes with no matching ROADMAP_LESSONS entry -
// renderNode() below prefers a lesson's own title when one exists, so this
// only needs to cover the structural/collapse-only branches
const MINDMAP_NODE_TITLE_KEYS = {
  introduction: 'mindmap.introduction',
  mathsconcept: 'maths.title',
  'qubit-classical': 'mindmap.classical',
  'qubit-quantum': 'mindmap.quantum',
  'qubit-one': 'mindmap.oneQubit',
  'qubit-two': 'mindmap.twoQubits',
  'qubit-three': 'mindmap.threeQubits',
  'gates-classical': 'mindmap.classical',
  'gates-quantum': 'mindmap.quantum',
  'gates-compare': 'gatesTab.compare',
  'circuit-classical': 'mindmap.classical',
  'circuit-quantum': 'mindmap.quantum',
  'circuit-quantum-one': 'mindmap.oneQubit',
  'circuit-quantum-two': 'mindmap.twoQubits',
  'circuit-quantum-three': 'mindmap.threeQubits'
};

const MINDMAP_TREE = [
  { id: 'introduction', number: 1,  title: 'Introduction', side: 'left', tab: 'introduction' },
  { id: 'qubit',        number: 2,  title: 'Bits',               side: 'left',  tab: 'qubit', children: [
      // real destinations on the Bits tab (setQubitMode()/setQubitSubmode()
      // in qubit-tab.js), navigable like Circuits' sub-branches
      { id: 'qubit-classical', title: 'Classical',  tab: 'qubit', qubitMode: 'classical' },
      { id: 'qubit-quantum',   title: 'Quantum',    tab: 'qubit', qubitMode: 'quantum', children: [
          { id: 'qubit-one',   title: 'One Qubit',    tab: 'qubit', qubitMode: 'quantum', qubitSubmode: '1q' },
          { id: 'qubit-two',   title: 'Two Qubits',   tab: 'qubit', qubitMode: 'quantum', qubitSubmode: '2q' },
          { id: 'qubit-three', title: 'Three Qubits', tab: 'qubit', qubitMode: 'quantum', qubitSubmode: '3q' }
        ] }
    ] },
  { id: 'mathsconcept', number: 3,  title: 'Maths Concept',      side: 'left',  tab: 'mathsconcept', children: [
      // see setMathsSection() in mathsconcept-tab.js
      { id: 'maths-complex',     title: 'Complex Numbers', tab: 'mathsconcept', mathsSection: 'complex' },
      { id: 'maths-vectors',     title: 'Vectors',         tab: 'mathsconcept', mathsSection: 'vectors' },
      { id: 'maths-matrices',    title: 'Matrices',        tab: 'mathsconcept', mathsSection: 'matrices' },
      { id: 'maths-statevector', title: 'State Vector',    tab: 'mathsconcept', mathsSection: 'statevector' },
      { id: 'maths-dirac',       title: 'Dirac Notation',  tab: 'mathsconcept', mathsSection: 'dirac' },
      { id: 'maths-tensor',      title: 'Tensor Products', tab: 'mathsconcept', mathsSection: 'tensor' }
    ] },
  { id: 'gates',        number: 4,  title: 'Gates',              side: 'left',  tab: 'gates', children: [
      // see setGatesDomain() in gates-tab.js
      { id: 'gates-classical', title: 'Classical', tab: 'gates', gatesDomain: 'classical' },
      { id: 'gates-quantum',   title: 'Quantum',   tab: 'gates', gatesDomain: 'quantum' },
      { id: 'gates-compare',   title: 'Compare',   tab: 'gates', gatesDomain: 'compare' }
    ] },
  { id: 'circuit',      number: 5,  title: 'Circuits',           side: 'left',  tab: 'circuit', children: [
      // unlike Qubit/Gates' sub-branches these map to real distinct pages
      // on the Circuits tab (setCircuitDomain() in circuit-tab.js,
      // setCircuitMode() in circuit-multiqubit-tab.js) so they're
      // actually navigable, not just collapse/expand
      { id: 'circuit-classical', title: 'Classical', tab: 'circuit', circuitDomain: 'classical' },
      { id: 'circuit-quantum',   title: 'Quantum', tab: 'circuit', circuitDomain: 'quantum', children: [
          { id: 'circuit-quantum-one',   title: 'One Qubit',   tab: 'circuit', circuitDomain: 'quantum', circuitMode: '1q' },
          { id: 'circuit-quantum-two',   title: 'Two Qubits',  tab: 'circuit', circuitDomain: 'quantum', circuitMode: '2q' },
          { id: 'circuit-quantum-three', title: 'Three Qubits', tab: 'circuit', circuitDomain: 'quantum', circuitMode: '3q' }
        ] }
    ] },
  { id: 'bellstates',   number: 6,  title: 'Bell States',        side: 'left',  tab: 'bellstates' },
  { id: 'measure',      number: 7,  title: 'Measurements',       side: 'right', tab: 'measure' },
  { id: 'entangle',     number: 8,  title: 'Entanglement',       side: 'right', tab: 'entangle' },
  { id: 'tunnel',       number: 9,  title: 'Quantum Tunneling',  side: 'right', tab: 'tunnel' },
  { id: 'interference', number: 10, title: 'Interference',       side: 'right', tab: 'interference' },
  { id: 'beamsplitter', number: 11, title: 'Beam Splitter',      side: 'right', tab: 'beamsplitter' },
  { id: 'sterngerlach', number: 12, title: 'Stern–Gerlach Experiment', side: 'right', tab: 'sterngerlach' }
];

// color is per depth, not per branch - matches the source diagram's own
// per-node color tags. top-level branches are individually teal or navy
// (not alternating, just copied from the file), level-2 is one uniform
// mauve regardless of parent, level-3 (Circuits > Quantum's children) is
// a separate darker purple
const MINDMAP_LEVEL1_COLORS = {
  introduction: '#4281a4',
  qubit:        '#4281a4',
  mathsconcept: '#242265',
  gates:        '#242265',
  measure:      '#4281a4',
  entangle:     '#4281a4',
  circuit:      '#242265',
  bellstates:   '#4281a4',
  tunnel:       '#4281a4',
  interference: '#242265',
  beamsplitter: '#4281a4',
  sterngerlach: '#242265'
};
const MINDMAP_LEVEL2_COLOR = '#aa5f82';
const MINDMAP_LEVEL3_COLOR = '#6c4f77';

let mindmapResizeTimer = null;
// ids of branches currently expanded - starts empty (everything collapsed)
// and persists across re-renders since this Set lives outside the render fn
let mindmapExpanded = new Set();

function renderRoadmapMindmap() {
  const container = document.getElementById('roadmap-mindmap');
  if (!container) return;

  // clear any height override left over from a previous expanded render,
  // otherwise growth compounds across renders
  container.style.height = '';
  container.style.maxHeight = '';
  const rect = container.getBoundingClientRect();
  const w = rect.width  || 900;
  const h = rect.height || 420;
  const cx = w / 2;

  // distance from center to each top-level column, clamped so a 3-deep
  // expanded branch (Circuits > Quantum > One/Two Qubit) still fits a
  // mid-size container
  const colOffset   = Math.min(w * 0.28, 240);
  const childOffsets = [110, 90]; // depth 1, depth 2
  // top-level rows spaced generously (5 rows max on either side), child
  // rows tighter since there's never more than 2-3 siblings
  const rowSpacing   = Math.min(90, h / 6);
  const childSpacing = 44;
  // trunk-to-tip thickness taper, one [start,end] pair per depth
  const THICKNESS = [[14, 6], [6, 3], [3, 2]];

  const shapes = [];
  const nodesHTML = [];
  let branchIdSeq = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // color is purely a function of depth, see the MINDMAP_LEVEL*_COLOR
  // constants above
  function colorForDepth(depth, node) {
    if (depth === 0) return MINDMAP_LEVEL1_COLORS[node.id];
    if (depth === 1) return MINDMAP_LEVEL2_COLOR;
    return MINDMAP_LEVEL3_COLOR;
  }

  // tapered wedge from (x0,y0) to (x1,y1), w0 wide at the start narrowing
  // to w1 at the end. control points sit level with their own endpoint at
  // the horizontal midpoint, which is what gives it that S-curve look
  // instead of a plain bowed arc
  function taperedBranch(x0, y0, x1, y1, w0, w1, color) {
    const midX = (x0 + x1) / 2;
    const hw0 = w0 / 2, hw1 = w1 / 2;
    return `<path d="M ${x0} ${y0 - hw0} `
      + `C ${midX} ${y0 - hw0}, ${midX} ${y1 - hw1}, ${x1} ${y1 - hw1} `
      + `L ${x1} ${y1 + hw1} `
      + `C ${midX} ${y1 + hw1}, ${midX} ${y0 + hw0}, ${x0} ${y0 + hw0} Z" `
      + `fill="${color}" opacity="0.92"></path>`;
  }

  // small glowing dots traveling along a branch, purely decorative, drawn
  // on top of the taperedBranch() wedge. the guide path is invisible
  // (fill/stroke none), just there for animateMotion to follow - reuses
  // the same curve geometry so it lines up with the wedge underneath.
  // duration scales with distance so dots move at roughly the same speed
  // everywhere, and negative `begin` staggers each dot instead of having
  // them all start synchronized. skipped under prefers-reduced-motion
  function electronFlow(x0, y0, x1, y1, color) {
    if (reduceMotion) return '';
    const id = `mindmap-branch-path-${branchIdSeq++}`;
    const midX = (x0 + x1) / 2;
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const dur = Math.max(1.2, dist / 120);
    const guide = `<path id="${id}" d="M ${x0} ${y0} C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}" fill="none" stroke="none"></path>`;
    const dots = [0, 0.5].map(phase => {
      const begin = (-phase * dur).toFixed(2);
      return `<circle r="2.6" fill="${color}" style="filter:drop-shadow(0 0 3px ${color})">`
        + `<animateMotion dur="${dur.toFixed(2)}s" begin="${begin}s" repeatCount="indefinite">`
        + `<mpath href="#${id}" xlink:href="#${id}"></mpath>`
        + `</animateMotion>`
        + `</circle>`;
    }).join('');
    return guide + dots;
  }

  function renderNode(node, x, y, depth) {
    const color = colorForDepth(depth, node);
    const lesson = node.tab ? ROADMAP_LESSONS.find(l => l.id === node.id) : null;
    const done = lesson ? roadmapProgress.completedLessons.includes(lesson.id) : false;
    // prefer the lesson's own title so a node never reads differently here
    // than where it lands. nodes with no lesson fall back to MINDMAP_NODE_TITLE_KEYS
    const displayTitle = lesson
      ? t(`lessons.${lesson.id}.title`, lesson.title)
      : t(MINDMAP_NODE_TITLE_KEYS[node.id] || '', node.title);
    const label = node.number ? `${node.number}. ${displayTitle}` : displayTitle;
    const tip = lesson ? `${label}${done ? ' — ' + t('roadmap.read', 'read') : ''}: ${firstSentence(t(`lessons.${lesson.id}.body`, lesson.body))}` : label;

    const classes = ['mindmap-node'];
    if (depth > 0) classes.push('mindmap-node--sub');
    if (done) classes.push('is-done');
    if (!node.tab) classes.push('mindmap-node--static');

    const navAttr = node.tab ? `data-lesson-tryit="${node.id}"` : '';
    const toggleHTML = node.children
      ? `<span class="mindmap-toggle" data-mindmap-toggle="${node.id}">${mindmapExpanded.has(node.id) ? '−' : '+'}</span>`
      : '';
    // background tint alone isn't a strong enough "done" signal against
    // every branch color, so add an explicit checkmark too
    const doneMark = done ? ' <span class="mindmap-done-mark">✓</span>' : '';

    return `<button class="${classes.join(' ')}" ${navAttr} data-tooltip="${tip}" style="left:${x}px;top:${y}px;--branch-color:${color};">${label}${doneMark}${toggleHTML}</button>`;
  }

  function placeChildren(parent, parentX, parentY, side, depth) {
    if (!parent.children || !mindmapExpanded.has(parent.id)) return;
    const offset = childOffsets[depth - 1] || childOffsets[childOffsets.length - 1];
    const x = parentX + (side === 'left' ? -offset : offset);
    const n = parent.children.length;
    const [w0, w1] = THICKNESS[Math.min(depth, THICKNESS.length - 1)];
    parent.children.forEach((child, i) => {
      const y = parentY + (i - (n - 1) / 2) * childSpacing;
      const color = colorForDepth(depth, child);
      shapes.push(taperedBranch(parentX, parentY, x, y, w0, w1, color));
      shapes.push(electronFlow(parentX, parentY, x, y, color));
      nodesHTML.push(renderNode(child, x, y, depth));
      placeChildren(child, x, y, side, depth + 1);
    });
  }

  // how much vertical space an expanded subtree needs from its own row -
  // mirrors the y offsets placeChildren() actually draws so reserved space
  // always matches what gets rendered, recursing through however many
  // levels are expanded
  function subtreeHalfExtent(node) {
    if (!node.children || !mindmapExpanded.has(node.id)) return 0;
    const n = node.children.length;
    let maxExtent = 0;
    node.children.forEach((child, i) => {
      const offset = Math.abs((i - (n - 1) / 2) * childSpacing);
      const extent = offset + subtreeHalfExtent(child);
      if (extent > maxExtent) maxExtent = extent;
    });
    return maxExtent;
  }

  // minimum half-extent every row keeps even collapsed, so two collapsed
  // neighbors land exactly rowSpacing apart. only a row whose
  // subtreeHalfExtent is actually bigger pushes its neighbors out further -
  // used to pay the rowGap unconditionally, which grew the collapsed map
  // past the viewport for no reason, hence this
  const rowGap = 18;
  const minRowHalfExtent = (rowSpacing - rowGap) / 2;

  function measureColumn(side) {
    const nodes = MINDMAP_TREE.filter(n => n.side === side);
    const halfExtents = nodes.map(n => Math.max(minRowHalfExtent, subtreeHalfExtent(n)));
    const centers = [];
    let cursor = 0;
    halfExtents.forEach((half, i) => {
      cursor = i === 0 ? half : cursor + halfExtents[i - 1] + rowGap + half;
      centers.push(cursor);
    });
    const columnHeight = halfExtents.length ? centers[centers.length - 1] + halfExtents[halfExtents.length - 1] : 0;
    return { nodes, centers, columnHeight };
  }

  const leftCol = measureColumn('left');
  const rightCol = measureColumn('right');

  // grow the container only when an expanded tree actually needs more room
  // than the natural CSS height - otherwise absolutely positioned nodes
  // would overflow onto whatever's below. small margin just keeps the
  // outermost pill off the edge, doesn't affect the collapsed case
  const contentHeight = Math.max(leftCol.columnHeight, rightCol.columnHeight);
  const finalH = Math.max(h, contentHeight + 6);
  if (finalH > h) {
    container.style.height = finalH + 'px';
    container.style.maxHeight = 'none';
  }
  const cy = finalH / 2;

  function layoutColumn(col, x) {
    const yOffset = cy - col.columnHeight / 2;
    return col.nodes.map((node, i) => ({ node, x, y: col.centers[i] + yOffset }));
  }

  const topNodes = [...layoutColumn(leftCol, cx - colOffset), ...layoutColumn(rightCol, cx + colOffset)];
  topNodes.forEach(({ node, x, y }) => {
    const [w0, w1] = THICKNESS[0];
    const color = colorForDepth(0, node);
    shapes.push(taperedBranch(cx, cy, x, y, w0, w1, color));
    shapes.push(electronFlow(cx, cy, x, y, color));
    nodesHTML.push(renderNode(node, x, y, 0));
    placeChildren(node, x, y, node.side, 1);
  });

  container.innerHTML =
    `<svg>${shapes.join('')}</svg>` +
    `<div class="mindmap-center" data-tooltip="${mindmapCenterTooltip()}" style="left:${cx}px;top:${cy}px;">${t('mindmap.quantumWorld', 'Quantum World')}</div>` +
    nodesHTML.join('');

  renderMindmapFallback();
}

// plain link list shown below the 760px breakpoint instead of the mind-map.
// only top-level nodes (doesn't recurse into .children) - Circuits' own
// navigable sub-branches are only reachable from the full mind-map.
// rebuilt alongside the mind-map so "read" state never drifts out of sync
function renderMindmapFallback() {
  const list = document.getElementById('roadmap-mindmap-fallback');
  if (!list) return;
  const navigable = MINDMAP_TREE.filter(n => n.tab).sort((a, b) => a.number - b.number);
  list.innerHTML = navigable.map(node => {
    const lesson = ROADMAP_LESSONS.find(l => l.id === node.id);
    const done = roadmapProgress.completedLessons.includes(node.id);
    const title = lesson
      ? t(`lessons.${lesson.id}.title`, lesson.title)
      : t(MINDMAP_NODE_TITLE_KEYS[node.id] || '', node.title);
    const label = `${node.number}. ${title}`;
    return `<button class="mindmap-fallback-item${done ? ' is-done' : ''}" data-lesson-tryit="${node.id}" style="--branch-color:${MINDMAP_LEVEL1_COLORS[node.id]};">${label}${done ? ' — ' + t('roadmap.read', 'read') : ''}</button>`;
  }).join('');
}

// recomputed at render time rather than a constant, so it picks up
// language changes - see setLanguage()'s callbacks below
function mindmapCenterTooltip() {
  return t('roadmap.centerTooltip', '{count} core quantum computing concepts, from a single qubit to entanglement and wave interference — click any topic to explore it.')
    .replace('{count}', ROADMAP_LESSONS.length);
}

// first sentence only, so the tooltip stays short - it reuses the Bloch
// axis tooltip box (showBlochTooltip below) which is sized for one line
function firstSentence(text) {
  const m = text.match(/^[^.]*\./);
  return m ? m[0] : text;
}

// one-question quick check under the lesson body, immediate feedback + explanation
function buildQuickCheckHTML(lesson) {
  const q = ROADMAP_QUIZ.find(item => item.lessonId === lesson.id);
  if (!q) return '';

  const qKey = `quiz.${lesson.id}`;
  const question = t(`${qKey}.q`, q.q);
  const options  = q.options.map((opt, i) => t(`${qKey}.options.${i}`, opt));

  const answered = roadmapProgress.quizAnswers[lesson.id];
  if (answered === undefined) {
    return `
      <div class="roadmap-quickcheck">
        <div class="roadmap-quickcheck-label">${t('roadmap.quickCheck', 'Quick check')}</div>
        <p class="roadmap-quickcheck-q">${question}</p>
        <div class="roadmap-quiz-options" data-quickcheck-lesson="${lesson.id}">
          ${options.map((opt, i) => `<button class="preset-btn" data-choice="${i}">${opt}</button>`).join('')}
        </div>
      </div>`;
  }

  const correct = answered === q.correct;
  const explanation = t(`${qKey}.explanation`, q.explanation);
  return `
    <div class="roadmap-quickcheck">
      <div class="roadmap-quickcheck-label">${t('roadmap.quickCheck', 'Quick check')} — ${correct ? t('roadmap.correct', 'correct') : t('roadmap.review', 'review')}</div>
      <p class="roadmap-quickcheck-q">${question}</p>
      <div class="roadmap-quiz-options">
        ${options.map((opt, i) => {
          let cls = 'preset-btn';
          if (i === q.correct) cls += ' quiz-correct';
          else if (i === answered) cls += ' quiz-incorrect';
          return `<button class="${cls}" disabled>${opt}</button>`;
        }).join('')}
      </div>
      <p class="bit-explainer" style="margin-top:8px;">${explanation}</p>
    </div>`;
}

// keeps the header "Home" button showing live progress, e.g. "Home · 3/9"
function updateRoadmapBadge() {
  const btn = document.getElementById('btn-roadmap-toggle');
  const done = roadmapProgress.completedLessons.length;
  // count lives in its own span, hidden below ~480px (responsive.css) so
  // narrow headers can give that space back to the tab nav
  btn.innerHTML = `${t('nav.home', 'Home')}<span class="roadmap-badge-count"> · ${done}/${ROADMAP_LESSONS.length}</span>`;
}

// progress summary ("My Progress" sub-view)
// same completedLessons/quizAnswers state as everywhere else, just a
// different view of it - quiz score only counts questions actually
// answered, not a replayable standalone quiz
function renderRoadmapProgress() {
  const total = ROADMAP_LESSONS.length;
  const done  = roadmapProgress.completedLessons.length;
  const pct   = Math.round(100 * done / total);

  document.getElementById('roadmap-progress-fill').style.width = pct + '%';
  document.getElementById('roadmap-progress-pct').textContent  = `${done}/${total}`;

  const answeredIds = Object.keys(roadmapProgress.quizAnswers);
  const correctCount = answeredIds.filter(id => {
    const q = ROADMAP_QUIZ.find(item => item.lessonId === id);
    return q && roadmapProgress.quizAnswers[id] === q.correct;
  }).length;
  document.getElementById('roadmap-quiz-score-text').textContent =
    answeredIds.length === 0
      ? t('roadmap.notAttempted', 'Not attempted yet.')
      : t('roadmap.quizScoreSummary', '{correct} / {answered} quick checks correct so far ({total} concepts total).')
          .replace('{correct}', correctCount).replace('{answered}', answeredIds.length).replace('{total}', total);

  document.getElementById('roadmap-checklist').innerHTML = ROADMAP_LESSONS.map(l => {
    const lessonDone = roadmapProgress.completedLessons.includes(l.id);
    return `<label class="roadmap-checklist-row">
      <input type="checkbox" disabled ${lessonDone ? 'checked' : ''}>
      <span>${t(`lessons.${l.id}.title`, l.title)}</span>
    </label>`;
  }).join('');
}

// re-renders everything that shows lesson state, called after any mutation
// (mark-as-read, quiz answer) so they all stay in sync
function refreshLessonUI() {
  renderRoadmapMindmap();
  renderEmbeddedLessons();
  updateRoadmapBadge();
  if (roadmapSubMode === 'progress') renderRoadmapProgress();
}

// flat id -> node lookup across the whole tree including nested children,
// built once so goToLessonSimulation() can resolve a click from any depth
const MINDMAP_NODE_BY_ID = (function flatten(nodes, map = {}) {
  nodes.forEach(node => {
    map[node.id] = node;
    if (node.children) flatten(node.children, map);
  });
  return map;
})(MINDMAP_TREE);

// switches to Concepts mode, picks the tab, and applies whatever sub-state
// a sub-branch needs (Circuits > Quantum > Two Qubits, etc). nodes with
// no tab just do nothing
function goToLessonSimulation(nodeId) {
  const node = MINDMAP_NODE_BY_ID[nodeId];
  if (!node || !node.tab) return;
  setAppMode('sim');
  switchToTab(node.tab);
  if (node.circuitDomain) setCircuitDomain(node.circuitDomain);
  if (node.circuitMode) setCircuitMode(node.circuitMode);
  if (node.qubitMode) setQubitMode(node.qubitMode);
  if (node.qubitSubmode) setQubitSubmode(node.qubitSubmode);
  if (node.gatesDomain) setGatesDomain(node.gatesDomain);
  if (node.statevecMode) setStatevecMode(node.statevecMode);
  if (node.mathsSection) setMathsSection(node.mathsSection);
}

// init
function initRoadmap() {
  document.querySelectorAll('.mode-btn[data-app-mode]').forEach(btn =>
    btn.addEventListener('click', () => setAppMode(btn.dataset.appMode)));
  document.querySelectorAll('.mode-btn[data-roadmap-mode]').forEach(btn =>
    btn.addEventListener('click', () => setRoadmapMode(btn.dataset.roadmapMode)));
  // "Important Concepts" sits in the same row as Concept Map/My Progress
  // but isn't a real roadmap sub-mode, just navigates to that static tab
  document.querySelectorAll('.mode-btn[data-goto-tab]').forEach(btn =>
    btn.addEventListener('click', () => {
      setAppMode('sim');
      switchToTab(btn.dataset.gotoTab);
    }));
  renderIntroLearningPath();

  // delegated rather than bound per-render since the same lesson's controls
  // show up in three places at once (mind-map node, fallback list, embedded
  // lesson card) and re-binding all of them every render is asking for bugs
  document.addEventListener('click', (e) => {
    // checked first since the toggle span is nested inside the parent's
    // own tryit button - otherwise expanding a branch would also navigate
    const toggleBtn = e.target.closest('[data-mindmap-toggle]');
    if (toggleBtn) {
      const id = toggleBtn.dataset.mindmapToggle;
      if (mindmapExpanded.has(id)) mindmapExpanded.delete(id);
      else mindmapExpanded.add(id);
      renderRoadmapMindmap();
      return;
    }

    const tryItBtn = e.target.closest('[data-lesson-tryit]');
    if (tryItBtn) { goToLessonSimulation(tryItBtn.dataset.lessonTryit); return; }

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

    if (e.target.closest('[data-reset-progress]')) {
      resetRoadmapProgress();
      return;
    }

    const choiceBtn = e.target.closest('[data-choice]');
    if (choiceBtn) {
      const optionsEl = choiceBtn.closest('[data-quickcheck-lesson]');
      if (optionsEl) {
        const id = optionsEl.dataset.quickcheckLesson;
        roadmapProgress.quizAnswers[id] = parseInt(choiceBtn.dataset.choice, 10);
        // answering the quiz at all (right or wrong) counts as engaging
        // with the lesson, so auto-mark it read instead of making people
        // click "mark as read" separately too
        if (!roadmapProgress.completedLessons.includes(id)) {
          roadmapProgress.completedLessons.push(id);
        }
        saveRoadmapProgress();
        refreshLessonUI();
      }
      return;
    }
  });

  // re-layout on resize, but only while actually visible (reads 0x0 while
  // hidden, e.g. in Concepts mode)
  window.addEventListener('resize', () => {
    clearTimeout(mindmapResizeTimer);
    mindmapResizeTimer = setTimeout(() => {
      const container = document.getElementById('roadmap-mindmap');
      if (container && container.offsetParent !== null) renderRoadmapMindmap();
    }, 150);
  });

  // reuses the Bloch sphere's floating tooltip (dom-utils.js), fed from
  // [data-tooltip] instead of a hotspot hit-test. bound to the container,
  // not individual nodes, so it survives innerHTML getting replaced on
  // every re-render
  const mindmapEl = document.getElementById('roadmap-mindmap');
  mindmapEl.addEventListener('mousemove', (e) => {
    const node = e.target.closest('[data-tooltip]');
    if (node) showBlochTooltip(node.dataset.tooltip, e.clientX, e.clientY);
    else hideBlochTooltip();
  });
  mindmapEl.addEventListener('mouseleave', hideBlochTooltip);

  renderEmbeddedLessons();
  renderRoadmapMindmap();
  updateRoadmapBadge();

  // all of this renders text from JS rather than static [data-i18n] markup,
  // so a language switch needs its own re-render pass (see onLangChange
  // in i18n.js)
  onLangChange(() => {
    renderIntroLearningPath();
    refreshLessonUI(); // already re-renders My Progress too, if that's the current sub-view
  });
}
