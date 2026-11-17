// Read-time grouping of the stored forms ([[form, "tag tag"]]) into something a card can show:
// a conjugation table for verbs, a short list (feminine, plural, diminutive…) for everything else.

const PERSONS = ['yo', 'tú', 'vos', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ellas / ustedes'];
const TENSES = {
  indicative: { label: '直陳式', tenses: [['present', '現在式'], ['imperfect', '過去未完成式'], ['preterite', '簡單過去式'], ['future', '未來式'], ['conditional', '條件式']] },
  subjunctive: { label: '虛擬式', tenses: [['present', '現在式'], ['imperfect', '過去未完成式'], ['future', '未來式']] },
  imperative: { label: '命令式', tenses: [['affirmative', '肯定'], ['negative', '否定']] }
};
const NONFINITE = [['infinitive', '不定式'], ['gerund', '副動詞'], ['participle', '過去分詞']];
const INFLECTION_LABELS = {
  plural: '複數', feminine: '陰性', masculine: '陽性', 'masculine plural': '陽性複數', 'feminine plural': '陰性複數',
  'feminine masculine plural': '陰陽性複數', diminutive: '指小詞', augmentative: '指大詞', 'feminine diminutive': '陰性指小詞',
  comparative: '比較級', superlative: '最高級'
};

const tagSet = (tags) => new Set(String(tags).split(' ').filter(Boolean));

// 0..6 index into PERSONS, or -1
function personIndex(t, mood) {
  const plural = t.has('plural');
  if (t.has('vos-form')) return 2;
  if (t.has('first-person')) return plural ? 4 : 0;
  if (mood === 'imperative') {
    if (t.has('formal') || t.has('second-person-semantically')) return plural ? 6 : 3;
    if (t.has('third-person')) return -1; // repeats the formal form
    return t.has('second-person') ? (plural ? 5 : 1) : -1;
  }
  if (t.has('second-person')) return plural ? 5 : 1;
  if (t.has('third-person')) return plural ? 6 : 3;
  return -1;
}

function groupVerb(forms) {
  const nonfinite = [];
  for (const [key, label] of NONFINITE) {
    const found = forms.filter(([, tags]) => tagSet(tags).has(key) && !(key !== 'participle' && tagSet(tags).size > 1));
    const words = [...new Set(found.map(([form]) => form))];
    if (words.length) nonfinite.push({ key, label, forms: words });
  }
  const tables = [];
  for (const [mood, { label: moodLabel, tenses }] of Object.entries(TENSES)) {
    for (const [tense, tenseLabel] of tenses) {
      const rows = PERSONS.map(person => ({ person, form: '' }));
      let any = false;
      for (const [form, tags] of forms) {
        const t = tagSet(tags);
        if (!t.has(mood)) continue;
        const isNegative = t.has('negative');
        const inTense = mood === 'imperative' ? (tense === 'negative') === isNegative : t.has(tense) && !(tense === 'present' && t.has('imperfect'));
        if (!inTense || (mood !== 'imperative' && t.has('participle'))) continue;
        const i = personIndex(t, mood);
        if (i < 0 || rows[i].form) continue;
        rows[i].form = form;
        any = true;
      }
      if (any) tables.push({ mood, moodLabel, tense, tenseLabel, rows: rows.filter(r => r.form) });
    }
  }
  return { kind: 'verb', nonfinite, tables };
}

// ---------- German ----------
const DE_PERSONS = ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie'];
// [mood, mood label, tense key, tense label, test(tags)]
const DE_TABLES = [
  ['indicative', '直陳式 Indikativ', 'present', '現在式 Präsens', t => t.has('indicative') && t.has('present') && !t.has('multiword-construction')],
  ['indicative', '直陳式 Indikativ', 'preterite', '過去式 Präteritum', t => t.has('indicative') && t.has('preterite') && !t.has('multiword-construction')],
  ['indicative', '直陳式 Indikativ', 'perfect', '現在完成式 Perfekt', t => t.has('indicative') && t.has('perfect')],
  ['subjunctive', '虛擬式 Konjunktiv', 'subjunctive-i', '一式 Konjunktiv I', t => t.has('subjunctive-i') && !t.has('multiword-construction')],
  ['subjunctive', '虛擬式 Konjunktiv', 'subjunctive-ii', '二式 Konjunktiv II', t => t.has('subjunctive-ii') && !t.has('multiword-construction')],
  ['imperative', '命令式 Imperativ', 'imperative', '命令式', t => t.has('imperative')]
];
const DE_NONFINITE = [
  ['infinitive', '不定式', t => t.has('infinitive') && t.size === 1],
  ['participle-present', '第一分詞', t => t.has('participle') && t.has('present')],
  ['participle-past', '第二分詞', t => t.has('participle') && t.has('past')],
  ['auxiliary', '完成式助動詞', t => t.has('auxiliary')]
];
const DE_CASES = [['nominative', '主格 Nominativ'], ['genitive', '屬格 Genitiv'], ['dative', '與格 Dativ'], ['accusative', '受格 Akkusativ']];

function dePersonIndex(t) {
  const plural = t.has('plural');
  if (t.has('first-person')) return plural ? 3 : 0;
  if (t.has('second-person')) return plural ? 4 : 1;
  if (t.has('third-person')) return plural ? 5 : 2;
  return -1;
}

function groupGermanVerb(forms) {
  const nonfinite = [];
  for (const [key, label, test] of DE_NONFINITE) {
    const words = [...new Set(forms.filter(([, tags]) => test(tagSet(tags))).map(([form]) => form))];
    if (words.length) nonfinite.push({ key, label, forms: words });
  }
  const tables = [];
  for (const [mood, moodLabel, tense, tenseLabel, test] of DE_TABLES) {
    const rows = DE_PERSONS.map(person => ({ person, form: '' }));
    for (const [form, tags] of forms) {
      const t = tagSet(tags);
      if (!test(t)) continue;
      const i = dePersonIndex(t);
      if (i < 0) continue;
      // Imperative "geh / gehe": keep both; elsewhere the first form wins
      if (!rows[i].form) rows[i].form = form;
      else if (mood === 'imperative' && !rows[i].form.split(' / ').includes(form)) rows[i].form += ` / ${form}`;
    }
    const filled = rows.filter(r => r.form);
    if (filled.length) tables.push({ mood, moodLabel, tense, tenseLabel, rows: filled });
  }
  return { kind: 'verb', nonfinite, tables };
}

// Noun declension: case down, singular / plural across ("Haus / Hause" when a cell has two forms)
function groupGermanNoun(forms) {
  const rows = DE_CASES.map(([key, label]) => {
    const cell = (number) => [...new Set(forms.filter(([, tags]) => {
      const t = tagSet(tags);
      return t.has(key) && t.has(number);
    }).map(([form]) => form))].join(' / ');
    return { case: key, label, singular: cell('singular'), plural: cell('plural') };
  }).filter(r => r.singular || r.plural);
  return rows.length ? { kind: 'declension', rows } : null;
}

/**
 * @param {string} pos wiktextract pos ('verb', 'noun', 'adj', …) @param {[string,string][]} forms stored forms
 * @param {string} lang learning language (es | de)
 */
function groupForms(pos, forms, lang = 'es') {
  if (!Array.isArray(forms) || forms.length === 0) return null;
  if (lang === 'de') {
    if (pos === 'verb' && forms.some(([, tags]) => tagSet(tags).has('infinitive'))) return groupGermanVerb(forms);
    if (pos === 'noun' && forms.some(([, tags]) => tagSet(tags).has('nominative'))) return groupGermanNoun(forms);
  }
  if (pos === 'verb' && forms.some(([, tags]) => tagSet(tags).has('infinitive'))) return groupVerb(forms);
  const items = [];
  for (const [form, tags] of forms) {
    const key = [...tagSet(tags)].sort().join(' ');
    const label = INFLECTION_LABELS[tags] || INFLECTION_LABELS[key] || tags;
    if (!items.some(i => i.form === form && i.label === label)) items.push({ label, form });
  }
  return { kind: 'inflection', items };
}

module.exports = { groupForms, PERSONS, DE_PERSONS };
