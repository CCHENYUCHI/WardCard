# 🇪🇸 PalabraCard - AI 驅動西語智慧單字卡 & SRS 複習系統

專為西語學習者與 Oracle Cloud Free Tier 極輕量架設打造的單字卡 App。  
結合 **Google Gemini AI 課堂筆記/照片一鍵萃取生詞**、**3D 翻轉單字卡**、**西語重音拼字盲測**、**陰陽性/冠詞/例句文法解析** 以及 **SM-2 間隔重複記憶曲線 (SRS)**。

---

## ✨ 核心特色

1. **🌟 AI 拍照 & 筆記一鍵萃取（免買昂貴訂閱）**：
   - 拍照上傳課堂白板、講義照片，或直接貼上閱讀測驗、上課筆記。
   - AI 自動辨識單字，精確補充：**冠詞 (el/la)、陰陽性 (♂/♀)、詞性、繁體中文釋義、道地西語例句與翻譯、常考文法規則與動詞變化說明、DELE 等級 (A1~C2)**。
   - 結構化預覽表，勾選後 1 秒批次匯入單字庫。

2. **🎯 雙重複習模式**：
   - **3D 單字翻卡模式**：支援鍵盤快捷鍵（`Space` 翻轉、`1/2/3/4` 評分）、瀏覽器原生真人語音朗讀 (Web Speech API)。
   - **西語拼字盲測模式**：提供虛擬西語重音鍵盤（`á`, `é`, `í`, `ó`, `ú`, `ü`, `ñ`, `¿`, `¡`），例句挖空提示，即時防呆糾錯。

3. **🧠 經典 SM-2 間隔重複記憶演算法 (SRS)**：
   - 依「忘記、困難、良好、容易」動態計算複習週期（1天 ➔ 3天 ➔ 6天 ➔ 15天...），科學化抗遺忘。

4. **🗂️ 靈活分類與標籤管理**：
   - 快速切換「日常生活」與「考試必背 (DELE)」。
   - 支援搜尋單字、釋義、例句與文法筆記。

5. **⚡ Oracle Cloud Free Tier 極輕量優化**：
   - 採用 Node.js 內建原生 SQLite 資料庫，**記憶體佔用僅約 35MB RAM**！
   - 無需安裝龐大的 MySQL 或 MongoDB，極適合 Oracle Cloud 免費小主機（1GB RAM 也能超順暢運行）。

---

## 🚀 本地開發與快速啟動

### 1. 安裝與啟動
```bash
# 1. 複製環境設定
cp .env.example .env

# 2. 啟動開發伺服器（前後端同步）
npm run dev
```
瀏覽器開啟：`http://localhost:5173`

### 2. 生產模式運行（單一進程）
```bash
# 建置前端並以單一 Node.js 服務啟動 (預設 Port: 3000)
npm run build
npm start
```
瀏覽器開啟：`http://localhost:3000`

### 3. 建置離線字典（選用，查詞與例句點字用）
字典頁與複習時「點例句裡的單字」會先查離線西英字典（Wiktionary），把變化形還原成原形（`fui` → ir / ser）並顯示英文釋義，**完全不花 AI 額度**。沒建置也能用，只是少了這一層。
```bash
# 下載 kaikki.org 的西語 Wiktionary 資料（約 1GB）
curl -L -o /tmp/es.jsonl https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl

# 串流轉成精簡的 SQLite（約 90MB，輸出到 data/dict/es-en.sqlite，建置時記憶體約 130MB）
npm run build:dict -- /tmp/es.jsonl
rm /tmp/es.jsonl
```
- 檔案在 `data/` 底下（Docker 已掛載為 volume），不會進 Git；伺服器執行時只多約 1MB 記憶體。
- 位置可用 `DICT_DB_PATH` 指定。資料授權：Wiktionary，CC BY-SA。

---

## ☁️ Oracle Cloud Free Tier 雲端部署教學

### 方法 A：使用 Docker Compose（最推薦、一鍵啟動）

1. **在 Oracle Cloud 主機上安裝 Docker & Docker Compose**（若尚未安裝）：
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER
   ```

2. **將專案上傳至 Oracle Cloud 主機**，進入專案目錄：
   ```bash
   cd wordcard
   cp .env.example .env
   # 編輯 .env 填入你的 Gemini API Key (也可在網頁上的設定齒輪填寫)
   nano .env
   ```

3. **啟動容器**：
   ```bash
   docker compose up -d
   ```
   > 容器內已自動做好 SQLite 資料持久化（資料庫存放在主機的 `./data/wordcard.db`）。

4. **放行 Oracle Cloud 防火牆 Port 3000**：
   - **主機防火牆 (iptables)**：
     ```bash
     sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
     sudo netfilter-persistent save
     ```
   - **Oracle Cloud 控制台**：
     - 進入「虛擬雲端網路 (VCN)」➔「安全清單 (Security Lists)」➔「Default Security List」
     - 新增傳入規則 (Ingress Rule)：CIDR `0.0.0.0/0`，TCP 通訊協定，目的地連接埠 `3000`。

5. 現在即可透過你的 Oracle Cloud 公共 IP 瀏覽：  
   `http://<YOUR_ORACLE_IP>:3000`

---

### 方法 B：使用 PM2 守護進程（超省資源、免 Docker）

1. **安裝 Node.js 22+ 與 PM2**：
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

2. **在專案目錄建置與啟動**：
   ```bash
   cd wordcard
   npm install
   cd client && npm install && npm run build && cd ..
   
   # 使用 PM2 背景開機自啟
   pm2 start server/index.js --name "palabracard"
   pm2 startup
   pm2 save
   ```
   記憶體佔用實測：**僅 ~32MB RAM**！

---

## 🔑 免費 Gemini API Key 取得方式
前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 點擊 **Create API Key**，即可免費獲得金鑰（Gemini 1.5 Flash 免費額度每日高達數千次請求，完全零成本）。
可在網頁右上角的 ⚙️ **設定** 介面直接輸入，也可以寫入伺服端 `.env`。

---

## 📈 專案開發進度與 Git/GitHub 管理規範

專案所有開發進度、各端實作完成度、Roadmap 與 Git 協作規範均集中記錄於 [開發進度/](./開發進度/README.md) 資料夾：

- 📊 **[專案開發狀況總覽](./開發進度/專案開發狀況總覽.md)**：系統架構、Web/Mobile/Server 完成度盤點與技術債
- 🐙 **[Git & GitHub 管理規範](./開發進度/GIT與GITHUB管理規範.md)**：分支策略、Commit 規範與**新功能同步更新進度 SOP**
- 🗺️ **[功能清單與 Roadmap](./開發進度/功能清單與Roadmap.md)**：各模組完成度矩陣與待辦事項
- 📝 **[更新日誌 CHANGELOG](./開發進度/CHANGELOG.md)**：版本演進歷史與變更記錄

