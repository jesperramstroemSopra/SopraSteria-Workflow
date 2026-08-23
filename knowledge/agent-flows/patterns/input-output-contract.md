# Pattern: Agent Flow Input/Output Contract

> **Architecture track:** Agent Flows
> **When to load:** Before designing any agent flow, or when reviewing agent flow definitions.

---

## Why the Contract Matters

An agent selects a flow to call based on three things: the **flow name**, its **description**, and
its **input schema**. The contract between the agent and the flow is entirely expressed in this
metadata — there is no other interface.

A flow with an unclear name, a vague description, or poorly named parameters will:
- Be called at the wrong time (wrong intent matched)
- Not be called when it should be (description doesn't match user phrasing)
- Be called with wrong parameter values (agent guesses from ambiguous names)

---

## Naming the Flow

The name is the agent's primary signal for "what does this do?"

| Pattern | Example | Notes |
|---|---|---|
| `[Verb] [business noun]` | `Create supplier onboarding request` | States the outcome clearly |
| `[Verb] [noun] [qualifier]` | `Get purchase order by number` | Qualifiers disambiguate from similar flows |
| `Check [noun] status` | `Check invoice payment status` | Retrieve-type flows |

**Avoid:**
- `Flow 1`, `Flow 2`, `New flow`
- Generic names: `Process data`, `Run task`
- Technical names: `SPR_001_CreateSupplier_v2`

The flow name appears in the agent's tool list. It must read like a sentence that describes the job.

---

## Writing the Description

The description is **the most important field**. The agent reads it to decide when to call the flow.

A good description answers:
1. **When to call this flow** (what user intent triggers it)
2. **When NOT to call it** (disambiguation from similar flows)
3. **What it returns** (so the agent can explain the result)

```
✅ Good description:
"Creates a new supplier onboarding request in the system.
 Use this when the user asks to add, register, or onboard a new supplier.
 Do NOT use this to update an existing supplier — use Update supplier details instead.
 Returns a confirmation number the user can reference."

❌ Bad description:
"Handles supplier creation."
```

---

## Input Parameter Design

### Naming

Name every input in business language. The agent fills parameters from natural language — parameter
names are the only signal it has.

```
✅ Good: supplierOrganizationNumber, contactEmailAddress, requestedStartDate
❌ Bad: param1, orgNum, dateIn, data
```

### Descriptions

Every input parameter needs a description. This is how the agent knows what value to extract.

```
supplierOrganizationNumber:
  "The organization number (9-digit company registration number) of the supplier.
   Ask the user if not provided."

contactEmailAddress:
  "Primary contact email for the supplier. Optional — leave blank if not known."
```

### Required vs Optional

- Mark every parameter the agent **must** ask the user for as required.
- The fewer required parameters, the less the agent has to interrogate the user.
- Never make a parameter optional if omitting it causes the flow to produce wrong results silently.

### Parameter Types

| Type | Use | Notes |
|---|---|---|
| `string` | Most inputs | Keep it generic; validate inside the flow |
| `integer` | Quantities, IDs | |
| `number` | Amounts, prices | |
| `boolean` | Yes/no flags | Prefer string enum if agent must infer from language |
| `date` | Date-only values | ISO 8601: `2024-03-15` |
| `dateTime` | Date + time | ISO 8601: `2024-03-15T09:00:00Z` |

Avoid complex nested objects as inputs — the agent constructs them from natural language and
often gets the structure wrong. Flatten the inputs.

---

## Output Design

### Return a Success Signal

Every flow must return an explicit success/failure indicator.

```json
{
  "success": true,
  "confirmationNumber": "SR-2024-0042",
  "message": "Supplier onboarding request created successfully."
}
```

```json
{
  "success": false,
  "errorCode": "DUPLICATE_ORG_NUMBER",
  "message": "A supplier with organization number 987654321 already exists."
}
```

### Message Field

Include a `message` field with a pre-written, user-safe summary the agent can relay directly.
- No stack traces. No internal IDs. No connector error text.
- Human language, as if the agent wrote it.

### Structured Outputs

Return structured named fields — not a raw JSON blob.

```json
// ✅ Structured
{
  "success": true,
  "orderNumber": "PO-2024-0087",
  "status": "Approved",
  "approvedBy": "Anna Svensson",
  "approvalDate": "2024-03-14"
}
```

---

## Checklist

- [ ] Flow name is a business-language verb phrase describing the outcome
- [ ] Description explains when to call and when NOT to call the flow
- [ ] Every input parameter has a business-language name and description
- [ ] Required vs optional parameters are correctly marked
- [ ] Output includes an explicit `success`/`failure` signal
- [ ] Output includes a `message` field with user-safe language
- [ ] Output fields are named and structured, not raw connector blobs
- [ ] No stack traces or internal connector errors can reach the agent

---

## Upstream Reference

- **Source:** `knowledge/agent-flows/ARCHITECTURE.md` §3 (Contract first, Return something the agent can use)
- **Accessed:** Internal
- **Sopra Divergence:** Expands ARCHITECTURE.md §3 with concrete naming conventions, description templates, and output structure requirements.
