---
description: Capture a field-learned lesson into the Sopra playbooks — the workaround, gotcha or pattern you just discovered that is not in the Microsoft documentation.
argument-hint: What you learned (e.g. "connection references break when you import unmanaged over managed")
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Capture Learning

Initial request: $ARGUMENTS

Before any other step, apply the `sw-learn` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Method Improver=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Method Improver (`sopra-method-improver`). Confirmation cannot
override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Method Improver`,
`Next: copilot --agent sopra-workflow:sopra-method-improver`, and
`Then run: /sopra-workflow:sw-learn`.

Run the `capture-learning` skill in this plugin (`../../skills/capture-learning/SKILL.md`).

This is how the toolkit gets smarter. Everything else in this plugin consumes knowledge — this is
the one command that produces it.

## The confidentiality rule

Promoted playbook entries are written into the **toolkit**, which is shared across every Sopra
engagement. From a client workspace, write only a scrubbed candidate under
`.sopra/workflow/capture-learning/`.

**Strip all client identity before writing.** No customer names, environment URLs, tenant or
environment IDs, publisher prefixes, user names, table or field names that reveal the business,
or anything from a specific dataset. Generalize to the pattern.

> ❌ "In the Acme onboarding flow, `acme_supplierstatus` failed to..."
> ✅ "When a choice column is referenced by a flow condition before the solution import completes..."

If the lesson cannot be generalized without leaking client detail, it does not belong in the
playbooks. Keep it in the client project only.

## What qualifies

Capture it if it is **not obvious from the official documentation**:

- A behavior that contradicts or is missing from Microsoft docs
- An error message and what actually caused it
- A limit or throttle you hit in the real world
- A workaround for a platform bug
- A pattern that repeatedly works, or repeatedly fails
- A licensing or governance trap

Do **not** capture things that are just a restatement of the docs. The value of the playbooks is
inversely proportional to how much of it you could have Googled.

Confirm before writing. In a client project, save a candidate. Only while working in the toolkit
repository may a reviewed lesson be saved to `../../playbooks/<domain>/` and indexed.
