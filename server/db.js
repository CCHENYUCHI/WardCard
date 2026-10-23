require('./time'); // pin process TZ before SQLite evaluates 'localtime'
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const { TRANSLATIONS_SCHEMA } = require('./translations');
const { LOOKUP_HISTORY_SCHEMA } = require('./lookupHistory');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dataDir, 'wordcard.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance and low memory
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    word TEXT NOT NULL,
    article TEXT DEFAULT '',
    gender TEXT DEFAULT 'none',
    part_of_speech TEXT DEFAULT 'sustantivo',
    translation TEXT NOT NULL,
    english_translation TEXT DEFAULT '',
    definition_es TEXT DEFAULT '',
    example_es TEXT DEFAULT '',
    example_zh TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    category TEXT DEFAULT '日常生活',
    dele_level TEXT DEFAULT 'A2',
    repetition INTEGER DEFAULT 0,
    interval_days INTEGER DEFAULT 0,
    ease_factor REAL DEFAULT 2.5,
    due_date TEXT DEFAULT (datetime('now', 'localtime')),
    last_reviewed TEXT DEFAULT NULL,
    review_count INTEGER DEFAULT 0,
    lapse_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS review_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    card_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review_mode TEXT NOT NULL,
    reviewed_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(card_id) REFERENCES cards(id) ON DELETE CASCADE
  );
