# Sopra-Workflow

> A stage-aware Power Platform delivery toolkit for AI coding agents. Install it once, attach it to
> any client project, and drive the work with explicit commands — from first architecture sketch
> through analysis, planning, implementation and test.

Covers **Copilot Studio**, **Power Automate**, **Agent Flows**, **Dataverse** and **Solution ALM**,
backed by Sopra Steria field knowledge that is not in the Microsoft documentation.

---

## What this is

A **plugin**. It installs into GitHub Copilot CLI and Claude from the same repository, and adds:

- **13 slash commands** (`/sw-*`) — explicit, discoverable entry points
- **12 skills** — the logic behind the commands, which also trigger from natural language
- **A knowledge base** (`knowledge/`) — the Sopra standard for each service
- **Playbooks** (`playbooks/`) — what we learned the hard way, generalized and reusable

You keep working in the **client's** repository. The toolkit rides along; it is never copied in.

---

## Install

> Replace `<org>` with the GitHub organisation hosting this repo.

**GitHub Copilot CLI**

```
/plugin marketplace add <org>/Sopra-Workflow
/plugin install sopra-workflow@sopra-workflow
```

or directly:

```
copilot plugin install <org>/Sopra-Workflow
```

**Claude**

```
/plugin marketplace add <org>/Sopra-Workflow
/plugin install sopra-workflow
```

**Local development** — test changes without installing:

```
copilot --plugin-dir <path-to-this-repo>
```

Colleagues need read access to this repository, and nothing else. No admin rights, no installer, no
file copying onto customer machines.

### Update

```
copilot plugin update sopra-workflow
```

---

## Commands

Run `/sw-start` if you are not sure where to begin — it inspects the project and routes you.

| Command | When to use it |
|---|---|
| `/sw-start` | Entry point. Detects the stage, resumes work in progress, routes you |
| `/sw-status` | Read-only report: what's done, what's open, what's next |
| `/sw-design` | Greenfield. Requirements interview → architecture options → decision record |
| `/sw-analyze` | Something exists. Evaluate architecture, risk, quality, optimization |
| `/sw-present` | Reformat findings for a customer or steering group |
| `/sw-grill` | Attack a design or plan. Deliberately tough |
| `/sw-plan` | Turn findings into a sequenced work breakdown |
| `/sw-review` | Gate-check the plan before anyone builds |
| `/sw-implement` | Execute the plan, recording progress as it goes |
| `/sw-test` | Define and run a test protocol |
| `/sw-draw` | Interactive HTML architecture diagram for any scope |
| `/sw-review-yaml` | Focused review of CLI-authored Copilot Studio agent YAML |
| `/sw-learn` | Capture a field lesson into the playbooks |

The stages are **not** a mandatory pipeline. Start anywhere. A mature project might only ever use
`/sw-analyze` → `/sw-grill` → `/sw-implement`.

---

## How work is recorded

Every stage writes to the **client project**, under `.sopra/workflow/`:

```text
.sopra/workflow/
  _state.json              Active stage, subject, open questions
  design-solution/
  analyze-project/
  grill-me/
  create-plan/
  implement-plan/
  test-solution/
  ...
```

This is what makes work resumable — a colleague on another machine runs `/sw-status` and picks up
where you stopped. Committing `.sopra/` to the project repo is usually the right call.

Artifacts are timestamped and never overwritten, so the history of decisions survives.

---

## Repository layout

| Path | Contents |
|---|---|
| `.github/plugin/plugin.json` | GitHub Copilot manifest |
| `.claude-plugin/` | Claude manifest + marketplace listing |
| `commands/` | The `/sw-*` slash commands |
| `skills/` | Skill definitions (`<name>/SKILL.md`) |
| `knowledge/` | The Sopra standard, per service |
| `playbooks/` | Field-learned lessons, generalized and client-scrubbed |
| `templates/` | Reusable assets to copy into client projects (CI/CD workflows, etc.) |

### Knowledge base

