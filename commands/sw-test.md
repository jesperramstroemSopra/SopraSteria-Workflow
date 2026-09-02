---
description: Define and run a test protocol for the implemented solution — builds test cases, executes what can be automated, and produces a test report.
argument-hint: What to test (e.g. "the supplier onboarding agent end to end")
allowed-tools: Read, Write, Glob, Grep, Bash(pac), Bash(node), Task
---

# Test Solution

Initial request: $ARGUMENTS

Before any other step, apply the `sw-test` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Verifier=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Verifier (`sopra-solution-verifier`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Verifier`,
`Next: copilot --agent sopra-workflow:sopra-solution-verifier`, and
`Then run: /sopra-workflow:sw-test`.

Run the `test-solution` skill in this plugin (`../../skills/test-solution/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

Derive test cases from the plan's done-conditions and the analysis findings — not from what the
code happens to do. Cover the unhappy paths: auth failure, empty results, throttling, timeouts,
missing permissions.

For agentic-loop Copilot Studio agents, remember the agent must be **published** before it can be
tested via the agenticruntime endpoint, and assertions must tolerate non-deterministic phrasing —
assert on facts and tool calls, not exact wording. See
`../../knowledge/copilot-studio/patterns/testing-strategy.md`.

Record actual results, including failures. Save to `.sopra/workflow/test-solution/`.
