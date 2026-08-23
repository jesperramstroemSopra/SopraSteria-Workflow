# Pattern: Dataverse Auditing

> **Architecture track:** Dataverse
> **When to load:** When a customer requires audit trails for business records, compliance tracing, or "who changed what and when" visibility.

---

## What Dataverse Auditing Captures

When enabled, Dataverse auditing records:
- **Record create / update / delete** — who performed the action, when, and what changed
- **Field-level changes** — old value and new value for each changed column
- **User login** — when a user authenticated to the environment
- **Privilege usage** — when a user uses a privilege (optional; rarely enabled due to volume)

Audit records are stored in the `Audit` table (read-only) within the same Dataverse environment.

---

## Enabling Auditing

### 1. Environment Level (prerequisite)

Auditing must be enabled at the environment level first.

```
Power Platform Admin Center
  → Environments → [your environment] → Settings
  → Audit and logs → Audit settings
  → Start Auditing: ON
  → Log access: ON (optional; high volume)
  → Read logs: ON (optional; captures read-only access)
```

### 2. Table Level

For each table that requires auditing:

```
Solution → Table → Properties → Advanced options
  → Auditing: Enabled
```

Or via code:
```
Entity.IsAuditEnabled = true
```

### 3. Column Level

For each column where old/new values must be captured:

```
Solution → Table → Column → Advanced options
  → Enable auditing: Checked
```

**Best practice:** Enable at table level first (captures create/delete). Enable at column level only for columns where the change history is needed — field-level auditing increases storage consumption.

---

## Querying the Audit Log

The audit log is in the `Audit` table. Access via:
- **Model-Driven App**: Settings → Audit Summary View / Entity Audit (per record)
- **Web API**: `GET /api/data/v9.2/audits?$expand=regardingobjectid_account($select=name)`
- **Power Automate**: `List rows` on the `Audit` table

Key columns:
| Column | Meaning |
|---|---|
| `createdon` | When the audit record was created |
| `userid` | Who made the change (lookup to systemuser) |
| `operation` | 1=Create, 2=Update, 3=Delete, 4=Access |
| `objectid` | The record that was changed |
| `objecttypecode` | The entity/table |
| `changedata` | JSON with old/new field values |

Parsing `changedata` requires JSON processing. Use a Flow with `Parse JSON` action.

---

## Retention and Storage

Audit records accumulate continuously. Without a retention policy, they grow unbounded and consume capacity.

### Built-in Retention

Dataverse supports audit log retention policies:
- Set retention period (in days) at environment or table level.
- Records older than the retention period are deleted automatically.
- Default: no automatic deletion (unlimited retention until manually managed).

```
Admin Center → Environments → Settings → Audit and logs → Retention policy
```

### Storage Impact

- Audit data counts against the environment's database storage capacity.
- Field-level auditing on high-volume tables (e.g., a table updated thousands of times per day) can generate significant storage growth.
- Estimate: ~300 bytes per field change per record. A table with 10 columns updated 1000 times/day = ~1 MB/day.

### Export for Long-Term Retention

For compliance requirements that exceed Dataverse storage budgets:
- Export audit logs to Azure Data Lake (Dataverse Azure Synapse Link).
- Or export via scheduled Flow to Azure Blob Storage / SharePoint.

---

## Per-Record Audit View

In Model-Driven Apps, users can view the audit history for a specific record:
- Record → ... (command bar) → Audit History

This shows a timeline of all changes to the record with field-level before/after values.
It requires the user to have the **View Audit History** privilege in their security role.

---

## Security Role Requirements

| Capability | Required Privilege |
|---|---|
| View audit records | View Audit History (Org level) |
| Delete audit records | Delete Audit Record (System Admin only) |
| Enable/disable auditing | Manage Audit Settings (System Admin) |

Grant audit viewing to compliance and support roles; restrict deletion to System Admin.

---

## Checklist

- [ ] Auditing enabled at environment level
- [ ] Tables requiring audit trails have auditing enabled
- [ ] Field-level auditing enabled for regulated columns
- [ ] Retention policy configured to match customer's compliance requirements
- [ ] Storage impact estimated; storage capacity monitored
- [ ] "View Audit History" privilege granted to compliance/support roles
- [ ] Audit export strategy defined if retention > Dataverse capacity allows

---

## Upstream Reference

- **Source:** `microsoft/PowerApps-Samples`, Microsoft Learn — Dataverse auditing documentation
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires a retention policy decision and storage impact estimate as part of any auditing design. Field-level auditing is opt-in per column (not table-wide) to control storage growth.
