# Skills

Skills hold the actual instructions for each stage of Sopra Power Platform delivery. They are
invoked two ways:

- **Explicitly**, via the matching `/sw-*` command in [`../commands/`](../commands/)
- **Implicitly**, when the agent matches the user's request against the skill's `description`

Because of the second path, the `description` frontmatter must describe **when to use the skill**,
not merely what it does. That text is the only thing the router sees.

## Inventory

| Skill | Command | Purpose |
|---|---|---|
| `sw-overview` | `/sw-start` | Router and operating conventions. **Read this first.** |
| `design-solution` | `/sw-design` | Greenfield: requirements interview → options → decision record |
| `analyze-project` | `/sw-analyze` | Evaluate an existing project: architecture, risk, quality, optimization |
| `present-analysis` | `/sw-present` | Reformat findings for a customer or steering group |
| `grill-me` | `/sw-grill` | Deliberately tough stress-test of a design or plan |
| `create-plan` | `/sw-plan` | Sequenced work breakdown with dependencies and done-conditions |
| `review-plan` | `/sw-review` | Gate check before implementation starts |
| `implement-plan` | `/sw-implement` | Execute the plan, recording resumable progress |
| `test-solution` | `/sw-test` | Define and run a test protocol |
| `draw-architecture` | `/sw-draw` | Interactive HTML diagram for any scope |
| `review-agent-yaml` | `/sw-review-yaml` | Focused review of CLI-authored Copilot Studio agent YAML |
| `capture-learning` | `/sw-learn` | Capture a field lesson into `../playbooks/` |

There is no mandatory order. Stages are entry points, not a pipeline.

## Anatomy

```text
skills/<skill-name>/
├── SKILL.md          Required. Frontmatter + instructions.
└── references/       Optional. Long-form material loaded on demand.
```

Frontmatter:

```yaml
---
name: analyze-project
description: "What it does AND when to use it — this drives automatic routing."
argument-hint: "<what the user should type after the command>"
user-invocable: true
---
```

`argument-hint` must be a string. A non-string value causes the skill to fail loading silently at
the plugin level.

## Path conventions

A skill is read from the installed plugin, but the working directory is the **client project**.

| Target | Path from a skill |
|---|---|
| Knowledge base | `../../knowledge/<domain>/...` |
| Playbooks | `../../playbooks/...` |
| Another skill | `../<skill-name>/SKILL.md` |
| Output artifacts | `.sopra/workflow/<stage>/` — in the open workspace |

Never use absolute paths. Never assume the toolkit is the open workspace.

## Writing or changing a skill

1. **State when to use it** in the description, including the words a user would actually say.
2. **Require questions.** Every skill must ask rather than assume project specifics — environment
   URLs, publisher prefixes, licensing, and data locations are never safe to guess.
3. **Cite the knowledge base** for each recommendation so a reviewer can check the reasoning.
4. **Write artifacts as you go**, not at the end, so an interrupted session is still resumable.
5. **Add the matching command** in `../commands/`, and update this table, `sw-overview`, and the
   root `README.md`.
6. **Bump the plugin version** in all three manifests — see [`../AGENTS.md`](../AGENTS.md).

## Testing

```powershell
copilot --plugin-dir <repo-root> plugin list
```

`copilot skill list` does **not** report skills from `--plugin-dir` plugins, so absence there is not
a failure. To exercise a skill properly, start a session with `--plugin-dir` and invoke its command.
