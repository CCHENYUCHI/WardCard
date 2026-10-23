// Shared word lookup for the dictionary page and the tap-a-word popover.
// Cheapest layers first: offline Wiktionary → the user's own cards → AI caches. Never calls AI.
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { splitArticle, normalizeWord, cardWordVariants } = require('./cardUtils');
const { groupForms } = require('./forms');
const { langName } = require('./langNames');

const DICT_PATH = process.env.DICT_DB_PATH || path.join(__dirname, '../data/dict/es-en.sqlite');
const MAX_RESULTS = 6;

// wiktextract pos -> the app's part_of_speech values
const POS_MAP = {
  noun: 'sustantivo', verb: 'verbo', adj: 'adjetivo', adv: 'adverbio',
  conj: 'conjunción', prep: 'preposición', pron: 'pronombre', intj: 'interjección',
  phrase: 'frase', prep_phrase: 'frase', article: 'frase', det: 'frase', num: 'frase'
};
const GENDER_MAP = { m: 'masculino', f: 'femenino' };

let dict; // undefined = not opened yet, null = file missing
function getDict() {
  if (dict !== undefined) return dict;
  if (!fs.existsSync(DICT_PATH)) {
    console.warn(`[dictionary] ${DICT_PATH} not found — offline dictionary disabled (see README to build it)`);
    dict = null;
    return dict;
  }
  dict = new DatabaseSync(DICT_PATH, { readOnly: true });
  dict.exec('PRAGMA cache_size = -2000'); // 2MB page cache keeps RSS flat
  return dict;
}

// Only for tests
function setDictionary(db) {
  dict = db;
  hasEntriesCache = undefined;
}

// A dictionary file may hold only the lexicon (`npm run build:lexicon` without a kaikki build)
let hasEntriesCache;
function dictionaryHasEntries() {
  if (hasEntriesCache !== undefined) return hasEntriesCache;
  const db = getDict();
  hasEntriesCache = Boolean(db) && Boolean(db.prepare('SELECT 1 FROM entries LIMIT 1').get());
  return hasEntriesCache;
}

const parseJson = (s, fallback) => {
  if (!s) return fallback;
  try {
    return JSON.parse(s);
  } catch (_) {
    return fallback;
  }
};

const toItem = (row, via = null) => ({
  lemma: row.word,
  pos: row.pos,
  part_of_speech: POS_MAP[row.pos] || 'frase',
  gender: GENDER_MAP[row.gender] || 'none',
  glosses: parseJson(row.glosses, []),
  via // e.g. "first-person singular preterite indicative" when the query is an inflected form
});

/**
 * Offline Wiktionary lookup. "fui" -> [{ lemma: 'ir', via: '...' }, { lemma: 'ser', via: '...' }]
 * Exact spelling ranks above accent-insensitive matches (año before ano).
 */
function lookupForm(query) {
  const db = getDict();
  const norm = normalizeWord(query);
  if (!db || !norm) return [];
  const lower = String(query).trim().toLowerCase();

  const rows = db.prepare('SELECT word, pos, gender, glosses, form_of FROM entries WHERE word_norm = ? LIMIT 30').all(norm);
  rows.sort((a, b) => (b.word.toLowerCase() === lower) - (a.word.toLowerCase() === lower));

  // Lemma rows are found through the word_norm index (no second index on word, keeps the file smaller)
  const lemmaStmt = db.prepare("SELECT word, pos, gender, glosses FROM entries WHERE word_norm = ? AND glosses != '[]' LIMIT 12");
  const items = [];
  const seen = new Set();
  const push = (item) => {
    const key = `${item.lemma}|${item.pos}`;
    if (seen.has(key)) return;
    seen.add(key);
    items.push(item);
  };

  for (const row of rows) {
    if (parseJson(row.glosses, []).length > 0) push(toItem(row));
    for (const { lemma, via } of parseJson(row.form_of, [])) {
      const lemmaRows = lemmaStmt.all(normalizeWord(lemma)).filter(r => r.word === lemma);
      // Prefer the lemma entry with the same part of speech (casa as a verb form -> casar the verb)
      lemmaRows.sort((a, b) => (b.pos === row.pos) - (a.pos === row.pos));
      if (lemmaRows.length > 0) push(toItem(lemmaRows[0], via));
      else push({ lemma, pos: row.pos, part_of_speech: POS_MAP[row.pos] || 'frase', gender: 'none', glosses: [], via });
    }
  }
  return items.slice(0, MAX_RESULTS);
}

// A table missing from an older dictionary file reads as "no data", never as an error
function optionalRow(sql, ...params) {
  try {
    return getDict()?.prepare(sql).get(...params) || null;
  } catch (_) {
    return null;
  }
}

