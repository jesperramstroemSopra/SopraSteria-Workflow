# Pattern: Dataverse Query Shapes

> **Architecture track:** Dataverse
> **When to load:** When designing or reviewing queries that will be used by plugins, Power Apps,
> Power Automate, or direct Web API callers.

---

## When to Use Which Query Shape

| Need | Preferred shape | Why |
|---|---|---|
| Small projection, list view, or row lookup | OData `$select/$filter/$orderby` | Simple, fast, portable |
| Relationship traversal | `$expand` | Avoids N+1 calls |
| Saved view / complex join / aggregation | FetchXML | Better fit for Dataverse-native query features |
| Server-side transactional rule | Plugin or custom API | Query alone is not enough |

---

## Rules

- Always specify `$select`.
- Use `$top` only for bounded reads, never as a paging substitute.
- Prefer indexed, delegable predicates.
- Use `@odata.nextLink` handling for every paged query.
- Escalate to FetchXML when the query starts to look like a report.

---

## Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| No `$select` | Oversized payloads | Project only required columns |
| Looping parent/child lookups | N+1 calls | Use `$expand` or FetchXML |
| Querying everything then filtering client-side | Latency and throttling | Push filters down |
| Using plugin code for pure retrieval | Unnecessary complexity | Use a query surface instead |

---

## Upstream Reference

- **Source:** `microsoft/PowerApps-Samples`, `microsoft/power-cat-skills`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra treats `$select` as mandatory in production queries and prefers FetchXML once query complexity crosses simple list/read behavior.
