'use strict';
// needs registerTab (tab-registry.js) and pulseElement (dom-utils.js) for the
// detector click ring. one photon hits the 50/50 splitter and randomly ends
// up at detector A or B - never split in half. the faint "ghost" that travels
// the other path is just there to sell the superposition idea before it
// collapses. no qubit/Bloch state here, this is plain classical probability
// so it keeps its own local counters instead of hooking into qubit.js.

let bsCountA = 0, bsCountB = 0, bsAnimating = false;

const BS_SOURCE = { x: 115, y: 280 };
const BS_SPLIT  = { x: 380, y: 280 };
const BS_DET_A  = { x: 380, y: 82  };
const BS_DET_B  = { x: 587, y: 280 };

function initBeamSplitterTab() {
  document.getElementById('btn-fire-photon').addEventListener('click', fireBeamSplitterPhoton);
  document.getElementById('btn-reset-beamsplitter').addEventListener('click', resetBeamSplitter);

  // skipping onLeave - the animation's only 900ms, not worth canceling on
  // tab switch. onEnter just resets any photon left mid-flight so you don't
  // come back to it frozen halfway down a path.
  registerTab('beamsplitter', { onEnter: resetBeamSplitterPhoton });
}

function resetBeamSplitterPhoton() {
  document.getElementById('bs-photon').setAttribute('opacity', 0);
  document.getElementById('bs-photon-ghost').setAttribute('opacity', 0);
  bsAnimating = false;
  document.getElementById('btn-fire-photon').disabled = false;
}

function bsLerp(a, b, t) { return a + (b - a) * t; }

// moves el (a <g>) from (x0,y0) to (x1,y1), translating the whole group so
// the glow halo and bright core move together instead of repositioning cx/cy
// separately. also lerps opacity op0->op1 over the same duration - reused for
// both the real photon (opacity stays 1) and the fading ghost (1 -> 0).
function bsAnimateMove(el, x0, y0, x1, y1, op0, op1, duration, cb) {
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    el.setAttribute('transform', `translate(${bsLerp(x0, x1, t)},${bsLerp(y0, y1, t)})`);
    el.setAttribute('opacity', bsLerp(op0, op1, t));
    if (t < 1) requestAnimationFrame(step);
    else cb();
  }
  requestAnimationFrame(step);
}

function fireBeamSplitterPhoton() {
  if (bsAnimating) return;
  bsAnimating = true;
  document.getElementById('btn-fire-photon').disabled = true;
  document.getElementById('beamsplitter-result').textContent = 'traveling…';

  const photon = document.getElementById('bs-photon');
  const ghost  = document.getElementById('bs-photon-ghost');

  bsAnimateMove(photon, BS_SOURCE.x, BS_SOURCE.y, BS_SPLIT.x, BS_SPLIT.y, 1, 1, 450, () => {
    const isA       = Math.random() < 0.5;
    const winTarget  = isA ? BS_DET_A : BS_DET_B;
    const loseTarget = isA ? BS_DET_B : BS_DET_A;

    // The real photon continues on to whichever detector wins, while a
    // faint ghost simultaneously heads down the path NOT taken and fades
    // out over the same 450ms — both outcomes were possible right up
    // until this instant, and only one of them is actually happening.
    bsAnimateMove(ghost, BS_SPLIT.x, BS_SPLIT.y, loseTarget.x, loseTarget.y, 0.55, 0, 450, () => {
      ghost.setAttribute('opacity', 0);
    });

    bsAnimateMove(photon, BS_SPLIT.x, BS_SPLIT.y, winTarget.x, winTarget.y, 1, 1, 450, () => {
      photon.setAttribute('opacity', 0);
      const ping  = document.getElementById(isA ? 'bs-ping-a' : 'bs-ping-b');
      const flash = document.getElementById(isA ? 'bs-flashA' : 'bs-flashB');
      pulseElement(ping, 'active', 650);
      flash.setAttribute('opacity', 0.5);
      setTimeout(() => flash.setAttribute('opacity', 0), 400);

      if (isA) bsCountA++; else bsCountB++;
      document.getElementById('beamsplitter-result').textContent = isA ? 'Detector A clicked' : 'Detector B clicked';
      setExplainer('beamsplitter-explainer', isA
        ? 'Detector A clicked — the photon reflected. Fire again and it could just as easily transmit through to B; each photon\'s path is decided fresh, not by any pattern in what came before.'
        : 'Detector B clicked — the photon transmitted straight through. Fire again and it could just as easily reflect to A; each photon\'s path is decided fresh, not by any pattern in what came before.');
      updateBeamSplitterHistogram();

      bsAnimating = false;
      document.getElementById('btn-fire-photon').disabled = false;
    });
  });
}

function updateBeamSplitterHistogram() {
  const total = bsCountA + bsCountB;
  const pA = total ? (bsCountA / total) * 100 : 0;
  const pB = total ? (bsCountB / total) * 100 : 0;
  document.getElementById('bs-hist-a').style.height = pA + '%';
  document.getElementById('bs-hist-b').style.height = pB + '%';
  document.getElementById('bs-pct-a').textContent = total ? Math.round(pA) + '%' : '—';
  document.getElementById('bs-pct-b').textContent = total ? Math.round(pB) + '%' : '—';
  document.getElementById('beamsplitter-trial-count').textContent = total ? `· ${total} photons` : '';
}

function resetBeamSplitter() {
  bsCountA = 0; bsCountB = 0;
  updateBeamSplitterHistogram();
  document.getElementById('beamsplitter-result').textContent = '—';
  setExplainer('beamsplitter-explainer', 'A photon is about to launch toward the beam splitter. Fire it and watch which detector clicks.');
}
