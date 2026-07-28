---
name: recording-transcription
description: "Turns a manually supplied meeting or one-on-one recording (phone recording, m4a/mp3/wav — anything that is not a Teams meeting) into a reliable transcript. Probes whether local Whisper is usable, normalises and chunks long audio, transcribes in the background with progress polling, converts Simplified to Traditional, and cross-checks names and jargon against the iPhone dictation draft the user supplies — then hands the transcript and interview analysis to memorb-ingest. Use whenever a recording, transcript, transcription, one-on-one, speech-to-text, STT, or m4a file comes up and the source is not a Teams meeting. Depends on memorb-conventions; feeds memorb-ingest. Triggers: recording, transcript, transcription, interview, one-on-one, speech to text, STT, m4a, 錄音, 逐字稿, 轉錄, 面談, 語音轉文字, m4a."
---

# recording-transcription

## Overview

- The audio is **a file the user handed over** (phone, voice recorder, on-site capture) or text draft.
- The result goes to `memorb-ingest` for the impact scan.

## The premise

> A phone recording is the single-microphone problem in another guise: whoever sits near the phone comes through clearly, whoever sits far away may be muffled or talked over. **Do not assume the clear parts are the user speaking.** Work out the speaker from the content — question and answer pairs, forms of address, who owns the topic.

> For a one-on-one with a manager or a colleague, **wording accuracy and timestamps matter more than they do for an ordinary meeting** — anything touching commitments, numbers, or dates should be marked uncertain rather than smoothed over by the model into something that merely reads well.

## Known environment limits (measured 2026-07-12 — read this before you start)

- This sandbox's network allowlist covers package-ecosystem domains such as `pypi.org` and `github.com`, but **not `huggingface.co`**. `pip install faster-whisper` works fine; at run time it wants to fetch model weights from HF and that connection will always fail here. The `check` command detects this up front, so you do not discover it halfway through a background job.
- **Any folder mounted from the real machine is append/overwrite-only — nothing can be deleted.** That covers the vault and the `outputs` scratch folder alike: `rm` on a file you have already written returns `Operation not permitted` (the Write/Edit tools carry the same restriction). The only paths you can freely create and delete in are the sandbox's own, e.g. `/tmp`. So any intermediate file that is supposed to be cleaned up afterwards belongs in `/tmp`, never in the vault or in outputs — put it there and it becomes garbage you can never remove. The vault holds only what is meant to be permanent: the transcript, the analysis, and (if the user confirms they want it kept) the original audio.
- Together these two facts dictate the paths below: **intermediate work files always go to `/tmp`; only the final transcript, analysis, and audio ever reach the vault.**

## Standard workflow

### Step 0: Collect the inputs

- Audio: mp3/m4a/wav/mp4 all work, and several files can be given at once (for example when the recording was paused and restarted — they are concatenated in the order supplied)
- **Strongly encourage the user to attach the device's own speech-to-text draft** (iPhone Notes transcript, live dictation, etc.). In this sandbox that draft is often the only transcript source you can reliably obtain — see the environment limits above. It is not a nice-to-have
- From the user, or inferred from the content: who was present, roughly what date, what the conversation was about

### Step 1: Probe whether local Whisper is usable

```bash
VAULT="$(find /sessions/*/mnt -maxdepth 1 -name "second-brain" -type d | head -1)"
SCRIPT="$VAULT/.claude/skills/recording-transcription/scripts/transcribe.py"
python3 "$SCRIPT" check --model medium
```

- Reports "model already present locally" or "HF reachable, download can be attempted" → go to Step 2A (local transcription)
- Reports "HF unreachable and no local model" → skip Step 2A entirely and go straight to Step 2B (draft-only path). Do not burn time on a background job just to watch it fail

### Step 2A: Local Whisper transcription (when the environment allows)

Environment prerequisites (check these the first time):

```bash
which ffmpeg >/dev/null || echo "需要安裝 ffmpeg"
python3 -c "import faster_whisper" 2>/dev/null || pip install faster-whisper --break-system-packages
python3 -c "import opencc" 2>/dev/null || pip install opencc-python-reimplemented --break-system-packages
python3 -c "import socksio" 2>/dev/null || pip install "httpx[socks]" --break-system-packages
```

Keep the working directory in `/tmp`. **Do not** put it in the vault or in outputs:

```bash
SLUG="2026-07-12-與Vic面談"   # 依實際日期/主題調整
WORKDIR="/tmp/recording-$SLUG"
python3 "$SCRIPT" prepare --input /path/to/audio1.m4a --workdir "$WORKDIR" --chunk-minutes 10
```

Chunking is fixed-length (10 minutes per chunk by default), so a short file simply becomes "1 chunk" — one code path, no special-casing by duration.

```bash
nohup python3 "$SCRIPT" run --workdir "$WORKDIR" --model medium --lang zh > "$WORKDIR/run.log" 2>&1 &
disown
```

A single command invocation has a time limit (roughly 45 seconds), so always run in the background and poll for progress with the command below until it finishes:

```bash
python3 "$SCRIPT" status --workdir "$WORKDIR"
```

> This workdir lives in `/tmp` and is therefore **only valid within this conversation/session** — if the user ends the conversation while the background job is still running, the progress is lost and next time starts from scratch. For a long recording, tell the user roughly how long it will take before you begin, so they can decide whether to keep the window open. Model choice: `medium` is the default balance of accuracy and speed; use `small` when time is short, `large-v3` when accuracy matters more (slower). This is CPU-only (no GPU), so expect a runtime around the length of the recording or worse.

When every chunk is done, merge — and point **`--out` directly at that orb's bundle folder**, because the transcript is an attachment of the orb, not a standalone file:

