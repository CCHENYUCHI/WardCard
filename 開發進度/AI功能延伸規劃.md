# 🤖 延伸功能規劃 v2：省額度優先 (D0–D6)

> **更新日期**：2026-10-11（取代原本的 C0–C5 版本）
> **前置工作**：AI 萃取修復、陰陽性補全、新增分類（已合併，PR #1）

## 背景與原則

使用者的 Gemini API 額度不多，所以這一版以**省額度**為最高原則：

- **能用本機邏輯或自己的單字庫做到的，就不用 AI。**
- 真的需要 AI 時：
  - 盡量搭在已經要做的呼叫上（例如萃取時順便生成），不另外呼叫；
  - 一次批次處理多張卡；
  - 用較便宜的 `gemini-3.5-flash-lite`；
  - 結果永久快取，同樣的內容不重複生成。
- **只做 Web**：使用者平常用手機 Safari 開網頁版，沒有在用 `mobile/` 的 Expo App。
- S5 改成「語境四選一」。
- 新 UI 跟著實際程式碼的**淺色 Google / Material 風格**走（不是 AGENTS.md 寫的 Dark Glassmorphism）。

每一項各開一個分支，完成後依 AGENTS.md 更新 CHANGELOG、Roadmap 與總覽。

## 盤點時發現的現況（2026-10-11，main `7b9e8b9`）
- **Stage 5** 只是「看單字 → 翻面 → 自評」，跟 Stage 1 幾乎一樣（`AdaptiveStudySession.jsx:752-832`）。
- **Stage 4** 永遠用同一句 `example_es`；卡片沒有例句時根本沒有空格可填（607-749）。
- **Enter 送不出答案（看程式碼推斷，未實際執行）**：鍵盤 effect（177-203）的依賴沒有 `userInput` / `handleCheckSpelling`，Enter 時讀到的是舊的空字串，會直接 return。
- **遮字與比對的 regex 用 `\b...\w*`**（135、289）：遇到 á、ñ 這類字母會判斷錯誤，例如 `árbol` 遮不到、`ana` 會誤中 `mañana`。
- **重複的工具函式**：`stripArticle` 在 `AdaptiveStudySession.jsx:13` 和 `SpellingReview.jsx:7` 各一份；`bonito/a`、`niño(a)` 這種寫法只有 SpellingReview 支援（`getAcceptableAnswers` 18-58）。
- **字典頁沒有入口**：`DictionaryView` 是空殼，Navbar 也沒有按鈕可以進去。
- **用量沒記錄**：`callGemini` 有回傳 `usage`（`server/ai.js:134`），但呼叫端都丟掉了。
- 實際介面是**淺色 Google / Material 風格**（`index.css` 變數 `--google-*`、`.surface-card`），不是 AGENTS.md 寫的 Dark Glassmorphism。新 UI 跟著實際程式碼走。
- `PRAGMA foreign_keys` 沒開，新的資料表要在刪除卡片的兩個 API 裡手動清掉：`DELETE /api/cards/:id`（index.js:346）、`/api/cards/batch-delete`（735）。

---

## 額度總覽

| 階段 | 內容 | AI 用量 |
|---|---|---|
| **D0** | 學習流程前置修正 + **S5 四選一（本機出題）** | **0** |
| **D1** | AI 用量紀錄與上限 | 0（只記錄） |
| **D2** | S4 例句庫：萃取時順便生成；舊卡片手動批次補齊 | 萃取時幾乎不多花；補齊時約 25 張卡 1 次 |
| **D3** ✅ | 字典 + 例句點字：離線 Wiktionary + 自己的單字庫，AI 只在按下時才查 | 只有按了「AI 解析這句 / 用 AI 查中文」才花，整句與單字都共用快取 |
| **D4** | 答錯提示：本機判斷錯誤類型，AI 講解是選用 | 預設 0 |
| **D5** | 每日短文（低優先） | 手動，一天最多 1 次 |
| **D6** | 卡片圖片：**上傳自己的照片**，不做 AI 生圖 | 0 |

估計日常使用每天 **0–5 次 AI 呼叫**，大部分天數是 0。

---

## D0. 學習流程前置修正 + S5 四選一（分支 `feature/study-quiz-upgrade`，不用 AI）

### D0-1 共用西語工具 `client/src/utils/spanish.js`（新檔）
- `stripArticle(str)`：合併兩份現有實作，處理 null，不分大小寫。
- `getAcceptableAnswers(card)`：從 `SpellingReview.jsx:18-58` 搬過來，支援 `/`、`,`、`bonito/a`、`niño(a)`。
- `wordRegex(word)`：Unicode 版本的邊界 `(?<!\p{L})${escaped}\p{L}*`，flag 用 `giu`，取代 `\b...\w*`。
- `maskSentence(sentence, card)`、`findInflectedForms(sentence, card)`：遮字和比對共用同一個 regex。
- `normalizeAnswer(s)`、`stripAccents(s)`：給 D4 判斷「只差重音」。
- `AdaptiveStudySession.jsx`、`SpellingReview.jsx` 都改用這個檔案。

