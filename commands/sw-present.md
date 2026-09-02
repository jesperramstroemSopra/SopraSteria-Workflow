---
description: Reformat the latest analysis into a clean, stakeholder-ready report suitable for sharing with a customer or steering group.
argument-hint: Optional — which analysis, and the audience (e.g. "latest, for the customer CTO")
allowed-tools: Read, Write, Glob, Grep
---

# Present Analysis

Initial request: $ARGUMENTS

Before any other step, apply the `sw-present` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Primary`; every other Sopra agent=`Blocked`. The owner is
Sopra Delivery Lead (`sopra-delivery-lead`). Confirmation cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Delivery Lead`, `Next: copilot --agent sopra-workflow:sopra-delivery-lead`,
and `Then run: /sopra-workflow:sw-present`.

Run the `present-analysis` skill in this plugin (`../../skills/present-analysis/SKILL.md`). Follow
the conventions in `../../skills/sw-overview/SKILL.md`.

Read the most recent artifact in `.sopra/workflow/analyze-project/` unless the user names another.
Ask who the audience is — a technical lead and a customer sponsor need very different documents.

Strip internal jargon. Lead with impact and cost, not with file paths. Save to
`.sopra/workflow/present-analysis/`.
