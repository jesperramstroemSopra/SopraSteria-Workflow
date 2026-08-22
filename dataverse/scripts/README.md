## Dataverse Scripts

Use PowerShell for repeatable Dataverse setup, inspection, and cleanup tasks.

### Sopra Guidelines
- Keep scripts idempotent.
- Prefer parameterized scripts over one-off manual steps.
- Log the target environment, solution name, and entity names.

### Typical Uses
- Create/update environment variables
- Seed reference data
- Export solution metadata
- Validate naming and dependency rules

### Windows Example

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\scripts\Invoke-SeedData.ps1 -EnvironmentUrl "https://org.crm.dynamics.com" -Verbose
```

### Anti-Patterns

- Hardcoding secrets
- Using interactive prompts in CI automation
- Assuming developer-user connections in shared environments
