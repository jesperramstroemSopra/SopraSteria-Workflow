# Pattern: Publisher Conventions

> **Architecture track:** Solutions / ALM
> **When to load:** At the start of any new Power Platform project before creating solutions or schema.

---

## Why Publisher Conventions Matter

The **solution publisher** determines the **customization prefix** stamped on every schema element
created in the solution: table names, column names, web resources, flows, and more.

Once a prefix is applied to a schema element in a production system, **it cannot be changed**
without migrating all data and all code that references that column name. Getting this wrong is
expensive.

---

## Sopra Publisher Configuration

### Publisher per Customer

Each customer engagement gets its own publisher. Never share publishers between customers.

```
Publisher Display Name:  [Customer Short Name] by Sopra Steria
Publisher Unique Name:   [customershortname]sopra
Customization Prefix:    [3–5 letter prefix agreed with customer]
Choice Value Prefix:     Same numeric prefix (auto-generated from text prefix)
Email:                   [Sopra project lead email or project mailbox]
```

**Example:**
```
Customer: Acme Corporation
Publisher Display Name:  Acme Corporation by Sopra Steria
Publisher Unique Name:   acmesopra
Customization Prefix:    acme
Choice Value Prefix:     (auto)
```

### Prefix Rules

| Rule | Rationale |
|---|---|
| 3–5 characters, lowercase, letters only | Maximum compatibility; avoids parsing issues |
| Agreed with the customer before project start | Prefix is permanent — customer must accept it |
| Unique across the customer's tenant | Two solutions with same prefix conflict |
| Does not use `new`, `cr`, `msdyn`, `msft` | Reserved by Microsoft |
| Does not spell a word that could cause confusion | Avoid `test`, `demo`, `tmp` for production publishers |

### Prefix Decision Process

1. Propose 2–3 options to the customer at project kickoff.
2. Verify the proposed prefix is not already used in the tenant (check existing publishers).
3. Document the agreed prefix in the project delivery log before any schema is created.
4. Create the publisher in DEV first; use it for all environments.

---

## Version Strategy

Solution versions communicate what changed and when.

```
Format: [Major].[Minor].[Patch].[Build]
Example: 1.3.0.0

Major: Breaking changes (schema changes that require data migration)
Minor: New features (new tables, columns, flows)
Patch: Bug fixes (no schema changes)
Build: Auto-incremented by pipeline (leave as 0 in manual versioning)
```

### Version in ALM Pipeline

```yaml
# GitHub Actions — set version at solution export
- name: Set solution version
  uses: microsoft/powerplatform-actions/set-solution-version@latest
  with:
    solution-folder: ${{ env.SOLUTION_FOLDER }}
    solution-version: ${{ env.SOLUTION_VERSION }}
```

The version appears in the Managed Solutions list in each environment — this is the primary
way to verify which version is deployed where.

---

## Solution Segmentation

A single customer engagement may involve multiple solutions. Use these guidelines:

| Solution | Contents | Notes |
|---|---|---|
| **Core / Data** | Tables, columns, relationships, security roles | Foundational; promoted first |
| **Process** | Flows, approval processes, business rules | Depends on Core |
| **UI** | Canvas Apps, Model-Driven Apps, dashboards | Depends on Core and Process |
| **Integration** | Custom connectors, connection references | Can be standalone or bundled with Process |
| **Config** | Environment variables, PCF controls, email templates | Promoted with the layer it supports |

**Avoid single-solution everything for non-trivial projects.** Separate solutions allow:
- Independent versioning of data model vs UI
- Partial re-deployment (fix a flow without re-importing all apps)
- Clearer ownership and review gates

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Using the Default publisher (`new_` prefix) | Cannot change later; conflicts with other solutions | Create project publisher at day one |
| Same publisher for multiple customers | Schema conflicts between customers on shared tenant | One publisher per customer engagement |
| No version strategy | Cannot tell which version is in which environment | Agree version format at project kickstart |
| All solution components in one solution | Impossible to partially redeploy; merge conflicts | Segment by layer |
| Prefix decided mid-project after schema is created | All early elements have wrong prefix | Decide prefix before creating any schema |

---

## Upstream Reference

- **Source:** `microsoft/Microsoft-Power-Platform-Patterns-and-Practices`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires a documented prefix decision in the project delivery log before any schema is created. Solution segmentation (data/process/UI minimum) is required for projects with more than one developer or more than ~5 tables.
