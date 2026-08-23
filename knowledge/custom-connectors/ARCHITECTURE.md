# Custom Connectors Architecture Guide

> **Scope.** Custom connectors let Power Platform components call external APIs not covered by
> standard connectors. This guide covers design, auth, ALM, and the decision of when to build a
> custom connector vs. use an HTTP connector action directly.

---

## 1. When to Build a Custom Connector

A custom connector is appropriate when:

| Situation | Rationale |
|---|---|
| Multiple flows or apps call the same external API | Connector abstracts the endpoint; one place to update auth and base URL |
| The external API requires complex auth (OAuth 2.0, mutual TLS) | Custom connector handles the auth flow; callers stay clean |
| You want the connector to be discoverable in the designer UI | Connectors appear in the connector picker; HTTP actions require manual URL entry |
| The API will be shared across teams or projects | Certified or organizational connector enables governed reuse |
| Pagination, retry, or policy templates are needed | Custom connector policy layer handles this transparently |

**Do NOT build a custom connector when:**
- Only one flow calls one endpoint, and the call is unlikely to be reused.
- The external system is available via a standard connector.
- The call is from Copilot Studio — use an Agent Flow that calls the API, not a custom connector directly (agents cannot use connectors directly; they call flows or tools).

---

## 2. Connector Anatomy

A custom connector is defined by an **OpenAPI 2.0 (Swagger) definition** plus a set of Power Platform–specific extension properties.

```
Custom Connector
├── Connection parameters (auth type, host, base path)
├── Actions (operations) — each maps to one API endpoint
│   ├── Summary & description (shown in the designer)
│   ├── Request definition (path, method, parameters, body schema)
│   └── Response definition (status codes, body schema)
├── Triggers (optional) — webhook subscriptions
├── Policy templates — URL rewriting, header injection, retry
└── Test connection action
```

The **description** on each action is critical — it is the signal used by AI-assisted flow generation and Copilot to understand what the action does. Write it in plain English stating the business purpose.

---

## 3. Authentication Options

Choose the auth type that matches the external API's security model. Do not implement workarounds to avoid auth complexity — they create long-term maintenance debt.

| Auth Type | When to Use | Notes |
|---|---|---|
| **No authentication** | Internal APIs on private networks only | Never for public APIs |
| **API Key** | API uses a static key in a header or query param | Key stored in connection; rotated by updating the connection |
| **Basic** | API uses username/password HTTP Basic | Avoid for new APIs; use only for legacy systems |
| **OAuth 2.0 — Authorization Code** | Delegated user access; user must consent | Requires app registration in IdP; redirect URI must include Power Platform endpoint |
| **OAuth 2.0 — Client Credentials** | Service-to-service; no user interaction | App registration with client secret or certificate; preferred for automated flows |
| **Windows (on-premises gateway)** | Legacy on-premises APIs | Requires on-premises data gateway installed and registered |
| **Service Principal / Microsoft Entra ID** | Microsoft APIs (Graph, Dataverse, etc.) | Use client credentials flow with an app registration |

### OAuth 2.0 App Registration Checklist

For delegated (authorization code) flows:
- Register the app in Microsoft Entra ID (or the external IdP).
- Add the Power Automate redirect URI: `https://global.consent.azure-apim.net/redirect`
- Scope the permissions to minimum required.
- Document the app registration name and ID in the solution README.

For client credentials:
- Create a client secret (or certificate — preferred for production).
- Secret rotation must be planned — store the expiry date and set an alert.

---

## 4. Policy Templates

Policy templates run on the connector infrastructure and modify requests/responses transparently. Use them instead of building the same logic in every flow.

| Policy | Use For |
|---|---|
| **Set HTTP Header** | Inject auth tokens, correlation IDs, or API version headers on every request |
| **Set Query Parameter** | Inject fixed query parameters (e.g., `api-version=2024-01-01`) |
| **Convert Array to Object** | Reshape response arrays into single objects for simpler flow binding |
| **Rewrite URI** | Map a friendly action URL to the actual backend URL; useful for versioning |
| **Route Request** | Direct specific operations to different backend hosts |
| **Retry Policy** | Automatic retry on transient failures (429, 503) with configurable backoff |

See [`patterns/policy-templates.md`](patterns/policy-templates.md).

---

## 5. Pagination

External APIs commonly return paged results. Power Platform has native pagination support for connectors — use it rather than building manual pagination loops in flows.

The connector definition supports `x-ms-pageable` to declare the next-page link property. When configured, the `Get Items` style action returns a single logical page and handles the next-link automatically for "Get all items" scenarios.

For APIs that use offset/cursor pagination without a next-link pattern, pagination must be handled explicitly in the calling flow. See [`patterns/pagination.md`](patterns/pagination.md).

---

## 6. ALM

Custom connectors are solution components and must be managed through the standard Sopra ALM pipeline.

- Place the connector in the **same solution** as the flows and apps that use it.
- Use **environment variables** for the base URL and any environment-specific configuration — never hardcode the endpoint in the connector definition.
- Use **connection references** in all flows that reference the connector.
- After import into a new environment, the connection reference must be **bound to a new connection** before flows will work. Document this in the deployment runbook.
- When the external API changes (new version, breaking change), version the connector and update all dependent flows in the same solution PR.

---

## 7. Certified vs Organizational vs Unverified Connectors

| Type | Who Sees It | Certification | Use Case |
|---|---|---|---|
| **Unverified (custom)** | Environment where it's deployed | None | Project-specific APIs |
| **Organizational** | Entire tenant (via Power Platform admin) | Internal governance | APIs shared across multiple projects or teams |
| **Certified (Independent Publisher / Standard)** | All Power Platform tenants | Microsoft review | Public APIs intended for broad use |

For Sopra customer projects, connectors are typically **unverified/custom** unless the API is used across multiple engagements or the customer wants tenant-wide availability.

---

## 8. Review Checklist

- [ ] Custom connector is the right choice (not HTTP action, not standard connector)
- [ ] Auth type matches the API's security model — no workarounds
- [ ] OAuth app registration documented (name, ID, secret expiry alert)
- [ ] Every action has a clear summary and description
- [ ] Request and response schemas are fully defined (no `any` types)
- [ ] Pagination configured for list operations
- [ ] Retry policy configured for transient failure codes
- [ ] Environment variables used for base URL and env-specific config
- [ ] Connection reference used in all consuming flows/apps
- [ ] Import and binding steps documented in deployment runbook
- [ ] Connector is in the same solution as its consumers

---

## Related

- [`patterns/auth-patterns.md`](patterns/auth-patterns.md)
- [`patterns/pagination.md`](patterns/pagination.md)
- [`patterns/policy-templates.md`](patterns/policy-templates.md)
- [`../power-automate/ARCHITECTURE.md`](../power-automate/ARCHITECTURE.md)
- [`../solutions/ARCHITECTURE.md`](../solutions/ARCHITECTURE.md)
- [`../solutions/patterns/connection-references.md`](../solutions/patterns/connection-references.md)

## Upstream Reference

- **Source:** `microsoft/PowerApps-Samples` (custom connector samples), `microsoft/powerplatform-actions`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra mandates environment variables for base URLs and documented secret rotation plans. Client credentials are preferred over authorization code for automated flows. Policy templates for retry are required on all connectors hitting external APIs.
