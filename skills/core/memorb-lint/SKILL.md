---
name: memorb-lint
description: "Wiki Lint workflow: a health check over the memory vault that surfaces contradictions, stale pages, orphans, missing pages, and missing links. Offer to run it before dream-studio. Triggers: tidy up memory, check the second brain, health check, does memory need updating, 整理 memory, 檢查第二大腦, 健檢, memory 有沒有要更新的."
---

# Memorb Lint Skill

## Bundle Orb Awareness

When scanning directories under `memorbs/Long-Term/` or `memorbs/HQ/Core/`, `memorbs/HQ/Belief/`:
- A **folder** whose name matches an existing `{name}/{name}.md` is a **valid bundle orb** — treat the inner `.md` as the orb page. Do not flag the folder as an orphan or structural error.
- A **folder** that contains no same-name `.md` file (e.g. `memorbs/Long-Term/People/Acme/` with no `Acme.md` inside) is a **genuine orphan** — flag it for review.
- A **plain `.md` file** at `{base}/{name}.md` is a plain orb — check normally.

Apply this check whenever scanning for orphan pages, broken links, or unregistered entries.

## Order of operations

1. List every file under `memorbs/Long-Term/`, `memorbs/HQ/Core`, and `memorbs/HQ/Belief`, then pick 3-5 pages at random and read them closely
2. Go down the checklist below, judging each item against the **MUSTY retirement criteria**:

| Check | MUSTY letter | What it means |
|--------|-----------|------|
| Contradictory / misleading | **M** - Misleading | Two pages tell different stories about the same person or project, or a page contradicts the latest facts in log.md |
| Broken / malformed | **U** - Ugly | Formatting has fallen apart, links are all dead, or the page is an orphan (nothing anywhere in the vault points a `[[link]]` at it) |
| Superseded / finished | **S** - Superseded | The entity behind the whole page is gone (project shipped and closed, person left with no further contact) ➔ **report it and hand it to `memorb-forgetter` to archive** |
| Too little value / cold memory | **T** - Trivial | `recall_count` is very low (say <2) and `last_recalled` is very old ➔ **report it and hand it to `memorb-forgetter` to archive** |
| Stranded attachment | **U** - Ugly | A bundle folder holds attachments but no same-named `{name}.md` body ➔ the attachments have lost the orb they belonged to; report for handling |
| Media file in the vault | **Y** - Your collection doesn't need | Audio or video has appeared under `memorbs/` (`.m4a` / `.mp3` / `.wav` / `.mp4` …) ➔ only documents belong in the vault; report it, move it out, and record its location in the orb body |
| Out of scope | **Y** - Your collection doesn't need | The content is not something the memory vault is here to hold; report it for a human decision |
| Unregistered alias (Authority) | authority control | An entity term shows up in `log.md` but appears in no page's `aliases` list ➔ report it as a potential split note |
| Missing page / missing cross-link | structural integrity | Mentioned repeatedly in log.md but has no page of its own, or a `memorbs/Long-Term/People/` page is not linked to its `memorbs/Long-Term/Projects/` page |
| Broken timeline | structural integrity | `log.md` has several consecutive blank days, or entries are generally missing the signal line ➔ tell the user, because dream-studio will have nothing to replay |

3. **Bring the user a list of proposals to confirm**:
   - Page fixes and expansions ➔ lint repairs them directly.
   - Page retirement and archiving ➔ get the user's confirmation, then call `memorb-forgetter` to perform the move into `memorbs/Dump/` and rewrite the wiki links automatically.
4. Once the fixes are in, append to `memorbs/log.md`:
   ```markdown
   ## [YYYY-MM-DD] lint | 範圍 — 修了 N 項
   ```


## Side checks (optional)

- Whether `memorbs/HQ/persona.md` plus `memorbs/HQ/identity.md` exceed 100 lines combined (the Hot Cache ceiling)
- Whether the `.claude/skills/` router table matches the actual directory (see `writing-memorb-skills`)
