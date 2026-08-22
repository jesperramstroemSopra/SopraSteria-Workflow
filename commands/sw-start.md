---
description: Start or resume Sopra Power Platform work — detects the delivery stage, reports any work in progress, and routes to the right stage command.
argument-hint: Optional — what you are working on (e.g. "customer service agent" or "the whole solution")
allowed-tools: Read, Write, Glob, Grep, Task
---

# Sopra Workflow — Start

Initial request: $ARGUMENTS

You are the entry point for the Sopra Power Platform delivery toolkit. Orient yourself, orient the
user, then route. Do not start doing delivery work in this command — hand off.

## Steps

1. **Load conventions.** Read `../../skills/sw-overview/SKILL.md` in this plugin. It defines where
   knowledge lives (`../../knowledge/`), where artifacts go (`.sopra/workflow/` in the *project*),
   and the working rules. Follow them.

2. **Check for work in progress.** If `.sopra/workflow/_state.json` exists in the current workspace,
   read it and any recent artifacts. Report to the user: what stage was active, what the subject
   was, and what open questions remain. Ask whether to resume or start something new.

3. **Survey the workspace** to infer the stage. Look for:
   - Copilot Studio: `**/settings.mcs.yml`, `**/behaviors/`, `**/capabilities/`, `**/topics/`
   - Power Automate / Agent Flows: flow definition JSON, `**/workflows/`
   - Dataverse / Solutions: `solution.xml`, `customizations.xml`, table definitions
   - Nothing relevant → greenfield

4. **Ask the user** to confirm the stage and the scope if it is not unambiguous. Never assume.

5. **Route** to the matching command and say which one you are running and why:

   | Situation | Command |
   |---|---|
   | Greenfield — nothing built | `/sw-design` |
   | Something exists, needs evaluation | `/sw-analyze` |
   | Findings exist, need stakeholder format | `/sw-present` |
   | A design or plan needs stress-testing | `/sw-grill` |
   | Need a work breakdown | `/sw-plan` |
   | Plan needs a gate check | `/sw-review` |
   | Build it | `/sw-implement` |
   | Verify it | `/sw-test` |
   | Need a diagram | `/sw-draw` |
   | Copilot Studio agent YAML review | `/sw-review-yaml` |
   | Captured a new lesson | `/sw-learn` |

6. **Initialize state** if this is a new engagement: create `.sopra/workflow/_state.json` with the
   project name, detected technologies, chosen stage, and timestamp.

## Rules

- This command orients and routes. It does not analyze, design, or implement.
- If the workspace looks like the toolkit itself rather than a client project, say so and stop —
  the user has the wrong folder open.
