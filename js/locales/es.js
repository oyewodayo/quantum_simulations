'use strict';
// traducción de en.js, misma estructura de claves, solo cambian los
// valores - t() (i18n.js) recurre a en.js si falta una clave aquí
registerLocale('es', {
  header: {
    tag: 'Quantum Explorer · CERN',
    themeToggle: 'Cambiar modo claro / oscuro'
  },
  footer: {
    tagline: 'Una plataforma interactiva para aprender computación cuántica y mecánica cuántica',
    cernLink: 'Sitio oficial del CERN',
    copyright: 'Copyright © {year} CERN'
  },
  nav: {
    home: 'Inicio',
    introduction: 'Introducción',
    importantConcepts: 'Conceptos Importantes',
    bitsQubits: 'Bits y Qubits',
    mathsConcept: 'Concepto Matemático',
    gates: 'Puertas',
    circuits: 'Circuitos',
    measure: 'Medir',
    entangle: 'Entrelazar',
    bellStates: 'Estados de Bell',
    tunnel: 'Túnel',
    interference: 'Interferencia',
    beamSplitter: 'Divisor de Haz',
    sternGerlach: 'Stern–Gerlach'
  },
  qubitTab: {
    classical: 'Clásico',
    oneQubit: 'Un Qubit',
    twoQubit: 'Dos Qubits',
    threeQubit: 'Tres Qubits',
    pageTitle: 'Bits y Qubits',
    pageSubtitle: 'Aprende información clásica y cuántica explorando un bit, un solo qubit o un sistema de dos qubits.',
    classicalBitBadge: 'Bit Clásico',
    classicalBitDesc: 'Un bit es la unidad más pequeña de información en un ordenador clásico. A diferencia de un qubit, un bit clásico nunca existe en ambos estados simultáneamente.',
    currentBit: 'Bit actual',
    possibleValues: 'Valores posibles',
    classicalExplainer: 'Activa el interruptor para cambiar el bit. Observa que siempre es 0 o 1, nunca ambos.',
    qubitBadge: 'Qubit',
    qubitDesc: 'Un qubit es la unidad fundamental de la información cuántica. A diferencia de un bit clásico, puede existir en una superposición de 0 y 1 a la vez — su estado se describe mediante dos amplitudes complejas, α y β, hasta el momento en que se mide.',
    qubitIntroExplainer: 'Elige un modo abajo: explora la superposición de un solo qubit en la esfera de Bloch, o descubre cómo dos qubits independientes se combinan en un estado conjunto.',
    oneQubitDesc: 'Una superposición de 0 y 1 a la vez',
    exploreBlochSphere: 'Explorar la Esfera de Bloch',
    oneQubitExplainer: 'Un qubit puede estar en una superposición de |0⟩ y |1⟩ simultáneamente. Arrastra los deslizadores para explorar todos los estados posibles en la esfera de Bloch — cada punto es un estado válido de un qubit, inaccesible para cualquier bit clásico.',
    qubitABadge: 'Qubit A',
    qubitADesc: 'Independiente — no entrelazado con B',
    qubitBBadge: 'Qubit B',
    qubitBDesc: 'Independiente — no entrelazado con A',
    jointState: 'Estado Conjunto — |ψ_A⟩ ⊗ |ψ_B⟩',
    twoQubitExplainer: 'Dos qubits, cada uno arrastrado de forma independiente — el estado conjunto de arriba es simplemente el producto de sus probabilidades individuales, P(ab) = P(a) × P(b). Aquí nada está aún correlacionado; ese es exactamente el ingrediente que la pestaña Entrelazar añade con una CNOT.',
    classicalTryMeIdle: 'Haz clic en Pruébame para ver el bit alternar de un lado a otro.',
    oneQubitTryMeIdle: 'Haz clic en Pruébame para recorrer los seis estados base.',
    twoQubitTryMeIdle: 'Haz clic en Pruébame para mover ambos qubits juntos a través de los cuatro estados base.',
    whatIsQubitBody: 'Un qubit suele describirse como "0 y 1 al mismo tiempo", pero eso es una forma abreviada de algo más preciso: su estado es una <span class="key-term">superposición</span> — una combinación ponderada — de los dos resultados base |0⟩ y |1⟩, fijada por dos <span class="key-term">amplitudes complejas</span> α y β. Elevar al cuadrado el tamaño de cada amplitud da la probabilidad de ese resultado al medir — pero antes de medir, el qubit realmente no ha elegido ninguno. Un bit clásico tiene exactamente dos estados. Un qubit tiene infinitos: cada punto de la superficie de la esfera de Bloch de abajo es un estado válido, no solo sus dos polos.',
    blochEarthTitle: 'La Esfera de Bloch — Piensa en el Planeta Tierra',
    blochEarthBody: 'La esfera en la que vive tu qubit funciona como un globo terráqueo. El <span class="key-term">polo norte</span> es |0⟩ y el <span class="key-term">polo sur</span> es |1⟩ — θ (theta) es la "latitud", cuánto se ha inclinado el qubit desde el polo |0⟩ hacia |1⟩. Estar justo en el <span class="key-term">ecuador</span> (θ = 90°) significa una <span class="key-term">superposición</span> equilibrada 50/50 de ambos. φ (phi) es la "longitud" — nunca cambia las probabilidades de medición, solo la <span class="key-term">fase</span> relativa entre las dos amplitudes, invisible en una sola medición pero es exactamente lo que impulsa la interferencia en el resto de la aplicación.',
    qubitCBadge: 'Qubit C',
    qubitA3Desc: 'Independiente — no entrelazado con B ni C',
    qubitB3Desc: 'Independiente — no entrelazado con A ni C',
    qubitC3Desc: 'Independiente — no entrelazado con A ni B',
    jointState3: 'Estado Conjunto — |ψ_A⟩ ⊗ |ψ_B⟩ ⊗ |ψ_C⟩',
    threeQubitExplainer: 'Tres qubits, cada uno arrastrado de forma independiente — el estado conjunto de arriba es simplemente el producto de las tres probabilidades individuales, P(abc) = P(a) × P(b) × P(c). Aquí sigue sin haber nada correlacionado; escala esta misma idea con una CNOT y obtienes los estados GHZ en el constructor de 3 qubits de la pestaña Circuitos.',
    threeQubitTryMeIdle: 'Haz clic en Pruébame para mover los tres qubits juntos a través de los cuatro estados base.'
  },
  maths: {
    title: 'Concepto Matemático',
    subtitle: 'El lenguaje matemático detrás de los qubits — números complejos, vectores, matrices, vectores de estado, notación de Dirac y productos tensoriales.',
    complexBody1: 'Las amplitudes de un qubit no son simples números reales — son números complejos, cada uno con una parte real y una parte imaginaria. Esa dimensión adicional es lo que hace posible la fase (y la interferencia).',
    complexFormula1: 'z = a + bi,&nbsp;&nbsp; i² = −1',
    complexFormula2: 'Módulo: |z| = √(a² + b²)',
    complexFormula3: 'Forma polar: z = r·e<sup>iθ</sup> = r(cos θ + i sin θ)',
    complexBody2: 'Un estado de qubit α|0⟩ + β|1⟩ tiene amplitudes complejas α, β. Solo sus módulos al cuadrado |α|², |β|² son directamente observables (como probabilidades de medición) — la fase relativa entre ellas es invisible en una sola medición, pero es lo que impulsa la interferencia.',
    vectorsBody1: 'El estado de un qubit es un vector en un espacio vectorial complejo de 2 dimensiones, escrito como una columna de sus dos amplitudes.',
    vectorsFormula1: '|0⟩ = [1, 0]<sup>T</sup>&nbsp;&nbsp;&nbsp; |1⟩ = [0, 1]<sup>T</sup>',
    vectorsFormula2: '|ψ⟩ = α|0⟩ + β|1⟩ = [α, β]<sup>T</sup>',
    vectorsFormula3: 'Normalización: |α|² + |β|² = 1',
    vectorsFormula4: 'Producto interno: ⟨φ|ψ⟩ = φ<sub>0</sub>*ψ<sub>0</sub> + φ<sub>1</sub>*ψ<sub>1</sub>',
    vectorsBody2: 'La normalización mantiene la probabilidad total en el 100% — por eso cada punto al que puedes arrastrar en la esfera de Bloch es automáticamente un estado válido. El producto interno mide cuánto se superponen dos estados; los estados ortogonales (como |0⟩ y |1⟩) tienen producto interno 0.',
    matricesBody1: 'Cada puerta cuántica es una matriz. Aplicar una puerta a un qubit es simplemente una multiplicación de matriz por vector — la matriz de la puerta por el vector de estado da el nuevo vector de estado.',
    matricesFormula1: 'Pauli-X = [[0, 1], [1, 0]]',
    matricesFormula2: 'X|0⟩ = [[0,1],[1,0]]·[1,0]<sup>T</sup> = [0,1]<sup>T</sup> = |1⟩',
    matricesFormula3: 'Condición unitaria: U†U = I',
    matricesBody2: '"Unitaria" es la condición que toda puerta cuántica debe cumplir — U† (la traspuesta conjugada) deshace U exactamente. Es lo que garantiza que una puerta nunca destruye ni crea probabilidad: el estado de salida siempre está normalizado si el de entrada lo estaba.',
    svBody1: 'El vector de estado |ψ⟩ es la descripción completa de un qubit — todo lo que puedes predecir sobre él (probabilidades de medición, cómo responde a una puerta) se calcula a partir de estas dos amplitudes.',
    svFormula1: '|ψ⟩ = α|0⟩ + β|1⟩',
    svFormula2: 'Forma de Bloch: |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup>sin(θ/2)|1⟩',
    svFormula3: 'P(0) = |α|²&nbsp;&nbsp;&nbsp; P(1) = |β|²',
    svBody2: 'θ y φ son exactamente los dos deslizadores de la esfera de Bloch en Bits y Qubits — cada vector de estado corresponde a un punto de esa esfera, y viceversa.',
    compareStateSpaces: 'Comparar los Espacios de Estados',
    compareStateSpacesBody: 'Un bit clásico es un punto en una línea; un qubit es la punta de un vector sobre un arco unitario — elige una vista abajo.',
    svClassicalDesc: 'Solo dos extremos discretos',
    toggleBit: 'Cambiar bit',
    currentState: 'Estado Actual',
    stateSpace: 'Espacio de Estados',
    stateSpaceBody: 'Solo los dos extremos |0⟩ y |1⟩ son válidos. La región intermedia está físicamente prohibida — no existe un "47% |1⟩" para un bit clásico.',
    svQuantumDesc: 'Cualquier punto del arco unitario',
    keyInsight: 'Idea Clave',
    keyInsightBody: 'La punta del vector de estado debe situarse sobre el arco unitario (α² + β² = 1). Cada punto de ese arco es un estado cuántico distinto y válido. El bit clásico solo ocupa las dos esquinas.',
    diracBody1: 'Los símbolos |·⟩ y ⟨·| usados por toda esta aplicación son la notación "bra-ket" de Dirac — una abreviatura compacta para los vectores y sus productos internos.',
    diracFormula1: 'Ket: |ψ⟩ — un vector columna (un estado)',
    diracFormula2: 'Bra: ⟨ψ| — el vector fila traspuesto conjugado',
    diracFormula3: 'Bra-ket: ⟨φ|ψ⟩ — un producto interno (un número)',
    diracFormula4: '⟨0|0⟩ = 1&nbsp;&nbsp;&nbsp; ⟨0|1⟩ = 0&nbsp;&nbsp;&nbsp; ⟨1|1⟩ = 1',
    diracFormula5: 'Ket-bra: |ψ⟩⟨φ| — un producto externo (una matriz/operador)',
    diracBody2: '|0⟩ y |1⟩ son ortonormales — cada uno tiene longitud unitaria y superposición nula con el otro — que es exactamente la razón por la que medir siempre da un 0 o un 1 limpio, nunca algo intermedio.',
    tensorBody1: 'El producto tensorial (⊗) es la forma en que dos espacios vectoriales independientes se combinan en un único espacio conjunto más grande — se apila cada entrada del primer vector contra cada entrada del segundo, multiplicando cada par. Un vector de dimensión n combinado con uno de dimensión m produce un vector de dimensión n×m.',
    tensorFormula1: '[a, b]<sup>T</sup> ⊗ [c, d]<sup>T</sup> = [ac, ad, bc, bd]<sup>T</sup>',
    tensorBody2: 'Dos qubits independientes se combinan exactamente así: cada uno es un vector de 2 entradas, así que su estado conjunto es un vector de 4 entradas — una entrada por cada combinación de estados base, |00⟩, |01⟩, |10⟩, |11⟩.',
    tensorFormula2: '|0⟩⊗|0⟩ = [1,0]<sup>T</sup>⊗[1,0]<sup>T</sup> = [1,0,0,0]<sup>T</sup> = |00⟩',
    tensorBody3: 'Todo estado construido mediante el producto tensorial de dos estados de un solo qubit siempre puede factorizarse de nuevo en esos mismos dos qubits. Sin embargo, no todo vector de 4 entradas puede factorizarse así — un estado conjunto que no puede separarse de nuevo en un producto tensorial de dos estados de un solo qubit es precisamente lo que se llama entrelazado, explorado de forma práctica en la pestaña Entrelazar.'
  },
  gates: {
    title: 'Puertas',
    subtitle: 'Elige una puerta y observa su efecto inmediato — clásico o cuántico',
    classicalGates: 'Puertas Clásicas',
    quantumGates: 'Puertas Cuánticas',
    compareGates: 'Comparar',
    quantumTruthTableNote: 'La acción de cada puerta fija sobre los dos estados base — las puertas de rotación (Rx/Ry/Rz) no están incluidas porque su salida depende de un ángulo en tiempo de ejecución, no de una tabla fija.',
    compareClassicalDesc: 'NOT/AND/OR/XOR y sus negaciones — reglas estrictas y destructivas',
    compareQuantumDesc: 'H/X/Y/Z/S/T — siempre reversibles, pueden crear superposición',
    compareInsightTitle: 'La Diferencia Clave',
    compareInsightBody: 'Cada fila clásica de arriba colapsa información — AND, OR y compañía asignan múltiples combinaciones de entrada a la misma salida, así que no hay forma de volver a la entrada solo a partir de la salida. Cada fila cuántica es reversible: cada una es una matriz unitaria, así que aplicar después su propia traspuesta conjugada siempre recupera exactamente la entrada. Las puertas clásicas también solo pueden producir un 0 o un 1 definido; puertas cuánticas como H pueden producir una superposición genuina de ambos.',
    pickGate: 'Puerta — haz clic para elegir',
    inputA: 'Entrada A',
    inputB: 'Entrada B',
    resetToZero: 'Reiniciar a |0⟩',
    applyGate: 'Aplicar Puerta',
    gateReference: 'Referencia de Puertas',
    rotationGates: 'Puertas de Rotación',
    gateMatrix: 'Matriz de la Puerta',
    selectAGate: '← selecciona una puerta',
    whyReversibleTitle: 'Por Qué Toda Puerta Es Reversible',
    whyReversibleBody: 'Toda puerta de la izquierda es una matriz unitaria (U†U = I) — no por convención, sino porque una puerta es en realidad la propia evolución temporal del qubit según la ecuación de Schrödinger, que siempre conserva la probabilidad total. Una consecuencia directa: las puertas cuánticas nunca destruyen información. Aplica cualquier puerta y luego su traspuesta conjugada, y el qubit vuelve exactamente a donde empezó — no existe un equivalente cuántico de una puerta AND clásica que descarte silenciosamente un bit.',
    // Apodos/nombres formales para las seis puertas fijas (GATES en
    // js/core/gates.js) — `name` (la letra H/X/Y/Z/S/T) es notación y
    // nunca se traduce. El párrafo completo de `explain` es texto de
    // narración dinámica (construido en una frase interpolada en el
    // momento en que se aplica una puerta, ver applyGate() en
    // gates-tab.js) y queda fuera de alcance, igual que el resto de esa
    // categoría en toda la aplicación.
    H: { desc: 'La Moneda Giratoria', formalName: 'Puerta de Hadamard' },
    X: { desc: 'El Interruptor de Luz', formalName: 'Puerta de Pauli-X' },
    Y: { desc: 'La Voltereta', formalName: 'Puerta de Pauli-Y' },
    Z: { desc: 'El Movimiento Fantasma', formalName: 'Puerta de Pauli-Z' },
    S: { desc: 'El Cuarto de Vuelta', formalName: 'Puerta de fase (√Z)' },
    T: { desc: 'El Toque Susurrado', formalName: 'Puerta T (√S)' }
  },
  // Rx/Ry/Rz (ROTATION_GATES en js/core/gates.js) — separado de `gates`
  // arriba porque ambos usan las mismas claves de eje (X/Y/Z), que de lo
  // contrario colisionarían con las entradas propias de las puertas fijas
  // de Pauli-X/Y/Z allí.
  rotationGates: {
    X: { desc: 'Rotar alrededor del eje X', formalName: 'Rotación en el eje X' },
    Y: { desc: 'Rotar alrededor del eje Y', formalName: 'Rotación en el eje Y' },
    Z: { desc: 'Rotar alrededor del eje Z', formalName: 'Rotación en el eje Z' }
  },
  circuits: {
    title: 'Circuitos',
    subtitle: 'Las puertas clásicas combinan bits con reglas estrictas; los circuitos cuánticos guían un qubit por una ruta de puertas, acumulando rotaciones — elige un constructor abajo',
    classicalCircuit: 'Circuito Clásico',
    quantumCircuit: 'Circuito Cuántico',
    gatePalette: 'Paleta de Puertas — haz clic para añadir',
    companionBit: 'Bit acompañante — usado por las puertas de la familia AND/OR/XOR cuando se añaden',
    startBit: 'Bit Inicial',
    circuitWire: 'Cable del Circuito',
    whatsGoingOn: 'Qué está pasando',
    afterRunning: 'Después de ejecutar',
    truthTableStartOutput: 'Tabla de Verdad — bit inicial → salida',
    oneQubit: '1 Qubit',
    twoQubits: '2 Qubits',
    threeQubits: '3 Qubits',
    outputState: 'Estado de Salida',
    targetQubit2: 'Qubit Objetivo — las nuevas puertas se aplican a',
    gatePaletteTarget: 'Paleta de Puertas — haz clic para añadir al qubit objetivo',
    circuitDiagram: 'Diagrama del Circuito',
    outputState2Q: 'Estado de Salida (2 Qubits)',
    perQubitBlochSpheres: 'Esferas de Bloch por Qubit — se contraen hacia el centro cuando están entrelazados',
    targetQubit3: 'Qubit Objetivo — las nuevas puertas de un solo qubit se aplican a',
    addCnot: 'Añadir CNOT',
    outputState3Q: 'Estado de Salida (3 Qubits)',
    runHistory: 'Historial de Ejecución — haz clic en un paso para volver a verlo'
  },
  common: {
    run: '▶ Ejecutar',
    clear: 'Borrar',
    add: 'Añadir',
    reset: 'Reiniciar',
    controls: 'Controles',
    detector: 'Detector',
    tryMe: 'Pruébame',
    tryMePresets: '🎲 Pruébame — circuitos predefinidos',
    classical: 'Clásico',
    quantum: 'Cuántico',
    stateVector: 'Vector de Estado',
    copyShareableLink: 'Copiar enlace para compartir',
    basisStates: 'Estados Base',
    possibleStates: 'Estados posibles',
    uncertainty: 'Incertidumbre',
    uncertaintyFundamental: 'Fundamental — hasta ser medido',
    representation: 'Representación',
    output: 'Salida',
    whatJustHappened: 'Qué acaba de pasar',
    truthTable: 'Tabla de Verdad',
    appliedSequence: 'Secuencia Aplicada',
    gate: 'Puerta',
    input: 'Entrada'
  },
  mathsTab: {
    complexNumbers: 'Números Complejos',
    vectors: 'Vectores',
    matrices: 'Matrices',
    stateVector: 'Vector de Estado',
    diracNotation: 'Notación de Dirac',
    tensorProducts: 'Productos Tensoriales'
  },
  gatesTab: {
    classical: 'Clásico',
    quantum: 'Cuántico',
    compare: 'Comparar'
  },
  roadmap: {
    title: 'Conceptos Cuánticos',
    subtitle: 'Haz clic en cualquier concepto para abrir su simulación',
    conceptMap: 'Mapa de Conceptos',
    myProgress: 'Mi Progreso',
    lessonsCompleted: 'Lecciones Completadas',
    quickCheckScore: 'Puntuación de Comprobaciones Rápidas',
    lessonChecklist: 'Lista de Lecciones',
    resetProgress: 'Reiniciar progreso',
    read: 'leído',
    markUnread: 'Marcar como no leído',
    markAsRead: 'Marcar como leído',
    start: 'Comenzar →',
    quickCheck: 'Comprobación rápida',
    correct: 'correcto',
    review: 'repasar',
    notAttempted: 'Aún no intentado.',
    quizScoreSummary: '{correct} / {answered} comprobaciones rápidas correctas hasta ahora ({total} conceptos en total).',
    centerTooltip: '{count} conceptos fundamentales de computación cuántica, desde un solo qubit hasta el entrelazamiento y la interferencia de ondas — haz clic en cualquier tema para explorarlo.'
  },
  mindmap: {
    quantumWorld: 'Mundo Cuántico',
    introduction: 'Introducción',
    classical: 'Clásico',
    quantum: 'Cuántico',
    oneQubit: 'Un Qubit',
    twoQubits: 'Dos Qubits',
    threeQubits: 'Tres Qubits'
  },
  intro: {
    title: 'Introducción',
    subtitle: '¿Nuevo en la computación cuántica? Empieza aquí — no se necesita formación en física ni en programación.',
    classicalTitle: '¿INTRODUCCIÓN A LA COMPUTACIÓN CUÁNTICA?',
    classicalBody: 'Antes de aprender sobre los ordenadores cuánticos, empecemos con los ordenadores clásicos. Tu teléfono y tu ordenador usan bits para procesar información. Un bit solo tiene dos estados posibles: <b>0 (APAGADO) y 1 (ENCENDIDO)</b>',
    whatIsTitle: '¿QUÉ ES LA COMPUTACIÓN CUÁNTICA?',
    whatIsBody: 'La computación cuántica utiliza los principios de la mecánica cuántica para resolver ciertos problemas más rápido que los ordenadores clásicos.',
    bitsToQubitsTitle: 'De Bits a Qubits',
    bitsToQubitsBody: 'A diferencia de un bit, que es 0 o 1, un qubit puede existir en ambos estados al mismo tiempo. Esto se llama superposición.',
    superpositionTitle: 'Superposición: Múltiples Posibilidades',
    superpositionBody: 'Imagina que lanzas una moneda al aire. Mientras gira, representa tanto cara como cruz. De manera similar, un qubit puede representar tanto 0 como 1 hasta que se mide.',
    entanglementTitle: 'Entrelazamiento: Información Cuántica Conectada',
    entanglementBody: 'El entrelazamiento vincula dos o más qubits entre sí. Los cambios en un qubit están correlacionados con los demás, lo que permite a los ordenadores cuánticos procesar información de maneras nuevas y poderosas.',
    whyMattersTitle: 'Por Qué Importa la Computación Cuántica',
    whyMattersBody: 'Los ordenadores cuánticos no están diseñados para reemplazar portátiles o smartphones. Están construidos para resolver problemas complejos, como: <ul class="quantum-list"><li>🧪 Simular moléculas</li><li>⚙️ Optimizar sistemas grandes</li><li>🔐 Mejorar la criptografía</li><li>🌦️ Resolver problemas científicos y de ingeniería complejos</li></ul>',
    howAppWorksTitle: 'Cómo funciona esta aplicación',
    howAppWorksBody: 'Cada pestaña combina una breve lección con una simulación interactiva y una comprobación rápida. Explora los conceptos moviendo esferas de Bloch, aplicando puertas y ejecutando circuitos mientras ves los resultados actualizarse en tiempo real. Tu progreso se registra a medida que aprendes.',
    suggestedPath: 'Ruta de aprendizaje sugerida'
  },
  concepts: {
    title: 'Conceptos Importantes',
    subtitle: 'Un glosario de las ideas esenciales detrás de la mecánica cuántica y la computación cuántica — el vocabulario sobre el que se construye el resto de esta aplicación.',
    searchPlaceholder: 'Buscar conceptos…',
    searchNoResults: 'Ningún concepto coincide con "{query}".',
    mechanicsGroupTitle: 'Fundamentos de la Mecánica Cuántica',
    computingGroupTitle: 'Conceptos de Computación Cuántica',
    superpositionTitle: 'Superposición',
    superpositionBody: 'Un sistema cuántico puede existir en una combinación de múltiples estados a la vez, en lugar de estar fijado en uno solo — como un qubit que es en parte |0⟩ y en parte |1⟩ simultáneamente. No es que el sistema esté secretamente en un estado y simplemente no sepamos cuál; la combinación es el estado físico real, hasta que una medición lo obliga a decidirse por un resultado.',
    waveParticleTitle: 'Dualidad Onda-Partícula',
    waveParticleBody: 'Todo objeto cuántico — electrones, fotones, incluso qubits — se comporta como una onda en algunos experimentos (extendiéndose, interfiriendo consigo mismo) y como una partícula discreta en otros (llegando a un detector como un único clic localizado). Qué comportamiento aparece depende de qué se mide, no de que el objeto cambie de identidad.',
    quantumStateTitle: 'Estado Cuántico (Función de Onda)',
    quantumStateBody: 'La descripción matemática completa de un sistema cuántico — todo lo que se puede predecir sobre él, codificado en un conjunto de amplitudes complejas. Para un qubit, es el vector de estado de dos amplitudes |ψ⟩ = α|0⟩ + β|1⟩ explorado a lo largo de las pestañas Bits y Qubits y Concepto Matemático de esta aplicación.',
    bornRuleTitle: 'La Regla de Born',
    bornRuleBody: 'La regla que conecta las amplitudes de un estado cuántico con las probabilidades de medición: elevar al cuadrado el tamaño de una amplitud da la probabilidad de observar ese resultado. Para un qubit α|0⟩ + β|1⟩, eso es P(0) = |α|² y P(1) = |β|² — mira la pestaña Medir para verlo en acción.',
    collapseTitle: 'Colapso de la Función de Onda',
    collapseBody: 'En el momento en que ocurre una medición, un estado cuántico deja de ser una mezcla de posibilidades y se convierte en un único resultado definido — de forma irreversible. Las demás posibilidades no están ocultas en algún lugar; simplemente desaparecen, lo que hace que la medición cuántica sea fundamentalmente distinta de simplemente comprobar un valor que ya estaba fijado.',
    uncertaintyTitle: 'Principio de Incertidumbre de Heisenberg',
    uncertaintyBody: 'Ciertos pares de propiedades — como la posición y el momento de una partícula — nunca pueden conocerse ambos con precisión arbitraria al mismo tiempo. Esto no es una limitación de nuestros instrumentos; es una característica inherente a cómo se describen los estados cuánticos.',
    entanglementTitle: 'Entrelazamiento Cuántico',
    entanglementBody: 'El entrelazamiento cuántico es un fenómeno en el que dos o más partículas cuánticas quedan vinculadas de forma que el estado de una partícula no puede describirse independientemente de las demás, incluso cuando están separadas por grandes distancias. En su lugar, comparten un único estado cuántico conjunto.'
      + '<br><br>Medir una de las partículas entrelazadas revela instantáneamente lo que mostrarán las demás, sin importar la distancia que las separe — sin embargo, ninguna señal ni energía viaja realmente entre ellas en el momento de la medición. Esto puede parecer una comunicación más rápida que la luz, pero no lo es: el resultado de cada medición individual sigue siendo genuinamente aleatorio, así que no hay forma de codificar un mensaje usando solo el entrelazamiento. Explorado en profundidad en la pestaña Entrelazar.',
    interferenceTitle: 'Interferencia Cuántica',
    interferenceBody: 'Cuando un sistema cuántico tiene más de un camino indistinguible hacia el mismo resultado, las amplitudes de esos caminos se combinan — reforzándose en algunos puntos y cancelándose en otros — produciendo patrones (como las franjas del experimento de la doble rendija) que ningún camino podría producir por sí solo. Ver las pestañas Interferencia y Divisor de Haz.',
    tunnelingTitle: 'Efecto Túnel Cuántico',
    tunnelingBody: 'Una partícula cuántica tiene una probabilidad distinta de cero de aparecer al otro lado de una barrera de energía que clásicamente no debería poder cruzar, porque su función de onda no se detiene en seco en la barrera — se atenúa a través de ella en lugar de rebotar. Ver la pestaña Túnel para un paquete de ondas interactivo que golpea una barrera.',
    decoherenceTitle: 'Decoherencia',
    decoherenceBody: 'El proceso por el cual la frágil superposición y entrelazamiento de un sistema cuántico se disipan por la interacción inevitable con su entorno, haciendo que se comporte cada vez más como un sistema clásico. Es el principal obstáculo práctico para construir ordenadores cuánticos grandes y fiables.',
    schrodingerTitle: 'La Ecuación de Schrödinger',
    schrodingerBody: 'La ecuación maestra de la mecánica cuántica — describe exactamente cómo evoluciona un estado cuántico de forma continua en el tiempo, del mismo modo que las leyes de Newton describen el movimiento de un objeto clásico. Cada puerta cuántica de esta aplicación es en realidad solo una instantánea de la evolución de esta ecuación durante un intervalo de tiempo fijo, lo cual también explica por qué las puertas son reversibles: la ecuación nunca destruye información, solo la reconfigura.',
    bellTheoremTitle: 'El Teorema de Bell y la Paradoja EPR',
    bellTheoremBody: 'Einstein, Podolsky y Rosen argumentaron en 1935 que la mecánica cuántica debía estar incompleta — las correlaciones de las partículas entrelazadas, razonaron, podrían explicarse mediante alguna "variable oculta" compartida y fijada de antemano, sin ninguna rareza real. El teorema de Bell (1964) demostró que esto era incorrecto: ninguna teoría basada en variables ocultas puede reproducir jamás todas las correlaciones que predice la mecánica cuántica, y décadas de experimentos han confirmado las predicciones de la mecánica cuántica, no las de las variables ocultas.',
    zenoTitle: 'Efecto Zenón Cuántico',
    zenoBody: 'Medir un sistema cuántico con suficiente frecuencia puede congelar efectivamente su evolución — cada medición hace que el estado colapse de vuelta a lo que ya era, antes de que tenga oportunidad de evolucionar. Llamado así por la paradoja de Zenón de la flecha que nunca parece moverse, es una consecuencia directa del colapso de la función de onda: un estado cuántico "observado" cambia mucho más lentamente que uno no observado.',
    hilbertSpaceTitle: 'Espacio de Hilbert',
    hilbertSpaceBody: 'El "espacio" matemático donde vive todo estado cuántico. Cada estado cuántico posible se representa como un vector en un espacio de Hilbert, y las reglas de la mecánica cuántica — superposición, medición y evolución — se expresan todas como operaciones sobre estos vectores. Un solo qubit vive en un espacio de Hilbert de dos dimensiones, mientras que un sistema de n qubits vive en uno de 2ⁿ dimensiones.',
    linearOperatorsTitle: 'Operadores Lineales',
    linearOperatorsBody: 'Las magnitudes físicas y las puertas cuánticas se representan mediante operadores lineales que actúan sobre los estados cuánticos. Aplicar un operador transforma un estado cuántico válido en otro, haciendo del álgebra lineal el lenguaje de la mecánica cuántica.',
    observableTitle: 'Observable',
    observableBody: 'Un observable es cualquier propiedad física medible — como la posición, el momento, el espín o la energía. Cada observable está representado por un operador hermítico cuyos valores propios son los únicos resultados de medición que pueden ocurrir jamás.',
    eigenstatesTitle: 'Estados Propios y Valores Propios',
    eigenstatesBody: 'Si medir un observable siempre produce el mismo resultado para un estado cuántico particular, ese estado es un estado propio del observable. El resultado de la medición es el valor propio correspondiente. Medir un estado propio lo deja sin cambios, mientras que medir una superposición generalmente causa el colapso de la función de onda.',
    expectationValueTitle: 'Valor Esperado',
    expectationValueBody: 'En lugar de predecir un único resultado de medición definido, la mecánica cuántica predice el valor promedio obtenido al repetir el mismo experimento muchas veces sobre sistemas preparados de forma idéntica. Este promedio se llama el valor esperado.',
    probabilityAmplitudesTitle: 'Amplitudes de Probabilidad',
    probabilityAmplitudesBody: 'A diferencia de las probabilidades ordinarias, la mecánica cuántica asigna amplitudes de probabilidad complejas a los resultados posibles. Estas amplitudes pueden interferir de forma constructiva o destructiva, y solo sus módulos al cuadrado se convierten en probabilidades observables mediante la regla de Born.',
    phaseTitle: 'Fase',
    phaseBody: 'La fase de un estado cuántico es invisible en una sola medición, pero determina cómo interfieren las amplitudes. Es la fase relativa — no la fase absoluta — la que da su poder a la interferencia cuántica y a muchos algoritmos cuánticos.',
    globalPhaseTitle: 'Fase Global frente a Fase Relativa',
    globalPhaseBody: 'Multiplicar un estado cuántico completo por la misma fase compleja no cambia nada físicamente; esto se llama una fase global. Cambiar la fase entre las componentes de una superposición modifica los patrones de interferencia observables y por tanto tiene consecuencias físicas.',
    spinTitle: 'Espín',
    spinBody: 'El espín es una forma intrínseca de momento angular que portan las partículas cuánticas. A diferencia de una rotación ordinaria, el espín es una propiedad cuántica fundamental que solo toma valores discretos. El espín del electrón es la realización física de muchos qubits experimentales.',
    pauliExclusionTitle: 'Principio de Exclusión de Pauli',
    pauliExclusionBody: 'Dos fermiones idénticos nunca pueden ocupar el mismo estado cuántico simultáneamente. Esta regla simple explica la estructura de los átomos, la química, y por qué la materia permanece estable.',
    identicalParticlesTitle: 'Partículas Idénticas',
    identicalParticlesBody: 'Las partículas del mismo tipo son fundamentalmente indistinguibles. Intercambiar dos partículas idénticas no crea un nuevo estado físico — solo cambia la función de onda por un signo (fermiones) o no la cambia en absoluto (bosones).',
    bosonsFermionsTitle: 'Bosones y Fermiones',
    bosonsFermionsBody: 'Los bosones pueden compartir el mismo estado cuántico, lo que permite fenómenos como los láseres y los condensados de Bose-Einstein. Los fermiones obedecen el principio de exclusión de Pauli, dando lugar a la estructura atómica y a los materiales electrónicos.',
    densityMatrixTitle: 'Matriz de Densidad',
    densityMatrixBody: 'No todo sistema cuántico está perfectamente aislado. Una matriz de densidad describe tanto los estados cuánticos puros como las mezclas estadísticas, convirtiéndola en la herramienta estándar para describir sistemas cuánticos ruidosos o parcialmente conocidos.',
    mixedStatesTitle: 'Estados Mixtos',
    mixedStatesBody: 'A diferencia de una superposición, que es genuinamente cuántica, un estado mixto representa una incertidumbre clásica sobre en qué estado cuántico se encuentra realmente un sistema. Las matrices de densidad distinguen estas dos situaciones muy diferentes.',
    measurementBasisTitle: 'Base de Medición',
    measurementBasisBody: 'Una medición cuántica siempre se realiza respecto a una base elegida. El mismo estado puede parecer definido en una base mientras existe como una superposición en otra, lo que hace que la elección de la base sea central en la computación cuántica.',
    sternGerlachExpTitle: 'Experimento de Stern–Gerlach',
    sternGerlachExpBody: 'El experimento de Stern–Gerlach (1922), realizado por Otto Stern y Walther Gerlach, demostró que el momento angular está cuantizado — mostrando que partículas como los electrones poseen una propiedad intrínseca llamada espín, que solo puede tomar valores discretos al medirse a lo largo de un eje elegido. Es uno de los experimentos fundacionales de la mecánica cuántica.'
      + '<ul class="quantum-list">'
      + '<li><b>Objetivo:</b> determinar si el momento magnético de un átomo podía apuntar en cualquier dirección, como predecía la física clásica, o solo en orientaciones específicas y cuantizadas.</li>'
      + '<li><b>¿Por qué átomos de plata?</b> La plata tiene un único electrón de valencia no apareado y un momento angular orbital total prácticamente nulo, por lo que el momento magnético medido proviene casi enteramente del espín de ese único electrón — lo que hace que el resultado sea mucho más fácil de interpretar.</li>'
      + '<li><b>Predicción clásica:</b> un momento magnético orientado al azar debería desviarse en cualquier cantidad, difuminando el haz en una banda continua sobre la pantalla.</li>'
      + '<li><b>Lo que realmente se observó:</b> el haz se dividió en exactamente dos puntos distintos, no en una banda continua — mostrando que solo son posibles dos orientaciones de espín a lo largo del eje de medición, espín arriba (+ħ/2) y espín abajo (−ħ/2).</li>'
      + '</ul>'
      + 'Explóralo tú mismo, incluyendo qué ocurre al medir el espín a lo largo de un segundo eje incompatible, en la pestaña Stern–Gerlach.',
    eprParadoxTitle: 'Paradoja EPR',
    eprParadoxBody: 'La paradoja EPR (1935), propuesta por Albert Einstein, Boris Podolsky y Nathan Rosen, es un experimento mental que argumenta que la mecánica cuántica, tal como se planteaba, debía ser una descripción incompleta de la realidad física — no porque sus predicciones fueran erróneas, sino por lo que esas predicciones parecían implicar.'
      + '<ul class="quantum-list">'
      + '<li><b>Objetivo:</b> mostrar que si la mecánica cuántica es correcta y se cumple el "realismo local" — que una partícula tiene propiedades definidas independientemente de la medición, y que ninguna influencia viaja más rápido que la luz — entonces a la mecánica cuántica le debe faltar algo.</li>'
      + '<li><b>El montaje:</b> dos partículas se preparan en un estado entrelazado y se separan una distancia arbitrariamente grande. Medir una propiedad de una revela instantáneamente la propiedad correspondiente de la otra, con certeza.</li>'
      + '<li><b>El argumento:</b> dado que medir la partícula A permite predecir con certeza el resultado de la partícula B sin nunca tocarla, EPR razonaron que esa propiedad de B ya debía estar fijada antes de la medición — de lo contrario, medir A tendría que afectar a B instantáneamente, lo cual parecía una "acción fantasmal a distancia".</li>'
      + '<li><b>La paradoja:</b> la mecánica cuántica dice que las dos partículas comparten un único estado conjunto indeterminado hasta la medición. El propio razonamiento de EPR decía que eso era imposible si se respeta la localidad — así que, o bien la mecánica cuántica está incompleta, o la naturaleza realmente es no local en este sentido concreto.</li>'
      + '</ul>'
      + 'Durante treinta años esto siguió siendo una cuestión de interpretación sin respuesta experimental — hasta que el Teorema de Bell (ver arriba) lo convirtió en una pregunta comprobable, y los experimentos se decantaron claramente en contra de la intuición de Einstein sobre las variables ocultas.',
    qubitTitle: 'Qubit',
    qubitBody: 'La unidad básica de información cuántica — como un bit clásico, pero capaz de existir en una superposición de 0 y 1 en lugar de estar fijado a un solo valor. El estado exacto de un qubit se describe mediante dos amplitudes complejas y se visualiza como un punto en la esfera de Bloch, explorado en la pestaña Bits y Qubits.',
    blochSphereTitle: 'Esfera de Bloch',
    blochSphereBody: 'Una representación geométrica de todo estado posible de un solo qubit como un punto en la superficie de una esfera — los polos norte y sur son |0⟩ y |1⟩, y cualquier otro punto es alguna superposición de ambos. Convierte el álgebra abstracta de las amplitudes en algo que literalmente se puede ver y arrastrar.',
    gateTitle: 'Puerta Cuántica',
    gateBody: 'El equivalente cuántico de una puerta lógica clásica — una operación que transforma el estado de un qubit, geométricamente una rotación de su punto en la esfera de Bloch. A diferencia de las puertas clásicas, toda puerta cuántica es reversible: ninguna descarta jamás información. Ver la pestaña Puertas para las seis puertas fijas (H, X, Y, Z, S, T) y sus efectos.',
    unitarityTitle: 'Unitariedad y Reversibilidad',
    unitarityBody: 'Toda puerta cuántica válida debe ser una matriz unitaria (U†U = I) — la condición matemática que garantiza que preserva la probabilidad total y siempre puede deshacerse mediante su propia traspuesta conjugada. Por eso la computación cuántica, a diferencia de la lógica clásica AND/OR, nunca destruye información en el proceso.',
    circuitTitle: 'Circuito Cuántico',
    circuitBody: 'Una secuencia de puertas cuánticas aplicadas a uno o más qubits, leída de izquierda a derecha — el equivalente cuántico de un circuito lógico clásico. Como el orden de las puertas generalmente importa (las rotaciones no conmutan), el mismo conjunto de puertas en un orden distinto puede llevar a los qubits a un estado final completamente diferente; construye uno tú mismo en la pestaña Circuitos.',
    bellGhzTitle: 'Estados de Bell y Estados GHZ',
    bellGhzBody: 'Los estados de Bell son los cuatro estados específicos, máximamente entrelazados, de dos qubits — Φ⁺, Φ⁻, Ψ⁺ y Ψ⁻ — que forman una base ortonormal fundamental en información cuántica y el recurso central de protocolos como la teletransportación cuántica y la codificación superdensa. Los cuatro se producen con la misma receta de dos puertas (una puerta Hadamard sobre un qubit, seguida de una puerta CNOT controlada por él), partiendo simplemente de un estado base de dos qubits distinto cada vez.'
      + '<br><br>Los cuatro estados de Bell son:'
      + '<ul class="quantum-list">'
      + '<li><b>Φ⁺ = (|00⟩ + |11⟩)/√2</b> — los qubits coinciden y permanecen en fase.</li>'
      + '<li><b>Φ⁻ = (|00⟩ − |11⟩)/√2</b> — los qubits coinciden, con un cambio de fase.</li>'
      + '<li><b>Ψ⁺ = (|01⟩ + |10⟩)/√2</b> — los qubits son opuestos y están en fase.</li>'
      + '<li><b>Ψ⁻ = (|01⟩ − |10⟩)/√2</b> — los qubits son opuestos, con un cambio de fase.</li>'
      + '</ul>'
      + 'Medir uno de los dos qubits, en cualquiera de los cuatro estados, determina instantáneamente el resultado del otro. Los estados GHZ generalizan la misma idea a tres o más qubits, todos correlacionados entre sí — construye pares de Bell y tríos GHZ desde cero con puertas Hadamard y CNOT en la pestaña Circuitos.',
    noCloningTitle: 'Teorema de No Clonación',
    noCloningBody: 'Es físicamente imposible crear una copia exacta e independiente de un estado cuántico desconocido arbitrario — una consecuencia directa de que la mecánica cuántica es lineal. Por eso la información cuántica debe tratarse de forma tan distinta a los bits clásicos, que siempre pueden copiarse libremente.',
    algorithmsTitle: 'Algoritmos Cuánticos',
    algorithmsBody: 'Procedimientos paso a paso construidos con puertas cuánticas que explotan la superposición y la interferencia para resolver ciertos problemas mucho más rápido que cualquier algoritmo clásico conocido — el algoritmo de Shor factoriza números grandes eficientemente, y el algoritmo de Grover busca en una lista desordenada de forma cuadráticamente más rápida que cualquier búsqueda clásica.',
    errorCorrectionTitle: 'Corrección de Errores Cuánticos',
    errorCorrectionBody: 'Un conjunto de técnicas para proteger la frágil información cuántica de la decoherencia y el ruido, distribuyendo el estado de un único qubit lógico de forma redundante entre muchos qubits físicos, sin medir nunca directamente — y por tanto colapsar — la propia información. Uno de los principales retos de ingeniería que separan a los ordenadores cuánticos ruidosos de hoy de máquinas fiables a gran escala.',
    supremacyTitle: 'Supremacía / Ventaja Cuántica',
    supremacyBody: 'El hito en el que un ordenador cuántico realiza una tarea específica más rápido de lo que cualquier superordenador clásico podría manejar de forma factible — "supremacía" para una tarea de referencia (posiblemente artificial), "ventaja" para una tarea prácticamente útil. Demuestra que los efectos cuánticos pueden aprovecharse para un poder de cómputo real, no solo simularse en una máquina clásica.',
    teleportationTitle: 'Teletransporte Cuántico',
    teleportationBody: 'Un protocolo para transferir el estado exacto de un qubit desconocido a un qubit distante, usando un par entrelazado compartido más dos bits clásicos de comunicación — sin medir nunca directamente (y por tanto destruir) el estado original. A pesar del nombre, nada viaja más rápido que la luz: el receptor no puede reconstruir el estado hasta que llegan los bits clásicos ordinarios, y el estado del qubit original se destruye inevitablemente en el proceso, de forma consistente con el Teorema de No Clonación.',
    qkdTitle: 'Criptografía Cuántica (QKD)',
    qkdBody: 'La distribución cuántica de claves permite a dos partes acordar una clave secreta compartida con una seguridad garantizada por la física en lugar de por la dificultad computacional — protocolos como BB84 codifican los bits de la clave en estados de qubits de forma que cualquier medición de un espía los perturba inevitablemente, revelando la intrusión. Es un beneficio práctico directo del Teorema de No Clonación: un espía no puede copiar en secreto los qubits para inspeccionarlos sin ser detectado.',
    qftTitle: 'Transformada Cuántica de Fourier (QFT)',
    qftBody: 'El equivalente cuántico de la transformada discreta de Fourier clásica, implementada como un circuito cuántico que se ejecuta exponencialmente más rápido que cualquier equivalente clásico. Es la subrutina clave dentro del algoritmo de Shor — el paso que extrae la periodicidad oculta usada para factorizar números grandes — y aparece en muchos algoritmos cuánticos siempre que hay que extraer un patrón oculto de una superposición.',
    tensorProductTitle: 'Producto Tensorial',
    tensorProductBody: 'Varios qubits se combinan mediante el producto tensorial en lugar de la suma ordinaria. Dos qubits requieren por tanto cuatro amplitudes, tres qubits requieren ocho, y n qubits requieren 2ⁿ, que es el origen del enorme espacio de estados de la computación cuántica.',
    multiQubitStatesTitle: 'Estados de Múltiples Qubits',
    multiQubitStatesBody: 'Un sistema de varios qubits no siempre puede describirse como estados independientes de un solo qubit. Algunos estados se factorizan en qubits separados, mientras que otros se entrelazan y requieren una única descripción conjunta.',
    controlledGatesTitle: 'Puertas Controladas',
    controlledGatesBody: 'Las puertas controladas realizan una operación solo cuando otro qubit tiene un valor particular. La puerta CNOT es el ejemplo más simple y es el bloque de construcción esencial para crear entrelazamiento.',
    swapGateTitle: 'Puerta SWAP',
    swapGateBody: 'La puerta SWAP intercambia los estados cuánticos de dos qubits sin medirlos. Se usa ampliamente para mover información dentro de un procesador cuántico.',
    universalGateSetsTitle: 'Conjuntos Universales de Puertas',
    universalGateSetsBody: 'Una pequeña colección de puertas es suficiente para aproximar cualquier cómputo cuántico con precisión arbitraria. Los ejemplos incluyen {H, T, CNOT} y {Rx, Ry, CNOT}.',
    quantumParallelismTitle: 'Paralelismo Cuántico',
    quantumParallelismBody: 'Debido a que un ordenador cuántico puede preparar una superposición de muchas entradas simultáneamente, una operación actúa sobre todas ellas a la vez. El reto consiste en extraer información útil mediante interferencia en lugar de intentar leer cada resultado.',
    oracleTitle: 'Oráculo',
    oracleBody: 'Muchos algoritmos cuánticos tratan parte de un problema como una función de caja negra llamada oráculo. El algoritmo gana velocidad al consultar el oráculo en superposición cuántica.',
    ancillaQubitsTitle: 'Qubits Auxiliares (Ancilla)',
    ancillaQubitsBody: 'Los qubits auxiliares son qubits ayudantes temporales usados durante los cálculos, la corrección de errores y la aritmética, antes de ser reiniciados o descartados.',
    quantumMeasurementTitle: 'Medición Cuántica',
    quantumMeasurementBody: 'Aunque la medición ya se mencionó antes, la computación cuántica la trata de forma operacional. Medir un qubit convierte información cuántica frágil en un bit clásico ordinario, poniendo fin a la evolución coherente.',
    midCircuitMeasurementTitle: 'Medición a Mitad de Circuito',
    midCircuitMeasurementBody: 'Algunos ordenadores cuánticos permiten mediciones durante el cómputo en lugar de solo al final. Las puertas posteriores pueden depender de estos resultados de medición, permitiendo la corrección de errores y algoritmos adaptativos.',
    classicalFeedforwardTitle: 'Realimentación Clásica (Feedforward)',
    classicalFeedforwardBody: 'Los resultados de medición obtenidos durante un circuito cuántico pueden determinar qué puertas posteriores deben aplicarse, combinando control clásico con evolución cuántica.',
    quantumInfoGroupTitle: 'Teoría de la Información Cuántica',
    quantumInformationTitle: 'Información Cuántica',
    quantumInformationBody: 'La información cuántica es información almacenada en estados cuánticos. A diferencia de la información clásica, puede explotar la superposición y el entrelazamiento, habilitando formas completamente nuevas de computación y comunicación.',
    quantumChannelTitle: 'Canal Cuántico',
    quantumChannelBody: 'Un canal cuántico describe matemáticamente cómo cambia la información cuántica al viajar por el espacio o interactuar con el ruido.',
    fidelityTitle: 'Fidelidad',
    fidelityBody: 'La fidelidad mide cuán similares son dos estados cuánticos. Se usa ampliamente para evaluar el hardware cuántico, las puertas y la corrección de errores.',
    traceDistanceTitle: 'Distancia de Traza',
    traceDistanceBody: 'La distancia de traza cuantifica cuán distinguibles son dos estados cuánticos. Proporciona la probabilidad máxima de diferenciarlos usando cualquier medición posible.',
    entanglementEntropyTitle: 'Entropía de Entrelazamiento',
    entanglementEntropyBody: 'Una medida numérica de cuán fuertemente están entrelazadas distintas partes de un sistema cuántico. Desempeña un papel central en la física de la materia condensada, la teoría cuántica de campos y la gravedad cuántica.',
    stateTomographyTitle: 'Tomografía de Estado Cuántico',
    stateTomographyBody: 'Una técnica para reconstruir un estado cuántico desconocido realizando muchas mediciones en diferentes bases.',
    processTomographyTitle: 'Tomografía de Procesos',
    processTomographyBody: 'En lugar de reconstruir un estado, la tomografía de procesos reconstruye una puerta u operación cuántica desconocida estudiando cómo transforma muchos estados de entrada conocidos.',
    advancedGroupTitle: 'Computación Cuántica Avanzada',
    vqeQaoaTitle: 'Algoritmos Cuánticos Variacionales (VQE y QAOA)',
    vqeQaoaBody: 'Los algoritmos cuánticos variacionales son algoritmos híbridos cuántico-clásicos en los que un ordenador cuántico prepara estados cuánticos parametrizados mientras un ordenador clásico ajusta repetidamente esos parámetros para optimizar un objetivo deseado. Este bucle de retroalimentación iterativo los hace muy adecuados para el hardware cuántico ruidoso actual (dispositivos NISQ).'
      + '<br><br>Los dos ejemplos más conocidos son:'
      + '<ul class="quantum-list">'
      + '<li><b>Variational Quantum Eigensolver (VQE):</b> Diseñado para estimar el estado de menor energía (estado fundamental) de un sistema cuántico. Se usa ampliamente en química cuántica, ciencia de materiales y simulación hamiltoniana para estudiar moléculas y materiales cuánticos.</li>'
      + '<li><b>Quantum Approximate Optimization Algorithm (QAOA):</b> Diseñado para encontrar soluciones aproximadas de alta calidad a problemas difíciles de optimización combinatoria — como enrutamiento, planificación, particionado de grafos y optimización de carteras — alternando operaciones cuánticas específicas del problema con operaciones de mezcla.</li>'
      + '</ul>'
      + 'VQE y QAOA están entre los algoritmos cuánticos más prometedores para los ordenadores cuánticos ruidosos de escala intermedia (NISQ) actuales, porque reducen la profundidad de los circuitos cuánticos a la vez que aprovechan la optimización clásica.',
    nisqTitle: 'Computación NISQ',
    nisqBody: 'La era actual de los ordenadores cuánticos se llama la era NISQ (Noisy Intermediate-Scale Quantum, cuántica ruidosa de escala intermedia): los dispositivos contienen desde decenas hasta miles de qubits imperfectos, pero todavía no pueden ejecutar algoritmos plenamente tolerantes a fallos.',
    faultTolerantTitle: 'Computación Cuántica Tolerante a Fallos',
    faultTolerantBody: 'Una futura generación de ordenadores cuánticos capaces de realizar cómputos de duración arbitraria a pesar de los errores de hardware, mediante la corrección de errores cuánticos.',
    surfaceCodeTitle: 'Código de Superficie',
    surfaceCodeBody: 'El principal código de corrección de errores cuánticos, que codifica un qubit lógico en muchos qubits físicos dispuestos en una red bidimensional.',
    logicalPhysicalQubitsTitle: 'Qubits Lógicos frente a Qubits Físicos',
    logicalPhysicalQubitsBody: 'Los qubits físicos son los qubits de hardware que sufren ruido. Los qubits lógicos son qubits protegidos y corregidos frente a errores, codificados a través de muchos qubits físicos.',
    magicStatesTitle: 'Estados Mágicos',
    magicStatesBody: 'Ciertas puertas cuánticas no pueden implementarse directamente en muchas arquitecturas tolerantes a fallos. En su lugar, se consumen "estados mágicos" especialmente preparados para realizarlas, lo que convierte a la destilación de estados mágicos en uno de los mayores costes de la computación cuántica a gran escala.',
    hamiltonianSimulationTitle: 'Simulación Hamiltoniana',
    hamiltonianSimulationBody: 'Una de las motivaciones originales de la computación cuántica: simular eficientemente la dinámica de moléculas, materiales y teorías cuánticas de campos gobernadas por un hamiltoniano. Muchos investigadores — incluidos quienes trabajan en teorías de gauge en el retículo y química cuántica — consideran esto una de las aplicaciones a largo plazo más importantes de los ordenadores cuánticos.',
    qpeTitle: 'Estimación de Fase Cuántica (QPE)',
    qpeBody: 'Un algoritmo cuántico fundamental para estimar los valores propios de operadores unitarios. Sustenta el algoritmo de Shor y muchos algoritmos de química cuántica y simulación hamiltoniana.',
    adiabaticQCTitle: 'Computación Cuántica Adiabática',
    adiabaticQCBody: 'Un modelo de cómputo en el que el sistema permanece en su estado fundamental mientras su hamiltoniano cambia lentamente. Si la evolución es suficientemente lenta, el estado fundamental final codifica la solución de un problema de optimización.',
    mbqcTitle: 'Computación Cuántica Basada en Medición',
    mbqcBody: 'En lugar de computar principalmente con puertas, el cómputo procede preparando un gran estado de recurso entrelazado (un estado de clúster) y luego realizando mediciones cuidadosamente elegidas. Las propias mediciones son las que impulsan el cómputo.'
  },
  measure: {
    title: 'Medición',
    subtitle: 'Las barras de abajo son probabilidades, no una vista previa — medir obliga al qubit a responder a una pregunta que genuinamente tenía sin decidir, y no hay vuelta atrás',
    quantumState: 'Estado Cuántico',
    measureButton: 'MEDIR',
    postulateTitle: 'El Postulado de la Medición',
    postulateBody1: 'Esto no es solo una simplificación de la aplicación — es uno de los axiomas de la mecánica cuántica. Medir un qubit |ψ⟩ = α|0⟩ + β|1⟩ da 0 con probabilidad |α|² y 1 con probabilidad |β|² (la regla de Born), e inmediatamente después el estado colapsa al resultado obtenido — la otra posibilidad simplemente desaparece, no solo queda oculta.',
    postulateFormula: 'P(0) = |α|²&nbsp;&nbsp;&nbsp; P(1) = |β|²&nbsp;&nbsp;&nbsp; α|0⟩ + β|1⟩ → |0⟩ o |1⟩',
    postulateBody2: 'Nota lo que falta: nada en esta regla dice qué resultado obtendrás en una sola ejecución — solo las probabilidades a lo largo de muchos qubits idénticos, que es exactamente para lo que sirve el histograma de abajo.',
    measurementStatistics: 'Estadísticas de Medición',
    confirmOddsBody: 'Esta es la única forma de confirmar realmente esas probabilidades — hacer la misma pregunta a muchos qubits idénticos y observar cómo el histograma se asienta en la distribución prevista. Un solo qubit siempre te da una única respuesta; el patrón solo aparece en una multitud.'
  },
  entangle: {
    title: 'Entrelazamiento Cuántico',
    subtitle: 'Estado de Bell (|00⟩ + |11⟩)/√2 — ningún qubit tiene un estado definido por separado; medir uno determina instantáneamente el otro',
    bannerAlt: 'Ilustración de la analogía de la moneda para el entrelazamiento cuántico: dos personas lanzan cada una una moneda en detectores separados, conectados por una esfera luminosa de conos de correlación — sea cual sea el resultado de la Moneda A, la Moneda B cae instantáneamente al lado opuesto, con el estado indeterminado hasta que se mide.',
    jointStateLabel: 'estado conjunto de ambos qubits',
    explainerTitle: '¿Qué Es el Entrelazamiento Cuántico?',
    explainerBody1: 'El entrelazamiento cuántico es un fenómeno en el que dos o más partículas quedan vinculadas de forma que sus estados cuánticos ya no pueden describirse independientemente el uno del otro — incluso cuando las partículas están separadas por enormes distancias. En lugar de dos qubits separados, cada uno con su propio estado, el par comparte un único estado conjunto, como el estado de Bell (|00⟩ + |11⟩)/√2 mostrado arriba: una mezcla 50/50 de "ambos medidos en 0" y "ambos medidos en 1", sin ninguna forma de descomponerlo en lo que hace el qubit A o el qubit B por separado.',
    explainerBody2: 'El entrelazamiento no lo produce ninguna fuerza misteriosa que conecte las partículas — se crea localmente, en el momento en que dos qubits interactúan (aquí, con una puerta Hadamard seguida de una CNOT — construye la misma receta puerta por puerta en la pestaña Circuitos), y persiste después sin importar la distancia que los qubits recorran más tarde. Einstein llamó célebremente a las correlaciones resultantes "acción fantasmal a distancia", ya que medir un qubit parece afectar instantáneamente al otro.',
    explainerBody3: 'Las dos tarjetas de abajo desarrollan los detalles detrás de esa intuición: por qué un estado así realmente no puede describirse como dos qubits separados, y por qué la correlación instantánea sigue sin poder usarse para enviar una señal más rápida que la luz.',
    mapCaption: 'Dos ubicaciones distintas, arbitrariamente alejadas — la correlación se mantiene sin importar la distancia entre ellas.',
    entangledLabel: 'Entrelazado',
    measureBoth: 'Medir Ambos',
    measureAOnly: 'Medir Solo A',
    tensorTitle: '¿Por Qué Esto No Son Solo Dos Qubits? (Productos Tensoriales)',
    tensorBody1: 'Dos qubits independientes siempre se combinan mediante el <span class="key-term">producto tensorial</span> (⊗): se apila el vector de 2 entradas del qubit A junto al del qubit B, multiplicando cada par de entradas para formar un vector conjunto de 4 entradas. Todo estado producto — cualquiera que puedas construir en el panel Dos Qubits de la pestaña Bits y Qubits — se factoriza de nuevo en dos qubits separados de esta forma:',
    tensorFormula1: '|0⟩⊗|0⟩ = [1,0]<sup>T</sup>⊗[1,0]<sup>T</sup> = [1,0,0,0]<sup>T</sup> = |00⟩',
    tensorBody2: 'El estado de Bell de arriba es también un vector de 4 entradas — [1,0,0,1]<sup>T</sup>/√2 — pero intenta factorizarlo de vuelta como [a,b]<sup>T</sup>⊗[c,d]<sup>T</sup> = [ac,ad,bc,bd]<sup>T</sup> y no hay solución: <em>ad</em> = 0 y <em>bc</em> = 0 obligan a que uno de cada par sea cero, lo que también anularía <em>ac</em> o <em>bd</em> — ningún par de estados de un solo qubit A y B se multiplica para reproducirlo.',
    tensorFormula2: '(|00⟩ + |11⟩) / √2 = [1, 0, 0, 1]ᵀ/√2 ≠ [a,b]ᵀ ⊗ [c,d]ᵀ para cualesquiera a, b, c, d',
    tensorBody3: 'Esa es la definición literal y comprobable del entrelazamiento: un estado conjunto que no puede separarse de nuevo en dos factores independientes de un solo qubit. Ninguno de los dos qubits tiene por separado un estado bien definido — solo lo tiene el par.',
    relativityTitle: 'Por Qué Esto No Viola la Relatividad',
    relativityBody1: 'Este montaje es una versión del experimento mental de Einstein-Podolsky-Rosen (EPR): Alice mide el Qubit A y conoce instantáneamente el resultado del Qubit B, incluso si B está a años luz de distancia. Parece una señal más rápida que la luz — pero no lo es.',
    relativityBody2: 'Alice no puede elegir qué resultado obtiene — sigue siendo aleatorio, con las mismas probabilidades de 50/50 que cualquier qubit individual. Así que no hay nada que ella pueda controlar, y por lo tanto nada que pueda codificar en un mensaje. La correlación solo es visible después del hecho, una vez que Alice y Bob comparan sus notas a través de un canal ordinario (más lento que la luz). En el momento de la medición, ninguna energía, información ni señal cruza realmente la distancia entre ellos.'
  },
  bellstates: {
    title: 'Estados de Bell',
    subtitle: 'Los cuatro estados de dos qubits máximamente entrelazados — elige uno para ver cómo se construye, cómo se clasifica y qué predice exactamente',
    pickTitle: 'Elige un Estado de Bell',
    circuitTitle: 'Diagrama del Circuito',
    recipe: {
      phiplus: 'Empieza en |00⟩, aplica H al qubit A, luego CNOT (A → B).',
      phiminus: 'Empieza en |00⟩, aplica X al qubit A, luego H al qubit A, luego CNOT (A → B).',
      psiplus: 'Empieza en |00⟩, aplica X al qubit B, luego H al qubit A, luego CNOT (A → B).',
      psiminus: 'Empieza en |00⟩, aplica X a ambos qubits, luego H al qubit A, luego CNOT (A → B).'
    },
    familyTitle: 'La Familia de Bell',
    familyBody: 'Cada estado de Bell ocupa una de cuatro esquinas, determinada por dos elecciones independientes: la fila (resultados de medición iguales u opuestos) y la columna (una fase relativa + o −). Haz clic en cualquier esquina para prepararla.',
    plusPhase: 'fase +',
    minusPhase: 'fase −',
    sameRow: 'Iguales',
    oppositeRow: 'Opuestos',
    distributionTitle: 'Distribución de Probabilidad',
    distributionNote: 'Probabilidades exactas de la regla de Born para {symbol} — no hace falta muestrear, se obtienen directamente al elevar al cuadrado cada amplitud.',
    definitionsTitle: 'Los Cuatro Estados de Bell',
    definitionsBody: 'Los cuatro se construyen desde el mismo punto de partida |00⟩ con la misma receta de dos puertas — una Hadamard en el qubit A, luego una CNOT controlada por él — precedida simplemente de una puerta X en el qubit o qubits que haya que invertir primero:'
      + '<ul class="quantum-list">'
      + '<li><b>Φ⁺ = (|00⟩ + |11⟩)/√2</b> — sin puertas X. Los resultados siempre coinciden.</li>'
      + '<li><b>Φ⁻ = (|00⟩ − |11⟩)/√2</b> — puerta X en el qubit A primero. Los resultados siempre coinciden.</li>'
      + '<li><b>Ψ⁺ = (|01⟩ + |10⟩)/√2</b> — puerta X en el qubit B primero. Los resultados siempre son opuestos.</li>'
      + '<li><b>Ψ⁻ = (|01⟩ − |10⟩)/√2</b> — puerta X en ambos qubits primero. Los resultados siempre son opuestos.</li>'
      + '</ul>'
      + 'Juntos forman una base ortonormal completa para dos qubits — el recurso central detrás de la teleportación cuántica y la codificación superdensa.',
    phaseNoteTitle: '¿Por Qué No Se Nota el Signo Menos?',
    phaseNoteBody: 'Φ⁺ y Φ⁻ (y del mismo modo Ψ⁺ y Ψ⁻) dan distribuciones de probabilidad idénticas arriba, porque una fase relativa — el signo − — no cambia ninguna probabilidad en la base computacional; solo importa |amplitud|². Los dos estados siguen siendo físicamente distintos: la fase se vuelve visible en el momento en que se hace interferir a los qubits entre sí, por ejemplo aplicando una puerta Hadamard a cada uno antes de medir — ese es exactamente el paso adicional en el que se apoyan las pruebas de las desigualdades de Bell y la codificación superdensa para distinguir los cuatro estados.'
  },
  tunnel: {
    title: 'Efecto Túnel Cuántico',
    subtitle: 'Dispara un paquete de ondas contra una pared más alta que su propia energía. Clásicamente siempre rebota. Cuánticamente, una parte logra atravesarla de todos modos',
    reflected: 'Reflejado',
    transmitted: 'Transmitido',
    barrier: 'Barrera',
    fireAgain: '↻ Disparar de nuevo'
  },
  interference: {
    title: 'Interferencia de Ondas',
    subtitle: 'Dos caminos abiertos y una pantalla que lleva la cuenta. Cada punto de la derecha es una partícula que llega — y sin embargo juntos dibujan una onda',
    screen: 'Pantalla',
    setup: 'Configuración',
    doubleSlit: 'Doble rendija',
    singleSlit: 'Rendija simple',
    whichPath: 'Cuál camino',
    wave: 'Onda',
    clearAccumulation: 'Borrar acumulación',
    physicsInDetail: 'La Física, En Detalle',
    body1: 'Cada punto en la pantalla es una partícula que llega a un solo lugar — esa parte es completamente normal. Lo que no es normal es <em>dónde</em> se les permite llegar a esos puntos. Dispara partículas contra la doble rendija de una en una, sin que dos partículas puedan encontrarse nunca a mitad de vuelo, y los puntos igualmente se acumulan formando franjas. No hay una multitud de partículas interfiriendo entre sí — la propia función de onda de cada partícula individual pasa por <em>ambas</em> rendijas a la vez e interfiere consigo misma. Ese es el verdadero misterio aquí, no solo "las ondas forman patrones."',
    formula: 'I(y) = |A<sub>1</sub>(y) + A<sub>2</sub>(y)|² = |A<sub>1</sub>|² + |A<sub>2</sub>|² + 2|A<sub>1</sub>||A<sub>2</sub>|cos φ(y)',
    body2: 'A<sub>1</sub> y A<sub>2</sub> son las amplitudes de "la partícula pasó por la rendija 1" y "por la rendija 2", y φ(y) es la distancia extra que recorre un camino para llegar al punto y, convertida en fase. Las probabilidades clásicas simplemente se sumarían: P = P<sub>1</sub> + P<sub>2</sub>, un montón plano sin franjas. Las amplitudes cuánticas se suman primero y se elevan al cuadrado después — y elevar una suma al cuadrado produce ese término cruzado <strong>2|A<sub>1</sub>||A<sub>2</sub>|cos φ</strong>, que es positivo en algunos valores de y (franjas brillantes), negativo en otros (franjas oscuras), y es la razón entera por la que existen las franjas.',
    body3: '<strong>Doble rendija</strong> — ambos caminos permanecen abiertos y son genuinamente indistinguibles, así que el término cruzado sobrevive y obtienes franjas. <strong>Rendija simple</strong> — solo existe una amplitud, así que no hay nada con qué interferir; I = |A<sub>1</sub>|², una simple mancha de difracción. <strong>Cuál camino</strong> — ambas rendijas siguen físicamente abiertas, pero etiquetar el camino de cada partícula (los pequeños puntos detectores en la placa) hace que exista una medición de cuál camino para cada impacto. Promediado sobre esas mediciones, el término cruzado se cancela exactamente, dejando el I = |A<sub>1</sub>|² + |A<sub>2</sub>|² plano que esperarías de partículas ordinarias — dos protuberancias, sin franjas. No hace falta perturbar físicamente la partícula para que esto ocurra; basta con que el camino sea <em>conocible en principio</em> para borrar el patrón.',
    body4: 'Por eso la animación de ondulaciones a la izquierda y la pantalla punto a punto a la derecha se muestran una junto a la otra: las ondulaciones son la imagen de onda continua que predice dónde el término cruzado es constructivo o destructivo, y la pantalla es lo que realmente se mide — un clic aleatorio y de todo-o-nada a la vez. La onda nunca llega a ningún sitio; solo lo hace la partícula. Las franjas son la huella de la onda en dónde a las partículas se les permitió hacer clic y dónde no.'
  },
  beamsplitter: {
    title: 'Divisor de Haz',
    subtitle: 'Un solo fotón incide en un divisor de haz 50/50 y es reflejado al detector A o transmitido al detector B de forma aleatoria — un fotón, un resultado aleatorio, nunca un fotón partido por la mitad',
    svgAlt: 'Diagrama de una fuente de fotones disparando contra un divisor de haz 50/50, reflejado hacia arriba al detector A o transmitido hacia la derecha al detector B. Un duplicado tenue aparece brevemente en el camino no elegido, ilustrando la superposición que existía antes de que el fotón fuera detectado.',
    photonSource: 'Fuente de fotones',
    reflected: 'reflejado',
    transmitted: 'transmitido',
    beamSplitterLabel: 'Divisor de haz',
    detectorA: 'Detector de fotones A',
    detectorB: 'Detector de fotones B',
    firePhoton: 'Disparar fotón',
    detectorTally: 'Conteo de Detectores'
  },
  sterngerlach: {
    title: 'Experimento de Stern–Gerlach',
    subtitle: 'Envía átomos uno a uno a través de un campo magnético y observa cómo el espín — una propiedad puramente cuántica — se revela como un pequeño número de puntos discretos, nunca una mancha continua',
    svgAlt: 'Diagrama de un horno que emite átomos de plata a través de rendijas colimadoras hacia un imán de Stern-Gerlach con un polo sur en forma de filo de cuchillo arriba y un polo norte ancho y curvado abajo, dividiendo el haz hacia un detector Arriba o un detector Abajo según el espín del átomo.',
    atomSource: 'Horno',
    silverAtomsArrow: 'Átomos de plata',
    collimatingSlits: 'Rendijas colimadoras',
    magnetLabel: 'Campo no homogéneo',
    detectorUp: 'Detector Arriba',
    detectorDown: 'Detector Abajo',
    fireAtom: 'Disparar átomo',
    inputSpinTitle: 'Ángulo de Espín de Entrada',
    inputSpinBody: 'El mismo θ que en la esfera de Bloch — θ = 0° prepara un espín seguro hacia arriba, θ = 180° seguro hacia abajo, y cualquier valor intermedio es una superposición genuina de ambos.',
    detectorTally: 'Recuento de Detectores',
    whyTwoSpotsTitle: '¿Por Qué Solo Dos Puntos?',
    whyTwoSpotsBody: 'La fuerza de desviación proviene del <em>gradiente</em> del campo, no solo de su intensidad: F<sub>z</sub> ≈ μ<sub>z</sub>·∂B<sub>z</sub>/∂z, donde μ<sub>z</sub> es el momento magnético del átomo a lo largo del eje del campo. Un campo uniforme (∂B<sub>z</sub>/∂z = 0) no ejercería ninguna fuerza neta, sin importar hacia dónde apuntara el momento — por eso exactamente los dos polos de arriba tienen formas diferentes en lugar de ser simplemente imanes potentes: solo un campo genuinamente no homogéneo produce alguna desviación.',
    whyTwoSpotsFormula: 'F<sub>z</sub> ≈ μ<sub>z</sub> (∂B<sub>z</sub> / ∂z) &nbsp;&nbsp;&nbsp; si B es uniforme ⇒ F = 0',
    whyTwoSpotsBody2: 'Clásicamente, μ<sub>z</sub> podría apuntar en cualquier dirección, así que un haz de átomos orientados al azar debería difuminarse continuamente por la pantalla, desde una desviación total hacia arriba hasta una desviación total hacia abajo. Cuando Stern y Gerlach realizaron realmente este experimento en 1922, los átomos de plata aterrizaron en exactamente dos puntos discretos — nada intermedio, sin importar cómo se inclinara el imán. Esa es la misma cuantización ya integrada en cada qubit de esta aplicación: una medición devuelve uno de exactamente dos resultados, nunca un resultado parcial.',
    sequentialTitle: 'Medir Dos Veces: Por Qué Importa el Orden',
    sequentialIntro: 'Cada átomo de abajo ya tiene un espín definido — es la salida "arriba" de un primer imán, con la mitad "abajo" físicamente bloqueada. Ahora envíalo a través de un segundo imán:',
    sameAxis: 'Mismo eje (Z)',
    differentAxis: 'Eje diferente (X)',
    svg2Alt: 'Diagrama de un átomo preparado con espín hacia arriba a lo largo de Z entrando en un segundo imán de Stern-Gerlach con un polo sur en forma de filo de cuchillo y un polo norte curvado, dividiéndose hacia un detector más o un detector menos según el eje del segundo imán.',
    preparedLabel: 'preparado: espín ↑ (Z)',
    blockedLabel: '(mitad "abajo" bloqueada)',
    magnet2AxisZ: 'Imán 2 — eje Z',
    magnet2AxisX: 'Imán 2 — eje X',
    resultTravelling: 'en camino…',
    resultUp: 'El detector Arriba hizo clic',
    resultDown: 'El detector Abajo hizo clic',
    explainerUp: 'El detector Arriba hizo clic — uno de exactamente dos resultados posibles, nunca una desviación parcial. Dispara de nuevo y el mismo estado del átomo aún puede caer Abajo; solo las probabilidades son fijas, no un resultado concreto.',
    explainerDown: 'El detector Abajo hizo clic — uno de exactamente dos resultados posibles, nunca una desviación parcial. Dispara de nuevo y el mismo estado del átomo aún puede caer Arriba; solo las probabilidades son fijas, no un resultado concreto.',
    explainerDefault: 'Un átomo está a punto de entrar en el imán. Dispáralo y observa qué detector hace clic.',
    trialCount: '· {count} átomos',
    sequentialExplainerZ: 'Mismo eje que antes — dispara un átomo para confirmar que siempre cae de la misma forma.',
    sequentialExplainerX: 'Un eje diferente esta vez — dispara un átomo para ver qué le pasa a un espín que ya era definido a lo largo de Z.',
    result2Plus: 'El detector "+" hizo clic',
    result2Minus: 'El detector "−" hizo clic',
    explainer2Z: 'Medir el mismo eje dos veces seguidas solo confirma el resultado anterior — nada sorprendente aquí. Dispara tantas veces como quieras: siempre caerá en "+".',
    explainer2X: 'Aunque este átomo tenía un espín perfectamente definido a lo largo de Z, medir un eje diferente e incompatible (X) borró esa información y produjo un resultado nuevo, genuinamente aleatorio. Este es el corazón del descubrimiento de Stern–Gerlach: medir una propiedad puede perturbar otra que no conmuta con ella.'
  },
  // Refleja ROADMAP_LESSONS en js/roadmap.js exactamente (mismos ids,
  // mismo contenido de title/body) — ese archivo mantiene sus propias
  // copias en inglés como respaldo de la búsqueda t() (ver
  // buildLessonInfoHTML()), así que ambos solo necesitan coincidir en
  // esta extracción inicial, no mantenerse sincronizados a mano después.
  lessons: {
    qubit: {
      title: 'Bits',
      body: 'Un bit clásico siempre es, de forma definitiva, 0 o 1. Un qubit puede estar en una superposición de ambos a la vez, descrita por dos amplitudes en lugar de un único valor. La esfera de Bloch le da a cada posible estado de un qubit un punto en su superficie.'
    },
    'maths-complex': {
      title: 'Números Complejos',
      body: 'Las amplitudes de un qubit son números complejos, no solo reales — cada una tiene una parte real y una imaginaria, z = a + bi. Solo el módulo al cuadrado |z|² es directamente observable como probabilidad; la fase es invisible en una sola medición, pero es exactamente lo que impulsa la interferencia.'
    },
    'maths-vectors': {
      title: 'Vectores',
      body: 'El estado de un qubit es un vector columna [α, β] en un espacio vectorial complejo 2D, con |0⟩ y |1⟩ como base. La normalización |α|² + |β|² = 1 mantiene la probabilidad total en el 100%, y el producto interno mide cuánto se superponen dos estados.'
    },
    'maths-matrices': {
      title: 'Matrices',
      body: 'Cada puerta cuántica es una matriz unitaria (U†U = I) que actúa sobre el vector de estado mediante multiplicación matricial. La unitariedad garantiza que una puerta nunca destruye ni crea probabilidad — que es exactamente la razón por la que toda puerta cuántica es reversible.'
    },
    'maths-statevector': {
      title: 'Vector de Estado',
      body: 'El vector de estado |ψ⟩ = α|0⟩ + β|1⟩ es la descripción completa de un qubit. En forma de esfera de Bloch, |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ — θ y φ son exactamente los dos deslizadores de la esfera de Bloch en Bits y Qubits.'
    },
    'maths-dirac': {
      title: 'Notación de Dirac',
      body: 'La notación bra-ket de Dirac es una abreviatura para los vectores y sus productos internos: |ψ⟩ es un ket, ⟨ψ| su bra, y ⟨φ|ψ⟩ su producto interno. |0⟩ y |1⟩ son ortonormales — ⟨0|1⟩ = 0, ⟨0|0⟩ = ⟨1|1⟩ = 1.'
    },
    'maths-tensor': {
      title: 'Productos Tensoriales',
      body: 'Dos vectores independientes se combinan mediante el producto tensorial (⊗) en un único vector conjunto más grande — se apila cada entrada del primero contra cada entrada del segundo, multiplicando cada par. Dos qubits se combinan así en un estado conjunto de 4 entradas; no todo estado conjunto puede separarse de nuevo, y los que no pueden son precisamente los entrelazados.'
    },
    gates: {
      title: 'Puertas Cuánticas',
      body: 'Las puertas son las operaciones que mueven un qubit por la esfera de Bloch — rotaciones reversibles en lugar de la lógica destructiva de las puertas clásicas. Cada una (H, X, Y, Z, S, T) tiene un efecto geométrico preciso que puedes observar en acción.'
    },
    circuit: {
      title: 'Circuitos',
      body: 'Un circuito es una secuencia de puertas aplicadas de izquierda a derecha. En un circuito clásico, las puertas lógicas como AND/OR/XOR combinan bits siguiendo reglas estrictas — la misma entrada siempre da la misma salida. En un circuito cuántico, el orden importa de una manera más profunda: ejecutar las mismas puertas en una secuencia distinta puede dejar al qubit en un estado completamente diferente, igual que los giros en una ruta. Cambia a 2 o 3 Qubits y añade una CNOT para construir estados entrelazados — pares de Bell y estados GHZ — puerta a puerta, las mismas recetas que hay detrás de la pestaña Entrelazar.'
    },
    measure: {
      title: 'Medición',
      body: 'Medir un qubit lo obliga a decidirse por un resultado definido, 0 o 1, con probabilidades fijadas por sus amplitudes justo antes de la medición. Esto es el colapso de la superposición — irreversible y probabilístico, no un valor preexistente oculto.'
    },
    entangle: {
      title: 'Entrelazamiento',
      body: 'Dos qubits pueden vincularse de modo que medir uno determine instantáneamente el resultado del otro, sin importar la distancia que los separe. Esta correlación es más fuerte que cualquier cosa posible entre bits clásicos.'
    },
    bellstates: {
      title: 'Estados de Bell',
      body: 'Los cuatro estados de Bell — Φ⁺, Φ⁻, Ψ⁺ y Ψ⁻ — son los estados de dos qubits máximamente entrelazados, todos construidos con la misma receta Hadamard-y-luego-CNOT partiendo de un estado base distinto de entre los cuatro. Φ⁺/Φ⁻ siempre dan resultados coincidentes al medir, Ψ⁺/Ψ⁻ siempre resultados opuestos — la fase relativa detrás de cada signo ± es invisible a una medición directa, y solo aparece una vez que los qubits se hacen interferir entre sí.'
    },
    tunnel: {
      title: 'Efecto Túnel Cuántico',
      body: 'Un paquete de ondas cuántico tiene una probabilidad distinta de cero de aparecer al otro lado de una barrera que clásicamente no debería poder cruzar, porque su nube de probabilidad se extiende a través de la barrera en lugar de detenerse en ella.'
    },
    interference: {
      title: 'Interferencia',
      body: 'Cuando dos caminos hacia el mismo resultado son indistinguibles, sus amplitudes de probabilidad se combinan y pueden reforzarse o cancelarse — produciendo franjas en una pantalla en lugar de dos simples montones. Marcar qué camino se tomó destruye el patrón.'
    },
    beamsplitter: {
      title: 'Divisor de Haz',
      body: 'Un divisor de haz 50/50 envía un solo fotón por uno de dos caminos con igual probabilidad — reflejado hacia un detector o transmitido hacia el otro. El fotón no está secretamente dividido entre ambos caminos; solo un detector hace clic por cada fotón, y cuál de ellos es genuinamente aleatorio cada vez.'
    },
    sterngerlach: {
      title: 'Experimento de Stern–Gerlach',
      body: 'Un haz de átomos de plata que atraviesa un campo magnético no homogéneo se divide en exactamente dos puntos discretos, nunca una mancha continua — evidencia directa de que el espín está cuantizado, con solo dos resultados posibles a lo largo de cualquier eje de medición, exactamente igual que los propios resultados de medición |0⟩/|1⟩ de un qubit.'
    }
  },
  // Refleja ROADMAP_QUIZ en js/roadmap.js exactamente — mismos lessonIds
  // que las claves de `lessons` de arriba, mismo contenido de
  // q/options/explanation.
  quiz: {
    qubit: {
      q: 'Un bit clásico y un qubit comienzan ambos en un estado definido. ¿Cuál es la diferencia clave entre ellos?',
      options: ['Los qubits pueden mantener una superposición de 0 y 1 a la vez', 'Los qubits son simplemente bits más rápidos', 'Los qubits solo se pueden medir una vez, para siempre', 'No hay ninguna diferencia real'],
      explanation: 'Las amplitudes de un qubit le permiten ser genuinamente una mezcla de ambos estados base hasta que se mide — un bit clásico nunca tiene esa opción.'
    },
    'maths-complex': {
      q: '¿Por qué las amplitudes de un qubit deben ser números complejos y no simplemente números reales?',
      options: ['Los números complejos son más precisos que los números reales', 'La fase adicional de un número complejo es lo que hace posible la interferencia entre caminos', 'Los números reales no pueden ser negativos', 'Es solo una convención matemática sin significado físico'],
      explanation: 'Dos amplitudes reales aún podrían cancelarse por signo, pero solo una fase compleja permite que las amplitudes se refuercen o se cancelen en cualquier ángulo relativo — esa libertad más rica es exactamente lo que explota la interferencia.'
    },
    'maths-vectors': {
      q: '¿Qué garantiza la condición de normalización |α|² + |β|² = 1 sobre el estado de un qubit?',
      options: ['Que el qubit está entrelazado', 'Que la probabilidad total de medición entre |0⟩ y |1⟩ suma exactamente el 100%', 'Que el qubit ya ha sido medido', 'Que α y β son ambos números reales'],
      explanation: 'P(0) + P(1) = |α|² + |β|² debe ser igual a 1 para que la regla de Born tenga sentido como distribución de probabilidad — cada punto válido en la esfera de Bloch ya cumple esto automáticamente.'
    },
    'maths-matrices': {
      q: '¿Qué propiedad debe cumplir toda matriz U de una puerta cuántica válida?',
      options: ['det(U) = 0', 'U†U = I (U es unitaria)', 'U debe ser una matriz de valores reales', 'U debe tener exactamente dos filas'],
      explanation: 'La unitariedad es lo que mantiene el vector de estado normalizado después de aplicar la puerta — también es exactamente la condición que hace que toda puerta cuántica sea reversible, a diferencia de una puerta AND clásica.'
    },
    'maths-statevector': {
      q: 'En la forma de esfera de Bloch |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, ¿a qué corresponden θ y φ?',
      options: ['Dos qubits independientes', 'Exactamente los mismos deslizadores θ/φ usados para fijar un estado en la esfera de Bloch', 'El número de puertas aplicadas hasta ahora', 'El resultado de la medición'],
      explanation: 'Cada punto de la esfera de Bloch es simplemente esta ecuación con un par (θ,φ) sustituido — la esfera es una representación de la fórmula, no algo aparte.'
    },
    'maths-dirac': {
      q: '¿Qué significa que ⟨0|1⟩ = 0?',
      options: ['|0⟩ y |1⟩ son el mismo estado', '|0⟩ y |1⟩ son ortogonales — resultados completamente distinguibles', 'El qubit está en superposición', 'Se produjo un error de medición'],
      explanation: 'La ortogonalidad es exactamente la razón por la que la medición siempre devuelve un 0 o un 1 limpio, nunca algo "intermedio" — |0⟩ y |1⟩ no comparten ninguna superposición.'
    },
    'maths-tensor': {
      q: 'Dos qubits independientes, cada uno un vector de 2 entradas, se combinan mediante el producto tensorial en un estado conjunto. ¿Cuántas entradas tiene ese estado conjunto?',
      options: ['2', '4', '8', 'Depende de las amplitudes de los qubits'],
      explanation: 'El producto tensorial de un vector de 2 entradas con otro vector de 2 entradas siempre tiene 2×2 = 4 entradas — una por cada combinación de resultados base, |00⟩, |01⟩, |10⟩, |11⟩ — sin importar cuáles sean las amplitudes reales.'
    },
    gates: {
      q: '¿Qué le hace la puerta de Hadamard (H) a un qubit que empieza en |0⟩?',
      options: ['Lo cambia directamente a |1⟩', 'Lo pone en una superposición equitativa de |0⟩ y |1⟩', 'Lo mide de inmediato', 'Lo entrelaza con otro qubit'],
      explanation: 'H rota |0⟩ hacia el ecuador de la esfera de Bloch — probabilidades de 50/50, con una relación de fase fija entre las dos amplitudes.'
    },
    circuit: {
      q: 'En un circuito cuántico, ¿por qué importa el orden de las puertas?',
      options: ['No importa — las puertas siempre conmutan', 'Cada puerta rota el estado, y las rotaciones generalmente no conmutan', 'Solo la última puerta tiene algún efecto', 'El orden solo importa para la medición'],
      explanation: 'Cada puerta es una rotación de la esfera de Bloch, y las rotaciones en 3D generalmente no conmutan — X seguida de Z termina en un lugar distinto que Z seguida de X.'
    },
    measure: {
      q: '¿Qué le sucede a la superposición de un qubit cuando lo mides?',
      options: ['No cambia nada', 'Colapsa a un único resultado definido', 'Se divide en dos qubits', 'Se entrelaza automáticamente'],
      explanation: 'No existe un hecho oculto sobre cuál era "en realidad" el resultado de antemano — medir es lo que produce una respuesta definida, ponderada por las amplitudes.'
    },
    entangle: {
      q: 'Dos qubits están entrelazados. Mides el primero y obtienes |1⟩. ¿Qué le sucede al segundo?',
      options: ['Nada — son independientes', 'Su resultado queda ahora instantáneamente correlacionado con el primero, según su estado entrelazado', 'Se destruye', 'Se convierte en un bit clásico'],
      explanation: 'Sus amplitudes quedaron vinculadas en el momento en que se entrelazaron — medir uno no envía ninguna señal, solo revela una correlación establecida desde el principio.'
    },
    bellstates: {
      q: 'Φ⁺ = (|00⟩ + |11⟩)/√2 y Φ⁻ = (|00⟩ − |11⟩)/√2 son estados diferentes, pero medir cualquiera de los dos en esta demostración da estadísticas idénticas. ¿Por qué?',
      options: ['En realidad son el mismo estado escrito de dos formas', 'Una fase relativa (el signo −) no cambia ninguna probabilidad en la base computacional; solo importa |amplitud|²', 'La demostración tiene un error y no puede distinguirlos', 'Solo Φ⁺ es un estado de Bell real'],
      explanation: 'Las probabilidades provienen de |amplitud|², que es idéntica para +1/√2 y −1/√2. Los dos estados siguen siendo físicamente distintos — la fase se vuelve visible en cuanto se hace interferir a los qubits entre sí, por ejemplo aplicando una puerta Hadamard a cada uno antes de medir.'
    },
    tunnel: {
      q: '¿Qué es el efecto túnel cuántico?',
      options: ['Un qubit teletransportándose instantáneamente a través del espacio', 'Un paquete de ondas que tiene una probabilidad distinta de cero de aparecer más allá de una barrera clásicamente prohibida', 'Una puerta que elimina un qubit', 'Un error de medición'],
      explanation: 'La función de onda no se detiene bruscamente en una barrera — decae exponencialmente en su interior, así que una barrera suficientemente delgada sigue dejando una amplitud distinta de cero al otro lado.'
    },
    interference: {
      q: 'En el experimento de la doble rendija, ¿qué causa las franjas de interferencia en la pantalla?',
      options: ['Dos partículas separadas colisionando', 'Las amplitudes de probabilidad de caminos indistinguibles que se suman o se cancelan', 'El material de la pantalla', 'El colapso de la medición ocurriendo de forma temprana'],
      explanation: 'Cada punto de la pantalla tiene dos caminos posibles; cuando son indistinguibles sus amplitudes se suman y pueden reforzarse o cancelarse, produciendo las franjas.'
    },
    beamsplitter: {
      q: 'Un solo fotón incide en un divisor de haz 50/50. ¿Qué sucede realmente?',
      options: ['El fotón se divide por la mitad, con una mitad yendo a cada detector', 'El fotón va exactamente a un detector, elegido al azar con probabilidades de 50/50', 'Ambos detectores siempre hacen clic juntos', 'Ningún detector hace clic a menos que midas dos veces'],
      explanation: 'Un fotón nunca se divide entre caminos — el divisor de haz lo pone en una superposición de "reflejado" y "transmitido", y medir (el clic del detector) fuerza un resultado definido, igual que medir un qubit.'
    },
    sterngerlach: {
      q: 'Un haz de átomos de plata pasa a través de un imán de Stern–Gerlach. ¿Qué muestra realmente el experimento en la pantalla del detector?',
      options: ['Una mancha continua de un extremo a otro', 'Exactamente dos puntos discretos, nunca nada intermedio', 'Un único punto en el centro exacto', 'Ningún patrón en absoluto — los átomos son absorbidos'],
      explanation: 'Clásicamente, un dipolo magnético orientado al azar debería desviarse en cualquier cantidad, produciendo una mancha continua. Stern y Gerlach solo encontraron dos puntos discretos — evidencia directa de que el espín, como los propios resultados de medición de un qubit, está cuantizado en solo dos posibilidades a lo largo de cualquier eje.'
    }
  }
});
