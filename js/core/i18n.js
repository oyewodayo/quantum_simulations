'use strict';
// loads before js/locales/*.js (each calls registerLocale() at its own top
// level) and before app.js, which calls initI18n() once from
// DOMContentLoaded - same place it calls refreshThemeColors()/syncThemeIcon().
// deliberately mirrors core/theme.js's pattern: localStorage preference, an
// attribute on <html>, and a callback registry so the rest of the app doesn't
// need to be known by name here.
//
// only translates static content - page chrome (index.html's [data-i18n]
// elements), roadmap lesson/quiz text, gate descriptions (js/roadmap.js and
// js/core/gates.js read through t() with the existing English string as
// fallback). Doesn't cover sentences tabs build at runtime by splicing a
// variable into a template literal (e.g. circuit-tab.js's "Checkpoint 3 is
// now H." narration) - those stay English for now, translating them means
// restructuring each call site into a template+params form.

const LOCALES = {};
const I18N_STORAGE_KEY = 'qe-lang';
const I18N_DEFAULT = 'en';
let currentLang = I18N_DEFAULT;

// called once per language at the top level of each js/locales/*.js file,
// e.g. registerLocale('fr', { nav: {...}, lessons: {...}, ... })
function registerLocale(code, data) {
  LOCALES[code] = data;
}

// dotted-path lookup ('lessons.qubit.title') into the active locale. falls
// back to English if the active locale is missing the key, then to
// `fallback` (whatever string was already hardcoded at the call site before
// i18n existed) if English is missing it too - so a typo'd key or a half
// finished translation degrades to correct English instead of a blank
// string or a raw dotted key showing up in the UI
function t(key, fallback) {
  const lookup = (localeCode) => {
    const locale = LOCALES[localeCode];
    if (!locale) return undefined;
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, locale);
  };
  const active = lookup(currentLang);
  if (active !== undefined) return active;
  const english = lookup(I18N_DEFAULT);
  if (english !== undefined) return english;
  return fallback !== undefined ? fallback : key;
}

// walks every [data-i18n] element under `root` and sets its text (or, for
// [data-i18n-attr="aria-label"] etc, that attribute) from t(key). root
// defaults to the whole document but can be scoped to a freshly-rendered
// subtree (roadmap.js re-renders the mind-map on every expand/collapse, no
// need to re-walk the whole page for that). a few elements carry inline
// markup in their translatable text (a <b>, a <ul> - e.g. the Introduction
// tab) - those add [data-i18n-html] so the locale value is trusted,
// hand-written markup (not user input) and gets set via innerHTML instead
// of textContent
function applyTranslations(root) {
  (root || document).querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = t(key, el.dataset.i18nDefault);
    if (el.dataset.i18nAttr) {
      el.setAttribute(el.dataset.i18nAttr, value);
    } else if (el.dataset.i18nHtml !== undefined) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });
}

// stuff that renders translatable text into markup i18n.js can't reach with
// a static [data-i18n] walk (roadmap.js's mind-map, built fresh from JS on
// every render) registers a re-render callback here instead
const langChangeCallbacks = [];
function onLangChange(fn) { langChangeCallbacks.push(fn); }

// switches the active language, persists it, updates <html lang>, re-renders
// every translatable surface. falls back to English for an unrecognized
// code (e.g. a locale file that failed to load) instead of leaving the page
// half-translated
function setLanguage(code) {
  currentLang = LOCALES[code] ? code : I18N_DEFAULT;
  localStorage.setItem(I18N_STORAGE_KEY, currentLang);
  document.documentElement.setAttribute('lang', currentLang);
  const select = document.getElementById('lang-select');
  if (select) select.value = currentLang;
  applyTranslations();
  langChangeCallbacks.forEach(fn => fn());
}

// restores a saved language preference (falls back to English if none saved,
// or the saved code's locale file didn't register - e.g. it got removed)
// and does the initial translation pass. called once from app.js's
// DOMContentLoaded, after every locales/*.js file has run.
function initI18n() {
  const saved = localStorage.getItem(I18N_STORAGE_KEY);
  currentLang = (saved && LOCALES[saved]) ? saved : I18N_DEFAULT;
  document.documentElement.setAttribute('lang', currentLang);
  const select = document.getElementById('lang-select');
  if (select) select.value = currentLang;
  applyTranslations();
}
