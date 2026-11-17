const { splitArticle } = require('./cardUtils');
const { getLanguage } = require('./languages');

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.6-flash';
const DEFAULT_FALLBACK_MODEL = 'gemini-3.5-flash-lite';
const DEFAULT_TIMEOUT_MS = 60_000;

// Shared internal codes for every learning language (the UI maps them to labels)
const PARTS_OF_SPEECH = ['sustantivo', 'verbo', 'adjetivo', 'adverbio', 'frase', 'conjunción', 'preposición', 'pronombre', 'interjección'];
const DELE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
// Language-specific pieces (articles, genders, inflection forms, prompt text) come from
// server/languages/<code>.js; every function below takes a `lang` code, defaulting to Spanish.

const getPrimaryModel = () => process.env.GEMINI_MODEL || DEFAULT_MODEL;
const getFallbackModel = () => process.env.GEMINI_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL;

class GeminiError extends Error {
  constructor(message, { status = 500, retryable = false } = {}) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
    this.retryable = retryable;
  }
}

// Translate a Gemini HTTP failure into a user-facing message.
// Never map to 401/403: the web client treats those as an expired login.
function toGeminiError(status, apiMessage, model) {
  const msg = apiMessage || '';
  if (status === 400 && /api key/i.test(msg)) {
    return new GeminiError('Gemini API Key 無效，請到設定頁確認您的 Key 是否正確。', { status: 400 });
  }
  if (status === 401 || status === 403) {
    return new GeminiError('Gemini API Key 沒有權限使用此模型，請確認 Key 是否已啟用 Gemini API。', { status: 400 });
  }
  if (status === 404) {
    return new GeminiError(`找不到 Gemini 模型「${model}」，可能已下架。請更新伺服器的 GEMINI_MODEL 設定。`, { status: 502, retryable: true });
  }
  if (status === 429) {
    return new GeminiError('Gemini API 額度已用完或請求太頻繁，請稍後再試。', { status: 429, retryable: true });
  }
  if (status >= 500) {
    return new GeminiError(`Gemini 服務暫時無法使用 (${status})，請稍後再試。`, { status: 502, retryable: true });
  }
  return new GeminiError(`Gemini API 錯誤 (${status})：${msg}`, { status: 502 });
}

async function requestModel(model, { apiKey, body, timeoutMs }) {
  let res;
  try {
    res = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new GeminiError('AI 回應逾時，請縮短內容或稍後再試。', { status: 504 });
    }
    throw new GeminiError(`無法連線到 Gemini API：${err.message}`, { status: 502, retryable: true });
  }

  const raw = await res.text();
  if (!res.ok) {
    let apiMessage = raw;
    try {
      apiMessage = JSON.parse(raw).error?.message || raw;
    } catch (_) { /* keep raw text */ }
    throw toGeminiError(res.status, apiMessage, model);
  }
  return JSON.parse(raw);
}

/**
 * Shared Gemini call with structured JSON output and automatic model fallback.
 * @returns {Promise<{ data: any, usage: object, model: string }>}
 */
