#!/usr/bin/env node
/**
 * Build the offline Spanish–English (or German–English) dictionary used by /api/dictionary/lookup.
 *
 * Schema version 2 also stores per-lemma IPA, inflected forms, example sentences (with English translation) and
 * etymology, plus the hand-written A1 lexicon; older files without those tables keep working (see server/dictionary.js).
 *
 * Input: the Spanish JSONL extract from kaikki.org (Wiktionary via wiktextract, CC BY-SA)
 *   https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl  (~1GB)
 *
 * German: https://kaikki.org/dictionary/German/kaikki.org-dictionary-German.jsonl  → data/dict/de-en.sqlite
 *
 * Usage: node server/scripts/build-dictionary.js <input.jsonl> [output.sqlite] [--lang es|de]
 *        (the language defaults to es, or de when the input file name contains "German")
 *
 * The file is streamed line by line, so this also runs on the 1GB VM.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { DatabaseSync } = require('node:sqlite');
const { normalizeWord } = require('../cardUtils');
const { writeLexicon } = require('../lexicon');
const { extractExtras } = require('../dictionaryExtras');

const DEFAULT_OUTS = {
  es: path.join(__dirname, '../../data/dict/es-en.sqlite'),
  de: path.join(__dirname, '../../data/dict/de-en.sqlite')
};
const DEFAULT_OUT = DEFAULT_OUTS.es;
const SKIP_POS = new Set(['name', 'character', 'symbol', 'punct', 'romanization', 'suffix', 'prefix', 'infix', 'interfix', 'affix', 'circumfix']);
// Senses that only add noise to a learner's lookup ("me" -> initialism of "muerte encefálica")
const SKIP_SENSE_TAGS = new Set(['abbreviation', 'initialism', 'acronym', 'obsolete', 'archaic', 'misspelling']);
const SKIP_VIA = /^(superseded|obsolete|archaic|misspelling|abbreviation|initialism|acronym|clipping|eye dialect|pronunciation spelling)/i;
const MAX_SENSES = 4;
const MAX_GLOSS = 140;

const clip = (s) => (s.length > MAX_GLOSS ? `${s.slice(0, MAX_GLOSS - 1)}…` : s);

// 'm' | 'f' | 'mf' | 'n' (German neuter) | ''
function detectGender(entry) {
  const tags = new Set([...(entry.tags || []), ...(entry.senses || []).flatMap(s => s.tags || [])]);
  let m = tags.has('masculine');
  let f = tags.has('feminine');
  let n = tags.has('neuter');
  if (!m && !f && !n) {
    // Head line such as "casa f (plural casas)", "artista m or f" or "Haus n (strong, …)"
    const head = entry.head_templates?.[0]?.expansion || '';
    // Longest alternatives first: "m or f" must not stop at "m"
    const match = head.match(/\s(m or f|f or m|mf|m pl|f pl|n pl|m|f|n)(?=\s|$|\(|,)/);
    if (match) {
      m = match[1].startsWith('m');
      f = match[1].includes('f');
      n = match[1].startsWith('n');
    }
  }
  if (m && f) return 'mf';
  if (n && !m && !f) return 'n';
  return m ? 'm' : f ? 'f' : n ? 'n' : '';
}

// "first-person singular preterite indicative of ir" -> "first-person singular preterite indicative"
// ["inflection of casar:", "third-person singular present indicative"] -> "third-person singular present indicative"
function formDescription(glosses, lemma) {
  const text = glosses.join(' ').trim();
  const inflection = text.match(/^inflection of .+?:\s*(.*)$/i);
  if (inflection) return clip(inflection[1]);
  const suffix = ` of ${lemma}`;
  const idx = text.toLowerCase().lastIndexOf(suffix.toLowerCase());
  return clip(idx > 0 ? text.slice(0, idx) : text);
}

/**
 * Turn one wiktextract entry into a compact row, or null to skip it.
 * @returns {{ word, word_norm, pos, gender, glosses: string[], form_of: {lemma, via}[], extras } | null}
 */
