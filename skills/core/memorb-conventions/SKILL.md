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

兩層並存，互不干涉：

1. **使用者原生筆記**（vault 根目錄，memOrb 完全不改動其既有結構）
2. **`memorbs/`**（memOrb 專屬命名空間，唯一會主動寫入/維護的地方）

```text
<你的 vault>/
├── Daily Notes/            ← 每日筆記，YYYY/MM/YYYY-MM-DD.md（巢狀，不可扁平）
├── Projects/               ← 有明確截止日/交付物的專案
├── Islands/                ← 需長期維持標準的責任領域/興趣（人格島，可持續被記憶造訪、經營）
├── Resources/              ← 參考資料、學習筆記（會議逐字稿原始檔在 Resources/會議記錄/raw/）
├── Archives/               ← 使用者自己不再需要的 Projects/Islands 筆記（與 memorbs/Dump 是不同的歸檔對象，見下）
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
    ├── Islands/
    │   ├── people/           ← 關鍵協作者
    │   ├── projects/         ← 專案里程碑軌跡
    │   ├── organizations/    ← 組織與團隊
    │   └── context/          ← 環境參數與領域規則
    ├── Dump/
    │   └── {category}/       ← MUSTY 淘汰後的歸檔頁（由 memorb-forgetter 搬入）
    ├── MEMORY.md             ← 全庫索引（≤200 行）
    └── log.md                ← 事件流（ingest / lint / archive / decision …）
```

> **注意**：`memorbs/HQ/OrbTrack/` 是唯一的收集區。不要另外建立 `Inbox/`——兩個收集區並存只會讓 triage 邏輯分裂。
> **注意**：歸檔統一寫作 `memorbs/Dump/{category}/`（單數 Dump）。`memorb-forgetter` 目前程式碼寫的是 `Dumps/`（複數），屬已知不一致，下一輪需修正對齊此處。
> **注意**：`memorb-ingest`／`memorb-query`／`memorb-lint` 目前的範例路徑仍寫作扁平的 `memorbs/{category}/`，未反映 `Islands/` 這層；本檔案以 `Islands/` 為準，其餘 skill 的路徑範例需要在下一輪同步修正。
> **注意**：`$VAULT/Islands/`（vault 根目錄）與 `memorbs/Islands/`（memOrb 命名空間內）是兩個不同路徑，但共用同一種「持續存在、需要被記憶造訪維持」的人格島意象——前者是使用者實際經營的長期領域/興趣筆記，後者是 memOrb 內部的人物/專案/組織/情境權威記錄。操作時務必用完整路徑區分兩者，不要混寫。
> **注意**：`persona.md`／`identity.md` 是固定的 Hot Cache 檔案（各一份，不會重複），`Core/`／`Belief/` 是裝 orb 的資料夾（一 orb 一檔，數量會持續增加）。四者角色不同，不要互相混用。

## Session 開頭必讀

每次 session 開始，必讀 `memorbs/HQ/persona.md` 與 `memorbs/HQ/identity.md`（兩者合計仍需 <100 行，維持 Hot Cache 的精簡）。`Core/`、`Belief/`、`Islands/` 底下的 orb／頁面一律交由 `memorb-query` 視情境查詢與回填，不必每次全讀。

## 命名與格式規則

1. **日期格式**：一律 `YYYY-MM-DD`；週格式 `YYYY-Www`（如 `2026-W28`）。
2. **OrbTrack 檔名**：`{YYYY-MM-DD}-{HHMM}-{Title}.md`。
3. **Frontmatter**：每篇筆記都要有 YAML frontmatter，欄位依筆記類型而定（見下方兩張表）。
4. **語言**：內文預設繁體中文。
5. **Emoji**：非結構性標題不加 emoji；頂層資料夾名稱不含 emoji。
6. **動作後回報**：建立/更新筆記後，回報檔案路徑給使用者。
7. **MOC 命名**：Island/Project 的入口筆記統一命名 `000-MOC.md`；跨資料夾引用一律用完整路徑 `[[Islands/{名稱}/000-MOC|{名稱}]]`，避免同名歧義。

## Frontmatter Schema

### 一般筆記（Daily Note / Project / Island / Resource）

```yaml
---
title: {標題}
date: {YYYY-MM-DD}
tags: [...]
status: active   # active | processed | unprocessed | archived
---
```

### `memorbs/Islands/` 頁面（Authority Control & Circulation Tracking）

Islands 頁面除一般欄位外，**必須**額外具備以下四個欄位，供 `memorb-ingest`／`memorb-query`／`memorb-lint` 讀寫：

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

若讀到的 Islands 頁面缺少上述任一欄位，視為舊資料，讀取當下就地補上預設值（`aliases: []`、`orb_emotions: []`、`recall_count: 0`、`last_recalled: null`），不需要另外開一輪修改流程。

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
- [[memorbs/Islands/people/{Name}|{Name}]]（{關係}）
```

## 範本路徑

| 範本 | 路徑 |
| :--- | :--- |
| Daily Note | `Templates/Daily Note Template.md` |
| Meeting Note | `Templates/Meeting Note Template.md` |
| Project | `Templates/Project Template.md` |
| Island | `Templates/Island Template.md` |
| Resource | `Templates/Resource Template.md` |
| General Note | `Templates/Note Template.md` |

*(待固化：`memorbs/HQ/` 與 `memorbs/Islands/` 頁面目前沒有固定範本檔，格式僅由上方 Frontmatter Schema 約束，由 `memorb-born`／`memorb-ingest` 直接生成。)*

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
