# Power Platform Governance Architecture Guide

> **Scope.** Governance covers the controls, processes, and tooling that keep a Power Platform
> tenant healthy over time — environment strategy, data loss prevention, admin tooling, and
> the CoE Starter Kit. This guide applies to both Sopra-delivered solutions (what we build) and
> tenant-level governance posture work (admin engagements).

---

## 1. Governance Layers

Power Platform governance is layered. Each layer has a different owner and a different cadence.

```
Tenant Admin Layer
  └─ Tenant-level DLP policies (Microsoft 365 admin / Power Platform admin)
  └─ Environment provisioning and lifecycle policies
  └─ Connector allowlists and blocklists
  └─ CoE monitoring and alerting

Environment Layer
  └─ Environment-level DLP policies (override or extend tenant policy)
  └─ Security roles and business units
  └─ Managed Environments settings (sharing limits, solution checker enforcement)

Solution Layer
  └─ Publisher conventions and prefixes
  └─ Environment variables and connection references
  └─ Solution checker results (must pass before promotion)

Application Layer
  └─ App-level sharing settings
  └─ Flow ownership and co-ownership
  └─ Connection ownership and service accounts
```

Decisions made at a higher layer cannot be overridden at a lower layer. When a DLP policy blocks a connector at tenant level, no environment-level setting can unblock it.

---

## 2. Environment Strategy

Sopra standard environment ring: **DEV → TEST → UAT → PROD**

| Environment | Type | Managed Solutions | Purpose |
|---|---|---|---|
| **DEV** | Developer or Sandbox | No (unmanaged only) | Active authoring, schema changes |
| **TEST** | Sandbox | Yes | Integration testing, automated tests |
| **UAT** | Sandbox | Yes | Customer acceptance, regression |
| **PROD** | Production | Yes | Live system |

Additional environments used situationally:

| Environment | When to Use |
|---|---|
| **Hotfix** | Emergency production fix that cannot wait for the normal pipeline |
| **Performance test** | Load testing before go-live (separate from UAT to avoid data contamination) |
| **Training** | Persistent environment with anonymized data for user onboarding |

### Managed Environments

Enable **Managed Environments** on TEST, UAT, and PROD to unlock:
- Sharing limits (prevent over-sharing of apps)
- Solution checker enforcement before import (blocks non-compliant solutions)
- Weekly digest to admins
- IP firewall (where required)
- Customer Managed Keys (CMK) for regulated industries

See [`patterns/environment-provisioning.md`](patterns/environment-provisioning.md).

---

## 3. Data Loss Prevention (DLP) Policies

DLP policies classify connectors into groups that restrict which connectors can be used together in a flow or app.

### Standard Connector Groups

| Group | Meaning | Examples |
|---|---|---|
| **Business** | Approved for business data | SharePoint, Dataverse, Teams, Outlook |
| **Non-Business** | Not approved for business data | Twitter/X, personal OneDrive, consumer services |
| **Blocked** | Not allowed at all | High-risk connectors, unapproved external services |

**A flow cannot use connectors from both Business and Non-Business in the same flow.** This is the primary enforcement mechanism for data isolation.

### DLP Design Principles

- Start with a **default-deny tenant policy**: everything not explicitly Business is Non-Business or Blocked.
- Use **environment-level DLP policies** to relax restrictions in DEV environments where developers need broader connector access.
- The HTTP connector deserves special attention: it allows calling any URL and should be:
  - Blocked in environments with sensitive data, OR
  - Allowlisted to specific URL patterns using Managed Environments connector endpoint filtering.
- Audit DLP policies quarterly and after any major connector update.

See [`patterns/dlp-policies.md`](patterns/dlp-policies.md).

---

## 4. CoE Starter Kit

The **Center of Excellence (CoE) Starter Kit** is Microsoft's governance toolkit for Power Platform tenants. It provides inventory, monitoring, and cleanup tooling.

### What the CoE Kit Does

