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

### 3. `microsoft/copilot-studio-plugin` ⭐ PRIMARY

- **URL:** https://github.com/microsoft/copilot-studio-plugin
- **Status:** **Active.** This is the official **successor to `microsoft/skills-for-copilot-studio`** (see the superseded entry below).
- **Description:** An experimental plugin (`mcs-assistant`) for creating, editing, validating, and **migrating classic agents to the new agentic-loop experience**. It ships four sub-agents (`copilot-studio-architect`, `copilot-studio-describer`, `copilot-studio-init`, `copilot-studio-manage`) and two commands (`/migrate`, `/chat`), plus helper scripts including `convert-actions-to-tools.js`.
- **Hard dependency:** Power Platform CLI (`pac`) **greater than 2.9.3**. Earlier versions will not work. See [`shared/tools-and-setup.md`](knowledge/shared/tools-and-setup.md).
- **Installation:**
  ```text
  /plugin marketplace add microsoft/copilot-studio-plugin
  /plugin install mcs-assistant@copilot-studio-plugin
  ```
- **Sopra Usage:** Primary reference for **CLI-based agent authoring** ([`copilot-studio/cli-authoring.md`](knowledge/copilot-studio/cli-authoring.md)), the **agentic-loop architecture** ([`copilot-studio/patterns/agentic-loop.md`](knowledge/copilot-studio/patterns/agentic-loop.md)), and **classic→agentic migration** ([`copilot-studio/patterns/migration-classic-to-agentic.md`](knowledge/copilot-studio/patterns/migration-classic-to-agentic.md)).
- **Divergences:** Sopra layers its naming conventions, `spr_` solution prefix, and environment-ring promotion rules on top of the plugin's generated output. We also require human review of all generated YAML before push.
- **⚠️ Experimental — read before relying on it:** Microsoft explicitly states this is *"an experimental research project, not an officially supported Microsoft product,"* that *"the Copilot Studio YAML schema may change without notice,"* and that it is **"not meant for production use."** Sopra treats plugin output as a **draft accelerator only**: always review generated YAML, validate it, and test in DEV before promoting. Never push plugin-generated YAML directly to UAT or PROD.

---

### 3b. `microsoft/skills-for-copilot-studio` — ⚠️ SUPERSEDED

- **URL:** https://github.com/microsoft/skills-for-copilot-studio
- **Status:** **Superseded by `microsoft/copilot-studio-plugin`** (entry 3). Retained here for historical traceability only.
- **Description:** The original Copilot Studio agent skill definitions for GitHub Copilot CLI and VS Code, giving Copilot context for Copilot Studio YAML authoring, topic design, action wiring, and deployment.
- **Sopra Usage:** **Do not use for new work.** Any Sopra content still derived from this repo should be re-based onto the successor plugin at the next quarterly review.
- **Divergences:** Historical. The `sopra-conventions` extension previously maintained against the upstream `advisor` skill is no longer tracked.

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
- **Status:** **Active.** A plugin marketplace for GitHub Copilot CLI and Microsoft Scout, providing specialized execution skills for Power Platform domains.
- **Description:** Nine plugins covering: Canvas App performance audit and migration (`powercat-canvas-apps`), Dataverse Web API query generation (`powercat-dataverse`), Power Automate flow review against Microsoft coding guidelines (`powercat-overflow`), Power Pages audit (`powercat-overpage`), developer environment provisioning (`powercat-governance`), pro-code app eval suite generation (`powercat-procode-eval`), customer story deck generation (`powercat-adoption`), and Power Platform admin digest (`powercat-admin-digest`).
- **Sopra Usage:** This repo was substantially integrated into Sopra-Workflow in v0.3.0 (August 2026):
  - `powercat-overflow` coding guidelines → adapted into `knowledge/power-automate/patterns/flow-review-checklist.md`. The `powercat-overflow` execution skill remains a complementary automated scanner for full-solution audits.
  - `powercat-canvas-apps` performance patterns → informed `knowledge/power-apps/patterns/performance.md` and `delegation.md`. The `powercat-canvas-apps` skill remains the automated audit tool for `pa.yaml` files.
  - `powercat-dataverse` Web API patterns → informed `knowledge/dataverse/patterns/web-api-queries.md`. The `dataverse-webapi-query` skill remains the query-generation tool.
  - `powercat-governance` dev env provisioning → referenced in `knowledge/governance/patterns/environment-provisioning.md`. The `create-pp-dev-env` skill is the recommended automation for individual developer environments.
  - `powercat-procode-eval` eval patterns → referenced in `skills/test-solution/SKILL.md` as the specialized eval track for code-heavy app validation.
- **Divergences:**
  - Sopra wraps Power CAT patterns in our ALM lifecycle, service account requirements, and Sopra naming conventions. Power CAT patterns are absorbed into Sopra knowledge files (not linked externally) so they are available offline and under Sopra quality control.
  - Power CAT execution skills (overflow, canvas-apps, dataverse-webapi-query) are referenced as complementary tools for automated/deep work — they are not replaced by Sopra knowledge.
  - Sopra's flow review checklist treats hardcoded credentials as High/blocking; Power CAT Overflow classifies them as High but does not enforce blocking.
  - Canvas App delegation warnings are treated as correctness bugs (blocking) in Sopra; Power CAT classifies them as performance notes.
  - `powercat-overpage` (Power Pages) is **not yet integrated** — Power Pages is out of scope for Sopra-Workflow v0.3.0.

---

### 11. `microsoft/cat-agent-skills` (gallery)

- **URL:** https://microsoft.github.io/cat-agent-skills/?tag=productivity
- **Description:** Microsoft CAT's public gallery of agent skill examples — useful for skill structure, phrasing, and instruction style.
- **Sopra Usage:** Reference when tuning the skills in `skills/` and the commands in `commands/`.
- **Divergences:** Sopra adapts examples into our own workflow stages, artifact model, and Power Platform conventions.

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
| `microsoft/copilot-studio-plugin` | Record plugin version (`mcs-assistant` vX.Y.Z) and minimum `pac` version here at each review; plugin is experimental and may change without notice |
| `microsoft/skills-for-copilot-studio` | **Superseded** — no longer tracked; retained for history only |
| `microsoft/power-cat-skills` | Reference only; review quarterly for workflow skill ideas |
| All others | Reference only; no version pinning required |

### Last Review

- **Date:** 2026-08-23
- **Reviewer:** Sopra Platform Team
- **Notes:**
  - Major expansion of knowledge base: added `power-apps/`, `custom-connectors/`, and `governance/` knowledge domains with full ARCHITECTURE.md + patterns each.
  - Deepened existing domains: Power Automate (4 new patterns), Dataverse (3 new patterns), Agent Flows (3 new patterns), Solutions (2 new patterns).
  - Substantially integrated `microsoft/power-cat-skills` (entry 10) — see that entry for full detail on what was absorbed and what remains as a complementary execution skill.
  - Version bumped to 0.3.0 across all three manifests.
  - **Next review must verify**: Power CAT skill versions for powercat-overflow, powercat-canvas-apps, powercat-governance; any breaking changes to Overflow sources list; CoE Kit version used in governance patterns.
