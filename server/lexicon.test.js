const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { writeLexicon, findLexiconEntry, lexiconKey, svgFileName } = require('./lexicon');
const { buildLexicon } = require('./scripts/build-lexicon');
const { validateEntry, validateSvg, validateAll } = require('./scripts/lexicon/validate');
const { render, s } = require('./scripts/lexicon/art');

const entry = (word, extra = {}) => ({
  word, article: '', pos: 'adverbio', zh: '是', en: 'yes', ipa: '/si/', breakdown: [], origin_chain: [],
  cognates_en: [], story_zh: '', hook_zh: '聯想', usage_zh: '', example_es: `${word}, gracias.`, example_zh: '例句',
  image: 'emoji:👍', confidence: 'hook-only', sources: [], ...extra
});

function fixtureDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lexicon-'));
  for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), JSON.stringify(data));
  return dir;
}

test('writeLexicon replaces the lexicon tables with the JSON files', () => {
  const db = new DatabaseSync(':memory:');
  const dir = fixtureDir({ 'a.json': { theme: 'grammar', entries: [entry('sí'), entry('si', { zh: '如果' })] } });
  assert.strictEqual(writeLexicon(db, dir), 2);
  fs.writeFileSync(path.join(dir, 'b.json'), JSON.stringify({ theme: 'nature', entries: [entry('árbol', { image: 'svg' })] }));
  assert.strictEqual(writeLexicon(db, dir), 3);
  fs.rmSync(path.join(dir, 'a.json'));
  assert.strictEqual(writeLexicon(db, dir), 1); // removed entries disappear
  assert.strictEqual(db.prepare('SELECT count(*) AS n FROM lexicon').get().n, 1);
});

test('findLexiconEntry returns null without a dictionary or without a lexicon table', () => {
  assert.strictEqual(findLexiconEntry(null, ['sí']), null);
  const oldDictionary = new DatabaseSync(':memory:');
  oldDictionary.exec('CREATE TABLE entries (word TEXT, word_norm TEXT)');
  assert.strictEqual(findLexiconEntry(oldDictionary, ['sí']), null);
});

test('buildLexicon creates a lexicon-only dictionary file and refreshes an existing one', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lexicon-build-'));
  const file = path.join(dir, 'nested', 'es-en.sqlite');
  const first = buildLexicon(file);
  assert.strictEqual(first.isNew, true);
  assert.ok(first.count > 1000);
  const db = new DatabaseSync(file, { readOnly: true });
  assert.strictEqual(db.prepare('SELECT count(*) AS n FROM entries').get().n, 0);
  assert.strictEqual(findLexiconEntry(db, ['manzana']).word, 'manzana');
  db.close();
  const again = buildLexicon(file);
  assert.strictEqual(again.isNew, false);
  assert.strictEqual(again.count, first.count);
});

test('findLexiconEntry keeps accented homographs apart and falls back to an unambiguous loose match', () => {
  const db = new DatabaseSync(':memory:');
  writeLexicon(db, fixtureDir({ 'a.json': { theme: 't', entries: [entry('sí'), entry('si', { zh: '如果' }), entry('árbol', { image: 'svg' })] } }));
  assert.strictEqual(findLexiconEntry(db, ['sí']).zh, '是');
  assert.strictEqual(findLexiconEntry(db, ['si']).zh, '如果');
  // "SI" from a card still finds the exact (case-insensitive) entry; "arbol" has a single accented match
  assert.strictEqual(findLexiconEntry(db, ['SI']).zh, '如果');
  const tree = findLexiconEntry(db, ['el arbol']);
  assert.strictEqual(tree.word, 'árbol');
  assert.strictEqual(tree.image_url, '/lexicon/%C3%A1rbol.svg');
  assert.strictEqual(findLexiconEntry(db, ['sí']).emoji, '👍');
  // Candidates are tried in order: an inflected query falls through to its lemma
  assert.strictEqual(findLexiconEntry(db, ['árboles', null, 'árbol']).word, 'árbol');
  assert.strictEqual(findLexiconEntry(db, ['nada']), null);
});

test('keys keep accents; file names replace spaces', () => {
  assert.strictEqual(lexiconKey(' Té '), 'té');
  assert.strictEqual(svgFileName('por favor'), 'por_favor.svg');
});

test('validateEntry flags missing sources, long text and examples without the word', () => {
  assert.deepStrictEqual(validateEntry(entry('sí')), []);
  const bad = validateEntry(entry('casa', {
    confidence: 'sourced', story_zh: '', hook_zh: '長'.repeat(81), example_es: 'Vivo aquí.'
  }));
  assert.ok(bad.some(e => e.includes('sourced entry')));
  assert.ok(bad.some(e => e.includes('hook_zh too long')));
  assert.ok(bad.some(e => e.includes('example_es')));
});

test('art renders both styles as small self-contained SVG', () => {
  const shapes = [s('circle', { cx: 80, cy: 80, r: 40 }, 'red', { accent: true }), s('rect', { x: 0, y: 0, width: 4, height: 4 }, 'white', { flatOnly: true })];
  const flat = render(shapes, 'flat');
  const line = render(shapes, 'line');
  assert.match(flat, /fill="#EA4335"/);
  assert.match(line, /stroke="#3C4043"/);
  assert.doesNotMatch(line, /<rect/);
  assert.deepStrictEqual(validateSvg(flat), []);
  assert.ok(validateSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><script/></svg>').length > 0);
});

test('the committed lexicon passes validation', () => {
  const { count, problems } = validateAll();
  assert.ok(count > 0);
  assert.deepStrictEqual(problems, []);
});
