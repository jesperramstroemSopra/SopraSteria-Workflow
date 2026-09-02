# GitHub Copilot Agent Operating Model

This guide defines how Sopra-Workflow combines commands, skills, custom agents, knowledge, and
external execution providers in GitHub Copilot desktop/CLI. It is local-first and designed to remain
compatible with GitHub cloud agents where the same capabilities are available.

## 1. Component responsibilities

| Component | Responsibility | Must not become |
|---|---|---|
| Commands (`/sw-*`) | Explicit, deterministic operator entry points | Copies of stage logic |
| Skills | Repeatable stage procedures and artifact rules | Personas or environment credentials |
| Custom agents | Role boundaries, delegation, permissions, and operator coordination | Duplicated architecture guidance |
| Knowledge | Sopra's standing technical standard | Engagement-specific state |
| Playbooks | Client-scrubbed field lessons | Undated platform documentation |
| Microsoft plugins and MCP servers | Execution and live-platform capabilities | Assumed dependencies |
| `.sopra/workflow/` | Durable state, evidence, decisions, and handoffs in the client project | Toolkit source files |

Skills remain the procedural source of truth. Agents load and run skills; they do not restate their
complete procedures.

## 2. Agent team

| Agent | Owns | Boundaries |
|---|---|---|
| `sopra-delivery-lead` | Entry, stage detection, capability preflight, delegation, state, operator handoff | Does not mutate Power Platform environments |
| `sopra-solution-architect` | Design, analysis, review, architecture decisions, risk, plan critique | Environment access is read-only |
| `sopra-solution-builder` | Approved implementation through the correct provider | Must stop for confirmation before writes, push, publish, deployment, or destructive operations |
| `sopra-solution-verifier` | Test design, execution, evidence, regression, release verdict | Does not fix production implementation |
| `sopra-method-improver` | Learning candidates and toolkit improvement proposals | Never moves client identity into the toolkit |

Every agent presents its own handoff using
[`operator-output-contract.md`](operator-output-contract.md). The dedicated `sw-present` stage,
which reformats existing evidence for stakeholders, is owned by the Delivery Lead.

## 3. Agent-command compatibility gate

Every `/sw-*` command must apply this gate before running its stage skill. The selected custom agent
defines role and safety boundaries; invoking a command does not switch the active agent.

### Compatibility states

| State | Behavior |
|---|---|
| `Primary` | Run the command normally. |
| `Compatible` | Run normally within the active agent's existing boundaries. |
| `Delegate` | The Delivery Lead invokes the owning agent when model invocation is allowed; otherwise it gives an explicit selection handoff. It does not perform the specialist work itself. |
| `RoutingOnly` | Warn before doing work. The command may inspect state and recommend the owner, but must not run the routed stage. |
| `Blocked` | Show the mismatch and stop before loading or executing the stage skill. |

### Compatibility matrix

| Command | Delivery Lead | Solution Architect | Solution Builder | Solution Verifier | Method Improver | Owning agent |
|---|---|---|---|---|---|---|
| `sw-start` | Primary | RoutingOnly | RoutingOnly | RoutingOnly | RoutingOnly | Delivery Lead |
| `sw-status` | Compatible | Compatible | Compatible | Compatible | Compatible | Any |
| `sw-present` | Primary | Blocked | Blocked | Blocked | Blocked | Delivery Lead |
| `sw-design` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-analyze` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-draw` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-grill` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-plan` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-review` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-review-yaml` | Delegate | Primary | Blocked | Blocked | Blocked | Solution Architect |
| `sw-implement` | Delegate | Blocked | Primary | Blocked | Blocked | Solution Builder |
| `sw-test` | Delegate | Blocked | Blocked | Primary | Blocked | Solution Verifier |
| `sw-learn` | Delegate | Blocked | Blocked | Blocked | Primary | Method Improver |

`Delegate` is a designed combination, not a mismatch. The Delivery Lead must identify the owner in
its delegation or handoff and retain operator coordination.

### Required mismatch feedback

For `RoutingOnly` or `Blocked`, respond before stage work using this shape:

```text
Agent/command mismatch
Selected agent: <display name>
Requested command: /sopra-workflow:<command>
Recommended agent: <display name>
Mode: RoutingOnly | Blocked
Reason: <one sentence explaining the role boundary>
Next: copilot --agent sopra-workflow:<agent-id>
Then run: /sopra-workflow:<command>
```

