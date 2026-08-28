# Changelog

All notable changes to the Sopra-Workflow knowledge base are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] — 0.3.0

### Added — critical field learning (Power Automate)

- **`playbooks/power-automate/environment-variable-resolution-new-designer.md`** — documents a
  critical workaround for the new workflow designer when classic dynamic-content parity is missing
  for environment variable references. Captures the Dataverse lookup pattern
  (`environmentvariabledefinition` + related value with fallback to default) and fail-fast guidance
  for required configuration.

### Changed — operationalized in knowledge

- **`knowledge/power-automate/patterns/dataverse-operations.md`** — now includes explicit guidance
  and a step-by-step workaround for resolving environment variables via Dataverse when token parity
  is unavailable, plus anti-pattern warning against hardcoded environment-specific values.

### Full Power Platform component coverage

This release expands Sopra-Workflow from a Copilot Studio + Power Automate + Dataverse toolkit into
a full Power Platform delivery plugin. Three new knowledge domains are added, existing domains are
significantly deepened, Power CAT skills content is absorbed, and all delivery skills are updated
to route the full component set.

#### Added — new knowledge domains

**`knowledge/power-apps/`**
- `ARCHITECTURE.md` — Canvas vs Model-Driven decision, data loading strategy, component libraries, naming, ALM, security
- `patterns/screen-design.md` — screen types (list/detail/edit/action/admin), navigation conventions, anti-patterns
- `patterns/delegation.md` — delegation limits by data source, patterns for delegable filters, pagination, anti-patterns
- `patterns/component-library.md` — component structure, input/output properties, versioning, ALM considerations
- `patterns/performance.md` — Named Formulas, OnStart minimization, Concurrent(), gallery binding, Power CAT audit tool reference

**`knowledge/custom-connectors/`**
- `ARCHITECTURE.md` — when to build vs HTTP action, connector anatomy, auth options, pagination, ALM, certified vs organizational
- `patterns/auth-patterns.md` — OAuth 2.0 authorization code and client credentials, API Key, app registration checklist, common failures
- `patterns/pagination.md` — next-link (x-ms-pageable), offset, cursor, Link header patterns; Do Until safeguards
- `patterns/policy-templates.md` — Set Header, Set Query Param, Retry Policy, Convert Array to Object; design guidance

**`knowledge/governance/`**
- `ARCHITECTURE.md` — governance layers (tenant/environment/solution/app), environment ring, Managed Environments, DLP, CoE Kit, service accounts, licensing checklist
- `patterns/dlp-policies.md` — connector groups, tenant vs environment scope, HTTP connector treatment, classification process, verification checklist
- `patterns/environment-provisioning.md` — environment types, Sopra naming convention, provisioning checklist, Power CAT dev env skill reference, lifecycle management
- `patterns/coe-kit-patterns.md` — Core/Governance/Nurture/Audit Log/ALM Accelerator modules, deployment order, maintenance cadence, anti-patterns

#### Added — deepened existing domains

**Power Automate** (4 new patterns)
- `patterns/approval-flows.md` — single/parallel/sequential/all-required patterns, Teams adaptive card approvals, timeout and escalation
- `patterns/scheduled-flows.md` — UTC triggers, concurrency limits, Sliding Window, batching large datasets, performance and throttling
- `patterns/monitoring.md` — owner failure notifications, error scope alerting, Teams channel routing, Power BI CoE dashboard, Power CAT Overflow reference
- `patterns/flow-review-checklist.md` — manual pre-delivery checklist adapted from Power CAT Overflow sources; covers naming, error handling, security, environment variables, performance, reusability, ALM, monitoring

**Dataverse** (3 new patterns)
- `patterns/web-api-queries.md` — OData URL structure, $select/$filter/$expand/$orderby, FetchXML, aggregation, multi-surface targeting; Power CAT dataverse-webapi-query skill reference
- `patterns/virtual-tables.md` — OData v4 provider, Virtual Connector Provider, custom provider, limitations, when to prefer data import instead
- `patterns/auditing.md` — enabling at environment/table/column level, querying the audit log, retention and storage impact, security role requirements

