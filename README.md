<p align="center">
  <img src="assets/banner.jpg" alt="memOrb Banner" width="100%">
</p>

# 🔮 memOrb

> **The Cognitive World-building Memory Engine for Autonomous AI Agents**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![skills.sh](https://skills.sh/b/iamjosuho/memorb)](https://skills.sh/iamjosuho/memorb)

---

## What is memOrb?

memOrb is a suite of Agent Skills that turns your AI assistant's scattered session output into a structured, self-maintaining memory vault — markdown files you own, in a folder layout you can read without the agent.

It fuses three established methods under one metaphor:

| | Method | In memOrb |
| :--- | :--- | :--- |
| **The unit** | Atomic notes | One memorb holds one idea — self-contained, bi-directionally linked |
| **The shelves** | PARA | Triage sorts each memorb into Projects, Areas, Resources, or Archives |
| **The weeding** | Library MUSTY criteria | The Forgetter archives what's misleading, superseded, or trivial |

The metaphor is a certain animated film about the inside of a mind, and it isn't decoration. In that film a person becomes whole when core memories power Islands of Personality, and when the mind is finally willing to let some memories go. memOrb runs that architecture literally: sessions distill into memorbs, memorbs consolidate into projects and people, and the ones that resonate become Core orbs, then Beliefs, then reshape your Islands.

Most memory systems help you remember what you did. This one is built so that, a year in, you can see who you became. It works on the scale of months, not sessions.

→ [**Full worldview mapping**](docs/worldview-mapping.md) — every film component, its memOrb counterpart, and the skill that runs it.

---

## 🚀 Quick Start

### 1. Install

```bash
npx skills add iamjosuho/memorb
```

<details>
<summary><b>Other installation methods</b> — Antigravity, Claude Code, Cursor/Windsurf/VS Code, Git submodule</summary>

**Antigravity / AGY CLI**

```bash
agy plugin add iamjosuho/memorb
```

**Claude Code CLI**

```bash
claude plugin add iamjosuho/memorb
```

**Manual workspace copy** — for Cursor, Windsurf, VS Code agents, or any tool that reads a local `skills/` directory. After copying, reference `SKILL.md` from your `.cursorrules` or `.windsurfrules`.

```bash
mkdir -p skills
cp -r path/to/memorb/skills/* skills/
```

**Git submodule** — keeps memOrb skills updated across team repositories.

```bash
git submodule add https://github.com/iamjosuho/memorb.git .claude/skills/memorb-suite
```

</details>

### 2. Initialize your vault

In your agent chat, run:

```text
Run the /memorb-born skill to set up my memorb Memory Vault.
```

A 3–5 question onboarding builds `memorbs/HQ/persona.md` (your AI advisor's tone) and `memorbs/HQ/identity.md` (who you are), then initializes the `Core/`, `Belief/`, and `Long-Term/` folders.

### 3. Try your first commands

```text
"Read this transcript and file it"           → memorb-ingest
"What do we know about <person or project>?" → memorb-query
"Sort out my OrbTrack"                       → orbtrack-triage
"Check my memory for anything stale"         → memorb-lint
"Let's dream"                                → dream-studio
```

Skills trigger from natural language — no slash commands required after setup. Trigger phrases are recognized in both English and Traditional Chinese.

---

## 🧠 Skills

### Core

Core skills own exactly three folders — `memorbs/`, `Islands/`, `Long-Term/` — and run to completion on a vault containing nothing else. They will write into your existing `Daily Notes/`, `Resources/`, or `Templates/` when those folders are already there, but never create them and never depend on them. Anything that needs an outside system is an extension.

| Skill | What it does |
|---|---|
| `memorb` | Gateway router. Read first; dispatches to the right sub-skill. |
| `memorb-conventions` | Base layer: paths, folder structure, naming, YAML frontmatter schema, templates. Prerequisite for every write skill. |
| `memorb-born` | Phase 0 vault initialization — identity, advisor persona, communication preferences, core structure. |
| `memorb-ingest` | Ingest raw material (transcripts, articles, PDFs) and update structured memory pages. |
| `memorb-query` | Read memory before answering questions about people, projects, or decisions; backfill insights afterward. |
| `memorb-lint` | Memory health check — contradictions, stale pages, orphans, missing pages and links. |
| `memorb-forgetter` | Archive outdated or MUSTY-flagged pages to `memorbs/Dump/` and repair wiki-links. |
| `orbtrack-triage` | Clear the OrbTrack staging area, classifying and moving notes by PARA. |
| `dream-studio` | Monthly replay of the timeline — proposes Core orbs, adds or revises Beliefs, refreshes Island narrative, then rotates the log. Every write needs your confirmation. |
| `island-reclamation` | Stand up a new Island — define scope and naming, agree the file list, then build and sync. |
| `writing-memorb-skills` | Meta skill for adding or modifying any sub-skill in this suite. |

### Extensions

| Skill | What it does | Requires |
|---|---|---|
| `m365-meeting-note` | Pull Teams transcripts from your calendar; produce summary, full minutes, and participant analysis. | M365 connector |
| `recording-transcription` | Local audio (m4a/mp3/wav) → transcript via local Whisper, with long-file chunking and name/term correction. | Local Whisper |
| `business-card-ingestion` | Turn business card photos or screenshots into People pages. | — |
| `memorb-domain-query` | Look up companies, employees, and contacts by email address, domain, or company name. | Outlook/M365 (optional) |

---

## 🔮 How It Works

### The vocabulary

| Term | Meaning |
|---|---|
| **memorb** | A crystal orb holding a single memory — one atomic note: one idea, self-contained, linked bi-directionally to other memorbs. |
| **distill** | The core verb. The agent crystallizes a raw experience or session output into a memorb that can stand alone, link outward, and be recalled independently. |
| **OrbTrack** | The staging bay. Newly distilled memorbs wait here for triage — it is not a dumping ground for raw input. |
| **Islands** | Your long-term domains of responsibility and interest. Islands hold narrative only — current state, goals, section notes — never content. |
| **Core orb** | A formative experience. One significant event, one file. Core orbs drive the Islands. |
| **Belief orb** | A value or principle, distilled from the resonance of many orbs. Beliefs form your sense of self. |
| **The Forgetter** | The pruning worker. Runs MUSTY linting and archives what no longer earns its place. |
| **MUSTY** | Misleading, Ugly, Superseded, Trivial, Your collection doesn't need it. |

Long-Term memory starts with three shelves — People, Projects, Orgs — and grows organically as OrbTrack clusters reveal recurring themes, which then get promoted into new shelves.

> Every one of these has a counterpart in the film, down to which skill plays which Mind Worker. The [full mapping](docs/worldview-mapping.md) lays out all three tiers, including why Core and Belief run on separate machinery.

### Your vault layout

memOrb defines and maintains exactly three folders. Everything else in your vault keeps its existing structure, untouched.

```text
<your vault>/
├── Islands/                   # Islands of Personality — narrative layer only, never stores content
│   └── {name}/                # 000-MOC.md + section notes: current state, goals, links out to Long-Term/
├── Long-Term/                 # Long-Term Memory — where the actual content pages live
│   ├── Projects/              # Deadline-bound work, with milestone history
│   ├── People/                # Key collaborators (Authority Control pages)
│   └── Orgs/                  # Organizations & teams (Authority Control pages)
├── memorbs/                   # memOrb's own namespace
│   ├── HQ/                    # Headquarters: persona, identity, and Core/Belief orbs
│   │   ├── persona.md         # AI advisor tone & role (Hot Cache, always read)
│   │   ├── identity.md        # Background, goals, key relationships (Hot Cache, always read)
│   │   ├── Core/              # Core Memory orbs — one formative experience per file
│   │   ├── Belief/            # Belief orbs — values and principles distilled from lived experience
│   │   └── OrbTrack/          # Fast capture & pending triage
│   ├── Dump/{category}/       # Memory Dump — stale, superseded, or pruned orbs
│   ├── log.md                 # The timeline for the current period
│   └── log/{YYYY-MM}.md       # Archived periods, rotated by dream-studio
│
└── (your own folders)         # Daily Notes, Resources, Templates … read when present, never required
```

Islands and Long-Term are deliberately split: Islands narrate a domain, Long-Term stores its pages, and wiki-links connect the two — mirroring how a mind keeps its Islands of Personality separate from the shelves of Long-Term Memory.

**`log.md` is the timeline, and it does real work.** Entity pages are living documents with no per-event dates, and OrbTrack is emptied by design — so neither can answer "what was going on that month". The log can, which is why every state-changing action appends an entry, and why each entry carries a *signal* line: the user's own words for something that mattered but wasn't yet shaped enough to become an orb. That residue is what `dream-studio` replays, and it's where beliefs come from.

Circulation metadata (`last_recalled`, `recall_count`, `aliases: [...]`) is backfilled silently on every query, giving you alias mapping and decay metrics visible right in your `Long-Term/` pages rather than hidden in an index.

### The distillation pipeline

```text
Step 1: Raw materials / AI session
           ↓  distill                          ↘  every state change also
        memorb  (atomic note, self-contained,      appends a dated entry
                 bi-directional links, source:)    to log.md — the timeline

Step 2: Classify + add shared frontmatter
           ↓
        OrbTrack  (staging area — distilled memorbs awaiting triage)

Step 3: Organize bi-directional links between memorbs

Step 4: Consolidate
           ↓
        Long-Term  (People / Projects / Orgs)

Step 5: Evaluate  ← dream-studio, monthly, replaying log.md
           ↓
        Islands / Core / Belief orbs  (updated)
           ↓
        log.md rotates into log/{YYYY-MM}.md; a fresh period begins
```

Steps 1–4 run continuously as you work. Step 5 runs monthly and is the only one that touches who you are.

---

## 📖 Story & Vision

Most AI agents live in the moment — losing context the second a session ends, or drowning in unorganized chat logs.

memOrb was born from a realization borrowed from cinema: *our memories aren't flat storage logs; they are vibrant universes composed of core experiences, evolving values, and structured islands of responsibility.*

Task trackers capture what you did. Journals capture how you felt. Neither connects the two, so long stretches of hard work can leave you productive and unrecognizable to yourself. By bridging task performance with personal values, memOrb aims to help you reach complex goals without losing your core identity — growing into a more complete, self-aware person rather than just a better-organized one.

---

## 🛠️ Development

```text
memorb/
├── assets/          # Project media & documentation assets (banner, logos)
├── plugin.json      # Marketplace plugin manifest
├── skills/          # Executable Agent Skills (core/ and extensions/)
├── fixtures/        # Clean, de-identified initial templates and sample data
├── scripts/         # Sandbox reset & skill-linting utilities
└── sandbox/         # Git-ignored local agent testing directory
```

### Local sandbox testing

Try skills locally without polluting git commits with temporary test notes:

```bash
# 1a. Reset sandbox with sample fixtures (for testing query/lint/ingest)
bash scripts/reset-sandbox.sh

# 1b. Reset sandbox COMPLETELY EMPTY (for testing /memorb-born from zero)
bash scripts/reset-sandbox.sh --empty

# 2. Lint all SKILL.md files, plugin.json registration, fixtures, and
#    architecture drift (stale/deprecated path references)
node scripts/lint-skills.js   # or: npm run lint

# 3. (one-time) Install the git pre-commit hook so the linter runs on every
#    commit — also installed automatically by the npm "prepare" script
bash scripts/install-hooks.sh
```

> **No automated test suite yet.** The linter checks skill file structure, routing consistency, fixture structure, and path/architecture drift — not runtime behavior. Verifying what a skill actually does still requires walking through it manually in an agent session.

> **When renaming a folder or namespace** (e.g. the `Islands/{people,organizations,projects}` → `Long-Term/` migration), add the old path to `DEPRECATED_PATTERNS` in `scripts/lint-skills.js`. Every subsequent `npm run lint` and `git commit` will then catch any skill or fixture still on the old path.

---

## 📄 License

[MIT License](LICENSE) © 2026 iamjosuho

**Attribution & disclaimer.** memOrb is an independent open-source project, not affiliated with, endorsed by, or sponsored by Pixar or The Walt Disney Company; the cognitive metaphors are used descriptively. The MUSTY criteria come from the CREW library weeding method (Joseph P. Segal, Texas State Library and Archives Commission); PARA is Tiago Forte's, from *Building a Second Brain*. See [worldview mapping](docs/worldview-mapping.md) for the full attribution.
