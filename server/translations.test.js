// Run with: npm test  (node --test, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');

const { normalizeTranslation, GeminiError } = require('./ai');
const T = require('./translations');

test('normalizeTranslation trims, defaults and caps lists', () => {
  const r = normalizeTranslation({
    source_lang: 'xx',
    spanish: '  Me gusta el café. ',
    correction: ' ',
    translation_zh: ' 我喜歡咖啡。',
    translation_en: 'I like coffee.',
    points: [
      { type: 'grammar', title: 'gustar', explanation: '主詞是被喜歡的東西', examples: [
        { es: 'Me gustan los gatos.', zh: '我喜歡貓。' }, { es: 'a', zh: 'b' }, { es: 'c', zh: 'd' }
      ] },
      { type: 'weird', title: 'el café', explanation: '泛指也要加定冠詞' },
      { type: 'idiom', title: '', explanation: 'no title, dropped' },
      ...Array.from({ length: 6 }, (_, i) => ({ type: 'usage', title: `t${i}`, explanation: 'e' }))
    ],
    alternatives: [{ es: 'Adoro el café.', zh: '我超愛咖啡。', note: '' }, { es: 'x' }, { es: 'y' }, { zh: 'no es, dropped' }]
  });
  assert.equal(r.source_lang, 'es');
  assert.equal(r.spanish, 'Me gusta el café.');
  assert.equal(r.correction, '');
  assert.equal(r.translation_zh, '我喜歡咖啡。');
  assert.equal(r.points.length, 6);
  assert.equal(r.points[0].examples.length, 2);
  assert.equal(r.points[1].type, 'usage');
  assert.deepEqual(r.points[1].examples, []);
  assert.equal(r.alternatives.length, 2);
  assert.deepEqual(r.alternatives[1], { es: 'x', zh: '', note: '' });
});

test('normalizeTranslation rejects empty results', () => {
  const base = { spanish: 'Hola', translation_zh: '你好', translation_en: 'Hi', points: [{ type: 'usage', title: 'hola', explanation: '打招呼' }] };
  assert.throws(() => normalizeTranslation(null), GeminiError);
  assert.throws(() => normalizeTranslation({ ...base, spanish: '' }), GeminiError);
  assert.throws(() => normalizeTranslation({ ...base, translation_zh: '', translation_en: '' }), GeminiError);
  assert.throws(() => normalizeTranslation({ ...base, points: [] }), GeminiError);
  assert.equal(normalizeTranslation({ ...base, source_lang: 'zh' }).source_lang, 'zh');
  assert.deepEqual(normalizeTranslation(base).alternatives, []);
});

const RESULT = {
  source_lang: 'es', spanish: 'Hola', correction: '', translation_zh: '你好', translation_en: 'Hi',
  points: [{ type: 'usage', title: 'hola', explanation: '打招呼', examples: [] }], alternatives: []
};
const freshDb = () => {
  const db = new DatabaseSync(':memory:');
  db.exec(T.TRANSLATIONS_SCHEMA);
  return db;
};

test('translationHash ignores case and extra whitespace', () => {
  assert.equal(T.translationHash('  Hola   Mundo '), T.translationHash('hola mundo'));
  assert.notEqual(T.translationHash('hola'), T.translationHash('hola.'));
});

test('save, find own and shared, list with search and paging, delete own only', () => {
  const db = freshDb();
  const hash = T.translationHash('Hola');
  const rec = T.saveTranslation(db, { userId: 1, inputText: 'Hola', hash, result: RESULT, model: 'm' });
  assert.equal(rec.input_text, 'Hola');
  assert.equal(rec.translation_zh, '你好');
  assert.equal(rec.points[0].title, 'hola');
  assert.equal(T.findOwnTranslation(db, 1, hash).id, rec.id);
  assert.equal(T.findOwnTranslation(db, 2, hash), null);
  assert.equal(T.findSharedTranslation(db, hash).result.spanish, 'Hola');
  assert.equal(T.findSharedTranslation(db, T.translationHash('nope')), null);

  // Saving the same sentence twice keeps one record
  assert.equal(T.saveTranslation(db, { userId: 1, inputText: 'hola', hash, result: RESULT, model: 'm' }).id, rec.id);

  for (let i = 0; i < 3; i++) {
    const text = `Frase ${i}`;
    T.saveTranslation(db, {
      userId: 1, inputText: text, hash: T.translationHash(text),
      result: { ...RESULT, spanish: text, translation_zh: `句子${i}` }, model: 'm'
    });
  }
  const page = T.listTranslations(db, 1, { limit: 2 });
  assert.equal(page.items.length, 2);
  assert.equal(page.hasMore, true);
  assert.equal(page.items[0].input_text, 'Frase 2'); // newest first
  const rest = T.listTranslations(db, 1, { limit: 2, offset: 2 });
  assert.equal(rest.items.length, 2);
  assert.equal(rest.hasMore, false);
  assert.equal(T.listTranslations(db, 1, { q: '你好' }).items.length, 1);
  assert.equal(T.listTranslations(db, 1, { q: 'frase' }).items.length, 3);
  assert.equal(T.listTranslations(db, 1, { q: '100%' }).items.length, 0); // LIKE wildcards are literal
  assert.equal(T.listTranslations(db, 2).items.length, 0);

  assert.equal(T.deleteTranslation(db, 2, rec.id), false);
  assert.equal(T.deleteTranslation(db, 1, rec.id), true);
  assert.equal(T.findOwnTranslation(db, 1, hash), null);
});
