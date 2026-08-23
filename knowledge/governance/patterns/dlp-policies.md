# Pattern: DLP Policies

> **Architecture track:** Governance
> **When to load:** Before designing DLP policies for a customer tenant, or when advising on connector classification.

---

## DLP Policy Fundamentals

Data Loss Prevention (DLP) policies in Power Platform control which connectors can be used together
in a flow or app. They prevent data from flowing between systems that should not be connected
(e.g., business data from SharePoint to a consumer social media service).

### The Three Connector Groups

Every connector assigned to a DLP policy falls into one of three groups:

| Group | Meaning |
|---|---|
| **Business** | Approved for use with business data. Connectors in this group can communicate with each other. |
| **Non-Business** | Not approved for business data. Can be used in flows, but not together with Business connectors. |
| **Blocked** | Cannot be used at all in the policy scope. |

**The core rule:** A flow or app cannot use connectors from both Business and Non-Business groups
simultaneously. This is what prevents data exfiltration.

---

## Policy Scope

| Scope | Who Sets It | Override? |
|---|---|---|
| **Tenant-wide** | Power Platform Admin / Global Admin | Cannot be overridden by environment admin |
| **Environment** | Environment Admin | Can restrict further, never relax beyond tenant policy |

Use tenant-wide policies for baseline security. Use environment policies to further restrict
specific environments (e.g., block all premium connectors in non-production environments).

---

## Sopra Default Policy Design

### Tenant Policy (Starting Point)

```
Business connectors (initial set):
  - Office 365 (SharePoint, Outlook, Teams, OneDrive for Business)
  - Dataverse
  - Microsoft Forms
  - Azure (Blob Storage, Service Bus, Key Vault — if used)
  - Approvals
  - Notifications

Non-Business (default for unclassified):
  - All other connectors not explicitly classified

Blocked:
  - Specific high-risk connectors (review quarterly):
    - Social media consumer connectors
    - Any connector the customer explicitly rejects
```

### HTTP Connector Treatment

The HTTP connector is the highest-risk connector in Power Platform — it can call any URL on the
internet. Options:

| Approach | When to Use |
|---|---|
| **Blocked** (recommended for most) | Tenant has no need for arbitrary HTTP calls; all external APIs use custom connectors |
| **Business group + endpoint filtering** | Specific HTTP calls are needed; Managed Environments required to use endpoint filtering |
| **Non-Business** (not recommended) | Isolated dev environments only; never in environments with business data |

Use **connector endpoint filtering** (Managed Environments feature) to allow only specific URL
patterns if the HTTP connector must remain available.

---

## Adding Connectors to the Business Group

As new connectors are introduced in a project, they must be classified:

1. **Identify** the connector (standard, premium, or custom).
2. **Assess** what data it accesses: is it business data, personal data, or neither?
3. **Request classification** with rationale (custom connectors default to Non-Business).
4. **Update** the tenant or environment DLP policy.
5. **Document** the classification decision and rationale in the project governance log.

Custom connectors are **Non-Business by default**. If they access business data, they must be
explicitly moved to the Business group after classification.

---

## DLP Policy Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| No tenant-wide policy | Every environment unrestricted by default | Create a baseline tenant policy immediately |
| HTTP connector in Business group with no endpoint filtering | Any URL callable with business credentials | Block or add endpoint filtering |
| Custom connector left in Non-Business when handling business data | Flows can't use it alongside SharePoint/Dataverse | Classify and move to Business group |
| Environment admins setting conflicting environment policies | Policy sprawl, audit failures | Document intended policy hierarchy; review quarterly |
| Classifying connectors once and never reviewing | Connector updates may change capabilities | Quarterly connector review |

---

## Policy Verification Checklist

- [ ] Tenant-wide baseline policy exists
- [ ] HTTP connector is Blocked or endpoint-filtered
- [ ] All custom connectors explicitly classified (not left at default)
- [ ] Business connector list reviewed and approved by customer
- [ ] Environment-level policies documented and justified
- [ ] Policy audit run after any new connector is introduced in a project
- [ ] Quarterly review scheduled

---

## Upstream Reference

- **Source:** `microsoft/Microsoft-Power-Platform-Patterns-and-Practices`, `microsoft/power-cat-skills` (powercat-governance)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra mandates a default-deny posture (everything not explicitly Business is Non-Business or Blocked). HTTP connector is blocked by default unless the customer has a documented, approved need. Custom connector classification is a required delivery artifact.
