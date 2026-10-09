# 🤖 PalabraCard AI Agent 開發指南與 System Prompt 提示詞庫

> **說明**：  
> 本專案主要透過 AI Agent（如 Antigravity, Claude Code, Cursor 等）協同開發。  
> 為了確保 Agent 的輸出品質、架構一致性，並杜絕亂改代碼或遺漏進度記錄，**在每次開啟新對話或發派任務給 Agent 時，請根據任務目的（修改 Bug、增加功能、架構重構等）複製對應的 Prompt 範本發送給 Agent。**

---

## 🧭 目錄索引

1. [通用全域約束 (Agent 必須遵守的底線)](#-通用全域約束-agent-必須遵守的底線)
2. [任務類型一：修改 Bug (Bug Fix)](#1-修改-bug-bug-fix)
3. [任務類型二：增加新功能 (New Feature)](#2-增加新功能-new-feature)
4. [任務類型三：架構更新與重構 (Architecture & Refactoring)](#3-架構更新與重構-architecture--refactoring)
5. [任務類型四：效能優化 (Performance Optimization)](#4-效能優化-performance-optimization)
6. [任務類型五：維運部署與環境調整 (DevOps & Config)](#5-維運部署與環境調整-devops--config)
7. [任務完成前檢查清單 (Pre-Completion Checklist)](#-任務完成前檢查清單-pre-completion-checklist)

---

## 🛡️ 通用全域約束 (Agent 必須遵守的底線)

任何 Agent 在執行本專案的任何任務時，必須在心中牢記以下 5 大原則：
1. **極致輕量化 (~35MB RAM)**：後端為 Oracle Cloud Free Tier 打造，嚴禁引入 MySQL/PostgreSQL/Redis 等重型服務，一律採用 Node.js 內建原生 `node:sqlite` (WAL 模式)。
2. **視覺美學不可妥協**：前端 Web 採用深色玻璃擬態 (Dark Glassmorphism)、精緻漸層與流暢 3D 動效；禁止粗製濫造的陽春介面。
3. **Expo SDK 57 規範**：行動端 `mobile/` 採用 Expo Router，路由位於 `src/app/`。請勿猜測過時的 React Native API，嚴格使用 Expo 官方最新模組。
4. **安全底線**：嚴禁將 `.env`、`data/*.db` 或任何真實 API Key 寫死或提交至 Git。
5. **進度同步鐵律**：**每次完成任務時，必須同時更新「開發進度」資料夾（Roadmap / CHANGELOG / 總覽），缺一不可！**

---

## 1. 修改 Bug (Bug Fix)

### 📌 適用情境
- 畫面顯示錯誤、按鈕沒反應、API 回傳 500、資料庫查詢異常、行動端鍵盤遮擋或樣式跑版。

### 📋 Agent 作業步驟 (SOP)
```mermaid
graph TD
    A["1. 深入研讀錯誤日誌與受影響檔案"] --> B["2. 檢查/切出分支: fix/<bug-name>"]
    B --> C["3. 尋找根因，實作最小破壞性修復"]
    C --> D["4. 進行驗證，確保修復且無次生錯誤"]
    D --> E["5. 同步更新「開發進度/CHANGELOG.md」"]
    E --> F["6. 執行 Conventional Commit: fix(...)"]
```

1. **調查根因**：檢視錯誤發生的檔案與前後調用鏈，不隨意修改無關檔案。
2. **切出分支**：`git checkout -b fix/<bug-name>`
3. **最小精準修復**：保持既有代碼風格與型別定義，不擅自重寫周邊無關邏輯。
4. **驗證排錯**：驗證先前引發 Bug 的操作路徑已完全正常。
5. **同步更新進度**：
   - 開啟 `開發進度/CHANGELOG.md`，在 `[Unreleased]` 區塊的 `Fixed` 小節記錄該修復內容。
6. **Git 提交**：
   ```bash
   git commit -m "fix(模組名): 簡潔說明修復的問題 (Closes #issue號)"
   ```

---

### 💬 【可以直接複製給 Agent 的 Prompt 範本】

```markdown
你現在是 PalabraCard (西語智慧單字卡) 的資深除錯專家。
我們要處理一個 Bug 修復任務，請嚴格按照本專案的標準 SOP 進行：

【問題描述】：
（請在此填寫具體錯誤現象，例如：在手機端 review.tsx 輸入答案時，西語重音鍵盤點擊會導致輸入框失焦）

【錯誤日誌 / 重現路徑】：
（請貼上 console 報錯訊息或觸發該 bug 的點擊操作流程）

【執行步驟要求】：
1. 請先檢查相關代碼（包含調用鏈），定位確切的 Root Cause，並向我簡報原因。
2. 切出名為 `fix/<問題簡稱>` 的 Git 分支。
3. 採用最小破壞性方式修復代碼，確保不影響既有其他功能與 UI 樣式。
4. 進行自我檢查與驗證，確認問題已排除。
5. 【重要】同步更新 `開發進度/CHANGELOG.md`，在 `[Unreleased]` 下方的 `Fixed` 區塊加入本次修復說明。
6. 產出符合規範的 commit 指令：`fix(<模組>): <說明>`。
```

---

## 2. 增加新功能 (New Feature)

### 📌 適用情境
- 增加新頁面、新增 API 端點、串接新 AI 模型能力、新增測驗模式、加強單字庫篩選維度。

### 📋 Agent 作業步驟 (SOP)
```mermaid
graph TD
    A["1. 研讀需求與專案現有架構"] --> B["2. 切出分支: feature/<feature-name>"]
    B --> C["3. 後端 API / DB 綱要擴充 (保持 SQLite 輕量)"]
    C --> D["4. 前端 UI / 行動端組件開發 (高質感玻璃擬態)"]
    D --> E["5. 端到端功能整合與錯誤防呆測試"]
    E --> F["6. 同步更新「開發進度」三份文件"]
    F --> G["7. 執行 Conventional Commit: feat(...)"]
```

1. **評估架構**：查閱 `開發進度/專案開發狀況總覽.md`，確保新功能不破壞現有資料庫結構或 API 契約。
2. **切出分支**：`git checkout -b feature/<feature-name>`
3. **後端實作**：
   - 如需改動資料庫，更新 `server/db.js`（確保 `IF NOT EXISTS` 或向下相容）。
   - 在 `server/index.js` 新增路由並套用 `authenticateToken` 中介層。
4. **前端/行動端實作**：
   - 保持現代深色質感 (Dark Mode + Glassmorphism)，適當加入微動效與 Loading/Error 反饋。
   - 包含快捷鍵支援或防呆輸入比對。
5. **本地驗證**：測試快樂路徑 (Happy Path) 與邊界錯誤 (Edge Cases)。
6. **同步更新進度（必做）**：
   - 在 `開發進度/功能清單與Roadmap.md` 將新功能標註為 `[x]` 或更新百分比。
   - 在 `開發進度/CHANGELOG.md` 的 `[Unreleased]` 加入 `Added: ...`。
   - 若有新增 API 或資料表欄位，同步補充至 `開發進度/專案開發狀況總覽.md`。
7. **Git 提交**：
   ```bash
   git commit -m "feat(模組名): 實作功能名稱並同步更新開發進度"
   ```

---

### 💬 【可以直接複製給 Agent 的 Prompt 範本】

```markdown
你現在是 PalabraCard (西語智慧單字卡) 的全端架構與產品工程師。
我們要開發一個全新功能，請嚴格遵循專案架構與開發規範：

【新功能需求】：
（請在此填寫功能說明，例如：在 Web 端與後端實作 AI 智慧字典即時查詞 API，輸入西語單字自動呼叫 Gemini 取得釋義、例句與文法筆記，並提供「一鍵加入字卡庫」按鈕）

【技術棧與規範限制】：
- 後端：Node.js 22 + 原生 `node:sqlite`，維持極輕量記憶體佔用 (~35MB RAM)。
- 前端：React 18 + Vite，使用深色玻璃擬態 (Dark Glassmorphism) 設計風格，搭配 Lucide 圖標。
- 認證：API 需整合既有的 JWT `authenticateToken`。

【執行步驟要求】：
1. 查閱現有相關代碼與 `開發進度/專案開發狀況總覽.md`，制定清晰的實作步驟。
2. 建立新 Git 特性分支 `feature/<功能名稱>`。
3. 實作後端 API / 資料庫更新（若有），並加上適當的參數檢驗與錯誤捕捉。
4. 實作前端組件與畫面交互，確保具有精緻視覺效果、載入狀態與防呆提醒。
5. 進行本地測試驗證。
6. 【重要】同步更新「開發進度」資料夾：
   - `開發進度/功能清單與Roadmap.md`（勾選或更新進度）
   - `開發進度/CHANGELOG.md`（在 [Unreleased] 下新增 Added）
   - `開發進度/專案開發狀況總覽.md`（更新完成度與 API 表格）
7. 產出規範 commit 指令：`feat(<模組>): <功能說明>`。
```

---

## 3. 架構更新與重構 (Architecture & Refactoring)

### 📌 適用情境
- 模組解耦、共用邏輯抽象為 Hook/Service、API 網址設定抽離環境變數、狀態管理重構、資料表結構搬遷。

### 📋 Agent 作業步驟 (SOP)
```mermaid
graph TD
    A["1. 繪製重構前後依賴圖與影響範圍"] --> B["2. 切出分支: refactor/<refactor-name>"]
    B --> C["3. 漸進式替換，保持對外 API 與 UI 行為不變"]
    C --> D["4. 執行現有所有功能回歸測試"]
    D --> E["5. 測量/確認記憶體與載入效能未衰退"]
    E --> F["6. 同步更新「專案開發狀況總覽」與「CHANGELOG」"]
    F --> G["7. 執行 Conventional Commit: refactor(...)"]
```

1. **影響評估**：列出受改動影響的所有組件與檔案，確認沒有破壞性的 API 變更。
2. **切出分支**：`git checkout -b refactor/<refactor-name>`
3. **保持相容性**：不改變既有功能行為的前提下優化程式碼架構與可維護性。
4. **回歸測試**：全面測試原有功能是否仍能順暢運作。
5. **同步更新進度**：
   - 更新 `開發進度/專案開發狀況總覽.md` 中的架構圖或模組說明。
   - 在 `開發進度/CHANGELOG.md` 的 `[Unreleased]` 下新增 `Changed` 或 `Refactored` 紀錄。
6. **Git 提交**：
   ```bash
   git commit -m "refactor(模組名): 重構說明並同步更新架構總覽文檔"
   ```

---

### 💬 【可以直接複製給 Agent 的 Prompt 範本】

```markdown
你現在是 PalabraCard (西語智慧單字卡) 的資深架構師。
我們要執行一次代碼重構 / 架構優化任務。重構原則為「保持外部行為完全一致，提升代碼健壯性、可維護性與可讀性」：

【重構目標與範圍】：
（請在此填寫重構範圍，例如：將 Mobile 端各畫面中硬編碼的 API_URL 抽離至共用設定檔 constants/config.ts，並支援根據環境自動切換本機與正式網址）

【技術原則】：
- 不改變任何對外 API 輸入輸出或使用者端的操作體驗。
- 保留既有業務邏輯與非相關的註解。
- 避免過度設計，遵循 KISS (Keep It Simple, Stupid) 原則。

【執行步驟要求】：
1. 分析目前目標模組的依賴關係，列出所有需要被改動的檔案清單。
2. 切出新分支 `refactor/<重構目標>`。
3. 逐步進行重構替換，確保型別與命名清晰一致。
4. 執行回歸測試，確認所有受影響的頁面/功能皆能正常運作。
5. 【重要】更新 `開發進度/專案開發狀況總覽.md` 與 `開發進度/CHANGELOG.md`。
6. 產出規範 commit 指令：`refactor(<模組>): <說明>`。
```

---

## 4. 效能優化 (Performance Optimization)

### 📌 適用情境
- 單字列表大量卡片捲動卡頓、SQLite 查詢延遲、Gemini Prompt Token 縮減、前端 Bundle 瘦身。

### 📋 Agent 作業步驟 (SOP)
1. **設定基準線 (Benchmark)**：先紀錄優化前的指標（例如查詢耗時、記憶體 MB、檔案大小）。
2. **切出分支**：`git checkout -b perf/<perf-name>`
3. **針對瓶頸優化**：
   - 資料庫：增加適當 Index（如 `cards(user_id, due_date)`）、優化 WAL PRAGMA。
   - 前端：虛擬列表 (Virtualization)、React `useMemo`/`useCallback`、圖片動態載入。
4. **指標對比**：驗證優化後之數據確實顯著提升，且未引入 Bug。
5. **同步更新進度**：在 `開發進度/CHANGELOG.md` 記錄 `Performance: ...` 與對比數據。
6. **Git 提交**：
   ```bash
   git commit -m "perf(模組名): 說明效能優化措施與改善幅度"
   ```

---

### 💬 【可以直接複製給 Agent 的 Prompt 範本】

```markdown
你現在是 PalabraCard 的效能調優專家。
我們要針對系統進行效能優化，目標為維持極低資源消耗的同時，提升運算或渲染速度：

【效能瓶頸描述】：
（請在此填寫，例如：當單字庫累積超過 1000 筆時，/api/cards 篩選查詢耗時較長，前端列表捲動出現微卡頓）

【優化目標】：
- 查詢時間降低 50% 以上 / 保持後端記憶體仍在 ~35MB RAM 內。
- 前端列表維持 60 FPS 順暢滾動。

【執行步驟要求】：
1. 檢視瓶頸點，提出具體的優化方案（如索引、分頁、React 渲染優化）。
2. 切出新分支 `perf/<優化項目>`。
3. 實作優化代碼，不變更業務邏輯。
4. 進行效能驗證與對比。
5. 【重要】更新 `開發進度/CHANGELOG.md`。
6. 產出 commit 指令：`perf(<模組>): <說明>`。
```

---

## 5. 維運部署與環境調整 (DevOps & Config)

### 📌 適用情境
- 調整 `Dockerfile` / `docker-compose.yml`、更新 NPM 依賴、修改 `.gitignore`、配置 Nginx 或 Oracle Cloud 防火牆。

### 📋 Agent 作業步驟 (SOP)
1. **安全性審查**：確認無金鑰洩漏風險、無無效持久化路徑。
2. **切出分支**：`git checkout -b chore/<task-name>`
3. **修改組態**：測試本機 Docker 建置或服務啟動無報錯。
4. **同步更新進度**：在 `開發進度/CHANGELOG.md` 下記錄 `Changed: ...`，並同步更新總覽中的部署說明。
5. **Git 提交**：
   ```bash
   git commit -m "chore(docker): 優化容器建置流程與健康檢查"
   ```

---

### 💬 【可以直接複製給 Agent 的 Prompt 範本】

```markdown
你現在是 PalabraCard 的 DevOps 與雲端部署專家。
我們要進行容器化 / 環境組態調整：

【任務內容】：
（請在此填寫，例如：調整 docker-compose.yml 加入健康檢查與自動重啟機制，並確保 SQLite 卷掛載正確持久化）

【關鍵環境限制】：
- 目標運行環境為 Oracle Cloud Free Tier 主機（1GB RAM）。
- 記憶體預算極低，嚴禁過重進程。
- 嚴禁將 .env 或真實 DB 檔案打包入映像檔。

【執行步驟要求】：
1. 檢查現有 Dockerfile、docker-compose.yml 與 package.json。
2. 切出分支 `chore/<組態項目>`。
3. 完成組態調整並驗證 syntax 與容器運行正常。
4. 【重要】同步更新 `開發進度/專案開發狀況總覽.md` 與 `開發進度/CHANGELOG.md`。
5. 產出 commit 指令：`chore(<範疇>): <說明>`。
```

---

## 🏁 任務完成前檢查清單 (Pre-Completion Checklist)

在宣告任務完成並讓使用者推送至 GitHub 前，Agent 必須逐一自檢：

- [ ] 程式碼語法無錯誤，無未定義變數或遺留的 `console.log` 調試代碼。
- [ ] 沒有在代碼中寫死任何 API Key 或敏感憑證。
- [ ] 若有新增/修改功能，本地功能已手動或自動測試通過。
- [ ] **【核心】已同步更新 `開發進度/` 資料夾內的文件**：
  - [ ] `開發進度/功能清單與Roadmap.md`（狀態標記）
  - [ ] `開發進度/CHANGELOG.md`（變更紀錄）
  - [ ] `開發進度/專案開發狀況總覽.md`（必要時更新完成度或 API 表）
- [ ] Commit 訊息符合 Conventional Commits 格式 (`feat:`, `fix:`, `refactor:`, `chore:`, `perf:`)。
