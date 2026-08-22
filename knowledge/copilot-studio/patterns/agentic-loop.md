# Agentic-Loop Architecture

<!-- Upstream: microsoft/copilot-studio-plugin — agents/copilot-studio-architect.md (accessed 2026-08-22).
     Adapted for Sopra conventions. See UPSTREAM_REFS.md entry 3. -->

> **Read this before designing any new Copilot Studio agent.** Copilot Studio now has **two distinct
> architectures**. Most existing Sopra material — including most of [`../ARCHITECTURE.md`](../ARCHITECTURE.md) —
> describes the **classic** one. This document covers the **modern** one.

---

## 1. Two Architectures, One Product

| | **Classic** (topic-based) | **Modern** (agentic loop) |
|---|---|---|
| Routing | Trigger-phrase recognizer pre-routes an utterance to one topic | Model decides each turn what to do next |
| Unit of logic | Topic (a node graph) | Instructions + Knowledge + Tools + Skills |
| Decision style | One-shot routing, then a deterministic flow | Iterative: observe → decide → execute → observe → decide |
| Authoring | Copilot Studio web maker portal | Web portal **or** CLI/YAML (`pac copilot`) |
| Topics | Core building block | **Do not exist** |
| Power Fx | Supported | **Not supported** |
| Global/Topic variables | Supported | **Not supported** |

Neither replaces the other overnight. Classic agents keep running. But **new Sopra agents should
default to the modern architecture** unless a requirement below forces classic.

### When classic is still the right call

- The flow is legally or contractually **required to be deterministic** step-for-step (regulated
  disclosure scripts, consent capture, regulated financial advice).
- You depend on Power Fx expressions or explicit variable state that has no clean tool equivalent.
- The client's environment or licensing does not yet expose the CLI authoring mode.

Otherwise, prefer the agentic loop.

---

## 2. The Loop

An agentic-loop agent runs this cycle on every turn:

1. Observe the user request.
2. Decide whether to answer, retrieve knowledge, call a tool, invoke a skill, ask a question, or stop.
3. Execute the next step.
4. Observe the result.
5. Decide again.
6. Continue until the task is complete.

The important word is **iterative**. Classic orchestration routes once and then follows a fixed path.
The agentic loop can call a tool, look at what came back, and change its mind.

---

## 3. The Four Components

```text
Agent
├── Settings          — instructions (role, scope, tone, safety, escalation, tool-use policy)
├── Knowledge Sources — SharePoint, public websites, uploaded documents
├── Tools             — APIs, Agent Flows / Power Automate, AI Prompts, MCP servers
├── Skills            — reusable multi-step procedures (Markdown, optionally + Python)
└── Evaluation scenarios (optional)
```

### Instructions — global rules

Everything that applies to **the whole agent, in every conversation**:

- Role and persona
- Scope and domain boundaries
- Tone and response style
- Safety and privacy rules
- Escalation policy
- Tool-use policy
- Clarification and confirmation policy
- What **not** to do
- Final response style

### Knowledge — grounded retrieval

Use when the agent must **search, cite, or ground** an answer in factual, referenceable, or
policy-based material via RAG.

The critical nuance: **do not confuse "there is a document" with "this is knowledge."**

> A troubleshooting *guide* can be knowledge.
> A troubleshooting *assistant* is usually a skill that uses that knowledge.

If the goal is to *search within* a document → Knowledge.
If the goal is to *walk a user through* a procedure in that document → Skill (plus a tool to fetch
the file, if needed).

When a stakeholder says *"the agent should use X as knowledge,"* do not take it literally. Establish
the intent first.

### Tools — execution

Anything that **does** something:

- Create / update / delete records
- Raw LLM access (generate text from a specific prompt)
- Send email or Teams messages
- Generate, retrieve, delete, or modify a file
- Call an API, Agent Flow, or Power Automate flow
- Connect to an MCP server

**Shape test:** if it can be expressed as a function with typed inputs, it is a tool.

```text
check_order_status(order_id)
create_refund_case(order_id, reason)
```

### Skills — procedures

Use when the agent must know **how** to perform a multi-step task.

A skill fits when:
- A specific workflow, sequence, or domain procedure is required
- Output must follow a specific format or template
- The task needs extra context at execution time

A skill does **not** fit when:
- The model can already solve it from general knowledge
- The behavior applies to *all* conversations → that is an instruction
- It would merely duplicate global instructions or knowledge retrieval

**Tool vs. skill:**

```text
Make it a TOOL if:   check_order_status(order_id)
Make it a SKILL if:  handle refund request
                     recommend best product
                     troubleshoot login issue
```

A skill may embed a **supporting Python file** for complex data manipulation or unauthenticated
logic — that is preferable to inventing a tool for it.

---

## 4. The Decision Tree

Design by asking what jobs the agent must do — not by cataloguing what components a stakeholder
happened to name.

