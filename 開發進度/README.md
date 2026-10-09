# 🇪🇸 PalabraCard 開發進度與專案管理中心

本目錄為 **PalabraCard (WordCard)** 專案的核心進度追蹤與工程協作規範庫。  
**所有團隊成員與 AI 協作者在進行任何新功能開發、Bug 修復或架構重構時，皆必須遵循本目錄中的 Git/GitHub 管理規範，並同步更新相關進度文件。**

---

## 📁 目錄結構索引

| 文件名稱 | 說明 | 連結 |
| :--- | :--- | :--- |
| **[專案開發狀況總覽.md](./專案開發狀況總覽.md)** | 包含全系統架構、Web/Mobile/Server/DevOps 各端開發完成度、API 規格與技術債評估 | [查看總覽](./專案開發狀況總覽.md) |
| **[AGENT開發指南與Prompt範本.md](./AGENT開發指南與Prompt範本.md)** | 給 Agent 的專屬指引，依「修復Bug、增加新功能、架構重構、效能優化」分類的 Prompt 範本與不同步驟 SOP | [查看 Agent 指南](./AGENT開發指南與Prompt範本.md) |
| **[GIT與GITHUB管理規範.md](./GIT與GITHUB管理規範.md)** | 分支命名、Commit 規範、PR 流程，以及**每次功能更新時同步更新開發進度的 SOP** | [查看規範](./GIT與GITHUB管理規範.md) |
| **[功能清單與Roadmap.md](./功能清單與Roadmap.md)** | 詳細功能清單矩陣（已完成、進行中、規劃中待辦清單） | [查看清單](./功能清單與Roadmap.md) |
| **[CHANGELOG.md](./CHANGELOG.md)** | 專案歷次版本變更與更新日誌 | [查看日誌](./CHANGELOG.md) |

---

## ⚡ 快速狀態摘要 (截至 2026 年最新進度)

```
[Web 前端 (React + Vite)]     ████████████████████ 95% (核心功能全數完成，字典模組進行中)
[後端 API (Node.js + SQLite)] ███████████████████░ 90% (多租戶 JWT、SM-2、Gemini AI 完成)
[行動端 (Expo / React Native)]████████████████░░░░ 80% (主要畫面與流程已完成，待聯調與優化)
[雲端部署 (Docker / Oracle)]   ██████████████████░░ 85% (輕量 ~35MB RAM 架構，Docker 配置調整中)
```

- **目前主要分支**：`main`
- **遠端倉庫**：`git@github.com:CCHENYUCHI/WardCard.git`
- **正式環境網址**：`https://wardcard.ycctw.xyz`
- **本機開發 Port**：
  - 前端 Web：`http://localhost:5173`
  - 後端 API：`http://localhost:3000`
  - 行動端 Expo Metro：`http://localhost:8081`

---

## 🔔 開發黃金準則

> **每當有新功能、Bug 修復或規格調整時：**
> 1. 從 `main` 切出特性分支 (`feature/...` 或 `fix/...`)。
> 2. 撰寫程式碼與自我測試。
> 3. **同步修改本目錄中的「[功能清單與Roadmap.md](./功能清單與Roadmap.md)」與「[CHANGELOG.md](./CHANGELOG.md)」**。
> 4. 使用標準規格提交 Commit (`git commit -m "feat: ..."` 或 `fix: ...`)。
> 5. 推送並發起 GitHub Pull Request，審核完成後合併至 `main`。
