## Solution Environment Strategy

### Sopra Standard Environments
- DEV: build and author.
- TEST: automated validation.
- UAT: business sign-off.
- PROD: controlled managed release.

### Decision Tree

Need a new environment?
- Is it for authoring? -> DEV.
- Is it for validation? -> TEST.
- Is it for user approval? -> UAT.
- Is it for live traffic? -> PROD.

### Anti-Patterns

- Multiple DEV environments with no ownership
- Deploying the same solution version by ad hoc copy
- Sharing test connections with production traffic

### Managed vs Unmanaged Posture

DEV may be unmanaged; all later stages must be managed and immutable by default.
