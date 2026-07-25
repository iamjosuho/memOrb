---
name: memorb-query
description: "Wiki Query workflow: read memory before answering questions about people, projects, or decisions, and backfill insights. Triggers: 使用者提問, 要求比較, 要求整理, 要求決策建議, 幫我分析."
---

# Memorb Query Skill

## Execution Sequence

1. **Read `memorbs/MEMORY.md` index first** to locate target pages, then read target files — **do not answer from memory**.
2. **Circulation Record & On-the-fly Migration**:
   - Upon successfully reading and using a target page, immediately update its frontmatter:
     - `last_recalled: YYYY-MM-DD`
     - `recall_count: <current + 1>`
   - **On-the-fly Migration**: If target page frontmatter lacks `aliases`, `orb_emotions`, `recall_count`, or `last_recalled`, automatically backfill missing keys with default values (`aliases: []`, `orb_emotions: []`, `recall_count: 1`, `last_recalled: YYYY-MM-DD`).
   - *Note*: Do NOT append circulation updates to `log.md` to prevent event-log noise.
3. **Cite sources** in response (file paths or log.md events).
4. **Backfill Rule**: If answer generates **enduring insights**, write them to the right layer — person/project/org traits or decisions → `Long-Term/{People,Projects,Orgs}/`; durable principles/beliefs → `memorbs/HQ/Belief/`; new terms → `memorbs/glossary.md`; cross-page links → whichever existing page they connect. Never leave enduring insights only in Daily Notes.
5. If insight belongs to no existing page → create new page and add to `MEMORY.md`.
6. Log key queries/decisions near top of `memorbs/log.md`:
   ```markdown
   ## [YYYY-MM-DD] decision | Title   (or query | Title)
   ```


## Three-Layer Responsibility

- Daily Notes: "What happened today"
- `Long-Term/` (people/projects/orgs) + `memorbs/HQ/` (Core/Belief/glossary): "How this changed our understanding"
- `log.md`: "When events/operations occurred"

## Red Flags

| Rationalization | Reality |
| :--- | :--- |
| *"I know the answer, no need to query memory"* | Answering from memory uses stale data. Always read index first. |
| *"Writing insight in Daily Note is enough"* | Enduring insights MUST be backfilled to `Long-Term/` (entities) or `memorbs/HQ/` (principles/terms) for future lookup. |
