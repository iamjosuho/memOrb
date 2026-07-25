---
name: memorb-forgetter
description: "Memory Archive Executor (Mind Workers Forgetter): Archive outdated or MUSTY-flagged Long-Term/ or memorbs/ pages to memorbs/Dump/ after user confirmation, and update vault Wiki Links. Triggered by memorb-lint report or user archive requests."
---

# Memorb Forgetter Skill

> **Purpose**: Decoupled archiving executor. Executes physical file relocation of `Long-Term/` and `memorbs/` pages flagged by `memorb-lint` under the MUSTY criteria, ensuring link integrity across the vault.

## Execution Sequence

1. **Verify Target & User Confirmation**:
   - Confirm target file in `Long-Term/` (or `memorbs/HQ/Core`／`Belief`) and verify explicit user approval.
2. **Move File**:
   - Move page from `Long-Term/{category}/{name}.md` to `memorbs/Dump/{category}/{name}.md`.
   - Update target page frontmatter: set `status: archived` and add `archived_at: YYYY-MM-DD`.
3. **Rewrite Vault Wiki Links**:
   - Search the vault for all references to `[[{name}]]` or `[[Long-Term/{category}/{name}]]`.
   - Rewrite references to point to `[[memorbs/Dump/{category}/{name}|{name}]]` so historical context is preserved without breaking links.
4. **Update Index**:
   - Remove page from `memorbs/MEMORY.md` if present.
5. **Log Archive Event**:
   - Append to `memorbs/log.md`:
     ```markdown
     ## [YYYY-MM-DD] archive | {name}
     - Original Path: Long-Term/{category}/{name}.md
     - Reason: MUSTY criteria ({M/U/S/T/Y})
     ```
