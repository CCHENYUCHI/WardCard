require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { extractSpanishWords } = require('./ai');

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
    const { category, dele, search, filter } = req.query;
    let sql = 'SELECT * FROM cards WHERE user_id = ?';
    const params = [req.user.userId];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
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
      sql += " AND due_date <= datetime('now', 'localtime')";
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

// Get cards due for review
app.get('/api/cards/due', authenticateToken, (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    let sql = "SELECT * FROM cards WHERE user_id = ? AND due_date <= datetime('now', 'localtime')";
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
      INSERT INTO cards (user_id, word, article, gender, part_of_speech, translation, english_translation, definition_es, example_es, example_zh, notes, category, dele_level, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
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
        updated_at=datetime('now', 'localtime')
    `);

    const insertedIds = [];
    for (const card of cards) {
      if (!card.word || !card.translation) continue;
      
      // Auto-extract article if user put it in word (e.g. "la manzana")
      let w = card.word.trim();
      let a = card.article ? card.article.trim() : '';
      if (!a && w.includes(' ')) {
        const parts = w.split(' ');
        if (['el', 'la', 'los', 'las', 'un', 'una'].includes(parts[0].toLowerCase())) {
          a = parts[0].toLowerCase();
          w = parts.slice(1).join(' ');
        }
      }

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
        card.category || '日常生活',
        card.dele_level || 'A2'
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
    const { word, article, gender, part_of_speech, translation, english_translation, definition_es, example_es, example_zh, notes, category, dele_level } = req.body;

    const stmt = db.prepare(`
      UPDATE cards
      SET word = ?, article = ?, gender = ?, part_of_speech = ?, translation = ?, english_translation = ?, definition_es = ?, example_es = ?, example_zh = ?, notes = ?, category = ?, dele_level = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND user_id = ?
    `);

    const result = stmt.run(
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
      category || '日常生活',
      dele_level || 'A2',
      Number(id),
      userId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found or unauthorized' });
    }

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

// Review card (SM-2 Spaced Repetition Algorithm)
app.post('/api/cards/:id/review', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { rating, review_mode = 'flashcard' } = req.body;
    const score = Number(rating);

    const card = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(Number(id), userId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    let repetition = Number(card.repetition) || 0;
    let interval = Number(card.interval_days) || 0;
    let easeFactor = Number(card.ease_factor) || 2.5;
    let reviewCount = (Number(card.review_count) || 0) + 1;
    let lapseCount = Number(card.lapse_count) || 0;

    if (score < 3) {
      // Failed / Again / Hard
      repetition = 0;
      interval = 1; // repeat tomorrow or today
      lapseCount += 1;
    } else {
      // Good or Easy
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = score === 4 ? 6 : 4;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    }

    // Update Ease Factor (standard SM-2 formula scaled for 1-4)
    const q = score === 1 ? 1 : score === 2 ? 2 : score === 3 ? 4 : 5;
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Calculate due_date
    const dueDateSql = `datetime('now', 'localtime', '+${interval} days')`;

    db.prepare(`
      UPDATE cards
      SET repetition = ?, interval_days = ?, ease_factor = ?, review_count = ?, lapse_count = ?,
          due_date = ${dueDateSql}, last_reviewed = datetime('now', 'localtime'), updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(repetition, interval, easeFactor, reviewCount, lapseCount, Number(id));

    // Log review
    db.prepare(`
      INSERT INTO review_logs (user_id, card_id, rating, review_mode, reviewed_at)
      VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
    `).run(userId, Number(id), score, review_mode);

    const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(Number(id));
    res.json({ success: true, card: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Learning stats
app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const total = db.prepare('SELECT count(*) as count FROM cards WHERE user_id = ?').get(userId).count;
    const due = db.prepare("SELECT count(*) as count FROM cards WHERE user_id = ? AND due_date <= datetime('now', 'localtime')").get(userId).count;
    const learned = db.prepare('SELECT count(*) as count FROM cards WHERE user_id = ? AND repetition > 0').get(userId).count;
    const mastered = db.prepare('SELECT count(*) as count FROM cards WHERE user_id = ? AND repetition >= 4').get(userId).count;

    // Reviews today
    const reviewedToday = db.prepare(`
      SELECT count(*) as count FROM review_logs
      WHERE user_id = ? AND date(reviewed_at) = date('now', 'localtime')
    `).get(userId).count;

    // Level breakdown
    const levelCounts = db.prepare(`
      SELECT dele_level, count(*) as count FROM cards WHERE user_id = ? GROUP BY dele_level ORDER BY dele_level
    `).all(userId);

    // Category breakdown
    const catCounts = db.prepare(`
      SELECT category, count(*) as count FROM cards WHERE user_id = ? GROUP BY category ORDER BY count DESC
    `).all(userId);

    res.json({
      total: Number(total),
      due: Number(due),
      learned: Number(learned),
      mastered: Number(mastered),
      reviewedToday: Number(reviewedToday),
      levelCounts,
      catCounts
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
