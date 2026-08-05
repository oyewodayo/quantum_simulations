'use strict';
// needs registerTab (tab-registry.js), pulseElement/setExplainer (dom-utils).
// two demos sharing the same fire/animate/tally setup as beam-splitter-tab.js
// (same bsAnimateMove-style tweening, "sg" prefix instead of "bs" - kept as
// its own copy rather than shared since the state shapes differ enough
// that factoring it out would add more indirection than it'd save):
//   1) single magnet, adjustable input angle theta (same Bloch-sphere
//      theta as Bits & Qubits/State Vector) - atoms land Up with
//      probability cos²(θ/2), Down with sin²(θ/2), same Born-rule split
//      as the Measure tab, just with a silver atom's spin standing in
//      for "the qubit".
//   2) sequential two-magnet demo: atoms enter already prepared spin-up
//      along Z (the textbook first-magnet setup, not actually simulated
//      here, just asserted), then hit a second magnet whose axis toggles
//      Z/X. same axis as prep = deterministic 100% "+"; a different,
//      incompatible axis re-randomizes to 50/50 even though the incoming
//      spin was perfectly definite a moment earlier.
// no qubit/Bloch object for demo 1 despite reusing its theta convention -
// same as beam-splitter-tab.js, just a plain probability animation with
// its own local state.

let sgTheta = 0; // radians, 0..π - 0 is "certainly up", π is "certainly down"
let sgCountUp = 0, sgCountDown = 0, sgAnimating = false;

const SG_SOURCE   = { x: 56,  y: 170 };
const SG_SPLIT    = { x: 600, y: 170 };
const SG_DET_UP   = { x: 770, y: 80  };
const SG_DET_DOWN = { x: 770, y: 260 };

function sgProbUp(theta)   { return Math.cos(theta / 2) ** 2; }
function sgProbDown(theta) { return Math.sin(theta / 2) ** 2; }

// reads the theta slider and refreshes the live theoretical P(up)/P(down)
// bars - separate from the empirical tally histogram below, which only
// updates when atoms actually fire. leaving the tally untouched means you
// can compare "what theory predicts now" against "what you've measured so
// far" without losing earlier trials.
function updateSGThetaDisplay() {
  const raw = parseInt(document.getElementById('sg-theta-slider').value, 10);
  sgTheta = raw / 1000;
  const deg = Math.round(sgTheta * 180 / Math.PI);
  document.getElementById('sg-theta-val').textContent = deg + '°';

  const pUp = sgProbUp(sgTheta) * 100;
  const pDown = 100 - pUp;
  document.getElementById('sg-fill-up').style.width = pUp + '%';
  document.getElementById('sg-fill-down').style.width = pDown + '%';
  document.getElementById('sg-pct-up-live').textContent = Math.round(pUp) + '%';
  document.getElementById('sg-pct-down-live').textContent = Math.round(pDown) + '%';
}

function sgLerp(a, b, t) { return a + (b - a) * t; }

// same shape as beam-splitter-tab.js's bsAnimateMove(), just renamed for
// this tab's atom + ghost
function sgAnimateMove(el, x0, y0, x1, y1, op0, op1, duration, cb) {
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    el.setAttribute('transform', `translate(${sgLerp(x0, x1, t)},${sgLerp(y0, y1, t)})`);
    el.setAttribute('opacity', sgLerp(op0, op1, t));
    if (t < 1) requestAnimationFrame(step);
    else cb();
  }
  requestAnimationFrame(step);
}

function fireSGAtom() {
  if (sgAnimating) return;
  sgAnimating = true;
  document.getElementById('btn-fire-atom').disabled = true;
  document.getElementById('sg-result').textContent = t('sterngerlach.resultTravelling', 'traveling…');

  const atom  = document.getElementById('sg-atom');
  const ghost = document.getElementById('sg-atom-ghost');

  sgAnimateMove(atom, SG_SOURCE.x, SG_SOURCE.y, SG_SPLIT.x, SG_SPLIT.y, 1, 1, 450, () => {
    // decided at the magnet, using whatever theta's dialed in right now,
    // not captured back at fire time - so dragging the slider mid-flight
    // (rare but possible) still resolves against the current odds
    const isUp = Math.random() < sgProbUp(sgTheta);
    const winTarget  = isUp ? SG_DET_UP : SG_DET_DOWN;
    const loseTarget = isUp ? SG_DET_DOWN : SG_DET_UP;

    sgAnimateMove(ghost, SG_SPLIT.x, SG_SPLIT.y, loseTarget.x, loseTarget.y, 0.55, 0, 450, () => {
      ghost.setAttribute('opacity', 0);
    });

    sgAnimateMove(atom, SG_SPLIT.x, SG_SPLIT.y, winTarget.x, winTarget.y, 1, 1, 450, () => {
      atom.setAttribute('opacity', 0);
      const ping  = document.getElementById(isUp ? 'sg-ping-up' : 'sg-ping-down');
      const flash = document.getElementById(isUp ? 'sg-flash-up' : 'sg-flash-down');
      pulseElement(ping, 'active', 650);
      flash.setAttribute('opacity', 0.5);
      setTimeout(() => flash.setAttribute('opacity', 0), 400);

      if (isUp) sgCountUp++; else sgCountDown++;
      document.getElementById('sg-result').textContent = isUp
        ? t('sterngerlach.resultUp', 'Up detector clicked')
        : t('sterngerlach.resultDown', 'Down detector clicked');
      setExplainer('sg-explainer', isUp
        ? t('sterngerlach.explainerUp', 'Up detector clicked — one of exactly two possible outcomes, never a partial deflection. Fire again and the same atom state can still land Down; only the odds are fixed, not any single result.')
        : t('sterngerlach.explainerDown', 'Down detector clicked — one of exactly two possible outcomes, never a partial deflection. Fire again and the same atom state can still land Up; only the odds are fixed, not any single result.'));
      updateSGHistogram();

      sgAnimating = false;
      document.getElementById('btn-fire-atom').disabled = false;
    });
  });
}

