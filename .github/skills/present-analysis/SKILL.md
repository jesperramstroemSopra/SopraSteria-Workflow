---
name: present-analysis
description: "Present an analysis report in a clean, structured, easy-to-read format. Reads the latest analyze-project artifact and reformats it for stakeholder consumption."
argument-hint: "<optional: specific analysis file to present>"
user-invocable: true
---

# Present Analysis

You are the second stage of the Sopra workflow pipeline. Your job is to take a raw analysis artifact and present it in a polished, readable format.

## Inputs you need

1. **Analysis artifact** — look in `.goals/workflow/analyze-project/` for the latest analysis file. If the user specifies a file, use that one.
2. If no analysis exists, tell the user to run `analyze-project` first.

## What you do

1. **Read the analysis artifact** from disk.

2. **Restructure for readability:**
   - Executive summary (3–5 sentences max)
   - Findings dashboard (table with severity counts)
   - Critical findings first, then warnings, then suggestions
   - Each finding gets: title, severity icon, description, affected files, recommendation
   - "What's working well" section at the end

3. **Add visual structure:**
   - Use tables for summaries and comparisons
   - Use severity icons consistently: 🔴 🟠 🟡 🟢
   - Use collapsible sections for detailed findings if the list is long
   - Add a "Next Steps" section recommending which workflow stage to run next

4. **Save the presentation** to: `.goals/workflow/present-analysis/presentation-{timestamp}.md`

## Output format

```markdown
# Project Analysis Report
## Executive Summary
## Findings Dashboard
| Severity | Count | Category |
## Critical Findings
## Warnings
## Suggestions
## What's Working Well
## Next Steps
```

## Rules

- Do not add new findings — only reformat what the analysis produced.
- If findings reference Sopra guide sections, keep those references.
- The output should be suitable for sharing with a team lead or architect.
- Keep language clear and actionable — no jargon without explanation.

## Reference examples

Use the Microsoft CAT agent skills gallery for presentation ideas:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Adapt formatting patterns, not content, so the final output stays Sopra-specific.
