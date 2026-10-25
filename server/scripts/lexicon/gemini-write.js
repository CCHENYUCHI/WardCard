#!/usr/bin/env node
/**
 * Write common-word lexicon entries with Gemini (ask_gemini on the antigravity MCP server) straight into
 * server/data/lexicon/freq/<batch>.json. Nobody reads Gemini's text on the way: each entry must pass the
 * machine checks in geminiEntries.js (schema, Traditional Chinese, origin chain found in the facts); a failing
 * word is asked again once with the problems listed, then recorded in <work>/failed.json and skipped.
 * Only counts are printed. Re-running skips words already written, so the script can be stopped at any time.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node server/scripts/lexicon/gemini-write.js <queue.json> [--batches 0001-0005]
 *          [--model gemini-3.8-flash-high] [--per-call 5] [--concurrency 1] [--work <dir>]
 */
const fs = require('fs');
const path = require('path');
const { LEXICON_ROOT, lexiconKey } = require('../../lexicon');
const { AgyClient } = require('./agy');
const { buildPrompt, parseEntries, checkAnswer, factsLemma } = require('./geminiEntries');

const FREQ_DIR = path.join(LEXICON_ROOT, 'freq');
const DEFAULT_MODEL = 'gemini-3.8-flash-high';
const EXAMPLE_WORDS = ['preocupar', 'barato']; // a sourced entry with a breakdown and a hook-only one
const QUOTA = /quota|rate.?limit|429|resource.?exhausted|too many/i;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function exampleEntries() {
  const dir = path.join(LEXICON_ROOT, 'a1');
  const out = [];
  for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.json'))) {
    for (const e of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).entries || []) {
      if (EXAMPLE_WORDS.includes(e.word)) out.push(e);
    }
  }
  return out;
}

function batchRange(spec, ids) {
  if (!spec || spec === 'all') return ids;
  const [from, to = from] = spec.split('-').map(s => s.padStart(4, '0'));
  return ids.filter(id => id >= from && id <= to);
}

const batchFile = (id) => path.join(FREQ_DIR, `${id}.json`);

function readBatch(id) {
  const file = batchFile(id);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

/** Write a batch file with its entries in queue order */
function writeBatch(id, items, entriesByKey) {
  const first = items[0].rank;
  const last = items[items.length - 1].rank;
  // mark-drawn.js may have switched pictures on in the file meanwhile: keep them
  const onDisk = new Map((readBatch(id)?.entries || []).map(e => [lexiconKey(e.word), e.image]));
  const entries = items.map(it => entriesByKey.get(lexiconKey(it.lemma))).filter(Boolean)
    .map(e => (onDisk.get(lexiconKey(e.word)) === 'svg' ? { ...e, image: 'svg' } : e));
  fs.mkdirSync(FREQ_DIR, { recursive: true });
  fs.writeFileSync(batchFile(id), `${JSON.stringify({ theme: `freq-${id}`, theme_zh: `常用字（頻率第 ${first}–${last} 名）`, entries }, null, 2)}\n`);
}

/** Ask Gemini, waiting out quota errors and retrying network failures a few times */
async function ask(client, prompt, model) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await client.ask(prompt, { model });
    } catch (err) {
      if (attempt >= 4) throw err;
      await sleep(QUOTA.test(err.message) ? 60000 * attempt : 5000 * attempt);
    }
  }
}

/** One call for a group of words (and one retry for the words that failed the checks). Returns { ok: [entries], failed: { word: errors } } */
async function writeGroup(client, factsList, { model, examples }) {
  const ok = [];
  let todo = factsList;
  let problems = {};
  for (let round = 0; round < 2 && todo.length; round++) {
    let results;
    try {
      results = checkAnswer(parseEntries(await ask(client, buildPrompt(todo, examples, problems), model)), todo);
    } catch (err) {
      if (QUOTA.test(err.message)) throw err;
      results = Object.fromEntries(todo.map(f => [factsLemma(f), { entry: null, errors: [`answer: ${err.message.slice(0, 120)}`] }]));
    }
    problems = {};
    for (const [word, { entry, errors }] of Object.entries(results)) {
      if (entry && errors.length === 0) ok.push(entry);
      else problems[word] = errors;
    }
    todo = todo.filter(f => problems[factsLemma(f)]);
  }
  return { ok, failed: problems };
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const at = args.indexOf(name);
    return at >= 0 ? args.splice(at, 2)[1] : fallback;
  };
  const batchesSpec = opt('--batches', 'all');
  const model = opt('--model', DEFAULT_MODEL);
  const perCall = Number(opt('--per-call', 5));
  const concurrency = Number(opt('--concurrency', 1));
  const [queuePath] = args;
  if (!queuePath) {
    console.error('Usage: gemini-write.js <queue.json> [--batches 0001-0005] [--model id] [--per-call 5] [--concurrency 1] [--work dir]');
    process.exit(1);
  }
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const workDir = opt('--work', path.dirname(path.resolve(queuePath)));
  const failedPath = path.join(workDir, 'failed.json');
  const failedLog = fs.existsSync(failedPath) ? JSON.parse(fs.readFileSync(failedPath, 'utf8')) : {};
  const examples = exampleEntries();
  const client = new AgyClient();
  const readFacts = (word) => JSON.parse(fs.readFileSync(path.join(queue.factsDir, `${word}.json`), 'utf8'));

  for (const id of batchRange(batchesSpec, Object.keys(queue.batches).sort())) {
    const items = queue.batches[id];
    const existing = readBatch(id);
    const entriesByKey = new Map((existing?.entries || []).map(e => [lexiconKey(e.word), e]));
    const todo = items.filter(it => !entriesByKey.has(lexiconKey(it.lemma))).map(it => readFacts(it.word));
    if (todo.length === 0) continue;
    const groups = [];
    for (let i = 0; i < todo.length; i += perCall) groups.push(todo.slice(i, i + perCall));
    const stats = { written: 0, failed: 0 };
    let stop = null;
    let next = 0;
    const worker = async () => {
      while (next < groups.length && !stop) {
        const group = groups[next++];
        try {
          const { ok, failed } = await writeGroup(client, group, { model, examples });
          for (const e of ok) { entriesByKey.set(lexiconKey(e.word), e); delete failedLog[e.word]; }
          for (const [word, errors] of Object.entries(failed)) failedLog[word] = { batch: id, errors };
          stats.written += ok.length;
          stats.failed += Object.keys(failed).length;
          writeBatch(id, items, entriesByKey);
          fs.writeFileSync(failedPath, JSON.stringify(failedLog, null, 1));
        } catch (err) {
          stop = err;
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, groups.length) }, worker));
    const entries = [...entriesByKey.values()];
    const sourced = entries.filter(e => e.confidence === 'sourced').length;
    console.log(`batch ${id}: +${stats.written} written, ${stats.failed} failed; file has ${entries.length}/${items.length} (${sourced} sourced, ${entries.length - sourced} hook-only)`);
    if (stop) {
      console.error(`stopped: ${stop.message.slice(0, 200)}`);
      process.exit(2);
    }
  }
}

module.exports = { batchRange, readBatch, writeBatch, exampleEntries, FREQ_DIR };

if (require.main === module) main();