> The question is not *"What components did the user mention?"*
> It is *"What jobs must this agent perform, and what is the safest, most reliable component for each job?"*

```text
Is this a global rule, behavior, scope, tone, or policy for the whole agent?
→ Instructions

Is this factual information that should be retrieved or grounded?
→ Knowledge

Does this require an external action, live lookup, state change, or deterministic calculation?
→ Tool

Does this describe a reusable multi-step procedure or expert workflow?
→ Skill

Does this need to manipulate data or execute logic in a simple way?
→ Skill is enough

Does this need to manipulate data or execute logic in a complex way?
→ Skill with an embedded Python supporting file (not a tool)
```

---

## 5. What Does Not Exist Here

Agentic-loop agents **do not support**:

| Classic concept | Status | What to do instead |
|---|---|---|
| Deterministic topics | Gone | Agent Flows remain available *as tools*; encode sequence in a skill |
| Power Fx | Not supported | Replace with a skill, a tool, an instruction, or embedded Python |
| Global variables | Not supported | Rely on conversation history and prior tool outputs |
| Topic variables | Not supported | Same — there is no set/get state concept |

This is the single biggest adjustment for makers coming from classic. There is no state bag. The
loop carries context through the conversation history and the outputs of the tools it has already
called.

---

## 6. Skill Effectiveness Heuristics

- **Prefer curated skills** over expecting the agent to invent a procedure at runtime. Self-generated
  on-the-fly procedures degrade performance.
- **Add a skill only when the task genuinely needs a procedure.** For tasks the model already handles,
  a skill adds little and can actively interfere.
- **Prefer a few focused skills** over one comprehensive package.
- **Good skills offset model scale.** The right procedural skill can let a smaller, cheaper model match
  a much larger one — directly relevant to per-client run-cost budgets.

---

## 7. Anti-Patterns

| Anti-pattern | Why it hurts | Fix |
|---|---|---|
| Skill and knowledge that mirror each other | Overlapping responsibility; the loop cannot tell them apart | Split by role — see below |
| Speculative skills | Duplicate global instructions and interfere with routing | Put global behavior in instructions |
| Recreating topics as skills 1:1 | Reproduces classic rigidity and loses the benefit of the loop | Redesign around jobs, not flows |
| Treating every document as knowledge | Procedures become unsearchable prose | Ask: search it, or walk through it? |
| One giant "do everything" skill | Unmaintainable, poor selection accuracy | Several focused skills |
| Trusting generated tool descriptions | Migrated `WorkflowTool` descriptions are placeholders | Rewrite every one purposefully |

The canonical bad pair:

```text
BAD:    Skill: "answer insurance questions"  +  Knowledge: "insurance questions"
BETTER: Knowledge: "insurance policy knowledge"  +  Skill: "explain-insurance-coverage"
```

---

## 8. Sopra Conventions for Agentic-Loop Agents

- **Component naming:** slugified, lowercase, hyphen-separated — `explain-insurance-coverage`,
  `make-restaurant-reservation`. This matches the plugin's generated style; do not PascalCase them.
- **Publisher prefix:** use the Sopra prefix `spr` (2–8 alphanumeric characters, must start with a
  letter, must not start with `mscrm`). Do **not** leave the plugin default `catmgr`.
- **File stems** must start with the publisher prefix and be ≤ 100 characters, or push will fail.
- **Solutions and promotion are unchanged.** Agentic-loop agents still live in an `spr_`-prefixed
  Dataverse solution and still follow the DEV → TEST → UAT → PROD ring in
  [`../../solutions/ARCHITECTURE.md`](../../solutions/ARCHITECTURE.md).
- **Instructions carry the compliance burden.** Because there are no deterministic topics, the safety,
  scope, and escalation rules that classic agents enforced structurally must now be written explicitly
  into instructions — and tested.
- **Review every generated artifact.** Plugin output is a draft accelerator, never a deliverable.

---

## 9. Related

- [`../cli-authoring.md`](../cli-authoring.md) — the `pac copilot` project layout and workflow
- [`migration-classic-to-agentic.md`](migration-classic-to-agentic.md) — converting an existing agent
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) — classic architecture (still authoritative for classic agents)
- [`testing-strategy.md`](testing-strategy.md) — evaluation and test approach

---

## Upstream Reference

- **Source:** `microsoft/copilot-studio-plugin` — `agents/copilot-studio-architect.md`
- **Accessed:** 2026-08-22 (plugin `mcs-assistant` v1.0.2)
- **Sopra Divergence:** Added the classic-vs-modern selection criteria in §1, the Sopra naming and
  `spr` publisher-prefix rules in §8, and the explicit note that compliance guarantees previously
  enforced by topic structure must move into instructions. Upstream is architecture-neutral on
  governance.
- **⚠️ Caveat:** Upstream states the Copilot Studio YAML schema may change without notice and the
  plugin is not intended for production use. Re-verify this document each quarter.
