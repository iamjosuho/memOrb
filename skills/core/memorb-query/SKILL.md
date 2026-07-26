---
name: memorb-query
description: "Wiki Query workflow: read memory before answering questions about people, projects, or decisions, and backfill insights. Triggers: 使用者提問, 要求比較, 要求整理, 要求決策建議, 幫我分析."
---

# Memorb Query Skill

## Orb Resolution (Two-Step Lookup)

Before reading any named orb, resolve its physical path:
1. Check `{base}/{name}.md` — if found, use it (plain orb).
2. If not found, check `{base}/{name}/{name}.md` — if found, use it (bundle orb; attachments are sibling files in `{base}/{name}/`).
3. If neither exists, the orb is missing — do not hallucinate content.

Apply this lookup to every target in `Long-Term/People/`, `Long-Term/Projects/`, `Long-Term/Orgs/`, `memorbs/HQ/Core/`, and `memorbs/HQ/Belief/`.

## Execution Sequence

1. **List the relevant directories first** to locate target pages, then resolve each target path using the two-step lookup above — **do not answer from memory**. The filesystem is the index; there is no separate index file to consult, and none to keep in sync.
   ```bash
   ls "$VAULT/Long-Term/People" "$VAULT/Long-Term/Projects" "$VAULT/Long-Term/Orgs"
   grep -ril "{term}" "$VAULT/Long-Term" "$VAULT/memorbs/HQ"   # also matches aliases in frontmatter
   ```
2. **Circulation Record & On-the-fly Migration**:
   - Upon successfully reading and using a target page, immediately update its frontmatter:
     - `last_recalled: YYYY-MM-DD`
     - `recall_count: <current + 1>`
   - **On-the-fly Migration**: If target page frontmatter lacks `aliases`, `orb_emotions`, `recall_count`, or `last_recalled`, automatically backfill missing keys with default values (`aliases: []`, `orb_emotions: []`, `recall_count: 1`, `last_recalled: YYYY-MM-DD`).
   - *Note*: Do NOT append circulation updates to `log.md` to prevent event-log noise.
3. **Cite sources** in response (file paths or log.md events).
4. **Backfill Rule**: If answer generates **enduring insights**, write them to the right layer — person/project/org traits or decisions → `Long-Term/{People,Projects,Orgs}/`; durable principles/beliefs → `memorbs/HQ/Belief/`; new terms → `memorbs/glossary.md`; cross-page links → whichever existing page they connect. Never leave enduring insights only in `log.md` — it gets rotated out.
   - **Never create Core orbs here.** `memorbs/HQ/Core/` is written only by `dream-studio`, after explicit user confirmation. If a query surfaces something that looks formative, note it and suggest running `dream-studio` — do not file it yourself.
5. If insight belongs to no existing page → create the new page, and link it from at least one existing page so it is reachable. An unlinked page is an orphan and `memorb-lint` will flag it.
6. Log key queries/decisions near top of `memorbs/log.md`:
   ```markdown
   ## [YYYY-MM-DD] decision | Title   (or query | Title)
   ```


## Three-Layer Responsibility

- `memorbs/log.md` (+ archived `memorbs/log/{YYYY-MM}.md`): **"What was happening, and when"** — the timeline. The only layer that can reconstruct a period.
- `Long-Term/` (people/projects/orgs) + `memorbs/HQ/` (Core/Belief/glossary): "How this changed our understanding" — living entity pages, no per-event dates.
- `memorbs/HQ/OrbTrack/`: "Not yet filed" — transient; emptied by triage.

## Red Flags

| Rationalization | Reality |
| :--- | :--- |
| *"I know the answer, no need to query memory"* | Answering from memory uses stale data. Always read index first. |
| *"Leaving the insight in the log entry is enough"* | `log.md` is the timeline, not the knowledge base — and it gets rotated out by `dream-studio`. Enduring insights MUST be backfilled to `Long-Term/` (entities) or `memorbs/HQ/` (principles/terms). |
