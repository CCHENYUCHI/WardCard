/**
 * Current learning language (🇪🇸 Spanish / 🇩🇪 German).
 * Settings come from shared/languages/<code>.json — the same files the server reads.
 * Every API call sends the choice in the `x-learn-lang` header (utils/api.js), so cards,
 * today's task, stats and AI prompts all follow the selected deck.
 */
import es from '../../../shared/languages/es.json';
import de from '../../../shared/languages/de.json';

export const LANGUAGES = { es, de };
export const LANG_CODES = Object.keys(LANGUAGES);
export const DEFAULT_LANG = 'es';
export const LEARN_LANG_EVENT = 'learn-lang-changed';

const STORAGE_KEY = 'palabracard_learn_lang';

export function getLearnLang() {
  try {
    const code = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES[code] ? code : DEFAULT_LANG;
  } catch (_) {
    return DEFAULT_LANG;
  }
}

export function setLearnLang(code) {
  if (!LANGUAGES[code]) return;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (_) { /* private mode: keep the choice for this page only */ }
  window.dispatchEvent(new CustomEvent(LEARN_LANG_EVENT, { detail: code }));
}

/** Settings of the current (or given) learning language */
export function getLangConfig(code = getLearnLang()) {
  return LANGUAGES[code] || LANGUAGES[DEFAULT_LANG];
}

/** Article shown before a noun: es "el"/"la", de "der"/"die"/"das" */
export function articleFor(gender, code = getLearnLang()) {
  return getLangConfig(code).articles.definite[gender] || '';
}
