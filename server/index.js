require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { extractSpanishWords, calibrateDeleLevels } = require('./ai');
const { reviewCardFSRS } = require('./fsrs');

const JWT_SECRET = process.env.JWT_SECRET || 'palabracard-super-secret-key-2026';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: '未提供登入憑證' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: '憑證無效或已過期' });
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Spanish TTS Audio Proxy (Ultra-lightweight, native Node 22 fetch, browser cached)
app.get('/api/tts', async (req, res) => {
  try {
    const text = (req.query.text || '').toString().trim();
    const lang = (req.query.lang || 'es').toString().trim();
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;
    const upstreamRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!upstreamRes.ok) {
      return res.status(502).json({ error: 'Failed to fetch audio stream' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const arrayBuffer = await upstreamRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('TTS proxy error:', error);
    res.status(500).json({ error: 'TTS service error' });
  }
});


// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '請提供帳號與密碼' });

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) return res.status(400).json({ error: '帳號已被使用' });

    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
    
    const token = jwt.sign({ userId: result.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: { id: result.lastInsertRowid, username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '請提供帳號與密碼' });

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' });

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: '帳號或密碼錯誤' });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Categories list
app.get('/api/categories', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`SELECT DISTINCT category FROM cards WHERE user_id = ? AND category IS NOT NULL AND category != ''`).all(req.user.userId);
    const categories = rows.map(r => r.category);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cards (with optional filtering)
