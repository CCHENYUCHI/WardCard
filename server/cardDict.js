// Link between a user's card and the offline dictionary (es-en.sqlite).
// A card stores `dict_lemma` + `dict_pos` (never a rowid: rowids change whenever the dictionary is rebuilt).
//   dict_lemma NULL  -> not looked up yet
//   dict_lemma ''    -> looked up, the dictionary has no matching entry
// Linked cards get their gender / part of speech / English meaning from the dictionary when they are read;
// the card's own columns stay as the fallback for phrases, made-up words and installs without a dictionary.
const { getDict, dictionaryHasEntries, POS_MAP, parseJson } = require('./dictionary');
const { normalizeWord, splitArticle } = require('./cardUtils');

// App part-of-speech labels -> the wiktextract pos values they come from
const WIKT_POS_BY_APP_POS = {};
for (const [wikt, app] of Object.entries(POS_MAP)) (WIKT_POS_BY_APP_POS[app] ||= []).push(wikt);
const GENDER_BY_DICT = { m: 'masculino', f: 'femenino' };
const ARTICLE_BY_DICT = { m: 'el', f: 'la' };
const LINK_BATCH = 500;

// "el profesor / la profesora", "bonito/a", "niño(a)" -> "profesor", "bonito", "niño"
function primarySpelling(word) {
  return splitArticle(String(word || '')).word.split(/[/,(]/)[0].trim().toLowerCase();
}

/**
 * The dictionary lemma + pos a card points to, or null when there is no safe match.
 * @param {string} word the card's word (may carry an article or gender endings)
 * @param {string} [appPos] the card's part_of_speech ('verbo', 'sustantivo', …)
 * @returns {{ lemma: string, pos: string } | null}
 */
function resolveCardLink(word, appPos = '') {
  const dict = getDict();
  if (!dict) return null;
  const primary = primarySpelling(word);
  if (!primary) return null;
  const find = (spelling) => {
    const rows = dict.prepare("SELECT word, pos FROM entries WHERE word_norm = ? AND glosses != '[]' LIMIT 30").all(normalizeWord(spelling));
    const exact = rows.filter(r => r.word.toLowerCase() === spelling);
    if (exact.length) return exact;
    const spellings = new Set(rows.map(r => r.word.toLowerCase()));
    return spellings.size === 1 ? rows : []; // "arbol" for árbol is fine, "ano" for año / ano is ambiguous
  };
  let rows = find(primary);
  // acostumbrarse: use the base verb when the dictionary has no entry for the reflexive form
  if (rows.length === 0 && /[aei]rse$/.test(primary)) rows = find(primary.slice(0, -2));
  if (rows.length === 0) return null;
  const wanted = WIKT_POS_BY_APP_POS[appPos] || [];
  const byPos = rows.filter(r => wanted.includes(r.pos));
  const pick = byPos[0] || (new Set(rows.map(r => r.pos)).size === 1 ? rows[0] : null);
  return pick ? { lemma: pick.word, pos: pick.pos } : null;
}

/** Look one card up and store the result ('' when nothing matches). No-op without a dictionary. */
function linkCard(db, card) {
  if (!dictionaryHasEntries()) return null;
  const link = resolveCardLink(card.word, card.part_of_speech);
  db.prepare('UPDATE cards SET dict_lemma = ?, dict_pos = ? WHERE id = ?').run(link?.lemma || '', link?.pos || '', card.id);
  return link;
}

/** Link every card that has not been looked up yet (or all cards with `relink`). Returns how many were linked. */
function linkPendingCards(db, { relink = false } = {}) {
  if (!dictionaryHasEntries()) return { checked: 0, linked: 0 };
  let checked = 0;
  let linked = 0;
  const select = db.prepare(`SELECT id, word, part_of_speech FROM cards ${relink ? 'WHERE id > ?' : 'WHERE dict_lemma IS NULL AND id > ?'} ORDER BY id LIMIT ${LINK_BATCH}`);
  let lastId = 0;
  for (;;) {
    const batch = select.all(lastId);
    if (batch.length === 0) break;
    db.exec('BEGIN');
    try {
      for (const card of batch) {
        if (linkCard(db, card)) linked++;
        checked++;
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
    lastId = batch[batch.length - 1].id;
  }
  return { checked, linked };
}

/** Dictionary fields of the entry a card is linked to (cached per call of enrichCards) */
function entryFields(lemma, pos) {
  const row = getDict()?.prepare("SELECT gender, glosses FROM entries WHERE word_norm = ? AND word = ? AND pos = ? AND glosses != '[]' LIMIT 1")
    .get(normalizeWord(lemma), lemma, pos);
  return row ? { gender: row.gender, glosses: parseJson(row.glosses, []) } : null;
}

/** Replace a linked card's gender / part of speech / English meaning with the dictionary's; leave the rest alone. */
function enrichCards(cards) {
  if (!Array.isArray(cards) || !getDict()) return cards;
  const cache = new Map();
  return cards.map(card => {
    if (!card.dict_lemma) return card;
    const key = `${card.dict_lemma}|${card.dict_pos}`;
    if (!cache.has(key)) cache.set(key, entryFields(card.dict_lemma, card.dict_pos));
    const entry = cache.get(key);
    if (!entry) return card;
    const out = { ...card };
    const appPos = POS_MAP[card.dict_pos];
    if (appPos) out.part_of_speech = appPos;
    if (appPos === 'sustantivo' && GENDER_BY_DICT[entry.gender]) {
      out.gender = GENDER_BY_DICT[entry.gender];
      if (!out.article) out.article = ARTICLE_BY_DICT[entry.gender];
    }
    if (!out.english_translation && entry.glosses.length) out.english_translation = entry.glosses.slice(0, 2).join('; ');
    return out;
  });
}

module.exports = { resolveCardLink, linkCard, linkPendingCards, enrichCards, primarySpelling };
