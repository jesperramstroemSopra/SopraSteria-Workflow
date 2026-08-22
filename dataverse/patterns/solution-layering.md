## Dataverse Solution Layering

### Layer Model
- Base solution: core tables, choices, and shared components.
- Feature solution: app-specific forms, views, flows, and plugins.
- Hotfix solution: minimal corrective delta only.

### Sopra Rules
- Never duplicate the same component across feature solutions.
- Keep shared schema in a base layer and feature customizations on top.
- Document dependencies before export.

### Anti-Patterns

- Shipping unrelated fixes in one solution
- Rebinding the same environment variable in multiple layers
- Editing managed components in higher environments

### Managed vs Unmanaged Posture

Use unmanaged only in dev authoring; all promoted layers must be managed and versioned.
