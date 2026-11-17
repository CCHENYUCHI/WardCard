// Same rules as client/src/utils/germanSpelling.js (tested in server/germanSpelling.test.js);
// copied because Metro only bundles files inside mobile/. Keep the two in sync.

const ARTICLES = new Set(['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines']);

// Trim, collapse spaces, drop surrounding punctuation; keeps case
export const tidy = (s: string): string => String(s || '')
  .replace(/[¿¡!?.,;:"“”„]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// "das Haus" -> "Haus" (only when something follows the article)
export const dropArticle = (s: string): string => {
  const parts = tidy(s).split(' ');
  return parts.length > 1 && ARTICLES.has(parts[0].toLowerCase()) ? parts.slice(1).join(' ') : tidy(s);
};

// ä -> ae, ö -> oe, ü -> ue, ß -> ss (case kept: Ä -> Ae)
export const transliterate = (s: string): string => String(s || '')
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
  .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
  .replace(/ß/g, 'ss').replace(/ẞ/g, 'SS');

const stripUmlauts = (s: string): string => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss');

const startsUpper = (s: string): boolean => /^\p{Lu}/u.test(s);

/**
 * @param {string} typed what the learner typed
 * @param {string[]} accepted accepted spellings with their original case (word variants, cloze forms)
 * @param {{ isNoun?: boolean }} options
 */
export type SpellingResult = { status: "correct" | "variant" | "wrong"; hint: string; expected: string };

export function checkGermanSpelling(typed: string, accepted: string[], { isNoun = false }: { isNoun?: boolean } = {}): SpellingResult {
  const answer = dropArticle(typed);
  const targets = [...new Set((accepted || []).map(dropArticle).filter(Boolean))];
  const none: SpellingResult = { status: 'wrong', hint: '', expected: targets[0] || '' };
  if (!answer || targets.length === 0) return none;

  const lower = answer.toLowerCase();
  let caseHit: string | null = null;
  for (const target of targets) {
    if (answer === target) return { status: 'correct', hint: '', expected: target };
    if (lower === target.toLowerCase()) {
      // Same letters, different case
      if (!isNoun) return { status: 'correct', hint: '', expected: target };
      caseHit = caseHit || target;
    }
  }
  if (caseHit) {
    return startsUpper(caseHit) && !startsUpper(answer)
      ? { status: 'wrong', hint: '德語名詞字首要大寫', expected: caseHit }
      : { status: 'wrong', hint: '大小寫不對', expected: caseHit };
  }

  // ae / oe / ue / ss instead of ä / ö / ü / ß
  for (const target of targets) {
    if (transliterate(target) === target) continue; // nothing to transliterate
    const same = isNoun
      ? transliterate(answer) === transliterate(target)
      : transliterate(answer).toLowerCase() === transliterate(target).toLowerCase();
    if (same) {
      if (isNoun && !startsUpper(answer) && startsUpper(target)) {
        return { status: 'wrong', hint: '德語名詞字首要大寫', expected: target };
      }
      return { status: 'variant', hint: `可以接受，正式寫法是「${target}」（ä ö ü ß）`, expected: target };
    }
  }

  // Umlaut left out: Hauser for Häuser, schon for schön
  for (const target of targets) {
    if (stripUmlauts(answer).toLowerCase() === stripUmlauts(target).toLowerCase()) {
      return { status: 'wrong', hint: '注意變音符號（ä ö ü ß）', expected: target };
    }
  }
  return none;
}
