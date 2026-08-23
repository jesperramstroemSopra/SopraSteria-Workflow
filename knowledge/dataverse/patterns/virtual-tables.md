# Pattern: Virtual Tables

> **Architecture track:** Dataverse
> **When to load:** When considering exposing external data as Dataverse tables, or when evaluating whether Dataverse or a direct connector is the right integration approach.

---

## What Virtual Tables Are

A **Virtual Table** (also called a virtual entity) is a Dataverse table whose data is **not stored
in Dataverse** — it is retrieved on demand from an external system via a **virtual table data
provider**.

From the user's and application's perspective, a virtual table looks like a regular Dataverse table:
it appears in Model-Driven App views and forms, supports Power Fx bindings in Canvas Apps, and can
be queried via the Web API. The underlying data lives elsewhere.

---

## When to Use Virtual Tables

Use virtual tables when:
- An external system is the authoritative data source and data must **not be copied** into Dataverse (compliance, data residency, or freshness requirements).
- You want to surface external data in a Model-Driven App **without building a custom integration layer**.
- The external system exposes an OData endpoint (the built-in OData v4 provider handles this without code).

Do **not** use virtual tables when:
- You need to create Dataverse relationships between the virtual table and real tables (this is limited).
- You need full-text search, audit, or complex rollup fields on the data.
- The external API is slow — every form open and view load triggers a live API call.
- Offline scenarios are required — virtual table data is not cached locally.

---

## Provider Options

| Provider | Use | Notes |
|---|---|---|
| **OData v4** (built-in) | External OData-compliant REST APIs | No code; configure with URL, auth, entity mapping |
| **Virtual Connector Provider** | Power Platform connectors (SharePoint, SQL, etc.) | Built-in; exposes connector data as Dataverse tables |
| **Custom provider** (plugin) | Any API with custom logic | Requires C# plugin development; most flexible |
| **Finance & Operations** (D365) | F&O tables via Virtual Table for Finance and Operations | Separate solution; specific setup for D365 CE + F&O integration |

---

## OData v4 Provider Setup

1. Install the **Virtual Tables for OData** solution from AppSource.
2. Create a new **Virtual Table Data Source** (Settings → Virtual Entity Data Sources).
3. Register the external OData URL and authentication.
4. Create a new **Virtual Table** (solution → New → Table → Virtual entity).
5. Map the virtual table columns to the OData entity properties.
6. Test: open a Model-Driven App and verify data loads.

---

## Virtual Connector Provider (No Code)

The Virtual Connector Provider allows wrapping connector data as Dataverse virtual tables:
- SharePoint lists → virtual tables
- SQL tables → virtual tables
- Other Power Platform connectors

Setup:
1. In a solution, create a new **Virtual Table** and select **Virtual Connector Provider**.
2. Select the connector and authenticate.
3. Select the table/list to expose.
4. Map columns.

This is the fastest path for SharePoint-to-Dataverse read scenarios without data migration.

---

## Limitations and Gotchas

| Limitation | Impact |
|---|---|
| No offline support | Virtual table data not available without connectivity |
| Limited relationship support | Cannot have standard Dataverse lookup to a virtual table from a real table |
| No Dataverse search | Virtual tables excluded from Dataverse Search / relevance search |
| No auditing | Row changes not audited by Dataverse |
| Performance depends on external API | Slow API = slow forms; no caching |
| Advanced find limitations | Some filter operations may not be supported by the provider |
| No bulk operations via standard UI | Import/export tools do not apply to virtual tables |

---

## When to Prefer Data Import Instead

Virtual tables are a read-mostly integration pattern. If any of these are true, prefer importing data into real Dataverse tables via Power Automate:

- You need to create, update, or delete records in Dataverse (not just read them)
- You need relationships, rollups, or calculated fields on the data
- You need audit history in Dataverse
- The external API is slow or unreliable
- You need offline access

---

## Upstream Reference

- **Source:** `microsoft/PowerApps-Samples`, Microsoft Learn — Virtual tables documentation
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra treats virtual tables as a read-only integration pattern by default. Any write requirement moves the recommendation to a full data integration via Power Automate. Performance testing of the external API is required before recommending virtual tables for production.
