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
// Kinds of Wiktionary entries that are not words to learn
const SKIP_POS = new Set(['name', 'prefix', 'suffix', 'infix', 'symbol', 'character', 'letter', 'punct', 'abbrev', 'romanization']);

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
  return entries.length > 0 && entries.some(e => !SKIP_POS.has(e.pos)) && /^[a-záéíóúüñ ]+$/i.test(factsLemma(facts));
}

/**
 * [{ rank, word, lemma }] in frequency order, one per lemma.
 * readFacts(word) returns the facts object, or undefined when it has not been fetched (the queue stops there).
 */
function buildQueue(words, readFacts, skipKeys = new Set()) {
  const queue = [];
  const seen = new Set(skipKeys);
  let rank = 0;
  for (const word of words) {
    rank++;
    const facts = readFacts(word);
    if (facts === undefined) break;
    if (!facts || !isLearnable(facts)) continue;
    const lemma = factsLemma(facts);
    const key = lexiconKey(lemma);
    if (seen.has(key)) continue;
    seen.add(key);
    queue.push({ rank, word, lemma });
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

module.exports = { isLearnable, buildQueue, toBatches, a1Keys, BATCH_SIZE };

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
