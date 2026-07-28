---
name: business-card-ingestion
description: "Turn a business card image into a People entity page plus its Org page, with the scan filed as an attachment in the person's bundle. Use when the user asks to process or add a card, or drops a photo or screenshot of one into the vault. Triggers: business card, process a business card, add a contact from a card, card scan, 名片, 處理名片, 新增名片."
---

# Business Card Ingestion

## Workflow: process a card (capture, then move the file for real)

The user drops a card image somewhere in the vault — usually OrbTrack — and asks to have it processed. Work through these steps in order.

### 1. Extract the information

Read the image and pull out:

- Name (including any English name or nickname)
- Company name
- Job title and department
- Contact channels (email, phone, Line ID, and so on)

### 2. Resolve the organization first

Check whether `memorbs/Long-Term/Orgs/{PascalCompany}.md` already exists. If it does not, create it before you create the person, following the template at `memorbs/Templates/Org Template.md` and `memorb-conventions` — that means authority-control fields as well as ordinary ones: `aliases: ["{Company Name}"]`, `orb_emotions: []`, `recall_count: 0`, `last_recalled: null`.

The org comes first because the person page links to it. Creating the person first leaves a dangling link that `memorb-lint` will flag.

### 3. Create the person as a bundle orb

This person arrives with a physical attachment — the card image — so they get a dedicated Bundle folder under `memorbs/Long-Term/People/` (flat structure, no company nested folder):

- **Target folder**: `memorbs/Long-Term/People/{PascalName}/` (or `memorbs/Long-Term/People/{PascalName}-{PascalCompany}/` if disambiguation is required)
- **Person page**: `memorbs/Long-Term/People/{PascalName}/{PascalName}.md`

**Naming & Frontmatter Rules:**
- **No-Space PascalCase**: Filename and folder use `PascalCase` without spaces (e.g. `AlexChen`).
- **Disambiguation**: If another person with the exact same name exists at a different company, append `-PascalCompany` (e.g. `AlexChen-AcmeCorp`).
- **Aliases**: Frontmatter `aliases` must contain the original natural display name (e.g. `aliases: ["Alex Chen"]`).

Build the page using the schema from `memorbs/Templates/People Template.md` and `memorb-conventions`.

### 4. Move and rename the image (non-negotiable)

Use a shell command such as `mv` to relocate the original image into the person's folder, **and rename it while you do**:

```bash
VAULT=$(find . -maxdepth 4 -type d -name memorbs 2>/dev/null -exec dirname {} \; | head -1)

TARGET_DIR="$VAULT/memorbs/Long-Term/People/{PascalName}"
mkdir -p "$TARGET_DIR"

# Move and rename original card scan (e.g., AlexChen_card.png)
mv "$ORIGIN_IMG_PATH" "$TARGET_DIR/${PascalName}_card.$EXT"
```

**Guardrail:**

- Left the original name like `Pasted image.png` in place? **Start over — it has to become `{姓名}_名片.png`.**

Once the file has moved, embed it in `{姓名}.md` at the appropriate spot (for example under the basic-details heading) with a wiki link:
`![[{姓名}_名片.png]]` (substitute the real extension).

### 5. Close out

1. Confirm that every entity involved — the person and the organization — has been created or updated.
2. Append an entry at the top of `memorbs/log.md`: `## [YYYY-MM-DD] ingest | 名片：{姓名}（{組織}）`, listing the pages you touched. If the user said anything about their relationship with this person or their impression of them, put it in the signal line — that is the raw material `dream-studio` feeds on, and it lives nowhere else.
3. Report back to the user with the paths you created or changed.
