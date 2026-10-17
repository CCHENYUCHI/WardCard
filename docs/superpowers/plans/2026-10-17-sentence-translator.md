# Sentence Translator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web 新分頁「翻譯」：輸入句子 → AI 給中英翻譯與 1–6 個重點講解 → 存成可搜尋的紀錄；同時移除自由翻卡與盲測拼寫分頁。

**Architecture:** 後端在 `server/ai.js` 加 `translateSentence` + 純函式 `normalizeTranslation`，在新的 `server/translations.js` 放資料表 SQL 與接收 `db` 的存取函式，`server/index.js` 加三支路由。前端新增 `TranslatorView.jsx`（輸入 + 紀錄）與 `TranslationResult.jsx`（顯示單筆，西語句子用 `TappableSentence`）。

**Tech Stack:** Node 22 `node:sqlite`、Express、`node:test`；React 18 + Vite、lucide-react。

## Global Constraints

- 一句一次 AI 呼叫，flash-lite 優先（`model: getFallbackModel(), fallbackModel: getPrimaryModel()`）。
- 同一句不重複呼叫 AI：自己的紀錄 → 任何人查過的同一句 → AI。
- 輸入 trim 後 1–300 字。
- 錯誤狀態碼不可用 401/403（web `fetchAPI` 會登出）。
- 淺色 Google / Material 風格，用 `index.css` 現有變數（`--google-blue` 等）。
- 後端與 `mobile/` 的翻卡 / 拼字相關程式不動。

---

### Task 1: 移除自由翻卡 / 盲測拼寫（commit 1）

**Files:**
- Delete: `client/src/components/FlashcardReview.jsx`, `client/src/components/SpellingReview.jsx`, `client/src/utils/fsrsPreview.js`
- Modify: `client/src/App.jsx`（imports、`dueCards` state 與 `/api/cards/due` 抓取、`review` / `spelling` 分支、tab 註解）
- Modify: `client/src/components/Navbar.jsx`（移除兩個桌面 tab、兩個手機底部項目、`Layers` / `Keyboard` icon import）
- Modify: `client/src/index.css`（只刪除選擇器完全屬於下列 class 的規則：`flashcard-container card-face card-back rating-actions btn-rate rate-title rate-sub review-toolbar review-toolbar-controls review-progress-text spelling-box spelling-input spelling-prompt spelling-actions word-display main-word main-translation article-prefix example-box notes-box`；先 `grep` 確認沒有其他元件使用）

- [ ] **Step 1:** 刪檔、改 `App.jsx` 與 `Navbar.jsx`。
- [ ] **Step 2:** 刪 CSS 規則（逐條確認選擇器只含上述 class）。
- [ ] **Step 3:** `cd client && npm run build` → 成功、無 import 錯誤。`grep -rn "FlashcardReview\|SpellingReview\|fsrsPreview" client/src` → 無結果。
- [ ] **Step 4:** Commit `refactor(web): remove flashcard and spelling review tabs`。

### Task 2: `normalizeTranslation` + `translateSentence`

**Files:**
- Modify: `server/ai.js`（新增 schema、instruction、兩個函式並匯出）
- Test: `server/translations.test.js`

**Interfaces:**
- Produces: `normalizeTranslation(data) -> { source_lang, spanish, correction, translation_zh, translation_en, points:[{type,title,explanation,examples:[{es,zh}]}], alternatives:[{es,zh,note}] }`，不合格時 throw `GeminiError`（status 502）。
- Produces: `translateSentence({ apiKey, text }) -> Promise<{ result, usage, model }>`。

- [ ] **Step 1: 寫失敗測試**

```js
const { normalizeTranslation, GeminiError } = require('./ai');

test('normalizeTranslation trims, defaults and caps lists', () => {
  const r = normalizeTranslation({
    source_lang: 'xx', spanish: '  Me gusta el café. ', correction: ' ',
    translation_zh: ' 我喜歡咖啡。', translation_en: 'I like coffee.',
    points: [
      { type: 'grammar', title: 'gustar', explanation: '主詞是被喜歡的東西', examples: [{ es: 'Me gustan los gatos.', zh: '我喜歡貓。' }, { es: 'a', zh: 'b' }, { es: 'c', zh: 'd' }] },
      { type: 'weird', title: 'el café', explanation: '泛指要加定冠詞' },
      { type: 'idiom', title: '', explanation: 'no title → dropped' },
      ...Array.from({ length: 6 }, (_, i) => ({ type: 'usage', title: `t${i}`, explanation: 'e' }))
    ],
    alternatives: [{ es: 'Adoro el café.', zh: '我超愛咖啡。', note: '' }, { es: 'x' }, { es: 'y' }, { es: 'z' }]
  });
  assert.equal(r.source_lang, 'es');
  assert.equal(r.spanish, 'Me gusta el café.');
  assert.equal(r.correction, '');
  assert.equal(r.points.length, 6);
  assert.equal(r.points[0].examples.length, 2);
  assert.equal(r.points[1].type, 'usage');
  assert.deepEqual(r.points[1].examples, []);
  assert.equal(r.alternatives.length, 2);
});

test('normalizeTranslation rejects empty results', () => {
  const base = { spanish: 'Hola', translation_zh: '你好', translation_en: 'Hi', points: [{ type: 'usage', title: 'hola', explanation: '打招呼' }] };
  assert.throws(() => normalizeTranslation({ ...base, spanish: '' }), GeminiError);
  assert.throws(() => normalizeTranslation({ ...base, translation_zh: '', translation_en: '' }), GeminiError);
  assert.throws(() => normalizeTranslation({ ...base, points: [] }), GeminiError);
  assert.equal(normalizeTranslation({ ...base, source_lang: 'zh' }).source_lang, 'zh');
});
```

