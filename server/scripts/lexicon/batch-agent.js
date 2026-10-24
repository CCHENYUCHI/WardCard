#!/usr/bin/env node
/**
 * Write common-word lexicon batches with Gemini working as an agent (start_batch on the antigravity MCP server):
 * one job per batch of 100 words; small gaps a queue rebuild leaves in written batches are pooled into one job.
 * The agent gets the rules, the words' Wiktionary facts and a check.mjs built from
 * the same rules as the local check (batchCheck.js); it writes output.json and runs the check until it passes.
 * Words it judges to be names, places, English words or fragments it marks { word, skip: reason } instead.
 * Back here every entry is checked again (geminiEntries.checkAnswer): passing entries go into freq/<batch>.json,
 * skips into freq-skip.json (build-queue.js leaves those words out), the rest into <work>/failed.json.
 * Only counts are printed. Batches run one after another; re-running skips words already written.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node server/scripts/lexicon/batch-agent.js <queue.json> [--batches 0031-0040]
 *          [--model gemini-3.8-flash-medium] [--work <dir>] [--poll 60]
 */
const fs = require('fs');
const path = require('path');
const { lexiconKey } = require('../../lexicon');
const { AgyClient } = require('./agy');
const { factsLemma, factInfo, compactFacts, parseEntries, checkAnswer, RULES } = require('./geminiEntries');
const { buildCheckScript } = require('./batchCheck');
const { AGENT_SKIP_FILE } = require('./build-queue');
const { batchRange, readBatch, writeBatch, exampleEntries } = require('./gemini-write');

const DEFAULT_MODEL = 'gemini-3.8-flash-medium';
const GAP_SIZE = 50; // a batch with fewer words left than this is a gap, pooled with other gaps
const JOB_SIZE = 100;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const TASK = (count) => `# 任務：寫 ${count} 筆西語字源圖鑑條目

1. 讀 \`RULES.md\`（撰寫規則與兩個範例條目）和 \`input.json\`（要寫的字，每個字附 Wiktionary 事實 \`facts\`）。
2. 把結果寫成 \`output.json\`：一個 JSON 陣列，\`input.json\` 的每個字一個物件，順序相同。可以分段寫、多次覆寫。
3. 每寫完約 20 個字就在這個資料夾執行 \`node ../check.mjs\`，照它列出的錯誤修正。直到它印出「all done」才算完成。
4. 如果某個字在一般西語文章裡其實主要是**人名、姓氏、地名、國名、品牌、英文字、縮寫或字的片段**（例如 luis、toledo、whatsapp、ps），
   不要硬寫冷門字義，改寫成 \`{ "word": "<字>", "skip": "<一句原因>" }\`。
   如果某個字在一般文章裡主要是**另一個字的變化形**（動詞變位或過去分詞，例如 apuesto、encontrado、cayo；
   陰性或複數形容詞，例如 honda、redonda、petrolera），也一樣跳過，原因寫「form of <原形>」。真正獨立的西語字不要跳過。
5. 中文一律用繁體中文、台灣用語。字源只能根據 facts，不要自己補。
6. 完成後回報：寫了幾個字、跳過幾個、還有沒有修不好的錯誤。
`;

function readSkips() {
  return fs.existsSync(AGENT_SKIP_FILE) ? JSON.parse(fs.readFileSync(AGENT_SKIP_FILE, 'utf8')) : {};
}

