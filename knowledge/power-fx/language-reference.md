# Power Fx Language Reference

**Scope:** Core formula concepts, not a promise of function parity across hosts.
**Reviewed:** 2026-09-21. Sources: [F1-F12](sources.md). Select the [host](hosts.md) first.

## 1. Expressions, declarations, and behavior are different

Most Power Fx formulas return a value. Canvas properties and named formulas recalculate as
dependencies change; a topic node or flow action evaluates at its execution point. Do not apply
Canvas's reactive lifecycle to every host.

`Set`, `UpdateContext`, `Collect`, `Patch`, navigation, and connector writes are **behavior**,
not pure calculations. They require a host and property that support side effects. A condition
expects a Boolean, not an assignment or a sequence of writes. `=` inside an expression compares
values; it does not assign a topic variable. Use the host's variable-setting node/action.

Canvas named formulas and typed user-defined functions belong in `App.Formulas`. A minimal
Canvas-only declaration is:

```powerfx
DoubleAmount(Amount: Number): Number = Amount * 2;
```

Call `DoubleAmount(3)` to obtain `6` in that app. The function has typed parameters and a return
type, not an arrow/lambda syntax. The current App reference says UDF recursion is unsupported.
Behavior UDFs use the documented behavior form and need host support; do not copy them into a
topic expression or Dataverse formula column. Sources: [F1, F10, F11](sources.md).

## 2. Syntax that must not be mixed with WDL or JavaScript

Examples in this section use an **en-US formula editor** unless stated otherwise.

| Need | Power Fx | Wrong assumption |
|---|---|---|
| Equality / inequality | `a = b`, `a <> b` | `equals(a,b)`, `==`, `===`, `!=` |
| Logic | `And`, `Or`, `Not` or `&&`, `\|\|`, `!` | WDL function names/paths are not interchangeable |
| Conditional | `If(test, whenTrue, whenFalse)`; `Switch` for alternatives | `test ? a : b` |
| Text | `"Open"`; embedded quote: `"Say ""yes"""` | `'Open'` is an identifier, not text |
| Identifier with spaces | `'Display Name'` | `"Display Name"` as a field reference |
| Concatenation | `"A" & "B"` or `Concatenate`; `Concat` evaluates a table | `+` is not the text concatenation operator |
| Record / table | `{Code: "A", Qty: 2}`, `Table({Code: "A"}, {Code: "B"})` | JSON text is not automatically a typed record/table |
| Record field | `r.Code`; quote unusual field names | WDL `item()?['Code']` |
| Record scope | `Filter(Rows As r, r.Qty > 0)` | `Filter(Rows, r => r.Qty > 0)` |
| Single-column table | `[1, 2, 3]`, usually with `Value` column | A JavaScript array with methods or zero-based indexing |
| Index | `Index(Rows, 1)` is the first row | `Rows[0]` |
| Blank / empty | `Blank()`, `IsBlank(textOrScalar)`, `IsEmpty(table)` | `null`, `undefined`, or `.length` from another language |
| Comments | `//` or `/* ... */` in a Power Fx expression | JSON/WDL fields do not acquire comment support |

`=>` is not in the Power Fx expression grammar. `As` names the current record; it does not define
a lambda. Some SDK internals call scoped expressions "lambdas"; that does not expose arrow syntax
to makers. A function can be supported in the engine yet absent from the target product.
There is no standard Power Fx `Equals()` alternative to `=`; capitalization is not translation.
Sources: [F1-F4](sources.md).

## 3. Record scope and names

`Filter`, `LookUp`, `ForAll`, `AddColumns`, `Sum`, and `With` establish record scope.
`ThisRecord` refers to the **innermost** current record. Use `As` aliases for outer and inner tables
before nesting; `Id = Id` can accidentally compare an inner field to itself.

`ThisItem` belongs to controls such as galleries/forms; it is not the universal loop item.
Canvas disambiguation such as `[@Name]` is not a synonym for Copilot Studio's `Global.Name`.
Resolve data-source names, choice enums, and fields from schema or editor completion, not guesses.

`With({base: 2}, With({total: base * 3}, total))` returns `6`. Do not depend on sibling definitions
in `With({base: 2, total: base * 3}, total)` seeing one another; use nested `With` for dependencies.
`With` gives local expression scope, not mutable conversation state. Sources: [F2-F5](sources.md).

## 4. Types, missing values, and errors

- Distinguish text `"2"` from number `2`, text `"false"` from Boolean `false`, a record from a
  one-row table, and a dynamic JSON value from a typed field.
- Use `Value`, `Text`, `Boolean`, `GUID`, `DateValue` or `DateTimeValue` deliberately and only when
  that overload is supported. Explicit conversion can fail; it is not validation by itself.
- `Number` is a host-dependent numeric type: Canvas uses floating point in the current docs,
  while many other hosts default to Decimal. Do not assume financial precision or large integer
  identifiers survive conversion. Specify rounding, range, and serialization.
- Choice and Yes/No values are typed, localizable values. Compare typed choices with their actual
  enums; do not compare localized display labels with `"Open"` unless the input really is text.
- `IsBlank` includes `Blank()` and `""`; whitespace `" "` is not blank. `IsEmpty` tests tables.
  `false` and `0` are real values, not missing values.
- `Coalesce` returns the first nonblank, nonempty-string value; arguments need compatible types.
  It is not a general error handler. WDL `coalesce` differs: it skips null, **not** empty strings.
- `LookUp` with no match returns blank; `Filter` returns an empty table. Decide whether no match
  means "not found", "not authorized", or an error before choosing a fallback.
