---
description: Review CLI-authored Copilot Studio agent YAML against Sopra conventions — flags misclassified components, placeholder descriptions, push-blocking file names and missing instruction coverage.
argument-hint: Path to the agent project, or the agent name
allowed-tools: Read, Write, Glob, Grep, Bash(pac), Task
---

# Review Agent YAML

Initial request: $ARGUMENTS

Run the `review-agent-yaml` skill in this plugin (`../../skills/review-agent-yaml/SKILL.md`). Follow
the conventions in `../../skills/sw-overview/SKILL.md`.

Confirm the architecture first via `configuration.recognizer.kind` in `settings.mcs.yml`. This
review applies to **agentic-loop** agents. If it is a classic agent, say so and offer `/sw-analyze`
instead.

Check against `../../knowledge/copilot-studio/patterns/agentic-loop.md` and
`../../knowledge/copilot-studio/cli-authoring.md`, in particular:

- Components classified correctly — Instructions vs Knowledge vs Tools vs Skills
- No Skill/Knowledge pairs that duplicate each other's job
- File stems start with the publisher prefix and stay under 100 characters, or push fails
- No placeholder descriptions left behind (migrated `WorkflowTool` descriptions are placeholders)
- Every documented behavior actually reachable from the instructions

Save findings to `.sopra/workflow/analyze-project/`.
