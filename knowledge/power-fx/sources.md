# Formula Source Register

**Reviewed:** 2026-09-21. This register records documentation evidence, not tenant/runtime certification.
Descriptions and examples in this toolkit are adapted guidance, not copied reference articles.

## How to use evidence

1. Identify the host and property using [the entry point](README.md).
2. Prefer the product-specific restriction page and editor diagnostics over a generic function badge.
3. Check the exact overload, supported result type, feature/version, locale, and connector delegation.
4. Record the source URL/date in the client artifact. Refresh preview/version-sensitive claims before
   designing around them; review this register at least quarterly.
5. If sources disagree or a live editor rejects a documented function, record both, stop that route,
   and use a supported alternative. Never invent a function from a similar language.

## Core language

| ID | Official source | Supports |
|---|---|---|
| F0 | [Formula reference by product](https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference-overview) | Per-host function catalogs; not universal function parity |
| F1 | [Expression grammar](https://learn.microsoft.com/en-us/power-platform/power-fx/expression-grammar) | Expressions, literals, separators, operators; no arrow-lambda production |
| F2 | [Operators and identifiers](https://learn.microsoft.com/en-us/power-platform/power-fx/operators) | `As`, `ThisRecord`, `ThisItem`, names and locale |
| F3 | [Filter, Search, LookUp](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-filter-lookup) | Row-scoped predicates, return shapes, no-match behavior |
| F4 | [ForAll](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-forall) | Result order vs execution order, blank omission, forbidden state updates, nondelegation |
| F5 | [With](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-with) | Record scope and nested local calculations |
| F6 | [Blank, Coalesce, IsBlank, IsEmpty](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-isblank-isempty) | Missing values, empty strings/tables, type compatibility |
| F7 | [IfError and related functions](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-iferror) | Error propagation, compatible replacements, controlling dependent actions |
| F8 | [ParseJSON](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-parsejson) | Dynamic conversion, array wrappers, missing/null, optional typed parsing |
| F9 | [Data types](https://learn.microsoft.com/en-us/power-platform/power-fx/data-types) | Numeric host differences, choices, date/time semantics |
| F10 | [App object](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/object-app) | Canvas named formulas, typed UDFs, no recursion, behavior forms |
| F11 | [Imperative logic](https://learn.microsoft.com/en-us/power-platform/power-fx/imperative) | Behavior vs recalculating formulas |
| F12 | [IsMatch, Match, MatchAll](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-ismatch) | Constant patterns/options, host regex differences |
| F13 | [Table shaping](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-table-shaping) | Identifier syntax, immutable transformations, output row limits |
| F14 | [DateAdd, DateDiff, TimeZoneOffset](https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-dateadd-datediff) | Units, integer differences, UTC conversion |
| F15 | [Error handling](https://learn.microsoft.com/en-us/power-platform/power-fx/error-handling) | Formula-level management, field errors, propagation and sequencing |

## Product-specific constraints

| ID | Official source | Supports |
|---|---|---|
| H1 | [Copilot Studio Power Fx](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx) | Standard-harness topic formulas, scopes, fixed en-US syntax |
| H2 | [Copilot Studio function catalog](https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference-copilot-studio) | Candidate functions; still verify context and overload |
| H3 | [Agent flow overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview) and [FAQ](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-faqs) | Workflow context, not proof of a particular field's expression language |
| H4 | [Desktop flow Power Fx](https://learn.microsoft.com/en-us/power-automate/desktop-flows/power-fx) | Opt-in mode, equals prefix, types, indexing, unsupported actions and version changes |
| H5 | [Desktop function catalog](https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference-desktop-flows) | Desktop-specific function surface |
| H6 | [Dataverse formula columns](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/formula-columns) | Scalar return, complexity, currency/date/type limits, trigger/sort restrictions |
| H7 | [Formula-column function catalog](https://learn.microsoft.com/en-us/power-platform/power-fx/formula-reference-formula-columns) | Restricted scalar function set, not Canvas/table functions |
| H8 | [Canvas delegation](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview) | 500/2,000 nondelegation limits, data-source-specific completeness |
| H9 | [Modern command formulas](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/commanding-use-powerfx) and [limitations](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/command-designer-limitations) | Command properties/selection and unsupported functions |
| H10 | [PAC Power Fx](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/power-fx) | CLI evaluator, not target-host validation |
| H11 | [Copilot Studio Workflows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-overview) and [designer](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-designer) | Distinct new designer; reviewed pages do not explicitly establish expression-language/scope parity |
| H12 | [Foundry workflow expressions](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow#create-expressions-with-power-fx) | Explicit Power Fx support, `Local.`/`System.`, preview; evidence applies to this documented surface |

## Cloud-flow language

| ID | Official source | Supports |
|---|---|---|
| W1 | [Power Automate expression cookbook](https://learn.microsoft.com/en-us/power-automate/expression-cookbook) | Cloud-flow idioms and inline filter/map pitfalls |
| W2 | [WDL function reference](https://learn.microsoft.com/en-us/azure/logic-apps/workflow-definition-language-functions-reference) | Function signatures, null handling, item scope, dates, expressions/interpolation |
| W3 | [Data operations](https://learn.microsoft.com/en-us/power-automate/data-operations) | Filter array, Select, Compose and joins |

## Documentation caveats

- Generic pages contain historical Canvas samples with quoted column names even where their
  current syntax section documents unquoted identifiers. Use current syntax and the target editor,
  not an indiscriminate quote replacement.
- The App reference documents UDFs and user-defined types; availability in Canvas does not prove
  support in topic/flow fields. The same applies to typed `ParseJSON`.
- Regex defaults/version notes differ across hosts, including within the generic page. State
  explicit options rather than relying on an assumed default.
- A short operator list on the Dataverse formula-column page is not sufficient evidence to declare
  all omitted comparison/logical operators unavailable. Use its function catalog and actual editor.
- The toolkit's modern CLI agentic-loop architecture is a separate authoring track, documented in
  [the local architecture guide](../copilot-studio/patterns/agentic-loop.md) and
  [upstream register](../../UPSTREAM_REFS.md). Do not read the standard-harness topic article as
  permission to add `Topic.*` or Power Fx to CLI behaviors/capabilities.
