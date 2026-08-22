# Power Automate Architecture Guide

## Overview

This document defines the architecture principles, design decisions, and Sopra conventions for building Power Automate cloud flows. Read this before designing any new flow or flow family.

---

## 1. Flow Type Selection

### Decision Tree

```
What initiates the flow?
├─ User clicks a button / runs manually → INSTANT flow
├─ An event occurs in a service (email, SharePoint, Dataverse change) → AUTOMATED flow
├─ A time schedule → SCHEDULED flow
└─ A desktop / legacy system task → DESKTOP flow (Power Automate Desktop)
```

### Flow Type Comparison

| Flow Type | Trigger | Best For | Limitations |
|-----------|---------|---------|------------|
| **Instant** | Manual (button, Power Apps, Teams) | User-initiated actions, approvals | Synchronous — must return in 120s |
| **Automated** | Service event (new email, new row) | Event-driven processing, notifications | Depends on trigger connector availability |
| **Scheduled** | Timer (hourly, daily, cron) | Data sync, report generation, batch jobs | Not for real-time requirements |
| **Desktop** | Manual or RPA trigger | Legacy app automation, scraping, Excel | Requires machine/machine group, PAD license |

### When to Use Instant vs HTTP Request Trigger

For flows called from Power Apps or external systems:
- **Power Apps button connector**: Use for flows that must return data to Power Apps (synchronous, <2 min)
- **HTTP Request trigger**: Use for flows called from external APIs, Copilot Studio, or other flows where a URL endpoint is needed
- **Dataverse trigger**: Use when a Dataverse event (create/update/delete) is the natural trigger

---

## 2. Naming Conventions

### Flow Name Pattern

```
[ENV]-[Domain]-[Action]-[Version]
```

| Component | Values | Example |
|-----------|--------|---------|
| ENV | DEV, TST, UAT, PRD | `PRD` |
| Domain | Short domain abbreviation | `HR`, `IT`, `FIN`, `OPS` |
| Action | Verb+Noun in PascalCase | `SubmitLeaveRequest` |
| Version | `v` + integer | `v1`, `v2` |

**Examples:**
- `PRD-HR-SubmitLeaveRequest-v1`
- `TST-IT-ProvisionUserAccount-v2`
- `PRD-FIN-GenerateMonthlyReport-v1`

### Action Names Within a Flow

- Use descriptive, sentence-case names: `Get employee record from Dataverse`
- Avoid default names: `Compose`, `HTTP`, `Apply to each` — always rename
- Include the connector name for clarity: `SharePoint – Get file content`

### Variable Names

| Type | Convention | Example |
|------|-----------|---------|
| Compose output | `varPascalCase` | `varEmployeeRecord` |
| Initialize variable | `varPascalCase` | `varTotalApproved` |
| Loop index | `varIndex` | `varIndex` |
| Error detail | `varErrorDetail` | `varErrorDetail` |

---

## 3. Error Handling Strategy

Every flow with 3+ actions must implement Scope-based error handling. See [`patterns/error-handling.md`](patterns/error-handling.md) for full details.

### Mandatory Try/Catch/Finally Structure

```
┌─────────────────────────────────┐
│  Scope: TRY                     │
│  (all business logic here)      │
└─────────────────────────────────┘
         ↓ (runs on failure)
┌─────────────────────────────────┐
│  Scope: CATCH                   │
│  - Compose: error details       │
│  - Log to Dataverse             │
│  - Send failure notification    │
│  - Respond with error (if sync) │
└─────────────────────────────────┘
         ↓ (always runs)
┌─────────────────────────────────┐
│  Scope: FINALLY (optional)      │
│  - Release locks                │
│  - Close sessions               │
│  - Send completion notification │
└─────────────────────────────────┘
```

### Run-After Configuration

Set `Configure run after` on the CATCH scope to: `has failed`, `has timed out`, `has been skipped`.

