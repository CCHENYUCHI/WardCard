const { splitArticle } = require('./cardUtils');

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.6-flash';
const DEFAULT_FALLBACK_MODEL = 'gemini-3.5-flash-lite';
const DEFAULT_TIMEOUT_MS = 60_000;

const PARTS_OF_SPEECH = ['sustantivo', 'verbo', 'adjetivo', 'adverbio', 'frase', 'conjunción', 'preposición', 'pronombre', 'interjección'];
const GENDERS = ['masculino', 'femenino', 'none'];
const DELE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
// Parts of speech that inflect for gender in Spanish
const GENDERED_POS = ['sustantivo', 'adjetivo'];
const FORM_KEYS = ['masc_sg', 'fem_sg', 'masc_pl', 'fem_pl'];

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

// Gender forms without articles: { masc_sg: 'alto', fem_sg: 'alta', masc_pl: 'altos', fem_pl: 'altas' }
function normalizeForms(forms) {
  if (!forms || typeof forms !== 'object') return null;
  const out = {};
  for (const key of FORM_KEYS) out[key] = splitArticle(str(forms[key])).word;
  return FORM_KEYS.some(k => out[k]) ? out : null;
}

// "陽性：alto / altos；陰性：alta / altas" — kept in notes so every client shows it
function formatForms(forms) {
  if (!forms) return '';
  const masc = [forms.masc_sg, forms.masc_pl].filter(Boolean).join(' / ');
  const fem = [forms.fem_sg, forms.fem_pl].filter(Boolean).join(' / ');
  const parts = [masc && `陽性：${masc}`, fem && `陰性：${fem}`].filter(Boolean);
  return parts.length ? `陰陽性變化 → ${parts.join('；')}` : '';
}

// Clean one AI-produced card so it is safe to show and save
function normalizeAiCard(card) {
  if (!card || typeof card !== 'object') return null;
  const { word, article: rawArticle } = splitArticle(str(card.word), str(card.article));
  const translation = str(card.translation);
  if (!word || !translation) return null;

  const partOfSpeech = pick(card.part_of_speech, PARTS_OF_SPEECH, 'frase');
  const isNoun = partOfSpeech === 'sustantivo';
  const isGendered = GENDERED_POS.includes(partOfSpeech);
  const forms = isGendered ? normalizeForms(card.forms) : null;

  let article = isNoun && ['el', 'la', 'los', 'las'].includes(rawArticle) ? rawArticle : '';
  let gender = isGendered ? pick(card.gender, GENDERS, 'none') : 'none';
  if (isNoun && gender === 'none') {
    if (article === 'el' || article === 'los') gender = 'masculino';
    if (article === 'la' || article === 'las') gender = 'femenino';
  }
  if (partOfSpeech === 'adjetivo' && gender === 'none' && forms?.masc_sg && forms?.fem_sg && forms.masc_sg !== forms.fem_sg) {
    // The dictionary form of a variable adjective is the masculine singular
    gender = word === forms.fem_sg ? 'femenino' : 'masculino';
  }
  if (isNoun && !article && gender !== 'none') {
    article = gender === 'masculino' ? 'el' : 'la';
  }

  const formsText = formatForms(forms);
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
    notes: formsText && !notes.includes('陰陽性變化') ? [formsText, notes].filter(Boolean).join('\n') : notes,
    category: str(card.category) || '課堂筆記',
    dele_level: pick(card.dele_level, DELE_LEVELS, 'A2')
  };
}

const CARD_SCHEMA = {
  type: 'OBJECT',
  properties: {
    word: { type: 'STRING' },
    article: { type: 'STRING' },
    gender: { type: 'STRING', enum: GENDERS },
    part_of_speech: { type: 'STRING', enum: PARTS_OF_SPEECH },
    forms: {
      type: 'OBJECT',
      nullable: true,
      properties: {
        masc_sg: { type: 'STRING' },
        fem_sg: { type: 'STRING' },
        masc_pl: { type: 'STRING' },
        fem_pl: { type: 'STRING' }
      }
    },
    translation: { type: 'STRING' },
    english_translation: { type: 'STRING' },
    definition_es: { type: 'STRING' },
    example_es: { type: 'STRING' },
    example_zh: { type: 'STRING' },
    notes: { type: 'STRING' },
    category: { type: 'STRING' },
    dele_level: { type: 'STRING', enum: DELE_LEVELS }
  },
  required: ['word', 'article', 'gender', 'part_of_speech', 'translation', 'example_es', 'example_zh', 'dele_level']
};

