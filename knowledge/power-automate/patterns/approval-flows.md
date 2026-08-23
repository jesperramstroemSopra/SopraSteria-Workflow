# Pattern: Approval Flows

> **Architecture track:** Power Automate
> **When to load:** Before designing any approval process in a flow.

---

## Choosing the Approval Pattern

```
Does the approval require multiple approvers?
├─ No (one approver) → Single approver pattern
└─ Yes
    ├─ Any one approver can approve (OR) → Parallel approval
    └─ All must approve (AND) → Sequential or parallel-all
        └─ Does order matter?
            ├─ Yes → Sequential approval chain
            └─ No → Parallel all-required approval
```

---

## 1. Single Approver

The simplest pattern. One approval request; the flow waits for a response.

```
Trigger
→ Create approval (Approvals connector)
    - Title: meaningful business description
    - Assigned to: approver email
    - Details: all information the approver needs to decide
→ Wait for approval response
→ Condition: Outcome = "Approve"
    - Yes: proceed with approval actions
    - No: proceed with rejection actions
→ Send outcome notification to requestor
```

**Always** send a notification to the requestor on both outcomes — do not leave them wondering.

---

## 2. Parallel Approval (First Response Wins)

Any one approver approving or rejecting terminates all other pending requests.

```
Trigger
→ Start and wait for approval of type:
    "First to respond" (multiple approvers in Assigned to)
    - Or use: Create approval → Start approval → Wait for multiple
→ Condition on outcome
```

Use this for:
- Escalation groups where any manager can approve
- On-call rotations

**Gotcha:** If you use individual `Create approval` actions in parallel branches, you must
cancel the other approvals explicitly when one completes. Use the built-in "First to respond"
type to avoid this complexity.

---

## 3. Sequential Approval Chain

Each approver sees the request only after the previous one approves.

```
Trigger
→ Apply to each (approvers list):
    → Create approval for current approver
    → Wait for response
    → If Reject: exit loop early (Set terminate variable), send rejection notice
    → If Approve: continue to next approver
→ After loop: check if all approved
→ Final approval actions / rejection actions
```

Use `Do Until` with a rejection flag rather than `Apply to each` if early exit is needed in
older flow configurations.

---

## 4. Parallel All-Required Approval

All approvers must approve; any rejection fails the entire request. Order does not matter.

```
Trigger
→ Create approval (type: Everyone must approve, multiple assigned to)
→ Wait for approval response
→ Condition: Outcome contains "Approve" for all
```

The built-in "Everyone must approve" type handles this natively — use it.

---

## Teams Adaptive Card Approvals

For approvals surfaced directly in Microsoft Teams (Teams approval app or Adaptive Cards):

- Use the **Approvals** connector with `Approval type: Custom responses` to define custom buttons.
- Use **Teams post adaptive card and wait for response** for lightweight approvals without the full Approvals app.
- Approval notifications appear in both the Approvals app and Teams activity feed — users can respond from either.
- For Teams-embedded approvals, the approver must have a Teams license.

---

## Timeout and Escalation

Every approval flow must handle the case where the approver does not respond.

```
→ Create approval
→ Start approval
→ Do Until (response received OR timeout reached):
    → Delay for 24 hours
    → If no response after N days: send reminder / escalate to manager
→ Wait for approval (with timeout)
→ Handle timeout as rejection or escalation
```

The built-in `Wait for approval` action does not have a native timeout. Implement timeout via a
parallel branch: one branch waits for approval, the other delays for the timeout period. Use
`Terminate` on whichever branch completes second.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Approval flow with no timeout | Flow runs forever if approver never responds | Add timeout + escalation |
| No notification to requestor on rejection | Requestor has no visibility | Always notify on both outcomes |
| Storing approval decision in a global variable across multiple approvals | Race condition if parallel | Use response object directly in the branch |
| Approval email contains no context | Approver has to look up information elsewhere | Include all decision-relevant data in the approval details |
| Approval flow without Teams integration | Users must check email; slower response | Route approvals to Teams for faster response |

---

## Upstream Reference

- **Source:** `pnp/powerautomate-samples` (approval flow samples)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires timeout handling and dual-outcome notification (approve + reject) as mandatory components of any approval flow. Teams routing is recommended but not mandated.
