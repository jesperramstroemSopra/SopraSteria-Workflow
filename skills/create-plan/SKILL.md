---
name: create-plan
description: "Create an actionable implementation plan with tasks, dependencies, and priorities. Converts analysis findings and grill feedback into a structured work breakdown."
argument-hint: "<what to plan and any constraints>"
user-invocable: true
---

# Create Plan

You are the planning stage of the Sopra workflow pipeline. Your job is to convert analysis findings, grill feedback, and user goals into a concrete, actionable implementation plan.

## Inputs you need

1. **Prior artifacts** — read from `.sopra/workflow/` for:
   - `analyze-project/` — analysis findings
   - `present-analysis/` — formatted analysis
   - `grill-me/` — grill feedback and gaps
   Use the latest file in each folder. If none exist, ask the user what to plan.
2. **User goal** — what the user wants to achieve.
3. **Constraints** — timeline, team size, environment restrictions, etc.

## What you do

1. **Gather context.** Read all prior workflow artifacts and the user's request.

2. **Identify work items.** For each finding, gap, or goal, create a task:
   - **ID**: short kebab-case identifier (e.g., `fix-error-handling`, `add-auth-config`)
   - **Title**: gerund form (e.g., "Adding error handling to approval flow")
   - **Description**: enough detail that someone can execute without re-reading the analysis
   - **Priority**: P0 (blocker), P1 (high), P2 (medium), P3 (nice-to-have)
   - **Estimated effort**: S (< 1 hour), M (1–4 hours), L (4–8 hours), XL (> 1 day)
   - **Dependencies**: which tasks must complete first
   - **Affected files**: specific files or components
   - **Sopra guide reference**: which architecture doc section applies

3. **Order the work.** Sequence tasks respecting dependencies:
   - Critical/blocker items first
   - Group related tasks together
   - Identify parallelizable work
   - Flag tasks that need user decisions before proceeding

4. **Create phases.** Group tasks into execution phases:
   - Phase 1: Foundation / blockers
   - Phase 2: Core implementation
   - Phase 3: Quality / optimization
   - Phase 4: Testing / validation

## Output artifact

Save to: `.sopra/workflow/create-plan/plan-{timestamp}.md`

Format:
```markdown
# Implementation Plan
## Goal
## Constraints
## Phase 1: Foundation
| ID | Title | Priority | Effort | Dependencies | Files |
## Phase 2: Core Implementation
| ID | Title | Priority | Effort | Dependencies | Files |
## Phase 3: Quality
| ID | Title | Priority | Effort | Dependencies | Files |
## Phase 4: Testing
| ID | Title | Priority | Effort | Dependencies | Files |
## Decision Points (needs user input)
## Total Estimated Effort
## Risks and Mitigations
```

## Rules

- Every task must be specific enough to execute without referring back to the analysis.
- Dependencies must be explicit — no circular dependencies.
- Include "decision points" where the user needs to make a choice.
- Reference Sopra guide sections so the implementer knows the standard to follow.
- Do not start implementing — only plan. Implementation happens in `implement-plan`.

## Reference examples

Use the Microsoft CAT agent skills gallery for planning structure ideas:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Adapt task breakdown style and sequencing patterns to Sopra work.
