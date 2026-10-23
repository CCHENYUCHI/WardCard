#!/usr/bin/env node
/**
 * What an illustrator needs from a common-words batch, one word per line: "word | pos | zh | hook_zh".
 * Words already drawn (in any art file) are left out; new drawings go in art/freq-<batch>.js.
 *
 * Usage: node server/scripts/lexicon/draw-list.js <batch>   (e.g. 0001)
 */
const fs = require('fs');
const path = require('path');
const { LEXICON_ROOT, lexiconKey } = require('../../lexicon');

const ART_DIR = path.join(LEXICON_ROOT, 'art');
const artFile = (batch) => path.join(ART_DIR, `freq-${batch}.js`);

/** Words drawn in any art file (a word may have been drawn while it sat in another batch) */
function drawnWords() {
  const words = new Set();
  for (const f of fs.readdirSync(ART_DIR).filter(n => n.endsWith('.js'))) {
    const file = path.join(ART_DIR, f);
    delete require.cache[require.resolve(file)];
    for (const w of Object.keys(require(file))) words.add(lexiconKey(w));
  }
  return words;
}

function drawList(batch) {
  const { entries = [] } = JSON.parse(fs.readFileSync(path.join(LEXICON_ROOT, 'freq', `${batch}.json`), 'utf8'));
  const drawn = drawnWords();
  return entries.filter(e => !drawn.has(lexiconKey(e.word))).map(e => `${e.word} | ${e.pos} | ${e.zh} | ${e.hook_zh}`);
}

module.exports = { artFile, drawnWords, drawList };

if (require.main === module) {
  const batch = String(process.argv[2] || '').padStart(4, '0');
  console.log(drawList(batch).join('\n'));
}
