// Run with: npm test  (node --test, no extra packages)
// Learning-language support: language configs, German AI card cleanup, per-language decks and daily tasks.
process.env.DB_PATH = ':memory:';
const test = require('node:test');
const assert = require('node:assert/strict');

const { LANG_CODES, resolveLang, getLanguage } = require('./languages');
const { splitArticle } = require('./cardUtils');
const { normalizeAiCard, extractInstruction, normalizeTranslation } = require('./ai');
const db = require('./db');
const { buildTodayPlan, getTodaySummary, getHistory } = require('./dailyProgress');

test('language registry falls back to Spanish', () => {
  assert.deepEqual(LANG_CODES, ['es', 'de']);
  assert.equal(resolveLang('DE'), 'de');
  assert.equal(resolveLang('fr'), 'es');
  assert.equal(resolveLang(undefined), 'es');
  assert.equal(getLanguage('de').tts.bcp47, 'de-DE');
  assert.deepEqual(getLanguage('de').articles.definite, { masculino: 'der', femenino: 'die', neutro: 'das' });
  assert.ok(getLanguage('de').specialChars.includes('ß'));
});

test('splitArticle knows German articles only in German', () => {
  assert.deepEqual(splitArticle('das Haus', '', 'de'), { word: 'Haus', article: 'das' });
  assert.deepEqual(splitArticle('der Tisch', '', 'es'), { word: 'der Tisch', article: '' });
  assert.deepEqual(splitArticle('el libro'), { word: 'libro', article: 'el' });
});

test('German AI cards get der/die/das, neutro and their forms in notes', () => {
  const haus = normalizeAiCard({
    word: 'das Haus', gender: 'neutro', part_of_speech: 'sustantivo', translation: '房子',
    forms: { plural: 'die Häuser', genitive: 'des Hauses' }, dele_level: 'A1'
  }, 'de');
  assert.equal(haus.word, 'Haus');
  assert.equal(haus.article, 'das');
  assert.equal(haus.gender, 'neutro');
  assert.equal(haus.forms.plural, 'Häuser');
  assert.equal(haus.forms.genitive, 'des Hauses');
  assert.match(haus.notes, /複數：die Häuser；屬格：des Hauses/);

  // Gender from the article when the AI left it out
  assert.equal(normalizeAiCard({ word: 'Tisch', article: 'der', part_of_speech: 'sustantivo', translation: '桌子' }, 'de').gender, 'masculino');
  // Article from the gender
  assert.equal(normalizeAiCard({ word: 'Frau', gender: 'femenino', part_of_speech: 'sustantivo', translation: '女人' }, 'de').article, 'die');
  // Plural-only noun keeps "die" without a gender
  const eltern = normalizeAiCard({ word: 'Eltern', article: 'die', gender: 'none', part_of_speech: 'sustantivo', translation: '父母', forms: { plural: '', genitive: 'der Eltern' } }, 'de');
  assert.equal(eltern.gender, 'none');
  assert.equal(eltern.article, 'die');

  const gehen = normalizeAiCard({ word: 'gehen', part_of_speech: 'verbo', translation: '走', forms: { praeteritum: 'ging', partizip2: 'gegangen', auxiliary: 'sein' } }, 'de');
  assert.equal(gehen.gender, 'none');
  assert.match(gehen.notes, /三態：ging – ist gegangen/);
  // Adjectives have no gender in German
  assert.equal(normalizeAiCard({ word: 'schön', gender: 'femenino', part_of_speech: 'adjetivo', translation: '美的' }, 'de').gender, 'none');
});

test('Spanish cards are cleaned exactly as before', () => {
  const agua = normalizeAiCard({ word: 'agua', article: 'el', gender: 'femenino', part_of_speech: 'sustantivo', translation: '水' });
  assert.equal(agua.article, 'el');
  assert.equal(agua.gender, 'femenino');
  const alto = normalizeAiCard({ word: 'alto', part_of_speech: 'adjetivo', translation: '高的', forms: { masc_sg: 'alto', fem_sg: 'alta', masc_pl: 'altos', fem_pl: 'altas' } });
  assert.equal(alto.gender, 'masculino');
  assert.match(alto.notes, /陰陽性變化/);
});

test('prompts are built from the language template', () => {
  assert.match(extractInstruction('es'), /DELE \/ SIELE/);
  assert.match(extractInstruction('de'), /Goethe-Zertifikat/);
  assert.match(extractInstruction('de'), /der.*die.*das/s);
  assert.doesNotMatch(extractInstruction('de'), /西語/);
  const t = normalizeTranslation({ source_lang: 'de', spanish: 'Ich gehe.', translation_zh: '我走。', points: [{ type: 'grammar', title: 't', explanation: 'e' }] }, 'de');
  assert.equal(t.source_lang, 'de');
});

function makeUser(name) {
  return Number(db.prepare("INSERT INTO users (username, password_hash, daily_new_quota) VALUES (?, 'x', 10)").run(name).lastInsertRowid);
}
const addCard = (userId, lang, word) => db.prepare(`
  INSERT INTO cards (user_id, lang, word, translation, lifecycle_status, due_date)
  VALUES (?, ?, ?, 'x', 'active', datetime('now', 'localtime'))
`).run(userId, lang, word);

test('the same word can exist once per language', () => {
  const u = makeUser('dup');
  addCard(u, 'es', 'radio');
  addCard(u, 'de', 'radio');
  assert.throws(() => addCard(u, 'de', 'radio'), /UNIQUE/);
});

test('daily task, history and snapshots are per language', () => {
  const u = makeUser('split');
  for (const w of ['casa', 'perro', 'gato']) addCard(u, 'es', w);
  for (const w of ['Haus', 'Hund']) addCard(u, 'de', w);

  assert.equal(buildTodayPlan(u, true, 'es').newCards.length, 3);
  const de = buildTodayPlan(u, true, 'de');
  assert.deepEqual(de.newCards.map(c => c.word), ['Haus', 'Hund']);

  // A German review counts for the German task only
  const haus = de.newCards[0];
  db.prepare("INSERT INTO review_logs (user_id, card_id, rating, review_mode, task_type, lang, reviewed_at) VALUES (?, ?, 3, 'flashcard', 'new', 'de', datetime('now', 'localtime'))").run(u, haus.id);
  db.prepare("UPDATE cards SET review_count = 1, last_reviewed = datetime('now', 'localtime'), due_date = datetime('now', 'localtime', '+3 days') WHERE id = ?").run(haus.id);
  const deToday = getTodaySummary(u, null, 'de');
  const esToday = getTodaySummary(u, null, 'es');
  assert.equal(deToday.done, 1);
  assert.equal(deToday.streak.current, 1);
  assert.equal(esToday.done, 0);
  assert.equal(esToday.streak.current, 0);
  assert.equal(getHistory(u, 1, 'de')[0].reviews, 1);
  assert.equal(getHistory(u, 1, 'es')[0].reviews, 0);
  const snaps = db.prepare('SELECT lang, goal FROM daily_progress WHERE user_id = ? ORDER BY lang').all(u).map(r => [r.lang, r.goal]);
  assert.deepEqual(snaps, [['de', 2], ['es', 3]]);
});
