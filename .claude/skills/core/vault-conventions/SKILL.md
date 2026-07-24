---
name: vault-conventions
description: "Base layer conventions for Second Brain vault: path resolution, folder structure, naming rules, YAML frontmatter, templates, search. Required by all writing sub-skills. Triggers: 路徑, 資料夾, 命名, 模板, frontmatter, 搜尋保險庫."
---

# Vault Conventions (Base Layer)

> Defines **universal standards required for all write operations**. Workflows belong in sub-skills.

## VAULT Path Resolution

> Resolve dynamically as session path changes:
> ```bash
> VAULT=$(find /sessions/*/mnt -maxdepth 1 -name "second-brain" -type d 2>/dev/null | head -1)
> ```
> Folder name is `second-brain` (English), not "第二大腦".

## Folder Structure

```
second-brain/
├── Inbox/          ← Fast capture, pending triage (attachments in Inbox/Attachments/)
├── Projects/       ← Active projects with deadlines
├── Areas/          ← Ongoing responsibilities
├── Resources/      ← Reference/learning notes (raw meeting transcripts in Resources/會議記錄/raw/)
├── Archives/       ← Archived material
├── Daily Notes/    ← Daily notes at YYYY/MM/YYYY-MM-DD.md (nested!)
├── WeeklyRetro/    ← Weekly retros (YYYY-Www format)
├── Sessions/       ← Important session transcripts with Claude
├── Templates/      ← Note templates (read-only reference)
├── memorbs/         ← Wiki layer (MEMORY.md index, log.md event stream, people/ orgs/ projects/ context/)
└── TASKS.md        ← Task list
```

## Naming & Formatting Rules

1. **Date Formats**: Always `YYYY-MM-DD`; weekly format `YYYY-Www` (e.g. 2026-W28).
2. **Inbox Filename**: `{YYYY-MM-DD}-{HHMM}-{Title}.md`.
3. **Frontmatter**: Every note requires YAML frontmatter (`title`/`date`/`tags`/`status` depending on type).
4. **Language**: Traditional Chinese preferred for content.
5. **Emoji**: No emojis in non-structural headers; top-level folders have no emojis.
6. **Post-Action**: Provide file path to user after creating/updating notes.
7. **MOC Entry**: Area/Project entry note MUST be named `000-MOC.md`. Link using full path `[[Areas/{Name}/000-MOC|DisplayName]]` to prevent ambiguity.

## Template Paths

| Template | Path |
| :--- | :--- |
| Daily Note | `Templates/Daily Note Template.md` |
| Meeting Note | `Templates/Meeting Note Template.md` |
| Project | `Templates/Project Template.md` |
| Area | `Templates/Area Template.md` |
| Resource | `Templates/Resource Template.md` |
| General Note | `Templates/Note Template.md` |

## Vault Search

```bash
grep -r "keyword" "$VAULT" --include="*.md" -l          # Find files
grep -r "keyword" "$VAULT" --include="*.md" -n -B 2 -A 2  # With context
```

## Quick Inbox Note Creation

```bash
DATE=$(date +%Y-%m-%d); TIME=$(date +%H%M)
cat > "$VAULT/Inbox/${DATE}-${TIME}-Title.md" << EOF
---
title: Title
date: ${DATE}
tags: [inbox]
status: unprocessed
---

# Title

Content
EOF
```

## Adding Tasks to TASKS.md

Add `- [ ] Task description` under the `## 📋 待辦` section.
