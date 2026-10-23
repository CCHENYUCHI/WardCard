# 🧳 交接文件：本機 session + 用 Gemini 批次產生字根字首

> **建立日期**：2026-10-23
> **交接對象**：使用者 Mac 上的本機 Claude Code session（可以呼叫 Antigravity / Gemini）
> **起點**：`main` @ `dd73b28`（PR #11 已合併）。開新分支，例如 `feature/word-morphology`。
> 開工前照 `AGENTS.md`：先讀 `開發進度/專案開發狀況總覽.md`、`開發進度/功能清單與Roadmap.md`。

---

## 1. 目前狀態（main 已經有的）

| 功能 | 重點檔案 | 說明 |
|---|---|---|
| A1 字源圖鑑（1,038 字） | `server/data/lexicon/a1/*.json`、`server/data/lexicon/art/*.js`、`server/lexicon.js`、`client/src/components/StoryCard.jsx` | 字源鏈、英文同源、字源故事、記憶聯想、用法、例句、扁平插圖。撰寫規範：`server/scripts/lexicon/WRITING.md`；驗證：`node server/scripts/lexicon/validate.js` |
| 離線字典 v2 | `server/scripts/build-dictionary.js`、`server/dictionaryExtras.js`、`server/forms.js`、`server/dictionary.js` | 詞條＋IPA＋變形（`forms`）＋例句（`examples`）＋字源（`etymology`，含祖先鏈）＋A1 圖鑑（`lexicon` 表）。完整檔約 143MB，建置約 30 秒 |
| 單字卡連結字典 | `server/cardDict.js`（`cards.dict_lemma` / `dict_pos`） | 讀卡時陰陽性 / 詞性 / 英文改讀字典；舊欄位當備援 |
| 變化表視窗 | `client/src/components/FormsModal.jsx` | 動詞語氣 × 時態 × 人稱；名詞形容詞陰陽單複數 |
| 單字庫健檢 | `server/cardAudit.js`、`client/src/components/CardAuditModal.jsx` | 和字典比對，批次依字典修正並寫回卡片，可復原 |
| 版本資訊 | `server/buildInfo.js`、`client/src/components/VersionInfo.jsx`、`GET /api/version` | 設定最下方；前端 / 伺服器 commit 不同會警告 |
| 查詢紀錄 | `server/lookupHistory.js`、`client/src/components/LookupHistory.jsx` | 查詞頁下方 |

測試：`npm test`（66 個，全部通過）。前端：`cd client && npm run build`。

## 2. 本機環境

```bash
cd ~/Desktop/wordcard
git checkout main && git pull
git worktree remove .claude/worktrees/word-roots   # 舊的 worktree 用不到了（可選）
npm install && (cd client && npm install && npm run build)
ls -lh data/dict/es-en.sqlite      # 約 143MB = v2；約 90MB = 舊版，要重建（見下）
npm start                          # http://localhost:3000 → 設定 → 版本資訊確認 main @ 最新 commit
```
- 重建字典：`curl -L -o /tmp/es.jsonl https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl && npm run build:dict -- /tmp/es.jsonl`
- 只更新 A1 圖鑑：`npm run build:lexicon`；字典重建後讓卡片重新連結：`npm run link:cards -- --relink`
- `data/`（字典檔、使用者資料庫）**不在 Git**，不要 commit。

## 3. 串接 Antigravity / Gemini

**這個方向沒有 Google 或 Anthropic 的官方整合**，以下都是社群做法，或直接呼叫 CLI。

1. **最簡單：直接呼叫 CLI**
   - 在 Mac 上依 Google 官方說明安裝並登入 Antigravity CLI（`agy`）或 Gemini CLI（`gemini`）。
   - 確認終端機可以執行，例如 `gemini -p "hola"`。
   - Claude Code 用 Bash 呼叫就能把工作交給 Gemini。批次工作建議讓 Gemini 輸出 JSON 檔，Claude 再讀檔核對。
2. **社群 MCP 橋接（可選）**
   - 例如 `mcp-server-google-antigravity`、`antigravity-for-claude-code`，用 `claude mcp add …` 註冊，再用 `/mcp` 確認已連上。
   - **安裝前先讀過程式碼**，不要給它寫入 repo 的權限。安裝指令以各專案 README 為準。
3. **不需要 Antigravity 的替代方案**：專案本身就有 Gemini API 封裝。
   - `server/ai.js` 的 `callGemini()` 支援 `responseSchema`、自動備援模型、flash-lite。
   - 寫一支批次腳本直接打 API 即可，Key 用 `.env` 的 `GEMINI_API_KEY`。
   - 雲端 session 也能用：在環境設定加 `GEMINI_API_KEY`，並允許網域 `generativelanguage.googleapis.com`。

## 4. 下一個任務：字根字首（構詞拆解）

