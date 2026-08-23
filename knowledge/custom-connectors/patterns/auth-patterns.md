# Pattern: Custom Connector Authentication

> **Architecture track:** Custom Connectors
> **When to load:** Before configuring auth on a new custom connector, or when troubleshooting auth failures.

---

## Auth Type Selection

```
What does the external API require?
├─ No auth (private network, test only) → No Authentication
├─ Static key in header or query param → API Key
├─ HTTP Basic (username/password) → Basic
├─ OAuth — user must consent/login → OAuth 2.0 Authorization Code
├─ Service-to-service, no user → OAuth 2.0 Client Credentials
├─ On-premises system → Windows (with on-premises gateway)
└─ Microsoft 365 / Entra ID API → Service Principal / OAuth 2.0
```

---

## OAuth 2.0 — Authorization Code

Use when end users must authenticate and grant consent to access their data.

### App Registration (Entra ID)

1. Register the app in **Microsoft Entra ID** (or the external IdP).
2. Add redirect URI: `https://global.consent.azure-apim.net/redirect`
   - For sovereign clouds: use the region-specific endpoint.
3. Add the required API scopes (principle of least privilege).
4. Note the **Client ID** and **Tenant ID**.
5. Create a **Client Secret** (or certificate) and note the expiry.

### Connector Configuration

```yaml
authorizationUrl: https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize
tokenUrl: https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
refreshUrl: https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
scopes:
  - https://yourapi.example.com/.default
clientId: (from app registration)
clientSecret: (stored as connection parameter — never hardcoded in definition)
```

The client secret is stored per-connection, not in the connector definition. Each user or service
account creates their own connection.

---

## OAuth 2.0 — Client Credentials

Use for automated flows where no user is present (service-to-service).

### App Registration

1. Register the app in Entra ID.
2. No redirect URI needed.
3. Grant **Application permissions** (not Delegated) — these apply without a user.
4. Admin consent required for Application permissions.
5. Create a Client Secret or **certificate** (certificate preferred for production).

### Secret Rotation

- Document the secret expiry date.
- Set an **Azure Monitor alert** or calendar reminder 30 days before expiry.
- On rotation: update the connector connection in every environment. This is a breaking change if not planned.
- For certificates: use a Key Vault reference where the API supports it.

### Connector Configuration

The connector uses the OAuth 2.0 client credentials grant:
- `tokenUrl` points to the token endpoint.
- The flow grants the token to the connector at connection creation time.
- The connection stores the token; the connector refreshes it automatically.

---

## API Key Auth

Use for APIs that authenticate via a static key in a header or query parameter.

```
Connection parameter name: apiKey
Parameter type: securestring
Placement: header (most common) or query
Header name: X-API-Key (or whatever the API requires)
```

- The key is stored per-connection, encrypted.
- Key rotation requires updating the connection in every environment.
- **Do not use API key auth for APIs that handle personal or regulated data** — the key cannot be scoped to a user and grants full access.

---

## Common Auth Failures

| Symptom | Likely Cause | Fix |
|---|---|---|
| `401 Unauthorized` on first call | Connection not authenticated | Re-create the connection; check client ID/secret |
| `401` after working briefly | Token expired and refresh failed | Check refresh token URL; verify secret hasn't expired |
| `403 Forbidden` | Authenticated but not authorized | Check API permissions on the app registration; admin consent |
| `redirect_uri_mismatch` | App registration missing Power Platform redirect URI | Add `https://global.consent.azure-apim.net/redirect` |
| Consent screen loops | Token not being stored | Check connector definition for missing `refreshUrl` |
| `invalid_client` | Wrong client ID or expired secret | Verify app registration; regenerate secret if expired |

---

## Upstream Reference

- **Source:** Microsoft Learn — Custom connector authentication docs, `microsoft/PowerApps-Samples`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra mandates certificates over secrets for production client-credential connections. Secret expiry documentation and alerting are required deliverables, not optional.
