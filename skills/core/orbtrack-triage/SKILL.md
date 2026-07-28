---
name: orbtrack-triage
description: "Empty OrbTrack, the capture zone, and file every note where it belongs under PARA. Triggers: triage OrbTrack, process OrbTrack, clear the capture zone, sort my notes, archive, move notes, empty the inbox, 整理 OrbTrack, 處理 OrbTrack, 整理收集區, 分類筆記, 歸檔, 搬移筆記, 清空收集箱, 整理."
---

# OrbTrack Triage Skill

## Principle

OrbTrack is a **staging area** and nothing more — unprocessed, awaiting classification — at `memorbs/HQ/OrbTrack/`. A triage pass is done when OrbTrack is empty, or holds nothing but items that are genuinely still undecided.

## Workflow

1. List what is sitting in OrbTrack. **A bundle orb (a folder shaped `{name}/{name}.md`) is one item and moves as a whole** — never split it apart, because attachments have to travel with their orb:
   ```bash
   ls "$VAULT/memorbs/HQ/OrbTrack/"
   ```
2. **Route the special types first**:
   - Business card images → `business-card-ingestion`
   - Audio recordings or transcripts (m4a/mp3/wav or text transcripts) → `recording-transcription` / `memorb-ingest`
   - Material with learning value → move it, then run `memorb-ingest` over it as well
3. Take the ordinary notes one at a time and move each along the PARA decision tree:

| Judgement | Destination | PARA |
|------|------|------|
| Has a firm deadline or deliverable | `memorbs/Long-Term/Projects/` | **P** |
| An area of responsibility or interest you keep coming back to | `memorbs/Islands/` | **A** |
| Reference material, study notes | a single orb under `memorbs/Islands/{相關島}/`, linked from that Island's MOC | **R** |
| Information about a particular person or organization | `memorbs/Long-Term/{People,Orgs}/` | — |
| Finished, or no longer relevant | `memorbs/Dump/{category}/` | **Ar** |

> **PARA's R gets no folder of its own.** An Island is already defined as an area of responsibility **or interest**, so a subject you care about simply *is* an Island, and reading notes are orbs hanging off it. When no Island fits, ask the user whether to start one (hand off to `island-reclamation`) — do not carve out a new folder just to give one note somewhere to sit.

4. Once the top-level PARA bucket is settled, confirm each folder level below it in turn, recursing down until you reach the file itself.
5. Work through the OrbTrack files, break their content down by category, and decide which destination files each part belongs to.
6. A single OrbTrack file often carries material for several PARA buckets at once. Ask the user how they want it handled, and come with a recommendation.
7. When you move it (`mv`), update the frontmatter: `status: unprocessed` → `status: processed` (or whichever status fits).
8. If the note carries new information about a person, project, or term, add bi-directional links and backfill the corresponding page under `memorbs/` (see step 3 of `memorb-ingest`).

## Red Flags

| Excuse | Reality |
| ---------------------------- | ----------------------------------------------- |
| "OrbTrack is basically where notes live, leaving it there is fine" | OrbTrack is a staging area for material that has not been classified yet, and a triage pass is only finished when it is empty. Anything left sitting there is invisible to every other skill — `memorb-query` looks on the shelves, not in the staging bay. |
| "This one doesn't obviously fit any Island, I'll invent a folder for it" | PARA's R has no folder of its own by design. Either it belongs to an existing Island, or the user needs a new Island — ask, and hand off to `island-reclamation`. |
| "Rough classification is fine, the filename doesn't matter" | Filenames and date formats must conform to `memorb-conventions`. |
| "I'll just file this business card image directly" | Business cards go through `business-card-ingestion`'s Page Bundle flow. |
