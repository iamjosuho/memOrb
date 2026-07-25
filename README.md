<p align="center">
  <img src="assets/banner.jpg" alt="memOrb Banner" width="100%">
</p>

# 🔮 memOrb

> **The Cognitive World-building Memory Engine for Autonomous AI Agents**  
> *Inspired by my favorite animated movie, memOrb turns cognitive worldview into a structured memory universe for AI agents and human second brains.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![skills.sh](https://skills.sh/b/iamjosuho/memorb)](https://skills.sh/iamjosuho/memorb)

---

## 🌟 Story & Vision

Most AI agents live in the moment—losing context the second a session ends or drowning in unorganized chat logs. 

**memOrb** was born from a simple realization inspired by cinematic worldview: *our memories aren't just flat storage logs; they are vibrant universes composed of core experiences, evolving values, and structured islands of responsibility.*

### ⚡ Dual-Engine Memory Synergy
memOrb connects daily execution with long-term human growth through a dual-engine architecture:

1. **Task & Project Engine**: Empowers autonomous agents to track multi-step workflows, projects, and structured knowledge effortlessly.
2. **Emotional & Belief Anchoring Engine**: Distills daily interactions into core memory orbs, reflecting your values, beliefs, and evolution over time.

By bridging task performance with personal values, **memOrb helps users achieve complex goals without losing their core identity—empowering them to grow into a more complete, self-aware person.**

---

## 🔮 Worldview Architecture

memOrb structures your memory vault inside `memorbs/` as a modular, self-maintaining cognitive ecosystem:

```text
memorbs/
├── HQ/                       # Headquarters: Persona, Identity & Core/Belief Orbs
│   ├── persona.md            # AI advisor tone & role (Hot Cache, always read)
│   ├── identity.md           # Who the user is: background, goals, key relationships (Hot Cache, always read)
│   ├── Core/                 # Core Memory orbs — one formative experience per file
│   ├── Belief/                # Belief orbs — values/principles distilled from Core orbs
│   └── OrbTrack/             # Fast capture & pending triage
├── Islands/                  # Islands of Growth (Structured Wiki Layer)
│   ├── people/               # Key collaborators & relationships
│   ├── projects/             # Active & completed milestone tracks
│   ├── context/              # Environmental parameters & domain rules
│   └── organizations/        # Organizations & team dynamics
└── Dump/                     # Memory Dump & Archival (MUSTY Collection)
    └── {category}/           # Stale, superseded, or pruned memories
```

### 🏛️ The Five Cognitive Pillars

1. **Headquarters, Identity & Core Orbs (`memorbs/HQ/`)**  
   The central control room: `persona.md` (AI advisor tone) and `identity.md` (who the user is) are small, always-read Hot Cache files, while `Core/` and `Belief/` hold individual orb files — formative experiences and the values distilled from them — plus the `OrbTrack/` capture zone where new inputs land before triage.
2. **Islands of Growth (`memorbs/Islands/`)**  
   Dedicated wiki islands categorizing knowledge across People, Projects, Context, and Organizations for instant agent recall.
3. **Memory Dump & MUSTY Archiving (`memorbs/Dump/`)**  
   Automated MUSTY (*Misleading, Ugly, Superseded, Trivial, Your collection doesn't need it*) linting and pruning powered by `memorb-forgetter`.
4. **Authority Control & Circulation Tracking**  
   Silent metadata backfills (`last_recalled`, `recall_count`, and `aliases: [...]`) ensure alias mapping and decay metrics across all memory queries.
5. **Non-Invasive Vault Namespace**  
   Strictly isolated within `memorbs/`, leaving your existing Obsidian folder structure and conventions untouched and non-polluted.

---

## 📁 Repository Directory Structure

```text
memorb/
├── assets/                   # Project media & documentation assets (banner, logos)
├── plugin.json               # Marketplace plugin manifest
├── skills/                   # Executable Agent Skills (memorb router, memorb-born, ingest, query, lint, forgetter, extensions)
├── fixtures/                 # Clean, de-identified initial templates and sample data
├── scripts/                  # Developer sandbox reset & skill-linting utilities
└── sandbox/                  # Git-ignored local agent testing directory
```

---

## 🚀 Quick Start

### 📦 1. Installation Options across Agent Tools & Marketplaces

Choose the installation method for your preferred AI Agent tool:

#### Option A: Universal Skill Installer (skills.sh)
Install directly into your workspace via `skills.sh`:
```bash
npx skills add iamjosuho/memorb
```

#### Option B: Antigravity / AGY CLI (Recommended for AGY)
Install directly from GitHub via the AGY plugin registry:
```bash
agy plugin add iamjosuho/memorb
```

#### Option C: Claude Code CLI
Add via the Claude Code plugin manager or copy skills into your workspace:
```bash
# Plugin Manager
claude plugin add iamjosuho/memorb

# OR Manual Workspace Copy
mkdir -p skills
cp -r path/to/memorb/skills/* skills/
```

#### Option D: Cursor / Windsurf / VS Code Agent Assistants
Copy the memOrb skill suite into your repository's `skills/` (or `.claude/skills/`) directory and reference `SKILL.md` in your `.cursorrules` or `.windsurfrules`:
```bash
# Copy skill definitions into your project
mkdir -p skills
cp -r path/to/memorb/skills/* skills/
```

#### Option E: Git Submodule (Project Workspace Integration)
Keep memOrb skills automatically updated across team repositories:
```bash
git submodule add https://github.com/iamjosuho/memorb.git .claude/skills/memorb-suite
```

---

### 🐣 2. Vault Initialization (`/memorb-born`)

In your agent chat (Claude Code, Antigravity, Cursor, etc.), run:
```text
"Run the /memorb-born skill to set up my memorb Memory Vault."
```
The agent will launch an interactive 3-5 question onboarding prompt to construct `memorbs/HQ/persona.md` and `memorbs/HQ/identity.md`, and initialize your `Core/`, `Belief/`, and `Islands/` folders.

---

## 🛠️ Local Developer Sandbox Testing

To try out skills locally without polluting git commits with temporary test notes:

```bash
# 1a. Reset sandbox with sample fixtures (for testing query/lint/ingest)
bash scripts/reset-sandbox.sh

# 1b. Reset sandbox as COMPLETELY EMPTY (for testing /memorb-born initialization from zero)
bash scripts/reset-sandbox.sh --empty

# 2. Lint all SKILL.md files and verify plugin.json references are consistent
node scripts/lint-skills.js
```

> Note: there is currently no automated test suite — the linter above only checks skill file structure and routing consistency, not runtime behavior. Verifying a skill's actual behavior still requires walking through it manually in an agent session.

---

## 📄 License
[MIT License](LICENSE) © 2026 iamjosuho
