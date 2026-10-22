// Build-time extraction of the extra dictionary data (forms, examples, IPA, etymology) from one kaikki.org entry.
// Everything here is pure so build-dictionary.js and its tests can share it.

// Tags that only describe the table itself, or forms a learner should not see
const DROP_TAGS = new Set([
  'table-tags', 'inflection-template', 'combined-form', 'obsolete', 'archaic', 'dialectal', 'alternative',
  'imperfect-se', 'canonical', 'romanization', 'nonstandard', 'rare', 'misspelling'
]);
const MAX_EXAMPLES = 2;
const MAX_EXAMPLE_CHARS = 160;
const MAX_ETYMOLOGY_CHARS = 600;
const MAX_CHAIN = 8;
const ORIGIN_TEMPLATES = new Set(['inh', 'inh+', 'bor', 'bor+', 'lbor', 'lbor+', 'slbor', 'der', 'der+']);
const AFFIX_TEMPLATES = new Set(['af', 'affix', 'prefix', 'pre', 'suffix', 'suf', 'compound', 'com', 'confix', 'con']);
const PROSE_START = /^(Inherited|Borrowed|From|Learned|Semi-learned|Derived|Univerbation|Clipping|Back-formation|Calque|Compound|Possibly|Probably|Uncertain|Unknown|Of |Deverbal|Coined|Ultimately|Cognate|Compare|Mentioned|Ellipsis|Contraction|Doublet|Blend|Refashioning|Ultimate|Perhaps|Related|Either|Apparently|Likely|Uncertainly|Short|Abbreviation|Variant|Alteration|Diminutive|Augmentative|Formed|Apheresis|Aphetic|Syncope|Metathesis)/;

/**
 * Inflected forms worth showing: [[form, "tag tag"]]. Verbs keep only the conjugation table (the head line repeats
 * a few forms with fewer tags); clitic combinations (hablarme, dándoselo) and the -se subjunctive are dropped.
 */
