const ARTICLES = ['el', 'la', 'los', 'las', 'un', 'una'];

/**
 * Split a leading Spanish article off a word ("el libro" -> { article: 'el', word: 'libro' }).
 * An explicitly provided article always wins over one detected in the word.
 */
function splitArticle(rawWord, rawArticle = '') {
  let word = String(rawWord || '').trim();
  let article = String(rawArticle || '').trim().toLowerCase();

  const parts = word.split(/\s+/);
  if (parts.length > 1 && ARTICLES.includes(parts[0].toLowerCase())) {
    if (!article) article = parts[0].toLowerCase();
    word = parts.slice(1).join(' ');
  }

  return { word, article };
}

/**
 * Lookup key for a Spanish word: lowercase, no accents, no surrounding punctuation.
 * "¿Árbol?" -> "arbol". Note ñ also becomes n, so callers should rank exact matches first.
 */
function normalizeWord(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const feminine = (base) => (base.endsWith('o') ? `${base.slice(0, -1)}a` : `${base}a`);

/**
 * Every spelling a card's word stands for, normalized (server copy of the client's
 * getAcceptableAnswers): "bonito/a", "niño(a)", "el profesor / la profesora", "alemán, alemana".
 */
function cardWordVariants(word) {
  const raw = String(word || '').toLowerCase().trim();
  if (!raw) return [];
  const out = new Set();
  const add = (s) => {
    const n = normalizeWord(splitArticle(s).word);
    if (n) out.add(n);
  };
  add(raw);
  const slashParts = raw.split('/').map(p => p.trim()).filter(Boolean);
  if (slashParts.length > 1 && slashParts[1] === 'a') {
    const base = splitArticle(slashParts[0]).word;
    add(base);
    add(feminine(base));
  } else {
    for (const part of raw.split(/[/,]/).map(p => p.trim()).filter(Boolean)) add(part);
  }
  const paren = raw.match(/^(.*?)\(a\)$/);
  if (paren) {
    const base = splitArticle(paren[1].trim()).word;
    add(base);
    add(feminine(base));
  }
  return [...out];
}

module.exports = { ARTICLES, splitArticle, normalizeWord, cardWordVariants };