function updateSGHistogram() {
  const total = sgCountUp + sgCountDown;
  const pUp = total ? (sgCountUp / total) * 100 : 0;
  const pDown = total ? (sgCountDown / total) * 100 : 0;
  document.getElementById('sg-hist-up').style.height = pUp + '%';
  document.getElementById('sg-hist-down').style.height = pDown + '%';
  document.getElementById('sg-pct-up').textContent = total ? Math.round(pUp) + '%' : '—';
  document.getElementById('sg-pct-down').textContent = total ? Math.round(pDown) + '%' : '—';
  document.getElementById('sg-trial-count').textContent = total ? t('sterngerlach.trialCount', '· {count} atoms').replace('{count}', total) : '';
}

function resetSternGerlach() {
  sgCountUp = 0; sgCountDown = 0;
  updateSGHistogram();
  document.getElementById('sg-result').textContent = '—';
  setExplainer('sg-explainer', t('sterngerlach.explainerDefault', 'An atom is about to enter the magnet. Fire it and watch which detector clicks.'));
}

// demo 2: sequential magnets, incompatible axes
let sg2Axis = 'z'; // 'z' (same as preparation, deterministic) or 'x' (incompatible, 50/50)
let sg2CountPlus = 0, sg2CountMinus = 0, sg2Animating = false;

const SG2_SOURCE     = { x: 109, y: 125 };
const SG2_SPLIT      = { x: 570, y: 125 };
const SG2_DET_PLUS   = { x: 708, y: 40  };
const SG2_DET_MINUS  = { x: 708, y: 220 };