`);

// Run lightweight schema migrations for FSRS and Active Learning
function runMigrations() {
  const cardColumns = db.prepare("PRAGMA table_info(cards)").all().map(c => c.name);
  
  if (!cardColumns.includes('lifecycle_status')) {
    db.exec("ALTER TABLE cards ADD COLUMN lifecycle_status TEXT DEFAULT 'active'");
  }
  if (!cardColumns.includes('is_starred')) {
    db.exec("ALTER TABLE cards ADD COLUMN is_starred INTEGER DEFAULT 0");
  }
  if (!cardColumns.includes('mastery_stage')) {
    db.exec("ALTER TABLE cards ADD COLUMN mastery_stage INTEGER DEFAULT 1");
  }
  if (!cardColumns.includes('fsrs_stability')) {
    db.exec("ALTER TABLE cards ADD COLUMN fsrs_stability REAL DEFAULT 0.0");
  }
  if (!cardColumns.includes('fsrs_difficulty')) {
    db.exec("ALTER TABLE cards ADD COLUMN fsrs_difficulty REAL DEFAULT 5.0");
  }
  if (!cardColumns.includes('fsrs_reps')) {
    db.exec("ALTER TABLE cards ADD COLUMN fsrs_reps INTEGER DEFAULT 0");
  }
  if (!cardColumns.includes('curriculum_unit')) {
    db.exec("ALTER TABLE cards ADD COLUMN curriculum_unit TEXT DEFAULT ''");
  }
  // Link to the offline dictionary (server/cardDict.js): NULL = not looked up yet, '' = no matching entry
  if (!cardColumns.includes('dict_lemma')) {
    db.exec("ALTER TABLE cards ADD COLUMN dict_lemma TEXT DEFAULT NULL");
  }
  if (!cardColumns.includes('dict_pos')) {
    db.exec("ALTER TABLE cards ADD COLUMN dict_pos TEXT DEFAULT NULL");
  }

  // Migrate users table
  const userColumns = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!userColumns.includes('daily_new_quota')) {
    db.exec("ALTER TABLE users ADD COLUMN daily_new_quota INTEGER DEFAULT 15");
  }
  if (!userColumns.includes('target_retention')) {
    db.exec("ALTER TABLE users ADD COLUMN target_retention REAL DEFAULT 0.9");
  }
  if (!userColumns.includes('active_curriculum')) {
    db.exec("ALTER TABLE users ADD COLUMN active_curriculum TEXT DEFAULT ''");
  }

  // Daily progress: classify each review as today's task or extra practice
  const logColumns = db.prepare("PRAGMA table_info(review_logs)").all().map(c => c.name);
  if (!logColumns.includes('task_type')) {
    // 'due' (scheduled review) | 'new' (first time learned) | 'extra' (not due, extra practice); NULL = legacy, treated as 'due'
    db.exec("ALTER TABLE review_logs ADD COLUMN task_type TEXT DEFAULT NULL");
  }
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_review_logs_user_time ON review_logs(user_id, reviewed_at);

    -- Snapshot of each day's goal so history can show whether it was met
    CREATE TABLE IF NOT EXISTS daily_progress (
      user_id INTEGER NOT NULL,
      day TEXT NOT NULL,              -- 'YYYY-MM-DD' local date
      goal INTEGER DEFAULT 0,         -- today's task size (done + remaining)
      done INTEGER DEFAULT 0,         -- task cards completed (due + new)
      extra INTEGER DEFAULT 0,        -- extra practice reviews
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      PRIMARY KEY (user_id, day)
    );
  `);

  // One-off repair: due dates used to be written in UTC while everything else is local time,
  // making cards come due hours early. Recompute from last_reviewed + interval when the
  // stored value is off by a whole-hour time zone offset.
  const userVersion = Number(db.prepare('PRAGMA user_version').get().user_version) || 0;
  if (userVersion < 1) {
    const rows = db.prepare(`
      SELECT id, due_date, datetime(last_reviewed, '+' || interval_days || ' days') AS expected
      FROM cards
      WHERE last_reviewed IS NOT NULL AND interval_days > 0 AND due_date IS NOT NULL
        AND lifecycle_status IN ('active', 'mastered')
    `).all();
    const fix = db.prepare('UPDATE cards SET due_date = ? WHERE id = ?');
    let fixed = 0;
    for (const r of rows) {
      const diffSec = Math.round((Date.parse(r.expected.replace(' ', 'T')) - Date.parse(String(r.due_date).replace(' ', 'T'))) / 1000);
      const absDiff = Math.abs(diffSec);
      const offHour = Math.abs(absDiff - Math.round(absDiff / 3600) * 3600);
      if (absDiff >= 3600 - 5 && absDiff <= 14 * 3600 + 5 && offHour <= 5) {
        fix.run(r.expected, r.id);
        fixed++;
      }
    }
    if (fixed > 0) console.log(`🛠️  Repaired ${fixed} card due dates shifted by time zone offset`);

    // Backfill legacy review logs: a card's first-ever review = learning a new word, the rest = scheduled reviews
    db.exec(`
      UPDATE review_logs SET task_type = 'new'
      WHERE task_type IS NULL AND id IN (SELECT MIN(id) FROM review_logs GROUP BY card_id);
      UPDATE review_logs SET task_type = 'due' WHERE task_type IS NULL;
    `);
    db.exec('PRAGMA user_version = 1');
  }

  // Seed initial FSRS data for legacy cards if needed
  db.exec(`
    UPDATE cards
    SET 
      fsrs_stability = CASE WHEN interval_days > 0 THEN interval_days ELSE 0 END,
      fsrs_reps = repetition,
      mastery_stage = CASE 
        WHEN repetition >= 7 OR interval_days >= 45 THEN 5
        WHEN repetition >= 5 OR interval_days >= 16 THEN 4
        WHEN repetition >= 3 OR interval_days >= 6 THEN 3
        WHEN repetition >= 1 OR interval_days >= 2.5 THEN 2
        ELSE 1 
      END,
      lifecycle_status = CASE
        WHEN (repetition >= 7 OR interval_days >= 45) THEN 'mastered'
        ELSE 'active'
      END,
      curriculum_unit = CASE WHEN curriculum_unit = '' THEN category ELSE curriculum_unit END
    WHERE fsrs_stability = 0.0 AND repetition > 0;

    -- Backfill empty curriculum_unit from category for all cards
    UPDATE cards
    SET curriculum_unit = category
    WHERE (curriculum_unit IS NULL OR curriculum_unit = '') AND category IS NOT NULL AND category != '';
  `);

  // AI lookup caches, shared by all users and never tied to a card (nothing to clean up on delete)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sentence_analyses (
      sentence_hash TEXT PRIMARY KEY,   -- sha1 of the whitespace-normalized sentence
      sentence TEXT NOT NULL,
      result TEXT NOT NULL,             -- JSON { translation_zh, tokens: [{ text, lemma, pos, zh, usage }] }
      model TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS dictionary_cache (
      query_norm TEXT PRIMARY KEY,      -- normalizeWord(query)
      result TEXT NOT NULL,             -- JSON card (normalizeAiCard shape)
      model TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Sentence translator history (per user)
  db.exec(TRANSLATIONS_SCHEMA);

  // Word lookup history (per user)
  db.exec(LOOKUP_HISTORY_SCHEMA);
}

