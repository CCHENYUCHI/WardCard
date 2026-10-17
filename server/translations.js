// Sentence translator history. Every function takes the db so tests can use an in-memory one.
const crypto = require('crypto');

// Per user, not tied to cards, so deleting cards needs no cleanup.
// input_hash is also looked up across users to reuse an earlier AI result.
const TRANSLATIONS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    input_text TEXT NOT NULL,          -- what the user typed, as typed
    input_hash TEXT NOT NULL,          -- translationHash(input_text)
    source_lang TEXT DEFAULT 'es',     -- 'es' | 'zh'
    translation_zh TEXT DEFAULT '',    -- copied out of result for the list and search
    result TEXT NOT NULL,              -- JSON (normalizeTranslation shape)
    model TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, input_hash)
  );
  CREATE INDEX IF NOT EXISTS idx_translations_hash ON translations(input_hash);
  CREATE INDEX IF NOT EXISTS idx_translations_user_time ON translations(user_id, created_at);
`;

const PAGE_SIZE = 30;

const translationHash = (text) =>
  crypto.createHash('sha1').update(String(text).replace(/\s+/g, ' ').trim().toLowerCase()).digest('hex');

const parseResult = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (_) {
    return {};
  }
};

const toRecord = (row) => ({
  ...parseResult(row.result),
  id: Number(row.id),
  input_text: row.input_text,
  source_lang: row.source_lang,
  created_at: row.created_at
});

const COLUMNS = 'id, input_text, source_lang, result, created_at';

function findOwnTranslation(db, userId, hash) {
  const row = db.prepare(`SELECT ${COLUMNS} FROM translations WHERE user_id = ? AND input_hash = ?`).get(userId, hash);
  return row ? toRecord(row) : null;
}

// Any user's earlier result for the same sentence, so it costs no AI call
function findSharedTranslation(db, hash) {
  const row = db.prepare('SELECT result, model FROM translations WHERE input_hash = ? LIMIT 1').get(hash);
  return row ? { result: parseResult(row.result), model: row.model } : null;
}

function saveTranslation(db, { userId, inputText, hash, result, model }) {
  db.prepare(`
    INSERT INTO translations (user_id, input_text, input_hash, source_lang, translation_zh, result, model)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, input_hash) DO NOTHING
  `).run(userId, inputText, hash, result.source_lang || 'es', result.translation_zh || '', JSON.stringify(result), model || null);
  return findOwnTranslation(db, userId, hash);
}

function listTranslations(db, userId, { q = '', offset = 0, limit = PAGE_SIZE } = {}) {
  const params = [userId];
  let where = 'user_id = ?';
  const query = String(q).trim();
  if (query) {
    const like = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
    where += " AND (input_text LIKE ? ESCAPE '\\' OR translation_zh LIKE ? ESCAPE '\\')";
    params.push(like, like);
  }
  const rows = db.prepare(`
    SELECT ${COLUMNS} FROM translations WHERE ${where}
    ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?
  `).all(...params, limit + 1, offset);
  return { items: rows.slice(0, limit).map(toRecord), hasMore: rows.length > limit };
}

function deleteTranslation(db, userId, id) {
  return db.prepare('DELETE FROM translations WHERE id = ? AND user_id = ?').run(id, userId).changes > 0;
}

module.exports = {
  TRANSLATIONS_SCHEMA,
  translationHash,
  findOwnTranslation,
  findSharedTranslation,
  saveTranslation,
  listTranslations,
  deleteTranslation
};
