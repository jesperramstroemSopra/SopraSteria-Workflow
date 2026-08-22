# GitHub Actions Workflows — Power Platform CI/CD

This directory contains GitHub Actions workflows for automating Power Platform solution lifecycle management — exporting solutions from development environments, validating them, and importing to higher environments.

---

## Workflows

| File | Trigger | Purpose |
|------|---------|---------|
| `solution-export-import.yml` | `push` to `main`, `pull_request`, `workflow_dispatch` | Export solution from DEV, validate, import to target environment |

---

## How Solution Export/Import Works

### Export Flow (on push to `main` or manual trigger)

1. Authenticate to Power Platform using a service principal (client credentials)
2. Export the **unmanaged** solution from the DEV environment (for source control)
3. Export the **managed** solution from the DEV environment (for deployment)
4. Upload both as GitHub Actions artifacts

### Validation Flow (on pull request)

1. Authenticate to Power Platform
2. Run the Power Platform Checker (Solution Checker) against the solution
3. Report results as PR checks

### Import Flow (on push to `main` or manual trigger)

1. Download the managed solution artifact
2. Authenticate to the target environment
3. Swap connection references and environment variables for the target
4. Import the managed solution

---

## Required Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Description |
|-------------|-------------|
| `PP_CLIENT_ID` | Azure AD Application (client) ID for the service principal |
| `PP_TENANT_ID` | Azure AD Tenant ID |
| `PP_CLIENT_SECRET` | Client secret for the service principal |
| `PP_DEV_URL` | Power Platform DEV environment URL (e.g., `https://sopra-dev.crm4.dynamics.com`) |
| `PP_TARGET_URL` | Target environment URL (TEST/UAT/PROD) for imports |

---

## Service Principal Setup

The service principal must have the **System Administrator** security role in each Power Platform environment it operates in, and must be registered as an Application User in each environment.

```powershell
# Add application user to environment using PAC CLI
pac admin assign-group --environment "https://sopra-dev.crm4.dynamics.com" `
  --group "00000000-0000-0000-0000-000000000000" `
  --role "System Administrator"
```

See [`shared/tools-and-setup.md`((../../shared/tools-and-setup.md) for full setup instructions.

---

## Upstream Reference

<!-- Upstream: microsoft/powerplatform-actions — workflow structure and action names -->
<!-- Sopra Divergence: Added connection reference swap step before import; upstream samples omit this -->

These workflows use `microsoft/powerplatform-actions`. See [`UPSTREAM_REFS.md`((../../UPSTREAM_REFS.md) for version pinning policy.
