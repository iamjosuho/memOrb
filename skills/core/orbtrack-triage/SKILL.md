---
name: orbtrack-triage
description: "整理 OrbTrack（收集區）並依 PARA 原則分類搬移筆記。觸發詞：整理 OrbTrack、處理 OrbTrack、整理收集區、分類筆記、歸檔、搬移筆記、清空收集箱、整理。"
---

# OrbTrack Triage Skill

## 原則

OrbTrack 只是**暫存區**（未處理、待分類），位於 `memorbs/HQ/OrbTrack/`。目標：處理後 OrbTrack 清空或只剩真正未決事項。

## 流程

1. 列出 OrbTrack 內容（忽略 `Attachments/`）：
   ```bash
   ls "$VAULT/memorbs/HQ/OrbTrack/" --ignore="Attachments"
   ```
2. **特殊類型先路由**：
   - 名片圖檔 → `business-card-ingestion`
   - 會議逐字稿 → `m365-meeting-note`
   - 有學習價值的素材 → 搬移後同時跑 `memorb-ingest`
3. 一般筆記逐一判斷，依 PARA 決策樹搬移：

| 判斷 | 去向 |
|------|------|
| 有明確截止日或交付物 | `Long-Term/Projects/` |
| 長期持續關注的責任領域/興趣 | `Islands/` |
| 參考資料、學習筆記 | `Resources/` |
| 已完成或不再相關 | `Dump/` |

4. 確認第一層PARA後，在逐層確認要放到哪個資料夾，之後逐層遞迴，直到檔案本身
5. 整理 OrbTrack files，把內容分類，判斷要進到哪些檔案
6. 可能 OrbTrack files input data同時包含很多PARA的資料，先詢問使用者怎麼處理，並給予推薦
7. 搬移(mv command) 時更新 frontmatter：`status: unprocessed` → `status: processed`（或對應狀態）
8. 若筆記提到人物/專案/術語的新資訊，可以加上雙向連結，回填 `memorbs/` 對應頁（見 `memorb-ingest` 步驟 3）

## Red Flags

| 藉口                           | 真實情況                                            |
| ---------------------------- | ----------------------------------------------- |
| 「OrbTrack 跟 Resources 差不多，放哪都行」 | OrbTrack 是未處理，Resources 是長期知識庫。定義嚴格區分。          |
| 「先大概分類，檔名隨便」                 | 檔名與日期格式必須符合 memorb-conventions。                  |
| 「這張名片圖我直接歸檔」                 | 名片必須走 business-card-ingestion 的 Page Bundle 流程。 |
