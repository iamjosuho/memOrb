---
name: memorb-conventions
description: "Base layer conventions for the memOrb vault：路徑解析、資料夾結構、命名規則、YAML frontmatter schema、範本。所有寫入類 sub-skill 的前置依賴。觸發詞：路徑、資料夾結構、命名、模板、frontmatter、schema。"
---

# Memorb Conventions (Single Source of Truth / 唯一標準)

> **本 Skill 為 memOrb 系統資料夾結構、檔名格式、YAML Schema 與規範的 Single Source of Truth (SSOT / 唯一標準)。**
> 定義所有寫入操作與初始化（如 `/memorb-born`）都必須嚴格遵守的基礎規範。工作流程本身歸各 sub-skill，這裡只管「東西放哪裡、長什麼格式」。
> 本檔案不假設使用者 vault 根目錄的名稱或既有結構——memOrb 只透過 `memorbs/` 這個非侵入式命名空間運作，根目錄以外的東西一律不動。

## VAULT 路徑解析

不假設固定根目錄名稱。以 `memorbs/HQ/identity.md` 是否存在作為「此 vault 已完成 memorb-born 初始化」的判斷依據：

```bash
VAULT=$(find . -maxdepth 4 -type d -name memorbs 2>/dev/null -exec dirname {} \; | head -1)
```

找不到時，代表尚未執行 `/memorb-born`，應先路由至該 skill。

## 資料夾結構

三層並存：

1. **使用者原生筆記**（`Daily Notes/`、`Resources/`、`Dump/`、`WeeklyRetro/`、`Templates/`、`TASKS.md`，memOrb 只依既有慣例寫入，不改動其結構）
2. **`Islands/`、`Long-Term/`**（vault 根目錄下由 memOrb 定義結構、主動維護的兩個資料夾：`Islands/` 只放長期領域/興趣的敘事層，`Long-Term/` 放 Projects／People／Orgs 的實體內容頁）
3. **`memorbs/`**（memOrb 專屬命名空間：HQ 人設/身分/Core/Belief/OrbTrack、Dump 歸檔、MEMORY.md、log.md）

```text
<你的 vault>/
├── Daily Notes/            ← 每日筆記，YYYY/MM/YYYY-MM-DD.md（巢狀，不可扁平）
├── Islands/                ← 需長期維持標準的責任領域/興趣（人格島）：只放現況、長期目標、板塊筆記、MOC，不存放實體 orb，靠連結指向 Long-Term/ 的實體頁面
├── Long-Term/              ← 長期記憶倉庫，存放實際內容頁（原 Projects/ 與 memorbs/Islands/ 的人物/專案/組織記錄合併於此，一個實體只留一份頁面）
│   ├── Projects/           ← 有明確截止日/交付物的專案（含歷程紀錄）
│   ├── People/             ← 關鍵協作者（Authority Control 頁面，見下）
│   └── Orgs/               ← 組織與團隊（Authority Control 頁面，見下）
├── Resources/              ← 參考資料、學習筆記（會議逐字稿原始檔在 Resources/會議記錄/raw/）
├── Dump/               ← 使用者自己不再需要的 Islands/Long-Term 筆記（與 memorbs/Dump 是不同的歸檔對象，見下）
├── WeeklyRetro/            ← 週回顧，YYYY-Www.md
├── Templates/              ← 筆記範本（唯讀參考）
├── TASKS.md                ← 待辦清單
└── memorbs/                ← memOrb 命名空間（以下才是本檔案真正管轄的範圍）
    ├── HQ/
    │   ├── persona.md        ← AI 顧問人設：語氣、角色設定（<100 行，每次 session 必讀）
    │   ├── identity.md       ← 使用者身分：姓名/生日/學經歷/角色/組織/目標/關鍵關係（<100 行，每次 session 必讀）
    │   ├── Core/             ← Core Memory orbs，一 orb 一檔（有轉折意義的具體經驗）
    │   ├── Belief/           ← Belief orbs，一 orb 一檔（從經驗提煉出的價值/信念聲明）
    │   └── OrbTrack/         ← 唯一的快速收集區（`Attachments/` 放附加檔案），由 orbtrack-triage 清空
    ├── Dump/
    │   └── {category}/       ← MUSTY 淘汰後的歸檔頁（由 memorb-forgetter 搬入）
    ├── MEMORY.md             ← 全庫索引（≤200 行）
    └── log.md                ← 事件流（ingest / lint / archive / decision …）
```

