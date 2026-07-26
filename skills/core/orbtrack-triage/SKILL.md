---
name: orbtrack-triage
description: "整理 OrbTrack（收集區）並依 PARA 原則分類搬移筆記。觸發詞：整理 OrbTrack、處理 OrbTrack、整理收集區、分類筆記、歸檔、搬移筆記、清空收集箱、整理。"
---

# OrbTrack Triage Skill

## 原則

OrbTrack 只是**暫存區**（未處理、待分類），位於 `memorbs/HQ/OrbTrack/`。目標：處理後 OrbTrack 清空或只剩真正未決事項。

## 流程

1. 列出 OrbTrack 內容。**bundle orb（`{name}/{name}.md` 形式的資料夾）視為一個項目整體處理**，不要拆開搬——附件必須跟著本體走：
   ```bash
   ls "$VAULT/memorbs/HQ/OrbTrack/"
   ```
2. **特殊類型先路由**：
   - 名片圖檔 → `business-card-ingestion`
   - 會議逐字稿（M365 Teams 自動產生，有 `meetingTranscriptUrl`）→ `m365-meeting-note`
   - 錄音檔（手機/錄音筆錄的 m4a/mp3/wav，非 Teams 來源）→ `recording-transcription`
   - 有學習價值的素材 → 搬移後同時跑 `memorb-ingest`
3. 一般筆記逐一判斷，依 PARA 決策樹搬移：

| 判斷 | 去向 | PARA |
|------|------|------|
| 有明確截止日或交付物 | `memorbs/Long-Term/Projects/` | **P** |
| 長期持續關注的責任領域/興趣 | `memorbs/Islands/` | **A** |
| 參考資料、學習筆記 | `memorbs/Islands/{相關島}/` 底下的單篇 orb，由該島 MOC 連結 | **R** |
| 關於某個人或組織的資訊 | `memorbs/Long-Term/{People,Orgs}/` | — |
| 已完成或不再相關 | `memorbs/Dump/{category}/` | **Ar** |

> **PARA 的 R 沒有獨立資料夾。** Island 的定義本來就涵蓋「責任領域**或興趣**」，所以感興趣的主題就是一座島，讀書筆記是掛在那座島底下的 orb。找不到對應的島時，先問使用者要不要開一座（轉 `island-reclamation`），不要為了安置一則筆記而另闢資料夾。

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
