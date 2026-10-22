// Client side of the shared word lookup (dictionary page + tap-a-word popover).
import { fetchAPI } from './api';

const lookupCache = new Map(); // `${q}|${sentence}` -> lookup result, per page load

async function readJson(res, fallbackError) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || fallbackError);
  return data;
}

/** Offline layers only (Wiktionary, my cards, AI caches); never spends AI quota. */
export async function lookupWord(q, sentence = '') {
  const key = `${q.toLowerCase()}|${sentence}`;
  if (lookupCache.has(key)) return lookupCache.get(key);
  const params = new URLSearchParams({ q });
  if (sentence) params.set('sentence', sentence);
  const data = await readJson(await fetchAPI(`/api/dictionary/lookup?${params}`), '查詢失敗');
  lookupCache.set(key, data);
  return data;
}

// Results change after an AI call or after adding a card
export const clearLookupCache = () => lookupCache.clear();

const lexiconCache = new Map(); // word -> lexicon entry or null, per page load

/** Hand-written lexicon entry (story, memory hook, picture) for a card's word, or null. */
export async function getLexiconEntry(word) {
  const key = String(word || '').trim().toLowerCase();
  if (!key) return null;
  if (!lexiconCache.has(key)) {
    lexiconCache.set(key, fetchAPI(`/api/lexicon?${new URLSearchParams({ word: key })}`)
      .then(res => readJson(res, '查詢失敗'))
      .then(data => data.entry)
      .catch(err => { lexiconCache.delete(key); throw err; }));
  }
  return lexiconCache.get(key);
}

/** AI word-by-word analysis of a whole sentence (cached on the server, shared). */
export async function analyzeSentence(sentence) {
  const data = await readJson(await fetchAPI('/api/sentences/analyze', {
    method: 'POST',
    body: JSON.stringify({ sentence })
  }), 'AI 解析失敗');
  clearLookupCache();
  return data;
}

/** AI dictionary entry as a ready-to-save card (cached on the server, shared). */
export async function aiLookup(q) {
  const data = await readJson(await fetchAPI('/api/dictionary/ai', {
    method: 'POST',
    body: JSON.stringify({ q })
  }), 'AI 查詢失敗');
  clearLookupCache();
  return data.card;
}

/** Add to the Inbox; an existing card is left untouched. */
export async function addToInbox(card) {
  const data = await readJson(await fetchAPI('/api/dictionary/add', {
    method: 'POST',
    body: JSON.stringify(card)
  }), '加入失敗');
  clearLookupCache();
  return data;
}

export const POS_LABELS = {
  sustantivo: '名詞', verbo: '動詞', adjetivo: '形容詞', adverbio: '副詞', frase: '片語/其他',
  'conjunción': '連接詞', 'preposición': '介系詞', pronombre: '代名詞', 'interjección': '感嘆詞'
};

const GENDER_LABELS = { masculino: '陽性', femenino: '陰性' };
export const genderLabel = (g) => GENDER_LABELS[g] || '';

// Wiktionary grammar tags -> Chinese; anything unknown keeps the English original
const TAG_ZH = {
  'first-person': '第一人稱', 'second-person': '第二人稱', 'third-person': '第三人稱',
  singular: '單數', plural: '複數', masculine: '陽性', feminine: '陰性',
  present: '現在', preterite: '簡單過去式', imperfect: '過去未完成', future: '未來式',
  conditional: '條件式', indicative: '陳述式', subjunctive: '虛擬式', imperative: '命令式',
  gerund: '現在分詞', participle: '分詞', past: '過去', infinitive: '不定式',
  affirmative: '肯定', negative: '否定', formal: '尊稱', informal: '非正式',
  combined: '連寫', with: '加', and: '與', or: '或', of: '的', 'present/preterite': '現在/簡單過去式',
  accusative: '受格', dative: '與格', nominative: '主格', diminutive: '指小詞', augmentative: '指大詞',
  'voseo': 'vos 用法', 'tú': 'tú', 'usted': 'usted', 'ustedes': 'ustedes', 'vos': 'vos'
};

export function describeForm(via) {
  if (!via) return '';
  const words = via.replace(/[,;()]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length > 8 || !words.every(w => TAG_ZH[w.toLowerCase()])) return via;
  return words.map(w => TAG_ZH[w.toLowerCase()]).join(' ');
}

export const STAGE_LABELS = { 1: 'S1', 2: 'S2', 3: 'S3', 4: 'S4', 5: 'S5' };
export const STATUS_LABELS = { inbox: '暫存箱', ready: '待學', active: '學習中', mastered: '已精通', frozen: '凍結' };
