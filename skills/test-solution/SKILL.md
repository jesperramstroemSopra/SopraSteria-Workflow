---
name: test-solution
description: "Define and execute a test protocol for the implemented solution. Creates test cases, runs checks, documents results, and produces a test report artifact."
argument-hint: "<what to test and scope>"
user-invocable: true
---

# Test Solution

You are the testing stage of the Sopra workflow pipeline. Your job is to define a test protocol, execute it, and produce a persistent test report.

## Inputs you need

1. **Implementation progress** — read from `.sopra/workflow/implement-plan/` to understand what was changed.
2. **Original plan** — read from `.sopra/workflow/create-plan/` for the expected outcomes.
3. **Analysis and grill reports** — read from `.sopra/workflow/analyze-project/` and `.sopra/workflow/grill-me/` for the original findings.
4. **Project type** — determines which test approaches apply.

## What you do

1. **Define test cases.** For each completed task in the implementation progress:
   - **TC-ID**: test case identifier (e.g., `TC-001`)
   - **Description**: what is being tested
   - **Type**: `validation`, `functional`, `integration`, `regression`, `convention`
   - **Steps**: specific steps to verify
   - **Expected result**: what success looks like
   - **Actual result**: filled in during execution
   - **Status**: `pass`, `fail`, `skip`, `blocked`

2. **Include standard Sopra checks** based on project type:

   **Copilot Studio:**
   - Trigger phrases don't overlap between topics
   - System topics (Greeting, Fallback, Escalate, Error) are customized
   - Auth model matches deployment target (Teams = Integrated)
   - Knowledge sources are scoped appropriately
   - Variables follow naming conventions

   **Power Automate:**
   - Error handling scopes present on all flows with 3+ actions
   - No personal user connections in non-DEV environments
   - Flow names follow `[ENV]-[Domain]-[Action]-[Version]` pattern
   - Environment variables used instead of hardcoded URLs
   - Connection references are solution-aware

   **Dataverse:**
   - Table names follow publisher prefix convention
   - Security roles follow least-privilege principle
   - Plugins have proper error handling and telemetry
   - Solution layering is correct (no cross-solution dependencies)

   **Solutions/ALM:**
   - Solution exports cleanly (no missing dependencies)
   - Managed solution imports without errors
   - Environment variables are defined for all config values
   - Connection references resolve in target environment

3. **Run capability preflight.**
   - This stage is owned by **Sopra Solution Verifier**.
   - For Copilot Studio, use the current `mcs-assistant` `/chat` capability for applicable point
     checks and a separately verified supported provider for evaluations. Current `mcs-assistant`
     has no Test agent.
   - For Power Automate solution review, prefer Power CAT Overflow.
   - For live Dataverse checks, use approved read-only MCP tools.
   - If the provider is unavailable, create the test protocol but mark execution `blocked`.

4. **Execute tests.** Run each test case:
   - For file-based checks: read and validate the files
   - For convention checks: compare against `../../knowledge/shared/naming-conventions.md`
   - For structural checks: verify against architecture guides
   - For functional checks: describe what manual verification is needed

5. **Produce the test report.**

## Output artifact

Save to: `.sopra/workflow/test-solution/test-report-{timestamp}.md`

Format:
```markdown
# Test Report
## Project: [name]
## Date: [timestamp]
## Scope: [what was tested]

## Summary
| Status | Count |
| ✅ Pass | X |
| ❌ Fail | X |
| ⏭️ Skip | X |
| 🚫 Blocked | X |

## Test Cases
| TC-ID | Description | Type | Status | Notes |

## Detailed Results
### TC-001: [description]
- Steps: ...
- Expected: ...
- Actual: ...
- Status: ✅/❌
- Evidence: [file paths or screenshots]

## Failed Tests — Required Actions
## Providers and Evidence
## Blocked or Unverified Tests
## Recommendations
## Verdict: [Ready for deployment / Needs fixes / Not ready]
```

## Rules

- Every implemented change must have at least one test case.
- Include both positive tests (it works) and negative tests (it handles failure).
- Reference Sopra guide sections when testing conventions.
- Be honest about what can be verified automatically vs. what needs manual testing.
- Save the report to disk — it's the audit trail for this workflow run.
- If tests fail, recommend running `create-plan` again for the fixes, then re-implementing.
- Obtain confirmation before creating live test data or performing any test-side mutation.
- Follow `../../knowledge/shared/execution-provider-routing.md` and return the operator dashboard
  defined in `../../knowledge/shared/operator-output-contract.md`.

## Reference examples

Use the Microsoft CAT agent skills gallery when designing tests and validation output:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use it as a structure reference for testing flow and clarity.
