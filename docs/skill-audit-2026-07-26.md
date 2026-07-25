---
title: memOrb Skill Audit — 2026-07-26
status: active
---

# memOrb Skill 全面掃描報告（2026-07-26）

範圍：原始掃描當下 19 個 `SKILL.md`（`skills/core/` 12 個、`skills/extensions/` 6 個、gateway 1 個）、`plugin.json`、`scripts/lint-skills.js`、`scripts/reset-sandbox.sh`、`fixtures/`。**2026-07-26 依使用者指示刪除 `weekly-report` 後，目前為 18 個。**

## 0. 自動化檢查結果（最新一次：18 個 SKILL.md）

- `npm run lint`：**0 errors / 0 warnings**（frontmatter、plugin.json 註冊、fixtures 結構、殘留舊路徑四項檢查全過，含新增的 memorb-query 舊術語規則）。
- `plugin.json`：18 個 skill 全部存在且都已註冊，無孤兒、無缺漏。

## 1. 掃描時順手修好的 2 個小 bug

發現當下即修復，風險低、不需要討論：

| # | 問題 | 修法 |
| :-- | :--- | :--- |
| A | `scripts/reset-sandbox.sh` 只複製 `fixtures/memorbs/*` 到 `sandbox/`，`Long-Term/` 遷移後從沒同步更新，導致 `npm run reset-sandbox` 建出來的沙盒**沒有任何 Long-Term 樣本資料**（Alex.md、Orgs、Projects 全部消失），本地測試 memorb-query/lint/ingest 會拿到不完整的假資料。 | 補上 `cp -r fixtures/Long-Term/* sandbox/Long-Term/`，已測試確認 `sandbox/Long-Term/{Orgs,People,Projects}` 都正確生成。 |
| B | 上一輪把 `recording-transcription` 的 `memorbs/people/*/*.md`（兩層萬用字元）改成 `Long-Term/People/*.md`（我自己少改掉一層），單層 glob 抓不到 `business-card-ingestion` 建的巢狀 Page Bundle（`Long-Term/People/{公司}/{姓名}/{姓名}.md`），比修之前還更抓不到人物檔案。 | 改成 `find "$VAULT/Long-Term/People" -name "*.md"`（遞迴），並註明「不能只掃一層」。 |

## 2. P1 — 架構決策/內容需要對齊（建議優先處理）

| # | 狀態 | 問題 | 為什麼重要 | 涉及檔案 |
| :-- | :-- | :--- | :--- | :--- |
| 1 | ⏳ **列入 TODO，暫緩處理**（2026-07-26 使用者指示） | **People 頁面「扁平 vs 公司巢狀」沒有統一**：`business-card-ingestion` 建立 `Long-Term/People/{公司}/{姓名}/{姓名}.md`（公司資料夾巢狀），`memorb-domain-query` 的 Dataview 查詢也假設同一種巢狀（`contains(file.folder, "Long-Term/People/Acme")`）；但 `memorb-conventions` SSOT 明文說 Long-Term 實體頁「預設為單一頁面」，`recording-transcription`／`m365-meeting-note`／`memorb-ingest` 也都假設扁平 `Long-Term/People/{姓名}.md`。同一個人透過不同管道建檔，可能落在兩個不同路徑，造成重複頁、`memorb-lint` 抓不到孤兒、`memorb-query` 讀不到既有記錄。 | 需要你決定一個方向：(a) 全部改扁平，名片場景改用 body 連結指向組織而非資料夾巢狀；或 (b) 正式把「有附件才建資料夾、公司名只是資料夾裝飾」寫進 SSOT，並要求所有讀取端一律用遞迴讀取，不能假設扁平。已在 `memorb-conventions/SKILL.md` 加一條 `> **注意（待處理 TODO）**` 追蹤，之後個別討論 skill 時再處理。 | `memorb-conventions`、`business-card-ingestion`、`memorb-domain-query`、`recording-transcription`、`memorb-ingest` |
| 2 | ✅ **已修復**（2026-07-26） | `memorb-query` 的「Three-Layer Responsibility」與 Red Flags 原本寫「`memorbs/`: How this changed our understanding of people/projects/topics」——Long-Term/ 遷移前的舊說法。 | `memorb-query` 幾乎每次對話都會用到，是觸發頻率最高的 core skill 之一。已改為區分「`Long-Term/`（實體）／`memorbs/HQ/`（原則/術語）」，並在 `scripts/lint-skills.js` 的 `DEPRECATED_PATTERNS` 新增一條規則，往後若再寫回這種舊措辭會被 lint 自動抓出來（已用舊句子測過會觸發）。 | `skills/core/memorb-query/SKILL.md`、`scripts/lint-skills.js` |
| 3 | ⏳ 待處理 | SSOT（`memorb-conventions`）的資料夾樹完全沒提到 `memorbs/meeting-note/`，但 `memorb-ingest`、`m365-meeting-note`、`recording-transcription` 三個 skill 都實際寫入這個路徑當作正式存檔位置。「唯一標準」文件卻沒收錄一個三個 skill 都在用的路徑。 | 違反「Single Source of Truth」的自我定位；新寫 skill 的人看 SSOT 會漏掉這條慣例。 | `skills/core/memorb-conventions/SKILL.md` |
| 4 | ⏳ 待處理 | 同理，`memorbs/glossary.md`（`memorb-ingest`、`recording-transcription` 都會讀寫）也沒被 SSOT 收錄。 | 同上，SSOT 資料夾樹不完整。 | `skills/core/memorb-conventions/SKILL.md` |

