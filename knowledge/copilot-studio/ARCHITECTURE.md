## Copilot Studio Architecture Guide (Classic / Topic-Based)

> **⚠️ Scope: this document describes the CLASSIC, topic-based architecture.**
>
> Copilot Studio now has two architectures. Everything below — topics, trigger phrases, Power Fx,
> global and topic variables — applies to **classic** agents only. None of it exists in the modern
> **agentic-loop** architecture.
>
> | If you are… | Read |
> |---|---|
> | Building a **new** agent | [`patterns/agentic-loop.md`](patterns/agentic-loop.md) **first** |
> | Authoring YAML in source control | [`cli-authoring.md`](cli-authoring.md) |
> | Converting an existing classic agent | [`patterns/migration-classic-to-agentic.md`](patterns/migration-classic-to-agentic.md) |
> | Maintaining an existing **classic** agent | This document |
>
> **Sopra default for new agents is the agentic-loop architecture.** Use classic only when a
> requirement in [`patterns/agentic-loop.md` §1](patterns/agentic-loop.md#1-two-architectures-one-product)
> forces it.

## Overview

This document defines the architecture principles, design decisions, and Sopra conventions for
building **classic** Copilot Studio agents. Read this before designing or changing any classic agent.

---

## 1. Agent Design Philosophy

### Single Agent vs Multi-Agent

| Criterion | Single Agent | Multi-Agent |
|-----------|-------------|-------------|
| Scope | ≤ 15 custom topics | > 15 topics or distinct domains |
| Team | One team owns all topics | Multiple teams contribute |
| Reuse | No shared capabilities needed | Capabilities reused across projects |
| Latency | Lower latency acceptable | Can tolerate extra round-trips |
| Complexity | Simple linear conversations | Complex orchestration needed |

**Sopra Default**: Start with a single agent. Extract to multi-agent when topic count exceeds 15 or when two separate teams need independent release cycles.

### Agent Scope Principle

Each agent should have a single, clear purpose expressed in one sentence. Example: *"This agent helps Sopra employees check their leave balance and submit leave requests."* If the sentence requires "and" more than once, the agent is too broad.

---

## 2. Topic Architecture

### System Topics vs Custom Topics

**System topics** are created automatically by Copilot Studio and should be customized — not deleted:

| System Topic | Sopra Mandatory Customization |
|-------------|------------------------------|
| `Greeting` | Replace default with brand-aligned welcome message and menu |
| `Fallback` | Add a graceful fallback with escalation path or ticket creation |
| `End of Conversation` | Add CSAT prompt if the agent is customer-facing |
| `Escalate` | Wire to a live agent handoff action or Teams notification |
| `Error` | Log the error to Dataverse and show a user-friendly message |

**Custom topics** cover business-specific conversation flows. Follow the naming and size guidance in [`patterns/topic-design.md`](patterns/topic-design.md).

### Trigger Phrase Design

Trigger phrases are how Copilot Studio routes user utterances to topics. Poorly designed triggers cause misrouting — one of the top causes of agent quality issues.

**Rules:**
1. Write 5–10 trigger phrases per topic minimum; 15+ is better for production.
2. Include intent variations, not just keyword variations. "How much leave do I have?" and "Show me my remaining vacation days" are different phrasings of the same intent.
3. Avoid overlap between topics. Use the **Topic Overlap** view in Copilot Studio before publishing.
4. Do not use single-word triggers unless the topic handles a highly specific command.

### Topic Chaining

Topics can redirect to other topics using the **Redirect** node. Use chaining when:
- Two topics share a sub-flow (e.g., identity verification is shared across 5 topics → extract to `VerifyIdentity` topic)
- A topic becomes longer than 30 nodes

Do **not** redirect in a loop — Copilot Studio does not detect circular redirects and they cause infinite loops.

---

## 3. Generative AI Integration

### Decision Tree: Generative Answers vs Authored Topics

```
Is the question answerable from a finite, well-defined set of structured data?
├─ YES → Use authored topic with Dataverse/HTTP action
└─ NO → Is the question about unstructured documents or broad knowledge?
         ├─ YES → Is the content regulated (legal, medical, HR policy with compliance risk)?
         │         ├─ YES → Use authored topic with reviewed, hardcoded responses
         │         └─ NO → Use Generative Answers with knowledge source
         └─ NO → Is it a chit-chat / open-ended question?
                  ├─ YES → Enable generative AI in agent settings (global)
                  └─ NO → Evaluate case by case; default to authored
```

| Content Type | Recommended Approach |
|-------------|---------------------|
| HR FAQ (general) | Generative Answers + SharePoint knowledge source |
| Leave balance lookup | Authored topic + Dataverse action |
| IT troubleshooting steps | Generative Answers + internal KB SharePoint |
| Compliance / legal notices | Authored topic ONLY — no generative |
| Product catalog search | Authored topic + Dataverse/HTTP search action |
| General chit-chat | Global generative AI enabled |

---

## 4. Orchestration Patterns

### Linear vs Branching Conversations

**Linear flow**: Use for simple request-response patterns (e.g., lookup, FAQ answer). The conversation moves top to bottom with no branching.

**Branching flow**: Use when the response depends on a user-provided value or a data lookup result. Use **Condition** nodes (not Adaptive Card logic) to branch.

### Slot-Filling

Slot-filling collects multiple required parameters before executing an action. Implement it explicitly in Copilot Studio — do not rely on Copilot to infer slots automatically for regulated or sensitive operations.

**Pattern:**
```
Ask: "What is your employee ID?"
  → Store: Topic.EmployeeId (Entity: Number)
Ask: "Which week are you requesting leave for?"
  → Store: Topic.LeaveStartDate (Entity: Date)
Condition: Topic.EmployeeId is NOT blank AND Topic.LeaveStartDate is NOT blank
  → Call HTTP action to submit leave request
  → Show confirmation message
```

### Avoiding Topic Re-Entry

If a user's utterance matches a trigger phrase mid-conversation, Copilot Studio may exit the current topic and enter the matched topic. To prevent this on critical flows:
- Use the **Entities** panel to restrict utterances during data collection
- Enable **slot-filling mode** on question nodes to prevent topic exits during data collection

---

## 5. Knowledge Sources

| Knowledge Source Type | Pros | Cons | When to Use |
|----------------------|------|------|-------------|
| SharePoint site/library | Real-time content, enterprise access control, easy to update | Requires SharePoint permission setup | Internal HR, IT, or policy documentation |
| Public URL (web crawl) | No setup needed, auto-refreshes | Limited to public content, crawl delay | External product docs, public FAQs |
| Dataverse knowledge | Structured data, fast queries, versioned | Requires manual content ingestion | Curated Q&A pairs, structured knowledge |
| File upload | Quick start, no external dependency | Does not auto-refresh, file size limits | Proof of concept, small static docs |

**Sopra Standard**: Use SharePoint as the primary knowledge source for internal agents. Scope the SharePoint library to the smallest set of documents needed — overly broad knowledge sources reduce answer relevance and increase hallucination risk.

---

## 6. Variable Management

| Variable Scope | Lifetime | Use For |
|---------------|---------|---------|
| Topic variable (`Topic.X`) | Single topic session | Slot-filled values, intermediate results |
| Global variable (`Global.X`) | Entire conversation session | User identity, language preference, session flags |
| Environment variable (`env.X`) | Agent configuration (not runtime) | URLs, feature flags, configuration values |

**Naming Conventions:**
- Topic variables: `Topic.EmployeeId`, `Topic.LeaveType` (PascalCase after `Topic.`)
- Global variables: `Global.AuthenticatedUserId`, `Global.Language`
- Environment variables: `spr_BaseApiUrl`, `spr_FallbackEmailAddress`

**Anti-pattern**: Storing sensitive data (tokens, PII) in global variables. Use session-scoped tokens and clear them at `End of Conversation`.

---

## 7. Authentication Patterns

| Auth Type | Description | When to Use |
|-----------|-------------|------------|
| No authentication | Anonymous access, no user identity | Public FAQ bots, external-facing chatbots |
| Manual authentication | User authenticates via OAuth flow during conversation | Simple internal tools where SSO is not available |
| Integrated authentication (Entra ID) | SSO via Entra ID, identity passed automatically | All internal agents on Microsoft Teams or Copilot |

**Sopra Standard**: All internal agents deployed on Teams must use **Integrated Authentication (Entra ID)**. Never use manual auth for Teams-deployed agents — the OAuth redirect breaks the Teams conversation flow.

For integrated auth:
1. Register an App Registration in Entra ID with `Chat` and `User.Read` scopes
2. Configure the agent's Authentication settings to use "Integrated (Teams and Power Apps)"
3. Access the user's UPN via `System.User.PrincipalName` in topics

---

## 8. Anti-Patterns

| Anti-Pattern | Problem | Sopra Fix |
|-------------|---------|-----------|
| Topic sprawl | 50+ topics with no clear grouping makes maintenance impossible | Group related topics; use topic folders; max 20 active topics per agent |
| Over-reliance on generative for regulated content | Generative answers may hallucinate compliance-sensitive information | Use authored topics for all policy, legal, and HR-sensitive content |
| Missing Fallback topic | Users get a generic error when the agent cannot match intent | Customize Fallback to offer alternative options or escalate |
| Hardcoded URLs in topics | Environment-specific URLs break when deploying to TEST/PROD | Use environment variables for all URLs |
| No testing before UAT | Topic misrouting only discovered in user acceptance | Run PPAPI evaluation suite before every environment promotion |
| Global variable pollution | Global variables from one topic interfere with another | Clear global variables at `End of Conversation`; use topic-scoped vars where possible |
| Single topic doing everything | A 100-node topic is impossible to maintain and debug | Keep topics ≤ 30 nodes; extract sub-flows to separate topics |

---

## 9. Sopra Conventions

### Naming Standards

| Artifact | Convention | Example |
|---------|-----------|---------|
| Agent display name | `PascalCase + Agent` | `HrSelfServiceAgent` |
| Topic name | `PascalCase` verb+noun | `CheckLeaveBalance`, `SubmitLeaveRequest` |
| Topic variable | `Topic.PascalCase` | `Topic.EmployeeId` |
| Global variable | `Global.PascalCase` | `Global.AuthenticatedUser` |
| Environment variable | `spr_camelCase` | `spr_dataverseBaseUrl` |
| Entity (custom) | `PascalCase + Entity` | `LeaveTypeEntity` |

### Mandatory System Topics

Every Sopra agent must have these system topics customized before going to UAT:
1. `Greeting` — custom welcome with agent scope description
2. `Fallback` — graceful failure with escalation path
3. `End of Conversation` — CSAT for customer-facing agents
4. `Escalate` — live agent handoff or Teams notification

### Solution Requirements

- All agents must live inside a Dataverse solution with prefix `spr_`
- Solution name: `SPR_[Project]_CopilotStudio`
- Agents must be exported as managed solutions for TEST/UAT/PROD deployment
- Connection references must use named service account connections (not developer user connections)