**Agent Flows** (3 new patterns — this domain previously had ARCHITECTURE.md only)
- `patterns/input-output-contract.md` — flow naming rules, description template, parameter naming/description/type, structured output with success signal
- `patterns/async-pattern.md` — agent flow + cloud flow split for long-running work, job record schema, responsibility boundaries, optional status-check flow
- `patterns/testing-agent-flows.md` — Level 1 direct testing, Level 2 routing tests, near-miss testing, PPAPI evaluation CSV format

**Solutions** (2 new patterns)
- `patterns/connection-references.md` — creation, naming, post-import binding, service account requirements, deployment runbook template, failure modes
- `patterns/publisher-conventions.md` — one publisher per customer, prefix rules, version strategy, solution segmentation (data/process/UI)

#### Changed — skills updated for full component coverage

- **`skills/sw-overview/SKILL.md`** — knowledge map expanded to include all new domains; Power Apps/Custom Connectors/Governance routing guidance added in §5 (technology identification section)
- **`skills/design-solution/SKILL.md`** — Step 2 knowledge-base load now includes power-apps, custom-connectors, and governance guides; Step 3 service selection table adds Canvas App, MDA, Custom Connector, and Governance as explicit rows
- **`skills/analyze-project/SKILL.md`** — discovery step now detects Power Apps (`pa.yaml`), custom connectors (`apiDefinition.swagger.json`), and governance gaps; knowledge guide references extended to all new domains

#### Changed — upstream references

- **`UPSTREAM_REFS.md`** — entry 10 (`microsoft/power-cat-skills`) substantially expanded with full account of what was absorbed (overflow, canvas-apps, dataverse, governance) and what remains as a complementary execution skill. Divergences documented per skill.

#### Version Bump Rationale

Skills `sw-overview`, `design-solution`, and `analyze-project` now materially change routing and evaluation behavior for existing customer work. Three new knowledge domains added. This qualifies as v0.3.0 (minor version: new features, no breaking changes to existing patterns).

---

## [Unreleased] — 0.2.0

### Classic harness as a first-class track

Classic Copilot Studio (topic-based) agents are actively maintained on many customer engagements.
This release elevates classic from a historical footnote to a parallel, fully documented track.

#### Added — classic pattern knowledge

Five new pattern files under `knowledge/copilot-studio/patterns/`, all adapted from
`microsoft/skills-for-copilot-studio` patterns and translated into Sopra conventions:

- **`patterns/teams-production-hardening.md`** — Eight-pattern coordinated framework for classic
  agents deployed to Microsoft Teams or M365 Copilot: reinstall handling (`OnInstallationUpdate`),
  inactivity reset (`OnInactivity`), session-expired Hero Card, cross-channel global context init,
  Reset Conversation override, Start Over with Adaptive Card diagnostics panel, OnError with
  telemetry logging, and agent-level suggested prompts. Includes full YAML examples and a
  validation checklist.
- **`patterns/rai-error-handling.md`** — Override `OnError` to classify Azure OpenAI RAI
  content-filter events (`ContentFiltered`) by subcode (`OpenAISelfHarm`, `OpenAIHate`,
  `OpenAISexual`, `OpenAIViolence`, `OpenAIJailBreak`, `OpenAIndirectAttack`) and return
  category-specific messages with telemetry. Two approaches: direct subcode check (primary, zero
  latency) and AI Builder classifier (secondary, context-aware).
- **`patterns/channel-aware-behavior.md`** — Detect `System.Activity.ChannelId`, gate behavior
  per surface, and avoid the compound-channel-ID pitfall (`msteams:copilot` ≠ `msteams`).
  Includes all known channel IDs, the one-shot init topic pattern, and the authorization safety note.
- **`patterns/dynamic-topic-redirect.md`** — Use `Switch()` Power Fx inside a `BeginDialog`
  node to replace deeply nested `ConditionGroup` routing chains with a single compact node.
