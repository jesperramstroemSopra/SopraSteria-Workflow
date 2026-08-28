# Environment Variable Resolution in the New Flow Designer

**Domain:** power-automate  
**Confidence:** probable  
**First observed:** 2026-08  
**Last verified:** 2026-08

## Trigger

A flow built in the new designer needs environment-variable-backed configuration, but classic
dynamic-content parity is incomplete for some authoring paths.

## Lesson

Do not assume first-class classic token parity in the new designer for all environment-variable use
cases. When token support is missing, resolve environment variable values through Dataverse:
`environmentvariabledefinition` + related current value, with fallback to default value.

## Guardrail

- Treat environment variables as the mandatory source of environment-specific configuration.
- Implement a deterministic lookup path and explicit fallback behavior.
- Keep solution ALM bindings in place; do not hardcode per-environment values in actions.

## Detection

- The expected environment variable token cannot be selected in dynamic content.
- A migrated flow loses a previously available token reference path.
- Runtime failures show empty configuration values despite correct solution packaging.

## Recovery

1. Query Dataverse `environmentvariabledefinition` for the target schema name.
2. Expand/read the related current value (`environmentvariablevalue`) if present.
3. If no current value exists, use the definition default value.
4. Fail fast with a clear error if both are empty for a required setting.

