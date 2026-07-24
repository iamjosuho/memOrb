---
name: daily-note
description: "Create or update Daily Notes. Triggers: 今日日記, 開啟日記, daily note, 日誌, 隨記, 寫進今天的筆記, 對話紀錄. Prerequisite: vault-conventions."
---

# Daily Note Skill

## Path Rule (Mandatory)

Daily Notes MUST reside at `Daily Notes/{YYYY}/{MM}/{YYYY}-{MM}-{DD}.md` (**nested YYYY/MM/ subdirectories, not flat**).

## Creation Flow

If today's file does not exist, `mkdir -p` and create with the following structure (matching `Templates/Daily Note Template.md`):

```markdown
---
date: {YYYY-MM-DD}
day: {Weekday}
tags: [daily]
---

# {YYYY-MM-DD} {Weekday}

## 今日意圖
> 今天最重要的一件事是什麼？

## 任務
- [ ]

## 筆記 / 想法


## 💬 與 AI 的對話紀錄


## 今日連結


## 今日回顧
**完成了什麼？**

**學到什麼？**

**明天繼續？**
```

## Update Rules

1. **Append or fill sections only**; never overwrite existing content.
2. Summarize conversation under `## 💬 與 AI 的對話紀錄` (or `## 與 AI 的對話紀錄`); if section is missing, insert before `## 今日連結`.
3. Last line MUST tag skill usage: `使用 skill：{name, name}` (or `無`) for lint tracking.
4. For full closeout workflow, see `session-closeout`.

## Red Flags

| Rationalization | Reality |
| :--- | :--- |
| *"Create directly under Daily Notes/ root"* | Must be inside `YYYY/MM/` subfolder. |
| *"File should exist, write directly"* | Always check existence first; create if missing. |