runMigrations();

// Insert default seed cards if database is empty
const countRow = db.prepare('SELECT count(*) as count FROM cards').get();
if (Number(countRow.count) === 0) {
  const seedCards = [
    {
      word: 'desarrollar',
      article: '',
      gender: 'none',
      part_of_speech: 'verbo',
      translation: '發展、開發',
      english_translation: 'to develop',
      definition_es: 'Hacer que algo crezca, progrese o alcance mayor perfección.',
      example_es: 'Queremos desarrollar una aplicación útil para estudiantes.',
      example_zh: '我們想為學生開發一個實用的應用程式。',
      notes: '規律動詞 (-ar)，名詞形為 el desarrollo (發展)。',
      category: '考試必背 (DELE)',
      dele_level: 'B1'
    },
    {
      word: 'problema',
      article: 'el',
      gender: 'masculino',
      part_of_speech: 'sustantivo',
      translation: '問題、難題',
      example_es: 'No te preocupes, no es un gran problema.',
      example_zh: '別擔心，這不是什麼大問題。',
      notes: '【重點常考】源自希臘文以 -ma 結尾的名詞，為陽性名詞 (el problema, el sistema, el tema)！',
      category: '考試必背 (DELE)',
      dele_level: 'A1'
    },
    {
      word: 'costumbre',
      article: 'la',
      gender: 'femenino',
      part_of_speech: 'sustantivo',
      translation: '習俗、習慣',
      example_es: 'Es una costumbre típica en España cenar tarde.',
      example_zh: '在西班牙晚吃晚餐是一種典型習俗。',
      notes: '以 -umbre 結尾的名詞皆為陰性 (la costumbre, la cumbre)。常用片語：tener la costumbre de (有...的習慣)。',
      category: '日常生活',
      dele_level: 'A2'
    },
    {
      word: 'acostumbrarse',
      article: '',
      gender: 'none',
      part_of_speech: 'verbo',
      translation: '習慣於、適應',
      example_es: 'Me estoy acostumbrando a levantarme temprano.',
      example_zh: '我正在漸漸習慣早起。',
      notes: '反身動詞，固定搭配介系詞 a：acostumbrarse a + inf. / sustantivo。',
      category: '日常生活',
      dele_level: 'B1'
    },
    {
      word: 'maravilloso',
      article: '',
      gender: 'none',
      part_of_speech: 'adjetivo',
      translation: '精彩的、美妙的',
      example_es: '¡Tuvimos unas vacaciones maravillosas en Barcelona!',
      example_zh: '我們在巴塞隆納度過了一個美妙的假期！',
      notes: '陰性形式為 maravillosa。常用感嘆句：¡Qué maravilloso!',
      category: '日常生活',
      dele_level: 'A2'
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO cards (word, article, gender, part_of_speech, translation, english_translation, definition_es, example_es, example_zh, notes, category, dele_level, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
  `);

  for (const card of seedCards) {
    insertStmt.run(
      card.word,
      card.article,
      card.gender,
      card.part_of_speech,
      card.translation,
      card.english_translation || '',
      card.definition_es || '',
      card.example_es,
      card.example_zh,
      card.notes,
      card.category,
      card.dele_level
    );
  }
}

// Handle schema migrations for existing databases
try {
  db.exec('ALTER TABLE cards ADD COLUMN user_id INTEGER DEFAULT 1;');
} catch (e) {
  // Column already exists
}

try {
  db.exec('ALTER TABLE review_logs ADD COLUMN user_id INTEGER DEFAULT 1;');
} catch (e) {
  // Column already exists
}

// Create unique index for user_id + word to support UPSERT per user
db.exec('DROP INDEX IF EXISTS idx_cards_word;');
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_user_word ON cards(user_id, word);');

// Create a default admin user if none exists
const userCountRow = db.prepare('SELECT count(*) as count FROM users').get();
if (Number(userCountRow.count) === 0) {
  const bcrypt = require('bcryptjs');
  // Default password: password123 (You should change this later!)
  const hash = bcrypt.hashSync('password123', 10);
  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

module.exports = db;
