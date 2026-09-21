# Table, Scope, and Conversion Patterns

**When to load:** Replacing lambda-like logic, filtering/mapping lists, shaping tool results, or
converting JSON. **Reviewed:** 2026-09-21; [F3-F8](sources.md).

Examples are original, source-reviewed fixtures, not tenant-run proof. They use en-US syntax, local
in-memory data and pure expressions. Intended baseline: **Canvas formula editor**; topic/agent-flow
use requires the [host profile](hosts.md) and actual editor checks. No snippet needs a data connection.
Each expression below is standalone unless explicitly described as a schema-based adaptation.

## FX-01: Filter without an arrow lambda

Invalid mixed-language pseudocode (do not paste):

```text
Filter(Rows, f => equals(f.Status, "Open"))
```

Valid Power Fx uses the row scope and `=`:

```powerfx
With(
    {rows: Table({Id: 1, Status: "Open"}, {Id: 2, Status: "Closed"})},
    Filter(rows As f, f.Status = "Open")
)
```

**Expected:** a table with one record `{Id: 1, Status: "Open"}`. This is not a Boolean or a single
record. In a topic formula with an existing typed table, the adaptation is
`Filter(Topic.Rows As f, f.Status = "Open")`; confirm those fields and types first.
For cloud flows, use [Filter array](../power-automate/patterns/expressions.md), not this formula.

## FX-02: Project records (map)

```powerfx
With(
    {rows: Table({Code: "A", Qty: 2, Price: 4}, {Code: "B", Qty: 3, Price: 5})},
    ForAll(rows As r, {Code: r.Code, Total: r.Qty * r.Price})
)
```

**Expected:** two records, `A/8` then `B/15`, columns `Code` (text), `Total` (number).
Use `AddColumns` to retain original columns or `ShowColumns` to project existing ones. `ForAll`
does not guarantee execution order for side effects. If the result must keep every input row, return
a record for each row rather than returning `Blank()` for failures.

## FX-03: Existence, uniqueness, and no match

```powerfx
With(
    {rows: Table({Id: 1, Status: "Open"}, {Id: 2, Status: "Closed"})},
    Not(IsEmpty(Filter(rows As r, r.Status = "Open")))
)
```

**Expected:** Boolean `true`. Changing the filter value to `"Missing"` returns `false`.
`LookUp(rows As r, r.Status = "Missing")` would return blank, not an empty table.
`LookUp` returning the first match does not prove uniqueness. For a unique-key requirement enforce
the key at the source or explicitly handle zero/one/multiple matches on a proven complete result.

## FX-04: Aggregate instead of a mutable reduce

```powerfx
Sum(Table({Qty: 2, Price: 4}, {Qty: 3, Price: 5}) As r, r.Qty * r.Price)
```

**Expected:** number `23`. Do not implement this by repeatedly updating a shared accumulator in
`ForAll`. For remote data, verify aggregate delegation and limits or calculate server-side.

## FX-05: Nested scopes with explicit aliases

```powerfx
With(
    {
        groups: Table({Key: 1}, {Key: 2}),
        entries: Table({GroupKey: 1, Qty: 2}, {GroupKey: 1, Qty: 3}, {GroupKey: 2, Qty: 7})
    },
    ForAll(
        groups As outerRow,
        {
            Key: outerRow.Key,
            Total: Sum(Filter(entries As innerRow, innerRow.GroupKey = outerRow.Key) As matched, matched.Qty)
        }
    )
)
```

**Expected:** `{Key: 1, Total: 5}`, `{Key: 2, Total: 7}`. Reusing `ThisRecord` for both sides of the
inner comparison is unsafe. This local fixture is not a recommendation for nested remote queries:
that can cause one network request per outer row and incomplete/nondelegable results.

## FX-06: Dependent intermediate values

```powerfx
With(
    {baseAmount: 10},
    With({adjustedAmount: baseAmount * 1.25}, Round(adjustedAmount, 2))
)
```

**Expected:** number `12.5`. Keep intermediate calculations local instead of polluting topic/global
state. Place dependent definitions in the inner scope, not beside the outer definition.

## FX-07: JSON array to typed table

```powerfx
With(
    {raw: ParseJSON("[{""code"":""A"",""qty"":2},{""code"":""B"",""qty"":3}]")},
    ForAll(
        Table(raw) As row,
        {Code: Text(row.Value.code), Qty: Value(row.Value.qty)}
    )
)
```

**Expected:** two typed records `{Code: "A", Qty: 2}`, `{Code: "B", Qty: 3}`.
`Table(dynamicArray)` introduces a `Value` wrapper. Iterating the dynamic array directly, where
supported, has a different shape; do not mix `row.Value.qty` and `row.qty`.

Parsing valid JSON does not prove its schema: missing/null fields become blank, and malformed text
or incompatible conversions can error. Validate required fields, scalar vs array/object shape,
maximum payload, and business constraints before using results. Prefer a host's Parse value/schema
node or a typed connector output where available. Optional typed `ParseJSON(..., Type)` is documented
but must be separately verified in the target host; it is not a universal replacement.

## FX-08: Visible typed validation result

```powerfx
With(
    {inputText: "bad"},
    If(
        IsBlank(TrimEnds(inputText)),
        {Ok: false, Amount: Blank(), Message: "Amount is required."},
        With(
            {parsedAmount: IfError(Value(inputText, "en-US"), Blank())},
            If(
                IsBlank(parsedAmount),
                {Ok: false, Amount: Blank(), Message: "Amount must be a number."},
                {Ok: true, Amount: parsedAmount, Message: ""}
            )
        )
    )
)
```

**Expected:** `Ok=false`, blank `Amount`, and `"Amount must be a number."`.
For `"12.5"` expect `Ok=true`, `Amount=12.5`; for `" "` expect the required message.
The caller must branch on `Ok` and display/log the failure through the host's standard error path.
This record alone does not notify the user. Add range/sign checks if the business disallows negatives
or out-of-range values. The conversion-only blank sentinel is immediately mapped to an explicit
failure, never accepted as a successful amount. Do not reuse it to suppress connector errors or
substitute a success-looking zero. Catch scalar conversion errors before wrapping values in records:
an error inside a field is not necessarily an error of the enclosing record.

## FX-09: Blank, empty, and false are distinct

```powerfx
{
    EmptyText: IsBlank(""),
    Whitespace: IsBlank(" "),
    EmptyRows: IsEmpty(Filter(Table({Id: 1}), Id = 2)),
    FalsePreserved: Coalesce(false, true),
    ZeroPreserved: Coalesce(0, 9)
}
```

**Expected:** `{EmptyText: true, Whitespace: false, EmptyRows: true,
FalsePreserved: false, ZeroPreserved: 0}`. Do not generalize this behavior to WDL `empty`/`coalesce`.

## FX-10: Match the whole input explicitly

```powerfx
IsMatch("AB12", "[A-Z]{2}[0-9]{2}", MatchOptions.Complete)
```

**Expected:** `true`; `"xAB12x"` must return `false` with the same pattern/options.
The literal pattern and options are authoring-time constants. Availability and regex dialect are
host-specific; this is not a route to dynamically execute user-provided regex/code.

## Adoption checklist

Use the matching fixture and negative cases in [validation](validation.md). Adapt only identifiers
and schemas that exist in the customer project, preserve expected output types, and record the
exact host. A formula working on a local `Table` proves nothing about remote delegation or pagination.
