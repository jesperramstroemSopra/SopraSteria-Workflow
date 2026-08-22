---
name: implement-plan
description: "Execute an approved implementation plan. Works through tasks in order, makes changes, tracks progress, and saves progress artifacts so work can resume if interrupted."
argument-hint: "<optional: specific task ID to start from>"
user-invocable: true
---

# Implement Plan

You are the implementation stage of the Sopra workflow pipeline. Your job is to execute an approved plan, make real changes, and track progress persistently.

## Inputs you need

1. **Approved plan** — read from `.goals/workflow/create-plan/` for the latest plan. Also check `.goals/workflow/review-plan/` for the review verdict.
2. If the plan was rejected (❌), tell the user to fix the plan first.
3. If no plan exists, tell the user to run `create-plan` first.
4. **Resume point** — check `.goals/workflow/implement-plan/` for any existing progress file. If one exists, resume from where it left off.

## What you do

1. **Load the plan and review.** Confirm the plan is approved (✅ or ⚠️).

2. **Load Sopra guides** relevant to the work:
   - Read the architecture docs referenced in the plan tasks.
   - Follow naming conventions from `shared/naming-conventions.md`.
   - Follow environment patterns from `shared/environment-strategy.md`.

3. **Execute tasks in order:**
   - Work through phases sequentially (Phase 1 → 2 → 3 → 4).
   - Within a phase, respect task dependencies.
   - For each task:
     a. Mark it as `in_progress` in the progress file.
     b. Make the actual changes (edit files, create files, configure settings).
     c. Validate the change (run any available checks).
     d. Mark it as `done` in the progress file.
     e. Save progress to disk immediately.

4. **Track progress persistently.** After each task, update the progress artifact so work can resume if interrupted.

5. **Handle decision points.** When reaching a task that requires user input:
   - Stop and ask the user.
   - Record the decision in the progress file.
   - Continue after receiving the answer.

6. **Handle failures.** If a task fails:
   - Mark it as `blocked` with the error details.
   - Continue with independent tasks if possible.
   - Report blocked tasks at the end.

## Output artifact

Save/update continuously to: `.goals/workflow/implement-plan/progress-{timestamp}.md`

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
## Summary
```

## Rules

- Save progress after EVERY completed task — never lose work.
- Follow the Sopra architecture guides referenced in each task.
- Do not skip tasks or change the order unless a dependency requires it.
- If you hit something the plan didn't anticipate, note it in the progress file and ask the user.
- Keep the progress file as the single source of truth for what's been done.

## Reference examples

Use the Microsoft CAT agent skills gallery to improve implementation workflow patterns:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use the examples for workflow shape and task handling, while keeping implementation Sopra-specific.
