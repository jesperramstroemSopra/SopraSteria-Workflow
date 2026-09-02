---
description: Gate-check an implementation plan before work starts — verifies completeness, sequencing, risk coverage and alignment with Sopra architecture guides.
argument-hint: Optional — which plan to review (defaults to the latest)
allowed-tools: Read, Write, Glob, Grep, Task
---

# Review Plan

Initial request: $ARGUMENTS

Before any other step, apply the `sw-review` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Architect=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Architect (`sopra-solution-architect`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Architect`,
`Next: copilot --agent sopra-workflow:sopra-solution-architect`, and
`Then run: /sopra-workflow:sw-review`.

Run the `review-plan` skill in this plugin (`../../skills/review-plan/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

This is a **gate**. End with an explicit verdict: approved, approved with conditions, or rejected —
and say exactly what must change to pass. A review that always approves is worthless.

Check for the usual killers: no rollback path, ALM ignored, environment/licensing assumptions
unvalidated, tasks that cannot be tested, dependencies in the wrong order.
Save to `.sopra/workflow/review-plan/`.
