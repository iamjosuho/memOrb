---
name: recording-transcription
description: "手動提供的會議/面談錄音檔（手機錄音、m4a/mp3/wav，非 Teams 來源）轉逐字稿處理助理。負責探測本地 Whisper 是否可用、音檔正規化與長檔切段、背景轉錄＋進度輪詢、簡轉繁，並與使用者提供的 iPhone 內建語音轉文字草稿比對校正人名/術語，產出可靠逐字稿與面談分析後交給 memorb-ingest。只要提到錄音、逐字稿、轉錄、面談、語音轉文字、STT、m4a，且來源不是 Teams 會議，就該用這個 skill。前置依賴：memorb-conventions；下游接 memorb-ingest。"
---

# 🎙️ recording-transcription Skill

## 適用情境 vs m365-meeting-note

- 錄音來源是**使用者手動提供的檔案**（手機/錄音筆/現場錄音）→ 本 skill
- 逐字稿已由 M365 Teams 自動產生（有 `meetingTranscriptUrl`）→ 改用 `m365-meeting-note`
- 兩者最終都交給 `memorb-ingest` 做影響面掃描

## 核心前提

> 手機錄音是「單一收音來源」問題的另一版本：離手機近的人聲音清楚，遠的人可能模糊或被蓋過。**不能假設清楚的那段一定是使用者自己說的**，要從內容脈絡（提問→回答、稱謂、話題歸屬）判斷講者，跟 `m365-meeting-note` 的原則相通。

> ⚠️ 跟主管/老闆的一對一面談，逐字稿的**用詞準確度與時間戳記**比一般會議更重要——涉及承諾、數字、日期的段落，寧可標記「不確定」也不要讓 AI 腦補通順。這條規則不限於特定對象，任何一對一面談都適用。

## ⚠️ 已知環境限制（2026-07-12 實測，務必先看過再動手）

- 這個 sandbox 的網路白名單只開放 `pypi.org`／`github.com` 這類套件生態系網域，**不含 `huggingface.co`**。`pip install faster-whisper` 沒問題，但它執行時預設要連去 HF 抓模型權重，這裡一定連線失敗。`check` 指令會先偵測到這件事，不用等背景任務跑到一半才發現。
- **任何掛載到真實電腦的資料夾都只能新增/覆寫，不能刪除**——不只保險庫，連 `outputs` 暫存資料夾也一樣，bash 對已寫入的檔案 `rm` 一律 `Operation not permitted`（Write/Edit 工具也有同樣限制）。真正能自由建立、刪除的只有 sandbox 自己的路徑（例如 `/tmp`）。任何「處理完就該清掉」的中繼檔案，只能放 `/tmp`，不能放保險庫或 outputs，否則會變成永久清不掉的垃圾。保險庫裡只放本來就該永久保留的東西：逐字稿、分析、（經確認要留底的）原始音檔。
- 這兩點合起來決定了下面的路徑安排：**中繼工作檔一律寫在 `/tmp`，只有最終逐字稿/分析/音檔才寫進保險庫。**

## 標準處理流程

### Step 0：收集輸入

- 音檔：mp3/m4a/wav/mp4 皆可，可一次給多個檔案（例如中途暫停又重錄，依提供順序串接）
- **強烈建議附上手機/裝置內建語音轉文字草稿**（iPhone 備忘錄逐字稿、即時聽寫等）。在目前這個 sandbox 環境下，這份草稿常常是唯一能穩定取得的逐字稿來源（見上方環境限制），不是可有可無的加分項
- 使用者提供或由內容推斷：與會者是誰、大致日期、面談主題

### Step 1：探測本地 Whisper 是否可用

```bash
VAULT="$(find /sessions/*/mnt -maxdepth 1 -name "second-brain" -type d | head -1)"
SCRIPT="$VAULT/.claude/skills/recording-transcription/scripts/transcribe.py"
python3 "$SCRIPT" check --model medium
```

