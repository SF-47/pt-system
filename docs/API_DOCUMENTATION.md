# PT System API Reference

This reference describes the current local backend controllers, DTOs, and services inspected on 2026-09-18. Examples use illustrative IDs and credentials. It documents implemented behavior; it is not a record of live integration testing.

## Contents

- [Connection and JSON conventions](#connection-and-json-conventions)
- [Authentication and access](#authentication-and-access)
- [Pagination](#pagination)
- [Errors and rate limits](#errors-and-rate-limits)
- [Endpoint reference](#endpoint-reference)
- [Behavior and statistics](#behavior-and-statistics)
- [Request and response schemas](#request-and-response-schemas)
- [Examples](#examples)
- [Source files](#source-files)

## Connection and JSON conventions

Local launch profiles in `backend/Properties/launchSettings.json` use `http://localhost:5212` and `https://localhost:7018`. Use the actual deployed host in other environments. HTTPS redirection is enabled; the HTTPS profile serves both local addresses.

All paths below are relative to the server origin and include `/api`. There is no API version segment. Send JSON request bodies with `Content-Type: application/json`; responses with bodies use JSON. JSON properties use camelCase. Success bodies are the stated DTO directly, without an additional `data` wrapper. `204 No Content` has no response body.

IDs are integers. Timestamps are ISO 8601 date-time strings. Send an explicit timezone, preferably UTC (for example `2026-09-18T09:00:00Z`). Request dates are stored as supplied; the code does not explicitly normalize them. Server-generated completion/payment times use UTC. Nullable fields can be JSON `null`.

Enums are JSON numbers; no string enum converter is configured:

| Enum | Value | Meaning |
|---|---|---|
| CompletionStatus | 0 | Pending |
| CompletionStatus | 1 | Completed |
| CompletionStatus | 2 | Skipped |
| PaymentStatus | 0 | Pending |
| PaymentStatus | 1 | Paid |

Money is a JSON number backed by .NET decimal. No currency field or currency conversion is implemented.

## Authentication and access

Call the relevant login endpoint, then include its returned token on protected requests:

```http
Authorization: Bearer <token>
```

Trainer endpoints require the `Trainer` role. Client endpoints require the `Client` role. Identity and ownership are taken from the token, not from a caller-supplied trainer ID. Tokens are signed with HS256 and issued with a one-hour expiry; validation checks signing key, issuer, audience and lifetime with the framework's default clock skew.

Client login rejects inactive accounts. Protected requests using Client tokens also check that the client still exists and is active. Trainer queries are scoped to that trainer; client queries are scoped to the authenticated client. Inaccessible individual resources generally return 404. The trainer's client-specific assignment/payment list endpoints return an empty paginated response for an absent or unowned client.

No registration, token refresh, or logout endpoint is implemented. Trainer accounts must already exist. Trainers create client accounts through `POST /api/clients`. Updating a client's credentials changes username/password; the current code does not explicitly invalidate previously issued tokens.

The configured browser CORS origin is `http://localhost:3000`, with any request header and method allowed. This does not replace bearer authorization.

## Pagination

Every endpoint marked **Paged** in the tables accepts exactly these query parameters:

| Parameter | Type | Default | Accepted values |
|---|---|---|---|
| page | integer | 1 | 1 through 2147483647 |
| pageSize | integer | 10 | 1 through 50 |

Example: `GET /api/clients?page=2&pageSize=20`. There are no implemented search, sort, date-range, or status query filters in these actions.

The response type `PagedResponse<T>` is:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "totalCount": 0,
  "totalPages": 0
}
```

`items` contains objects of type `T`. `totalCount` counts all matching owned records before pagination; `totalPages` is `ceil(totalCount / pageSize)`. An empty dataset has zero pages. A page beyond the available results returns empty `items` with the requested page values and unchanged totals. Offset calculations use long arithmetic and guard before casting for EF's integer `Skip`.

| Paged endpoint | Ordering |
|---|---|
| GET /api/clients | id ascending |
| GET /api/workout-plans | id ascending |
| GET /api/meal-plans | id ascending |
| GET /api/payments | dueDate descending, id descending |
| GET /api/clients/{clientId}/payments | dueDate descending, id descending |
| GET /api/clients/{clientId}/workout-plans | assignedDate descending, id descending |
| GET /api/clients/{clientId}/meal-plans | assignedDate descending, id descending |
| GET /api/client/workouts | assignedDate descending, assignment ID descending |
| GET /api/client/meals | assignedDate descending, assignment ID descending |

Nested exercises and meals are not independently paginated and have no explicit ordering guarantee.

## Errors and rate limits

| Status | Meaning |
|---|---|
| 400 | Invalid DTO validation, malformed JSON/query values, or pagination bounds |
| 401 | Invalid login, missing/invalid/expired bearer token, invalid identity claim, or inactive Client account |
| 403 | Authenticated token lacks the endpoint's required role |
| 404 | Requested individual resource does not exist or is outside the caller's ownership |
| 409 | Client username already exists |
| 415 | Unsupported body content type where JSON is expected |
| 429 | Rate limit exceeded |
| 500 | Unhandled server/database failure; no custom API-wide error contract is configured |

Controller/service message responses have this shape:

```json
{"message": "Username already exists."}
```

Login failures use `Invalid username or password.`; valid credentials for an inactive client use `Client account is inactive.`. Assignment service 404 messages include `Client not found.`, `Workout plan not found.`, `Workout assignment not found.`, `Meal plan not found.`, and `Meal assignment not found.`. Plain `NotFound()` and `Unauthorized()` actions do not define a custom message body; framework behavior may produce Problem Details. Authorization middleware responses should not be assumed to include a JSON message.

Automatic `[ApiController]` validation returns HTTP 400 with framework Validation Problem Details, including an `errors` object keyed by invalid field. Example shape (values such as trace ID vary):

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {"Username": ["The Username field is required."]},
  "traceId": "<request-trace-id>"
}
```

Trainer pagination messages are `Page must be at least 1.` and `Page size must be between 1 and 50.`. Client pagination uses `Page must be at least 1 and pageSize must be between 1 and 50.`.

Login endpoints share a fixed-window limit of 5 requests per minute per remote IP. Protected controller endpoints share a fixed-window limit of 100 requests per minute per role/user ID. No requests are queued. Rejected requests return HTTP 429:

```json
{"message": "Too many requests. Please try again later."}
```

## Endpoint reference

All path placeholders below are integer path parameters. Requests marked `—` have no body. Only Paged endpoints accept the pagination parameters above. All protected endpoints may additionally return 401, 403, and 429; body endpoints may additionally return 400/415.

### Login

Access: **Public**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `POST` | `/api/trainer/login` | `TrainerLoginRequest` | `200 TrainerLoginResponse` | 401 | Authenticate an existing trainer. |
| `POST` | `/api/client/login` | `ClientLoginRequest` | `200 ClientLoginResponse` | 401 | Authenticate an active client. |

### Clients

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/clients` | — | `200 PagedResponse<ClientResponse>` | 400 | Paged. List owned clients, including active and inactive accounts. |
| `GET` | `/api/clients/{id}` | — | `200 ClientResponse` | 404 | Get an owned client. |
| `POST` | `/api/clients` | `CreateClientRequest` | `201 ClientResponse` | 409 | Create a client for this trainer; includes Location header for its GET route. |
| `PUT` | `/api/clients/{id}` | `UpdateClientRequest` | `200 ClientResponse` | 404, 409 | Update profile, username, and active status. |
| `DELETE` | `/api/clients/{id}` | — | `204` | 404 | Delete the owned client; related deletion follows EF/database relationships. |
| `PUT` | `/api/clients/{id}/credentials` | `UpdateClientCredentialsRequest` | `204` | 404, 409 | Replace username and password. |

### Workout plans and exercises

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/workout-plans` | — | `200 PagedResponse<WorkoutPlanResponse>` | 400 | Paged. List owned plans, including nested exercises. |
| `GET` | `/api/workout-plans/{id}` | — | `200 WorkoutPlanResponse` | 404 | Get an owned plan with nested exercises. |
| `POST` | `/api/workout-plans` | `CreateWorkoutPlanRequest` | `201 WorkoutPlanResponse` | — | Create an owned plan; includes Location header for its GET route. |
| `PUT` | `/api/workout-plans/{id}` | `UpdateWorkoutPlanRequest` | `200 WorkoutPlanResponse` | 404 | Update plan name and description; nested items use separate endpoints. |
| `DELETE` | `/api/workout-plans/{id}` | — | `204` | 404 | Delete an owned plan; related deletion follows EF/database relationships. |
| `POST` | `/api/workout-plans/{id}/exercises` | `CreateExerciseRequest` | `200 ExerciseResponse` | 404 | Add a exercise to an owned plan. |
| `PUT` | `/api/exercises/{id}` | `UpdateExerciseRequest` | `200 ExerciseResponse` | 404 | Update an owned exercise. |
| `DELETE` | `/api/exercises/{id}` | — | `204` | 404 | Delete an owned exercise. |

### Meal plans and meals

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/meal-plans` | — | `200 PagedResponse<MealPlanResponse>` | 400 | Paged. List owned plans, including nested meals. |
| `GET` | `/api/meal-plans/{id}` | — | `200 MealPlanResponse` | 404 | Get an owned plan with nested meals. |
| `POST` | `/api/meal-plans` | `CreateMealPlanRequest` | `201 MealPlanResponse` | — | Create an owned plan; includes Location header for its GET route. |
| `PUT` | `/api/meal-plans/{id}` | `UpdateMealPlanRequest` | `200 MealPlanResponse` | 404 | Update plan name and description; nested items use separate endpoints. |
| `DELETE` | `/api/meal-plans/{id}` | — | `204` | 404 | Delete an owned plan; related deletion follows EF/database relationships. |
| `POST` | `/api/meal-plans/{id}/meals` | `CreateMealRequest` | `200 MealResponse` | 404 | Add a meal to an owned plan. |
| `PUT` | `/api/meals/{id}` | `UpdateMealRequest` | `200 MealResponse` | 404 | Update an owned meal. |
| `DELETE` | `/api/meals/{id}` | — | `204` | 404 | Delete an owned meal. |

### Workout assignments

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/clients/{clientId}/workout-plans` | — | `200 PagedResponse<WorkoutAssignmentResponse>` | 400 | Paged. List workout assignments belonging to this trainer's client. |
| `POST` | `/api/clients/{clientId}/workout-plans` | `AssignWorkoutPlanRequest` | `200 WorkoutAssignmentResponse` | 404 | Assign a trainer-owned plan to a trainer-owned client. |
| `PUT` | `/api/client-workout-plans/{id}` | `UpdateWorkoutAssignmentRequest` | `200 WorkoutAssignmentResponse` | 404 | Update assignment plan/date; id is an assignment ID. |
| `PUT` | `/api/client-workout-plans/{id}/status` | `UpdateWorkoutStatusRequest` | `200 WorkoutAssignmentResponse` | 404 | Update assignment completion status. |

### Meal assignments

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/clients/{clientId}/meal-plans` | — | `200 PagedResponse<MealAssignmentResponse>` | 400 | Paged. List meal assignments with nested meal status records. |
| `POST` | `/api/clients/{clientId}/meal-plans` | `AssignMealPlanRequest` | `200 MealAssignmentResponse` | 404 | Assign an owned meal plan to an owned client. |
| `PUT` | `/api/client-meal-plans/{id}` | `UpdateMealAssignmentRequest` | `200 MealAssignmentResponse` | 404 | Update assignment plan/date; id is an assignment ID. |
| `PUT` | `/api/client-meal-statuses/{id}/status` | `UpdateMealStatusRequest` | `200 MealStatusResponse` | 404 | Update an individual assigned meal; id is a meal status ID, not a meal definition ID. |

### Payments

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/payments` | — | `200 PagedResponse<PaymentResponse>` | 400 | Paged. List payments through Client.TrainerId ownership. |
| `GET` | `/api/clients/{clientId}/payments` | — | `200 PagedResponse<PaymentResponse>` | 400 | Paged. List payments for an owned client. |
| `POST` | `/api/clients/{clientId}/payments` | `CreatePaymentRequest` | `200 PaymentResponse` | 404 | Create a Pending payment for an owned client. |
| `PUT` | `/api/payments/{id}/status` | `UpdatePaymentStatusRequest` | `200 PaymentResponse` | 404 | Mark an owned payment Paid or Pending. |

### Trainer statistics

Access: **Trainer**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/stats/dashboard` | — | `200 DashboardStatsResponse` | — | Combined trainer summary. |
| `GET` | `/api/stats/clients` | — | `200 ClientStatsResponse` | — | Client counts by active state. |
| `GET` | `/api/stats/workouts` | — | `200 WorkoutStatsResponse` | — | Plan and assignment counts by completion state. |
| `GET` | `/api/stats/meals` | — | `200 MealStatsResponse` | — | Plan/assignment counts and individual meal status counts. |
| `GET` | `/api/stats/payments` | — | `200 PaymentStatsResponse` | — | Payment counts and sums by status. |

### Client self-service

Access: **Client**.

| Method | Path | JSON request schema | Success | Additional errors | Behavior |
|---|---|---|---|---|---|
| `GET` | `/api/client/profile` | — | `200 ClientProfileResponse` | 404 | Get the authenticated client profile. |
| `GET` | `/api/client/progress` | — | `200 ClientProgressResponse` | — | Get lifetime workout and individual meal status counts for the authenticated client. |
| `GET` | `/api/client/workouts` | — | `200 PagedResponse<MobileWorkoutResponse>` | 400 | Paged. List the authenticated client's assignments without exercises. |
| `GET` | `/api/client/workouts/{assignmentId}` | — | `200 MobileWorkoutDetailsResponse` | 404 | Get one owned workout assignment with exercises. |
| `PATCH` | `/api/client/workouts/{assignmentId}/status` | `UpdateWorkoutStatusRequest` | `204` | 404 | Update an owned workout assignment status. |
| `GET` | `/api/client/meals` | — | `200 PagedResponse<MobileMealPlanResponse>` | 400 | Paged. List assigned meal plans including meals/instructions/statuses. |
| `PATCH` | `/api/client/meals/{mealStatusId}/status` | `UpdateMealStatusRequest` | `204` | 404 | Update an owned individual meal status; use mealStatusId from the mobile response. |

### Development OpenAPI mapping

`Program.cs` calls `MapOpenApi()` only in Development, using the default `/openapi/v1.json` route. However, the current file does not call `AddOpenApi()` to register its required services. This mapping should not be treated as a working documentation endpoint until registration is configured. No Swagger UI route is configured. The application reference above is derived directly from controllers and DTOs.

## Behavior and statistics

- Create-client sets `isActive=true`. Username uniqueness is checked across all clients, including other trainers' clients. Profile PUT does not update passwords; credential PUT hashes and replaces the password. PUT request DTOs represent replacements of the listed fields, not partial patches; supply every field you intend to preserve.
- New workout assignments are Pending with `completedAt=null`. Changing assignment plan/date preserves its existing status/completion timestamp. Marking Completed writes the current UTC time; marking Pending or Skipped clears it. Repeating Completed updates the timestamp again.
- Meal assignment creates one Pending status record per meal currently in the plan. Changing the assigned meal plan deletes old status records and creates new Pending records for the replacement plan. Updating only date preserves statuses. Later edits to plan meals do not have an explicit synchronization operation for already-created assignments.
- New payments are Pending with `paidAt=null`. Marking Paid writes the current UTC time; marking Pending clears it. Repeating Paid updates the timestamp again. Due date does not automatically create an overdue status.
- Assigning plans checks both requested client ownership and selected plan ownership. Duplicate assignments are not explicitly rejected by these services.
- Statistics and client progress have no date-range filters and count all matching records, including history associated with inactive clients in trainer statistics. Client counts explicitly distinguish active/inactive.
- Workout statistics count workout plan definitions and workout assignment records; status totals refer to assignments.
- Meal statistics distinguish plan definitions, meal plan assignment records, and individual assigned meal status records. `completedMeals`, `pendingMeals`, and `skippedMeals` count status records, not entire plans.
- Dashboard pending meal count counts individual meal status records. Payment count and amount include only Pending payments; active client count applies only to clients.
- Payment statistics sum amounts separately for Paid and Pending records. Empty sums return zero. There is no currency grouping.
- Client progress `totalMeals` counts individual meal status records; `totalWorkouts` counts workout assignments.
- Statistics are calculated with sequential queries, without an explicit snapshot transaction. Concurrent writes can cause temporary differences between totals and component counts.

## Request and response schemas

The tables below list exact JSON property names, source types, and DTO validation attributes. `string?` and `DateTime?` are nullable. `List<T>` becomes an array of the referenced schema. Integer counts and IDs use `int`; amounts use `decimal`. Schema names are .NET DTO names and are not additional JSON wrappers.

`Required` is an actual source annotation. Unannotated non-nullable strings may also be subject to ASP.NET's implicit required validation. Non-nullable value types default to zero (DateTime defaults to its minimum value) when omitted unless another validation rule rejects the default. In particular, `[Required]` on a non-nullable DateTime does not enforce omission detection or a future/valid business date. Status DTOs default to Pending (0) if their status field is omitted. Boolean `isActive` defaults to false if omitted. Provide these values explicitly.

### Auth schemas

#### ClientLoginRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `username` | `string` | Required; StringLength(50, MinimumLength = 3) |
| `password` | `string` | Required; StringLength(100, MinimumLength = 8) |

#### ClientLoginResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `token` | `string` | — |
| `clientId` | `int` | — |
| `fullName` | `string` | — |
| `username` | `string` | — |

#### TrainerLoginRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `username` | `string` | Required; StringLength(50, MinimumLength = 3) |
| `password` | `string` | Required; StringLength(100, MinimumLength = 8) |

#### TrainerLoginResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `token` | `string` | — |
| `trainerId` | `int` | — |
| `fullName` | `string` | — |
| `username` | `string` | — |

### Clients schemas

#### ClientResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `trainerId` | `int` | — |
| `fullName` | `string` | — |
| `username` | `string` | — |
| `email` | `string?` | — |
| `phoneNumber` | `string` | — |
| `isActive` | `bool` | — |
| `createdAt` | `DateTime` | — |

#### CreateClientRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `fullName` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `username` | `string` | Required; StringLength(50, MinimumLength = 3) |
| `email` | `string?` | EmailAddress |
| `phoneNumber` | `string` | Required; StringLength(30, MinimumLength = 6) |
| `password` | `string` | Required; StringLength(100, MinimumLength = 8) |

#### UpdateClientCredentialsRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `username` | `string` | Required; StringLength(50, MinimumLength = 3) |
| `password` | `string` | Required; StringLength(100, MinimumLength = 8) |

#### UpdateClientRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `fullName` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `username` | `string` | Required; StringLength(50, MinimumLength = 3) |
| `email` | `string?` | EmailAddress |
| `phoneNumber` | `string` | Required; StringLength(30, MinimumLength = 6) |
| `isActive` | `bool` | — |

### Workouts schemas

#### CreateExerciseRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `description` | `string?` | StringLength(500) |
| `sets` | `int` | Range(1, 100) |
| `reps` | `int` | Range(1, 1000) |
| `restSeconds` | `int` | Range(0, 3600) |

#### CreateWorkoutPlanRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `description` | `string?` | StringLength(500) |

#### ExerciseResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `workoutPlanId` | `int` | — |
| `name` | `string` | — |
| `description` | `string?` | — |
| `sets` | `int` | — |
| `reps` | `int` | — |
| `restSeconds` | `int` | — |

#### UpdateExerciseRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `description` | `string?` | StringLength(500) |
| `sets` | `int` | Range(1, 100) |
| `reps` | `int` | Range(1, 1000) |
| `restSeconds` | `int` | Range(0, 3600) |

#### UpdateWorkoutPlanRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `description` | `string?` | StringLength(500) |

#### WorkoutPlanResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `trainerId` | `int` | — |
| `name` | `string` | — |
| `description` | `string?` | — |
| `createdAt` | `DateTime` | — |
| `exercises` | `List<ExerciseResponse>` | — |

### Meals schemas

#### CreateMealPlanRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `description` | `string?` | StringLength(500) |

#### CreateMealRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `instructions` | `string` | Required; StringLength(1000, MinimumLength = 2) |

#### MealPlanResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `trainerId` | `int` | — |
| `name` | `string` | — |
| `description` | `string?` | — |
| `createdAt` | `DateTime` | — |
| `meals` | `List<MealResponse>` | — |

#### MealResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `mealPlanId` | `int` | — |
| `name` | `string` | — |
| `instructions` | `string` | — |

#### UpdateMealPlanRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `description` | `string?` | StringLength(500) |

#### UpdateMealRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `name` | `string` | Required; StringLength(100, MinimumLength = 2) |
| `instructions` | `string` | Required; StringLength(1000, MinimumLength = 2) |

### WorkoutAssignments schemas

#### AssignWorkoutPlanRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `workoutPlanId` | `int` | Range(1, int.MaxValue) |
| `assignedDate` | `DateTime` | Required |

#### UpdateWorkoutAssignmentRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `workoutPlanId` | `int` | Range(1, int.MaxValue) |
| `assignedDate` | `DateTime` | Required |

#### UpdateWorkoutStatusRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `status` | `CompletionStatus` | EnumDataType(typeof(CompletionStatus)) |

#### WorkoutAssignmentResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `clientId` | `int` | — |
| `workoutPlanId` | `int` | — |
| `workoutPlanName` | `string` | — |
| `assignedDate` | `DateTime` | — |
| `status` | `CompletionStatus` | — |
| `completedAt` | `DateTime?` | — |

### MealAssignments schemas

#### AssignMealPlanRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `mealPlanId` | `int` | Range(1, int.MaxValue) |
| `assignedDate` | `DateTime` | Required |

#### MealAssignmentResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `clientId` | `int` | — |
| `mealPlanId` | `int` | — |
| `mealPlanName` | `string` | — |
| `assignedDate` | `DateTime` | — |
| `meals` | `List<MealStatusResponse>` | — |

#### MealStatusResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `mealId` | `int` | — |
| `mealName` | `string` | — |
| `status` | `CompletionStatus` | — |
| `completedAt` | `DateTime?` | — |

#### UpdateMealAssignmentRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `mealPlanId` | `int` | Range(1, int.MaxValue) |
| `assignedDate` | `DateTime` | Required |

#### UpdateMealStatusRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `status` | `CompletionStatus` | EnumDataType(typeof(CompletionStatus)) |

### Payments schemas

#### CreatePaymentRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `amount` | `decimal` | Range(typeof(decimal), "0.01", "99999999.99") |
| `dueDate` | `DateTime` | Required |

#### PaymentResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `clientId` | `int` | — |
| `clientName` | `string` | — |
| `amount` | `decimal` | — |
| `status` | `PaymentStatus` | — |
| `dueDate` | `DateTime` | — |
| `paidAt` | `DateTime?` | — |

#### UpdatePaymentStatusRequest

| JSON property | Source type | Validation attributes |
|---|---|---|
| `status` | `PaymentStatus` | EnumDataType(typeof(PaymentStatus)) |

### Mobile schemas

#### ClientProfileResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `fullName` | `string` | — |
| `username` | `string` | — |
| `email` | `string?` | — |
| `phoneNumber` | `string` | — |

#### ClientProgressResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `totalWorkouts` | `int` | — |
| `completedWorkouts` | `int` | — |
| `pendingWorkouts` | `int` | — |
| `skippedWorkouts` | `int` | — |
| `totalMeals` | `int` | — |
| `completedMeals` | `int` | — |
| `pendingMeals` | `int` | — |
| `skippedMeals` | `int` | — |

#### MobileExerciseResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `id` | `int` | — |
| `name` | `string` | — |
| `description` | `string?` | — |
| `sets` | `int` | — |
| `reps` | `int` | — |
| `restSeconds` | `int` | — |

#### MobileMealPlanResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `assignmentId` | `int` | — |
| `mealPlanId` | `int` | — |
| `mealPlanName` | `string` | — |
| `description` | `string?` | — |
| `assignedDate` | `DateTime` | — |
| `meals` | `List<MobileMealStatusResponse>` | — |

#### MobileMealStatusResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `mealStatusId` | `int` | — |
| `mealId` | `int` | — |
| `mealName` | `string` | — |
| `instructions` | `string` | — |
| `status` | `CompletionStatus` | — |
| `completedAt` | `DateTime?` | — |

#### MobileWorkoutDetailsResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `assignmentId` | `int` | — |
| `workoutPlanId` | `int` | — |
| `workoutPlanName` | `string` | — |
| `description` | `string?` | — |
| `assignedDate` | `DateTime` | — |
| `status` | `CompletionStatus` | — |
| `completedAt` | `DateTime?` | — |
| `exercises` | `List<MobileExerciseResponse>` | — |

#### MobileWorkoutResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `assignmentId` | `int` | — |
| `workoutPlanId` | `int` | — |
| `workoutPlanName` | `string` | — |
| `description` | `string?` | — |
| `assignedDate` | `DateTime` | — |
| `status` | `CompletionStatus` | — |
| `completedAt` | `DateTime?` | — |

### Stats schemas

#### ClientStatsResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `totalClients` | `int` | — |
| `activeClients` | `int` | — |
| `inactiveClients` | `int` | — |

#### DashboardStatsResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `totalClients` | `int` | — |
| `activeClients` | `int` | — |
| `totalWorkoutPlans` | `int` | — |
| `totalMealPlans` | `int` | — |
| `pendingWorkoutAssignments` | `int` | — |
| `pendingMealStatuses` | `int` | — |
| `pendingPayments` | `int` | — |
| `pendingPaymentAmount` | `decimal` | — |

#### MealStatsResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `totalPlans` | `int` | — |
| `totalAssignments` | `int` | — |
| `completedMeals` | `int` | — |
| `pendingMeals` | `int` | — |
| `skippedMeals` | `int` | — |

#### PaymentStatsResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `totalPayments` | `int` | — |
| `paidPayments` | `int` | — |
| `pendingPayments` | `int` | — |
| `totalPaidAmount` | `decimal` | — |
| `totalPendingAmount` | `decimal` | — |

#### WorkoutStatsResponse

| JSON property | Source type | Validation attributes |
|---|---|---|
| `totalPlans` | `int` | — |
| `totalAssignments` | `int` | — |
| `completedAssignments` | `int` | — |
| `pendingAssignments` | `int` | — |
| `skippedAssignments` | `int` | — |

### Common schemas

#### PagedResponse<T>

| JSON property | Source type | Validation attributes |
|---|---|---|
| `items` | `List<T>` | — |
| `page` | `int` | — |
| `pageSize` | `int` | — |
| `totalCount` | `int` | — |
| `totalPages` | `int` | — |

## Examples

Set a base URL for your environment. These placeholders must be replaced with credentials/tokens for actual accounts. Use your configured trusted development certificate for HTTPS.

### Trainer login

```bash
curl -X POST 'https://localhost:7018/api/trainer/login'   -H 'Content-Type: application/json'   -d '{"username":"trainer_demo","password":"example-password"}'
```

Success (200):

```json
{"token":"<trainer-jwt>","trainerId":1,"fullName":"Demo Trainer","username":"trainer_demo"}
```

Client login uses `POST /api/client/login` with the same request properties and returns `token`, `clientId`, `fullName`, and `username`.

### Create a client

```http
POST /api/clients
Authorization: Bearer <trainer-jwt>
Content-Type: application/json

{
  "fullName": "Demo Client",
  "username": "client_demo",
  "email": "client@example.com",
  "phoneNumber": "+96170000000",
  "password": "example-password"
}
```

Success (201, with Location pointing to `/api/clients/7`):

```json
{
  "id": 7,
  "trainerId": 1,
  "fullName": "Demo Client",
  "username": "client_demo",
  "email": "client@example.com",
  "phoneNumber": "+96170000000",
  "isActive": true,
  "createdAt": "2026-09-18T09:00:00Z"
}
```

### Create plans and nested items

Use a Trainer token with these JSON bodies:

| Endpoint | Example body |
|---|---|
| POST /api/workout-plans | `{"name":"Strength A","description":"Full body session"}` |
| POST /api/workout-plans/3/exercises | `{"name":"Squat","description":null,"sets":3,"reps":10,"restSeconds":60}` |
| POST /api/meal-plans | `{"name":"Daily meals","description":null}` |
| POST /api/meal-plans/4/meals | `{"name":"Breakfast","instructions":"Prepare oats and fruit."}` |

Plan creation returns 201; nested item creation returns 200. Update bodies use the same plan/item fields at their PUT routes.

### Assign workout and meal plans

```http
POST /api/clients/7/workout-plans
Authorization: Bearer <trainer-jwt>
Content-Type: application/json

{"workoutPlanId":3,"assignedDate":"2026-09-18T09:00:00Z"}
```

Success (200):

```json
{
  "id": 12,
  "clientId": 7,
  "workoutPlanId": 3,
  "workoutPlanName": "Strength A",
  "assignedDate": "2026-09-18T09:00:00Z",
  "status": 0,
  "completedAt": null
}
```

For meals, use `POST /api/clients/7/meal-plans` with `{"mealPlanId":4,"assignedDate":"2026-09-18T09:00:00Z"}`. The response is a MealAssignmentResponse with nested `meals`; each nested `id` is a meal status record ID. Assignment PUT bodies use the same plan ID and assignedDate fields.

### Paginated payments

```bash
curl 'https://localhost:7018/api/clients/7/payments?page=1&pageSize=10'   -H 'Authorization: Bearer <trainer-jwt>'
```

Success (200):

```json
{
  "items": [{
    "id": 15,
    "clientId": 7,
    "clientName": "Demo Client",
    "amount": 100.00,
    "status": 0,
    "dueDate": "2026-09-30T00:00:00Z",
    "paidAt": null
  }],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1,
  "totalPages": 1
}
```

Create that payment with `POST /api/clients/7/payments` and `{"amount":100.00,"dueDate":"2026-09-30T00:00:00Z"}`. Mark it Paid with `PUT /api/payments/15/status` and `{"status":1}`; both return a PaymentResponse (200).

### Client workout completion

```http
PATCH /api/client/workouts/12/status
Authorization: Bearer <client-jwt>
Content-Type: application/json

{"status":1}
```

Success is 204 with no body. Use the workout assignment ID, not the plan ID. For meal completion, use `PATCH /api/client/meals/23/status`, where 23 is the `mealStatusId` returned inside `GET /api/client/meals`.

### Dashboard statistics

```http
GET /api/stats/dashboard
Authorization: Bearer <trainer-jwt>
```

Illustrative success (200):

```json
{
  "totalClients": 10,
  "activeClients": 8,
  "totalWorkoutPlans": 3,
  "totalMealPlans": 2,
  "pendingWorkoutAssignments": 5,
  "pendingMealStatuses": 12,
  "pendingPayments": 4,
  "pendingPaymentAmount": 400.00
}
```

## Source files

- [Controllers](../backend/Controllers): route paths, verbs, authorization, pagination validation and HTTP statuses.
- [DTOs](../backend/DTOs): request validation and response field contracts.
- [Services](../backend/Services): ownership filters, ordering, state changes and statistics calculations.
- [Program.cs](../backend/Program.cs): middleware, bearer validation, rate limits, CORS and development OpenAPI mapping.
- [JwtService.cs](../backend/Services/Auth/JwtService.cs): token claims and issued lifetime.
- [launchSettings.json](../backend/Properties/launchSettings.json): local addresses.

Update this reference whenever a route, DTO, validation rule, or service behavior changes.
