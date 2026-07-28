---
name: memorb
description: Gateway skill for Second Brain operations (read/write orbs, OrbTrack capture & triage, ingest, query, lint, archive, memory replay, meetings, business cards). Read first to route to appropriate sub-skills.
---

# Memorb (Gateway Skill)

> **CRITICAL**: Primary routing hub for the vault. Every file operation must strictly follow these instructions and sub-skill routing without exception.

## Instruction Priority
1. **Explicit User Instructions** (highest)
2. **Memorb & Routed Sub-skills** (overrides default agent behavior)
3. **Default Agent Behavior** (lowest)

## Core Rules
Before performing any file operation:
1. Read this gateway file.
2. Read `SKILL.md` for **every matching sub-skill** in the routing table below.
3. All write operations must adhere to `memorb-conventions` (paths, naming, frontmatter).
4. Load multiple sub-skills if needed (e.g., transcript processing = `recording-transcription` + `memorb-ingest`).

### Ownership boundary
**memOrb may read anything the user points it at; it writes only inside `memorbs/`.** No exceptions — this binds extensions too.

Reading is safe: no state change, no surprise. Conditional *writing* is where the trouble lives. The moment a skill says "write to the reference folder if it exists", the same operation produces three different outcomes depending on a coincidence of folder naming — it writes for one user, silently skips for the user who numbered their folders, and does nothing for the user who has none. That is worse than either owning the folder or never touching it.

So memOrb grows exactly one folder in the user's vault: `memorbs/`. Delete it and the vault is clean.

## Skill Router Table
Core skills reside in `skills/core/{name}/SKILL.md`.
Extensions reside in `skills/extensions/{name}/SKILL.md`.

### Core Skills (`memorb-core`)
| Sub-skill | Location | Trigger / Scenario |
| :--- | :--- | :--- |
| **memorb-conventions** | `core/memorb-conventions` | Base layer: paths, directory structure (`memorbs/`), naming, frontmatter, templates. Required for ALL write ops. |
| **memorb-born** | `core/memorb-born` | Vault initialization (Phase 0), persona seed setup, CLAUDE.md generation, or `/memorb-born` reset. |
| **orbtrack-triage** | `core/orbtrack-triage` | Process OrbTrack (`memorbs/HQ/OrbTrack/`), PARA organization, note archiving |
| **island-reclamation** | `core/island-reclamation` | Create new Island (long-term interest/responsibility domain): discuss structure before file creation |
| **dream-studio** | `core/dream-studio` | Monthly memory replay: propose Core orbs, add/revise Belief orbs, refresh Island narrative. **Sole writer of `memorbs/HQ/Core/`.** |
| **memorb-ingest** | `core/memorb-ingest` | Ingest raw materials (transcripts, articles, PDFs) into `memorbs/Long-Term/`／`memorbs/` wiki |
| **memorb-query** | `core/memorb-query` | Q&A, comparisons, decision recommendations via `memorbs/Long-Term/`／`memorbs/` wiki |
| **memorb-lint** | `core/memorb-lint` | Vault health check and `memorbs/Long-Term/`／`memorbs/` wiki MUSTY linting |
| **memorb-forgetter** | `core/memorb-forgetter` | Execute MUSTY archiving to `memorbs/Dump/` and update vault Wiki Links |
| **writing-memorb-skills** | `core/writing-memorb-skills` | Create/modify vault skills (Meta) |


### Extension Skills (`memorb-extensions`)
| Sub-skill | Location | Trigger / Scenario |
| :--- | :--- | :--- |
| **recording-transcription** | `extensions/recording-transcription` | Non-Teams voice recordings (phone, interview, m4a) to transcript |
| **business-card-ingestion** | `extensions/business-card-ingestion` | Business cards to `memorbs/Long-Term/People/` entity notes |
| **memorb-domain-query** | `extensions/memorb-domain-query` | Bi-directional domain/email lookup & M365/Outlook integration |

## Extension Interactive Installation & Fallback Protocol
If a scenario calls for an extension (e.g. business card OCR, M365 meeting transcript processing), check if `skills/extensions/{name}/SKILL.md` exists:
1. **Installed**: Read the extension's `SKILL.md` and execute its specialized workflow.
2. **Not Installed (Interactive Installation)**:
   - Ask the user: `"💡 Notice: The '{extension-name}' extension provides enhanced domain formatting for this task. Would you like me to install it for you?"`
   - **User Approves**: Install the extension into `skills/extensions/{extension-name}/` and execute its specialized workflow immediately.
   - **User Declines / Skip**: Proceed with the graceful fallback to core `memorb-ingest` or `memorb-query`.

## Red Flags
Stop and revert if rationalizing any of the following:
- *"It's simple, no need to read sub-skills"* → Router rules are mandatory for all file ops.
- *"Place notes in root temporarily"* → New notes belong in `memorbs/HQ/OrbTrack/` or PARA folders.
- *"I recall the rules without reading"* → Always re-read SKILL.md as rules evolve.
