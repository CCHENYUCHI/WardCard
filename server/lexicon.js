// Lexicon (server/data/lexicon/<set>/*.json): etymology story, memory hook and picture per word.
// Sets: a1/ (written by Claude from Wiktionary facts) and freq/ (common words by frequency, written by Gemini
// from the same facts and machine-checked, see server/scripts/lexicon/WRITING.md).
// It lives in the read-only offline dictionary file (es-en.sqlite) next to the Wiktionary entries, written by
// `npm run build:lexicon` (or at the end of `npm run build:dict`); the app database never holds it.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { normalizeWord, splitArticle } = require('./cardUtils');

const LEXICON_ROOT = path.join(__dirname, 'data/lexicon');
const LEXICON_SETS = ['a1', 'freq'];
const LEXICON_DIRS = LEXICON_SETS.map(set => path.join(LEXICON_ROOT, set));
const IMAGE_BASE = '/lexicon';

// Accents are kept: sí / si, té / te and él / el are different entries
const lexiconKey = (word) => String(word || '').trim().toLowerCase();
const svgFileName = (word) => `${lexiconKey(word).replace(/\s+/g, '_')}.svg`;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS lexicon (
    word_key TEXT PRIMARY KEY,   -- lexiconKey(word)
    word_norm TEXT NOT NULL,     -- normalizeWord(word), for accent-insensitive lookups
    theme TEXT,
    data TEXT NOT NULL           -- JSON entry (see server/scripts/lexicon/WRITING.md)
  );
  CREATE INDEX IF NOT EXISTS idx_lexicon_norm ON lexicon(word_norm);
  CREATE TABLE IF NOT EXISTS lexicon_meta (key TEXT PRIMARY KEY, value TEXT);
`;

/** JSON files of one lexicon folder or several (missing folders are skipped), as { name: '<folder>/<file>', text } */
function readLexiconFiles(dirs = LEXICON_DIRS) {
  const hash = crypto.createHash('sha1');
  const files = [];
  for (const dir of [].concat(dirs)) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
      const name = `${path.basename(dir)}/${file}`;
      const text = fs.readFileSync(path.join(dir, file), 'utf8');
      hash.update(name).update(text);
      files.push({ name, text });
    }
  }
  return { version: files.length ? hash.digest('hex') : '', files };
}

/**
 * Replace the lexicon tables in a writable dictionary database. Returns the number of entries written.
 * A word in several sets keeps its first entry (a1 before freq).
 */
function writeLexicon(db, dirs = LEXICON_DIRS) {
  db.exec(SCHEMA);
  const { version, files } = readLexiconFiles(dirs);
  const insert = db.prepare('INSERT OR IGNORE INTO lexicon (word_key, word_norm, theme, data) VALUES (?, ?, ?, ?)');
  let count = 0;
  db.exec('BEGIN');
  try {
    db.exec('DELETE FROM lexicon');
    for (const { text } of files) {
      const { theme, entries = [] } = JSON.parse(text);
      for (const entry of entries) {
        count += Number(insert.run(lexiconKey(entry.word), normalizeWord(entry.word), theme || '', JSON.stringify(entry)).changes);
      }
    }
    db.prepare("INSERT OR REPLACE INTO lexicon_meta (key, value) VALUES ('version', ?)").run(version);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return count;
}

const withImage = (entry) => {
  const emoji = /^emoji:(.+)$/u.exec(entry.image || '');
  return {
    ...entry,
    image_url: entry.image === 'svg' ? `${IMAGE_BASE}/${encodeURIComponent(svgFileName(entry.word))}` : '',
    emoji: emoji ? emoji[1] : ''
  };
};

/**
 * First lexicon entry (from the dictionary database) for any of the candidate words (query, lemmas, card words), in order.
 * Exact spelling wins; an accent-insensitive match is used only when it is unambiguous ("arbol" -> árbol).
 */
function findLexiconEntry(dict, candidates = []) {
  if (!dict) return null;
  let exact;
  let loose;
  try {
    exact = dict.prepare('SELECT data FROM lexicon WHERE word_key = ?');
    loose = dict.prepare('SELECT data FROM lexicon WHERE word_norm = ? LIMIT 2');
  } catch (_) {
    return null; // dictionary built before the lexicon existed: no such table
  }
  const words = candidates.map(c => splitArticle(String(c || '')).word).filter(Boolean);
  for (const w of words) {
    const row = exact.get(lexiconKey(w));
    if (row) return withImage(JSON.parse(row.data));
  }
  for (const w of words) {
    const rows = loose.all(normalizeWord(w));
    if (rows.length === 1) return withImage(JSON.parse(rows[0].data));
  }
  return null;
}

module.exports = { LEXICON_ROOT, LEXICON_SETS, LEXICON_DIRS, readLexiconFiles, lexiconKey, svgFileName, writeLexicon, findLexiconEntry };
