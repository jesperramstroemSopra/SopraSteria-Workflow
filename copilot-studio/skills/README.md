## Copilot Studio Skills

Two different things are called "skills" in this repo. Keep them straight.

| Meaning | Where | What it is |
|---|---|---|
| **Copilot Studio agent skill** | `behaviors/*.mcs.yml` in an agent project | A component of an agentic-loop agent — a reusable multi-step procedure the agent itself executes (`kind: InlineAgentSkill`) |
| **Developer tooling skill** | [`../../.agents/skills/`](../../.agents/skills/README.md), [`../../.github/skills/`](../../.github/skills/README.md) | A `SKILL.md` that teaches GitHub Copilot how to help *you* build agents |

### Agent skills (components of an agent)

Authored as YAML under `behaviors/`. When to use a skill instead of a tool, instruction, or knowledge
source is governed by the decision tree in
[`../patterns/agentic-loop.md`](../patterns/agentic-loop.md#4-the-decision-tree).

Short version:

```text
TOOL   → check_order_status(order_id)          (a typed function)
SKILL  → handle refund request                 (a multi-step procedure)
INSTRUCTION → applies to every conversation
KNOWLEDGE   → something to search and cite
```

YAML shape and file naming: [`../cli-authoring.md`](../cli-authoring.md#skill).

Effectiveness rules that matter in practice:

- Prefer **a few focused skills** over one comprehensive package.
- Add a skill **only when the task genuinely needs a procedure** — for work the model already handles,
  a skill adds little and can interfere with selection.
- Do not pair a skill with a knowledge source that mirrors it. Split by role instead:
  `Knowledge: "insurance policy knowledge"` + `Skill: "explain-insurance-coverage"`.

### Developer tooling skills

- [`review-agent-yaml`](../../.agents/skills/review-agent-yaml/SKILL.md) — review a CLI-authored agent
  against Sopra conventions before push.
- Workflow-stage skills (analyze, plan, implement, test) live in
  [`../../.github/skills/`](../../.github/skills/README.md).

Copy the skill **folder** into your project:

```powershell
New-Item -ItemType Directory -Force -Path ".agents\skills"
Copy-Item -Recurse -Path "<repo-root>\.agents\skills\review-agent-yaml" -Destination ".agents\skills\"
```

### Managed vs Unmanaged Posture

Developer tooling skills support authoring and are never deployed. **Agent** skills are components of
the agent and ship with it — they follow the same managed-solution promotion rules as every other
artifact. See [`../../solutions/patterns/managed-vs-unmanaged.md`](../../solutions/patterns/managed-vs-unmanaged.md).

### Related

- [`../patterns/agentic-loop.md`](../patterns/agentic-loop.md) — component decision tree
- [`../cli-authoring.md`](../cli-authoring.md) — skill YAML and file naming
- [`../../shared/upstream-skill-examples.md`](../../shared/upstream-skill-examples.md) — what makes a good skill
