---
name: session-closeout
description: "Mandatory session termination ritual: write Daily Note summary, log skill usage, update log.md, and git commit/push. Triggers: 對話結束, 收尾, 結束前, commit, 存檔收工. Auto-execute at the end of every session."
---

# Session Closeout Skill

> **Mandatory session termination ritual**. Failing to run this means the conversation leaves no memory in the vault.

## Execution Sequence

1. **Daily Note Summary** (per `daily-note` rules):
   - Ensure today's Daily Note exists (`Daily Notes/{YYYY}/{MM}/{YYYY}-{MM}-{DD}.md`); create if missing.
   - Append 3-6 line summary under `## 💬 與 AI 的對話紀錄` (or `## 與 AI 的對話紀錄`) detailing what was done, decided, produced.
   - Append skill usage tag on the last line: `使用 skill：{name, name}` (or `無`).
2. **log.md**: If this session produced ingest / decision / lint events not yet logged, append entry to `memorbs/log.md`.
3. **Git Commit & Push**:
   ```bash
   cd "$VAULT"
   git add -A
   git commit -m "session: {one-line summary} ({YYYY-MM-DD})"
   git push
   ```
4. Confirm closeout completion briefly to the user (1-2 sentences).

## Red Flags

| Rationalization | Reality |
| :--- | :--- |
| *"Short session, no summary needed"* | Any substantive operation or decision must be logged. Skip only for casual chat. |
| *"Committed but didn't push, push later"* | `push` is mandatory. Local commit is incomplete. |
| *"Wrote summary but forgot skill tags"* | Skill tags are required for lint usage statistics. |