### D0-2 修正 `AdaptiveStudySession.jsx`
- Enter 問題：`handleCheckSpelling` 改用 `useCallback`（依賴 `userInput`、`currentCard`），並放進鍵盤 effect 的依賴；或者在 input 上直接處理 `onKeyDown`。
- Stage 3 不再拿 `example_es` 裡的字來比對答案（Stage 3 畫面沒有句子，比對它沒有意義）。
- Stage 4 卡片沒有例句時：退回 Stage 3 的拼字畫面，並顯示「此卡沒有例句」。D2 完成後改用例句庫。

### D0-3 S5 語境四選一（不用 AI）
- **出題來源全部在本機**：
  - 題幹：用 `maskSentence()` 把 `example_es` 挖空，並顯示 `example_zh`；沒有例句時改成「看中文 → 選西語」。
  - 正確答案：例句裡實際出現的形式（`findInflectedForms`），沒有例句時用 `word`。
  - **干擾選項從自己的單字庫挑 3 個**，優先順序：同詞性同分類 > 同詞性 > 其他。排除意思相同的卡（translation 一樣）。
- **API**：`GET /api/study/distractors?card_id=&n=3`，用 SQL 隨機挑同詞性的卡；或在 agenda 回應裡一起帶出每張 S5 卡的候選，省一次往返。
- **畫面**（取代 752-832）：4 個選項按鈕，作答前按 `1–4` 選答案。
- **自動評分**：答對且 3 秒內 → 4（Easy）；超過 3 秒 → 3（Good）；答錯 → 標出正解，翻面後讓使用者自己評分（跟現在 Stage 3/4 答錯一樣）。翻面後 `1–4` 才變回評分鍵。
- 單字庫太少、同詞性湊不到 3 個時，退回原本的自評畫面。
- 練習模式（`mode: 'practice'`）同樣適用。

### D0 的驗證方式
- 手動把幾張卡的 `mastery_stage` 改成 3/4/5。
- 測 Enter 送出；用 `árbol`、`año`、`mañana` 這種字測遮字和比對；測沒有例句的 S4 卡。
- S5：選項不重複，正確答案位置隨機；答對、答錯、超時三種評分都對；`1–4` 鍵不會衝突。
- `cd client && npm run build`。

---

## D1. AI 用量紀錄與上限（分支 `feature/ai-usage`，約半天）
1. 新增 `ai_usage(id, user_id, feature, model, key_source, input_tokens, output_tokens, created_at)`，用 `runMigrations()` 現有的 `CREATE TABLE IF NOT EXISTS` 寫法。
   - `key_source` 是 `'user'` 或 `'server'`，表示這次用的是使用者自己的 Key 還是伺服器的 Key。
2. `server/ai.js` 新增 `recordUsage(userId, feature, keySource, { usage, model })`；`extractSpanishWords` / `calibrateDeleLevels` 改成把 `usage` 往上傳，而不是丟掉。
3. 抽出 `resolveApiKey(req)` → `{ apiKey, keySource }`，取代 index.js 裡重複的 Key 判斷。
4. `checkDailyLimit(userId, keySource)`：只有用伺服器 Key 時才限制（env `AI_DAILY_LIMIT`，預設 50）。超過回 **429**，不能用 401/403，因為 `fetchAPI` 遇到這兩個會把使用者登出。
5. `GET /api/ai/usage` → 今天和本月各功能的次數與 token 數。
6. `SettingsModal.jsx` 在 DELE 校準按鈕下面（約 199 行）加一行小字「今天 AI 呼叫 N 次 · 本月 M 次」。
7. 每個 AI 功能統一用 `AI_MODELS` 指定模型：萃取用 flash（照片辨識要準確）；例句、字典、講解、短文用 flash-lite（省額度）。

---

## D2. S4 例句庫（分支 `feature/example-bank`，AI 省量版）

**目標**：S4 每次換不同的句子，而且盡量不多花 AI 額度。

### D2-1 資料表
```sql
card_examples(id INTEGER PRIMARY KEY, user_id INTEGER, card_id INTEGER,
  sentence_es TEXT, answer TEXT, sentence_zh TEXT,
  source TEXT,          -- 'extract' | 'backfill' | 'manual'
  used_count INTEGER DEFAULT 0, flagged INTEGER DEFAULT 0, created_at TEXT)
CREATE INDEX idx_card_examples_card ON card_examples(user_id, card_id);
```
- `answer` 是句子裡實際出現的形式（例如 `nadamos`）。前端把 `sentence_es` 裡的 `answer` 挖空，比對時直接比 `answer`，不靠 regex 猜。

