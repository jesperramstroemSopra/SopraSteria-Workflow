---
description: Analyze an existing Power Platform project against Sopra architecture guides — evaluates architecture, risk, quality and optimization, and saves a severity-ranked findings report.
argument-hint: What to analyze and what kind of analysis (e.g. "the customer agent, risk and quality")
allowed-tools: Read, Write, Glob, Grep, Bash(pac), Task
---

# Analyze Project

Initial request: $ARGUMENTS

Before any other step, apply the `sw-analyze` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Architect=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Architect (`sopra-solution-architect`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Architect`,
`Next: copilot --agent sopra-workflow:sopra-solution-architect`, and
`Then run: /sopra-workflow:sw-analyze`.

Run the `analyze-project` skill in this plugin (`../../skills/analyze-project/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

Before evaluating anything, **identify which technology and which architecture** you are looking at
— classic vs agentic-loop Copilot Studio, cloud flow vs agent flow. Reviewing one against the
other's rules produces confident nonsense.

Ask the user for project type, analysis type and subject if any is unclear. Save findings to
`.sopra/workflow/analyze-project/` and update `_state.json`. Analyze only — do not fix.
