'use strict';
// mostly a reference tab, text + formulas, no state of its own - except
// the State Vector section which embeds the interactive classical-vs-
// quantum widget from statevector-tab.js (wired up by its own
// initStatevecTab(), called alongside initMathsConceptTab() in app.js).
// navigated only via the sidebar's Maths Concept sub-links, which call
// setMathsSection() directly - no in-page toggle needed here.
// needs registerTab (tab-registry.js), redrawStatevecCanvases (statevector-tab.js)

const MATHS_SECTIONS = ['complex', 'vectors', 'matrices', 'statevector', 'dirac', 'tensor'];

function initMathsConceptTab() {
  registerTab('mathsconcept', {});
  setMathsSection('complex'); // matches the panel already visible by default in index.html
}

function setMathsSection(section) {
  MATHS_SECTIONS.forEach(name => {
    document.getElementById(`maths-${name}`).style.display = name === section ? '' : 'none';
  });
  syncSidebarSub('mathsconcept', { mathsSection: section });
  // the state-vector canvases don't redraw themselves while display:none,
  // so this needs the explicit redraw that a tab visit used to trigger
  // back when this widget was its own top-level tab
  if (section === 'statevector') redrawStatevecCanvases();
}
