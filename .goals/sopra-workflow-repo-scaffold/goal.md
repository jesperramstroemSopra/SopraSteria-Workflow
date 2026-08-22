# Goal: Build Sopra-Workflow reusable asset repository

## User Request

Build out a complete reusable project repository at `C:\Sopra-Workflow`. This is an internal engineering knowledge base and reusable assets repo for a company (Sopra) working on Microsoft Power Platform — specifically Copilot Studio agents, Power Automate flows, Dataverse, and Power Platform solutions.

## Refined Goal

Create a fully populated, production-ready internal knowledge base repository at `C:\Sopra-Workflow` for the Sopra engineering team working on Microsoft Power Platform. Every file must contain substantive, real content — no placeholders. The repo must cover four domains (Copilot Studio, Power Automate, Dataverse, Solutions/ALM), include upstream reference tracking, a GitHub Actions CI/CD workflow for Power Platform, and shared conventions. All Markdown must be properly structured with headers, tables, and code blocks where relevant.

## Acceptance Criteria

- [ ] Root files exist and have full content: `README.md`, `UPSTREAM_REFS.md`, `CHANGELOG.md`
- [ ] `.agents/skills/README.md` explains how to install Copilot Studio skills from this repo into a project
- [ ] `.github/skills/README.md` and `.github/workflows/README.md` exist with content
- [ ] `.github/workflows/` contains at least one real GitHub Actions workflow YAML for Power Platform solution export/import using `microsoft/powerplatform-actions`
- [ ] `copilot-studio/` folder complete: `README.md`, `ARCHITECTURE.md`, all 4 pattern files, `skills/README.md`
- [ ] `power-automate/` folder complete: `README.md`, `ARCHITECTURE.md`, all 4 pattern files, `templates/README.md`
- [ ] `dataverse/` folder complete: `README.md`, `ARCHITECTURE.md`, all 4 pattern files, `scripts/README.md`
- [ ] `solutions/` folder complete: `README.md`, `ARCHITECTURE.md`, all 3 pattern files, `pipelines/README.md`
- [ ] `shared/` folder complete: `README.md`, `naming-conventions.md`, `environment-strategy.md`, `tools-and-setup.md`
- [ ] `UPSTREAM_REFS.md` lists all 7+ specified repos with descriptions and a "How we use upstream refs" section
- [ ] All ARCHITECTURE.md files have 2-4 pages of real content (patterns, anti-patterns, decision trees, Sopra conventions)
- [ ] Pattern files each have 1-2 pages of practical guidance with examples
- [ ] The GitHub Actions workflow uses `microsoft/powerplatform-actions` and covers solution export and import
- [ ] `CHANGELOG.md` includes `v0.1.0` initial entry
- [ ] All files use Windows/PowerShell syntax for any script examples
- [ ] All files committed to git

## Scope Boundaries

**In scope:**
- Creating all directories and files listed in the requested structure
- Writing substantive Markdown content for every file (no empty stubs)
- One real GitHub Actions YAML workflow for Power Platform CI/CD
- Upstream refs documentation with guidance pattern
- Git commit of all files

**Out of scope:**
- Copying actual skill YAML files from `C:\Agents\` (guidance only)
- Setting up git remotes or pushing to GitHub
- Creating Power Platform solutions or Dataverse schemas
- Installing any tools or CLIs

## Applicable Project Conventions

**Quality gate command:**
- None discovered (new repo, no Makefile/justfile/package.json)

**Commit convention:**
- Conventional commits (default)
- `Assisted-by: Claude:Sonnet-4.6`

**Guidelines:**
- None discovered (new repo)

**Rules:**
- Windows paths must use backslashes in PowerShell examples
- All Markdown files must use proper headers, code blocks, and tables
- Content must be substantive — no placeholder text
