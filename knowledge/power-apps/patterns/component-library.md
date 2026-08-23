# Pattern: Component Library

> **Architecture track:** Canvas App
> **When to load:** When designing reusable UI elements, or before starting a new Canvas App build.

---

## What a Component Library Is

A **Component Library** is a separate Canvas App published specifically to provide reusable
UI components — headers, footers, nav bars, status badges, form sections, card tiles — that
multiple Canvas Apps import and use.

It is **not** the same as the deprecated in-app component feature. Component Libraries are
standalone solution items with their own version lifecycle.

---

## When to Use

Use a Component Library when:
- More than one app in the project shares the same UI element.
- The customer has a design system or brand kit that must be applied consistently.
- A UI element has complex logic (e.g., a search bar with debounce, a status badge with color logic) that should not be duplicated.

Do not build a Component Library for a single-app project unless the customer explicitly needs one for future reuse.

---

## Structure

```
[ProjectPrefix] Component Library
├── cmpHeader              — Top navigation bar with user display name and back button
├── cmpFooter              — Footer with version info and help link
├── cmpStatusBadge         — Colored badge for status columns (input: StatusValue, output: none)
├── cmpConfirmDialog       — Modal confirmation dialog (input: Message, Title; output: Confirmed bool)
├── cmpSearchBar           — Debounced search input (output: SearchText string)
└── cmpLoadingSpinner      — Overlay spinner (input: IsVisible bool)
```

---

## Component Design Rules

### Input and Output Properties Only

Components communicate with the host app exclusively via **custom input properties** (app sets them)
and **custom output properties** (component exposes them). Components must not:
- Read global variables from the host app.
- Call `Navigate()` — pass a navigation callback via an output property or handle navigation in the host.
- Use `Set()` to write global variables.

This isolation is what makes components reusable across apps.

### Property Naming

| Property type | Convention | Example |
|---|---|---|
| Input: data | `[Noun]` | `StatusValue`, `UserRecord`, `ItemCount` |
| Input: behavior | `On[Event]` | `OnSelect`, `OnChange` |
| Input: style | `[Aspect]Color`, `[Aspect]Size` | `AccentColor`, `FontSize` |
| Output | `[Noun]` | `SearchText`, `IsConfirmed` |

### Avoid Heavy Logic in Components

Components are rendered per instance. If a component makes a data call, it makes that call for
every instance on the screen. Keep data calls in the screen, not in components. Pass data in via
input properties.

---

## Versioning and Publishing

1. Make changes in the Component Library app.
2. **Publish the Component Library** (separate publish from the consuming app).
3. In each consuming app: insert > component library > select the updated library and **update**.
4. Re-publish the consuming app.
5. Export the solution (component library + consuming apps together).

**Breaking changes** (renamed properties, removed properties) break all consuming apps. Treat them
like a breaking API change: communicate ahead of time and update all consumers in the same sprint.

---

## ALM Considerations

- The Component Library is a **separate solution component**. It must be in the solution alongside the apps that consume it.
- On import, the library imports before or with the apps (solution handles the order).
- Verify the component versions match after import — the consuming app records the library version it was published against.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Global variable read inside a component | Breaks reusability; hidden dependency | Pass data as input property |
| Data call inside a component gallery | N calls for N instances | Call data in the screen, pass results in |
| Naming components `Component1`, `Component2` | Undiscoverable | Use `cmp[Function]` naming |
| One giant "utility" component | Hard to maintain, forces consumers to take all or nothing | One component per UI concept |
| Modifying the Component Library without updating consumers | App uses stale version | Always update and republish consumers after library change |

---

## Upstream Reference

- **Source:** `pnp/powerapps-samples`, Microsoft Learn Canvas component library documentation
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra mandates Component Libraries as separate solution items (not in-app components) and prohibits global variable access inside components. One library per project unless the customer has a shared design system.
