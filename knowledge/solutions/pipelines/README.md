## Pipelines

This folder documents the approved CI/CD structure for Sopra solutions.

### Expectations
- Build once, deploy many.
- Gate imports with validation and approval.
- Keep pipeline variables environment-specific, not embedded in assets.

### Windows Example

```powershell
Get-ChildItem .\pipelines
Get-Content .\pipelines\release.ps1
```

### Anti-Patterns

- One-off manual deployment steps
- Secret values in pipeline scripts
- Rebuilding a different artifact for each environment
