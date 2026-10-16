# PT System

A personal trainer management system. Trainers use a web dashboard to manage clients, workout and meal plans, assignments, follow-up and payments. Clients use a mobile API to view their assigned workouts and meals and mark them completed or skipped.

## Features

**Trainer web app**
- Secure trainer login (JWT), protected routes, logout
- Clients: create, edit, credentials, deactivate/reactivate, permanent delete (only without history), search and filter
- Workout plans and meal plans: create with items in one step, edit, drag-and-drop ordering, delete protection for assigned plans
- Weekly schedule per client: assign, change plan or date, and remove workouts and meals (one workout and one meal plan per client per day)
- Follow-up: progress summary (completed / pending / skipped / missed) and a daily activity view
- Payments: add payments, mark Paid / Pending, filter by client, status, month and year
- Dashboard with totals, client growth and payment status charts

**Mobile API (for the client app)**
- Client login, profile, workouts with exercises, meals with instructions, complete/skip status updates, progress

## Tech stack

| Part | Technology |
|------|------------|
| Web (`web/`) | Next.js (App Router), React, TypeScript, Tailwind CSS, Axios, Recharts, dnd-kit |
| Backend (`backend/`) | ASP.NET Core (.NET 10), EF Core, MySQL, JWT Bearer authentication |

## Project structure

```
backend/   ASP.NET Core API (Controllers, Services, DTOs, Models, Migrations)
web/       Next.js trainer web application
docs/      API documentation (PT_System_API_Documentation.docx)
mobile/    Placeholder (the mobile app is not part of this repository)
```

## Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- Node.js 20 or newer and npm
- MySQL server (a MariaDB server also works)
- The EF Core CLI: `dotnet tool install --global dotnet-ef`

## Backend setup

The tracked `appsettings.json` contains no secrets. Provide the connection string and JWT signing key through user secrets (or environment variables) before running.

```bash
cd backend

# 1. Configuration (values are examples - use your own)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=ptsystem;User=<user>;Password=<password>;"
dotnet user-secrets set "Jwt:Key" "<a long random string, at least 32 bytes>"

# 2. Create / update the database schema
dotnet ef database update

# 3. Run the API
dotnet run
```

- The API listens on `http://localhost:5212` (and `https://localhost:7018` with the `https` profile).
- Migrations are not applied automatically when the app starts. Run `dotnet ef database update` after pulling new migrations.
- Environment variable equivalents: `ConnectionStrings__DefaultConnection` and `Jwt__Key`.
- `Jwt:Issuer` and `Jwt:Audience` have defaults in `appsettings.json`.
- The API refuses to start if `Jwt:Key` is missing or shorter than 32 bytes (UTF-8).

### JWT signing key in production

Production must use a fresh, randomly generated signing key (for example `openssl rand -base64 48`). Never reuse a development key or any value that has appeared in the repository or its history, and never commit it. Supply it only through secure environment configuration (`Jwt__Key` in the host's secret store). Changing the key signs everyone out; they log in again.

### Create the first trainer

There is no sign-up endpoint. Insert a trainer row directly (the password must be a BCrypt hash; username 3-50 and password 8-100 characters):

```bash
# Generate a BCrypt hash with Python (pip install bcrypt) - any BCrypt tool works
python3 -c "import bcrypt; print(bcrypt.hashpw(b'YourPassword123', bcrypt.gensalt(10)).decode())"
```

```sql
INSERT INTO Trainers (FullName, Username, Email, PasswordHash, CreatedAt)
VALUES ('Alex Trainer', 'trainer1', 'trainer@example.com', '<bcrypt hash>', UTC_TIMESTAMP());
```

Log in on the web app with that username and password. Clients are then created from the trainer dashboard.

## Web setup

```bash
cd web
npm install

# Tell the web app where the API is
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5212" > .env.local

npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`. Type check with `npx tsc --noEmit`.

The API allows requests from `http://localhost:3000` only (CORS). If you host the web app elsewhere, add its origin to the `Frontend` CORS policy in `backend/Program.cs`.

## Testing the mobile API

Create a client from the web app, then log in as that client:

```bash
curl -X POST http://localhost:5212/api/client/login \
  -H "Content-Type: application/json" \
  -d '{"username":"client1","password":"<client password>"}'

curl http://localhost:5212/api/client/workouts \
  -H "Authorization: Bearer <token>"
```

## Documentation

Full endpoint documentation (trainer and mobile APIs, models, enums, pagination, validation and business rules) is in [`docs/PT_System_API_Documentation.docx`](docs/PT_System_API_Documentation.docx).

## Key rules

- One workout assignment and one meal-plan assignment per client per calendar day (checked by the API and enforced by unique database indexes).
- Only active clients can log in or receive new assignments; only non-empty plans can be assigned.
- Deactivating a client (`PUT /api/clients/{id}/status`) keeps all payments, assignments and completion history; reactivating restores access.
- Permanent deletion (`DELETE /api/clients/{id}`) is only possible for clients with no payments or assignments; otherwise the API returns `409 Conflict`. The web app asks you to type the client's full name first. Database foreign keys (`Restrict`) enforce this even for concurrent requests.
- Workout and meal plans that have assignment history cannot be deleted.
- Workout and meal statuses are Pending / Completed / Skipped. A Pending item dated before today is reported as Missed (derived, not stored).
- Payments are Pending or Paid; Overdue is a display state for Pending payments past their due date.
- Trainers only see and modify their own data; clients only see their own data.

## Docker (backend)

`backend/Dockerfile` builds and runs the API on port `10000`. Provide `ConnectionStrings__DefaultConnection`, `Jwt__Key`, `Jwt__Issuer` and `Jwt__Audience` as environment variables, and apply migrations to the target database with `dotnet ef database update`.

## Automated tests (backend)

`backend.Tests` holds xUnit integration tests that start a disposable MySQL 8.4 container with Testcontainers, apply the real migrations and exercise the API. They never touch your development or production database. Docker must be running.

```bash
dotnet test backend.Tests
```

## Deploying migrations

Migration `RestrictClientHistoryDeletes` changes the foreign keys from clients to payments, workout assignments and meal assignments from `CASCADE` to `RESTRICT`. It only replaces constraints and does not change data. Back up the database, then run `dotnet ef database update`. Rolling it back (`dotnet ef database update AddUniqueDailyAssignmentIndexes`) restores cascading deletes, which would again let a client delete remove payments and history.