const EXTRACT_INSTRUCTION = `
你是一位精通西班牙語教學與檢定（DELE / SIELE）的專業語言學專家。
你的任務是從使用者提供的課堂筆記、文章段落、生詞清單或講義照片中，萃取並結構化西班牙語生詞卡片，以 JSON 陣列回傳。

欄位說明：
- word：單字原形（名詞不要加冠詞；保留正確重音）
  - 動詞一律用原形不定式（hablar、comer、vivir、acostumbrarse），即使原文是變化形（例如 fui、hablamos）也要還原成原形，並在 notes 註明原文出現的形式。
  - 形容詞用陽性單數（alto，不是 alta / altos）。
- article：陽性名詞填 "el"、陰性名詞填 "la"（注意 el agua 這類陰性名詞仍填 "el"），非名詞填 ""
- gender：**名詞與形容詞都必須填寫，不可留 none**
  - 名詞：依該名詞的文法性別填 "masculino" 或 "femenino"
  - 形容詞：word 是陽性形式就填 "masculino"；陰陽同形（feliz、grande、importante）才填 "none"
  - 其他詞性填 "none"
- forms：名詞與形容詞必填，列出陰陽性與單複數變化，不要加冠詞；不存在的形式填 ""
  - 形容詞 alto → {"masc_sg":"alto","fem_sg":"alta","masc_pl":"altos","fem_pl":"altas"}
  - 有陰陽兩種形式的名詞 profesor → {"masc_sg":"profesor","fem_sg":"profesora","masc_pl":"profesores","fem_pl":"profesoras"}
  - 只有單一性別的名詞 problema → {"masc_sg":"problema","fem_sg":"","masc_pl":"problemas","fem_pl":""}
  - 動詞、副詞等其他詞性填 null
- part_of_speech：sustantivo / verbo / adjetivo / adverbio / frase / conjunción / preposición / pronombre / interjección
- translation：精準道地的繁體中文釋義
- english_translation：對應的英文翻譯
- definition_es：簡短的西班牙文定義
- example_es：實用、生活化或考試常考的西語例句
- example_zh：例句的繁體中文翻譯
- notes：文法重點、不規則變化、常用介系詞搭配（例如 -ma 結尾的陽性名詞）
- category：依內容分類，例如「日常生活」、「考試必背 (DELE)」、「課堂筆記」
- dele_level：對應的 DELE 級數 A1–C2

規則：
1. 若輸入是「單字清單」或「表格」，務必將所有單字全數轉換，不可遺漏。
2. 若輸入是一整段文章，挑出最值得背誦的重點生詞（無數量限制）。
3. 所有西語重音（á, é, í, ó, ú, ñ, ü）必須完全正確。
4. 同一個單字只輸出一次。
`;

/**
 * Extract Spanish vocabulary cards from notes text and/or a photo
 * @param {object} params
 * @param {string} params.promptText - Class notes, reading, or word list
 * @param {string} params.apiKey - Gemini API Key
 * @param {object} [params.imageFile] - Optional uploaded image { buffer, mimetype }
 */
async function extractSpanishWords({ promptText, apiKey, imageFile = null }) {
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
      : '請分析這張課堂教材/講義照片中的西語重點生詞並結構化輸出。'
  });

  const { data } = await callGemini({
    apiKey,
    parts,
    systemInstruction: EXTRACT_INSTRUCTION,
    responseSchema: { type: 'ARRAY', items: CARD_SCHEMA }
  });

  if (!Array.isArray(data)) {
    throw new GeminiError('AI 回傳的格式非陣列，請重試。', { status: 502 });
  }

  const seen = new Set();
  const cards = [];
  for (const raw of data) {
    const card = normalizeAiCard(raw);
    if (!card) continue;
    const key = card.word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cards.push(card);
  }
  return cards;
}

/**
 * Calibrate DELE/CEFR levels for a batch of Spanish words
 */
async function calibrateDeleLevels(wordsList, apiKey) {
  const wordsToEvaluate = wordsList.map(w => ({ id: w.id, word: w.word, translation: w.translation }));
  const prompt = `你是一位精通西班牙語檢定（Instituto Cervantes DELE / CEFR）權威專家。
請為以下西語單字清單評估其精確的 DELE / CEFR 級別（'A1', 'A2', 'B1', 'B2', 'C1', 或 'C2'）。
請嚴格遵循標準：
- A1: 最基礎生存單字（例如: hola, gracias, manzana, libro, escuela, estudiante, aprender, feliz, ser, estar, comer, beber, día, agua, casa, número, pequeño）
- A2: 基礎日常生活交流（例如: costumbre, desarrollar, viajar, tiempo, regalo, invierno, problema）
- B1: 進階獨立表達、情感與常用抽象詞（例如: acostumbrarse, maravilloso, opinión, sociedad, éxito）
- B2: 深度討論、專業與高級修辭
- C1/C2: 高階學術、文學與罕見專有名詞

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
  extractSpanishWords,
  calibrateDeleLevels
};
