## Dataverse — Knowledge Base Section

This section documents how Sopra models data, security, plugins, and solution layering in Dataverse.

---

## What's Here

| Path | Contents |
|---|---|
| [`README.md`](README.md) | How to use the Dataverse section |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Dataverse design principles, posture, and delivery model |
| [`patterns/table-design.md`](patterns/table-design.md) | Table design rules and anti-patterns |
| [`patterns/security-model.md`](patterns/security-model.md) | Business units, roles, and record access strategy |
| [`patterns/plugin-patterns.md`](patterns/plugin-patterns.md) | Plugin registration, transaction, and error patterns |
| [`patterns/solution-layering.md`](patterns/solution-layering.md) | Layering and dependency strategy for solutions |
| [`scripts/README.md`](scripts/README.md) | How to use repeatable Dataverse scripts in PowerShell |

## Sopra Defaults

- Prefer Dataverse for canonical business entities that need security, auditing, or relational integrity.
- Keep managed solutions as the release artifact; use unmanaged only in dev workspaces.
- Write PowerShell scripts for repeatable setup, not manual click-paths.

## Related Sections

- [`../solutions/ARCHITECTURE.md`](../solutions/ARCHITECTURE.md)
- [`../shared/naming-conventions.md`](../shared/naming-conventions.md)
- [`../shared/environment-strategy.md`](../shared/environment-strategy.md)
