---
description: Design a new Power Platform solution from scratch — explores requirements, proposes architecture options with trade-offs, and produces a documented design decision record.
argument-hint: What you want to build (e.g. "agent that handles supplier onboarding")
allowed-tools: Read, Write, Glob, Grep, WebFetch, Task
---

# Design a Solution

Initial request: $ARGUMENTS

Before any other step, apply the `sw-design` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Architect=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Architect (`sopra-solution-architect`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Architect`,
`Next: copilot --agent sopra-workflow:sopra-solution-architect`, and
`Then run: /sopra-workflow:sw-design`.

Run the `design-solution` skill in this plugin (`../../skills/design-solution/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

This is the **greenfield** stage. Nothing is built yet, or a new capability is being added to an
existing solution. Your job is to turn a vague ambition into a defensible architecture.

Do not skip the requirements interview. Do not present a single option as if it were the only one.
Write the design decision record to `.sopra/workflow/design-solution/` before you finish.