- `IfError` / `IsError` handle evaluation errors, not every business-invalid value. Replacement
  branches need compatible result types. Use a typed failure record or the host's error route,
  not `IfError(..., 0)` when zero would appear to be a successful calculation.
- A semicolon-separated sequence is not a transaction. In supported behavior hosts, a later
  operation can still run after a prior failure; explicitly gate dependent writes and compensate
  partial changes. `App.OnError` reporting is not a substitute for controlling the write sequence.
- An error-valued record field is not necessarily an error of the whole record/table. Handle
  scalar conversion failures before building a success envelope. In older Canvas apps, verify
  formula-level error management is enabled before relying on the current error semantics.

Sources: [F6-F9, F11](sources.md). See [conversion patterns](table-patterns.md).

## 5. Locale, serialization, dates

| Decimal separator in a localized Power Fx editor | Argument/record separator | Behavior chaining |
|---|---|---|
| `.` (for example en-US) | `,` | `;` |
| `,` (for example sv-SE) | `;` | `;;` |

For example, `If(1.5 > 1, "yes", "no")` becomes `If(1,5 > 1; "yes"; "no")` in a localized
decimal-comma editor. Function names remain Power Fx names. Copilot Studio topic formulas use
en-US syntax regardless of user locale; desktop Power Fx also has its own documented locale rules.
Do not mechanically replace punctuation in serialized YAML/JSON. Inspect the serialization grammar
and use the host's editor/provider.

Parsing a number/date **value** is separate from the formula's punctuation. For user-entered text,
give a language tag where supported, for example `Value("1,5", "sv-SE")`. Use ISO 8601 across
system boundaries, identify date-only versus timestamp semantics, and test UTC/local conversion
and daylight-saving transitions. Do not use ambiguous `"01/02/2026"` without a documented locale.
Avoid applying a timezone offset twice when the connector already converts it.

Sources: [F1, F2, F9, H1, H4](sources.md).

## 6. Function families: possibilities and checks

This is a navigation aid, **not** a host allowlist. Use the [official reference](sources.md#core-language)
and the host profile to check the exact function and overload.

| Work | Candidate Power Fx functions | Important checks |
|---|---|---|
| Decisions | `If`, `Switch`, `And`, `Or`, `Not` | Boolean conditions, branch type, explicit default |
| Text | `Trim`, `TrimEnds`, `Lower`, `Upper`, `Len`, `Left`, `Mid`, `Right`, `Substitute`, `Split`, `Concat` | Substring vs token, whitespace, output column names and host version |
| Math | `Abs`, `Round`, `RoundUp`, `RoundDown`, `Mod`, `Sqrt`, `Sum`, `Average`, `Min`, `Max` | Numeric type, rounding rule, overflow, empty aggregate, delegation |
| Date/time | `Date`, `DateAdd`, `DateDiff`, `Today`, `Now`, `DateValue`, `DateTimeValue`, `TimeZoneOffset` | Host support, timezone and Dataverse date behavior |
| Retrieve rows | `Filter`, `LookUp`, `Search`, `First`, `Index` | Table vs record, uniqueness, sort order, completeness |
| Shape rows | `ForAll`, `AddColumns`, `ShowColumns`, `DropColumns`, `RenameColumns`, `GroupBy`, `Ungroup`, `Distinct` | Scope, output schema, nondelegable limits; not mutable array methods |
| Sort / aggregate | `Sort`, `SortByColumns`, `CountRows`, `CountIf`, `Sum` | Stable ordering and host/connector-specific aggregate limits |
| JSON / conversion | `ParseJSON`, `JSON`, `Value`, `Text`, `Boolean` | Dynamic vs typed, schema drift, unsupported types; `JSON` may require behavior context |
| Pattern match | `IsMatch`, `Match`, `MatchAll` | Constant pattern/options, host regex dialect; use explicit match options |
| Local calculation | `With`, named formulas, typed Canvas UDFs | Scope vs state, declaration surface; no recursive UDFs per current Canvas docs |
| Stateful work | `Set`, `UpdateContext`, `Collect`, `ClearCollect`, `Patch`, `Remove` | Behavior permission, confirmation, retries and partial failures |
| Bounded iteration | `ForAll`, `Sequence` | Not an ordered `for`/`while` loop; finite host limits and side-effect risk |

## 7. Limits that influence architecture

- No general arrow closures or arbitrary code execution in formula text. Use a supported API/tool
  for unsupported computation; never evaluate untrusted strings as code.
- `ForAll` results follow input order, but evaluation/effects can occur out of order or in parallel.
  Blank results omit rows. Do not use it as an ordered accumulator, or mutate its subject table.
  Canvas disallows `UpdateContext`, `Clear`, and `ClearCollect` inside `ForAll`. Source: [F4](sources.md).
  `Sequence` supplies numeric rows, not sequential scheduling. Indexing those rows does not change
  the execution-order guarantee.
- Delegation is not a language-wide property: it depends on host, connector, type, and full query.
  Canvas nondelegable data-source processing defaults to 500 rows, configurable to 2,000.
  Those are **not** universal Power Fx table limits. Raising the limit is not a completeness fix.
- `IsMatch`/`Match` patterns and options must be authoring-time constants. Documentation describes
  different regex versions/defaults across hosts; specify `MatchOptions.Complete` for whole-field
  validation where available and validate the actual host. Do not paste JavaScript/PCRE regexes
  assuming identical features. Source: [F12](sources.md).
- New functions/types and even familiar output column names can vary by version. Current Canvas
  `Search` and table-shaping syntax uses column identifiers rather than older quoted-name samples.
  Do not perform blind repository-wide syntax replacement.
