---
name: dream-studio
description: "The dream studio: once a month, replay the timeline in memorbs/log.md, find the themes that keep recurring, propose new Core orbs and new or revised Belief orbs, refresh the current-state narrative on each Island, and finally rotate the timeline. Sole executor of Evaluate, the last step of the distillation pipeline, and the only writer to memorbs/HQ/Core/. Triggers: dream, dream studio, replay my memories, review my memories, who have I become lately, have my beliefs changed, update core memory, Core orb, take stock of my beliefs, 做夢, 夢工廠, 重播記憶, 整理記憶, 我最近變成什麼樣的人, 我的信念有變嗎, 更新核心記憶, 盤點信念. Offer it proactively when more than a month has passed since the last run. Depends on: memorb-conventions."
---

# Dream Studio (Memory Replay and Self-Update)

> In the film, the dream studio spends the night re-cutting the day's footage and staging it. memOrb's dream studio does the same job: replay the orbs a stretch of time has accumulated, see which themes keep coming back, and decide whether to let them settle into core memories and beliefs.
>
> This is the sole executor of step 5 of the distillation pipeline, **Evaluate**. Other skills record, query, and retire; only this one touches `memorbs/HQ/Core/`, `memorbs/HQ/Belief/`, and the current-state narrative on an Island.
>
> **Iron rule: stages 1-3 are analysis and discussion only. Write nothing to any Core, Belief, or Island file until the user has confirmed it item by item.** Rewriting a person's sense of who they are is not something you do automatically.

## How often to run

**Monthly.** Do not run it daily — the value of the dream comes from looking back after time has passed, and running it too often mistakes an ordinary day for a formative experience. Each run rotates `log.md` (see stage 5), so "since the last dream" is already the natural replay window.

## Order of operations

### Stage 1: Set the replay window (talk only)

1. Whatever is in `memorbs/log.md` *is* "since the last dream" — rotation guarantees it, so there is no interval to compute.
2. Read the file header to confirm the start date and check it with the user. For a longer window, also pull the back issues in `memorbs/log/{YYYY-MM}.md`.
3. The user may want to dream about one particular Island or one particular event; narrowing the scope is allowed.

### Stage 2: Replay (gathering the footage)

| Source | Path | What to take |
|------|------|--------|
| **Current timeline** | `memorbs/log.md` | **The whole thing — this is the primary material.** Pay particular attention to each entry's signal line: the user's own words and the emotion behind them |
| Past timelines | `memorbs/log/{YYYY-MM}.md` | Only when the user asks for a longer window |
| Capture zone | `memorbs/HQ/OrbTrack/` | Whatever has not been triaged yet |
| The current self | `memorbs/HQ/Core/`, `memorbs/HQ/Belief/`, `memorbs/HQ/identity.md` | **All of it** (the volume is small); this is the baseline you compare against |
| Island current state | `memorbs/Islands/*/000-MOC.md` | The current-state section, to check whether it has gone stale |
| Related entity pages | `memorbs/Long-Term/` | **Only the pages `log.md` actually named.** Never scan the whole vault |

> `Daily Notes/` is the user's own folder and core does not depend on it. **Read it as supplementary material if it exists, skip it if it does not** — the replay does not fail either way.

### Stage 3: Find the resonance (analysis only, no writes)

Work through the material and produce a candidate list. Every judgement must be evidenced, not impressionistic.

**Core orb candidates** — all of the following:

1. A single concrete event, with a time and a setting you can name (not a diffuse state like "busy month")
2. Clear emotional intensity at the time
3. **Behaviour changed afterwards** — this is the decisive one. An intense event that changed no behaviour is emotion, not a formative experience
4. It points at at least one existing Island. If it points at none, ask the user whether an Island is missing (hand off to `island-reclamation`) rather than forcing it somewhere

**Belief orb candidates** — all of the following:

1. It can be written as one first-person sentence ("when I don't have enough information, I'd rather act and correct course")
2. It is supported by **two or more independent source orbs**, and those sources need not be Core — most beliefs accumulate out of small things that would never qualify as Core individually
3. It is not a label applied by an external instrument (MBTI, star signs, test results all belong in `identity.md`)

**Signals that an existing Belief needs revising:**

| Signal | Suggested handling |
|------|---------|
| New material confirms it again | Reinforce: add the new sources to `derived_from` |
| The wording no longer matches the actual behaviour | Revise the wording, keep `formed_at`, and add a paragraph in the body explaining how it shifted |
| Multiple pieces of contradicting evidence appear | **Raise it for discussion; do not just change it.** Retiring a belief is a serious act — see stage 5 |

**Signals that an Island's current state is stale**: the current-state section of its MOC does not match what actually happened during the period (the main focus has moved on, the goal has been reached or abandoned).

### Stage 4: Dream report plus item-by-item confirmation (Gate, mandatory)

Present the report in conversation. **Every item is confirmed separately** — never bundled into a single "shall I do all of the above?":

