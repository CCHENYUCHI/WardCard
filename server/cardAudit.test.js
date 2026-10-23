const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const { build } = require('./scripts/build-dictionary');
const { setDictionary } = require('./dictionary');
const { linkPendingCards } = require('./cardDict');
const { auditCards, applyFixes, dismissIssues, undoBatch } = require('./cardAudit');

const FIXTURE = [
  { word: 'casa', pos: 'noun', lang_code: 'es', head_templates: [{ expansion: 'casa f (plural casas)' }], senses: [{ glosses: ['house'] }] },
  { word: 'agua', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['water'], tags: ['feminine'] }] },
  { word: 'comer', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to eat'] }] },
  { word: 'comer', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['eating'], tags: ['masculine'] }] },
  { word: 'hablar', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to speak'] }] },
  { word: 'ir', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to go'] }] },
  { word: 'ser', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to be'] }] },
  { word: 'fui', pos: 'verb', lang_code: 'es', senses: [
    { glosses: ['first-person singular preterite indicative of ir'], form_of: [{ word: 'ir' }] },
    { glosses: ['first-person singular preterite indicative of ser'], form_of: [{ word: 'ser' }] }
  ] },
  { word: 'bueno', pos: 'adj', lang_code: 'es', senses: [{ glosses: ['good'] }] }
];

const CARDS_SCHEMA = `CREATE TABLE cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, word TEXT, article TEXT DEFAULT '', gender TEXT DEFAULT 'none',
  part_of_speech TEXT DEFAULT 'sustantivo', translation TEXT DEFAULT '', lifecycle_status TEXT DEFAULT 'active',
  dict_lemma TEXT DEFAULT NULL, dict_pos TEXT DEFAULT NULL, updated_at TEXT);
  CREATE UNIQUE INDEX idx_cards_user_word ON cards(user_id, word);`;

let tmpDir;
test.before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-audit-'));
  const input = path.join(tmpDir, 'es.jsonl');
  fs.writeFileSync(input, FIXTURE.map(e => JSON.stringify(e)).join('\n'));
  const out = path.join(tmpDir, 'es-en.sqlite');
  await build(input, out);
  setDictionary(new DatabaseSync(out, { readOnly: true }));
});
test.after(() => {
  setDictionary(null);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function freshDb(rows) {
  const db = new DatabaseSync(':memory:');
  db.exec(CARDS_SCHEMA);
  const insert = db.prepare('INSERT INTO cards (user_id, word, article, gender, part_of_speech, translation) VALUES (?, ?, ?, ?, ?, ?)');
  for (const r of rows) insert.run(r.user ?? 1, r.word, r.article ?? '', r.gender ?? 'none', r.pos ?? 'sustantivo', r.zh ?? '');
  linkPendingCards(db);
  return db;
}
const issueOf = (audit, word) => audit.issues.find(i => i.card.word === word);

test('audit finds wrong part of speech, gender and article, and leaves correct cards alone', () => {
  const db = freshDb([
    { word: 'casa', gender: 'masculino', article: 'el', zh: '房子' },  // dictionary: f, la
    { word: 'hablar', pos: 'sustantivo', article: 'el', zh: '說話' },  // CSV default: noun with an article
    { word: 'agua', gender: 'femenino', article: 'el', zh: '水' },     // el agua is right
    { word: 'bueno', pos: 'adjetivo', gender: 'masculino', zh: '好' }  // fine
  ]);
  const audit = auditCards(db, 1);
  assert.equal(audit.available, true);
  assert.deepEqual(issueOf(audit, 'casa').problems, ['gender', 'article']);
  assert.deepEqual(issueOf(audit, 'casa').changes, { gender: 'femenino', article: 'la' });
  assert.deepEqual(issueOf(audit, 'hablar').problems, ['pos', 'article']);
  assert.deepEqual(issueOf(audit, 'hablar').changes, { part_of_speech: 'verbo', article: '' });
  assert.equal(issueOf(audit, 'agua'), undefined);
  assert.equal(issueOf(audit, 'bueno'), undefined);
  assert.deepEqual(audit.summary, { gender: 1, article: 2, pos: 1 });
});

test('audit offers the other entries when a card may be linked to the wrong one', () => {
  const db = freshDb([{ word: 'comer', pos: 'sustantivo', zh: '吃' }]); // CSV default picked the noun
  const issue = issueOf(auditCards(db, 1), 'comer');
  // Linked to the noun: its gender and article are missing, and the verb entry is offered to switch to
  assert.deepEqual(issue.problems, ['gender', 'article']);
  assert.deepEqual(issue.candidates.map(c => `${c.lemma}/${c.pos}`).sort(), ['comer/noun', 'comer/verb']);
  // Once the card says it is a verb (but still points at the noun), the part of speech is reported
  db.exec("UPDATE cards SET part_of_speech = 'verbo'");
  const again = issueOf(auditCards(db, 1), 'comer');
  assert.deepEqual(again.problems, ['pos', 'gender', 'article']);
  assert.deepEqual(again.candidates.map(c => `${c.lemma}/${c.pos}`).sort(), ['comer/noun', 'comer/verb']);
});

test('audit spots inflected forms, words the dictionary lacks, and duplicates', () => {
  const db = freshDb([
    { word: 'fui', pos: 'verbo', zh: '我去了' },
    { word: 'palabrainventada', zh: '假' },
    { word: 'casa', gender: 'femenino', article: 'la', zh: '房子' },
    { word: 'la casa', gender: 'femenino', article: 'la', zh: '家' } // stored as "la casa" by an old import
  ]);
  const audit = auditCards(db, 1);
  const form = issueOf(audit, 'fui');
  assert.deepEqual(form.problems, ['form']);
  assert.deepEqual(form.candidates.map(c => c.lemma).sort(), ['ir', 'ser']);
  assert.deepEqual(issueOf(audit, 'palabrainventada').problems, ['missing']);
  assert.deepEqual(issueOf(audit, 'casa').problems, ['duplicate']);
  assert.deepEqual(issueOf(audit, 'casa').duplicates.map(d => d.word), ['la casa']);
});

test('apply writes the dictionary values into the card, renames forms when free, and undo restores', () => {
  const db = freshDb([
    { word: 'casa', gender: 'masculino', article: 'el', zh: '房子' },
    { word: 'fui', pos: 'verbo', zh: '我去了' },
    { word: 'hablar', pos: 'sustantivo', article: 'el' }
  ]);
  const ids = Object.fromEntries(db.prepare('SELECT id, word FROM cards').all().map(r => [r.word, r.id]));
  const result = applyFixes(db, 1, [
    { id: ids.casa, lemma: 'casa', pos: 'noun' },
    { id: ids.fui, lemma: 'ir', pos: 'verb', rename: true },
    { id: ids.hablar, lemma: 'hablar', pos: 'verb' },
    { id: 999, lemma: 'casa', pos: 'noun' }
  ]);
  assert.equal(result.applied.length, 3);
  assert.deepEqual(result.skipped, [{ id: 999, reason: '找不到這張卡' }]);
  const row = (id) => db.prepare('SELECT word, article, gender, part_of_speech, dict_lemma, dict_pos FROM cards WHERE id = ?').get(id);
  assert.deepEqual({ ...row(ids.casa) }, { word: 'casa', article: 'la', gender: 'femenino', part_of_speech: 'sustantivo', dict_lemma: 'casa', dict_pos: 'noun' });
  assert.deepEqual({ ...row(ids.fui) }, { word: 'ir', article: '', gender: 'none', part_of_speech: 'verbo', dict_lemma: 'ir', dict_pos: 'verb' });
  assert.equal(row(ids.hablar).article, '');
  assert.equal(auditCards(db, 1).issues.length, 0);

  assert.equal(undoBatch(db, 1, result.batchId), 3);
  assert.deepEqual({ ...row(ids.casa) }, { word: 'casa', article: 'el', gender: 'masculino', part_of_speech: 'sustantivo', dict_lemma: 'casa', dict_pos: 'noun' });
  assert.equal(row(ids.fui).word, 'fui');
  assert.equal(row(ids.fui).dict_lemma, '');
});

test('apply keeps the word when the dictionary spelling already exists, and only touches the user\'s own cards', () => {
  const db = freshDb([
    { word: 'fui', pos: 'verbo' },
    { word: 'ir', pos: 'verbo' },
    { word: 'casa', gender: 'masculino', user: 2 }
  ]);
  const ids = Object.fromEntries(db.prepare('SELECT id, word FROM cards').all().map(r => [r.word, r.id]));
  const result = applyFixes(db, 1, [{ id: ids.fui, lemma: 'ir', pos: 'verb', rename: true }, { id: ids.casa, lemma: 'casa', pos: 'noun' }]);
  assert.equal(db.prepare('SELECT word, dict_lemma FROM cards WHERE id = ?').get(ids.fui).word, 'fui');
  assert.equal(db.prepare('SELECT dict_lemma FROM cards WHERE id = ?').get(ids.fui).dict_lemma, 'ir');
  assert.deepEqual(result.skipped.map(s => s.reason), ['單字庫已經有「ir」，沒有改名', '找不到這張卡']);
  assert.equal(db.prepare('SELECT gender FROM cards WHERE id = ?').get(ids.casa).gender, 'masculino');
});

test('dismissed issues stay hidden until the issue changes', () => {
  const db = freshDb([{ word: 'casa', gender: 'masculino', article: 'el' }]);
  const id = db.prepare('SELECT id FROM cards').get().id;
  assert.equal(dismissIssues(db, 1, [id]), 1);
  assert.equal(auditCards(db, 1).issues.length, 0);
  db.exec("UPDATE cards SET article = 'la'"); // now only the gender differs: a different issue
  assert.deepEqual(auditCards(db, 1).issues[0].problems, ['gender']);
});

test('inflected-form suggestions keep the part of speech of the form', () => {
  const db = freshDb([{ word: 'fui', pos: 'verbo' }]);
  const issue = issueOf(auditCards(db, 1), 'fui');
  assert.ok(issue.candidates.every(c => c.pos === 'verb'));
});

test('without a dictionary the audit says it is unavailable', () => {
  const db = freshDb([{ word: 'casa' }]);
  setDictionary(null);
  assert.deepEqual(auditCards(db, 1), { available: false, summary: {}, labels: auditCards(db, 1).labels, issues: [] });
  assert.throws(() => applyFixes(db, 1, [{ id: 1, lemma: 'casa', pos: 'noun' }]), /沒有離線字典/);
});
