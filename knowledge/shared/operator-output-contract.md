# Operator Output Contract

Every Sopra-Workflow stage produces two synchronized output layers:

1. a concise operator dashboard in chat;
2. a detailed evidence artifact under `.sopra/workflow/<stage>/`.

The dashboard helps the operator decide what to do next. The artifact lets another consultant audit
or resume the work.

## 1. Chat dashboard

Use this order:

```markdown
**Outcome:** <one sentence>
**Status:** Complete | Partial | Blocked
**Scope:** <resource, project, environment, and architecture where relevant>
**Provider:** <agent, skill, MCP server, PAC command, or static analysis>
**Evidence:** <short statement with artifact path or validation result>
**Risks/decisions:** <only unresolved or material items>
**Next action:** <one owner and one action, or "None">
```

Omit a field only when it genuinely does not apply. Keep the dashboard concise; details belong in
the artifact.

## 2. Evidence artifact

Every artifact must include:

- task goal and scope;
- inputs and assumptions;
- detected technology and architecture;
- execution provider and capability state;
- actions performed;
- findings, changes, or test results;
- evidence and validation;
- decisions and approvals;
- blocked, skipped, or unverified items;
- rollback or recovery information for mutations;
- links to prior and next workflow artifacts.

For analysis, distinguish **observation**, **interpretation**, and **recommendation**. For
implementation, distinguish **planned**, **changed locally**, **pushed**, **published/deployed**, and
**verified**.

## 3. Evidence levels

| Claim | Minimum evidence |
|---|---|
| File changed | Exact path and relevant diff or validation |
| Static review complete | Scope inventory plus cited findings |
| Query valid | Parser/tool validation or successful execution |
| Live resource changed | Provider response identifying target and operation |
| Push complete | Successful push output |
| Publish/deployment complete | Successful publish/import/deployment output |
| Test passed | Test case, expected result, actual result, and evidence |
| Ready for release | Required checks passed and blockers resolved or explicitly accepted |

Do not use success-shaped language when evidence is missing.

## 4. Status rules

- **Complete** — every requested outcome is delivered and evidenced.
- **Partial** — useful work is complete, but an explicit subset remains.
- **Blocked** — continuation requires missing access, provider, authentication, approval, or a
  decision.

If a provider is unavailable, the agent may produce advisory material, but must label execution
blocked.

## 5. Presentation variants

The detailed artifact is the source. A customer, steering-group, technical, or operational view may
be generated from it, but presentation must not:

- invent findings;
- hide critical risks;
- remove uncertainty;
- expose internal-only or client-confidential details to the wrong audience;
- imply deployment or validation that did not happen.

When audience is unspecified, use the technical operator view.

