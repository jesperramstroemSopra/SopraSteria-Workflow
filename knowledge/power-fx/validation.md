# Formula Validation and Review

**When to load:** Formula-dependent design gates, implementation, code review, migration and tests.
**Reviewed:** 2026-09-21. Use the [formula contract](README.md#formula-contract-in-every-stage-artifact)
and [host profiles](hosts.md). These checks supplement, not replace, existing provider/confirmation gates.

## 1. Before writing or accepting a formula

- [ ] Identify the exact host, architecture, action/property, language, version and feature flags.
- [ ] Resolve input names/types from schema and output types from the receiving property.
- [ ] Use the per-host catalog and restrictions, not a Canvas example as universal authority.
- [ ] Choose retrieval location: server filtering, paginated action, local bounded table, or code.
- [ ] Define no-match, duplicate, missing/null, invalid-input, and connector-failure behavior.
- [ ] State locale, date behavior/timezone, numeric precision and serialization format.
- [ ] Separate pure calculations from variable assignment and side effects.
- [ ] Document unsupported functions or uncertain host support as a blocker/dependency.

For a design/plan, an explicit support spike may resolve an uncertain feature before implementation.
Do not approve an implementation that depends on a missing or invented evaluator.

## 2. High-value anti-patterns

| Finding | Why it fails | Supported direction |
|---|---|---|
| `f => equals(...)` in Power Fx | Arrow syntax plus WDL equality in the wrong evaluator | Record scope with `As` and `=` |
| `Equals(a, b)` offered as a Power Fx alternative | Capitalization does not add a standard function | `a = b` |
| `filter(array, f => ...)` or `map(...)` in WDL | No such standard inline callback construct | Filter array / Select actions |
| `Topic.Rows` in a cloud-flow expression | Topic context does not cross the tool boundary | Pass an explicit typed flow input |
| WDL `item()` in Power Fx | Wrong record-scope mechanism | `ThisRecord` / `As` in a supported table function |
| `Patch` in a condition or a Dataverse formula column | Wrong context or unsupported effect | Host-supported action/behavior or service operation |
| Canvas control names/functions in a topic | Different symbol table and host capabilities | Topic scopes, explicit inputs and nodes |
| Topic/global state inserted into modern CLI agentic behaviors | Wrong architecture | Typed tool/flow/API boundary |
| `IsBlank(Filter(...))` | No-match result is a table | `IsEmpty` or a documented count/existence check |
| `Coalesce` to suppress malformed input or connector failure | Missing values and errors differ | Explicit validation/error route |
| Assuming WDL `coalesce('', fallback)` returns fallback | WDL skips null, not empty strings | Explicit empty-string policy |
| Comparing a Choice to its localized label | A label is not the typed value | Actual choice enum or schema-defined conversion |
| `Id = Id` in a nested scope | Can become a self-comparison that matches everything | Distinct outer/inner aliases |
| Shared accumulator or dependent writes in `ForAll` | Execution order is not guaranteed | `Sum`/table result or explicit sequential orchestration |
| `ForAll(Sequence(...), ...)` or indexing used to promise sequential writes | Number-table generation is not scheduling | Supported sequential workflow loop or independent idempotent operations |
| `FirstN`/collection used as a pagination fix | Does not prove complete remote retrieval | Delegable query or real continuation/keyset design |
| Named Canvas UDF or typed ParseJSON assumed in every host | Host feature availability is not language-wide | Verify exact feature/overload or use supported nodes |
| `@{...}` used for a typed array/Boolean input | Interpolation produces text | Full expression or typed token |
| Local filtering relied on for authorization | Does not secure the source or connector identity | Data-source security plus safe output shaping |

Search heuristics (`=>`, `equals(`, `Topic.`, `item()`, `FirstN`) locate candidates, not automatic
defects. Ignore prose, negative examples, and embedded scripts in other languages. Always inspect
the containing property and schema before reporting.

## 3. Regression cases

Use [FX-01 through FX-10](table-patterns.md) as source-reviewed fixtures. Run them in the intended
host and record actual output separately; the expected values below are not execution evidence.

| Case | Input / exercise | Expected check |
|---|---|---|
| Filter/map | FX-01 / FX-02 | Exact rows, column names and scalar types; no unintended mutation |
| No match | FX-03 with absent value | Boolean false; table empty vs record blank handled correctly |
| Duplicate match | Two rows with the same business key | Apply explicit uniqueness policy; do not silently choose arbitrary first |
| Aggregate/scope | FX-04 / FX-05 | `23`; group totals `5` and `7`, no self-comparison |
| Intermediate scope | FX-06 | `12.5`; dependent calculation in nested scope |
| JSON | FX-07 plus `[]`, missing field, null, wrong scalar type and malformed JSON | Exact typed output or visible failure; empty result not confused with parse error |
| Input validation | FX-08 with `"bad"`, `"12.5"`, `" "` | Distinct failure/success/required outcomes, propagated to caller |
| Blanks | FX-09 plus blank, false, zero | No false/zero discarded; table emptiness checked as table |
| Regex | FX-10 plus `"xAB12x"` | True then false with explicit whole-string matching |
| Locale | Localized Canvas `1,5` input and fixed en-US topic syntax | Correct separator and numeric parsing; do not localize JSON/WDL |
| Date/time | Date-only, UTC timestamp, different timezones, DST transition | No day shift/double conversion; declared precision |
| Retrieval boundary | Matching row beyond 500 and 2,000, multiple connector pages | Complete results or deliberately bounded scope clearly reported |
| Ordering/failure | Failed intermediate write, repeated run, parallel iteration | No unauthorized next write, duplicate side effect, or race |
| WDL arrays | Filter array + Select fixtures in expression guide | Array output, not JSON-string output; zero/one/many results |
| Host-negative | Arrow syntax in Fx/WDL; Canvas UDF in unsupported host; wrong prefix | Rejected before deployment; supported replacement documented |
| Cross-host migration | Same business input through each separately authored implementation | Equivalent contract, not textual formula substitution |

## 4. Evidence levels

1. **Source-reviewed:** grammar, source and types reviewed; fixture outputs derived from semantics.
2. **Host-validated:** target editor/schema checker accepts the exact property and binding.
3. **Runtime-verified:** target host executed the cases; actual values, failure path and retrieval
   completeness recorded with redacted evidence.

A generic Power Fx interpreter/PAC result can help with pure expression semantics but cannot prove
topic variables, Dataverse column restrictions, delegation or connector behavior. A flow definition
validator checks structure; a successful save is not a successful run. An LLM agreeing that a
formula "looks right" is not runtime verification.

Keep expected and actual outputs, host/version, provider, confirmation scope and unresolved cases
in the stage report. Mark required target-host tests `blocked` when access is unavailable.
Never publish or run side-effectful tests merely to check syntax.
