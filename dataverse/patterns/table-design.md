## Table Design Pattern

### Sopra Rules
- One table = one business concept.
- Use plural display names only when the business already speaks that way; otherwise stay singular and consistent.
- Add an alternate key when external systems must upsert by natural identifier.
- Create indexes via alternate keys and lookup patterns, not by over-normalizing the schema.

### Example

For leave management:
- `spr_LeaveRequest`
- `spr_LeaveType`
- `spr_EmployeeProfile`

### Decision Tree

Need a new column?
- Is it an identity or relationship? -> lookup.
- Is it a fixed set of values? -> choice.
- Is it user-entered free text? -> text.
- Is it computed from existing data? -> calculated/rollup.

### Anti-Patterns

- Long text fields for IDs
- Duplication of employee name across all records
- Null-heavy columns that should be separate related records
- Mixing configuration and transactional data in one table
