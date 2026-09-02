# Sopra-Workflow — Agent Guide

**This file applies when you are working *on the toolkit itself*.** If you are using the toolkit to
deliver a client project, read `skills/sw-overview/SKILL.md` instead — that is the operating guide.

Sopra-Workflow is a **plugin**: a stage-aware Power Platform delivery toolkit that installs into
GitHub Copilot CLI and Claude and attaches to any client project.

## The distinction that matters most

| | The toolkit | The client project |
|---|---|---|
| What it holds | Skills, commands, generalized knowledge | The customer's solution and delivery artifacts |
| Where | This repository | Whatever workspace the user has open |
| Client data | **Never** | Yes, under `.sopra/workflow/` |

Client-identifying information must never be committed here — no customer names, environment URLs,
tenant or environment IDs, publisher prefixes, user names, or business-revealing schema names.

## Structure

```text
<repo-root>/
├── .github/plugin/plugin.json     GitHub Copilot manifest  (skills: skills/)
├── .claude-plugin/
│   ├── plugin.json                Claude manifest
│   └── marketplace.json           Self-hosted marketplace listing
├── commands/                      /sw-* slash commands (thin, delegate to skills)
├── agents/                        Plugin-bundled GitHub Copilot custom agents
├── skills/
│   ├── sw-overview/               Router + operating conventions — read first
│   ├── design-solution/           Greenfield architecture
│   ├── analyze-project/  present-analysis/  grill-me/
│   ├── create-plan/  review-plan/  implement-plan/  test-solution/
│   ├── draw-architecture/  review-agent-yaml/
│   └── capture-learning/          Feeds playbooks/
├── knowledge/                     The Sopra standard, per service
│   ├── copilot-studio/  power-automate/  agent-flows/
│   ├── dataverse/  solutions/  shared/
├── playbooks/                     Field-learned lessons (client-scrubbed)
├── templates/                     Assets to copy into client projects
└── AGENTS.md  README.md  CHANGELOG.md  UPSTREAM_REFS.md
```

## Commands, skills, and agents

- **Commands** (`commands/sw-*.md`) are thin. Frontmatter (`description`, `argument-hint`,
  `allowed-tools`), a `$ARGUMENTS` line, and a delegation to the skill. Keep logic *out* of them.
- **Skills** (`skills/<name>/SKILL.md`) hold the actual instructions. They also trigger from natural
  language, so the `description` must state *when to use it*, not just what it does.
- **Agents** (`agents/*.md`) define role boundaries, delegation, permissions, and operator behavior.
  They must invoke skills rather than duplicate stage logic. Follow
  `knowledge/shared/copilot-agent-operating-model.md`.

Adding a stage means adding **both**, and listing it in `sw-overview` and the README table.

Agent descriptions must have non-overlapping triggers. Mutation-capable agents must require
operation-specific confirmation and should use `disable-model-invocation: true` when automatic
selection would be unsafe.

## Path rules

Skills are read from wherever the plugin is installed, while the working directory is the *client
project*. So:

- Knowledge references from a skill: `../../knowledge/<domain>/...`
- Playbook references from a skill: `../../playbooks/...`
- Artifacts always go to `.sopra/workflow/<stage>/` **in the open workspace**, never in this repo.
- Never use absolute paths, and never assume the toolkit is the open workspace.
- Client-side learning is first written as a candidate under `.sopra/workflow/capture-learning/`.
  Only a scrubbed, reviewed lesson is promoted into toolkit playbooks.

## Source of truth

When working in this repo, prefer in order:

1. `AGENTS.md` (this file)
2. `skills/sw-overview/SKILL.md` — the operating conventions
3. `README.md`
4. `knowledge/<domain>/ARCHITECTURE.md` and `knowledge/<domain>/patterns/`
5. `knowledge/shared/copilot-agent-operating-model.md`,
   `knowledge/shared/execution-provider-routing.md`, and
   `knowledge/shared/operator-output-contract.md` for agent-led execution
6. `playbooks/` — overrides generic guidance when it contradicts field experience, *if* the entry is
   `confirmed` and recently verified
7. `UPSTREAM_REFS.md`, `knowledge/shared/upstream-skill-examples.md`

For Copilot Studio the entry point depends on the architecture:

- Modern → `knowledge/copilot-studio/patterns/agentic-loop.md`, then `knowledge/copilot-studio/cli-authoring.md`
- Classic → `knowledge/copilot-studio/ARCHITECTURE.md`
- Migration → `knowledge/copilot-studio/patterns/migration-classic-to-agentic.md`

## Copilot Studio: know which architecture you are in

Two architectures, and guidance is **not** interchangeable.

| Signal | Architecture | Authoritative doc |
|---|---|---|
| `topics/`, `actions/` folders; `recognizer.kind` is not a CLI recognizer | Classic | `knowledge/copilot-studio/ARCHITECTURE.md` |
| `behaviors/`, `capabilities/` folders; `recognizer.kind` is `CLICopilotRecognizer` or `CLIAgentRecognizer` | Agentic loop | `knowledge/copilot-studio/patterns/agentic-loop.md` |

Determine this **before** giving advice or reviewing anything. In the agentic loop there are no
topics, no Power Fx, and no global or topic variables — advice assuming them is simply wrong.

Sopra default for new agents is the agentic loop.

## Versioning

Three files carry the version and **must stay in sync**:

- `.github/plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

Bump on any change to skills, commands or knowledge, and record it in `CHANGELOG.md`. An unbumped
version means installed copies silently go stale.

## Testing changes

```powershell
copilot --plugin-dir <path-to-this-repo> plugin list   # confirms it mounts
```

Note: `copilot skill list` does **not** report skills from `--plugin-dir` plugins — absence there is
not a failure. To exercise the skills end to end, run a Copilot session with `--plugin-dir` and
invoke a command.

Custom agents are also not reported by `copilot plugins list`; verify them in a live session's
custom-agent selector.

## External inspiration

Use upstream repos as inspiration only — never copy verbatim. Translate into Sopra conventions and
document divergences.

- `microsoft/copilot-studio-plugin` — **current** source of truth for Copilot Studio agent authoring,
  the agentic-loop architecture, and classic→agentic migration
- `microsoft/power-cat-skills`, Microsoft CAT agent skills gallery
- `microsoft/power-platform-skills` — Power Automate/FlowAgent execution provider
- `github/awesome-copilot` — custom-agent structure inspiration only

`microsoft/skills-for-copilot-studio` is **superseded**. Do not use it for new work, and note that
having both installed produces duplicate, conflicting agents.

## Convention rules

- Command names are `sw-<verb>`; skill names describe the stage.
- Keep language direct and actionable. No filler.
- Every skill must ask clarifying questions rather than assume project specifics.
- Prefer file-backed state over ephemeral chat state.
- Every stage returns the operator dashboard and detailed evidence artifact.
- External plugins and MCP servers are capability providers: preflight them and never assume access.
- No stub content. If you touch a stub, fill it in.
