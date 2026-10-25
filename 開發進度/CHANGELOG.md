# 📝 PalabraCard 更新日誌 (CHANGELOG)

本專案遵循 [Semantic Versioning (語意化版本 2.0.0)](https://semver.org/lang/zh-TW/) 與 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 格式標準。

---

## [Unreleased] (進行中 / 待發布)

### Added
- **常用字字源圖鑑（`server/data/lexicon/freq/`）**：把字源圖鑑從 A1 的 1,038 字往整本字典擴充，依西語使用頻率（wordfreq）從最常用的字做起，變化形併入原形、A1 已有的字跳過，每 100 個原形一批。
  - **文字由 Gemini 撰寫、直接寫入資料檔**：`gemini-write.js` 把每個字的 Wiktionary 事實（`fetch-facts.js`）送給 agy MCP 的 `ask_gemini`，產出中文的字根拆解、字源鏈、字源故事、英文同源字、記憶聯想、用法與例句。回答不經 Claude 審閱，改由 `geminiEntries.js` 機器檢查：schema 與長度（沿用 `validate.js`）、繁體中文（簡體字偵測）、字源鏈的每個祖先字都必須出現在事實裡、`sources` 只能是實際抓過的頁面、事實沒有詞源就改成只有記憶聯想（hook-only）；不合格的字帶著錯誤重問一次，仍不合格記進 `failed.json` 之後重跑。條目帶 `writer: "gemini"`，字源卡顯示「Gemini 撰寫、程式檢查」。
  - **每個字都有 SVG 插圖**：Claude 依 `draw-list.js` 只讀到的「字、詞性、中文、記憶聯想」畫插圖規格（`art/freq-<批次>.js`），`mark-drawn.js` 把畫好的字從 emoji 換成 SVG。
  - **選字規則**：變化形併回原形（`fetch-facts.js` 記錄 `form_of`，`podemos` → poder 而不是 podar；`nueva` → nuevo；`pasa` → pasar），名詞有自己的意思就保留（estado、gobierno、lista）；拼錯的字（`aqui`、`dia`）歸到正確拼法；人名、縮寫等非單字跳過（luis、cuba、sr）。字表改變時 `rebatch.js` 搬移已寫好的條目、刪掉被併掉的字的插圖。
  - **批次 agent（`batch-agent.js`、`batchCheck.js`）**：改用 agy MCP 的非同步批次工作，一次把 100 字交給 Gemini agent，附上由同一套檢查規則產生的 `check.mjs` 讓它自己修到全部通過；每批約 11–14 分鐘（原本逐次呼叫 35–40 分鐘）。agent 判斷是人名、地名、英文字或變化形的字記在 `freq-skip.json`。
  - **進度**：前 56 批、約 5,500 字完成文字與插圖（每批由繪圖 agent 畫、看縮圖總覽修正）。
  - 其他：`server/scripts/lexicon/agy.js`（agy MCP 的 JSON-RPC 用戶端）、`build-queue.js`（頻率字表 → 原形批次，批次編號固定）；`lexicon.js` / `validate.js` 改成讀 `a1/` 與 `freq/` 兩個資料夾（同一個字以 A1 為準）；設定頁的「A1 圖鑑」字數改稱「字源圖鑑」。
- **開發工具：AI agent 可以問 Gemini (`.mcp.json`)**：專案層級的 MCP 設定，連到另外部署的 [antigravity-mcp](https://github.com/CCHENYUCHI/antigravity-mcp)（Oracle 上的 Docker 容器，透過 Antigravity CLI 使用免費的 Gemini 額度），提供 `ask_gemini` 工具，給雲端 Claude Code 用來請 Gemini 給第二意見或做大量撰寫 / 檢查工作（例如字根字首表）。不影響 PalabraCard 本身；token 不在 repo 裡，雲端環境用 network secret 帶上，本機用 user scope 的 MCP 設定。
- **變化表視窗 (`FormsModal.jsx`)**：在字典頁每個動詞 / 名詞 / 形容詞條目旁按「變位表 / 變化表」，或在單字卡詳情的字典資料區按按鈕，開出獨立視窗：動詞依語氣（直陳式、虛擬式、命令式）各一張表，人稱 × 時態；名詞與形容詞是陰陽性 × 單複數表，另列指小詞等。點任一個形態可以聽發音；手機上表格可橫向捲動、人稱欄固定；`Esc` 關閉。
- **單字庫健檢 (`CardAuditModal.jsx`, `server/cardAudit.js`)**：單字庫頁「單字庫健檢」按鈕。比對每張卡和離線字典，分類列出：詞性不同、陰陽性不同、冠詞不同、可能是變化形（`fui` → ir / ser，可勾選改成原形）、字典有多個詞性無法判斷、字典查不到、和其他卡是同一個字。每筆顯示「目前 → 字典」的差異，可改選對應的字典條目（例如 comer 名詞 / 動詞）；勾選或全選後「依字典修正」把詞性 / 陰陽性 / 冠詞**寫回卡片**（中文、例句、筆記、學習進度不動），每批可「復原」；「保留現狀」後同一個問題不再提醒。
  - API：`GET /api/cards/audit`、`POST /api/cards/audit/apply`、`POST /api/cards/audit/dismiss`、`POST /api/cards/audit/undo`。
  - 資料表：`card_audit_log`（每批修正前後的值，供復原）、`card_audit_dismissed`（保留現狀的問題）。
- **設定畫面的版本資訊 (`VersionInfo.jsx`, `GET /api/version`, `server/buildInfo.js`)**：顯示畫面（前端）與伺服器各是哪個分支 / commit、前端 build 時間、伺服器啟動時間；字典版本（v1 / v2、詞條數、建置時間、是否含變位 / 字源 / 例句 / 發音、A1 圖鑑字數）；已連結字典的單字數。畫面和伺服器版本不同、沒有字典或字典是舊版時顯示提示與該執行的指令；「複製版本資訊」方便回報問題。前端版本在 `vite build` 時寫入；Docker 沒有 `.git`，用 build args `APP_COMMIT` / `APP_BRANCH`。
- **離線字典 v2 (`server/scripts/build-dictionary.js`, `server/dictionaryExtras.js`, `server/forms.js`)**：除了英文釋義，再存每個字的**發音 IPA、變形、例句、字源**（只增不減，舊版字典檔照常運作、缺的區塊不顯示）。
  - **變形（`forms` 表）**：動詞完整變位（直陳式 / 虛擬式 / 命令式 × 各時態 × yo / tú / vos / él / nosotros / vosotros / ellos；去掉 `hablarme` 這類代名詞合併形與 `-se` 虛擬式），名詞與形容詞的陰陽性、單複數、指小詞。
  - **例句（`examples` 表）**：每字最多 2 句，只留有英文翻譯的完整句子（不收引文與雙字詞組）；**只有約 3% 的字有例句**，沒有中文翻譯，只當參考。
  - **字源（`etymology` 表）**：英文字源文字（去掉家族樹雜訊、截 600 字）＋由詞源模板整理的精簡祖先鏈（古西班牙語 → 拉丁語 → …，語言名稱翻成中文，`server/langNames.js`）。
  - **IPA**：`entries.ipa`。
  - 實測（kaikki 完整檔，約 1GB / 811,049 行）：797,592 筆、**143MB、建置約 26 秒、建置時尖峰約 120MB 記憶體**；A1 的 1,038 字中 1,014 有字典條目、885 有變形、994 有字源、416 有例句。`meta.schema_version = 2`。
- **單字庫連結字典 (`server/cardDict.js`, `cards.dict_lemma` / `dict_pos`)**：卡片存「字典原形＋詞性」（不存 rowid，字典重建後仍有效），NULL＝還沒比對、空字串＝比對過但字典沒有。
  - 新增 / 編輯 / CSV 匯入 / 從字典加入時自動連結；伺服器啟動時補連結尚未比對的卡；`npm run link:cards`（加 `--relink` 重新比對全部，字典重建後使用）。
  - 連結後，卡片讀回時的**陰陽性、詞性、英文意思**改用字典值（網頁與手機 App 都不必改）；卡片自己的欄位保留為備援（片語、自己造的字、沒有字典檔時）。已有的冠詞（`el agua`）與英文意思不會被覆蓋，`m or f` 的字保留卡片原值。**不刪任何卡片資料**。
  - 新增 `GET /api/cards/:id/dictionary`、`GET /api/dictionary/entry?lemma=&pos=`：按需回傳 IPA、變位表、例句、字源與圖鑑（約 8ms）。
- **字典資料區塊 (`DictionaryExtras.jsx`)**：單字卡詳情直接載入連結的字典資料；字典頁每個詞條有「字典資料：變位、字源、例句」，點開才載入。動詞變位依語氣收合，名詞 / 形容詞顯示陰陽單複數。

- **A1 字源圖鑑（1,038 字，Claude 編寫）(`server/data/lexicon/`, `server/lexicon.js`, `StoryCard.jsx`)**：西語 A1 常用字（13 個主題：功能詞、數字與時間、人與家庭、身體與健康、食物、居家、衣物、城市與交通、學校與工作、自然與動物、顏色與形容詞、常用動詞、生活），每個字有中文意思、IPA、字源鏈（例如 波斯語 → 阿拉伯語 → 古西語 azur → azul）、英文同源字、字源故事、記憶聯想、用法提醒、A1 例句與插圖。資料一次寫好存成 JSON，**完全離線、不花 AI 額度**。
  - **有根據的字源**：每個字先用 `server/scripts/lexicon/fetch-facts.js` 從 kaikki.org（Wiktionary，CC BY-SA）抓詞源事實，並沿詞源往上追拉丁文等祖先詞條；故事只根據這些事實寫，Wiktionary 標示「可能 / 推測」的照實標示；查不到字源的字只寫記憶聯想（`confidence: hook-only`），不編字源。
  - **插圖**：手寫的插圖規格（`server/data/lexicon/art/*.js`）由 `render-art.js` 渲染成 SVG（`client/public/lexicon/`，每張多半不到 1KB），可整批切換「扁平插畫」與「線條＋重點色」兩種畫風；682 張 SVG 共約 350KB，功能詞與太抽象的 356 個字改用 emoji。其中 1,008 個字有字源故事，30 個字查不到可靠字源、只寫記憶聯想。
  - **查詞**：`GET /api/dictionary/lookup` 回應新增 `story` 欄位；字典頁與例句點字視窗**預設只顯示一列收合的「字源與記憶法」（縮圖＋一行預覽），有興趣再點開**看完整字源鏈、故事、用法與例句；切換到下一個字時回到收合，可用鍵盤操作。字典有中文就不再顯示「用 AI 查中文」；「加入單字庫」直接用字源圖鑑的內容建卡，不呼叫 AI。
  - **複習**：翻卡 / 作答後才顯示圖片、字源與記憶聯想（作答前不會洩漏答案）；新增 `GET /api/lexicon?word=`。
  - **存放位置**：圖鑑寫進**離線字典檔 `es-en.sqlite` 的 `lexicon` 表**（唯讀開啟，不常駐記憶體），不放在 App 的使用者資料庫；`npm run build:lexicon` 幾秒內寫入既有字典檔（不必重新下載 kaikki），檔案不存在時會建立只含圖鑑的小字典檔；`npm run build:dict` 重建時也會在換檔前一併寫入。
  - **驗證與測試**：`server/scripts/lexicon/validate.js`（欄位、長度、來源、例句含該字、SVG 大小與安全性）；`server/lexicon.test.js`。撰寫規範見 `server/scripts/lexicon/WRITING.md`。

### Fixed
- **`POST /api/cards` 更新既有單字時回傳錯誤的 id**：upsert 撞到已存在的單字時，SQLite 的 `lastInsertRowid` 仍是上一筆，回傳的 id（以及新的字典連結）會指到別張卡；改為依單字查回正確的 id。
- **字典建置：`artista m or f` 這類詞條被讀成只有陽性**（比對順序讓 `m` 搶先於 `m or f`），現在正確標成陰陽同形（`mf`）。

### Documentation
- **重寫 `README.md`**：改為給一般使用者看的應用程式介紹，反映目前功能（今日學習駕駛艙、五階段自適應練習、FSRS v4.5、例句點字查詢 / 離線字典、Mobile App 現況），移除過時的 SM-2 與 Gemini 1.5 說明，部署步驟精簡並收合。
- **延伸功能規劃改為省額度優先版 (`開發進度/AI功能延伸規劃.md`)**：C0–C5 改為 D0–D6；S5 四選一、答錯提示、字典等改以本機邏輯為主，AI 只在必要時按需使用；圖片改為上傳、不做 AI 生圖；只做 Web。

### Added
- **單字查詢紀錄 (`LookupHistory.jsx`, `server/lookupHistory.js`, `GET /api/dictionary/history`)**：每個帳號查過哪些字、查了幾次都會記下來，顯示在「查詞」頁搜尋框下方。不用 AI。
  - **記哪些查詢**：查詞頁的搜尋，以及每日學習、翻譯頁點例句裡的字（標示「查詞」/「點字」）。同一個字（不分大小寫與重音）只有一筆，再查一次次數 +1。同一頁面裡連點同一個字只算一次（沿用前端的查詢快取，並合併重疊的請求，StrictMode 開發模式下也不會重複計算）。
  - **每筆顯示**：查的字 → 原形（`fui → ir`）、中文、查詢次數（3 次以上用黃色標出）、最近查詢時間與來源；已在單字庫的顯示狀態（暫存箱 / 學習中…）。中文依序取：例句解析、我的單字、AI 詞條；先查、後來才加入單字庫的字，會顯示卡片的中文；按「用 AI 查中文」後也會補上中文。
  - **操作**：依「最近」/「最常查」排序、搜尋單字 / 原形 / 中文、點一筆再查一次、「＋ 加入」（打開查詢結果，用原本的「加入單字庫」）、刪除單筆、清除全部、載入更多（每頁 30 筆）。
  - **資料表 `lookup_history`**（每位使用者每個字一筆，`UNIQUE(user_id, query_norm)`，不綁卡片，刪卡不需清理）；`GET /api/dictionary/lookup` 新增 `source=dictionary|tap` 參數並順便記錄（寫入失敗不影響查詢）；新 API `GET /api/dictionary/history?q=&sort=recent|count&offset=`、`DELETE /api/dictionary/history/:id`、`DELETE /api/dictionary/history`。
  - **測試**：`server/lookupHistory.test.js` 涵蓋合併計數、不覆蓋既有中文、AI 補中文、分頁 / 搜尋跳脫 / 排序、單字庫狀態與卡片中文、使用者隔離。
- **句子翻譯與講解 (`TranslatorView.jsx`, `TranslationResult.jsx`, `POST /api/translations`)**：新分頁「翻譯」，輸入一個句子（主要是西語，也可以輸入中文），AI 給出**中文 + 英文翻譯**，並講解 **1–6 個重點**（文法 / 慣用語 / 用法 / 文化 / 易錯，依句子難度決定數量），每個重點可附 0–2 個補充例句，另外視情況給 0–2 個其他說法；原句有錯時顯示修正與原因。
  - **可點字查詢**：西語句子、補充例句與其他說法都用 `TappableSentence`，點單字就能查原形與用法並加入單字庫（不另外列單字清單）；每句都有 🔊 朗讀。
  - **翻譯紀錄**：每次翻譯自動存檔，可搜尋原句或中文、展開重看、刪除、載入更多。
  - **省額度**：一句只呼叫一次 AI（flash-lite，失敗才換主模型）；同一句（不分大小寫與多餘空白）再查直接讀紀錄，**別的使用者查過的句子也直接沿用**，畫面標示「已有紀錄，沒有使用 AI 額度」。
  - **資料表 `translations`**（每位使用者自己的紀錄，不綁卡片，刪卡不需清理）；API `POST /api/translations`、`GET /api/translations?q=&offset=`、`DELETE /api/translations/:id`。
  - **導覽列**：桌面新增「翻譯」分頁；手機底部列改為 今日學習 · 單字庫 · 翻譯 · 查詞 · 統計（查詞從頂部列移到底部）。
  - **測試**：`server/translations.test.js` 涵蓋 AI 結果正規化（截斷、預設值、不完整時報錯）與紀錄存取（快取、搜尋、分頁、只能刪自己的）。
- **字典與例句點字發音**：所有查詞介面都能聽西語發音，沿用既有的 `/api/tts` 代理與瀏覽器 Web Speech，不花 AI 額度、不動後端。
  - **點字自動念**：點例句裡的字會立刻念出那個字（Duolingo 式，每日學習與翻譯頁的句子皆適用）；再點同一個字關閉時不念。在點擊當下同步播放，iOS Safari 也能出聲。
  - **🔊 按鈕 (`SpeakButton.jsx`)**：查詞結果的標題字、原形、我的單字（名詞含冠詞）、AI 詞條單字與例句、Wiktionary 原形（名詞自動加 el / la）旁都有 🔊；按了不會關閉彈窗或翻卡。字典頁搜尋不自動念。
  - **連點不排隊 (`utils/speech.js`)**：原生語音正在念或有排隊時先 `cancel()` 再念，快速連點只念最後一個字（翻卡自動念也一併受惠）。
- **例句點字查詢 (Duolingo 式) + 字典查詞 (D3)**：兩者共用同一套查詞引擎，**本機優先、AI 只在按下時才用**。
  - **點例句裡的單字 (`TappableSentence.jsx`)**：每日複習五個階段的例句都可以點字，跳出原形、中文、用法與英文釋義；桌面是錨定在字下方的小視窗，手機是底部 Bottom Sheet。挖空的答案不能點（不會洩漏答案）；點字不會翻卡；視窗開著時 Space / Enter / 1–4 不會評分，`Esc` 或點外面關閉。
  - **離線西英字典 (`server/scripts/build-dictionary.js`, `server/dictionary.js`)**：由 kaikki.org（Wiktionary）資料建成約 90MB 的 SQLite，查詢時把變化形還原成原形（`fui` → ir / ser、`tuvieron` → tener、`bonitas` → bonito），忽略重音（`arbol` → árbol，但 `año` 優先於 `ano`）；文法標記自動翻成中文（「ir 的 第一人稱 單數 簡單過去式 陳述式」）。檔案不存在時自動略過。執行時只多約 1MB 記憶體。
  - **我的單字庫比對**：透過原形比對自己的卡（`hablamos` → 我的 `hablar` 卡、`acostumbro` → `acostumbrarse`，支援 `bonito/a` 寫法）；輸入中文時搜尋卡片的中文釋義。
  - **整句 AI 解析 (`POST /api/sentences/analyze`)**：查不到中文時按「✨ AI 解析這句」，用 flash-lite 一次解析整句每個字（原形、詞性、此句中的意思、時態人稱 / 搭配），**所有使用者共用永久快取**，之後點同句其他字都不再呼叫 AI。
  - **AI 字典詞條 (`POST /api/dictionary/ai`)**：字典頁「用 AI 查中文」，沿用萃取的卡片格式與原形規則，同樣共用快取（變化形與原形共用一筆）。
  - **加入單字庫（暫存箱）(`POST /api/dictionary/add`)**：一鍵加入 Inbox，優先用整句解析的結果（例句就是你遇到這個字的句子，不再多花 AI）；**已存在的卡完全不動**（不會把學習中的卡改回暫存箱）。
  - **字典頁 (`DictionaryView.jsx`)**：取代原本的空殼；顯示我的單字、AI 詞條、Wiktionary 釋義與 WordReference / SpanishDict / RAE 連結。Navbar 桌面版新增「查詞」分頁，手機版在頂部列加查詞按鈕（底部列已滿）。
  - **查詞 API (`GET /api/dictionary/lookup?q=&sentence=`)**：只查離線字典、單字庫與快取，**永遠不呼叫 AI**。
  - **資料表**：`sentence_analyses`、`dictionary_cache`（不綁使用者與卡片，刪卡不需清理）。
  - **測試**：新增 `npm test`（Node 內建 `node:test`，不裝套件），涵蓋字典建置、變化形還原、重音排序與單字庫比對。
- **S5 語境四選一 (`AdaptiveStudySession.jsx`)**：Stage 5 從「看單字自評」改為四選一。有例句時挖空例句選詞，沒有例句時看中文選西語；3 個干擾選項取自自己的單字庫（同詞性同分類優先），**不使用 AI**。3 秒內答對自動評「熟練」、超過 3 秒評「記得」、答錯標出正解後自行評分；作答前按 1–4 選答案。單字庫不足 3 個干擾選項時退回原本的自評畫面。
- **每日任務與學習紀錄 (Daily Progress & Streak)**：讓使用者清楚知道「今天要做什麼、做了多少、哪些是多出來的練習」。
  - **今日任務卡 (`TodayProgressCard.jsx`)**：取代駕駛艙舊的橫幅與三柱指標；顯示日期、進度圓環（已完成 / 今日目標）、狀態文案（還差 N 個 / 今日目標達成）、今天的練習時段，並註明「每天 00:00 重新計算」。
  - **任務拆分**：到期複習、新單字（受每日上限限制）、加練三格分開統計，各有進度條。
  - **連續天數 (Streak)**：🔥 連續 N 天（今天有練習才點亮；今天還沒練時提示「今天練習來延續」），附最長連續紀錄。
  - **7 天週進度條**：綠色勾 = 達成當日目標、黃色 = 有練習（數字為完成字數）、空圈 = 沒練習。
  - **學習紀錄 (`StudyHistory.jsx`)**：近 30 天每日紀錄（達成 / 進行中 / 未完成、任務完成數 / 目標、複習、新詞、加練、正確率、練習時段）與摘要（練習天數、達成天數、總練習次數、最長連續）。
  - **加練一輪 (Extra Practice)**：`GET /api/study/practice`，挑「今天沒到期、穩定度最低」的單字（優先目前主修單元，不足時從其他單元補）；加練另外記錄，不會被算進今日任務。
  - **學習中即時進度**：自適應學習頂部顯示「今日 x/y」；結束畫面依情況顯示「今日目標達成！/ 這一輪完成（還剩 N 字）/ 加練完成」，附進度圓環與連續天數。
  - **後端 API**：`GET /api/study/today`、`GET /api/study/history?days=30`、`GET /api/study/practice`；`/api/study/agenda` 與 `/api/cards/:id/review` 回傳 `today` 摘要。
  - **資料表**：`review_logs.task_type`（`due` / `new` / `extra`）、新增 `daily_progress`（每日目標快照，讓歷史紀錄能判斷是否達標）；舊紀錄自動回填（每張卡第一次複習 = 新詞，其餘 = 複習）。
- **Mobile 拍照 / 相簿萃取 (`mobile/src/app/ai.tsx`)**：整合 `expo-image-picker`，可直接拍攝講義、白板或從相簿選圖交給 AI 萃取；萃取結果可逐一勾選，只收錄勾選的單字。
- **AI 萃取標示已存在單字**：`/api/ai/extract` 回傳 `exists` 欄位，Web / Mobile 預覽時標示「已在單字庫」並預設不勾選，避免誤覆蓋。
- **AI 萃取新增分類 (`AiImporter.jsx`)**：分類選單新增「＋ 新增分類」；切到上傳照片時預設為新增分類（一張講義 = 一個新分類），預覽頁顯示將匯入的分類。
- **AI 萃取陰陽性補全與修正**：
  - AI 必須為名詞與形容詞填寫陰陽性，並回傳陰 / 陽 × 單 / 複數變化（`forms`）；後端自動寫入文法筆記第一行（例如「陰陽性變化 → 陽性：alto / altos；陰性：alta / altas」），Web 與 Mobile 都看得到。
  - 預覽頁可直接修改單字、冠詞與詞性；名詞 / 形容詞有 ♂ 陽性 / ♀ 陰性（形容詞另有「陰陽同形」）按鈕，切換時自動換成對應形式與冠詞（profesor ↔ profesora）。
  - 動詞一律還原為原形不定式（原文變化形註明於筆記）；預覽頁偵測到非 -ar / -er / -ir 結尾時提示修改。
- **AI 一鍵校準 DELE 級數入口 (`SettingsModal.jsx`)**：後端既有的 `/api/cards/calibrate-dele` 終於有前端按鈕，校準後自動重新載入單字庫。

### Removed
- **自由翻卡、盲測拼寫分頁 (Web)**：今日學習（五階自適應學習）已涵蓋翻卡與拼字練習，移除 `FlashcardReview.jsx`、`SpellingReview.jsx`、只有翻卡使用的 `utils/fsrsPreview.js`、相關導覽與 CSS，以及只給它們用的 `/api/cards/due` 抓取。後端 API、`review_mode` 欄位與 `mobile/` 不受影響。

### Changed
- **`.dockerignore` 排除整個 `data/`**：資料庫與離線字典（約 90MB）由 volume 掛載，不再送進 Docker build context，避免每次重建都上傳。
- **西語比對工具共用 (`client/src/utils/spanish.js`)**：`stripArticle`、`getAcceptableAnswers`、`maskSentence`、`findInflectedForms`、`pickDistractors` 等，供自適應學習與拼字測驗共用。
- **Gemini 呼叫層重構 (`server/ai.js`)**：抽出共用 `callGemini()`，改用 Node 內建 `fetch`、`responseSchema` 強制 JSON 結構；API Key 改放在 `x-goog-api-key` header（不再出現在網址與 log 中）。
- **冠詞拆分邏輯共用 (`server/cardUtils.js`)**：新增 `splitArticle()`，手動新增、CSV 匯入與 AI 萃取共用同一份邏輯。
- **Web `fetchAPI` 自動帶 Gemini Key**：localStorage 有 Key 時自動加上 `x-gemini-key` header；AI 照片上傳前先在瀏覽器壓縮至長邊 1600px。
- **Mobile `API_URL` 統一 (`mobile/src/constants/api.ts`)**：取代 7 個畫面各自寫死的網址。

### Fixed
- **統計頁 / 週預報與今日複習數字對不上 (`server/dailyProgress.js`, `/api/stats`, `StatsView.jsx`)**：`/api/stats` 自己另算一套，和今日任務 (`buildTodayPlan`) 定義不同。例如今日任務是「到期 2 + 新字 15 = 17」，統計頁卻顯示「今日到期 139」、週預報今天 154。原因有四：把從沒學過的活躍卡（今日任務算「新單字」、每天最多 15 個）算成到期複習；沒有限定主修單元；新詞預報只看待學庫，漏掉已活躍但還沒學過的字，也沒扣掉今天已學的；「今日複習卡次」算的是作答次數（含加練、重複作答），今日任務算的是完成幾個字。
  - `/api/stats` 的 `due`、新增的 `today`（即 `getTodaySummary()`）與週預報，改用今日任務同一份計畫與主修單元範圍；統計卡片「今日複習卡次」改為「今日任務完成 x / y」（另列加練）。
  - **新增 `getWeeklyForecast()`**：今天 = 今日任務剩下的量；之後每天 = 已排定的到期複習 + **預估回來的複習**（這週學的新字與複習過的字，假設答「記得」，依 FSRS 與目標留存率推算下次到期）+ 新詞（從主修單元「已活躍未學過 + 待學」依每日配額分配，用完為止）。圖上預估用淺藍色另外標示。
  - 切到統計分頁時重新抓取數據，不再顯示舊資料。
  - **測試**：`server/forecast.test.js`。

- **單字庫側欄單元名稱被截斷 (`WordList.jsx`, `index.css`)**：桌面版「單字分類與單元」中，主修練習中的單元因同一列塞入掌握率徽章與字數，名稱被擠成「課本單字 - 第…」。改為兩行排版：第一行顯示完整名稱（過長自動換行）與字數，第二行為依掌握率著色的進度條與百分比；待學儲備庫同樣改為可換行；側欄寬度 240px → 264px。
- **Stage 3/4 按 Enter 無法送出**：鍵盤事件讀到舊的空白輸入，改用 `useCallback` 並補上依賴。
- **換下一張卡時輸入框沒有自動聚焦**：聚焦時輸入框仍是停用狀態，改為狀態重設後再聚焦，桌面可以全程只用鍵盤作答。
- **帶重音 / ñ 的單字遮字與比對錯誤**：原本的 `\b...\w*` 只認 ASCII，`árbol` 遮不到、`ana` 會誤中 `mañana`；改用 Unicode 比對，並能找到變化形（hablamos、alta、problemas）。
- **沒有例句的 S4 卡片沒有空格可填**：改為拼字練習並提示。
- **複習過的單字當天又出現 / 不知道凌晨複習算哪一天 (`server/fsrs.js`, `server/time.js`)**：
  - **到期時間時區錯誤**：FSRS 用 `toISOString()` 寫入 UTC 時間，但其他時間都是本地時間，導致在 UTC+8 時單字提早 8 小時到期（例如凌晨 1 點複習、間隔 1 天的單字，當天下午 5 點又出現）。改為寫入本地時間，並在啟動時一次性修復已偏移的到期日（`PRAGMA user_version = 1`）。
  - **固定換日時間**：「今天」統一定義為本地 00:00～24:00（`TZ` 環境變數，預設 `Asia/Taipei`）；到期判斷改為「今天結束前到期」，任務數量不再隨時間一直變化。Docker 映像加裝 `tzdata`，啟動時印出目前時區與時間。
  - **每日新詞上限沒有扣掉今天已學的**：舊版每次開啟都再給一整份新詞配額；且整個單元啟用後，從未複習過的單字全部塞進今日任務。現在「從沒複習過的單字」統一算新詞，受每日上限（扣除今天已學數量）限制。
  - 導覽列徽章改為顯示今日任務剩餘數量。
- **AI 萃取功能修復 (`server/ai.js`, `/api/ai/extract`)**：
  - **模型已下架導致萃取失敗**：`gemini-1.5-flash` / `gemini-1.5-flash-8b` 已被 Google 下架，改用 `gemini-3.6-flash`（主模型）+ `gemini-3.5-flash-lite`（備援，可用 `GEMINI_FALLBACK_MODEL` 設定）；遇到 404 / 429 / 5xx 自動切換備援。
  - **未勾選的單字也被存入單字庫**：`/api/ai/extract` 原本在使用者預覽前就把所有結果寫入資料庫（且會覆蓋既有單字的釋義），改為只回傳預覽結果，使用者勾選後才透過 `POST /api/cards` 儲存。
  - **非名詞仍帶冠詞**：AI 回傳結果統一正規化（拆出冠詞、非名詞清除冠詞與陰陽性、不合法的詞性 / DELE 級數改為預設值、同一單字去重）。
  - **錯誤訊息不清楚**：區分「Key 無效」、「額度用完」、「模型不存在」、「逾時」等中文錯誤訊息；新增 60 秒逾時。
  - **Docker 部署仍預設舊模型**：`docker-compose.yml` 的 `GEMINI_MODEL` 預設值改為 `gemini-3.6-flash`，並傳入 `GEMINI_FALLBACK_MODEL`。
  - **Mobile 沒帶使用者的 API Key**：Mobile 設定頁新增 Gemini Key 欄位，AI 萃取時帶上 `x-gemini-key`。
- **手機 Safari 全站 UI 寬鬆化與瀏海 / 動態島 Safe Area 全面適配 (`index.css` 與全部頁面元件)**：
  - **四邊 Safe Area 統一化**：新增 `--safe-top/right/bottom/left` CSS 變數，Navbar、主內容、底部導覽列、彈窗、登入頁皆套用；橫向持握時左右瀏海不再切到內容。
  - **今日學習（自適應學習模式）瀏海遮擋修復**：學習模式隱藏 Navbar 時，`app-container.is-immersive` 會自動讓出頂部瀏海與底部 Home Bar 空間。
  - **彈窗被底部導覽列遮住修復**：`.modal-overlay` z-index 提升至 1000（導覽列 900），手機版改為 iOS Bottom Sheet（圓角、把手、`100dvh` 高度、Home Bar 留白、滑入動畫）；表單欄位單欄堆疊、按鈕滿版。
  - **翻卡背面內容被裁切修復**：卡片正反面改用 CSS Grid 疊放，卡片高度隨較長一面（例句 + 文法筆記）自動撐開，不再與評分按鈕重疊。
  - **進度統計手機版溢出修復**：`minmax(380px)` 改為 `minmax(min(380px, 100%))`；6 指標卡改為 2 欄；7 日預報改為可橫向滑動；階梯說明在手機隱藏。
  - **補回遺失樣式**：`.spelling-input`、`.spelling-box`、`.stat-box/.stat-icon/.stat-val/.stat-label`、`.btn-link` 於先前改版遺失，已以 Google Classroom 風格重建。
  - **自適應學習進度條不可見修復**：原使用未定義的 `--primary-color` 與白色半透明底，改為 Google 藍與灰底。
  - **觸控體驗**：輸入框手機字級 16px（防 iOS 自動放大）、`touch-action: manipulation`、移除點擊高亮、西語重音鍵改 5 欄大按鍵、單字卡操作鈕放大至 34px、hover 位移僅在支援 hover 的裝置啟用、隱藏手機上無用的鍵盤快捷鍵提示。
  - **底部導覽列**：Material 3 指示膠囊、52px 觸控高度、徽章白色描邊。
  - **桌面版**：Navbar「AI 萃取」按鈕與使用者名稱不再折行。

- **本週學習與複習進度預報 (Weekly Review & Learning Forecast, `StatsView.jsx`)**：
  - 在進度數據看板新增「7 天每日學習量預報長條圖」，直觀掌握本週各天的記憶負擔。
  - **雙軌視覺化呈現**：藍色長條為「到期複習單字 (Due Reviews)」，綠色長條為「預定加入新單字 (New Intake)」。
  - **全面考量新單字加入狀況**：依使用者每日新詞配額 (`daily_new_quota`) 與待學儲備庫存量，模擬每日平穩注入之新詞配額，並預估儲備庫可支持之學習天數，避免生詞雪崩。
  - 新增遠期排程統計（>7天後到期之高穩定度單字量），直接反映 FSRS 深層記憶成效。

- **複習間隔動態預覽與到期過濾邏輯修正 (Interval Previews & Due Date Fix)**：
  - 修正過去翻卡與拼字測驗因 `repetition === 0` 舊條件而忽視 `due_date` 間隔的邏輯，使評分後的單字能精準依排程進入休眠。
  - 翻卡評分按鈕（忘記、困難、良好、容易）即時顯示動態計算的下次複習天數（例如：`重置 (1天)`、`稍難 (1~3天)`、`熟練 (3~7天)`、`精通 (16天+)`），評分更有依據。

- **手機 Safari 網頁版 UI 跑版修復與行動底部導覽列升級 (`Navbar.jsx`, `FlashcardReview.jsx`, `index.css`, `index.html`)**：
  - **解決全域橫向溢出**：徹底根除手機 Safari 頂部導覽列將整頁橫向撐爆（產生水平滑動條、字體縮小、版面截斷）的問題。
  - **行動端雙軌導覽**：桌面端保留 Google Classroom 美學頂部完整導覽；手機版（< 768px）自動切換為高質感 iOS 毛玻璃**底部導覽列 (Bottom Navigation Bar)**（今日學習含 Badge、自由翻卡、拼字測驗、單字庫、進度統計），頂部僅保留精簡操作按鈕。
  - **iOS Safe Area 深度適配**：`index.html` 補齊 `viewport-fit=cover`，頁面底部與彈窗全面支援 `env(safe-area-inset-bottom)` 與 `100dvh`，杜絕動態網址列與 Home Bar 遮擋。
  - **翻卡控制項擠壓修復**：修正 `FlashcardReview.jsx` 頂部過濾列為 `flexWrap: wrap`，消除文字被擠壓為垂直豎排的問題。
  - **Safari 3D 翻轉硬體加速**：為單字卡加入 `-webkit-transform-style: preserve-3d`、`-webkit-perspective: 1200px` 與 `transform: translateZ(0)`，徹底杜絕 iOS Safari 翻牌閃爍與背面白屏。
  - **單字庫類別手風琴折疊展開 (`WordList.jsx`, `index.css`)**：徹底解除舊版行動端 `max-height: 150px` 導致課本單元被截斷喀掉的問題；改為手機端手風琴折疊選單（預設展示當前單元，點擊展開完整主修/待學單元清單，點選自動切換並收合）。
  - **狀態篩選膠囊 3x2 格子排版**：精簡行動端標籤字樣（全部/活躍/待學/暫存/精通/星號），以 `flex: 1 1 calc(33.333% - 6px)` 雙排並列，100% 完整展示無截斷、告別滑動猜測。

- **題目順序隨機洗牌機制 (Question Order Randomization)**：
  - 解決過去按資料庫 ID 或單元插入順序排序，導致複習時容易「靠順序死記」的序列位置效應。
  - 建立輕量且無副作用的 Fisher-Yates 洗牌模組 (`client/src/utils/shuffle.js`)。
  - **「今日學習 (自適應任務)」**：自適應練習卡片在生成每日會話時全面隨機打亂。
  - **「3D 翻卡模式」**：進入複習時自動亂序，並於頂部工具列提供「🔀 隨機打亂」手動洗牌按鈕。
  - **「拼字測驗模式」**：題目載入時自動亂序，工具列同步提供「🔀 隨機打亂」按鈕，支援隨時重新洗牌。

- **Stage 4 語境克漏字升級為互動填空輸入框 (`AdaptiveStudySession.jsx`)**：
  - 徹底解決過去克漏字僅有靜態遮蔽與「查看答案」翻轉、無法實際鍵盤輸入的問題。
  - 新增即時填空輸入框、西語重音軟鍵盤（`á`, `é`, `í`, `ñ` 等）與 `Enter` 快捷送出支援。
  - 支援複合詞語境模糊比對：無論輸入原型、陰陽性或例句實際遮蔽之單詞，皆能精確判定答對，並提供正向回饋或錯誤提示。
  - 附帶「💡 想不出來？直接查看解答」降階保護機制。

- **統計進度全面重構為 FSRS 數據分析 (`StatsView.jsx`)**：
  - 徹底移除舊版 SM-2 遺留之模糊「記憶週期掌握率」（`repetition > 0` 與 `repetition >= 4`）。
  - 全新升級為 **Google Classroom 美學數據看板**：
    - 頂部 6 核心動態數據卡（總詞庫量、⚡ 活躍學習、⏰ 今日到期、🏆 長效精通、🎯 待學儲備、🔥 今日複習卡次）。
    - **五階記憶認知梯 (FSRS Stages 1~5)**：清晰呈現各階段（S1 被動辨認 $\to$ S2 提示回想 $\to$ S3 盲測拼寫 $\to$ S4 語境應用 $\to$ S5 長效精通）字數分佈與進度條。
    - **教材單元掌握度排行 (Curriculum Leaderboard)**：自然課次序排列所有課本單元，直觀檢視各章節掌握百分比。
    - **DELE 歐洲語言架構 (A1~C1) 分布卡片**。
- **主修進度與活躍學習雙向嚴格綁定 (Active Curriculum & Active Status Binding)**：
  - 首頁「主修進度」區塊**只列出目前處於活躍學習中的類別**，待學單元獨立收合於「➕ 從待學庫加入主修」面板中。
  - 當使用者在首頁選擇或啟用某個單元為主修時，後端自動將該單元所有待學/暫存單字激活為活躍學習（`lifecycle_status = 'active'`），與單字庫活躍狀態保持 100% 雙向即時連動。
  - 首頁五階熟練梯與到期複習只計算當前主修單元（或全部主修類別）的單字，徹底排除未激活的待學庫干擾。
  - 首頁支援一鍵「⏸ 暫停此單元」，立即將該主修單元的活躍單字轉回待學庫。
- **類別導向單字庫左側欄與課程自然排序 (Category Sidebar & Natural Sort)**：
  - `WordList.jsx` 新增左側分類專屬側邊欄，將所有單元劃分為「🚀 主修練習中」與「⏳ 待學儲備庫」雙群組。
  - 內部採用課次自然排序法（第0課 $\to$ 第1課 $\to$ 第2課 $\to$ 第3課），並即時顯示該單元的詞彙掌握率與深淺色彩徽章。
  - 支援在單字庫頂端一鍵「🚀 設為主修並啟動練習」或「⏸ 暫停主修排程 (轉回待學)」。
- **單字卡輕量化與頂部熟練度色條 (Compact Cards with Top Accent Stripe)**：
  - 大幅精簡單字庫卡片常規展示資訊，移除冗長例句與文法筆記擠壓，卡片高度縮減 50%，利於快速閱覽。
  - 卡片頂部依熟練度與生命週期精準標註色彩條：待學/暫存統一使用中性淡灰（`#dadce0`）；活躍學習依階級動態漸層（S1 珊瑚紅、S2 Google 藍、S3 清新綠、S4 深綠）；已精通標註高貴紫金（`#8430ce`）。
- **單字詳情放大對話框與編輯入口 (`WordDetailModal.jsx`)**：
  - 點擊輕量字卡即可彈出詳情視窗，完整呈現單字冠詞、詞性、大字體發音朗讀、西語例句、文法要點、FSRS 穩定度/遺忘次數數據與編輯修改按鈕。
- **熟練度與狀態指南彈跳視窗 (`MasteryGuideModal.jsx`)**：
  - 提供專屬說明 Modal，深入解構「五階記憶進化梯 (Stage 1~5)」、「四大生命週期狀態 (Inbox/Ready/Active/Mastered)」以及「⭐️ 核心星號（每日新詞解鎖第一優先權標記）」的設計概念。
- **單字庫批次操作與批量狀態流轉 (Batch Action Toolbar & APIs)**：
  - 新增後端 `PATCH /api/cards/batch-status` 與 `POST /api/cards/batch-delete`。
  - 前端支援全選與多選，一鍵整批設定為「⚡ 活躍學習」、「🎯 待學核心」、「📥 隨手暫存」、「🏆 已精通」、「⭐️ 加星號 / 取消星號」或批次刪除。
- **課本單元資料回填與主修進度連動**：
  - 後端平滑遷移自動將 `category` 補齊至 `curriculum_unit`，使「課本單字 - 第0課/第1課/第2課/第3課」等所有單元完整呈現於主修進度選單中。
  - 首頁今日駕駛艙之「五階熟練梯」與到期複習完全連動當前所選主修單元。
- **FSRS (Free Spaced Repetition Scheduler) v4.5 記憶調度引擎**：
  - 新增 `server/fsrs.js`，以純 JavaScript 輕量數學模型（無龐大外部依賴）實作現代 DSR (Difficulty, Stability, Retrievability) 遺忘曲線演算法，精準預測各單字即時遺忘機率。
  - 取代傳統 SM-2 固定排程，支援目標留存率（預設 90%）與難度/穩定度動態調整，並兼顧向下相容舊版欄位。
- **三層詞庫分流狀態機 (The Three-Tier Lexical Pipeline)**：
  - 在 `cards` 資料庫擴充 `lifecycle_status` (`inbox`, `ready`, `active`, `mastered`, `frozen`)、`is_starred`、`mastery_stage` 與 `curriculum_unit`。
  - 徹底區隔「課堂隨記暫存箱 (Inbox / 零排程壓力)」與「課本核心待學清單 (Ready / 依配額激活)」，解決初學者單字債務雪崩與後設認知疲勞。
- **今日行動學習駕駛艙 (Daily Actionable Agenda Cockpit)**：
  - 新增 `client/src/components/DailyAgendaCockpit.jsx` 與 `/api/study/agenda` API。
  - 主頁提供「一鍵開始今日學習」，自動編排「🚨 緊急搶救 (Lapse) + 📚 例行穩固 + 🌱 課本主修新詞」，徹底解放每天手動挑選分類的決策負擔。
  - 支援當前主修單元進度追蹤 (Active Curriculum Track) 與階段掌握率可視化。
- **詞彙習得五階動態學習流 (Adaptive 5-Stage Study Session)**：
  - 新增 `client/src/components/AdaptiveStudySession.jsx`。
  - 根據單字所在熟練階級自動派發題型：Stage 1 (被動辨認 西->中) $\to$ Stage 2 (提示回想 中->西) $\to$ Stage 3 (盲測正字拼寫) $\to$ Stage 4 (語境克漏字與搭配詞)。
  - 答對時 Stability 自動累加晉級，遺忘 (Lapse) 時自動降階保護。
- **單字庫分流膠囊標籤與快捷操作**：
  - `WordList.jsx` 新增狀態膠囊過濾列（全部、活躍、待學、暫存、已精通、核心星號）。
  - 單字卡支援一鍵打星 ⭐️、狀態流轉按鈕與 Stage 階級標籤。
- **學習偏好設定與配額管理**：
  - `SettingsModal.jsx` 支援設定每日新詞配額 (10~50 字/天) 與目標記憶留存率 (85%~95%)。
- **專案開發進度管理系統**：在專案根目錄建立 `開發進度/` 資料夾，包含總覽文件、Git/GitHub 協作管理規範、Roadmap 與 CHANGELOG。
- **AI 智慧字典入口 (Web)**：在 Web 端新增字典 Tab 入口與未完成佔位視圖 (`DictionaryView.jsx`)。
- **輕量級西語語音代理 API (`/api/tts`)**：在 Express 後端新增極輕量音訊代理端點，利用 Node 22 原生 `fetch` 串流高品質西語語音（`audio/mpeg`），並加上 HTTP 24 小時快取 (`Cache-Control: public, max-age=86400`)，解決行動端相容性同時保持約 35MB RAM 超輕量後端架構。
- **全自動智慧雙引擎西語發音系統 (免手動設定)**：前端 `speech.js` 自動判定裝置類型：電腦版（Mac Safari/Chrome 等）預設直走原生 Web Speech API（零網路延遲、離線即發聲、支援 Space 翻卡熱鍵無 Autoplay 限制）；手機版（iOS Safari/Android）自動走 HTML5 線上串流播放（解決 iOS 靜音鍵阻斷與缺乏語音包問題）。雙引擎具備雙向自動容錯備援，若任一方失敗自動秒切備援引擎，完全無需手動進入設定調整。

### Changed
- **簡化今日學習介面說明（改為懸浮提示 Tooltip）**：
  - 響應使用者反饋，大幅精簡 `DailyAgendaCockpit.jsx`（今日學習駕駛艙）的文字量。
  - 移除大段靜態說明段落與各指標底部的靜態文字，只保留核心標題與量化數字。
  - 將各模組之詳細機制（緊急搶救、例行穩固、新詞配額、單元掌握率、五階階梯、暫存箱說明）轉為簡潔的資訊符號 `(?)`，滑鼠懸浮或點擊時才顯示 Hover Tooltip，呈現極簡俐落的儀表板。
- **全面切換 Web UI 為 Google Classroom / Material Design 3 乾淨教育美學風格**：
  - 徹底告別高視覺負擔之深色霓虹玻璃擬態（Dark Glassmorphism），全面導入 Google Classroom 清爽米灰背景（`#f8f9fa`）、純白卡片（`#ffffff`）、Google 經典藍（`#1a73e8`）與高對比深炭灰文字（`#202124`）。
  - 全站 12 個核心組件（導航列、今日學習駕駛艙、自適應學習流、單字庫、AI 萃取對話框、盲測拼寫、統計圖表、登入畫面等）統一遵循 Material 3 設計語言，徹底解決文字對比度問題，營造零視覺疲勞的專注語言學習氛圍。
- **拼字測驗介面簡化 (移除西語重音工具列)**：移除 `SpellingReview.jsx` 輸入框下方之 `SPANISH_SPECIAL_KEYS`（`á`, `é`, `í`, `ó`, `ú`, `ü`, `ñ`, `¿`, `¡`）工具列與未使用的點擊插入事件。大幅節省手機螢幕縱向高度，避免推擠「送出檢查」與「看答案」按鈕。
- **Docker 建置流程優化**：調整 `Dockerfile` 與 `docker-compose.yml`，加入容器健康檢查與靜態檔載入流程。
- **分類 API 過濾調整**：優化 `/api/categories` 取值機制。

### Fixed
- **修復今日學習首頁空白 (Blank Screen on Login)**：修復 `DailyAgendaCockpit.jsx` 在引入懸浮提示時遺漏 `HelpCircle` 圖標引用，導致登入後首頁拋出 `ReferenceError: HelpCircle is not defined` 並引發 React 渲染中斷全白畫面的問題；同時啟動後端 `--watch` 熱加載以避免伺服器舊進程殘留 404。
- **手機版與電腦版 Safari 雙端語音相容性**：徹底解決 iOS Safari / iPhone 實體靜音開關 (Silent switch) 攔截 Web Speech 音訊問題，同時確保電腦版 Safari 保持原生極速朗讀體驗，無需使用者手動進入設定切換。
- **Web 3D 單字卡文字選取防誤翻 (Mac Safari/Web)**：修復在 Mac Safari 等瀏覽器中，選取單字卡文字（單字、例句、釋義或文法筆記）時會觸發卡片翻面並導致選取狀態中斷無法複製的問題。新增 Pointer 拖曳與長按手勢判定，以及 `window.getSelection()` 選取區段過濾機制，確保使用者長按或拖曳選取文字時不會誤觸翻面，並強化 WebKit 漸層文字反白選取樣式與文字游標提示。
- **Docker 自動編譯前端 (Multi-stage Build)**：修復 `Dockerfile` 依賴主機手動建置 `client/dist` 導致伺服器 `git pull` 後未能重新編譯最新前端代碼的問題。改為 Docker 多階段構建 (Multi-stage build)，容器打包時自動在內部完成 Vite build。

### In Progress
- 字典即時查詞 API (`/api/dictionary/lookup`) 與自動入庫功能。
- 行動端 (Expo) API 端點環境變數設定抽取。

---

## [v1.1.0] - 2026-10-09

### Added
- **多租戶身分驗證系統 (Multi-tenant Auth)**：
  - 新增 `users` 資料表，支援密碼 bcrypt 安全雜湊。
  - 引入 JWT (JSON Web Token) 認證機制，各使用者擁有獨立隔離的單字庫與複習紀錄。
  - 新增 `/api/auth/register`, `/api/auth/login`, `/api/auth/me` 認證端點。
- **React Native / Expo 行動端應用 (`mobile/`)**：
  - 基於 Expo SDK 57、React 19 與 Expo Router 建置跨平台手機端。
  - 完整移植核心畫面：登入頁 (`index.tsx`)、主頁儀表板 (`home.tsx`)、單字庫列表與編輯 (`words.tsx`)、3D 翻轉卡片 (`flashcard.tsx`)、拼字盲測 (`review.tsx`)、AI 萃取 (`ai.tsx`)、設定頁面 (`settings.tsx`)。
  - 支援行動端 CSV 文件選擇匯入 (`expo-document-picker`)。

---

## [v1.0.0] - 2026-10-08

### Added
- **初始版本正式發布 (Initial Release)**：
  - **3D 翻轉卡片複習模式**：包含正反翻轉、真人語音朗讀 (Web Speech API)、鍵盤快捷鍵。
  - **西語拼字盲測模式**：包含西語特殊重音按鈕、例句挖空提示、性別縮寫即時判定。
  - **SM-2 間隔重複記憶演算法 (SRS)**：科學化抗遺忘複習週期排程。
  - **Google Gemini 1.5 Flash 智能萃取**：支援課堂筆記文字與照片白板一鍵解析生詞卡。
  - **單字庫管理**：模糊搜尋、分類過濾、DELE 標籤 (A1~C2)、CSV 批量匯入。
  - **極輕量後端與資料庫**：採用 Node.js 內建原生 SQLite (WAL 模式)，記憶體佔用僅約 35MB。
  - **部署方案**：支援 Docker Compose 一鍵啟動與 PM2 開機自啟。
