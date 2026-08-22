## Dataverse Security Model

### Sopra Approach
- Use business units for release and ownership boundaries.
- Use security roles for capability access.
- Use team ownership for shared operational records.
- Use field-level security only for truly sensitive attributes.

### Managed vs Unmanaged Posture

Security roles and table permissions are authored in unmanaged dev solutions and promoted as managed artifacts to higher environments.

### Example

For a service desk app:
- `spr_ServiceDeskAgent` can create and update cases.
- `spr_ServiceDeskSupervisor` can reassign and approve escalations.
- `spr_AuditReader` can read records but not modify them.

### Anti-Patterns

- Granting System Administrator to bypass role design
- Sharing records manually as a primary access model
- Embedding security checks only in Power Apps UI
- Exposing PII fields without field-level controls
