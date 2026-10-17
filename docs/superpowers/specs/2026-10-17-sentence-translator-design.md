# 句子翻譯與講解（AI）＋ 移除自由翻卡 / 盲測拼寫 — 設計

> 日期：2026-10-17 · 分支：`feature/sentence-translator`（從 `origin/main`）· 只做 Web

## 目標

使用者輸入一個簡單的句子（主要是西語），AI 給出中文與英文翻譯，並講解句子的重點（文法、慣用語、用法、文化、易錯點，附補充例句）。每次翻譯都存成紀錄，之後可以搜尋、展開重看、刪除。

同時移除已經不用的「自由翻卡」與「盲測拼寫」分頁（今日學習已取代它們）。

## 原則（沿用 `AI功能延伸規劃.md`）

- 一句一次 AI 呼叫，用 flash-lite（`getFallbackModel()`），失敗才換主模型。
- 同一句不重複呼叫：先找自己的紀錄，再找任何使用者查過的同一句，都沒有才呼叫 AI。
- 淺色 Google / Material 風格，跟著 `index.css` 現有變數走。

## AI 輸出（`translateSentence` in `server/ai.js`）

```json
{
  "source_lang": "es | zh",
  "spanish": "西語句子（輸入是西語時 = 原句；輸入中文時 = 西語譯文）",
  "correction": "原句有錯時的修正說明，沒錯就是空字串",
  "translation_zh": "自然的繁體中文翻譯",
  "translation_en": "natural English translation",
  "points": [
    { "type": "grammar | idiom | usage | culture | mistake", "title": "…", "explanation": "…",
      "examples": [{ "es": "…", "zh": "…" }] }
  ],
  "alternatives": [{ "es": "…", "zh": "…", "note": "…" }]
}
```

- `points`：1–6 點，簡單的句子 1 點即可；每點 0–2 個補充例句。
- `alternatives`：0–2 個，沒有就給空陣列。
- 不列重點單字：單字透過點西語句子查詢（`TappableSentence`，和學習例句一樣，裡面已有「加入單字庫」）。
- `normalizeTranslation(data)`（純函式，匯出供測試）：字串去空白；不認識的 `type` → `usage`；丟掉沒有標題或說明的重點；`points` 截到 6、`examples` 截到 2、`alternatives` 截到 2；`source_lang` 不是 `zh` 就當 `es`；`spanish` 或兩個翻譯都空 → 丟 `GeminiError(502)`；`points` 為空 → 丟 `GeminiError(502)`。

## 資料表

```sql
CREATE TABLE IF NOT EXISTS translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  input_text TEXT NOT NULL,          -- 使用者輸入的原文（保留原樣）
  input_hash TEXT NOT NULL,          -- sha1(小寫 + 空白正規化)
  source_lang TEXT DEFAULT 'es',
  translation_zh TEXT DEFAULT '',    -- 列表與搜尋用
  result TEXT NOT NULL,              -- JSON（上面的格式）
  model TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  UNIQUE(user_id, input_hash)
);
CREATE INDEX IF NOT EXISTS idx_translations_hash ON translations(input_hash);
CREATE INDEX IF NOT EXISTS idx_translations_user_time ON translations(user_id, created_at);
```

只屬於使用者自己，不綁卡片，刪卡不需清理。

## 模組

- `server/translations.js`（新）：`TRANSLATIONS_SCHEMA`（`db.js` 的 `runMigrations()` 執行它）、`translationHash(text)`、`findOwn(db, userId, hash)`、`findShared(db, hash)`、`saveTranslation(db, …)`、`listTranslations(db, userId, { q, offset, limit })`、`deleteTranslation(db, userId, id)`。都接收 `db`，方便用記憶體資料庫測試。
- `server/ai.js`：`translateSentence({ apiKey, text })`、`normalizeTranslation(data)`。

## API（皆 `authenticateToken`）

| 方法 | 路徑 | 說明 |
|---|---|---|
| POST | `/api/translations` | `{ text }`，trim 後 1–300 字。自己的紀錄 → `{ record, cached: true }`；別人查過 → 複製成自己的紀錄，`cached: true`；否則呼叫 AI，存檔後回 `{ record, cached: false }`（201） |
| GET | `/api/translations?q=&offset=` | 新的在前，每頁 30 筆，`q` 搜尋 `input_text` / `translation_zh`；回 `{ items, hasMore }` |
| DELETE | `/api/translations/:id` | 只能刪自己的，找不到回 404 |

`record` = `{ id, input_text, source_lang, created_at, ...result }`。

錯誤：缺 Key → 400 `NO_KEY_ERROR`；Gemini 錯誤沿用 `err.status`（從不回 401/403）。

## 前端

- `TranslatorView.jsx`（新分頁 `translate`）
  - 輸入框（textarea，Enter 送出、Shift+Enter 換行，300 字上限與字數），西語重音鍵列（á é í ó ú ü ñ ¿ ¡），送出按鈕與 loading。
  - 送出後在上方顯示 `TranslationResult`；`cached` 時顯示小字「已有紀錄，未使用 AI 額度」。
  - 下方「翻譯紀錄」：搜尋框、清單（原句 + 中文 + 日期），點一下展開成 `TranslationResult`，可刪除（confirm），「載入更多」。
- `TranslationResult.jsx`（新）：西語句子用 `TappableSentence` 可點字 + 🔊 `playSpanishPronunciation`；中文、英文翻譯；`correction` 用提示框；重點卡片依類型上色（文法藍、慣用語紫、用法綠、文化橘、易錯紅），附例句；「其他說法」。輸入是中文時，額外顯示原句。
- Navbar：桌面「今日學習 · 單字庫 · 進度統計 · 查詞 · 翻譯」；手機底部列「今日學習 · 單字庫 · 翻譯 · 查詞 · 統計」，頂部列的查詞按鈕移除。

## 移除自由翻卡 / 盲測拼寫

- 刪 `FlashcardReview.jsx`、`SpellingReview.jsx`、`utils/fsrsPreview.js`（只有翻卡使用）。
- `App.jsx`：移除 import、`review` / `spelling` 分支與只給它們用的 `dueCards` 抓取（`/api/cards/due`）——若沒有其他使用者才移除。
- 只被這兩個元件使用的 CSS 一併清掉；共用的（如 `.spelling-input`）保留。
- 後端與 `mobile/` 不動；`review_mode` 欄位與舊紀錄照舊。

## 測試與驗證

- `server/translations.test.js`（`node:test`）：`normalizeTranslation` 的截斷 / 預設值 / 錯誤；store 的 hash 正規化、自己 / 共用快取、列表搜尋與分頁、只能刪自己的。
- `npm test`、`cd client && npm run build`。
- 有 Key 時實際跑一次：西語句、中文句、有錯的西語句、重複送出（不再呼叫 AI）。

## Commit

1. `refactor(web): remove flashcard and spelling review tabs`
2. `feat(translator): AI sentence translation with explanations and history`（含開發進度三份文件與 `AI功能延伸規劃.md` 補一節）
