---
description: Report where the current project stands in the Sopra workflow — active stage, completed stages, artifacts produced, open questions and the recommended next step.
argument-hint: Optional — a specific stage to report on
allowed-tools: Read, Glob, Grep
---

# Workflow Status

Initial request: $ARGUMENTS

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

4. Present a compact status:

   | Stage | Status | Latest artifact | Date |
   |---|---|---|---|

   Then: **open questions**, **blockers**, and a single **recommended next command**.

5. If artifacts are inconsistent with `_state.json` — for example a plan exists but state says
   analysis — say so plainly rather than papering over it.

## Rules

- Never modify files. This is a read-only report.
- Do not re-run analysis to fill gaps; report the gap instead.
