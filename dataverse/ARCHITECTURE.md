## Dataverse Architecture Guide

Dataverse is the system of record for Sopra business entities that require relational integrity, auditability, role-based security, or workflow integration.

## Managed vs Unmanaged Posture

- **Dev**: unmanaged only, for active schema authoring.
- **Test/UAT/Prod**: managed only, with a solution publisher prefix and no direct edits.

## Architecture Principles

- Model business nouns as tables, not as JSON blobs.
- Use relationships and choice columns before custom code.
- Favor ownership and security roles over application-side filtering.
- Treat plugins as last-mile enforcement, not as primary orchestration.

## Decision Tree

Is the data durable and shared across apps?
- No -> keep in app state or flow variables.
- Yes -> Is it a regulated or auditable business record?
  - Yes -> Dataverse table.
  - No -> Consider SharePoint, config, or file storage.

## Anti-Patterns

- Storing lookup labels instead of lookup IDs
- Overusing text columns for structured data
- Creating one table per report instead of per business concept
- Writing business rules in three places: app, flow, and plugin

## Upstream References

<!-- See UPSTREAM_REFS.md for Microsoft documentation and base references. -->
