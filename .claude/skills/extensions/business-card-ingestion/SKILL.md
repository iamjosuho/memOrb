---
name: business-card-ingestion
description: "Use when 使用者要求處理、新增名片，或上傳任何名片（business card）的截圖與照片檔時。"
---

#  名片處理 Skill (Business Card Ingestion)

## 工作流：處理名片 (全自動搬移流)

當使用者丟出一張名片圖片在 Obsidian 內（通常在 Inbox），並要求「處理名片」時，請嚴格執行以下步驟：

### 1. 資訊擷取
讀取該圖片，辨識以下資訊：
- 姓名（含英文名/暱稱）
- 公司名稱
- 職稱與部門
- 聯絡方式（Email, Phone, Line ID 等）

### 2. 組織判定
確認 `memorbs/organizations/{公司名稱}.md` 是否存在。若無，先依照 `memorbs/organizations` 相關規則（若有）建立該組織檔案。

### 3. 人物資料夾建立 (Page Bundle 模式)
因為該人物帶有實體附件（圖檔），為了保持目錄整潔，需建立專屬資料夾：
- **目標資料夾**：`memorbs/people/{公司名稱}/{姓名}/`
- **人物檔案**：`memorbs/people/{公司名稱}/{姓名}/{姓名}.md`

**重大注意事項 (Red Flag) 絕對不允許找藉口**：
你可能會讀到 `memorbs/people/CLAUDE.md` 說人物檔案必須放在 `memorbs/people/{公司暱稱}/{姓名}.md`。
**這是特例！請強行覆寫這個一般性規則！** 只要有「名片圖檔」等附件，就 **必須** 建立專屬的 `{姓名}/` 資料夾（Page Bundle 模式）。
- 直接把 .md 建在公司目錄下？**刪除重來。**
- 直接把圖片放在公司目錄下？**刪除重來。**

建立檔案時請參考 `Templates/People Template.md` 的結構，將辨識出的資訊填入。

### 4. 圖檔搬移與重新命名 (絕對要求)
使用終端機指令（如 `mv`），將原本的圖片檔案搬移到該人物資料夾下，**並且一定要改名**：

```bash
# 取得保險庫根目錄 (相容不同環境)
VAULT=$(find /sessions/*/mnt -maxdepth 1 -name "second-brain" -type d 2>/dev/null | head -1)
if [ -z "$VAULT" ]; then
  VAULT=$(pwd)
fi

TARGET_DIR="$VAULT/memorbs/people/{公司名稱}/{姓名}"
mkdir -p "$TARGET_DIR"

# 將使用者指定的原圖檔搬移並重新命名
# 假設原圖檔變數為 $ORIGIN_IMG_PATH，副檔名為 $EXT (如 png 或 jpg)
mv "$ORIGIN_IMG_PATH" "$TARGET_DIR/{姓名}_名片.$EXT"
```

 **防呆機制**：
- 保留原本如 `Pasted image.png` 的檔名？**重來，必須改名為 `{姓名}_名片.png`。**

完成搬移後，在 `{姓名}.md` 檔案的適當區塊（例如「基本資料」標題下方）插入圖片的 Wiki 連結：
`![[{姓名}_名片.png]]` （請替換為實際副檔名）

### 5. 結束紀錄
1. 確保相關的實體（人物、組織）都已建立或更新。
2. 在 `memorbs/log.md` 紀錄此事件。
3. 將對話重點摘要寫入當天的 Daily Note，並標註 `使用 skill：business-card-ingestion`。
4. 回報使用者操作完成。
