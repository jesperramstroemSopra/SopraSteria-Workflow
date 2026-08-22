# Topic Design — Patterns and Best Practices

## Overview

Topics are the fundamental unit of conversation in Copilot Studio. Good topic design determines whether an agent is maintainable, reliable, and easy to extend. This document covers trigger phrase strategy, slot-filling, topic size, chaining, and adaptive card usage.

---

## 1. Trigger Phrase Strategy

Trigger phrases determine which topic Copilot Studio routes an utterance to. They are processed by the NLU engine, which means exact keyword matching is **not** how routing works — intent similarity matters more.

### Rules for Effective Trigger Phrases

1. **Write 10–15 phrases per topic** for production agents. Fewer than 5 is insufficient for the NLU model.
2. **Cover intent variations, not just paraphrases**:
   - `"What is my leave balance?"` (interrogative)
   - `"Check my leave"` (command)
   - `"How many days off do I have?"` (colloquial)
   - `"Remaining annual leave"` (noun phrase)
3. **Include common misspellings and abbreviations** for high-frequency intents: `"PTO balance"`, `"AL check"`.
4. **Avoid trigger phrase overlap** with other topics. Use the Copilot Studio **Topic Overlap** tool to identify conflicts before publishing.
5. **Do not use single-word triggers** (e.g., `"leave"`) — too ambiguous.
6. **Do not duplicate system topic triggers** — phrases like `"help"` and `"cancel"` are reserved.

### Checking Overlap

After authoring, check for overlap:
1. In Copilot Studio → Topics → select a topic
2. Click **"Check for issues"** → select "Trigger phrase overlap"
3. Resolve any conflicts by making phrases more specific

---

## 2. Slot-Filling Patterns

Slot-filling collects multiple pieces of information before executing an action. In Copilot Studio, implement slot-filling explicitly using sequential question nodes — do not assume the NLU will collect all parameters from a single utterance.

### Basic Slot-Fill Structure

```
[Trigger: "Submit leave request"]
  │
  ├─ Question: "What type of leave?" → Topic.LeaveType (Entity: LeaveTypeEntity)
  ├─ Question: "Start date?" → Topic.StartDate (Entity: Date)
  ├─ Question: "End date?" → Topic.EndDate (Entity: Date)
  ├─ Question: "Any comments?" → Topic.Comments (Entity: String)
  │
  ├─ Condition: Topic.EndDate >= Topic.StartDate
  │   ├─ YES → Call HTTP action (POST to leave API)
  │   │         → Show: "Request submitted. ID: {Topic.RequestId}"
  │   └─ NO  → Show: "End date must be after start date."
  │             → Redirect to: SubmitLeaveRequest (re-enter)
```

### Confirmation Before Action

For any write operation (submit, update, delete), always include a confirmation step:

```
[After collecting all slots]
  │
  ├─ Message (Adaptive Card): Show summary of collected data
  ├─ Question: "Confirm submission? (Yes/No)"
  │   ├─ Yes → Execute action
  │   └─ No  → Message: "Cancelled. Let me know if you need anything else."
  │             → End topic
```

---

## 3. Topic Size Guidance

| Topic Size | Guidance |
|-----------|----------|
| 1–10 nodes | Ideal — focused, testable, easy to read |
| 11–20 nodes | Acceptable — consider if any sub-flow can be extracted |
| 21–30 nodes | Maximum recommended — extract at least one sub-flow |
| 30+ nodes | Refactor required — split into topic + sub-topics |

**Node count includes**: messages, questions, conditions, redirects, actions (each action counts as one node regardless of inputs).

---

## 4. Topic Chaining vs Redirect

| Approach | When to Use | How |
|---------|------------|-----|
| **Redirect** | Reuse a sub-flow in multiple topics (e.g., user authentication check) | `Redirect` node → topic name |
| **Transfer** | Hand off the conversation to a completely different topic and end the current one | `Transfer` node |
| **Call as sub-topic** | Execute a topic and return to the calling topic (like a function call) | Not natively supported — use global variables to pass results from redirected topic |

### Shared Sub-Topic Pattern

When multiple topics need the same sub-flow (e.g., verify employee exists):

1. Create topic `VerifyEmployee`
2. It collects `Topic.EmployeeId` and calls Dataverse, stores result in `Global.VerifiedEmployee`
3. Calling topics redirect to `VerifyEmployee`, then use `Global.VerifiedEmployee` in subsequent nodes
4. Clear `Global.VerifiedEmployee` at the end of the session

---

## 5. Adaptive Card Usage in Topics

Adaptive Cards enhance conversations with structured visual output (forms, tables, buttons). Use them for:
- Displaying multi-field data summaries (e.g., leave request confirmation)
- Providing selectable options beyond simple quick replies
- Collecting structured input on Teams where Adaptive Cards render natively

### When to Use vs Not Use

| Use Adaptive Cards | Avoid Adaptive Cards |
|-------------------|---------------------|
| Data confirmation summaries | Simple yes/no questions (use quick replies) |
| Multi-column result tables | Single text output |
| Input forms (Teams only) | On channels that do not render Adaptive Cards |
| Action buttons with multiple options | Binary choices |

### Adaptive Card Design Rules

1. Keep cards under 5 columns — wide cards render poorly on mobile Teams.
2. Always include a fallback text (the `speak` property) for voice channels.
3. Use the [Adaptive Cards Designer](https://adaptivecards.io/designer/) to design and preview cards before embedding JSON in topics.
4. Store card JSON in environment variables or use `Parse JSON` to keep topics readable.

---

## 6. Worked Example: Leave Balance Topic

**Topic Name:** `CheckLeaveBalance`

**Trigger Phrases (12):**
- What is my leave balance?
- How many days off do I have?
- Check my leave
- Show my annual leave
- How much PTO do I have left?
- Leave balance
- Remaining vacation days
- How many holidays do I have?
- AL balance
- View my time off
- Leave status
- Days remaining

**Topic Flow:**

```
[Trigger]
  │
  ├─ Condition: Global.AuthenticatedUserId is blank
  │   ├─ YES → Redirect to: AuthenticateUser
  │   └─ NO  → Continue
  │
  ├─ Action: HTTP GET https://{spr_baseApiUrl}/api/leave/balance
  │           Header: Authorization Bearer {Global.AuthToken}
  │           Response → Parse JSON → Topic.LeaveData
  │
  ├─ Condition: Topic.LeaveData.success = true
  │   ├─ YES → Send Adaptive Card:
  │   │         {
  │   │           type: AdaptiveCard
  │   │           body: [
  │   │             { type: TextBlock, text: "Your Leave Balance", size: Large }
  │   │             { type: FactSet, facts: [
  │   │               { title: "Annual Leave", value: "{Topic.LeaveData.annual}" },
  │   │               { title: "Sick Leave",   value: "{Topic.LeaveData.sick}" },
  │   │               { title: "Carry Over",   value: "{Topic.LeaveData.carryover}" }
  │   │             ]}
  │   │           ]
  │   │         }
  │   └─ NO  → Message: "I couldn't retrieve your balance. Please try again later."
  │             → Log error to Dataverse
  │
  └─ End topic
```

**Testing Notes:**
- Test with an authenticated user session
- Test with an unauthenticated session (should redirect to auth)
- Test with API returning error (should show error message, not crash)
- PPAPI evaluation: at least 5 test utterances with expected outcome `CheckLeaveBalance`
