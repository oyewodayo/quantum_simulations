# Quantum Explorer Code Map

Where each simulated physical claim actually lives in the source, organized to match the technical report's own section numbers — flip between this and `report/main.pdf` directly.

**Author** Temidayo Solomon Oyewo · **Supervisor** Sanad AL MASKARI · **Repo root** `QuantumSimulate/`

| | | | |
|---|---|---|---|
| **16** simulation modules | **27/27** automated checks passing | **3** core quantum-state classes | **0** build-tool dependencies |

---

## §3.1 Core mathematics layer

Framework-free modules implementing the actual linear algebra — everything else in the app is UI built on top of these six files.

- **`js/core/complex.js`** — Complex-number arithmetic, the primitive every other core file is built on.
- **`js/core/qubit.js`** — `Qubit`: two complex amplitudes plus the Bloch-sphere (θ,φ) representation.
- **`js/core/gates.js`** — `GATES`: the actual unitary matrices — H, X, Y, Z, S, T, and the rotation gates.
- **`js/core/two-qubit.js`** — `TwoQubitState`: flat 4-entry complex amplitude array; `applyCNOT()`; partial-trace reduction back to a single qubit's Bloch vector. `applyPhaseFlip()`/`applyDiffusionReflect()` (added for §4.7) are the oracle and diffusion-middle-step primitives Grover's Search is built on.
- **`js/core/three-qubit.js`** — `ThreeQubitState`: flat 8-entry array; `applyCNOT()`, Toffoli as basis-state permutations; `measureQubit()` (line 93) is the genuine Born-rule projective measurement both communication protocols in §4.5 are built on. `applyPhaseFlip()`/`applyDiffusionReflect()` (added for §4.7) generalize `TwoQubitState`'s own pair to N=8, Grover's Search's second demo mode.

## §3.2 Shared rendering layer

Visual components reused across modules rather than rebuilt per tab — includes this term's interaction-affordance and material-consistency work.

- **`js/core/bloch-renderer.js`** — The shaded, draggable 3-D Bloch sphere, reused across eight modules. `enableDrag()` marks which spheres are genuinely interactive.
- **`index.html`** (Stern-Gerlach / Beam Splitter apparatus SVG) — Inline apparatus diagrams (magnets, glass panels, detector housings), sharing the metallic/glass gradient defs (`sg-metal-sheen`, `bs-glass-sheen`).
- **`css/base.css`** (`--sheen-metal`) — The same apparatus gradient, exposed as a CSS token this term and applied to every gate box in Gates/Circuits/Bell States (`.gate-btn`, `.circuit-gate-btn`, `.circuit2-gate`, `.gate-slot.filled`) so they read as the same material instead of flat color.

## §4.1 Foundational representations

The standard first pass through the subject: Bloch sphere, complex amplitudes, unitary gates, sequential circuits up to three qubits, Born-rule measurement, the four Bell states.

- **`js/tabs/qubit-tab.js` · `mathsconcept-tab.js` · `gates-tab.js`** — Bits & Qubits, Maths Concept, and Gates tabs.
- **`js/tabs/circuit-tab.js` + `circuit-multiqubit-tab.js`** — The 1-qubit checkpoint-wire builder and the 2Q/3Q grid-diagram builder (shared config-driven implementation).
- **`js/tabs/classical-circuit-tab.js`** — The classical half-adder builder, plus this term's `renderCompareClassicalDiagram()` / `renderCompareQuantumDiagram()` — see §4.2.
- **`js/tabs/measure-tab.js` · `bell-states-tab.js`** — Measurement collapse, and the four Bell states with this term's `runBellStateCircuit()` animation — see §4.2.

## §4.2 Foundational-module refinements this term

Two physics-motivated additions to existing foundational modules, on top of the §3.2 interface-consistency work.

- **`js/tabs/classical-circuit-tab.js`** — `renderHalfAdderCompareDiagrams()`: the Circuits module's new "Compare" mode — a fixed classical XOR/AND schematic beside the standard 4-qubit reversible-logic construction (X, two CNOTs, a Toffoli) of the same half adder — same truth table, exact by construction.
- **`js/tabs/bell-states-tab.js`** — `runBellStateCircuit()`: the Bell States circuit's Run animation — a value token per wire, flipping through X, turning into a genuine (non-collapsed) superposition at H, and correlating at CNOT — never resolved to a fixed value, since the diagram has no measurement step.

## §4.3 Wave-mechanics solvers

The two modules that integrate a real PDE at interactive frame rates rather than animating a pre-scripted result.

- **`js/tabs/tunneling-tab.js`** — `tunnelStep()` (line 123): the staggered-leapfrog Schrödinger-equation integrator. `tunnelHpsi()` (line 69) applies the Hamiltonian; `tunnelSplitProbs()` (line 130) computes reflected/transmitted probability.
  *This is the exact file `tests/run.js` loads and exercises directly — see §5.*
