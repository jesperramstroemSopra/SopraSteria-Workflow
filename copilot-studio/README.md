## Copilot Studio — Knowledge Base Section

This section contains architecture guidance, design patterns, and reusable skills for building Microsoft Copilot Studio agents on the Sopra Power Platform.

---

## What's Here

> **Copilot Studio has two architectures.** Know which one you are working in before reading anything
> else — the guidance is not interchangeable.
>
> - **Agentic loop (modern)** — instructions, knowledge, tools, skills. No topics, no Power Fx, no
>   variables. **Sopra default for new agents.**
> - **Classic** — topic-based, trigger-phrase routing. Still valid for existing agents and for flows
>   that must be deterministic.

| Path | Contents | Architecture |
|------|----------|--------------|
| [`patterns/agentic-loop.md`](patterns/agentic-loop.md) | **Start here for new agents.** The modern component model and decision tree | Modern |
| [`cli-authoring.md`](cli-authoring.md) | `pac copilot` workflow, project layout, component YAML, connection references, testing | Modern |
| [`patterns/migration-classic-to-agentic.md`](patterns/migration-classic-to-agentic.md) | Converting a classic agent to the agentic loop | Both |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Classic architecture — topics, orchestration, knowledge, auth, anti-patterns | Classic |
| [`patterns/topic-design.md`](patterns/topic-design.md) | Trigger phrases, slot-filling, chaining, adaptive cards | Classic |
| [`patterns/generative-answers.md`](patterns/generative-answers.md) | Generative answers with knowledge sources | Classic |
| [`patterns/multi-agent.md`](patterns/multi-agent.md) | Orchestrator + specialist agents, context passing | Both |
| [`patterns/testing-strategy.md`](patterns/testing-strategy.md) | Evaluation, conversation flow testing, CI/CD integration | Both |
| [`skills/README.md`](skills/README.md) | How Copilot Studio skills are used in this section | — |

---

## When to Use These Patterns

- **Starting a new agent** → [`patterns/agentic-loop.md`](patterns/agentic-loop.md), then
  [`cli-authoring.md`](cli-authoring.md).
- **Authoring YAML in source control** → [`cli-authoring.md`](cli-authoring.md).
- **Modernising an existing agent** → [`patterns/migration-classic-to-agentic.md`](patterns/migration-classic-to-agentic.md).
- **Maintaining a classic agent** → [`ARCHITECTURE.md`](ARCHITECTURE.md) and
  [`patterns/topic-design.md`](patterns/topic-design.md).
- **Evaluating generative AI (classic)** → [`patterns/generative-answers.md`](patterns/generative-answers.md).
- **Building a multi-agent solution** → [`patterns/multi-agent.md`](patterns/multi-agent.md).
- **Setting up testing** → [`patterns/testing-strategy.md`](patterns/testing-strategy.md).

---

## Sopra Agent Conventions at a Glance

**Both architectures**

- **Solution prefix**: all agents live in a Dataverse solution with prefix `spr_`
- **Publisher prefix** (CLI authoring): `spr` — never leave the tooling default `catmgr`
- **Promotion**: DEV → TEST → UAT → PROD, managed solutions downstream
- **Connections**: named service accounts, never a developer's personal connection
- **Testing**: at least one evaluation suite before UAT

**Modern (agentic loop)**

- **Agent name**: PascalCase — `HrSelfServiceAgent`
- **Components** (skills, tools, knowledge): slugified lowercase-hyphenated — `submit-leave-request`
- **File stems**: must start with `spr` and be ≤ 100 characters, or push fails
- **Instructions must be explicit** — scope, safety, and escalation rules are not enforced structurally

**Classic**

- **Topic name**: PascalCase verb+noun — `CheckLeaveBalance`
- **Topic variable**: `Topic.PascalCase` — `Topic.EmployeeId`
- **Global variable**: `Global.PascalCase` — `Global.AuthenticatedUser`
- **Environment variable**: `spr_camelCase` — `spr_dataverseBaseUrl`
- **Mandatory system topics**: customized `Greeting`, `Fallback`, `End of Conversation`, `Escalate`

Full reference: [`../shared/naming-conventions.md`](../shared/naming-conventions.md) and
[`ARCHITECTURE.md` §9](ARCHITECTURE.md#9-sopra-conventions).

---

## Tooling

Install the Power Platform CLI (**`pac` > 2.9.3**) and the `mcs-assistant` plugin before authoring —
see [`../shared/tools-and-setup.md`](../shared/tools-and-setup.md).

Reusable review skill: [`../.agents/skills/review-agent-yaml/`](../.agents/skills/review-agent-yaml/SKILL.md).

---

## Related Sections

- [`../solutions/ARCHITECTURE.md`](../solutions/ARCHITECTURE.md) — ALM and solution strategy for deploying agents
- [`../shared/naming-conventions.md`](../shared/naming-conventions.md) — Full naming reference
- [`../shared/tools-and-setup.md`](../shared/tools-and-setup.md) — `pac` CLI and plugin setup
- [`../.agents/skills/README.md`](../.agents/skills/README.md) — Reusable agent skills
- [`../UPSTREAM_REFS.md`](../UPSTREAM_REFS.md) — upstream sources, including the Copilot Studio plugin
