---
name: memorb-ingest
description: "Wiki Ingest workflow: ingest raw content and update structured memory pages. Triggers: 讀這個, 整理這份逐字稿, 處理這篇文章, 幫我看這個 PDF, 這篇文章學到什麼. Prerequisite: memorb-conventions."
---

# Memorb Ingest Skill

> LLM Wiki Architecture: **raw (sources) → wiki (memorbs/ structured pages) → schema (CLAUDE.md)**.
> Ingest ensures consistency across all three layers when new raw material arrives.

## Orb Layout Decision (apply before any write)

When creating a **new** orb in `memorbs/Long-Term/` or `memorbs/HQ/`:
- **Has attachments** (images, PDFs, audio, etc.) → create a **bundle orb**: `mkdir {base}/{name}/` then write `{base}/{name}/{name}.md`; place attachment files in the same folder.
- **No attachments** → create a **plain orb**: write `{base}/{name}.md` directly.

When **updating an existing** orb, resolve its path first (two-step lookup):
1. Check `{base}/{name}.md` — if found, it is a plain orb; update it.
2. If not found, check `{base}/{name}/{name}.md` — if found, it is a bundle orb; update the inner `.md` file.

## Execution Sequence (Strict Order)

1. **Distill into an orb**:
   - The distilled orb lands in `memorbs/HQ/OrbTrack/` unless it clearly belongs to an existing entity page.
   - If there is no raw material to keep, it is a plain orb: `{name}.md`.
2. **Keep the raw material inside the orb's bundle** *(only when there is any)*:
   - Make the orb a bundle — `{name}/{name}.md` — and drop the transcript, clipping, or PDF alongside it in the same folder. Nothing goes to a shared attachment bucket and nothing is written outside `memorbs/`.
   - **Documents only** (`.md`, `.txt`, `.pdf`, document scans). Audio and video never enter the vault; record where they live in the orb body instead.
   - Web articles: keep the original URL in the orb's frontmatter/body; only bundle a clipping if one was actually captured.
3. **Scan Impact & Update** (Core value of Ingest):
   - `memorbs/Long-Term/People/` — People mentioned
   - `memorbs/Long-Term/Projects/` — Projects impacted
   - `memorbs/Long-Term/Orgs/` — Companies/entities
   - `memorbs/HQ/glossary.md` — New terms
   - Use the **two-step lookup** above to locate existing pages before writing; apply the **orb layout decision** above when creating new ones.
   - No separate Context bucket — any environmental fact/domain rule worth keeping goes straight into whichever `memorbs/Long-Term/People`／`Orgs`／`Projects` page it's actually about.
   - **Frontmatter Schema Enforcer**: Ensure target page frontmatter includes `aliases: []` (authority control) and `orb_emotions: []` (accumulated emotion tags like `joy`, `anxiety`, `fear`, `sadness`, `anger`, `disgust`).
   - **Update Trace Rules**:
     - **Fact Updates** (e.g. title changes, project status): Overwrite directly with latest state.
     - **Decision/Principle Updates** (tagged `#orb/anger`, `#orb/sadness`, etc.): Retain change history and context in the page body to preserve reasoning lineage.
   - **(Crucial) PARA Active Zones**: Extract actionable strategies/knowledge into corresponding active notes in `memorbs/Islands/` or `memorbs/Long-Term/Projects/`.
4. **Ensure Reachability**: every newly created page must be linked from at least one existing page. There is no index file — reachability is guaranteed by bi-directional links alone, and an unlinked page is an orphan.
5. **Log Event** *(mandatory — this is the timeline)*: Append near top of `memorbs/log.md`:
   ```markdown
   ## [YYYY-MM-DD] ingest | Title
   - 內容：...
   - 影響頁面：[[...]]、[[...]]
   - 訊號：{使用者的原話片段；情緒；未成形的疑慮}
   ```
   The **訊號 (signal)** line is what `dream-studio` replays. Record anything the user said that carried weight but was not structured enough to become an orb — in their own words, unpolished. Omit the line only when there genuinely was no such signal.
6. **Mandatory Triage Handoff (via Sub-agent)** *(mandatory — zero-leftover policy)*:
   - Immediately after logging the event, trigger or launch a sub-agent to execute `orbtrack-triage` over `memorbs/HQ/OrbTrack/`.
   - The sub-agent classifies and moves every newly distilled orb in `OrbTrack/` to its permanent PARA destination (`memorbs/Long-Term/{Projects,People,Orgs}/`, `memorbs/Islands/`, or `memorbs/Dump/`).
   - `memorb-ingest` is only complete when `memorbs/HQ/OrbTrack/` is verified 100% empty.


## Red Flags

| Rationalization | Reality |
| :--- | :--- |
| *"Summary done, scan impact later"* | Step 3 is the core of Ingest. Skipping it invalidates the ingest. |
| *"Material affects only 1 page, skip log"* | `log.md` is the event stream. Every ingest requires a log entry. |
| *"Orb left in OrbTrack is fine, next triage will catch it"* | Ingest is not complete until `OrbTrack` is triaged and empty via sub-agent handoff. |
