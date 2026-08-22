# Changelog

All notable changes to the Sopra-Workflow knowledge base are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
