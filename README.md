# 🧠 memOrb Skill Set

> **Agent-Agnostic Second Brain Memory Framework** inspired by *Inside Out* world-building and Library Science MUSTY archiving.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📌 Overview

**memOrb** is an open-source, modular Skill Set designed for AI Agents (Claude Code, Gemini Antigravity, Cursor, etc.) to maintain a compounding, persistent Markdown memory vault inside Obsidian or any markdown workspace.

### Core Architectural Features:
1. **Headquarters & Core Orbs (`memorbs/HQ/`)**: Hot cache persona, Belief System, and current session working context.
2. **Personality & Responsibility Islands (`memorbs/Islands/`)**: Structured wiki layer for People, Projects, Context, and Organizations.
3. **Library Science MUSTY Archiving (`memorbs/Dump/`)**: Automated MUSTY (Misleading, Ugly, Superseded, Trivial, Your collection doesn't need it) linting and archival via `memorb-forgetter`.
4. **Authority Control (`aliases: [...]`) & Circulation Tracking**: Automatic alias mapping and silent `last_recalled`/`recall_count` backfill on every query.
5. **Non-Invasive Namespace**: All memOrb operations are strictly encapsulated inside `memorbs/`, preserving existing vault folder structures (like PARA).

---

## 📁 Repository Directory Structure

```text
memorb-skill-set/
├── plugin.json               # Marketplace plugin manifest
├── .claude/skills/           # Executable Agent Skills (memorb router, born, ingest, query, lint, forgetter)
├── fixtures/                 # Clean, de-identified initial templates and sample data
├── scripts/                  # Developer sandbox reset & utility scripts
├── tests/                    # Automated repo verification test suite
└── sandbox/                  # Git-ignored local agent testing directory
```

---

## 🚀 Quick Start

### 1. Installation
Copy `.claude/skills/` into your project root, or install via plugin CLI:
```bash
agy plugin add iamjosuho/memorb-skill-set
```

### 2. Initialization (`/born`)
In your agent chat, run:
```text
"Run the /born skill to set up my memOrb Memory Vault."
```
The agent will launch an interactive 3-5 question onboarding prompt to create `memorbs/HQ/Core.md` and initialize your Islands.

---

## 🛠️ Local Developer Sandbox Testing

To test skills locally without polluting git commits with temporary test notes:

```bash
# 1. Reset sandbox from clean fixtures
bash scripts/reset-sandbox.sh

# 2. Run verification test suite
node tests/run-tests.js
```

---

## 📄 License
[MIT License](LICENSE) © 2026 iamjosuho
