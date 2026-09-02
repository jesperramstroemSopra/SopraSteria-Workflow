---
description: Execute an approved implementation plan — works through tasks in order, makes the changes, and records progress so the work can be resumed after any interruption.
argument-hint: Optional — which plan, or which tasks to start with
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pac), Bash(dotnet), Task
---

# Implement Plan

Initial request: $ARGUMENTS

Before any other step, apply the `sw-implement` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Builder=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Builder (`sopra-solution-builder`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Builder`,
`Next: copilot --agent sopra-workflow:sopra-solution-builder`, and
`Then run: /sopra-workflow:sw-implement`.

Run the `implement-plan` skill in this plugin (`../../skills/implement-plan/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

**Resumability is the point.** After every completed task, update
`.sopra/workflow/implement-plan/progress.md` and `_state.json` before moving on. If this session
dies, the next person must be able to pick up mid-plan without re-deriving anything.

Confirm the plan was reviewed and approved before you start. If it was not, say so and offer
`/sw-review` first. Never invent environment details — ask or read them from the project.
Use `pac` CLI rather than hand-editing generated files; never hand-edit `.mcs/`.