### D2-2 萃取時順便生成（幾乎不多花額度）
- `CARD_SCHEMA`（`server/ai.js:211`）加上選填欄位 `extra_examples: [{ sentence_es, answer, sentence_zh }]`，prompt 要求再給 2 句不同時態 / 人稱的例句。
- 只是同一次呼叫多輸出一些 token，不會多一次請求。
- `POST /api/cards` 收到 `extra_examples` 時寫進 `card_examples`（`source='extract'`）。`AiImporter.jsx` 存檔時保留這個欄位（目前會被 strip 掉的只有 `exists`、`id_temp`、`forms`）。

### D2-3 舊卡片批次補齊（手動觸發）
- `POST /api/ai/examples/backfill` `{ scope: 'stage4' | 'all', limit: 25 }`：挑出例句少於 2 句的卡片，**S4 以上的卡優先**，一次呼叫處理 25 張，用 flash-lite。
- 單字庫頁面或設定頁加一個按鈕：「為 S4 單字補例句（約 N 張，需 M 次 AI 呼叫）」，按下前先顯示預估次數。
- 伺服器端驗證：`answer` 必須真的出現在 `sentence_es` 裡（用 Unicode regex）；驗證不過的句子直接丟掉。
- **不做自動背景生成**，避免偷偷消耗額度。

### D2-4 S4 輪替
- 學習時從 `card_examples` 加上原本的 `example_es`，挑 `used_count` 最少的一句。
- 可以在 agenda 回應裡一起帶出（`examples` 陣列），不另外發請求。
- 翻面後顯示「🚩 例句有誤」→ `POST /api/examples/:id/flag`，之後就不會再出現。
- `PUT /api/cards/:id` 修改 `word` 時刪掉這張卡的例句；兩個刪除卡片的 API 也要一起刪。

### D2 的驗證方式
萃取一段文字 → 確認 `card_examples` 每張卡有 2 句、`ai_usage` 只多 1 筆；用 5 張 S4 卡測批次補齊（只多 1 次呼叫）；同一張 S4 卡複習 3 次，句子會輪替；回報後那一句不再出現。

---

## D3. 字典查詞 + 例句點字查詢（分支 `feature/dictionary-word-lookup`，✅ 已完成 2026-10-16）

> 和「複習時點例句裡的單字查詢（Duolingo 式）」合併成同一套查詞引擎。

**查詞順序（越前面越便宜）**：
1. **離線 Wiktionary 西英字典**（`data/dict/es-en.sqlite`，kaikki.org 資料，`npm run build:dict` 建置）：變化形 → 原形（`fui` → ir / ser）、英文釋義、陰陽性。0 額度。
2. **我的單字庫**：用原形比對自己的卡（含 `bonito/a`、反身動詞 `-se`）；輸入中文時搜尋中文釋義。
3. **共用快取**：`sentence_analyses`（整句逐字解析）、`dictionary_cache`（單字詞條）。
4. **AI（只在按下按鈕時）**：
   - 點字視窗：「✨ AI 解析這句」→ `POST /api/sentences/analyze`，一次解析整句，同句其他字不再呼叫。
   - 字典頁：「用 AI 查中文」→ `POST /api/dictionary/ai`，沿用 `CARD_SCHEMA` + `normalizeAiCard`。
   - 兩者都用 flash-lite（`GEMINI_FALLBACK_MODEL`），失敗才換主模型。

**收錄**：「加入單字庫」→ `POST /api/dictionary/add`，進暫存箱（Inbox）；有整句解析時直接用它建卡（例句 = 遇到這個字的句子），否則先查一次 AI 詞條。**不使用 `POST /api/cards`**：它的 upsert 會把已存在的學習中卡片改回暫存箱。（原本規劃的 `WordModal mode="create"` 因此不需要。）

**前端**：`TappableSentence.jsx`（點字 + 視窗，取代自適應學習 5 處例句）、`WordLookupPanel.jsx`（點字視窗與字典頁共用）、`DictionaryView.jsx`、Navbar「查詞」入口（手機在頂部列）。

**尚未做**：AI 呼叫還沒有寫入用量紀錄（等 D1 的 `ai_usage` / `recordUsage`；`analyzeSentence`、`lookupWordAi` 已回傳 `usage`）。

## 句子翻譯與講解（分支 `feature/sentence-translator`，✅ 已完成 2026-10-17）

> 規劃外新增，依使用者需求。設計見 `docs/superpowers/specs/2026-10-17-sentence-translator-design.md`。

