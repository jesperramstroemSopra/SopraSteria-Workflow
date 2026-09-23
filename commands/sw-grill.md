---
description: Relentlessly stress-test a design, plan or implementation — challenges assumptions, finds gaps, and attacks it against Sopra architecture guides and field experience.
argument-hint: What to grill (e.g. "the latest design" or a file path)
allowed-tools: Read, Write, Glob, Grep, Task
---

# Grill Me

Initial request: $ARGUMENTS

Before any other step, apply the `sw-grill` row of the
[agent-command compatibility gate](../knowledge/shared/copilot-agent-operating-model.md#3-agent-command-compatibility-gate).
Canonical row: Delivery Lead=`Delegate`; Solution Architect=`Primary`; every other Sopra
agent=`Blocked`. The owner is Sopra Solution Architect (`sopra-solution-architect`). Confirmation
cannot override this row.
On mismatch, do not infer or rename the owner and do not offer confirmation as a bypass. Include
`Recommended agent: Sopra Solution Architect`,
`Next: copilot --agent sopra-workflow:sopra-solution-architect`, and
`Then run: /sopra-workflow:sw-grill`.

Run the `grill-me` skill in this plugin (`../../skills/grill-me/SKILL.md`). Follow the conventions
in `../../skills/sw-overview/SKILL.md`.

Use an iterative fact-finding loop: ask exactly one clarifying question at a time when a missing fact
changes the verdict, then proceed on the answer before asking the next question. Do not jump straight
to a final verdict or a completed report while the review is still missing a material fact.

If the result is blocked or not ready, do not stop after listing blockers and next actions. End the
response by asking the first concrete unblock question for the highest-impact blocker, preferably as
a multiple-choice decision with a recommended option. Continue the loop on subsequent user answers
until the blockers are resolved, explicitly accepted as risks, or ready for the next workflow stage.

Be genuinely tough. Your value here is finding what the author is blind to, not being agreeable.
Attack scalability, licensing cost, failure modes, security, ALM, and the assumptions nobody wrote
down. Check `../../playbooks/` for field-learned failure modes that the official docs do not cover.

Do not soften findings to be polite. Do rank them, so the user knows what actually matters.
Save to `.sopra/workflow/grill-me/`.
