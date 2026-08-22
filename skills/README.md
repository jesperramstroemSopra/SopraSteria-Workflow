## Skills Reuse

This folder contains reusable GitHub Copilot skills for Sopra Power Platform work.

### How to Reuse Skills

1. Read the skill README before using a skill.
2. Copy the relevant skill folder into the target project only when the skill is needed.
3. Keep skill names aligned with the task they support.
4. Reuse the same skill instructions across teams to keep Copilot behavior consistent.

### Sopra Guidance

- Treat skills as shared accelerators, not project-specific logic.
- Prefer skills that encode platform conventions, validation, or repeatable setup.
- Update the skill README when adding a new reusable skill pattern.

### Current Repo Skills

- `workflow-skills/` — restartable workflow stages for analyze, present, grill, plan, review, implement, and test.
- `analyze-project/` — analyze a project against Sopra architecture guides.
- `present-analysis/` — reformat analysis into a clean stakeholder-ready report.
- `grill-me/` — adversarial review that stress-tests work against Sopra standards.
- `create-plan/` — convert findings into a phased task plan with dependencies.
- `review-plan/` — gate check before implementation begins.
- `implement-plan/` — execute the plan, track progress, resume if interrupted.
- `test-solution/` — define test protocol, run checks, produce test report.
- `draw-architecture/` — generate a self-contained HTML architecture diagram for any scope (solution, flows, agents, tables, or a combination).

### Example sources for skill improvement

When tuning skills, compare them with examples from the Microsoft CAT agent skills gallery:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Use those examples as reference material for structure and phrasing, then adapt them to Sopra conventions.

See [`../../shared/upstream-skill-examples.md`](../../shared/upstream-skill-examples.md) for the full source list.

### Upstream References

<!-- See UPSTREAM_REFS.md for any mirrored upstream skill patterns. -->

