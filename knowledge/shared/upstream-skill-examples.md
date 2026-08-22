# Upstream Skill Examples

This page collects external sources used to improve Sopra workflow and domain skills.

## microsoft/copilot-studio-plugin — primary

- URL: https://github.com/microsoft/copilot-studio-plugin
- Plugin: `mcs-assistant` (reviewed at v1.0.2); requires `pac` > 2.9.3
- Use case: The current source of truth for Copilot Studio agent authoring — the agentic-loop
  architecture, component classification, CLI/YAML project structure, and classic→agentic migration.
  Its four sub-agents (architect, describer, init, manage) are good models for how to scope a
  domain skill: one job, explicit inputs, explicit anti-patterns.
- Rule: Adapt to Sopra conventions; do not copy verbatim. Treat generated output as a draft.
- Derived Sopra docs: `copilot-studio/cli-authoring.md`,
  `copilot-studio/patterns/agentic-loop.md`,
  `copilot-studio/patterns/migration-classic-to-agentic.md`,
  `.agents/skills/review-agent-yaml/SKILL.md`

> ⚠️ `microsoft/skills-for-copilot-studio` is **superseded** by this repo. Do not use it as a source
> for new work, and remove the old plugin if it is still installed — it conflicts with `mcs-assistant`.

## Microsoft CAT Agent Skills Gallery

- URL: https://microsoft.github.io/cat-agent-skills/?tag=productivity
- Use case: Examples for workflow skill structure, wording, review style, and stage sequencing
- Rule: Adapt patterns to Sopra conventions; do not copy content verbatim

## microsoft/power-cat-skills

- URL: https://github.com/microsoft/power-cat-skills
- Use case: Productivity-oriented agent workflows and reusable patterns
- Rule: Adapt into Sopra workflow stages and artifact model

## How to use these sources

1. Review the example skill patterns.
2. Note any useful structure, tone, or output format ideas.
3. Translate them into Sopra-specific skills and docs.
4. Record any meaningful divergence in the relevant skill README or architecture doc, and update
   [`../UPSTREAM_REFS.md`](../UPSTREAM_REFS.md).

## What makes a good Sopra skill

Patterns worth borrowing from the sources above:

- **One job per skill.** Narrow skills outperform one comprehensive package.
- **State the inputs explicitly**, and stop if they are missing rather than guessing.
- **Include an anti-pattern / "do not do this" section.** The plugin's agents do this consistently and
  it is the highest-signal part of each file.
- **Name the authoritative doc** the skill reviews against instead of restating rules inline — that
  keeps the standard in one place.
- **Define the output artifact and its path**, so later stages can pick it up.
- **Add a skill only when the task genuinely needs a procedure.** For work the model already handles,
  a skill adds little and can interfere.
