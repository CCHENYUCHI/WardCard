const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const { build } = require('./scripts/build-dictionary');
const { cleanForms, pickExamples, pickIpa, cleanEtymologyText, etymologyChain, extractExtras } = require('./dictionaryExtras');
const { groupForms } = require('./forms');
const { setDictionary, getEntryExtras } = require('./dictionary');

// Trimmed copies of real kaikki.org entries
const f = (form, tags, source = 'conjugation') => ({ form, tags: tags.split(' '), source });
const HABLAR = {
  word: 'hablar', pos: 'verb', lang_code: 'es',
  senses: [{ glosses: ['to talk'], examples: [
    { text: 'No me gusta hablar con mis amigos sobre política.', english: "I don't like talking about politics with my friends.", translation: "I don't like talking about politics with my friends." },
    { text: 'Una cita sin traducción.' },
    { text: 'hablar tonteras', english: 'talk nonsense', type: 'quotation' },
    { text: '¿¡Qué hablas!?', english: 'What the hell are you talking about!?' },
    { text: 'Tercer ejemplo.', english: 'Third example.' }
  ] }],
  sounds: [{ ipa: '[aˈβ̞laɾ]' }, { ipa: '/aˈblaɾ/' }, { rhymes: '-aɾ' }],
  forms: [
    { form: 'hablo', tags: ['first-person', 'present', 'singular'] },
    { form: 'no-table-tags', tags: ['table-tags'], source: 'conjugation' },
    { form: 'es-conj', tags: ['inflection-template'], source: 'conjugation' },
    f('hablar', 'infinitive'), f('hablando', 'gerund'),
    f('hablado', 'masculine participle past singular'), f('hablada', 'feminine participle past singular'),
    f('hablados', 'masculine participle past plural'), f('habladas', 'feminine participle past plural'),
    f('hablo', 'first-person indicative present singular'), f('hablas', 'indicative informal present second-person singular'),
    f('hablás', 'indicative informal present second-person singular vos-form'), f('habla', 'indicative present singular third-person'),
    f('hablamos', 'first-person indicative plural present'), f('habláis', 'indicative plural present second-person'),
    f('hablan', 'indicative plural present third-person'),
    f('hablaba', 'first-person imperfect indicative singular'),
    f('hablé', 'first-person indicative preterite singular'), f('hablamos', 'first-person indicative plural preterite'),
    f('hable', 'first-person present singular subjunctive'), f('hablase', 'first-person imperfect imperfect-se singular subjunctive'),
    f('habla', 'imperative informal second-person singular'), f('hable', 'formal imperative second-person-semantically singular third-person'),
    f('hable', 'imperative singular third-person'), f('hables', 'imperative negative second-person singular'),
    f('hablarme', 'combined-form dative infinitive object-first-person object-singular'),
    f('hablarse', 'infinitive singular third-person')
  ],
  etymology_text: 'From Old Spanish fablar, from Latin fābulārī (“chat, converse”).',
  etymology_templates: [
    { name: 'inh', args: { 1: 'es', 2: 'osp', 3: 'fablar' } }, { name: 'inh+', args: { 1: 'es', 2: 'osp', 3: 'fablar' } },
    { name: 'der', args: { 1: 'es', 2: 'la', 3: 'fabulor', 4: 'fābulārī' } }
  ]
};
const AZUL = {
  word: 'azul', pos: 'adj', lang_code: 'es', senses: [{ glosses: ['blue'] }],
  forms: [{ form: 'azules', tags: ['feminine', 'masculine', 'plural'] }],
  etymology_text: 'Etymology tree\nProto-Indo-European *ǵʰelh₃-\nClassical Persian لاژورد (Lāžvard)\nSpanish azul\nInherited from Old Spanish azur, from an Andalusian Arabic lāzūrd. Cognate with English azure.',
  etymology_templates: [
    { name: 'etymon', args: { 1: 'es', 2: ':inh', 3: 'osp:azur<id:blue>' } },
    { name: 'der', args: { 1: 'es', 2: 'ar', 3: 'لَازُوَرْد' } }, { name: 'cog', args: { 1: 'en', 2: 'azure' } }
  ]
};
const BONITO = {
  word: 'bonito', pos: 'adj', lang_code: 'es', senses: [{ glosses: ['pretty'] }],
  forms: [{ form: 'bonita', tags: ['feminine'] }, { form: 'bonitos', tags: ['masculine', 'plural'] }, { form: 'bonitas', tags: ['feminine', 'plural'] }, { form: 'bonitillo', tags: ['diminutive'] }, { form: 'bonitico', tags: ['alternative', 'diminutive'] }],
  etymology_text: 'From bueno (“good”) + -ito (diminutive suffix).',
  etymology_templates: [{ name: 'ety', args: { 1: 'es', 2: ':af', 3: 'bueno<t:good>', 4: '-ito<pos:diminutive suffix>' } }]
};
const FELICIDAD = {
  word: 'feliz', pos: 'adj', lang_code: 'es', senses: [{ glosses: ['happy'] }],
  etymology_templates: [{ name: 'ety', args: { 1: 'es', 2: ':bor', 3: 'la:felix<alt:fēlīcem>' } }]
};

