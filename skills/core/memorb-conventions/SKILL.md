---
name: memorb-conventions
description: "Base layer conventions for the memOrb vault: path resolution, folder structure, naming rules, YAML frontmatter schema, orb layouts. Prerequisite for every write skill. Triggers: path, folder structure, naming, frontmatter, schema, 路徑, 資料夾結構, 命名, 模板, frontmatter, schema."
---

# Memorb Conventions (Single Source of Truth)

> **This skill is the SSOT for memOrb's folder structure, filename formats, YAML schemas, and naming rules.**
> Every write operation and every initialization (`/memorb-born`) must follow it. Workflows belong to the individual sub-skills; this file governs only *where things go and what shape they take*.
> It assumes nothing about the name or existing layout of the user's vault — memOrb operates through the non-invasive `memorbs/` namespace and leaves everything else alone.

## Resolving VAULT

Do not assume a fixed root folder name. The presence of `memorbs/HQ/identity.md` is what marks a vault as initialized:

```bash
VAULT=$(find . -maxdepth 4 -type d -name memorbs 2>/dev/null -exec dirname {} \; | head -1)
```

If nothing is found, `/memorb-born` has not run yet — route there first.

## Folder structure

**The one boundary rule: memOrb may read anything the user points it at, but it writes only inside `memorbs/`.**

No exceptions; this binds extensions too. Reading is safe — no state change, no surprise. Conditional *writing* is where the trouble lives. The moment a skill says "write to the reference folder if it exists", the same operation produces three different outcomes depending on a coincidence of folder naming: it writes for one user, silently skips for the user who numbered their folders, and does nothing for the user who has none. That is worse than either owning the folder or never touching it.

So memOrb grows exactly **one** folder in the user's vault:

```text
<your vault>/
├── 1-Projects/  Daily Notes/  Inbox/ …   ← the user's own; read, never written to
│
└── memorbs/                    ← everything memOrb owns; delete it and the vault is clean
    ├── HQ/
    │   ├── persona.md          ← AI advisor persona: tone and role (Hot Cache, read every session)
    │   ├── identity.md         ← who the user is: name, background, role, org, goals, key relationships (Hot Cache, read every session)
    │   ├── glossary.md         ← domain terminology, acronyms, code words (Hot Cache, read by ingest/transcription)
    │   ├── Core/               ← Core Memory orbs, one per file (formative experiences)
    │   ├── Belief/             ← Belief orbs, one per file (values and principles distilled from experience)
    │   └── OrbTrack/           ← the only capture zone, emptied by orbtrack-triage
    ├── Templates/              ← standard templates for entities and orbs
    │   ├── People Template.md
    │   ├── Org Template.md
    │   ├── Project Template.md
    │   ├── Core Template.md
    │   ├── Belief Template.md
    │   ├── Persona Template.md
    │   └── Identity Template.md
    ├── Islands/                ← domains of long-term responsibility or interest: current state, goals, section notes, MOC only — no entity pages, links out to Long-Term/
    ├── Long-Term/              ← the shelves: actual content pages, one page per entity
    │   ├── Projects/           ← deadline-bound work with milestone history
    │   ├── People/             ← key collaborators (flat PascalCase files: AlexChen.md or AlexChen-AcmeCorp.md)
    │   └── Orgs/               ← organizations and teams (PascalCase files: AcmeCorp.md)
    ├── Dump/{category}/        ← pages retired under MUSTY (moved in by memorb-forgetter)
    ├── log.md                  ← the current period's timeline (see below)
    └── log/{YYYY-MM}.md        ← archived periods (rotated by dream-studio)
```

> **There is no `Resources/`.** PARA's R — subjects of long-term interest — maps to **Islands**. The definition of an Island is already "a domain of long-term responsibility *or interest*", which absorbs both Areas and Resources. Curated reading notes are therefore ordinary orbs hanging off the relevant Island, and raw source material is an attachment of its orb (see the bundle rule below).

