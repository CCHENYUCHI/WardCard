#!/usr/bin/env node
/**
 * Write the hand-written A1 lexicon (server/data/lexicon/a1/*.json) into the offline dictionary file.
 * Takes seconds and needs no kaikki download; `build-dictionary.js` does the same at the end of a full build.
 * If the dictionary file does not exist yet, a small one holding only the lexicon is created, so the app
 * works (stories and pictures, no Wiktionary entries) until the full dictionary is built.
 *
 * Usage: node server/scripts/build-lexicon.js [dictionary.sqlite]
 */
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { writeLexicon } = require('../lexicon');
const { createSchema, DEFAULT_OUT } = require('./build-dictionary');

function buildLexicon(output = DEFAULT_OUT) {
  const isNew = !fs.existsSync(output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const db = new DatabaseSync(output);
  try {
    if (isNew) {
      createSchema(db);
      db.exec('CREATE INDEX idx_entries_norm ON entries(word_norm)');
      db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('entries', '0');
    }
    const count = writeLexicon(db);
    db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
    return { count, isNew, output };
  } finally {
    db.close();
  }
}

module.exports = { buildLexicon };

if (require.main === module) {
  const { count, isNew, output } = buildLexicon(process.argv[2] || DEFAULT_OUT);
  console.log(`✅ ${count} lexicon entries → ${output}${isNew ? ' (new file, lexicon only: run build:dict for the Wiktionary entries)' : ''}`);
}
