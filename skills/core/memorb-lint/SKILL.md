---
name: memorb-lint
description: "Wiki Lint 工作流：memory 健檢，找出矛盾、過期、孤兒頁、缺頁、缺連結。觸發詞：整理 memory、檢查第二大腦、健檢、memory 有沒有要更新的。週回顧時主動建議執行。"
---

# Memorb Lint Skill

## Bundle Orb Awareness

When scanning directories under `Long-Term/` or `memorbs/HQ/Core/`, `memorbs/HQ/Belief/`:
- A **folder** whose name matches an existing `{name}/{name}.md` is a **valid bundle orb** — treat the inner `.md` as the orb page. Do not flag the folder as an orphan or structural error.
- A **folder** that contains no same-name `.md` file (e.g. `Long-Term/People/Acme/` with no `Acme.md` inside) is a **genuine orphan** — flag it for review.
- A **plain `.md` file** at `{base}/{name}.md` is a plain orb — check normally.

Apply this check whenever scanning for orphan pages, broken links, or unregistered entries.

## 動作順序

1. 讀 `memorbs/MEMORY.md` 全表 + 隨機抽 3-5 頁
2. 依檢查清單與 **MUSTY 淘汰判準** 逐項核對：

| 檢查項 | MUSTY 歸屬 | 說明 |
|--------|-----------|------|
| 矛盾 / 誤導 | **M** - Misleading | 同一人/專案在兩頁說法不一，或頁面內容與 log.md 最新事實矛盾 |
| 損壞 / 格式破壞 | **U** - Ugly | 格式壞掉、連結全斷、孤兒頁（MEMORY.md 沒列且無引用） |
| 被取代 / 已結束 | **S** - Superseded | 整頁對應實體已消失（專案完工結案、人員離職無互動） ➔ **提報交由 `memorb-forgetter` 歸檔** |
| 價值太低 / 冷記憶 | **T** - Trivial | `recall_count` 極低（如 <2）且 `last_recalled` 極舊 ➔ **提報交由 `memorb-forgetter` 歸檔** |
| 範疇外 | **Y** - Your collection doesn't need | 內容非屬記憶庫守備範圍，人工提報處理 |
| 缺別名註冊 (Authority) | 權威控制 | Daily Notes / log.md 出現、但未包含在任何頁面 `aliases` 清單的實體詞 ➔ 提報為潛在分裂筆記 |
| 缺頁 / 缺交叉連結 | 結構完整度 | log.md 多次提及但無專屬頁，或 `Long-Term/People/` 頁未連至 `Long-Term/Projects/` 頁 |
| Skill 調用率 | 路由健檢 | Daily Notes 對話紀錄的「使用 skill：」註記統計，找出漏路由對話 |

3. **提出建議清單給使用者確認**：
   - 頁面修正／擴充 ➔ 直接由 lint 協助修復。
   - 頁面淘汰歸檔 ➔ 提示使用者確認後，呼叫 `memorb-forgetter` 執行 `memorbs/Dump/` 搬移與 Wiki Link 自動改寫。
4. 修完在 `memorbs/log.md` append：
   ```markdown
   ## [YYYY-MM-DD] lint | 範圍 — 修了 N 項
   ```


## 附帶檢查（可選）

- `CLAUDE.md` 是否超過 100 行、MEMORY.md 是否超過 200 行
- `.claude/skills/` 路由表與實際目錄是否一致（見 writing-memorb-skills）
