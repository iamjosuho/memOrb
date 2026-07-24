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
3. **Create Folder Structure** (see `vault-conventions`):
   - `memorbs/HQ/Core/`, `memorbs/HQ/Belief/`, `memorbs/HQ/OrbTrack/`
   - `memorbs/Islands/{people,projects,organizations,context}/`
   - `memorbs/Dump/`
4. **Generate/Update HQ Hot Cache**:
   - `memorbs/HQ/persona.md`: AI tone/role from Q3 (<100 lines).
   - `memorbs/HQ/identity.md`: name, birthday, education/career history, role, organization, goals, and key relationships table from Q1/Q2/Q4 (<100 lines).
   - Generate/Update `CLAUDE.md` and `AGENT.md`: add command "Must read `memorbs/HQ/persona.md` and `memorbs/HQ/identity.md`"
5. **Log Event**:
   - Record initialization in `memorbs/log.md`.
