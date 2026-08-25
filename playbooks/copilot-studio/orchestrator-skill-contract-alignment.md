# Orchestrator-to-Skill Contract Alignment

**Domain:** copilot-studio  
**Confidence:** confirmed  
**First observed:** 2026-08-25  
**Last verified:** 2026-08-25

## Trigger

Mandatory-data failures happen even though a downstream skill or renderer appears to return valid
output.

## Lesson

Agent-level rules, normalizers, and renderers must agree on allowed decision types, ordering, and
required fields. If one layer blocks a decision type another layer expects, the pipeline fails even
when each layer is individually correct.

## Guardrail

- Treat the decision schema as an end-to-end contract.
- Update orchestrator, normalizer, and renderer together.
- Verify the full path after policy edits.

## Detection

- “Missing mandatory data” or equivalent validation errors.
- Output looks correct in isolation but fails in the next stage.
- The same input succeeds in one path and fails in another.

## Recovery

1. Compare the contract each layer expects.
2. Align allowed decision types and ordering.
3. Re-run the whole pipeline, not only the failing stage.

