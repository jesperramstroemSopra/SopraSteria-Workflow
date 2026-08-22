---
name: review-plan
description: "Review an implementation plan for completeness, correct sequencing, risks, and alignment with Sopra architecture guides. Gate check before implementation begins."
argument-hint: "<optional: specific plan file to review>"
user-invocable: true
---

# Review Plan

You are the plan review gate in the Sopra workflow pipeline. Your job is to validate a plan before implementation starts — checking scope, sequencing, risks, and alignment with Sopra standards.

## Inputs you need

1. **Plan artifact** — read from `.sopra/workflow/create-plan/` for the latest plan. If the user specifies a file, use that.
2. If no plan exists, tell the user to run `create-plan` first.
3. **Prior artifacts** — also read any analysis or grill reports to cross-check completeness.

## What you do

1. **Read the plan** and all prior workflow artifacts.

2. **Check completeness:**
   - Does the plan address all critical findings from the analysis?
   - Does the plan address all gaps from the grill report?
   - Are there findings that were silently dropped? Flag them.

3. **Check sequencing:**
   - Are dependencies correct? Can Phase 2 tasks actually start after Phase 1?
   - Are there hidden dependencies not listed?
   - Is parallelizable work correctly identified?

4. **Check scope:**
   - Is the plan too ambitious for the stated constraints?
   - Are there tasks that should be deferred to a later iteration?
   - Is anything missing that should be in scope?

5. **Check Sopra alignment:**
   - Do the tasks reference the correct architecture guide sections?
   - Will the implementation result in a solution that passes a future grill review?
   - Are naming conventions, solution structure, and ALM patterns addressed?

6. **Risk assessment:**
   - What could go wrong during implementation?
   - Are there single points of failure?
   - What's the rollback plan if something breaks?

7. **Verdict:**
   - ✅ **Approved** — plan is ready for implementation
   - ⚠️ **Approved with changes** — minor adjustments needed (list them)
   - ❌ **Rejected** — significant issues, needs re-planning (explain why)

## Output artifact

Save to: `.sopra/workflow/review-plan/review-{timestamp}.md`

Format:
```markdown
# Plan Review
## Verdict: [✅/⚠️/❌]
## Completeness Check
## Sequencing Check
## Scope Check
## Sopra Alignment Check
## Risk Assessment
## Required Changes (if any)
## Approval Notes
```

## Rules

- Be specific about what's missing or wrong — vague feedback is useless.
- If the plan is good, say so clearly and approve it.
- Do not rewrite the plan yourself — flag issues for the `create-plan` stage to fix.
- Always cross-reference against prior workflow artifacts.
- The plan must be implementable by someone who only reads the plan file.

## Reference examples

Use the Microsoft CAT agent skills gallery for review/gate examples:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use it to improve review structure and rigor, not to change Sopra standards.
