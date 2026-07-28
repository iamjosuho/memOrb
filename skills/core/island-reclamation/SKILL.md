---
name: island-reclamation
description: "The full procedure for adding an Island (a domain of long-term responsibility or interest): first agree with the user on what the Island is and at what level to name it, then pick a folder structure, then get the first batch of files confirmed — and only then create anything, finishing with a memory-layer sync. Triggers: new island, start an island, new domain, new interest, long-term goal, I'm taking on something long-term, add a topic to my second brain, 新增 Island, 開一個 Island, 新的領域, 新的興趣, 長期目標, 我要開始經營/負責某件事, 把某主題加進第二大腦. Applies whenever the user wants a new folder under memorbs/Islands/, even if the word Island is never spoken. Depends on: memorb-conventions. Hands off to: memorb-ingest."
---

# Island Reclamation (Adding a Personality Island)

> An Island is one of the personality islands in the user's head — Hockey Island, in the film. It stays above water only as long as memories keep coming to visit it: a domain of responsibility or interest that has to be maintained, not a task that ends when it is finished. Name it too narrowly and you will rename it the day the tools change, breaking every link; name it too broadly and it becomes a junk drawer; mistake a Project for an Island and it can never be closed. And a standing island still has to be lived in — when nobody visits, it cracks apart and slides into the sea, exactly as in the film. In this vault that collapse has a name: `memorb-forgetter` sweeping the pages into `memorbs/Dump/`.
> Hence the iron rule of this workflow: **stages 1-3 are conversation only. Create no file and no folder until the user has confirmed.**

## Order of operations

### Stage 1: Agree on what the Island is (talk only)

An Island is a **domain of responsibility or interest whose standard must be maintained indefinitely** — not a product, not a tool, not a goal with a finish line. Converge with the user on three questions:

1. **Island or Project?** If it has a definable finished state (pass the certification, ship the system) it is a Project: open it under `memorbs/Long-Term/Projects/` and link it back to the relevant Island. Only something maintained without end — health, finances, a standing responsibility, a lasting interest — is an Island.
2. **What level to name it at.** Too narrow (a specific instrument, tool, or platform: `台指期`, `Notion`) and the name expires the moment the tool does. Too broad (`人生`, `理財`) and everything ends up inside it. Find the middle by asking: "will this name still hold in five years?" and "what standard am I actually maintaining here?"
   - Worked example: the user wants to trade TAIEX futures. The Island lands on `主動交易與投資` — the craft transfers, the instrument is only today's choice, and passive investing is deliberately left out.
3. **How it relates to existing Islands.** Run `ls "$VAULT/memorbs/Islands"` first and check for overlap. If a domain already covers it, extend that Island rather than opening a new one.

### Stage 2: Decide the structure (talk only)

Lay out the options and give a recommendation. Judge on expected note volume, whether the domain will spawn projects, and how much structure the user likes.

| Option | Structure | Fits when |
|------|------|------|
| **A — Fixed sections** | One note per standing section (e.g. `系統與策略` / `風險管理` / `心理` / `行政`) | The knowledge can be classified in advance; the user likes high structure |
| **C — Flat, MOC-driven** | No subfolders at all; the `000-` MOC organizes everything through `[[links]]` | The shape of the notes is hard to predict; flexibility matters more |
| **A+C hybrid (recommended default)** | Fixed section notes plus a MOC entry point; one-off notes (reading, retros) sit flat and hang off the MOC by link | You want both; sections can be added in place as volume grows, drifting gradually toward A |

(The old "B — nested classification" — project, reference, and archive subfolders under each Island — is retired. Projects always live in `memorbs/Long-Term/Projects/` and relate to Islands by link, never by physical nesting; archiving always goes through `memorbs/Dump/`.)

> Islands absorb both PARA's **A** (areas of responsibility) and its **R** (subjects of long-term interest), so reading notes and study material are just single orbs hanging off the relevant Island. There is no separate folder for reference material.

How the hybrid works in practice: knowledge belonging to a standing section goes into that section's note; anything one-off becomes its own file and is reached from the MOC; notes specific to one topic or instrument take a prefix (`台指期-商品規格.md`).

