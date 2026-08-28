## Dataverse Operations Pattern

### Sopra Guidance
- Prefer Dataverse actions for create, update, delete, and list operations.
- Filter server-side rather than pulling large datasets into flow memory.
- Use alternate keys for upsert scenarios.
- For environment variable resolution in the new designer when dynamic-content parity is missing,
  read `environmentvariabledefinition` with related value and fallback to definition default.

### Decision Tree

Need one record?
- Use Get a row by ID or alternate key.
Need many records?
- Use List rows with OData filter.
Need a safe create-or-update?
- Use alternate key upsert pattern.

### Anti-Patterns

- List rows without a filter on large tables
- Using loops to simulate queries the connector can already do
- Moving raw Dataverse payloads through many actions unchanged
- Hardcoding per-environment URLs or IDs because an environment variable token was not available

### Environment Variable Resolution Workaround (new designer)

When an environment variable token is not available in dynamic content, resolve it through
Dataverse:

1. Query `environmentvariabledefinition` by schema name.
2. Read the related current value (`environmentvariablevalue`) when present.
3. Fallback to the definition default value when the current value is empty.
4. Fail fast if both are empty for required configuration.
