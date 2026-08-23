# Pattern: PCF Decision Guide

> **Architecture track:** Power Apps
> **When to load:** When deciding whether a UI requirement needs a PCF control.

---

## When PCF Is the Right Choice

- You need custom rendering that Canvas/MDA controls cannot provide.
- You need tight integration with model-driven form metadata.
- You need a reusable control that is more than styling.

## When Not to Use PCF

- Simple validation or show/hide logic.
- A standard form field or component already solves the requirement.
- The logic belongs in Dataverse, a flow, or a plugin.

---

## Decision Notes

- Prefer platform controls unless there is a clear UX or integration gap.
- Keep PCF controls thin; put data retrieval outside the control where possible.
- Treat accessibility and performance as release criteria.

---

## Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| PCF used for trivial styling | Maintenance cost with little value | Use native theming or form settings |
| PCF making repeated data calls per render | Slow forms | Move data fetch outside the control |
| PCF used instead of a plugin/flow | Wrong abstraction | Put business logic at the right layer |

---

## Upstream Reference

- **Source:** `microsoft/PowerApps-Samples`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra treats PCF as a specialized choice, not the default path for model-driven UX.
