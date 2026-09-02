---
name: sw-overview
description: "Orientation and router for the Sopra Power Platform workflow toolkit. Load this first when starting work on a Power Platform project — it identifies the delivery stage, points to the right stage skill, and establishes the shared conventions for knowledge lookup and artifact storage. Use when the user mentions Power Platform, Copilot Studio, Power Automate, Agent Flows, Dataverse, solutions, or asks where to start."
argument-hint: "<what you are working on>"
user-invocable: true
---

# Sopra Workflow — Overview & Router

This is the entry point for the Sopra Steria Power Platform delivery toolkit. Read this before
using any other `sopra-workflow` skill. It tells you **where the project is**, **which skill to
run**, and **where things live**.

## 1. Critical context: two different repos

You are almost always working in **the client project**, not in the toolkit.

| | What it is | Where it is |
|---|---|---|
| **The project** | The client's solution, flows, agents, tables. The open workspace. | Current working directory |
| **The toolkit** | This plugin — skills + Sopra knowledge base. Read-only. | The installed plugin folder |

**Never write toolkit files into the client project. Never write client artifacts into the toolkit.**
Client work is confidential per engagement and must not travel between customers.

## 2. Where knowledge lives

Sopra architecture knowledge ships **inside this plugin** at `../../knowledge/` — relative to any
skill file (`skills/<skill>/SKILL.md` → `../../knowledge/`). It is available regardless of which
project is open.

```text
../../knowledge/
  copilot-studio/     ARCHITECTURE.md (classic), cli-authoring.md, patterns/ (11 patterns)
  power-automate/     ARCHITECTURE.md, patterns/ (approval-flows, child-flows, dataverse-operations,
                      error-handling, flow-review-checklist, http-connector, monitoring, scheduled-flows)
  agent-flows/        ARCHITECTURE.md, patterns/ (input-output-contract, async-pattern, testing-agent-flows)
  dataverse/          ARCHITECTURE.md, patterns/ (auditing, plugin-patterns, query-shapes, security-model,
                      solution-layering, table-design, virtual-tables, web-api-queries)
  solutions/          ARCHITECTURE.md, patterns/ (alm-pipeline, connection-references, environment-strategy,
                      managed-vs-unmanaged, publisher-conventions, release-readiness)
  power-apps/         ARCHITECTURE.md, patterns/ (component-library, delegation, pcf-decision, performance, screen-design)
  custom-connectors/  ARCHITECTURE.md, patterns/ (auth-patterns, pagination, policy-templates)
  governance/         ARCHITECTURE.md, patterns/ (coe-kit-patterns, dlp-policies, environment-provisioning)
  shared/             naming-conventions.md, environment-strategy.md, tools-and-setup.md
                      copilot-agent-operating-model.md, execution-provider-routing.md,
                      operator-output-contract.md
../../playbooks/      Field-learned solutions that are NOT in Microsoft docs
```

Always read the relevant guide **before** giving an opinion. The knowledge base is the standard;
your own priors are not.

## 3. Where artifacts go

Every stage writes to the **client project** under `.sopra/workflow/`:

```text
.sopra/
  workflow/
    _state.json                     Current stage, subject, open questions
    design-solution/
    analyze-project/
    present-analysis/
    grill-me/
    create-plan/
    review-plan/
    implement-plan/
    test-solution/
    capture-learning/
```

Files are named `<name>-<YYYY-MM-DD-HHmm>.md`. Never overwrite a previous artifact — append a new
one so the history of decisions survives.

Add `.sopra/` to the project's `.gitignore` **only if** the client does not want it committed.
Committing it is usually better: it makes the work resumable by anyone on the team.

## 4. Identify the stage, then route

Ask the user where they are if it is not obvious from the workspace. Then route:

| Situation | Skill | Owning agent |
|---|---|---|
| Nothing built yet — greenfield, need architecture and ideas | `design-solution` | Sopra Solution Architect |
| Something exists — need to understand and evaluate it | `analyze-project` | Sopra Solution Architect |
| Have findings — need them readable for stakeholders | `present-analysis` | Sopra Delivery Lead |
| Have a design or plan — want it stress-tested | `grill-me` | Sopra Solution Architect |
| Know what's wrong — need a work breakdown | `create-plan` | Sopra Solution Architect |
| Have a plan — want it gate-checked before building | `review-plan` | Sopra Solution Architect |
| Plan approved — build it | `implement-plan` | Sopra Solution Builder |
| Built — verify it | `test-solution` | Sopra Solution Verifier |
| Need a visual of any scope | `draw-architecture` | Sopra Solution Architect |
| Reviewing Copilot Studio agent YAML specifically | `review-agent-yaml` | Sopra Solution Architect; current Describer supplies inventory |
| Learned something the docs don't tell you | `capture-learning` | Sopra Method Improver |

Stages are **not** a mandatory pipeline. Start anywhere. A mature project may only ever need
`analyze-project` → `grill-me` → `implement-plan`.

When a Sopra custom agent is active, apply the agent-command compatibility gate in
`../../knowledge/shared/copilot-agent-operating-model.md` before running a stage. A command does not
switch the active agent. Warn on routing-only combinations and block role conflicts rather than
silently running specialist work under the wrong profile.

### Resuming

If `.sopra/workflow/_state.json` exists, read it first and tell the user what was in progress
before starting anything new. That file is what makes work resumable across machines and people.

## 5. Identify the technology before evaluating

Getting this wrong produces confident nonsense.

**Copilot Studio has two incompatible architectures:**

