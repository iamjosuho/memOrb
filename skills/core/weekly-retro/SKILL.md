---
name: weekly-retro
description: "產出每週回顧。觸發詞：週回顧、每週總結、weekly retro、本週回顧、這週過得如何。前置依賴：memorb-conventions。"
---

# Weekly Retro Skill

## 路徑規則

放置於 `WeeklyRetro/`，命名 `YYYY-Www.md`（ISO 週數，如 `2026-W28.md`）。

## 流程

1. 取得本週範圍與週數：
   ```bash
   date +%G-W%V   # ISO 年-週
   ```
2. **素材收集**：
   - 讀本週所有 Daily Notes（`Daily Notes/{YYYY}/{MM}/`）
   - 讀 `memorbs/log.md` 本週事件
   - 讀 `TASKS.md` 完成與未完成項
3. **產出結構**（草案，可依使用者指示調整）：
   - 本週摘要（3-5 句）
   - 完成的事 / 未完成待轉下週
   - 專案進度變化（對照 memorbs/projects/）
   - 洞見與學習
   - 下週意圖
4. 回顧中發現的永續性洞見 → 回填 `memorbs/`（見 `memorb-query` 回填規則）
5. 主動建議：週回顧是跑 `memorb-lint` 的好時機

*(待與使用者討論固化：回顧的固定步驟與 KPI 區塊)*
