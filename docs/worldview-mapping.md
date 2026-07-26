# 🎬 Worldview Mapping

How memOrb's architecture maps onto the mental geography of a certain animated film — and which established method does the mechanical work at each layer.

The film supplies the **goal and the vocabulary**. Three borrowed methods supply the **mechanics**:

| Layer | Method | Origin |
| :--- | :--- | :--- |
| The unit | Atomic notes | Zettelkasten / Niklas Luhmann |
| The shelves | PARA | Tiago Forte, *Building a Second Brain* |
| The weeding | MUSTY criteria | CREW method, Joseph P. Segal, Texas State Library |

Read the tiers bottom-up: an orb is made, shelved, recalled, weeded — and what survives becomes part of who you are.

---

## Tier 1 · Substance — how an orb is made and shelved

| Film component | memOrb | How it works | Skill |
| :--- | :--- | :--- | :--- |
| **Memory Orb** | One memorb = one `.md` | Atomic note: one idea, self-contained, bi-directional links. Every named page is an orb — Core, Belief, and Long-Term entity pages included. | — |
| **Orb Generator Ramp** | The AI session itself | Experiences, meetings, and decisions roll out as orbs after cognitive processing. Every state-changing action also leaves a dated entry on the timeline. | `memorb-ingest` |
| **Ramp landing bay** | `memorbs/HQ/OrbTrack/` | Staging only. Holds **distilled** orbs awaiting triage — not a dumping ground for raw input. Emptied by triage, never left to accumulate. | `orbtrack-triage` |
| **The timeline** | `memorbs/log.md` | The only layer that records *when*. Entity pages are living documents with no per-event dates and OrbTrack is emptied by design, so neither can reconstruct a period. Each entry carries a **signal** line — the user's own unpolished words for something that mattered but wasn't shaped enough to become an orb. | all write skills append here |
| **Memory Ingest Worker** | The act of **distilling** | Crystallizes raw material (transcripts, articles, PDFs) into orbs, then encodes and shelves them. | `memorb-ingest` |
| **Long-Term Shelves** | `Long-Term/` + `Resources/` | Library classification: three shelves to start (People, Projects, Orgs), growing organically as OrbTrack clusters reveal recurring themes. | `memorb-conventions` |

> **On `Resources/`** — conceptually part of the Long-Term Shelves, but it stays at the vault root and keeps its own structure. `Long-Term/` holds *authority records* (one entity per page, with aliases and recall metrics); `Resources/` holds *the documents themselves*. Same library, different apparatus.

---

## Tier 2 · Circulation — recall and weeding

| Film component | memOrb | How it works | Skill |
| :--- | :--- | :--- | :--- |
| **Recall Tube** | Pull orbs back into working context | Authority Control: `aliases` resolve alternate names, `recall_count` and `last_recalled` track circulation — visible in the page itself, not hidden in an index. | `memorb-query`, `memorb-domain-query` |
| **Forgetter (Mind Worker)** | Patrol the shelves, flag, then archive | MUSTY weeding: **M**isleading, **U**gly, **S**uperseded, **T**rivial, **Y**our collection doesn't need it. Flagging and archiving are decoupled — lint reports, forgetter executes, user approves. | `memorb-lint` → `memorb-forgetter` |
| **Memory Dump** | `memorbs/Dump/{category}/` | Where faded, superseded, and pruned orbs come to rest. PARA's Archives. Nothing is deleted, only relocated — with wiki-links repaired. | `memorb-forgetter` |
| **Dream Studio** | Monthly replay of the timeline | Finds recurring themes and proposes revisions to Core and Belief orbs, then archives the period's log to `memorbs/log/{YYYY-MM}.md` and starts a fresh one — the way the day's orbs get shipped to long-term storage overnight. Monthly, not nightly. See Tier 3. | `dream-studio` |

---

## Tier 3 · Identity — how memory becomes a person

This is the tier that separates memOrb from a filing system. Everything above helps you *retrieve*. This tier keeps an account of who you are becoming.

| Film component | memOrb | How it works |
| :--- | :--- | :--- |
| **Headquarters** | The current AI session context | Where you and the agent actually think. `persona.md` and `identity.md` are the Hot Cache loaded into HQ at the start of every session (together under 100 lines). |
| **The Emotions at the console** | `memorbs/HQ/persona.md` | The crew operating Headquarters — the AI advisor's tone, role, and how it talks to you. |
| **Sense of Self** | `memorbs/HQ/identity.md` | Who the user is: background, goals, key relationships, and self-descriptive attributes (MBTI and similar labels belong here, not in `Belief/`). |
| **Core Memory Slot** | `memorbs/HQ/Core/` | One orb per file. Formative experiences that drive the Islands. |
| **Belief System** | `memorbs/HQ/Belief/` | One orb per file. Value and principle statements distilled from lived experience. |
| **Islands of Personality** | `Islands/` | Long-term domains of responsibility and interest. Narrative layer only — current state, goals, section notes, MOC — with wiki-links out to the entity pages in `Long-Term/`. PARA's Areas. |

