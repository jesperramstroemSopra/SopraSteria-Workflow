---
name: implement-plan
description: "Execute an approved implementation plan. Works through tasks in order, makes changes, tracks progress, and saves progress artifacts so work can resume if interrupted."
argument-hint: "<optional: specific task ID to start from>"
user-invocable: true
---

# Implement Plan

You are the implementation stage of the Sopra workflow pipeline. Your job is to execute an approved plan, make real changes, and track progress persistently.

## Inputs you need

1. **Approved plan** — read from `.sopra/workflow/create-plan/` for the latest plan. Also check `.sopra/workflow/review-plan/` for the review verdict.
2. If the plan was rejected (❌), tell the user to fix the plan first.
3. If no plan exists, tell the user to run `create-plan` first.
4. **Resume point** — check `.sopra/workflow/implement-plan/` for any existing progress file. If one exists, resume from where it left off.

## What you do

1. **Load the plan and review.** Confirm the plan is approved (✅ or ⚠️).

2. **Load Sopra guides** relevant to the work:
   - Read the architecture docs referenced in the plan tasks.
   - Follow naming conventions from `../../knowledge/shared/naming-conventions.md`.
   - Follow environment patterns from `../../knowledge/shared/environment-strategy.md`.
   - Follow `../../knowledge/shared/execution-provider-routing.md` and
     `../../knowledge/shared/operator-output-contract.md`.

3. **Run capability preflight.**
   - This stage is owned by **Sopra Solution Builder**.
   - Identify the required Microsoft specialist, Power Automate/FlowAgent skill, Power CAT skill,
    MCP server, PAC command, or local tool for each task.
   - Verify availability and authentication before promising live execution.
   - If a required provider is unavailable, mark the task blocked; do not substitute advisory output
    and call it implemented.

4. **Obtain scoped confirmation.**
   - Confirm before the first batch of local implementation-file edits.
   - Confirm separately before live writes, pulls that merge files, pushes, publishes, imports,
    deployments, permission/connection changes, and destructive actions.
   - State operation, target, impact, and rollback. One approval does not cover the next boundary.

5. **Execute tasks in order:**
   - Work through phases sequentially (Phase 1 → 2 → 3 → 4).
   - Within a phase, respect task dependencies.
   - For each task:
     a. Mark it as `in_progress` in the progress file.
     b. Make the actual changes (edit files, create files, configure settings).
     c. Validate the change (run any available checks).
     d. Mark it as `done` in the progress file.
     e. Save progress to disk immediately.

6. **Track progress persistently.** After each task, update the progress artifact so work can resume if interrupted.

7. **Handle decision points.** When reaching a task that requires user input:
   - Stop and ask the user.
   - Record the decision in the progress file.
   - Continue after receiving the answer.

8. **Handle failures.** If a task fails:
   - Mark it as `blocked` with the error details.
   - Continue with independent tasks if possible.
   - Report blocked tasks at the end.

## Output artifact

Save/update continuously to: `.sopra/workflow/implement-plan/progress-{timestamp}.md`

Format:
```markdown
# Implementation Progress
## Plan Reference: [path to plan file]
## Started: [timestamp]
## Last Updated: [timestamp]

## Task Progress
| ID | Title | Status | Notes |
| fix-error-handling | Adding error handling | ✅ done | Added scope-based try/catch |
| add-auth-config | Configuring auth | 🔄 in_progress | Waiting for user decision |
| add-tests | Writing tests | ⏳ pending | Depends on auth config |

## Decisions Made
| Decision | User Choice | Timestamp |

## Files Changed
| File | Change Type | Task ID |

## Blocked Items
## Execution Providers and Evidence
## Confirmations
## Summary
```

## Rules

- Save progress after EVERY completed task — never lose work.
- Follow the Sopra architecture guides referenced in each task.
- Do not skip tasks or change the order unless a dependency requires it.
- If you hit something the plan didn't anticipate, note it in the progress file and ask the user.
- Keep the progress file as the single source of truth for what's been done.
- For Copilot Studio, use current `mcs-assistant` Architect for modern authoring/migration,
  Describer for inventory, Init/Manage for workspace lifecycle, and Manage for pull/push/publish.
  Current `mcs-assistant` has no Test/Advisor profile; use only separately verified supported
  providers and never route silently to the superseded plugin.
- Return the operator dashboard defined in `operator-output-contract.md`.

## Reference examples

Use the Microsoft CAT agent skills gallery to improve implementation workflow patterns:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use the examples for workflow shape and task handling, while keeping implementation Sopra-specific.
