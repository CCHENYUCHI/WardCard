// Run with: npm test  (node --test, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const { build, toRow } = require('./scripts/build-dictionary');
const { setDictionary, lookupForm, findMyCards } = require('./dictionary');
const { normalizeWord, cardWordVariants } = require('./cardUtils');

// Trimmed copies of real kaikki.org entries
const FIXTURE = [
  { word: 'fui', pos: 'verb', lang_code: 'es', senses: [
    { glosses: ['first-person singular preterite indicative of ir'], tags: ['form-of'], form_of: [{ word: 'ir' }] },
    { glosses: ['first-person singular preterite indicative of ser'], tags: ['form-of'], form_of: [{ word: 'ser' }] }
  ] },
  { word: 'ir', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to go'] }] },
  { word: 'ser', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to be'] }] },
  { word: 'ser', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['being'], tags: ['masculine'] }] },
  { word: 'casa', pos: 'noun', lang_code: 'es', head_templates: [{ expansion: 'casa f (plural casas)' }], senses: [{ glosses: ['house'] }] },
  { word: 'casa', pos: 'verb', lang_code: 'es', senses: [
    { glosses: ['inflection of casar:', 'third-person singular present indicative'], form_of: [{ word: 'casar' }] }
  ] },
  { word: 'casar', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to marry'] }] },
  { word: 'como', pos: 'adv', lang_code: 'es', senses: [{ glosses: ['as (to such an extent or degree)'] }] },
  { word: 'como', pos: 'verb', lang_code: 'es', senses: [
    { glosses: ['first-person singular present indicative of comer'], form_of: [{ word: 'comer' }] }
  ] },
  { word: 'comer', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to eat'] }] },
  { word: 'árbol', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['tree'], tags: ['masculine'] }] },
  { word: 'año', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['year'], tags: ['masculine'] }] },
  { word: 'ano', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['anus'], tags: ['masculine'] }] },
  { word: 'hablamos', pos: 'verb', lang_code: 'es', senses: [
    { glosses: ['first-person plural present indicative of hablar'], form_of: [{ word: 'hablar' }] }
  ] },
  { word: 'hablar', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to speak'] }] },
  { word: 'Madrid', pos: 'name', lang_code: 'es', senses: [{ glosses: ['Madrid'] }] },
  { word: 'house', pos: 'noun', lang_code: 'en', senses: [{ glosses: ['casa'] }] }
];

let tmpDir;

test.before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dict-test-'));
  const input = path.join(tmpDir, 'es.jsonl');
  fs.writeFileSync(input, `${FIXTURE.map(e => JSON.stringify(e)).join('\n')}\nnot json\n`);
  const out = path.join(tmpDir, 'es-en.sqlite');
  await build(input, out);
  setDictionary(new DatabaseSync(out, { readOnly: true }));
});

test.after(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('normalizeWord strips case, accents and punctuation', () => {
  assert.equal(normalizeWord('¿Árbol?'), 'arbol');
  assert.equal(normalizeWord('  Mañana. '), 'manana');
});

test('toRow skips proper nouns and other languages', () => {
  assert.equal(toRow(FIXTURE.find(e => e.word === 'Madrid')), null);
  assert.equal(toRow(FIXTURE.find(e => e.word === 'house')), null);
});

test('toRow reads gender from the head line', () => {
  assert.equal(toRow(FIXTURE.find(e => e.word === 'casa' && e.pos === 'noun')).gender, 'f');
});

test('inflected form resolves to every lemma', () => {
  const items = lookupForm('fui');
  assert.deepEqual(items.map(i => i.lemma), ['ir', 'ser']);
  assert.equal(items[0].via, 'first-person singular preterite indicative');
  assert.deepEqual(items[0].glosses, ['to go']);
  assert.equal(items[1].part_of_speech, 'verbo', 'ser the verb, not ser the noun');
});

test('word that is both a lemma and a form returns both', () => {
  const items = lookupForm('casa');
  assert.deepEqual(items.map(i => [i.lemma, i.pos]), [['casa', 'noun'], ['casar', 'verb']]);
  assert.equal(items[0].gender, 'femenino');
  assert.equal(items[1].via, 'third-person singular present indicative');
  assert.deepEqual(lookupForm('como').map(i => i.lemma), ['como', 'comer']);
});

test('accent-insensitive, exact spelling first', () => {
  assert.equal(lookupForm('Arbol')[0].lemma, 'árbol');
  assert.deepEqual(lookupForm('año').map(i => i.lemma), ['año', 'ano']);
  assert.deepEqual(lookupForm('ano').map(i => i.lemma), ['ano', 'año']);
  assert.deepEqual(lookupForm('zzzz'), []);
});

test('cardWordVariants expands gendered spellings', () => {
  assert.deepEqual(cardWordVariants('bonito/a').sort(), ['bonita', 'bonito', 'bonito/a'].sort());
  assert.ok(cardWordVariants('el profesor / la profesora').includes('profesora'));
  assert.ok(cardWordVariants('niño(a)').includes('nina'));
});

test('findMyCards matches through lemmas and translations', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE cards (id INTEGER PRIMARY KEY, user_id INTEGER, word TEXT, article TEXT, gender TEXT,
    part_of_speech TEXT, translation TEXT, english_translation TEXT, example_es TEXT, example_zh TEXT, notes TEXT,
    lifecycle_status TEXT, mastery_stage INTEGER, is_starred INTEGER)`);
  const add = db.prepare('INSERT INTO cards (user_id, word, translation) VALUES (?, ?, ?)');
  add.run(1, 'hablar', '說話');
  add.run(1, 'bonito/a', '漂亮的');
  add.run(1, 'acostumbrarse', '習慣');
  add.run(1, 'manzana', '蘋果');
  add.run(2, 'hablar', '說話');

  const lemmas = lookupForm('hablamos').map(i => i.lemma);
  assert.deepEqual(findMyCards(db, 1, 'hablamos', lemmas).map(c => c.word), ['hablar']);
  assert.deepEqual(findMyCards(db, 1, 'Bonita').map(c => c.word), ['bonito/a']);
  assert.deepEqual(findMyCards(db, 1, 'acostumbro', ['acostumbrar']).map(c => c.word), ['acostumbrarse']);
  assert.deepEqual(findMyCards(db, 1, '蘋果').map(c => c.word), ['manzana']);
  assert.deepEqual(findMyCards(db, 1, 'nada'), []);
});
