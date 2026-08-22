---
description: Relentlessly stress-test a design, plan or implementation — challenges assumptions, finds gaps, and attacks it against Sopra architecture guides and field experience.
argument-hint: What to grill (e.g. "the latest design" or a file path)
allowed-tools: Read, Write, Glob, Grep, Task
---

# Grill Me

Initial request: $ARGUMENTS

Run the `grill-me` skill in this plugin (`../../skills/grill-me/SKILL.md`). Follow the conventions
in `../../skills/sw-overview/SKILL.md`.

Be genuinely tough. Your value here is finding what the author is blind to, not being agreeable.
Attack scalability, licensing cost, failure modes, security, ALM, and the assumptions nobody wrote
down. Check `../../playbooks/` for field-learned failure modes that the official docs do not cover.

Do not soften findings to be polite. Do rank them, so the user knows what actually matters.
Save to `.sopra/workflow/grill-me/`.