function toRow(entry, lang = 'es') {
  if (!entry || entry.lang_code !== lang || !entry.word || SKIP_POS.has(entry.pos)) return null;
  if (entry.word.length > 1 && entry.word === entry.word.toUpperCase() && /\p{Lu}/u.test(entry.word)) return null; // "ME", "ONU"
  const glosses = [];
  const formOf = [];
  for (const sense of entry.senses || []) {
    const senseGlosses = (sense.glosses || []).filter(Boolean);
    if (senseGlosses.length === 0 || (sense.tags || []).some(t => SKIP_SENSE_TAGS.has(t))) continue;
    const links = [...(sense.form_of || []), ...(sense.alt_of || [])].map(l => l.word).filter(Boolean);
    if (links.length > 0) {
      for (const lemma of links) {
        if (lemma === entry.word || formOf.some(f => f.lemma === lemma)) continue;
        const via = formDescription(senseGlosses, lemma);
        if (!SKIP_VIA.test(via)) formOf.push({ lemma, via });
      }
    } else if (glosses.length < MAX_SENSES) {
      // Nested senses repeat the parent gloss first; the last one is the specific meaning
      const g = clip(senseGlosses[senseGlosses.length - 1]);
      if (!glosses.includes(g)) glosses.push(g);
    }
  }
  if (glosses.length === 0 && formOf.length === 0) return null;
  return {
    word: entry.word,
    word_norm: normalizeWord(entry.word),
    pos: entry.pos || '',
    gender: detectGender(entry),
    glosses,
    form_of: formOf,
    // Only lemmas (entries with their own meanings) get forms, examples and etymology
    extras: glosses.length > 0 ? extractExtras(entry, lang) : null
  };
}

function createSchema(db) {
  db.exec(`
    DROP TABLE IF EXISTS entries;
    DROP TABLE IF EXISTS meta;
    CREATE TABLE entries (
      word TEXT NOT NULL,
      word_norm TEXT NOT NULL,   -- lowercase, no accents
      pos TEXT,                  -- wiktextract pos: noun, verb, adj, adv, ...
      gender TEXT,               -- 'm' | 'f' | 'mf' | 'n' | ''
      glosses TEXT,              -- JSON string[] (own meanings, English)
      form_of TEXT,              -- JSON {lemma, via}[] or NULL
      ipa TEXT                   -- '/aˈblaɾ/' (lemmas only)
    );
    CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);
    -- Extras are keyed by lemma + part of speech (a card stores these two, never a rowid) and read on demand
    DROP TABLE IF EXISTS forms;
    DROP TABLE IF EXISTS examples;
    DROP TABLE IF EXISTS etymology;
    CREATE TABLE forms (lemma TEXT NOT NULL, pos TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY (lemma, pos)) WITHOUT ROWID;       -- JSON [[form, 'tag tag']]
    CREATE TABLE examples (lemma TEXT NOT NULL, pos TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY (lemma, pos)) WITHOUT ROWID;    -- JSON [[es, en]]
    CREATE TABLE etymology (lemma TEXT NOT NULL, pos TEXT NOT NULL, text TEXT, chain TEXT, PRIMARY KEY (lemma, pos)) WITHOUT ROWID; -- chain: JSON [[lang, word, kind]]
  `);
}

