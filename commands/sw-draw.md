---
description: Generate a self-contained interactive HTML architecture diagram for any Power Platform scope — a full solution, selected flows, agents, Dataverse tables, or a combination.
argument-hint: What to diagram (e.g. "the whole solution" or "the onboarding agent and its tools")
allowed-tools: Read, Write, Glob, Grep, Task
---

# Draw Architecture

Initial request: $ARGUMENTS

Before any other step, apply the `sw-draw` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Architect=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Architect (`sopra-solution-architect`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Architect`,
`Next: copilot --agent sopra-workflow:sopra-solution-architect`, and
`Then run: /sopra-workflow:sw-draw`.

Run the `draw-architecture` skill in this plugin (`../../skills/draw-architecture/SKILL.md`). Follow
the conventions in `../../skills/sw-overview/SKILL.md`.

Ask what scope to draw and who will look at it. A diagram for a developer and a diagram for a
customer steering group are not the same diagram.

Read the actual project files — never draw an idealized architecture that does not match what is
really there. If something is inferred rather than observed, mark it as inferred.

Save the HTML to `.sopra/workflow/draw-architecture/` and tell the user the exact path.
