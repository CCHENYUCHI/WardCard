#!/usr/bin/env node
/**
 * After build-queue.js changed which words are in which batch: move written entries to their new batch file
 * and drop entries whose word left the queue (folded into another word). Drawings stay where they are.
 *
 * Usage: node server/scripts/lexicon/rebatch.js <queue.json>
 */
const fs = require('fs');
const path = require('path');
const { LEXICON_ROOT, lexiconKey } = require('../../lexicon');

const FREQ_DIR = path.join(LEXICON_ROOT, 'freq');

function rebatch(queue) {
  const home = new Map();
  for (const [id, items] of Object.entries(queue.batches)) for (const it of items) home.set(lexiconKey(it.lemma), id);
  const files = fs.existsSync(FREQ_DIR) ? fs.readdirSync(FREQ_DIR).filter(n => n.endsWith('.json')) : [];
  const all = new Map();
  for (const f of files) for (const e of JSON.parse(fs.readFileSync(path.join(FREQ_DIR, f), 'utf8')).entries || []) all.set(lexiconKey(e.word), e);
  const dropped = [...all.keys()].filter(k => !home.has(k));
  const byBatch = {};
  for (const [key, e] of all) {
    const id = home.get(key);
    if (!id) continue;
    (byBatch[id] = byBatch[id] || []).push(e);
  }
  for (const f of files) fs.rmSync(path.join(FREQ_DIR, f));
  for (const [id, entries] of Object.entries(byBatch)) {
    const items = queue.batches[id];
    const order = new Map(items.map((it, i) => [lexiconKey(it.lemma), i]));
    entries.sort((a, b) => order.get(lexiconKey(a.word)) - order.get(lexiconKey(b.word)));
    fs.writeFileSync(path.join(FREQ_DIR, `${id}.json`), `${JSON.stringify({ theme: `freq-${id}`, theme_zh: `常用字（頻率第 ${items[0].rank}–${items[items.length - 1].rank} 名）`, entries }, null, 2)}\n`);
  }
  return { dropped, batches: Object.keys(byBatch).length };
}

module.exports = { rebatch };

if (require.main === module) {
  const queue = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const { dropped, batches } = rebatch(queue);
  console.log(`${batches} batch files written; dropped (folded or no longer queued): ${dropped.join(' ') || '-'}`);
}