- **`js/tabs/interference-tab.js`** — `interferenceIntensity()` (line 65): true two-source coherent wave superposition per pixel. `interferenceAddHits()` (line 152): the rejection-sampling detector accumulation.

## §4.4 Discrete quantum statistics

Single quanta fired at a genuinely random binary outcome under the Born rule, accumulated one event at a time onto a detector plate.

- **`js/tabs/beam-splitter-tab.js`** — Single-photon binary outcome plus the accumulating-plate detector.
- **`js/tabs/stern-gerlach-tab.js`** — The single-magnet apparatus; the "Number of magnets" control swaps oven-intake vs. already-measured input rather than drawing a second magnet.
  *The apparatus SVG itself (magnets, field-fan lines, sheen gradients) is inline in `index.html`, from roughly line 2640.*

## §4.5 Quantum communication protocols

Built from first principles this term — both spend a pre-shared entangled pair to move information in opposite directions.

- **`js/tabs/teleport-tab.js`** — `fireTeleport()` (line 115): entangle, put the message qubit into the Bell basis, measure, send two classical bits, apply Bob's Z/X correction.
- **`js/tabs/superdense-tab.js`** — Teleportation's logical converse — encode two classical bits onto one qubit against a pre-shared pair.

## §4.6 Open-system dynamics

The application's first genuinely non-unitary physics model — every other module treats its qubits as perfectly isolated.

- **`js/tabs/noise-tab.js`** — `noiseCompute()` (line 33): the phenomenological T₁/T₂ (Bloch–Redfield) relaxation law, with T₂ capped at 2T₁ in the running code itself, not just asserted in prose.

## §4.7 Quantum algorithms

The application's first genuine quantum *algorithm* module, as opposed to a communication protocol. Two selectable, toggled modes — the same algorithm at two sizes, not two different ideas:
- **N=4** (2 qubits, `TwoQubitState`), 1 iteration: the textbook exact case — probability at the marked index is exactly 1 after one query.
- **N=8** (3 qubits, `ThreeQubitState`), 2 iterations: the general case made visible — probability peaks at ~94.5%, not 1, and a verified 3rd iteration overshoots past that peak rather than improving on it.

- **`js/tabs/grover-tab.js`** — `GROVER_MODES` (`n4`/`n8`) parametrizes qubit count and iteration count; `setGroverMode()` toggles which circuit/target-picker/amplitude-chart pair is visible and resets shared state for the new mode's own all-zeros default. `runGrover()`: H on every qubit → `iterations` repetitions of [oracle (`applyPhaseFlip()`) → diffusion (H on every qubit, `applyDiffusionReflect()`, H on every qubit again)] → `measureQubit()` on every qubit; for N=8 this loops twice, updating a live "Iteration X of 2" badge and the amplitude chart after each pass so the probability's climb (and eventual overshoot if pushed to a 3rd, undemonstrated pass) is visible rather than asserted. The amplitude chart's bar heights (probability) and sign badges (amplitude sign) deliberately diverge right after the oracle — a pure phase kick, invisible to any measurement until diffusion. Both circuit diagrams (`#grover-circuit`/`#grover-circuit-n8`, index.html) show the same run structurally: the oracle is one black-box gate (its wiring depends on the marked item, so it's left undecomposed, same convention as the standard $U_\omega$ box), but the diffuser is drawn as its own three real gates under one bracket — H, the `2|0\ldots0\rangle\langle0\ldots0|-I` reflection, H again — matching the textbook circuit rather than hiding that structure behind a second opaque box; N=8 additionally wraps Oracle+Diffuser in an outer "repeat ×2" bracket, the same nested-bracket convention the standard reference diagram for this algorithm uses for its general "Repeat ≈⌈π/4·√N⌉ times" case. Neither the oracle nor the reflection gets a per-wire token, since the phase flip is a joint property no single wire could honestly display; `pulseGroverStage()` ripples through all the gates, including the diffuser's own three, in the order they actually run.

## §5 Validation and testing

Every protocol or physical law was checked computationally before its interface was built, then encoded permanently into the checked-in suite.

- **`tests/run.js`** — Run with `node tests/run.js` — no external dependencies. 27 checks: complex/single-qubit math, multi-qubit gates, measurement collapse, teleportation, superdense coding, Grover's oracle/diffusion at both N=4 (exact) and N=8 (peaks at ~94.5%, confirmed overshoot at a 3rd iteration), and the tunnelling solver's conservation/transmission-scaling.
  *The tunnelling checks load `js/tabs/tunneling-tab.js` itself into a stubbed-document sandbox, rather than re-deriving the leapfrog scheme separately — a parallel reimplementation could silently drift from the shipped code.*

---

Full narrative context, the validation methodology, and quantitative results: `report/main.pdf` (source: `report/main.tex`). Section numbers above (§3.1, §4.3, etc.) match that report directly.
