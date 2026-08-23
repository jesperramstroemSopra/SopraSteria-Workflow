# Pattern: Environment Provisioning

> **Architecture track:** Governance
> **When to load:** Before provisioning new Power Platform environments for a customer, or when advising on environment lifecycle management.

---

## Environment Types

| Type | Use | Notes |
|---|---|---|
| **Production** | Live system | Backed up; SLA applies; no direct editing |
| **Sandbox** | Dev, Test, UAT | Can be reset; no backup SLA |
| **Developer** | Individual developer personal env | Free with developer license; isolated; not for shared team work |
| **Default** | Exists in every tenant; cannot be deleted | Avoid deploying production solutions here; it's hard to govern |
| **Trial** | 30-day temporary | Do not use for customer solutions |
| **Teams** | Microsoft Teams-embedded | Subset of Dataverse; limited; for lightweight Teams apps only |

---

## Sopra Naming Convention

```
[CustomerCode]-[Purpose]-[Region]

Examples:
  ACME-DEV-WEU        (West Europe development)
  ACME-TEST-WEU
  ACME-UAT-WEU
  ACME-PROD-WEU
  ACME-HOTFIX-WEU     (temporary; decommissioned after hotfix promotion)
```

The environment **display name** follows the convention. The environment **URL** should match where possible (e.g., `acme-prod-weu.crm4.dynamics.com`).

---

## Provisioning Checklist

When provisioning a new environment, complete all of these before handing it to developers:

### Identity and Access
- [ ] Environment Admin role assigned to the Sopra project lead and the customer's IT admin
- [ ] Service account created and assigned Dataverse System Administrator role
- [ ] Developer access limited to the DEV environment (not TEST/UAT/PROD)
- [ ] D365 security roles created (or imported from DEV) before users are added

### DLP and Governance
- [ ] Environment-level DLP policy applied (or verified as covered by tenant policy)
- [ ] Managed Environments enabled (TEST, UAT, PROD)
- [ ] Solution checker enforcement turned on in Managed Environments settings (UAT, PROD)
- [ ] Sharing limits configured to prevent wide sharing (MDA and Canvas apps)

### ALM
- [ ] Environment added to the ALM pipeline (GitHub Actions or ADO) with appropriate secrets/service connections
- [ ] Import validation step configured (solution checker must pass before import)
- [ ] Environment variables and connection references documented for this environment

### Documentation
- [ ] Environment URL and ID recorded in the project delivery documentation
- [ ] Service account credentials stored in Key Vault; access documented
- [ ] Environment lifecycle plan documented (when will DEV/TEST be decommissioned?)

---

## Developer Environment Provisioning (Power CAT Pattern)

For individual developers who need isolated personal environments without impacting team environments:

```
Power CAT create-pp-dev-env skill:
  Provisions a Developer environment for any specified user via the BAP API.
  Sets standard governance defaults (Managed Environments, DLP).
  Does not require admin center access.
```

Use this for:
- Onboarding new developers quickly.
- Providing isolated environments for spike/proof-of-concept work.
- Replacing ad-hoc "I'll use the default environment" behaviour.

See: `microsoft/power-cat-skills` → `powercat-governance` → `create-pp-dev-env`.

---

## Environment Lifecycle Management

Environments have a lifecycle. Failure to manage it creates dead environments, orphaned apps, and
license waste.

| Stage | Action |
|---|---|
| **Provisioning** | Follow checklist above |
| **Active delivery** | Developers use DEV; TEST/UAT/PROD gated by ALM pipeline |
| **Hypercare (post go-live)** | Keep DEV and HOTFIX active; plan TEST/UAT decommission timeline |
| **Steady state** | DEV available for enhancements; TEST/UAT spun up per release cycle if cost is a concern |
| **End of project** | Decommission DEV; archive UAT; PROD remains under customer ownership |

When DEV is decommissioned, ensure all schema changes are captured in solution exports — environments cannot be "undeleted" after a 7-day grace period.

---

## Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| Using Default environment for solutions | Uncontrolled sharing; hard to govern | Always provision dedicated environments |
| Developer has access to PROD | Accidental changes; audit failure | Role-based access; PROD via pipeline only |
| No environment naming convention | Confusion, wrong deployments | Enforce naming at provisioning time |
| Environments created ad-hoc with no tracking | License waste; unknown what exists | Use the provisioning checklist; track in a register |
| Service account not created at provisioning | Connections created under personal accounts; breaks when consultant leaves | Always provision service account before first connection |

---

## Upstream Reference

- **Source:** `microsoft/Microsoft-Power-Platform-Patterns-and-Practices`, `microsoft/power-cat-skills` (powercat-governance / create-pp-dev-env)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra adds a mandatory service account provisioning step at environment creation time. The Power CAT `create-pp-dev-env` skill is referenced as an automation accelerator for developer environment provisioning; Sopra wraps it in the broader lifecycle documentation.
