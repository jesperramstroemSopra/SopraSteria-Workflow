# Sopra-Workflow Agent Guide

This repo is a reusable Power Platform knowledge base and workflow hub for Copilot Studio, Power Automate, Dataverse, and Solutions/ALM work.

## Repo purpose

- Store Sopra-specific architecture guidance
- Store reusable skill instructions
- Keep workflow artifacts for analysis, planning, implementation, and testing
- Track upstream inspiration sources separately from Sopra-specific guidance

## Structure

```text
C:\Sopra-Workflow\
├── AGENTS.md
├── README.md
├── UPSTREAM_REFS.md
├── shared\
├── copilot-studio\
├── power-automate\
├── dataverse\
├── solutions\
├── .github\
│   ├── skills\
│   └── extensions\
└── .goals\
```

## How skills are composed

The workflow is split into stage-based skills:

- `analyze-project`
- `present-analysis`
- `grill-me`
- `create-plan`
- `review-plan`
- `implement-plan`
- `test-solution`
- `draw-architecture`

Each stage should:

1. Read the relevant repo docs.
2. Read the prior workflow artifacts from `.goals/workflow/`.
3. Save its output back to disk.
4. Preserve enough state for later restart.

## Shared vs stage skills

- **Shared skill docs** hold the reusable workflow logic and stage rules.
- **Stage SKILL.md files** expose each skill as an individual reusable skill.
- **Extensions** provide executable tool access where needed.

## Source of truth

When working in this repo, prefer these docs in order:

1. `AGENTS.md`
2. `README.md`
3. `UPSTREAM_REFS.md`
4. `shared/upstream-skill-examples.md`
5. Domain architecture docs under `copilot-studio/`, `power-automate/`, `dataverse/`, `solutions/`

## Workflow artifacts

Use `.goals/workflow/` for all run-time outputs:

- `analyze-project/`
- `present-analysis/`
- `grill-me/`
- `create-plan/`
- `review-plan/`
- `implement-plan/`
- `test-solution/`

## External inspiration

Use upstream repos only as inspiration:

- `microsoft/power-cat-skills`
- `microsoft/skills-for-copilot-studio`
- Microsoft CAT agent skills gallery

Do not copy content verbatim. Translate it into Sopra conventions and document divergences.

## Convention rules

- Keep skill names aligned with their stage.
- Keep language direct and actionable.
- Reference the correct architecture guide before giving advice.
- Prefer file-backed state over ephemeral chat state.
- Use the repo docs when suggesting improvements to skills or workflow behavior.

