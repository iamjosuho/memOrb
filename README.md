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

## 🏛️ Framework Pillars

memOrb is built on three interlocking design principles:

**1. Movie Universe (Inside Out)** — The metaphorical language. memorbs are crystal orbs holding a single memory. OrbTrack is the staging bay where newly distilled orbs wait before being filed. Islands represent the user's personality domains and evolving belief state. The Forgetter runs MUSTY pruning — clearing out memories that are Misleading, Ugly, Superseded, Trivial, or simply no longer needed.

**2. Atomic Notes** — The unit of knowledge. Each memorb captures exactly one idea, is self-contained, and connects to other memorbs via bi-directional links. *Distillation* is the core act: AI crystallizes a raw experience or session output into an atomic memorb that can stand alone, link outward, and be recalled independently.

**3. Library Classification** — The organizational logic for Long-Term memory. Rather than imposing a rigid taxonomy upfront, memOrb starts with three core shelves — People, Projects, Orgs — and grows organically. As memorbs accumulate in OrbTrack and cluster around recurring themes, new Long-Term categories emerge naturally and get promoted into the shelf system.

---

## 🔮 Worldview Architecture

memOrb structures your vault as a modular, self-maintaining cognitive ecosystem, split across three layers — Islands of Personality, Long-Term Memory, and memOrb's own `memorbs/` namespace:

```text
<your vault>/
├── Islands/                   # Islands of Personality — narrative layer only, never stores content directly
│   └── {name}/                # 000-MOC.md + section notes: current state, long-term goals, links out to Long-Term/
├── Long-Term/                 # Long-Term Memory — where the actual content pages live
│   ├── Projects/              # Deadline-bound work, with milestone history
│   ├── People/                # Key collaborators (Authority Control pages)
│   └── Orgs/                  # Organizations & teams (Authority Control pages)
└── memorbs/                   # memOrb's own namespace
    ├── HQ/                    # Headquarters: Persona, Identity & Core/Belief Orbs
    │   ├── persona.md         # AI advisor tone & role (Hot Cache, always read)
    │   ├── identity.md        # Who the user is: background, goals, key relationships (Hot Cache, always read)
    │   ├── Core/              # Core Memory orbs — one formative experience per file
    │   ├── Belief/             # Belief orbs — values/principles distilled from Core orbs
    │   └── OrbTrack/          # Fast capture & pending triage
    └── Dump/                  # Memory Dump & Archival (MUSTY Collection)
        └── {category}/        # Stale, superseded, or pruned memories
```

### 🏛️ The Five Cognitive Pillars

1. **Headquarters, Identity & Core Orbs (`memorbs/HQ/`)**  
   The central control room: `persona.md` (AI advisor tone) and `identity.md` (who the user is) are small, always-read Hot Cache files, while `Core/` and `Belief/` hold individual orb files — formative experiences and the values distilled from them — plus the `OrbTrack/` capture zone where new inputs land before triage.
2. **Islands of Personality (`Islands/`) & Long-Term Memory (`Long-Term/`)**  
   Islands hold only the narrative of a long-term domain — current state, goals, section notes — never content itself. People, Projects, and Org pages live in `Long-Term/`, connected back to their Islands by wiki-links, mirroring how a mind keeps its Islands of Personality separate from the shelves of Long-Term Memory.
3. **Memory Dump & MUSTY Archiving (`memorbs/Dump/`)**  
   Automated MUSTY (*Misleading, Ugly, Superseded, Trivial, Your collection doesn't need it*) linting and pruning powered by `memorb-forgetter`.
4. **Authority Control & Circulation Tracking**  
   Silent metadata backfills (`last_recalled`, `recall_count`, and `aliases: [...]`) ensure alias mapping and decay metrics across all memory queries — visible right in your `Long-Term/` pages, not hidden away.
5. **A Managed, Not Invisible, Vault Layer**  
   `Islands/`, `Long-Term/`, and `memorbs/` are the three folders memOrb actively defines and maintains; your other native folders (Daily Notes, Resources, Archives, WeeklyRetro, Templates) keep their existing structure untouched.

---

## 🔄 Distillation Pipeline

**distill** is the core verb in memOrb: the action of crystallizing raw materials or AI session output into a **memorb** — an atomic note that is self-contained and carries bi-directional links.

```
Step 1: Raw materials / AI session
           ↓  distill
        memorb  (atomic note, self-contained, bi-directional links)

Step 2: Classify + add shared frontmatter
           ↓
        OrbTrack  (staging area — holds distilled memorbs awaiting triage)

Step 3: Organize bi-directional links between memorbs

Step 4: Consolidate
           ↓
        Long-Term  (People / Projects / Orgs)

Step 5: Evaluate
           ↓
        Islands / Core / Belief orbs  (updated)
```

**Key principles:**
- **distill** is the core verb — AI crystallizes experience into a memorb.
- **OrbTrack** is the staging area for distilled memorbs, not raw input storage.
- Each memorb follows atomic note methodology: one idea, self-contained.

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
The agent will launch an interactive 3-5 question onboarding prompt to construct `memorbs/HQ/persona.md` and `memorbs/HQ/identity.md`, and initialize your `Core/`, `Belief/`, and `Long-Term/` folders.

---

## 🛠️ Local Developer Sandbox Testing

To try out skills locally without polluting git commits with temporary test notes:

```bash
# 1a. Reset sandbox with sample fixtures (for testing query/lint/ingest)
bash scripts/reset-sandbox.sh

# 1b. Reset sandbox as COMPLETELY EMPTY (for testing /memorb-born initialization from zero)
bash scripts/reset-sandbox.sh --empty

# 2. Lint all SKILL.md files, plugin.json registration, fixtures, and
#    architecture drift (stale/deprecated path references)
node scripts/lint-skills.js
# or: npm run lint

# 3. (one-time) install the git pre-commit hook so the linter above runs
#    automatically on every `git commit` — also runs automatically via the
#    npm "prepare" script on `npm install`
bash scripts/install-hooks.sh
```

> Note: there is currently no automated test suite — the linter above only checks skill file structure, routing consistency, fixture structure, and path/architecture drift, not runtime behavior. Verifying a skill's actual behavior still requires walking through it manually in an agent session.
>
> When a folder/namespace gets renamed (e.g. the `Islands/{people,organizations,projects}` → `Long-Term/` migration), add the old path to the `DEPRECATED_PATTERNS` list in `scripts/lint-skills.js` — every future `npm run lint` and every `git commit` will then catch any skill or fixture still using the old path automatically.

---

## 📄 License
[MIT License](LICENSE) © 2026 iamjosuho
