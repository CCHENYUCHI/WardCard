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

module.exports = { ARTICLES, splitArticle };
