#!/usr/bin/env node
/**
 * What an illustrator needs from a common-words batch, one word per line: "word | pos | zh | hook_zh".
 * Words already drawn in art/freq-<batch>.js are left out.
 *
 * Usage: node server/scripts/lexicon/draw-list.js <batch>   (e.g. 0001)
 */
const fs = require('fs');
const path = require('path');
const { LEXICON_ROOT, lexiconKey } = require('../../lexicon');

const ART_DIR = path.join(LEXICON_ROOT, 'art');
const artFile = (batch) => path.join(ART_DIR, `freq-${batch}.js`);

function drawnWords(batch) {
  const file = artFile(batch);
  if (!fs.existsSync(file)) return new Set();
  delete require.cache[require.resolve(file)];
  return new Set(Object.keys(require(file)).map(lexiconKey));
}

function drawList(batch) {
  const { entries = [] } = JSON.parse(fs.readFileSync(path.join(LEXICON_ROOT, 'freq', `${batch}.json`), 'utf8'));
  const drawn = drawnWords(batch);
  return entries.filter(e => !drawn.has(lexiconKey(e.word))).map(e => `${e.word} | ${e.pos} | ${e.zh} | ${e.hook_zh}`);
}

module.exports = { artFile, drawnWords, drawList };

if (require.main === module) {
  const batch = String(process.argv[2] || '').padStart(4, '0');
  console.log(drawList(batch).join('\n'));
}
