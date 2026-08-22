---
description: Turn findings, designs or grill feedback into an actionable implementation plan with sequenced tasks, dependencies, effort and priorities.
argument-hint: What to plan (e.g. "fix the critical findings from the last analysis")
allowed-tools: Read, Write, Glob, Grep, Task
---

# Create Plan

Initial request: $ARGUMENTS

Run the `create-plan` skill in this plugin (`../../skills/create-plan/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

Read the relevant prior artifacts in `.sopra/workflow/` first — analysis findings, design records,
grill output. Ask about constraints you cannot infer: deadline, team size, environment access,
release windows, and what is explicitly out of scope.

Every task needs a verifiable done-condition. "Improve error handling" is not a task. Sequence by
real dependency, not by wishful ordering. Save to `.sopra/workflow/create-plan/`.
