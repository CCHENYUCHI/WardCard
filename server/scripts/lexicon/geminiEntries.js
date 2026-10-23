/**
 * Gemini-written lexicon entries: the prompt, and the machine checks that stand in for a human (or Claude) review.
 * An entry is kept only if it follows the schema (validate.js), is in Traditional Chinese, and every ancestor in its
 * origin chain appears in the Wiktionary facts it was written from. Without etymology facts it becomes hook-only.
 */
const { normalizeWord } = require('../../cardUtils');
const { lexiconKey } = require('../../lexicon');
const { validateEntry } = require('./validate');
const { pageTitle } = require('./fetch-facts');

// Characters that only exist in Simplified Chinese (their Traditional forms differ); a hit means the text is not zh-TW
const SIMPLIFIED = new Set('这说们么来时个为学语词发过对没还进动问题门间东车长开关见现实处么给让应该样经书话请认识体气业头买卖鱼鸟马们边远运选亲爱觉历层岁儿号图钱银钟铁闭阳阴际随难风飞饭馆饮'.split(''));

const stripMarks = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// Ancestor spellings are compared without accents, macrons, reconstruction stars and affix hyphens
const ancestorKey = (s) => stripMarks(s).replace(/^\*|[*\-()]/g, '').trim();

/** The lemma a facts file describes (an inflected form's facts hold its base word's entries) */
const factsLemma = (facts) => facts.base || facts.word;

function hasEtymology(facts) {
  return (facts.entries || []).some(e => (e.etymology_text || '').trim() || (e.etymology?.origins || []).length);
}

/** Everything an origin chain may cite: ancestor words, affix parts and the words named in the etymology texts */
function factCorpus(facts) {
  const texts = [];
  for (const e of facts.entries || []) {
    texts.push(e.word, e.etymology_text || '');
    for (const o of e.etymology?.origins || []) texts.push(o.word, o.alt || '');
    for (const p of e.etymology?.parts || []) texts.push(...p.items);
  }
  for (const a of facts.ancestors || []) {
    texts.push(a.word, a.etymology_text || '');
    for (const o of a.etymology?.origins || []) texts.push(o.word, o.alt || '');
  }
  return ancestorKey(texts.join(' \n '));
}

/** Wiktionary pages the facts came from, in the "wiktionary:<lang>:<page>" form entries cite */
function factSources(facts) {
  const out = new Set();
  if ((facts.entries || []).length) out.add(`wiktionary:es:${facts.word}`);
  if (facts.base) out.add(`wiktionary:es:${facts.base}`);
  for (const a of facts.ancestors || []) if (a.lang === 'Latin') out.add(`wiktionary:la:${pageTitle('Latin', a.word)}`);
  return out;
}

/** Facts trimmed to what the writer needs, to keep the prompt small */
function compactFacts(facts) {
  const cut = (s, n) => (s && s.length > n ? `${s.slice(0, n)}…` : s || '');
  return {
    word: factsLemma(facts),
    asked_form: facts.base ? facts.word : undefined,
    entries: (facts.entries || []).slice(0, 3).map(e => ({
      pos: e.pos, head: e.head, ipa: e.ipa?.[0], glosses: (e.glosses || []).slice(0, 4),
      etymology: cut(e.etymology_text, 600),
      parts: (e.etymology?.parts || []).map(p => p.items.join(' + ')),
      cognates_en: e.etymology?.cognates || [],
      examples: (e.examples || []).slice(0, 1)
    })),
    ancestors: (facts.ancestors || []).slice(0, 6).map(a => ({
      lang: a.lang, word: a.word, glosses: (a.glosses || []).slice(0, 3), etymology: cut(a.etymology_text, 300)
    }))
  };
}

const RULES = `你是 PalabraCard 西語字典的編輯，讀者是學西語的台灣人。根據我給的 Wiktionary 事實，為每個字寫一筆字源圖鑑條目。
只輸出一個 JSON 陣列，每個字一個物件，順序和字表相同，不要任何說明文字或 markdown。所有中文用繁體中文、台灣用語。
欄位（全部必填）：
- word：照字表原樣。article：名詞填 "el" 或 "la"（陰陽同形的人名詞填 "el"），非名詞填 ""。
- pos：sustantivo / verbo / adjetivo / adverbio / frase / conjunción / preposición / pronombre / interjección / artículo / determinante / numeral 其中一個。
- zh：精準簡短的中文意思（≤40 字）。en：英文（≤60 字元）。ipa：用事實裡第一個 IPA，沒有就寫西班牙本土發音 /…/。
- breakdown：有清楚的字首 / 字根 / 字尾構詞才填 [{"part","zh"}]（例如 "trans-" 跨越、"port" 搬運、"-ar" 動詞字尾），每塊附中文意思；沒有就 []。
- origin_chain：從最早可靠的祖先到這個西語字，每層 {"lang_zh","word","zh"}，lang_zh 用中文語言名（拉丁語、通俗拉丁語、古希臘語、阿拉伯語、古西班牙語…）。只能寫事實裡出現的字，不要自己補；沒有詞源就 []。
- cognates_en：確定同源、台灣學生認得的英文字；沒有就 []。
- story_zh：字源故事 2–4 句（≤220 字），用中文解釋字根的意思和字義怎麼演變，幫助理解。只能根據事實寫；事實說 uncertain / possibly 就寫「可能、推測」。沒有詞源就 ""。
- hook_zh：記憶聯想（≤80 字），可用英文同源字、畫面、和常見字的連結；要有畫面感。不能假裝是字源。
- usage_zh：一句文法或用法提醒（≤90 字，可為 ""）：不規則變化、陰陽性陷阱、常見搭配、假朋友。
- example_es / example_zh：自然、簡單、生活化的短句（西語 ≤90 字元，中文 ≤60 字），西語句子必須包含這個字或它的規則變化形。
- image："emoji:" 加一個最能代表這個字的 emoji。
- confidence：有詞源事實、而且 story_zh 和 origin_chain 都有寫 → "sourced"；否則 "hook-only"。
- sources：實際用到的頁面，例如 ["wiktionary:es:<字>", "wiktionary:la:<拉丁頁名，不含長音符號>"]。`;

