/**
 * Learning-language registry. A request picks its language with the `x-learn-lang` header
 * (see langMiddleware in server/index.js); anything unknown falls back to Spanish so old
 * clients keep working unchanged.
 */
const es = require('./es');
const de = require('./de');

const LANGUAGES = { es, de };
const DEFAULT_LANG = 'es';
const LANG_CODES = Object.keys(LANGUAGES);

const resolveLang = (code) => {
  const c = String(code || '').trim().toLowerCase().slice(0, 5);
  return LANGUAGES[c] ? c : DEFAULT_LANG;
};

const getLanguage = (code) => LANGUAGES[resolveLang(code)];

module.exports = { LANGUAGES, LANG_CODES, DEFAULT_LANG, resolveLang, getLanguage };
