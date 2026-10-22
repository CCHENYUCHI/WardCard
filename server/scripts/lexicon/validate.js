#!/usr/bin/env node
/**
 * Check the hand-written lexicon: every entry follows the schema, stays short enough for a phone
 * screen and cites its sources; every illustration is a small, self-contained SVG.
 *
 * Usage: node server/scripts/lexicon/validate.js [lexiconDir] [svgDir]
 */
const fs = require('fs');
const path = require('path');
const { normalizeWord } = require('../../cardUtils');

const DEFAULT_LEXICON_DIR = path.join(__dirname, '../../data/lexicon/a1');
const DEFAULT_SVG_DIR = path.join(__dirname, '../../../client/public/lexicon');
const POS = ['sustantivo', 'verbo', 'adjetivo', 'adverbio', 'frase', 'conjunción', 'preposición', 'pronombre', 'interjección', 'artículo', 'determinante', 'numeral'];
const ARTICLES = ['', 'el', 'la'];
const CONFIDENCE = ['sourced', 'hook-only'];
const MAX = { zh: 40, en: 60, story_zh: 220, hook_zh: 80, usage_zh: 90, example_es: 90, example_zh: 60 };
const MAX_SVG_BYTES = 4096;

const isStr = (v) => typeof v === 'string';

function validateEntry(e) {
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };
  need(isStr(e.word) && e.word.trim() === e.word && e.word.length > 0, 'word');
  need(ARTICLES.includes(e.article), `article "${e.article}"`);
  need(POS.includes(e.pos), `pos "${e.pos}"`);
  for (const k of ['zh', 'en', 'ipa', 'hook_zh', 'example_es', 'example_zh']) need(isStr(e[k]) && e[k].length > 0, `${k} missing`);
  for (const k of ['story_zh', 'usage_zh']) need(isStr(e[k]), `${k} not a string`);
  for (const [k, max] of Object.entries(MAX)) if (isStr(e[k]) && [...e[k]].length > max) errors.push(`${k} too long (${[...e[k]].length}/${max})`);
  need(Array.isArray(e.breakdown) && e.breakdown.every(p => isStr(p.part) && isStr(p.zh)), 'breakdown');
  need(Array.isArray(e.origin_chain) && e.origin_chain.every(o => isStr(o.lang_zh) && isStr(o.word) && isStr(o.zh)), 'origin_chain');
  need(Array.isArray(e.cognates_en) && e.cognates_en.every(isStr), 'cognates_en');
  need(CONFIDENCE.includes(e.confidence), `confidence "${e.confidence}"`);
  if (e.confidence === 'sourced') {
    need(e.story_zh.length > 0 && e.origin_chain.length > 0, 'sourced entry needs story_zh and origin_chain');
    need(Array.isArray(e.sources) && e.sources.length > 0 && e.sources.every(s => /^wiktionary:[a-z-]+:.+/.test(s)), 'sources');
  }
  need(e.image === 'svg' || /^emoji:\S+$/u.test(e.image || ''), `image "${e.image}"`);
  if (isStr(e.example_es) && isStr(e.word)) {
    // The example should show the word (or one of its forms); a loose stem check catches copy-paste slips
    const stem = normalizeWord(e.word).slice(0, Math.max(2, normalizeWord(e.word).length - 3));
    need(normalizeWord(e.example_es).includes(stem), 'example_es does not contain the word');
  }
  return errors;
}

function validateSvg(text) {
  const errors = [];
  if (Buffer.byteLength(text) > MAX_SVG_BYTES) errors.push(`svg too large (${Buffer.byteLength(text)} bytes)`);
  if (!/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 160 160">[\s\S]*<\/svg>\s*$/.test(text)) errors.push('svg root');
  if (/<script|on\w+=|href=|<foreignObject|<image/i.test(text)) errors.push('svg has scripts, handlers or external references');
  return errors;
}

function validateAll(lexiconDir = DEFAULT_LEXICON_DIR, svgDir = DEFAULT_SVG_DIR) {
  const problems = [];
  const seen = new Map();
  let count = 0;
  for (const file of fs.readdirSync(lexiconDir).filter(f => f.endsWith('.json')).sort()) {
    const data = JSON.parse(fs.readFileSync(path.join(lexiconDir, file), 'utf8'));
    for (const e of data.entries || []) {
      count++;
      const key = normalizeWord(e.word);
      if (seen.has(key)) problems.push(`${file}: ${e.word} duplicates ${seen.get(key)}`);
      seen.set(key, file);
      for (const err of validateEntry(e)) problems.push(`${file}: ${e.word}: ${err}`);
      if (e.image === 'svg') {
        const svgPath = path.join(svgDir, `${key}.svg`);
        if (!fs.existsSync(svgPath)) problems.push(`${file}: ${e.word}: missing ${path.relative(process.cwd(), svgPath)}`);
        else for (const err of validateSvg(fs.readFileSync(svgPath, 'utf8'))) problems.push(`${file}: ${e.word}: ${err}`);
      }
    }
  }
  return { count, problems };
}

module.exports = { validateEntry, validateSvg, validateAll };

if (require.main === module) {
  const [lexiconDir, svgDir] = process.argv.slice(2);
  const { count, problems } = validateAll(lexiconDir || DEFAULT_LEXICON_DIR, svgDir || DEFAULT_SVG_DIR);
  for (const p of problems) console.error(`✗ ${p}`);
  console.log(`${count} entries, ${problems.length} problem(s)`);
  process.exit(problems.length ? 1 : 0);
}
