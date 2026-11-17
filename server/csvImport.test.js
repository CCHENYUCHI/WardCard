const test = require('node:test');
const assert = require('node:assert/strict');
const { parse } = require('csv-parse/sync');
const { csvRecordToCard, templateCsv } = require('./csvImport');

const rows = (csv) => parse(csv.replace(/^﻿/, ''), { columns: true, skip_empty_lines: true, trim: true });

test('each template parses back into a card of its language', () => {
  const [es] = rows(templateCsv('es'));
  assert.deepEqual(
    (({ lang, word, article, gender, example_es }) => ({ lang, word, article, gender, example_es }))(csvRecordToCard(es, 'de')),
    { lang: 'es', word: 'costumbre', article: 'la', gender: 'femenino', example_es: 'Es una costumbre típica en España.' }
  );
  const [de] = rows(templateCsv('de'));
  const card = csvRecordToCard(de, 'es');
  assert.equal(card.lang, 'de');
  assert.equal(card.word, 'Haus');
  assert.equal(card.article, 'das');
  assert.equal(card.gender, 'neutro');
  assert.equal(card.example_es, 'Das Haus ist sehr alt.');
  assert.match(card.notes, /Häuser/);
  assert.ok(templateCsv('de').startsWith('﻿German,'));
  assert.ok(templateCsv('xx').startsWith('﻿Spanish,')); // unknown language: Spanish template
});

test('language comes from lang, then the German / Spanish header, then the deck shown', () => {
  assert.equal(csvRecordToCard({ word: 'Tisch', lang: 'de' }, 'es').lang, 'de');
  assert.equal(csvRecordToCard({ German: 'Tisch' }, 'es').lang, 'de');
  assert.equal(csvRecordToCard({ Spanish: 'mesa' }, 'de').lang, 'es');
  assert.equal(csvRecordToCard({ word: 'Tisch' }, 'de').lang, 'de');
  assert.equal(csvRecordToCard({ word: 'mesa', lang: 'xx' }, 'de').lang, 'es');
  assert.equal(csvRecordToCard({ Chinese: '桌子' }, 'de'), null);
});

test('gender from the column (any alias) or else from the article', () => {
  assert.equal(csvRecordToCard({ German: 'der Tisch' }).gender, 'masculino');
  assert.equal(csvRecordToCard({ German: 'die Frau' }).gender, 'femenino');
  assert.equal(csvRecordToCard({ German: 'Kind', Article: 'das' }).gender, 'neutro');
  assert.equal(csvRecordToCard({ German: 'Kind', Gender: 'n' }).gender, 'neutro');
  assert.equal(csvRecordToCard({ Spanish: 'el libro' }).gender, 'masculino');
  // Spanish has no neuter: an invalid gender falls back to none
  assert.equal(csvRecordToCard({ Spanish: 'libro', Gender: 'neutro' }).gender, 'none');
  assert.equal(csvRecordToCard({ German: 'gehen' }).gender, 'none');
});

test('old Spanish headers still work and the category defaults', () => {
  const card = csvRecordToCard({ Spanish: 'casa', Chinese: '房子', Ejemplo: 'Mi casa.', Definición: 'vivienda', Note_EN: 'n' }, 'es');
  assert.deepEqual(
    [card.translation, card.example_es, card.definition_es, card.notes, card.category],
    ['房子', 'Mi casa.', 'vivienda', 'n', '日常生活']
  );
});
