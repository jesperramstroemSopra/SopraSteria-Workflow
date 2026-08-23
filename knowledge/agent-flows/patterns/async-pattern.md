# Pattern: Async Agent Flow + Cloud Flow Split

> **Architecture track:** Agent Flows
> **When to load:** When designing an agent-initiated process that takes more than a few seconds to complete.

---

## The Problem with Long-Running Agent Flows

An agent flow is called mid-conversation. The user is waiting. If the flow takes 30 seconds —
or several minutes — the conversation stalls and the agent looks broken or unresponsive.

The solution is to **split the work**:
- The agent flow accepts the request, validates it, and returns immediately with an acknowledgement.
- A cloud flow (triggered by an event) does the long or asynchronous work independently.

---

## Pattern Structure

```
User: "Please process the monthly supplier report for March."

Agent
  → Calls: Submit supplier report job (agent flow)
      Validates: month = "March", year = 2024
      Creates: Dataverse job record (status = Queued, jobId = guid)
      Returns: { success: true, jobId: "abc-123", message: "Report job queued. You'll receive a Teams notification when it's complete." }

Agent → Tells user: "Your report is being processed. I'll notify you when it's done."

[background — no conversation involved]

Cloud Flow (trigger: Dataverse row created, table = ReportJobs, status = Queued)
  → Processes the report
  → Updates job record (status = Completed, outputUrl = ...)
  → Posts Teams message to user: "Your March supplier report is ready: [link]"
```

---

## When to Use This Pattern

Use the async split when:
- The processing takes more than ~10 seconds
- The processing involves heavy computation, large data volumes, or external slow APIs
- The result can be delivered asynchronously (notification, email, file ready)

Do **not** use this pattern when:
- The user needs the result immediately to continue the conversation
  (`"How many open invoices do I have?"` must be answered synchronously)
- The processing is fast (<5 seconds reliably)

---

## The Job Record

The handoff mechanism is a **Dataverse job record** (or a SharePoint row, Azure Storage queue item,
or Service Bus message — whichever fits the architecture).

The job record should contain:
| Field | Type | Purpose |
|---|---|---|
| `jobId` | Unique identifier | Returned to the agent and user for reference |
| `status` | Choice | `Queued`, `Processing`, `Completed`, `Failed` |
| `requestedBy` | Lookup (systemuser) | For output routing (Teams notification to the right user) |
| `requestedAt` | DateTime | Audit trail |
| `parameters` | Text (JSON) | The input parameters; validated and stored at queue time |
| `outputUrl` | Text | Link to the result when complete |
| `errorMessage` | Text | User-safe error if the job fails |

---

## Agent Flow Responsibilities

The agent flow does **only** the synchronous, fast portion:
1. Validate inputs (required fields, business rules — fail fast).
2. Create the job record.
3. Return `{ success, jobId, message }`.

It must **not** start the heavy processing itself. The cloud flow trigger handles that.

---

## Cloud Flow Responsibilities

The cloud flow does the heavy work:
1. Triggered by the job record creation (Dataverse trigger).
2. Updates the job status to `Processing`.
3. Performs the actual work.
4. On success: update status to `Completed`, set `outputUrl`, notify user.
5. On failure: update status to `Failed`, set `errorMessage` (user-safe), notify user.

The cloud flow should have its own error handling scope so the job record is always updated,
even if the work fails. Never leave a job record stuck in `Processing`.

---

## Status Check Flow (Optional)

If the user might ask "what's the status of my report?", add a second agent flow:

```
Name: Check report job status
Description: "Checks the status of a previously submitted report job.
 Use when the user asks about the progress of a job they submitted earlier.
 Requires the jobId returned when the job was submitted."

Input: jobId (string)
Output: { success, status, message, outputUrl (if complete) }
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Agent flow does all the work synchronously | User waits; conversation stalls | Use async split |
| No job record | No audit trail; no status check capability | Always create a job record |
| Cloud flow doesn't update job on failure | Job stuck in Processing forever | Error scope always updates job status |
| No user notification when complete | User has to keep asking; poor experience | Proactive notification via Teams or email |
| Agent flow validates nothing before queuing | Garbage jobs queued; cloud flow fails | Validate inputs in the agent flow before creating the record |

---

## Upstream Reference

- **Source:** `knowledge/agent-flows/ARCHITECTURE.md` §3 (Latency is user-facing), §2 (Agent flow vs cloud flow)
- **Accessed:** Internal
- **Sopra Divergence:** Expands ARCHITECTURE.md §2 and §3 with the full split-pattern implementation including the job record schema, responsibility boundaries, and the optional status-check flow.