### Core vs. Belief — two different mechanisms

These are easy to conflate and shouldn't be. In the film they run on separate machinery, and memOrb keeps the distinction:

| | Core Memory | Belief |
| :--- | :--- | :--- |
| **Formed by** | A single, significant emotional experience | The resonance of *many* orbs accumulating over time |
| **Where** | Locked into the console at Headquarters | Grown in the pool beneath Headquarters |
| **Drives** | Islands of Personality | Sense of Self |
| **Expresses** | Outward behaviour and interests | Inward identity and self-worth |
| **Example** | One hockey game won | "I am brave" |

The practical consequence: **a Belief orb can be derived from any orbs, not only from Core orbs.** Most beliefs are assembled from a pile of unremarkable moments, none of which would qualify as a Core Memory on its own — and that accumulation is the whole point. The `derived_from` field accepts links to any orb.

```yaml
---
title: {orb title}
formed_at: {YYYY-MM-DD}
orb_type: belief          # core | belief
derived_from:             # belief orbs only — link to any orbs
  - "[[memorbs/HQ/Core/{slug}]]"
  - "[[Long-Term/Projects/{slug}]]"
---
```

### Where the Dream Studio fits

Distillation ends at *Evaluate* — the step where accumulated orbs update Core, Belief, and the Islands. That step is what turns a filing system into a record of a person, and `dream-studio` is its sole executor:

1. **Replay** — read `memorbs/log.md` in full (the timeline since the last dream), plus OrbTrack and the existing Core/Belief set
2. **Find resonance** — surface recurring themes, each with its sources cited
3. **Propose a Core orb** — a single event, with emotional weight, **and a behaviour change afterwards**; the third test is what separates a formative experience from a strong feeling
4. **Propose or revise a Belief** — a first-person sentence backed by two or more independent source orbs
5. **Update Island narrative** — refresh the current-state section of the MOC
6. **Rotate the timeline** — archive `log.md` to `memorbs/log/{YYYY-MM}.md` and open a fresh one, so "since the last dream" is always exactly what the log contains

Every write is confirmed item by item, never as a batch, and the user's own wording always wins over the agent's. Beliefs are never deleted outright — they are marked superseded and retired through `memorb-forgetter` with the reason recorded. `memorbs/HQ/Core/` has exactly one writer: this skill.

---

## PARA alignment

| PARA | memOrb |
| :--- | :--- |
| **P**rojects | `Long-Term/Projects/` |
| **A**reas | `Islands/` |
| **R**esources | `Resources/` *(user-native, untouched)* |
| **A**rchives | `memorbs/Dump/` |

`orbtrack-triage` runs the PARA decision tree when emptying the staging bay.

---

## Not mapped

Listed for completeness — these have no memOrb counterpart and none is promised:

- **Train of Thought** — the mind's internal transport
- **Imagination Land** — speculative and counterfactual thinking
- **The Subconscious** — where troublesome memories are kept out of reach
- **Mind Workers beyond the Forgetter** — the wider maintenance crew

Removed *(all 2026-07-26)*:

- `memorbs/MEMORY.md` — a hand-maintained index of what the filesystem already knows. Any index maintained by hand drifts, and the 200-line cap meant it could never scale with the vault. Lookup is now `ls` plus `grep`; reachability is guaranteed by bi-directional links, and an unlinked page is simply an orphan for the linter to catch

- `session-closeout` — handled real-time writes and git operations, which sit outside the memory framework and overlapped with distillation
- `daily-note` — a dated bucket holding many unrelated ideas is the opposite of an atomic note. The timeline role it was really performing moved to `memorbs/log.md`, which does it better: structured entries, a signal field, and automatic rotation
- `weekly-retro` — task management (done / not done / next week's intentions) rather than memory work, and overlapping with `dream-studio`'s periodic review

---

## Attribution

memOrb is an independent open-source project. It is not affiliated with, endorsed by, or sponsored by Pixar or The Walt Disney Company; the cognitive metaphors above are used descriptively.

The **MUSTY** criteria come from the CREW method (*CREW: A Weeding Manual for Modern Libraries*, Joseph P. Segal, Texas State Library and Archives Commission). **PARA** is Tiago Forte's, from *Building a Second Brain*. **Atomic notes** derive from the Zettelkasten practice associated with Niklas Luhmann.
