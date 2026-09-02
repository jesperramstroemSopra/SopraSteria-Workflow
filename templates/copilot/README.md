# GitHub Copilot Delivery Setup

Use this setup in a client project to combine Sopra-Workflow coordination with Microsoft execution
providers. Install only the providers needed by that project.

## 1. Install the plugin marketplaces

In GitHub Copilot CLI:

```text
/plugin marketplace add jesperramstroemSopra/SopraSteria-Workflow
/plugin marketplace add microsoft/copilot-studio-plugin
/plugin marketplace add microsoft/power-platform-skills
/plugin marketplace add microsoft/power-cat-skills
```

## 2. Install the baseline plugins

```text
/plugin install sopra-workflow@sopra-workflow
/plugin install mcs-assistant@copilot-studio-plugin
/plugin install power-automate@power-platform-skills
/plugin install powercat-dataverse@power-cat-skills
/plugin install powercat-overflow@power-cat-skills
```

For an existing Sopra-Workflow installation:

```text
/plugin update sopra-workflow@sopra-workflow
```

Optional:

```text
/plugin install powercat-governance@power-cat-skills
/plugin install powercat-architecture-advisor@power-cat-skills
```

Power Pages and mobile-app plugins are intentionally not part of this setup.

Restart the Copilot session after installing or updating plugins. Agent, skill, and MCP discovery
happens when a new session starts.

## 3. Verify capabilities

From the project directory:

```powershell
copilot plugins list --kind plugin --kind mcp --kind skill
```

This command does not list custom agents. Confirm these in the live session's custom-agent selector:

- Sopra Delivery Lead
- Sopra Solution Architect
- Sopra Solution Builder
- Sopra Solution Verifier
- Sopra Method Improver

Direct CLI selection:

```powershell
copilot --agent sopra-workflow:sopra-delivery-lead
```

Commands validate the active Sopra agent before stage work. A mismatch reports the selected agent,
requested command, recommended agent, and whether the command is routing-only or blocked. A slash
command does not switch the active custom agent; restart or select the recommended profile and rerun
the command.

For Power Automate, the Microsoft plugin bundles the FlowAgent MCP server. In Copilot CLI its tools
normally appear with a `flowagent-` prefix. If the Power Automate skills are present but the MCP
tools are not, invoke the plugin's `setup` skill.

For Copilot Studio, ensure `pac` is newer than 2.9.3 and authenticate through the supported PAC or
plugin flow when the selected specialist requests it.

The current `mcs-assistant` plugin provides Architect, Describer, Init, and Manage. Do not install
the superseded `skills-for-copilot-studio` plugin to obtain Advisor, Author, or Test profiles; using
both produces duplicate/conflicting agents. Testing beyond the current `/chat` capability requires
a separately supported provider.

## 4. Permissions

Keep host permissions narrow. Do not launch routine delivery sessions with all tools pre-approved.
Read and search operations can be allowed, while file writes, shell commands, MCP mutations, push,
publish, import, and deployment should remain confirmation-gated.

Agent instructions provide a workflow gate; host permissions provide a second enforcement layer.
Use both.

## 5. Optional additional MCP servers

The Microsoft Power Automate plugin already wires FlowAgent. Do not configure a duplicate FlowAgent
server.

For an additional Dataverse or approved customer MCP provider, copy
`mcp-servers.example.json` and replace the placeholders using that provider's documentation. Keep:

- server URL and tool names environment-specific;
- read tools separately allowlisted from mutation tools;
- secrets in the Copilot credential/secret store;
- environment IDs, URLs, and tokens out of the toolkit repository.

## 6. Recommended operator journey

1. Select **Sopra Delivery Lead** and describe the outcome.
2. The lead detects/resumes the stage and checks provider capabilities.
3. It delegates design/review to **Sopra Solution Architect**.
4. After plan approval, explicitly select or approve delegation to **Sopra Solution Builder**.
5. Confirm local edits and each live write/push/publish/deploy boundary separately.
6. Use **Sopra Solution Verifier** for independent evidence and release verdict.
7. Use **Sopra Method Improver** to capture a scrubbed learning candidate.

Each stage returns a short chat dashboard and a detailed artifact under `.sopra/workflow/`.

## 7. GitHub cloud-agent compatibility

For cloud execution, configure MCP servers at repository or organization level and use
`COPILOT_MCP_*` secrets/variables. Allowlist specific tools. GitHub cloud agents support MCP tools,
but not MCP resources/prompts, and remote OAuth-based MCP authentication may not be supported.

If the cloud runtime cannot authenticate to a Power Platform provider, the task must remain blocked
rather than silently becoming an unverified advisory task.
