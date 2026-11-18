// One CSV row (Google Sheet export) -> card fields. Pure, so it is tested without the server.
const { resolveLang, getLanguage } = require('./languages');
const { splitArticle } = require('./cardUtils');

// Header aliases, first non-empty wins. Spanish-era names (Ejemplo, Definición) stay supported.
const pick = (record, ...keys) => {
  for (const key of keys) {
    const value = record[key];
    if (value != null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
};

const GENDER_ALIASES = {
  masculino: 'masculino', m: 'masculino', masculine: 'masculino', '陽性': 'masculino',
  femenino: 'femenino', f: 'femenino', feminine: 'femenino', '陰性': 'femenino',
  neutro: 'neutro', n: 'neutro', neuter: 'neutro', '中性': 'neutro',
  invariable: 'invariable', mf: 'invariable',
  none: 'none', '': 'none'
};

/**
 * @param {object} record parsed CSV row (columns: true)
 * @param {string} defaultLang the deck being shown (req.lang)
 * @returns {null | { lang, word, article, gender, translation, english_translation, notes, definition_es, example_es, example_zh, category }}
 */
function csvRecordToCard(record, defaultLang = 'es') {
  const lang = record.lang ? resolveLang(record.lang) : (record.German ? 'de' : (record.Spanish ? 'es' : resolveLang(defaultLang)));
  const rawWord = pick(record, 'Spanish', 'German', 'word', 'Word');
  if (!rawWord) return null;

  const { word, article } = splitArticle(rawWord, pick(record, 'Article', 'article'), lang);
  const L = getLanguage(lang);

  // Gender column (any alias), else from the article: de der/die/das, es el/la
  let gender = GENDER_ALIASES[pick(record, 'Gender', 'gender').toLowerCase()];
  if (!gender || gender === 'none') {
    const fromArticle = Object.entries(L.articles.definite).find(([, a]) => a === article)?.[0];
    gender = fromArticle || gender || 'none';
  }
  if (!L.genders.includes(gender) && gender !== 'invariable') gender = 'none';

  return {
    lang,
    word,
    article,
    gender,
    translation: pick(record, 'Chinese', 'translation'),
    english_translation: pick(record, 'English', 'english_translation'),
    notes: pick(record, 'Note_EN', 'Notes', 'notes'),
    definition_es: pick(record, 'Definición', 'Definition', 'definition_es'),
    example_es: pick(record, 'Ejemplo', 'Example', 'Beispiel', 'example_es'),
    example_zh: pick(record, 'Example_ZH', 'example_zh'),
    category: pick(record, 'Category', 'category') || '日常生活'
  };
}

// Blank template offered by the settings page, per learning language (header + one example row)
const CSV_TEMPLATES = {
  es: [
    ['Spanish', 'Chinese', 'English', 'Gender', 'Category', 'Ejemplo', 'Example_ZH', 'Notes', 'lang'],
    ['la costumbre', '習俗', 'custom', 'femenino', '日常生活', 'Es una costumbre típica en España.', '這是西班牙的典型習俗。', '-umbre 結尾為陰性名詞', 'es']
  ],
  de: [
    ['German', 'Chinese', 'English', 'Gender', 'Category', 'Example', 'Example_ZH', 'Notes', 'lang'],
    ['das Haus', '房子', 'house', 'neutro', '日常生活', 'Das Haus ist sehr alt.', '這棟房子很老。', '詞形變化 → 複數：die Häuser；屬格：des Hauses', 'de']
  ]
};

// The template as CSV text: UTF-8 BOM so Excel reads ä ö ü and Chinese correctly, CRLF lines
function templateCsv(lang) {
  const rows = CSV_TEMPLATES[lang] || CSV_TEMPLATES.es;
  const cell = (v) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return `﻿${rows.map(r => r.map(cell).join(',')).join('\r\n')}\r\n`;
}

module.exports = { csvRecordToCard, templateCsv, CSV_TEMPLATES };
