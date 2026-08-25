# Single-Fix Regression Loop

**Domain:** copilot-studio  
**Confidence:** confirmed  
**First observed:** 2026-08-25  
**Last verified:** 2026-08-25

## Trigger

It is hard to tell which change caused a regression or improvement.

## Lesson

Apply one surgical fix, run the full benchmark set, then decide the next fix. This makes the impact
of each change observable.

## Guardrail

- Require pass/fail criteria before the next change.
- Do not bundle unrelated fixes in one cycle.

## Detection

- Several edits land at once.
- The result changes but the cause is unclear.
- New regressions appear in unrelated paths.

## Recovery

1. Make one change.
2. Run the full benchmark set.
3. Record the outcome.
4. Only then move to the next change.

