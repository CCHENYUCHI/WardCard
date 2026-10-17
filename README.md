# 🇪🇸 PalabraCard — 會排課表的西語單字卡

**拍下課堂講義，AI 幫你做成單字卡；每天打開，App 告訴你今天該背哪些字。**

PalabraCard 是一款專為西班牙語學習者設計的單字卡 App。它結合 **Google Gemini AI 自動萃取生詞**、**FSRS 科學記憶排程**，以及**依熟練度自動升級的五階段練習**，讓你不必自己決定「今天要複習什麼」，只要每天把任務做完就好。

Web 版可在電腦與手機瀏覽器使用，另有 iOS / Android App（Expo）開發中。整個後端只佔約 **35MB 記憶體**，一台免費的雲端小主機就能自己架。

🌐 線上服務：<https://wardcard.ycctw.xyz>

---

## ✨ 你可以用它做什麼

### 📸 拍照或貼筆記，AI 自動做卡
- 上傳白板、講義照片，或直接貼上課文、上課筆記。
- AI 會整理出每個生詞的 **冠詞（el / la）、陰陽性、詞性、繁體中文釋義、例句與翻譯、文法筆記、DELE 等級（A1–C2）**。
- 名詞與形容詞會附上陰陽性 / 單複數變化（alto / alta / altos / altas），動詞自動還原成原形。
- 結果先以表格預覽，勾選後才存入；**已經在單字庫裡的字會標示出來並預設不勾**，不怕覆蓋到正在學的卡。

### 📅 今日學習駕駛艙：打開就知道要做什麼
- 每天自動排好三種任務：**🚨 快忘記的字優先搶救、📚 到期複習、🌱 課本新單字**。
- 今日任務圓環顯示「已完成 / 今日目標」，到期複習、新單字、加練分開計算。
- 🔥 連續學習天數、7 天週進度、近 30 天學習紀錄。
- 今天的任務做完還想練？按「加練一輪」，系統挑出你記得最不牢的字，另外記錄、不影響今日任務。

### 🪜 五階段自適應練習：越熟的字，題目越難
每個單字都有自己的熟練階段，練習時自動換題型：

| 階段 | 題型 | 練什麼 |
| :---: | :--- | :--- |
| **S1** | 看單字、翻卡辨認 | 認得 |
| **S2** | 看中文回想（附首字母提示） | 想得起來 |
| **S3** | 看中文完整拼寫 | 拼得出來（含重音） |
| **S4** | 例句克漏字 | 在句子裡用得出來（含動詞變化） |
| **S5** | 例句四選一 | 分辨相近的字（干擾選項取自你自己的單字庫） |

- 拼字比對會自動忽略冠詞、接受 `bonito/a` 這類寫法，`á / é / í / ó / ú / ü / ñ / ¿ / ¡` 都能正確判斷。
- 全程可只用鍵盤：`Enter` 送出、`Space` 翻卡、`1`–`4` 選答案或評分。

### 🧠 FSRS 記憶排程
- 採用現代的 **FSRS v4.5** 演算法（Anki 新版同款），依每個字的難度與記憶穩定度，算出最適合的下次複習時間。
- 可自訂**目標記憶留存率（85%–95%）**與**每日新單字上限（10–50 字）**。
- 評分按鈕會先告訴你「選這個，下次是幾天後」。

### 🔍 點例句裡的字就能查（Duolingo 式）
- 練習時看到例句裡不認識的字，直接點它：顯示**原形、中文、用法與英文釋義**。
- 內建**離線西英字典**（Wiktionary），能把變化形還原成原形：`fui` → ir / ser、`tuvieron` → tener、`bonitas` → bonito。
- 查不到中文時才按「✨ AI 解析這句」，一次解析整句，結果所有人共用快取，**同一句不會重複花 AI 額度**。
- 獨立的「查詞」頁可查西語或中文，一鍵把新字加入暫存箱。

### 🗂️ 單字庫管理
- **暫存 → 待學 → 學習中 → 精通** 的分流設計，新字先放暫存箱，不會一次湧進每日任務。
- 依課本單元分組（第 0 / 1 / 2 / 3 課自然排序），顯示每個單元的掌握率。
- ⭐ 標記重點單字、多選批次操作、關鍵字搜尋、分類與 DELE 等級篩選。
- 支援 CSV 匯入、JSON 完整備份與還原。

### 🔊 其他貼心設計
- 西語真人發音（線上語音 + 瀏覽器內建語音雙引擎，iPhone Safari 也能播）。
- 學習統計：本週複習量預估、DELE 等級分佈、各分類掌握程度。
- 乾淨明亮的 Material Design 風格；手機版有底部導覽列，完整支援瀏海與 Home Bar 安全區域。
- 多使用者帳號，每個人的單字庫與進度各自獨立。

---

## 📱 支援平台

