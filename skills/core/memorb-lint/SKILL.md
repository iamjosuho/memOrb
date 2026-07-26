---
name: memorb-lint
description: "Wiki Lint 工作流：memory 健檢，找出矛盾、過期、孤兒頁、缺頁、缺連結。觸發詞：整理 memory、檢查第二大腦、健檢、memory 有沒有要更新的。跑 dream-studio 之前主動建議執行。"
---

# Memorb Lint Skill

## Bundle Orb Awareness

When scanning directories under `memorbs/Long-Term/` or `memorbs/HQ/Core/`, `memorbs/HQ/Belief/`:
- A **folder** whose name matches an existing `{name}/{name}.md` is a **valid bundle orb** — treat the inner `.md` as the orb page. Do not flag the folder as an orphan or structural error.
- A **folder** that contains no same-name `.md` file (e.g. `memorbs/Long-Term/People/Acme/` with no `Acme.md` inside) is a **genuine orphan** — flag it for review.
- A **plain `.md` file** at `{base}/{name}.md` is a plain orb — check normally.

Apply this check whenever scanning for orphan pages, broken links, or unregistered entries.

## 動作順序

1. 列出 `memorbs/Long-Term/`、`memorbs/HQ/Core`、`memorbs/HQ/Belief` 全部檔案 + 隨機抽 3-5 頁細看
2. 依檢查清單與 **MUSTY 淘汰判準** 逐項核對：

| 檢查項 | MUSTY 歸屬 | 說明 |
|--------|-----------|------|
| 矛盾 / 誤導 | **M** - Misleading | 同一人/專案在兩頁說法不一，或頁面內容與 log.md 最新事實矛盾 |
| 損壞 / 格式破壞 | **U** - Ugly | 格式壞掉、連結全斷、孤兒頁（全庫沒有任何 `[[連結]]` 指向它） |
| 被取代 / 已結束 | **S** - Superseded | 整頁對應實體已消失（專案完工結案、人員離職無互動） ➔ **提報交由 `memorb-forgetter` 歸檔** |
| 價值太低 / 冷記憶 | **T** - Trivial | `recall_count` 極低（如 <2）且 `last_recalled` 極舊 ➔ **提報交由 `memorb-forgetter` 歸檔** |
| 落單附件 | **U** - Ugly | bundle 資料夾裡有附件、卻找不到同名的 `{name}.md` 本體 ➔ 附件失去所屬 orb，提報處理 |
| 媒體檔誤入庫 | **Y** - Your collection doesn't need | `memorbs/` 底下出現音訊或影片檔（`.m4a`／`.mp3`／`.wav`／`.mp4`…）➔ 只有文件檔該進 vault，提報移出並在 orb 內文記位置 |
| 範疇外 | **Y** - Your collection doesn't need | 內容非屬記憶庫守備範圍，人工提報處理 |
| 缺別名註冊 (Authority) | 權威控制 | `log.md` 出現、但未包含在任何頁面 `aliases` 清單的實體詞 ➔ 提報為潛在分裂筆記 |
| 缺頁 / 缺交叉連結 | 結構完整度 | log.md 多次提及但無專屬頁，或 `memorbs/Long-Term/People/` 頁未連至 `memorbs/Long-Term/Projects/` 頁 |
| 時間軸斷裂 | 結構完整度 | `log.md` 有連續多日空白，或 entry 普遍缺「訊號」欄位 ➔ 提醒使用者，夢工廠會因此無料可重播 |

3. **提出建議清單給使用者確認**：
   - 頁面修正／擴充 ➔ 直接由 lint 協助修復。
   - 頁面淘汰歸檔 ➔ 提示使用者確認後，呼叫 `memorb-forgetter` 執行 `memorbs/Dump/` 搬移與 Wiki Link 自動改寫。
4. 修完在 `memorbs/log.md` append：
   ```markdown
   ## [YYYY-MM-DD] lint | 範圍 — 修了 N 項
   ```


## 附帶檢查（可選）

- `memorbs/HQ/persona.md` + `memorbs/HQ/identity.md` 合計是否超過 100 行（Hot Cache 上限）
- `.claude/skills/` 路由表與實際目錄是否一致（見 writing-memorb-skills）
