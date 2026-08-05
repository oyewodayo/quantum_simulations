'use strict';
// used by a few tabs/*.js async flows

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
