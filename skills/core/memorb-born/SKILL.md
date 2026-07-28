---
name: memorb-born
description: "Phase 0 Vault Initialization Skill: setup user identity, AI advisor persona, communication preferences, and core vault structure into CLAUDE.md. Triggered when vault setup is missing, user requests re-initialization, or running /memorb-born."
---

# Memorb Born Skill (Vault Initialization & Persona Setup)

> **Purpose**: Establish user identity seed, AI manager/career advisor persona, and vault settings without locking into a specific Agent framework.

## Execution Sequence

1. **Check Existing Context**:
   - Inspect `CLAUDE.md` and `memorbs/HQ/identity.md` if available.
2. **Interactive 3-5 Question Interview** (using `ask_question` tool if running interactively):
   - **Q1 (Communication & Language)**: Preferred language (e.g. Traditional Chinese), output constraints, and non-negotiable rules.
   - **Q2 (Identity & Role)**: Warmly greet the user (e.g., "Welcome! Today is YYYY-MM-DD, and your Second Brain is officially born."), then collect their preferred name, birthday (optional), education/career history, current title/organization, and key target goals.
   - **Q3 (AI Advisor Persona)**: Desired AI tone and relationship (e.g., Senior Manager & Career Advisor, technical strategist, concise assistant).
   - **Q4 (Vault Path & Integrations)**: Second Brain root path and connected tools/MCPs.
3. **Create Folder Structure & Base Files** (Strictly following `memorb-conventions` SSOT — everything memOrb owns lives under `memorbs/`; **never create folders outside it**, whatever else the vault happens to contain):
   - Execute directory creation:
     ```bash
     mkdir -p "$VAULT/memorbs/HQ/Core"
     mkdir -p "$VAULT/memorbs/HQ/Belief"
     mkdir -p "$VAULT/memorbs/HQ/OrbTrack"
     mkdir -p "$VAULT/memorbs/Templates"
     mkdir -p "$VAULT/memorbs/Islands"
     mkdir -p "$VAULT/memorbs/Long-Term/Projects"
     mkdir -p "$VAULT/memorbs/Long-Term/People"
     mkdir -p "$VAULT/memorbs/Long-Term/Orgs"
     mkdir -p "$VAULT/memorbs/Dump"
     ```
   - Ensure initial creation of `memorbs/HQ/glossary.md` and timeline `memorbs/log.md` if not present, seeded with a `# Timeline — since {YYYY-MM-DD}` header.
4. **Generate/Update HQ Hot Cache**:
   - `memorbs/HQ/persona.md`: AI tone/role from Q3 (<100 lines).
   - `memorbs/HQ/identity.md`: name, birthday, education/career history, role, organization, goals, and key relationships table from Q1/Q2/Q4 (<100 lines).
   - `memorbs/HQ/glossary.md`: initial empty table for terms.
   - **CLAUDE.md Snippet**: Provide or append the non-intrusive `<!-- memOrb:start -->` protected block into `CLAUDE.md` (never overwrite existing personal rules).
5. **Log Event**:
   - Record initialization in `memorbs/log.md`.
