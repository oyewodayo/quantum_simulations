'use strict';
// loads before every tabs/*.js file, each of which calls registerTab()
// from its own init function to declare what happens when its tab shows/hides.
// app.js's tab-switch handler just looks entries up here instead of
// branching on tab name, so adding a tab never means touching app.js.

const TABS = {};

// name should match the button's data-tab and its tab-<name> section id.
// onEnter fires every time the tab becomes visible, onLeave right before
// switching away. Both optional.
function registerTab(name, handlers) {
  TABS[name] = handlers || {};
}