| Module | Function |
|---|---|
| **Core** | Syncs all Power Platform resources (apps, flows, environments, connectors) into Dataverse for analysis |
| **Governance** | Sends compliance emails to app makers; archives unused resources; enforces naming |
| **Nurture** | Training resources, welcome emails for new makers, community resources |
| **Audit Log** | Captures user activity from Microsoft 365 Audit Log into Dataverse |
| **ALM Accelerator** | Git-backed ALM pipeline for solution promotion (optional, complex) |

### When to Recommend the CoE Kit

- Tenant has **more than ~20 active makers** and visibility into what exists is lost.
- Customer wants **compliance and cleanup** automation (orphaned flows, unused apps).
- Customer needs an **inventory** of all Power Platform usage for cost or license analysis.
- Customer is pursuing **governance maturity** and needs a foundation to build policies on.

### CoE Kit Caveats

- The CoE Kit is complex to deploy and maintain. Budget 2–4 days for initial deployment and configuration.
- It runs in a **dedicated CoE environment** — not in production or dev.
- It requires a **service account** with Power Platform admin rights for the sync flows.
- The kit is updated frequently. Plan for quarterly upgrade cycles.
- The ALM Accelerator is powerful but opinionated — evaluate carefully before committing a customer to it.

See [`patterns/coe-kit-patterns.md`](patterns/coe-kit-patterns.md).

---

## 5. Service Accounts

Automated flows and connections must not run under personal user accounts.

- Create a **dedicated service account** (a licensed user, not a service principal, for Power Automate flows — service principals cannot own flows as of this writing).
- The service account should have the **minimum permissions** required to perform its job.
- Store the service account credentials in **Azure Key Vault** and rotate on a schedule.
- Document the service account name, owner (the person accountable), and the flows that use it.
- When a consultant leaves a project, audit all connections and reassign any that ran under their personal account.

---

## 6. Licensing Checklist

Licensing errors discovered late in delivery are expensive. Check early.

| Component | Key License Consideration |
|---|---|
| Power Automate | Premium connectors require per-user or per-flow license |
| Power Apps | Premium connectors / Dataverse access require premium license |
| Copilot Studio | Per-tenant or per-message billing; check with customer's Microsoft agreement |
| Dataverse | Included in Dynamics 365 plans; standalone requires Power Apps premium |
| Custom Connectors | Available in premium plans only |
| AI Builder | Separate credit-based license; not included in standard Power Automate |
| Agent Flows | Included with Copilot Studio; not standalone |
| Managed Environments | Requires Power Apps/Power Automate premium per user in the environment |

Always validate against the customer's actual Microsoft Agreement (CSP, EA, MCA) before committing to a technical design that depends on specific licenses.

---

## 7. Review Checklist

- [ ] Environment ring is correctly structured (DEV/TEST/UAT/PROD minimum)
- [ ] Managed Environments enabled on TEST, UAT, PROD
- [ ] DLP policy in place — default-deny posture
- [ ] HTTP connector restricted or endpoint-filtered
- [ ] Service accounts documented and minimum-permissioned
- [ ] Service account credential rotation scheduled
- [ ] Licensing validated against customer's actual agreement
- [ ] CoE Kit recommended (or explicitly deferred with rationale)
- [ ] Solution checker enforced in pipeline before promotion

---

## Related

- [`patterns/dlp-policies.md`](patterns/dlp-policies.md)
- [`patterns/environment-provisioning.md`](patterns/environment-provisioning.md)
- [`patterns/coe-kit-patterns.md`](patterns/coe-kit-patterns.md)
- [`../solutions/patterns/environment-strategy.md`](../solutions/patterns/environment-strategy.md)
- [`../shared/environment-strategy.md`](../shared/environment-strategy.md) *(if present)*
- `microsoft/Microsoft-Power-Platform-Patterns-and-Practices` — CoE and governance reference

## Upstream Reference

- **Source:** `microsoft/Microsoft-Power-Platform-Patterns-and-Practices`, `microsoft/power-cat-skills` (powercat-governance)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra uses a 4-ring pipeline (not CoE Accelerator by default). Service accounts are mandatory; Power CAT's dev env provisioning skill automates single-environment creation but Sopra wraps it in broader lifecycle documentation. CoE Kit is recommended, not required.
