#!/usr/bin/env node
/**
 * Build the offline Spanish–English dictionary used by /api/dictionary/lookup.
 *
 * Input: the Spanish JSONL extract from kaikki.org (Wiktionary via wiktextract, CC BY-SA)
 *   https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl  (~1GB)
 *
 * Usage: node server/scripts/build-dictionary.js <input.jsonl> [output.sqlite]
 *
 * The file is streamed line by line, so this also runs on the 1GB VM.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { DatabaseSync } = require('node:sqlite');
const { normalizeWord } = require('../cardUtils');
const { writeLexicon } = require('../lexicon');

const DEFAULT_OUT = path.join(__dirname, '../../data/dict/es-en.sqlite');
const SKIP_POS = new Set(['name', 'character', 'symbol', 'punct', 'romanization', 'suffix', 'prefix', 'infix', 'interfix', 'affix', 'circumfix']);
// Senses that only add noise to a learner's lookup ("me" -> initialism of "muerte encefálica")
const SKIP_SENSE_TAGS = new Set(['abbreviation', 'initialism', 'acronym', 'obsolete', 'archaic', 'misspelling']);
const SKIP_VIA = /^(superseded|obsolete|archaic|misspelling|abbreviation|initialism|acronym|clipping|eye dialect|pronunciation spelling)/i;
const MAX_SENSES = 4;
const MAX_GLOSS = 140;

const clip = (s) => (s.length > MAX_GLOSS ? `${s.slice(0, MAX_GLOSS - 1)}…` : s);

// 'm' | 'f' | 'mf' | ''
function detectGender(entry) {
  const tags = new Set([...(entry.tags || []), ...(entry.senses || []).flatMap(s => s.tags || [])]);
  let m = tags.has('masculine');
  let f = tags.has('feminine');
  if (!m && !f) {
    // Head line such as "casa f (plural casas)" or "artista m or f"
    const head = entry.head_templates?.[0]?.expansion || '';
    const match = head.match(/\s(m|f|mf|m or f|m pl|f pl)(?=\s|$|\()/);
    if (match) {
      m = match[1].startsWith('m');
      f = match[1].includes('f');
    }
  }
  return m && f ? 'mf' : m ? 'm' : f ? 'f' : '';
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
 * @returns {{ word, word_norm, pos, gender, glosses: string[], form_of: {lemma, via}[] } | null}
 */
function toRow(entry) {
  if (!entry || entry.lang_code !== 'es' || !entry.word || SKIP_POS.has(entry.pos)) return null;
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
    form_of: formOf
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
      gender TEXT,               -- 'm' | 'f' | 'mf' | ''
      glosses TEXT,              -- JSON string[] (own meanings, English)
      form_of TEXT               -- JSON {lemma, via}[] or NULL
    );
    CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);
  `);
}

async function build(input, output = DEFAULT_OUT) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const tmp = `${output}.tmp`;
  fs.rmSync(tmp, { force: true });

  const db = new DatabaseSync(tmp);
  db.exec('PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;');
  createSchema(db);
  const insert = db.prepare('INSERT INTO entries (word, word_norm, pos, gender, glosses, form_of) VALUES (?, ?, ?, ?, ?, ?)');

  const rl = readline.createInterface({ input: fs.createReadStream(input), crlfDelay: Infinity });
  let lines = 0;
  let rows = 0;
  db.exec('BEGIN');
  for await (const line of rl) {
    if (!line) continue;
    lines++;
    let row;
    try {
      row = toRow(JSON.parse(line));
    } catch (_) {
      continue;
    }
    if (!row) continue;
    insert.run(
      row.word, row.word_norm, row.pos, row.gender,
      JSON.stringify(row.glosses),
      row.form_of.length ? JSON.stringify(row.form_of) : null
    );
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
  // The file is replaced as a whole, so the hand-written lexicon has to be written before the rename
  const lexiconEntries = writeLexicon(db);
  db.exec('VACUUM');
  db.close();
  fs.renameSync(tmp, output);

  return { lines, rows, lexiconEntries, bytes: fs.statSync(output).size, output };
}

module.exports = { build, toRow, createSchema, DEFAULT_OUT };

if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input) {
    console.error('Usage: node server/scripts/build-dictionary.js <kaikki-Spanish.jsonl> [output.sqlite]');
    process.exit(1);
  }
  console.log(`Building dictionary from ${input}`);
  build(input, output || DEFAULT_OUT)
    .then(({ lines, rows, lexiconEntries, bytes, output: out }) => {
      console.log(`\n✅ ${rows.toLocaleString()} entries (from ${lines.toLocaleString()} lines) + ${lexiconEntries} lexicon entries → ${out} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
    })
    .catch((err) => {
      console.error('\n❌ Build failed:', err);
      process.exit(1);
    });
}
