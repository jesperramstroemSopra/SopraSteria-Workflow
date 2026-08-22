# Sopra-Workflow: Power Platform Internal Knowledge Base

> Internal engineering knowledge base and reusable asset repository for Sopra teams building on Microsoft Power Platform — Copilot Studio, Power Automate, Dataverse, and ALM/Solutions.

---

## Purpose

This repository is the single source of truth for:

- **Architecture decisions** and design patterns for each Power Platform product
- **Reusable skills** for GitHub Copilot (CLI and VS Code) to accelerate Copilot Studio development
- **CI/CD workflow templates** for automated solution export, validation, and deployment
- **Naming conventions and environment strategy** shared across all projects
- **Upstream reference tracking** so the team stays aligned with Microsoft's evolving best practices

All content is substantive and production-ready. No placeholders.

---

## Folder Structure

| Folder | Contents |
|--------|----------|
| `.agents/skills/` | Copilot Studio agent skill definitions (SKILL.md files) for use in VS Code / GitHub Copilot CLI |
| `.github/skills/` | GitHub Copilot CLI skill definitions for this repo |
| `.github/workflows/` | GitHub Actions CI/CD workflows for Power Platform solution export/import |
| `copilot-studio/` | Architecture docs, design patterns, and skills for Copilot Studio agents |
| `power-automate/` | Architecture docs and patterns for Power Automate cloud flows |
| `dataverse/` | Architecture docs, table design patterns, and admin scripts for Dataverse |
| `solutions/` | ALM/solutions architecture, pipeline patterns, and environment strategy |
| `shared/` | Cross-cutting: naming conventions, environment strategy, developer setup |

---

## Quick Start

### 1. Read the Architecture Overview

Start with the architecture document for the product area you're working on:

- Copilot Studio → [`copilot-studio/ARCHITECTURE.md`](copilot-studio/ARCHITECTURE.md)
- Power Automate → [`power-automate/ARCHITECTURE.md`](power-automate/ARCHITECTURE.md)
- Dataverse → [`dataverse/ARCHITECTURE.md`](dataverse/ARCHITECTURE.md)
- Solutions/ALM → [`solutions/ARCHITECTURE.md`](solutions/ARCHITECTURE.md)

### 2. Apply Naming Conventions

Before creating any artifact, read [`shared/naming-conventions.md`](shared/naming-conventions.md).

### 3. Set Up Your Developer Environment

Follow [`shared/tools-and-setup.md`](shared/tools-and-setup.md) to install PAC CLI, VS Code extensions, and configure authentication.

### 4. Set Up CI/CD

Copy `.github/workflows/solution-export-import.yml` into your project repo and configure the required secrets (see [`solutions/pipelines/README.md`](solutions/pipelines/README.md)).

---

## How to Use Skills from This Repo

Skills are Markdown files that GitHub Copilot reads to understand specialized domain knowledge and tooling. There are two kinds in this repo:

### Copilot Studio Agent Skills (`.agents/skills/`)

These enable GitHub Copilot CLI and VS Code Copilot to assist with Copilot Studio authoring.

**To install in your project:**

```powershell
# From your project root
New-Item -ItemType Directory -Force -Path ".agents\skills"
Copy-Item -Path "C:\Sopra-Workflow\.agents\skills\*.md" -Destination ".agents\skills\"
```

After copying, GitHub Copilot CLI will automatically discover the skills and make them available as `/skill-name` commands.

### GitHub Copilot CLI Skills (`.github/skills/`)

These provide repo-level context to GitHub Copilot.

```powershell
New-Item -ItemType Directory -Force -Path ".github\skills"
Copy-Item -Path "C:\Sopra-Workflow\.github\skills\*.md" -Destination ".github\skills\"
```

See [`.agents/skills/README.md`](.agents/skills/README.md) and [`.github/skills/README.md`](.github/skills/README.md) for full details.

---

## How to Contribute

1. **Branch from `main`** using the convention: `feat/`, `fix/`, `docs/`, `chore/` prefix
   ```
   git checkout -b docs/add-pa-connector-pattern
   ```

2. **Write substantive content** — no stub files. Every `.md` must have real guidance, examples, and code blocks where appropriate.

3. **Follow the naming conventions** in [`shared/naming-conventions.md`](shared/naming-conventions.md).

4. **Open a Pull Request** against `main` with a description of what you added and why.

5. **Reference upstream material** if you adapted from one of the upstream repos in [`UPSTREAM_REFS.md`](UPSTREAM_REFS.md), add a comment in the file noting the source and any Sopra-specific divergence.

---

## How to Sync Inspiration from Upstream Refs

This repo does **not** fork or directly import upstream repositories. Instead:

1. Review the upstream repos listed in [`UPSTREAM_REFS.md`](UPSTREAM_REFS.md) quarterly.
2. When you find a pattern or example worth adapting, copy the relevant insight into the appropriate pattern file.
3. Add a comment block like this at the top of the section:

   ```markdown
   <!-- Upstream: microsoft/powerplatform-actions v2.8 — adapted for Sopra service principal auth pattern -->
   ```

4. Update `UPSTREAM_REFS.md` with any version notes or divergence rationale.

### Skill example sources

When reviewing or improving skills, also search the Microsoft CAT agent skills gallery for examples:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use it as an inspiration source only. Adapt patterns into Sopra-specific skills and docs instead of copying them verbatim.

See [`shared/upstream-skill-examples.md`](shared/upstream-skill-examples.md) for the canonical list of external skill inspiration sources.

---

## Related Resources

- [Microsoft Power Platform Documentation](https://learn.microsoft.com/en-us/power-platform/)
- [Copilot Studio Documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)
- [Power Automate Documentation](https://learn.microsoft.com/en-us/power-automate/)
- [Dataverse Documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/)
- [`UPSTREAM_REFS.md`](UPSTREAM_REFS.md) — upstream GitHub repos tracked by Sopra
- [`CHANGELOG.md`](CHANGELOG.md) — version history of this repo