async function build(input, output, { lang = 'es' } = {}) {
  output = output || DEFAULT_OUTS[lang] || DEFAULT_OUT;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const tmp = `${output}.tmp`;
  fs.rmSync(tmp, { force: true });

  const db = new DatabaseSync(tmp);
  db.exec('PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;');
  createSchema(db);
  const insert = db.prepare('INSERT INTO entries (word, word_norm, pos, gender, glosses, form_of, ipa) VALUES (?, ?, ?, ?, ?, ?, ?)');
  // The first entry of a lemma + pos wins (kaikki lists the most common homograph first)
  const insertForms = db.prepare('INSERT OR IGNORE INTO forms (lemma, pos, data) VALUES (?, ?, ?)');
  const insertExamples = db.prepare('INSERT OR IGNORE INTO examples (lemma, pos, data) VALUES (?, ?, ?)');
  const insertEtymology = db.prepare('INSERT OR IGNORE INTO etymology (lemma, pos, text, chain) VALUES (?, ?, ?, ?)');

  const rl = readline.createInterface({ input: fs.createReadStream(input), crlfDelay: Infinity });
  let lines = 0;
  let rows = 0;
  db.exec('BEGIN');
  for await (const line of rl) {
    if (!line) continue;
    lines++;
    let row;
    try {
      row = toRow(JSON.parse(line), lang);
    } catch (_) {
      continue;
    }
    if (!row) continue;
    const extras = row.extras;
    insert.run(
      row.word, row.word_norm, row.pos, row.gender,
      JSON.stringify(row.glosses),
      row.form_of.length ? JSON.stringify(row.form_of) : null,
      extras?.ipa || null
    );
    if (extras?.forms) insertForms.run(row.word, row.pos, JSON.stringify(extras.forms));
    if (extras?.examples) insertExamples.run(row.word, row.pos, JSON.stringify(extras.examples));
    if (extras?.etymology) insertEtymology.run(row.word, row.pos, extras.etymology.text || null, extras.etymology.chain.length ? JSON.stringify(extras.etymology.chain) : null);
    rows++;
    if (rows % 50000 === 0) {
      db.exec('COMMIT; BEGIN');
      process.stdout.write(`\r  ${rows.toLocaleString()} entries…`);
    }
  }
  db.exec('COMMIT');

  db.exec('CREATE INDEX idx_entries_norm ON entries(word_norm)');
  const meta = db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)');
  meta.run('source', 'Wiktionary via kaikki.org (CC BY-SA)');
  meta.run('built_at', new Date().toISOString());
  meta.run('entries', String(rows));
  meta.run('schema_version', '2');
  meta.run('lang', lang);
  // The file is replaced as a whole, so the hand-written lexicon has to be written before the rename
  // (the lexicon is Spanish only)
  const lexiconEntries = lang === 'es' ? writeLexicon(db) : 0;
  db.exec('VACUUM');
  db.close();
  fs.renameSync(tmp, output);

  return { lines, rows, lexiconEntries, bytes: fs.statSync(output).size, output };
}

// Language of a kaikki file: lang_code of its first entry, else the file name ("…German…"), else es
function detectInputLang(input) {
  try {
    const fd = fs.openSync(input, 'r');
    const buf = Buffer.alloc(256 * 1024);
    const n = fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    const first = buf.toString('utf8', 0, n).split('\n').find(l => l.trim());
    const code = first && JSON.parse(first).lang_code;
    if (DEFAULT_OUTS[code]) return code;
  } catch (_) { /* first line longer than the buffer or not JSON: fall back to the name */ }
  return /german/i.test(path.basename(input)) ? 'de' : 'es';
}

module.exports = { build, toRow, createSchema, detectGender, detectInputLang, DEFAULT_OUT, DEFAULT_OUTS };

if (require.main === module) {
  const args = process.argv.slice(2);
  const langAt = args.indexOf('--lang');
  const langArg = langAt >= 0 ? args.splice(langAt, 2)[1] : '';
  const [input, output] = args;
  if (!input) {
    console.error('Usage: node server/scripts/build-dictionary.js <kaikki-Spanish|German.jsonl> [output.sqlite] [--lang es|de]');
    process.exit(1);
  }
  const lang = langArg || detectInputLang(input);
  if (!DEFAULT_OUTS[lang]) {
    console.error(`Unknown language: ${lang} (es | de)`);
    process.exit(1);
  }
  console.log(`Building ${lang} dictionary from ${input}`);
  build(input, output, { lang })
    .then(({ lines, rows, lexiconEntries, bytes, output: out }) => {
      console.log(`\n✅ ${rows.toLocaleString()} entries (from ${lines.toLocaleString()} lines) + ${lexiconEntries} lexicon entries → ${out} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
    })
    .catch((err) => {
      console.error('\n❌ Build failed:', err);
      process.exit(1);
    });
}
