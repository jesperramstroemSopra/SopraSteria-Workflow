# Channel-Aware Behavior (Classic)

> **Architecture:** Classic (topic-based) agents only.
> **Status:** Experimental — validate channel IDs in your target surfaces before shipping.

Detect the host channel from `System.Activity.ChannelId` and gate behavior, Adaptive Card
variants, link types, or response length per surface.

---

## Why Channel Matters

Some agent capabilities render correctly in one channel but break in another:

- File-upload UX works differently in Teams vs. web chat
- Adaptive Cards render natively in Teams but may degrade in other surfaces
- "Join this Teams meeting" links are pointless when the user is already in Teams
- M365 Copilot (embedded) prefers shorter, citation-aware responses
- Voice channels need speech-specific output (no markdown, no emoji)

Without channel awareness, the agent offers broken affordances for users on the wrong surface.

---

## Critical: Compound Channel IDs

`System.Activity.ChannelId` can be a compound value: `base:subchannel`. Examples:

| Surface | ChannelId |
|---|---|
| Teams standalone agent | `msteams` |
| Agent inside M365 Copilot in Teams | `msteams:copilot` |
| M365 Copilot extension surface | `m365extensions` |
| Embedded web chat widget | `webchat` |
| Agent embedded in SharePoint | `webchat:sharepoint` |
| Direct Line REST/WebSocket | `directline` |
| Voice / speech clients | `directlinespeech` |
| Outlook | `outlook` |
| Dynamics 365 Omnichannel | `omnichannel` |

**Always use `StartsWith` for base-channel checks, not `=`.** A naive equality check misses
the `msteams:copilot` variant when the user is inside M365 Copilot in Teams.

Always `Lower()` before comparing — casing is not guaranteed across surfaces.

---

## YAML Example

A gate topic that reads the channel and branches:

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnRecognizedIntent
  id: main
  intent:
    triggerQueries:
      - what channel am I on
      - dump activity

  actions:
    - kind: SetVariable
      id: setPlatform
      variable: Global.ClientPlatform
      value: =System.Activity.ChannelId

    - kind: SetVariable
      id: setIsTeams
      variable: Global.IsTeamsClient
      value: =StartsWith(Lower(System.Activity.ChannelId), "msteams")

    - kind: SendActivity
      id: showState
      activity: "Channel: {Global.ClientPlatform} | IsTeams: {Global.IsTeamsClient}"

    - kind: ConditionGroup
      id: gate
      conditions:
        - id: blockOnTeams
          condition: =Global.IsTeamsClient
          actions:
            - kind: SendActivity
              id: blocked
              activity: This action is not available in Teams.
            - kind: EndDialog
              id: endTeams

      elseActions:
        - kind: SendActivity
          id: allowed
          activity: Continuing in non-Teams channel.
```

### Exposing channel to the orchestrator (optional)

In `settings.mcs.yml` or the Conversation Start topic, declare `Global.ClientPlatform` with
`aIVisibility: UseInAIContext` so the orchestrator can reason about it in instructions:

```yaml
instructions: |
  ## Surface Context
  The user is interacting via channel: {Global.ClientPlatform}
  When the channel starts with "msteams", prefer Teams-friendly Adaptive Cards.
```

> Without `aIVisibility: UseInAIContext`, the variable exists but the orchestrator ignores it.

---

## Lift Detection into a One-Shot Init Topic

If multiple topics need channel branching, avoid repeating the detection. Lift it into a single
`OnActivity` init topic (same shape as `jit-user-context`) that runs once per conversation and
sets `Global.ClientPlatform` and `Global.IsTeamsClient`:

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnActivity
  id: main
  condition: =IsBlank(Global.ClientPlatform)
  type: Message
  actions:
    - kind: SetVariable
      id: setChannel
      variable: Global.ClientPlatform
      value: =System.Activity.ChannelId
    - kind: SetVariable
      id: setIsTeams
      variable: Global.IsTeamsClient
      value: =StartsWith(Lower(System.Activity.ChannelId), "msteams")
inputType: {}
outputType: {}
```

---

## Sopra Conventions

- **Channel detection is not authorization.** A determined caller can spoof activities via Direct
  Line. Gate sensitive operations on the authenticated user identity (`System.User.PrincipalName`
  via Entra ID), not the channel.
- **Test pane is not a real channel.** The Copilot Studio test pane reports its own channel value
  that won't match production. Validate in the actual target channel.
- When in doubt, send `System.Activity.ChannelId` back to yourself via `SendActivity` during
  development to confirm the exact value.
- Teams hardening patterns (inactivity, reinstall, reset) are in `teams-production-hardening.md`
  and should be applied alongside channel-aware behavior.

---

## Upstream Reference

- **Source:** `microsoft/skills-for-copilot-studio` — `patterns/channel-aware-behavior.md`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Added the one-shot init topic pattern, the authorization safety note,
  and cross-reference to `teams-production-hardening.md`.
