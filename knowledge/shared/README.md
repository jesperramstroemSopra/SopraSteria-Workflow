# Shared Standards

Use this section for conventions that apply across Dataverse, solutions, flows, and Copilot Studio.

## Index

| Guide | Use it for |
|---|---|
| [`naming-conventions.md`](naming-conventions.md) | Shared naming rules across Power Platform components |
| [`environment-strategy.md`](environment-strategy.md) | Environment topology, promotion, and configuration |
| [`tools-and-setup.md`](tools-and-setup.md) | PAC and local authoring prerequisites |
| [`copilot-agent-operating-model.md`](copilot-agent-operating-model.md) | Commands/skills/agents split, lifecycle, safety, state, and confidentiality |
| [`execution-provider-routing.md`](execution-provider-routing.md) | Microsoft plugin, MCP, Power CAT, PAC, and fallback selection |
| [`operator-output-contract.md`](operator-output-contract.md) | Chat dashboard, evidence artifact, statuses, and proof requirements |
| [`upstream-skill-examples.md`](upstream-skill-examples.md) | External examples used for structural inspiration |

## Application

Shared standards do not change by environment; the assets that consume them do. Domain guides may
add stricter requirements but must not silently weaken these cross-cutting rules.

For agent-led delivery, load the operating model, provider routing, and output contract together.
The operating model defines who owns the work, provider routing defines how it is executed, and the
output contract defines what must be shown and persisted.