/**
 * IPA, inflected forms (grouped for display), example sentences and etymology of one lemma + part of speech.
 * Every part is null when the dictionary file is missing or was built before that part existed.
 */
function getEntryExtras(lemma, pos) {
  if (!lemma) return { ipa: '', forms: null, examples: null, etymology: null };
  const ipa = optionalRow('SELECT ipa FROM entries WHERE word_norm = ? AND word = ? AND pos = ? AND ipa IS NOT NULL LIMIT 1', normalizeWord(lemma), lemma, pos)?.ipa
    || optionalRow('SELECT ipa FROM entries WHERE word_norm = ? AND word = ? AND ipa IS NOT NULL LIMIT 1', normalizeWord(lemma), lemma)?.ipa
    || '';
  const forms = parseJson(optionalRow('SELECT data FROM forms WHERE lemma = ? AND pos = ?', lemma, pos)?.data, null);
  const examples = parseJson(optionalRow('SELECT data FROM examples WHERE lemma = ? AND pos = ?', lemma, pos)?.data, null);
  const ety = optionalRow('SELECT text, chain FROM etymology WHERE lemma = ? AND pos = ?', lemma, pos);
  const chain = parseJson(ety?.chain, []).map(([lang, word, kind]) => ({ lang, lang_zh: langName(lang), word, kind }));
  return {
    ipa,
    forms: groupForms(pos, forms),
    examples: examples ? examples.map(([es, en]) => ({ es, en })) : null,
    etymology: ety ? { text: ety.text || '', chain } : null
  };
}

/** What the dictionary file holds, for the settings screen ("is my dictionary the new one?") */
function getDictionaryInfo() {
  const db = getDict();
  const info = { path: DICT_PATH, exists: Boolean(db), schemaVersion: null, entries: 0, builtAt: '', extras: { forms: false, examples: false, etymology: false, ipa: false }, lexiconEntries: 0 };
  if (!db) return info;
  const meta = {};
  try {
    for (const { key, value } of db.prepare('SELECT key, value FROM meta').all()) meta[key] = value;
  } catch (_) { /* no meta table */ }
  const tables = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(r => r.name));
  const columns = tables.has('entries') ? db.prepare('PRAGMA table_info(entries)').all().map(c => c.name) : [];
  info.schemaVersion = Number(meta.schema_version) || 1;
  info.entries = Number(meta.entries) || 0;
  info.builtAt = meta.built_at || '';
  info.extras = { forms: tables.has('forms'), examples: tables.has('examples'), etymology: tables.has('etymology'), ipa: columns.includes('ipa') };
  if (tables.has('lexicon')) info.lexiconEntries = db.prepare('SELECT COUNT(*) AS n FROM lexicon').get().n;
  return info;
}

const hasLatin = (s) => /[a-zñáéíóúü]/i.test(s);

/**
 * The user's cards that match the query or any of its lemmas.
 * A Chinese query ("蘋果") searches translations instead.
 */
function findMyCards(db, userId, query, lemmas = []) {
  const rows = db.prepare(`
    SELECT id, word, article, gender, part_of_speech, translation, english_translation,
           example_es, example_zh, notes, lifecycle_status, mastery_stage, is_starred
    FROM cards WHERE user_id = ?
  `).all(userId);

  const q = String(query || '').trim();
  if (!hasLatin(q)) {
    return q ? rows.filter(r => (r.translation || '').includes(q)).slice(0, MAX_RESULTS) : [];
  }

  const wanted = new Set();
  for (const w of [q, ...lemmas]) {
    const n = normalizeWord(splitArticle(w).word);
    if (!n) continue;
    wanted.add(n);
    // Pronominal verbs: "acostumbro" -> acostumbrar should also find the card "acostumbrarse"
    if (n.endsWith('se')) wanted.add(n.slice(0, -2));
    else if (/(ar|er|ir)$/.test(n)) wanted.add(`${n}se`);
  }
  return rows.filter(r => cardWordVariants(r.word).some(v => wanted.has(v))).slice(0, MAX_RESULTS);
}

const externalLinks = (word) => {
  const w = encodeURIComponent(word);
  return {
    wordreference: `https://www.wordreference.com/es/en/translation.asp?spen=${w}`,
    spanishdict: `https://www.spanishdict.com/translate/${w}`,
    rae: `https://dle.rae.es/${w}`
  };
};

module.exports = {
  POS_MAP,
  DICT_PATH,
  getDict,
  dictionaryHasEntries,
  setDictionary,
  lookupForm,
  getEntryExtras,
  getDictionaryInfo,
  findMyCards,
  externalLinks,
  parseJson,
  hasLatin
};
