# RAI Error Handling (Classic)

> **Architecture:** Classic (topic-based) agents only.
> **Model compatibility:** Azure OpenAI models only (GPT-4.1, GPT-5, etc.).
> Anthropic (Claude) and xAI (Grok) models use different safety mechanisms
> and do not produce these error codes.
> **Status:** Recommended for any agent handling sensitive topics.

Override the `OnError` system topic so Azure OpenAI Responsible AI (RAI) content-filter events
produce deliberate, category-specific user responses instead of a generic error.

---

## Azure OpenAI RAI Subcodes

All RAI errors arrive as `ContentFiltered`; `System.Error.SubCode` identifies the exact category:

| Subcode | What it catches |
|---|---|
| `OpenAIViolence` | Violent content, weapons, physical harm |
| `OpenAIHate` | Hateful or discriminatory content |
| `OpenAISexual` | Sexually explicit content |
| `OpenAISelfHarm` | Self-injury or suicide content |
| `OpenAIJailBreak` | **User** attempts to override system instructions / prompt injection |
| `OpenAIndirectAttack` | Prompt attacks embedded in **external data** (documents, knowledge sources) |

> **Spelling note:** `OpenAIndirectAttack` — not `OpenAIIndirectAttack`. This matches the Azure
> OpenAI API exactly. `OpenAIJailBreak` = user attacks the model; `OpenAIndirectAttack` = grounded
> document contains the attack.

---

## Two Approaches

### Approach 1 — Direct subcode check (primary, recommended)

Read `System.Error.SubCode` in a single `ConditionGroup`. Zero extra latency, zero credits.

```yaml
kind: AdaptiveDialog
startBehavior: UseLatestPublishedContentAndCancelOtherTopics
beginDialog:
  kind: OnError
  id: main
  actions:
    - kind: SetVariable
      id: setVariable_timestamp
      variable: init:Topic.CurrentTime
      value: =Text(Now(), DateTimeFormat.UTC)

    - kind: ConditionGroup
      id: conditionGroup_raiSwitch
      conditions:
        - id: conditionItem_selfHarm
          condition: =System.Error.SubCode = "OpenAISelfHarm"
          actions:
            - kind: SendActivity
              id: sendActivity_selfHarm
              activity: "[REPLACE] If you or someone you know is in crisis, please contact emergency services or a crisis helpline."

        - id: conditionItem_hate
          condition: =System.Error.SubCode = "OpenAIHate"
          actions:
            - kind: SendActivity
              id: sendActivity_hate
              activity: "[REPLACE] Your message was flagged for hateful or discriminatory content."

        - id: conditionItem_sexual
          condition: =System.Error.SubCode = "OpenAISexual"
          actions:
            - kind: SendActivity
              id: sendActivity_sexual
              activity: "[REPLACE] Your message was flagged for sexually explicit content."

        - id: conditionItem_violence
          condition: =System.Error.SubCode = "OpenAIViolence"
          actions:
            - kind: SendActivity
              id: sendActivity_violence
              activity: "[REPLACE] Your message was flagged for violent content. Please rephrase your request."

        - id: conditionItem_jailbreak
          condition: =System.Error.SubCode = "OpenAIJailBreak"
          actions:
            - kind: SendActivity
              id: sendActivity_jailbreak
              activity: "[REPLACE] Your message was flagged as an attempt to override system instructions."

        - id: conditionItem_indirectAttack
          condition: =System.Error.SubCode = "OpenAIndirectAttack"
          actions:
            - kind: SendActivity
              id: sendActivity_indirectAttack
              activity: "[REPLACE] A prompt injection attack was detected in external data. The request has been blocked."

      elseActions:
        - kind: SendActivity
          id: sendActivity_fallback
          activity: |-
            An error has occurred.
            Error code: {System.Error.Code}
            Error subcode: {System.Error.SubCode}
            Conversation Id: {System.Conversation.Id}
            Time (UTC): {Topic.CurrentTime}.

    - kind: LogCustomTelemetryEvent
      id: logTelemetry_rai
      eventName: OnErrorLog
      properties: "={ErrorMessage: System.Error.Message, ErrorCode: System.Error.Code, SubCode: System.Error.SubCode, TimeUTC: Topic.CurrentTime, ConversationId: System.Conversation.Id}"

    - kind: CancelAllDialogs
      id: cancelAll_rai

inputType: {}
outputType: {}
```

### Approach 2 — AI Builder classifier (secondary)

Add an AI Builder prompt between the timestamp and the `ConditionGroup` when you need
context-aware classification beyond the platform subcode. This adds ~4–6 s latency and requires
manual AI Builder model setup in Copilot Studio UI.

```yaml
    - kind: InvokeAIBuilderModelAction
      id: invokeAIBuilderModelAction_xxoZmJ
      input:
        binding:
          User_20Message: =System.Activity.Text
      output:
        binding:
          predictionOutput: Topic.ContentFilteringreason
      aIModelId: <YOUR_AI_BUILDER_MODEL_ID>
```

Switch the `ConditionGroup` conditions to check `Topic.ContentFilteringreason.text` instead of
`System.Error.SubCode`.

**AI Builder classifier prompt:**
```
Analyze the following user message and identify which Azure OpenAI Content Filter subcode
would be triggered. Output only the exact subcode — nothing else.

Subcodes: OpenAIViolence, OpenAIHate, OpenAISexual, OpenAISelfHarm,
          OpenAIJailBreak, OpenAIndirectAttack

OpenAIJailBreak = user tries to manipulate the model.
OpenAIndirectAttack = external/grounded data contains the attack.
```

---

## When to Use

- Agent handles sensitive topics where a generic error gives no actionable guidance.
- You need category-specific responses (e.g., crisis resources for `OpenAISelfHarm`).
- Administrators need telemetry on which RAI categories trigger most often.

---

## Sopra Conventions

- **Always use Approach 1 first.** `System.Error.SubCode` is provided by the platform at zero cost.
  Only add the AI Builder classifier if you need sub-category detail beyond the subcode.
- **Replace all `[REPLACE]` placeholders** with customer-approved text before UAT.
- This pattern **does not weaken** platform RAI filtering — it changes only the post-filter user experience.
- Always include `elseActions` — Azure OpenAI may add new subcodes in future releases.
- Combine with `teams-production-hardening.md`: handle RAI subcodes first, then let remaining errors
  fall through to the generic diagnostic card in Pattern 7 of that framework.
- `Topic.ContentFilteringreason` must match exactly everywhere (lowercase `r` in `reason`) in Approach 2.

---

## Upstream Reference

- **Source:** `microsoft/skills-for-copilot-studio` — `patterns/rai-error-handling.md`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Added Sopra labelling, combined usage guidance with `teams-production-hardening.md`, and clarified Azure OpenAI model restriction.
