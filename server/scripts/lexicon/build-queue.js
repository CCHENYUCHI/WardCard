#!/usr/bin/env node
/**
 * Order the dictionary's words for the common-words lexicon (server/data/lexicon/freq/): most frequent first,
 * inflected forms folded into their lemma, words the A1 lexicon already has left out. Batches of 100 lemmas
 * get stable numbers (0001, 0002, ...) as long as the frequency list and the facts stay the same.
 *
 * Usage: node server/scripts/lexicon/build-queue.js <freq.txt> <factsDir> <queue.json> [--size 100]
 *   freq.txt  one word per line, most frequent first (e.g. wordfreq's top_n_list('es', n))
 *   factsDir  fetch-facts.js output. The queue stops at the first word that has no facts file yet, so
 *             re-running it after more facts are fetched only appends batches.
 */
const fs = require('fs');
const path = require('path');
const { lexiconKey, LEXICON_ROOT } = require('../../lexicon');
const { factsLemma } = require('./geminiEntries');

const BATCH_SIZE = 100;
const FUNCTION_POS = new Set(['article', 'det', 'pron', 'prep', 'conj', 'contraction', 'intj', 'particle']);
// In running text these are names or shorthand (Luis, María, Brasil, PP), not "louis (coin)" or "brazilwood"
const SKIP_WORDS = new Set(['luis', 'maría', 'brasil', 'pp', 'to', 'cuba', 'post', 'sr', 'miguel', 'japón', 'tv', 'fernando', 'jorge', 'valencia']);
// Words that look like a form of another word but are learned on their own
const NO_FOLD = new Set(['política', 'lista', 'firma']);
// Kinds of Wiktionary entries that are not words to learn
const SKIP_POS = new Set(['name', 'prefix', 'suffix', 'infix', 'symbol', 'character', 'letter', 'punct', 'abbrev', 'romanization']);

// Very common verb forms that Wiktionary also lists as a rare word of their own (son "sound", hay as a spelling
// of ahí): learners meet them as the verb form, so they fold into the verb like any other form
const FOLD = {
  son: 'ser', hay: 'haber', era: 'ser', eras: 'ser', fui: 'ser', sea: 'ser', sean: 'ser', siendo: 'ser',
  ha: 'haber', han: 'haber', he: 'haber', has: 'haber', haya: 'haber', había: 'haber', hubo: 'haber',
  va: 'ir', vas: 'ir', van: 'ir', vamos: 'ir', voy: 'ir', ve: 'ir', fue: 'ir',
  da: 'dar', dé: 'dar', di: 'decir', dice: 'decir', digo: 'decir', dicho: 'decir',
  sé: 'saber', sabe: 'saber', vino: 'venir', vengo: 'venir', ven: 'venir', hecho: 'hacer', haz: 'hacer',
  les: 'le', veces: 'vez', pasa: 'pasar', trata: 'tratar', nueva: 'nuevo', primera: 'primero', puede: 'poder', puedo: 'poder', quiero: 'querer', tengo: 'tener', tiene: 'tener', está: 'estar', estaba: 'estar'
};

// Possible base words of an inflected adjective / noun form: nueva -> nuevo, veces -> vez, cuentos -> cuento
function baseCandidates(word) {
  const out = [];
  const add = (re, rep) => { if (re.test(word)) out.push(word.replace(re, rep)); };
  add(/as$/, 'o'); add(/a$/, 'o'); add(/os$/, 'o'); add(/ces$/, 'z'); add(/es$/, ''); add(/s$/, '');
  add(/^(primer|tercer|buen|mal|gran|algún|ningún)$/, (m) => ({ primer: 'primero', tercer: 'tercero', buen: 'bueno', mal: 'malo', gran: 'grande', 'algún': 'alguno', 'ningún': 'ninguno' })[m]);
  return out.filter(c => c && c !== word);
}