> **注意**：`memorbs/HQ/OrbTrack/` 是唯一的收集區。不要另外建立 `Inbox/`——兩個收集區並存只會讓 triage 邏輯分裂。
> **注意**：歸檔統一寫作 `memorbs/Dump/{category}/`（單數 Dump）。
> **注意**：`Long-Term/People`／`Long-Term/Orgs`／`Long-Term/Projects` 取代了原本的 `memorbs/Islands/{people,organizations,projects}`，`memorbs/Islands/` 這個命名空間已廢除。原本歸在 `context/` 的環境規則不再獨立分類，直接寫進相關實體的 Long-Term 頁面本體。
> **注意**：`recording-transcription`／`business-card-ingestion`／`memorb-domain-query`／`m365-meeting-note` 幾個 extension skill 原本仍寫作舊的扁平路徑（`memorbs/people/`、`memorbs/organizations/`、`memorbs/projects/`），已於 2026-07-25 同步對齊為 `Long-Term/People/`、`Long-Term/Orgs/`、`Long-Term/Projects/`。`fixtures/memorbs/Islands/` 測試樣本與 `scripts/lint-skills.js` 的 fixture 結構驗證同步更新為 `fixtures/Long-Term/{Projects,People,Orgs}`。
> **注意（待處理 TODO，2026-07-26 稽核發現，暫緩不動）**：`Long-Term/People/` 頁面結構目前不一致——`business-card-ingestion`／`memorb-domain-query` 假設「有名片附件時依公司名稱建巢狀資料夾」（`Long-Term/People/{公司}/{姓名}/{姓名}.md`），本檔案定義的預設卻是單一頁面，`recording-transcription`／`m365-meeting-note`／`memorb-ingest` 也都假設扁平 `Long-Term/People/{姓名}.md`。同一人可能因建檔管道不同落在兩個不同路徑。尚未決定要統一成哪個方向，先列入待辦，詳見 `docs/skill-audit-2026-07-26.md` P1 #1。
> **注意**：`persona.md`／`identity.md` 是固定的 Hot Cache 檔案（各一份，不會重複），`Core/`／`Belief/` 是裝 orb 的資料夾（一 orb 一檔，數量會持續增加）。四者角色不同，不要互相混用。

## Session 開頭必讀

每次 session 開始，必讀 `memorbs/HQ/persona.md` 與 `memorbs/HQ/identity.md`（兩者合計仍需 <100 行，維持 Hot Cache 的精簡）。`Core/`、`Belief/` 底下的 orb，以及 `Long-Term/` 底下的實體頁面，一律交由 `memorb-query` 視情境查詢與回填，不必每次全讀。

## 命名與格式規則

1. **日期格式**：一律 `YYYY-MM-DD`；週格式 `YYYY-Www`（如 `2026-W28`）。
2. **OrbTrack 檔名**：`{YYYY-MM-DD}-{HHMM}-{Title}.md`。
3. **Frontmatter**：每篇筆記都要有 YAML frontmatter，欄位依筆記類型而定（見下方兩張表）。
4. **語言**：內文預設繁體中文。
5. **Emoji**：非結構性標題不加 emoji；頂層資料夾名稱不含 emoji。
6. **動作後回報**：建立/更新筆記後，回報檔案路徑給使用者。
7. **MOC 命名**：Island 的入口筆記統一命名 `000-MOC.md`；跨資料夾引用一律用完整路徑 `[[Islands/{名稱}/000-MOC|{名稱}]]`，避免同名歧義。`Long-Term/` 底下的實體頁面（Projects／People／Orgs）預設為單一頁面，不強制要求 MOC。

## Frontmatter Schema

### 一般筆記（Daily Note / Island / Resource）

```yaml
---
title: {標題}
date: {YYYY-MM-DD}
tags: [...]
status: active   # active | processed | unprocessed | archived
---
```

### `Long-Term/` 頁面（Projects／People／Orgs，Authority Control & Circulation Tracking）

