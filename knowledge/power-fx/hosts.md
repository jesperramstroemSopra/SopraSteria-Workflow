# Power Fx Host Capability Profiles

**Reviewed:** 2026-09-21. Use with [language reference](language-reference.md),
[source register](sources.md) and [validation](validation.md).
These are decision boundaries, not an exhaustive function allowlist.

## Canvas apps

**Supports:** Reactive property formulas, record/table transformations, data-source operations in
behavior properties, named formulas and typed named UDFs in `App.Formulas`.
**Check:** Property return type, behavior permission, connector and complete query delegation,
locale, enabled features, and data-source permissions.

- `Items` expects a table; `Visible` expects Boolean; `OnSelect` is a behavior property. Do not put
  state-changing functions into a pure/recalculating property.
- `ThisItem`, `Self`, `Parent`, `App`, global/context variables and control references depend on
  the actual control/property. They are not portable symbols for other Power Fx hosts.
- `App.Formulas` declarations are not ordinary value expressions. UDF support does not add
  arrow callbacks, higher-order JavaScript functions or recursion.
- A collection is a local snapshot, not a delegable remote source. `ClearCollect` does not
  make an incomplete remote query complete.
- The default 500/configurable 2,000 nondelegation cap can produce a plausible but wrong answer.
  Test a match beyond the cap. Never label `FirstN` as server-side paging.
- Table shaping can have a delegable input yet a capped/nondelegable output. Per-row connector
  queries may cause N+1 requests even when the formula is valid.
- Consult the specific connector delegation list (Dataverse, SharePoint, SQL, etc.) and exact
  column type; there is no universally delegable `Search`/`in`/`CountRows` rule.

Sources: F10, F13, H8. See [Canvas delegation](../power-apps/patterns/delegation.md).

## Copilot Studio topic-based agents

**Applies to:** Standard/topic-based harness, including topics in generative orchestration.
**Not:** Modern CLI agentic-loop behaviors, a cloud flow's WDL expression, or every workflow designer.

- Topic formula syntax uses **en-US punctuation**, irrespective of maker/user language.
- Host variables use `Topic.`, `Global.`, `System.` and, where configured, `Environment.` prefixes.
  Local `With` names and `As` row aliases are expression-scoped, not new topic variables.
- Assign a topic/global variable through its node/action. `Topic.X = 3` in an expression is a
  comparison, not a state update. A condition must return Boolean.
- Check topic input/output declarations and receiving node types. A record, a table and serialized
  JSON text are different tool/card inputs. Ground schemas in actual connector outputs.
- The official catalog includes `Filter`, `ForAll`, `LookUp`, `With`, `JSON`, `ParseJSON` and `Patch`.
  Do not declare every data-shaped function unavailable; conversely, a listed `Patch` function
  does not prove an arbitrary connector write is allowed in a particular topic field.
- Choice **literal values** are documented as unsupported in the literal-format table. This is
  not a ban on all typed choice variables. Resolve actual entity/choice type and supported conversion.
- Do not assume Canvas controls, `App.Formulas`, navigation, collection state or behavior overloads.
  Use supported nodes/connectors and the exact host catalog.
- In YAML, distinguish a literal value from a formula-bearing property. Use the actual schema and
  provider's expression serialization; a leading `=` convention is not permission to make every
  YAML string executable. Validate Power Fx and cross-file variables with the supported tooling.

Sources: H1-H2. Read [classic architecture](../copilot-studio/ARCHITECTURE.md).

## Modern CLI agentic-loop

The toolkit's `behaviors/` + `capabilities/` track with a CLI recognizer has no classic topic
formula/variable surface. Do not insert `Topic.*`, `Global.*`, classic condition nodes or Power Fx
into behavior instructions expecting them to execute.

Place deterministic computation in a supported tool/workflow/API with explicit typed inputs and
outputs. **That tool's implementation can have its own formula engine.** A CLI agent calling a
workflow with Power Fx does not make Power Fx valid in the CLI agent's instruction text.
Review each side of the boundary separately; do not flag legitimate tool documentation/examples
as executable classic leftovers solely because the words "Power Fx" appear.

See [agentic-loop architecture](../copilot-studio/patterns/agentic-loop.md).

## Agent flows

The name "flow" is insufficient to choose an evaluator. Distinguish:

1. **Power Automate-based agent flows:** Identify the actual action definition and Expression tab.
   For cloud-flow actions using WDL, apply [the WDL guide](../power-automate/patterns/expressions.md).
   The overview/FAQ alone do not establish a selectable Power Fx mode. Do not invent one.
2. **New Copilot Studio Workflows designer:** This has separate documentation under
   `workflows-experience`. Identify the designer/version and inspect the actual expression field,
   schema and completion. Do not reuse either topic prefixes or WDL blindly.
3. **Microsoft Foundry workflow designer (preview):** Its documentation explicitly supports Power Fx
   expressions, `Local.` and `System.` scope prefixes, and expressions in message braces such as
   `{Upper(Local.Var01)}`. It links to the Copilot Studio function reference.

