#!/usr/bin/env node
/**
 * After build-queue.js changed which words are in which batch: move written entries to their new batch file
 * and drop entries whose word left the queue (folded into another word), with their drawings in art/freq-*.js.
 *
 * Usage: node server/scripts/lexicon/rebatch.js <queue.json>
 */
const fs = require('fs');
const path = require('path');
const { LEXICON_ROOT, lexiconKey } = require('../../lexicon');

const FREQ_DIR = path.join(LEXICON_ROOT, 'freq');
const ART_DIR = path.join(LEXICON_ROOT, 'art');
const SVG_DIR = path.join(__dirname, '../../../client/public/lexicon');

/** Remove the drawings of dropped words from the common-word art files (their keys are top-level "  word: [ ... ]," blocks) */
function dropDrawings(keys) {
  const { svgFileName } = require('../../lexicon');
  const removed = [];
  for (const f of fs.readdirSync(ART_DIR).filter(n => /^freq-.*\.js$/.test(n))) {
    const file = path.join(ART_DIR, f);
    delete require.cache[require.resolve(file)];
    const words = Object.keys(require(file)).filter(w => keys.has(lexiconKey(w)));
    if (!words.length) continue;
    let text = fs.readFileSync(file, 'utf8');
    for (const w of words) {
      const name = /^[a-z_]\w*$/i.test(w) ? w : `'${w}'`;
      const start = text.indexOf(`\n  ${name}: [`);
      if (start < 0) continue;
      const end = text.indexOf('\n  ]', start);
      text = text.slice(0, start) + text.slice(text.indexOf('\n', end + 1));
      removed.push(w);
      fs.rmSync(path.join(SVG_DIR, svgFileName(w)), { force: true });
    }
    fs.writeFileSync(file, text.replace(/\],\n\};/, ']\n};'));
  }
  return removed;
}

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
  return { dropped, batches: Object.keys(byBatch).length, drawingsRemoved: dropDrawings(new Set(dropped)) };
}

module.exports = { rebatch };

if (require.main === module) {
  const queue = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const { dropped, batches, drawingsRemoved } = rebatch(queue);
  console.log(`${batches} batch files written; dropped (folded or no longer queued): ${dropped.join(' ') || '-'}; drawings removed: ${drawingsRemoved.length}`);
}
