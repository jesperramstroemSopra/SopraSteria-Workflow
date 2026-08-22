## Child Flows Pattern

### When to Use
Use a child flow when multiple parent flows need the same reusable business operation.

### Sopra Contract Rules
- One clear input contract.
- One clear output contract.
- Version changes deliberately.

### Example

A `spr_ValidateEmployee` child flow can be reused by request, update, and onboarding flows.

### Anti-Patterns

- Passing giant object payloads when only two fields are needed
- Calling child flows for one-off logic
- Creating cyclic parent/child relationships

### Managed vs Unmanaged Posture

Publish child flows in the same managed solution family as their callers.
