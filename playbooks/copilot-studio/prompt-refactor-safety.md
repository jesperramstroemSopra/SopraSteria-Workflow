# Prompt Refactor Safety in Copilot Studio Skills

**Domain:** copilot-studio  
**Confidence:** confirmed  
**First observed:** 2026-08-25  
**Last verified:** 2026-08-25

## Trigger

A large prompt/instruction rewrite causes a quality drop, new contradictions, or unstable routing.

## Lesson

Prefer incremental prompt changes over broad rewrites in Copilot Studio skills and instructions.
Large instruction-block rewrites can create hidden conflicts and regressions. Small, single-gap edits
with immediate regression checks are more reliable.

## Guardrail

- Avoid replacing entire instruction sections unless baseline tests pass before and after.
- Apply one change per cycle.
- Re-check behavior immediately after each edit.

## Detection

- Answer quality drops after a prompt refresh.
- Tool or topic/skill choice becomes inconsistent.
- Similar requests start producing different results.

## Recovery

1. Roll back to the last known-good baseline.
2. Verify baseline behavior.
3. Reapply only one surgical change.
4. Run the regression set again.

## Related patterns

- Orchestrator-to-skill contract alignment
- Baseline-first recovery pattern
- Single-fix regression loop
- Worked example saturation management