app.get('/api/cards', authenticateToken, (req, res) => {
  try {
    const { category, dele, search, filter, status, stage, unit, starred } = req.query;
    let sql = 'SELECT * FROM cards WHERE user_id = ?';
    const params = [req.user.userId];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (unit && unit !== 'all') {
      sql += ' AND curriculum_unit = ?';
      params.push(unit);
    }

    if (status && status !== 'all') {
      sql += ' AND lifecycle_status = ?';
      params.push(status);
    }

    if (starred === '1' || starred === 'true') {
      sql += ' AND is_starred = 1';
    }

    if (stage && stage !== 'all') {
      sql += ' AND mastery_stage = ?';
      params.push(Number(stage));
    }

    if (dele && dele !== 'all') {
      sql += ' AND dele_level = ?';
      params.push(dele);
    }

    if (search && search.trim()) {
      sql += ' AND (word LIKE ? OR translation LIKE ? OR notes LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (filter === 'due') {
      sql += " AND lifecycle_status = 'active' AND due_date <= datetime('now', 'localtime')";
    } else if (filter === 'learned') {
      sql += ' AND repetition > 0';
    } else if (filter === 'new') {
      sql += ' AND repetition = 0';
    }

    sql += ' ORDER BY id DESC';

    const cards = db.prepare(sql).all(...params);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cards due for review (Active only)
app.get('/api/cards/due', authenticateToken, (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    let sql = "SELECT * FROM cards WHERE user_id = ? AND lifecycle_status = 'active' AND due_date <= datetime('now', 'localtime')";
    const params = [req.user.userId];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY due_date ASC LIMIT ?';
    params.push(Number(limit));

    const cards = db.prepare(sql).all(...params);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create single or batch cards
app.post('/api/cards', authenticateToken, (req, res) => {
  try {
    const body = req.body;
    const cards = Array.isArray(body) ? body : [body];
    const userId = req.user.userId;

    const insertStmt = db.prepare(`
      INSERT INTO cards (
        user_id, word, article, gender, part_of_speech, translation, english_translation,
        definition_es, example_es, example_zh, notes, category, dele_level,
        lifecycle_status, is_starred, mastery_stage, curriculum_unit, due_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
      ON CONFLICT(user_id, word) DO UPDATE SET
        article=excluded.article,
        gender=excluded.gender,
        part_of_speech=excluded.part_of_speech,
        translation=excluded.translation,
        english_translation=excluded.english_translation,
        definition_es=excluded.definition_es,
        example_es=excluded.example_es,
        example_zh=excluded.example_zh,
        notes=excluded.notes,
        category=excluded.category,
        dele_level=excluded.dele_level,
        lifecycle_status=excluded.lifecycle_status,
        is_starred=excluded.is_starred,
        curriculum_unit=excluded.curriculum_unit,
        updated_at=datetime('now', 'localtime')
    `);

    const insertedIds = [];
    for (const card of cards) {
      if (!card.word || !card.translation) continue;
      
      let w = card.word.trim();
      let a = card.article ? card.article.trim() : '';
      if (!a && w.includes(' ')) {
        const parts = w.split(' ');
        if (['el', 'la', 'los', 'las', 'un', 'una'].includes(parts[0].toLowerCase())) {
          a = parts[0].toLowerCase();
          w = parts.slice(1).join(' ');
        }
      }

      const cat = card.category || '日常生活';
      const unit = card.curriculum_unit || cat;
      const status = card.lifecycle_status || 'active';
      const starred = card.is_starred ? 1 : 0;
      const stage = Number(card.mastery_stage) || 1;

      const result = insertStmt.run(
        userId,
        w,
        a,
        card.gender || 'none',
        card.part_of_speech || 'sustantivo',
        card.translation.trim(),
        card.english_translation || '',
        card.definition_es || '',
        card.example_es || '',
        card.example_zh || '',
        card.notes || '',
        cat,
        card.dele_level || 'A2',
        status,
        starred,
        stage,
        unit
      );
      insertedIds.push(Number(result.lastInsertRowid));
    }

    res.status(201).json({ success: true, count: insertedIds.length, ids: insertedIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update card
app.put('/api/cards/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      word, article, gender, part_of_speech, translation, english_translation,
      definition_es, example_es, example_zh, notes, category, dele_level,
      lifecycle_status, is_starred, mastery_stage, curriculum_unit
    } = req.body;

    const existing = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(Number(id), userId);
    if (!existing) {
      return res.status(404).json({ error: 'Card not found or unauthorized' });
    }

    const cat = category || existing.category || '日常生活';
    const unit = curriculum_unit !== undefined ? curriculum_unit : (existing.curriculum_unit || cat);
    const status = lifecycle_status || existing.lifecycle_status || 'active';
    const starred = is_starred !== undefined ? (is_starred ? 1 : 0) : existing.is_starred;
    const stage = mastery_stage !== undefined ? Number(mastery_stage) : existing.mastery_stage;

    const stmt = db.prepare(`
      UPDATE cards
      SET word = ?, article = ?, gender = ?, part_of_speech = ?, translation = ?, english_translation = ?,
          definition_es = ?, example_es = ?, example_zh = ?, notes = ?, category = ?, dele_level = ?,
          lifecycle_status = ?, is_starred = ?, mastery_stage = ?, curriculum_unit = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(
      word.trim(),
      article ? article.trim() : '',
      gender || 'none',
      part_of_speech || 'sustantivo',
      translation.trim(),
      english_translation || '',
      definition_es || '',
      example_es || '',
      example_zh || '',
      notes || '',
      cat,
      dele_level || 'A2',
      status,
      starred,
      stage,
      unit,
      Number(id),
      userId
    );

    const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(Number(id));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete card
app.delete('/api/cards/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM cards WHERE id = ? AND user_id = ?');
    const result = stmt.run(Number(id), req.user.userId);
    if (result.changes === 0) return res.status(404).json({ error: 'Card not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload CSV endpoint
app.post('/api/cards/upload-csv', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const userId = req.user.userId;
    
    const records = parse(req.file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const insertStmt = db.prepare(`
      INSERT INTO cards (user_id, word, article, gender, translation, english_translation, notes, definition_es, example_es, example_zh, category, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
      ON CONFLICT(user_id, word) DO UPDATE SET
        article=excluded.article,
        gender=excluded.gender,
        translation=excluded.translation,
        english_translation=excluded.english_translation,
        notes=excluded.notes,
        definition_es=excluded.definition_es,
        example_es=excluded.example_es,
        example_zh=excluded.example_zh,
        category=excluded.category,
        updated_at=datetime('now', 'localtime')
    `);

    let processed = 0;
    for (const record of records) {
      let rawWord = record.Spanish || record.word || '';
      if (!rawWord) continue;

      let a = '';
      let w = rawWord;
      const parts = w.split(' ');
      if (['el', 'la', 'los', 'las', 'un', 'una'].includes(parts[0].toLowerCase())) {
        a = parts[0].toLowerCase();
        w = parts.slice(1).join(' ');
      }

      insertStmt.run(
        userId,
        w,
        a,
        record.Gender || record.gender || 'none',
        record.Chinese || record.translation || '',
        record.English || record.english_translation || '',
        record.Note_EN || record.Notes || record.notes || '',
        record.Definición || record.definition_es || '',
        record.Ejemplo || record.example_es || '',
        record.Example_ZH || record.example_zh || '',
        record.Category || record.category || '日常生活'
      );
      processed++;
    }

    res.json({ success: true, count: processed });
  } catch (err) {
    console.error('CSV Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Review card (FSRS v4.5 + Hybrid SM-2 Compatible)
app.post('/api/cards/:id/review', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { rating, review_mode = 'flashcard', tested_stage } = req.body;
    const score = Number(rating);

    const card = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(Number(id), userId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const targetRetention = user && user.target_retention ? Number(user.target_retention) : 0.9;

    // 1. Run FSRS Engine
    const fsrsRes = reviewCardFSRS(card, score, { targetRetention });

    // 2. Also keep legacy SM-2 compatibility fields populated
    let repetition = Number(card.repetition) || 0;
    let interval = fsrsRes.intervalDays;
    let easeFactor = Number(card.ease_factor) || 2.5;
    let reviewCount = (Number(card.review_count) || 0) + 1;
    let lapseCount = fsrsRes.lapseCount;

    if (score < 3) {
      repetition = 0;
    } else {
      repetition += 1;
    }
    const q = score === 1 ? 1 : score === 2 ? 2 : score === 3 ? 4 : 5;
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const newStatus = fsrsRes.isMastered ? 'mastered' : 'active';

    db.prepare(`
      UPDATE cards
      SET 
        fsrs_stability = ?, fsrs_difficulty = ?, fsrs_reps = ?, mastery_stage = ?,
        repetition = ?, interval_days = ?, ease_factor = ?, review_count = ?, lapse_count = ?,
        due_date = ?, last_reviewed = datetime('now', 'localtime'),
        lifecycle_status = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND user_id = ?
    `).run(
      fsrsRes.stability,
      fsrsRes.difficulty,
      fsrsRes.reps,
      fsrsRes.stage,
      repetition,
      interval,
      easeFactor,
      reviewCount,
      lapseCount,
      fsrsRes.dueDate,
      newStatus,
      Number(id),
      userId
    );

    // 3. Log review
    db.prepare(`
      INSERT INTO review_logs (user_id, card_id, rating, review_mode, reviewed_at)
      VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
    `).run(userId, Number(id), score, `${review_mode}:${tested_stage || fsrsRes.stage}`);

    const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(Number(id));
    res.json({
      success: true,
      card: updated,
      fsrs: fsrsRes
    });
  } catch (err) {
    console.error('Review Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Active Learning & Agenda APIs ---

// Today's Actionable Study Agenda
app.get('/api/study/agenda', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) || {};
    const quota = Number(user.daily_new_quota) || 15;
    const activeCurriculum = user.active_curriculum || '';

    // Unit filter clause for active curriculum
    const unitFilterSql = activeCurriculum 
      ? " AND (curriculum_unit = ? OR ((curriculum_unit IS NULL OR curriculum_unit = '') AND category = ?))" 
      : "";
    const unitParams = activeCurriculum ? [activeCurriculum, activeCurriculum] : [];

    // 1. Due reviews (Active cards only, matching active curriculum if set)
    const dueCards = db.prepare(`
      SELECT * FROM cards 
      WHERE user_id = ? AND lifecycle_status = 'active' AND due_date <= datetime('now', 'localtime') ${unitFilterSql}
      ORDER BY 
        CASE WHEN lapse_count > 0 THEN 0 ELSE 1 END,
        due_date ASC
      LIMIT 100
    `).all(userId, ...unitParams);

    // Split into urgent (lapses / Stage 1) and regular
    const urgentReviews = dueCards.filter(c => c.lapse_count > 0 || c.mastery_stage === 1);
    const regularReviews = dueCards.filter(c => c.lapse_count === 0 && c.mastery_stage > 1);

    // 2. Candidate new cards to activate for today
    let candidateNew = [];
    if (activeCurriculum) {
      candidateNew = db.prepare(`
        SELECT * FROM cards 
        WHERE user_id = ? AND lifecycle_status = 'ready' AND (curriculum_unit = ? OR ((curriculum_unit IS NULL OR curriculum_unit = '') AND category = ?))
        ORDER BY is_starred DESC, id ASC
        LIMIT ?
      `).all(userId, activeCurriculum, activeCurriculum, quota);
    } else {
      // Global mode
      candidateNew = db.prepare(`
        SELECT * FROM cards 
        WHERE user_id = ? AND lifecycle_status = 'ready'
        ORDER BY is_starred DESC, id ASC
        LIMIT ?
      `).all(userId, quota);
    }

    // 3. Stats & Stage breakdown (scoped to active curriculum if active, otherwise all)
    const statsRow = db.prepare(`
      SELECT 
        COUNT(*) as total_cards,
        SUM(CASE WHEN lifecycle_status = 'inbox' THEN 1 ELSE 0 END) as inbox_count,
        SUM(CASE WHEN lifecycle_status = 'ready' THEN 1 ELSE 0 END) as ready_count,
        SUM(CASE WHEN lifecycle_status = 'active' THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as mastered_count,
        SUM(CASE WHEN mastery_stage = 1 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage1_count,
        SUM(CASE WHEN mastery_stage = 2 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage2_count,
        SUM(CASE WHEN mastery_stage = 3 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage3_count,
        SUM(CASE WHEN mastery_stage = 4 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage4_count
      FROM cards WHERE user_id = ? ${unitFilterSql}
    `).get(userId, ...unitParams);

    // 4. Progress in active curriculum track
    let curriculumProgress = null;
    if (activeCurriculum && activeCurriculum !== 'ALL_ACTIVE') {
      const curRow = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN mastery_stage >= 3 OR lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as proficient,
          SUM(CASE WHEN lifecycle_status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as mastered
        FROM cards 
        WHERE user_id = ? AND (curriculum_unit = ? OR ((curriculum_unit IS NULL OR curriculum_unit = '') AND category = ?))
      `).get(userId, activeCurriculum, activeCurriculum);
      
      const total = Number(curRow.total) || 0;
      const proficient = Number(curRow.proficient) || 0;
      curriculumProgress = {
        unit: activeCurriculum,
        total,
        proficient,
        percentage: total > 0 ? Math.round((proficient / total) * 100) : 0
      };
    } else {
      // Overall progress across all active units
      const curRow = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN mastery_stage >= 3 OR lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as proficient,
          SUM(CASE WHEN lifecycle_status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as mastered
        FROM cards 
        WHERE user_id = ? AND lifecycle_status IN ('active', 'mastered')
      `).get(userId);
      
      const total = Number(curRow.total) || 0;
      const proficient = Number(curRow.proficient) || 0;
      curriculumProgress = {
        unit: '所有主修單元',
        total,
        proficient,
        percentage: total > 0 ? Math.round((proficient / total) * 100) : 0
      };
    }

    res.json({
      agenda: {
        total_due: dueCards.length,
        urgent_reviews: urgentReviews,
        regular_reviews: regularReviews,
        candidate_new: candidateNew,
        daily_new_quota: quota,
        active_curriculum: activeCurriculum,
        curriculum_progress: curriculumProgress
      },
      stats: {
        total: Number(statsRow.total_cards) || 0,
        inbox: Number(statsRow.inbox_count) || 0,
        ready: Number(statsRow.ready_count) || 0,
        active: Number(statsRow.active_count) || 0,
        mastered: Number(statsRow.mastered_count) || 0,
        stages: {
          1: Number(statsRow.stage1_count) || 0,
          2: Number(statsRow.stage2_count) || 0,
          3: Number(statsRow.stage3_count) || 0,
          4: Number(statsRow.stage4_count) || 0,
          5: Number(statsRow.mastered_count) || 0
        }
      }
    });
  } catch (err) {
    console.error('Study Agenda Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update card status / starred (Lifecycle Triage)
app.patch('/api/cards/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { lifecycle_status, is_starred, mastery_stage } = req.body;

    const existing = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(Number(id), userId);
    if (!existing) return res.status(404).json({ error: 'Card not found' });

    const newStatus = lifecycle_status !== undefined ? lifecycle_status : existing.lifecycle_status;
    const newStarred = is_starred !== undefined ? (is_starred ? 1 : 0) : existing.is_starred;
    const newStage = mastery_stage !== undefined ? Number(mastery_stage) : existing.mastery_stage;

    // If activating from inbox/ready, set due_date to now so it's ready to learn immediately
    let dueDateSql = 'due_date';
    if ((existing.lifecycle_status === 'inbox' || existing.lifecycle_status === 'ready') && newStatus === 'active') {
      dueDateSql = "datetime('now', 'localtime')";
    }

    db.prepare(`
      UPDATE cards
      SET lifecycle_status = ?, is_starred = ?, mastery_stage = ?, due_date = ${dueDateSql}, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND user_id = ?
    `).run(newStatus, newStarred, newStage, Number(id), userId);

    const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(Number(id));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Batch update cards status / starred
app.patch('/api/cards/batch-status', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { card_ids, lifecycle_status, is_starred } = req.body;

    if (!Array.isArray(card_ids) || card_ids.length === 0) {
      return res.status(400).json({ error: 'card_ids array is required' });
    }

    const ids = card_ids.map(Number).filter(n => !isNaN(n));
    if (ids.length === 0) {
      return res.status(400).json({ error: 'Valid card IDs required' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const updates = [];
    const params = [];

    if (lifecycle_status) {
      updates.push('lifecycle_status = ?');
      params.push(lifecycle_status);

      if (lifecycle_status === 'active') {
        updates.push("due_date = datetime('now', 'localtime')");
      } else if (lifecycle_status === 'mastered') {
        updates.push('mastery_stage = 5');
      } else if (lifecycle_status === 'inbox' || lifecycle_status === 'ready') {
        updates.push('due_date = NULL');
      }
    }

    if (is_starred !== undefined) {
      updates.push('is_starred = ?');
      params.push(is_starred ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push("updated_at = datetime('now', 'localtime')");
    params.push(userId, ...ids);

    db.prepare(`
      UPDATE cards
      SET ${updates.join(', ')}
      WHERE user_id = ? AND id IN (${placeholders})
    `).run(...params);

    res.json({ success: true, count: ids.length, updated_ids: ids });
  } catch (err) {
    console.error('Batch status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Batch delete cards
app.post('/api/cards/batch-delete', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { card_ids } = req.body;

    if (!Array.isArray(card_ids) || card_ids.length === 0) {
      return res.status(400).json({ error: 'card_ids array is required' });
    }

    const ids = card_ids.map(Number).filter(n => !isNaN(n));
    if (ids.length === 0) {
      return res.status(400).json({ error: 'Valid card IDs required' });
    }

    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM review_logs WHERE user_id = ? AND card_id IN (${placeholders})`).run(userId, ...ids);
    db.prepare(`DELETE FROM cards WHERE user_id = ? AND id IN (${placeholders})`).run(userId, ...ids);

    res.json({ success: true, count: ids.length });
  } catch (err) {
    console.error('Batch delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Activate batch cards into active study pool
app.post('/api/study/activate-batch', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { card_ids, unit, limit } = req.body;

    let targetIds = [];
    if (Array.isArray(card_ids) && card_ids.length > 0) {
      targetIds = card_ids.map(Number);
    } else if (unit) {
      const rows = db.prepare(`
        SELECT id FROM cards 
        WHERE user_id = ? AND curriculum_unit = ? AND lifecycle_status IN ('ready', 'inbox')
        ORDER BY is_starred DESC, id ASC
        LIMIT ?
      `).all(userId, unit, Number(limit) || 20);
      targetIds = rows.map(r => r.id);
    }

    if (targetIds.length === 0) {
      return res.json({ success: true, count: 0, message: 'No cards to activate' });
    }

    const placeholders = targetIds.map(() => '?').join(',');
    db.prepare(`
      UPDATE cards
      SET lifecycle_status = 'active', due_date = datetime('now', 'localtime'), updated_at = datetime('now', 'localtime')
      WHERE user_id = ? AND id IN (${placeholders})
    `).run(userId, ...targetIds);

    res.json({ success: true, count: targetIds.length, activatedIds: targetIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get curriculum units summary list
app.get('/api/study/units', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const rows = db.prepare(`
      SELECT 
        curriculum_unit,
        COUNT(*) as total,
        SUM(CASE WHEN lifecycle_status = 'inbox' THEN 1 ELSE 0 END) as inbox_count,
        SUM(CASE WHEN lifecycle_status = 'ready' THEN 1 ELSE 0 END) as ready_count,
        SUM(CASE WHEN lifecycle_status = 'active' THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as mastered_count,
        SUM(CASE WHEN mastery_stage >= 3 OR lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as proficient_count
      FROM cards
      WHERE user_id = ? AND curriculum_unit IS NOT NULL AND curriculum_unit != ''
      GROUP BY curriculum_unit
      ORDER BY total DESC
    `).all(userId);

    const units = rows.map(r => ({
      unit: r.curriculum_unit,
      total: Number(r.total),
      inbox: Number(r.inbox_count),
      ready: Number(r.ready_count),
      active: Number(r.active_count),
      mastered: Number(r.mastered_count),
      proficient: Number(r.proficient_count),
      proficiencyRate: Number(r.total) > 0 ? Math.round((Number(r.proficient_count) / Number(r.total)) * 100) : 0
    }));

    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get & Update user study preferences
app.get('/api/user/settings', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, daily_new_quota, target_retention, active_curriculum FROM users WHERE id = ?').get(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const handleUpdateSettings = (req, res) => {
  try {
    const userId = req.user.userId;
    const { daily_new_quota, target_retention, active_curriculum } = req.body;

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const newQuota = daily_new_quota !== undefined ? Number(daily_new_quota) : (existing.daily_new_quota || 15);
    const newRetention = target_retention !== undefined ? Number(target_retention) : (existing.target_retention || 0.9);
    const newCurriculum = active_curriculum !== undefined ? String(active_curriculum).trim() : (existing.active_curriculum || '');

    db.prepare(`
      UPDATE users
      SET daily_new_quota = ?, target_retention = ?, active_curriculum = ?
      WHERE id = ?
    `).run(newQuota, newRetention, newCurriculum, userId);

    // Auto-activate all ready/inbox cards of this curriculum unit into active study
    if (newCurriculum && newCurriculum !== 'ALL_ACTIVE') {
      db.prepare(`
        UPDATE cards
        SET lifecycle_status = 'active', due_date = datetime('now', 'localtime'), updated_at = datetime('now', 'localtime')
        WHERE user_id = ? AND (curriculum_unit = ? OR ((curriculum_unit IS NULL OR curriculum_unit = '') AND category = ?)) AND lifecycle_status IN ('ready', 'inbox')
      `).run(userId, newCurriculum, newCurriculum);
    }

    const updated = db.prepare('SELECT id, username, daily_new_quota, target_retention, active_curriculum FROM users WHERE id = ?').get(userId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.put('/api/user/settings', authenticateToken, handleUpdateSettings);
app.post('/api/user/settings', authenticateToken, handleUpdateSettings);

// Learning stats (FSRS & Lifecycle Analytics)
app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Overview counts
    const overview = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN lifecycle_status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN lifecycle_status = 'ready' THEN 1 ELSE 0 END) as ready,
        SUM(CASE WHEN lifecycle_status = 'inbox' THEN 1 ELSE 0 END) as inbox,
        SUM(CASE WHEN lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as mastered,
        SUM(CASE WHEN is_starred = 1 THEN 1 ELSE 0 END) as starred,
        SUM(CASE WHEN mastery_stage = 1 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage1,
        SUM(CASE WHEN mastery_stage = 2 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage2,
        SUM(CASE WHEN mastery_stage = 3 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage3,
        SUM(CASE WHEN mastery_stage = 4 AND lifecycle_status = 'active' THEN 1 ELSE 0 END) as stage4
      FROM cards WHERE user_id = ?
    `).get(userId);

    const due = db.prepare(`
      SELECT count(*) as count FROM cards 
      WHERE user_id = ? AND lifecycle_status = 'active' AND due_date <= datetime('now', 'localtime')
    `).get(userId).count;

    // Reviews today
    const reviewedToday = db.prepare(`
      SELECT count(*) as count FROM review_logs
      WHERE user_id = ? AND date(reviewed_at) = date('now', 'localtime')
    `).get(userId).count;

    // Total review logs
    const totalReviews = db.prepare(`
      SELECT count(*) as count FROM review_logs WHERE user_id = ?
    `).get(userId).count;

    // Level breakdown
    const levelCounts = db.prepare(`
      SELECT dele_level, count(*) as count FROM cards WHERE user_id = ? GROUP BY dele_level ORDER BY dele_level
    `).all(userId);

    // Curriculum units breakdown
    const unitRows = db.prepare(`
      SELECT 
        COALESCE(NULLIF(curriculum_unit, ''), category, '未分類') as unit_name,
        COUNT(*) as total,
        SUM(CASE WHEN lifecycle_status = 'active' THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN lifecycle_status = 'ready' THEN 1 ELSE 0 END) as ready_count,
        SUM(CASE WHEN lifecycle_status = 'inbox' THEN 1 ELSE 0 END) as inbox_count,
        SUM(CASE WHEN lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as mastered_count,
        SUM(CASE WHEN mastery_stage >= 3 OR lifecycle_status = 'mastered' THEN 1 ELSE 0 END) as proficient_count
      FROM cards
      WHERE user_id = ?
      GROUP BY unit_name
    `).all(userId);

    const unitCounts = unitRows.map(r => ({
      unit: r.unit_name,
      total: Number(r.total),
      active: Number(r.active_count),
      ready: Number(r.ready_count),
      inbox: Number(r.inbox_count),
      mastered: Number(r.mastered_count),
      proficient: Number(r.proficient_count),
      proficiencyRate: Number(r.total) > 0 ? Math.round((Number(r.proficient_count) / Number(r.total)) * 100) : 0
    }));

    res.json({
      total: Number(overview.total) || 0,
      active: Number(overview.active) || 0,
      ready: Number(overview.ready) || 0,
      inbox: Number(overview.inbox) || 0,
      mastered: Number(overview.mastered) || 0,
      starred: Number(overview.starred) || 0,
      due: Number(due),
      reviewedToday: Number(reviewedToday),
      totalReviews: Number(totalReviews),
      stages: {
        1: Number(overview.stage1) || 0,
        2: Number(overview.stage2) || 0,
        3: Number(overview.stage3) || 0,
        4: Number(overview.stage4) || 0,
        5: Number(overview.mastered) || 0
      },
      levelCounts,
      unitCounts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Extract endpoint
app.post('/api/ai/extract', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const promptText = req.body.text || '';
    const userApiKey = req.body.apiKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

    if (!userApiKey) {
      return res.status(400).json({
        error: '未偵測到 Gemini API Key。請在頁面設定中填入您的 API Key，或在伺服端 .env 設定 GEMINI_API_KEY。'
      });
    }

    const cards = await extractSpanishWords({
      promptText,
      apiKey: userApiKey,
      imageFile: req.file || null
    });
    
    // Save extracted cards for the user directly
    if (cards && cards.length > 0) {
      const insertStmt = db.prepare(`
        INSERT INTO cards (user_id, word, article, gender, part_of_speech, translation, english_translation, definition_es, example_es, example_zh, notes, category, dele_level, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
        ON CONFLICT(user_id, word) DO UPDATE SET
          translation=excluded.translation,
          updated_at=datetime('now', 'localtime')
      `);
      
      for (const card of cards) {
        if (!card.word || !card.translation) continue;
        insertStmt.run(req.user.userId, card.word, card.article||'', card.gender||'none', card.part_of_speech||'sustantivo', card.translation, card.english_translation||'', card.definition_es||'', card.example_es||'', card.example_zh||'', card.notes||'', card.category||'AI萃取', card.dele_level||'A1');
      }
    }

    res.json({ success: true, count: cards.length, cards });
  } catch (err) {
    console.error('AI Extract Error:', err);
    res.status(500).json({ error: err.message || 'AI 萃取失敗' });
  }
});

// AI DELE Level Calibration Endpoint
app.post('/api/cards/calibrate-dele', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userApiKey = req.body.apiKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

    if (!userApiKey) {
      return res.status(400).json({
        error: '未偵測到 Gemini API Key。請在頁面設定中填入您的 API Key，或在伺服端 .env 設定 GEMINI_API_KEY。'
      });
    }

    const cards = db.prepare('SELECT id, word, translation, dele_level FROM cards WHERE user_id = ?').all(userId);
    if (!cards || cards.length === 0) {
      return res.json({ success: true, totalCards: 0, updatedCount: 0, message: '目前庫中無單字' });
    }

    const BATCH_SIZE = 60;
    const updateStmt = db.prepare('UPDATE cards SET dele_level = ?, updated_at = datetime("now", "localtime") WHERE id = ? AND user_id = ?');
    
    let updatedCount = 0;
    const distribution = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
      const batch = cards.slice(i, i + BATCH_SIZE);
      const evaluated = await calibrateDeleLevels(batch, userApiKey);
      if (Array.isArray(evaluated)) {
        for (const item of evaluated) {
          if (item.id && item.dele_level) {
            const cleanLevel = String(item.dele_level).toUpperCase().trim();
            if (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(cleanLevel)) {
              updateStmt.run(cleanLevel, item.id, userId);
              updatedCount++;
              distribution[cleanLevel] = (distribution[cleanLevel] || 0) + 1;
            }
          }
        }
      }
    }

    res.json({
      success: true,
      totalCards: cards.length,
      updatedCount,
      distribution
    });
  } catch (err) {
    console.error('DELE Calibration Error:', err);
    res.status(500).json({ error: err.message || 'DELE 自動校準失敗' });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PalabraCard] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[PalabraCard] Database ready, memory footprint ~35MB`);
});
