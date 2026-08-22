## Dataverse Plugin Patterns

### When to Use a Plugin
Use a plugin when the rule must run:
- atomically with the transaction,
- regardless of UI or flow entry point,
- and before data is committed.

### Sopra Pattern
1. Validate input early.
2. Fail fast with a clear `InvalidPluginExecutionException` message.
3. Keep plugins deterministic and short.
4. Push integration calls to async flow or queue where possible.

### Example
Before creating a leave request:
- ensure the employee exists,
- prevent overlapping requests,
- normalize date boundaries.

### Anti-Patterns

- Calling external APIs inside synchronous plugins
- Writing large orchestration logic in plugin code
- Depending on current user locale for business decisions

### Managed vs Unmanaged Posture

Register and package plugins in solutions; deploy managed to downstream environments and avoid hotfixing production directly.
