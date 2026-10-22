// Run with: npm test  (node --test, no extra packages)
const test = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');

const H = require('./lookupHistory');

function makeDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER, word TEXT, translation TEXT DEFAULT '', lifecycle_status TEXT DEFAULT 'active'
    );
  `);
  db.exec(H.LOOKUP_HISTORY_SCHEMA);
  return db;
}

test('the same word is one row, counted again regardless of case and accents', () => {
  const db = makeDb();
  H.recordLookup(db, { userId: 1, query: 'Árbol', lemma: 'árbol', translation: '樹' });
  db.prepare("UPDATE lookup_history SET first_at = '2026-01-01 00:00:00', last_at = '2026-01-01 00:00:00'").run();
  H.recordLookup(db, { userId: 1, query: 'arbol', source: 'tap' });

  const { items, total } = H.listLookups(db, 1);
  assert.equal(total, 1);
  assert.equal(items[0].lookup_count, 2);
  assert.equal(items[0].query, 'arbol');
  assert.equal(items[0].last_source, 'tap');
  assert.equal(items[0].first_at, '2026-01-01 00:00:00');
  assert.notEqual(items[0].last_at, '2026-01-01 00:00:00');
});

test('a later lookup without a meaning keeps the earlier lemma and meaning', () => {
  const db = makeDb();
  H.recordLookup(db, { userId: 1, query: 'fui', lemma: 'ir', translation: '去' });
  H.recordLookup(db, { userId: 1, query: 'fui' });
  const [row] = H.listLookups(db, 1).items;
  assert.equal(row.lemma, 'ir');
  assert.equal(row.translation, '去');
});

test('setLookupTranslation only fills an empty meaning', () => {
  const db = makeDb();
  H.recordLookup(db, { userId: 1, query: 'gato' });
  H.recordLookup(db, { userId: 1, query: 'perro', translation: '狗' });
  H.setLookupTranslation(db, 1, 'Gato', '貓');
  H.setLookupTranslation(db, 1, 'perro', '犬');
  const byQuery = Object.fromEntries(H.listLookups(db, 1).items.map(r => [r.query, r.translation]));
  assert.deepEqual(byQuery, { gato: '貓', perro: '狗' });
});

test('blank or punctuation-only queries are not recorded; unknown sources fall back', () => {
  const db = makeDb();
  H.recordLookup(db, { userId: 1, query: '  ' });
  H.recordLookup(db, { userId: 1, query: '¿?' });
  H.recordLookup(db, { userId: 1, query: '房子', source: 'weird' });
  const { items } = H.listLookups(db, 1);
  assert.equal(items.length, 1);
  assert.equal(items[0].query, '房子');
  assert.equal(items[0].last_source, 'dictionary');
});

test('listLookups pages, searches (escaping % and _) and sorts by count', () => {
  const db = makeDb();
  for (let i = 0; i < 5; i++) H.recordLookup(db, { userId: 1, query: `w${i}` });
  H.recordLookup(db, { userId: 1, query: 'w2' });
  H.recordLookup(db, { userId: 1, query: 'w2' });
  H.recordLookup(db, { userId: 1, query: 'w4' });
  H.recordLookup(db, { userId: 1, query: '100%_real', translation: '真的' });

  const page1 = H.listLookups(db, 1, { limit: 4 });
  assert.equal(page1.items.length, 4);
  assert.equal(page1.hasMore, true);
  assert.equal(page1.total, 6);
  const page2 = H.listLookups(db, 1, { limit: 4, offset: 4 });
  assert.equal(page2.items.length, 2);
  assert.equal(page2.hasMore, false);

  assert.deepEqual(H.listLookups(db, 1, { sort: 'count' }).items.slice(0, 2).map(r => r.query), ['w2', 'w4']);
  assert.equal(H.listLookups(db, 1, { q: '%' }).total, 1);
  assert.equal(H.listLookups(db, 1, { q: 'w_' }).total, 0);
  assert.equal(H.listLookups(db, 1, { q: '真' }).items[0].query, '100%_real');
});

test('listLookups shows the card under the lemma or the typed word, only for the same user', () => {
  const db = makeDb();
  db.prepare("INSERT INTO cards (user_id, word, lifecycle_status) VALUES (1, 'ir', 'inbox'), (1, 'casa', 'active'), (2, 'mesa', 'active')").run();
  H.recordLookup(db, { userId: 1, query: 'fui', lemma: 'ir' });
  H.recordLookup(db, { userId: 1, query: 'casa' });
  H.recordLookup(db, { userId: 1, query: 'mesa', lemma: 'mesa' });

  const byQuery = Object.fromEntries(H.listLookups(db, 1).items.map(r => [r.query, r.lifecycle_status]));
  assert.deepEqual(byQuery, { fui: 'inbox', casa: 'active', mesa: null });
});

test("a word looked up before it was added shows the card's meaning", () => {
  const db = makeDb();
  H.recordLookup(db, { userId: 1, query: 'casa' });
  H.recordLookup(db, { userId: 1, query: 'perro', translation: '狗' });
  db.prepare("INSERT INTO cards (user_id, word, translation) VALUES (1, 'casa', '房子'), (1, 'perro', '犬')").run();
  const byQuery = Object.fromEntries(H.listLookups(db, 1).items.map(r => [r.query, r.translation]));
  assert.deepEqual(byQuery, { casa: '房子', perro: '狗' });
});

test('users only see, delete and clear their own history', () => {
  const db = makeDb();
  H.recordLookup(db, { userId: 1, query: 'hola' });
  H.recordLookup(db, { userId: 2, query: 'hola' });
  H.recordLookup(db, { userId: 2, query: 'adiós' });

  const [mine] = H.listLookups(db, 1).items;
  assert.equal(H.listLookups(db, 1).total, 1);
  assert.equal(H.deleteLookup(db, 2, mine.id), false);
  assert.equal(H.deleteLookup(db, 1, mine.id), true);
  assert.equal(H.listLookups(db, 1).total, 0);

  H.recordLookup(db, { userId: 1, query: 'gracias' });
  assert.equal(H.clearLookups(db, 2), 2);
  assert.equal(H.listLookups(db, 2).total, 0);
  assert.equal(H.listLookups(db, 1).total, 1);
});
