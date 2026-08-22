## Flow Error Handling

### Sopra Pattern
- Guard the trigger with early validation.
- Wrap risky actions with explicit failure branches.
- Use `Terminate` with a meaningful status and message.
- Log errors to Dataverse or a monitoring sink.

### Decision Tree

Will the action fail because of bad input?
- Yes -> validate before the action.
Will the action fail because of transient connectivity?
- Yes -> retry with backoff.
Will the action fail because business rules are violated?
- Yes -> stop the flow and return a human-readable message.

### Anti-Patterns

- Silent failures in Compose actions
- Catch-all scopes that hide the root cause
- Retrying validation errors