async function callGemini({
  apiKey,
  parts,
  systemInstruction,
  responseSchema,
  temperature = 0.2,
  model = getPrimaryModel(),
  fallbackModel = getFallbackModel(),
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  if (!apiKey) {
    throw new GeminiError('未提供 Gemini API Key。請在設定中填寫或在伺服端 .env 中設定 GEMINI_API_KEY。', { status: 400 });
  }

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
      ...(responseSchema ? { responseSchema } : {})
    }
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  let response;
  let usedModel = model;
  try {
    response = await requestModel(model, { apiKey, body, timeoutMs });
  } catch (err) {
    if (!err.retryable || !fallbackModel || fallbackModel === model) throw err;
    console.warn(`[AI] ${model} 失敗 (${err.message})，改用備援模型 ${fallbackModel}`);
    usedModel = fallbackModel;
    response = await requestModel(fallbackModel, { apiKey, body, timeoutMs });
  }

  const candidate = response.candidates?.[0];
  const text = candidate?.content?.parts?.map(p => p.text || '').join('').trim();
  if (!text) {
    const reason = candidate?.finishReason || response.promptFeedback?.blockReason;
    throw new GeminiError(`AI 未回傳內容${reason ? `（原因：${reason}）` : ''}，請調整內容後重試。`, { status: 502 });
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (_) {
    throw new GeminiError('AI 回傳的資料格式不正確，請重試一次。', { status: 502 });
  }

  const usage = {
    inputTokens: response.usageMetadata?.promptTokenCount || 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount || 0
  };
  return { data, usage, model: usedModel };
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const pick = (value, allowed, fallback) => {
  const v = str(value);
  const match = allowed.find(a => a.toLowerCase() === v.toLowerCase());
  return match || fallback;
};

// Inflection forms without articles, keyed by the language's formKeys
// (es: { masc_sg: 'alto', fem_sg: 'alta', … }, de: { plural: 'Häuser', genitive: 'des Hauses', … })
function normalizeForms(forms, lang = 'es') {
  if (!forms || typeof forms !== 'object') return null;
  const { formKeys: keys, formsKeepArticle = [] } = getLanguage(lang).ai;
  const out = {};
  for (const key of keys) {
    out[key] = formsKeepArticle.includes(key) ? str(forms[key]) : splitArticle(str(forms[key]), '', lang).word;
  }
  return keys.some(k => out[k]) ? out : null;
}

// Human-readable forms ("陽性：alto / altos；陰陽性：alta / altas"), kept in notes so every client shows it
function formatForms(forms, lang = 'es') {
  return getLanguage(lang).ai.formatForms(forms);
}

// Definite article -> gender, singular articles first (de: der/die/das; es: el/la, then los/las)
function articleGenders(L) {
  const map = {};
  for (const table of [L.articles.definite, L.articles.plural]) {
    for (const [gender, art] of Object.entries(table || {})) if (!(art in map)) map[art] = gender;
  }
  return map;
}

// Clean one AI-produced card so it is safe to show and save
function normalizeAiCard(card, lang = 'es') {
  if (!card || typeof card !== 'object') return null;
  const L = getLanguage(lang);
  const { word, article: rawArticle } = splitArticle(str(card.word), str(card.article), lang);
  const translation = str(card.translation);
  if (!word || !translation) return null;

  const partOfSpeech = pick(card.part_of_speech, PARTS_OF_SPEECH, 'frase');
  const isNoun = partOfSpeech === 'sustantivo';
  const isGendered = L.genderedPos.includes(partOfSpeech);
  const forms = L.ai.formsPos.includes(partOfSpeech) ? normalizeForms(card.forms, lang) : null;
  const genderOf = articleGenders(L);

  let article = isNoun && rawArticle in genderOf ? rawArticle : '';
  let gender = isGendered ? pick(card.gender, L.genders, 'none') : 'none';
  if (isNoun && gender === 'none' && article && !(lang === 'de' && article === 'die' && forms && !forms.plural)) {
    // German "die" with no plural form is a plural-only noun (die Eltern): no gender
    gender = genderOf[article];
  }
  if (partOfSpeech === 'adjetivo' && gender === 'none' && forms?.masc_sg && forms?.fem_sg && forms.masc_sg !== forms.fem_sg) {
    // The dictionary form of a variable adjective is the masculine singular
    gender = word === forms.fem_sg ? 'femenino' : 'masculino';
  }
  if (isNoun && !article && gender !== 'none' && L.articles.definite[gender]) {
    // Keep an explicit article even when it disagrees (es: el agua is feminine)
    article = L.articles.definite[gender];
  }

  const formsText = formatForms(forms, lang);
  const notes = str(card.notes);

  return {
    word,
    article,
    gender,
    part_of_speech: partOfSpeech,
    forms,
    translation,
    english_translation: str(card.english_translation),
    definition_es: str(card.definition_es),
    example_es: str(card.example_es),
    example_zh: str(card.example_zh),
    notes: formsText && !notes.includes(L.ai.formsNoteMarker) ? [formsText, notes].filter(Boolean).join('\n') : notes,
    category: str(card.category) || '課堂筆記',
    dele_level: pick(card.dele_level, L.levels, L.defaultLevel || 'A2')
  };
}

// Per-language values memoized: schemas and prompts are built once per language
const memo = (build) => {
  const cache = new Map();
  return (lang = 'es') => {
    const L = getLanguage(lang);
    if (!cache.has(L.code)) cache.set(L.code, build(L));
    return cache.get(L.code);
  };
};

const cardSchema = memo((L) => ({
  type: 'OBJECT',
  properties: {
    word: { type: 'STRING' },
    article: { type: 'STRING' },
    gender: { type: 'STRING', enum: L.genders },
    part_of_speech: { type: 'STRING', enum: PARTS_OF_SPEECH },
    forms: {
      type: 'OBJECT',
      nullable: true,
      properties: Object.fromEntries(L.ai.formKeys.map(k => [k, { type: 'STRING' }]))
    },
    translation: { type: 'STRING' },
    english_translation: { type: 'STRING' },
    definition_es: { type: 'STRING' },
    example_es: { type: 'STRING' },
    example_zh: { type: 'STRING' },
    notes: { type: 'STRING' },
    category: { type: 'STRING' },
    dele_level: { type: 'STRING', enum: L.levels }
  },
  required: ['word', 'article', 'gender', 'part_of_speech', 'translation', 'example_es', 'example_zh', 'dele_level']
}));
const CARD_SCHEMA = cardSchema('es');

const extractInstruction = memo(({ ai }) => `
你是一位${ai.expert}。
你的任務是從使用者提供的課堂筆記、文章段落、生詞清單或講義照片中，萃取並結構化${ai.languageName}生詞卡片，以 JSON 陣列回傳。

欄位說明：
${ai.wordRules}
- part_of_speech：sustantivo / verbo / adjetivo / adverbio / frase / conjunción / preposición / pronombre / interjección
- translation：精準道地的繁體中文釋義
- english_translation：對應的英文翻譯
${ai.definitionRule}
- example_zh：例句的繁體中文翻譯
${ai.notesRule}
${ai.categoryRule}
${ai.levelRule}

規則：
1. 若輸入是「單字清單」或「表格」，務必將所有單字全數轉換，不可遺漏。
2. 若輸入是一整段文章，挑出最值得背誦的重點生詞（無數量限制）。
3. ${ai.spellingRule}
4. 同一個單字只輸出一次。
`);
const EXTRACT_INSTRUCTION = extractInstruction('es');

/**
 * Extract vocabulary cards (in the learning language) from notes text and/or a photo
 * @param {object} params
 * @param {string} params.promptText - Class notes, reading, or word list
 * @param {string} params.apiKey - Gemini API Key
 * @param {object} [params.imageFile] - Optional uploaded image { buffer, mimetype }
 * @param {string} [params.lang] - Learning language code ('es' | 'de')
 */
async function extractWords({ promptText, apiKey, imageFile = null, lang = 'es' }) {
  const L = getLanguage(lang);
  const parts = [];
  if (imageFile) {
    parts.push({
      inline_data: {
        mime_type: imageFile.mimetype || 'image/jpeg',
        data: imageFile.buffer.toString('base64')
      }
    });
  }
  parts.push({
    text: promptText && promptText.trim()
      ? promptText
      : L.ai.photoPrompt
  });

  const { data } = await callGemini({
    apiKey,
    parts,
    systemInstruction: extractInstruction(lang),
    responseSchema: { type: 'ARRAY', items: cardSchema(lang) }
  });

  if (!Array.isArray(data)) {
    throw new GeminiError('AI 回傳的格式非陣列，請重試。', { status: 502 });
  }

  const seen = new Set();
  const cards = [];
  for (const raw of data) {
    const card = normalizeAiCard(raw, lang);
    if (!card) continue;
    const key = card.word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cards.push(card);
  }
  return cards;
}

// Backwards-compatible name
const extractSpanishWords = (params) => extractWords({ ...params, lang: params?.lang || 'es' });

const SENTENCE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    translation_zh: { type: 'STRING' },
    tokens: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          text: { type: 'STRING' },
          lemma: { type: 'STRING' },
          pos: { type: 'STRING', enum: PARTS_OF_SPEECH },
          zh: { type: 'STRING' },
          usage: { type: 'STRING' }
        },
        required: ['text', 'lemma', 'pos', 'zh', 'usage']
      }
    }
  },
  required: ['translation_zh', 'tokens']
};

