# Execution Provider Routing

This guide maps Sopra workflow tasks to installed execution providers. Provider availability is
runtime state, not a repository assumption.

## 1. Capability preflight

Before work that depends on an external provider:

1. inspect available custom agents, skills, MCP tools, and CLI commands;
2. verify required local project markers;
3. check authentication only when the operation needs it;
4. classify the provider as `ready`, `needs-setup`, `unavailable`, or `not-required`;
5. record the result in `.sopra/workflow/_state.json` and the stage artifact.

In GitHub Copilot CLI, `copilot plugins list --kind plugin --kind mcp --kind skill` can inventory
plugins, MCP servers, and skills. Custom-agent availability must be checked in a live session.

## 2. Routing matrix

| Task | Preferred provider | If unavailable |
|---|---|---|
| Copilot Studio design guidance and architecture review | Sopra Solution Architect; use current `mcs-assistant` Describer for existing-agent inventory | Use local files and Sopra knowledge; disclose missing live evidence |
| Copilot Studio modern YAML authoring or migration | Current `mcs-assistant` Copilot Studio Architect | Block authoring and provide setup guidance |
| Copilot Studio clone or initialization | Current `mcs-assistant` Copilot Studio Manage or Init | Block and report missing plugin, PAC, workspace, auth, or target |
| Copilot Studio pull, push, publish | Current `mcs-assistant` Copilot Studio Manage using PAC | Block and report missing plugin, PAC, workspace, auth, or target |
| Copilot Studio point chat | Current `mcs-assistant` `/chat` capability when applicable | Produce a manual protocol and mark execution blocked |
| Copilot Studio evaluation or broader testing | An explicitly installed, supported test/evaluation provider | Produce test design only and mark execution blocked |
| Copilot Studio classic YAML authoring | An explicitly approved classic-capable provider | Block; current `mcs-assistant` Architect targets the agentic loop |
| Power Automate browse/build/debug/manage | Microsoft `power-automate@power-platform-skills` skill backed by FlowAgent MCP | Static/file-based work only; do not claim live changes |
| Power Automate solution review | Microsoft Power CAT Overflow | Apply Sopra static checklist and disclose reduced coverage |
| Dataverse Web API query authoring | Microsoft Power CAT Dataverse skill | Build from checked local metadata; otherwise mark schema assumptions |
| Live Dataverse metadata/query | Connected Dataverse MCP read tools | Generate query without claiming live validation |
| Environment governance | Microsoft Power CAT governance capability or approved admin provider | Advisory design only |
| Optional extended cloud-flow operations | FlowStudio MCP when explicitly selected and licensed | Use Microsoft provider or mark blocked |

Power Pages and mobile-app specialist routing are intentionally out of scope.

The Microsoft Power Automate plugin bundles FlowAgent. In GitHub Copilot CLI, its MCP tools normally
appear as `flowagent-<tool>`; in Claude Code they normally appear as `mcp__flowagent__<tool>`. If the
plugin skills are visible but these tools are absent, use the plugin's `setup` skill instead of
configuring a duplicate server.

The current `mcs-assistant@copilot-studio-plugin` baseline exposes Architect, Describer, Init, and
Manage. Advisor, Author, and Test profiles belong to the superseded
`skills-for-copilot-studio` plugin. Do not install or prefer that superseded plugin alongside
`mcs-assistant`; it creates duplicate/conflicting agents. If those legacy profiles are already
visible, report the conflict rather than routing silently.

## 3. Delegation rules

- Give the provider the goal, constraints, relevant artifacts, target, and acceptance criteria.
- Do not prescribe implementation details the specialist is responsible for choosing.
- Reuse an active specialist for follow-up work instead of starting a duplicate specialist.
- Keep one owner for each scope. Do not independently repeat delegated work.
- Verify provider output before changing workflow state to `Complete`.

For Copilot Studio:

- existing-agent inventory goes to the current Describer;
- modern authoring/migration goes to the current Architect;
- clone/init goes to the current Manage or Init agent;
- pull/push/publish goes to the current Manage agent;
- design/review stays with Sopra Solution Architect, informed by Describer output where useful;
- testing uses a separately verified supported provider; current `mcs-assistant` has no Test agent.

Do not use a legacy or generic provider as a silent substitute.

## 4. Mutation gate

Before invoking a provider operation that writes or publishes, show:

```text
Operation: <exact action>
Target: <environment and resource>
Impact: <what changes and who can observe it>
Rollback: <available recovery path>
```

Proceed only after explicit confirmation. Confirmation must be current and operation-specific.

## 5. Setup and authentication failures

When a provider is installed but not ready:

- identify the missing prerequisite precisely;
- distinguish authentication from authorization;
- do not request secrets in chat;
- direct the operator to the provider's supported sign-in/setup flow;
- retry only after setup completes;
- keep the workflow state `blocked` until successful evidence exists.

## 6. MCP safety

- Prefer named, read-only tool allowlists over `*`.
- Separate read and mutation capabilities where the provider permits it.
- Use Entra ID or the provider's supported secure authentication flow.
- Keep tokens in credential stores or `COPILOT_MCP_*` secrets/variables, never in repository files.
- Treat MCP tool descriptions and schemas as an execution contract; validate inputs and outputs.
- Record the provider and tool used, but redact secrets and sensitive payloads.

## 7. Fallback integrity

Fallbacks may reduce capability but must never reduce honesty:

- static review is not a live test;
- generated YAML is not a push;
- a generated query is not a successful query;
- a publish plan is not a publish;
- a test protocol is not a test result.