// switches the second magnet's axis, relabels its caption, resets the
// tally (mixing Z-axis and X-axis trials in one histogram would be
// physically meaningless, they're different experiments), and resets the
// explainer to what's about to happen rather than what already did
function setSG2Axis(axis) {
  sg2Axis = axis;
  document.querySelectorAll('.mode-btn[data-sg-axis]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.sgAxis === axis));
  document.getElementById('sg2-axis-caption').textContent = axis === 'z'
    ? t('sterngerlach.magnet2AxisZ', 'Magnet 2 — Z axis')
    : t('sterngerlach.magnet2AxisX', 'Magnet 2 — X axis');

  sg2CountPlus = 0; sg2CountMinus = 0;
  updateSG2Histogram();
  document.getElementById('sg2-result').textContent = '—';
  setExplainer('sg2-explainer', axis === 'z'
    ? t('sterngerlach.sequentialExplainerZ', 'Same axis as before — fire an atom to confirm it always lands the same way.')
    : t('sterngerlach.sequentialExplainerX', 'A different axis this time — fire an atom to see what happens to a spin that was already definite along Z.'));
}

function fireSG2Atom() {
  if (sg2Animating) return;
  sg2Animating = true;
  document.getElementById('btn-fire-atom-2').disabled = true;
  document.getElementById('sg2-result').textContent = t('sterngerlach.resultTravelling', 'traveling…');

  const atom  = document.getElementById('sg2-atom');
  const ghost = document.getElementById('sg2-atom-ghost');

  sgAnimateMove(atom, SG2_SOURCE.x, SG2_SOURCE.y, SG2_SPLIT.x, SG2_SPLIT.y, 1, 1, 450, () => {
    // same axis as prep: incoming spin is already an eigenstate of this
    // measurement so the outcome's certain, not just likely - no
    // Math.random() call at all. a different axis makes the incoming
    // Z-definite state an equal superposition in the new basis, so it's a
    // fresh 50/50 flip.
    const isPlus = sg2Axis === 'z' ? true : Math.random() < 0.5;
    const winTarget  = isPlus ? SG2_DET_PLUS : SG2_DET_MINUS;
    const loseTarget = isPlus ? SG2_DET_MINUS : SG2_DET_PLUS;

    sgAnimateMove(ghost, SG2_SPLIT.x, SG2_SPLIT.y, loseTarget.x, loseTarget.y, 0.55, 0, 450, () => {
      ghost.setAttribute('opacity', 0);
    });

    sgAnimateMove(atom, SG2_SPLIT.x, SG2_SPLIT.y, winTarget.x, winTarget.y, 1, 1, 450, () => {
      atom.setAttribute('opacity', 0);
      const ping  = document.getElementById(isPlus ? 'sg2-ping-plus' : 'sg2-ping-minus');
      const flash = document.getElementById(isPlus ? 'sg2-flash-plus' : 'sg2-flash-minus');
      pulseElement(ping, 'active', 650);
      flash.setAttribute('opacity', 0.5);
      setTimeout(() => flash.setAttribute('opacity', 0), 400);

      if (isPlus) sg2CountPlus++; else sg2CountMinus++;
      document.getElementById('sg2-result').textContent = isPlus
        ? t('sterngerlach.result2Plus', '"+" detector clicked')
        : t('sterngerlach.result2Minus', '"−" detector clicked');
      setExplainer('sg2-explainer', sg2Axis === 'z'
        ? t('sterngerlach.explainer2Z', 'Measuring the same axis twice in a row just confirms the earlier result — no surprise here. Fire again as many times as you like: it will always land "+".')
        : t('sterngerlach.explainer2X', 'Even though this atom had a perfectly definite spin along Z, measuring a different, incompatible axis (X) erased that information and produced a fresh, genuinely random result. This is the heart of the Stern–Gerlach discovery: measuring one property can disturb another that doesn\'t commute with it.'));
      updateSG2Histogram();

      sg2Animating = false;
      document.getElementById('btn-fire-atom-2').disabled = false;
    });
  });
}

function updateSG2Histogram() {
  const total = sg2CountPlus + sg2CountMinus;
  const pPlus = total ? (sg2CountPlus / total) * 100 : 0;
  const pMinus = total ? (sg2CountMinus / total) * 100 : 0;
  document.getElementById('sg2-hist-plus').style.height = pPlus + '%';
  document.getElementById('sg2-hist-minus').style.height = pMinus + '%';
  document.getElementById('sg2-pct-plus').textContent = total ? Math.round(pPlus) + '%' : '—';
  document.getElementById('sg2-pct-minus').textContent = total ? Math.round(pMinus) + '%' : '—';
  document.getElementById('sg2-trial-count').textContent = total ? t('sterngerlach.trialCount', '· {count} atoms').replace('{count}', total) : '';
}

function resetSternGerlach2() {
  sg2CountPlus = 0; sg2CountMinus = 0;
  updateSG2Histogram();
  document.getElementById('sg2-result').textContent = '—';
  setExplainer('sg2-explainer', sg2Axis === 'z'
    ? t('sterngerlach.sequentialExplainerZ', 'Same axis as before — fire an atom to confirm it always lands the same way.')
    : t('sterngerlach.sequentialExplainerX', 'A different axis this time — fire an atom to see what happens to a spin that was already definite along Z.'));
}

// clears any atom left mid-flight in either demo on a switch-away, same
// reasoning as beam-splitter-tab.js's resetBeamSplitterPhoton() - these
// animations are short enough (900ms) that an onLeave hook isn't worth
// it, but revisiting shouldn't show a frozen atom stuck mid-path. doesn't
// touch either tally, those only reset via their own buttons or (demo 2) an axis switch.
function resetSternGerlachAtoms() {
  ['sg-atom', 'sg-atom-ghost', 'sg2-atom', 'sg2-atom-ghost'].forEach(id =>
    document.getElementById(id).setAttribute('opacity', 0));
  sgAnimating = false;
  sg2Animating = false;
  document.getElementById('btn-fire-atom').disabled = false;
  document.getElementById('btn-fire-atom-2').disabled = false;
}

function initSternGerlachTab() {
  document.getElementById('sg-theta-slider').addEventListener('input', updateSGThetaDisplay);
  document.getElementById('btn-fire-atom').addEventListener('click', fireSGAtom);
  document.getElementById('btn-reset-sterngerlach').addEventListener('click', resetSternGerlach);

  document.querySelectorAll('.mode-btn[data-sg-axis]').forEach(btn =>
    btn.addEventListener('click', () => setSG2Axis(btn.dataset.sgAxis)));
  document.getElementById('btn-fire-atom-2').addEventListener('click', fireSG2Atom);
  document.getElementById('btn-reset-sterngerlach2').addEventListener('click', resetSternGerlach2);

  updateSGThetaDisplay();
  registerTab('sterngerlach', { onEnter: resetSternGerlachAtoms });
}
