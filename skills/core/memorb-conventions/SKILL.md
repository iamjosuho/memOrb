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

**唯一的邊界規則：memOrb 可以讀你指給它看的任何東西；但只往 `memorbs/` 裡面寫。**

沒有例外，extension 也一樣。讀是安全的——不改變狀態、不會意外。寫才是怪異的來源：一旦某個 skill 寫成「`Resources/` 存在就寫進去」，同一個操作會因為使用者資料夾名字的巧合而有三種不同結果（有 `Resources/` 就寫、有 `3-Resources/` 就靜默跳過、沒有就什麼都不做）。這比「完全不碰」和「完全擁有」都糟。

所以 memOrb 在使用者的 vault 裡只長出**一個**資料夾：

```text
<你的 vault>/
├── 1-Projects/  Daily Notes/  Inbox/ …   ← 你自己的，memOrb 只讀不寫
│
└── memorbs/                    ← memOrb 的全部，砍掉就乾淨
    ├── HQ/
    │   ├── persona.md          ← AI 顧問人設：語氣、角色設定（每次 session 必讀）
    │   ├── identity.md         ← 使用者身分：姓名/生日/學經歷/角色/組織/目標/關鍵關係（每次 session 必讀）
    │   ├── Core/               ← Core Memory orbs，一 orb 一檔（有轉折意義的具體經驗）
    │   ├── Belief/             ← Belief orbs，一 orb 一檔（從經驗凝聚出的價值/信念聲明）
    │   └── OrbTrack/           ← 唯一的快速收集區，由 orbtrack-triage 清空
    ├── Islands/                ← 需長期維持標準的責任領域/興趣（人格島）：只放現況、長期目標、板塊筆記、MOC，不存放實體 orb，靠連結指向 Long-Term/
    ├── Long-Term/              ← 長期記憶倉庫，存放實際內容頁（一個實體只留一份頁面）
    │   ├── Projects/           ← 有明確截止日/交付物的專案（含歷程紀錄）
    │   ├── People/             ← 關鍵協作者（Authority Control 頁面，見下）
    │   └── Orgs/               ← 組織與團隊（Authority Control 頁面，見下）
    ├── Dump/{category}/        ← MUSTY 淘汰後的歸檔頁（由 memorb-forgetter 搬入）
    ├── log.md                  ← 當期時間軸（見下節）
    └── log/{YYYY-MM}.md        ← 已封存的往期時間軸（由 dream-studio 輪替）
```

> **沒有 `Resources/`。** PARA 的 R（長期感興趣的主題）在 memOrb 裡對應的是 **Island**——`island-reclamation` 對 Island 的定義本來就是「需要長期維持標準的責任領域**或興趣**」，已經把 Areas 和 Resources 一起吃下了。所以策展型的讀書筆記就是一顆 orb，掛在相關 Island 底下；原始素材則是 orb 的附件，見下方 Bundle 規則。

> **注意**：`memorbs/HQ/OrbTrack/` 是唯一的收集區。不要另外建立 `Inbox/`——兩個收集區並存只會讓 triage 邏輯分裂。
> **注意**：歸檔統一寫作 `memorbs/Dump/{category}/`（單數 Dump）。
> **注意**：`Long-Term/{People,Orgs,Projects}` 取代了原本的 `Islands/{people,organizations,projects}`——**實體頁不歸 Islands 管**，Islands 只有敘事層。原本歸在 `context/` 的環境規則不再獨立分類，直接寫進相關實體的 Long-Term 頁面本體。
> **注意（2026-07-26 遷移）**：`Islands/` 與 `Long-Term/` 原本在 vault 根目錄，已一併移入 `memorbs/`。memOrb 從此只在使用者 vault 裡長出一個資料夾。
> **注意（待處理 TODO，2026-07-26 稽核發現，暫緩不動）**：`memorbs/Long-Term/People/` 頁面結構目前不一致——`business-card-ingestion`／`memorb-domain-query` 假設「有名片附件時依公司名稱建巢狀資料夾」（`memorbs/Long-Term/People/{公司}/{姓名}/{姓名}.md`），本檔案定義的預設卻是單一頁面，`recording-transcription`／`m365-meeting-note`／`memorb-ingest` 也都假設扁平 `memorbs/Long-Term/People/{姓名}.md`。同一人可能因建檔管道不同落在兩個不同路徑。尚未決定要統一成哪個方向，先列入待辦，詳見 `docs/skill-audit-2026-07-26.md` P1 #1。
> **注意**：`persona.md`／`identity.md` 是固定的 Hot Cache 檔案（各一份，不會重複），`Core/`／`Belief/` 是裝 orb 的資料夾（一 orb 一檔，數量會持續增加）。四者角色不同，不要互相混用。
> **注意**：`daily-note`／`weekly-retro`／`session-closeout` 三個 skill 已於 2026-07-26 移除。日記層的職責由 `memorbs/log.md` 接手（見下節），週回顧屬任務管理不屬記憶框架，git 操作不屬本框架職責。
> **注意**：`memorbs/MEMORY.md` 全庫索引已於 2026-07-26 廢除。**檔案系統就是索引**——手動維護的索引一定會跟實際檔案漂移（舊版 lint 甚至得專門檢查「索引沒列到的孤兒頁」，那條規則本身就是漂移的證據），而且 ≤200 行的上限讓它本來就撐不到 vault 長大。查找一律直接 `ls` 目錄 + `grep` 內容與 `aliases`。頁面的可達性改由**雙向連結**保證：新頁至少要被一個既有頁面連到，沒有任何連結指向的頁面就是孤兒，由 `memorb-lint` 抓。

