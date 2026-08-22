## Dataverse Operations Pattern

### Sopra Guidance
- Prefer Dataverse actions for create, update, delete, and list operations.
- Filter server-side rather than pulling large datasets into flow memory.
- Use alternate keys for upsert scenarios.

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
