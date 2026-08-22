# Sopra Playbooks — Field-Learned Knowledge

This is the part of the toolkit that cannot be Googled.

`knowledge/` holds the **standard** — how things are supposed to work, and how Sopra has decided to
build them. `playbooks/` holds the **reality** — what we discovered the hard way on real
engagements, and what is not in any Microsoft document.

Entries are written by `/sw-learn` (the `capture-learning` skill). Read them before designing,
reviewing or grilling anything.

## Confidentiality

Every entry here ships to every client engagement. **Entries must contain no client identity** — no
customer names, environment URLs, tenant or environment IDs, publisher prefixes, user names, or
business-revealing schema names. Lessons are generalized to the pattern, or they are not written
here at all.

If you spot an entry that leaks client detail, fix it immediately and tell the toolkit maintainer.

## Confidence levels

| Level | Meaning |
|---|---|
| `confirmed` | Reproduced on more than one engagement or environment |
| `probable` | Seen once, but the mechanism is understood |
| `unconfirmed` | Observed, cause unclear, may not generalize |

Cite the confidence level when you use an entry to justify a recommendation. Never present an
`unconfirmed` entry as established fact.

## Freshness

Platform behaviour changes. Every entry carries `first-observed` and `last-verified` dates. **An
entry not verified in the last 12 months should be treated as suspect** — a workaround for a bug
Microsoft has since fixed can be worse than no workaround at all.

When you confirm an entry still applies, update `last-verified`. When you find one no longer
applies, do not delete it — mark it resolved and record when and how it was fixed. That history is
useful.

## Index

Add every new entry here. An unindexed entry will not be found again.

| Title | Domain | Confidence | Last verified | File |
|---|---|---|---|---|
| _No entries yet — this collection grows with every engagement._ | | | | |

## Domains

```text
playbooks/
  copilot-studio/    Agents, agentic loop, CLI authoring, migration
  power-automate/    Cloud flows, connectors, triggers
  agent-flows/       Agent-invoked flows
  dataverse/         Tables, security, plugins, performance
  solutions/         Packaging, ALM, environment promotion
  cross-cutting/     Licensing, governance, identity, tenant-level behaviour
```

## Writing a good entry

The test: **could a colleague with no context on the engagement act on this?**

- One lesson per file.
- Lead with the trigger condition, not the story.
- Include the exact error text — that is what people search for.
- Say what you actually know, and say "unknown" where you don't.
- Record how to *detect* it, so future reviews catch it early.
