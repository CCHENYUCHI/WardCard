// German spelling rules of the study session (client/src/utils/germanSpelling.js, an ES module)
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { pathToFileURL } = require('url');

let G;
test.before(async () => {
  G = await import(pathToFileURL(path.join(__dirname, '../client/src/utils/germanSpelling.js')).href);
});

const check = (typed, accepted, isNoun) => G.checkGermanSpelling(typed, accepted, { isNoun });

test('exact spelling is correct, with or without the article and punctuation', () => {
  assert.equal(check('Haus', ['Haus'], true).status, 'correct');
  assert.equal(check('das Haus', ['Haus'], true).status, 'correct');
  assert.equal(check(' Haus. ', ['das Haus'], true).status, 'correct');
});

test('nouns must be capitalised; other words ignore case', () => {
  const noun = check('haus', ['Haus'], true);
  assert.equal(noun.status, 'wrong');
  assert.match(noun.hint, /大寫/);
  assert.equal(noun.expected, 'Haus');
  assert.equal(check('das haus', ['Haus'], true).status, 'wrong');
  assert.equal(check('Gehen', ['gehen'], false).status, 'correct'); // sentence-initial cloze answer
  assert.equal(check('GEHEN', ['gehen'], false).status, 'correct');
});

test('ae / oe / ue / ss are accepted as a variant with the proper spelling as a hint', () => {
  const r = check('Haeuser', ['Häuser'], true);
  assert.equal(r.status, 'variant');
  assert.match(r.hint, /Häuser/);
  assert.equal(check('Strasse', ['Straße'], true).status, 'variant');
  assert.equal(check('schoen', ['schön'], false).status, 'variant');
  assert.equal(check('Oel', ['Öl'], true).status, 'variant');
  // Lower-case noun in the variant spelling is still a capitalisation error
  assert.equal(check('strasse', ['Straße'], true).status, 'wrong');
  // A word that really is spelled with ss is simply correct
  assert.equal(check('dass', ['dass'], false).status, 'correct');
});

test('a missing umlaut is wrong with an umlaut hint', () => {
  const r = check('Hauser', ['Häuser'], true);
  assert.equal(r.status, 'wrong');
  assert.match(r.hint, /變音/);
  assert.equal(check('schon', ['schön'], false).status, 'wrong');
});

test('unrelated answers are wrong without a hint; several accepted forms are all checked', () => {
  assert.deepEqual(check('Baum', ['Haus'], true), { status: 'wrong', hint: '', expected: 'Haus' });
  assert.equal(check('ging', ['gehen', 'ging'], false).status, 'correct');
  assert.equal(check('', ['Haus'], true).status, 'wrong');
});
