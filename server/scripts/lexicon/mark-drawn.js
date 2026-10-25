#!/usr/bin/env node
/**
 * After the batch's drawings are written and rendered: switch the batch's entries that now have a picture
 * from their emoji stand-in to image "svg". Entries without a drawing keep the emoji.
 *
 * Usage: node server/scripts/lexicon/mark-drawn.js <batch> [<batch> ...]
 */
const fs = require('fs');
const path = require('path');
const { LEXICON_ROOT, lexiconKey } = require('../../lexicon');
const { drawnWords } = require('./draw-list');

function markDrawn(batch) {
  const file = path.join(LEXICON_ROOT, 'freq', `${batch}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const drawn = drawnWords();
  let marked = 0;
  for (const e of data.entries || []) {
    if (drawn.has(lexiconKey(e.word)) && e.image !== 'svg') {
      e.image = 'svg';
      marked++;
    }
  }
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return { marked, total: (data.entries || []).length, drawn: (data.entries || []).filter(e => e.image === 'svg').length };
}

module.exports = { markDrawn };

if (require.main === module) {
  for (const arg of process.argv.slice(2)) {
    const batch = arg.padStart(4, '0');
    const { marked, total, drawn } = markDrawn(batch);
    console.log(`batch ${batch}: ${marked} newly marked, ${drawn}/${total} drawn`);
  }
}
