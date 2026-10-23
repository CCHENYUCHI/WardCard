#!/usr/bin/env node
/**
 * Collect the facts a lexicon entry is written from: kaikki.org (Wiktionary, CC BY-SA) data
 * for each Spanish word, plus its Latin ancestors followed through the etymology templates.
 *
 * Usage: node server/scripts/lexicon/fetch-facts.js <outDir> word1 word2 ...
 *        node server/scripts/lexicon/fetch-facts.js <outDir> --list words.txt
 *
 * Writes <outDir>/<word>.json. Already fetched words are skipped, so the script can be re-run.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://kaikki.org/dictionary';
const USER_AGENT = 'PalabraCard-lexicon/0.1 (personal Spanish study app)';
const DELAY_MS = 400;
const MAX_DEPTH = 3;
const LANG_NAMES = { es: 'Spanish', la: 'Latin', 'la-lat': 'Latin', 'la-med': 'Latin', 'la-vul': 'Latin', 'la-new': 'Latin' };
const ORIGIN_TEMPLATES = new Set(['inh', 'inh+', 'bor', 'bor+', 'lbor', 'slbor', 'der', 'der+', 'lbor+']);
const AFFIX_TEMPLATES = new Set(['af', 'affix', 'prefix', 'pre', 'suffix', 'suf', 'compound', 'com', 'confix', 'con']);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Latin page titles carry no macrons (praeoccupō -> praeoccupo)
const pageTitle = (lang, word) => (lang === 'Latin' ? word.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC') : word);

async function fetchEntries(lang, word) {
  const title = pageTitle(lang, word);
  const chars = [...title];
  const url = `${BASE}/${encodeURIComponent(lang)}/meaning/${encodeURIComponent(chars[0])}/${encodeURIComponent(chars.slice(0, 2).join(''))}/${encodeURIComponent(title)}.jsonl`;
  await sleep(DELAY_MS);
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return [];
  const text = await res.text();
  return text.split('\n').filter(l => l.startsWith('{')).map(l => JSON.parse(l));
}

/** Etymology templates -> [{ kind, lang, word, gloss }] (origins), affix parts, English cognates */
function parseTemplates(templates = []) {
  const origins = [];
  const parts = [];
  const cognates = [];
  for (const { name, args = {} } of templates) {
    if (ORIGIN_TEMPLATES.has(name)) {
      if (args['3'] && args['3'] !== '-') {
        origins.push({ kind: name.replace(/\+$/, ''), lang: args['2'], word: args['3'], alt: args['4'] || '', gloss: args['5'] || args.t || '' });
      }
    } else if (name === 'etymon') {
      // {{etymon|es|:inh|osp:azur<id:blue>}}
      const m = String(args['3'] || '').match(/^([\w-]+):([^<]+)/);
      if (m) origins.push({ kind: String(args['2'] || '').replace(/^:/, ''), lang: m[1], word: m[2], gloss: '' });
    } else if (AFFIX_TEMPLATES.has(name)) {
      const items = Object.keys(args).filter(k => /^\d+$/.test(k) && k !== '1').sort((a, b) => a - b).map(k => args[k]).filter(Boolean);
      if (items.length) parts.push({ type: name, lang: args['1'], items });
    } else if (name === 'cog' && args['1'] === 'en' && args['2']) {
      cognates.push(args['2']);
    }
  }
  return { origins, parts, cognates };
}

const summarize = (e) => ({
  word: e.word,
  pos: e.pos,
  head: e.head_templates?.[0]?.expansion || '',
  ipa: (e.sounds || []).map(s => s.ipa).filter(Boolean).slice(0, 2),
  glosses: (e.senses || []).filter(s => !s.form_of).map(s => (s.glosses || []).slice(-1)[0]).filter(Boolean).slice(0, 6),
  examples: (e.senses || []).flatMap(s => s.examples || []).map(x => ({ es: x.text, en: x.english || x.translation || '' })).slice(0, 3),
  etymology_text: (e.etymology_text || '').replace(/^Etymology tree[\s\S]*?\n(?=[A-Z][a-z]+ (from|of|via)|From|Inherited|Borrowed|Learned|Derived|Semi-learned|Univerbation|Clipping|Back-formation|Calque|Compound|Possibly|Probably|Uncertain|Unknown|Of )/m, '').slice(0, 900),
  etymology: parseTemplates(e.etymology_templates),
  derived: (e.derived || []).map(d => d.word).filter(Boolean).slice(0, 12),
  related: (e.related || []).map(d => d.word).filter(Boolean).slice(0, 8)
});