> **Note**: `memorbs/HQ/OrbTrack/` is the only capture zone. Never create a second one such as `Inbox/` — two inboxes split the triage logic.
> **Note**: the archive is always written `memorbs/Dump/{category}/`, singular.
> **Note**: `Long-Term/{People,Orgs,Projects}` replaced the old `Islands/{people,organizations,projects}` — **entity pages do not belong to Islands**; Islands hold narrative only. Environmental facts that used to sit in a separate `context/` bucket now go straight into the body of whichever Long-Term page they are about.
> **Note (migrated 2026-07-26)**: `Islands/` and `Long-Term/` used to sit at the vault root and were moved under `memorbs/`. memOrb now creates a single folder in the user's vault.
> **Note (resolved 2026-07-28)**: `memorbs/Long-Term/People/` is strictly flat `memorbs/Long-Term/People/{PascalName}.md` (or `{PascalName}/` bundle). Filenames use no-space `PascalCase` (e.g. `AlexChen.md`). Disambiguation for name collisions uses hyphenated PascalCase (`AlexChen-AcmeCorp.md`). Frontmatter `aliases` carries natural display names (`['Alex Chen']`).
> **Note**: `persona.md` and `identity.md` are fixed Hot Cache files (exactly one of each). `Core/` and `Belief/` are folders of orbs (one per file, growing indefinitely). Four distinct roles — do not conflate them.
> **Note**: the `daily-note`, `weekly-retro`, and `session-closeout` skills were removed on 2026-07-26. The timeline role moved to `memorbs/log.md` (below); weekly review is task management rather than memory work; git operations are out of scope for this framework.
> **Note**: the `memorbs/MEMORY.md` whole-vault index was abolished on 2026-07-26. **The filesystem is the index.** A hand-maintained index always drifts from the files — the old linter even had a rule for "orphan pages the index failed to list", which was itself proof of the drift — and the 200-line cap meant it could never scale. Look things up with `ls` plus `grep` over content and `aliases`. Reachability is now guaranteed by **bi-directional links**: every new page must be linked from at least one existing page, and a page nothing links to is an orphan for `memorb-lint` to catch.

## `memorbs/log.md`: the timeline

log.md is this system's only **record of when**. Entity pages under `memorbs/Long-Term/` are living documents that accumulate continuously and cannot reconstruct "what happened in June". OrbTrack is emptied by design. File mtimes change when you fix a typo. So the log is the only thing that holds a period, and `dream-studio`'s replay depends entirely on it.

### Write rules

**Every action that changes vault state leaves an entry**, appended in reverse order at the top of the file (newest first):

```markdown
## [YYYY-MM-DD] {type} | {one-line title}
- 內容：{what happened}
- 影響頁面：[[...]]、[[...]]
- 訊號：{the user's own words; emotion; an unresolved doubt}   ← optional, but this is what the dream feeds on
```

`type` is one of: `ingest` | `triage` | `query` | `decision` | `lint` | `archive` | `island` | `skill` | `dream`

### Why the signal line matters

`dream-studio` finds resonance not in what the system did but in **what the user said and how it felt at the time**. "Something felt off after talking to Vic today" is not an idea and does not deserve an atomic note — but three months later it may be the source of a belief. **Record that kind of unformed signal here and nowhere else; do not force an orb for it.**

Quote the user **verbatim**. A polished paraphrase reads false when the dream replays it months later.

### What does not belong in log.md

- Circulation updates from `memorb-query` (`recall_count` / `last_recalled`) — high volume, no information, and they drown the real signals
- Pure reads that changed no file

### Rotation

When `dream-studio` finishes, it archives the current `log.md` to `memorbs/log/{YYYY-MM}.md` and starts a fresh one with only a header. log.md therefore always holds exactly "since the last dream" and never grows without bound — the way the day's orbs are shipped to long-term storage overnight. Archived periods are kept, never deleted; the dream reads them when the user asks for a longer window.

## Read at the start of every session

Always read `memorbs/HQ/persona.md` and `memorbs/HQ/identity.md` (under 100 lines combined — that is what keeps the Hot Cache cheap). Orbs under `Core/` and `Belief/`, and entity pages under `memorbs/Long-Term/`, are left to `memorb-query` to fetch and backfill as the context requires; never read them wholesale.

## Naming and formatting rules

1. **Dates**: always `YYYY-MM-DD`; weeks as `YYYY-Www` (e.g. `2026-W28`).
2. **OrbTrack filenames**: `{YYYY-MM-DD}-{HHMM}-{Title}.md`.
3. **Frontmatter**: every note carries YAML frontmatter; fields depend on the note type (schemas below).
4. **Language**: note content written into the vault defaults to Traditional Chinese. SKILL.md instructions are English — see `writing-memorb-skills`.
5. **Emoji**: no emoji in non-structural headings; never in top-level folder names.
6. **Report after acting**: always tell the user the file paths you created or updated.
7. **MOC naming**: an Island's entry note is always `000-MOC.md`. Because many folders contain a file by that name, **every link to a MOC uses the full path**: `[[memorbs/Islands/{Name}/000-MOC|{Name}]]`. Entity pages under `memorbs/Long-Term/` default to a single page and need no MOC.

