---
description: Start or resume Sopra Power Platform work — detects the delivery stage, reports any work in progress, and routes to the right stage command.
argument-hint: Optional — what you are working on (e.g. "customer service agent" or "the whole solution")
allowed-tools: Read, Write, Glob, Grep, Task
---

# Sopra Workflow — Start

Initial request: $ARGUMENTS

Before any other step, apply the `sw-start` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Primary`; every other Sopra agent=`RoutingOnly`. The owner is
Sopra Delivery Lead (`sopra-delivery-lead`). Confirmation cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Delivery Lead`, `Next: copilot --agent sopra-workflow:sopra-delivery-lead`,
and `Then run: /sopra-workflow:sw-start`.

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

4. **Ask the user** to confirm the stage and the scope only if it is genuinely ambiguous which
   stage/command applies (e.g. it's unclear whether this is greenfield or something already exists).
   Do **not** ask the clarifying questions that belong to the next stage itself (e.g. don't ask
   design-scoping questions like delivery targets, trigger types, or integration details — that is
   `/sw-design`'s job, not this command's).

5. **Recommend** the matching command, state why in one or two sentences, and **stop**:

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

   Do not run the recommended command yourself, and do not begin any part of its work (no scoping
   questions, no drafts, no state beyond what step 6 requires). Wait for the user to explicitly run
   the recommended command or otherwise direct you before doing anything further.

6. **Initialize state** if this is a new engagement, once you have stopped at the recommendation.
   Use the contract in `../../knowledge/shared/copilot-agent-operating-model.md`: project, active
   stage/agent, status, detected technologies and architecture, execution provider capability,
   latest artifact, pending confirmations, blockers, open questions, next action, and timestamp.
   Recording state is bookkeeping, not doing the next stage's work — it must not include answers to
   questions the user hasn't been asked yet.

## Rules

- This command orients, recommends, and stops. It does not analyze, design, plan, implement, or ask
  the next stage's clarifying questions — that begins only once the user runs that stage's command.
- If the workspace looks like the toolkit itself rather than a client project, say so and stop —
  the user has the wrong folder open.
- Run capability preflight before promising live execution and follow the operator output contract.
