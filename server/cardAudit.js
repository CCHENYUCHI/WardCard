// 單字庫健檢: compare each card with the offline dictionary and fix it on request.
// The audit reads the card's own columns (not the dictionary-filled values enrichCards returns), so a fix
// writes the dictionary's part of speech / gender / article back into the card itself; every applied batch
// keeps the previous values so it can be undone.
const crypto = require('crypto');
const { getDict, dictionaryHasEntries, POS_MAP, parseJson, lookupForm } = require('./dictionary');
const { normalizeWord } = require('./cardUtils');
const { primarySpelling } = require('./cardDict');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS card_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    before TEXT NOT NULL,              -- JSON of the columns below, before the fix
    after TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_card_audit_log_batch ON card_audit_log(batch_id);
  CREATE TABLE IF NOT EXISTS card_audit_dismissed (
    card_id INTEGER PRIMARY KEY,
    signature TEXT NOT NULL            -- the issue that was dismissed; a different issue shows again
  );
`;
const FIX_COLUMNS = ['word', 'article', 'gender', 'part_of_speech', 'dict_lemma', 'dict_pos'];
const GENDER_BY_DICT = { m: 'masculino', f: 'femenino' };
const ARTICLE_BY_DICT = { m: 'el', f: 'la' };
const PROBLEM_LABELS = {
  pos: '詞性和字典不同',
  gender: '陰陽性和字典不同',
  article: '冠詞和字典不同',
  form: '可能是變化形，不是原形',
  ambiguous: '字典有好幾個詞性，無法自動判斷',
  missing: '字典裡查不到',
  duplicate: '和其他卡片是同一個字'
};

const ensureAuditTables = (db) => db.exec(SCHEMA);

function toCandidate(row) {
  const partOfSpeech = POS_MAP[row.pos] || 'frase';
  const isNoun = partOfSpeech === 'sustantivo';
  return {
    lemma: row.word,
    pos: row.pos,
    part_of_speech: partOfSpeech,
    gender: isNoun ? (GENDER_BY_DICT[row.gender] || 'none') : null, // null: the dictionary has no opinion
    article: isNoun ? (ARTICLE_BY_DICT[row.gender] || '') : '',
    glosses: parseJson(row.glosses, []).slice(0, 2)
  };
}

/** Dictionary entries (with meanings of their own) for one spelling, exact accents first */
function entriesFor(spelling) {
  const rows = getDict().prepare("SELECT word, pos, gender, glosses FROM entries WHERE word_norm = ? AND glosses != '[]' LIMIT 30").all(normalizeWord(spelling));
  const exact = rows.filter(r => r.word.toLowerCase() === spelling.toLowerCase());
  return (exact.length ? exact : rows).map(toCandidate);
}

function entryFor(lemma, pos) {
  const row = getDict().prepare("SELECT word, pos, gender, glosses FROM entries WHERE word_norm = ? AND word = ? AND pos = ? AND glosses != '[]' LIMIT 1")
    .get(normalizeWord(lemma), lemma, pos);
  return row ? toCandidate(row) : null;
}

// "el agua", "el hacha": feminine nouns starting with a stressed a- take el
const elBeforeStressedA = (word, article, gender) => article === 'el' && gender === 'femenino' && /^h?[aá]/i.test(word);

/** What has to change on a card to match a dictionary entry: { field: newValue } */
function changesFor(card, entry) {
  const changes = {};
  if (card.part_of_speech !== entry.part_of_speech) changes.part_of_speech = entry.part_of_speech;
  if (entry.part_of_speech === 'sustantivo') {
    if (entry.gender && entry.gender !== 'none' && card.gender !== entry.gender) changes.gender = entry.gender;
    if (entry.article && card.article !== entry.article && !elBeforeStressedA(card.word, card.article, entry.gender)) changes.article = entry.article;
  } else if (card.article) {
    changes.article = ''; // only nouns carry an article
  }
  return changes;
}

const signatureOf = (problems, expected) => crypto.createHash('sha1').update(JSON.stringify([problems, expected])).digest('hex').slice(0, 16);

/**
 * Every card that disagrees with the dictionary, with what the dictionary says and the entries to choose from.
 * @returns {{ available: boolean, summary: Record<string, number>, labels: Record<string, string>, issues: object[] }}
 */
function auditCards(db, userId) {
  ensureAuditTables(db);
  if (!dictionaryHasEntries()) return { available: false, summary: {}, labels: PROBLEM_LABELS, issues: [] };
  const cards = db.prepare(`
    SELECT id, word, article, gender, part_of_speech, translation, lifecycle_status, dict_lemma, dict_pos
    FROM cards WHERE user_id = ? ORDER BY word COLLATE NOCASE
  `).all(userId);
  const dismissed = new Map(db.prepare('SELECT card_id, signature FROM card_audit_dismissed').all().map(r => [r.card_id, r.signature]));

  const byLink = new Map();
  for (const card of cards) {
    if (!card.dict_lemma) continue;
    const key = `${card.dict_lemma}|${card.dict_pos}`;
    byLink.set(key, [...(byLink.get(key) || []), card]);
  }

  const issues = [];
  for (const card of cards) {
    const spelling = primarySpelling(card.word);
    if (!spelling) continue;
    let candidates = entriesFor(spelling);
    const problems = [];
    let linked = null;
    let expected = null;
    let changes = {};
    let formOf = [];

    if (card.dict_lemma) {
      linked = entryFor(card.dict_lemma, card.dict_pos);
      if (linked && !candidates.some(c => c.lemma === linked.lemma && c.pos === linked.pos)) candidates = [linked, ...candidates];
      if (linked) {
        expected = linked;
        changes = changesFor(card, linked);
        if (changes.part_of_speech) problems.push('pos');
        if (changes.gender) problems.push('gender');
        if (changes.article !== undefined) problems.push('article');
      }
      const twins = byLink.get(`${card.dict_lemma}|${card.dict_pos}`) || [];
      if (twins.length > 1) problems.push('duplicate');
    } else if (card.dict_lemma === '') {
      // fui -> ir / ser; bonitas -> bonito
      // Keep the part of speech of the form: "fui" is a verb form of ir / ser, not the noun "ser"
      formOf = lookupForm(spelling).filter(item => item.via && item.glosses.length).map(item => ({ lemma: item.lemma, pos: item.pos }));
      if (formOf.length) {
        problems.push('form');
        candidates = formOf.map(f => entryFor(f.lemma, f.pos)).filter(Boolean)
          .filter((c, i, all) => all.findIndex(o => o.lemma === c.lemma && o.pos === c.pos) === i);
      } else if (candidates.length > 1) {
        problems.push('ambiguous');
      } else {
        problems.push('missing');
      }
    }
    if (problems.length === 0) continue;

    const signature = signatureOf(problems, expected && { p: expected.part_of_speech, g: expected.gender, a: expected.article });
    if (dismissed.get(card.id) === signature) continue;
    issues.push({
      card: { id: card.id, word: card.word, article: card.article, gender: card.gender, part_of_speech: card.part_of_speech, translation: card.translation, lifecycle_status: card.lifecycle_status },
      link: linked ? { lemma: linked.lemma, pos: linked.pos } : null,
      problems,
      changes,
      candidates,
      duplicates: problems.includes('duplicate')
        ? (byLink.get(`${card.dict_lemma}|${card.dict_pos}`) || []).filter(c => c.id !== card.id).map(c => ({ id: c.id, word: c.word, translation: c.translation }))
        : [],
      signature
    });
  }

  const summary = {};
  for (const issue of issues) for (const p of issue.problems) summary[p] = (summary[p] || 0) + 1;
  return { available: true, summary, labels: PROBLEM_LABELS, issues };
}

/**
 * Point cards at the chosen dictionary entries and write that entry's part of speech / gender / article
 * into them. `rename` also changes the word to the entry's spelling (fui -> ir) unless that word exists.
 * @param {{ id: number, lemma: string, pos: string, rename?: boolean }[]} items
 */
function applyFixes(db, userId, items) {
  ensureAuditTables(db);
  if (!dictionaryHasEntries()) throw new Error('沒有離線字典，無法套用');
  const batchId = crypto.randomUUID();
  const getCard = db.prepare(`SELECT id, ${FIX_COLUMNS.join(', ')} FROM cards WHERE id = ? AND user_id = ?`);
  const wordTaken = db.prepare('SELECT id FROM cards WHERE user_id = ? AND word = ? AND id != ?');
  const update = db.prepare(`UPDATE cards SET ${FIX_COLUMNS.map(c => `${c} = ?`).join(', ')}, updated_at = datetime('now', 'localtime') WHERE id = ? AND user_id = ?`);
  const log = db.prepare('INSERT INTO card_audit_log (batch_id, user_id, card_id, before, after) VALUES (?, ?, ?, ?, ?)');
  const undismiss = db.prepare('DELETE FROM card_audit_dismissed WHERE card_id = ?');

  const applied = [];
  const skipped = [];
  db.exec('BEGIN');
  try {
    for (const item of Array.isArray(items) ? items : []) {
      const card = getCard.get(Number(item.id), userId);
      if (!card) { skipped.push({ id: item.id, reason: '找不到這張卡' }); continue; }
      const entry = entryFor(String(item.lemma || ''), String(item.pos || ''));
      if (!entry) { skipped.push({ id: card.id, reason: '字典裡沒有這個條目' }); continue; }
      const after = { ...card, ...changesFor(card, entry), dict_lemma: entry.lemma, dict_pos: entry.pos };
      if (item.rename && entry.lemma !== card.word) {
        if (wordTaken.get(userId, entry.lemma, card.id)) {
          skipped.push({ id: card.id, reason: `單字庫已經有「${entry.lemma}」，沒有改名` });
        } else {
          after.word = entry.lemma;
        }
      }
      const before = Object.fromEntries(FIX_COLUMNS.map(c => [c, card[c]]));
      const next = Object.fromEntries(FIX_COLUMNS.map(c => [c, after[c]]));
      update.run(...FIX_COLUMNS.map(c => next[c]), card.id, userId);
      log.run(batchId, userId, card.id, JSON.stringify(before), JSON.stringify(next));
      undismiss.run(card.id);
      applied.push({ id: card.id, before, after: next });
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return { batchId: applied.length ? batchId : null, applied, skipped };
}

/** Hide these cards' current issues ("保留現狀"); a different issue later shows them again */
function dismissIssues(db, userId, ids) {
  const { issues } = auditCards(db, userId);
  const wanted = new Set((Array.isArray(ids) ? ids : []).map(Number));
  const save = db.prepare('INSERT OR REPLACE INTO card_audit_dismissed (card_id, signature) VALUES (?, ?)');
  let count = 0;
  for (const issue of issues) {
    if (!wanted.has(issue.card.id)) continue;
    save.run(issue.card.id, issue.signature);
    count++;
  }
  return count;
}

/** Put the cards of one applied batch back the way they were */
function undoBatch(db, userId, batchId) {
  ensureAuditTables(db);
  const rows = db.prepare('SELECT id, card_id, before FROM card_audit_log WHERE batch_id = ? AND user_id = ? ORDER BY id DESC').all(String(batchId || ''), userId);
  const restore = db.prepare(`UPDATE cards SET ${FIX_COLUMNS.map(c => `${c} = ?`).join(', ')}, updated_at = datetime('now', 'localtime') WHERE id = ? AND user_id = ?`);
  db.exec('BEGIN');
  try {
    for (const row of rows) {
      const before = JSON.parse(row.before);
      restore.run(...FIX_COLUMNS.map(c => before[c]), row.card_id, userId);
    }
    db.prepare('DELETE FROM card_audit_log WHERE batch_id = ? AND user_id = ?').run(String(batchId || ''), userId);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return rows.length;
}

module.exports = { ensureAuditTables, auditCards, applyFixes, dismissIssues, undoBatch, changesFor, PROBLEM_LABELS };