async function ancestors(origins, depth, seen) {
  const out = [];
  if (depth > MAX_DEPTH) return out;
  for (const o of origins) {
    const lang = LANG_NAMES[o.lang];
    if (!lang || lang === 'Spanish' || o.word.startsWith('*')) continue; // reconstructed forms have no page
    const key = `${lang}:${pageTitle(lang, o.word)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const entries = (await fetchEntries(lang, o.word)).filter(e => !(e.senses || []).every(s => s.form_of));
    const next = [];
    // Homographs (liber "free" / liber "book") are all kept; the writer picks the one the gloss points to
    for (const entry of entries.slice(0, 3)) {
      const e = summarize(entry);
      delete e.examples;
      out.push({ depth, lang, ...e });
      next.push(...e.etymology.origins);
      // Latin affix parts (prae- + occupō) are worth one more step
      for (const p of e.etymology.parts) for (const item of p.items) next.push({ kind: 'part', lang: p.lang || 'la', word: item, gloss: '' });
    }
    out.push(...await ancestors(next.filter(n => !/^-|-$/.test(n.word)), depth + 1, seen));
  }
  return out;
}

async function collect(word) {
  const entries = (await fetchEntries('Spanish', word)).filter(e => e.word === word);
  let lemmas = entries.filter(e => !(e.senses || []).every(s => s.form_of)).map(summarize);
  let base = null;
  if (lemmas.length === 0) {
    // levantarse, vacaciones, peor are filed as forms of levantar, vacación, malo: tell the base word's story
    const target = entries.flatMap(e => (e.senses || []).flatMap(s => s.form_of || [])).map(f => f.word).find(Boolean)
      || (/[^s]se$/.test(word) ? word.slice(0, -2) : null);
    if (target && target !== word) {
      base = target;
      lemmas = (await fetchEntries('Spanish', target)).filter(e => e.word === target && !(e.senses || []).every(s => s.form_of)).map(summarize);
    }
  }
  const origins = lemmas.flatMap(l => l.etymology.origins);
  const parts = lemmas.flatMap(l => l.etymology.parts.flatMap(p => p.items.map(item => ({ kind: 'part', lang: p.lang, word: item }))));
  return {
    word,
    source: 'Wiktionary via kaikki.org (CC BY-SA)',
    fetched_at: new Date().toISOString(),
    base, // the lemma these facts belong to when the word itself is only an inflected form
    entries: lemmas,
    ancestors: await ancestors([...origins, ...parts.filter(p => p.lang !== 'es')], 1, new Set())
  };
}

async function main() {
  const [outDir, ...rest] = process.argv.slice(2);
  if (!outDir || rest.length === 0) {
    console.error('Usage: fetch-facts.js <outDir> word1 word2 ... | --list words.txt');
    process.exit(1);
  }
  const words = rest[0] === '--list'
    ? fs.readFileSync(rest[1], 'utf8').split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'))
    : rest;
  fs.mkdirSync(outDir, { recursive: true });
  for (const word of words) {
    const file = path.join(outDir, `${word}.json`);
    if (fs.existsSync(file)) continue;
    try {
      const facts = await collect(word);
      fs.writeFileSync(file, JSON.stringify(facts, null, 2));
      console.log(`${word}: ${facts.entries.length} entries, ${facts.ancestors.length} ancestors`);
    } catch (err) {
      console.error(`${word}: ${err.message}`);
    }
  }
}

module.exports = { parseTemplates, pageTitle };

if (require.main === module) main();