- [ ] **Step 2:** `npm test` → FAIL（`normalizeTranslation is not a function`）。
- [ ] **Step 3:** 實作（`POINT_TYPES = ['grammar','idiom','usage','culture','mistake']`，用既有 `str()` helper；`TRANSLATE_SCHEMA` 用 Gemini responseSchema；`TRANSLATE_INSTRUCTION` 說明各欄位、1–6 點依句子難度、例句 0–2、alternatives 0–2、輸入中文時 `spanish` 給西語譯文、繁體中文）。`translateSentence` 呼叫 `callGemini({ apiKey, parts:[{text}], systemInstruction, responseSchema, temperature: 0.3, model: getFallbackModel(), fallbackModel: getPrimaryModel(), timeoutMs: 30_000 })` 後 `normalizeTranslation(data)`。
- [ ] **Step 4:** `npm test` → PASS。

### Task 3: `server/translations.js` 存取層 + 資料表

**Files:**
- Create: `server/translations.js`
- Modify: `server/db.js`（`runMigrations()` 結尾 `db.exec(TRANSLATIONS_SCHEMA)`）
- Test: `server/translations.test.js`

**Interfaces:**
- Produces: `TRANSLATIONS_SCHEMA: string`、`translationHash(text): string`（sha1 of lowercase + whitespace-collapsed trim）、`findOwnTranslation(db, userId, hash) -> record|null`、`findSharedTranslation(db, hash) -> { result, model }|null`、`saveTranslation(db, { userId, inputText, hash, result, model }) -> record`、`listTranslations(db, userId, { q = '', offset = 0, limit = 30 }) -> { items: record[], hasMore }`、`deleteTranslation(db, userId, id) -> boolean`。
- `record = { id, input_text, source_lang, created_at, ...result }`。

- [ ] **Step 1: 寫失敗測試**

```js
const { DatabaseSync } = require('node:sqlite');
const T = require('./translations');

const RESULT = { source_lang: 'es', spanish: 'Hola', correction: '', translation_zh: '你好', translation_en: 'Hi', points: [{ type: 'usage', title: 'hola', explanation: '打招呼', examples: [] }], alternatives: [] };
const freshDb = () => { const db = new DatabaseSync(':memory:'); db.exec(T.TRANSLATIONS_SCHEMA); return db; };

test('translationHash ignores case and extra whitespace', () => {
  assert.equal(T.translationHash('  Hola   Mundo '), T.translationHash('hola mundo'));
  assert.notEqual(T.translationHash('hola'), T.translationHash('hola.'));
});

test('save, find own and shared, list with search and paging, delete own only', () => {
  const db = freshDb();
  const hash = T.translationHash('Hola');
  const rec = T.saveTranslation(db, { userId: 1, inputText: 'Hola', hash, result: RESULT, model: 'm' });
  assert.equal(rec.input_text, 'Hola');
  assert.equal(rec.translation_zh, '你好');
  assert.equal(T.findOwnTranslation(db, 1, hash).id, rec.id);
  assert.equal(T.findOwnTranslation(db, 2, hash), null);
  assert.equal(T.findSharedTranslation(db, hash).result.spanish, 'Hola');
  assert.equal(T.findSharedTranslation(db, T.translationHash('nope')), null);

  for (let i = 0; i < 3; i++) T.saveTranslation(db, { userId: 1, inputText: `Frase ${i}`, hash: T.translationHash(`Frase ${i}`), result: { ...RESULT, spanish: `Frase ${i}`, translation_zh: `句子${i}` }, model: 'm' });
  const page = T.listTranslations(db, 1, { limit: 2 });
  assert.equal(page.items.length, 2);
  assert.equal(page.hasMore, true);
  assert.equal(page.items[0].input_text, 'Frase 2'); // newest first
  assert.equal(T.listTranslations(db, 1, { q: '你好' }).items.length, 1);
  assert.equal(T.listTranslations(db, 2).items.length, 0);

  assert.equal(T.deleteTranslation(db, 2, rec.id), false);
  assert.equal(T.deleteTranslation(db, 1, rec.id), true);
  assert.equal(T.findOwnTranslation(db, 1, hash), null);
});
```

