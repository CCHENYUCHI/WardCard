#!/usr/bin/env node
/**
 * One PNG with every illustration of an art file, labelled, to check a batch at a glance
 * (unreadable pictures, shapes past the edge, white on white). Needs a Chromium binary.
 *
 * Usage: node server/scripts/lexicon/contact-sheet.js <art theme> <out.png> [--chrome <path>]
 *        e.g. contact-sheet.js freq-0001 /tmp/sheet.png
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadSpecs } = require('./render-art');
const { render } = require('./art');

const CHROME_CANDIDATES = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium/chrome-linux64/chrome', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', 'chromium', 'google-chrome'];
const COLS = 10;
const CELL = 120;

const escapeHtml = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function sheetHtml(specs) {
  const cells = [...specs.values()].map(({ word, shapes }) => `<figure>${render(shapes, 'flat')}<figcaption>${escapeHtml(word)}</figcaption></figure>`);
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:8px;background:#fff;font:12px sans-serif;display:grid;grid-template-columns:repeat(${COLS},${CELL}px);gap:6px}
    figure{margin:0;border:1px solid #dadce0;text-align:center}svg{width:${CELL - 10}px;height:${CELL - 10}px}
    figcaption{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style>${cells.join('')}`;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const chromeAt = args.indexOf('--chrome');
  const chromeArg = chromeAt >= 0 ? args.splice(chromeAt, 2)[1] : null;
  const [theme, out] = args;
  if (!theme || !out) {
    console.error('Usage: contact-sheet.js <art theme> <out.png> [--chrome <path>]');
    process.exit(1);
  }
  const specs = loadSpecs(undefined, theme);
  const html = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sheet-')), 'sheet.html');
  fs.writeFileSync(html, sheetHtml(specs));
  const rows = Math.ceil(specs.size / COLS);
  const chrome = chromeArg || CHROME_CANDIDATES.find(c => c && (!c.includes('/') || fs.existsSync(c)));
  execFileSync(chrome, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--screenshot=${path.resolve(out)}`,
    `--window-size=${COLS * (CELL + 6) + 16},${rows * (CELL + 24) + 24}`, `file://${html}`], { stdio: 'ignore' });
  console.log(`${specs.size} pictures → ${out}`);
}

module.exports = { sheetHtml };
