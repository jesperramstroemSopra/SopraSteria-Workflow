---
name: create-plan
description: "Create an agent-ready implementation plan with detailed task packets, dependencies, decisions, acceptance evidence, and provider handoffs. Converts analysis findings and grill feedback into a structured work breakdown that an implementation agent can execute."
argument-hint: "<what to plan and any constraints>"
user-invocable: true
---

# Create Plan

You are the planning stage of the Sopra workflow pipeline. Your job is to convert analysis findings, grill feedback, design decisions, and user goals into a concrete, agent-ready implementation plan.

The plan is not a summary. It is a handoff contract for `implement-plan`: after this stage, a capable implementation agent should know exactly what to build, in what order, where to work, what to verify, what to avoid changing, which provider to use, and where human confirmation is required.

## Inputs you need

1. **Prior artifacts** — read from `.sopra/workflow/` for:
   - `analyze-project/` — analysis findings
   - `present-analysis/` — formatted analysis
   - `grill-me/` — grill feedback and gaps
   Use the latest file in each folder. If none exist, ask the user what to plan.
2. **User goal** — what the user wants to achieve.
3. **Constraints** — timeline, team size, environment restrictions, etc.
4. **Implementation readiness inputs** — ask for missing details that would block implementation:
   - Target environment/ring and whether live writes are allowed.
   - Solution name, publisher prefix, connection references, service account/owner, and deployment path.
   - Source systems, exact locations, schemas, sample payloads, and data classification.
   - Required user experience, outputs, notifications, and error behavior.
   - Acceptance criteria, test data, and who can approve the result.

## What you do

1. **Gather context.** Read all prior workflow artifacts and the user's request.

2. **Identify work items.** For each finding, gap, or goal, create an implementation task packet:
   - **ID**: short kebab-case identifier (e.g., `fix-error-handling`, `add-auth-config`)
   - **Title**: gerund form (e.g., "Adding error handling to approval flow")
   - **Outcome**: the observable change this task delivers
   - **Rationale/source**: which finding, requirement, decision, risk, or user statement created it
   - **Description**: enough detail that someone can execute without re-reading the analysis
   - **Implementation scope**: exact components to create/change and what must stay unchanged
   - **Step-by-step implementation notes**: ordered actions at a practical level, without writing the implementation itself
   - **Priority**: P0 (blocker), P1 (high), P2 (medium), P3 (nice-to-have)
   - **Estimated effort**: S (< 1 hour), M (1–4 hours), L (4–8 hours), XL (> 1 day)
   - **Dependencies**: which tasks must complete first
   - **Affected files/components**: specific files, solution components, flows, apps, tables, topics, actions, connectors, environment variables, or `TBD` with the discovery step that will resolve it
   - **Sopra guide reference**: which architecture doc section applies
   - **Execution provider**: agent, skill, MCP server, PAC, or local tool
   - **Provider preflight**: capability/auth checks required before the task can start
   - **Evidence required**: what proves the task is complete
   - **Acceptance criteria**: testable pass/fail statements, including negative/error cases
   - **Test approach**: the smallest meaningful validation command, tool, data set, manual check, or downstream `test-solution` task
   - **Confirmation boundary**: local write, live write, push, publish, deployment, or none
   - **Rollback/recovery**: backup, export, restore, feature flag, or manual undo path for risky changes
   - **Risks/edge cases**: task-specific risks, assumptions, and mitigations
   - **Formula contract (when relevant)**: load `../../knowledge/power-fx/README.md`; name the
     evaluator/property, input/output schema, supported functions, scale/failure policy and exact
     acceptance cases from `../../knowledge/power-fx/validation.md`. Make unresolved host support
     a prerequisite spike, not an implementer's guess.

3. **Order the work.** Sequence tasks respecting dependencies:
   - Critical/blocker items first
   - Group related tasks together
   - Identify parallelizable work
   - Flag tasks that need user decisions before proceeding

4. **Create phases.** Group tasks into execution phases:
   - Phase 1: Foundation / blockers
   - Phase 2: Core implementation
   - Phase 3: Quality / optimization
   - Phase 4: Testing / validation

5. **Separate decisions from tasks.** A task must not hide a missing decision. If a user or
   product owner decision is required, create a decision point with:
   - Decision ID
   - Question
   - Recommended default and rationale
   - Options with trade-offs
   - Impacted tasks
   - Whether implementation is blocked or can proceed with a reversible assumption

