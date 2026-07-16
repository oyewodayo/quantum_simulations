'use strict';
// Roadmap lesson + quiz CONTENT ONLY — no rendering, no state, no DOM.
// Split out of roadmap.js so editing lesson text or quiz questions never
// requires touching (or scrolling past) the mind-map/modal/quiz behavior
// code, and so a content-only change is a content-only diff. Loaded
// before roadmap.js (see index.html), which reads these as globals.

// ═══════════════════════════════════════════════════════════════════
// LESSON + QUIZ CONTENT
// ═══════════════════════════════════════════════════════════════════
const ROADMAP_LESSONS = [
  { id: 'qubit', title: 'The Qubit', tab: 'qubit',
    body: 'A classical bit is always definitively 0 or 1. A qubit can be in a superposition of both at once, described by two amplitudes rather than a single value. The Bloch sphere gives every possible qubit state a point on its surface.' },
  { id: 'gates', title: 'Quantum Gates', tab: 'gates',
    body: 'Gates are the operations that move a qubit around the Bloch sphere — reversible rotations rather than the destructive logic of classical gates. Each one (H, X, Y, Z, S, T) has a precise geometric effect you can watch happen.' },
  { id: 'circuit', title: 'Circuits', tab: 'circuit',
    body: 'A circuit is a sequence of gates applied left to right. Order matters — running the same gates in a different sequence can land the qubit in a completely different state, just like turns in a route. Switch to 2 Qubits in the gate palette to add CNOT and build an entangled Bell state gate by gate, the same recipe behind the Entangle tab.' },
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
