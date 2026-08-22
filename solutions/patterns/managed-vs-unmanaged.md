## Managed vs Unmanaged Solutions

### Rule of Thumb
- Unmanaged = authoring.
- Managed = delivery.

### Decision Tree

Are you still changing component structure?
- Yes -> unmanaged in dev only.
- No -> managed package for promotion.

### Sopra Guidance

- Never troubleshoot production by importing unmanaged content.
- Never branch environment-specific edits into the solution layer.
- Use managed patches only for controlled hotfixes.

### Anti-Patterns

- Importing unmanaged exports into TEST
- Editing solution layers in downstream environments
- Treating managed solutions as if they were editable source
