---
name: memorb-forgetter
description: "Memory Archive Executor (Mind Workers Forgetter): Archive outdated or MUSTY-flagged Long-Term/ or memorbs/ pages to memorbs/Dump/ after user confirmation, and update vault Wiki Links. Triggered by memorb-lint report or user archive requests."
---

# Memorb Forgetter Skill

> **Purpose**: Decoupled archiving executor. Executes physical file relocation of `Long-Term/` and `memorbs/` pages flagged by `memorb-lint` under the MUSTY criteria, ensuring link integrity across the vault.

## Execution Sequence

1. **Verify Target & User Confirmation**:
   - Confirm target orb in `Long-Term/` (or `memorbs/HQ/Core`／`Belief`) and verify explicit user approval.
2. **Detect Orb Layout**:
   - **Plain orb**: `{base}/{category}/{name}.md` exists as a single file.
   - **Bundle orb**: `{base}/{category}/{name}/` is a folder containing `{name}.md` (and attachment files).
   - Use this two-step check to determine which applies before moving anything.
3. **Move Orb**:
   - *Plain orb*: `mv {base}/{category}/{name}.md memorbs/Dump/{category}/{name}.md`
   - *Bundle orb*: `mv {base}/{category}/{name}/ memorbs/Dump/{category}/{name}/` (move the entire folder)
   - Update the target page's frontmatter (`memorbs/Dump/{category}/{name}.md` or `memorbs/Dump/{category}/{name}/{name}.md`): set `status: archived` and add `archived_at: YYYY-MM-DD`.
4. **Rewrite Vault Wiki Links**:
   - Search the vault for all references to any of these patterns: `[[{name}]]`, `[[Long-Term/{category}/{name}]]`, `[[Long-Term/{category}/{name}/{name}]]`.
   - Rewrite all matches to `[[memorbs/Dump/{category}/{name}|{name}]]` so historical context is preserved without breaking links.
5. **Retire the raw source** *(if any)*:
   - If the orb's frontmatter carries `source:` pointing into `Resources/`, the raw material shares the orb's lifecycle. Ask the user whether to archive it alongside; on approval move it to `memorbs/Dump/{category}/` next to the orb and keep the `source:` link pointing at the new location.
   - Never delete raw material outright, and never move it without asking — it may be referenced by other orbs.
6. **Log Archive Event**:
   - Append to `memorbs/log.md`:
     ```markdown
     ## [YYYY-MM-DD] archive | {name}
     - Original Path: {base}/{category}/{name}.md  (or {name}/ for bundle)
     - Layout: plain | bundle
     - Reason: MUSTY criteria ({M/U/S/T/Y})
     ```
