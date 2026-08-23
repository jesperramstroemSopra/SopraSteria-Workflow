# Dynamic Topic Redirect (Classic)

> **Architecture:** Classic (topic-based) agents only.
> **Status:** Proven.

Use a `Switch()` Power Fx expression inside a `BeginDialog` node to route dynamically to different
topics based on a variable value. Replaces deeply nested `ConditionGroup` chains.

---

## The Pattern

The `BeginDialog` node's `dialog` property accepts a Power Fx expression evaluated at runtime.
`Switch()` maps variable values to fully qualified topic schema names, with a default fallback for
unmatched values.

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnRecognizedIntent
  id: main
  intent:
    triggerQueries:
      - route to lesson
  actions:
    - kind: SetVariable
      id: setVariable_7bgfoP
      variable: Topic.MyVariable
      value: =RandBetween(0, 4)
    - kind: BeginDialog
      id: redirect_A4lDAn
      dialog: |-
        =Switch(
            Topic.MyVariable,
            1, "<agentSchemaName>.topic.Lesson1",
            2, "<agentSchemaName>.topic.Lesson2",
            3, "<agentSchemaName>.topic.Lesson3",
            "<agentSchemaName>.topic.Fallback"
        )
```

**What this replaces:**

```
ConditionGroup (Topic.MyVariable = 1)  → BeginDialog: Lesson1
ConditionGroup (Topic.MyVariable = 2)  → BeginDialog: Lesson2
ConditionGroup (Topic.MyVariable = 3)  → BeginDialog: Lesson3
Else                                   → BeginDialog: Fallback
```

One `BeginDialog` + `Switch()` instead of 3+ nested condition nodes.

---

## When to Use

- Route to one of several topics based on a variable (lesson selection, category routing, menu choices)
- Avoid deeply nested `ConditionGroup` nodes that are hard to read and maintain
- The routing logic maps a single variable to multiple target topics

**Not suitable for:** Routing that depends on multiple variables or compound conditions — a
`ConditionGroup` may still be clearer in those cases.

---

## Sopra Conventions

- **Fully qualified topic names are required.** Each branch value must be the full schema name
  (`<agentSchemaName>.topic.Lesson1`). Read the schema name prefix from `settings.mcs.yml`.
- **Always use `|-` block scalar** for multi-line Power Fx expressions to preserve YAML formatting.
- **The last `Switch()` argument (without a match value) is the default.** Always include a fallback
  to avoid silent failures when the variable has an unexpected value.
- For complex routing logic (multiple variables, compound conditions), prefer explicit `ConditionGroup`
  chains — they are easier to read in those cases.

---

## Upstream Reference

- **Source:** `microsoft/skills-for-copilot-studio` — `patterns/dynamic-topic-redirect.md`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Added schema-name lookup guidance and the `|-` scalar reminder.
