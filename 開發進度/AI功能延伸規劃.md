# 🤖 AI 功能延伸規劃 (C0–C5)

> **建立日期**：2026-10-11
> **前置工作**：A. AI 萃取修復（分支 `fix/ai-extract`，已完成）
> **決策紀錄**：Google Sheet 同步方案不做（需要時直接下載 CSV 上傳即可）。
> **模型**：文字 `gemini-3.6-flash` / `gemini-3.5-flash-lite`；圖片 `gemini-3.1-flash-lite-image`。請以 [官方模型清單](https://ai.google.dev/gemini-api/docs/models) 為準。

每一項各開一個 `feature/` 分支，完成後依 AGENTS.md 更新 CHANGELOG、Roadmap 與總覽。

---

建議順序：**C0 → C1 → C2 → C3 → C4 → C5**，每項各開一個 `feature/` 分支，做完就更新文件。

### 共同原則
- 所有呼叫都走 A1 的 `callGemini` + responseSchema。
- **API Key 不存到資料庫**：AI 只在請求帶有 Key（或伺服器 `.env` 有 Key）時才執行，不做背景排程。這樣不需要保管使用者的 Key。
- 能預先生成並快取的就不即時呼叫，複習時不讓使用者等 AI。
- 不加重型套件（不用 `sharp`、`googleapis`），維持約 35MB 記憶體。
- 注意：`server/db.js` 沒有開 `PRAGMA foreign_keys`，所以 FK cascade 不會生效。新表要在刪除卡片的 API（`DELETE /api/cards/:id`、`/api/cards/batch-delete`）裡**手動一起刪掉**。

---

## C0. AI 共用基礎（分支 `feature/ai-foundation`，約半天）
1. **用量表** `ai_usage(id, user_id, feature, model, input_tokens, output_tokens, created_at)`，加在 `server/db.js` 的 `runMigrations()`。
2. `callGemini` 接受 `{ userId, feature }`，成功後寫一筆用量。
3. **每日上限**：`checkDailyLimit(userId, feature, limit)`，上限用 env 設定（例如 `AI_DAILY_LIMIT_IMAGE=20`、`AI_DAILY_LIMIT_TEXT=300`）；只有用伺服器 Key 時才限制，使用自己 Key 的人不受限。
4. `GET /api/ai/usage`：回傳今天 / 本月各功能的次數和 token 數，在 `SettingsModal` 顯示一個簡單的用量區塊。
5. 驗證：呼叫萃取後查 `ai_usage` 有新紀錄；把上限設成 1，第二次呼叫回 429 並顯示中文說明。

---

## C1. S4 / S5 AI 出題 ⭐（分支 `feature/ai-exercises`，約 2–3 天）

**要解決的問題**：Stage 4 克漏字每次都用卡片上同一句 `example_es`，背到的是句子而不是單字；Stage 5 只是看西語回想意思，跟 Stage 1 幾乎一樣。另外現有的遮字 regex 用 `\b`，在 JS 裡遇到帶重音的字母（á、ñ）會判斷錯誤。

### 步驟 1：資料表
```sql
ai_exercises(
  id INTEGER PRIMARY KEY, user_id INTEGER, card_id INTEGER,
  type TEXT,            -- 'cloze' | 'choice'
  payload TEXT,         -- JSON
  used_count INTEGER DEFAULT 0, last_used_at TEXT,
  flagged INTEGER DEFAULT 0,  -- 使用者回報有錯的題目
  model TEXT, created_at TEXT
)
CREATE INDEX idx_ai_ex_card ON ai_exercises(user_id, card_id);
```

### 步驟 2：題型與 JSON 結構（`server/ai.js` 的 `generateExercises(cards)`）
- **S4 `cloze`（語境克漏字）**：`{ sentence_es: "Ayer ___ en la playa.", answer: "nadamos", accepted: ["nadamos"], lemma: "nadar", sentence_zh, hint_zh: "第一人稱複數 · 過去式" }`
  - 每張卡生成 3 題，要求語境、時態、人稱都不同，而且不能跟原本的 `example_es` 一樣。
  - 答案是變化後的形式，直接比對 `answer` / `accepted`，不再靠 regex 遮字。
- **S5 `choice`（語境四選一，要快速作答）**：`{ prompt_zh 或 sentence_es（含空格）, options: [4 個西語選項], correct_index, explanation_zh }`
  - 干擾選項要用近義詞、形近字、易混淆的變化形（例如 ser/estar、por/para）。
  - 每張卡生成 3 題。
- 一次 API 呼叫批次處理最多 10 張卡，用 `gemini-3.6-flash`、temperature 0.7（題目要有變化）。
- prompt 要求：只用 A2–B2 常用詞、重音必須正確、答案只能是目標單字的某個形式。
- 伺服器端驗證：`answer` 必須出現在空格位置；`options` 剛好 4 個且不重複；`correct_index` 在 0–3 之間。不合格的題目直接丟掉。

### 步驟 3：API
- `POST /api/ai/exercises/prefetch` `{ card_ids: [...] }`：找出 S4/S5 而且**沒被回報、還沒用過的題目少於 2 題**的卡片 → 批次生成 → 寫入資料表 → 回傳 `{ generated, skipped }`。需要 Key。
- `GET /api/ai/exercises/next?card_id=`：挑一題 `flagged=0`、`used_count` 最少的（同樣次數就隨機），回傳後 `used_count+1`；沒有題目就回 `null`。
- `POST /api/ai/exercises/:id/flag`：回報有錯 → `flagged=1`。
- 刪除卡片時一起刪掉它的題目；卡片被 `PUT` 修改單字時，刪掉舊題目。

### 步驟 4：前端（`client/src/components/AdaptiveStudySession.jsx`）
- 開始學習時，把 queue 裡 S4/S5 的 card_ids 送到 `prefetch`。**不 await**，失敗也不影響學習。
- 輪到 S4/S5 的卡片時呼叫 `next`：
  - 有題目 → 用 AI 題型畫面；
  - 沒題目、還沒生成好、或沒有 Key → **退回現在的畫面**（原例句克漏字 / S5 原本的畫面）。
- S4 cloze：沿用現有的輸入框、重音虛擬鍵盤和 Enter 送出；答對自動評 3（Good），答錯翻面讓使用者自己評分（跟現在 Stage 3/4 一樣）。
- S5 choice：鍵盤 `1–4` 選答案（作答前 1–4 是選項，翻面後才變成評分鍵，避免衝突）；**答對且 3 秒內 → 評 4（Easy），超過 3 秒 → 3（Good），答錯 → 1（Again）**。
- 翻面後顯示 `sentence_zh` / `explanation_zh`，加一個「🚩 題目有誤」按鈕。
- 頁首顯示「AI 題」標籤，讓使用者知道題目是 AI 出的。

### 步驟 5：Mobile
- 先不做。Mobile 目前沒有五階段學習流程，等 Mobile 補上學習模式後再接同一組 API。

### 步驟 6：驗證
- 手動把幾張卡的 `mastery_stage` 設成 4/5 → 開始學習 → 確認 `ai_exercises` 有新題目，而且畫面用的是 AI 題。
- 沒有 Key 時能正常退回原本的畫面。
- 帶重音的答案（`tú`、`año`）比對正確。
- 回報題目後，那一題不會再出現。
- 同一張卡複習 4 次，題目會輪替。

---

## C2. AI 字典查詞 + 一鍵收錄（分支 `feature/ai-dictionary`，約 1–1.5 天）

### 步驟 1：快取表
`dictionary_cache(query_norm TEXT PRIMARY KEY, result TEXT, model TEXT, created_at TEXT)`。所有使用者共用；`query_norm` 是轉小寫、去掉頭尾空白後的查詢字（保留重音）。

### 步驟 2：`GET /api/dictionary/lookup?q=`
1. 先查使用者自己的單字庫（`word = ?` 或 `translation LIKE ?`）→ 有的話回傳 `{ source: 'mine', cards }`。
2. 再查 `dictionary_cache` → `{ source: 'cache', entries }`。
3. 都沒有就呼叫 AI `lookupWord(q)`：
   - 輸入可以是西語、中文或英文。
   - 回傳 1–3 個詞條（多義字或中文查詢會有多個候選），每個詞條的欄位跟萃取的卡片相同（沿用 A1 的 schema），另外加 `conjugation_hint`（動詞的話，給現在式 yo/tú/él 的變化）。
   - 輸入如果是變化後的形式（例如 `fui`），要還原成原形（`ir`），並在 `notes` 註明。
4. 結果寫進快取，回傳 `{ source: 'ai', entries }`。

### 步驟 3：前端 `client/src/components/DictionaryView.jsx`
- 啟用輸入框；Enter 送出；loading 時顯示 skeleton。
- 結果卡片顯示單字、冠詞、詞性、中英釋義、例句和發音按鈕（沿用 `utils/speech.js` 的 `playSpanishPronunciation`）。
- 「收錄」按鈕 → 選分類（沿用 categories）→ `POST /api/cards`。已在單字庫的顯示「已收錄」，並提供「查看」打開 `WordDetailModal`。
- 收錄前可以先編輯欄位（重用 `WordModal` 的表單）。
- 用 localStorage 記住最近 10 筆查詢。

### 步驟 4：Mobile
- 新增 `mobile/src/app/dictionary.tsx`，用同一組 API，放在 AI 頁面裡當第二個分頁。

### 步驟 5：驗證
- 查 `hablar`、`蘋果`、`fui`、拼錯的字（例如 `manzanna`）。
- 第二次查同一個字不會呼叫 AI（`ai_usage` 沒有新紀錄）。
- 收錄後單字庫有這個字，再查一次顯示「已收錄」。

---

## C3. 答錯時 AI 講解（分支 `feature/ai-explain`，約半天到 1 天）

1. 快取表 `ai_explanations(card_id, user_answer_norm, explanation, created_at, PRIMARY KEY(card_id, user_answer_norm))`。
2. `POST /api/ai/explain` `{ card_id, user_answer, context }`（`context` 是 stage 或 AI 題目內容）→ 用 `gemini-3.5-flash-lite` 回傳 `{ why_zh（1–2 句）, rule_zh（相關規則，可以是空的）, memory_tip_zh }`。
   - prompt 重點：先判斷錯誤類型（重音、拼字、變化、陰陽性、選到近義詞），再解釋；不要長篇大論。
3. 前端：Stage 3/4（包括 C1 的 AI 題）答錯翻面後，出現「💡 為什麼錯？」按鈕 → 點了才呼叫，結果顯示在評分按鈕上方。只差在重音的錯誤，直接在本機提示「只差重音」，不呼叫 AI。
4. 驗證：故意打 `manana`（漏了 ñ）、`hablo`（答案是 `hablé`）、選錯 ser/estar；同一個錯答第二次直接用快取。

---

## C4. 每日閱讀短文（分支 `feature/ai-daily-reading`，約 1.5–2 天）

1. 資料表 `daily_readings(id, user_id, date, level, card_ids TEXT, content TEXT, created_at)`，每天最多重新生成 3 次（舊的保留）。
2. 選字邏輯 `pickReadingWords(userId)`：最近 3 天複習過、Stage 2–4 的卡片優先，不夠再補今天到期的卡片，總共 10–15 個；`level` 取這些卡片的 DELE 級數中位數。
3. `GET /api/ai/daily-reading?date=today`：有就回傳；沒有而且帶了 Key 就生成。`POST /api/ai/daily-reading/regenerate`。
4. AI 輸出 `{ title_es, title_zh, paragraphs: [{ es, zh }], target_words: [{ card_id, surface }], questions: [{ q_zh, options[4], correct_index }] }`，文章 150–250 字，目標單字可以用變化後的形式出現。
   - 伺服器端驗證每個 `surface` 真的有出現在文章裡，沒出現的就移除標記。
5. 前端：
   - `DailyAgendaCockpit.jsx` 加一張「📖 今日短文」卡片（顯示標題和用到幾個單字）→ 點開新的 `DailyReadingView.jsx`。
   - 內文用 Dark Glassmorphism 樣式，目標單字畫底線、可以點 → 打開 `WordDetailModal`；每段可以切換中文翻譯；可以整篇朗讀（用 `/api/tts` 或 speech.js）。
   - 文末 2–3 題理解選擇題，作答結果只在本機顯示，**不影響 FSRS 排程**。
6. 驗證：學習數天後生成短文，確認大部分目標單字都有標記；同一天第二次打開不會重新生成；超過重新生成上限時有提示。

---

## C5. AI 記憶圖片（分支 `feature/ai-card-images`，約 1.5–2 天）

### 定位
只用在**具體名詞**（例如 manzana、paraguas），**只能手動觸發**，每張圖都要使用者按確認才存。抽象詞、動詞、文法詞的生成按鈕會隱藏在「仍要生成」後面。

### 步驟
1. 欄位 `cards.image_path TEXT DEFAULT ''`（migration）。
2. 儲存位置 `data/images/<userId>/<uuid>.webp`；`data/` 已經掛成 Docker volume，重新部署不會遺失。用 `express.static` 掛在 `/media`，檔名用隨機 uuid 防止被猜到（`<img>` 沒辦法帶 JWT）。
3. `POST /api/cards/:id/image/generate`：
   - 用 `gemini-3.1-flash-lite-image` 生成。
   - prompt：單一主體、簡單背景、扁平插畫風格、**畫面裡不能有文字**（避免拼錯的字誤導學習）。
   - 只把 base64 預覽回傳給前端，**伺服器不存檔**（不要的圖不佔空間）。
   - 經過 C0 的每日上限檢查（伺服器 Key 時，例如每天 20 張）。
4. `PUT /api/cards/:id/image`（multer 上傳）：前端確認後，用 canvas 縮成 512px WebP（約 30–60KB）再上傳。**同一個 API 也讓使用者上傳自己的照片**，不一定要用 AI 生成。不用 `sharp`，避免增加伺服器記憶體。
5. `DELETE /api/cards/:id/image`：刪檔、清空欄位。刪除卡片時一起刪掉圖片檔。
6. 前端：
   - `WordDetailModal.jsx`：顯示圖片，加上「✨ AI 生成 / 📷 上傳 / 🗑 移除」按鈕。生成後出現預覽，可以選「採用 / 重新生成 / 取消」。
   - `AdaptiveStudySession.jsx` Stage 1/2 翻面後顯示圖片；`FlashcardReview.jsx` 卡片背面顯示圖片。
7. 備份限制：現有的 JSON/CSV 備份不包含圖片，要在設定頁註明；之後可以考慮匯出 zip。
8. 驗證：生成 → 預覽 → 採用 → `data/images` 出現約 50KB 的 webp，重新整理後圖片還在；取消後沒有存檔；刪除卡片後檔案也被刪掉；超過每日上限時有提示。

---

## 工作量總覽

| 項目 | 預估 | 依賴 |
|---|---|---|
| A 修復 | ✅ 已完成 | – |
| C0 基礎 | 0.5 天 | A |
| C1 S4/S5 出題 | 2–3 天 | C0 |
| C2 字典 | 1–1.5 天 | A（C0 可選） |
| C3 錯題講解 | 0.5–1 天 | C0（搭配 C1 效果更好） |
| C4 每日短文 | 1.5–2 天 | C0 |
| C5 記憶圖片 | 1.5–2 天 | C0 |
