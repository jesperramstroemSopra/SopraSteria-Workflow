# Orchestrator-Generated Variables (Classic + Agentic)

> **Applies to:** Both classic (topic-based) and agentic-loop architectures.
> The `AutomaticTaskInput` mechanism is generative-orchestrator-specific and works in both.
> **Status:** Proven.

Have the generative orchestrator classify or extract structured data from the user's message **at
topic/skill selection time** — zero extra cost, zero added latency.

---

## How It Works

When the orchestrator decides which topic to invoke, it already makes an LLM call. Declaring inputs
as `kind: AutomaticTaskInput` with `shouldPromptUser: false` piggybacks on that same LLM call to
populate variables from the conversation, silently, before the topic body executes.

No additional credits consumed. No extra round-trip. No question asked to the user.

**Key fields:**

| Field | Purpose |
|---|---|
| `kind: AutomaticTaskInput` | Tells the orchestrator to fill this variable |
| `shouldPromptUser: false` | Suppresses any user-facing question |
| `description` | The extraction prompt — list exact allowed values |

The input must be declared in **both** `inputs` and `inputType.properties` — they must match.

---

## When to Use

- Classify queries into categories (HR, IT, Finance) for knowledge routing
- Extract a structured value (country, product name, priority) without asking the user
- Knowledge search quality suffers because `UniversalSearchTool` applies the same strategy to every query
- Route to different knowledge sources based on query type or user context

**Not suitable for:** Complex multi-step reasoning, long document analysis, or transformations
that need a full prompt — use an AI Prompt action for those.

---

## YAML Example

### Classification topic (sets `Global.searchCategory` from the user's message)

```yaml
kind: AdaptiveDialog
inputs:
  - kind: AutomaticTaskInput
    propertyName: searchCategory
    description: |-
      Classify the user's query into one of these categories:
      HR, IT, Finance, Other
    shouldPromptUser: false

beginDialog:
  kind: OnRecognizedIntent
  id: main
  intent: {}
  actions:
    - kind: SetVariable
      id: setVariable_abc123
      variable: Global.searchCategory
      value: =Topic.searchCategory

inputType:
  properties:
    searchCategory:
      displayName: searchCategory
      description: |-
        Classify the user's query into one of these categories:
        HR, IT, Finance, Other
      type: String

outputType: {}
```

### Knowledge routing topic (`OnKnowledgeRequested` routes by category)

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnKnowledgeRequested
  id: main
  actions:
    - kind: ConditionGroup
      id: conditionGroup_route
      conditions:
        - id: condition_hr
          condition: =Global.searchCategory = "HR"
          actions:
            - kind: SearchAndSummarizeContent
              id: search_hr
              variable: System.SearchResults
              userInput: =System.SearchQuery
              knowledgeSources:
                kind: SearchSpecificKnowledgeSources
                knowledgeSources:
                  - <schemaName>.knowledge.hr-policies
        - id: condition_it
          condition: =Global.searchCategory = "IT"
          actions:
            - kind: SearchAndSummarizeContent
              id: search_it
              variable: System.SearchResults
              userInput: =System.SearchQuery
              knowledgeSources:
                kind: SearchSpecificKnowledgeSources
                knowledgeSources:
                  - <schemaName>.knowledge.it-documentation
      elseActions:
        - kind: SearchAndSummarizeContent
          id: search_fallback
          variable: System.SearchResults
          userInput: =System.SearchQuery
```

---

## Sopra Conventions

- **Write the description as a precise extraction instruction.** The orchestrator uses it as the
  prompt. Vague descriptions produce unreliable classifications.
- **Use enum-style descriptions.** List the exact allowed values (e.g., `"HR, IT, Finance, Other"`)
  so the orchestrator knows the vocabulary.
- **Keep the classification space small.** 3–6 categories work well. More than 10 degrades accuracy.
- **Always provide a fallback.** The orchestrator may not be confident — define a default (e.g.,
  `"Other"`) and handle it in `elseActions`.
- **`triggerCondition` cannot reference runtime variables.** Knowledge source filtering based on a
  runtime variable must be done inside an `OnKnowledgeRequested` topic using conditions and explicit
  `SearchAndSummarizeContent` nodes.
- **The variable is populated once at topic invocation.** It cannot be updated mid-topic by
  re-running orchestration.

---

## Upstream Reference

- **Source:** `microsoft/skills-for-copilot-studio` — `patterns/orchestrator-variables.md`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Noted dual applicability (classic + agentic), added Sopra enum-style
  description convention, and cross-referenced knowledge routing.