const sentenceInstruction = memo(({ ai }) => `
你是一位${ai.teacher}，要幫台灣學生逐字解析一個${ai.short}句子，以 JSON 回傳。
- tokens：依句中順序，每個${ai.short}單字一筆（略過標點）。
  - text：必須和句中原文完全一致（含大小寫與重音）。
  - lemma：${ai.lemmaRule}。
  - pos：sustantivo / verbo / adjetivo / adverbio / frase / conjunción / preposición / pronombre / interjección（${ai.articlePos}）。
  - zh：這個字在本句中的繁體中文意思，簡短。
  - usage：本句中的用法，40 字以內。${ai.usageExample}
- translation_zh：整句自然的繁體中文翻譯。
`);
const SENTENCE_INSTRUCTION = sentenceInstruction('es');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Word-by-word analysis of one sentence for the tap-a-word popover. Uses the cheaper model.
 * Tokens whose text is not actually in the sentence are dropped.
 */
async function analyzeSentence({ apiKey, sentence, lang = 'es' }) {
  const { data, usage, model } = await callGemini({
    apiKey,
    parts: [{ text: sentence }],
    systemInstruction: sentenceInstruction(lang),
    responseSchema: SENTENCE_SCHEMA,
    model: getFallbackModel(),
    fallbackModel: getPrimaryModel(),
    timeoutMs: 30_000
  });

  const tokens = [];
  for (const t of Array.isArray(data?.tokens) ? data.tokens : []) {
    const text = str(t?.text);
    if (!text || !new RegExp(`(?<!\\p{L})${escapeRegex(text)}(?!\\p{L})`, 'iu').test(sentence)) continue;
    tokens.push({
      text,
      lemma: str(t.lemma) || text,
      pos: pick(t.pos, PARTS_OF_SPEECH, 'frase'),
      zh: str(t.zh),
      usage: str(t.usage)
    });
  }
  if (tokens.length === 0) {
    throw new GeminiError('AI 解析結果不完整，請再試一次。', { status: 502 });
  }
  return { result: { translation_zh: str(data.translation_zh), tokens }, usage, model };
}

