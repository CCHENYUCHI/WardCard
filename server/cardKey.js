// Which card a (word, article) pair is. A card is keyed on its word AND its article, so nouns whose meaning
// changes with the article are two cards: el orden (order, sequence) / la orden (command),
// der See (lake) / die See (sea). A side without an article (verbs, or a noun typed without one) matches
// the card of that word, so importing "costumbre" still updates "la costumbre".

const norm = (article) => String(article || '').trim().toLowerCase();

/**
 * @param {{word: string, article?: string}[]} rows cards with the same word
 * @param {string} article incoming article ('' when none)
 * @returns the matching row, or undefined when this is a new card
 */
function pickByArticle(rows, article) {
  const a = norm(article);
  return rows.find(r => norm(r.article) === a)
    || (a === '' ? rows.find(r => norm(r.article) === '') || rows[0] : rows.find(r => norm(r.article) === ''));
}

/** Existing card for this word + article, or undefined */
function findCardByKey(db, userId, lang, word, article) {
  const rows = db.prepare('SELECT id, article, lifecycle_status FROM cards WHERE user_id = ? AND lang = ? AND word = ? ORDER BY id')
    .all(userId, lang, word);
  return pickByArticle(rows, article);
}

/** Another card (not `id`) that already is this word + article exactly */
function findKeyConflict(db, userId, lang, word, article, id) {
  return db.prepare("SELECT id FROM cards WHERE user_id = ? AND lang = ? AND word = ? AND COALESCE(article, '') = ? AND id != ?")
    .get(userId, lang, word, norm(article), id);
}

module.exports = { pickByArticle, findCardByKey, findKeyConflict, normArticle: norm };
