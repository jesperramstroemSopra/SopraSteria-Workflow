---
description: Reformat the latest analysis into a clean, stakeholder-ready report suitable for sharing with a customer or steering group.
argument-hint: Optional — which analysis, and the audience (e.g. "latest, for the customer CTO")
allowed-tools: Read, Write, Glob, Grep
---

# Present Analysis

Initial request: $ARGUMENTS

Run the `present-analysis` skill in this plugin (`../../skills/present-analysis/SKILL.md`). Follow
the conventions in `../../skills/sw-overview/SKILL.md`.

Read the most recent artifact in `.sopra/workflow/analyze-project/` unless the user names another.
Ask who the audience is — a technical lead and a customer sponsor need very different documents.

Strip internal jargon. Lead with impact and cost, not with file paths. Save to
`.sopra/workflow/present-analysis/`.