**Evidence boundary:** Foundry's positive Power Fx documentation is not proof that every
Copilot Studio Workflows deployment has identical scopes, functions or serialization. The reviewed
Copilot Studio new-designer overview/designer pages do not explicitly specify the expression language.
Confirm in the target editor or a current product-specific reference; record this as a support
spike/blocker until resolved. Shared branding, screenshots or similar node names are not parity evidence.

Never infer a workflow's variables from its calling agent's variables. Pass typed inputs across the
boundary. No `f => ...` even where the workflow positively supports Power Fx; use the host-supported
record-scoped functions. Do not assume `Environment.*` or classic dynamic-content tokens exist in
the new designer; use the verified configuration lookup pattern in
[Dataverse operations](../power-automate/patterns/dataverse-operations.md).

Sources: H3, H11-H12. Preview/version-sensitive capabilities require refreshed evidence.

## Desktop flows

Power Fx is an **opt-in mode chosen at desktop-flow creation**, distinct from traditional
`%Variable%` mode; do not propose a blind in-place syntax conversion.

- Formula inputs begin with `=` in the Power Fx-enabled desktop surface.
- Collections use one-based indexing in Power Fx (`Index(Rows, 1)`), not traditional zero-based
  assumptions. Check dynamic property/index access separately.
- Initialize variables before use and preserve declared/inferred types. Formula editor punctuation
  and runtime string conversion are separate concerns.
- Version 2.43 introduced case-sensitive variable names and the Run Power Fx expression action,
  including collection update functions. Review version-specific restrictions.
- Version 2.48 changed handling of untyped/dynamic objects; retest object/list comparisons, conversion
  and property access after upgrades.
- Unsupported **Switch/Case/Default actions** in this mode are not evidence that the Power Fx
  `Switch()` function is universally unsupported.
- Check the desktop catalog and release-specific limitations instead of importing Canvas UI APIs.

Sources: H4-H5. Test in the actual desktop runtime version.

## Dataverse formula columns

**Supports:** Restricted, typed **scalar calculation for a row**, with supported related-column
references. Not a workflow, general table transformation, write hook or Canvas app.

- Use the dedicated catalog. `Filter`, `ForAll`, `With`, `ParseJSON` and general collection
  processing are not in the documented formula-column function surface.
- Maximum formula length is **1,000 characters**; dependency depth **10**; no circular dependencies.
  Treat increasing complexity as a signal to redesign, not to obscure the expression.
- Output data type cannot be changed after creation. Choose type and precision before provisioning.
- Currency output is unsupported. Currency references have documented `Decimal` handling and
  restrictions; base-currency system columns are unsupported. Do not invent automatic conversion.
- Date-only, user-local and timezone-independent operands have compatibility rules. Validate the
  exact combination; do not subtract unlike date behaviors by assuming they represent the same time.
- Evaluation is locale-independent. Implicit numeric-to-text conversion and single-argument
  `Text(number)` are not generally available; use only documented explicit formatting.
- Null numeric input can be treated as zero. Test null separately and compare behavior if migrating
  from calculated columns.
- Formula columns cannot trigger workflows/plugins as if their recalculation were a stored update.
  Related-column/time-dependent formulas have sorting and rollup restrictions; offline support also
  differs. Check the complete product restrictions before making reporting or automation depend on one.
- Function/operator omissions in a short docs list do not prove all comparisons unsupported.
  Verify the formula-column editor instead of extrapolating from the Canvas catalog.

Sources: H6-H7. Read [Dataverse architecture](../dataverse/ARCHITECTURE.md).

## Other Power Fx surfaces

**Model-driven modern commands:** Separate `Visible` (Boolean) from `OnSelect` (behavior).
Selection is `Self.Selected.Item` / `Self.Selected.AllItems`, not an assumed Canvas gallery.
No selection gives blank/empty respectively; single-item logic must respect selection configuration.
Dataverse is the supported command data source; custom pages can reach other sources.
The command catalog excludes functions such as `Set`, `UpdateContext`, `Collect` and `User`.
Even IntelliSense can recommend unsupported functions; test published command behavior under an
approved release/test scope, not merely editor completion. Sources: H9.

**Custom pages:** Canvas-based authoring with its own model-driven hosting constraints. Do not
transfer command restrictions to custom pages or vice versa. Resolve navigation/context and
supported connectors from the actual custom-page documentation.

**PAC Power Fx:** `pac power-fx` is documented as preview, with its own catalog and selected
Dataverse auth context. It can write data: do not run arbitrary formulas against a customer's
active profile to test syntax. An offline in-memory check, where supported, verifies only that
engine's semantics. It does not certify app/column/topic acceptance or delegation. Source: H10.

**Power Pages, Power Query and scripts:** Product adjacency does not make Liquid, JavaScript,
M, SQL or OData Power Fx. Identify the exact supported extension/formula surface before choosing
syntax; route unsupported computation to a supported component with a tested typed contract.