test('cleanForms keeps the conjugation table and drops clitics, -se subjunctive and table markers', () => {
  const forms = cleanForms(HABLAR.forms);
  const words = forms.map(([form]) => form);
  assert.ok(words.includes('hablaba') && words.includes('hablé'));
  assert.ok(!words.includes('hablarme') && !words.includes('hablase') && !words.includes('no-table-tags') && !words.includes('es-conj'));
  assert.ok(!words.includes('hablarse'), 'pronominal infinitive with person tags is dropped');
  assert.equal(forms.filter(([form, tags]) => form === 'hablo' && tags === 'first-person indicative present singular').length, 1);
  assert.ok(!forms.some(([, tags]) => tags === 'first-person present singular'), 'head-line duplicate with fewer tags is dropped');
});

test('cleanForms keeps noun and adjective inflections but not alternative spellings', () => {
  assert.deepEqual(cleanForms(BONITO.forms).map(([form]) => form), ['bonita', 'bonitos', 'bonitas', 'bonitillo']);
});

test('pickExamples keeps up to two sentences that have an English translation, never quotations', () => {
  assert.deepEqual(pickExamples(HABLAR.senses), [
    ['No me gusta hablar con mis amigos sobre política.', "I don't like talking about politics with my friends."],
    ['¿¡Qué hablas!?', 'What the hell are you talking about!?']
  ]);
});

test('pickIpa prefers the phonemic transcription', () => {
  assert.equal(pickIpa(HABLAR.sounds), '/aˈblaɾ/');
  assert.equal(pickIpa([{ rhymes: '-a' }]), '');
});

test('cleanEtymologyText drops the family-tree dump and clips long text', () => {
  assert.match(cleanEtymologyText(AZUL.etymology_text), /^Inherited from Old Spanish azur/);
  assert.ok(cleanEtymologyText('From '.padEnd(2000, 'x')).length <= 600);
});

test('etymologyChain reads inh / der / etymon / ety templates and dedupes', () => {
  assert.deepEqual(etymologyChain(HABLAR.etymology_templates), [['osp', 'fablar', 'inh'], ['la', 'fabulor', 'der']]);
  assert.deepEqual(etymologyChain(AZUL.etymology_templates), [['osp', 'azur', 'inh'], ['ar', 'لَازُوَرْد', 'der']]);
  assert.deepEqual(etymologyChain(BONITO.etymology_templates), [['es', 'bueno', 'af'], ['es', '-ito', 'af']]);
  assert.deepEqual(etymologyChain(FELICIDAD.etymology_templates), [['la', 'fēlīcem', 'bor']]);
});

