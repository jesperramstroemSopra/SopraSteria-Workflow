## Environment Strategy

### Sopra Standard
- DEV for authoring
- TEST for automated verification
- UAT for business acceptance
- PROD for controlled runtime

### Decision Tree

Is the change still being designed?
- Yes -> DEV.
Is the change ready for validation?
- Yes -> TEST.
Is the change approved by business?
- Yes -> PROD only after UAT sign-off.

### Anti-Patterns

- Direct edits in PROD
- Using TEST as a sandbox
- Reusing production connections in DEV
