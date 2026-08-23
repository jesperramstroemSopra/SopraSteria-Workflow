# Pattern: Custom Connector Pagination

> **Architecture track:** Custom Connectors
> **When to load:** When the external API returns paged results, or when a flow needs to retrieve all records from a paged API.

---

## Pagination Strategies

External REST APIs use several pagination models. The connector handles some automatically;
others require explicit flow logic.

---

## 1. Next-Link Pagination (Recommended — configure in connector)

The API returns a `nextLink` or `@odata.nextLink` URL in the response body pointing to the next page.

### Connector Definition (`x-ms-pageable`)

```json
"x-ms-pageable": {
  "nextLinkName": "@odata.nextLink",
  "operationName": "GetAllItems"
}
```

When configured, Power Automate's **"Get items"** action exposes a **"Get All"** toggle that
automatically follows next-links and returns the full result set to the flow as a single array.

**Prefer this approach** — it keeps pagination logic off the flow and makes the connector
easier to use correctly.

---

## 2. Offset/Page-Number Pagination (flow handles it)

The API takes `$skip` + `$top` parameters (or `page` + `pageSize`). There is no next-link — the
caller computes the offset.

### Flow Pattern

```
Initialize Variable — varSkip = 0
Initialize Variable — varResults = [] (array)
Initialize Variable — varHasMore = true

Do Until varHasMore = false:
    Call connector action with $skip=varSkip, $top=100
    Append result items to varResults
    If result item count < 100:
        Set varHasMore = false
    Else:
        Set varSkip = varSkip + 100
```

**Safeguard:** Always add a maximum iteration count to the Do Until (`@less(iterationIndexes('Do_Until'), 500)`) to prevent infinite loops on API errors that always return a full page.

---

## 3. Cursor Pagination

The API returns an opaque cursor token (`nextCursor`, `after`, `continuation_token`) that must be passed in the next request.

### Flow Pattern

```
Initialize Variable — varCursor = null
Initialize Variable — varResults = []
Initialize Variable — varHasMore = true

Do Until varHasMore = false:
    Call connector action with cursor=varCursor
    Append items to varResults
    If response.nextCursor is empty or null:
        Set varHasMore = false
    Else:
        Set varCursor = response.nextCursor
```

---

## 4. Link Header Pagination (RFC 5988)

Some APIs (GitHub, older REST APIs) return pagination links in the HTTP `Link` response header:
```
Link: <https://api.example.com/items?page=2>; rel="next"
```

Power Platform cannot natively parse response headers in connector actions (headers are not exposed
in the response body schema). To handle this:
- Use a **Policy Template** to extract the `Link` header value and inject it into the response body as a synthetic `nextLink` property.
- Or, if the API also supports query-parameter-based pagination, use offset pagination instead.

---

## Choosing the Right Pattern

| API Model | Approach |
|---|---|
| OData `@odata.nextLink` | `x-ms-pageable` in connector definition |
| `nextLink` or `next` property in body | `x-ms-pageable` in connector definition |
| `$skip` + `$top` or `page` + `pageSize` | Offset pattern in flow |
| Cursor token in body | Cursor pattern in flow |
| `Link` header only | Policy template injection → then next-link pattern |

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| No pagination handling — single call | Returns only first page; silently missing data | Implement appropriate pagination pattern |
| Unbounded `Do Until` with no max iterations | Infinite loop on API errors | Add iteration count guard |
| Calling API 1000+ times synchronously in a flow | API rate limiting; flow timeout | Consider async pattern with storage intermediary |
| Assuming first-page result is "all records" | Data gaps in reports/logic | Always check for a next page indicator |

---

## Upstream Reference

- **Source:** Microsoft Learn — Custom connector pagination, `pnp/powerautomate-samples`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires a maximum iteration safeguard on all Do Until loops that implement pagination. Unbounded loops are treated as a review-blocking finding.