In `RoutingOnly`, continue only far enough to inspect workflow state and identify the correct next
agent/command. In `Blocked`, do not load the stage skill, write its artifact, invoke an execution
provider, or mutate anything. A user must explicitly switch agents or invoke the recommended agent
in a new session; a slash command cannot switch the active custom agent.

Compatibility is not a protected-operation confirmation gate. User confirmation cannot turn
`RoutingOnly` into stage execution or override `Blocked`; the operator must use the owning agent.

If no Sopra custom-agent identity is active, say which agent is recommended, then continue in
command-only compatibility mode. This preserves use of the plugin commands with GitHub Copilot's
default agent while still making the preferred setup visible.

The active agent profile and command must both apply this gate. If instructions conflict, the more
restrictive state wins.

## 4. Standard lifecycle

1. **Orient** — load `sw-overview`, read `.sopra/workflow/_state.json`, and identify the project type.
2. **Classify** — identify stage, Copilot Studio architecture where relevant, risk, and required
   permissions.
3. **Preflight** — discover installed plugins, skills, agents, MCP tools, CLI prerequisites, and
   authentication state. Do not infer availability from documentation.
4. **Select provider** — follow
   [`execution-provider-routing.md`](execution-provider-routing.md).
5. **Execute or stop** — run read-only work autonomously; obtain confirmation before any protected
   operation.
6. **Verify** — capture evidence appropriate to the claim.
7. **Persist** — update the stage artifact and `.sopra/workflow/_state.json`.
8. **Present** — give the two-layer operator handoff.

## 5. Protected operations

The following always require explicit operator confirmation immediately before execution:

- modifying local project implementation files (one clearly scoped batch may be approved at a time);
- creating, updating, or deleting a Power Platform resource;
- writing live Dataverse data;
- pushing local agent or solution changes;
- publishing an agent, app, or flow;
- importing, exporting to a shared destination, deploying, or promoting a solution;
- changing connections, credentials, permissions, DLP, environment configuration, or ownership;
- destructive local or remote operations.

Approval for one operation does not approve later operations. A request to "build" is not implicit
approval to publish. State the target environment, resource, operation, and expected impact in the
confirmation request.

Read-only metadata discovery, local file inspection, static analysis, and report generation may run
without confirmation.

## 6. Truthful execution states

Every task ends in one of these states:

| State | Meaning |
|---|---|
| `Complete` | Requested work was executed and supported by evidence |
| `Partial` | Some work was executed; remaining scope is explicit |
| `Blocked` | A required capability, permission, decision, or validation is unavailable |

Never turn an execution request into advice and label it complete. Generated YAML, a command, or a
test protocol is not evidence that a live operation occurred.

## 7. Durable state contract

`.sopra/workflow/_state.json` should contain:

```json
{
  "project": "<project name>",
  "activeStage": "<stage skill>",
  "activeAgent": "<custom agent>",
  "status": "in_progress",
  "detectedTechnologies": [],
  "copilotStudioArchitecture": null,
  "executionProvider": {
    "name": null,
    "kind": null,
    "capability": "unknown"
  },
  "latestArtifact": null,
  "pendingConfirmations": [],
  "blockers": [],
  "openQuestions": [],
  "nextAction": null,
  "updatedAt": "<ISO-8601>"
}
```

Allowed status values are `not_started`, `in_progress`, `blocked`, `complete`, and `partial`.
Record only non-secret identifiers needed to resume work. Never store tokens, credentials, or copied
customer data in state.

## 8. Confidentiality boundary

Client artifacts stay in the client project. Toolkit improvements stay in the toolkit repository.
When delivery work produces a reusable lesson:

1. save a learning candidate under `.sopra/workflow/capture-learning/`;
2. strip client identity and business-revealing details;
3. review confidence and freshness;
4. promote it into toolkit `playbooks/` only while working in the toolkit repository.

## 9. Local and cloud compatibility

For local desktop/CLI, plugins and MCP servers are installed in the operator's Copilot environment.
For GitHub cloud agents, MCP servers are configured in repository/organization settings or agent
profiles. Keep configuration external and secret-free.

Cloud support has additional constraints:

- repository MCP configurations should allowlist only required tools;
- Copilot cloud agent currently supports MCP tools, not MCP resources or prompts;
- remote MCP servers using OAuth may not be supported;
- agent profiles must never contain customer secrets or fixed environment identifiers.

When local and cloud capabilities differ, report the difference and use `Blocked` rather than
silently changing the requested execution mode.