- 回報「本機已有模型」或「連得到 HF，可嘗試下載」→ 走 Step 2A（本地轉錄）
- 回報「連不到 HF 且沒有本機模型」→ 跳過 Step 2A，直接走 Step 2B（純草稿路徑），不要浪費時間跑背景任務等到失敗才發現

### Step 2A：本地 Whisper 轉錄（環境允許時）

環境需求（第一次用先確認）：
```bash
which ffmpeg >/dev/null || echo "需要安裝 ffmpeg"
python3 -c "import faster_whisper" 2>/dev/null || pip install faster-whisper --break-system-packages
python3 -c "import opencc" 2>/dev/null || pip install opencc-python-reimplemented --break-system-packages
python3 -c "import socksio" 2>/dev/null || pip install "httpx[socks]" --break-system-packages
```

工作目錄放在 `/tmp`，**不要**放進保險庫或 outputs：

```bash
SLUG="2026-07-12-與Vic面談"   # 依實際日期/主題調整
WORKDIR="/tmp/recording-$SLUG"
python3 "$SCRIPT" prepare --input /path/to/audio1.m4a --workdir "$WORKDIR" --chunk-minutes 10
```

固定長度切段（預設 10 分鐘一段），短檔案也會變成「1 段」——邏輯統一，不用另外判斷長短。

```bash
nohup python3 "$SCRIPT" run --workdir "$WORKDIR" --model medium --lang zh > "$WORKDIR/run.log" 2>&1 &
disown
```

單次指令執行有時間上限（約 45 秒），一律背景執行，分次用下面指令輪詢進度，直到完成：

```bash
python3 "$SCRIPT" status --workdir "$WORKDIR"
```

> 這個 workdir 在 `/tmp`，**只在這次對話/session 內有效**——如果背景任務跑到一半使用者就結束對話，進度會遺失，下次要重新開始。錄音很長的話，處理前先讓使用者知道大概要等多久，讓他決定要不要留著視窗等。模型選擇：`medium` 是準確度/速度的預設平衡點；趕時間用 `small`，要求更高用 `large-v3`（更慢）。純 CPU（無 GPU），速度大致與錄音時長相當或更慢。

全部完成後合併，**`--out` 直接指向保險庫路徑**——這是最終產出，不是中繼檔：

```bash
python3 "$SCRIPT" merge --workdir "$WORKDIR" --out "$VAULT/Resources/會議記錄/raw/2026-07-12-與Vic面談.md"
```

會用 OpenCC（`s2twp`）把 Whisper 預設輸出的簡體字轉成台灣繁體——這一步不能省。處理完 `WORKDIR` 已經沒用了，`/tmp` 可以自由刪除（跟保險庫/outputs 不同）：

```bash
rm -rf "$WORKDIR"
```

### Step 2B：純裝置草稿路徑（HF 連不到，或使用者沒給音檔時的預設路徑）

不需要 ffmpeg/whisper，直接把 Step 0 使用者貼的草稿文字讀進來，當作逐字稿基礎，交給 Step 3 校正、補標點分段。**這是目前這個 sandbox 下最常會走到的路徑，不是退而求其次的將就方案。**

### Step 3：校正人名/術語（必須派遣 Subagent 處理）

> ⚠️ **Context Window 保護機制**：逐字稿通常動輒數萬字，**禁止主 Agent 直接讀取整份逐字稿**。你必須使用 `invoke_subagent` 工具派遣一個子代理（如 `research` 或 `self`），將以下 Step 3 與 Step 4 的任務交辦給它，讓子代理去閱讀、校正並總結出面談分析後回報。

1. 動態讀取 `memorbs/glossary.md` 與 `Long-Term/People/*.md`（含子資料夾 Page Bundle）取得目前已知的人名、暱稱、專案代號、術語——不要用寫死的字典，這份清單會一直變
2. 可以向使用者確認錄音中有誰
3. 若 Step 2A 與 Step 2B 兩份資料都有（本地 Whisper 輸出＋手機草稿），互相對照：Whisper 對語流/標點通常較穩，手機內建版對「使用者手機通訊錄/字典裡已有的專有名詞」有時反而更準，尤其是人名。兩邊對不上的地方，才是真正需要人工確認的地方
4. 只有一份資料時（通常是純草稿路徑），對照 glossary/people 修正明顯誤轉（例如 eBao→「e 包／醫保」、Halu→「哈魯」之類的同音錯字），修正**另存清稿版本**，保留原始草稿不覆蓋
5. 無法判斷的地方用 `[不確定]` 標記，不要猜一個聽起來合理的詞去填空——尤其是承諾、數字、日期相關的句子

