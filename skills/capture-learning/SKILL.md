---
name: capture-learning
description: "Capture a field-learned lesson into the Sopra playbooks — a gotcha, workaround, undocumented limit or recurring pattern discovered during real delivery work. Use when the user says they learned something, hit a surprising error, found a workaround, or wants to write down how something actually works versus how the documentation says it works."
argument-hint: "<what you learned>"
user-invocable: true
---

# Capture Learning

Every other skill in this toolkit **consumes** knowledge. This one **produces** it. It is the
mechanism that turns individual delivery experience into something the whole organisation reuses.

## Step 1 — Confidentiality gate (do this first)

Playbook entries live in the toolkit, which travels to every client engagement.

**Strip client identity before anything is written:**

| Remove | Replace with |
|---|---|
| Customer / project names | The generic situation |
| Environment URLs, tenant IDs, environment IDs | "the target environment" |
| Publisher prefixes | `<prefix>` |
| Table, column, flow and agent names that reveal the business | Generic equivalents |
| User names, emails, any record data | Nothing — omit entirely |
| Screenshots, logs, run histories containing the above | Redacted excerpt or omit |

> ❌ "In Acme's onboarding flow, `acme_supplierstatus` returned null after import to acme-test."
> ✅ "A choice column referenced by a flow condition returns null after solution import when the
> option-set values were changed in the source environment."

**If the lesson cannot survive this generalization, it does not belong in the playbooks.** Write it
to the project's `.sopra/workflow/` instead and tell the user why.

## Step 2 — Qualify it

Capture it only if it is **not readily available in the official documentation**. Ask yourself
whether a competent consultant could have found this in fifteen minutes of searching. If yes, skip
it — noise devalues the whole collection.

Good candidates:

- Platform behaviour that contradicts, or is absent from, Microsoft documentation
- A cryptic error message and its actual root cause
- A real-world limit, throttle or timeout, and what it does when you hit it
- A workaround for a current platform bug — with the date, because it may get fixed
- A pattern that reliably works, or reliably fails, across multiple engagements
- A licensing, governance or security trap that only shows up at deployment
- Something a customer's environment configuration made true that is not true by default

Not candidates: restatements of docs, personal preference, one-off configuration mistakes.

## Step 3 — Interview the user

Do not write from a single sentence. Ask:

1. **What did you expect to happen, and what actually happened?**
2. **What was the trigger** — the exact conditions that produce it?
3. **How did you diagnose it?** (Often the most valuable part — it is repeatable.)
4. **What is the fix or workaround?** Is it permanent or temporary?
5. **How confident are you** that this generalizes beyond this one environment?
6. **Which domain** does it belong to — copilot-studio, power-automate, agent-flows, dataverse,
   solutions, or cross-cutting?

If confidence is low, still capture it — but mark it as **unconfirmed**. A suspected pattern with
one sighting is useful; pretending it is established fact is not.

## Step 4 — Choose the destination and confirm

First identify the workspace:

- **Client project**: save a scrubbed candidate under
  `.sopra/workflow/capture-learning/candidate-<YYYY-MM-DD-HHmm>.md`.
- **Sopra-Workflow toolkit repository**: a reviewed, generalized lesson may be written to
  `../../playbooks/<domain>/<short-kebab-title>.md`.

Never try to write into an installed plugin from a client workspace. Obtain explicit confirmation
before creating a candidate or changing toolkit files.

## Step 5 — Write the entry

Use this structure:

```markdown
---
title: <One-line statement of the lesson>
domain: <copilot-studio | power-automate | agent-flows | dataverse | solutions | cross-cutting>
confidence: <confirmed | probable | unconfirmed>
first-observed: <YYYY-MM>
last-verified: <YYYY-MM>
applies-to: <versions, licence types, or environment conditions>
tags: [<searchable keywords>]
---

## Situation
When does this apply? Be precise about the trigger conditions.

## What the documentation implies
What a reasonable person would expect, and why.

## What actually happens
The observed behaviour, including exact error text where relevant.

## Why
Root cause, if known. Say "unknown" rather than guessing.

## Resolution
The fix or workaround, with concrete steps. Note whether it is permanent
or a stopgap pending a platform fix.

## How to detect it
What to look for in a review so it is caught early next time.

## Related
Links to knowledge-base sections or other playbook entries.
```

For a client-side candidate, add a `## Promotion notes` section stating which standing knowledge,
review, planning, or test guidance should change if the lesson is promoted.

## Step 6 — Index it

Only in the toolkit repository, add a row to `../../playbooks/README.md` so the promoted entry is
discoverable by title, domain and tags. An unindexed toolkit entry will never be found again.

## Step 7 — Feed it back

Ask whether this lesson should also change the standing guidance:

- If it changes a **recommendation**, update the relevant `../../knowledge/<domain>/` file and say
  which file changed.
- If it is something a review should always check, propose adding it to `analyze-project`,
  `grill-me`, or `review-agent-yaml`.

A playbook entry that never influences a future review has not really been captured.

Follow `../../knowledge/shared/operator-output-contract.md`. State whether the result is a
client-side candidate or a promoted toolkit lesson.

## Rules

- Confidentiality gate first. Always. No exceptions for "internal only".
- State confidence honestly. `unconfirmed` is a valid and useful value.
- Date every entry. Platform behaviour changes, and a stale workaround can be worse than none.
- One lesson per file. Bundled entries do not get found by search.
- Write it so a colleague with no context on the engagement can act on it.
- Never write into an installed plugin from a client workspace.
