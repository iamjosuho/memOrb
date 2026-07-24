---
name: memorb-born
description: "Phase 0 Vault Initialization Skill: setup user identity, AI advisor persona, communication preferences, and core vault structure into CLAUDE.md. Triggered when vault setup is missing, user requests re-initialization, or running /memorb-born."
---

# Memorb Born Skill (Vault Initialization & Persona Setup)

> **Purpose**: Establish user identity seed, AI manager/career advisor persona, and vault settings without locking into a specific Agent framework.

## Execution Sequence

1. **Check Existing Context**:
   - Inspect `CLAUDE.md` and `memorbs/context/background.md` if available.
2. **Interactive 3-5 Question Interview** (using `ask_question` tool if running interactively):
   - **Q1 (Communication & Language)**: Preferred language (e.g. Traditional Chinese), output constraints, and non-negotiable rules.
   - **Q2 (Identity & Role)**: Warmly greet the user (e.g., "Welcome! Today is YYYY-MM-DD, and your Second Brain is officially born."), then collect their preferred name, current title/organization, and key target goals.
   - **Q3 (AI Advisor Persona)**: Desired AI tone and relationship (e.g., Senior Manager & Career Advisor, technical strategist, concise assistant).
   - **Q4 (Vault Path & Integrations)**: Second Brain root path and connected tools/MCPs.
1. Create folders `Islands/peronality`  , `memorbs/Dump`
2. **Generate/Update `Headquarter/Core/idenity.md`**:
   - Write updated Hot Cache (<100 lines) with core persona, team table, terminology, and memorb skill gate rules.
   - Generate/Update `CLAUDE.md` and `AGENT.md`: add command "Must read `memorbs/Core.md`"
1. **Log Event**:
   - Record initialization in `memorbs/log.md`.