function saveSkips(skips) {
  const sorted = Object.fromEntries(Object.entries(skips).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(AGENT_SKIP_FILE, `${JSON.stringify(sorted, null, 1)}\n`);
}

/** Run one start_batch job to its end: { status, output, stats, error } */
async function runJob(client, args, pollMs) {
  const { job_id: jobId } = await client.callJson('start_batch', args);
  for (;;) {
    await sleep(pollMs);
    let job;
    try {
      job = await client.callJson('get_batch', { job_id: jobId });
    } catch (err) {
      if (/unknown job/i.test(err.message)) return { status: 'failed', error: 'server lost the job (restarted?)' };
      continue; // network hiccup: ask again next round
    }
    if (['done', 'failed', 'cancelled'].includes(job.status)) return job;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const at = args.indexOf(name);
    return at >= 0 ? args.splice(at, 2)[1] : fallback;
  };
  const batchesSpec = opt('--batches', 'all');
  const model = opt('--model', DEFAULT_MODEL);
  const pollMs = Number(opt('--poll', 60)) * 1000;
  const [queuePath] = args;
  if (!queuePath) {
    console.error('Usage: batch-agent.js <queue.json> [--batches 0031-0040] [--model id] [--work dir] [--poll 60]');
    process.exit(1);
  }
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const workDir = opt('--work', path.dirname(path.resolve(queuePath)));
  const failedPath = path.join(workDir, 'failed.json');
  const failedLog = fs.existsSync(failedPath) ? JSON.parse(fs.readFileSync(failedPath, 'utf8')) : {};
  const rules = `${RULES}\n\n## 參考範例（品質與語氣標準）\n\n\`\`\`json\n${JSON.stringify(exampleEntries(), null, 2)}\n\`\`\`\n`;
  const client = new AgyClient();
  const readFacts = (word) => JSON.parse(fs.readFileSync(path.join(queue.factsDir, `${word}.json`), 'utf8'));

  // One job for a list of { id, facts }: the words of one batch, or small gaps from several batches after a rebuild
  async function runUnit(unit) {
    const label = [...new Set(unit.map(u => u.id))].join('+');
    const todo = unit.map(u => u.facts);
    const input = todo.map(f => ({ word: factsLemma(f), facts: compactFacts(f) }));
    const started = Date.now();
    const job = await runJob(client, {
      task: TASK(todo.length),
      files: { 'RULES.md': rules, 'input.json': JSON.stringify(input, null, 1) },
      check: buildCheckScript(todo.map(factInfo)),
      output_file: 'output.json',
      model
    }, pollMs);
    const minutes = ((Date.now() - started) / 60000).toFixed(1);
    if (job.status !== 'done') {
      console.log(`batch ${label}: job ${job.status} after ${minutes} min: ${String(job.error || '').slice(0, 200)}`);
      return;
    }
    let answer;
    try { answer = parseEntries(job.output); } catch (err) {
      console.log(`batch ${label}: output.json unreadable (${err.message}) after ${minutes} min`);
      return;
    }
    const skips = readSkips();
    const asked = new Map(todo.map(f => [lexiconKey(factsLemma(f)), factsLemma(f)]));
    let skipped = 0;
    for (const e of answer.filter(x => x.skip && asked.has(lexiconKey(x.word)))) {
      skips[asked.get(lexiconKey(e.word))] = String(e.skip).slice(0, 120);
      skipped++;
    }
    const keep = todo.filter(f => !Object.hasOwn(skips, factsLemma(f)));
    const results = checkAnswer(answer.filter(x => !x.skip), keep);
    const batchOf = new Map(unit.map(u => [factsLemma(u.facts), u.id]));
    const written = new Map(); // batch id -> entries to add
    let added = 0;
    let failed = 0;
    for (const [word, { entry, errors }] of Object.entries(results)) {
      if (entry && errors.length === 0) {
        if (!written.has(batchOf.get(word))) written.set(batchOf.get(word), []);
        written.get(batchOf.get(word)).push(entry);
        delete failedLog[word];
        added++;
      } else {
        failedLog[word] = { batch: batchOf.get(word), errors };
        failed++;
      }
    }
    for (const id of new Set(unit.map(u => u.id))) {
      const entriesByKey = new Map((readBatch(id)?.entries || []).map(e => [lexiconKey(e.word), e]));
      for (const e of written.get(id) || []) entriesByKey.set(lexiconKey(e.word), e);
      writeBatch(id, queue.batches[id].filter(it => !Object.hasOwn(skips, it.lemma)), entriesByKey);
    }
    saveSkips(skips);
    fs.writeFileSync(failedPath, JSON.stringify(failedLog, null, 1));
    const tokens = job.stats?.usage?.total_tokens;
    console.log(`batch ${label}: +${added} written, ${skipped} skipped, ${failed} failed in ${minutes} min${tokens ? ` (${tokens} tokens)` : ''}`);
  }

  // Words still to write, batch by batch; small gaps (left by a queue rebuild) are pooled into one job
  let gaps = [];
  for (const id of batchRange(batchesSpec, Object.keys(queue.batches).sort())) {
    const done = new Set((readBatch(id)?.entries || []).map(e => lexiconKey(e.word)));
    const skips = readSkips();
    const todo = queue.batches[id].filter(it => !done.has(lexiconKey(it.lemma)) && !Object.hasOwn(skips, it.lemma))
      .map(it => ({ id, facts: readFacts(it.word) }));
    if (todo.length === 0) continue;
    if (todo.length < GAP_SIZE) {
      gaps.push(...todo);
      if (gaps.length >= JOB_SIZE) { await runUnit(gaps); gaps = []; }
      continue;
    }
    if (gaps.length) { await runUnit(gaps); gaps = []; }
    await runUnit(todo);
  }
  if (gaps.length) await runUnit(gaps);
}

if (require.main === module) main().catch(err => { console.error(err.message); process.exit(1); });
