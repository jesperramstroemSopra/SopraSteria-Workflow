# Tools and Setup

Deterministic, copy-pasteable setup for Sopra Power Platform work on Windows.

---

## 1. Base Tooling

| Tool | Minimum | Purpose |
|---|---|---|
| PowerShell | 7.x (or Windows PowerShell 5.1) | All repo commands assume PowerShell syntax |
| Git | 2.40+ | Source control |
| Visual Studio Code | Current | Editing YAML, Markdown, plugin code |
| .NET SDK | 8.0+ | Required to install `pac` as a global tool |
| Node.js | 18+ | Required by the Copilot Studio plugin helper scripts |
| Power Platform CLI (`pac`) | **> 2.9.3** | Solutions, environments, and Copilot Studio CLI authoring |

Verify everything at once:

```powershell
$PSVersionTable.PSVersion
git --version
dotnet --version
node --version
pac --version
```

---

## 2. Power Platform CLI

### Install

```powershell
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
```

### Upgrade

```powershell
dotnet tool update --global Microsoft.PowerApps.CLI.Tool
pac --version
```

> **⚠️ Version gate.** Copilot Studio CLI authoring requires `pac` **greater than 2.9.3**. On 2.9.3 or
> lower the `pac copilot` command group is missing or misbehaves. Check the version before you start —
> not after something fails.

Reference: <https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction>
NuGet feed: <https://www.nuget.org/packages/Microsoft.PowerApps.CLI>

### Authenticate

```powershell
# Interactive (developer workstation)
pac auth create

# Service principal (CI/CD)
pac auth create `
  --applicationId "<app-id>" `
  --clientSecret "<secret>" `
  --tenant "<tenant-id>" `
  --environment "<environment-url>"
```

Manage profiles:

```powershell
pac auth list
pac auth select --index <n>
pac auth delete --index <n>
```

If any remote command returns an auth or profile error, re-run `pac auth create` before debugging
anything else.

### Verify access

```powershell
pac env list
pac copilot list --environment "<environment-id>"
```

---

## 3. GitHub Copilot Plugins and Agent Team

### Sopra-Workflow

```text
/plugin marketplace add jesperramstroemSopra/SopraSteria-Workflow
/plugin install sopra-workflow@sopra-workflow
```

Update an existing installation with `/plugin update sopra-workflow@sopra-workflow`.

After installation, start a new session and select **Sopra Delivery Lead**. The plugin contributes
five custom agents; verify them in the live custom-agent selector because `copilot plugins list`
does not list agents.

### Copilot Studio (`mcs-assistant`)

Accelerates modern Copilot Studio authoring, description, management, initialization, and
classic→agentic migration.

```text
/plugin marketplace add microsoft/copilot-studio-plugin
/plugin install mcs-assistant@copilot-studio-plugin
```

Update:

```text
/plugin update mcs-assistant@copilot-studio-plugin
```

> **⚠️ Remove the predecessor.** If `skills-for-copilot-studio` is still installed, remove or disable
> it. It only supports classic orchestration and conflicts with `mcs-assistant`.

The current plugin provides Architect, Describer, Init, and Manage agents. It does not provide the
Advisor, Author, or Test profiles from the predecessor. Do not keep both plugins merely to recover
those profiles; use the provider routing and explicit blocked state instead.

> **⚠️ Experimental.** Microsoft states this plugin is a research project, not an officially supported
> product, and is not intended for production use. Sopra treats its output as a **draft accelerator**:
> review and validate all generated YAML, and never push it straight to UAT or PROD. See
> [`../../UPSTREAM_REFS.md`](../../UPSTREAM_REFS.md), entry 3.

Plugin state lives in `~/.copilot-studio-cli/` (paths, chat config, token cache) and survives plugin
updates. Token caches use Windows DPAPI where the native dependencies are available; if they are not,
the plugin falls back to a **plaintext** cache — do not accept that fallback on a shared machine.

### Power Automate (`power-automate`)

```text
/plugin marketplace add microsoft/power-platform-skills
/plugin install power-automate@power-platform-skills
```

This plugin bundles FlowAgent MCP. In Copilot CLI, its tools normally use the `flowagent-` prefix.
If the skills load but FlowAgent tools do not, invoke the plugin's `setup` skill. Do not configure a
duplicate FlowAgent server.

### Power CAT

```text
/plugin marketplace add microsoft/power-cat-skills
/plugin install powercat-dataverse@power-cat-skills
/plugin install powercat-overflow@power-cat-skills
```

Use Power CAT Dataverse for Web API query authoring and Overflow for full-solution Power Automate
review. Add governance or architecture-advisor plugins only when the project needs them.

Full local setup and optional MCP template:
[`../../templates/copilot/README.md`](../../templates/copilot/README.md).

---

## 4. Testing Prerequisites (Entra App Registration)

Chat-testing a CLI-authored agent needs a one-time public client app registration per tenant:

1. Entra ID → App registrations → New registration
2. *Accounts in this organizational directory only*; no redirect URI at creation
3. Authentication → Mobile and desktop applications → redirect URI **`http://localhost`** (HTTP, not HTTPS)
4. API permissions → Power Platform API → Delegated → **`CopilotStudio.Copilots.Invoke`**
5. Grant admin consent

The Power Platform API service principal may need tenant-admin registration first. Plan for that
dependency. Details:
[`../copilot-studio/cli-authoring.md`](../copilot-studio/cli-authoring.md#8-testing-a-cli-agent).

---

## 5. VS Code Extensions

| Extension | Why |
|---|---|
| Power Platform Tools | `pac` integration, solution explorer |
| YAML (Red Hat) | Schema validation and formatting for `*.mcs.yml` |
| GitLens | Reviewing agent YAML history |
| Markdown All in One | Editing this knowledge base |

---

## 6. Secrets

- **Never commit secrets.** No client secrets, connection IDs, tenant IDs, or tokens in the repo.
- Use environment variables or a secret store locally; GitHub Actions secrets in CI.
- Connections must use **named service accounts**, never a developer's personal connection.
- See [`environment-strategy.md`](environment-strategy.md) and
  [`naming-conventions.md`](naming-conventions.md).

---

## 7. Sopra Guidance

- Keep setup instructions deterministic and copy-pasteable.
- Prefer Windows paths and PowerShell syntax in all repository docs.
- Store environment-specific secrets outside the repo.
- Pin tool versions in CI; allow latest on developer workstations.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `pac` not recognised | Reopen the shell after install; confirm `~\.dotnet\tools` is on `PATH` |
| `pac copilot` subcommand missing | Version ≤ 2.9.3 — run `dotnet tool update --global Microsoft.PowerApps.CLI.Tool` |
| Auth or profile error | `pac auth create`, then `pac auth select` |
| Plugin scripts fail on `require` | Node.js older than 18 |
| Plugin warns about plaintext token cache | Native deps unavailable — do not use on a shared machine |
| Push fails on connection reference | Create the connection reference in the target environment first |
