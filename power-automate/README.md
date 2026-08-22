# Power Automate — Knowledge Base Section

This section contains architecture guidance and design patterns for building Power Automate cloud flows on the Sopra Power Platform.

---

## What's Here

| Path | Contents |
|------|----------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Architecture guide — flow type selection, naming, error handling, connections, performance, child flows, anti-patterns |
| [`patterns/error-handling.md`](patterns/error-handling.md) | Try/catch/finally with Scope actions, run-after, failure notifications, Dataverse logging |
| [`patterns/http-connector.md`](patterns/http-connector.md) | HTTP connector usage, auth types, pagination, JSON parsing |
| [`patterns/child-flows.md`](patterns/child-flows.md) | Child flow patterns, input/output passing, naming, testing |
| [`patterns/dataverse-operations.md`](patterns/dataverse-operations.md) | Dataverse CRUD, OData filters, related records, bulk operations |
| [`templates/README.md`](templates/README.md) | Flow template storage and contribution process |

---

## When to Use These Patterns

- **Starting a new flow project** → Read `ARCHITECTURE.md` first to choose the right flow type.
- **Adding error handling** → `patterns/error-handling.md` — always use Scope-based try/catch.
- **Calling external APIs** → `patterns/http-connector.md` for auth and pagination patterns.
- **Extracting reusable logic** → `patterns/child-flows.md` for parameterized child flows.
- **Working with Dataverse** → `patterns/dataverse-operations.md` for OData and bulk operation patterns.
- **Using a template** → `templates/README.md` for the export/import process.

---

## Sopra Flow Conventions at a Glance

- **Naming**: `[ENV]-[Domain]-[Action]-[Version]` (e.g., `DEV-HR-SubmitLeaveRequest-v1`)
- **Solution**: All flows must live in a Dataverse solution with prefix `spr_`
- **Error handling**: Every flow with 3+ actions must have a Scope-based error handler
- **Connections**: Service account connections only in TEST/UAT/PROD — no personal connections
- **Description**: Every flow must have a description field filled in (what it does, who owns it)
- **Environment variables**: Use for all URLs, configuration values, and feature flags

---

## Related Sections

- [`../solutions/ARCHITECTURE.md`](../solutions/ARCHITECTURE.md) — ALM for deploying flows
- [`../dataverse/ARCHITECTURE.md`](../dataverse/ARCHITECTURE.md) — Dataverse integration architecture
- [`../shared/naming-conventions.md`](../shared/naming-conventions.md) — Full naming reference
- [`../.github/workflows/solution-export-import.yml`](../.github/workflows/solution-export-import.yml) — CI/CD for solution deployment
