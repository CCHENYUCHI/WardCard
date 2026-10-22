// Hand-written A1 lexicon (server/data/lexicon/a1/*.json): etymology story, memory hook and picture per word.
// The JSON files are copied into the `lexicon` table at startup when they change, so nothing stays in memory.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { normalizeWord, splitArticle } = require('./cardUtils');

const LEXICON_DIR = path.join(__dirname, 'data/lexicon/a1');
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

function readLexiconFiles(dir = LEXICON_DIR) {
  if (!fs.existsSync(dir)) return { version: '', files: [] };
  const names = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
  const hash = crypto.createHash('sha1');
  const files = names.map(name => {
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    hash.update(name).update(text);
    return { name, text };
  });
  return { version: hash.digest('hex'), files };
}

/** Reload the lexicon table when the JSON files changed. Returns the number of entries loaded, or null if unchanged. */
function syncLexicon(db, dir = LEXICON_DIR) {
  db.exec(SCHEMA);
  const { version, files } = readLexiconFiles(dir);
  const current = db.prepare("SELECT value FROM lexicon_meta WHERE key = 'version'").get();
  if (current?.value === version) return null;

  const insert = db.prepare('INSERT OR REPLACE INTO lexicon (word_key, word_norm, theme, data) VALUES (?, ?, ?, ?)');
  let count = 0;
  db.exec('BEGIN');
  try {
    db.exec('DELETE FROM lexicon');
    for (const { text } of files) {
      const { theme, entries = [] } = JSON.parse(text);
      for (const entry of entries) {
        insert.run(lexiconKey(entry.word), normalizeWord(entry.word), theme || '', JSON.stringify(entry));
        count++;
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
 * First lexicon entry for any of the candidate words (query, lemmas, card words), in order.
 * Exact spelling wins; an accent-insensitive match is used only when it is unambiguous ("arbol" -> árbol).
 */
function findLexiconEntry(db, candidates = []) {
  const exact = db.prepare('SELECT data FROM lexicon WHERE word_key = ?');
  const loose = db.prepare('SELECT data FROM lexicon WHERE word_norm = ? LIMIT 2');
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

module.exports = { LEXICON_DIR, lexiconKey, svgFileName, syncLexicon, findLexiconEntry };
