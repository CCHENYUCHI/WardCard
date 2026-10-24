const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { writeLexicon, findLexiconEntry } = require('./lexicon');
const { parseEntries, checkEntry, checkAnswer, buildPrompt, hasSimplified, factSources } = require('./scripts/lexicon/geminiEntries');
const { buildQueue, toBatches } = require('./scripts/lexicon/build-queue');
const { parseRpcBody } = require('./scripts/lexicon/agy');
const { batchRange } = require('./scripts/lexicon/gemini-write');

// Facts as fetch-facts.js writes them (trimmed)
const portarFacts = {
  word: 'transportar',
  base: null,
  entries: [{
    word: 'transportar', pos: 'verb', ipa: ['/tɾanspoɾˈtaɾ/'], glosses: ['to transport'],
    etymology_text: 'Borrowed from Latin trānsportāre.',
    etymology: { origins: [{ kind: 'bor', lang: 'la', word: 'trānsportō' }], parts: [], cognates: [] }
  }],
  ancestors: [{ depth: 1, lang: 'Latin', word: 'trānsportō', glosses: ['to carry across'], etymology_text: 'From trāns- + portō.', etymology: { origins: [], parts: [{ items: ['trāns-', 'portō'] }] } }]
};
const noEtymologyFacts = {
  word: 'vale', base: null,
  entries: [{ word: 'vale', pos: 'intj', glosses: ['OK'], etymology_text: '', etymology: { origins: [], parts: [], cognates: [] } }],
  ancestors: []
};

const entry = (word, extra = {}) => ({
  word, article: '', pos: 'verbo', zh: '運送', en: 'to transport', ipa: '/tɾanspoɾˈtaɾ/',
  breakdown: [{ part: 'trans-', zh: '跨越' }, { part: 'port', zh: '搬運' }, { part: '-ar', zh: '動詞字尾' }],
  origin_chain: [{ lang_zh: '拉丁語', word: 'trānsportāre', zh: '搬運過去' }, { lang_zh: '西班牙語', word, zh: '運送' }],
  cognates_en: ['transport'], story_zh: '來自拉丁文 transportare，trans- 是跨越，portare 是搬運。', hook_zh: '英文 transport 就是它。',
  usage_zh: '', example_es: 'Este camión transporta frutas.', example_zh: '這輛卡車運水果。', image: 'emoji:🚚',
  confidence: 'sourced', sources: ['wiktionary:es:transportar', 'wiktionary:la:transporto', 'wiktionary:la:invented'], ...extra
});

test('parseEntries reads the JSON array out of fences and surrounding text', () => {
  assert.deepStrictEqual(parseEntries('```json\n[{"word":"a"}]\n```'), [{ word: 'a' }]);
  assert.deepStrictEqual(parseEntries('Aquí está: [{"word":"a"}, 3] listo'), [{ word: 'a' }]);
  assert.throws(() => parseEntries('no json here'), /no JSON array/);
});

test('checkEntry keeps an entry grounded in the facts and limits sources to the fetched pages', () => {
  const { entry: e, errors } = checkEntry(entry('transportar'), portarFacts);
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(e.writer, 'gemini');
  assert.strictEqual(e.confidence, 'sourced');
  assert.deepStrictEqual(e.sources, ['wiktionary:es:transportar', 'wiktionary:la:transporto']);
  assert.ok(factSources(portarFacts).has('wiktionary:la:transporto'));
});

test('checkEntry rejects ancestors that are not in the facts', () => {
  const bad = entry('transportar', { origin_chain: [{ lang_zh: '古希臘語', word: 'πορεύω', zh: '走' }, { lang_zh: '西班牙語', word: 'transportar', zh: '運送' }] });
  const { errors } = checkEntry(bad, portarFacts);
  assert.ok(errors.some(e => e.includes('πορεύω')));
});

test('checkEntry turns an entry without etymology facts into hook-only', () => {
  const { entry: e, errors } = checkEntry(entry('vale', { pos: 'interjección', example_es: '¡Vale, nos vemos!' }), noEtymologyFacts);
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(e.confidence, 'hook-only');
  assert.deepStrictEqual(e.origin_chain, []);
  assert.strictEqual(e.story_zh, '');
});

test('checkEntry flags Simplified Chinese, a wrong word and schema problems', () => {
  assert.ok(hasSimplified('这个字'));
  assert.ok(!hasSimplified('這個字'));
  const { errors } = checkEntry(entry('transportar', { hook_zh: '这就是 transport', pos: 'verb' }), portarFacts);
  assert.ok(errors.some(e => e.includes('Simplified')));
  assert.ok(errors.some(e => e.includes('pos')));
  assert.ok(checkEntry(entry('portar'), portarFacts).errors.some(e => e.includes('word should be')));
});

test('checkAnswer reports words missing from the answer', () => {
  const results = checkAnswer([entry('transportar')], [portarFacts, noEtymologyFacts]);
  assert.deepStrictEqual(results.transportar.errors, []);
  assert.deepStrictEqual(results.vale.errors, ['missing from the answer']);
});

test('buildPrompt lists the words, their facts and the problems of the last try', () => {
  const prompt = buildPrompt([portarFacts], [], { transportar: ['zh missing'] });
  assert.match(prompt, /字表：\["transportar"\]/);
  assert.match(prompt, /trānsportō/);
  assert.match(prompt, /transportar: zh missing/);
});

