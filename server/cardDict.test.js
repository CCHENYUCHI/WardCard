const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const { build } = require('./scripts/build-dictionary');
const { setDictionary } = require('./dictionary');
const { resolveCardLink, linkCard, linkPendingCards, enrichCards, primarySpelling } = require('./cardDict');

const FIXTURE = [
  { word: 'árbol', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['tree'], tags: ['masculine'] }] },
  { word: 'casa', pos: 'noun', lang_code: 'es', head_templates: [{ expansion: 'casa f (plural casas)' }], senses: [{ glosses: ['house'] }] },
  { word: 'casa', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['inflection of casar:', 'third-person singular present indicative'], form_of: [{ word: 'casar' }] }] },
  { word: 'comer', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to eat'] }] },
  { word: 'comer', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['eating'], tags: ['masculine'] }] },
  { word: 'bonito', pos: 'adj', lang_code: 'es', senses: [{ glosses: ['pretty'] }] },
  { word: 'acostumbrar', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['to accustom'] }] },
  { word: 'año', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['year'], tags: ['masculine'] }] },
  { word: 'ano', pos: 'noun', lang_code: 'es', senses: [{ glosses: ['anus'], tags: ['masculine'] }] },
  { word: 'artista', pos: 'noun', lang_code: 'es', head_templates: [{ expansion: 'artista m or f (plural artistas)' }], senses: [{ glosses: ['artist'] }] },
  { word: 'por favor', pos: 'phrase', lang_code: 'es', senses: [{ glosses: ['please'] }] }
];

const CARDS_SCHEMA = `CREATE TABLE cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, article TEXT DEFAULT '', gender TEXT DEFAULT 'none',
  part_of_speech TEXT DEFAULT 'sustantivo', english_translation TEXT DEFAULT '', dict_lemma TEXT DEFAULT NULL, dict_pos TEXT DEFAULT NULL)`;

let tmpDir;
test.before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-dict-'));
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

test('primarySpelling reduces gendered and article forms to the dictionary spelling', () => {
  assert.equal(primarySpelling('el profesor / la profesora'), 'profesor');
  assert.equal(primarySpelling('bonito/a'), 'bonito');
  assert.equal(primarySpelling('niño(a)'), 'niño');
  assert.equal(primarySpelling('el árbol'), 'árbol');
});

test('resolveCardLink picks the entry that matches the card', () => {
  assert.deepEqual(resolveCardLink('el árbol', 'sustantivo'), { lemma: 'árbol', pos: 'noun' });
  assert.deepEqual(resolveCardLink('bonito/a', 'adjetivo'), { lemma: 'bonito', pos: 'adj' });
  assert.deepEqual(resolveCardLink('comer', 'verbo'), { lemma: 'comer', pos: 'verb' });
  assert.deepEqual(resolveCardLink('comer', 'sustantivo'), { lemma: 'comer', pos: 'noun' });
  assert.deepEqual(resolveCardLink('por favor', 'frase'), { lemma: 'por favor', pos: 'phrase' });
});

test('resolveCardLink tolerates a wrong card part of speech when the word has one entry', () => {
  assert.deepEqual(resolveCardLink('bonito', 'sustantivo'), { lemma: 'bonito', pos: 'adj' });
  // "casa" the verb form has no meanings of its own, so only the noun counts
  assert.deepEqual(resolveCardLink('casa', 'verbo'), { lemma: 'casa', pos: 'noun' });
});

test('resolveCardLink keeps accents apart, falls back for a reflexive verb and gives up when unsure', () => {
  assert.deepEqual(resolveCardLink('año', 'sustantivo'), { lemma: 'año', pos: 'noun' });
  assert.deepEqual(resolveCardLink('ano', 'sustantivo'), { lemma: 'ano', pos: 'noun' });
  assert.deepEqual(resolveCardLink('arbol', 'sustantivo'), { lemma: 'árbol', pos: 'noun' });
  assert.deepEqual(resolveCardLink('acostumbrarse', 'verbo'), { lemma: 'acostumbrar', pos: 'verb' });
  assert.equal(resolveCardLink('comer', 'adjetivo'), null, 'two entries, neither matches the card');
  assert.equal(resolveCardLink('palabrainventada', 'sustantivo'), null);
  assert.equal(resolveCardLink('', 'sustantivo'), null);
});