| Signal | Architecture |
|---|---|
| `topics/` + `actions/` folders | Classic |
| `behaviors/` + `capabilities/` folders | Agentic loop (modern) |
| `configuration.recognizer.kind: CLICopilotRecognizer` or `CLIAgentRecognizer` in `settings.mcs.yml` | Agentic loop (authoritative) |

Classic uses topics, trigger phrases and Power Fx. Agentic loop has **none of those** — it uses
Instructions, Knowledge, Tools and Skills.

### Copilot Studio — which track applies?

**New agent (greenfield)?** Default to the agentic loop. Only use classic when a hard constraint
forces it — see `../../knowledge/copilot-studio/ARCHITECTURE.md §1` and the list below.

**Existing customer agent?** Identify the architecture first using the signals above. Then use the
correct track. Do not mix guidance.

**When classic is required for a customer solution:**

- The customer's Copilot Studio environment does not yet support the agentic loop (check tenant
  feature flags before assuming)
- The solution uses Power Fx, topic variables, or global variables that cannot be eliminated
- A hard integration requirement depends on classic actions (e.g., a specific connector action that
  has no equivalent tool form)
- The customer explicitly rejects migration and needs the current classic agent maintained and extended
- A regulatory or compliance reason prevents the architecture change

In these cases: treat classic as a **first-class track**, not a legacy curiosity. Load
`../../knowledge/copilot-studio/ARCHITECTURE.md` and all files under
`../../knowledge/copilot-studio/patterns/` — several patterns there apply specifically to classic
(topic design, slot-filling, channel-aware behavior, Teams hardening, RAI error handling).

**Classic tracks in the knowledge base:**

| Pattern | When relevant |
|---|---|
| `ARCHITECTURE.md` | Topic structure, system topics, variable management, auth patterns |
| `patterns/topic-design.md` | Trigger phrases, slot-filling, chaining, Adaptive Cards |
| `patterns/generative-answers.md` | Generative answers + knowledge sources in classic |
| `patterns/multi-agent.md` | Orchestrator/specialist pattern in classic |
| `patterns/channel-aware-behavior.md` | Gating behavior per Teams / M365 Copilot / web chat surface |
| `patterns/teams-production-hardening.md` | 8-pattern framework for Teams-deployed classic agents |
| `patterns/rai-error-handling.md` | Azure OpenAI content-filter error handling in `OnError` |
| `patterns/dynamic-topic-redirect.md` | Switch-based routing replacing nested condition chains |
| `patterns/orchestrator-variables.md` | AI-filled variables at topic selection time |
| `patterns/testing-strategy.md` | Test strategy for classic agents |

See `../../knowledge/copilot-studio/patterns/agentic-loop.md` for the modern architecture.

**Power Automate vs Agent Flows:** Agent Flows are Copilot Studio-hosted and invoked by an agent as
a tool; classic cloud flows are trigger-driven. They have different limits and licensing. See
`../../knowledge/agent-flows/ARCHITECTURE.md`.

For live Power Automate work, prefer Microsoft's `power-automate@power-platform-skills` plugin. It
uses the FlowAgent MCP server. If the skills are visible but `flowagent-*` tools are not, run that
plugin's `setup` skill.

**Power Apps (Canvas vs Model-Driven):** Canvas Apps require custom UI; Model-Driven Apps are
metadata-driven and Dataverse-only. Default to MDA when the data source is Dataverse and the UI
is standard forms/views. See `../../knowledge/power-apps/ARCHITECTURE.md`.

**Custom Connectors:** Use when multiple flows/apps call the same external API, or when OAuth 2.0
/ complex auth is required. Direct HTTP action is acceptable for single-use, simple calls. See
`../../knowledge/custom-connectors/ARCHITECTURE.md`.

**Governance:** Always establish environment ring, DLP, and service accounts at project start —
not after go-live. Recommend CoE Kit for tenants with >20 active makers. See
`../../knowledge/governance/ARCHITECTURE.md`.

## 6. Agent-led execution

When custom agents are available, start broad requests with **Sopra Delivery Lead**. It delegates to
the architect, builder, verifier, or method improver while the stage skills remain the source of
procedure.

Before promising live execution, follow
`../../knowledge/shared/execution-provider-routing.md`. Record the selected provider and whether it
is ready, needs setup, or is unavailable. Missing execution capability must produce `Blocked`, not
an advisory answer labeled complete.

Require explicit confirmation before local implementation-file edits and before every live write,
pull that merges files, push, publish, deployment, import, permission/connection change, or
destructive action.

Every stage follows `../../knowledge/shared/operator-output-contract.md`: a concise operator
dashboard in chat plus a detailed evidence artifact on disk.

## 7. Working rules

1. **Ask before assuming.** Every stage skill must ask clarifying questions when scope, project
   type, or intent is ambiguous. Do not guess at the shape of a client's environment.
2. **Read the guide, cite the guide.** Reference the specific file and section that supports each
   recommendation, so a reviewer can check you.
3. **Write artifacts as you go**, not at the end. If the session dies, the work must survive.
4. **Separate observation from opinion.** Say what the code does, then say what you'd change.
5. **Never invent environment details** — URLs, publisher prefixes, connection references,
   environment IDs. Ask, or read them from the project.
6. **Prefer `pac` CLI and existing tooling** over hand-editing generated files. Never hand-edit
   `.mcs/` metadata; never run `pac copilot pack`.
7. **When you learn something the docs don't cover, run `capture-learning`.** That is how this
   toolkit gets better. It is the whole point.
8. **Use external providers deliberately.** Microsoft plugins and MCP servers are execution
   providers, not assumed dependencies. Preflight, delegate, and record evidence.