function cleanForms(rawForms) {
  const forms = Array.isArray(rawForms) ? rawForms : [];
  const useful = forms.filter(f => f && f.form && Array.isArray(f.tags) && !f.tags.some(t => DROP_TAGS.has(t)));
  const conjugation = useful.filter(f => f.source === 'conjugation');
  const rows = conjugation.length > 0 && conjugation.some(f => f.tags.includes('infinitive')) ? conjugation : useful;
  const seen = new Set();
  const out = [];
  for (const f of rows) {
    if (f.tags.length === 0) continue;
    // "irse / irme" (pronominal paradigm) carry person or number tags next to infinitive / gerund
    if ((f.tags.includes('infinitive') || f.tags.includes('gerund')) && f.tags.length > 1) continue;
    const key = `${f.form}|${[...f.tags].sort().join(' ')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([f.form, f.tags.join(' ')]);
  }
  return out;
}

const looksLikeSentence = (text) => /[.!?]/.test(text) || text.split(/\s+/).length >= 4;

/** Up to two example sentences (not phrases or quotations) that carry an English translation: [[es, en]] */
function pickExamples(senses) {
  const out = [];
  for (const sense of senses || []) {
    for (const ex of sense.examples || []) {
      const es = String(ex.text || '').trim();
      const en = String(ex.english || ex.translation || '').trim();
      // Quotations are long and archaic; collocations ("hablar tonteras") are phrases, not sentences
      if (!es || !en || es.length > MAX_EXAMPLE_CHARS || ex.type === 'quotation' || !looksLikeSentence(es)) continue;
      if (out.some(([seen]) => seen === es)) continue;
      out.push([es, en]);
      if (out.length >= MAX_EXAMPLES) return out;
    }
  }
  return out;
}

/** The phonemic transcription if there is one (/aˈblaɾ/), else the first IPA */
function pickIpa(sounds) {
  const ipas = (sounds || []).map(s => s.ipa).filter(Boolean);
  return ipas.find(i => i.startsWith('/')) || ipas[0] || '';
}

/** etymology_text starts with a family-tree dump for many words ("Etymology tree\nProto-Indo-European …"): keep the prose */
function cleanEtymologyText(text) {
  const lines = String(text || '').split('\n').map(l => l.trim()).filter(Boolean);
  let from = 0;
  if (lines[0] === 'Etymology tree') {
    from = lines.findIndex((l, i) => i > 0 && PROSE_START.test(l));
    if (from < 0) from = lines.length - 1;
  }
  const clean = lines.slice(from).join(' ');
  return clean.length > MAX_ETYMOLOGY_CHARS ? `${clean.slice(0, MAX_ETYMOLOGY_CHARS - 1)}…` : clean;
}

// "la:felicitas<alt:felicitātem>" -> { lang: 'la', word: 'felicitātem' }; "bueno<t:good>" -> { lang: fallback, word: 'bueno' }
function parseEtyItem(item, fallbackLang) {
  const raw = String(item || '');
  const alt = raw.match(/<alt:([^>]+)>/);
  const base = raw.replace(/<[^>]*>/g, '');
  const m = base.match(/^([a-z][\w-]*):(.+)$/);
  const lang = m ? m[1] : fallbackLang;
  const word = alt ? alt[1] : (m ? m[2] : base);
  return lang && word ? { lang, word } : null;
}

/** Ancestors from the etymology templates: [[lang, word, kind]] (kind: inh | bor | der | af) */
function etymologyChain(templates) {
  const chain = [];
  const add = (lang, word, kind) => {
    const w = String(word || '').trim();
    if (!lang || !w || w === '-' || chain.some(c => c[0] === lang && c[1] === w)) return;
    chain.push([lang, w, kind]);
  };
  for (const { name, args = {} } of templates || []) {
    if (ORIGIN_TEMPLATES.has(name)) {
      add(args['2'], args['3'], name.replace(/\+$/, '').replace(/^lbor|^slbor/, 'bor'));
    } else if (name === 'ety') {
      // {{ety|es|:af|bueno<t:good>|-ito<pos:...>}} or {{ety|es|:bor|la:felicitas<alt:felicitātem>}}
      const kind = String(args['2'] || '').replace(/^:/, '') || 'inh';
      for (const key of Object.keys(args).filter(k => /^\d+$/.test(k) && Number(k) >= 3).sort((a, b) => a - b)) {
        const parsed = parseEtyItem(args[key], args['1']);
        if (parsed) add(parsed.lang, parsed.word, kind === 'af' ? 'af' : kind);
      }
    } else if (name === 'etymon') {
      // {{etymon|es|:inh|osp:azur<id:blue>}}
      const m = String(args['3'] || '').match(/^([\w-]+):([^<]+)/);
      if (m) add(m[1], m[2], String(args['2'] || '').replace(/^:/, '') || 'inh');
    } else if (AFFIX_TEMPLATES.has(name)) {
      const items = Object.keys(args).filter(k => /^\d+$/.test(k) && k !== '1').sort((a, b) => a - b).map(k => args[k]).filter(Boolean);
      for (const item of items) add(args['1'], item, 'af');
    }
  }
  return chain.slice(0, MAX_CHAIN);
}

/** Everything the extra tables need from one wiktextract entry */
function extractExtras(entry) {
  const forms = cleanForms(entry.forms);
  const examples = pickExamples(entry.senses);
  const text = cleanEtymologyText(entry.etymology_text);
  const chain = etymologyChain(entry.etymology_templates);
  return {
    ipa: pickIpa(entry.sounds),
    forms: forms.length ? forms : null,
    examples: examples.length ? examples : null,
    etymology: text || chain.length ? { text, chain } : null
  };
}

module.exports = { cleanForms, pickExamples, pickIpa, cleanEtymologyText, etymologyChain, extractExtras };
