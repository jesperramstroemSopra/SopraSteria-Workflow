# Pattern: Canvas App Performance

> **Architecture track:** Canvas App
> **When to load:** When reviewing an existing app for performance issues, or before building a new app.

---

## The Performance Mental Model

Canvas Apps run formulas on the **client**. Every network call adds latency. The platform evaluates
formulas reactively — when an input changes, all dependent formulas re-evaluate. Understanding
these two facts explains most performance problems.

---

## Key Performance Levers

### 1. Named Formulas (App.Formulas)

Named Formulas are the most impactful single change available in modern Power Apps.

```powerfx
// App.Formulas — lazy, memoized, dependency-tracked
CurrentUser = Office365Users.MyProfileV2();
UserRole = LookUp(RoleAssignments, UserEmail = CurrentUser.mail, Role);
StatusOptions = Choices(Orders.Status);
```

- **Lazy**: only evaluated when first needed, not at app start.
- **Memoized**: evaluated once; cached until dependencies change.
- **No OnStart blocking**: the app loads while Named Formulas compute in the background.

Replace every `Set(gblX, ...)` in `App.OnStart` with a Named Formula where the value doesn't need to be imperatively set.

### 2. OnStart Minimization

`OnStart` blocks the splash screen. Every millisecond spent in `OnStart` is a millisecond the user sees a loading screen.

**Move to Named Formulas:** Lookup tables, user profile, role resolution.
**Move to OnVisible:** Any data the user only needs on a specific screen.
**Keep in OnStart only:** Truly app-wide imperative initialization that cannot be expressed declaratively (rare).

**Target:** OnStart should complete in under 1 second.

### 3. Concurrent Loading

When multiple independent data calls must happen at startup (if you still have them), use `Concurrent()`:

```powerfx
// Sequential — 3 calls × 500ms = 1500ms minimum
Set(gblUsers, Office365Users.SearchUser(...));
Set(gblCategories, Filter(Categories, Active));
Set(gblSettings, LookUp(Settings, IsDefault));

// Concurrent — all 3 in parallel = ~500ms
Concurrent(
    Set(gblUsers, Office365Users.SearchUser(...)),
    Set(gblCategories, Filter(Categories, Active)),
    Set(gblSettings, LookUp(Settings, IsDefault))
);
```

`Concurrent()` only helps when calls are truly independent (no output of A is input of B).

### 4. Gallery Binding

- Bind galleries directly to a **delegable Filter expression** — not to a collection loaded from the full table.
- Use `Items = Filter(DataSource, Predicate)` where `Predicate` is delegable (see [`delegation.md`](delegation.md)).
- Avoid galleries with `Lookup()` calls **inside each row** — this fires one call per visible row.
  - Instead: pre-join in the data source or use a collection built from a single call.

### 5. Image and Media

- Avoid storing full image binaries in Dataverse text or memo columns. Use Dataverse file/image columns or Azure Blob Storage.
- Resize images before displaying — do not rely on the app scaling large images.
- Set `ImagePosition = ImagePosition.Fill` (not `Stretch`) to avoid distortion without reprocessing.

### 6. Screen Navigation

- Do not preload all data across all screens at startup.
- Use `OnVisible` to load the data for the current screen; unload or clear on `OnHidden` if memory pressure is a concern.
- Avoid putting large galleries on the same screen as forms — they compete for rendering cycles.

---

## Performance Audit Checklist

This checklist maps to what Power CAT's `analyze-canvas-performance` skill checks automatically:

- [ ] `App.OnStart` has no data calls that could be Named Formulas
- [ ] Named Formulas used for user profile, role lookup, and static lookup data
- [ ] No delegation warnings on gallery `Items` formulas
- [ ] No `Lookup()` calls inside gallery row formulas
- [ ] `Concurrent()` used where independent startup calls remain
- [ ] No full-table `Collect()` without a bounded filter
- [ ] Images served from appropriate storage (not base64 in text columns)
- [ ] Screen data loaded in `OnVisible`, not `OnStart`
- [ ] Gallery items bound to a delegable expression, not a collection

---

## Anti-Patterns

| Anti-Pattern | Performance Impact | Fix |
|---|---|---|
| `Set(gblData, DataSource)` in OnStart with no filter | Blocks startup; downloads up to 500 rows | Named Formula or OnVisible + Filter |
| `Lookup()` per gallery row | N API calls for N visible rows | Pre-join at source; single-call collection |
| Sequential data calls that could be parallel | Additive latency | `Concurrent()` |
| `App.OnStart` > 2 seconds | Long startup; user abandons | Profile, convert to Named Formulas |
| `LoadingSpinner` on a timer instead of data state | Hides real problem | Bind spinner to `locIsLoading` flag |

---

## Tools

- **Power CAT `analyze-canvas-performance` skill** — automated audit of `pa.yaml` files; reports delegation warnings, OnStart usage, gallery binding issues. Run on any existing app before presenting findings.
- **Monitor tool** (in Power Apps Studio) — traces actual network calls and formula evaluation during a session. Use for diagnosing specific slow interactions.

---

## Upstream Reference

- **Source:** `microsoft/power-cat-skills` (powercat-canvas-apps / analyze-canvas-performance), `pnp/powerapps-samples`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra mandates Named Formulas as the first recommendation in any Canvas App performance review. Delegation warnings are treated as correctness bugs, not performance notes. The Power CAT performance skill is referenced as a complementary automated audit tool.