/** The prompt for one call: rules, two reference entries, the words' facts, and (on a retry) what was wrong last time */
function buildPrompt(factsList, examples = [], problems = {}) {
  const words = factsList.map(factsLemma);
  const parts = [RULES];
  if (examples.length) parts.push(`參考範例（品質與語氣標準）：\n${JSON.stringify(examples)}`);
  parts.push(`字表：${JSON.stringify(words)}`);
  parts.push(`事實：\n${factsList.map(f => JSON.stringify(compactFacts(f))).join('\n')}`);
  const retry = Object.entries(problems).filter(([, errs]) => errs.length);
  if (retry.length) {
    parts.push(`上一次的輸出有這些問題，這次要修正：\n${retry.map(([w, errs]) => `- ${w}: ${errs.join('; ')}`).join('\n')}`);
  }
  return parts.join('\n\n');
}

/** The JSON array in Gemini's answer (tolerates ```json fences and text around it) */
function parseEntries(text) {
  const s = String(text || '');
  const start = s.indexOf('[');
  const end = s.lastIndexOf(']');
  if (start < 0 || end <= start) throw new Error('no JSON array in the answer');
  const data = JSON.parse(s.slice(start, end + 1));
  if (!Array.isArray(data)) throw new Error('answer is not an array');
  return data.filter(e => e && typeof e === 'object');
}

const hasSimplified = (s) => [...String(s || '')].some(ch => SIMPLIFIED.has(ch));
const ZH_FIELDS = ['zh', 'story_zh', 'hook_zh', 'usage_zh', 'example_zh'];

/**
 * Check one entry against its facts. Returns { entry, errors }: the entry with the fixes a machine can make
 * (writer tag, sources limited to the fetched pages, hook-only without etymology facts), and what it cannot fix.
 */
function checkEntry(raw, facts) {
  const lemma = factsLemma(facts);
  const entry = { ...raw, writer: 'gemini' };
  const errors = [];
  if (lexiconKey(entry.word) !== lexiconKey(lemma)) errors.push(`word should be "${lemma}"`);
  entry.word = lemma;
  for (const k of ['breakdown', 'origin_chain', 'cognates_en', 'sources']) if (!Array.isArray(entry[k])) entry[k] = [];
  for (const k of ['story_zh', 'usage_zh', 'article']) if (typeof entry[k] !== 'string') entry[k] = '';

  const allowed = factSources(facts);
  entry.sources = entry.sources.filter(s => allowed.has(s));
  if (allowed.has(`wiktionary:es:${lemma}`) && !entry.sources.includes(`wiktionary:es:${lemma}`)) entry.sources.unshift(`wiktionary:es:${lemma}`);

  if (!hasEtymology(facts)) {
    entry.origin_chain = [];
    entry.story_zh = '';
    entry.confidence = 'hook-only';
  } else {
    const corpus = factCorpus(facts);
    const lemmaKey = ancestorKey(lemma);
    for (const layer of entry.origin_chain) {
      const key = ancestorKey(layer?.word);
      if (!key) { errors.push('origin_chain has an empty word'); continue; }
      if (key === lemmaKey || corpus.includes(key)) continue;
      errors.push(`origin_chain word "${layer.word}" is not in the facts`);
    }
    entry.confidence = entry.story_zh && entry.origin_chain.length ? 'sourced' : 'hook-only';
    if (entry.confidence === 'sourced' && entry.sources.length === 0) entry.sources = [...allowed].slice(0, 1);
  }

  for (const k of ZH_FIELDS) if (hasSimplified(entry[k])) errors.push(`${k} uses Simplified Chinese`);
  if (typeof entry.image !== 'string' || !/^emoji:\S+$/u.test(entry.image)) entry.image = 'emoji:📘';
  errors.push(...validateEntry(entry));
  return { entry, errors };
}

/** Match Gemini's entries to the facts they were asked for; words missing from the answer get an error */
function checkAnswer(entries, factsList) {
  const byWord = new Map(entries.map(e => [lexiconKey(e.word), e]));
  const results = {};
  for (const facts of factsList) {
    const lemma = factsLemma(facts);
    const raw = byWord.get(lexiconKey(lemma)) || entries.find(e => normalizeWord(e.word) === normalizeWord(lemma));
    results[lemma] = raw ? checkEntry(raw, facts) : { entry: null, errors: ['missing from the answer'] };
  }
  return results;
}

module.exports = { factsLemma, hasEtymology, factCorpus, factSources, compactFacts, buildPrompt, parseEntries, hasSimplified, checkEntry, checkAnswer };