| Area | Path |
|---|---|
| Copilot Studio | `knowledge/copilot-studio/` — classic **and** agentic loop, CLI authoring, migration |
| Power Automate | `knowledge/power-automate/` |
| Agent Flows | `knowledge/agent-flows/` |
| Dataverse | `knowledge/dataverse/` |
| Solutions / ALM | `knowledge/solutions/` |
| Cross-cutting | `knowledge/shared/` — naming, environments, developer setup |

Maturity varies. `knowledge/copilot-studio/` and `knowledge/shared/tools-and-setup.md` are
substantive; several pattern files under `dataverse/`, `power-automate/` and `solutions/` are still
short. See **Known gaps** in [`CHANGELOG.md`](CHANGELOG.md). **If you touch a stub, fill it in.**

---

## Copilot Studio: which architecture?

Most older guidance describes only the first of these. Getting it wrong produces confident nonsense.

| | Classic | Agentic loop (modern) |
|---|---|---|
| Building block | Topics | Instructions, Knowledge, Tools, Skills |
| Authoring | Maker portal | Portal **or** CLI/YAML in source control |
| Power Fx & variables | Supported | **Not supported** |
| Folders on disk | `topics/`, `actions/` | `behaviors/`, `capabilities/` |

Authoritative check: `configuration.recognizer.kind` in `settings.mcs.yml` —
`CLICopilotRecognizer` or `CLIAgentRecognizer` means agentic loop.

**Sopra default for new agents is the agentic loop.** Start with
[`knowledge/copilot-studio/patterns/agentic-loop.md`](knowledge/copilot-studio/patterns/agentic-loop.md),
then [`knowledge/copilot-studio/cli-authoring.md`](knowledge/copilot-studio/cli-authoring.md). To
modernise an existing agent, see
[`knowledge/copilot-studio/patterns/migration-classic-to-agentic.md`](knowledge/copilot-studio/patterns/migration-classic-to-agentic.md).

---

## Contributing

The toolkit is only as good as what gets fed back into it.

**After every engagement, run `/sw-learn`** for anything you learned that was not in the docs. That
is the whole point of the playbooks — see [`playbooks/README.md`](playbooks/README.md).

1. Branch using `feat/`, `fix/`, `docs/` or `chore/`.
2. Write substantive content. No stubs.
3. Follow [`knowledge/shared/naming-conventions.md`](knowledge/shared/naming-conventions.md).
4. Bump `version` in **both** `.github/plugin/plugin.json` and `.claude-plugin/plugin.json`, plus
   `.claude-plugin/marketplace.json` — they must stay in sync or installs go stale.
5. Open a PR describing what changed and why.

### Confidentiality

**Never commit client-identifying information.** No customer names, environment URLs, tenant or
environment IDs, publisher prefixes, user names, or business-revealing schema names. Playbook
entries are generalized to the pattern, or they are not written here at all.

Client artifacts belong in the client's `.sopra/workflow/` — never in this repository.

---

## Staying current

This repo does not fork upstream repositories. Review the sources in
[`UPSTREAM_REFS.md`](UPSTREAM_REFS.md) quarterly and adapt insights into the relevant knowledge file,
noting the source:

```markdown
<!-- Upstream: microsoft/copilot-studio-plugin v1.0.2 — adapted for Sopra publisher prefix -->
```

[`microsoft/copilot-studio-plugin`](https://github.com/microsoft/copilot-studio-plugin) is the
current source of truth for Copilot Studio agent authoring.

> **`microsoft/skills-for-copilot-studio` is superseded** by `copilot-studio-plugin`. If it is still
> installed alongside the successor you will get duplicate, conflicting agents — uninstall it.

---

## Related

- [Power Platform docs](https://learn.microsoft.com/en-us/power-platform/) ·
  [Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/) ·
  [Power Automate](https://learn.microsoft.com/en-us/power-automate/) ·
  [Dataverse](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/)
- [About Copilot CLI plugins](https://docs.github.com/copilot/concepts/agents/copilot-cli/about-cli-plugins)
- [`UPSTREAM_REFS.md`](UPSTREAM_REFS.md) · [`CHANGELOG.md`](CHANGELOG.md)
