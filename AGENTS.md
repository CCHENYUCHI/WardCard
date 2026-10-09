# 🤖 PalabraCard Agent Instructions & Global Directives

Welcome to **PalabraCard (WordCard)**!  
This file provides mandatory system directives for any AI coding agent working in this repository.

---

## ⚡ Global Architecture & Constraints

1. **Ultra-lightweight Backend**:
   - Designed for Oracle Cloud Free Tier (1GB RAM).
   - Memory footprint must remain around **~35MB RAM**.
   - Use Node.js 22+ native `node:sqlite` (`DatabaseSync` in WAL mode). **Never** introduce heavy databases like MongoDB, PostgreSQL, or Redis.
2. **Web Frontend Aesthetics**:
   - Built with React 18, Vite, and Lucide icons.
   - Design style is **Dark Glassmorphism** with subtle micro-animations and custom CSS variables.
   - Support keyboard shortcuts (`Space`, `1~4`) for card reviews.
3. **Mobile App (Expo SDK 57)**:
   - Located in `mobile/`. Built with React 19, React Native, and **Expo Router** (`src/app/`).
   - Follow Expo SDK 57 guidelines (refer to `mobile/AGENTS.md`). Do not use deprecated APIs.
4. **Security & Secrets**:
   - **NEVER** hardcode or commit `.env`, `data/*.db`, or API keys.

---

## 🚨 MANDATORY RULE: Synchronize Progress Documentation!

Whenever you work on this project, **you must maintain the project documentation in the `開發進度/` directory**:

1. **Before writing code**: Read [開發進度/專案開發狀況總覽.md](./開發進度/專案開發狀況總覽.md) and [開發進度/功能清單與Roadmap.md](./開發進度/功能清單與Roadmap.md) to understand current status.
2. **While working**:
   - Follow the task-specific workflow documented in [開發進度/AGENT開發指南與Prompt範本.md](./開發進度/AGENT開發指南與Prompt範本.md).
   - Work on an appropriate Git branch (`feature/...`, `fix/...`, `refactor/...`).
3. **Before finishing the task (MANDATORY)**:
   - Update **[開發進度/CHANGELOG.md](./開發進度/CHANGELOG.md)** under `[Unreleased]` (`Added`, `Fixed`, or `Changed`).
   - Update **[開發進度/功能清單與Roadmap.md](./開發進度/功能清單與Roadmap.md)** to reflect feature status changes.
   - Update **[開發進度/專案開發狀況總覽.md](./開發進度/專案開發狀況總覽.md)** if database schemas, APIs, or module completeness changed.
   - Format your Git commit message according to **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `chore:`, `perf:`).

---

## 🎯 Task Purpose Quick Reference

For detailed step-by-step SOPs and copy-pasteable prompt templates for each purpose, refer directly to:
👉 **[開發進度/AGENT開發指南與Prompt範本.md](./開發進度/AGENT開發指南與Prompt範本.md)**

| 任務目的 (Purpose) | 分支規範 (Branch) | 主要更新進度文件 | Commit 前綴 |
| :--- | :--- | :--- | :--- |
| **修改 Bug (Bug Fix)** | `fix/<bug-name>` | `CHANGELOG.md` (Fixed) | `fix(...)` |
| **增加新功能 (New Feature)** | `feature/<feature-name>` | `功能清單與Roadmap.md`<br/>`CHANGELOG.md` (Added)<br/>`專案開發狀況總覽.md` | `feat(...)` |
| **架構重構 (Refactoring)** | `refactor/<name>` | `CHANGELOG.md` (Changed)<br/>`專案開發狀況總覽.md` | `refactor(...)` |
| **效能優化 (Performance)** | `perf/<name>` | `CHANGELOG.md` (Performance) | `perf(...)` |
| **維運配置 (DevOps/Config)** | `chore/<name>` | `CHANGELOG.md`<br/>`專案開發狀況總覽.md` | `chore(...)` |
