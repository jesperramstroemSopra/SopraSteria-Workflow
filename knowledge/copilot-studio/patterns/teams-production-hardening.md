# Teams Production Hardening (Classic)

> **Architecture:** Classic (topic-based) agents only.
> **Status:** Recommended — apply to all agents deployed to Microsoft Teams or M365 Copilot.

A coordinated framework of eight production patterns for classic Copilot Studio agents deployed to
Microsoft Teams (and, where applicable, M365 Copilot). The patterns share variables and depend on
each other — treat this as an end-to-end framework, not a pick-and-mix checklist.

---

## Shared Variables

| Variable | Set by | Read by | Purpose |
|---|---|---|---|
| `Global.InactiveConversation` | Pattern 2 | Pattern 3 | Signals session expiry after inactivity |
| `Global.UserContext` | Pattern 4 | Instructions, all topics | Structured user context (Country, Language) across channels |
| `Topic.Confirm` | Pattern 6 | Pattern 6 branches | Yes/No answer for restart-confirmation flow |

---

## The Eight Patterns

| # | Name | System Topic / Trigger |
|---|---|---|
| 1 | Handle app reinstalls | `OnInstallationUpdate` |
| 2 | Clear stale context after inactivity | `OnInactivity` |
| 3 | Notify user after inactivity reset | `OnActivity` (condition: `Global.InactiveConversation = true`) |
| 4 | Set global context variables cross-channel | `OnActivity` (low priority, condition: `IsBlank(Global.UserContext)`) |
| 5 | Rebuild Reset Conversation | `OnSystemRedirect` |
| 6 | Rebuild Start Over with diagnostics | System `StartOver` topic |
| 7 | Rebuild OnError with diagnostics and telemetry | System `OnError` topic |
| 8 | Configure suggested prompts | Agent-level settings |

---

## YAML Examples

### Pattern 1 — Handle app reinstalls

```yaml
kind: AdaptiveDialog
startBehavior: UseLatestPublishedContentAndCancelOtherTopics
beginDialog:
  kind: OnActivity
  id: main
  type: InstallationUpdate
  actions:
    - kind: BeginDialog
      id: Bqmh4L
      dialog: <agentSchemaName>.topic.ConversationStart
```

### Pattern 2 — Clear stale context after inactivity

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnInactivity
  id: main
  condition: =System.Activity.ChannelId = "msteams"
  durationInSeconds: 43200
  actions:
    - kind: ClearAllVariables
      id: mXHosp
      variables: ConversationHistory
    - kind: ClearAllVariables
      id: Vsemgr
    - kind: SetVariable
      id: setVariable_6CUITr
      variable: Global.InactiveConversation
      value: true
    - kind: CancelAllDialogs
      id: webE3j
inputType: {}
outputType: {}
```

### Pattern 3 — Notify after inactivity-triggered reset

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnActivity
  id: main
  condition: =Global.InactiveConversation = true
  type: Message
  actions:
    - kind: SetVariable
      id: setVariable_G6aAbW
      variable: Global.InactiveConversation
      value: false
    - kind: SendActivity
      id: sendActivity_pgGjvA
      activity:
        attachments:
          - kind: HeroCardTemplate
            title: Session expired
            subtitle: New conversation started
            text: ℹ️ Your previous session ended due to inactivity. Your query is now treated as new. Restart anytime.
            buttons:
              - kind: MessageBack
                title: Start over
                text: Start over
inputType: {}
outputType: {}
```

### Pattern 4 — Set global context variables cross-channel

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnActivity
  id: main
  priority: -2
  condition: =IsBlank(Global.UserContext)
  type: Message
  actions:
    - kind: SetVariable
      id: setVariable_kRbCMi
      variable: Global.UserContext
      value: |-
        ={
            Country: "NO",
            Language: "Norwegian"
        }
inputType: {}
outputType: {}
```

> **Sopra note:** Replace `Country` and `Language` defaults with values appropriate for the customer's primary user base.

### Pattern 5 — Rebuild Reset Conversation

```yaml
kind: AdaptiveDialog
startBehavior: UseLatestPublishedContentAndCancelOtherTopics
beginDialog:
  kind: OnSystemRedirect
  id: main
  actions:
    - kind: ClearAllVariables
      id: clearAllVariables_73bTFR
      variables: ConversationScopedVariables
    - kind: ClearAllVariables
      id: SLgE7u
      variables: ConversationHistory
    - kind: BeginDialog
      id: U14iCH
      dialog: <agentSchemaName>.topic.ConversationStart
    - kind: CancelAllDialogs
      id: cancelAllDialogs_12Gt21
