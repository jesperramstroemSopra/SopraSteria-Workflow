# Pattern: Cloud Flow Expressions Are WDL, Not Power Fx

**When to load:** Writing or reviewing cloud-flow conditions, Compose values, array operations,
trigger expressions, connector parameters, or serialized workflow definitions.
**Reviewed:** 2026-09-21. Sources: [W1-W3](../../power-fx/sources.md#cloud-flow-language).
For agent flows or desktop Power Fx, first consult [host routing](../../power-fx/README.md).

## 1. Identify the input surface

Power Automate cloud flows use Workflow Definition Language (WDL) expressions. An `fx` expression
editor icon does not mean Power Fx. The connector's OData Filter rows field is yet another language.

| Location | Example | Meaning |
|---|---|---|
| Expression editor | `equals(triggerBody()?['status'], 'Open')` | Boolean expression; normally no leading `@` typed into this editor |
| Serialized whole-value expression | `"@equals(triggerBody()?['status'], 'Open')"` | JSON contains an expression that evaluates to Boolean |
| String interpolation | `"Status: @{triggerBody()?['status']}"` | Produces text, even if embedded expression was numeric/Boolean |
| Literal at-sign in WDL definition | `"@@text"` | Escaped leading `@`; not an expression |
| OData Filter rows | `statecode eq 0` | Server query grammar, not `equals(...)` or `Filter(...)` |

Use the host/provider to preserve escaping and expression wrappers. Code-view snippets are not
always pasteable unchanged into the Expression tab. JSON escaping and WDL quoting are separate.
WDL text literals use single quotes; an embedded apostrophe is doubled. It has function calls
such as `equals`, `greater`, `and`, `if`, `concat`, `json` rather than Power Fx infix logic,
`If`, `&`, `ParseJSON` and row aliases.

## 2. Filter and map with actions, not inline lambdas

There is no standard WDL `filter(array, f => equals(...))` or `map(array, ...)` callback function.
Use **Data Operations - Filter array** and **Select**. Do not confuse the `Filter array` action
with Power Fx `Filter` or OData's `$filter`.

### WDL-01: Filter array fixture

Source array (for example the output of a Compose action named `Rows`):

```json
[
  {"Code": "A", "Status": "Open", "Qty": 2},
  {"Code": "B", "Status": "Closed", "Qty": 3}
]
```

- Filter array **From** expression: `outputs('Rows')`
- Predicate expression: `equals(item()?['Status'], 'Open')`
- In a definition/advanced mode that expects the wrapper: `@equals(item()?['Status'], 'Open')`
- **Expected:** `[{"Code":"A","Status":"Open","Qty":2}]`, still an array.

The action name `Rows` is a fixture name, not a built-in function. Resolve actual action internal
names from the definition. Filter array text comparisons are case-sensitive; normalize both operands
deliberately if the requirement is case-insensitive, and specify behavior for null/nontext values.

### WDL-02: Select fixture

- Select **From**: `body('Filter_array')` (use the actual internal name).
- Map `Code` to `item()?['Code']` and `Quantity` to `item()?['Qty']`.
- **Expected:** `[{"Code":"A","Quantity":2}]` as an array of objects, not a string.

Select reshapes rows; it does not itself reduce their number. Select's text mode can produce an array
of scalar values; use object mode when the downstream contract requires named fields. `join` converts
an appropriate scalar array to text; it is not a record-to-record mapper.

Filter at the source before local Filter array when possible. Filtering a connector's first page
does not mean the entire data source was searched. Verify paging, maximum volume, and server filters.

## 3. Null, missing, empty, and error

- `triggerBody()?['name']` uses null-safe property access; it does not validate the input schema or
  catch all invalid types/evaluation failures.
- `coalesce(value, fallback)` selects the first **non-null** argument. Empty text, empty arrays,
  false and zero are not null.
- For a field contract that allows only text or null, `empty(coalesce(triggerBody()?['name'], ''))`
  covers missing/null/empty text. Whitespace remains nonempty unless deliberately trimmed.
  This is not a general check for numeric/Boolean/object inputs.
- Missing arrays may be normalized to `json('[]')` **only if** the contract says missing means
  empty. A malformed upstream payload or failed retrieval must not be disguised as "zero matches".
- Parse JSON/action schemas validate required fields and types; missing, null and `[]` are separate
  cases. `json()` parses text into JSON, while `string()` serializes/coerces to text.
- `coalesce` does not catch failures from `json`, `int`, date parsing, or connectors. Use validation,
  Conditions, Scopes and run-after error paths. Preserve a safe user message and diagnostic evidence.

**WDL-03 expected contrast:** `coalesce('', 'fallback')` returns `''`; Power Fx
`Coalesce("", "fallback")` returns `"fallback"`.

## 4. Scope, ordering, and transformations

`item()` refers to the current item of the data operation/repeating context.
`items('Apply_to_each_name')` explicitly references a named loop's current item, useful in nested
loops. Do not reuse `item()` assuming it always means the outer row. Use outputs/body references
only after their producing action has run on that execution path.

Parallel loops plus shared variable appends/increments can race. Prefer Select and action outputs
for pure mapping. If sequential state is essential, choose explicit sequential loop settings and
document performance/timeout implications: for **Apply to each**, disable concurrency or set the
degree to 1. Gate dependent actions on success; sequencing alone does not handle failed writes.
Connector writes require idempotency and retry policy;
an expression alone cannot provide a transaction.

Useful WDL families to look up in [W2](../../power-fx/sources.md#cloud-flow-language):

| Task | Candidate functions / action | Boundary |
|---|---|---|
| Boolean / compare | `equals`, `greater`, `less`, `and`, `or`, `not`, `if` | Not Power Fx `=` / `And` / arrow predicates |
| Text | `concat`, `replace`, `split`, `substring`, `trim`, `toLower`, `toUpper` | Strings and indexes differ from Power Fx |
| Collections | `contains`, `empty`, `length`, `first`, `last`, `take`, `skip`, `union`, `intersection` | `union` deduplicates whole values, not arbitrary business keys |
| Row transforms | Filter array, Select, Apply to each | Actions, not inline function callbacks |
| Numeric | `int`, `float`, `decimal`, `add`, `sub`, `mul`, `div`, `mod` | Type/precision and division semantics need explicit tests |
| Dates | `utcNow`, `addDays`, `formatDateTime`, `convertTimeZone`, `ticks`, `dateDifference` | Check documented signature/result; not Power Fx `DateDiff` |
| JSON / workflow | `json`, `string`, `body`, `outputs`, `triggerBody`, `variables` | Actual action scope, schemas and optional fields |

Use `skip`/`take` only on an already complete array. They are not connector server pagination.
Do not invent `sum(array, callback)` or copy a Canvas aggregate into WDL. Use a source aggregate,
a supported bounded sequential calculation, or an approved service for complex/large aggregation.

## Query language is another boundary

Dataverse/List rows and other connector filter fields may accept **OData**, not WDL or Power Fx.
Use the column's logical name, correct typed literal, supported operator, and escaped value.
WDL may construct the text of a query, but the resulting query is still parsed as OData.
Avoid string-building with unchecked user input; use connector parameterization where available
and the [Dataverse query guidance](../../dataverse/patterns/web-api-queries.md).

An OData `any`/`all` lambda, where supported by that endpoint, uses OData syntax. Its presence does
not permit `f => ...` in WDL or Power Fx.

## Review and test

Use [formula validation](../../power-fx/validation.md). Confirm array vs object vs string output,
missing/null/wrong types, case sensitivity, nested item scope, skipped branches, pagination and
empty filter results. The examples here are source-reviewed fixtures; run history is required to
claim runtime verification.
