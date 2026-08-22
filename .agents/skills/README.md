## Skills Reuse

This folder contains reusable **agent skills** for Sopra Power Platform work, in the
`<skill-name>/SKILL.md` layout that GitHub Copilot CLI and VS Code discover automatically.

### Available skills

| Skill | Purpose |
|-------|---------|
| `review-agent-yaml/` | Review a CLI-authored (agentic-loop) Copilot Studio agent against Sopra conventions and the component decision tree. |

> Workflow-stage skills (`analyze-project`, `create-plan`, `implement-plan`, …) live in
> [`../../.github/skills/`](../../.github/skills/README.md), not here. This folder holds
> domain skills for Copilot Studio agent authoring.

### How to Reuse Skills

1. Read the skill's `SKILL.md` before using it.
2. Copy the **skill folder** into the target project — skills are directories, not loose files:

   ```powershell
   New-Item -ItemType Directory -Force -Path ".agents\skills"
   Copy-Item -Recurse -Path "<repo-root>\.agents\skills\review-agent-yaml" -Destination ".agents\skills\"
   ```

3. Keep skill names aligned with the task they support.
4. Reuse the same skill instructions across teams to keep Copilot behavior consistent.

### Sopra Guidance

- Treat skills as shared accelerators, not project-specific logic.
- Prefer skills that encode platform conventions, validation, or repeatable setup.
- Update this README when adding a new reusable skill.
- Skills that review or author Copilot Studio YAML must cite
  [`../../copilot-studio/patterns/agentic-loop.md`](../../copilot-studio/patterns/agentic-loop.md)
  as their standard rather than restating the rules inline.

### Upstream References

See [`../../UPSTREAM_REFS.md`](../../UPSTREAM_REFS.md). Copilot Studio skill content derives from
`microsoft/copilot-studio-plugin` (entry 3).