- **`patterns/orchestrator-variables.md`** — Use `AutomaticTaskInput` to have the generative
  orchestrator classify or extract structured data at topic-selection time — zero extra credits,
  zero latency. Includes knowledge-routing example with `OnKnowledgeRequested`.

#### Changed — skills updated for classic awareness

- **`skills/sw-overview/SKILL.md`** — Section 5 now explicitly branches classic vs. agentic.
  Adds a table of "when classic is required for a customer solution" with five criteria (environment
  flag, Power Fx dependency, connector constraint, customer decision, compliance). Adds a full
  classic pattern inventory table so the router can point to the right files without guessing.

- **`skills/review-agent-yaml/SKILL.md`** — Completely restructured from an agentic-only skill
  into a **dual-track review skill**. Step 1 identifies the architecture; Track A covers the
  agentic-loop checks (unchanged); Track B adds 21 classic-specific checks across 🔴 Critical,
  🟠 Warning, and 🟡 Suggestion severities — covering hardcoded values, missing system topic
  customization, trigger phrase count, topic overlap, topic size, global variable pollution,
  confirmation-before-write, Teams production hardening, RAI error handling, generative answers
  on regulated content, and PPAPI evaluation. Output now includes architecture label and a
  go/no-go for UAT promotion (classic) or push (agentic).

- **`skills/design-solution/SKILL.md`** — Step 2 now explicitly loads classic patterns when
  the classic track is in play. Step 3 service selection table adds "classic — explicit
  justification required" as a distinct row with five listed justification criteria, and adds a
  warning sign for classic chosen by habit without checking environment support.

#### Changed — root docs

- **`README.md`** — Copilot Studio architecture section now states classic is a first-class track
  for active customer work, and links the full `patterns/` folder for classic guidance.

### Version bump rationale

Skills `review-agent-yaml` and `sw-overview` materially change routing and review behavior for
existing classic-agent customer work. The knowledge base adds five substantive pattern files. Per
`AGENTS.md`: bump when changes materially affect installed-copy behavior.

---

## [Unreleased]

### Added — repackaged as an installable plugin (0.1.0)

The repository is now a **plugin** installable in both GitHub Copilot CLI and Claude from a single
commit, so it can be added on customer machines without file copying or elevated access.

- **`.github/plugin/plugin.json`** — GitHub Copilot manifest (`skills: ["skills/"]`).
- **`.claude-plugin/plugin.json`** + **`.claude-plugin/marketplace.json`** — Claude manifest and
  self-hosted marketplace listing, so `/plugin marketplace add <org>/Sopra-Workflow` works directly
  against this repo with no separate marketplace registry.
- **`commands/`** — 13 explicit `/sw-*` slash commands, giving deterministic invocation instead of
  relying on natural-language skill routing: `/sw-start`, `/sw-status`, `/sw-design`, `/sw-analyze`,
  `/sw-present`, `/sw-grill`, `/sw-plan`, `/sw-review`, `/sw-implement`, `/sw-test`, `/sw-draw`,
  `/sw-review-yaml`, `/sw-learn`.
- **`skills/design-solution/SKILL.md`** — New. Fills the greenfield gap: requirements interview,
  deliberate service selection (agent vs cloud flow vs agent flow vs Dataverse vs code), two-to-three
  options with trade-offs, a recommendation with rejected alternatives recorded, and a specification
  detailed enough for `create-plan` to consume.
- **`skills/capture-learning/SKILL.md`** + **`playbooks/`** — New. The tribal-knowledge mechanism that
  was previously absent entirely. Includes a mandatory client-confidentiality gate, a qualification
  test, a structured entry format with `confidence` and `last-verified` fields, and a feedback step
  that folds confirmed lessons back into `knowledge/` and the review skills.
- **`knowledge/agent-flows/ARCHITECTURE.md`** — New. Agent Flows were absent from the knowledge base.
  Covers agent-flow vs cloud-flow selection, the name/description/schema contract the agent routes
  on, error and latency rules, identity and confirmation, ALM, two-level testing, and a review
  checklist.

