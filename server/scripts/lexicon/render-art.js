#!/usr/bin/env node
/**
 * Render every illustration spec in server/data/lexicon/art/*.js to client/public/lexicon/<word>.svg
 *
 * Usage: node server/scripts/lexicon/render-art.js [flat|line] [outDir] [--only <theme>]
 *   --only renders a single art/<theme>.js (lets several writers work on different themes at once)
 */
const fs = require('fs');
const path = require('path');
const { render } = require('./art');
const { lexiconKey, svgFileName } = require('../../lexicon');

const ART_DIR = path.join(__dirname, '../../data/lexicon/art');
const DEFAULT_OUT = path.join(__dirname, '../../../client/public/lexicon');

function loadSpecs(artDir = ART_DIR, only = null) {
  const specs = new Map();
  const files = only ? [`${only}.js`] : fs.readdirSync(artDir).filter(f => f.endsWith('.js')).sort();
  for (const file of files) {
    for (const [word, shapes] of Object.entries(require(path.join(artDir, file)))) {
      const key = lexiconKey(word);
      if (specs.has(key)) throw new Error(`${file}: "${word}" already drawn in ${specs.get(key).file}`);
      specs.set(key, { word, file, shapes });
    }
  }
  return specs;
}

function renderAll(style = 'flat', outDir = DEFAULT_OUT, artDir = ART_DIR, only = null) {
  fs.mkdirSync(outDir, { recursive: true });
  const specs = loadSpecs(artDir, only);
  for (const { word, shapes } of specs.values()) fs.writeFileSync(path.join(outDir, svgFileName(word)), render(shapes, style));
  return specs.size;
}

module.exports = { loadSpecs, renderAll };

if (require.main === module) {
  const args = process.argv.slice(2);
  const onlyAt = args.indexOf('--only');
  const only = onlyAt >= 0 ? args.splice(onlyAt, 2)[1] : null;
  const [style = 'flat', outDir = DEFAULT_OUT] = args;
  console.log(`${renderAll(style, outDir, ART_DIR, only)} illustrations → ${outDir} (${style})`);
}