| 平台 | 狀態 |
| :--- | :--- |
| **Web（電腦 / 手機瀏覽器）** | ✅ 功能完整，主力版本 |
| **iOS / Android App（Expo）** | 🚧 開發中：已有登入、單字庫、翻卡、拼字測驗、AI 拍照萃取、CSV 匯入；今日任務與五階段練習尚未移植 |

---

## 🛠️ 技術架構

| 層級 | 技術 |
| :--- | :--- |
| Web 前端 | React 18、Vite、Lucide Icons |
| 行動端 | Expo SDK 57、React Native、React 19、Expo Router |
| 後端 | Node.js 22+、Express、JWT 認證 |
| 資料庫 | Node.js 內建 `node:sqlite`（WAL 模式），不需另外安裝資料庫 |
| AI | Google Gemini（`gemini-3.6-flash`，失敗時自動改用 `gemini-3.5-flash-lite`） |
| 字典 | 離線 Wiktionary 西英字典（SQLite，約 90MB） |
| 部署 | Docker Compose 或 PM2，Oracle Cloud Free Tier（1GB RAM）即可運行 |

---

## 🚀 自己架一套

### 需要準備
- Node.js **22 以上**
- 一組 Gemini API Key（[Google AI Studio](https://aistudio.google.com/app/apikey) 免費申請）。也可以不放在伺服器，由每位使用者在網頁的 ⚙️ 設定裡自行填入。

### 本機開發
```bash
npm install
cd client && npm install && cd ..
cp .env.example .env      # 填入 GEMINI_API_KEY（選填）
npm run dev               # 同時啟動前端與後端
```
開啟 <http://localhost:5173>，註冊一個帳號就能開始使用。

### 正式環境（單一 Node.js 服務）
```bash
npm run build             # 建置前端
npm start                 # 預設 Port 3000
```

### Docker Compose
```bash
cp .env.example .env
docker compose up -d
```
資料庫存在主機的 `./data/` 底下，重建容器不會遺失資料。

### 環境變數
| 變數 | 說明 | 預設 |
| :--- | :--- | :--- |
| `PORT` | 伺服器連接埠 | `3000` |
| `GEMINI_API_KEY` | 伺服器端的 Gemini Key（使用者沒填自己的 Key 時使用） | 空 |
| `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` | 主要與備援模型 | `gemini-3.6-flash` / `gemini-3.5-flash-lite` |
| `TZ` | 「今天」的換日時區（每天 00:00 重新計算任務） | `Asia/Taipei` |
| `DICT_DB_PATH` | 離線字典檔位置 | `./data/dict/es-en.sqlite` |

### 建置離線字典（選用）
沒有字典也能用，只是點字查詢時少了「變化形 → 原形」與英文釋義。
```bash
curl -L -o /tmp/es.jsonl https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl   # 約 1GB
npm run build:dict -- /tmp/es.jsonl      # 產生 data/dict/es-en.sqlite（約 90MB）
rm /tmp/es.jsonl
```
字典資料來自 Wiktionary，授權為 CC BY-SA。

### 行動端
```bash
cd mobile
npm install
npx expo start
```
App 預設連線到正式環境 API，可在 `mobile/src/constants/api.ts` 修改。

### 測試
```bash
npm test
```

<details>
<summary><b>☁️ 部署到 Oracle Cloud Free Tier 的注意事項</b></summary>

1. 安裝 Docker：
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER
   ```
   不想用 Docker 的話，也可以用 PM2 直接常駐（實測約 32MB RAM）：
   ```bash
   npm install && npm run build
   sudo npm install -g pm2
   pm2 start server/index.js --name palabracard
   pm2 startup && pm2 save
   ```
2. 開放 Port 3000：
   - 主機防火牆：
     ```bash
     sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
     sudo netfilter-persistent save
     ```
   - Oracle Cloud 控制台：VCN ➔ Security Lists ➔ 新增 Ingress Rule（TCP、目的連接埠 `3000`）。
3. 建議前面再加一層 Nginx 反向代理與 HTTPS 憑證。

</details>

---

## 🗺️ 接下來

- 答錯時的智慧提示（只差重音？陰陽性？字尾？）
- 從萃取時順便產生的多句例句，讓克漏字題每次換一句
- AI 用量紀錄與每日上限
- 行動端補上今日任務、五階段練習與發音
- 每日提醒推播

完整的功能清單、開發進度與更新紀錄都在 [開發進度/](./開發進度/README.md)：
[功能清單與 Roadmap](./開發進度/功能清單與Roadmap.md) ・ [專案開發狀況總覽](./開發進度/專案開發狀況總覽.md) ・ [CHANGELOG](./開發進度/CHANGELOG.md) ・ [Git 協作規範](./開發進度/GIT與GITHUB管理規範.md)

---

## 📄 授權

程式碼以 MIT License 釋出。離線字典資料來自 Wiktionary（CC BY-SA）。
