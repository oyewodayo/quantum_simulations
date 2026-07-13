'use strict';
// Depends on: core/complex.js (C.*).

// ─── TWO-QUBIT STATE ──────────────────────────────────────────────────
/**
 * A two-qubit state |ψ⟩ = c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩, stored
 * as a flat 4-entry amplitude array indexed by (qubit0 << 1) | qubit1 —
 * i.e. amps[0]=|00⟩, amps[1]=|01⟩, amps[2]=|10⟩, amps[3]=|11⟩.
 * Same normalization invariant as Qubit: renormalized after every gate.
 */
class TwoQubitState {
  constructor() {
    this.amps = [{ r: 1, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }, { r: 0, i: 0 }];
  }

  /** Applies a single-qubit 2x2 gate to just one of the two qubits
   *  (i.e. matrix⊗I or I⊗matrix), leaving the other untouched. */
  applySingleQubitGate(qubitIndex, matrix) {
    const next = [null, null, null, null];
    for (let q0 = 0; q0 < 2; q0++) {
      for (let q1 = 0; q1 < 2; q1++) {
        let sum = { r: 0, i: 0 };
        if (qubitIndex === 0) {
          for (let q0p = 0; q0p < 2; q0p++) {
            sum = C.add(sum, C.mul(matrix[q0][q0p], this.amps[q0p * 2 + q1]));
          }
        } else {
          for (let q1p = 0; q1p < 2; q1p++) {
            sum = C.add(sum, C.mul(matrix[q1][q1p], this.amps[q0 * 2 + q1p]));
          }
        }
        next[q0 * 2 + q1] = sum;
      }
    }
    this.amps = next;
    this._normalize();
  }

  /** Controlled-NOT: flips `target`'s bit whenever `control`'s bit is 1.
   *  A CNOT is just a permutation of basis states — no amplitude mixing —
   *  so this remaps each amplitude to its flipped index rather than doing
   *  a matrix multiply. */
  applyCNOT(control, target) {
    const next = [null, null, null, null];
    for (let idx = 0; idx < 4; idx++) {
      const bits = [idx >> 1, idx & 1];
      if (bits[control] === 1) bits[target] = 1 - bits[target];
      const newIdx = (bits[0] << 1) | bits[1];
      next[newIdx] = this.amps[idx];
    }
    this.amps = next;
  }

  _normalize() {
    let magSq = 0;
    for (const a of this.amps) magSq += C.mag(a) ** 2;
    const mag = Math.sqrt(magSq);
    if (mag > 1e-10) this.amps = this.amps.map(a => C.scale(a, 1 / mag));
  }

  prob(idx) { return C.mag(this.amps[idx]) ** 2; }

  getFormula() {
    const kets = ['00', '01', '10', '11'];
    let out = '';
    for (let i = 0; i < 4; i++) {
      const a = this.amps[i];
      if (C.mag(a) <= 0.0005) continue;
      const isNegativeReal = a.r < 0 && Math.abs(a.i) < 0.0005;
      const term = isNegativeReal
        ? `${C.fmt(C.scale(a, -1))}|${kets[i]}⟩`
        : `${C.fmt(a)}|${kets[i]}⟩`;
      if (out === '') out = term;
      else out += (isNegativeReal ? ' − ' : ' + ') + term;
    }
    return `|ψ⟩ = ${out || '0'}`;
  }
}