```markdown
## 🌙 夢境報告：{起始日} – {結束日}

### 反覆出現的主題
1. {主題}（出現於 {n} 處：{來源清單}）

### 提議新增 Core orb
- **{標題}** ｜ {YYYY-MM-DD} ｜ 指向 [[memorbs/Islands/{名稱}/000-MOC]]
  - 事件：
  - 事後的行為改變：
  - 為什麼夠格：

### 提議新增／修訂 Belief orb
- **新增：{一句話陳述}**
  - 來源：[[...]]、[[...]]
- **修訂：{既有 orb}** — 現行「{舊}」→ 建議「{新}」，理由：

### 建議更新的 Island 現況
- [[memorbs/Islands/{名稱}/000-MOC]]：{哪一段過時了、建議怎麼改}
```

The user may accept items one at a time, reword them, or reject everything. **A sentence the user wrote always beats one you drafted** — the belief is theirs, not yours.

### Stage 5: Write (confirmed items only)

1. **Core orb**: `memorbs/HQ/Core/{YYYY-MM-DD}-{slug}.md`, frontmatter per `memorb-conventions` (`orb_type: core`, no `derived_from`). The body records the event itself and the change in behaviour. Do not wax lyrical.
2. **Belief orb**: `memorbs/HQ/Belief/{slug}.md`, `orb_type: belief`, with `derived_from` listing full-path links to **every** source orb.
3. **Revising an existing Belief**: leave `formed_at` untouched and add an evolution note to the body stating the date, what changed, and on what evidence.
4. **Retiring a belief**: never delete it. Mark the body `狀態：已被 [[新 orb]] 取代` first, and only after the user agrees hand it to `memorb-forgetter` to move into `memorbs/Dump/`. The reason for retirement must be written on the Dump page.
5. **Island current state**: edit only the current-state section of `000-MOC.md`; leave the rest of the page alone.
6. Confirm every new orb is linked from somewhere: a Core orb needs an Island that links back to it, a Belief orb needs its `derived_from` sources. There is no index file; reachability rests entirely on links.
7. **Rotate the timeline** (the dream studio's exclusive duty — no other skill may do this):
   ```bash
   mkdir -p "$VAULT/memorbs/log"
   mv "$VAULT/memorbs/log.md" "$VAULT/memorbs/log/{起始月 YYYY-MM}.md"
   ```
   Then create a fresh, empty `memorbs/log.md` whose header records this dream's conclusions as the starting point of the new period:
   ```markdown
   # Timeline — since {YYYY-MM-DD}

   ## [YYYY-MM-DD] dream | 重播 {起始日}–{結束日}
   - 新增 Core：[[...]]
   - 新增／修訂 Belief：[[...]]
   - 更新 Island：[[...]]
   - 封存上期：[[memorbs/log/{YYYY-MM}]]
   ```
   Past issues are always kept, never deleted.

### Stage 6: Verify

- Every new Belief's `derived_from` links resolve to real files (check with grep)
- Every new Core orb has an Island linking back to it
- `memorbs/log/{YYYY-MM}.md` exists and is complete, and the new `log.md` has been created
- Report the list of paths actually written back to the user

## Red Flags

| Excuse | What is actually true |
|------|---------|
| "The resonance is obvious, just create the Core orb" | Stage 4 is the iron rule. Core orbs drive Islands; get one wrong and the whole island's narrative tilts. |
| "It was an emotional month, that counts as formative" | Intense emotion with no subsequent change in behaviour is just emotion. Criterion 3 is not skippable. |
| "The user has been low lately, write them an encouraging belief" | Beliefs are distilled from evidence, not from pep talks. A fabricated belief pollutes someone's identity — far worse than polluting their notes. |
| "This old belief looks false now, delete it" | Beliefs are not deleted. Run the retirement process and keep the reason. In the film, a belief torn out by the roots is a disaster scene, not routine maintenance. |
| "The user's wording is rough, polish it into a better sentence" | Use the user's own words. A polished belief reads like somebody else's. |
| "While I'm at it, I'll assess the user's personality" | Summarize the material; do not diagnose and do not judge character. The only admissible evidence is what the user wrote themselves. |
| "Running it daily would be more timely" | Monthly. Running too often mistakes ordinary days for formative experiences and dilutes what a Core orb means. |
| "This Core orb has no matching island, leave it for now" | A Core orb that points at no Island is an orphan. Ask whether a new Island is needed and hand off to `island-reclamation`. |
| "I'll tidy up OrbTrack while I'm here" | Out of scope — that belongs to `orbtrack-triage`. The dream studio reads; it does not move things. |
| "log.md is getting long, trim the old parts" | Rotation moves it into `memorbs/log/`; it does not delete it. Past timelines are the only thing that can reconstruct what was going on back then. |
| "This period's log.md is thin, skip the rotation" | Rotate anyway. Skipping it misaligns the next window's boundary, and the dream studio will re-read material it already processed. |
