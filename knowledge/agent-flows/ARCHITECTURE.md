# Agent Flows — Architecture

> **Scope.** Agent flows are deterministic, Copilot Studio–hosted workflows that an agent invokes as
> a tool. They sit between "the agent reasons about it" and "a classic cloud flow runs on a trigger".

> ⚠️ **Verify before you commit.** Agent flows are a relatively recent capability and the licensing
> and limits story has moved more than once. Confirm current entitlements against your customer's
> tenant and Microsoft Learn before making them load-bearing in a design. Record what you find with
> `/sw-learn`.

---

## 1. What an agent flow is

A workflow built with the Power Automate designer, but **owned by and hosted inside Copilot Studio**,
which an agent calls when it decides the task requires a deterministic sequence of steps.

The agent decides **whether** and **when** to call it. The flow decides **what happens** once called.
That split is the whole point:

- **Agent** — handles ambiguity, language, and choosing the next action
- **Agent flow** — handles the steps that must happen the same way every time

---

## 2. When to use which

This is the decision most often made by habit rather than analysis.

| Requirement | Use |
|---|---|
| Interpret free text, choose between actions, converse | **Agent** (instructions + reasoning) |
| Retrieve a fact from documents or a knowledge source | **Knowledge** — not a flow |
| A fixed sequence the agent triggers on demand | **Agent flow** |
| A fixed sequence triggered by an external event (record created, email arrives, schedule) | **Power Automate cloud flow** |
| A single external call with no orchestration | **A tool / connector action** — not a flow |
| Long-running, high-volume, or heavy transformation | **Cloud flow, Azure Function, or code** |

### The two failure modes

**Over-using the agent.** An agent asked to perform a fixed five-step process will sometimes do four
of them, or do them out of order. Non-determinism is a feature for conversation and a defect for
process. If the business requires the same outcome every time, it belongs in a flow.

**Over-using the flow.** A flow with a long chain of conditions trying to interpret what the user
meant is an agent wearing a disguise. Move the interpretation to the agent and let the flow do the
deterministic part.

### Agent flow vs cloud flow

The distinction is **who starts it**:

- Agent flow → the *agent* starts it, mid-conversation, and usually wants a result back
- Cloud flow → an *event* starts it, and nobody is waiting in a conversation

If a process needs both — say, an agent-initiated request that later completes asynchronously —
split it: an agent flow to accept and acknowledge, a cloud flow to do the long work.

---

## 3. Design rules

### Contract first

The agent chooses the flow based on its **name, description, and input schema**. That metadata *is*
the interface. Treat it as carefully as an API signature.

- Name the flow after the business outcome: `Create supplier onboarding request`, not `Flow 3`.
- Write a description that states **when to use it and when not to**. Ambiguous descriptions are the
  single most common cause of an agent calling the wrong tool — or calling nothing at all.
- Name every input parameter in business language, and describe it. `supplierOrgNumber` with a
  description beats `param1` every time.
- Keep the input list short. Every optional parameter is another chance for the agent to guess.

### Return something the agent can use

The agent has to explain the result to a human. So:

- Return **structured, named outputs**, not a raw connector response blob.
- Return a clear success/failure indicator the agent can branch on.
- On failure, return a **message the agent can safely paraphrase to the user**, with no stack traces,
  internal IDs, or connector error text.

### One flow, one job

A flow that does three unrelated things forces the agent to decide *which part* it wanted, which it
cannot express. Split them. Composition belongs to the agent.

### Errors are part of the contract

Never let a flow fail silently or return an unhandled exception to the agent.

- Configure `Run after` on failure paths — the error path is not optional.
- Catch, classify, and return a meaningful outcome (`NotFound`, `PermissionDenied`, `ValidationError`).
- Decide deliberately whether a failure should be retried by the agent or reported to the user.

See [`../power-automate/patterns/error-handling.md`](../power-automate/patterns/error-handling.md).

### Latency is user-facing

Someone is waiting in a conversation. A flow that takes 40 seconds makes the agent look broken.

- Keep synchronous agent flows short. Push long work to an asynchronous cloud flow.
- Avoid unbounded loops over collections; page and cap.
- Be explicit about what happens on timeout — the agent needs a story to tell.

---

## 4. Identity and security

Establish this early; it is expensive to change later.

- **Whose identity performs the action?** The signed-in user, or a service identity? A flow running
  under a service identity will happily do things the user is not permitted to do.
- **Confirm before consequences.** Anything that spends money, sends external communication, or
  deletes data should require explicit user confirmation in the conversation before the flow runs.
- **Validate inputs inside the flow.** The agent constructs the parameters from natural language and
  can get them wrong. Do not trust them.
- **Never return data the caller is not entitled to see.** Filter in the flow, not in the agent's
  instructions — instructions are guidance, not a security boundary.

Related: [`../dataverse/patterns/security-model.md`](../dataverse/patterns/security-model.md).

---

## 5. ALM

Agent flows travel with the agent, and both belong in a solution.

- Put the agent and its flows in the **same solution**, so they promote together.
- Use **connection references** and **environment variables** — never hardcode environments,
  URLs, or IDs. See [`../solutions/patterns/alm-pipeline.md`](../solutions/patterns/alm-pipeline.md).
- After import, **connection references must be bound** in the target environment before anything
  works. This is the most common "it worked in dev" failure.
- Re-verify the agent still resolves its tools after promotion. A flow that imported successfully is
  not the same as a flow the agent can still find and call.

---

## 6. Testing

Agent flows need testing at **two levels**, and skipping either leaves a real gap:

1. **The flow, directly** — deterministic. Given inputs, assert outputs, including every error
   branch. This is ordinary flow testing.
2. **The agent choosing the flow** — non-deterministic. Does the agent invoke it for the phrasings
   real users use, with correctly mapped parameters, and does it *not* invoke it when it shouldn't?

For level 2, assert on **which tool was called and with what arguments**, never on exact wording.
Test the near-misses too: phrasings that should route to a *different* tool, and phrasings that
should route nowhere.

The agent must be **published** before end-to-end testing via the runtime endpoint. See
[`../copilot-studio/patterns/testing-strategy.md`](../copilot-studio/patterns/testing-strategy.md).

---

## 7. Review checklist

- [ ] Correct choice — agent flow, not a cloud flow, a tool, or agent reasoning
- [ ] Name and description state clearly when to use it *and when not to*
- [ ] Inputs are minimal, business-named, and described
- [ ] Outputs are structured and include an explicit success/failure signal
- [ ] Every failure path handled; no raw connector errors reach the agent
- [ ] Latency acceptable for a live conversation; timeout behaviour defined
- [ ] Identity model explicit; consequential actions require confirmation
- [ ] Inputs validated inside the flow
- [ ] Connection references and environment variables used throughout
- [ ] Agent and flows in the same solution
- [ ] Tested both directly and through the agent, including negative routing cases

---

## Related

- [`../copilot-studio/patterns/agentic-loop.md`](../copilot-studio/patterns/agentic-loop.md) — the
  component decision tree: Instructions vs Knowledge vs Tools vs Skills
- [`../power-automate/ARCHITECTURE.md`](../power-automate/ARCHITECTURE.md)
- [`../solutions/ARCHITECTURE.md`](../solutions/ARCHITECTURE.md)
- [`../../playbooks/agent-flows/`](../../playbooks/agent-flows/) — field-learned behaviour