test('groupForms builds a conjugation table with persons, vos and a formal imperative', () => {
  const grouped = groupForms('verb', cleanForms(HABLAR.forms));
  assert.equal(grouped.kind, 'verb');
  assert.deepEqual(grouped.nonfinite.map(n => [n.key, n.forms]), [['infinitive', ['hablar']], ['gerund', ['hablando']], ['participle', ['hablado', 'hablada', 'hablados', 'habladas']]]);
  const present = grouped.tables.find(t => t.mood === 'indicative' && t.tense === 'present');
  assert.deepEqual(present.rows.map(r => [r.person, r.form]), [
    ['yo', 'hablo'], ['tú', 'hablas'], ['vos', 'hablás'], ['él / ella / usted', 'habla'], ['nosotros', 'hablamos'], ['vosotros', 'habláis'], ['ellos / ellas / ustedes', 'hablan']
  ]);
  const imperfect = grouped.tables.find(t => t.mood === 'indicative' && t.tense === 'imperfect');
  assert.deepEqual(imperfect.rows.map(r => r.form), ['hablaba']);
  const preterite = grouped.tables.find(t => t.tense === 'preterite');
  assert.deepEqual(preterite.rows.map(r => r.form), ['hablé', 'hablamos']);
  const affirmative = grouped.tables.find(t => t.mood === 'imperative' && t.tense === 'affirmative');
  assert.deepEqual(affirmative.rows.map(r => [r.person, r.form]), [['tú', 'habla'], ['él / ella / usted', 'hable']]);
  assert.deepEqual(grouped.tables.find(t => t.tense === 'negative').rows.map(r => r.form), ['hables']);
});

test('groupForms labels noun and adjective inflections in Chinese', () => {
  assert.deepEqual(groupForms('adj', cleanForms(BONITO.forms)).items, [
    { label: '陰性', form: 'bonita' }, { label: '陽性複數', form: 'bonitos' }, { label: '陰性複數', form: 'bonitas' }, { label: '指小詞', form: 'bonitillo' }
  ]);
  assert.deepEqual(groupForms('adj', cleanForms(AZUL.forms)).items, [{ label: '陰陽性複數', form: 'azules' }]);
  assert.equal(groupForms('noun', []), null);
});

test('extractExtras returns null parts when kaikki has nothing', () => {
  assert.deepEqual(extractExtras({ word: 'x', senses: [{ glosses: ['y'] }] }), { ipa: '', forms: null, examples: null, etymology: null });
});

let tmpDir;
test.before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dict-extras-'));
  const input = path.join(tmpDir, 'es.jsonl');
  fs.writeFileSync(input, [HABLAR, AZUL, BONITO, FELICIDAD, { word: 'hablamos', pos: 'verb', lang_code: 'es', senses: [{ glosses: ['first-person plural present indicative of hablar'], form_of: [{ word: 'hablar' }] }] }].map(e => JSON.stringify(e)).join('\n'));
  const out = path.join(tmpDir, 'es-en.sqlite');
  await build(input, out);
  setDictionary(new DatabaseSync(out, { readOnly: true }));
});
test.after(() => {
  setDictionary(null);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('getEntryExtras reads ipa, grouped forms, examples and etymology from a v2 dictionary', () => {
  const verb = getEntryExtras('hablar', 'verb');
  assert.equal(verb.ipa, '/aˈblaɾ/');
  assert.equal(verb.forms.kind, 'verb');
  assert.equal(verb.examples.length, 2);
  assert.deepEqual(verb.examples[0], { es: 'No me gusta hablar con mis amigos sobre política.', en: "I don't like talking about politics with my friends." });
  assert.equal(verb.etymology.text, 'From Old Spanish fablar, from Latin fābulārī (“chat, converse”).');
  assert.deepEqual(verb.etymology.chain.map(c => [c.lang_zh, c.word]), [['古西班牙語', 'fablar'], ['拉丁語', 'fabulor']]);
  const adj = getEntryExtras('azul', 'adj');
  assert.equal(adj.examples, null);
  assert.match(adj.etymology.text, /^Inherited from Old Spanish azur/);
});

test('inflected-form rows (no meanings of their own) get no extras', () => {
  const form = getEntryExtras('hablamos', 'verb');
  assert.equal(form.forms, null);
  assert.equal(form.etymology, null);
});

test('getEntryExtras treats a v1 dictionary (no extra tables, no ipa column) as having no extras', () => {
  const v1 = new DatabaseSync(':memory:');
  v1.exec("CREATE TABLE entries (word TEXT, word_norm TEXT, pos TEXT, gender TEXT, glosses TEXT, form_of TEXT); INSERT INTO entries VALUES ('hablar','hablar','verb','','[\"to talk\"]',NULL)");
  setDictionary(v1);
  assert.deepEqual(getEntryExtras('hablar', 'verb'), { ipa: '', forms: null, examples: null, etymology: null });
  setDictionary(null);
  assert.deepEqual(getEntryExtras('hablar', 'verb'), { ipa: '', forms: null, examples: null, etymology: null });
});
