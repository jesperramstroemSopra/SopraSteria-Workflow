# Power Fx and Expression Routing

**When to load:** Designing, writing, reviewing, debugging, or testing a formula, condition, filter,
mapping, calculated column, variable assignment, or tool input anywhere in Power Platform.
**Sources reviewed:** 2026-09-21. See [source register](sources.md) for evidence and refresh rules.

## First identify the evaluator, not the product logo

An `fx` button is not proof that a field accepts Power Fx. A solution can contain several languages.
Treat each formula-bearing property as its own execution surface.

| Surface | Language / context | Start here |
|---|---|---|
| Canvas app property, named formula, behavior | Power Fx; property type controls allowed effects | [Language](language-reference.md), [patterns](table-patterns.md), [hosts](hosts.md) |
| Copilot Studio topic formula editor | Power Fx subset; `Topic`, `Global`, `System` scopes | [Copilot Studio host](hosts.md#copilot-studio-topic-based-agents) |
| Modern CLI agentic-loop behaviors/capabilities in this toolkit | Not a classic Power Fx/topic-variable surface | [Agentic-loop boundary](hosts.md#modern-cli-agentic-loop) |
| Power Automate cloud flow Expression tab / workflow definition | Workflow Definition Language (WDL), NOT Power Fx | [Cloud flow expressions](../power-automate/patterns/expressions.md) |
| Copilot Studio agent flow / new Workflows designer | Identify exact designer and field; do not infer a Power Fx mode or scope parity | [Agent flows](hosts.md#agent-flows) |
| Microsoft Foundry workflow designer (preview) | Documented Power Fx surface with `Local.` / `System.` scopes; not proof of other designer parity | [Workflow evidence boundary](hosts.md#agent-flows) |
| Desktop flow with Power Fx enabled | Power Fx subset; not traditional `%Variable%` mode | [Desktop flows](hosts.md#desktop-flows) |
| Dataverse formula column | Restricted row calculation in Power Fx | [Dataverse columns](hosts.md#dataverse-formula-columns) |
| Model-driven command bar / custom page | Distinct Power Fx hosts; not all model-driven form properties accept formulas | [Other hosts](hosts.md#other-power-fx-surfaces) |
| Connector Filter rows / OData query parameter | OData, e.g. `statecode eq 0`; not a Power Fx predicate | [Cloud query boundary](../power-automate/patterns/expressions.md#query-language-is-another-boundary) |
| Embedded script, Adaptive Card template, Power Query | Its own language/schema (JavaScript, template expressions, M, etc.) | Inspect that surface; do not translate by changing punctuation |

In this toolkit, "classic" means the topic-based authoring track, including topic formulas used with
generative orchestration. It does **not** mean every agent with generative orchestration lacks
Power Fx. Detect the CLI recognizer and actual formula property before choosing a track.

## Non-negotiable language boundaries

- Do not generate JavaScript/C# arrow lambdas such as `f => equals(...)` in Power Fx or WDL.
  Power Fx uses a record-scoped expression, for example `Filter(Rows As f, f.Enabled = true)`.
  WDL uses a **Filter array action** with a predicate such as `equals(item()?['Enabled'], true)`.
  There is no standard Power Fx `Equals(...)` function alternative: changing the capitalization
  does not convert WDL `equals` into Power Fx. Use the `=` operator.
- No universal `filter(array, f => ...)`, `.map(...)`, `.reduce(...)`, or `eval(...)` workaround.
  Choose functions and actions actually exposed by the host.
- "No arrow lambdas" does **not** mean "no per-record formulas" or "no custom functions anywhere".
  Canvas `App.Formulas` supports typed named user-defined functions; that is not a closure or an
  anonymous function passed to `Filter`. Do not assume that feature exists in topic/flow editors.
- Function documentation with an "Applies to" badge is a starting point. Check the host's own
  restrictions, enabled features, exact overload, target type, and editor diagnostics.
- A successful standalone Power Fx parse is not proof that Copilot Studio, Dataverse, or a connector
  will accept, delegate, or execute it.
- `Sequence` only constructs a number table. `ForAll(Sequence(...), ...)`, explicit indexing or
  chaining `ForAll` calls does not make the writes inside each `ForAll` sequential. Use a supported
  sequential workflow/loop for dependent per-row writes, or redesign them as independent operations.
  In Power Automate, the action is **Apply to each**: disable concurrency or set its degree to 1;
  also gate dependent actions on success and handle retries/idempotency.

Before returning proposed formulas or provider output, check every function against the chosen
host and review the [anti-pattern checklist](validation.md). Do not include an unverified
"alternative" that reintroduces the unsupported syntax the primary example just corrected.

## Reading path

| Guide | Contents |
|---|---|
| [Language reference](language-reference.md) | Syntax, types, scope, locale, errors, behavior, function families, unsupported assumptions |
| [Table and conversion patterns](table-patterns.md) | Filter/map/aggregate without arrows, nested aliases, `With`, JSON, expected outputs |
| [Host capability profiles](hosts.md) | Canvas, topic-based agents, modern CLI agents, agent/cloud/desktop flows, Dataverse, command bars, PAC |
| [Cloud flow expressions](../power-automate/patterns/expressions.md) | WDL syntax, actions, null handling, arrays, loops, OData, serialization |
| [Validation and anti-patterns](validation.md) | Acceptance checklist, negative cases, runtime evidence and migration checks |
| [Source register](sources.md) | Official references, applicability, review date, documentation disagreements |

Load the entry point plus the relevant host and pattern, not every reference on every turn.

## Formula contract in every stage artifact

For material formula logic, persist the following in the existing design/plan/review/test artifact
under `.sopra/workflow/` in the **client workspace**, not in the toolkit:

| Field | Required evidence |
|---|---|
| Host and property | Product, architecture, action/node/property, editor language, version/feature flags |
| Inputs | Names, record/table schema, scalar types, optional fields, source and maximum volume |
| Output | Boolean/text/number/record/table, required fields, no-match and duplicate policy |
| Evaluation | Record scope, locale, timezone, side effects, ordering and retry assumptions |
| Retrieval | Delegation/pagination/filter strategy; prove completeness, not just formula syntax |
| Failure | Missing input vs empty result vs malformed input vs connector error; visible failure path |
| Support | Official source/date and host evidence; unsupported or unverified features called out |
| Tests | Normal, empty, missing, wrong type, duplicates, nested scope, scale and regression cases |
| Evidence level | `source-reviewed`, `host-validated`, or `runtime-verified`; never conflate them |

Ask for the host/property/schema when absent. Do not infer Power Fx from "agent", "flow", or "fx".
If a required function is unavailable, redesign using supported nodes/actions, a child flow, or an
approved API/code component with a typed contract. Do not hide the gap behind pseudocode or a
success-shaped default.
