# PT System — Claude Code Instructions

## Role

You are the implementation agent for this repository.

The user handles architecture decisions and explanations separately. Focus on:

- inspecting relevant existing code
- implementing requested changes
- preserving current patterns
- verifying the result

Do not give long tutorials unless explicitly asked.

## Project

PT System is a personal trainer management system.

### Frontend

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Axios
- Recharts

Location:
`web/`

### Backend

- ASP.NET Core
- .NET
- EF Core
- MySQL
- JWT authentication

Location:
`backend/`

The web interface is for Trainers.
Client/mobile APIs also exist.

## Core Rules

- Keep implementations simple and readable.
- Do not overengineer.
- Prefer existing project patterns over introducing new patterns.
- Do not add libraries unless clearly necessary.
- Do not modify unrelated files.
- Do not redesign UI unless explicitly requested.
- Do not invent API endpoints or response fields.
- Do not use mock data when real API support exists.
- Do not silently change backend contracts.
- Preserve trainer ownership/security checks.
- Keep frontend validation aligned with backend DTO validation.
- Never expose or commit secrets.

## Token / Context Efficiency

Be efficient with repository inspection.

Before editing:

1. Read this `CLAUDE.md`.
2. Search for the relevant files/symbols.
3. Read only files needed for the current task.
4. Inspect related backend/frontend code only when required to confirm a contract.

Do NOT repeatedly audit or read the entire repository for small tasks.

Reuse knowledge discovered during the current session.

Do not produce long explanations after changes.
Give only:

- files changed
- what changed
- validation result
- important issue/blocker, if any

## Frontend Style

Preserve the existing PT System visual language:

- dark admin dashboard
- green primary accent
- compact and dense layouts
- minimal wasted space
- subtle borders
- consistent cards and controls
- responsive design

Very important:
**Do not interpret “professional” as adding large amounts of whitespace.**

Prefer:

- efficient use of width
- compact vertical spacing
- consistent page containers
- consistent card sizing
- consistent buttons and form controls

Same component type should look consistent across pages.

## Frontend Patterns

Reuse existing:

- `api`
- `Endpoints`
- `PageHeader`
- `BackLink`
- `Icon`
- shared status/empty/loading/dialog components
- pagination patterns
- API error/loading patterns

For server-backed lists:

- filtering/search must happen before pagination
- do not fake full-dataset search by filtering only the current page
- use backend query parameters when supported

Do not use `window.location.reload()` when local refetch/state updates are sufficient.

## Forms

For forms:

- controlled state
- simple validation
- submitting state
- visible API errors
- disable relevant submit action while saving
- preserve backend constraints

Do not add complex form libraries unless explicitly requested.

## Authentication

Current authentication uses JWT.

When touching auth:

- preserve role protection
- preserve trainer ownership checks
- do not weaken security
- do not change auth architecture without explicit approval

## Backend

Follow the existing structure:

Controller
→ Service interface
→ Service
→ EF Core
→ DTO response/request

Keep controllers thin.
Keep business/data logic in services.

Use async EF Core operations.

For trainer resources, always scope queries to the authenticated trainer where required.

## Database

Do not modify schema/migrations unless explicitly requested.

Do not guess entity relationships.
Inspect models/configuration first.

## Destructive Actions

For delete/reversal actions:

- use the existing confirmation-dialog pattern
- show loading state
- handle API failure
- avoid native `window.confirm()` if the shared dialog can be reused

## Git

Do NOT:

- commit
- push
- create branches
- amend commits

unless explicitly requested.

When a meaningful feature/fix is complete, tell the user:

`Good commit point`

and suggest one concise commit message.

## Verification

After frontend changes, run when applicable:

- TypeScript check
- ESLint
- `git diff --check`

After backend changes:

- `dotnet build`

For full-stack changes, run both frontend and backend checks.

Fix errors introduced by your changes before finishing.

Do not spend time fixing unrelated pre-existing warnings/errors unless necessary.

## Final Response

Keep the final response concise.

Use this format:

Changed:

- ...

Validation:

- ...

Notes:

- only important blockers or decisions

If everything is complete, do not add unnecessary suggestions.