## `memorbs/log.md`：時間軸

log.md 是這套系統唯一的**時間記錄**。實體頁（`memorbs/Long-Term/`）是活的、持續累積，還原不出「六月發生了什麼」；OrbTrack 依定義會被清空；檔案 mtime 改個錯字就變動。所以「那陣子在發生什麼」只有 log.md 存得住，而 `dream-studio` 的重播完全靠它。

### 寫入規則

**每個會改變 vault 狀態的動作都要留一筆**，倒序 append 在檔案開頭（最新在最上面）：

```markdown
## [YYYY-MM-DD] {type} | {一句話標題}
- 內容：{發生了什麼}
- 影響頁面：[[...]]、[[...]]
- 訊號：{使用者的原話片段；情緒；未成形的疑慮}   ← 選填，但這是夢工廠的主食
```

`type` 取值：`ingest`｜`triage`｜`query`｜`decision`｜`lint`｜`archive`｜`island`｜`skill`｜`dream`

### 「訊號」欄位為什麼重要

`dream-studio` 找共振靠的不是系統做了什麼，是**使用者說了什麼、當時什麼感覺**。「今天跟 Vic 談完覺得怪怪的」不是一個想法、不夠格成為原子筆記，但三個月後它可能就是一條信念的來源。**這類還沒成形的訊號，記在這裡就好，不要為它硬開一個 orb。**

記錄訊號時用**使用者的原話**，不要改寫成更漂亮的句子。潤飾過的訊號在夢工廠回頭讀時會失真。

### 不該寫進 log.md

- `memorb-query` 的流通紀錄更新（`recall_count`／`last_recalled`）——量大且無資訊，會淹掉真正的訊號
- 純讀取、沒有改變任何檔案的操作

### 輪替

`dream-studio` 執行完畢後，把當期 `log.md` 封存為 `memorbs/log/{YYYY-MM}.md` 並清空 `log.md`，只留檔頭。這樣 log.md 永遠是「上次做夢至今」的份量，不會無限膨脹——就像電影裡當天的記憶球在夜裡被送進長期記憶區。往期檔案保留不刪，夢工廠要拉更長區間時可回頭讀。

## Session 開頭必讀

每次 session 開始，必讀 `memorbs/HQ/persona.md` 與 `memorbs/HQ/identity.md`（兩者合計仍需 <100 行，維持 Hot Cache 的精簡）。`Core/`、`Belief/` 底下的 orb，以及 `memorbs/Long-Term/` 底下的實體頁面，一律交由 `memorb-query` 視情境查詢與回填，不必每次全讀。

## 命名與格式規則

1. **日期格式**：一律 `YYYY-MM-DD`；週格式 `YYYY-Www`（如 `2026-W28`）。
2. **OrbTrack 檔名**：`{YYYY-MM-DD}-{HHMM}-{Title}.md`。
3. **Frontmatter**：每篇筆記都要有 YAML frontmatter，欄位依筆記類型而定（見下方兩張表）。
4. **語言**：內文預設繁體中文。
5. **Emoji**：非結構性標題不加 emoji；頂層資料夾名稱不含 emoji。
6. **動作後回報**：建立/更新筆記後，回報檔案路徑給使用者。
7. **MOC 命名**：Island 的入口筆記統一命名 `000-MOC.md`；跨資料夾引用一律用完整路徑 `[[memorbs/Islands/{名稱}/000-MOC|{名稱}]]`，避免同名歧義。`memorbs/Long-Term/` 底下的實體頁面（Projects／People／Orgs）預設為單一頁面，不強制要求 MOC。

## 實體是單數，事件帶日期

這是最容易搞錯的一條，錯了就會撞檔名或把不同時間的事混成一頁。

| | 實體頁 | 事件 orb |
|---|---|---|
| 是什麼 | 一個人、一間公司、一個專案 | 某天發生的一件事 |
| 位置 | `memorbs/Long-Term/{People,Orgs,Projects}/` | OrbTrack → 依內容歸位 |
| 數量 | **一個實體永遠只有一頁**（權威控制，別名收斂到這頁） | **一次一顆，不合併** |
| 命名 | `{實體名}.md`，不帶日期 | `{YYYY-MM-DD}-{標題}`，**日期是名字的一部分** |