6. **Create an implementation handoff.** End the artifact with clear next-agent instructions:
   - Recommended implementing agent or provider.
   - Ordered task queue.
   - Tasks that may run in parallel.
   - Human gates the implementer must stop at.
   - Explicit out-of-scope items.
   - Known unknowns and the exact discovery task that resolves each one.

7. **Check readiness before finalizing.** Classify the plan:
   - **Ready** — all P0/P1 implementation blockers have answers and the implementer can start.
   - **Conditionally ready** — implementer can start discovery/foundation tasks, but named decisions
     must be resolved before live writes or core build.
   - **Blocked** — the next step is a decision, missing artifact, or unavailable provider, not implementation.

## Output artifact

Save to: `.sopra/workflow/create-plan/plan-{timestamp}.md`

Format:
```markdown
# Implementation Plan
## Goal
## Readiness Verdict
Ready | Conditionally ready | Blocked, with reason and next unblock action.

## Constraints
## Source Artifacts and Inputs
List files, user instructions, assumptions, and unavailable inputs.

## Confirmed Decisions
| ID | Decision | Source | Impact |

## Open Decisions
| ID | Question | Recommended default | Options / trade-offs | Impacted tasks | Blocks |

## Implementation Strategy
Describe the selected approach, why alternatives were rejected, target architecture/components, and execution provider strategy.

## Phase 1: Foundation
| ID | Title | Priority | Effort | Dependencies | Components | Provider | Gate |
## Phase 2: Core Implementation
| ID | Title | Priority | Effort | Dependencies | Components | Provider | Gate |
## Phase 3: Quality
| ID | Title | Priority | Effort | Dependencies | Components | Provider | Gate |
## Phase 4: Testing
| ID | Title | Priority | Effort | Dependencies | Components | Provider | Gate |

## Task Details
Repeat this block for every task.

### `<task-id>` — `<title>`
- **Priority / effort:** P? / ?
- **Outcome:** ...
- **Rationale/source:** ...
- **Dependencies:** ...
- **Affected files/components:** ...
- **Implementation scope:** ...
- **Out of scope:** ...
- **Implementation notes:**
  1. ...
  2. ...
- **Provider and preflight:** ...
- **Acceptance criteria:**
  - ...
- **Evidence required:** ...
- **Test approach:** ...
- **Confirmation boundary:** ...
- **Rollback/recovery:** ...
- **Risks and edge cases:** ...
- **Sopra references:** ...

## Cross-Cutting Requirements
Security, ALM, ownership, observability, data handling, naming, localization, accessibility, performance, and supportability requirements that apply to multiple tasks.

## Total Estimated Effort
## Risks and Mitigations
## Execution Providers and Capability Gaps
## Confirmation Gates
## Validation Matrix
| Requirement / risk | Covered by task | Validation evidence |

## Implementation Handoff
- **Recommended next agent/provider:**
- **Ordered task queue:**
- **Parallelizable tasks:**
- **Stop-before gates:**
- **Out of scope:**
- **First command/request to run next:**
```

## Rules

- Every task must be specific enough to execute without referring back to the analysis, design, or chat history.
- Do not produce a plan that only names components or phases. Include task details, acceptance criteria, evidence, gates, and handoff instructions.
- If exact file/component names are unknown, include a discovery task and mark dependent tasks blocked or conditional; do not leave vague `TBD` values unexplained.
- Translate broad outcomes into executable tasks. For example, split "build employee flow" into locating source data, defining schema, creating connection references, building validation, transforming records, handling errors, returning/presenting output, and testing.
- Dependencies must be explicit — no circular dependencies.
- Include decision points where the user needs to make a choice, and state the recommended default when enough evidence exists.
- Reference Sopra guide sections so the implementer knows the standard to follow.
- Do not start implementing — only plan. Implementation happens in `implement-plan`.
- Apply `../../knowledge/shared/execution-provider-routing.md`; do not assume providers are installed.
- Return the operator dashboard defined in `../../knowledge/shared/operator-output-contract.md`.
- The chat response may be concise, but the saved artifact must be detailed enough for an autonomous implementation agent to execute.

## Reference examples

Use the Microsoft CAT agent skills gallery for planning structure ideas:

- https://microsoft.github.io/cat-agent-skills/?tag=productivity

Adapt task breakdown style and sequencing patterns to Sopra work.