**使用者想要的樣子**（Gemini 對 decidir 的回答）：
> 拉丁語 dē- + caedō → decidir 🧠 一刀切下（de + caedere）：decidir 之後就不回頭。
> 前綴 de-「向下、離開」＋ 字根 -cidere（源自 caedere）「砍、切」→ decidere「向下砍斷」→ 決定。

**現有資料（先用免費的，再請 Gemini 補）**
- A1 圖鑑 `breakdown` 欄位：1,038 字中只有 **218** 字有。
- 字典 `etymology.chain` 裡 kind 為 `af` 的構詞（例如 `bueno + -ito`）：**29,926** 筆。這是 Wiktionary 的表面構詞分析，免費、可靠，不用 AI。
- 字典只有「From Latin decidere」這類資料的字（例如 decidir，`chain = [["la","dēcīdō","der"]]`）沒有拆成字首和字根，**這就是要 Gemini 補的部分**。

**建議做法**
1. **範圍先問使用者**：A1 的 1,038 字？使用者的單字庫？還是字典裡常用的前 N 個字？（建議先做單字庫加 A1，再擴大。）
2. **資料格式**（每個字一筆）：
   ```json
   { "word": "decidir", "pos": "verb",
     "parts": [ { "part": "de-", "type": "prefix", "lang": "la", "meaning_zh": "向下、離開", "meaning_en": "down, away" },
                { "part": "-cidir", "type": "root", "source": "caedere", "lang": "la", "meaning_zh": "砍、切", "meaning_en": "to cut" } ],
     "literal_zh": "向下砍斷", "hook_zh": "一刀切下，之後就不回頭",
     "family": ["incidir", "homicida", "suicidio", "precisar"],
     "confidence": "sourced | inferred", "sources": ["wiktionary:la:decido"] }
   ```
3. **分工**
   - **Gemini**：批次產生上面的 JSON。一次約 50 字，用 `responseSchema` 固定格式。
   - **Claude**：用 `server/scripts/lexicon/fetch-facts.js` 抓 Wiktionary 事實，逐筆核對字首和字根是否和字源相符。對不上就標 `inferred`，或丟回 Gemini 重寫。字族（family）裡的字要用字典驗證確實存在。
   - 驗證腳本仿照 `server/scripts/lexicon/validate.js`：欄位、長度、來源、字族都存在於字典。
4. **存放**：寫進字典檔的新表 `morphology(lemma, pos, data)`，由新的建置腳本產生，比照 `build-lexicon.js`。原始 JSON 放 `server/data/morphology/` 進 Git。讀取時沿用 `getEntryExtras()` 的「缺表回空值」寫法。
5. **顯示**：在字典頁和單字卡詳情的 `DictionaryExtras.jsx` 加一個「字根字首」區塊，或放進 `StoryCard`。字族裡的字點了就查詞。使用者提過想要點開查看，不要佔版面。
6. **測試**：仿照 `server/dictionaryExtras.test.js`，用 fixture 字典加 `setDictionary()`；Gemini 的部分 stub 掉 `callGemini`，只測 normalize 和驗證。

**省額度**：用 flash-lite 批次產生，結果永久存檔、所有使用者共用；app 執行時**不呼叫 AI**。

## 5. 其他待辦（Roadmap 已記）

- 文法書側邊欄：側邊點開查看的文法說明，待規劃。
- A1 圖鑑插圖精修：維持扁平畫風，畫得更精美，修正圖文不符的字。
- 非 A1 字的 AI 記憶法：讓 1,038 字以外的字也有故事和記憶聯想，可以和這次的字根字首一起做。
- **雲端伺服器更新**（使用者還沒做）：
  1. 先停容器再備份，指令如下：
     ```bash
     docker compose stop
     tar czf ~/backups/wordcard-$(date +%F-%H%M).tar.gz data/wordcard.db*
     ```
     並 `scp` 一份回 Mac。
  2. 用 `scp` 把 Mac 上的 `data/dict/es-en.sqlite` 傳到伺服器的 `data/dict/`。
  3. `git pull && APP_COMMIT=$(git rev-parse --short HEAD) APP_BRANCH=main docker compose up -d --build`。
  4. 用 `docker compose logs` 確認出現 `Linked … cards` 和 `Code main @ …`。

## 6. 注意事項

- 完成時照 `AGENTS.md` 更新 `開發進度/CHANGELOG.md`、`功能清單與Roadmap.md`、`專案開發狀況總覽.md`，並用 Conventional Commits。
- 使用者偏好：例句和中文意思主要由他自己用 Gemini 整理；不需要 DELE 等級、假朋友提醒、「AI 只抓字」流程。
- UI 用淺色 Google / Material 風格（`index.css` 的 `--google-*` 變數），不是 AGENTS.md 寫的 Dark Glassmorphism；只做 Web（`client/`）。
