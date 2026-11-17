// Word lookup history (dictionary page + tap-a-word). Every function takes the db so tests can use an in-memory one.
const { normalizeWord } = require('./cardUtils');

// One row per user per learning language per word; looking the same word up again bumps the count.
// Not tied to cards, so deleting cards needs no cleanup.
const LOOKUP_HISTORY_TABLE = `
  CREATE TABLE IF NOT EXISTS lookup_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lang TEXT NOT NULL DEFAULT 'es',         -- learning language (server/languages)
    query TEXT NOT NULL,                     -- latest spelling the user looked up
    query_norm TEXT NOT NULL,                -- normalizeWord(query)
    lemma TEXT DEFAULT '',                   -- dictionary form found (fui -> ir)
    translation TEXT DEFAULT '',             -- Chinese meaning found, filled in later by AI lookup if empty
    lookup_count INTEGER DEFAULT 1,
    last_source TEXT DEFAULT 'dictionary',   -- 'dictionary' | 'tap'
    first_at TEXT DEFAULT (datetime('now', 'localtime')),
    last_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, lang, query_norm)
  );`;
const LOOKUP_HISTORY_SCHEMA = `${LOOKUP_HISTORY_TABLE}
  DROP INDEX IF EXISTS idx_lookup_history_user_time;
  CREATE INDEX IF NOT EXISTS idx_lookup_history_user_lang_time ON lookup_history(user_id, lang, last_at);
`;

// Older databases have UNIQUE(user_id, query_norm) and no lang: rebuild the table, existing rows are Spanish.
// Run before LOOKUP_HISTORY_SCHEMA.
function migrateLookupHistory(db) {
  const columns = db.prepare('PRAGMA table_info(lookup_history)').all().map(c => c.name);
  if (columns.length === 0 || columns.includes('lang')) return false;
  db.exec('BEGIN');
  try {
    db.exec('DROP INDEX IF EXISTS idx_lookup_history_user_time');
    db.exec('ALTER TABLE lookup_history RENAME TO lookup_history_old');
    db.exec(LOOKUP_HISTORY_TABLE);
    db.exec(`
      INSERT INTO lookup_history (id, user_id, lang, query, query_norm, lemma, translation, lookup_count, last_source, first_at, last_at)
      SELECT id, user_id, 'es', query, query_norm, lemma, translation, lookup_count, last_source, first_at, last_at FROM lookup_history_old;
      DROP TABLE lookup_history_old;
    `);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return true;
}

const PAGE_SIZE = 30;
const SOURCES = new Set(['dictionary', 'tap']);

function recordLookup(db, { userId, lang = 'es', query, lemma = '', translation = '', source = 'dictionary' }) {
  const text = String(query || '').trim();
  const norm = normalizeWord(text);
  if (!norm) return;
  db.prepare(`
    INSERT INTO lookup_history (user_id, lang, query, query_norm, lemma, translation, last_source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, lang, query_norm) DO UPDATE SET
      lookup_count = lookup_count + 1,
      last_at = datetime('now', 'localtime'),
      query = excluded.query,
      last_source = excluded.last_source,
      lemma = COALESCE(NULLIF(excluded.lemma, ''), lemma),
      translation = COALESCE(NULLIF(excluded.translation, ''), translation)
  `).run(
    userId, lang, text, norm,
    String(lemma || '').trim(),
    String(translation || '').trim(),
    SOURCES.has(source) ? source : 'dictionary'
  );
}

// After "用 AI 查中文": fill in the meaning only if the row doesn't have one yet
function setLookupTranslation(db, userId, query, translation, lang = 'es') {
  const zh = String(translation || '').trim();
  const norm = normalizeWord(query);
  if (!zh || !norm) return;
  db.prepare(`
    UPDATE lookup_history SET translation = ?
    WHERE user_id = ? AND lang = ? AND query_norm = ? AND translation = ''
  `).run(zh, userId, lang, norm);
}

const toRecord = (row) => ({
  id: Number(row.id),
  query: row.query,
  lemma: row.lemma,
  translation: row.translation,
  lookup_count: Number(row.lookup_count),
  last_source: row.last_source,
  first_at: row.first_at,
  last_at: row.last_at,
  card_id: row.card_id == null ? null : Number(row.card_id),
  lifecycle_status: row.lifecycle_status || null
});

const ORDER_BY = {
  recent: 'h.last_at DESC, h.id DESC',
  count: 'h.lookup_count DESC, h.last_at DESC, h.id DESC'
};

function listLookups(db, userId, { lang = 'es', q = '', sort = 'recent', offset = 0, limit = PAGE_SIZE } = {}) {
  const params = [userId, lang];
  let where = 'h.user_id = ? AND h.lang = ?';
  const query = String(q).trim();
  if (query) {
    const like = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
    where += " AND (h.query LIKE ? ESCAPE '\\' OR h.lemma LIKE ? ESCAPE '\\' OR h.translation LIKE ? ESCAPE '\\')";
    params.push(like, like, like);
  }
  // The card (if any) under the dictionary form, or under the word as typed;
  // its meaning fills in for words looked up before they were added
  const rows = db.prepare(`
    SELECT h.id, h.query, h.lemma, h.lookup_count, h.last_source, h.first_at, h.last_at,
           COALESCE(NULLIF(h.translation, ''), c.translation, '') AS translation,
           c.id AS card_id, c.lifecycle_status
    FROM lookup_history h
    LEFT JOIN cards c ON c.id = (
      SELECT id FROM cards WHERE user_id = h.user_id AND lang = h.lang AND word IN (NULLIF(h.lemma, ''), h.query) LIMIT 1
    )
    WHERE ${where}
    ORDER BY ${ORDER_BY[sort] || ORDER_BY.recent}
    LIMIT ? OFFSET ?
  `).all(...params, limit + 1, offset);
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM lookup_history h WHERE ${where}`).get(...params);
  return { items: rows.slice(0, limit).map(toRecord), hasMore: rows.length > limit, total: Number(total) };
}

function deleteLookup(db, userId, id) {
  return db.prepare('DELETE FROM lookup_history WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
}

// Clears one learning language only
function clearLookups(db, userId, lang = 'es') {
  return Number(db.prepare('DELETE FROM lookup_history WHERE user_id = ? AND lang = ?').run(userId, lang).changes);
}

module.exports = {
  LOOKUP_HISTORY_SCHEMA,
  migrateLookupHistory,
  recordLookup,
  setLookupTranslation,
  listLookups,
  deleteLookup,
  clearLookups
};
