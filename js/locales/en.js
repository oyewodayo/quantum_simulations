'use strict';
// canonical locale - every key here should exist in fr.js/es.js too.
// t() in i18n.js falls back to this file if the active language is
// missing a key, so this is basically the full key list for the app
registerLocale('en', {
  header: {
    tag: 'Quantum Explorer · CERN',
    themeToggle: 'Toggle light / dark'
  },
  footer: {
    tagline: 'An interactive platform for learning quantum computing & quantum mechanics',
    cernLink: 'CERN official site',
    copyright: 'Copyright © {year} CERN'
  },
  nav: {
    home: 'Home',
    introduction: 'Introduction',
    importantConcepts: 'Important Concepts',
    bitsQubits: 'Bits & Qubits',
    mathsConcept: 'Maths Concept',
    gates: 'Gates',
    circuits: 'Circuits',
    measure: 'Measure',
    entangle: 'Entangle',
    bellStates: 'Bell States',
    tunnel: 'Tunnel',
    interference: 'Interference',
    beamSplitter: 'Beam Splitter',
    sternGerlach: 'Stern–Gerlach'
  },
  qubitTab: {
    classical: 'Classical',
    oneQubit: 'One Qubit',
    twoQubit: 'Two Qubit',
    threeQubit: 'Three Qubit',
    pageTitle: 'Bits & Qubits',
    pageSubtitle: 'Learn classical and quantum information by exploring a bit, a single qubit, or a two-qubit system.',
    classicalBitBadge: 'Classical Bit',
    classicalBitDesc: 'A bit is the smallest unit of information in a classical computer. Unlike a qubit, a classical bit never exists in both states simultaneously.',
    currentBit: 'Current bit',
    possibleValues: 'Possible values',
    classicalExplainer: 'Toggle the switch to change the bit. Notice it is always either 0 or 1, never both.',
    qubitBadge: 'Qubit',
    qubitDesc: 'A qubit is the fundamental unit of quantum information. Unlike a classical bit, it can exist in a superposition of both 0 and 1 at once — its state is described by two complex amplitudes, α and β, until the moment it\'s measured.',
    qubitIntroExplainer: 'Pick a mode below: explore a single qubit\'s superposition on the Bloch sphere, or see how two independent qubits combine into a joint state.',
    oneQubitDesc: 'A superposition of both 0 and 1',
    exploreBlochSphere: 'Explore the Bloch Sphere',
    oneQubitExplainer: 'A qubit can be in a superposition of |0⟩ and |1⟩ simultaneously. Drag the sliders to explore every possible state on the Bloch sphere — each point is a valid qubit state inaccessible to any classical bit.',
    qubitABadge: 'Qubit A',
    qubitADesc: 'Independent — not entangled with B',
    qubitBBadge: 'Qubit B',
    qubitBDesc: 'Independent — not entangled with A',
    jointState: 'Joint State — |ψ_A⟩ ⊗ |ψ_B⟩',
    twoQubitExplainer: 'Two qubits, each dragged independently — the joint state above is just the product of their individual odds, P(ab) = P(a) × P(b). Nothing here is correlated yet; that\'s exactly the ingredient the Entangle tab adds with a CNOT.',
    classicalTryMeIdle: 'Click Try me to watch the bit flip back and forth.',
    oneQubitTryMeIdle: 'Click Try me to cycle through the six basis states.',
    twoQubitTryMeIdle: 'Click Try me to move both qubits together through the four basis states.',
    whatIsQubitBody: 'A qubit is often described as "0 and 1 at the same time," but that\'s shorthand for something more precise: its state is a <span class="key-term">superposition</span> — a weighted combination — of the two basis outcomes |0⟩ and |1⟩, set by two <span class="key-term">complex amplitudes</span> α and β. Squaring the size of each amplitude gives the probability of that outcome when measured — but before measurement, the qubit genuinely hasn\'t picked one. A classical bit has exactly two states. A qubit has infinitely many: every point on the surface of the Bloch sphere below is a valid state, not just its two poles.',
    blochEarthTitle: 'The Bloch Sphere — Think of Planet Earth',
    blochEarthBody: 'The sphere your qubit lives on works like a globe. The <span class="key-term">north pole</span> is |0⟩ and the <span class="key-term">south pole</span> is |1⟩ — θ (theta) is "latitude," how far the qubit has tilted from the |0⟩ pole toward |1⟩. Sitting right on the <span class="key-term">equator</span> (θ = 90°) means an equal 50/50 <span class="key-term">superposition</span> of both. φ (phi) is "longitude" — it never changes the measurement odds, only the relative <span class="key-term">phase</span> between the two amplitudes, which is invisible to a single measurement but is exactly what drives interference elsewhere in this app.',
    qubitCBadge: 'Qubit C',
    qubitA3Desc: 'Independent — not entangled with B or C',
    qubitB3Desc: 'Independent — not entangled with A or C',
    qubitC3Desc: 'Independent — not entangled with A or B',
    jointState3: 'Joint State — |ψ_A⟩ ⊗ |ψ_B⟩ ⊗ |ψ_C⟩',
    threeQubitExplainer: 'Three qubits, each dragged independently — the joint state above is just the product of all three individual odds, P(abc) = P(a) × P(b) × P(c). Still nothing correlated here; scale this same idea up with a CNOT and you get the GHZ states in the Circuit tab\'s 3-qubit builder.',
    threeQubitTryMeIdle: 'Click Try me to move all three qubits together through the four basis states.'
  },
  maths: {
    title: 'Maths Concept',
    subtitle: 'The mathematical language behind qubits — complex numbers, vectors, matrices, state vectors, Dirac notation, and tensor products.',
    complexBody1: 'A qubit\'s amplitudes aren\'t plain real numbers — they\'re complex numbers, each with a real part and an imaginary part. That extra dimension is what makes phase (and interference) possible.',
    complexFormula1: 'z = a + bi,&nbsp;&nbsp; i² = −1',
    complexFormula2: 'Modulus: |z| = √(a² + b²)',
    complexFormula3: 'Polar form: z = r·e<sup>iθ</sup> = r(cos θ + i sin θ)',
    complexBody2: 'A qubit state α|0⟩ + β|1⟩ has complex amplitudes α, β. Only their squared moduli |α|², |β|² are directly observable (as measurement probabilities) — the relative phase between them is invisible to a single measurement but drives interference.',
    vectorsBody1: 'A qubit\'s state is a vector in a 2-dimensional complex vector space, written as a column of its two amplitudes.',
    vectorsFormula1: '|0⟩ = [1, 0]<sup>T</sup>&nbsp;&nbsp;&nbsp; |1⟩ = [0, 1]<sup>T</sup>',
    vectorsFormula2: '|ψ⟩ = α|0⟩ + β|1⟩ = [α, β]<sup>T</sup>',
    vectorsFormula3: 'Normalization: |α|² + |β|² = 1',
    vectorsFormula4: 'Inner product: ⟨φ|ψ⟩ = φ<sub>0</sub>*ψ<sub>0</sub> + φ<sub>1</sub>*ψ<sub>1</sub>',
    vectorsBody2: 'Normalization keeps total probability at 100% — it\'s why every point you can drag to on the Bloch sphere is automatically a valid state. The inner product measures how much two states overlap; orthogonal states (like |0⟩ and |1⟩) have inner product 0.',
    matricesBody1: 'Every quantum gate is a matrix. Applying a gate to a qubit is just matrix-vector multiplication — the gate matrix times the state vector gives the new state vector.',
    matricesFormula1: 'Pauli-X = [[0, 1], [1, 0]]',
    matricesFormula2: 'X|0⟩ = [[0,1],[1,0]]·[1,0]<sup>T</sup> = [0,1]<sup>T</sup> = |1⟩',
    matricesFormula3: 'Unitary condition: U†U = I',
    matricesBody2: '"Unitary" is the constraint every quantum gate must satisfy — U† (the conjugate transpose) undoes U exactly. It\'s what guarantees a gate never destroys or creates probability: the output state is always normalized whenever the input was.',
    svBody1: 'The state vector |ψ⟩ is the complete description of a qubit — everything you can ever predict about it (measurement odds, how it responds to a gate) is computed from these two amplitudes.',
    svFormula1: '|ψ⟩ = α|0⟩ + β|1⟩',
    svFormula2: 'Bloch form: |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup>sin(θ/2)|1⟩',
    svFormula3: 'P(0) = |α|²&nbsp;&nbsp;&nbsp; P(1) = |β|²',
    svBody2: 'θ and φ are exactly the two sliders on the Bits & Qubits Bloch sphere — every state vector corresponds to one point on that sphere, and vice versa.',
    compareStateSpaces: 'Compare the State Spaces',
    compareStateSpacesBody: 'A classical bit is a point on a line; a qubit is a vector tip on a unit arc — pick a view below.',
    svClassicalDesc: 'Two discrete endpoints only',
    toggleBit: 'Toggle bit',
    currentState: 'Current State',
    stateSpace: 'State Space',
    stateSpaceBody: 'Only the two endpoints |0⟩ and |1⟩ are valid. The region between is physically forbidden — there is no "47% |1⟩" for a classical bit.',
    svQuantumDesc: 'Any point on the unit arc',
    keyInsight: 'Key Insight',
    keyInsightBody: 'The tip of the state vector must sit on the unit arc (α² + β² = 1). Every point on that arc is a distinct, valid quantum state. The classical bit only ever occupies the two corners.',
    diracBody1: 'The |·⟩ and ⟨·| symbols used everywhere in this app are Dirac\'s "bra-ket" notation — a compact shorthand for vectors and their inner products.',
    diracFormula1: 'Ket: |ψ⟩ — a column vector (a state)',
    diracFormula2: 'Bra: ⟨ψ| — the conjugate-transpose row vector',
    diracFormula3: 'Bra-ket: ⟨φ|ψ⟩ — an inner product (a number)',
    diracFormula4: '⟨0|0⟩ = 1&nbsp;&nbsp;&nbsp; ⟨0|1⟩ = 0&nbsp;&nbsp;&nbsp; ⟨1|1⟩ = 1',
    diracFormula5: 'Ket-bra: |ψ⟩⟨φ| — an outer product (a matrix/operator)',
    diracBody2: '|0⟩ and |1⟩ are orthonormal — each has unit length and zero overlap with the other — which is exactly why measuring always returns a clean 0 or 1, never something in between.',
    tensorBody1: 'The tensor product (⊗) is how two independent vector spaces combine into one larger joint space — stack every entry of the first vector against every entry of the second, multiplying each pair. An n-dimensional vector combined with an m-dimensional one produces an n×m-dimensional vector.',
    tensorFormula1: '[a, b]<sup>T</sup> ⊗ [c, d]<sup>T</sup> = [ac, ad, bc, bd]<sup>T</sup>',
    tensorBody2: 'Two independent qubits combine exactly this way: each is a 2-entry vector, so their joint state is a 4-entry vector — one entry for each combination of basis states, |00⟩, |01⟩, |10⟩, |11⟩.',
    tensorFormula2: '|0⟩⊗|0⟩ = [1,0]<sup>T</sup>⊗[1,0]<sup>T</sup> = [1,0,0,0]<sup>T</sup> = |00⟩',
    tensorBody3: 'Every state built by tensoring two single-qubit states can always be factored back apart into those same two qubits. Not every 4-entry vector can be factored that way, though — a joint state that can\'t be split back into a tensor product of two single-qubit states is exactly what\'s called entangled, explored hands-on on the Entangle tab.'
  },
  gates: {
    title: 'Gates',
    subtitle: 'Pick one gate and see its immediate effect — classical or quantum',
    classicalGates: 'Classical Gates',
    quantumGates: 'Quantum Gates',
    compareGates: 'Compare',
    quantumTruthTableNote: 'Each fixed gate\'s action on the two basis states — rotation gates (Rx/Ry/Rz) aren\'t included since their output depends on a runtime angle, not a fixed table.',
    compareClassicalDesc: 'NOT/AND/OR/XOR and their negations — strict, destructive rules',
    compareQuantumDesc: 'H/X/Y/Z/S/T — always reversible, can create superposition',
    compareInsightTitle: 'The Key Difference',
    compareInsightBody: 'Every classical row above collapses information — AND, OR, and friends all map multiple input combinations onto the same output, so there\'s no way back to the input from the output alone. Every quantum row is reversible: each is a unitary matrix, so running its own conjugate transpose afterward always recovers the exact input. Classical gates can also only ever output a definite 0 or 1; quantum gates like H can output a genuine superposition of both.',
    pickGate: 'Gate — click to choose',
    inputA: 'Input A',
    inputB: 'Input B',
    resetToZero: 'Reset to |0⟩',
    applyGate: 'Apply Gate',
    gateReference: 'Gate Reference',
    rotationGates: 'Rotation Gates',
    gateMatrix: 'Gate Matrix',
    selectAGate: '← select a gate',
    whyReversibleTitle: 'Why Every Gate Is Reversible',
    whyReversibleBody: 'Every gate on the left is a unitary matrix (U†U = I) — not by convention, but because a gate is really just the qubit\'s own Schrödinger-equation time evolution, which always preserves total probability. One direct consequence: quantum gates never destroy information. Apply any gate, then its conjugate transpose, and the qubit lands back exactly where it started — there\'s no quantum equivalent of a classical AND gate quietly throwing a bit away.',
    // Nicknames/formal names for the six fixed gates (js/core/gates.js's
    // GATES) — `name` (the bare letter H/X/Y/Z/S/T) is notation, never
    // translated. `explain`'s full paragraph is dynamic-narration text
    // (built into an interpolated sentence at the moment a gate is
    // applied, see gates-tab.js's applyGate()) and is out of scope, same
    // as the rest of that category app-wide.
    H: { desc: 'The Coin Spinner', formalName: 'Hadamard gate' },
    X: { desc: 'The Light Switch', formalName: 'Pauli-X gate' },
    Y: { desc: 'The Cartwheel', formalName: 'Pauli-Y gate' },
    Z: { desc: 'The Ghost Move', formalName: 'Pauli-Z gate' },
    S: { desc: 'The Quarter Turn', formalName: 'Phase gate (√Z)' },
    T: { desc: 'The Whisper Nudge', formalName: 'T gate (√S)' }
  },
  // Rx/Ry/Rz (js/core/gates.js's ROTATION_GATES) — separate from `gates`
  // above since both use plain axis keys (X/Y/Z) that would otherwise
  // collide with the fixed Pauli-X/Y/Z gates' own entries there.
  rotationGates: {
    X: { desc: 'Rotate around the X axis', formalName: 'X-axis rotation' },
    Y: { desc: 'Rotate around the Y axis', formalName: 'Y-axis rotation' },
    Z: { desc: 'Rotate around the Z axis', formalName: 'Z-axis rotation' }
  },
  circuits: {
    title: 'Circuits',
    subtitle: 'Classical gates combine bits with strict rules; quantum circuits walk a qubit through a route of gates, picking up rotations — pick a builder below',
    classicalCircuit: 'Classical Circuit',
    quantumCircuit: 'Quantum Circuit',
    gatePalette: 'Gate Palette — click to add',
    companionBit: 'Companion bit — used by AND/OR/XOR-family gates when added',
    startBit: 'Start Bit',
    circuitWire: 'Circuit Wire',
    whatsGoingOn: 'What\'s going on',
    afterRunning: 'After running',
    truthTableStartOutput: 'Truth Table — start bit → output',
    oneQubit: '1 Qubit',
    twoQubits: '2 Qubits',
    threeQubits: '3 Qubits',
    outputState: 'Output State',
    targetQubit2: 'Target Qubit — new gates apply to',
    gatePaletteTarget: 'Gate Palette — click to add to target qubit',
    circuitDiagram: 'Circuit Diagram',
    outputState2Q: 'Output State (2 Qubits)',
    perQubitBlochSpheres: 'Per-Qubit Bloch Spheres — shrink toward center when entangled',
    targetQubit3: 'Target Qubit — new single-qubit gates apply to',
    addCnot: 'Add CNOT',
    outputState3Q: 'Output State (3 Qubits)',
    runHistory: 'Run History — click a step to revisit it'
  },
  common: {
    run: '▶ Run',
    clear: 'Clear',
    add: 'Add',
    reset: 'Reset',
    controls: 'Controls',
    detector: 'Detector',
    tryMe: 'Try me',
    tryMePresets: '🎲 Try me — preset circuits',
    classical: 'Classical',
    quantum: 'Quantum',
    stateVector: 'State Vector',
    copyShareableLink: 'Copy shareable link',
    basisStates: 'Basis States',
    possibleStates: 'Possible states',
    uncertainty: 'Uncertainty',
    uncertaintyFundamental: 'Fundamental — until measured',
    representation: 'Representation',
    output: 'Output',
    whatJustHappened: 'What just happened',
    truthTable: 'Truth Table',
    appliedSequence: 'Applied Sequence',
    gate: 'Gate',
    input: 'Input'
  },
  mathsTab: {
    complexNumbers: 'Complex Numbers',
    vectors: 'Vectors',
    matrices: 'Matrices',
    stateVector: 'State Vector',
    diracNotation: 'Dirac Notation',
    tensorProducts: 'Tensor Products'
  },
  gatesTab: {
    classical: 'Classical',
    quantum: 'Quantum',
    compare: 'Compare'
  },
  roadmap: {
    title: 'Quantum Concepts',
    subtitle: 'Click any concept to open its simulation',
    conceptMap: 'Concept Map',
    myProgress: 'My Progress',
    lessonsCompleted: 'Lessons Completed',
    quickCheckScore: 'Quick Check Score',
    lessonChecklist: 'Lesson Checklist',
    resetProgress: 'Reset progress',
    read: 'read',
    markUnread: 'Mark unread',
    markAsRead: 'Mark as read',
    start: 'Start →',
    quickCheck: 'Quick check',
    correct: 'correct',
    review: 'review',
    notAttempted: 'Not attempted yet.',
    quizScoreSummary: '{correct} / {answered} quick checks correct so far ({total} concepts total).',
    centerTooltip: '{count} core quantum computing concepts, from a single qubit to entanglement and wave interference — click any topic to explore it.'
  },
  mindmap: {
    quantumWorld: 'Quantum World',
    introduction: 'Introduction',
    classical: 'Classical',
    quantum: 'Quantum',
    oneQubit: 'One Qubit',
    twoQubits: 'Two Qubits',
    threeQubits: 'Three Qubits'
  },
  intro: {
    title: 'Introduction',
    subtitle: 'New to quantum computing? Start here — no physics or programming background needed.',
    classicalTitle: 'INTRODUCTION TO QUANTUM COMPUTING?',
    classicalBody: 'Before learning about quantum computers, let\'s start with classical computers. Your phone and computer use bits to process information. A bit has only two possible states: <b>0 (OFF) and 1 (ON)</b>',
    whatIsTitle: 'WHAT IS QUANTUM COMPUTING?',
    whatIsBody: 'Quantum computing uses the principles of quantum mechanics to solve certain problems faster than classical computers.',
    bitsToQubitsTitle: 'From Bits to Qubits',
    bitsToQubitsBody: 'Unlike a bit, which is either 0 or 1, a qubit can exist in both states at the same time. This is called superposition.',
    superpositionTitle: 'Superposition: Multiple Possibilities',
    superpositionBody: 'Imagine flipping a coin. While it\'s spinning, it represents both heads and tails. Similarly, a qubit can represent both 0 and 1 until it is measured.',
    entanglementTitle: 'Entanglement: Connected Quantum Information',
    entanglementBody: 'Entanglement links two or more qubits together. Changes to one qubit are correlated with the others, allowing quantum computers to process information in powerful new ways.',
    whyMattersTitle: 'Why Quantum Computing Matters',
    whyMattersBody: 'Quantum computers are not designed to replace laptops or smartphones. They are built to solve complex problems, such as: <ul class="quantum-list"><li>🧪 Simulating molecules</li><li>⚙️ Optimizing large systems</li><li>🔐 Improving cryptography</li><li>🌦️ Solving complex scientific and engineering problems</li></ul>',
    howAppWorksTitle: 'How this app works',
    howAppWorksBody: 'Each tab combines a short lesson with an interactive simulation and a quick check. Explore concepts by moving Bloch spheres, applying gates, and running circuits while seeing results update in real time. Your progress is tracked as you learn.',
    suggestedPath: 'Suggested learning path'
  },
  // Static glossary page (tab-important-concepts in index.html) — no
  // simulation, no ROADMAP_LESSONS entry. mechanicsGroupTitle/computingGroupTitle
  // head the two .intro-glossary-grid sections; every other key is a
  // <Term>Title/<Term>Body pair for one glossary card.
  concepts: {
    title: 'Important Concepts',
    subtitle: 'A glossary of the essential ideas behind quantum mechanics and quantum computing — the vocabulary the rest of this app builds on.',
    searchPlaceholder: 'Search concepts…',
    searchNoResults: 'No concepts match "{query}".',
    mechanicsGroupTitle: 'Quantum Mechanics Fundamentals',
    computingGroupTitle: 'Quantum Computing Concepts',
    superpositionTitle: 'Superposition',
    superpositionBody: 'A quantum system can exist in a combination of multiple states at once, rather than being locked into just one — like a qubit being part |0⟩ and part |1⟩ simultaneously. It\'s not that the system is secretly in one state and we just don\'t know which; the combination is the actual physical state, until a measurement forces it to commit to an outcome.',
    waveParticleTitle: 'Wave-Particle Duality',
    waveParticleBody: 'Every quantum object — electrons, photons, even qubits — behaves like a wave in some experiments (spreading out, interfering with itself) and like a discrete particle in others (arriving at a detector as one localized click). Which behavior shows up depends on what you measure, not on the object switching identities.',
    quantumStateTitle: 'Quantum State (Wavefunction)',
    quantumStateBody: 'The complete mathematical description of a quantum system — everything that can ever be predicted about it, encoded in a set of complex amplitudes. For a qubit, that\'s the two-amplitude state vector |ψ⟩ = α|0⟩ + β|1⟩ explored throughout this app\'s Bits & Qubits and Maths Concept tabs.',
    bornRuleTitle: 'The Born Rule',
    bornRuleBody: 'The rule connecting a quantum state\'s amplitudes to measurement probabilities: squaring the size of an amplitude gives the chance of observing that outcome. For a qubit α|0⟩ + β|1⟩, that\'s P(0) = |α|² and P(1) = |β|² — see the Measure tab for this in action.',
    collapseTitle: 'Wavefunction Collapse',
    collapseBody: 'The moment a measurement happens, a quantum state stops being a mix of possibilities and becomes one definite outcome — irreversibly. The other possibilities aren\'t hidden somewhere; they\'re simply gone, which is what makes quantum measurement fundamentally different from just checking a value that was already fixed.',
    uncertaintyTitle: 'Heisenberg Uncertainty Principle',
    uncertaintyBody: 'Certain pairs of properties — like a particle\'s position and momentum — can never both be known to arbitrary precision at the same time. This isn\'t a limitation of our instruments; it\'s a built-in feature of how quantum states are described.',
    entanglementTitle: 'Quantum Entanglement',
    entanglementBody: 'Quantum entanglement is a phenomenon in which two or more quantum particles become linked so that the state of one particle cannot be described independently of the others, even when they are separated by large distances. Instead, they share a single joint quantum state.'
      + '<br><br>Measuring one of the entangled particles instantly reveals what the others will show, no matter how far apart they are — yet no signal or energy actually travels between them at the moment of measurement. This can look like faster-than-light communication, but it isn\'t: each individual measurement outcome is still genuinely random, so there\'s no way to encode a message using entanglement alone. Explored in depth on the Entangle tab.',
    interferenceTitle: 'Quantum Interference',
    interferenceBody: 'When a quantum system has more than one indistinguishable path to the same outcome, the paths\' amplitudes combine — reinforcing each other in some places and canceling out in others — producing patterns (like the stripes in the double-slit experiment) that neither path could produce alone. See the Interference and Beam Splitter tabs.',
    tunnelingTitle: 'Quantum Tunneling',
    tunnelingBody: 'A quantum particle has a nonzero chance of appearing on the far side of an energy barrier it classically shouldn\'t be able to cross, because its wavefunction doesn\'t stop dead at the barrier — it decays through it instead of bouncing off. See the Tunnel tab for an interactive wave packet hitting a barrier.',
    decoherenceTitle: 'Decoherence',
    decoherenceBody: 'The process by which a quantum system\'s fragile superposition and entanglement leak away through unavoidable interaction with its surrounding environment, making it behave more and more like a classical system. It\'s the main practical obstacle to building large, reliable quantum computers.',
    schrodingerTitle: 'The Schrödinger Equation',
    schrodingerBody: 'The master equation of quantum mechanics — it describes exactly how a quantum state evolves smoothly over time, the same way Newton\'s laws describe how a classical object moves. Every quantum gate in this app is really just a snapshot of this equation\'s evolution over a fixed slice of time, which is also why gates are reversible: the equation never destroys information, only reshapes it.',
    bellTheoremTitle: 'Bell\'s Theorem & the EPR Paradox',
    bellTheoremBody: 'Einstein, Podolsky, and Rosen argued in 1935 that quantum mechanics must be incomplete — entangled particles\' correlations, they reasoned, could be explained by some shared "hidden variable" fixed in advance, without any real spookiness. Bell\'s theorem (1964) proved this wrong: no theory based on hidden variables can ever reproduce every correlation quantum mechanics predicts, and decades of experiments have confirmed quantum mechanics\' predictions, not the hidden-variable ones.',
    zenoTitle: 'Quantum Zeno Effect',
    zenoBody: 'Measuring a quantum system frequently enough can effectively freeze its evolution — each measurement collapses the state back toward what it already was, before it has a chance to evolve away. Named after Zeno\'s paradox of the arrow that never seems to move, it\'s a direct consequence of wavefunction collapse: a "watched" quantum state changes far more slowly than an unwatched one.',
    hilbertSpaceTitle: 'Hilbert Space',
    hilbertSpaceBody: 'The mathematical "space" where every quantum state lives. Each possible quantum state is represented as a vector in a Hilbert space, and the rules of quantum mechanics — superposition, measurement, and evolution — are all expressed as operations on these vectors. A single qubit lives in a two-dimensional Hilbert space, while an n-qubit system lives in a 2ⁿ-dimensional one.',
    linearOperatorsTitle: 'Linear Operators',
    linearOperatorsBody: 'Physical quantities and quantum gates are represented by linear operators acting on quantum states. Applying an operator transforms one valid quantum state into another, making linear algebra the language of quantum mechanics.',
    observableTitle: 'Observable',
    observableBody: 'An observable is any measurable physical property — such as position, momentum, spin, or energy. Every observable is represented by a Hermitian operator whose eigenvalues are the only measurement outcomes that can ever occur.',
    eigenstatesTitle: 'Eigenstates & Eigenvalues',
    eigenstatesBody: 'If measuring an observable always produces the same result for a particular quantum state, that state is an eigenstate of the observable. The measurement result is the corresponding eigenvalue. Measuring an eigenstate leaves it unchanged, whereas measuring a superposition generally causes wavefunction collapse.',
    expectationValueTitle: 'Expectation Value',
    expectationValueBody: 'Rather than predicting one definite measurement result, quantum mechanics predicts the average value obtained after repeating the same experiment many times on identically prepared systems. This average is called the expectation value.',
    probabilityAmplitudesTitle: 'Probability Amplitudes',
    probabilityAmplitudesBody: 'Unlike ordinary probabilities, quantum mechanics assigns complex probability amplitudes to possible outcomes. These amplitudes can interfere constructively or destructively, and only their squared magnitudes become observable probabilities through the Born Rule.',
    phaseTitle: 'Phase',
    phaseBody: 'A quantum state\'s phase is invisible in a single measurement but determines how amplitudes interfere. Relative phase — not absolute phase — is what gives quantum interference and many quantum algorithms their power.',
    globalPhaseTitle: 'Global Phase vs Relative Phase',
    globalPhaseBody: 'Multiplying an entire quantum state by the same complex phase changes nothing physically; this is called a global phase. Changing the phase between components of a superposition changes observable interference patterns and therefore has physical consequences.',
    spinTitle: 'Spin',
    spinBody: 'Spin is an intrinsic form of angular momentum carried by quantum particles. Unlike ordinary rotation, spin is a fundamental quantum property that comes only in discrete values. Electron spin is the physical realization of many experimental qubits.',
    pauliExclusionTitle: 'Pauli Exclusion Principle',
    pauliExclusionBody: 'No two identical fermions can occupy the same quantum state simultaneously. This simple rule explains the structure of atoms, chemistry, and why matter remains stable.',
    identicalParticlesTitle: 'Identical Particles',
    identicalParticlesBody: 'Particles of the same type are fundamentally indistinguishable. Swapping two identical particles does not create a new physical state — it only changes the wavefunction by a sign (fermions) or not at all (bosons).',
    bosonsFermionsTitle: 'Bosons & Fermions',
    bosonsFermionsBody: 'Bosons can share the same quantum state, allowing phenomena like lasers and Bose–Einstein condensates. Fermions obey the Pauli exclusion principle, giving rise to atomic structure and electronic materials.',
    densityMatrixTitle: 'Density Matrix',
    densityMatrixBody: 'Not every quantum system is perfectly isolated. A density matrix describes both pure quantum states and statistical mixtures, making it the standard tool for describing noisy or partially known quantum systems.',
    mixedStatesTitle: 'Mixed States',
    mixedStatesBody: 'Unlike a superposition, which is genuinely quantum, a mixed state represents classical uncertainty about which quantum state a system is actually in. Density matrices distinguish between these two very different situations.',
    measurementBasisTitle: 'Measurement Basis',
    measurementBasisBody: 'A quantum measurement is always made relative to a chosen basis. The same state may look definite in one basis but exist as a superposition in another, making basis choice central to quantum computing.',
    sternGerlachExpTitle: 'Stern–Gerlach Experiment',
    sternGerlachExpBody: 'The Stern–Gerlach experiment (1922), performed by Otto Stern and Walther Gerlach, demonstrated that angular momentum is quantized — showing that particles such as electrons possess an intrinsic property called spin that can only take discrete values when measured along a chosen axis. It\'s one of the foundational experiments of quantum mechanics.'
      + '<ul class="quantum-list">'
      + '<li><b>Objective:</b> to determine whether an atom\'s magnetic moment could point in any direction, as classical physics predicted, or only in specific, quantized orientations.</li>'
      + '<li><b>Why silver atoms?</b> Silver has a single unpaired outer electron and effectively zero net orbital angular momentum, so the measured magnetic moment comes almost entirely from that one electron\'s spin — making the result far easier to interpret.</li>'
      + '<li><b>Classical prediction:</b> a randomly-oriented magnetic moment should deflect by any amount, smearing the beam into a continuous band on the screen.</li>'
      + '<li><b>What was actually observed:</b> the beam split into exactly two distinct spots, not a continuous band — showing only two spin orientations are possible along the measurement axis, spin up (+ħ/2) and spin down (−ħ/2).</li>'
      + '</ul>'
      + 'Explore this yourself, including what happens when you measure spin along a second, incompatible axis, on the Stern–Gerlach tab.',
    eprParadoxTitle: 'EPR Paradox',
    eprParadoxBody: 'The EPR paradox (1935), proposed by Albert Einstein, Boris Podolsky, and Nathan Rosen, is a thought experiment arguing that quantum mechanics, as it stood, must be an incomplete description of physical reality — not because its predictions were wrong, but because of what those predictions seemed to imply.'
      + '<ul class="quantum-list">'
      + '<li><b>Objective:</b> to show that if quantum mechanics is correct and "local realism" holds — that a particle has definite properties independent of measurement, and no influence travels faster than light — then quantum mechanics must be missing something.</li>'
      + '<li><b>The setup:</b> two particles are prepared in an entangled state and separated by an arbitrarily large distance. Measuring a property of one instantly tells you the corresponding property of the other, with certainty.</li>'
      + '<li><b>The argument:</b> since measuring particle A lets you predict particle B\'s outcome with certainty without ever touching B, EPR reasoned that property of B must already have been fixed before the measurement — otherwise measuring A would have to instantly affect B, which looked like "spooky action at a distance."</li>'
      + '<li><b>The paradox:</b> quantum mechanics says the two particles share one undetermined joint state right up until measurement. EPR\'s own reasoning said that\'s impossible if locality holds — so either quantum mechanics is incomplete, or nature really is nonlocal in this specific sense.</li>'
      + '</ul>'
      + 'For thirty years this stayed a question of interpretation with no experimental answer — until Bell\'s Theorem (see above) turned it into a testable one, and the experiments came down decisively against Einstein\'s hidden-variable intuition.',
    qubitTitle: 'Qubit',
    qubitBody: 'The basic unit of quantum information — like a classical bit, but able to exist in a superposition of 0 and 1 rather than being locked to one value. A qubit\'s exact state is described by two complex amplitudes and visualized as a point on the Bloch sphere, explored on the Bits & Qubits tab.',
    blochSphereTitle: 'Bloch Sphere',
    blochSphereBody: 'A geometric picture of every possible single-qubit state as a point on the surface of a sphere — the north and south poles are |0⟩ and |1⟩, and every other point is some superposition of the two. It turns the abstract algebra of amplitudes into something you can literally see and drag around.',
    gateTitle: 'Quantum Gate',
    gateBody: 'The quantum equivalent of a classical logic gate — an operation that transforms a qubit\'s state, geometrically a rotation of its point on the Bloch sphere. Unlike classical gates, every quantum gate is reversible: none of them ever throw information away. See the Gates tab for the six fixed gates (H, X, Y, Z, S, T) and their effects.',
    unitarityTitle: 'Unitarity & Reversibility',
    unitarityBody: 'Every valid quantum gate must be a unitary matrix (U†U = I) — the mathematical condition that guarantees it preserves total probability and can always be undone by its own conjugate transpose. This is why quantum computation, unlike classical AND/OR logic, never destroys information along the way.',
    circuitTitle: 'Quantum Circuit',
    circuitBody: 'A sequence of quantum gates applied to one or more qubits, read left to right — the quantum equivalent of a classical logic circuit. Because gate order generally matters (rotations don\'t commute), the same set of gates in a different sequence can land the qubits in an entirely different final state; build one yourself on the Circuits tab.',
    bellGhzTitle: 'Bell States & GHZ States',
    bellGhzBody: 'Bell states are the four specific, maximally entangled two-qubit states — Φ⁺, Φ⁻, Ψ⁺, and Ψ⁻ — forming a foundational orthonormal basis in quantum information and the core resource behind protocols like quantum teleportation and superdense coding. All four are produced by the same two-gate recipe (a Hadamard on one qubit, then a CNOT controlled by it), just starting from a different one of the four two-qubit basis states.'
      + '<br><br>The four Bell states are:'
      + '<ul class="quantum-list">'
      + '<li><b>Φ⁺ = (|00⟩ + |11⟩)/√2</b> — qubits match and stay in phase.</li>'
      + '<li><b>Φ⁻ = (|00⟩ − |11⟩)/√2</b> — qubits match, with a phase flip.</li>'
      + '<li><b>Ψ⁺ = (|01⟩ + |10⟩)/√2</b> — qubits are opposite and in phase.</li>'
      + '<li><b>Ψ⁻ = (|01⟩ − |10⟩)/√2</b> — qubits are opposite, with a phase flip.</li>'
      + '</ul>'
      + 'Measuring one qubit in any of the four instantly determines the other\'s outcome. GHZ states generalize the same idea to three or more qubits, all correlated together — build Bell pairs and GHZ triples from scratch with Hadamard and CNOT gates on the Circuits tab.',
    noCloningTitle: 'No-Cloning Theorem',
    noCloningBody: 'It\'s physically impossible to create an exact, independent copy of an arbitrary unknown quantum state — a direct consequence of quantum mechanics being linear. This is why quantum information has to be handled so differently from classical bits, which can always be freely copied.',
    algorithmsTitle: 'Quantum Algorithms',
    algorithmsBody: 'Step-by-step procedures built from quantum gates that exploit superposition and interference to solve certain problems dramatically faster than any known classical algorithm — Shor\'s algorithm factors large numbers efficiently, and Grover\'s algorithm searches an unsorted list quadratically faster than any classical search.',
    errorCorrectionTitle: 'Quantum Error Correction',
    errorCorrectionBody: 'A set of techniques for protecting fragile quantum information from decoherence and noise by spreading a single logical qubit\'s state redundantly across many physical qubits, without ever directly measuring — and so collapsing — the information itself. One of the central engineering challenges standing between today\'s noisy quantum computers and large-scale, reliable ones.',
    supremacyTitle: 'Quantum Supremacy / Advantage',
    supremacyBody: 'The milestone at which a quantum computer performs a specific task faster than any classical supercomputer could feasibly manage — "supremacy" for a (possibly contrived) benchmark task, "advantage" for a practically useful one. It demonstrates that quantum effects can be harnessed for real computational power, not just simulated on a classical machine.',
    teleportationTitle: 'Quantum Teleportation',
    teleportationBody: 'A protocol for transferring an unknown qubit\'s exact state to a distant qubit, using a shared entangled pair plus two classical bits of communication — without ever measuring (and so destroying) the original state directly. Despite the name, nothing travels faster than light: the receiver can\'t reconstruct the state until the ordinary classical bits arrive, and the original qubit\'s state is unavoidably destroyed in the process, consistent with the No-Cloning Theorem.',
    qkdTitle: 'Quantum Cryptography (QKD)',
    qkdBody: 'Quantum key distribution lets two parties agree on a shared secret key with security guaranteed by physics rather than computational difficulty — protocols like BB84 encode key bits in qubit states such that any eavesdropper\'s measurement unavoidably disturbs them, exposing the intrusion. It\'s a direct practical payoff of the No-Cloning Theorem: an eavesdropper can\'t secretly copy the qubits to inspect them undetected.',
    qftTitle: 'Quantum Fourier Transform (QFT)',
    qftBody: 'The quantum analog of the classical discrete Fourier transform, implemented as a quantum circuit that runs exponentially faster than any classical equivalent. It\'s the key subroutine inside Shor\'s algorithm — the step that extracts the hidden periodicity used to factor large numbers — and appears throughout quantum algorithms wherever a hidden pattern needs to be read out of a superposition.',
    tensorProductTitle: 'Tensor Product',
    tensorProductBody: 'Multiple qubits combine through the tensor product rather than ordinary addition. Two qubits therefore require four amplitudes, three qubits require eight, and n qubits require 2ⁿ, which is the origin of quantum computing\'s enormous state space.',
    multiQubitStatesTitle: 'Multi-Qubit States',
    multiQubitStatesBody: 'A system of several qubits cannot always be described as independent single-qubit states. Some states factor into separate qubits, while others become entangled and require one combined description.',
    controlledGatesTitle: 'Controlled Gates',
    controlledGatesBody: 'Controlled gates perform an operation only when another qubit has a particular value. The CNOT gate is the simplest example and is the essential building block for creating entanglement.',
    swapGateTitle: 'SWAP Gate',
    swapGateBody: 'The SWAP gate exchanges the quantum states of two qubits without measuring them. It is widely used to move information around a quantum processor.',
    universalGateSetsTitle: 'Universal Gate Sets',
    universalGateSetsBody: 'A small collection of gates is sufficient to approximate any quantum computation to arbitrary accuracy. Examples include {H, T, CNOT} and {Rx, Ry, CNOT}.',
    quantumParallelismTitle: 'Quantum Parallelism',
    quantumParallelismBody: 'Because a quantum computer can prepare a superposition of many inputs simultaneously, one operation acts on all of them at once. The challenge is extracting useful information through interference rather than trying to read every result.',
    oracleTitle: 'Oracle',
    oracleBody: 'Many quantum algorithms treat part of a problem as a black-box function called an oracle. The algorithm gains speed by querying the oracle in quantum superposition.',
    ancillaQubitsTitle: 'Ancilla Qubits',
    ancillaQubitsBody: 'Ancilla qubits are temporary helper qubits used during computations, error correction, and arithmetic before being reset or discarded.',
    quantumMeasurementTitle: 'Quantum Measurement',
    quantumMeasurementBody: 'Although measurement appears earlier, quantum computing treats it operationally. Measuring a qubit converts fragile quantum information into an ordinary classical bit, ending coherent evolution.',
    midCircuitMeasurementTitle: 'Mid-Circuit Measurement',
    midCircuitMeasurementBody: 'Some quantum computers allow measurements during computation rather than only at the end. Later gates can depend on these measurement outcomes, enabling error correction and adaptive algorithms.',
    classicalFeedforwardTitle: 'Classical Feedforward',
    classicalFeedforwardBody: 'Measurement results obtained during a quantum circuit can determine which later gates should be applied, combining classical control with quantum evolution.',
    quantumInfoGroupTitle: 'Quantum Information Theory',
    quantumInformationTitle: 'Quantum Information',
    quantumInformationBody: 'Quantum information is information stored in quantum states. Unlike classical information, it can exploit superposition and entanglement, enabling entirely new forms of computation and communication.',
    quantumChannelTitle: 'Quantum Channel',
    quantumChannelBody: 'A quantum channel mathematically describes how quantum information changes while traveling through space or interacting with noise.',
    fidelityTitle: 'Fidelity',
    fidelityBody: 'Fidelity measures how similar two quantum states are. It is widely used to benchmark quantum hardware, gates, and error correction.',
    traceDistanceTitle: 'Trace Distance',
    traceDistanceBody: 'Trace distance quantifies how distinguishable two quantum states are. It gives the maximum probability of telling them apart using any possible measurement.',
    entanglementEntropyTitle: 'Entanglement Entropy',
    entanglementEntropyBody: 'A numerical measure of how strongly different parts of a quantum system are entangled. It plays a central role in condensed matter physics, quantum field theory, and quantum gravity.',
    stateTomographyTitle: 'Quantum State Tomography',
    stateTomographyBody: 'A technique for reconstructing an unknown quantum state by making many measurements in different bases.',
    processTomographyTitle: 'Process Tomography',
    processTomographyBody: 'Rather than reconstructing a state, process tomography reconstructs an unknown quantum gate or operation by studying how it transforms many known input states.',
    advancedGroupTitle: 'Advanced Quantum Computing',
    vqeQaoaTitle: 'Variational Quantum Algorithms (VQE & QAOA)',
    vqeQaoaBody: 'Variational quantum algorithms are hybrid quantum–classical algorithms in which a quantum computer prepares parameterized quantum states while a classical computer repeatedly adjusts those parameters to optimize a desired objective. This iterative feedback loop makes them well suited to today\'s noisy quantum hardware (NISQ devices).'
      + '<br><br>The two best-known examples are:'
      + '<ul class="quantum-list">'
      + '<li><b>Variational Quantum Eigensolver (VQE):</b> Designed to estimate the lowest-energy (ground) state of a quantum system. It is widely used in quantum chemistry, materials science, and Hamiltonian simulation to study molecules and quantum materials.</li>'
      + '<li><b>Quantum Approximate Optimization Algorithm (QAOA):</b> Designed to find high-quality approximate solutions to difficult combinatorial optimization problems, such as routing, scheduling, graph partitioning, and portfolio optimization, by alternating between problem-specific and mixing quantum operations.</li>'
      + '</ul>'
      + 'VQE and QAOA are among the most promising quantum algorithms for today\'s noisy intermediate-scale quantum (NISQ) computers because they reduce the depth of quantum circuits while leveraging classical optimization.',
    nisqTitle: 'NISQ Computing',
    nisqBody: 'The current era of quantum computers is called the Noisy Intermediate-Scale Quantum (NISQ) era: devices contain tens to thousands of imperfect qubits but cannot yet run fully fault-tolerant algorithms.',
    faultTolerantTitle: 'Fault-Tolerant Quantum Computing',
    faultTolerantBody: 'A future generation of quantum computers capable of performing arbitrarily long computations despite hardware errors through quantum error correction.',
    surfaceCodeTitle: 'Surface Code',
    surfaceCodeBody: 'The leading quantum error-correcting code, encoding one logical qubit into many physical qubits arranged on a two-dimensional lattice.',
    logicalPhysicalQubitsTitle: 'Logical vs Physical Qubits',
    logicalPhysicalQubitsBody: 'Physical qubits are the hardware qubits that suffer from noise. Logical qubits are protected, error-corrected qubits encoded across many physical ones.',
    magicStatesTitle: 'Magic States',
    magicStatesBody: 'Certain quantum gates cannot be implemented directly in many fault-tolerant architectures. Instead, specially prepared "magic states" are consumed to perform them, making magic-state distillation one of the largest costs in scalable quantum computing.',
    hamiltonianSimulationTitle: 'Hamiltonian Simulation',
    hamiltonianSimulationBody: 'One of quantum computing\'s original motivations: efficiently simulating the dynamics of molecules, materials, and quantum field theories governed by a Hamiltonian. Many researchers — including those working on lattice field theories and quantum chemistry — consider this one of the most important long-term applications of quantum computers.',
    qpeTitle: 'Quantum Phase Estimation (QPE)',
    qpeBody: 'A foundational quantum algorithm for estimating the eigenvalues of unitary operators. It underpins Shor\'s algorithm and many algorithms for quantum chemistry and Hamiltonian simulation.',
    adiabaticQCTitle: 'Adiabatic Quantum Computing',
    adiabaticQCBody: 'A computational model in which the system remains in its ground state while its Hamiltonian changes slowly. If the evolution is slow enough, the final ground state encodes the solution to an optimization problem.',
    mbqcTitle: 'Measurement-Based Quantum Computing',
    mbqcBody: 'Instead of computing primarily with gates, computation proceeds by preparing a large entangled resource state (a cluster state) and then performing carefully chosen measurements. The measurements themselves drive the computation.'
  },
  measure: {
    title: 'Measurement',
    subtitle: 'The bars below are odds, not a preview — measuring forces the qubit to answer a question it was genuinely undecided about, and there\'s no taking it back',
    quantumState: 'Quantum State',
    measureButton: 'MEASURE',
    postulateTitle: 'The Measurement Postulate',
    postulateBody1: 'This isn\'t just an app simplification — it\'s one of the axioms of quantum mechanics. Measuring a qubit |ψ⟩ = α|0⟩ + β|1⟩ returns 0 with probability |α|² and 1 with probability |β|² (the Born rule), and immediately afterward the state has collapsed to whichever outcome came up — the other possibility is simply gone, not just hidden.',
    postulateFormula: 'P(0) = |α|²&nbsp;&nbsp;&nbsp; P(1) = |β|²&nbsp;&nbsp;&nbsp; α|0⟩ + β|1⟩ → |0⟩ or |1⟩',
    postulateBody2: 'Note what\'s absent: nothing in this rule says which outcome you\'ll get on any single run — only the odds across many identical qubits, which is exactly what the histogram below is for.',
    measurementStatistics: 'Measurement Statistics',
    confirmOddsBody: 'This is the only way to actually confirm those odds — ask the same question of many identical qubits and watch the histogram settle into the predicted split. A single qubit only ever gives you one answer; the pattern only shows up across a crowd.'
  },
  entangle: {
    title: 'Quantum Entanglement',
    subtitle: 'Bell state (|00⟩ + |11⟩)/√2 — neither qubit has a definite state alone; measuring one instantly determines the other',
    bannerAlt: 'Illustration of the coin-flip analogy for quantum entanglement: two people each flip a coin at separate detectors, connected by a glowing sphere of correlation cones — whichever way Coin A lands, Coin B instantly lands the opposite way, with the state indeterminate until measured.',
    jointStateLabel: 'joint state of both qubits',
    explainerTitle: 'What Is Quantum Entanglement?',
    explainerBody1: 'Quantum entanglement is a phenomenon in which two or more particles become linked so that their quantum states can no longer be described independently of one another — even when the particles are separated by enormous distances. Instead of two separate qubits each carrying their own state, the pair shares a single joint state, like the Bell state (|00⟩ + |11⟩)/√2 shown above: a 50/50 mix of "both measured 0" and "both measured 1," with no way to break it down into what qubit A or qubit B is doing on its own.',
    explainerBody2: 'Entanglement isn\'t produced by some mysterious force reaching between the particles — it\'s created locally, the moment two qubits interact (here, with a Hadamard gate followed by a CNOT — build the same recipe gate by gate on the Circuits tab), and it persists afterward no matter how far apart the qubits later travel. Einstein famously called the resulting correlations "spooky action at a distance," since measuring one qubit appears to instantly affect the other.',
    explainerBody3: 'The two cards below work out the details behind that intuition: why a state like this genuinely can\'t be described as two separate qubits, and why the instant correlation still can\'t be used to send a signal faster than light.',
    mapCaption: 'Two different locations, arbitrarily far apart — the correlation holds regardless of the distance between them.',
    entangledLabel: 'Entangled',
    measureBoth: 'Measure Both',
    measureAOnly: 'Measure A Only',
    tensorTitle: 'Why Isn\'t This Just Two Qubits? (Tensor Products)',
    tensorBody1: 'Two independent qubits always combine by <span class="key-term">tensor product</span> (⊗): stack qubit A\'s 2-entry vector against qubit B\'s, multiplying every pair of entries to build a 4-entry joint vector. Every product state — anything you could build in the Two Qubit panel on the Bits & Qubits tab — factors apart into two separate qubits this way:',
    tensorFormula1: '|0⟩⊗|0⟩ = [1,0]<sup>T</sup>⊗[1,0]<sup>T</sup> = [1,0,0,0]<sup>T</sup> = |00⟩',
    tensorBody2: 'The Bell state above is also a 4-entry vector — [1,0,0,1]<sup>T</sup>/√2 — but try to factor it back into [a,b]<sup>T</sup>⊗[c,d]<sup>T</sup> = [ac,ad,bc,bd]<sup>T</sup> and there\'s no solution: <em>ad</em> = 0 and <em>bc</em> = 0 force one of each pair to be zero, which would also zero out <em>ac</em> or <em>bd</em> — no single-qubit states A and B multiply together to reproduce it.',
    tensorFormula2: '(|00⟩ + |11⟩) / √2 = [1, 0, 0, 1]ᵀ/√2 ≠ [a,b]ᵀ ⊗ [c,d]ᵀ for any a, b, c, d',
    tensorBody3: 'That\'s the literal, checkable definition of entanglement: a joint state that can\'t be split back into two independent single-qubit factors. Neither qubit alone has a well-defined state — only the pair does.',
    relativityTitle: 'Why This Doesn\'t Break Relativity',
    relativityBody1: 'This setup is a version of the Einstein-Podolsky-Rosen (EPR) thought experiment: Alice measures Qubit A and instantly knows Qubit B\'s outcome, even if B is light-years away. It looks like faster-than-light signaling — but it isn\'t.',
    relativityBody2: 'Alice can\'t choose which outcome she gets — that\'s still random, same 50/50 odds as any single qubit. So there\'s nothing for her to control, and therefore nothing she can encode into a message. The correlation is only visible after the fact, once Alice and Bob compare notes over an ordinary (slower-than-light) channel. No energy, no information, and no signal actually crosses the distance between them at the moment of measurement.'
  },
  bellstates: {
    title: 'Bell States',
    subtitle: 'The four maximally entangled two-qubit states — pick one to see how it\'s built, how it\'s classified, and exactly what it predicts',
    pickTitle: 'Choose a Bell State',
    circuitTitle: 'Circuit Diagram',
    recipe: {
      phiplus: 'Start at |00⟩, apply H to qubit A, then CNOT (A → B).',
      phiminus: 'Start at |00⟩, apply X to qubit A, then H to qubit A, then CNOT (A → B).',
      psiplus: 'Start at |00⟩, apply X to qubit B, then H to qubit A, then CNOT (A → B).',
      psiminus: 'Start at |00⟩, apply X to both qubits, then H to qubit A, then CNOT (A → B).'
    },
    familyTitle: 'The Bell Family',
    familyBody: 'Every Bell state sits at one of four corners, set by two independent choices: which row (same or opposite measurement outcomes) and which column (a + or − relative phase). Click any corner to prepare it.',
    plusPhase: '+ phase',
    minusPhase: '− phase',
    sameRow: 'Same',
    oppositeRow: 'Opposite',
    distributionTitle: 'Probability Distribution',
    distributionNote: 'Exact Born-rule probabilities for {symbol} — no sampling needed, these follow directly from squaring each amplitude.',
    definitionsTitle: 'The Four Bell States',
    definitionsBody: 'All four are built from the same |00⟩ starting point with the same two-gate recipe — a Hadamard on qubit A, then a CNOT controlled by it — just preceded by an X gate on whichever qubit(s) need flipping first:'
      + '<ul class="quantum-list">'
      + '<li><b>Φ⁺ = (|00⟩ + |11⟩)/√2</b> — no X gates. Outcomes always match.</li>'
      + '<li><b>Φ⁻ = (|00⟩ − |11⟩)/√2</b> — X on qubit A first. Outcomes always match.</li>'
      + '<li><b>Ψ⁺ = (|01⟩ + |10⟩)/√2</b> — X on qubit B first. Outcomes always opposite.</li>'
      + '<li><b>Ψ⁻ = (|01⟩ − |10⟩)/√2</b> — X on both qubits first. Outcomes always opposite.</li>'
      + '</ul>'
      + 'Together they form a complete orthonormal basis for two qubits — the core resource behind quantum teleportation and superdense coding.',
    phaseNoteTitle: 'Why Doesn\'t the Minus Sign Show Up?',
    phaseNoteBody: 'Φ⁺ and Φ⁻ (and likewise Ψ⁺ and Ψ⁻) give identical probability distributions above, because a relative phase — the − sign — doesn\'t change any computational-basis probability, only |amplitude|² does. The two states are still physically distinct: the phase becomes visible the moment you interfere the qubits with each other, for example by applying a Hadamard to each qubit before measuring — that\'s exactly the extra step Bell-inequality tests and superdense coding rely on to tell all four states apart.'
  },
  tunnel: {
    title: 'Quantum Tunneling',
    subtitle: 'Fire a wave packet at a wall taller than its own energy. Classically it always bounces. Quantum mechanically, a piece of it slips through anyway',
    reflected: 'Reflected',
    transmitted: 'Transmitted',
    barrier: 'Barrier',
    fireAgain: '↻ Fire again'
  },
  interference: {
    title: 'Wave Interference',
    subtitle: 'Two open paths and a screen keeping score. Every dot on the right is one particle landing — yet together they paint a wave',
    screen: 'Screen',
    setup: 'Setup',
    doubleSlit: 'Double slit',
    singleSlit: 'Single slit',
    whichPath: 'Which-path',
    wave: 'Wave',
    clearAccumulation: 'Clear accumulation',
    physicsInDetail: 'The Physics, In Detail',
    body1: 'Every dot on the screen is one particle landing at one spot — that part is completely ordinary. What isn\'t ordinary is <em>where</em> those dots are allowed to land. Fire particles at the double slit one at a time, with no way for two particles to ever meet mid-flight, and the dots still pile up into stripes. There\'s no crowd of particles interfering with each other — each individual particle\'s own wavefunction passes through <em>both</em> slits at once and interferes with itself. That\'s the actual mystery here, not just "waves make patterns."',
    formula: 'I(y) = |A<sub>1</sub>(y) + A<sub>2</sub>(y)|² = |A<sub>1</sub>|² + |A<sub>2</sub>|² + 2|A<sub>1</sub>||A<sub>2</sub>|cos φ(y)',
    body2: 'A<sub>1</sub> and A<sub>2</sub> are the amplitudes for "the particle went through slit 1" and "through slit 2," and φ(y) is the extra distance one path travels to reach point y, converted to a phase. Classical probabilities would just add: P = P<sub>1</sub> + P<sub>2</sub>, a flat pile with no stripes. Quantum amplitudes add first and get squared afterward — and squaring a sum produces that <strong>2|A<sub>1</sub>||A<sub>2</sub>|cos φ</strong> cross term, which is positive at some y (bright fringes), negative at others (dark fringes), and is the entire reason stripes exist at all.',
    body3: '<strong>Double slit</strong> — both paths stay open and genuinely indistinguishable, so the cross term survives and you get fringes. <strong>Single slit</strong> — only one amplitude exists at all, so there\'s nothing for it to interfere with; I = |A<sub>1</sub>|², a plain diffraction blob. <strong>Which-path</strong> — both slits are still physically open, but tagging each particle\'s path (the small detector dots on the plate) means a which-path measurement now exists for every hit. Averaged over those measurements the cross term cancels exactly, leaving the flat I = |A<sub>1</sub>|² + |A<sub>2</sub>|² you\'d expect from ordinary particles — two humps, no stripes. Nothing needs to physically jostle the particle for this to happen; merely making the path <em>knowable in principle</em> is enough to erase the pattern.',
    body4: 'That\'s why the ripple animation on the left and the dot-by-dot screen on the right are shown side by side: the ripples are the continuous wave picture that predicts where the cross term is constructive or destructive, and the screen is what actually gets measured — one random, all-or-nothing click at a time. The wave never lands anywhere; only the particle does. The stripes are the wave\'s fingerprint on where the particles were and weren\'t allowed to click.'
  },
  beamsplitter: {
    title: 'Beam Splitter',
    subtitle: 'A single photon hits a 50/50 beam splitter and is randomly reflected to detector A or transmitted to detector B — one photon, one random outcome, never a photon split in half',
    svgAlt: 'Diagram of a photon source firing at a 50/50 beam splitter, randomly reflected up to detector A or transmitted right to detector B. A faint duplicate briefly appears on the path not taken, illustrating the superposition that existed before the photon was detected.',
    photonSource: 'Photon source',
    reflected: 'reflected',
    transmitted: 'transmitted',
    beamSplitterLabel: 'Beam splitter',
    detectorA: 'Photon detector A',
    detectorB: 'Photon detector B',
    firePhoton: 'Fire photon',
    detectorTally: 'Detector Tally'
  },
  sterngerlach: {
    title: 'Stern–Gerlach Experiment',
    subtitle: 'Send atoms one at a time through a magnetic field and watch spin — a purely quantum property — reveal itself as a small number of discrete spots, never a continuous smear',
    svgAlt: 'Diagram of an oven emitting silver atoms through collimating slits into a Stern-Gerlach magnet with a sharp knife-edge south pole above and a broad curved north pole below, splitting the beam toward an Up detector or a Down detector depending on the atom\'s spin.',
    atomSource: 'Oven',
    silverAtomsArrow: 'Silver atoms',
    collimatingSlits: 'Collimating slits',
    magnetLabel: 'Inhomogeneous field',
    detectorUp: 'Up detector',
    detectorDown: 'Down detector',
    fireAtom: 'Fire atom',
    inputSpinTitle: 'Input Spin Angle',
    inputSpinBody: 'Same θ as the Bloch sphere — θ = 0° prepares spin certainly up, θ = 180° certainly down, and anything in between is a genuine superposition of the two.',
    detectorTally: 'Detector Tally',
    whyTwoSpotsTitle: 'Why Only Two Spots?',
    whyTwoSpotsBody: 'The deflecting force comes from the field\'s <em>gradient</em>, not just its strength: F<sub>z</sub> ≈ μ<sub>z</sub>·∂B<sub>z</sub>/∂z, where μ<sub>z</sub> is the atom\'s magnetic moment along the field axis. A uniform field (∂B<sub>z</sub>/∂z = 0) would exert no net force at all, no matter which way the moment pointed — which is exactly why the two poles above are shaped differently instead of just being strong magnets: only a genuinely inhomogeneous field produces any deflection.',
    whyTwoSpotsFormula: 'F<sub>z</sub> ≈ μ<sub>z</sub> (∂B<sub>z</sub> / ∂z) &nbsp;&nbsp;&nbsp; if B is uniform ⇒ F = 0',
    whyTwoSpotsBody2: 'Classically, μ<sub>z</sub> could point in any direction, so a beam of randomly-oriented atoms should smear continuously across the screen, from fully deflected up to fully deflected down. When Stern and Gerlach actually ran this experiment in 1922, silver atoms landed in exactly two discrete spots — nothing in between, no matter how the magnet was tilted. That\'s the same quantization already built into every qubit in this app: a measurement returns one of exactly two outcomes, never a partial result.',
    sequentialTitle: 'Measuring Twice: Why Order Matters',
    sequentialIntro: 'Every atom below already has a definite spin — it\'s the "up" output of a first magnet, with the "down" half physically blocked. Now send it through a second magnet:',
    sameAxis: 'Same axis (Z)',
    differentAxis: 'Different axis (X)',
    svg2Alt: 'Diagram of an atom prepared with spin up along Z entering a second Stern-Gerlach magnet with a knife-edge south pole and a curved north pole, splitting toward a plus detector or a minus detector depending on the second magnet\'s axis.',
    preparedLabel: 'prepared: spin ↑ (Z)',
    blockedLabel: '("down" half blocked)',
    magnet2AxisZ: 'Magnet 2 — Z axis',
    magnet2AxisX: 'Magnet 2 — X axis',
    resultTravelling: 'traveling…',
    resultUp: 'Up detector clicked',
    resultDown: 'Down detector clicked',
    explainerUp: 'Up detector clicked — one of exactly two possible outcomes, never a partial deflection. Fire again and the same atom state can still land Down; only the odds are fixed, not any single result.',
    explainerDown: 'Down detector clicked — one of exactly two possible outcomes, never a partial deflection. Fire again and the same atom state can still land Up; only the odds are fixed, not any single result.',
    explainerDefault: 'An atom is about to enter the magnet. Fire it and watch which detector clicks.',
    trialCount: '· {count} atoms',
    sequentialExplainerZ: 'Same axis as before — fire an atom to confirm it always lands the same way.',
    sequentialExplainerX: 'A different axis this time — fire an atom to see what happens to a spin that was already definite along Z.',
    result2Plus: '"+" detector clicked',
    result2Minus: '"−" detector clicked',
    explainer2Z: 'Measuring the same axis twice in a row just confirms the earlier result — no surprise here. Fire again as many times as you like: it will always land "+".',
    explainer2X: 'Even though this atom had a perfectly definite spin along Z, measuring a different, incompatible axis (X) erased that information and produced a fresh, genuinely random result. This is the heart of the Stern–Gerlach discovery: measuring one property can disturb another that doesn\'t commute with it.'
  },
  // Mirrors ROADMAP_LESSONS in js/roadmap.js exactly (same ids, same
  // title/body content) — that file keeps its own English copies as the
  // t()-lookup fallback (see buildLessonInfoHTML()), so the two only ever
  // need to match at this initial extraction, not stay hand-synced later.
  lessons: {
    qubit: {
      title: 'Bits',
      body: 'A classical bit is always definitively 0 or 1. A qubit can be in a superposition of both at once, described by two amplitudes rather than a single value. The Bloch sphere gives every possible qubit state a point on its surface.'
    },
    'maths-complex': {
      title: 'Complex Numbers',
      body: 'A qubit\'s amplitudes are complex numbers, not just real ones — each has a real and imaginary part, z = a + bi. Only the squared modulus |z|² is directly observable as a probability; the phase is invisible to a single measurement but is exactly what drives interference.'
    },
    'maths-vectors': {
      title: 'Vectors',
      body: 'A qubit\'s state is a column vector [α, β] in a 2D complex vector space, with |0⟩ and |1⟩ as the basis. Normalization |α|² + |β|² = 1 keeps total probability at 100%, and the inner product measures how much two states overlap.'
    },
    'maths-matrices': {
      title: 'Matrices',
      body: 'Every quantum gate is a unitary matrix (U†U = I) acting on the state vector by matrix multiplication. Unitarity guarantees a gate never destroys or creates probability — which is exactly why every quantum gate is reversible.'
    },
    'maths-statevector': {
      title: 'State Vector',
      body: 'The state vector |ψ⟩ = α|0⟩ + β|1⟩ is the complete description of a qubit. In Bloch-sphere form, |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ — θ and φ are exactly the two sliders on the Bits & Qubits Bloch sphere.'
    },
    'maths-dirac': {
      title: 'Dirac Notation',
      body: 'Dirac\'s bra-ket notation is shorthand for vectors and their inner products: |ψ⟩ is a ket, ⟨ψ| its bra, and ⟨φ|ψ⟩ their inner product. |0⟩ and |1⟩ are orthonormal — ⟨0|1⟩ = 0, ⟨0|0⟩ = ⟨1|1⟩ = 1.'
    },
    'maths-tensor': {
      title: 'Tensor Products',
      body: 'Two independent vectors combine via the tensor product (⊗) into one larger joint vector — stack every entry of the first against every entry of the second, multiplying each pair. Two qubits combine this way into a 4-entry joint state; not every joint state can be split back apart, and the ones that can\'t are exactly the entangled ones.'
    },
    gates: {
      title: 'Quantum Gates',
      body: 'Gates are the operations that move a qubit around the Bloch sphere — reversible rotations rather than the destructive logic of classical gates. Each one (H, X, Y, Z, S, T) has a precise geometric effect you can watch happen.'
    },
    circuit: {
      title: 'Circuits',
      body: 'A circuit is a sequence of gates applied left to right. In a classical circuit, logic gates like AND/OR/XOR combine bits by strict rules — the same input always gives the same output. In a quantum circuit, order matters in a deeper way: running the same gates in a different sequence can land the qubit in a completely different state, just like turns in a route. Switch to 2 or 3 Qubits and add CNOT to build entangled states — Bell pairs and GHZ states — gate by gate, the same recipes behind the Entangle tab.'
    },
    measure: {
      title: 'Measurement',
      body: 'Measuring a qubit forces it to commit to a definite outcome, 0 or 1, with probabilities set by its amplitudes just before measurement. This is the collapse of superposition — irreversible and probabilistic, not a hidden pre-existing value.'
    },
    entangle: {
      title: 'Entanglement',
      body: 'Two qubits can be linked so that measuring one instantly determines the other\'s outcome, no matter how far apart they are. This correlation is stronger than anything possible between classical bits.'
    },
    bellstates: {
      title: 'Bell States',
      body: 'The four Bell states — Φ⁺, Φ⁻, Ψ⁺, and Ψ⁻ — are the maximally entangled two-qubit states, all built from the same Hadamard-then-CNOT recipe starting from a different one of the four basis states. Φ⁺/Φ⁻ always measure to matching outcomes, Ψ⁺/Ψ⁻ always to opposite ones — the relative phase behind each ± sign is invisible to a direct measurement, only showing up once the qubits are interfered with each other.'
    },
    tunnel: {
      title: 'Quantum Tunneling',
      body: 'A quantum wave packet has a nonzero chance of appearing on the far side of a barrier it classically shouldn\'t be able to cross, because its probability cloud extends through the barrier rather than stopping at it.'
    },
    interference: {
      title: 'Interference',
      body: 'When two paths to the same outcome are indistinguishable, their probability amplitudes combine and can reinforce or cancel — producing stripes on a screen instead of two simple piles. Marking which path was taken destroys the pattern.'
    },
    beamsplitter: {
      title: 'Beam Splitter',
      body: 'A 50/50 beam splitter sends a single photon down one of two paths with equal probability — reflected to one detector or transmitted to the other. The photon isn\'t secretly divided between both paths; only one detector ever clicks per photon, and which one is genuinely random each time.'
    },
    sterngerlach: {
      title: 'Stern–Gerlach Experiment',
      body: 'A beam of silver atoms passing through an inhomogeneous magnetic field splits into exactly two discrete spots, never a continuous smear — direct evidence that spin is quantized, with only two possible outcomes along any measurement axis, exactly like a qubit\'s own |0⟩/|1⟩ measurement results.'
    }
  },
  // Mirrors ROADMAP_QUIZ in js/roadmap.js exactly — same lessonIds as
  // the `lessons` keys above, same q/options/explanation content.
  quiz: {
    qubit: {
      q: 'A classical bit and a qubit both start in a definite state. What is the key difference between them?',
      options: ['Qubits can hold a superposition of 0 and 1 at once', 'Qubits are just faster bits', 'Qubits can only be measured once, ever', 'There is no real difference'],
      explanation: 'A qubit\'s amplitudes let it genuinely be a mix of both basis states until measured — a classical bit never has that option.'
    },
    'maths-complex': {
      q: 'Why do qubit amplitudes need to be complex numbers rather than just real numbers?',
      options: ['Complex numbers are more precise than real numbers', 'The extra phase in a complex number is what makes interference between paths possible', 'Real numbers can\'t be negative', 'It\'s just a mathematical convention with no physical meaning'],
      explanation: 'Two real amplitudes could still cancel by sign, but only a complex phase lets amplitudes reinforce or cancel at any relative angle — that richer freedom is exactly what interference exploits.'
    },
    'maths-vectors': {
      q: 'What does the normalization condition |α|² + |β|² = 1 guarantee about a qubit state?',
      options: ['That the qubit is entangled', 'That the total measurement probability across |0⟩ and |1⟩ adds up to exactly 100%', 'That the qubit has been measured', 'That α and β are both real numbers'],
      explanation: 'P(0) + P(1) = |α|² + |β|² must equal 1 for the Born rule to make sense as a probability distribution — every valid point on the Bloch sphere already satisfies this automatically.'
    },
    'maths-matrices': {
      q: 'What property must every valid quantum gate matrix U satisfy?',
      options: ['det(U) = 0', 'U†U = I (U is unitary)', 'U must be a real-valued matrix', 'U must have exactly two rows'],
      explanation: 'Unitarity is what keeps the state vector normalized after the gate is applied — it\'s also exactly the condition that makes every quantum gate reversible, unlike a classical AND gate.'
    },
    'maths-statevector': {
      q: 'In the Bloch-sphere form |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, what do θ and φ correspond to?',
      options: ['Two independent qubits', 'The exact same θ/φ sliders used to set a state on the Bloch sphere', 'The number of gates applied so far', 'The measurement outcome'],
      explanation: 'Every point on the Bloch sphere is just this equation with one (θ,φ) pair plugged in — the sphere is a picture of the formula, not a separate thing.'
    },
    'maths-dirac': {
      q: 'What does it mean that ⟨0|1⟩ = 0?',
      options: ['|0⟩ and |1⟩ are the same state', '|0⟩ and |1⟩ are orthogonal — completely distinguishable outcomes', 'The qubit is in superposition', 'A measurement error occurred'],
      explanation: 'Orthogonality is exactly why measurement always returns a clean 0 or 1, never something "in between" — |0⟩ and |1⟩ share zero overlap.'
    },
    'maths-tensor': {
      q: 'Two independent qubits, each a 2-entry vector, combine via the tensor product into a joint state. How many entries does that joint state have?',
      options: ['2', '4', '8', 'It depends on the qubits\' amplitudes'],
      explanation: 'The tensor product of a 2-entry vector with another 2-entry vector always has 2×2 = 4 entries — one for each combination of basis outcomes, |00⟩, |01⟩, |10⟩, |11⟩ — regardless of what the actual amplitudes are.'
    },
    gates: {
      q: 'What does the Hadamard (H) gate do to a qubit starting at |0⟩?',
      options: ['Flips it directly to |1⟩', 'Puts it into an equal superposition of |0⟩ and |1⟩', 'Measures it immediately', 'Entangles it with another qubit'],
      explanation: 'H rotates |0⟩ to the equator of the Bloch sphere — 50/50 odds, with a fixed phase relationship between the two amplitudes.'
    },
    circuit: {
      q: 'In a quantum circuit, why does the order of gates matter?',
      options: ['It doesn\'t — gates always commute', 'Each gate rotates the state, and rotations generally don\'t commute', 'Only the last gate has any effect', 'Order only matters for measurement'],
      explanation: 'Each gate is a rotation of the Bloch sphere, and 3D rotations don\'t generally commute — X then Z lands somewhere different than Z then X.'
    },
    measure: {
      q: 'What happens to a qubit\'s superposition when you measure it?',
      options: ['Nothing changes', 'It collapses to a single definite outcome', 'It splits into two qubits', 'It becomes entangled automatically'],
      explanation: 'There\'s no hidden fact about which outcome it "really" was beforehand — measuring is what produces a definite answer, weighted by the amplitudes.'
    },
    entangle: {
      q: 'Two qubits are entangled. You measure the first and get |1⟩. What happens to the second?',
      options: ['Nothing — they are independent', 'Its outcome is now instantly correlated with the first, per their entangled state', 'It is destroyed', 'It becomes a classical bit'],
      explanation: 'Their amplitudes were linked the moment they became entangled — measuring one doesn\'t send a signal, it just reveals a correlation baked in from the start.'
    },
    bellstates: {
      q: 'Φ⁺ = (|00⟩ + |11⟩)/√2 and Φ⁻ = (|00⟩ − |11⟩)/√2 are different states, yet measuring either one in this demo gives identical statistics. Why?',
      options: ['They are actually the same state written two ways', 'A relative phase (the − sign) doesn\'t change any computational-basis probability, only |amplitude|² does', 'The demo has a bug and can\'t tell them apart', 'Only Φ⁺ is a real Bell state'],
      explanation: 'Probabilities come from |amplitude|², which is identical for +1/√2 and −1/√2. The two states are still physically distinct — the phase becomes visible once the qubits are interfered with each other, e.g. by applying a Hadamard to each before measuring.'
    },
    tunnel: {
      q: 'What is quantum tunneling?',
      options: ['A qubit teleporting instantly across space', 'A wave packet having nonzero probability of appearing beyond a classically-forbidden barrier', 'A gate that deletes a qubit', 'A measurement error'],
      explanation: 'The wavefunction doesn\'t stop dead at a barrier — it decays exponentially inside it, so a thin enough barrier still leaves nonzero amplitude on the far side.'
    },
    interference: {
      q: 'In the double-slit experiment, what causes the interference stripes on the screen?',
      options: ['Two separate particles colliding', 'Probability amplitudes from indistinguishable paths adding or canceling', 'The screen material', 'Measurement collapse happening early'],
      explanation: 'Each screen point has two possible paths; when they\'re indistinguishable their amplitudes add and can reinforce or cancel, producing the fringes.'
    },
    beamsplitter: {
      q: 'A single photon hits a 50/50 beam splitter. What actually happens?',
      options: ['The photon splits in half, with half going to each detector', 'The photon goes to exactly one detector, chosen at random with 50/50 odds', 'Both detectors always click together', 'Neither detector clicks unless you measure twice'],
      explanation: 'A photon is never divided between paths — the beam splitter puts it into a superposition of "reflected" and "transmitted", and measuring (the detector clicking) forces one definite outcome, same as measuring a qubit.'
    },
    sterngerlach: {
      q: 'A beam of silver atoms passes through a Stern–Gerlach magnet. What does the experiment actually show on the detector screen?',
      options: ['A continuous smear from one extreme to the other', 'Exactly two discrete spots, never anything in between', 'A single spot in the exact center', 'No pattern at all — the atoms are absorbed'],
      explanation: 'Classically, a randomly-oriented magnetic dipole should deflect by any amount, producing a continuous smear. Stern and Gerlach found only two discrete spots — direct evidence that spin, like a qubit\'s own measurement outcomes, is quantized into just two possibilities along any axis.'
    }
  }
});
