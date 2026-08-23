# Pattern: Scheduled Flows

> **Architecture track:** Power Automate
> **When to load:** Before designing any scheduled or recurring flow, or when troubleshooting scheduled flow reliability.

---

## When to Use a Scheduled Flow

Use scheduled flows for:
- Nightly/weekly data synchronization between systems
- Report generation and distribution
- Cleanup jobs (archive old records, delete expired data)
- Health checks and monitoring probes
- Bulk operations that should not block a user

Do **not** use scheduled flows for:
- Anything that must respond within seconds of an event (use automated trigger)
- Real-time notifications (use event-driven flow)
- Replacing a proper ETL pipeline for high-volume data (use Azure Data Factory)

---

## Schedule Configuration

### Recurrence Trigger

```
Trigger: Recurrence
  Interval: 1
  Frequency: Day
  Start time: 2024-01-01T02:00:00Z  (always set; prevents "run at deploy time")
  Time zone: UTC  (always UTC for scheduled flows — local time causes DST issues)
  At these hours: [2]     (for daily at 2am UTC)
  At these minutes: [0]
```

**Always set a start time.** Without it, the flow starts at the time it was enabled, which shifts
over time and makes it impossible to predict when the next run will be.

**Always use UTC.** Local time zones with DST changes cause flows to skip or double-run during
transitions.

---

## Concurrency and Overlap

By default, Power Automate allows multiple instances of the same scheduled flow to run simultaneously. If the flow takes longer than one interval, you get overlapping runs.

### Concurrency Limit

Set on the trigger:
```
Settings > Concurrency control > On
Degree of parallelism: 1
```

With concurrency = 1, a new run is queued but not started until the previous run completes.
Any run that waits more than the queue timeout is cancelled.

### Sliding Window

Use the **Sliding Window** trigger instead of Recurrence when:
- Every scheduled run must execute (no runs can be skipped)
- The flow was disabled for a period and must catch up

The Sliding Window trigger fires runs for every missed interval when the flow is re-enabled, ensuring no gaps in processing. Use cautiously — a long downtime can queue hundreds of catch-up runs.

---

## Run History Analysis

Scheduled flows produce a run history that is the primary diagnostic tool. Check:

| Signal | Possible Cause |
|---|---|
| Run duration increasing over time | Data volume growing; unbounded queries |
| Frequent timeouts (30-minute limit) | Flow doing too much in one run; split into batches |
| Skipped runs | Concurrency overlap; previous run still running |
| Succeeded but no visible output | Logic error — check conditions and filter |
| Failed on same action every time | Connector error, schema change, or permissions |

---

## Batching Large Datasets

Scheduled flows that process large datasets should use pagination:

```
Initialize variable: varSkip = 0
Initialize variable: varHasMore = true

Do Until varHasMore = false:
    Get items from Dataverse (top: 500, skip: varSkip)
    If item count = 0: set varHasMore = false
    Process items
    Increment varSkip by 500
```

**Set a maximum iteration limit** on the Do Until (e.g., 1000 iterations = 500,000 records max) to prevent infinite loops.

---

## Performance and Throttling

- Power Automate has **per-flow action limits per day** (varies by license). Large scheduled flows can exhaust their daily limits.
- Dataverse connectors have **API call limits** per 24-hour period per environment. Heavy scheduled flows count against this.
- If throttled, the flow will receive 429 responses. Use `Retry Policy` on actions that call external APIs (see custom connectors patterns).
- For very high-volume batch processing, consider Azure Logic Apps (no per-action billing) or Dataverse bulk API calls.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| No start time on recurrence trigger | Unpredictable run time; shifts at re-enable | Always set a start time in UTC |
| Local time zone on trigger | DST causes double-runs or skipped runs | Always use UTC |
| No concurrency limit | Overlapping runs corrupt shared state or double-process | Set concurrency to 1 |
| Unbounded query inside the flow | Gets slower every week as data grows | Always paginate with a bounded query |
| No error handling | Silent failures; data not processed | Wrap in error scope; alert on failure |
| Flow doing everything in one run (no batching) | Hits 30-minute timeout as data grows | Design for batching from the start |

---

## Upstream Reference

- **Source:** `pnp/powerautomate-samples`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires UTC triggers, explicit start times, and concurrency limits as mandatory for all scheduled flows. Batching is required for any flow processing >500 records. A maximum iteration guard on Do Until loops is required.