### Stage 3: Confirm the first batch of files (Gate, mandatory)

1. **Propose the sections, do not settle them yourself.** Draft 3-6 candidates for the domain, each with a one-line description, and let the user **multi-select** — use AskUserQuestion with multiSelect if the tool is available, otherwise list them and ask the user to pick and add their own. A section the user proposes always outranks one you drafted.
2. Once the sections are fixed, list the complete batch for final sign-off: folder name, `000-MOC.md`, the name of each section note, and any topic-prefixed notes.
3. **Nothing is created until the user says yes.**

### Stage 4: Create the files

1. Folder: `$VAULT/memorbs/Islands/{Name}/`
2. MOC: the filename is **always `000-MOC.md`** — the fixed entry-point convention shared across Islands and Projects. Any skill or agent that lands in the folder reads `000-MOC.md` first and gets the whole domain at once, and the `000-` prefix keeps it at the top of a sorted listing. Frontmatter:
   ```yaml
   ---
   title: {Island 名稱}
   tags: [island, moc]
   created: {YYYY-MM-DD}
   ---
   ```
   Because the vault holds many files called `000-MOC.md`, **every wiki link to a MOC uses the full path** — `[[memorbs/Islands/{Island 名稱}/000-MOC|{Island 名稱}]]` — so the name is never ambiguous.
   Contents: scope of responsibility; current state (including where the effort is going right now); **the reasoning behind the name and the structure** (why this name, why this layout — months later, during a lint or a review, this is the single most valuable paragraph on the page); a guide to the section notes as `[[links]]`; a related-projects area pointing at companion projects in `memorbs/Long-Term/Projects/`; an index of the standalone notes; and a maintenance checklist.
3. Section-note frontmatter:
   ```yaml
   ---
   title: {板塊名}
   date: {YYYY-MM-DD}
   tags: [island, {領域 tag}]
   status: active
   ---
   ```
   Each one opens with a line quoting its way back to the MOC: `> 入口：[[memorbs/Islands/{Island 名稱}/000-MOC|{Island 名稱} MOC]]`. The body carries the skeleton and its prompts only — invent no content.
4. If the domain has a concrete short-term goal ("build and validate the trading system"), suggest the user open a companion project note under `memorbs/Long-Term/Projects/`. The Project tracks progress, the Island holds the knowledge; when the project is archived the knowledge stays behind.

### Stage 5: Sync the memory layer (following `memorb-ingest`)

1. Append an entry at the top of `memorbs/log.md`: `## [YYYY-MM-DD] island | 建立 Island「{名稱}」`, carrying a summary of the naming and structure decisions plus the affected pages. Anything the user voiced during the discussion — a worry, an expectation — goes in the signal field.
2. Confirm the new Island's MOC is linked from at least one existing page. There is no index file; reachability rests entirely on links.

### Stage 6: Verify

- Every `[[link]]` in the MOC resolves to a real filename (check with grep)
- Every file has complete frontmatter
- Report the list of paths back to the user

## Red Flags

| Excuse | What is actually true |
|------|---------|
| "The user was perfectly clear, just build it" | Stages 1-3 are the iron rule. The cost of getting the naming level wrong is every link breaking later. |
| "This goal sounds like an Island" | Anything with a finish line is a Project. Ask "what would count as done?" first. |
| "Create the files now, adjust the structure later" | Renaming a folder breaks every wiki link. The structure conversation has to happen before anything is written. |
| "The memory sync can wait until next time" | The naming and structure rationale is written into the MOC on the spot, not backfilled. `log.md` cannot wait either — a late entry no longer matches the real creation date, and the dream replay loses a segment. |
| "Let me pre-fill the section notes with a bit of content" | Skeletons belong to the skill, content belongs to the user. Invented content pollutes the second brain. |
| "I'll just decide the sections for the user" | Sections are the classification the user has to maintain for years. They go through propose-then-multi-select, always. |
| "While I'm here I'll fix the router table / another skill" | Out of scope. Report problems in other skills back to the user; changes go through the `writing-memorb-skills` process. |
