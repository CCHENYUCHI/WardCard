# 📝 PalabraCard 更新日誌 (CHANGELOG)

本專案遵循 [Semantic Versioning (語意化版本 2.0.0)](https://semver.org/lang/zh-TW/) 與 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 格式標準。

---

## [Unreleased] (進行中 / 待發布)

### Added
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
