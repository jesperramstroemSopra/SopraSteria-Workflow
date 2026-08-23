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

## Delegation Limits by Data Source

| Data Source | Delegable Filters | Non-Delegable |
|---|---|---|
| **Dataverse** | `=`, `<`, `>`, `<=`, `>=`, `<>`, `And`, `Or`, `Not`, `StartsWith`, `EndsWith`, `Contains` (choice/text), `In` (for choice) | `Mid()`, `Len()`, `Left()`, `Right()`, complex nested lookups |
| **SharePoint** | `=`, `<`, `>`, `<=`, `>=`, `And`, `Or`, `StartsWith` | `Contains` (text columns), lookups across lists, `EndsWith` |
| **SQL** | Most standard filter operations | Complex expressions depending on driver |
| **Collections** | All (collections are in-memory; delegation doesn't apply) | N/A |

Check the Power Apps delegation documentation for the current list — it changes with platform updates.

---

## Identifying Non-Delegation

Power Apps shows a **blue underline** (delegation warning) on formulas that are non-delegable. This
warning is advisory only — the formula still runs, but silently truncates results.

**Always treat delegation warnings in production apps as bugs.** The only acceptable delegation
warning is in a prototype where you have explicitly documented the limit.

---

## Delegation Patterns

### 1. Filter at the Source (Primary)

```powerfx
// Good — delegated to Dataverse
Filter(
    Orders,
    StatusCode = locSelectedStatus And
    StartsWith(OrderNumber, txtSearch.Text)
)
```

Never apply `Filter()` to a collection of pre-loaded records unless the collection is small and
bounded by design.

### 2. Use Search() for Text Search

`Search()` on Dataverse is delegable for specific column types. It is equivalent to a multi-column
`StartsWith` or `Contains` depending on the version.

```powerfx
// Search delegable on text columns in Dataverse
Search(Contacts, txtSearch.Text, "fullname", "emailaddress1")
```

Verify delegation with the blue-underline indicator after writing the formula.

### 3. Paginate Explicitly

When a result set is large but bounded:

```powerfx
// Show 50 records at a time
FirstN(
    Filter(Orders, CreatedOn >= locPageStart),
    50
)
```

Pair with a "Load more" button that advances `locPageStart`.

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

Small, static lookup tables (status codes, categories, <200 rows, never changes during a session)
can be loaded into a collection on `App.OnStart` or via Named Formulas. The collection is
in-memory — delegation does not apply, and you can use any formula.

```powerfx
// Named Formula — lazy, memoized
StatusOptions = Choices(Orders.Status)
```

Never load unbounded or frequently updated data into a collection as a delegation workaround.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| `Filter(Collection, ...)` where collection was loaded from full table | Silent 500-record truncation | Filter at the source, not on a pre-loaded collection |
| Ignoring blue delegation warnings | Correctness bug in production | Fix or document explicitly with a ticket |
| `Collect(Orders)` in OnStart with no filter | Downloads all records; slow and truncated | Load on demand with Filter on the screen |
| Using `Search()` on columns that don't support it | Non-delegable; blue warning | Use `StartsWith()` or `Filter()` on Dataverse indexed columns |
| Setting delegation limit to 2000 as a "fix" | Still a limit; still silently truncates | Design for delegation, not for a higher limit |

---

## Upstream Reference

- **Source:** `microsoft/power-cat-skills` (powercat-canvas-apps / analyze-canvas-performance)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra treats delegation warnings as build-blocking in production. The 2000-record limit adjustment is never accepted as a solution; proper delegation design is required.
