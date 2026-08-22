---
name: workflow-skills
description: "Reusable Sopra workflow stages for analyze, present, grill, plan, review, implement, and test. Use this to start at any stage and persist artifacts for restartable work."
argument-hint: "<stage or project focus>"
user-invocable: true
---

# Sopra Workflow Skills

Use this skill set for restartable, file-backed workflow runs across Power Platform work.

## Available stages

- `analyze-project`
- `present-analysis`
- `grill-me`
- `create-plan`
- `review-plan`
- `implement-plan`
- `test-solution`

## Workflow rules

1. Start from any stage if needed.
2. Always write artifacts to disk.
3. Use the shared docs in `copilot-studio/`, `power-automate/`, `dataverse/`, `solutions/`, and `shared/`.
4. Keep project type and analysis type explicit.
5. Preserve progress so the run can resume later.

## Artifact layout

```text
workflow/
  analyze-project/
  present-analysis/
  grill-me/
  create-plan/
  review-plan/
  implement-plan/
  test-solution/
```

## Upstream reference

<!-- Internal Sopra workflow skill package. Pair with the workflow-skills extension in .github/extensions. -->
