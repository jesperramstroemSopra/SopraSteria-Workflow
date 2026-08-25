# Baseline-First Recovery Pattern

**Domain:** copilot-studio  
**Confidence:** confirmed  
**First observed:** 2026-08-25  
**Last verified:** 2026-08-25

## Trigger

Multiple optimization attempts produce mixed failures and it is no longer clear which change helped.

## Lesson

Do not optimize on top of a broken baseline. Roll back to the last known-good version first, confirm
baseline behavior, then resume with smaller fixes.

## Guardrail

- Never stack fixes on an unstable state.
- Re-establish a working baseline before changing behavior again.

## Detection

- Improvement in one case, regression in another.
- Failures become harder to attribute to a single change.
- The same benchmark set produces inconsistent results run-to-run.

## Recovery

1. Restore the last known-good baseline.
2. Verify the baseline benchmark set.
3. Resume with one small fix at a time.

