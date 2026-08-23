# Pattern: CoE Starter Kit

> **Architecture track:** Governance
> **When to load:** When a customer needs tenant-wide Power Platform visibility, compliance automation, or is pursuing governance maturity.

---

## What the CoE Kit Is

The **Center of Excellence (CoE) Starter Kit** is a Microsoft-maintained set of solutions (Power
Automate flows, Canvas Apps, Dataverse tables, Power BI reports) that give Power Platform admins
visibility into everything happening in their tenant.

It is **not** a product — it is an accelerator. It requires setup, maintenance, and a dedicated
service account. Budget for it accordingly.

---

## Core Modules

### 1. Core (Required — install first)

Syncs all Power Platform inventory into a Dataverse environment:
- Environments, apps (Canvas + MDA), flows, connectors, makers
- App and flow usage (last launched, run count)
- Orphan detection (apps with no owner, flows with personal connections)

This data feeds all other modules. Without Core, nothing else works.

**Key flows:**
- `Admin | Sync Template v4 (Apps)` — syncs all Canvas Apps
- `Admin | Sync Template v4 (Flows)` — syncs all flows
- `Admin | Sync Template v4 (Model Driven Apps)` — syncs MDAs
- `Admin | Sync Template v4 (Connectors)` — syncs connector usage
- `Admin | Sync Template v4 (Environments)` — syncs environment metadata

### 2. Governance

Automates compliance communication and cleanup:
- Sends emails to app makers asking them to justify their apps (archival workflow)
- Archives apps and flows that receive no response after N days
- Reports non-compliant apps (no description, no owner, not in a solution)

This is the most time-saving module. A single governance run can identify hundreds of orphaned
resources that would otherwise waste capacity and create security risk.

### 3. Nurture

Maker onboarding and community:
- Welcome email to new makers
- Training material distribution
- Community hub (internal app for sharing resources)

Lower priority for most Sopra engagements — focus on Core and Governance first.

### 4. Audit Log

Captures Microsoft 365 Audit Log data into Dataverse:
- Who launched which app, when
- Flow run history at user level
- Sign-in and data access patterns

Requires Office 365 Audit Log access and additional setup. Recommended for regulated industries.

### 5. ALM Accelerator (Optional — advanced)

A full ALM pipeline built on Power Platform and GitHub. Provides a Canvas App UI for developers to
submit, review, and promote solutions without needing direct GitHub access.

**Evaluate carefully before recommending.** It is powerful but complex:
- Requires Azure DevOps or GitHub with specific service connections.
- The UI wraps the pipeline but cannot replace understanding of what the pipeline does.
- Works best for customers with many teams building on Power Platform simultaneously.
- For most Sopra projects, the standard GitHub Actions pipeline is simpler and sufficient.

---

## Deployment Checklist

### Pre-Deployment

- [ ] Dedicated **CoE environment** provisioned (not shared with business solutions)
- [ ] Service account created with **Power Platform Admin** role
- [ ] Service account has **Office 365 license** (required for sync flows)
- [ ] Azure AD app registration created for audit log access (if Audit Log module is needed)
- [ ] CoE Kit version determined and documented (changes frequently)

### Deployment Order

1. Import **Core** solution
2. Configure all connection references (use the service account)
3. Enable all sync flows (turn on manually — they are off by default)
4. Run first sync manually and verify inventory data appears
5. Import **Governance** module after Core sync has completed at least once
6. Configure governance flows (email templates, archival policy days, excluded environments)
7. Import optional modules (Nurture, Audit Log) as needed

### Post-Deployment

- [ ] Power BI report connected to the CoE Dataverse environment
- [ ] Weekly digest email verified (sent to admin group)
- [ ] Sync flows scheduled and running (check run history after 24 hours)
- [ ] Excluded environments list configured (do not govern the CoE environment itself)
- [ ] Upgrade cadence agreed with customer (recommend: quarterly)

---

## Maintenance

The CoE Kit is updated frequently (typically monthly). Plan for:
- **Quarterly upgrades** at minimum.
- Each upgrade requires re-importing solutions and re-binding connection references.
- Breaking changes are documented in the CoE Kit release notes — read them before upgrading.
- Test upgrades in a copy of the CoE environment before applying to production CoE.

---

## Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| CoE Kit in the Default environment | Contamination; hard to govern | Dedicated CoE environment |
| Personal connection on sync flows | Breaks when person leaves | Service account connections only |
| No upgrade plan | Kit falls behind; sync flows break on API changes | Quarterly upgrade in project calendar |
| Deploying CoE Kit without a champion | No one acts on the findings | Identify an admin champion before deployment |
| Using ALM Accelerator without pipeline knowledge | Black box; failures are opaque | Train the team on the underlying pipeline first |

---

## Upstream Reference

- **Source:** `microsoft/Microsoft-Power-Platform-Patterns-and-Practices` (CoE Starter Kit documentation)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra recommends CoE Kit for tenants with >20 active makers but does not mandate it. The ALM Accelerator is evaluated case-by-case; the standard GitHub Actions pipeline is the Sopra default. A dedicated champion is a required prerequisite before Sopra will deploy the CoE Kit.