test('buildQueue folds forms into lemmas, skips names and known words, and stops at missing facts', () => {
  const facts = {
    casas: { word: 'casas', base: 'casa', entries: [{ pos: 'noun' }] },
    perro: { word: 'perro', base: null, entries: [{ pos: 'noun' }] },
    madrid: { word: 'madrid', base: null, entries: [{ pos: 'name' }] },
    xq: { word: 'xq', base: null, entries: [] },
    hablar: { word: 'hablar', base: null, entries: [{ pos: 'verb' }] },
    hablo: { word: 'hablo', base: 'hablar', entries: [{ pos: 'verb' }] },
    mesa: { word: 'mesa', base: null, entries: [{ pos: 'noun' }] }
  };
  const words = ['casas', 'perro', 'madrid', 'xq', 'hablar', 'hablo', 'nuevo', 'mesa'];
  const queue = buildQueue(words, w => facts[w], new Set(['perro']));
  assert.deepStrictEqual(queue.map(q => q.lemma), ['casa', 'hablar']); // stops at "nuevo" (not fetched yet)
  assert.deepStrictEqual(queue.map(q => q.rank), [1, 5]);
  const batches = toBatches([...queue, { lemma: 'x' }], 2);
  assert.deepStrictEqual(Object.keys(batches), ['0001']);
  assert.deepStrictEqual(Object.keys(toBatches([...queue, { lemma: 'x' }], 2, { partial: true })), ['0001', '0002']);
});

test('batchRange picks a range of batch ids', () => {
  assert.deepStrictEqual(batchRange('2-3', ['0001', '0002', '0003', '0004']), ['0002', '0003']);
  assert.deepStrictEqual(batchRange('0004', ['0001', '0004']), ['0004']);
  assert.deepStrictEqual(batchRange('all', ['0001']), ['0001']);
});

test('parseRpcBody reads plain JSON and server-sent events', () => {
  assert.deepStrictEqual(parseRpcBody('{"id":1}'), [{ id: 1 }]);
  assert.deepStrictEqual(parseRpcBody('event: message\ndata: {"id":2}\n\n'), [{ id: 2 }]);
  assert.deepStrictEqual(parseRpcBody(''), []);
});

test('writeLexicon reads several sets and keeps the first entry of a word', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lexicon-sets-'));
  const write = (set, name, data) => {
    fs.mkdirSync(path.join(root, set), { recursive: true });
    fs.writeFileSync(path.join(root, set, name), JSON.stringify(data));
  };
  write('a1', 'verbs.json', { theme: 'verbs', entries: [{ word: 'hablar', zh: 'A1' }] });
  write('freq', '0001.json', { theme: 'freq-0001', entries: [{ word: 'hablar', zh: 'freq' }, { word: 'transportar', zh: '運送', image: 'emoji:🚚' }] });
  const db = new DatabaseSync(':memory:');
  assert.strictEqual(writeLexicon(db, [path.join(root, 'a1'), path.join(root, 'freq'), path.join(root, 'missing')]), 2);
  assert.strictEqual(findLexiconEntry(db, ['hablar']).zh, 'A1');
  assert.strictEqual(findLexiconEntry(db, ['transportar']).emoji, '🚚');
});

test('buildQueue folds an inflected form listed in its base word\'s head line', () => {
  const facts = {
    nuevo: { word: 'nuevo', base: null, entries: [{ pos: 'adj', head: 'nuevo (feminine nueva, masculine plural nuevos)' }] },
    nueva: { word: 'nueva', base: null, entries: [{ pos: 'noun', head: 'nueva f (plural nuevas)' }] },
    cuento: { word: 'cuento', base: null, entries: [{ pos: 'noun', head: 'cuento m (plural cuentos)' }] },
    cuenta: { word: 'cuenta', base: null, entries: [{ pos: 'noun', head: 'cuenta f (plural cuentas)' }] }
  };
  const queue = buildQueue(['cuento', 'nueva', 'cuenta'], w => facts[w], new Set(['nuevo']));
  assert.deepStrictEqual(queue.map(q => q.lemma), ['cuento', 'cuenta']); // nueva is nuevo (known), cuenta is its own word
});

test('buildQueue folds verb forms into the known or most frequent lemma, unless the word has a meaning of its own', () => {
  const facts = {
    podemos: { word: 'podemos', base: 'podar', form_of: ['podar', 'poder'], entries: [{ pos: 'verb', glosses: ['to prune'] }] },
    pasa: { word: 'pasa', base: null, form_of: ['pasar'], entries: [{ pos: 'noun', glosses: ['raisin'] }] },
    estado: { word: 'estado', base: null, form_of: ['estar'], entries: [{ pos: 'noun', glosses: ['state', 'condition', 'status', 'nation', 'stage'] }] },
    sino: { word: 'sino', base: null, form_of: ['sinar'], entries: [{ pos: 'conj', glosses: ['but rather'] }] },
    d: { word: 'd', base: null, entries: [{ pos: 'prep', glosses: ['abbreviation of de'] }] },
    pasar: { word: 'pasar', base: null, entries: [{ pos: 'verb', glosses: ['to pass'] }] }
  };
  const queue = buildQueue(['podemos', 'pasar', 'pasa', 'estado', 'sino', 'd'], w => facts[w], new Set(['poder', 'estar']));
  assert.deepStrictEqual(queue.map(q => q.lemma), ['pasar', 'estado', 'sino']);
});

test('buildQueue keeps a noun whose verb is rarer, and infinitives', () => {
  const facts = {
    gobierno: { word: 'gobierno', base: null, form_of: ['gobernar'], entries: [{ pos: 'noun', glosses: ['government'] }] },
    crear: { word: 'crear', base: null, form_of: ['creer'], entries: [{ pos: 'verb', glosses: ['to create'] }] },
    gobernar: { word: 'gobernar', base: null, entries: [{ pos: 'verb', glosses: ['to govern'] }] }
  };
  const queue = buildQueue(['gobierno', 'crear', 'gobernar'], w => facts[w], new Set(['creer']));
  assert.deepStrictEqual(queue.map(q => q.lemma), ['gobierno', 'crear', 'gobernar']);
});
