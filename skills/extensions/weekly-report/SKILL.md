---
name: weekly-report
description: 產出周報 pptx。觸發詞：做周報、產出周報、執行長周報、週五匯報、主管週例會報告。注意：*讀取/整理*周報會議逐字稿歸 m365-meeting-note。
---

# Weekly Report Skill

## 基本規格

| 項目 | 規格 |
|------|------|
| 格式 | pptx |
| 期限 | 每週四前完成（週五向 Vic 匯報） |
| 存放 | `OneDrive-凡易股份有限公司/2.資訊研發部/1.主管週例會報告/` |
| 語言 | 繁體中文 |

## 素材收集（產出前依序讀取）

1. `Long-Term/Projects/` — 各專案最新狀態（eBao Sprint、集團 MIS、監視器統購、工研院、凱基扣款）
2. `memorbs/log.md` — 本週事件
3. 本週 Daily Notes 與 WeeklyRetro（若已產出）
4. Jira（Atlassian MCP）— Sprint 進度、完成/未完成 issue
5. Teams / Outlook（M365 MCP）— 本週重要往來（可選）

## 內容結構（草案）

1. 本週摘要（一頁、3-5 bullet）
2. 各專案進度與風險（一專案一段：狀態 / 本週進展 / 障礙 / 需要 Vic 決策的事）
3. 下週計畫
4. 需協調事項 / 資源需求

*(待固化：對照 OneDrive 既有周報檔案的實際版型後更新本結構，並記錄常用母片)*

## 產出流程

1. 素材收集完成後，才讀 pptx 產出用 skill 建立簡報
2. 檔名慣例：跟隨 OneDrive 資料夾內既有命名（先列出既有檔案確認格式）
3. 產出後提醒使用者上傳 OneDrive（或經 MCP 直接存放，若已接通）
4. 周報中的專案狀態變化 → 回填 `Long-Term/Projects/`（見 memorb-query 回填規則）