/**
 * Dictionary entry for one word (or a Chinese meaning) as a ready-to-save card.
 * Inflected input is reduced to its dictionary form by EXTRACT_INSTRUCTION's rules (fui -> ir).
 */
async function lookupWordAi({ apiKey, word, lang = 'es' }) {
  const L = getLanguage(lang);
  const { data, usage, model } = await callGemini({
    apiKey,
    parts: [{
      text: `請查字典，為這個詞輸出一張生詞卡（單一 JSON 物件）：「${word}」\n` +
        '若是變化形，word 用原形，並在 notes 第一行註明「' + word + '」是哪個形式。若輸入是中文，給出最常用的對應' + L.ai.short + '詞。'
    }],
    systemInstruction: extractInstruction(lang),
    responseSchema: cardSchema(lang),
    model: getFallbackModel(),
    fallbackModel: getPrimaryModel(),
    timeoutMs: 30_000
  });
  const card = normalizeAiCard(Array.isArray(data) ? data[0] : data, lang);
  if (!card) {
    throw new GeminiError(`AI 查不到「${word}」，請確認拼字。`, { status: 404 });
  }
  return { card, usage, model };
}

const POINT_TYPES = ['grammar', 'idiom', 'usage', 'culture', 'mistake'];
const MAX_POINTS = 6;
const MAX_EXAMPLES = 2;
const MAX_ALTERNATIVES = 2;

// `spanish` keeps its historical name: it holds the sentence in the learning language
const translateSchema = memo((L) => ({
  type: 'OBJECT',
  properties: {
    source_lang: { type: 'STRING', enum: [L.code, 'zh'] },
    spanish: { type: 'STRING' },
    correction: { type: 'STRING' },
    translation_zh: { type: 'STRING' },
    translation_en: { type: 'STRING' },
    points: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING', enum: POINT_TYPES },
          title: { type: 'STRING' },
          explanation: { type: 'STRING' },
          examples: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: { es: { type: 'STRING' }, zh: { type: 'STRING' } },
              required: ['es', 'zh']
            }
          }
        },
        required: ['type', 'title', 'explanation']
      }
    },
    alternatives: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { es: { type: 'STRING' }, zh: { type: 'STRING' }, note: { type: 'STRING' } },
        required: ['es', 'zh']
      }
    }
  },
  required: ['source_lang', 'spanish', 'correction', 'translation_zh', 'translation_en', 'points']
}));
const TRANSLATE_SCHEMA = translateSchema('es');

const translateInstruction = memo(({ code, ai }) => {
  // Field-name hints only for non-Spanish languages, so the Spanish prompt stays as it was
  const es = code === 'es';
  const fieldNote = es ? '' : '（欄位名稱沿用 spanish）';
  const exampleFields = es ? `${ai.short} es` : `${ai.short}放在 es 欄位`;
  const altFields = es ? 'es' : `es 欄位放${ai.short}`;
  return `
你是一位${ai.teacher}，學生是台灣人。學生會給你一個句子（通常是${ai.short}，偶爾是中文），請翻譯並講解重點，以 JSON 回傳。
- source_lang：輸入是${ai.short}填 ${code}，是中文填 zh。
- spanish：正確的${ai.short}句子${fieldNote}。輸入是正確的${ai.short}時照抄原句；輸入的${ai.short}有錯時給修正後的句子；輸入是中文時，給出自然、常用的${ai.short}說法。
- correction：只有輸入的${ai.short}有${ai.spellingErrors}時才填，用一兩句繁體中文說明原句哪裡錯、為什麼（不要重抄整句，修正後的句子已經在 spanish）；沒有錯就填空字串。
- translation_zh：自然的繁體中文翻譯。translation_en：自然的英文翻譯。
- points：這個句子值得學的重點，依句子難度給 1–6 點，簡單的句子 1 點就好，不要硬湊。
  - type：grammar（${ai.grammarExamples}）、idiom（慣用語、固定搭配）、usage（用法、語氣、正式與非正式）、culture（文化或地區差異）、mistake（台灣學生常犯的錯）。
  - title：簡短標題，可以直接用句中的片語（例如${ai.titleExample}）。
  - explanation：繁體中文說明，60–120 字，講清楚規則和為什麼。
  - examples：0–2 個補充例句（${exampleFields} + 繁中 zh），用來示範同一個重點的其他情況或特殊例子。
- alternatives：0–2 個意思相同、自然的其他說法（${altFields}、zh、note 說明語氣差異）；沒有合適的就給空陣列。
- 不要逐字解釋單字（學生可以點單字查詢），重點放在句型、用法與文化。
- 時態與語氣名稱統一用：${ai.tenseNames}。
`;
});
const TRANSLATE_INSTRUCTION = translateInstruction('es');