/**
 * The base word whose Wiktionary head line lists `word` as one of its forms ("nuevo (feminine nueva, ...)").
 * Function words (las, sus, mas) never fold, and a noun with a meaning of its own (política "politics")
 * does not fold into an adjective (político).
 */
function foldTarget(word, readFacts) {
  if (NO_FOLD.has(word)) return null;
  const own = readFacts(word);
  const ownPos = new Set((own?.entries || []).map(e => e.pos));
  if ([...ownPos].some(p => FUNCTION_POS.has(p))) return null;
  const listed = new RegExp(`(^|[\\s(,])${word}([\\s),]|$)`, 'u');
  for (const base of baseCandidates(word)) {
    const entries = (readFacts(base)?.entries || []).filter(e => listed.test(e.head || ''));
    if (entries.length === 0) continue;
    if (ownPos.has('noun') && !entries.some(e => e.pos === 'noun')) continue;
    return base;
  }
  return null;
}

const factsFile = (factsDir, word) => path.join(factsDir, `${word}.json`);

/** Lemma keys of the A1 lexicon (the hand-written set wins over the frequency set) */
function a1Keys(dir = path.join(LEXICON_ROOT, 'a1')) {
  const keys = new Set();
  if (!fs.existsSync(dir)) return keys;
  for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.json'))) {
    for (const e of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).entries || []) keys.add(lexiconKey(e.word));
  }
  return keys;
}

/** Whether a facts file describes a Spanish word worth an entry */
function isLearnable(facts) {
  const entries = facts.entries || [];
  const lemma = factsLemma(facts);
  if (!/^[a-záéíóúüñ ]+$/i.test(lemma)) return false;
  // Single letters are words only as y, o, e, u, a; otherwise letter names or abbreviations
  if (lemma.length === 1 && !'yoeua'.includes(lemma.toLowerCase())) return false;
  if (SKIP_WORDS.has(lemma)) return false;
  return entries.some(e => !SKIP_POS.has(e.pos));
}

// A word that is also a verb / noun form keeps its own entry only with more than this many senses of its own:
// estado, parte, cuenta stay; pasa ("raisin"), buena ("inheritance") fold into pasar, bueno
const OWN_SENSES_TO_STAY = 2;

/**
 * The lemma an inflected form folds into, from the facts' form_of list (fetch-facts.js): podemos -> poder,
 * not podar. A known lemma (A1 or queued earlier) wins, then the most frequent one.
 */
const MISSPELLING = /^(?:misspelling|common misspelling|nonstandard spelling|obsolete spelling|obsolete form) of (\S+?)[.,;]?$/i;

/** asi, "misspelling of así": the right spelling the entry belongs to */
function misspelledFor(facts) {
  const glosses = (facts?.base ? [] : facts?.entries || []).flatMap(e => e.glosses || []);
  return glosses.length && glosses.every(g => MISSPELLING.test(g)) ? MISSPELLING.exec(glosses[0])[1] : null;
}

function formOfTarget(word, facts, known, rankOf) {
  const spelled = misspelledFor(facts);
  if (spelled && spelled !== word) return spelled;
  const targets = facts?.form_of || (facts?.base ? [facts.base] : []);
  if (!targets.length || NO_FOLD.has(word)) return null;
  const own = facts.base ? [] : facts.entries || [];
  // Interjection senses (sabes "you know?", os "alternative form of ox") do not make a verb form a word of its own
  if (own.some(e => FUNCTION_POS.has(e.pos) && e.pos !== 'intj')) return null;
  if (own.some(e => e.pos === 'verb') && /(ar|er|ir|ír)(se)?$/.test(word)) return null; // an infinitive is a lemma
  const score = (t) => (known.has(lexiconKey(t)) ? -1 : rankOf.get(t) ?? Infinity);
  const target = [...targets].sort((a, b) => score(a) - score(b))[0];
  // dije ("locket, charm, pleasant") is still mostly "I said": one more sense is allowed when the lemma is known
  const allowed = OWN_SENSES_TO_STAY + (known.has(lexiconKey(target)) ? 1 : 0);
  if (own.reduce((n, e) => n + (e.glosses || []).length, 0) > allowed) return null;
  // A word with senses of its own folds into a lemma the learner already has (queda -> quedar), or else only into
  // a more frequent one: pasa -> pasar, but gobierno stays (gobernar is rarer)
  if (own.length && !known.has(lexiconKey(target)) && !((rankOf.get(target) ?? Infinity) < (rankOf.get(word) ?? Infinity))) return null;
  return target;
}

