# Pattern: Delegation in Canvas Apps

> **Architecture track:** Canvas App
> **When to load:** When designing data retrieval, filtering, or sorting in a Canvas App connected to Dataverse or SharePoint.

---

## What Delegation Is

Power Apps processes formulas on the client (browser/device). When a formula retrieves data from a
remote source, there are two execution models:

- **Delegated:** The filter/sort/search predicate is sent to the data source to execute. Only the
  matching records are returned. The data source does the work.
- **Non-delegated:** The formula downloads records to the client and processes them locally. By
  default, Power Apps downloads at most **500 records** (configurable to 2,000). Records beyond the
  limit are silently ignored.

**Non-delegation is a correctness bug, not just a performance issue.** If a user searches for a
record and it falls outside the downloaded 500, the app returns no results even though the record
exists.

---

## Delegation Is Connector- and Type-Specific

Use the [official delegation overview](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview)
and its linked **connector-specific** lists. Check the entire expression, column types, related
table depth and aggregate limits. An operator supported for text is not automatically supported for
a Choice, lookup or calculated/formula column.

Do not use a generic `Contains()` function from another language. Power Fx substring/membership
operations include `in`, `exactin`, `Search`, and other documented functions, with different semantics
and delegation support. Verify the exact overload; do not substitute `StartsWith` if substring
matching is the requirement.

Collections are local: delegation does not apply to querying them, but the query used to **populate**
them may already have been truncated. See [formula hosts](../../power-fx/hosts.md#canvas-apps).

---

## Identifying Non-Delegation

Power Apps shows a **blue underline** (delegation warning) on formulas that are non-delegable. This
warning is advisory only — the formula still runs, but silently truncates results.

Treat warnings as production-blocking until completeness is demonstrated or a deliberately bounded
dataset is documented with an enforced bound and boundary tests. Absence of a warning is not proof
of completeness; local collections can conceal upstream truncation.

---

## Delegation Patterns

### 1. Filter at the Source (Primary)

```powerfx
Filter(
    Orders,
    StatusCode = locSelectedStatus And
    StartsWith(OrderNumber, txtSearch.Text)
)
```

This is a schema-based pattern, not a runnable fixture: resolve actual column/control names,
typed status values and connector support. Never apply `Filter()` to a collection of pre-loaded
records unless it is complete and bounded by design.

### 2. Use Search() for Text Search

`Search()` performs case-insensitive substring matching across the named columns. It is not
equivalent to prefix-only `StartsWith`. Verify current Dataverse support for the exact column types.
Current Canvas syntax uses column identifiers rather than old quoted column-name strings:

```powerfx
Search(Contacts, txtSearch.Text, 'Full Name', 'Email')
```

The display names above are illustrative; resolve the actual schema. Verify diagnostics and
test a known matching row beyond the configured nondelegation limit.

### 3. Retrieve Completely, Then Limit Presentation

Bind a gallery to a supported delegable query to let the connector retrieve pages as needed.
For a custom paged API/flow, implement its continuation token or stable keyset contract, with a
unique tie-breaker, termination rule, retries and duplicate/missing-row tests.

`FirstN(Filter(...), 50)` limits presentation; it is **not** a server paging algorithm or a fix for
nondelegation. A timestamp alone can skip rows sharing the same timestamp. `LoadData`/`SaveData`
persist local data; they do not fetch the next server page.

### 4. Pre-filter with Required Fields

Apply fixed filters first (current user, status = active) before applying user-supplied search terms. This keeps the result set small at the source.

```powerfx
Filter(
    Cases,
    AssignedTo = gblCurrentUser.Email And
    Status = "Open" And
    StartsWith(Title, txtSearch.Text)
)
```

### 5. When You Must Load a Lookup into a Collection

Small lookup tables with an enforced bound can be loaded into a collection in a supported behavior
property. A named formula instead computes a value; it does not run `ClearCollect` or guarantee a
frozen snapshot. Supported local table operations remain subject to host/type limits.

```powerfx
// App.Formulas declaration, with actual choice schema resolved
StatusOptions = Choices(Orders.Status)
```

Never load unbounded or frequently updated data into a collection as a delegation workaround.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| `Filter(Collection, ...)` where collection was loaded from full table | Silent 500-record truncation | Filter at the source, not on a pre-loaded collection |
| Ignoring blue delegation warnings | Correctness bug in production | Fix or document explicitly with a ticket |
| `ClearCollect(colOrders, Orders)` without a proven bound | Snapshot may be slow and truncated | Load on demand with a supported delegable query |
| Using `Search()` on columns that don't support it | Non-delegable; blue warning | Use `StartsWith()` or `Filter()` on Dataverse indexed columns |
| Setting delegation limit to 2000 as a "fix" | Still a limit; still silently truncates | Design for delegation, not for a higher limit |

---

## Upstream Reference

- **Source:** `microsoft/power-cat-skills` (powercat-canvas-apps / analyze-canvas-performance)
- **Accessed:** 2026-Q3
- **Formula corrections reviewed:** 2026-09-21; [H8 and F3/F13](../../power-fx/sources.md).
- **Sopra Divergence:** Unresolved completeness is build-blocking. Raising the 2,000-record limit
  is not a correctness solution; prove delegation/paging or enforce and test a bounded dataset.