- [ ] **Step 2:** `npm test` → FAIL（`Cannot find module './translations'`）。
- [ ] **Step 3:** 實作（schema 見 spec；排序 `ORDER BY created_at DESC, id DESC`；搜尋 `input_text LIKE ? OR translation_zh LIKE ?`，`limit + 1` 判斷 `hasMore`；`saveTranslation` 用 `INSERT ... ON CONFLICT(user_id, input_hash) DO NOTHING` 後再 `findOwnTranslation`）。`db.js` 執行 schema。
- [ ] **Step 4:** `npm test` → PASS。

### Task 4: API 路由

**Files:**
- Modify: `server/index.js`（import；在 dictionary 路由後新增 `// --- Sentence translator ---` 區塊）

**Interfaces:**
- Consumes: Task 2、3 的函式；既有 `resolveApiKey`、`NO_KEY_ERROR`、`authenticateToken`。
- Produces: `POST /api/translations` → `{ record, cached }`（新 AI 結果 201）；`GET /api/translations?q=&offset=` → `{ items, hasMore }`；`DELETE /api/translations/:id` → `{ success: true }` / 404。

- [ ] **Step 1:** 實作三支路由（驗證 text 1–300 字 → 400；自己的紀錄 → `cached: true`；共用 → `saveTranslation` 複製、`cached: true`；否則需 Key → `translateSentence` → `saveTranslation` → 201）。
- [ ] **Step 2:** `node -e "require('./server/index.js')"` 不實際需要；改用 `PORT=3999 DB_PATH=<scratch> node server/index.js` 啟動，curl 登入後打 `GET /api/translations` → `{ items: [], hasMore: false }`；`POST` 空字串 → 400；有 Key 時 POST 一句 → 201，再 POST 同句 → `cached: true`。
- [ ] **Step 3:** `npm test` 全綠後 commit（與 Task 5–6 一起成為 commit 2 亦可）。

### Task 5: 前端 `TranslationResult.jsx` + `TranslatorView.jsx` + Navbar/App

**Files:**
- Create: `client/src/components/TranslationResult.jsx`、`client/src/components/TranslatorView.jsx`
- Modify: `client/src/App.jsx`（`activeTab === 'translate'` → `<TranslatorView />`）
- Modify: `client/src/components/Navbar.jsx`（桌面加「翻譯」tab（`Languages` icon）；手機底部列：今日學習 · 單字庫 · 翻譯 · 查詞 · 統計；移除頂部 `navbar-btn-dictionary` 按鈕）
- Modify: `client/src/index.css`（`.translator-*`、`.tr-point--{type}` 樣式；移除 `.navbar-btn-dictionary` 規則）

**Interfaces:**
- Consumes: `fetchAPI(path, opts)`（`utils/api.js`）、`TappableSentence({ sentence, exampleZh })`、`playSpanishPronunciation(text)`。
- `TranslationResult({ record })`；`TranslatorView()` 無 props。

- [ ] **Step 1:** `TranslationResult`：西語句（TappableSentence + 🔊）、輸入是中文時顯示原句、中文 / 英文翻譯、`correction` 提示框、重點卡片（類型標籤 文法 / 慣用語 / 用法 / 文化 / 易錯，例句可點字）、其他說法。
- [ ] **Step 2:** `TranslatorView`：textarea（Enter 送出、Shift+Enter 換行、IME 組字中 `e.nativeEvent.isComposing` 不送出）、字數 `n/300`、重音鍵列（插入游標位置）、送出 → 結果；錯誤訊息；`cached` 小字；紀錄區（搜尋 debounce 300ms、展開 / 收合、刪除 confirm、載入更多），新翻譯成功後放到紀錄最前面（避免重複）。
- [ ] **Step 3:** Navbar / App / CSS。
- [ ] **Step 4:** `cd client && npm run build` → 成功。

### Task 6: 端到端驗證、文件、commit 2

- [ ] **Step 1:** 啟動 server（臨時 DB）+ `vite` dev，用瀏覽器或 curl 驗證：西語句、中文句、有錯的西語句、重複送出、搜尋、刪除；手機寬度底部列 5 項。
- [ ] **Step 2:** 更新 `開發進度/CHANGELOG.md`（Added：句子翻譯；Changed/Removed：移除翻卡與拼字分頁）、`功能清單與Roadmap.md`、`專案開發狀況總覽.md`（API 表、前端模組表、schema）、`AI功能延伸規劃.md`（加一節）。
- [ ] **Step 3:** Commit `feat(translator): AI sentence translation with explanations and history`。
