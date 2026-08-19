# Quantum Explorer · CERN

A browser-based quantum computing simulator, built so that "trust me, it's a unitary matrix" doesn't have to be the whole intro to quantum computing. Sixteen simulation modules — a single qubit on a Bloch sphere, multi-qubit circuits, entanglement, tunnelling, teleportation, superdense coding, Grover's Search, noise — plus reference tabs for the concepts and math underneath them, each simulation paired with the equivalent classical picture so you can actually see where the two diverge.

No backend, no build step, no npm install. It's plain HTML/CSS/JS that runs straight off the filesystem.

```bash
git clone git@github.com:oyewodayo/quantum_simulations.git
cd quantum_simulations
open index.html   # or just double-click it
```

That's it. Everything runs client-side.

## What's actually in here

**Bits & Qubits.** The classical-vs-quantum comparison the rest of the app builds on — a bit next to a qubit, θ/φ sliders driving a live Bloch sphere, and one-, two-, and three-qubit modes so superposition doesn't stay a one-qubit party trick.

**Gates & Circuits.** All the standard single-qubit gates (H, X, Y, Z, S, T) plus parametrized Rx/Ry/Rz, a classical logic-gate equivalent for comparison, and two circuit builders — a simple checkpoint-wire for one qubit, and a grid-based builder for two and three qubits with CNOT. There's also a classical half-adder built the reversible way (X, CNOT, Toffoli) sitting right next to its normal XOR/AND version, same truth table, built entirely differently.

**Measurement, Entanglement, Bell States.** Collapse a superposition once, or run a thousand measurements and watch the histogram converge on the Born rule. The entanglement tab correlates two qubits and lets you feel how measuring one instantly pins down the other. The Bell States tab walks through all four Bell states with an actual circuit animation, not a canned GIF.

**Wave mechanics.** Tunnelling and double-slit interference are both genuinely simulated — the tunnelling tab integrates the time-dependent Schrödinger equation frame by frame (leapfrog scheme), and interference is real two-source coherent superposition sampled per pixel, not a pre-baked pattern. Turn on which-path detection and watch the fringes actually vanish.

**Beam Splitter & Stern–Gerlach.** Single photons and single atoms hitting a detector one at a time, each outcome genuinely random under the Born rule, accumulating into a pattern you can watch build up.

**Teleportation & Superdense Coding.** The two protocols that spend a shared entangled pair to move information — teleportation sends a qubit's state using two classical bits, superdense coding does the reverse. Both built from the actual protocol steps (entangle, measure, correct), not scripted to just show the right answer.

**Noise.** The one tab where qubits aren't perfectly isolated — a T₁/T₂ relaxation model (with T₂ capped at 2T₁, enforced in the running code, not just mentioned in a tooltip) showing how a real qubit decays toward a mixed state over time.

**Grover's Search.** The first proper algorithm in here, not just a protocol — toggle between a 4-item search (2 qubits, 1 iteration, hits the marked item with probability exactly 1) and an 8-item search (3 qubits, 2 iterations, peaks around 94.5% instead of 1 — the general case, not the toy one). Each pass redraws the amplitude chart so you can watch the oracle's phase flip do nothing visible on its own, then the diffusion step turn that invisible flip into an actual probability swing.

**Important Concepts & Maths Concept.** A searchable glossary of ~70 terms for when you just need a definition, and a standalone reference for the underlying math — complex numbers, vectors, matrices, state vectors, Dirac notation, tensor products — kept separate from the simulations so it doesn't get in the way of people who just want to click things.

## Home / Roadmap mode

Flip the header switch from the simulator to Home and you get a mind-map of the whole app instead — click a node, get a short lesson with a "try it" link straight into that tab, and a quiz at the end covering the core ideas. Progress is tracked with a completed-lessons bar and your best quiz score, stored in `localStorage`. No login, and if you clear your browser data it just starts over.

## Small things that add up

- **Three languages** — English, French, Spanish, switchable from the header dropdown without a reload.
- **Light/dark theme**, saved across visits, applied before first paint so there's no flash of the wrong theme.
- **A first-run guided tour** that shows up once and then leaves you alone.
- **Shareable links** — the Circuit and Qubit tabs can copy a URL that reproduces the exact state you're looking at, so you can send someone a specific example instead of describing it.

## How it's laid out

```
quantum_simulations/
├── index.html
├── css/
│   ├── base.css              theme tokens + reset, loads first
│   ├── layout.css            header, sidebar dock, footer
│   ├── roadmap.css           the Home / mind-map view
│   ├── components.css        shared widgets used across multiple tabs
│   ├── bloch.css             Bloch sphere wrapper + hover tooltip
│   ├── tour.css               the guided-tour popover
│   ├── responsive.css        breakpoint overrides, loads last
│   └── tabs/                 one stylesheet per simulation tab
├── js/
│   ├── core/                 the actual engine everything else sits on
│   │   ├── complex.js          complex-number arithmetic
│   │   ├── qubit.js             single-qubit state + Bloch conversion
│   │   ├── two-qubit.js         2-qubit state, CNOT, partial trace
│   │   ├── three-qubit.js       3-qubit state, CNOT/Toffoli, projective measurement
│   │   ├── gates.js             the unitary matrices (H, X, Y, Z, S, T, rotations)
│   │   ├── bloch-renderer.js   shared 3D Bloch sphere canvas renderer
│   │   ├── tab-registry.js      registerTab(): per-tab enter/leave hooks
│   │   ├── theme.js             light/dark state
│   │   ├── i18n.js              translation lookup + DOM binding
│   │   ├── dom-utils.js         shared UI bits (tooltips, share links, modals)
│   │   └── utils.js             small generic helpers (delay, etc.)
│   ├── locales/               en.js, fr.js, es.js
│   ├── tabs/                  one file per tab, 21 in total (incl. grover-tab.js)
│   ├── roadmap.js             Home mode: mind-map, lessons, quiz, progress
│   ├── tour.js                first-run tour
│   └── app.js                 wires everything together, loads last
└── tests/
    └── run.js                 node tests/run.js — no dependencies
```

Every script is a plain `<script>` tag loaded in dependency order — no bundler, no modules — so the whole thing still works if you open `index.html` straight from disk with `file://`.

## Running the tests

```bash
node tests/run.js
```

It's a dependency-free Node script, currently 27 checks covering complex arithmetic, qubit/2-qubit/3-qubit normalization, gate unitarity, teleportation and superdense coding round-tripping correctly across random states, Grover's oracle/diffusion step at both N=4 (exact hit) and N=8 (peaks ~94.5%, with a 3rd iteration confirmed to overshoot rather than improve), and the tunnelling solver's probability conservation and transmission scaling. The tunnelling checks load `tunneling-tab.js` directly into a stubbed-out document rather than re-deriving the solver separately, so a change to the shipped code can't silently drift from what's tested.

## Contributing

If something's wrong physics-wise, or you find a browser it breaks on, open an issue. PRs are welcome — try to match the existing per-tab file structure (one file in `js/tabs/`, one stylesheet in `css/tabs/`, registered in `js/core/tab-registry.js`) rather than bolting new logic onto an existing tab.

## License

No license file yet. If you want to reuse or adapt any of this, open an issue or just reach out.

---

