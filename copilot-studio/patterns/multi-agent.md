## Multi-Agent Pattern

### Sopra Pattern
Use one orchestrator agent and a small set of specialist agents when the domain is broad or teams own separate subdomains.

### Decision Tree

Does one agent need too many unrelated topics?
- Yes -> split by business area.
Do separate teams own separate release cycles?
- Yes -> use specialist agents.
Do users need one entry point?
- Yes -> orchestrator routes to specialists.

### Example

- `EmployeeServiceAgent` routes to `LeaveAgent`, `PayrollAgent`, and `PolicyAgent`.

### Anti-Patterns

- Agents calling each other in loops
- Over-sharing context between specialists
- Using multi-agent design when one focused agent would suffice

### Managed vs Unmanaged Posture

Each agent should still be packaged in managed solutions for downstream environments.
