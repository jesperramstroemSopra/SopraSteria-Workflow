# Pattern: Testing Agent Flows

> **Architecture track:** Agent Flows
> **When to load:** Before writing or reviewing tests for agent flows, or when setting up a test strategy.

---

## Two Testing Levels

Agent flows require testing at two independent levels. Skipping either leaves a real gap.

| Level | What it tests | How |
|---|---|---|
| **Level 1 — Flow direct** | Given inputs, the flow produces the expected outputs. Every branch, including error paths. | Power Automate test framework or manual test runs |
| **Level 2 — Agent routing** | The agent calls the right flow for the right phrasings, with correctly extracted parameters, and does NOT call it for wrong phrasings. | Copilot Studio PPAPI evaluation, DirectLine testing |

---

## Level 1 — Direct Flow Testing

Test the flow as a function: given these inputs, what comes out?

### Test Cases to Cover

For every flow:
- **Happy path:** valid inputs, expected output, correct success signal
- **Input validation errors:** missing required field, wrong format, out-of-range value
- **Upstream failure:** the external system or connector returns an error — does the flow return a clean `{ success: false, message: "user-safe text" }` or does it explode?
- **Empty result:** the query returns no rows — does the flow handle it gracefully?
- **Boundary conditions:** max-length strings, zero amounts, far-future/past dates

### How to Run

Use **Test flow** in Power Automate (manual trigger). For automated testing:
- Create a separate test flow that calls the agent flow via HTTP trigger and asserts on outputs.
- Or use the Power Apps Test Studio for Canvas App integration testing.

---

## Level 2 — Agent Routing Tests

This is non-deterministic — the agent uses language model reasoning to decide which flow to call.
Test coverage here requires breadth over precision.

### Types of Routing Tests

| Test Type | What to Assert | Example |
|---|---|---|
| **Positive routing** | Agent calls the correct flow | "Onboard a new supplier" → `Create supplier onboarding request` |
| **Parameter extraction** | Agent extracts the right parameter values | "Onboard Acme Corp, org number 987654321" → `supplierOrganizationNumber = "987654321"` |
| **Negative routing** | Agent does NOT call the flow for unrelated intents | "What's the weather?" → no tool call |
| **Near-miss routing** | Agent calls the right flow, not a similar one | "Update a supplier" → `Update supplier details`, NOT `Create supplier onboarding request` |
| **Ambiguous input** | Agent asks for clarification, does not guess | "Do the thing for the supplier" → agent asks for clarification |

### Near-Miss Testing is the Most Valuable

Near-misses reveal the most real-world failure modes. For every flow, write at least 3 phrasings that should route to a **different** flow, and verify they do.

### Assertion Pattern

For Level 2 tests, assert on:
- **Which tool was called** (flow name)
- **What parameters were passed** (extracted values)

Do **not** assert on exact wording of the agent's response — this is too fragile.

### Test Set Format (PPAPI Evaluation)

```csv
utterance,expected_tool_call,expected_parameters
"Onboard a new supplier called Acme with org number 987654321",Create supplier onboarding request,"{""supplierOrganizationNumber"":""987654321""}"
"Update the address for supplier 987654321",Update supplier details,"{""supplierOrganizationNumber"":""987654321""}"
"What's the weather today",,[no tool call]
```

Run via Copilot Studio PPAPI evaluation. See
[`../../copilot-studio/patterns/testing-strategy.md`](../../copilot-studio/patterns/testing-strategy.md)
for the evaluation setup.

---

## Common Failures and Fixes

| Failure | Likely Cause | Fix |
|---|---|---|
| Agent calls wrong flow | Similar flow descriptions; ambiguous names | Add "Do NOT use for..." to the description |
| Agent calls flow but passes wrong parameter value | Parameter description too vague | Add explicit examples and format to the parameter description |
| Agent never calls the flow | Description doesn't match user phrasing | Rewrite description with more user-language synonyms |
| Agent asks for parameters already in the message | Parameter description not clear enough | Clarify description; check if the parameter is correctly marked as optional |
| Flow succeeds in testing but fails in conversation | Agent passes parameters in wrong format | Add format validation and type coercion inside the flow |

---

## Checklist

- [ ] Happy path test for every flow
- [ ] Input validation tests for required fields and format errors
- [ ] Upstream failure test (connector/system returns error)
- [ ] Positive routing test (3+ phrasings per flow)
- [ ] Parameter extraction test (key parameters extracted correctly)
- [ ] Near-miss test (3+ phrasings that should route to a different flow)
- [ ] Negative routing test (unrelated intent → no tool call)
- [ ] PPAPI evaluation run before UAT promotion

---

## Upstream Reference

- **Source:** `knowledge/agent-flows/ARCHITECTURE.md` §6, `knowledge/copilot-studio/patterns/testing-strategy.md`
- **Accessed:** Internal
- **Sopra Divergence:** Expands ARCHITECTURE.md §6 with near-miss testing as a mandatory category and the PPAPI evaluation CSV format for automated routing tests.