Long-Term 頁面除一般欄位外，**必須**額外具備以下四個欄位，供 `memorb-ingest`／`memorb-query`／`memorb-lint` 讀寫：

```yaml
---
title: {實體名稱}
tags: [...]
status: active
aliases: []          # 別名/暱稱，供權威控制去重；memorb-lint 用來抓「有提到但沒被任何 aliases 涵蓋」的孤兒實體
orb_emotions: []     # 從 ingest 內容累積的情緒標籤：joy / anxiety / fear / sadness / anger / disgust
recall_count: 0      # 每次被 memorb-query 讀取命中就 +1
last_recalled: null  # 最近一次被查詢命中的 YYYY-MM-DD
---
```

歸檔時（由 `memorb-forgetter` 執行）額外加上：

```yaml
status: archived
archived_at: {YYYY-MM-DD}
```

若讀到的 Long-Term 頁面缺少上述任一欄位，視為舊資料，讀取當下就地補上預設值（`aliases: []`、`orb_emotions: []`、`recall_count: 0`、`last_recalled: null`），不需要另外開一輪修改流程。

### `memorbs/HQ/Core/` 與 `memorbs/HQ/Belief/` 的 orb 檔案

一 orb 一檔，frontmatter：

```yaml
---
title: {orb 標題}
formed_at: {YYYY-MM-DD}
orb_type: core         # core | belief
derived_from: []       # 僅 belief orb 使用：回連提煉出此信念的 Core orb，如 [[memorbs/HQ/Core/{slug}]]
---
```

`persona.md`／`identity.md` 不是 orb，維持一般 Markdown + 精簡 frontmatter（`title`/`updated`）即可，不套用上述 schema。`identity.md` 內容建議結構：

```markdown
## 基本資料
- 姓名：
- 生日：
- 學經歷：
  - {YYYY}–{YYYY} {職稱} @ {組織}
  - {YYYY} 畢業於 {學校}／{科系}

## 目前角色與目標


## 關鍵關係
- [[Long-Term/People/{Name}|{Name}]]（{關係}）
```

## Orb File Structure

Every memorb (Core, Belief, Long-Term entity page, or any named orb) follows one of two physical layouts:

| Type | Layout | When to use |
| :--- | :--- | :--- |
| **Plain orb** | `orb-name.md` — single file | No attachments; self-contained text |
| **Bundle orb** | `orb-name/orb-name.md` + attachment files in the same folder | Has attachments (images, PDFs, audio, etc.) |

**Rules:**
- The folder and the main Markdown file **always share the same name** — never use a generic filename like `memorb.md` inside a bundle folder.
- **Query resolution order**: look for `orb-name.md` first; if not found, look for `orb-name/orb-name.md`. All skills that read or move orbs must follow this two-step lookup.
- When archiving or moving a bundle orb, move the **entire `orb-name/` folder**, not just the inner `.md` file.

## 範本路徑

| 範本 | 路徑 |
| :--- | :--- |
| Daily Note | `Templates/Daily Note Template.md` |
| Meeting Note | `Templates/Meeting Note Template.md` |
| Project | `Templates/Project Template.md` |
| Island | `Templates/Island Template.md` |
| Resource | `Templates/Resource Template.md` |
| General Note | `Templates/Note Template.md` |

*(待固化：`memorbs/HQ/` 與 `Long-Term/` 頁面目前沒有固定範本檔，格式僅由上方 Frontmatter Schema 約束，由 `memorb-born`／`memorb-ingest` 直接生成；`Project` 範本也需要更新為含 Authority Control 欄位的版本。)*

## Vault 搜尋

```bash
grep -r "keyword" "$VAULT" --include="*.md" -l          # 找檔案
grep -r "keyword" "$VAULT" --include="*.md" -n -B 2 -A 2  # 帶上下文
```

## 快速新增 OrbTrack 筆記

```bash
DATE=$(date +%Y-%m-%d); TIME=$(date +%H%M)
cat > "$VAULT/memorbs/HQ/OrbTrack/${DATE}-${TIME}-Title.md" << EOF
---
title: Title
date: ${DATE}
tags: [orbtrack]
status: unprocessed
---

# Title

Content
EOF
```

## 新增待辦到 TASKS.md

在 `## 📋 待辦` 區塊下加一行 `- [ ] 任務描述`。
