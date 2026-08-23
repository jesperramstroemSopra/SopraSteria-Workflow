---
name: design-solution
description: "Design a new Power Platform solution or capability from scratch. Runs a requirements interview, proposes multiple architecture options with explicit trade-offs, recommends one, and records the decision. Use for greenfield work, new capabilities on an existing solution, or when the user asks how something should be built, which service to use, or whether to use Copilot Studio, Power Automate, Agent Flows or Dataverse."
argument-hint: "<what you want to build>"
user-invocable: true
---

# Design Solution

You are the **greenfield** stage. There is nothing to analyze yet — the user has an ambition and
needs it turned into a defensible architecture. Your output is a decision record that a reviewer
could disagree with, not a brochure.

Read `../../skills/sw-overview/SKILL.md` first for conventions.

## Step 1 — Interview before designing

Never design from a one-line prompt. Ask, in batches, and stop asking once you have enough:

**Problem**
- What is the actual business outcome? Who is the user, and what do they do today instead?
- How many users, how many transactions per day, and what is the peak?
- What does failure cost — is this convenience or is it revenue/compliance critical?

**Data**
- Where does the data live now — Dataverse, SharePoint, SQL, an external API, all of these?
- Who owns it? Is it in scope to change it?
- Any personal or regulated data? Residency constraints?

**Constraints**
- What licences exist today? (This kills more designs than anything else.)
- Which environments exist, and who can deploy to them?
- Is there an existing solution and publisher, or is this net new?
- Deadline, and what is genuinely fixed versus aspirational.

**Integration & identity**
- Which systems must it talk to, and do connectors already exist?
- Which identity is the action performed as — the user, or a service principal?

If the user does not know an answer, record it as an **open question** in the artifact rather than
inventing a value. Open questions are a legitimate deliverable at this stage.

## Step 2 — Read the knowledge base

Load the relevant guides before forming an opinion. At minimum:

- `../../knowledge/shared/naming-conventions.md`, `../../knowledge/shared/environment-strategy.md`
- `../../knowledge/solutions/ARCHITECTURE.md` — every design lands in a solution eventually
- Whichever domains are in play:
  - `../../knowledge/copilot-studio/patterns/agentic-loop.md` (modern agents — the default for new work)
  - `../../knowledge/copilot-studio/ARCHITECTURE.md` (classic — when a constraint forces it; also load
    the full `patterns/` subfolder: topic-design, channel-aware-behavior, teams-production-hardening,
    rai-error-handling, dynamic-topic-redirect, orchestrator-variables)
  - `../../knowledge/power-automate/ARCHITECTURE.md`
  - `../../knowledge/agent-flows/ARCHITECTURE.md`
  - `../../knowledge/dataverse/ARCHITECTURE.md`
  - `../../knowledge/power-apps/ARCHITECTURE.md` — when UI requirements are in scope
  - `../../knowledge/power-apps/patterns/pcf-decision.md` — when a custom control may be needed
  - `../../knowledge/custom-connectors/ARCHITECTURE.md` — when external API integration is in scope
  - `../../knowledge/governance/ARCHITECTURE.md` — when environment setup, DLP, or CoE is in scope
- `../../playbooks/` — field-learned constraints that are not in any Microsoft document

## Step 3 — Choose the service, deliberately

The most consequential decision, and the one most often made by habit. Justify it explicitly.

| If the requirement is… | Lead with |
|---|---|
| Conversational, ambiguous phrasing, needs reasoning over documents | Copilot Studio agent (agentic loop — Sopra default) |
| Conversational, but environment/constraints force classic (see below) | Copilot Studio agent (classic — explicit justification required) |
| A deterministic multi-step process triggered by an event | Power Automate cloud flow |
| A deterministic process the **agent** invokes as a tool | Agent Flow |
| Relational data, security roles, auditing, business rules | Dataverse |
| Custom UI with full layout control, mobile-first, multi-connector | Canvas App |
| Standard forms/views over Dataverse, role-based access, no custom UI | Model-Driven App (MDA) |
| Calling an external API from multiple flows/apps, or complex auth | Custom Connector |
| A customer-facing knowledge-backed agent with classic topics/variables | Copilot Studio classic |
| Environment health, DLP, maker governance, tenant inventory | Governance (DLP + CoE Kit) |
| Packaging, versioning and promotion of any of the above | Solution + ALM pipeline |
| Heavy transformation, or logic that will outlive the platform | Code — plugin, Azure Function, or an API |

**When classic is the right Copilot Studio choice** (justify explicitly in the design document):

- The customer's environment does not yet support the agentic loop — verify with the customer's
  Power Platform admin before assuming; check tenant feature flags.
- The solution requires Power Fx, topic variables, or global variables that cannot be eliminated.
- A hard integration requirement depends on a connector action that has no equivalent tool form.
- The customer has explicitly rejected migration and needs the existing classic agent maintained.
- A regulatory or compliance constraint prevents the architecture change.

When classic is chosen: load `../../knowledge/copilot-studio/ARCHITECTURE.md` and the full
`../../knowledge/copilot-studio/patterns/` folder — several patterns there (topic design,
Teams hardening, RAI error handling, channel-aware behavior) apply specifically to classic.

Warning signs you picked wrong:

- An agent used purely to run a fixed sequence — that is a flow with extra latency and cost.
- A flow doing free-text interpretation with a chain of conditions — that wants an agent.
- Dataverse used as a log sink at high volume — check licensing and consider alternatives.
- A tool built for something Knowledge already answers — see the decision tree in `agentic-loop.md`.
- Classic chosen because "it's what the team knows" without checking whether the environment supports
  agentic loop — this produces an agent that cannot migrate later without significant rework.

## Step 4 — Produce two or three options, not one

For each option, state honestly:

- **Shape** — which services, how they connect, where data lives
- **Why it fits** — tied to a specific requirement from Step 1
- **Cost** — licensing implications and rough build effort
- **Risk** — what breaks it, and how likely that is
- **ALM** — how it gets promoted between environments
- **Exit** — what it costs to change course later

A "do the simplest possible thing" option should almost always be one of them. Then **recommend
one** and say why the others lost. A design document with no rejected options is not a design
document.

## Step 5 — Specify the recommended option

Enough detail that `create-plan` can break it into tasks:

- Solution and publisher naming, per `naming-conventions.md` (ask if the prefix is not established)
- Environment topology and how config differs per environment
- Data model sketch — tables, key relationships, ownership
- For agents: the Instructions / Knowledge / Tools / Skills breakdown
- For flows: trigger, main path, and the error path — the error path is not optional
- Connection references and environment variables — never hardcoded values
- Security: who can do what, and which identity runs each action
- How it will be tested and monitored

## Step 6 — Draw it

Offer `/sw-draw` to generate the diagram from the design. Mark anything inferred as inferred.

## Output artifact

Save to `.sopra/workflow/design-solution/design-<YYYY-MM-DD-HHmm>.md` containing:

- Problem statement and the requirements gathered
- **Open questions** — explicitly, with who needs to answer each
- Options considered, with trade-offs
- Recommended option and the reasoning
- Specification of the recommended option
- Risks and assumptions
- Which knowledge-base sections informed the design

Update `.sopra/workflow/_state.json`.

## Rules

- Ask first. A design produced from a one-line prompt is a guess wearing a suit.
- Never invent environment URLs, prefixes, tenant IDs or licence entitlements. Ask.
- Cite the guide behind each recommendation so a reviewer can check you.
- Record what you rejected. That is the most useful part six months later.
- If the user already has something built, this is the wrong skill — use `analyze-project`.
- Finish by offering `/sw-grill` to attack the design before anyone commits to it.