## Entities are singular; events carry dates

This is the easiest rule to get wrong, and getting it wrong either collides on filenames or collapses separate occasions into one page.

| | Entity page | Event orb |
|---|---|---|
| What it is | A person, a company, a project | One thing that happened on one day |
| Where | `memorbs/Long-Term/{People,Orgs,Projects}/` | OrbTrack → filed by content |
| How many | **One entity, one page, forever** (authority control; aliases converge here) | **One per occurrence, never merged** |
| Naming | `{Entity}.md`, no date | `{YYYY-MM-DD}-{Title}`, **the date is part of the name** |

**The date prefix survives triage.** That is the sharpest difference from an entity page, and it is why a recurring event never collides.

Worked example — applying to a role at Acme this year, and to the same role again next year:

```text
memorbs/Long-Term/Orgs/Acme.md              ← only ever one of these
   ├─ links to [[2026-07-26-Acme-資深PM-應徵]]
   └─ links to [[2027-03-11-Acme-資深PM-應徵]]

memorbs/…/2026-07-26-Acme-資深PM-應徵/
   ├── 2026-07-26-Acme-資深PM-應徵.md
   └── JD.pdf
memorbs/…/2027-03-11-Acme-資深PM-應徵/       ← a second orb, not an overwrite
   ├── 2027-03-11-Acme-資深PM-應徵.md
   └── JD.pdf
```

The side effect is a good one: `Acme.md` accumulates a history, so when the user wants to compare the two job descriptions next year, the entity page is the way in.

**Test**: ask "can this happen a second time?" Yes → event orb, dated. No, and it is a thing that persists → entity page, undated.

## Raw material goes in the bundle, not in a folder of its own

Transcripts, clippings, PDFs, scanned cards — **raw material is an attachment of an orb**, not a category of its own. It lives in that orb's bundle folder:

```text
memorbs/HQ/OrbTrack/2026-07-12-1400-與Vic面談/
├── 2026-07-12-1400-與Vic面談.md    ← the orb itself
└── 逐字稿.md                         ← attachment; lives and dies with the orb
```

Lifecycle then takes care of itself: `memorb-forgetter` already moves the entire folder when archiving a bundle orb, so attachments travel with it. No `source:` field, no orphan detection, no shared attachment bucket.

**Documents only**: `.md`, `.txt`, `.pdf`, and images that are document scans (business cards, whiteboards). **Audio and video never enter the vault** — the size ruins both the vault and its git history. Leave recordings outside and record their location and provenance in the orb body.

> This rule replaced three competing mechanisms: `Resources/…/raw/`, `OrbTrack/Attachments/`, and the short-lived `source:` field. All consolidated onto bundles.

## Frontmatter schemas

### Ordinary notes (OrbTrack / Island / standalone orb)

```yaml
---
title: {title}
date: {YYYY-MM-DD}
tags: [...]
status: active   # active | processed | unprocessed | archived
---
```

### `memorbs/Long-Term/` pages (Projects / People / Orgs — Authority Control & Circulation Tracking)

Long-Term pages **must** carry these four fields in addition to the ordinary ones. `memorb-ingest`, `memorb-query`, and `memorb-lint` all read and write them:

```yaml
---
title: {entity name}
tags: [...]
status: active
aliases: []          # nicknames and alternate spellings; authority control uses these to deduplicate, and memorb-lint uses them to spot entities mentioned but covered by no page
orb_emotions: []     # emotion tags accumulated from ingested content: joy / anxiety / fear / sadness / anger / disgust
recall_count: 0      # +1 each time memorb-query reads this page
last_recalled: null  # YYYY-MM-DD of the most recent query hit
---
```

On archive, `memorb-forgetter` adds:

```yaml
status: archived
archived_at: {YYYY-MM-DD}
```

A Long-Term page missing any of these fields is old data: backfill the defaults in place as you read it (`aliases: []`, `orb_emotions: []`, `recall_count: 0`, `last_recalled: null`). No separate migration pass is needed.

### Orb files in `memorbs/HQ/Core/` and `memorbs/HQ/Belief/`

One orb per file:

```yaml
---
title: {orb title}
formed_at: {YYYY-MM-DD}
orb_type: core         # core | belief
derived_from: []       # belief orbs only: link back to the orbs this belief grew out of
---
```