/**
 * [{ rank, word, lemma }] in frequency order, one per lemma.
 * readFacts(word) returns the facts object, or undefined when it has not been fetched (the queue stops there).
 */
function buildQueue(words, readFacts, skipKeys = new Set()) {
  const queue = [];
  const seen = new Set(skipKeys);
  const rankOf = new Map(words.map((w, i) => [w, i + 1]));
  let rank = 0;
  for (const word of words) {
    rank++;
    const own = readFacts(word);
    if (own === undefined) break;
    let target = FOLD[word] || formOfTarget(word, own, seen, rankOf) || foldTarget(word, readFacts);
    // One more hop for misspellings: dias -> dia (plural) -> día
    const next = target && misspelledFor(readFacts(target));
    if (next && next !== word) target = next;
    if (target && FOLD[target]) target = FOLD[target]; // dichos -> dicho -> decir
    if (target && seen.has(lexiconKey(target))) continue;
    // A rarer lemma that has not been fetched: keep the facts the word itself came with
    if (target && !readFacts(target)) target = null;
    const facts = target ? readFacts(target) : own;
    if (!facts || !isLearnable(facts)) continue;
    const lemma = factsLemma(facts);
    const key = lexiconKey(lemma);
    if (seen.has(key)) continue;
    seen.add(key);
    queue.push({ rank, word: target || word, lemma });
  }
  return queue;
}

const batchId = (index) => String(index + 1).padStart(4, '0');

/** { '0001': [items], ... } in batches of `size`; a trailing partial batch is left out until it fills up */
function toBatches(queue, size = BATCH_SIZE, { partial = false } = {}) {
  const batches = {};
  for (let i = 0; i * size < queue.length; i++) {
    const items = queue.slice(i * size, (i + 1) * size);
    if (items.length === size || partial) batches[batchId(i)] = items;
  }
  return batches;
}

module.exports = { FOLD, baseCandidates, foldTarget, formOfTarget, isLearnable, buildQueue, toBatches, a1Keys, BATCH_SIZE };

if (require.main === module) {
  const args = process.argv.slice(2);
  const sizeAt = args.indexOf('--size');
  const size = sizeAt >= 0 ? Number(args.splice(sizeAt, 2)[1]) : BATCH_SIZE;
  const partial = args.includes('--partial') && args.splice(args.indexOf('--partial'), 1);
  const [freqPath, factsDir, outPath] = args;
  if (!freqPath || !factsDir || !outPath) {
    console.error('Usage: build-queue.js <freq.txt> <factsDir> <queue.json> [--size 100] [--partial]');
    process.exit(1);
  }
  const words = fs.readFileSync(freqPath, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const readFacts = (word) => {
    const file = factsFile(factsDir, word);
    if (!fs.existsSync(file)) return undefined;
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return null; }
  };
  const queue = buildQueue(words, readFacts, a1Keys());
  const batches = toBatches(queue, size, { partial: Boolean(partial) });
  fs.writeFileSync(outPath, JSON.stringify({ factsDir: path.resolve(factsDir), size, batches }, null, 1));
  const last = queue[queue.length - 1];
  console.log(`${queue.length} lemmas (through frequency rank ${last ? last.rank : 0}) → ${Object.keys(batches).length} batches → ${outPath}`);
}
