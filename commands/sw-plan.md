---
description: Turn findings, designs or grill feedback into an actionable implementation plan with sequenced tasks, dependencies, effort and priorities.
argument-hint: What to plan (e.g. "fix the critical findings from the last analysis")
allowed-tools: Read, Write, Glob, Grep, Task
---

# Create Plan

Initial request: $ARGUMENTS

Before any other step, apply the `sw-plan` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Architect=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Architect (`sopra-solution-architect`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Architect`,
`Next: copilot --agent sopra-workflow:sopra-solution-architect`, and
`Then run: /sopra-workflow:sw-plan`.

Run the `create-plan` skill in this plugin (`../../skills/create-plan/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

Read the relevant prior artifacts in `.sopra/workflow/` first — analysis findings, design records,
grill output. Ask about constraints you cannot infer: deadline, team size, environment access,
release windows, and what is explicitly out of scope.

Every task needs a verifiable done-condition. "Improve error handling" is not a task. Sequence by
real dependency, not by wishful ordering. Save to `.sopra/workflow/create-plan/`.