**`derived_from` may point at any orb**, not just Core ones — `[[memorbs/HQ/Core/{slug}]]`, `[[memorbs/Long-Term/Projects/{slug}]]`, and `[[memorbs/Long-Term/People/{slug}]]` are all valid. Most beliefs are assembled from a pile of moments that would not individually qualify as a Core Memory; restricting the field to Core would close off the path they actually take. Core orbs do not use the field (leave it `[]` or omit it).

`persona.md` and `identity.md` are not orbs. They stay ordinary Markdown with minimal frontmatter (`title` / `updated`) and do not follow the schema above. Suggested structure for `identity.md`:

```markdown
## 基本資料
- 姓名：
- 生日：
- 學經歷：
  - {YYYY}–{YYYY} {職稱} @ {組織}
  - {YYYY} 畢業於 {學校}／{科系}

## 自我描述標籤
- MBTI：
- 其他量表／標籤：

## 目前角色與目標


## 關鍵關係
- [[memorbs/Long-Term/People/{Name}|{Name}]]（{關係}）
```

> **Labels like MBTI belong in `identity.md`, never in `Belief/`.** A Belief orb is a sentence the user distilled from their own experience; MBTI is a category an external instrument assigned to them. Mixing the two would let `dream-studio` mistake an external label for a self-derived conclusion when it assesses how beliefs evolved.

## Orb file structure

Every memorb (Core, Belief, Long-Term entity page, or any named orb) uses one of two physical layouts:

| Type | Layout | When to use |
| :--- | :--- | :--- |
| **Plain orb** | `orb-name.md` — a single file | No attachments; self-contained text |
| **Bundle orb** | `orb-name/orb-name.md` plus attachments in the same folder | Has attachments (documents, scans) |

**Rules:**

- The folder and the main Markdown file **always share the same name** — never a generic filename like `memorb.md` inside a bundle folder.
- **Resolution order**: look for `orb-name.md` first; if absent, look for `orb-name/orb-name.md`. Every skill that reads or moves orbs follows this two-step lookup.
- Moving or archiving a bundle orb moves the **entire `orb-name/` folder**, never just the inner `.md`.

## `memorbs/HQ/glossary.md`: Domain terms & acronyms

`glossary.md` is the vault's authority control for terminology, domain acronyms, internal project code words, and team jargon.

### Frontmatter & Format

```yaml
---
title: Glossary
type: glossary
updated: YYYY-MM-DD
---
```

Organized as a markdown table with columns: `| Term | Definition | Aliases | Related Entity |`.
All skills that ingest transcripts or text (`memorb-ingest`, `recording-transcription`) consult and update this file to maintain consistent domain terminology.

## Templates (`memorbs/Templates/`)

Templates live in `memorbs/Templates/`:
- `People Template.md`: Standard layout and frontmatter for people entity pages (`type: person`, `name`, `company`, `role`, `aliases`).
- `Org Template.md`: Standard layout for organization pages (`type: org`, `name`, `industry`, `aliases`).
- `Project Template.md`: Standard layout for project pages (`type: project`, `status`, `target_date`).
- `Core Template.md`: Standard layout for Core orbs.
- `Belief Template.md`: Standard layout for Belief orbs.
- `Persona Template.md`: Standard layout for AI Advisor persona & SOUL (`memorbs/HQ/persona.md`).
- `Identity Template.md`: Standard layout for User profile & identity (`memorbs/HQ/identity.md`).

## Agent Instruction Snippet (`CLAUDE.md`)

memOrb does not overwrite the user's root `CLAUDE.md`. When initialized via `/memorb-born`, it offers to append a non-intrusive, protected block:

```markdown
<!-- memOrb:start -->
# memOrb Instructions
- Memory vault location: `memorbs/`
- Read `memorbs/HQ/persona.md` and `memorbs/HQ/identity.md` at session start.
- Routinely consult `memorbs/HQ/glossary.md` for domain terminology.
<!-- memOrb:end -->
```

## Searching the vault

```bash
grep -r "keyword" "$VAULT/memorbs" --include="*.md" -l            # find files
grep -r "keyword" "$VAULT/memorbs" --include="*.md" -n -B 2 -A 2  # with context
```

## Quick capture into OrbTrack

```bash
DATE=$(date +%Y-%m-%d); TIME=$(date +%H%M)
cat > "$VAULT/memorbs/HQ/OrbTrack/${DATE}-${TIME}-Title.md" << EOF
---
title: Title
date: ${DATE}
tags: [orbtrack]
status: unprocessed
---

# Title

Content
EOF
```