**事件的日期前綴在 triage 之後要保留**，這是它跟實體頁最大的差別，也是同一件事重複發生時不會撞名的原因。

實例——今年投了 Acme 的職缺，明年又投一次同一個職位：

```text
memorbs/Long-Term/Orgs/Acme.md              ← 永遠只有這一份
   ├─ 連到 [[2026-07-26-Acme-資深PM-應徵]]
   └─ 連到 [[2027-03-11-Acme-資深PM-應徵]]

memorbs/…/2026-07-26-Acme-資深PM-應徵/
   ├── 2026-07-26-Acme-資深PM-應徵.md
   └── JD.pdf
memorbs/…/2027-03-11-Acme-資深PM-應徵/       ← 另一顆，不覆蓋
   ├── 2027-03-11-Acme-資深PM-應徵.md
   └── JD.pdf
```

副作用是好的：`Acme.md` 上自然累積出一條歷程，明年回頭想對照兩份 JD 差在哪時，實體頁就是入口。

**判斷法**：問「這件事會不會再發生第二次？」會 → 事件 orb，帶日期。不會、而且它是一個持續存在的東西 → 實體頁，不帶日期。

## Frontmatter Schema

### 一般筆記（OrbTrack / Island / 單篇 orb）

```yaml
---
title: {標題}
date: {YYYY-MM-DD}
tags: [...]
status: active   # active | processed | unprocessed | archived
---
```

## 原始素材：進 bundle，不另設資料夾

逐字稿、剪報、PDF、名片掃描這類**原始素材是 orb 的附件**，不是獨立的一類東西。它們放在 orb 自己的 bundle 資料夾裡：

```text
memorbs/HQ/OrbTrack/2026-07-12-1400-與Vic面談/
├── 2026-07-12-1400-與Vic面談.md    ← orb 本體
└── 逐字稿.md                         ← 附件，跟 orb 同生共死
```

這樣生命週期自動正確：`memorb-forgetter` 歸檔 bundle orb 時本來就是整個資料夾一起搬，附件跟著走，不需要 `source:` 欄位、不需要孤兒偵測、也不需要一個共用的附件桶。

**只有文件檔進 vault**：`.md`、`.txt`、`.pdf`，以及作為文件掃描的圖片（名片、白板照）。**音訊與影片一律不進**——體積會拖垮 vault 與 git。錄音留在 vault 外，orb 內文記下它的位置與取得方式即可。

> 這條取代了三套並存的舊做法：`Resources/…/raw/`、`OrbTrack/Attachments/`、以及短暫存在過的 `source:` 欄位。全部統一到 bundle。

### `memorbs/Long-Term/` 頁面（Projects／People／Orgs，Authority Control & Circulation Tracking）

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
derived_from: []       # 僅 belief orb 使用：回連凝聚出此信念的來源 orb
---
```

**`derived_from` 可指向任何 orb**，不限 Core：`[[memorbs/HQ/Core/{slug}]]`、`[[memorbs/Long-Term/Projects/{slug}]]`、`[[memorbs/Long-Term/People/{slug}]]` 都合法。信念多半是由一堆單獨看都不夠格當 Core Memory 的小事累積而成，限定只能連 Core 會把這條路堵死。Core orb 不使用此欄位（保持 `[]` 或省略）。

`persona.md`／`identity.md` 不是 orb，維持一般 Markdown + 精簡 frontmatter（`title`/`updated`）即可，不套用上述 schema。`identity.md` 內容建議結構：

```markdown
## 基本資料
- 姓名：
- 生日：
- 學經歷：
  - {YYYY}–{YYYY} {職稱} @ {組織}
  - {YYYY} 畢業於 {學校}／{科系}

## 自我描述標籤
- MBTI：
- 其他量表／標籤：

## 目前角色與目標


## 關鍵關係
- [[memorbs/Long-Term/People/{Name}|{Name}]]（{關係}）
```

> **MBTI 這類標籤放 `identity.md`，不要放 `Belief/`。** Belief orb 是「從自己經驗提煉出的一句話」，MBTI 是外部量表貼上的分類，兩者性質相反。混放會讓 `dream-studio` 在評估信念演變時把外部標籤誤當成自我提煉的結果。

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

`Templates/` 是使用者原生資料夾，**不存在就跳過、直接依 Frontmatter Schema 生成**，不要建立這個資料夾。

| 範本 | 路徑 |
| :--- | :--- |
| Meeting Note | `Templates/Meeting Note Template.md` |
| Project | `Templates/Project Template.md` |
| Island | `Templates/Island Template.md` |
| Resource | `Templates/Resource Template.md` |
| General Note | `Templates/Note Template.md` |

*(待固化：`memorbs/HQ/` 與 `memorbs/Long-Term/` 頁面目前沒有固定範本檔，格式僅由上方 Frontmatter Schema 約束，由 `memorb-born`／`memorb-ingest` 直接生成；`Project` 範本也需要更新為含 Authority Control 欄位的版本。)*

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