// Clean the AI translation so it is safe to show and store
function normalizeTranslation(data, lang = 'es') {
  if (!data || typeof data !== 'object') {
    throw new GeminiError('AI 翻譯結果格式不正確，請再試一次。', { status: 502 });
  }
  const list = (v) => (Array.isArray(v) ? v : []);
  const points = [];
  for (const p of list(data.points)) {
    const title = str(p?.title);
    const explanation = str(p?.explanation);
    if (!title || !explanation) continue;
    points.push({
      type: pick(p.type, POINT_TYPES, 'usage'),
      title,
      explanation,
      examples: list(p.examples)
        .map(e => ({ es: str(e?.es), zh: str(e?.zh) }))
        .filter(e => e.es)
        .slice(0, MAX_EXAMPLES)
    });
    if (points.length === MAX_POINTS) break;
  }

  const result = {
    source_lang: str(data.source_lang) === 'zh' ? 'zh' : getLanguage(lang).code,
    spanish: str(data.spanish),
    correction: str(data.correction),
    translation_zh: str(data.translation_zh),
    translation_en: str(data.translation_en),
    points,
    alternatives: list(data.alternatives)
      .map(a => ({ es: str(a?.es), zh: str(a?.zh), note: str(a?.note) }))
      .filter(a => a.es)
      .slice(0, MAX_ALTERNATIVES)
  };
  if (!result.spanish || (!result.translation_zh && !result.translation_en) || points.length === 0) {
    throw new GeminiError('AI 翻譯結果不完整，請再試一次。', { status: 502 });
  }
  return result;
}

/**
 * Translate one sentence (Spanish <-> Chinese, plus English) and explain its key points.
 * One call on the cheaper model.
 */
async function translateSentence({ apiKey, text, lang = 'es' }) {
  const { data, usage, model } = await callGemini({
    apiKey,
    parts: [{ text }],
    systemInstruction: translateInstruction(lang),
    responseSchema: translateSchema(lang),
    temperature: 0.3,
    model: getFallbackModel(),
    fallbackModel: getPrimaryModel(),
    timeoutMs: 30_000
  });
  return { result: normalizeTranslation(data, lang), usage, model };
}

/**
 * Calibrate CEFR levels (DELE for Spanish, Goethe for German) for a batch of words
 */
async function calibrateDeleLevels(wordsList, apiKey, lang = 'es') {
  const { ai, levelSystem } = getLanguage(lang);
  const wordsToEvaluate = wordsList.map(w => ({ id: w.id, word: w.word, translation: w.translation }));
  const prompt = `你是一位${ai.calibrationAuthority}。
請為以下${ai.short}單字清單評估其精確的 ${levelSystem} 級別（'A1', 'A2', 'B1', 'B2', 'C1', 或 'C2'）。
請嚴格遵循標準：
${ai.calibration}

請評估下列 ${wordsToEvaluate.length} 個單字，每個 id 回傳一筆：
${JSON.stringify(wordsToEvaluate, null, 2)}`;

  const { data } = await callGemini({
    apiKey,
    parts: [{ text: prompt }],
    temperature: 0.1,
    responseSchema: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'INTEGER' },
          word: { type: 'STRING' },
          dele_level: { type: 'STRING', enum: DELE_LEVELS }
        },
        required: ['id', 'dele_level']
      }
    }
  });
  return Array.isArray(data) ? data : [];
}

module.exports = {
  GeminiError,
  callGemini,
  normalizeAiCard,
  cardSchema,
  extractInstruction,
  sentenceInstruction,
  translateInstruction,
  extractWords,
  extractSpanishWords,
  calibrateDeleLevels,
  analyzeSentence,
  lookupWordAi,
  normalizeTranslation,
  translateSentence
};