```bash
ORB="$VAULT/memorbs/HQ/OrbTrack/2026-07-12-1400-與Vic面談"
mkdir -p "$ORB"
python3 "$SCRIPT" merge --workdir "$WORKDIR" --out "$ORB/逐字稿.md"
```

The merge runs OpenCC (`s2twp`) to convert Whisper's Simplified Chinese output into Taiwanese Traditional Chinese — this step cannot be skipped. Once that is done the `WORKDIR` has served its purpose, and `/tmp` can be deleted freely (unlike the vault or outputs):

```bash
rm -rf "$WORKDIR"
```

### Step 2B: Device-draft-only path (when HF is unreachable, or the user gave no audio)

No ffmpeg or Whisper needed. Read in the draft text the user pasted in Step 0, treat it as the transcript base, and hand it to Step 3 for correction, punctuation, and paragraphing. **In the current sandbox this is the path you will usually take. It is not a compromise fallback.**

### Step 3: Correct names and jargon (must be delegated to a subagent)

> **Context window protection**: transcripts routinely run to tens of thousands of characters, so **the main agent is forbidden from reading a full transcript directly**. Use the `invoke_subagent` tool to dispatch a subagent (`research` or `self`) and hand it Step 3 and Step 4 — let the subagent do the reading and correction, then report back with the interview analysis.

1. Load the currently known names, nicknames, project code names, and terminology dynamically from `memorbs/HQ/glossary.md` and every `.md` under `memorbs/Long-Term/People/` (`find "$VAULT/memorbs/Long-Term/People" -name "*.md"` — it must recurse into bundle subfolders, not just scan one level). Do not use a hardcoded dictionary; this list changes constantly
2. It is fine to ask the user who was in the room
3. If both sources exist (local Whisper output plus the phone draft), compare them against each other. Whisper is usually steadier on flow and punctuation; the phone's built-in engine is sometimes more accurate on proper nouns that already exist in the user's contacts or dictionary, names especially. The places where the two disagree are exactly the places that need human confirmation
4. When only one source exists (usually the draft-only path), correct the obvious mis-transcriptions against glossary and people pages — homophone errors like eBao becoming 「e 包／醫保」, or Halu becoming 「哈魯」. **Save the corrections as a separate clean version**; do not overwrite the original draft
5. Mark anything you cannot resolve with `[不確定]`. Do not guess a plausible-sounding word to fill the gap — least of all in sentences about commitments, numbers, or dates

### Step 4: Interview analysis framework

Analyze the conversation using these angles:

| Dimension | What to look for |
|------|------|
| Commitments and follow-ups | What concrete commitments did the other person make? Any numbers, dates, conditions? Accuracy in these passages comes first — see Step 3 |
| Decisions | What was settled in this conversation, and what is still open |
| Feedback and expectations directed at the user | What the other person said, explicitly or by implication, about the user's performance and direction |
| Open questions | Places the transcript is vague and that need a follow-up conversation or message to resolve |
| How it lines up with existing memory | Compare against the existing record of this person in `memorbs/Long-Term/People/` — does this conversation confirm the earlier understanding, or overturn it? |

Before writing the analysis, read the counterpart's existing page under `memorbs/Long-Term/People/` once, so the analysis continues an existing thread instead of starting from zero every time.

### Step 5: File it and hand off to memorb-ingest

The output is **one bundle orb**, everything in the same folder:

```text
memorbs/HQ/OrbTrack/{YYYY-MM-DD}-{HHMM}-與{對象}面談/
├── {YYYY-MM-DD}-{HHMM}-與{對象}面談.md   ← orb 本體：清稿重點＋面談分析
└── 逐字稿.md                              ← 附件
```

> **Audio never enters the vault.** A few hundred MB will drag down both the vault and git, and once written it cannot be deleted. Ask the user where they want to keep it (any path outside the vault is fine) and record that location plus the recording's duration in the orb body. This is the direct application of the `memorb-conventions` rule that only documents go in the vault.

When you are finished, hand off to `memorb-ingest` for the full pipeline (scan the impact on `memorbs/Long-Term/People` and `memorbs/Long-Term/Projects`, write the `log.md` timeline entry, update the active PARA area). This skill's job is only "recording → reliable transcript + first-pass analysis"; it does not duplicate what `memorb-ingest` does.

## Notes

- Transcripts are large. **The main agent must not read the whole file**; Steps 3 and 4 have to be outsourced to a subagent.
- Whisper handles Mandarin mixed with English jargon (eBao, Sprint, and so on) reasonably well. Accuracy drops noticeably where the recording contains Taiwanese, so those passages need a manual pass.
- Recordings may contain sensitive material (personnel, finance, commitments): only the transcript text goes into git, and the original audio is always gitignored.
- **Files written to the vault cannot be deleted afterwards.** For borderline items like the original audio, ask the user once before you write, rather than acting first and apologising later.
- With multiple input files the order matters — pass `--input` in the actual chronological order of the conversation.

## Red Flags

| Excuse | What is actually true |
|------|---------|
| "This sandbox can probably reach HF, just run it" | It demonstrably cannot. Run `check` first instead of waiting for a background job to fail |
| "The file isn't big, I'll just run it in the foreground" | A single command caps out at about 45 seconds. Always run in the background |
| "I'll park the intermediate files in the vault or outputs so I can resume later" | Both are folders mounted from the real machine; once written they cannot be deleted. Intermediate files go in `/tmp` and are thrown away when done |
| "That's roughly what it sounded like, I'll just fill it in" | For commitments, numbers, and dates, mark it uncertain rather than inventing something plausible |
| "Saving the transcript is enough, the analysis can wait" | The Step 4 interview analysis is this skill's core value, not an add-on |
| "Let me stash the original audio in the vault for now" | Vault writes cannot be undone and audio is usually huge. Ask the user whether to keep a copy before writing anything |
