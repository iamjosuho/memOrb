---
name: writing-memorb-skills
description: "Meta skill for adding or changing any sub-skill in this vault. Governs naming, frontmatter, structure, the registration checklist, and testing. Triggers: add a skill, write a skill, modify a skill, turn this into a skill, we keep doing this by hand, 新增 skill, 寫一個 skill, 修改 skill, 固化流程, 這個流程以後常做."
---

# Writing Memorb Skills (Meta)

> The counterpart to superpowers' writing-skills. Any procedure run by hand more than twice should be frozen into a skill.

## When to add a skill

- A workflow has been executed manually more than twice
- A section of CLAUDE.md keeps growing (CLAUDE.md is capped at 100 lines; workflow detail belongs in a skill)
- The user asks for one outright

## Skill structure

1. **Location**: `skills/{kebab-case-name}/SKILL.md` (flat, never nested)
2. **Frontmatter**: exactly two fields, `name` and `description`
   - `description` must carry: a one-line statement of purpose + `觸發詞：...` + any prerequisite dependency
   - Trigger phrases are the words the user will actually say, Traditional Chinese leading (see **Language** below)
3. **Body** (take what the skill needs):
   - Order of operations (numbered steps, with the hard rules called out)
   - Path and format specification tables
   - A Red Flags table (excuse vs. reality) — treat this as mandatory for workflow skills
   - `*(待固化：...)*` to mark the parts that are not settled yet
4. **Single responsibility**: one skill, one job; if it straddles domains, split it and have the halves reference each other

## Registration checklist (no step is optional)

1. Create or modify the `SKILL.md`
2. Update the router table in `memorb/SKILL.md` (add a row: skill name + when it triggers)
3. Update `plugin.json` (the `skills` array has to list it, or the linter blocks you)
4. If this touches CLAUDE.md's Skills Registry or its workflow summary, update those in step (keep it ≤100 lines)
5. Append to `memorbs/log.md`: `## [YYYY-MM-DD] skill | 新增/修改 {name}`

> git operations are outside this framework's remit; the user decides when to commit.

## Language

Three audiences, three languages, and they do not overlap:

- **SKILL.md instruction bodies are English.** Contributors who install this plugin read them, not just the author who wrote them.
- **`description` trigger phrases stay bilingual.** Routing matches against what the user actually says, and the user speaks Traditional Chinese — so list both, English phrases and the Chinese ones side by side.
- **Content written into the vault stays Traditional Chinese.** That covers sample notes, filenames, and output templates, which is exactly why they sit inside fenced code blocks.

`scripts/lint-skills.js` enforces this by measuring the CJK ratio of the body — frontmatter and fenced code blocks excluded from the count — against a 10% ceiling. A ratio, not zero, so an inline term or a quoted trigger word does not trip the check.

## Testing

- Once a new skill is written, simulate a triggering scenario and walk the steps end to end, confirming the paths and commands actually run
- Run `npm run lint` (equivalent to `node scripts/lint-skills.js`): it checks frontmatter validity, that the router table and the `skills/` directory agree (no orphan skill left unregistered in `plugin.json`), that the fixtures structure still matches the SSOT, and that no stale old-path spellings survive
- On `git commit` the same linter runs again through `scripts/git-hooks/pre-commit` (installed by `scripts/install-hooks.sh`, hooked up automatically by the `prepare` script during `npm install`). Any error blocks the commit outright, so you find out immediately instead of a round later from a human

### When the architecture is renamed (folder renames, namespaces retired)

Add the old spelling to the `DEPRECATED_PATTERNS` list in `scripts/lint-skills.js` (pattern, suggested replacement, reason). From then on every `npm run lint` and every commit sweeps all the Markdown under `skills/`, `fixtures/`, and `README.md` for references that were never migrated — no more grepping the whole repo by hand each time.

## Red Flags

| Excuse | Reality |
|------|---------|
| "The skill is written, I'll add it to the router table later" | Not in the router table = never triggered. No step of the registration checklist is optional. |
| "The description can be sloppy, the body is what matters" | Routing fires on the description's trigger phrases. Get them wrong and the skill never runs. |
| "It's faster to just put the rule straight into CLAUDE.md" | CLAUDE.md is the schema layer (capped at 100 lines); workflows belong in skills. |
| "For this rename I'll only touch the files the user pointed at" | If the old spelling never makes it into `DEPRECATED_PATTERNS`, the next time you fall in the same hole you are back to grepping the whole repo by hand. |
