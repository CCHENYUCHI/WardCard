#!/usr/bin/env node
/**
 * Link every card to its offline-dictionary entry (cards.dict_lemma / dict_pos).
 * The server does this for new and unlinked cards by itself; run this after rebuilding the dictionary
 * (`--relink` looks every card up again) or to see the numbers.
 *
 * Usage: node server/scripts/link-cards.js [--relink]
 */
const db = require('../db');
const { dictionaryHasEntries } = require('../dictionary');
const { linkPendingCards } = require('../cardDict');

if (!dictionaryHasEntries()) {
  console.error('No dictionary with entries found (npm run build:dict); nothing to link.');
  process.exit(1);
}
const { checked, linked } = linkPendingCards(db, { relink: process.argv.includes('--relink') });
const total = db.prepare('SELECT COUNT(*) AS n FROM cards').get().n;
const unlinked = db.prepare("SELECT word FROM cards WHERE dict_lemma = '' ORDER BY word LIMIT 30").all().map(r => r.word);
console.log(`✅ checked ${checked} of ${total} cards, linked ${linked}`);
if (unlinked.length) console.log(`Without a dictionary entry (first ${unlinked.length}): ${unlinked.join(', ')}`);
