## Solutions Architecture Guide

Solutions are the packaging boundary for Sopra Power Platform delivery.

### Principles
- One business capability, one solution family.
- Treat dependencies as first-class design inputs.
- Keep environment variables and connection references explicit.
- Version every export.

### Decision Tree

Need to deliver a change?
- Pure dev work -> unmanaged solution.
- Shared or promoted work -> managed solution.
- Emergency production correction -> smallest managed hotfix possible.

### Anti-Patterns

- Large monolithic release bundles
- Direct edits to managed components
- Missing dependency inventory before export

### Managed vs Unmanaged Posture

Only unmanaged in dev; every downstream environment must consume managed solutions.
