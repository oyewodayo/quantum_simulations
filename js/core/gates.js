'use strict';
// Depends on: core/complex.js (C.polar) — the T gate matrix calls it at
// top-level, during this script's execution, so complex.js must load first.

// ─── GATES ────────────────────────────────────────────────────────────
const INV2 = 1 / Math.SQRT2;
const GATES = {
  H: {
    name: 'H', color: '#60A5FA', desc: 'The Coin Spinner',
    explain: 'Picture flicking a coin into the air with so much spin it never lands — that\'s what Hadamard does to a definite qubit. It takes a state that "knows" what it is and throws it into a perfect, dizzy 50/50 blur of |0⟩ and |1⟩. Flick it again and — oddly — the spin cancels out and it lands back exactly where it started.',
    matrix: [
      [{ r: INV2, i: 0 }, { r:  INV2, i: 0 }],
      [{ r: INV2, i: 0 }, { r: -INV2, i: 0 }]
    ],
    matrixStr: [['1/√2', '1/√2'], ['1/√2', '-1/√2']]
  },
  X: {
    name: 'X', color: '#F472B6', desc: 'The Light Switch',
    explain: 'This is the blunt instrument of the gate world — a full, no-nonsense swap. Whatever the qubit believed about being |0⟩, it now believes about being |1⟩, and vice versa. No blur, no hesitation, just an instant identity swap, like flicking a light switch from off to on.',
    matrix: [
      [{ r: 0, i: 0 }, { r: 1, i: 0 }],
      [{ r: 1, i: 0 }, { r: 0, i: 0 }]
    ],
    matrixStr: [['0', '1'], ['1', '0']]
  },
  Y: {
    name: 'Y', color: '#A78BFA', desc: 'The Cartwheel',
    explain: 'Y does everything X does — flips the bit completely — but adds a twist mid-flip, like a coin doing a cartwheel instead of a simple flop. That extra twist is a phase change, invisible in the probability bars but very real: it changes how this qubit will interact with the next gate down the line.',
    matrix: [
      [{ r: 0, i:  0 }, { r: 0, i: -1 }],
      [{ r: 0, i:  1 }, { r: 0, i:  0 }]
    ],
    matrixStr: [['0', '-i'], ['i', '0']]
  },
  Z: {
    name: 'Z', color: '#94A3B8', desc: 'The Ghost Move',
    explain: 'Z is the sneakiest gate here — it does something to the qubit and yet the probability bars won\'t twitch at all. It marks the |1⟩ part of the state with an invisible minus sign, like writing in invisible ink. That mark does nothing on its own — but hand this qubit to a Hadamard afterward, and the ink suddenly shows.',
    matrix: [
      [{ r: 1, i: 0 }, { r:  0, i: 0 }],
      [{ r: 0, i: 0 }, { r: -1, i: 0 }]
    ],
    matrixStr: [['1', '0'], ['0', '-1']]
  },
  S: {
    name: 'S', color: '#34D399', desc: 'The Quarter Turn',
    explain: 'Think of a compass needle sitting on the equator of the sphere — S rotates it a crisp quarter turn (90°) around the vertical axis. Like Z, it\'s invisible to the probability bars; it only reveals itself once the state gets mixed with another gate.',
    matrix: [
      [{ r: 1, i: 0 }, { r: 0, i: 0 }],
      [{ r: 0, i: 0 }, { r: 0, i: 1 }]
    ],
    matrixStr: [['1', '0'], ['0', 'i']]
  },
  T: {
    name: 'T', color: '#FBBF24', desc: 'The Whisper Nudge',
    explain: 'T is S\'s quieter sibling — an eighth-turn (45°) instead of a quarter. It\'s the smallest standard nudge available, the kind of fine adjustment you\'d use to dial in a telescope rather than swing a door. Chain enough of these together and you can build almost any rotation.',
    matrix: [
      [{ r: 1, i: 0 }, { r: 0, i: 0 }],
      [{ r: 0, i: 0 }, C.polar(1, Math.PI / 4)]
    ],
    matrixStr: [['1', '0'], ['0', 'e^(iπ/4)']]
  }
};

// ─── ROTATION GATES ───────────────────────────────────────────────────
// Unlike the fixed gates above, these take a runtime angle, so their
// matrix is built on demand rather than stored — see rotationMatrix().
const ROTATION_GATES = {
  X: { label: 'Rx', color: '#F472B6', desc: 'Rotate around the X axis' },
  Y: { label: 'Ry', color: '#A78BFA', desc: 'Rotate around the Y axis' },
  Z: { label: 'Rz', color: '#94A3B8', desc: 'Rotate around the Z axis' }
};

/** Standard single-qubit rotation matrix Rx/Ry/Rz(angleDeg) about the given axis. */
function rotationMatrix(axis, angleDeg) {
  const theta = angleDeg * Math.PI / 180;
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  switch (axis) {
    case 'X': return [
      [{ r: c, i: 0 }, { r: 0, i: -s }],
      [{ r: 0, i: -s }, { r: c, i: 0 }]
    ];
    case 'Y': return [
      [{ r: c, i: 0 }, { r: -s, i: 0 }],
      [{ r: s, i: 0 }, { r: c, i: 0 }]
    ];
    case 'Z': return [
      [C.polar(1, -theta / 2), { r: 0, i: 0 }],
      [{ r: 0, i: 0 }, C.polar(1, theta / 2)]
    ];
    default: throw new Error(`Unknown rotation axis: ${axis}`);
  }
}