---

## 4. Connection Management

### Service Account vs User Connections

| Scenario | Connection Type | Reason |
|----------|----------------|--------|
| DEV environment (developer testing) | Developer's user connection | OK for development |
| TEST / UAT / PROD | Service account connection | User connections break when the user leaves |
| Dataverse operations | Service principal / app user | Most secure, no license cost for connection |
| SharePoint operations | Service account (`svc_automate@sopra.com`) | Stable, dedicated account |
| External API (OAuth) | Service principal / dedicated credentials | Never embed personal tokens |

### Named Connections

Create connections with descriptive names in the Power Platform admin center:
- `svc-sharepoint-automate` — SharePoint service account
- `svc-dataverse-automate` — Dataverse app user
- `svc-outlook-automate` — Outlook service account for notifications

Reference connections by name in solution connection references so they can be swapped per environment.

---

## 5. Performance Patterns

### Parallel Branches

Use **Parallel branch** when two or more independent operations can run concurrently:

```
[Trigger]
  │
  ├─ Branch 1: Get manager from Dataverse
  ├─ Branch 2: Get employee leave balance from API
  └─ Branch 3: Get department policy from SharePoint
  │
  └─ [Join] All branches complete
       └─ Compose: combine results
```

Parallel branches reduce total flow runtime significantly for flows with multiple independent lookups.

### Pagination

When using the `List rows` Dataverse action or SharePoint `Get items`, enable **Pagination** in the action settings and set a page size of 100–500 records. Default page size is 100; without pagination, flows silently truncate results at the connector limit.

### Chunking Large Datasets

For batch processing > 5,000 records:
1. Use a **Scheduled** flow to process in daily/hourly chunks
2. Use a `do until` loop with a bookmark (timestamp or ID) stored in Dataverse
3. Process N records per run, update the bookmark, repeat

Avoid processing all records in a single run — flows time out after 30 days (standard connectors) or 30 minutes (premium in some plans).

---

## 6. Child Flow Pattern

Extract logic to a child flow when:
- The same logic is needed in 3+ parent flows
- A flow exceeds 50 actions and a logical sub-group can be extracted
- You need to test a sub-process independently

See [`patterns/child-flows.md`](patterns/child-flows.md) for full pattern details.

**Key rule**: Child flows must live in the **same Dataverse solution** as their parent flows.

---

## 7. Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Nested Apply-to-each | O(n²) performance — 100 outer × 100 inner = 10,000 iterations | Use OData filters, Select action, or batch operations |
| Missing error handling | Flow silently fails; no notification, no audit trail | Always use Scope-based try/catch |
| Hard-coded URLs | Flow breaks in TEST/UAT/PROD | Use environment variables for all URLs |
| Personal user connections | Flow breaks when user leaves or changes password | Use service accounts or service principals |
| No description | Nobody knows what the flow does in 6 months | Fill the description field — who owns it, what it does, when it runs |
| One giant flow | 150-action flows are unmaintainable and impossible to debug | Extract sub-logic to child flows |
| Trigger on every Dataverse change | High-volume tables cause thousands of flow runs per hour | Add OData filter on trigger; scope to specific columns |

---

## 8. Sopra Conventions

| Convention | Rule |
|-----------|------|
| **Description field** | Mandatory — must include: purpose, owner team, date created, linked Jira/ADO ticket |
| **Solution membership** | All flows must be in a Dataverse solution with `spr_` prefix |
| **Tagging** | Tag with solution name and environment in the flow description for easy search |
| **Environment variables** | Use for ALL URLs, email addresses, feature flags, and configuration values |
| **Naming** | Follow `[ENV]-[Domain]-[Action]-[Version]` pattern — no exceptions |
| **Connection references** | Use named connection references for all connections; no inline connection hardcoding |
| **Error notification** | All automated flows must notify `flow-errors@sopra.com` (or equivalent) on failure |
