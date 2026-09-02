# Pattern: Flow Monitoring and Alerting

> **Architecture track:** Power Automate
> **When to load:** When setting up operational monitoring for flows in production, or when diagnosing reliability issues.

---

## Why Flows Fail Silently

By default, when a Power Automate flow fails:
1. The owner receives an email (if email notifications are on).
2. The run appears in the run history.
3. Nothing else happens.

For business-critical flows, silent failure is not acceptable. Design monitoring proactively.

---

## Run History

The run history is the primary diagnostic tool for every flow.

**Access:** Power Automate portal → My flows → [flow name] → Run history

| Column | What to Look For |
|---|---|
| Status | Failed / Cancelled / Succeeded / Running |
| Duration | Increasing trend = growing dataset or degrading connector |
| Start time | Scheduled flows: verify running at expected time |
| Trigger | What fired this run |

For failed runs: click the run to see exactly which action failed and the error message. This is
almost always enough to diagnose the problem.

---

## 1. Owner Failure Notifications

The simplest monitoring: the flow owner receives an email on failure.

Enable in flow settings:
```
Flow settings → Send a push notification / email when this flow fails → On
```

**Limitation:** Only the flow owner gets the notification. If the owner leaves the project, 
monitoring is silently lost. Always set a **group mailbox** or a **service account** as a 
co-owner so failure emails go to the team.

---

## 2. Error Handling Scope with Alert

For critical flows, build explicit alerting into the flow itself:

```
Scope: Main Work
  [all main flow actions]
  Configure run after: succeeded

Scope: Error Handler
  Configure run after: failed, timed out, skipped

  Error Handler contents:
    → Get the failed action details
    → Send Teams message / email to ops channel:
        "Flow [flow name] failed at [timestamp].
         Environment: [env]
         Error: [result()]
         Run URL: [concat('https://flow.microsoft.com/manage/...', workflow().run.id)]"
    → Optionally: create a Dataverse incident record
```

This pattern fires for any failure in the main scope, regardless of which action failed.

See [`error-handling.md`](error-handling.md) for the full scope pattern.

---

## 3. Teams Channel Alerting

Route failure alerts to a dedicated Teams channel (not individual emails):

```
Post message in a chat or channel (Teams connector)
  Team: [Operations/Monitoring team]
  Channel: [Power-Platform-Alerts]
  Message: adaptive card or plain text with:
    - Flow name
    - Environment
    - Error message
    - Direct link to the failed run
    - Timestamp
```

An adaptive card allows adding an "Acknowledge" or "Investigate" button directly in the alert.

---

## 4. Power BI Dashboard (CoE Kit)

The CoE Starter Kit includes a **Power BI report** that shows:
- Flow run health across the tenant
- Failed flows per environment
- Flows with no owner
- High-volume flows approaching API limits

This is the right tool when you need tenant-wide visibility, not per-flow alerting. It
complements per-flow error handling — it does not replace it.

See [`../../governance/patterns/coe-kit-patterns.md`](../../governance/patterns/coe-kit-patterns.md).

---

## 5. Power Automate Overflow (Power CAT)

For deep flow code review and guideline compliance:

```
Power CAT powercat-overflow skill:
  Reviews all Power Automate cloud flows in a solution .zip
  against Microsoft's coding guidelines.
  Outputs a findings.json and an interactive viewer.
```

Use this during:
- Pre-UAT review of a delivery
- Post-incident analysis
- Quarterly governance review

See: `microsoft/power-cat-skills` → `powercat-overflow`.

---

## Operational Checklist for Production Flows

- [ ] Flow failure notifications enabled (to a group, not an individual)
- [ ] Error handling scope wraps all main work
- [ ] Teams alert fires on failure with run link
- [ ] Flow co-owned by a service account or group (not only a consultant)
- [ ] Run history reviewed after first week in production
- [ ] Duration trend reviewed monthly
- [ ] Scheduled flows: next scheduled run date verified after any enable/disable cycle

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| No failure notification | Silent failures, SLA breach | Enable notifications to a group mailbox |
| Only the consultant as owner | Notifications go to someone who leaves | Add service account or group as co-owner |
| No error scope | Failure details lost; cannot alert with context | Add error handling scope |
| Run history checked only after complaints | Problems compound | Add automated alerting |
| No run URL in alert | Must manually find the run to investigate | Always include a direct link to the run |

---

## Upstream Reference

- **Source:** `pnp/powerautomate-samples`, `microsoft/power-cat-skills` (powercat-overflow)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires group-owned failure notifications and an error-scope alert on all production flows. The Power CAT Overflow skill is referenced as a delivery-review tool, not a runtime monitoring tool.