## 3. P2 — 功能性小缺口

| # | 狀態 | 問題 | 建議 | 涉及檔案 |
| :-- | :-- | :--- | :--- | :--- |
| 5 | ✅ **已修復**（2026-07-26） | `orbtrack-triage` 的「特殊類型先路由」原本只列了名片圖檔與會議逐字稿，沒有任何一條路由到 `recording-transcription`，使用者把手機錄音檔丟進 OrbTrack 會被誤當一般筆記走 PARA 判斷。 | 已加一行「錄音檔（手機/錄音筆錄的 m4a/mp3/wav，非 Teams 來源）→ `recording-transcription`」，並順手把會議逐字稿那行也註明「M365 Teams 自動產生」以跟錄音檔互相區隔。 | `skills/core/orbtrack-triage/SKILL.md` |
| 6 | ⏳ 待處理 | `memorb-conventions` 的「範本路徑」表沒有 People／Org 範本這一列，但 `business-card-ingestion` 直接引用了 `Templates/People Template.md`——這個檔名沒有出現在唯一標準文件裡。文件本身已有「待固化」TODO，但沒具體點名缺哪幾列。 | 至少在表格補一行「People / Org（待固化）｜`Templates/People Template.md`（尚未存在，需與使用者一起定稿）」。 | `skills/core/memorb-conventions/SKILL.md` |
| 7 | ⏳ 待處理 | `memorb-born` 提到要 Generate/Update `CLAUDE.md` **和 `AGENT.md`**，但整個 skill 集只有這一處提到 `AGENT.md`，沒有任何其他 skill 讀寫或維護它，長期會跟 CLAUDE.md 不同步，形同死引用。 | 要嘛正式定位 `AGENT.md` 的用途並讓 `writing-memorb-skills` 註冊流程一併維護；要嘛先拿掉，等真的要支援別的 agent 框架時再補。 | `skills/core/memorb-born/SKILL.md`、`skills/core/writing-memorb-skills/SKILL.md` |
| 8 | ⏳ 待處理 | `CLAUDE.md` 的內容規格從沒被完整定義過，只有散落各處的片段線索。SSOT 文件明明說自己管「東西放哪裡、長什麼格式」，卻沒有 `CLAUDE.md` 該長什麼樣的段落。 | 在 `memorb-conventions` 補一個小節，定義 `CLAUDE.md` 的必要區塊（must-read 指令、Skills Registry 摘要、100 行上限）。 | `skills/core/memorb-conventions/SKILL.md` |

## 4. P3 — 風格與一致性小調整（不急，順手改即可）

| # | 狀態 | 觀察 | 建議 |
| :-- | :-- | :--- | :--- |
| 9 | ⏳ 待處理 | 語言不統一：`memorb-ingest`／`memorb-query`／`memorb-forgetter`／`memorb-born`／`session-closeout`／`daily-note`／`obsidian-cli`／`memorb-domain-query` 全英文；其餘偏中文為主。SSOT 的「語言：內文預設繁體中文」規則沒說清楚是只管 vault 筆記內容、還是也管 SKILL.md 本身。**使用者已表示接下來要逐一討論每個 skill，其中會包含把部分 skill 改成英文**，這條連動處理。 | 逐一討論時一併定案語言方向。 |
| 10 | ✅ **已處理（不再適用）** | 原本是「`weekly-report` 沒跟 `weekly-retro` 互相區隔」——`weekly-report` 是使用者個人用不到的 skill，已於 2026-07-26 應要求整支刪除（含 `skills/extensions/weekly-report/`、`plugin.json` 註冊、`skills/memorb/SKILL.md` 路由表列），問題連同 skill 一起消失。 | 無需再處理。 |
| 11 | ⏳ 待處理 | `session-closeout` 的 `git push` 是寫死的必要步驟，沒有「push 失敗（例如憑證不存在）怎麼辦」的退路——這次幫 memOrb 這個 repo 本身 commit 時就真的遇到 sandbox 沒有 GitHub 憑證、push 失敗的狀況。 | 加一條：push 失敗時明確告知使用者「已本地 commit，需要你手動 push」，不當作整個收尾流程失敗。 |
| 12 | ⏳ 待處理 | `skills/memorb/SKILL.md` 路由表對 `memorb-conventions` 的一句話描述只提到 `memorbs/`，沒提到 vault 根目錄的 `Long-Term/`／`Islands/` 也歸它管。 | 補一下這句話，涵蓋 Long-Term/Islands。 |
| 13 | ⏳ 待處理 | `scripts/reset-sandbox.sh` 目前是手動列出要複製哪些頂層 fixture 資料夾（這次才漏掉 `Long-Term/`，見上面 A 項）。 | 可以考慮改成 `cp -r fixtures/*/  sandbox/` 這種不用每次手動加新頂層資料夾的寫法。 |

## 5. 沒發現問題、可以放心的部分

- `plugin.json` 註冊：19/19 全對應，無孤兒無缺漏。
- Frontmatter：19 個 SKILL.md 全部只有 `name`/`description` 兩欄，符合 `writing-memorb-skills` 規範，長度也都通過 lint 的最短長度檢查。
- `memorb-lint`／`memorb-forgetter`／`island-reclamation`／`orbtrack-triage`（路由部分除外）／`daily-note`／`weekly-retro`：路徑與架構都已對齊 `Long-Term/` SSOT，內容邏輯沒發現矛盾。
- 上一輪新增的 `DEPRECATED_PATTERNS` 架構漂移守衛與 pre-commit hook 運作正常，這次全庫掃描 0 殘留舊路徑。
