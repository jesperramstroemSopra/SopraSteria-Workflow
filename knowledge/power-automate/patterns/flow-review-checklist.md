# Pattern: Power Automate Flow Review Checklist

> **Architecture track:** Power Automate
> **When to load:** Before delivering a Power Automate flow or solution to UAT/PROD, or when reviewing a customer's existing flows.

> **Automated tool:** For deep review of all flows in a solution `.zip`, use the Power CAT
> `powercat-overflow` skill (`microsoft/power-cat-skills` → `powercat-overflow`). This checklist
> is the manual equivalent for targeted reviews.

---

## Naming and Maintainability

- [ ] Flow has a descriptive name stating its business purpose (not `Flow 1`, `New flow`, `Copy of...`)
- [ ] All actions have been renamed from their defaults (`Set variable` → `Set: invoiceStatus = Approved`)
- [ ] Variables have descriptive names; no `var1`, `stringVar`, `integer`
- [ ] No duplicate flows — `Copy of [Flow]` variants shipped alongside the original
- [ ] Comments or descriptions added to complex expressions
- [ ] Flow description explains the business purpose and trigger

**References:** [Use consistent naming](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/use-consistent-naming-conventions)

---

## Error Handling

- [ ] All flows have a top-level Scope action wrapping the main work
- [ ] A second Scope (`Run after: Failed, Timed out, Skipped`) handles errors
- [ ] Error handler captures action name and error message
- [ ] Error handler notifies an owner/group (not just the personal account)
- [ ] Error handler includes a direct link to the failed run
- [ ] No `Apply to each` loops without error handling on the loop body
- [ ] No silent swallow of errors (empty error handler branches)

**References:** [Error handling](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/error-handling), [`error-handling.md`](error-handling.md)

---

## Security and Data

- [ ] No passwords, secrets, or API keys in hardcoded string literals
- [ ] Sensitive inputs/outputs use **Secure inputs / Secure outputs** setting
- [ ] No business data passed through query parameters (use body/headers instead)
- [ ] Connection references used — no hardcoded personal connections
- [ ] Flow does not run under a personal user account (service account)
- [ ] Flow shares data only with systems that are authorized to receive it

**References:** [Secure inputs/outputs](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/use-secure-inputs-outputs-triggers), [Prevent data exfiltration](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/prevent-data-exfiltration), [Secure data](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/secure-data-used-in-cloud-flows)

---

## Environment Variables

- [ ] All URLs, list names, site paths, and environment-specific configuration use **Environment Variables** — not hardcoded strings
- [ ] All Environment Variables are solution components (not created outside the solution)
- [ ] Environment Variables have current values set per environment (not left at default only)

**References:** [Use environment variables](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/use-environment-variables)

---

## Performance and Limits

- [ ] `Apply to each` loops are avoided where a bulk operation (batch, array functions) is possible
- [ ] No nested `Apply to each` loops without documented justification
- [ ] Dataverse queries use OData filter expressions (server-side) — not client-side filtering
- [ ] Queries use `$select` to retrieve only required columns
- [ ] Scheduled flows: UTC trigger, explicit start time, concurrency limit set
- [ ] Large datasets handled with explicit pagination (not `Get all items` on unbounded collections)
- [ ] Parallel branches used where actions are independent (reduces total run time)

**References:** [Avoid anti-patterns](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/avoid-anti-patterns), [Understand limits](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/understand-limits), [Parallel execution](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/implement-parallel-execution)

---

## Reusability

- [ ] Repeated logic extracted to a **child flow** rather than duplicated
- [ ] Child flows have a descriptive name and documented inputs/outputs
- [ ] No copy-paste of multi-step sequences across flows

**References:** [Create reusable code](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/create-reusable-code)

---

## Business Logic Placement

- [ ] Complex business rules (calculations, validations, transformations) are in Dataverse plugins or business rules — not in long expression chains in the flow
- [ ] Flow expresses orchestration (what happens and in what order), not low-level computation

**References:** [Leave complex business logic out](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/leave-complex-business-logic-out)

---

## ALM Readiness

- [ ] Flow is in a solution (not an unpackaged personal flow)
- [ ] Connection references used (not direct personal connections)
- [ ] Flow can be imported into a clean environment without manual fix-up (test this in DEV)

**References:** [Solution-aware flows](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/understand-benefits-solution-aware-flows)

---

## Monitoring

- [ ] Flow failure notifications enabled (to a group, not an individual)
- [ ] Co-owner is a service account or group (not only the consultant)
- [ ] Production flows: error scope sends a Teams/email alert with run link

See [`monitoring.md`](monitoring.md) for the full monitoring pattern.

---

## Trigger Optimization

- [ ] Dataverse triggers use column filters (trigger only when relevant columns change)
- [ ] Automated triggers use **Filter array** or trigger conditions to avoid unnecessary runs
- [ ] No high-frequency trigger without documented rate justification

**References:** [Optimize triggers](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)

---

## Severity Reference

| Finding type | Severity |
|---|---|
| Hardcoded secret or credential | 🔴 High — blocking |
| No error handling | 🔴 High — blocking |
| Connection not a connection reference | 🔴 High — blocks ALM |
| No environment variables on URLs | 🟡 Medium |
| Actions not renamed | 🟡 Medium |
| No `$select` on Dataverse queries | 🟡 Medium |
| No monitoring/alerting | 🟡 Medium |
| Complex business logic in flow | 🟡 Medium |
| Nested Apply to each | 🟠 Review |
| No child flow for repeated logic | 🟢 Low |
| Missing description | 🟢 Low |

---

## Upstream Reference

- **Source:** `microsoft/power-cat-skills` (powercat-overflow / sources.md), Microsoft Learn Power Automate coding guidelines
- **Accessed:** 2026-Q3
- **Sopra Divergence:** This checklist adapts the Overflow skill's review categories into a manual pre-delivery checklist. Hardcoded credentials and missing connection references are classified as High/blocking (stronger than Overflow's default). The `powercat-overflow` skill should be run on the full solution `.zip` before UAT delivery for automated coverage; this checklist supplements it for in-review targeted checks.
