# Pattern: Custom Connector Policy Templates

> **Architecture track:** Custom Connectors
> **When to load:** When designing a custom connector that requires request/response transformation, retry logic, or endpoint configuration.

---

## What Policy Templates Are

Policy templates run on **Power Platform's connector infrastructure** (server-side), not on the
client or in a flow. They intercept every request and response for the connector and can:

- Modify the request before it reaches the API (add headers, rewrite URLs, inject parameters).
- Modify the response before the flow sees it (reshape, extract, inject synthetic fields).
- Handle retry and throttling automatically.

Using policies keeps transformation logic **out of flows** — a connector with proper policies is
easier to use correctly.

---

## Available Policy Templates

### 1. Set HTTP Header

Injects a fixed header on every request. Use for:
- API version headers (`Api-Version: 2024-01-01`)
- Correlation IDs (`X-Correlation-ID: @{guid()}`)
- Fixed authentication headers not handled by the auth configuration

```json
{
  "type": "SetHeader",
  "parameters": {
    "name": "Api-Version",
    "value": "2024-01-01",
    "existsAction": "override"
  }
}
```

### 2. Set Query Parameter

Injects a fixed query parameter on every request. Use for:
- Mandatory API version query strings (`?api-version=2024-01-01`)
- Fixed output format parameters (`?$format=json`)

```json
{
  "type": "SetQueryParameter",
  "parameters": {
    "name": "$format",
    "value": "json",
    "existsAction": "skip"
  }
}
```

### 3. Route Request

Routes a specific operation to a different backend host. Use for:
- APIs that have different hosts per operation (read vs. write endpoints)
- Blue/green routing during migrations

### 4. Convert Array to Object

Takes a single-element array in the response and unwraps it to an object. Use when:
- The API always wraps a single item in an array (`[{...}]` instead of `{...}`)
- The flow logic only ever expects a single item

This makes the flow binding cleaner — no `first()` expression needed.

### 5. Rewrite URI

Maps the action's URL template to a different backend URL. Use for:
- Abstracting versioned URLs from flow authors (the flow uses `/getOrder`; the backend is `/v3/orders/{id}`)
- Normalizing inconsistent API URL patterns

### 6. Retry Policy

Automatically retries failed requests. Configure this on all connectors that call external APIs
outside your control.

```json
{
  "type": "RetryPolicy",
  "parameters": {
    "retryCount": 3,
    "retryInterval": "PT20S",
    "type": "exponential"
  }
}
```

**Retry on:** 429 (Too Many Requests), 503 (Service Unavailable), 504 (Gateway Timeout).
**Do not retry on:** 4xx client errors (400, 401, 403, 404) — these are not transient.

---

## Policy Design Guidance

- Apply the **Retry Policy** to every action that calls an external API unless the API explicitly
  prohibits retries (e.g., a payment submission endpoint — only retry safe/idempotent operations).
- Apply the **Set HTTP Header** policy for API versioning rather than adding it to every flow action
  individually.
- Keep policies to a **minimum per connector** — complex policy chains are hard to debug.
- Document each policy in the connector's README or deployment notes.

---

## Limitations

- Policy templates run on shared infrastructure — they cannot access Key Vault directly.
- They cannot branch on response content (use flow logic for content-based routing).
- They are applied to **all operations** (connector-level) or specific operations — there is no per-call override from the flow.
- Changes to policies require updating and republishing the connector in every environment.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Adding `Api-Version` header in every flow action | Duplicated, easy to forget, breaks on update | Set HTTP Header policy on the connector |
| No retry policy on external API connectors | Transient failures become flow failures | Add retry policy; document which status codes to retry |
| Complex response reshaping in every flow | Duplicated transformation logic | Convert Array to Object / Rewrite URI policy |
| Retry on non-idempotent operations (POST payments) | Duplicate operations, financial impact | Only apply retry to GET/idempotent operations |

---

## Upstream Reference

- **Source:** Microsoft Learn — Custom connector policy templates
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra mandates a retry policy on all connectors targeting external APIs. API version headers are always injected via policy, not in individual flow actions.
