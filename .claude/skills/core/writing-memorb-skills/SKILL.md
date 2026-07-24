---
name: writing-memorb-skills
description: Meta skill：新增或修改本 vault 的任何 sub-skill 時使用。規範命名、frontmatter、結構、註冊流程與測試。觸發詞：新增 skill、寫一個 skill、修改 skill、固化流程、這個流程以後常做。
---

# Writing Memorb Skills（Meta）

> 對應 superpowers 的 writing-skills。任何流程重複做過 2 次以上，就該固化成 skill。

## 何時新增 skill

- 一個工作流被手動執行 2 次以上
- CLAUDE.md 中某段規則越長越大（CLAUDE.md 限 100 行，工作流細節應搬進 skill）
- 使用者 明確要求

## Skill 結構規範

1. **位置**：`.claude/skills/{kebab-case-name}/SKILL.md`（扁平，不巢狀）
2. **frontmatter**：只有 `name` 與 `description` 兩欄
   - `description` 必含：一句話用途 + `觸發詞：...` + 前置依賴（若有）
   - 觸發詞用使用者實際會說的話，繁中為主
3. **正文**（依需求取捨）：
   - 動作順序（編號步驟，標明鐵律）
   - 路徑/格式規格表
   - Red Flags 表（藉口 vs 真實情況）——工作流型 skill 建議必備
   - `*(待固化：...)*` 標記未確定的部分
4. **單一職責**：一個 skill 管一件事；跨領域就拆開再互相引用

## 註冊流程（缺一不可）

1. 建立/修改 `SKILL.md`
2. 更新 `memorb/SKILL.md` 路由表（新增一列：skill 名 + 觸發情境）
3. 若影響 CLAUDE.md 的 Skills Registry 或工作流摘要，同步更新（保持 ≤100 行）
4. 在 `memorbs/log.md` append：`## [YYYY-MM-DD] skill | 新增/修改 {name}`
5. git commit（訊息註明 skill 變更）

## 測試

- 新 skill 寫完後，模擬一次觸發情境走一遍步驟，確認路徑與指令可執行
- 下次 lint 時檢查：路由表與 `.claude/skills/` 目錄是否一致

## Red Flags

| 藉口 | 真實情況 |
|------|---------|
| 「skill 寫好了，路由表下次補」 | 沒進路由表 = 永遠不會被觸發。註冊流程缺一不可。 |
| 「description 隨便寫，內文才重要」 | 路由靠 description 觸發詞。寫錯就路由失敗。 |
| 「規則直接加進 CLAUDE.md 比較快」 | CLAUDE.md 是 schema 層（限 100 行），工作流歸 skill。 |
