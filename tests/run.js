'use strict';
// Lightweight, dependency-free correctness checks for the quantum math
// core (complex arithmetic, Qubit, gate matrices). Run with:
//   node tests/run.js
//
// js/core/*.js are written as plain browser globals (no module.exports),
// by design, so this loads them into a vm sandbox instead of `require`-ing
// them — the app files themselves stay untouched, browser-only scripts.

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const sandbox = {};
vm.createContext(sandbox);

function loadIntoSandbox(relPath) {
  const src = fs.readFileSync(path.join(__dirname, '..', relPath), 'utf8');
  vm.runInContext(src, sandbox, { filename: relPath });
}

loadIntoSandbox('js/core/complex.js');
loadIntoSandbox('js/core/qubit.js');
loadIntoSandbox('js/core/two-qubit.js');
loadIntoSandbox('js/core/gates.js');

// complex.js/qubit.js/gates.js declare with const/class, which (like in a
// browser) creates lexical bindings visible to later scripts in the same
// context but NOT as own-properties of the sandbox object — bridge them
// out via a `var`, which (unlike const/class) does attach to the global object.
vm.runInContext(
  'var __exports = { C: C, Qubit: Qubit, GATES: GATES, TwoQubitState: TwoQubitState, rotationMatrix: rotationMatrix };',
  sandbox
);
const { C, Qubit, GATES, TwoQubitState, rotationMatrix } = sandbox.__exports;

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok  - ${name}`);
  } catch (e) {
    console.error(`FAIL - ${name}`);
    console.error(`       ${e.message}`);
    process.exitCode = 1;
  }
}

function approxEqual(a, b, eps, msg) {
  assert.ok(Math.abs(a - b) < eps, `${msg}: expected ${a} ≈ ${b}`);
}

// ── Complex arithmetic ──────────────────────────────────────────────
check('C.polar/C.mag/C.arg round-trip', () => {
  const z = C.polar(2, Math.PI / 3);
  approxEqual(C.mag(z), 2, 1e-9, 'magnitude');
  approxEqual(C.arg(z), Math.PI / 3, 1e-9, 'argument');
});

check('C.mul multiplies magnitudes and adds arguments', () => {
  const a = C.polar(2, 0.4);
  const b = C.polar(3, 0.9);
  const p = C.mul(a, b);
  approxEqual(C.mag(p), 6, 1e-9, 'product magnitude');
  approxEqual(C.arg(p), 1.3, 1e-9, 'product argument');
});

// ── Qubit invariants ─────────────────────────────────────────────────
check('fresh Qubit starts at |0⟩', () => {
  const q = new Qubit();
  approxEqual(q.prob0(), 1, 1e-9, 'prob0');
  approxEqual(q.prob1(), 0, 1e-9, 'prob1');
  assert.strictEqual(q.getLabel(), '|0⟩');
});

check('normalization invariant holds after any gate sequence', () => {
  const gateKeys = Object.keys(GATES);
  for (let trial = 0; trial < 200; trial++) {
    const q = new Qubit();
    const steps = 1 + Math.floor(Math.random() * 6);
    for (let i = 0; i < steps; i++) {
      const key = gateKeys[Math.floor(Math.random() * gateKeys.length)];
      q.applyGate(GATES[key].matrix);
    }
    approxEqual(q.prob0() + q.prob1(), 1, 1e-9, `trial ${trial}`);
  }
});

check('H creates an equal superposition', () => {
  const q = new Qubit();
  q.applyGate(GATES.H.matrix);
  approxEqual(q.prob0(), 0.5, 1e-9, 'prob0');
  approxEqual(q.prob1(), 0.5, 1e-9, 'prob1');
});

check('H is its own inverse (H·H = I)', () => {
  const q = new Qubit();
  q.applyGate(GATES.H.matrix);
  q.applyGate(GATES.H.matrix);
  approxEqual(q.prob0(), 1, 1e-9, 'prob0');
  approxEqual(q.prob1(), 0, 1e-9, 'prob1');
});

check('X flips |0⟩ to |1⟩', () => {
  const q = new Qubit();
  q.applyGate(GATES.X.matrix);
  approxEqual(q.prob0(), 0, 1e-9, 'prob0');
  approxEqual(q.prob1(), 1, 1e-9, 'prob1');
});

// ── Gate matrices must be unitary (M†M = I), or applying them would
//    silently leak or gain probability ─────────────────────────────────
check('every standard gate matrix is unitary', () => {
  const conj = z => ({ r: z.r, i: -z.i });
  Object.entries(GATES).forEach(([name, gate]) => {
    const m = gate.matrix;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        let sum = { r: 0, i: 0 };
        for (let k = 0; k < 2; k++) {
          sum = C.add(sum, C.mul(conj(m[k][i]), m[k][j]));
        }
        const expected = i === j ? 1 : 0;
        approxEqual(sum.r, expected, 1e-9, `${name} (M†M)[${i}][${j}].r`);
        approxEqual(sum.i, 0, 1e-9, `${name} (M†M)[${i}][${j}].i`);
      }
    }
  });
});

// ── Rotation gates ────────────────────────────────────────────────────
check('rotation gates are unitary for arbitrary angles', () => {
  const conj = z => ({ r: z.r, i: -z.i });
  ['X', 'Y', 'Z'].forEach(axis => {
    [0, 33, 90, 180, 271, 360].forEach(angleDeg => {
      const m = rotationMatrix(axis, angleDeg);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          let sum = { r: 0, i: 0 };
          for (let k = 0; k < 2; k++) sum = C.add(sum, C.mul(conj(m[k][i]), m[k][j]));
          const expected = i === j ? 1 : 0;
          approxEqual(sum.r, expected, 1e-9, `R${axis}(${angleDeg}°) (M†M)[${i}][${j}].r`);
          approxEqual(sum.i, 0, 1e-9, `R${axis}(${angleDeg}°) (M†M)[${i}][${j}].i`);
        }
      }
    });
  });
});

check('Rx(360°) returns to the identity (up to global phase)', () => {
  const q = new Qubit();
  q.applyGate(rotationMatrix('X', 360));
  approxEqual(q.prob0(), 1, 1e-9, 'prob0');
  approxEqual(q.prob1(), 0, 1e-9, 'prob1');
});

// ── Two-qubit state / CNOT ────────────────────────────────────────────
check('fresh TwoQubitState starts at |00⟩', () => {
  const s = new TwoQubitState();
  approxEqual(s.prob(0), 1, 1e-9, 'prob(00)');
  approxEqual(s.prob(1) + s.prob(2) + s.prob(3), 0, 1e-9, 'other probs');
});

check('single-qubit gate on qubit 0 only touches that qubit (X on Q0: |00⟩ → |10⟩)', () => {
  const s = new TwoQubitState();
  s.applySingleQubitGate(0, GATES.X.matrix);
  approxEqual(s.prob(2), 1, 1e-9, 'prob(10)');
});

check('single-qubit gate on qubit 1 only touches that qubit (X on Q1: |00⟩ → |01⟩)', () => {
  const s = new TwoQubitState();
  s.applySingleQubitGate(1, GATES.X.matrix);
  approxEqual(s.prob(1), 1, 1e-9, 'prob(01)');
});

check('CNOT leaves |00⟩ unchanged (control is 0)', () => {
  const s = new TwoQubitState();
  s.applyCNOT(0, 1);
  approxEqual(s.prob(0), 1, 1e-9, 'prob(00)');
});

check('CNOT flips the target when the control is 1 (|10⟩ → |11⟩)', () => {
  const s = new TwoQubitState();
  s.applySingleQubitGate(0, GATES.X.matrix); // |00⟩ -> |10⟩
  s.applyCNOT(0, 1);
  approxEqual(s.prob(3), 1, 1e-9, 'prob(11)');
});

check('H on Q0 then CNOT Q0→Q1 builds the Bell state (|00⟩+|11⟩)/√2', () => {
  const s = new TwoQubitState();
  s.applySingleQubitGate(0, GATES.H.matrix);
  s.applyCNOT(0, 1);
  approxEqual(s.prob(0), 0.5, 1e-9, 'prob(00)');
  approxEqual(s.prob(3), 0.5, 1e-9, 'prob(11)');
  approxEqual(s.prob(1) + s.prob(2), 0, 1e-9, 'prob(01)+prob(10)');
});

check('TwoQubitState normalization invariant holds after any gate sequence', () => {
  const gateKeys = Object.keys(GATES);
  for (let trial = 0; trial < 200; trial++) {
    const s = new TwoQubitState();
    const steps = 1 + Math.floor(Math.random() * 6);
    for (let i = 0; i < steps; i++) {
      if (Math.random() < 0.3) {
        const control = Math.random() < 0.5 ? 0 : 1;
        s.applyCNOT(control, 1 - control);
      } else {
        const key = gateKeys[Math.floor(Math.random() * gateKeys.length)];
        s.applySingleQubitGate(Math.random() < 0.5 ? 0 : 1, GATES[key].matrix);
      }
    }
    const total = s.prob(0) + s.prob(1) + s.prob(2) + s.prob(3);
    approxEqual(total, 1, 1e-9, `trial ${trial}`);
  }
});

console.log(`\n${passed} check(s) passed.`);
if (process.exitCode) {
  console.error('Some checks FAILED.');
  process.exit(1);
} else {
  console.log('All checks passed.');
}