```

### Pattern 7 — Telemetry logging node (inside OnError)

```yaml
- kind: LogCustomTelemetryEvent
  id: 9KwEAn
  eventName: OnErrorLog
  properties: "={ErrorMessage: System.Error.Message, ErrorCode: System.Error.Code, TimeUTC: Text(Now(), DateTimeFormat.UTC), ConversationId: System.Conversation.Id}"
```

---

## Pattern 6 Details — Start Over with diagnostics

Replace the default Boolean question with an Adaptive Card question using a closed-list `YesNo`
entity. The card must include:

- Confirmation header and explanation
- `Yes` / `No` action buttons
- Collapsed **Advanced options** panel with:
  - `Clear state` → `/debug clearstate`
  - `Clear history` → `/debug clearhistory`
  - `Conversation ID` → `/debug conversationid`
- Environment details: `System.Bot.EnvironmentId`, `System.Bot.TenantId`
- Agent details: `System.Bot.Name`, `System.Bot.Id`, `System.Bot.SchemaName`
- User details: `System.User.Language`, `System.User.Id`
- Conversation details: `System.Activity.ChannelId`, `System.Conversation.Id`, `Text(Now(), DateTimeFormat.UTC)`

**Setup steps:**
1. Create a closed-list entity `YesNo` with items `Yes` and `No`.
2. Open the system **Start Over** topic.
3. Replace the Boolean question node with a `Question` node using `ClosedListEntityReference` → `<agent>.entity.YesNo`, storing answer in `Topic.Confirm`.
4. Add `ConditionGroup` branches: `Yes` → Reset Conversation; `No` → `SendActivity: "Ok. Let's carry on."` + `RecognizeIntent`.

---

## Pattern 8 — Suggested Prompts

Configure at the **agent** level, not the topic level:

1. Agent → **Settings** → **Generative AI → Suggested prompts**
2. Add 3–4 prompts aligned to core capabilities
3. In YAML: `conversationStarters` block in `agent.mcs.yml` or `settings.mcs.yml`

---

## Validation Checklist

| Pattern | How to verify |
|---|---|
| 1 | Uninstall and reinstall the Teams app; verify Conversation Start greeting appears |
| 2 + 3 | Let conversation idle past `durationInSeconds`; send a message; verify session-expired Hero Card |
| 4 | Open in M365 Copilot; verify `Global.UserContext` populated before first answer |
| 5 | Confirm Yes in Pattern 6; verify history clears, Conversation Start reruns, context repopulates |
| 6 | Trigger Start Over; verify Adaptive Card shows confirmation + Advanced options with correct IDs |
| 7 | Force a runtime error; verify card shows message, code, conversation ID, UTC timestamp, and `OnErrorLog` telemetry |
| 8 | Start new conversation; verify suggested prompts appear in Teams and M365 Copilot |

---

## Sopra Conventions

- Apply patterns in order — earlier patterns establish variables that later ones read.
- Replace every `<agentSchemaName>` with the agent's schema prefix from `settings.mcs.yml`.
- `startBehavior: UseLatestPublishedContentAndCancelOtherTopics` is mandatory on Patterns 1, 5, and 7.
- Pattern 2 scopes inactivity to Teams via `System.Activity.ChannelId = "msteams"`. Remove or adapt if targeting other channels.
- Patterns 6 and 7 deliberately share the same Advanced options diagnostics to give users a consistent troubleshooting surface.
- This pattern complements `rai-error-handling.md`: handle RAI subcodes first, then let remaining errors fall through to the generic diagnostic card in Pattern 7.

---

## Upstream Reference

- **Source:** `microsoft/skills-for-copilot-studio` — `patterns/teams-production-hardening.md`
- **Accessed:** 2026-Q3
- **Note:** The upstream repo is marked superseded for new-agent work, but the classic-agent patterns
  it contains remain valid for any classic Copilot Studio deployment.
- **Sopra Divergence:** Added Sopra-specific validation checklist and naming conventions. Replaced
  generic placeholder values with Sopra-appropriate defaults.
