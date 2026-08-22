---
description: Define and run a test protocol for the implemented solution — builds test cases, executes what can be automated, and produces a test report.
argument-hint: What to test (e.g. "the supplier onboarding agent end to end")
allowed-tools: Read, Write, Glob, Grep, Bash(pac), Bash(node), Task
---

# Test Solution

Initial request: $ARGUMENTS

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