### Changed — structure

- **`.github/skills/*` and `.agents/skills/*` → `skills/`** — one skill location, matching the plugin
  contract. The split between "agent skills" and "workflow skills" was an artifact of the old
  copy-into-project install model and no longer meant anything.
- **Domain docs → `knowledge/`** — `copilot-studio/`, `power-automate/`, `dataverse/`, `solutions/`
  and `shared/` now live under `knowledge/`, so they ship inside the plugin and resolve from any
  client workspace via `../../knowledge/`.
- **`workflow-skills` → `sw-overview`**, rewritten from a 46-line stub into the router: the
  toolkit-vs-project distinction, knowledge and artifact locations, the stage routing table,
  resumability, architecture identification, and the working rules.
- **Artifact path standardised to `.sopra/workflow/`** in the *client project*. This resolves the
  conflict between the `.goals/workflow/` path the skills documented and the `workflow/` path the
  extension actually wrote to — the two never agreed.
- **`README.md`** — rewritten around install, commands, and the toolkit/project separation.
- **`AGENTS.md`** — rewritten and re-scoped to working *on the toolkit*, with path rules, the
  command-vs-skill split, manifest version-sync requirements, and how to test with `--plugin-dir`.
- **`skills/README.md`** — rewritten as the skill/command inventory and authoring guide.

### Fixed

- **`.github/workflows/solution-export-import.yml` → `templates/github-workflows/`** — it triggered
  on `push` to main and on `pull_request`, so as a `.github/workflows/` file it would have executed
  against this repository, which contains no Power Platform solution. It is a client template.
- **Removed `.github/extensions/workflow-skills/extension.mjs`** — a 73-line no-op that wrote the
  prompt back to a file and returned it. It appeared functional and did nothing.
- **Repaired 15 internal links** broken by the restructure, and re-verified all markdown links
  resolve repo-wide.

### Known issue (environment, not this repo)

`microsoft/skills-for-copilot-studio` is superseded by `microsoft/copilot-studio-plugin`, but both
may still be installed side by side — producing duplicate, overlapping Copilot Studio agents. Two of
its skills also fail to load (`argument-hint must be a string`). Uninstall the superseded plugin.

### Added

- **`copilot-studio/cli-authoring.md`** — New. CLI/YAML authoring with `pac copilot`: prerequisites and
  the `pac` > 2.9.3 version gate, project layout, component YAML reference (settings, knowledge, tools,
  skills), full command reference, the pull→push→publish loop, connection references, agent testing,
  and a source-control review checklist.
- **`copilot-studio/patterns/agentic-loop.md`** — New. The modern agentic-loop architecture: the loop
  itself, the four components (instructions / knowledge / tools / skills), the component decision tree,
  what no longer exists (topics, Power Fx, global and topic variables), skill effectiveness heuristics,
  anti-patterns, and Sopra conventions.
- **`copilot-studio/patterns/migration-classic-to-agentic.md`** — New. Whether to migrate at all, hard
  constraints (same-environment only, unsupported action types), the eight-step workflow with its
  mandatory approval gate, action→tool conversion, post-push verification, failure modes, and a
  Sopra checklist.
- **`.agents/skills/review-agent-yaml/SKILL.md`** — New reusable skill. Reviews a CLI-authored agent
  against Sopra conventions and the component decision tree, with severity-ranked checks.
- **`copilot-studio/patterns/testing-strategy.md`** — New §0 covering agentic-loop testing: the
  agenticruntime endpoint (not DirectLine), the published-agent requirement, Entra app registration,
  and what to assert on a non-deterministic agent.
- **`shared/tools-and-setup.md`** — Rewritten from a 21-line stub into a full setup guide: tool matrix
  with minimum versions, `pac` install/upgrade/auth, the `mcs-assistant` plugin, Entra app registration
  for testing, VS Code extensions, secrets handling, and troubleshooting.

### Changed

