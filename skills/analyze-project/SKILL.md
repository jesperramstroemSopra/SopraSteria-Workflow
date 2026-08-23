---
name: analyze-project
description: "Analyze a Power Platform project against Sopra architecture guides. Identifies project type, evaluates architecture, risks, quality, and optimization opportunities. Saves findings to disk."
argument-hint: "<what to analyze and what type of analysis>"
user-invocable: true
---

# Analyze Project

You are the first stage of the Sopra workflow pipeline. Your job is to deeply analyze a project and produce a structured findings report saved to disk.

## Inputs you need

1. **Project type** — ask the user if not obvious: `copilot studio`, `power automate`, `dataverse`, `solutions`, or a combination.
2. **Analysis type** — one or more of: `architecture`, `risk`, `quality`, `optimization`, `migration`, `review`.
3. **Subject** — what specifically to evaluate (an agent folder, a flow, a solution, or the whole project).

## What you do

1. **Discover the project.** Scan the workspace for relevant artifacts:
   - Copilot Studio (modern / agentic-loop): `**/settings.mcs.yml`, `**/behaviors/*.mcs.yml`, `**/capabilities/tools/*.mcs.yml`, `**/capabilities/knowledge/*.mcs.yml`
   - Copilot Studio (classic): `**/agent.mcs.yml`, `**/topics/*.mcs.yml`, `**/actions/*.mcs.yml`
   - Power Automate: flow definition JSON files, solution zips
   - Dataverse: table definitions, security role XML, plugin code
   - Solutions: solution.xml, customizations.xml, environment variable definitions
   - Power Apps: `pa.yaml` files (Canvas Apps), `app.app` / `solution.xml` entries for MDAs
   - Custom Connectors: `apiDefinition.swagger.json`, connector definition folders in solution zips
   - Governance indicators: missing DLP documentation, personal connections, no service account

   Identify **which Copilot Studio architecture** you are looking at before evaluating: a `topics/`
   folder means classic; `behaviors/` and `capabilities/` mean agentic-loop. Confirm with
   `configuration.recognizer.kind` in `settings.mcs.yml` (`CLICopilotRecognizer` /
   `CLIAgentRecognizer` = modern). Reviewing a modern agent against classic rules produces nonsense
   findings, and vice versa.

2. **Read the Sopra architecture guides.** Load and reference the relevant docs from this repo:
   - Copilot Studio (modern): `../../knowledge/copilot-studio/patterns/agentic-loop.md`, `../../knowledge/copilot-studio/cli-authoring.md`
   - Copilot Studio (classic): `../../knowledge/copilot-studio/ARCHITECTURE.md` and `../../knowledge/copilot-studio/patterns/*.md`
   - `../../knowledge/power-automate/ARCHITECTURE.md` and `../../knowledge/power-automate/patterns/*.md`
    (includes `flow-review-checklist.md` — use for PA flow reviews; reference `powercat-overflow` skill for full solution audit)
  - `../../knowledge/dataverse/ARCHITECTURE.md` and `../../knowledge/dataverse/patterns/*.md`
  - `../../knowledge/solutions/ARCHITECTURE.md` and `../../knowledge/solutions/patterns/*.md`
  - `../../knowledge/power-apps/ARCHITECTURE.md` and `../../knowledge/power-apps/patterns/*.md`
    (Canvas Apps: delegation warnings, Named Formulas, component libraries, screen design, PCF decisioning)
  - `../../knowledge/custom-connectors/ARCHITECTURE.md` and `../../knowledge/custom-connectors/patterns/*.md`
    (auth patterns, pagination, policy templates)
  - `../../knowledge/governance/ARCHITECTURE.md` and `../../knowledge/governance/patterns/*.md`
    (DLP policies, environment provisioning, CoE Kit)
  - `../../knowledge/shared/naming-conventions.md`, `../../knowledge/shared/environment-strategy.md`

3. **Evaluate against the guides.** For each analysis type:
   - **Architecture**: Does the project follow Sopra's architecture patterns? Are there structural anti-patterns?
   - **Risk**: What could break in production? Missing error handling, hardcoded values, security gaps, auth issues?
   - **Quality**: Naming conventions followed? Documentation present? Topics/flows sized correctly?
   - **Optimization**: Performance bottlenecks? Unnecessary complexity? Better patterns available?
   - **Migration**: What needs to change to move between environments? Solution layering correct?
   - **Review**: General health check across all dimensions.

4. **Produce findings.** Categorize each finding by severity:
   - 🔴 **Critical** — must fix before production
   - 🟠 **Warning** — should fix, creates risk
   - 🟡 **Suggestion** — improvement opportunity
   - 🟢 **Good** — things done well (include these for balance)

## Output artifact

Save the analysis to: `.sopra/workflow/analyze-project/analysis-{timestamp}.md`

The artifact must include:
- Project type and scope
- Analysis type(s) performed
- Summary of findings (table format)
- Detailed findings with severity, description, affected files, and recommended fix
- References to which Sopra guide sections apply

## Rules

- Never skip reading the architecture guides — they are the standard.
- Be specific: reference exact file paths and line numbers when possible.
- If the project has no artifacts to analyze, tell the user and stop.
- Do not fix anything — only analyze and report. Fixes come in the `implement-plan` stage.

## Reference examples

When improving how you analyze or present findings, compare against examples from:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use the examples for structure and clarity, then keep the actual analysis Sopra-specific.
