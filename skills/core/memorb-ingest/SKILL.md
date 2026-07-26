---
name: memorb-ingest
description: "Wiki Ingest workflow: ingest raw content and update structured memory pages. Triggers: 讀這個, 整理這份逐字稿, 處理這篇文章, 幫我看這個 PDF, 這篇文章學到什麼. Prerequisite: memorb-conventions."
---

# Memorb Ingest Skill

> LLM Wiki Architecture: **raw (sources) → wiki (memorbs/ structured pages) → schema (CLAUDE.md)**.
> Ingest ensures consistency across all three layers when new raw material arrives.

## Orb Layout Decision (apply before any write)

When creating a **new** orb in `Long-Term/` or `memorbs/HQ/`:
- **Has attachments** (images, PDFs, audio, etc.) → create a **bundle orb**: `mkdir {base}/{name}/` then write `{base}/{name}/{name}.md`; place attachment files in the same folder.
- **No attachments** → create a **plain orb**: write `{base}/{name}.md` directly.

When **updating an existing** orb, resolve its path first (two-step lookup):
1. Check `{base}/{name}.md` — if found, it is a plain orb; update it.
2. If not found, check `{base}/{name}/{name}.md` — if found, it is a bundle orb; update the inner `.md` file.

## Execution Sequence (Strict Order)

1. **Preserve Raw Content**:
   - Meeting transcripts → `Resources/會議記錄/raw/`
   - Web articles → Keep original link or `.md` clipper file
2. **Create Summary Note**:
   - Meetings → `memorbs/meeting-note/` or `Resources/會議記錄/notes/`
   - Study materials → `Resources/`
3. **Scan Impact & Update** (Core value of Ingest):
   - `Long-Term/People/` — People mentioned
   - `Long-Term/Projects/` — Projects impacted
   - `Long-Term/Orgs/` — Companies/entities
   - `memorbs/glossary.md` — New terms
   - Use the **two-step lookup** above to locate existing pages before writing; apply the **orb layout decision** above when creating new ones.
   - No separate Context bucket — any environmental fact/domain rule worth keeping goes straight into whichever `Long-Term/People`／`Orgs`／`Projects` page it's actually about.
   - **Frontmatter Schema Enforcer**: Ensure target page frontmatter includes `aliases: []` (authority control) and `orb_emotions: []` (accumulated emotion tags like `joy`, `anxiety`, `fear`, `sadness`, `anger`, `disgust`).
   - **Update Trace Rules**:
     - **Fact Updates** (e.g. title changes, project status): Overwrite directly with latest state.
     - **Decision/Principle Updates** (tagged `#orb/anger`, `#orb/sadness`, etc.): Retain change history and context in the page body to preserve reasoning lineage.
   - **(Crucial) PARA Active Zones**: Extract actionable strategies/knowledge into corresponding active notes in `Islands/` or `Long-Term/Projects/`.
4. **Update Index**: `memorbs/MEMORY.md` (if new page added; keep index under 200 lines).
5. **Log Event**: Append near top of `memorbs/log.md`:
   ```markdown
   ## [YYYY-MM-DD] ingest | Title
   - Source: ...
   - Impacted Pages: ...
   ```
6. Write Daily Note summary block (see `session-closeout`).


## Red Flags

| Rationalization | Reality |
| :--- | :--- |
| *"Summary done, scan impact later"* | Step 3 is the core of Ingest. Skipping it invalidates the ingest. |
| *"Material affects only 1 page, skip log"* | `log.md` is the event stream. Every ingest requires a log entry. |