- **`UPSTREAM_REFS.md`** — Added `microsoft/copilot-studio-plugin` as the primary Copilot Studio
  reference (plugin `mcs-assistant` v1.0.2, requires `pac` > 2.9.3), including its experimental-use
  caveats. Updated the pinning table and the last-review entry.
- **`copilot-studio/ARCHITECTURE.md`** — Scoped explicitly to the **classic** architecture, with a
  routing table at the top pointing to the modern docs. Its content was previously presented as
  applying to all agents.
- **`copilot-studio/README.md`** — Restructured around the two architectures; each document is now
  labelled Classic / Modern / Both. Split the conventions section accordingly.
- **`copilot-studio/skills/README.md`** — Rewritten to distinguish *agent* skills (`InlineAgentSkill`
  components) from *developer tooling* skills (`SKILL.md` files), which were previously conflated.
- **`.agents/skills/README.md`** — Documents the actual skill inventory and the correct
  folder-based copy command.
- **`AGENTS.md`** — Structure block corrected (`.agents/`, `.github/workflows/`, `CHANGELOG.md` were
  missing; hardcoded `C:\Sopra-Workflow` removed). Added a rule requiring agents to identify which
  Copilot Studio architecture they are in before advising.
- **`README.md`** — Fixed the skill installation commands; added a Copilot Studio architecture
  selector; removed hardcoded absolute paths.
- **`shared/upstream-skill-examples.md`** — Added the plugin as the primary source and a "what makes a
  good Sopra skill" section.
- **`.github/skills/analyze-project/SKILL.md`** — Discovery now covers modern agent paths
  (`behaviors/`, `capabilities/`) and requires identifying the architecture before evaluating.

### Fixed

- **Broken skill installation instructions.** `README.md` told users to run
  `Copy-Item -Path "...\.agents\skills\*.md"`, but that folder contained only a `README.md` and no
  skills — the command copied nothing. Skills are folders containing `SKILL.md`; the commands now use
  `-Recurse` on directories, and a real skill has been added.
- **Duplicate upstream entry.** `microsoft/skills-for-copilot-studio` was listed twice
  (entries 3 and 11). It is now listed once, marked **superseded** by
  `microsoft/copilot-studio-plugin`, with a warning that the old plugin conflicts with `mcs-assistant`.
- **Contradictory naming conventions.** `copilot-studio/README.md` specified camelCase variables
  (`employeeId`) while `ARCHITECTURE.md` specified `Topic.PascalCase` (`Topic.EmployeeId`).
  Reconciled to the `ARCHITECTURE.md` form.
