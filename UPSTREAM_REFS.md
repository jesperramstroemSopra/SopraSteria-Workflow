# Upstream References

This file tracks the public GitHub repositories that Sopra uses as inspiration, reference material, and upstream sources for patterns in this knowledge base. We do **not** fork these repos — we read, adapt, and track divergences here.

---

## Tracked Repositories

### 1. `microsoft/powerplatform-actions`

- **URL:** https://github.com/microsoft/powerplatform-actions
- **Description:** Official GitHub Actions for Power Platform CI/CD — export solutions, import solutions, publish, check solution, run tests, and more. The canonical source for workflow step definitions.
- **Sopra Usage:** Base for all GitHub Actions workflows in `.github/workflows/`. We use the `@latest` tag in non-production and pin to a specific version in production pipelines.
- **Divergences:** Sopra wraps export and import in composite actions to standardize secret injection and add Dataverse environment variable swap logic before import.

---

### 2. `microsoft/powerplatform-build-tools`

- **URL:** https://github.com/microsoft/powerplatform-build-tools
- **Description:** Azure DevOps extension providing build tasks equivalent to `powerplatform-actions` but for ADO pipelines. Covers solution export/import, checker, Power Apps test automation.
- **Sopra Usage:** Reference for teams using Azure DevOps instead of GitHub Actions. Patterns from this repo inform the ADO pipeline YAML templates in `solutions/pipelines/`.
- **Divergences:** Sopra adds a mandatory "solution health check" stage before UAT promotion that is not present in the upstream samples.

---

### 3. `microsoft/skills-for-copilot-studio`

- **URL:** https://github.com/microsoft/skills-for-copilot-studio
- **Description:** Official Copilot Studio agent skill definitions for use with GitHub Copilot CLI and VS Code. These SKILL.md files give Copilot context to assist with Copilot Studio YAML authoring, topic design, action wiring, and deployment.
- **Sopra Usage:** Source for the skills stored in `.agents/skills/` and `.github/skills/`. We copy and optionally extend these files rather than maintaining a fork.
- **Divergences:** Sopra adds a `sopra-conventions` section to the `advisor` skill that references our naming conventions and environment strategy. Upstream skills are updated quarterly.

---

### 4. `microsoft/Power-Fx`

- **URL:** https://github.com/microsoft/Power-Fx
- **Description:** Open-source Power Fx formula language used in Power Apps, Power Automate expressions, and Copilot Studio conditions. The repo contains the language spec, test cases, and C# SDK.
- **Sopra Usage:** Reference for complex formula patterns in Power Apps screens and Copilot Studio condition nodes. The language spec helps disambiguate edge cases not covered in product docs.
- **Divergences:** Sopra does not use the C# SDK directly; we reference the formula spec only.

---

### 5. `pnp/powerautomate-samples`

- **URL:** https://github.com/pnp/powerautomate-samples
- **Description:** Community-contributed Power Automate flow samples covering HTTP triggers, SharePoint automation, Teams notifications, approval flows, and more. Maintained by the PnP community.
- **Sopra Usage:** Inspiration for flow patterns in `power-automate/patterns/`. When a community sample demonstrates a better approach than our current pattern, we adapt it and note the source.
- **Divergences:** Sopra always adapts samples to use service accounts instead of user connections, adds error handling scopes, and wraps in solutions.

---

### 6. `pnp/powerapps-samples`

- **URL:** https://github.com/pnp/powerapps-samples
- **Description:** Community-contributed Power Apps canvas app and model-driven app samples. Wide range of UI patterns, component library examples, and Dataverse integration patterns.
- **Sopra Usage:** Reference for Power Apps screen design patterns and component reuse strategies. Not directly used in this knowledge base today but tracked for future Power Apps section.
- **Divergences:** N/A (section not yet added to this repo).

---

### 7. `microsoft/Federal-Business-Applications`

- **URL:** https://github.com/microsoft/Federal-Business-Applications
- **Description:** Enterprise patterns, architecture guides, and compliance notes for Power Platform in US Federal and large enterprise contexts. Covers GCC/GCC High/DoD environments, FedRAMP, and enterprise ALM.
- **Sopra Usage:** Reference for enterprise security patterns in `dataverse/patterns/security-model.md` and compliance notes in `shared/environment-strategy.md`. Useful for large-enterprise client engagements.
- **Divergences:** Sopra does not operate in GCC; we reference this repo for the enterprise ALM discipline and security layering concepts, adapted for commercial cloud.

---

### 8. `microsoft/PowerApps-Samples`

