// German offline dictionary: build from real kaikki.org entries (server/fixtures/kaikki-de-sample.jsonl:
// gehen, Haus, gut, ging — Wiktionary, CC BY-SA), then lookup, gender and the grouped tables.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const { build, toRow, detectGender, detectInputLang } = require('./scripts/build-dictionary');
const { setDictionary, lookupForm, getEntryExtras, getDictionaryInfo, dictionaryHasEntries, externalLinks } = require('./dictionary');

const FIXTURE = path.join(__dirname, 'fixtures/kaikki-de-sample.jsonl');
let tmpDir;
let dictDb;

test.before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dict-de-'));
  const out = path.join(tmpDir, 'de-en.sqlite');
  const result = await build(FIXTURE, out, { lang: 'de' });
  assert.equal(result.rows, 4);
  assert.equal(result.lexiconEntries, 0); // the lexicon is Spanish only
  dictDb = new DatabaseSync(out, { readOnly: true });
  setDictionary(dictDb, 'de');
});
test.after(() => {
  setDictionary(null, 'de');
  dictDb?.close(); // Windows cannot delete an open SQLite file
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const entry = (word) => JSON.parse(fs.readFileSync(FIXTURE, 'utf8').split('\n').filter(Boolean).find(l => JSON.parse(l).word === word));

test('German entries are only read in a German build; neuter gender is detected', () => {
  assert.equal(toRow(entry('Haus')), null); // default build language is es
  assert.equal(toRow(entry('Haus'), 'de').gender, 'n');
  assert.equal(detectInputLang(FIXTURE), 'de');
  assert.equal(detectGender({ head_templates: [{ expansion: 'Frau f (genitive Frau, plural Frauen)' }] }), 'f');
  assert.equal(detectGender({ head_templates: [{ expansion: 'Tisch m (strong, genitive Tisches, plural Tische)' }] }), 'm');
});

test('lookup finds the lemma of an inflected form and maps neuter to neutro', () => {
  const [ging] = lookupForm('ging', 'de');
  assert.equal(ging.lemma, 'gehen');
  assert.equal(ging.part_of_speech, 'verbo');
  assert.match(ging.via, /preterite/);
  const [haus] = lookupForm('haus', 'de'); // case-insensitive
  assert.deepEqual([haus.lemma, haus.gender, haus.part_of_speech], ['Haus', 'neutro', 'sustantivo']);
  assert.ok(haus.glosses[0].startsWith('house'));
  // The Spanish dictionary is a different file
  assert.deepEqual(lookupForm('ging'), []);
  assert.equal(dictionaryHasEntries('de'), true);
  assert.equal(getDictionaryInfo('de').exists, true);
  assert.equal(getDictionaryInfo('de').lang, 'de');
});

test('verbs get Präsens / Präteritum / Perfekt / Konjunktiv / Imperativ tables', () => {
  const { forms, ipa } = getEntryExtras('gehen', 'verb', 'de');
  assert.equal(ipa, '/ˈɡeːən/');
  assert.equal(forms.kind, 'verb');
  const nf = Object.fromEntries(forms.nonfinite.map(n => [n.key, n.forms]));
  assert.deepEqual(nf['participle-past'], ['gegangen']);
  assert.deepEqual(nf.auxiliary, ['sein']);
  const table = (tense) => Object.fromEntries(forms.tables.find(t => t.tense === tense).rows.map(r => [r.person, r.form]));
  assert.deepEqual(table('present'), { ich: 'gehe', du: 'gehst', 'er / sie / es': 'geht', wir: 'gehen', ihr: 'geht', 'sie / Sie': 'gehen' });
  assert.equal(table('preterite')['er / sie / es'], 'ging');
  assert.equal(table('perfect').ich, 'bin gegangen');
  assert.equal(table('subjunctive-ii').ich, 'ginge');
  assert.equal(table('imperative').du, 'geh / gehe');
  assert.equal(table('imperative').ihr, 'geht');
});

test('nouns get a case × number table; adjectives only comparative / superlative', () => {
  const haus = getEntryExtras('Haus', 'noun', 'de').forms;
  assert.equal(haus.kind, 'declension');
  const row = (c) => haus.rows.find(r => r.case === c);
  assert.deepEqual([row('nominative').singular, row('nominative').plural], ['Haus', 'Häuser']);
  assert.equal(row('genitive').singular, 'Hauses');
  assert.equal(row('dative').singular, 'Haus / Hause');
  assert.equal(row('dative').plural, 'Häusern');

  const gut = getEntryExtras('gut', 'adj', 'de').forms;
  assert.deepEqual(gut, { kind: 'inflection', items: [{ label: '比較級', form: 'besser' }, { label: '最高級', form: 'am besten' }] });
});

test('external links point to German dictionaries', () => {
  assert.deepEqual(Object.keys(externalLinks('Haus', 'de')), ['wiktionary', 'duden', 'dwds']);
  assert.ok(externalLinks('casa').rae);
});