test('linkCard and linkPendingCards store the link, mark misses and skip cards already looked up', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(CARDS_SCHEMA);
  db.exec("INSERT INTO cards (word, part_of_speech) VALUES ('el árbol','sustantivo'), ('palabrainventada','sustantivo'), ('comer','verbo')");
  assert.deepEqual(linkPendingCards(db), { checked: 3, linked: 2 });
  const rows = db.prepare('SELECT word, dict_lemma, dict_pos FROM cards ORDER BY id').all();
  assert.deepEqual(rows.map(r => [r.dict_lemma, r.dict_pos]), [['árbol', 'noun'], ['', ''], ['comer', 'verb']]);
  assert.deepEqual(linkPendingCards(db), { checked: 0, linked: 0 }, 'a miss is remembered, not retried');
  db.exec("UPDATE cards SET word = 'bonito', part_of_speech = 'adjetivo' WHERE id = 2");
  assert.deepEqual(linkPendingCards(db, { relink: true }), { checked: 3, linked: 3 });
  assert.equal(db.prepare('SELECT dict_lemma FROM cards WHERE id = 2').get().dict_lemma, 'bonito');
  assert.equal(linkCard(db, { id: 1, word: 'palabrainventada', part_of_speech: 'sustantivo' }), null);
  assert.equal(db.prepare('SELECT dict_lemma FROM cards WHERE id = 1').get().dict_lemma, '');
});

test('enrichCards takes gender, part of speech and English meaning from the dictionary for linked cards only', () => {
  const linked = { id: 1, word: 'casa', article: '', gender: 'none', part_of_speech: 'verbo', english_translation: '', dict_lemma: 'casa', dict_pos: 'noun' };
  const [out] = enrichCards([linked]);
  assert.equal(out.part_of_speech, 'sustantivo');
  assert.equal(out.gender, 'femenino');
  assert.equal(out.article, 'la');
  assert.equal(out.english_translation, 'house');
  assert.equal(linked.gender, 'none', 'the input card is not mutated');

  const keeps = enrichCards([
    { id: 2, word: 'agua', article: 'el', gender: 'femenino', part_of_speech: 'sustantivo', english_translation: 'my own', dict_lemma: 'casa', dict_pos: 'noun' },
    { id: 3, word: 'artista', article: '', gender: 'none', part_of_speech: 'sustantivo', english_translation: '', dict_lemma: 'artista', dict_pos: 'noun' },
    { id: 4, word: 'por favor', gender: 'none', part_of_speech: 'frase', english_translation: '', dict_lemma: '', dict_pos: '' },
    { id: 5, word: 'inventada', gender: 'none', part_of_speech: 'frase', english_translation: '', dict_lemma: null, dict_pos: null }
  ]);
  assert.equal(keeps[0].article, 'el', 'an existing article (el agua) stays');
  assert.equal(keeps[0].english_translation, 'my own', 'an existing English meaning stays');
  assert.equal(keeps[1].gender, 'none', 'm or f (artista) keeps the card value');
  assert.equal(keeps[2].part_of_speech, 'frase');
  assert.equal(keeps[3].part_of_speech, 'frase');
});

test('without a dictionary nothing is linked and cards come back unchanged', () => {
  setDictionary(null);
  assert.equal(resolveCardLink('árbol', 'sustantivo'), null);
  const db = new DatabaseSync(':memory:');
  db.exec(CARDS_SCHEMA);
  db.exec("INSERT INTO cards (word) VALUES ('árbol')");
  assert.deepEqual(linkPendingCards(db), { checked: 0, linked: 0 });
  assert.equal(db.prepare('SELECT dict_lemma FROM cards').get().dict_lemma, null, 'stays "not looked up" so it links once a dictionary exists');
  const cards = [{ id: 1, dict_lemma: 'árbol', dict_pos: 'noun', gender: 'none' }];
  assert.equal(enrichCards(cards), cards);
});
