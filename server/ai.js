const https = require('https');

/**
 * Call Google Gemini API (gemini-1.5-flash or gemini-2.5-flash) to extract Spanish vocabulary
 * @param {string} promptText - User's class notes, reading, or word list
 * @param {string} apiKey - Gemini API Key
 * @param {object} imageFile - Optional uploaded image { buffer, mimetype }
 */
async function extractSpanishWords({ promptText, apiKey, imageFile = null }) {
  if (!apiKey) {
    throw new Error('未提供 Gemini API Key。請在設定中填寫或在伺服端 .env 中設定 GEMINI_API_KEY。');
  }

  const systemInstruction = `
你是一位精通西班牙語教學與檢定（DELE / SIELE）的專業語言學專家。
你的任務是從使用者提供的課堂筆記、文章段落、生詞清單或講義照片中，萃取並結構化西班牙語生詞卡片。

每個單字卡必須包含以下精確欄位（請以 JSON 陣列格式回傳）：
[
  {
    "word": "單字原形（動詞給不定式如 hablar；名詞若有重音符號務必保留正確書寫）",
    "article": "若是陽性名詞請填 'el'，陰性名詞請填 'la'，非名詞或不可數請填 ''",
    "gender": "名詞請標註 'masculino' 或 'femenino'；若為動詞/形容詞/副詞則標 'none'",
    "part_of_speech": "請從中選擇: sustantivo (名詞), verbo (動詞), adjetivo (形容詞), adverbio (副詞), frase (片語/短語), conjunción (連接詞), preposición (介系詞)",
    "translation": "精準且道地的繁體中文釋義（可附主要常見中文意思）",
    "english_translation": "該單字對應的精準英文翻譯（English Translation）",
    "definition_es": "用西班牙文寫出該單字或詞組的簡短定義 (Definición en español)",
    "example_es": "實用、生活化或考試常考的道地西班牙語例句",
    "example_zh": "例句的繁體中文翻譯",
    "notes": "西語文法重點說明、特別要注意的規則、動詞不規則變化提醒、或常用的介系詞搭配（例如: 固定搭配介系詞 a/con，或 -ma 結尾為陽性名詞等）",
    "category": "依內容分類，建議預設為 '日常生活' 或 '考試必背 (DELE)' 或 '課堂筆記'",
    "dele_level": "評估該單字對應的 DELE 級數: 'A1', 'A2', 'B1', 'B2', 'C1', 或 'C2'"
  }
]

請注意：
1. 嚴格輸出合法的 JSON，不要輸出任何額外的 markdown 程式碼區塊標籤（如不要在最外層加 \`\`\`json），只要純 JSON 陣列。
2. 若使用者輸入的是「單字清單」或「表格」，請**務必將清單中的所有單字全數處理並轉換**，不要遺漏任何一個！
3. 若使用者貼的是一整段西語短文/文章，才需要挑出最值得背誦的重點生詞（無數量限制，盡量列出重點）。
4. 確保所有西語重音（á, é, í, ó, ú, ñ, ü）均完全正確。
`;

  const contents = [];
  const parts = [];

  if (imageFile) {
    parts.push({
      inline_data: {
        mime_type: imageFile.mimetype || 'image/jpeg',
        data: imageFile.buffer.toString('base64')
      }
    });
  }

  const userQuery = promptText && promptText.trim()
    ? promptText
    : '請分析這張課堂教材/講義照片中的西語重點生詞並結構化輸出。';

  parts.push({ text: userQuery });
  contents.push({ role: 'user', parts });

  const payload = JSON.stringify({
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });

  // Helper to make API request with a specific model
  const makeRequest = (modelName) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            try {
              const errObj = JSON.parse(data);
              reject(new Error(errObj.error?.message || `API 錯誤: ${res.statusCode}`));
            } catch (e) {
              reject(new Error(`API 請求失敗 (${res.statusCode}): ${data}`));
            }
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.write(payload);
      req.end();
    });
  };

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const fallbackModel = 'gemini-1.5-flash-8b';

  let responseText;
  try {
    // 第一次嘗試使用主要模型
    responseText = await makeRequest(primaryModel);
  } catch (err) {
    // 如果是負載過高，自動退回使用更輕量快速的 8b 模型
    if (err.message.includes('high demand') || err.message.includes('503')) {
      console.log(`[AI] ${primaryModel} 負載過高，自動切換至 ${fallbackModel} 進行重試...`);
      responseText = await makeRequest(fallbackModel);
    } else {
      throw err;
    }
  }

  const parsed = JSON.parse(responseText);
  const candidateText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('Gemini API 未回傳有效文字內容');
  }

  // Sanitize potential backticks if any
  let cleanJson = candidateText.trim();
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const cards = JSON.parse(cleanJson);
  if (!Array.isArray(cards)) {
    throw new Error('AI 回傳的格式非陣列，請重試');
  }

  return cards;
}

module.exports = {
  extractSpanishWords
};
