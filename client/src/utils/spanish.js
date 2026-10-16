// Shared Spanish word helpers for the study and quiz views.
// Regexes are Unicode-aware: JS `\b` / `\w` only know ASCII, so they break on á, é, ñ, ü.

const ARTICLES = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas'];

export const stripArticle = (str) => {
  if (!str) return '';
  const trimmed = String(str).trim();
  const [first, ...rest] = trimmed.split(/\s+/);
  if (rest.length > 0 && ARTICLES.includes(first.toLowerCase())) {
    return rest.join(' ');
  }
  return trimmed;
};

export const stripAccents = (str) => (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '');

// Lowercase, trim, collapse spaces and drop surrounding punctuation such as ¿ ¡ . ! ?
export const normalizeAnswer = (str) => (str || '')
  .toLowerCase()
  .replace(/[¿¡!?.,;:"“”]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const feminine = (base) => (base.endsWith('o') ? `${base.slice(0, -1)}a` : `${base}a`);

/**
 * Every spelling we accept for a card's word, normalized.
 * Handles "bonito/a", "niño(a)", "el profesor / la profesora", "alemán, alemana".
 */
export const getAcceptableAnswers = (word) => {
  // Split on the raw text: normalizeAnswer would drop the commas we split on
  const raw = String(word || '').toLowerCase().trim();
  if (!raw) return [];
  const answers = new Set();
  const add = (s) => {
    const n = normalizeAnswer(s);
    if (n) answers.add(n);
  };
  add(raw);
  add(stripArticle(raw));

  const slashParts = raw.split('/').map(p => p.trim()).filter(Boolean);
  if (slashParts.length > 1 && slashParts[1] === 'a') {
    const base = stripArticle(slashParts[0]);
    add(base);
    add(feminine(base));
  } else {
    for (const part of raw.split(/[/,]/).map(p => p.trim()).filter(Boolean)) {
      add(part);
      add(stripArticle(part));
    }
  }

  const parenMatch = raw.match(/^(.*?)\(a\)$/);
  if (parenMatch) {
    const base = stripArticle(parenMatch[1].trim());
    add(base);
    add(feminine(base));
  }

  return [...answers];
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Matches `stem` at the start of a word plus any trailing letters ("problema" -> "problemas")
const wordRegex = (stem) => new RegExp(`(?<!\\p{L})${escapeRegex(stem)}\\p{L}*`, 'giu');

// Candidate stems to look for in a sentence, most specific first
const sentenceStems = (card) => {
  const parts = (card?.word || '')
    .split(/[/,]/)
    .map(p => stripArticle(p.replace(/\(a\)$/, '')).trim())
    .filter(p => p.length >= 2 && p !== 'a');

  const stems = [...parts];
  for (const p of parts) {
    if (p.includes(' ')) continue;
    if (card.part_of_speech === 'verbo') {
      // hablar -> habl (hablamos, habló), acostumbrarse -> acostumbr
      const verbStem = p.replace(/(ar|er|ir|ír)(se)?$/i, '');
      if (verbStem !== p && verbStem.length >= 3) stems.push(verbStem);
    } else if (/[oae]$/i.test(p) && p.length >= (card.part_of_speech === 'adjetivo' ? 4 : 5)) {
      // alto -> alt (alta, altos), grande -> grand (grandes); short nouns skip this (casa would hit casi)
      stems.push(p.slice(0, -1));
    }
  }
  return [...new Set(stems)];
};

/**
 * The actual forms of the card's word that appear in a sentence, e.g. "hablamos" for "hablar".
 * Empty when the word can't be found (irregular forms, missing example).
 */
export const findInflectedForms = (sentence, card) => {
  if (!sentence || !card) return [];
  for (const stem of sentenceStems(card)) {
    const matches = sentence.match(wordRegex(stem));
    if (matches && matches.length > 0) return [...new Set(matches)];
  }
  return [];
};

export const BLANK = '【 ______ 】';

// Replace the card's word in the sentence with a blank (same matching as findInflectedForms)
export const maskSentence = (sentence, card) => {
  const forms = findInflectedForms(sentence, card);
  if (forms.length === 0) return sentence;
  const pattern = new RegExp(
    `(?<!\\p{L})(?:${forms.map(escapeRegex).sort((a, b) => b.length - a.length).join('|')})(?!\\p{L})`,
    'giu'
  );
  return sentence.replace(pattern, BLANK);
};

/**
 * Split a sentence into tappable words and the text between them (spaces, punctuation, BLANK).
 * "¿Vas al árbol?" -> [{text:'¿',isWord:false},{text:'Vas',isWord:true},{text:' ',isWord:false},...]
 */
export const tokenizeSentence = (sentence) => (sentence || '')
  .split(/(\p{L}+)/u)
  .filter(Boolean)
  .map(text => ({ text, isWord: /^\p{L}+$/u.test(text) }));

export const displayWord = (card) => (card?.article ? `${card.article} ${card.word}` : card?.word || '');

/**
 * Pick `count` distractor cards for a multiple-choice question, from the user's own library.
 * Preference: same part of speech + same category > same part of speech > anything else.
 */
export const pickDistractors = (card, pool, count = 3) => {
  if (!card || !Array.isArray(pool)) return [];
  const targetWord = normalizeAnswer(stripArticle(card.word));
  const targetTranslation = normalizeAnswer(card.translation);
  const seen = new Set([normalizeAnswer(displayWord(card))]);

  const candidates = pool.filter(c => (
    c && c.id !== card.id && c.word &&
    normalizeAnswer(stripArticle(c.word)) !== targetWord &&
    normalizeAnswer(c.translation) !== targetTranslation
  ));

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const samePos = candidates.filter(c => c.part_of_speech === card.part_of_speech);
  const tiers = [
    samePos.filter(c => c.category === card.category),
    samePos.filter(c => c.category !== card.category),
    candidates.filter(c => c.part_of_speech !== card.part_of_speech)
  ];

  const picked = [];
  for (const tier of tiers) {
    for (const c of shuffle(tier)) {
      const key = normalizeAnswer(displayWord(c));
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push(c);
      if (picked.length === count) return picked;
    }
  }
  return picked;
};
