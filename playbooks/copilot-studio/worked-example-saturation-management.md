# Worked Example Saturation Management

**Domain:** copilot-studio  
**Confidence:** confirmed  
**First observed:** 2026-08-25  
**Last verified:** 2026-08-25

## Trigger

Examples initially help, then new regressions appear as more examples are added.

## Lesson

Keep examples minimal, non-overlapping, and mapped to one target failure each. Too many overlapping
examples compete for precedence and can confuse behavior.

## Guardrail

- Prefer targeted examples plus explicit precedence rules.
- Avoid large example catalogs unless the precedence is intentionally designed.

## Detection

- Similar examples produce inconsistent results.
- The model follows the wrong example when several overlap.
- Behavior changes after adding a “helpful” example.

## Recovery

1. Remove overlapping examples.
2. Keep only the examples tied to the target failure.
3. Re-test precedence explicitly.