- **Overstated completeness claim** in `README.md` ("All content is substantive and production-ready.
  No placeholders.") replaced with an honest maturity statement — several pattern files are still stubs.

### Known gaps

- `dataverse/patterns/*`, `power-automate/patterns/*`, `solutions/patterns/*`,
  `shared/naming-conventions.md`, and `shared/environment-strategy.md` remain thin stubs
  (~500–900 bytes each) and need the same treatment as the Copilot Studio section.
- The Copilot Studio YAML schema is explicitly unstable. Re-verify the three new documents at the next
  quarterly upstream review.

---

## [0.1.0] - 2026-08-21

### Added

- **Root files**
  - `README.md` — Full overview of repo purpose, folder structure, skill installation, contribution guide, and upstream sync process
  - `UPSTREAM_REFS.md` — Tracks 9 upstream GitHub repos with descriptions, Sopra usage notes, divergence rationale, and quarterly review process
  - `CHANGELOG.md` — This file; Keep-a-Changelog format

- **`.agents/skills/`**
  - `README.md` — Explains Copilot Studio agent skills, installation process, upstream source, Sopra customizations, and known skills list with usage example

- **`.github/skills/`**
  - `README.md` — Explains GitHub Copilot CLI skills and how to install into a project

- **`.github/workflows/`**
  - `README.md` — Overview of Power Platform CI/CD GitHub Actions workflows
  - `solution-export-import.yml` — Complete GitHub Actions workflow for solution export (on push/manual) and import (on push to main / manual trigger) using `microsoft/powerplatform-actions`

- **`copilot-studio/`**
  - `README.md` — Section overview and navigation
  - `ARCHITECTURE.md` — 3-page architecture guide covering agent design philosophy, topic architecture, generative AI integration, orchestration patterns, knowledge sources, variable management, authentication patterns, anti-patterns, and Sopra conventions
  - `patterns/topic-design.md` — Best practices for topic design including trigger phrases, slot-filling, chaining, adaptive cards, with worked example
  - `patterns/generative-answers.md` — When and how to use generative answers, knowledge source configuration, content moderation, prompt engineering, fallback behavior
  - `patterns/multi-agent.md` — Orchestrator vs specialist pattern, child agent calling, context passing, error handling across agent boundaries with ASCII diagram
  - `patterns/testing-strategy.md` — Unit testing, conversation flow testing, regression suites with Copilot Studio Kit, CI/CD integration, test case structure with type table
  - `skills/README.md` — How Copilot Studio-specific skills from this repo are used

- **`power-automate/`**
  - `README.md` — Section overview
  - `ARCHITECTURE.md` — 3-page architecture guide covering flow type selection, naming conventions, error handling, connection management, performance patterns, child flow pattern, anti-patterns, and Sopra conventions
  - `patterns/error-handling.md` — Try/catch/finally with Scope actions, run-after config, failure notifications, Dataverse logging, retry policies
  - `patterns/http-connector.md` — HTTP connector usage, auth types, pagination, JSON parsing, error status codes
  - `patterns/child-flows.md` — When to use child flows, input/output passing, solution awareness, naming, testing
  - `patterns/dataverse-operations.md` — CRUD with Dataverse connector, OData filters, related records, bulk operations, optimistic concurrency
  - `templates/README.md` — Explains flow template storage and contribution process

- **`dataverse/`**
  - `README.md` — Section overview
  - `ARCHITECTURE.md` — 3-page architecture guide covering table types, column design, relationship patterns, naming conventions, security model, solution architecture, performance, anti-patterns, and Sopra conventions
  - `patterns/table-design.md` — Step-by-step table design, column naming, alternate keys, status/state patterns, audit fields
  - `patterns/security-model.md` — Security role design, business unit strategy, row-level security, testing configurations
  - `patterns/plugin-patterns.md` — When to use plugins, execution pipeline, best practices, error handling, C# pseudo-code
  - `patterns/solution-layering.md` — Managed vs unmanaged layers, customization policies, ISV layering, upgrade vs update with ASCII diagram
  - `scripts/README.md` — PowerShell admin scripts overview, prerequisites, and usage

- **`solutions/`**
  - `README.md` — Section overview
  - `ARCHITECTURE.md` — 3-page architecture guide covering solution strategy, environment ring, managed vs unmanaged, dependency management, versioning, hotfix process, CI/CD integration, anti-patterns, Sopra conventions
  - `patterns/alm-pipeline.md` — Full pipeline design, branch strategy, artifact management with ASCII diagram
  - `patterns/managed-vs-unmanaged.md` — Detailed comparison, decision matrix, acceptable unmanaged scenarios, risk mitigation
  - `patterns/environment-strategy.md` — Environment types, naming, connection references, environment variables, data policies
  - `pipelines/README.md` — Pipeline files overview, GitHub Actions usage, Azure DevOps reference

- **`shared/`**
  - `README.md` — Cross-cutting concerns overview
  - `naming-conventions.md` — Comprehensive naming conventions for all Power Platform products in table format
  - `environment-strategy.md` — Complete environment guide: types, naming, DLP, licensing, data residency, request process
  - `tools-and-setup.md` — Complete developer setup guide: prerequisites, PAC CLI, auth, VS Code extensions, GitHub Copilot CLI

### Notes

- This is the initial scaffold of the Sopra-Workflow knowledge base.
- All content is substantive — no placeholder text.
- Upstream references documented in `UPSTREAM_REFS.md` and reviewed quarterly.

[Unreleased]: https://github.com/sopra/sopra-workflow/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sopra/sopra-workflow/releases/tag/v0.1.0
