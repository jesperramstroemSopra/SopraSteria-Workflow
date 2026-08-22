## ALM Pipeline Pattern

### Sopra Pipeline
1. Commit source changes.
2. Build or export from dev.
3. Validate solution contents and dependencies.
4. Import into TEST.
5. Approve, then promote to UAT and PROD.

### Windows/PowerShell Example

```powershell
.\build.ps1
.\release.ps1 -SourceEnvironment "DEV" -TargetEnvironment "TEST"
```

### Anti-Patterns

- Manual export without source control traceability
- Skipping validation because the package "looks fine"
- Reusing a dev-only connection reference in downstream environments

### Managed vs Unmanaged Posture

The pipeline should convert dev unmanaged work into managed release artifacts before TEST.