- **URL:** https://github.com/microsoft/PowerApps-Samples
- **Description:** Official Microsoft Power Apps code samples including Dataverse Web API, plugin development, custom connectors, PCF controls, and canvas app samples.
- **Sopra Usage:** Primary reference for Dataverse plugin patterns in `dataverse/patterns/plugin-patterns.md` and custom connector design. The C# plugin samples inform our pseudo-code examples.
- **Divergences:** Sopra wraps plugin logic in a `SopraTelemetryBase` base class for structured logging; this is not present in upstream samples.

---

### 9. `microsoft/Microsoft-Power-Platform-Patterns-and-Practices`

- **URL:** https://github.com/microsoft/Microsoft-Power-Platform-Patterns-and-Practices
- **Description:** Official Power Platform Patterns & Practices guidance — ALM accelerator, environment strategy, governance, CoE starter kit patterns. The most comprehensive official architecture reference.
- **Sopra Usage:** Foundation for `solutions/ARCHITECTURE.md`, `shared/environment-strategy.md`, and the ALM pipeline pattern. The environment ring (DEV→TEST→UAT→PROD) and publisher conventions derive from this source.
- **Divergences:** Sopra uses a simplified 4-ring pipeline instead of the full CoE Accelerator pipeline. We also mandate GitHub Actions over the ADO-first CoE approach for new projects.

---

### 10. `microsoft/power-cat-skills`

- **URL:** https://github.com/microsoft/power-cat-skills
- **Description:** Microsoft Power CAT skills and examples for productivity-oriented agent workflows and reusable patterns.
- **Sopra Usage:** Review this repo when improving workflow skills, prompt structure, review style, and productivity-oriented agent behavior.
- **Divergences:** Sopra adapts examples into our own workflow stages, artifact model, and Power Platform conventions.

---

### 11. `microsoft/skills-for-copilot-studio`

- **URL:** https://github.com/microsoft/skills-for-copilot-studio
- **Description:** Official Copilot Studio skills repository with reusable skill files and agent-authoring guidance.
- **Sopra Usage:** Primary reference for Copilot Studio skill structure, phrasing, and instruction style.
- **Divergences:** Sopra adds workflow artifacts, repo-local storage, and our own stage-based process model.

---

## How Sopra Uses Upstream Refs

### Guiding Principles

1. **Read and adapt, don't fork.** We never fork upstream repos. Forking creates maintenance burden and false signals of ownership. Instead, we read the upstream repo, extract the relevant insight, and write it into this knowledge base in Sopra's voice.

2. **Track divergences explicitly.** When Sopra's pattern differs from upstream — whether for client constraints, tooling choices, or deliberate design — we document the divergence with a rationale comment in the relevant pattern file:

   ```markdown
   <!-- Upstream: pnp/powerautomate-samples — Sopra diverges: we require service accounts
        instead of user connections in all automated flows to avoid token expiry issues. -->
   ```

3. **Cite the source.** When adapting content, include a comment block with the upstream repo, approximate version or date, and the specific file or pattern referenced.

4. **Don't copy verbatim.** Upstream content may be subject to licenses. Adapt and rewrite in Sopra's context rather than copy-pasting large blocks.

### Annotating Divergences in Pattern Files

Every pattern file that draws from an upstream source should have a `## Upstream Reference` section at the bottom:

```markdown
## Upstream Reference

- **Source:** microsoft/powerplatform-actions — `export-solution` action README
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Added `--async` flag and retry wrapper for large solutions >150MB.
  Upstream docs do not address large solution timeouts.
```

---

## Update Cadence

### Quarterly Review Process

Each quarter (January, April, July, October), a designated team member runs the upstream review:

1. **Check for new releases** in each tracked repo using GitHub's release/tag page.
2. **Scan merged PRs** from the past quarter for significant new patterns or breaking changes.
3. **Update this file** with any version bumps or new repos worth tracking.
4. **Open a PR** titled `chore: upstream-refs quarterly review YYYY-QN` with all updates.
5. **Notify the team** in the relevant Teams channel with a summary of material changes.

### Version Pinning Policy

| Upstream Repo | Pinning Strategy |
|--------------|-----------------|
| `microsoft/powerplatform-actions` | Pin to latest patch in prod workflows; `@latest` in dev |
| `microsoft/powerplatform-build-tools` | Pin to extension version in ADO pipeline |
| `microsoft/skills-for-copilot-studio` | Copy at review time; note the commit SHA in this file |
| `microsoft/power-cat-skills` | Reference only; review quarterly for workflow skill ideas |
| All others | Reference only; no version pinning required |

### Last Review

- **Date:** 2026-08-21
- **Reviewer:** Sopra Platform Team
- **Notes:** Initial population of this file. All refs are current as of August 2026.
