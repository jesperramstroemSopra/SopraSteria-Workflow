## Tools and Setup

### Required Windows Tools
- PowerShell 7 or Windows PowerShell
- Git
- Power Platform CLI where the project requires it
- Visual Studio Code for editing

### Setup Pattern

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
git status
Get-ChildItem
```

### Sopra Guidance

- Keep setup instructions deterministic and copy-pasteable.
- Prefer Windows paths and PowerShell syntax in all repository docs.
- Store environment-specific secrets outside the repo.
