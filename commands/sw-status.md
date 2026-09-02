---
description: Report where the current project stands in the Sopra workflow — active stage, completed stages, artifacts produced, open questions and the recommended next step.
argument-hint: Optional — a specific stage to report on
allowed-tools: Read, Glob, Grep
---

# Workflow Status

Initial request: $ARGUMENTS

Before any other step, apply the `sw-status` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: every Sopra agent=`Compatible`. This read-only command has no exclusive owner.

Report the state of the Sopra workflow for the currently open project. Read only — change nothing.

## Steps

1. Read `.sopra/workflow/_state.json` if it exists. If it does not, say the workflow has not been
   started here and suggest `/sw-start`.

2. List every stage folder under `.sopra/workflow/` with the artifacts it contains and their
   timestamps.

3. Read the most recent artifact from the active stage and extract:
   - what was decided or found
   - what is still open
   - anything explicitly blocked
   - active agent and execution provider
   - pending confirmations

4. Present a compact status:

   | Stage | Status | Latest artifact | Date |
   |---|---|---|---|

   Then: **provider capability**, **pending confirmations**, **open questions**, **blockers**, and a
   single **recommended next action** with its owning agent or command.

5. If artifacts are inconsistent with `_state.json` — for example a plan exists but state says
   analysis — say so plainly rather than papering over it.

## Rules

- Never modify files. This is a read-only report.
- Do not re-run analysis to fill gaps; report the gap instead.
- Follow `../../knowledge/shared/operator-output-contract.md`.
