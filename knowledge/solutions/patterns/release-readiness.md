# Pattern: Release Readiness

> **Architecture track:** Solutions / ALM
> **When to load:** Before promoting a solution to TEST, UAT, or PROD.

---

## Release Checklist

- Managed solution only
- Connection references bound in target environment
- Environment variables populated
- Plugin/flow/app dependencies resolved
- Solution checker clean or consciously waived
- Version and publisher consistent with naming standards

---

## Anti-Patterns

| Anti-Pattern | Risk | Fix |
|---|---|---|
| Promoting unmanaged content | Breaks ALM discipline | Export and import managed |
| Missing connection reference binding | Solution fails at runtime | Bind before enabling users |
| Skipping dependency validation | Import failure or partial runtime breakage | Validate before release |

---

## Upstream Reference

- **Source:** `microsoft/PowerApps-Samples`, `microsoft/powerplatform`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra treats release readiness as a mandatory gate, not a post-import cleanup step.
