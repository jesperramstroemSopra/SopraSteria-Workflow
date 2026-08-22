## Copilot Studio — Knowledge Base Section

This section contains architecture guidance, design patterns, and reusable skills for building Microsoft Copilot Studio agents on the Sopra Power Platform.

---

## What's Here

| Path | Contents |
|------|----------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Comprehensive architecture guide — agent design, topic patterns, orchestration, knowledge sources, auth, anti-patterns |
| [`patterns/topic-design.md`](patterns/topic-design.md) | How to design topics: trigger phrases, slot-filling, chaining, adaptive cards |
| [`patterns/generative-answers.md`](patterns/generative-answers.md) | When and how to use generative answers with knowledge sources |
| [`patterns/multi-agent.md`](patterns/multi-agent.md) | Orchestrator + specialist agent patterns, child agent calls, context passing |
| [`patterns/testing-strategy.md`](patterns/testing-strategy.md) | PPAPI evaluation, conversation flow testing, CI/CD test integration |
| [`skills/README.md`](skills/README.md) | How Copilot Studio skills from `.agents/skills/` are used in this section |

---

## When to Use These Patterns

- **Starting a new agent project** → Read `ARCHITECTURE.md` first to make the right design decisions before authoring any YAML.
- **Designing a new topic** → Follow `patterns/topic-design.md` for trigger phrase strategy and topic size guidance.
- **Evaluating generative AI** → `patterns/generative-answers.md` has a decision tree for when to use generative vs authored.
- **Building a multi-agent solution** → `patterns/multi-agent.md` for the orchestrator + specialist model.
- **Setting up testing** → `patterns/testing-strategy.md` for evaluation frameworks and CI/CD hooks.

---

## Sopra Agent Conventions at a Glance

- **Naming**: Agents use PascalCase (e.g., `HrFaqAgent`); topics use PascalCase (e.g., `CheckLeaveBalance`); variables use camelCase (e.g., `employeeId`)
- **Solution prefix**: All Copilot Studio agents are inside a solution with prefix `spr_`
- **Mandatory system topics**: Every agent must have a customized `Fallback` topic and a `Greeting` topic
- **Testing**: Every agent must have at least one PPAPI evaluation test suite before going to UAT
- **GitHub Copilot skills**: Install skills from `C:\Sopra-Workflow\.agents\skills\` into your project before authoring

---

## Related Sections

- [`../solutions/ARCHITECTURE.md`](../solutions/ARCHITECTURE.md) — ALM and solution strategy for deploying agents
- [`../shared/naming-conventions.md`](../shared/naming-conventions.md) — Full naming reference
- [`../.agents/skills/README.md`](../.agents/skills/README.md) — How to install Copilot skills to accelerate authoring
