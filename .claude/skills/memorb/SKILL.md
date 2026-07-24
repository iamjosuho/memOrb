---
name: memorb
description: Gateway skill for Second Brain operations (read/write notes, Daily Notes, Inbox, meetings, business cards, memory wiki, reports, closeout). Read first to route to appropriate sub-skills.
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
3. All write operations must adhere to `vault-conventions` (paths, naming, frontmatter).
4. Load multiple sub-skills if needed (e.g., transcript processing = `m365-meeting-note` + `memory-ingest` + `daily-note`).

## Skill Router Table
Core skills reside in `.claude/skills/core/{name}/SKILL.md`.
Extensions reside in `.claude/skills/extensions/{name}/SKILL.md`.

### Core Skills (`memorb-core`)
| Sub-skill | Location | Trigger / Scenario |
| :--- | :--- | :--- |
| **vault-conventions** | `core/vault-conventions` | Base layer: paths, directory structure (`memorbs/`), naming, frontmatter, templates. Required for ALL write ops. |
| **born** | `core/born` | Vault initialization (Phase 0), persona seed setup, CLAUDE.md generation, or `/born` reset. |
| **daily-note** | `core/daily-note` | Create/update Daily Notes, journal entries, quick logs |
| **inbox-triage** | `core/inbox-triage` | Process Inbox, PARA organization, note archiving |
| **area-creation** | `core/area-creation` | Create new Area/Long-term goal: discuss structure before file creation |
| **weekly-retro** | `core/weekly-retro` | Weekly review/summary (`WeeklyRetro/YYYY-Www`) |
| **memory-ingest** | `core/memory-ingest` | Ingest raw materials (transcripts, articles, PDFs) into `memorbs/` wiki |
| **memory-query** | `core/memory-query` | Q&A, comparisons, decision recommendations via `memorbs/` wiki |
| **memory-lint** | `core/memory-lint` | Vault health check and `memorbs/` wiki MUSTY linting |
| **memorb-forgetter** | `core/memorb-forgetter` | Execute MUSTY archiving to `Archives/memorbs/` and update vault Wiki Links |
| **session-closeout** | `core/session-closeout` | Session termination: Daily Note summary, log.md, git commit/push |
| **writing-memorb-skills** | `core/writing-memorb-skills` | Create/modify vault skills (Meta) |


### Extension Skills (`memorb-extensions`)
| Sub-skill | Location | Trigger / Scenario |
| :--- | :--- | :--- |
| **m365-meeting-note** | `extensions/m365-meeting-note` | Process Teams meeting transcripts & minutes |
| **recording-transcription** | `extensions/recording-transcription` | Non-Teams voice recordings (phone, interview, m4a) to transcript |
| **business-card-ingestion** | `extensions/business-card-ingestion` | Business cards to `memorbs/people/` Page Bundle |
| **memory-domain-query** | `extensions/memory-domain-query` | Bi-directional domain/email lookup & M365/Outlook integration |
| **weekly-report** | `extensions/weekly-report` | Generate CEO weekly report pptx |
| **obsidian-cli** | `extensions/obsidian-cli` | Obsidian CLI commands (requires app running) |

## Extension Interactive Installation & Fallback Protocol
If a scenario calls for an extension (e.g. business card OCR, M365 meeting transcript processing), check if `.claude/skills/extensions/{name}/SKILL.md` exists:
1. **Installed**: Read the extension's `SKILL.md` and execute its specialized workflow.
2. **Not Installed (Interactive Installation)**:
   - Ask the user: `"💡 Notice: The '{extension-name}' extension provides enhanced domain formatting for this task. Would you like me to install it for you?"`
   - **User Approves**: Install the extension into `.claude/skills/extensions/{extension-name}/` and execute its specialized workflow immediately.
   - **User Declines / Skip**: Proceed with the graceful fallback to core `memory-ingest` or `memory-query`.

## Red Flags
Stop and revert if rationalizing any of the following:
- *"It's simple, no need to read sub-skills"* → Router rules are mandatory for all file ops.
- *"Place notes in root temporarily"* → New notes belong in `Inbox/` or PARA folders.
- *"I recall the rules without reading"* → Always re-read SKILL.md as rules evolve.
- *"Skip closeout this time"* → `session-closeout` is a mandatory ritual for every session.

## Session Closeout
Must execute `session-closeout` upon completing a session (Daily Note summary with `使用 skill: ...`, log.md entry, git commit/push).
