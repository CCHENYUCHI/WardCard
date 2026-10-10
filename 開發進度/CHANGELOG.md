# 📝 PalabraCard 更新日誌 (CHANGELOG)

本專案遵循 [Semantic Versioning (語意化版本 2.0.0)](https://semver.org/lang/zh-TW/) 與 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 格式標準。

---

## [Unreleased] (進行中 / 待發布)

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
