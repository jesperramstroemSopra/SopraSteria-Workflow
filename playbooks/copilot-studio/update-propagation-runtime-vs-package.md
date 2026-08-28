# Update Propagation: Runtime vs Package Changes in Copilot Studio

**Domain:** copilot-studio  
**Confidence:** probable  
**First observed:** 2026-08  
**Last verified:** 2026-08

## Trigger

An agent change appears to "partly work": conversational behavior updates are visible, while
suggested prompts or app-surface metadata stay old for existing users.

## Lesson

Not all Copilot Studio changes propagate through the same path. Runtime behavior updates and
manifest/package-bound updates can have different rollout timing and mechanisms.

## Guardrail

- Classify each change as **runtime** or **package-bound** before planning rollout.
- For package-bound changes, include explicit versioning and distribution steps.

## Detection

- Prompt behavior changes are visible in chat, but suggested prompts remain outdated.
- Two users report different "current" experiences after the same publish.
- Admin center or app catalog still shows prior metadata after a draft update.

## Recovery

1. Confirm the changed artifact type (runtime vs package-bound).
2. If package-bound, publish and ensure version bump/distribution path is complete.
3. Validate with a user on an existing install and a clean/new install path.

