# 📝 PalabraCard 更新日誌 (CHANGELOG)

本專案遵循 [Semantic Versioning (語意化版本 2.0.0)](https://semver.org/lang/zh-TW/) 與 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 格式標準。

---

## [Unreleased] (進行中 / 待發布)

### Added
- **專案開發進度管理系統**：在專案根目錄建立 `開發進度/` 資料夾，包含總覽文件、Git/GitHub 協作管理規範、Roadmap 與 CHANGELOG。
- **AI 智慧字典入口 (Web)**：在 Web 端新增字典 Tab 入口與未完成佔位視圖 (`DictionaryView.jsx`)。
- **輕量級西語語音代理 API (`/api/tts`)**：在 Express 後端新增極輕量音訊代理端點，利用 Node 22 原生 `fetch` 串流高品質西語語音（`audio/mpeg`），並加上 HTTP 24 小時快取 (`Cache-Control: public, max-age=86400`)，解決行動端相容性同時保持約 35MB RAM 超輕量後端架構。
- **全自動智慧雙引擎西語發音系統 (免手動設定)**：前端 `speech.js` 自動判定裝置類型：電腦版（Mac Safari/Chrome 等）預設直走原生 Web Speech API（零網路延遲、離線即發聲、支援 Space 翻卡熱鍵無 Autoplay 限制）；手機版（iOS Safari/Android）自動走 HTML5 線上串流播放（解決 iOS 靜音鍵阻斷與缺乏語音包問題）。雙引擎具備雙向自動容錯備援，若任一方失敗自動秒切備援引擎，完全無需手動進入設定調整。

### Changed
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
