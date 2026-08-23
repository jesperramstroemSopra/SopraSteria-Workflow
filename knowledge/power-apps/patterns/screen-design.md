# Pattern: Screen Design for Canvas Apps

> **Architecture track:** Canvas App
> **When to load:** Before designing any Canvas App screen structure or navigation.

---

## Principles

A screen represents a **user task**, not a data table. The same Dataverse table may appear on
multiple screens (list, detail, edit, approval) — that is correct. A screen named after a table
(`EmployeeScreen`, `OrderScreen`) is almost always the wrong abstraction.

---

## Standard Screen Types

### 1. Home / Navigation Screen

- Entry point shown after the splash screen loads.
- Shows role-appropriate tiles or navigation to primary tasks.
- Role check: `If(gblCurrentUserRole = "Manager", Navigate(scrManagerHome), Navigate(scrStaffHome))`.
- Do not load data on this screen — only navigate.

### 2. List Screen

- Shows a filterable, searchable gallery of records.
- Binds to a **delegable** data source expression — see [`delegation.md`](delegation.md).
- Search bar bound to a text input; filter predicate uses `Filter(DataSource, StartsWith(Title, txtSearch.Text))` or equivalent delegable function.
- Pagination: use `LoadData` / `SaveData` patterns or explicit page-size limits (`FirstN(Filter(...), 50)`).
- Selecting a record navigates to the Detail screen and sets a context or global variable: `Navigate(scrOrderDetail, None, {locSelectedOrder: ThisItem})`.

### 3. Detail Screen

- Read-only view of a single record.
- Bind to the record variable set by the List screen.
- Provides Edit and Back navigation.
- Use `DisplayForm` bound to `Form1.Item = locSelectedOrder`.

### 4. Edit / Create Screen

- Use `EditForm`. Mode set by `NewForm(Form1)` (create) or `EditForm(Form1)` (edit).
- Submit via `SubmitForm(Form1)`.
- Handle `OnSuccess`: `Navigate(scrOrderDetail, None, {locSelectedOrder: Form1.LastSubmit})`.
- Handle `OnFailure`: `Notify(Form1.Error, NotificationType.Error)`.

### 5. Action / Confirmation Screen

- For destructive or irreversible actions (delete, submit, approve).
- Shows a summary of what will happen, requires explicit confirmation.
- Keep it single-purpose: one action per action screen.

### 6. Admin / Config Screen

- Not shown in the main navigation — accessible only via a dedicated admin button or role-guard.
- Role guard in `OnVisible`: `If(gblCurrentUserRole <> "Admin", Navigate(scrHome))`.

---

## Navigation Conventions

- Always use `Navigate()` with the `None` transition unless animation is intentional.
- Pass selected context via `Navigate(scrTarget, None, {locRecord: ThisItem})` rather than global variables where possible.
- Provide a **Back** button on every non-home screen. Do not rely on the device back button.
- Deep links: if the app must open directly to a specific record (e.g., from a Teams message), handle the startup record ID via `Param("recordId")` in `App.OnStart` or a Named Formula.

---

## Screen Naming

| Screen | Naming Pattern | Example |
|---|---|---|
| Home/landing | `scrHome`, `scrDashboard` | `scrHome` |
| List | `scr[Entity]List` | `scrOrderList` |
| Detail (read) | `scr[Entity]Detail` | `scrOrderDetail` |
| Edit/Create | `scr[Entity]Edit` | `scrOrderEdit` |
| Action | `scr[Action]` | `scrSubmitApproval`, `scrConfirmDelete` |
| Admin | `scrAdmin[Area]` | `scrAdminSettings` |
| Error / Offline | `scrError`, `scrOffline` | `scrError` |

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Loading all records in OnStart into a collection | Slow start; often delegates incorrectly | Use OnVisible + delegable Filter instead |
| One screen per table | Maps data model, not user tasks | Redesign by task |
| Using global variables as navigation context for every screen | Hard to debug, state leaks | Use Navigate context parameters or `locSelectedX` |
| No loading indicator | User sees blank gallery while data loads | Set `locIsLoading = true` before call, `false` in `OnSuccess`/`OnFailure` |
| Form and gallery on same screen | Coupling; forces reload on submit | Separate list and edit screens |

---

## Upstream Reference

- **Source:** `pnp/powerapps-samples`, `microsoft/power-cat-skills` (powercat-canvas-apps)
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra enforces a dedicated action/confirmation screen for destructive operations and mandates explicit role guards on admin screens via `OnVisible`.
