---
name: memorb
description: Agent-Agnostic Second Brain memory framework inspired by cognitive world-building and library science. Gateway skill for managing memory notes, Daily Notes, Inbox triage, and memorbs wiki.
---

# memOrb (Second Brain Skill Set)

> **Agent-Agnostic Second Brain Memory Framework**

`memorb` is a structured memory framework for AI agents operating in an Obsidian vault or local Markdown file system. It organizes knowledge through cognitive world-building (HQ core beliefs + Islands domain entities) and strict file lifecycle management.

## Overview & Architecture

`memorb` provides a gateway router that delegates operations to modular core and extension skills.

### Key Features
- **Gateway Hub**: Entry router (`skills/memorb/SKILL.md`) for all note management.
- **Vault Conventions**: Standardized directory structure (`memorbs/`, `Inbox/`, `DailyNotes/`), frontmatter metadata, and wiki-linking rules.
- **Memory Lifecycle**: Ingestion (`memorb-ingest`), Querying (`memorb-query`), Health check (`memorb-lint`), and Archiving (`memorb-forgetter`).
- **Rituals**: Daily Notes logging (`daily-note`), Inbox Triage (`inbox-triage`), Weekly Retros (`weekly-retro`), and Session Closeout (`session-closeout`).

## Skill Routing Directory

For detailed skill execution protocols, refer to:
- **Gateway Router**: [memorb Gateway](file://./skills/memorb/SKILL.md)
- **Core Skills**: [Core Skills Index](file://./skills/core/)
  - [vault-conventions](file://./skills/core/vault-conventions/SKILL.md)
  - [born](file://./skills/core/born/SKILL.md)
  - [daily-note](file://./skills/core/daily-note/SKILL.md)
  - [inbox-triage](file://./skills/core/inbox-triage/SKILL.md)
  - [area-creation](file://./skills/core/area-creation/SKILL.md)
  - [weekly-retro](file://./skills/core/weekly-retro/SKILL.md)
  - [memorb-ingest](file://./skills/core/memorb-ingest/SKILL.md)
  - [memorb-query](file://./skills/core/memorb-query/SKILL.md)
  - [memorb-lint](file://./skills/core/memorb-lint/SKILL.md)
  - [memorb-forgetter](file://./skills/core/memorb-forgetter/SKILL.md)
  - [session-closeout](file://./skills/core/session-closeout/SKILL.md)
  - [writing-memorb-skills](file://./skills/core/writing-memorb-skills/SKILL.md)
- **Extension Skills**: [Extension Skills Index](file://./skills/extensions/)
  - [business-card-ingestion](file://./skills/extensions/business-card-ingestion/SKILL.md)
  - [m365-meeting-note](file://./skills/extensions/m365-meeting-note/SKILL.md)
  - [memorb-domain-query](file://./skills/extensions/memorb-domain-query/SKILL.md)
  - [obsidian-cli](file://./skills/extensions/obsidian-cli/SKILL.md)
  - [recording-transcription](file://./skills/extensions/recording-transcription/SKILL.md)
  - [weekly-report](file://./skills/extensions/weekly-report/SKILL.md)

## Quick Start (via npx skills)

Install `memorb` directly into your AI agent environment:

```bash
npx skills add iamjosuho/memorb
```
