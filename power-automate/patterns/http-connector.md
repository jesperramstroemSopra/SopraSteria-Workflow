## HTTP Connector Pattern

### Sopra Guidance
- Use HTTP only when the platform lacks a first-party connector.
- Store base URLs in environment variables.
- Send authentication through connection references or secure parameters.

### Windows/PowerShell Example

```powershell
Invoke-RestMethod -Method Get -Uri "https://example.contoso.com/api/status"
```

### Anti-Patterns

- Hardcoded tenant URLs in actions
- Repeating auth configuration in every flow
- Using HTTP for Dataverse CRUD when Dataverse connector exists

### Managed vs Unmanaged Posture

HTTP-based integrations must still ship through managed solutions in downstream environments.
