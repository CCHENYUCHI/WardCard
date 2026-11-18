// Cards are keyed on word + article: el orden / la orden, der See / die See are separate cards,
// while a side without an article still finds the card of that word.
const test = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { pickByArticle, findCardByKey, findKeyConflict, normArticle } = require('./cardKey');

function makeDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE cards (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, lang TEXT NOT NULL DEFAULT 'es',
    word TEXT, article TEXT DEFAULT '', translation TEXT DEFAULT '', lifecycle_status TEXT DEFAULT 'active');
    CREATE UNIQUE INDEX idx_cards_user_lang_word_article ON cards(user_id, lang, word, article);`);
  return db;
}
const add = (db, word, article, translation, lang = 'es') =>
  Number(db.prepare('INSERT INTO cards (user_id, lang, word, article, translation) VALUES (1, ?, ?, ?, ?)').run(lang, word, article, translation).lastInsertRowid);

test('the index allows el orden and la orden side by side, but not two el orden', () => {
  const db = makeDb();
  add(db, 'orden', 'el', '順序');
  add(db, 'orden', 'la', '命令');
  assert.throws(() => add(db, 'orden', 'el', '秩序'), /UNIQUE/);
  // German: der See (lake) / die See (sea)
  add(db, 'See', 'der', '湖', 'de');
  add(db, 'See', 'die', '海', 'de');
});

test('an incoming card finds the card with the same article; a different article is a new card', () => {
  const db = makeDb();
  const el = add(db, 'orden', 'el', '順序');
  assert.equal(findCardByKey(db, 1, 'es', 'orden', 'el').id, el);
  assert.equal(findCardByKey(db, 1, 'es', 'orden', 'la'), undefined);
  const la = add(db, 'orden', 'la', '命令');
  assert.equal(findCardByKey(db, 1, 'es', 'orden', 'la').id, la);
  assert.equal(findCardByKey(db, 1, 'es', 'orden', 'El').id, el); // article case does not matter
});

test('no article on one side matches the card of that word (no duplicate la costumbre / costumbre)', () => {
  const db = makeDb();
  const id = add(db, 'costumbre', 'la', '習俗');
  assert.equal(findCardByKey(db, 1, 'es', 'costumbre', '').id, id);
  const verb = add(db, 'hablar', '', '說');
  assert.equal(findCardByKey(db, 1, 'es', 'hablar', '').id, verb);
  // A card saved without its article gets matched (and later filled in) by "la costumbre"-style input
  const bare = add(db, 'casa', '', '房子');
  assert.equal(findCardByKey(db, 1, 'es', 'casa', 'la').id, bare);
  // Several cards of one word and no article given: prefer the article-less one, else the oldest
  const el = add(db, 'orden', 'el', '順序');
  add(db, 'orden', 'la', '命令');
  assert.equal(findCardByKey(db, 1, 'es', 'orden', '').id, el);
});

test('other languages and users are separate decks', () => {
  const db = makeDb();
  add(db, 'Band', 'das', '帶子', 'de');
  assert.equal(findCardByKey(db, 1, 'es', 'Band', 'das'), undefined);
  assert.equal(findCardByKey(db, 2, 'de', 'Band', 'das'), undefined);
  assert.equal(findCardByKey(db, 1, 'de', 'Band', 'der'), undefined); // der Band (volume) is another word
});

test('an edit conflicts only with another card of the same word and article', () => {
  const db = makeDb();
  const el = add(db, 'orden', 'el', '順序');
  const la = add(db, 'orden', 'la', '命令');
  assert.equal(findKeyConflict(db, 1, 'es', 'orden', 'la', el).id, la); // turning el orden into la orden
  assert.equal(findKeyConflict(db, 1, 'es', 'orden', 'el', el), undefined); // saving itself
  assert.equal(findKeyConflict(db, 1, 'es', 'orden', 'LA ', el).id, la);
  assert.equal(normArticle(' La '), 'la');
  assert.equal(pickByArticle([], 'la'), undefined);
});
