---
description: Analyze an existing Power Platform project against Sopra architecture guides — evaluates architecture, risk, quality and optimization, and saves a severity-ranked findings report.
argument-hint: What to analyze and what kind of analysis (e.g. "the customer agent, risk and quality")
allowed-tools: Read, Write, Glob, Grep, Bash(pac), Task
---

# Analyze Project

Initial request: $ARGUMENTS

Run the `analyze-project` skill in this plugin (`../../skills/analyze-project/SKILL.md`). Follow the
conventions in `../../skills/sw-overview/SKILL.md`.

Before evaluating anything, **identify which technology and which architecture** you are looking at
— classic vs agentic-loop Copilot Studio, cloud flow vs agent flow. Reviewing one against the
other's rules produces confident nonsense.

Ask the user for project type, analysis type and subject if any is unclear. Save findings to
`.sopra/workflow/analyze-project/` and update `_state.json`. Analyze only — do not fix.