### Step 4：面談分析框架

一對一面談跟會議不同，不套用 `m365-meeting-note` 的「使用者表現分析」（那是設計給使用者主持會議用的）。改用這個角度：

| 面向 | 重點 |
|------|------|
| 承諾與待追蹤事項 | 對方說了哪些具體承諾？有沒有數字、日期、條件？——這類段落優先確保準確，見 Step 3 |
| 決策 | 這次面談拍板了什麼、還懸而未決的是什麼 |
| 對使用者的回饋/期待 | 對方對使用者的表現、方向有什麼明確或暗示性的評語 |
| 待釐清問題 | 逐字稿裡模糊、需要下次面談或訊息追問清楚的地方 |
| 與既有 memory 的呼應 | 對照 `Long-Term/People/` 裡對方的既有記錄，這次談話是印證、還是推翻了先前的理解 |

輸出分析前，先讀一次對方在 `Long-Term/People/` 的既有頁面，確保分析銜接既有脈絡，而不是每次從零開始。

### Step 5：存檔與交接 memorb-ingest

| 內容 | 路徑 |
|------|------|
| 原始音檔（經確認要留底才寫） | `Resources/會議記錄/raw/audio/{YYYY-MM-DD}-{標題}.{ext}`（**.gitignore 排除，不進 git**；寫入後無法刪除，先問使用者要不要留） |
| 逐字稿（raw，未修正） | `Resources/會議記錄/raw/{YYYY-MM-DD}-{標題}.md` |
| 逐字稿（清稿＋面談分析） | `memorbs/meeting-note/{YYYY-MM-DD} 與{對象}面談.md` |

完成後交給 `memorb-ingest` 走完整流程（掃描影響 `Long-Term/People`、`Long-Term/Projects`、`log.md`、`MEMORY.md` 索引、PARA 活躍區）。本 skill 只負責「錄音→可靠逐字稿＋初步分析」，不重複做 memorb-ingest 的事。

## 注意事項

- 逐字稿字數龐大，**禁止主 Agent 直接讀取全檔**，必須外包給 Subagent 處理 Step 3 與 Step 4。
- 國語＋英文術語混雜（eBao、Sprint 等）Whisper 大致能處理；錄音中若有台語內容，準確度會明顯下降，需要人工複查
- 錄音可能包含敏感內容（人事、財務、承諾）：只有逐字稿文字進 git，原始音檔一律 gitignore
- **保險庫檔案寫入後無法刪除**，原始音檔這類「不一定要留」的東西，下筆前先跟使用者確認一次，不要先斬後奏
- 多檔案輸入時順序很重要，`--input` 依對話實際先後順序給

## Red Flags

| 藉口 | 真實情況 |
|------|---------|
| 「這個 sandbox 應該連得到 HF 吧，直接跑」 | 已知連不到，先跑 `check` 確認，別等背景任務失敗才發現 |
| 「音檔不大，直接前景跑就好」 | 單次指令約 45 秒上限，一律背景執行 |
| 「中繼檔案放保險庫或 outputs 方便下次接著做」 | 這兩個都是掛載到真實電腦的資料夾，寫入後刪不掉；中繼檔案只能放 `/tmp`，用完即丟 |
| 「聽起來大概是這樣，直接補上」 | 承諾/數字/日期類段落寧可標「不確定」，不要腦補 |
| 「逐字稿存好就好，分析下次做」 | Step 4 面談分析是本 skill 的核心價值，不是附加項 |
| 「原始音檔先存進保險庫再說」 | 保險庫寫入後刪不掉，音檔通常又很大，先問使用者要不要留底再寫 |
