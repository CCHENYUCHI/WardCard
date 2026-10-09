# 🐙 PalabraCard Git & GitHub 協作管理規範

> **重要原則**：  
> 本專案的所有程式碼變更與新功能迭代，均須透過 Git 與 GitHub 進行版本控制管理。  
> **每次開發新功能或更新功能時，必須同時更新「開發進度」資料夾內的相關文件，確保代碼與進度追蹤完全同步！**

---

## 1. 分支管理策略 (Branching Strategy)

我們採用精簡實用的 **GitHub Flow** 工作流程：

```
main (保護分支 / 穩定版本)
  │
  ├── feature/ai-dictionary ───► (開發與進度更新) ───► PR ───► Merge into main
  │
  ├── fix/mobile-api-url ──────► (修復與日誌更新) ───► PR ───► Merge into main
  │
  └── docs/update-roadmap ─────► (純文檔進度維護) ─► PR ───► Merge into main
```

### 1.1 分支類型與命名慣例

| 分支前綴 | 用途 | 命名範例 |
| :--- | :--- | :--- |
| `feature/` | 開發新功能、新畫面或新 API | `feature/ai-dictionary`<br/>`feature/mobile-camera-ocr` |
| `fix/` | 修復線上或開發中發現的 Bug | `fix/sqlite-concurrent-lock`<br/>`fix/spelling-accent-check` |
| `refactor/` | 架構優化、重構，不改變外部功能 | `refactor/mobile-api-config`<br/>`refactor/srs-algorithm` |
| `docs/` | 開發進度文件維護、說明文件更新 | `docs/update-v1.1-roadmap`<br/>`docs/setup-guide` |
| `chore/` | 依賴升級、Docker 設定調整、CI/CD 配置 | `chore/update-dockerfile`<br/>`chore/upgrade-expo-sdk` |

> ⚠️ **禁止直接對 `main` 分支進行未經審查的強制推播 (`git push -f`)！**

---

## 2. Commit 訊息標準 (Conventional Commits)

所有的 Git Commit 必須遵循 Angular / Conventional Commits 格式規範：

```
<type>(<scope>): <subject>

[可選的詳細描述 body]

[可選的 Issue 關聯 footer，如 Closes #12]
```

### 2.1 Type 清單

- **`feat`**：新增功能 (A new feature)
- **`fix`**：修復錯誤 (A bug fix)
- **`docs`**：僅變更文件或「開發進度」資料夾文件 (Documentation only)
- **`style`**：程式碼排版、分號、空格微調，不影響程式邏輯 (Code style/formatting)
- **`refactor`**：代碼重構，既非修 bug 也非加功能 (Refactoring code)
- **`perf`**：提升效能的變更 (Performance improvement)
- **`test`**：新增或修正測試 (Adding or correcting tests)
- **`chore`**：建置流程、設定檔或輔助套件變動 (Build tasks, configs, dependencies)

### 2.2 提交訊息範例

```bash
# 新增功能（同時包含程式碼與進度文件更新）
git commit -m "feat(dictionary): 新增 AI 智慧查詞 API 與前端查詢視圖並更新開發進度"

# 修復 Bug
git commit -m "fix(mobile): 修正拼字模式在 Android 下鍵盤彈出遮擋輸入框的問題"

# 優化配置
git commit -m "chore(docker): 採用預編譯靜態檔減少 Docker 鏡像建置時間與記憶體消耗"
```

---

## 3. 核心規範：新功能更新與「開發進度」同步 SOP

為了保證團隊任何時刻檢視「開發進度」資料夾都能掌握專案最新真實狀況，請嚴格執行以下 6 步驟標準作業程序：

### 步驟 1：建立新特性分支
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 步驟 2：功能代碼編寫與本地測試
- 完成後端 API、前端 Web 或 Mobile 端的功能開發。
- 進行本地完整驗證：
  - 後端：確認 API 回傳格式與資料庫寫入正常。
  - 前端 Web：`npm run dev` 測試 UI、翻卡與發音無報錯。
  - 行動端：`npx expo lint` 或 `npx tsc --noEmit` 確保型別正確。

### 步驟 3：同步更新「開發進度」資料夾（關鍵步驟！）
在發起 Commit 前，**必須修改以下三個進度文件**：

1. **修改 `開發進度/功能清單與Roadmap.md`**：
   - 將剛完成的項目由 `[ ]` 改為 `[x]`。
   - 若為進行中功能，調整進度百分比與最新標註。
2. **修改 `開發進度/CHANGELOG.md`**：
   - 在當前版本（或 `[Unreleased]` 區塊）下，新增一筆紀錄：
     - `Added`: 說明新加入的畫面、組件或 API。
     - `Fixed`: 說明修復的具體問題。
3. **視需要更新 `開發進度/專案開發狀況總覽.md`**：
   - 若有新增資料表欄位、修改 API 端點或新增組件，同步更新表格與統計百分比。

### 步驟 4：將程式碼與進度文件一同加入暫存並提交
```bash
# 檢查修改狀態（應同時包含代碼檔案與開發進度文件）
git status

# 加入暫存
git add .

# 規範化提交
git commit -m "feat(scope): 實作某功能並同步更新開發進度文檔"
```

### 步驟 5：推送到 GitHub 並開啟 Pull Request (PR)
```bash
git push -u origin feature/your-feature-name
```
- 前往 GitHub 倉庫 (`https://github.com/CCHENYUCHI/WardCard`)。
- 開啟 Pull Request，標題填寫清晰，描述中勾選進度確認：
  ```markdown
  ### 本次變更內容
  - [x] 完成了功能 X 的開發與本地驗證
  - [x] 已同步更新「開發進度」資料夾中的 Roadmap 與 CHANGELOG
  ```

### 步驟 6：審查後合併至 main 並清理本機分支
```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

---

## 4. 敏感資料與安全規則

為避免 API 金鑰洩漏或資料庫損毀，必須嚴格遵守以下禁令：

1. **嚴禁將 `.env` 提交進版本控制**：
   - 所有的 Gemini API Key、JWT Secret 均僅能留存在 `.env`。
   - 倉庫只允許提交 `.env.example`，且裡面不得含有真實金鑰。
2. **嚴禁將 SQLite 資料庫實體檔案提交**：
   - `data/*.db`、`data/*.db-wal`、`data/*.db-shm` 必須被 `.gitignore` 忽略。
3. **避免提交大型臨時二進制封裝檔**：
   - 根目錄下的 `*.tar.gz`、暫存包等不應推送到遠端 GitHub 儲存庫。
4. **驗證 `.gitignore` 涵蓋完整性**：
   ```gitignore
   node_modules/
   client/node_modules/
   mobile/node_modules/
   client/dist/
   mobile/dist/
   mobile/.expo/
   data/*.db*
   .env
   .DS_Store
   *.tar.gz
   *.log
   ```

---

## 5. 常見情境命令速查表

| 情境 | 推薦命令 |
| :--- | :--- |
| **開始新功能開發** | `git checkout -b feature/feature-name main` |
| **查看當前變更與狀態** | `git status -s` |
| **對照代碼修改** | `git diff` |
| **只暫存指定模組與文檔** | `git add client/ 開發進度/` |
| **撤銷未暫存的修改** | `git restore <file>` |
| **檢視最近 5 筆簡短提交歷史** | `git log --oneline -n 5` |
| **推送新分支到 GitHub** | `git push -u origin <branch-name>` |
