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
   - Copilot Studio: `**/agent.mcs.yml`, `**/topics/*.mcs.yml`, `**/actions/*.mcs.yml`, `**/settings.mcs.yml`
   - Power Automate: flow definition JSON files, solution zips
   - Dataverse: table definitions, security role XML, plugin code
   - Solutions: solution.xml, customizations.xml, environment variable definitions

2. **Read the Sopra architecture guides.** Load and reference the relevant docs from this repo:
   - `copilot-studio/ARCHITECTURE.md` and `copilot-studio/patterns/*.md`
   - `power-automate/ARCHITECTURE.md` and `power-automate/patterns/*.md`
   - `dataverse/ARCHITECTURE.md` and `dataverse/patterns/*.md`
   - `solutions/ARCHITECTURE.md` and `solutions/patterns/*.md`
   - `shared/naming-conventions.md`, `shared/environment-strategy.md`

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

Save the analysis to: `.goals/workflow/analyze-project/analysis-{timestamp}.md`

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