- 新分頁「翻譯」：輸入句子（主要西語，也接受中文）→ `POST /api/translations`。
- **一次 AI 呼叫**（`translateSentence`，flash-lite，失敗才換主模型）回傳：中英翻譯、原句錯誤修正、1–6 個重點（grammar / idiom / usage / culture / mistake，各 0–2 例句）、0–2 個其他說法。不列單字清單：單字用 `TappableSentence` 點擊查詢（與 D3 共用查詞引擎與「加入單字庫」）。
- **省額度**：`translations` 表以 `input_hash`（小寫 + 空白正規化）查詢；自己的紀錄 → 任何人查過的同一句 → 才呼叫 AI。
- 同時移除 Web 的自由翻卡與盲測拼寫分頁（D6 原本要在 `FlashcardReview` 背面顯示圖片，改為只在 Stage 1/2 翻面後顯示）。
- **尚未做**：用量紀錄（等 D1 `recordUsage`；`translateSentence` 已回傳 `usage`）。

## D4. 答錯提示（分支 `feature/mistake-hints`）

1. **本機判斷（不用 AI）**，加在 `utils/spanish.js` 的 `diagnoseMistake(userAnswer, card)`，回傳一句中文提示：
   - 只差重音或 ñ → 「只差重音：año（你打 ano）」
   - 冠詞或陰陽性錯 → 「這個字是陰性：la mano」
   - 字尾不同（-o/-a、-s、動詞字尾）→ 「字根對了，注意字尾：hablé」
   - 拼字相似（編輯距離 ≤ 2）→ 「拼字接近，差在：…」
   - 其他 → 顯示卡片的 `notes`（裡面有陰陽性變化和文法重點）
2. 顯示在 Stage 3 / 4 / 5 答錯的區塊（`AdaptiveStudySession.jsx` 585-602、724-747，以及新的 S5）。
3. **選用的 AI 講解**：本機判斷落到「其他」時，才顯示「💡 請 AI 解釋」按鈕。
   - `POST /api/ai/explain` 用 flash-lite，回 2–3 句。
   - 依 `(card_id, 正規化後的錯誤答案)` 快取在 `ai_explanations`，同一個錯答不會再問一次。
4. 驗證：故意打 `ano`、`el mano`、`hablo`（答案是 `hablé`）、完全不相干的字。

---

## D5. 每日閱讀短文（分支 `feature/daily-reading`，低優先）
- **手動生成**：駕駛艙在 `TodayProgressCard` 下方（`DailyAgendaCockpit.jsx:165` 後）加一張「📖 今日短文」卡片，按下才生成。一天最多 1 篇，存在 `daily_readings(user_id, date, card_ids, content)`。
- 選字：今天複習過的卡優先，再補最近 3 天複習過的，共 10–15 個；flash-lite 生成 150–200 字短文和 2 題理解題。
- `App.jsx` 新增 `activeTab === 'reading'` → `DailyReadingView.jsx`：目標單字畫底線、可以點開詳情；每段可以切換中文翻譯。
- 朗讀：`/api/tts` 透過 Google translate_tts，單次大約只能約 200 字，要**逐句**呼叫 `playSpanishPronunciation`。
- 不影響 FSRS 排程。

---

## D6. 卡片圖片（不用 AI 生圖）
- **改成上傳自己的圖片**，例如課本截圖、手機拍的實物、網路找的圖。AI 生圖成本高，抽象詞效果又差，跟「省額度」的方向不合，所以**不做**。
- `cards.image_path` 欄位；`PUT /api/cards/:id/image`（multer）；上傳前在瀏覽器用 canvas 縮成 512px WebP。
- 存在 `data/images/<userId>/<uuid>.webp`（`data/` 已經是 Docker volume）。`express.static('/media')` 要註冊在 `index.js:1126` 的 client static 之前。
- `WordDetailModal.jsx`：圖片放在翻譯和例句之間（127–130 行），加上傳 / 移除按鈕；另外加一個「🔍 Google 圖片」連結，方便找圖。
- 學習時在 Stage 1/2 翻面後顯示圖片（Web 的 `FlashcardReview` 已於 2026-10-17 移除）。
- 備份限制：JSON 備份不包含圖片，要在設定頁註明。

---

## 建議順序與工作量

| 順序 | 項目 | 預估 | AI 額度 |
|---|---|---|---|
| 1 | D0 前置修正 + S5 四選一 | 1–1.5 天 | 0 |
| 2 | D1 用量紀錄 | 0.5 天 | 0 |
| 3 | D2 例句庫 | 1.5 天 | 很少 |
| 4 | D3 字典 | 1 天 | 按需 |
| 5 | D4 答錯提示 | 0.5–1 天 | 預設 0 |
| 6 | D5 短文、D6 圖片 | 各約 1 天 | D5 每天最多 1 次；D6 為 0 |

每一項各開分支；完成後更新 `CHANGELOG.md`、`功能清單與Roadmap.md`、`專案開發狀況總覽.md`，並同步改寫 `開發進度/AI功能延伸規劃.md`，用這份 v2 取代原本的 C0–C5。
