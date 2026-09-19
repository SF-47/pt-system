# PT System — Complete Frontend Audit

This document combines all read-only frontend audit volumes generated from the current `web` project snapshot.

# PT System Frontend Audit — File Tree

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## Scope

- 59 relevant frontend source/configuration files audited.
- Excluded generated/dependency output: `node_modules`, `.next`, build/dist output, `package-lock.json` contents, and `tsconfig.tsbuildinfo`.
- No `src/hooks`, `src/types`, or `src/utils` directories currently exist.
- Loading skeletons are route-owned `loading.tsx` files; there is no current `src/components/loadings` directory.

## Complete relevant tree

```text
web/
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── (trainer)/
│   │   │   ├── clients/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── daily-activity/
│   │   │   │   │   │   ├── loading.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   ├── loading.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── not-found.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── progress/
│   │   │   │   │       ├── loading.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── new/
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── meal-plans/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── new/
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── payments/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   └── workout-plans/
│   │   │       ├── [id]/
│   │   │       │   ├── loading.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── loading.tsx
│   │   │       ├── new/
│   │   │       │   ├── loading.tsx
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── login/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── BackLink.tsx
│   │   ├── EmptyState.tsx
│   │   ├── GlobalHeader.tsx
│   │   ├── Icon.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Pagination.tsx
│   │   ├── PlanCard.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SummaryMetric.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── TrainerAuthGuard.tsx
│   ├── data/
│   │   └── mock-data.ts
│   └── lib/
│       ├── api.ts
│       └── Endpoints.ts
└── tsconfig.json
```

---

# PT System Frontend Audit — App, Layouts, and Pages

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## Page-by-page audit

| Route | Page | Layout | Data/API | State and behavior | Loading | Main concerns |
|---|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Root | None | Server redirect to `/login` | Root loading fallback | No content of its own. |
| `/login` | `src/app/login/page.tsx` | Root | POST `trainerLogin` | Controlled username/password, loading and error; stores JWT then pushes dashboard | Route skeleton; submit spinner | All failures become credential errors; localStorage token. |
| `/dashboard` | trainer dashboard | Root + trainer | GET dashboard stats plus mock clients/payments | Stats state populated in one effect | Full dashboard skeleton until stats finishes | Mixes live statistics and fixtures. |
| `/clients` | clients page | Root + trainer | GET paged clients and client stats | Page, search-on-current-page, list/stat state | Full table skeleton on every page request | Search is not server-wide; brittle timestamp split. |
| `/clients/new` | new client | Root + trainer | None | Controlled demo fields; submit toggles message | Route-owned form skeleton | No persistence. |
| `/clients/[id]` | client detail | Root + trainer | None; mock data | Finds numeric ID in fixtures; calls `notFound` | Route-owned detail skeleton | Can disagree with API list. |
| `/clients/[id]/edit` | edit client | Root + trainer | None | Hardcoded controlled values; unwraps params with React `use` | Route-owned form skeleton | Not loaded/saved; same sample for every ID. |
| `/clients/[id]/progress` | progress | Root + trainer | None | Static completion totals | Route-owned progress skeleton | Sample-only. |
| `/clients/[id]/daily-activity` | daily activity | Root + trainer | None | Static meals/workouts; date input has no effect | Route-owned activity skeleton | Sample-only. |
| `/workout-plans` | workout plan list | Root + trainer | GET paged plans and stats | Page/search/stats/loading; search is local to fetched page | Route fallback plus six PlanCard skeletons for client fetch | Local-page search; mixed hardcoded/token styles. |
| `/workout-plans/new` | create workout plan | Root + trainer | None | Controlled demo form | Route-owned form skeleton | No persistence. |
| `/workout-plans/[id]` | workout detail | Root + trainer | None | Server awaits params; static exercises | Route-owned table skeleton | ID is dynamic but plan data is not. |
| `/meal-plans` | meal plan list | Root + trainer | GET paged plans and stats | Page/total fields/stats/loading | Route fallback and imported local skeleton for client fetch | Pagination state is not exposed in UI. |
| `/meal-plans/new` | create meal plan | Root + trainer | None | Controlled demo form | Route-owned form skeleton | No persistence. |
| `/meal-plans/[id]` | meal detail | Root + trainer | None | Server awaits params; static meals | Route-owned list skeleton | ID is dynamic but plan data is not. |
| `/payments` | payments | Root + trainer | GET paged payments and stats | Page/status state; search/status UI does not filter | Full payments skeleton on every page request | Incorrect totalPages, inactive filters. |

### Layout/authentication behavior

Every trainer route is nested under `src/app/(trainer)/layout.tsx`. `TrainerAuthGuard` wraps the entire trainer shell; after a client-side token-presence check, the shell renders Sidebar, GlobalHeader, and the page. Because the guard initially returns plain `Loading...`, the shared shell and route skeleton are not visible during that first auth check. Nested route loading files otherwise render inside the shell, so Sidebar/GlobalHeader remain visible during App Router navigation.

## File-by-file app audit

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /clients/[id]/daily-activity.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/StatusBadge.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 4: `type DailyActivityPageProps = {`

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (94 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- The date input does not drive data loading; activities are static samples.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/edit/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/edit/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /clients/[id]/edit.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — external/framework module `next/link`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 15: `export default function EditClientPage({ params }: EditClientPageProps) {`

**STATE:**  
- Line 18: `const [fullName, setFullName] = useState("Ahmad Hassan");`
- Line 19: `const [email, setEmail] = useState("ahmad@example.com");`
- Line 20: `const [phoneNumber, setPhoneNumber] = useState("70123456");`
- Line 22: `const [submitted, setSubmitted] = useState(false);`

**EFFECTS:**  
- Line 16: `const { id } = use(params);`

**API USAGE:**  
None.

**TYPES:**  
- Line 9: `type EditClientPageProps = {`

**DATA FLOW:**  
Controlled form/UI state is updated from user events and rendered directly; this file does not persist data unless API usage is listed above.

**COMPLEXITY:**  
Moderate client complexity (5 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Form fields are hardcoded to one sample client and are not loaded from or saved to the API.
- A Client Component unwraps async route params with React `use`, but the ID is only used for navigation links.
- The success state says no changes were saved; this is intentionally a demo form.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/not-found.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/not-found.tsx
--------------------------------------------------

**PURPOSE:**  
Segment-specific not-found UI for an unknown client.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/EmptyState.tsx`.
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.

**EXPORTS:**  
- Line 4: `export default function ClientNotFound() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (13 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /clients/[id].

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — external/framework module `next/link`.
- `` — local dependency `web/src/components/StatusBadge.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — external/framework module `next/navigation`.
- `` — local dependency `web/src/data/mock-data.ts`.
- `` — local dependency `web/src/components/Avatar.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 10: `type ClientPageProps = { params: Promise<{ id: string }> };`

**DATA FLOW:**  
Static fixtures are imported from `mock-data.ts`, selected/iterated in the page, and rendered through shared components.

**COMPLEXITY:**  
Low behavioral complexity (129 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Uses static mock clients rather than the clients API, so IDs/data can disagree with the list page.
- The plan and activity content is explanatory placeholder text rather than fetched client data.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/progress/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/progress/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /clients/[id]/progress.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/StatusBadge.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — external/framework module `next/link`.
- `` — local dependency `web/src/components/Icon.tsx`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 7: `type ProgressPageProps = { params: Promise<{ id: string }> };`

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (80 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- All progress values are static sample data.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/new/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/new/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /clients/new.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — external/framework module `next/link`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 10: `export default function AddClientPage() {`

**STATE:**  
- Line 11: `const [fullName, setFullName] = useState("");`
- Line 12: `const [email, setEmail] = useState("");`
- Line 13: `const [phoneNumber, setPhoneNumber] = useState("");`
- Line 14: `const [password, setPassword] = useState("");`
- Line 16: `const [submitted, setSubmitted] = useState(false);`

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Controlled form/UI state is updated from user events and rendered directly; this file does not persist data unless API usage is listed above.

**COMPLEXITY:**  
High relative file complexity (170 lines, 6 hook references); data fetching, state, derived values, and detailed UI coexist.

**POTENTIAL PROBLEMS:**  
- The form never calls the create-client endpoint; submit only toggles demo text.
- Username preview behavior is UI-only and no API validation is performed.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /clients.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — external/framework module `react`.
- `` — external/framework module `next/link`.
- `` — local dependency `web/src/components/EmptyState.tsx`.
- `` — local dependency `web/src/components/Pagination.tsx`.
- `` — local dependency `web/src/components/StatusBadge.tsx`.
- `` — local dependency `web/src/components/Avatar.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — local dependency `web/src/components/SummaryMetric.tsx`.
- `` — local dependency `web/src/lib/api.ts`.
- `` — local dependency `web/src/lib/Endpoints.ts`.
- `` — local dependency `web/src/app/(trainer)/clients/loading.tsx`.

**EXPORTS:**  
- Line 34: `export default function ClientsPage() {`

**STATE:**  
- Line 35: `const [query, setQuery] = useState("");`
- Line 36: `const [clients, setClients] = useState<Client[]>([]);`
- Line 37: `const [stats, setStats] = useState<Stats>({`
- Line 42: `const [page, setPage] = useState(1);`
- Line 43: `const [totalPages, setTotalPages] = useState(0);`
- Line 44: `const [totalCount, setTotalCount] = useState(0);`
- Line 45: `const [isLoading, setIsLoading] = useState(true);`

**EFFECTS:**  
- Line 75: `useEffect(() => {`
- Line 79: `useEffect(() => {`

**API USAGE:**  
- Line 53: `const response = await api.get(Endpoints.clients(page, pageSize));`
- Line 67: `const response = await api.get(Endpoints.clientsStats);`

**TYPES:**  
- Line 17: `type Client = {`
- Line 28: `type Stats = {`

**DATA FLOW:**  
Page-local effects call the Axios client, copy response fields into local state, derive display values during render, and pass them to shared presentational components.

**COMPLEXITY:**  
High relative file complexity (260 lines, 11 hook references); data fetching, state, derived values, and detailed UI coexist.

**POTENTIAL PROBLEMS:**  
- Search intentionally filters only the current API page, which may surprise users expecting global search.
- `createdAt.split("T")[1].split(".")[0]` assumes a precise timestamp shape and can throw for malformed data.
- The entire page is replaced by its skeleton on every page change.
- API responses use local, unshared types and untyped Axios responses.

--------------------------------------------------
FILE: web/src/app/(trainer)/dashboard/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/dashboard/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /dashboard.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — external/framework module `next/link`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/Avatar.tsx`.
- `` — local dependency `web/src/components/StatusBadge.tsx`.
- `` — local dependency `web/src/data/mock-data.ts`.
- `` — external/framework module `react`.
- `` — local dependency `web/src/lib/api.ts`.
- `` — local dependency `web/src/lib/Endpoints.ts`.
- `` — local dependency `web/src/app/(trainer)/dashboard/loading.tsx`.

**EXPORTS:**  
- Line 24: `export const dynamic = "force-dynamic";`
- Line 26: `export default function DashboardPage() {`

**STATE:**  
- Line 27: `const [isLoading, setIsLoading] = useState(true);`
- Line 28: `const [stats, setStats] = useState<Stats>({`

**EFFECTS:**  
- Line 50: `useEffect(() => {`

**API USAGE:**  
- Line 41: `const statsResponse = await api.get(Endpoints.dashboardStats);`

**TYPES:**  
- Line 13: `type Stats = {`

**DATA FLOW:**  
Page-local effects call the Axios client, copy response fields into local state, derive display values during render, and pass them to shared presentational components.

**COMPLEXITY:**  
High relative file complexity (253 lines, 5 hook references); data fetching, state, derived values, and detailed UI coexist.

**POTENTIAL PROBLEMS:**  
- Combines live API stats with mock client/payment records, so visible sections can disagree.
- `dynamic = "force-dynamic"` is exported from a Client Component and does not make its client-side Axios request server-rendered.
- A failed request is only logged; the UI then displays default zero stats as if valid.

--------------------------------------------------
FILE: web/src/app/(trainer)/layout.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/layout.tsx
--------------------------------------------------

**PURPOSE:**  
Shared authenticated trainer shell containing the sidebar, compact global header, skip link, and main content region.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/GlobalHeader.tsx`.
- `` — local dependency `web/src/components/Sidebar.tsx`.
- `` — local dependency `web/src/components/TrainerAuthGuard.tsx`.

**EXPORTS:**  
- Line 5: `export default function TrainerLayout({`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (41 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/app/(trainer)/meal-plans/[id]/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/meal-plans/[id]/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /meal-plans/[id].

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 3: `type MealPlanPageProps = {`

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (56 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Displays a hardcoded meal plan and meals; only the route ID is dynamic.

--------------------------------------------------
FILE: web/src/app/(trainer)/meal-plans/new/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/meal-plans/new/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /meal-plans/new.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — external/framework module `next/link`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 9: `export default function CreateMealPlanPage() {`

**STATE:**  
- Line 10: `const [name, setName] = useState("");`
- Line 11: `const [description, setDescription] = useState("");`
- Line 13: `const [submitted, setSubmitted] = useState(false);`

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Controlled form/UI state is updated from user events and rendered directly; this file does not persist data unless API usage is listed above.

**COMPLEXITY:**  
Moderate client complexity (4 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Demo-only form; submission is not persisted.

--------------------------------------------------
FILE: web/src/app/(trainer)/meal-plans/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/meal-plans/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /meal-plans.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/PlanCard.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — local dependency `web/src/components/SummaryMetric.tsx`.
- `` — external/framework module `next/link`.
- `` — external/framework module `react`.
- `` — local dependency `web/src/lib/api.ts`.
- `` — local dependency `web/src/lib/Endpoints.ts`.
- `` — local dependency `web/src/app/(trainer)/meal-plans/loading.tsx`.

**EXPORTS:**  
- Line 27: `export default function MealPlansPage() {`

**STATE:**  
- Line 28: `const [isLoading, setIsLoading] = useState(true);`
- Line 29: `const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);`
- Line 30: `const [page, setPage] = useState(1);`
- Line 32: `const [totalPages, setTotalPages] = useState(0);`
- Line 33: `const [totalCount, setTotalCount] = useState(0);`
- Line 34: `const [stats, setStats] = useState<MealStats>({`

**EFFECTS:**  
- Line 62: `useEffect(() => {`
- Line 68: `useEffect(() => {`

**API USAGE:**  
- Line 45: `const mealResponse = await api.get(Endpoints.mealPlans(page, pageSize));`
- Line 57: `const mealStats = await api.get(Endpoints.mealPlansStats);`

**TYPES:**  
- Line 13: `type MealPlan = {`
- Line 19: `type MealStats = {`

**DATA FLOW:**  
Page-local effects call the Axios client, copy response fields into local state, derive display values during render, and pass them to shared presentational components.

**COMPLEXITY:**  
High relative file complexity (118 lines, 10 hook references); data fetching, state, derived values, and detailed UI coexist.

**POTENTIAL PROBLEMS:**  
- `page`, `setPage`, `totalPages`, and `setTotalPages` exist, but no pagination UI changes pages; only the first API page is reachable.
- Stats loading is not awaited by the page skeleton and has no error handling.
- API response objects are untyped; `meals` is only `unknown[]`.

--------------------------------------------------
FILE: web/src/app/(trainer)/payments/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/payments/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /payments.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — external/framework module `react`.
- `` — local dependency `web/src/components/EmptyState.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — local dependency `web/src/components/StatusBadge.tsx`.
- `` — local dependency `web/src/components/SummaryMetric.tsx`.
- `` — local dependency `web/src/lib/api.ts`.
- `` — local dependency `web/src/lib/Endpoints.ts`.
- `` — local dependency `web/src/components/Pagination.tsx`.
- `` — local dependency `web/src/components/Avatar.tsx`.
- `` — local dependency `web/src/app/(trainer)/payments/loading.tsx`.

**EXPORTS:**  
- Line 32: `export default function PaymentsPage() {`

**STATE:**  
- Line 33: `const [isLoading, setIsLoading] = useState(true);`
- Line 34: `const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");`
- Line 35: `const [payments, setPayments] = useState<Payments[]>([]);`
- Line 36: `const [stats, setStats] = useState<Stats>({`
- Line 43: `const [page, setPage] = useState(1);`

**EFFECTS:**  
- Line 76: `useEffect(() => {`
- Line 82: `useEffect(() => {`

**API USAGE:**  
- Line 49: `const response = await api.get(Endpoints.payments(page, pageSize));`
- Line 66: `const statsResponse = await api.get(Endpoints.paymentsStats);`

**TYPES:**  
- Line 15: `type StatusFilter = "All" | "Paid" | "Pending";`
- Line 16: `type Payments = {`
- Line 24: `type Stats = {`

**DATA FLOW:**  
Page-local effects call the Axios client, copy response fields into local state, derive display values during render, and pass them to shared presentational components.

**COMPLEXITY:**  
High relative file complexity (269 lines, 9 hook references); data fetching, state, derived values, and detailed UI coexist.

**POTENTIAL PROBLEMS:**  
- Pagination passes `pageSize` (5) as `totalPages`, so the UI always says there are five pages regardless of the API response.
- The search input has its value/onChange commented out; it never filters.
- `statusFilter` controls the select but is never applied to data or requests.
- Changing page replaces the entire page with a skeleton because `getPayments` sets the page-level `isLoading` flag.
- The payments response is not typed and its `totalPages`/`totalCount` fields are discarded.
- Stats errors are unhandled; list errors only go to the console.
- `getPaymentStatus` uses loose equality and treats every non-1 value as Pending.

--------------------------------------------------
FILE: web/src/app/(trainer)/workout-plans/[id]/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/workout-plans/[id]/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /workout-plans/[id].

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 3: `type WorkoutPlanPageProps = {`

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (85 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Displays a hardcoded plan and exercises; only the route ID is dynamic.

--------------------------------------------------
FILE: web/src/app/(trainer)/workout-plans/new/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/workout-plans/new/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /workout-plans/new.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/BackLink.tsx`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/PageHeader.tsx`.
- `` — external/framework module `next/link`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 9: `export default function CreateWorkoutPlanPage() {`

**STATE:**  
- Line 10: `const [name, setName] = useState("");`
- Line 11: `const [description, setDescription] = useState("");`
- Line 13: `const [submitted, setSubmitted] = useState(false);`

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Controlled form/UI state is updated from user events and rendered directly; this file does not persist data unless API usage is listed above.

**COMPLEXITY:**  
Moderate client complexity (4 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Demo-only form; submission is not persisted.

--------------------------------------------------
FILE: web/src/app/(trainer)/workout-plans/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/workout-plans/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /workout-plans.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — local dependency `web/src/components/PlanCard.tsx`.
- `` — local dependency `web/src/components/EmptyState.tsx`.
- `` — local dependency `web/src/components/Pagination.tsx`.
- `` — local dependency `web/src/lib/api.ts`.
- `` — local dependency `web/src/lib/Endpoints.ts`.
- `` — external/framework module `next/link`.
- `` — external/framework module `react`.
- `` — external/framework module `lucide-react`.

**EXPORTS:**  
- Line 27: `export default function WorkoutPlansPage() {`

**STATE:**  
- Line 28: `const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);`
- Line 29: `const [searchTerm, setSearchTerm] = useState("");`
- Line 31: `const [stats, setStats] = useState<WorkoutStats>({`
- Line 39: `const [page, setPage] = useState(1);`
- Line 40: `const [totalPages, setTotalPages] = useState(0);`
- Line 41: `const [totalCount, setTotalCount] = useState(0);`
- Line 42: `const [isLoading, setIsLoading] = useState(true);`

**EFFECTS:**  
- Line 72: `useEffect(() => {`
- Line 79: `useEffect(() => {`

**API USAGE:**  
- Line 50: `const response = await api.get(Endpoints.workoutPlans(page, pageSize));`
- Line 64: `const response = await api.get(Endpoints.workoutPlansStats);`

**TYPES:**  
- Line 12: `type WorkoutPlan = {`
- Line 19: `type WorkoutStats = {`

**DATA FLOW:**  
Page-local effects call the Axios client, copy response fields into local state, derive display values during render, and pass them to shared presentational components.

**COMPLEXITY:**  
High relative file complexity (248 lines, 11 hook references); data fetching, state, derived values, and detailed UI coexist.

**POTENTIAL PROBLEMS:**  
- Search filters only the currently fetched server page, not the full workout-plan collection.
- Summary values can display zeros while stats are still loading because only card-list loading is tracked.
- The file mixes token-based colors with many hardcoded light/dark hex and sky color values.
- Async requests are not cancelled; rapid navigation can allow stale responses.

--------------------------------------------------
FILE: web/src/app/layout.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/layout.tsx
--------------------------------------------------

**PURPOSE:**  
Root App Router layout: metadata, Inter font, global CSS, and pre-hydration theme initialization.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — external/framework module `next`.
- `` — external/framework module `next/font/google`.
- `` — local dependency `web/src/app/globals.css`.

**EXPORTS:**  
- Line 11: `export const metadata: Metadata = {`
- Line 27: `export default function RootLayout({`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (45 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Inline theme script duplicates part of ThemeToggle’s theme knowledge, though it prevents a light/dark flash.

--------------------------------------------------
FILE: web/src/app/login/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/login/page.tsx
--------------------------------------------------

**PURPOSE:**  
Page implementation for /login.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — external/framework module `react`.
- `` — external/framework module `next/navigation`.
- `` — local dependency `web/src/lib/api.ts`.
- `` — local dependency `web/src/lib/Endpoints.ts`.

**EXPORTS:**  
- Line 8: `export default function LoginPage() {`

**STATE:**  
- Line 11: `const [username, setUsername] = useState("");`
- Line 12: `const [password, setPassword] = useState("");`
- Line 13: `const [isLoading, setIsLoading] = useState(false);`
- Line 14: `const [error, setError] = useState("");`

**EFFECTS:**  
None.

**API USAGE:**  
- Line 22: `const response = await api.post(Endpoints.trainerLogin, {`

**TYPES:**  
None.

**DATA FLOW:**  
Page-local effects call the Axios client, copy response fields into local state, derive display values during render, and pass them to shared presentational components.

**COMPLEXITY:**  
Moderate client complexity (5 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- JWT is stored in localStorage, which is accessible to injected scripts.
- The catch block treats every failure (network/server/auth) as invalid credentials.
- No token schema validation or expiry handling occurs before navigation.

--------------------------------------------------
FILE: web/src/app/page.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/page.tsx
--------------------------------------------------

**PURPOSE:**  
Root route that immediately redirects visitors to `/login`.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
- `` — external/framework module `next/navigation`.

**EXPORTS:**  
- Line 3: `export default function HomePage() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (6 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

---

# PT System Frontend Audit — Shared Components

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## Shared-component review

| Component | Why it exists / props | Assessment |
|---|---|---|
| Avatar | `name` → initials | Useful and small; blank-name behavior is unspecified. |
| BackLink | `href`, children | Useful consistent navigation primitive. |
| EmptyState | icon/title/description/action | Useful; API is straightforward. |
| GlobalHeader | server-formatted `date`; internally derives trainer name | Useful shared shell UI, but identity derivation and no-op external-store subscription deserve review. |
| Icon | semantic `IconName` map | Useful consistency layer; some pages bypass it with direct Lucide imports. |
| PageHeader | title/eyebrow/description/actions/metadata/compact | Useful; `compact` is currently dead API. |
| Pagination | page/totalPages/callbacks | Useful controlled component; correctness depends completely on caller values. |
| PlanCard | plan fields + kind | Useful, but contains divergent workout/meal UIs and skeleton in one file. |
| Sidebar | no props; pathname + mobile open state | Useful shell component; logout is deliberately nonfunctional and identity is hardcoded. |
| StatCard | label/value | Simple but currently unused. |
| StatusBadge | arbitrary status string | Useful visual primitive, but stringly typed. |
| SummaryMetric | label/value/compact | Useful, small API. |
| ThemeToggle | optional className | Useful; custom-event external store keeps duplicate instances synchronized. |
| TrainerAuthGuard | children | Necessary under current localStorage auth, but only tests token presence. |

## File-by-file component audit

--------------------------------------------------
FILE: web/src/components/Avatar.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/Avatar.tsx
--------------------------------------------------

**PURPOSE:**  
Renders initials in a circular trainer/client avatar.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/components/GlobalHeader.tsx`
- `web/src/components/Sidebar.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Avatar({ name }: { name: string }) {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (18 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Assumes a useful non-empty name; blank values produce no initials.

--------------------------------------------------
FILE: web/src/components/BackLink.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/BackLink.tsx
--------------------------------------------------

**PURPOSE:**  
Reusable back-navigation link with a left-arrow icon.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx`
- `web/src/app/(trainer)/clients/[id]/not-found.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/new/page.tsx`
- `web/src/app/(trainer)/meal-plans/[id]/page.tsx`
- `web/src/app/(trainer)/meal-plans/new/page.tsx`
- `web/src/app/(trainer)/workout-plans/[id]/page.tsx`
- `web/src/app/(trainer)/workout-plans/new/page.tsx`

**IMPORTS:**  
- `` — external/framework module `next/link`.
- `` — external/framework module `lucide-react`.

**EXPORTS:**  
- Line 6: `export default function BackLink({ href, children }: BackLinkProps) {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 4: `type BackLinkProps = { href: string; children: React.ReactNode };`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (17 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/components/EmptyState.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/EmptyState.tsx
--------------------------------------------------

**PURPOSE:**  
Reusable empty-state panel with optional icon and action content.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/not-found.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`

**IMPORTS:**  
- `` — external/framework module `react`.
- `` — local dependency `web/src/components/Icon.tsx`.

**EXPORTS:**  
- Line 4: `export default function EmptyState({ title, description, icon, children }: {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (19 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/components/GlobalHeader.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/GlobalHeader.tsx
--------------------------------------------------

**PURPOSE:**  
Compact trainer-wide header with date supplied by the layout, theme control, and JWT-derived trainer identity.

**USED BY:**  
- `web/src/app/(trainer)/layout.tsx`

**IMPORTS:**  
- `` — local dependency `web/src/components/Avatar.tsx`.
- `` — local dependency `web/src/components/ThemeToggle.tsx`.
- `` — external/framework module `lucide-react`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 42: `export default function GlobalHeader({ date }: { date: string }) {`

**STATE:**  
None.

**EFFECTS:**  
- Line 43: `const trainerName = useSyncExternalStore(`

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
The trainer layout supplies a formatted date; the component reads and decodes the local JWT to derive a display name, then passes it to Avatar.

**COMPLEXITY:**  
Moderate client complexity (2 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Manually decodes JWT payload data for display without verifying it; suitable only as non-authoritative UI text.
- The no-op `useSyncExternalStore` subscription never reacts if the token changes while this component remains mounted.
- The date is supplied by the server layout and will not update at midnight without a render/navigation; server timezone may differ from the browser.

--------------------------------------------------
FILE: web/src/components/Icon.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/Icon.tsx
--------------------------------------------------

**PURPOSE:**  
Maps the application’s semantic icon names to Lucide components.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/new/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/new/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/new/page.tsx`
- `web/src/components/EmptyState.tsx`
- `web/src/components/PlanCard.tsx`
- `web/src/components/Sidebar.tsx`

**IMPORTS:**  
- `` — external/framework module `lucide-react`.

**EXPORTS:**  
- Line 24: `export type IconName = keyof typeof icons;`
- Line 26: `export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 24: `export type IconName = keyof typeof icons;`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (37 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/components/PageHeader.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/PageHeader.tsx
--------------------------------------------------

**PURPOSE:**  
Standard page title, eyebrow, description, metadata, and action layout.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx`
- `web/src/app/(trainer)/clients/[id]/not-found.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/new/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/[id]/page.tsx`
- `web/src/app/(trainer)/meal-plans/new/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/[id]/page.tsx`
- `web/src/app/(trainer)/workout-plans/new/page.tsx`

**IMPORTS:**  
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 12: `export default function PageHeader({`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 3: `type PageHeaderProps = {`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (46 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- The `compact` prop currently has no effect because both branches return `mb-6`.

--------------------------------------------------
FILE: web/src/components/Pagination.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/Pagination.tsx
--------------------------------------------------

**PURPOSE:**  
Controlled previous/next pagination navigation.

**USED BY:**  
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 8: `export default function Pagination({`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 1: `type PaginationProps = {`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (46 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Assumes callers provide valid page bounds and totalPages; it does not clamp invalid values.

--------------------------------------------------
FILE: web/src/components/PlanCard.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/PlanCard.tsx
--------------------------------------------------

**PURPOSE:**  
Workout/meal plan card variants plus a reusable plan-card skeleton.

**USED BY:**  
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`

**IMPORTS:**  
- `` — external/framework module `next/link`.
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — external/framework module `lucide-react`.

**EXPORTS:**  
- Line 13: `export default function PlanCard({ id, name, description, count, kind }: PlanCardProps) {`
- Line 72: `export function PlanCardSkeleton({ kind = "workout" }: { kind?: "workout" | "meal" }) {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 5: `type PlanCardProps = {`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (97 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Contains two substantially different card designs and a skeleton in one file, increasing branching and styling density.

--------------------------------------------------
FILE: web/src/components/Sidebar.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/Sidebar.tsx
--------------------------------------------------

**PURPOSE:**  
Responsive trainer navigation, brand area, account summary, and disabled logout control.

**USED BY:**  
- `web/src/app/(trainer)/layout.tsx`

**IMPORTS:**  
- `` — local dependency `web/src/components/Icon.tsx`.
- `` — local dependency `web/src/components/Avatar.tsx`.
- `` — external/framework module `next/link`.
- `` — external/framework module `next/navigation`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 17: `export default function Sidebar() {`

**STATE:**  
- Line 19: `const [open, setOpen] = useState(false);`

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Moderate client complexity (2 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Logout is rendered disabled, so there is no way to clear the JWT through the UI.
- Trainer identity is a hardcoded `Trainer` here while GlobalHeader decodes a username.

--------------------------------------------------
FILE: web/src/components/StatCard.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/StatCard.tsx
--------------------------------------------------

**PURPOSE:**  
Simple bordered label/value metric card.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 9: `export default function StatCard({`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 1: `type StatCardProps = {`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (44 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No current source file imports this component; it appears unused.

--------------------------------------------------
FILE: web/src/components/StatusBadge.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/StatusBadge.tsx
--------------------------------------------------

**PURPOSE:**  
String-driven status-to-color badge.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function StatusBadge({ status }: { status: string }) {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (17 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Accepts arbitrary strings and silently maps unknown statuses to the neutral style; status values are not type-safe.

--------------------------------------------------
FILE: web/src/components/SummaryMetric.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/SummaryMetric.tsx
--------------------------------------------------

**PURPOSE:**  
Compact or regular summary metric card.

**USED BY:**  
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 7: `export default function SummaryMetric({`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 1: `type SummaryMetricProps = {`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Low behavioral complexity (33 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/components/ThemeToggle.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/ThemeToggle.tsx
--------------------------------------------------

**PURPOSE:**  
Global light/dark mode toggle synchronized through a custom browser event.

**USED BY:**  
- `web/src/components/GlobalHeader.tsx`

**IMPORTS:**  
- `` — external/framework module `lucide-react`.
- `` — external/framework module `react`.

**EXPORTS:**  
- Line 21: `export default function ThemeToggle({ className = "" }: { className?: string }) {`

**STATE:**  
None.

**EFFECTS:**  
- Line 22: `const isDark = useSyncExternalStore(`

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Moderate client complexity (2 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Uses a custom global event/store for a small theme setting; valid, but more machinery than a local toggle and shared provider in a larger app.

--------------------------------------------------
FILE: web/src/components/TrainerAuthGuard.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/components/TrainerAuthGuard.tsx
--------------------------------------------------

**PURPOSE:**  
Client-side route guard that checks for a token and redirects unauthenticated users.

**USED BY:**  
- `web/src/app/(trainer)/layout.tsx`

**IMPORTS:**  
- `` — external/framework module `react`.
- `` — external/framework module `next/navigation`.

**EXPORTS:**  
- Line 10: `export default function TrainerAuthGuard({ children }: TrainerAuthGuardProps) {`

**STATE:**  
- Line 13: `const [isChecking, setIsChecking] = useState(true);`

**EFFECTS:**  
- Line 15: `useEffect(() => {`

**API USAGE:**  
None.

**TYPES:**  
- Line 6: `type TrainerAuthGuardProps = {`

**DATA FLOW:**  
Receives props and renders presentation; any navigation or browser state behavior is noted under state/effects.

**COMPLEXITY:**  
Moderate client complexity (4 hook references); browser or form behavior is local to this file.

**POTENTIAL PROBLEMS:**  
- Only checks token presence—not expiry, signature, role, or validity.
- Shows plain `Loading...` while checking, temporarily hiding the sidebar, global header, and route skeleton.
- No centralized handling exists for later 401 responses.

---

# PT System Frontend Audit — Library, API, Data, Configuration, and Auth

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## Authentication and JWT trace

1. `/login` posts `{ username, password }` to `Endpoints.trainerLogin` through the shared Axios instance.
2. On success it stores `response.data.token` in localStorage under exactly `token` and navigates to `/dashboard`.
3. `TrainerAuthGuard` reads `token` once after mount. Missing token causes `router.replace('/login')`; any present string passes.
4. The Axios request interceptor reads the same key before each request and assigns `Authorization: Bearer <token>`.
5. There is no response interceptor. A 401 does not clear the token or redirect; each page handles (or fails to handle) it independently.
6. Role and expiry are not checked on the frontend. Authorization is therefore dependent on backend validation.
7. `GlobalHeader` manually base64url-decodes the JWT payload and checks `unique_name`, `name`, and the .NET name-claim URI for display. It does not verify the token and must not be treated as authoritative.
8. Logout is disabled in Sidebar. There is no frontend operation that removes `token`.
9. Direct localStorage readers: login page (write), API interceptor (read), TrainerAuthGuard (read), GlobalHeader (read), ThemeToggle/root theme script (separate `pt-system-theme` key).

## Endpoint inventory and integration

| Endpoint helper | URL shape | Current caller | Expected/used shape | Pagination/loading/error notes |
|---|---|---|---|---|
| trainerLogin | POST `/api/trainer/login` | Login | `{ token: string }` (implicit, untyped) | Button spinner; all errors mapped to bad credentials. |
| clients | GET `/api/clients?page=&pageSize=` | Clients | `{ items: Client[], totalPages, totalCount }` | Correct totals stored; full-page skeleton; console-only error. |
| clientsStats | GET `/api/stats/clients` | Clients | local Stats fields | Separate request; failure logged. |
| workoutPlans | GET paged workout plans | Workout Plans | items, totalPages, totalCount | Card skeleton; error logged. |
| workoutPlansStats | GET `/api/stats/workouts` | Workout Plans | local WorkoutStats | Separate request; error logged. |
| mealPlans | GET paged meal plans | Meal Plans | items, totalPages, totalCount | Full skeleton; pagination values stored but unused. |
| mealPlansStats | GET `/api/stats/meals` | Meal Plans | local MealStats | No try/catch. |
| payments | GET paged payments | Payments | only `items` is retained | Backend totals discarded; UI passes pageSize as totalPages. |
| paymentsStats | GET `/api/stats/payments` | Payments | local Stats | No try/catch. |
| dashboardStats | GET `/api/stats/dashboard` | Dashboard | local Stats | Full skeleton; failure logged then zero defaults shown. |

The remaining helpers (client detail/credential updates, plan detail/mutations, assignment endpoints, client payments, payment status) are defined but not called by current frontend source.

## API-wide concerns

- Axios calls have no generic response types, so response payloads are effectively trusted at runtime.
- API types are declared locally per page instead of shared with endpoint contracts.
- The hardcoded Render base URL prevents simple environment switching.
- Error handling varies: console logging, no catch, or one generic login message.
- There is no request cancellation or stale-response protection.
- There is no centralized 401/token-expiry path.

## File-by-file infrastructure audit

--------------------------------------------------
FILE: web/eslint.config.mjs
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/eslint.config.mjs
--------------------------------------------------

**PURPOSE:**  
Flat ESLint configuration based on Next.js core-web-vitals and TypeScript rules.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
- `` — external/framework module `eslint/config`.
- `` — external/framework module `eslint-config-next/core-web-vitals`.
- `` — external/framework module `eslint-config-next/typescript`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (19 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/next-env.d.ts
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/next-env.d.ts
--------------------------------------------------

**PURPOSE:**  
Next-generated TypeScript declarations for Next.js and route types.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
- `` — external/framework module `./.next/dev/types/routes.d.ts`.
- `` — external/framework module `./.next/dev/types/root-params.d.ts`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (8 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/next.config.ts
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/next.config.ts
--------------------------------------------------

**PURPOSE:**  
Next.js configuration object; currently contains no custom options.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
- `` — external/framework module `next`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (9 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/package.json
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/package.json
--------------------------------------------------

**PURPOSE:**  
Frontend package metadata, scripts, and runtime/development dependencies.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
None.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (30 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/postcss.config.mjs
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/postcss.config.mjs
--------------------------------------------------

**PURPOSE:**  
PostCSS setup enabling the Tailwind CSS v4 plugin.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
None.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (8 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

--------------------------------------------------
FILE: web/src/app/globals.css
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/globals.css
--------------------------------------------------

**PURPOSE:**  
Global Tailwind import, design tokens, light/dark themes, base element rules, focus rules, and shared workspace/form styling.

**USED BY:**  
- `web/src/app/layout.tsx`

**IMPORTS:**  
- `` — external/framework module `tailwindcss`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (121 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Global `input, select, textarea { min-height: 48px; }` overrides smaller `min-h-11` utilities because it appears after Tailwind output.
- The broad mobile selector `main header > div:last-child > a` couples global CSS to specific page-header markup.
- Both global focus outlines and per-input focus styles can produce inconsistent/double focus treatments; login inputs require a special override.

--------------------------------------------------
FILE: web/src/data/mock-data.ts
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/data/mock-data.ts
--------------------------------------------------

**PURPOSE:**  
Static client and payment fixtures used by demo/static pages.

**USED BY:**  
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 2: `export type Client = {`
- Line 10: `export const clients: Client[] = [`
- Line 27: `export type Payment = {`
- Line 35: `export const payments: Payment[] = [`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
- Line 2: `export type Client = {`
- Line 27: `export type Payment = {`

**DATA FLOW:**  
Exports in-memory arrays that dashboard/client-detail pages import directly.

**COMPLEXITY:**  
Low behavioral complexity (52 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Mock entities overlap with live API-backed screens, enabling inconsistent records and status displays.

--------------------------------------------------
FILE: web/src/lib/api.ts
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/lib/api.ts
--------------------------------------------------

**PURPOSE:**  
Configured Axios client with the deployed API base URL and bearer-token request interceptor.

**USED BY:**  
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`
- `web/src/app/login/page.tsx`

**IMPORTS:**  
- `` — external/framework module `axios`.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Each caller passes a path; the interceptor reads `token` from localStorage, adds `Authorization`, sends to the hardcoded base URL, and returns Axios responses to the caller.

**COMPLEXITY:**  
Low behavioral complexity (18 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- API origin is hardcoded to the deployed Render URL instead of environment configuration.
- No response interceptor handles 401/403, token expiry, retries, or normalized errors.
- The request interceptor directly reads localStorage and therefore assumes calls occur in a browser.

--------------------------------------------------
FILE: web/src/lib/Endpoints.ts
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/lib/Endpoints.ts
--------------------------------------------------

**PURPOSE:**  
Central string/path builders for frontend API endpoints.

**USED BY:**  
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`
- `web/src/app/login/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export const Endpoints = {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Input IDs/page values are interpolated into URL strings consumed by page-level API functions.

**COMPLEXITY:**  
Low behavioral complexity (66 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- Contains many endpoint helpers not currently called by frontend pages.
- The capitalized filename is inconsistent with common lower-case module naming and can be fragile across case-sensitive tooling if imported inconsistently.

--------------------------------------------------
FILE: web/tsconfig.json
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/tsconfig.json
--------------------------------------------------

**PURPOSE:**  
TypeScript compiler settings and the `@/*` source alias.

**USED BY:**  
- No direct source import found; it may be configuration, generated typing, or unused.

**IMPORTS:**  
None.

**EXPORTS:**  
None.

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
Static/configuration flow; no runtime application data is stored here.

**COMPLEXITY:**  
Low behavioral complexity (35 lines); primarily static presentation or configuration.

**POTENTIAL PROBLEMS:**  
- No specific defect was identified in this file during static inspection.

---

# PT System Frontend Audit — Loading and Shared UI

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## Loading architecture

- There are 16 route-owned `loading.tsx` files: one root fallback, one login fallback, and one for every trainer page route.
- There is no shared `src/components/loadings` folder in the current filesystem.
- Root and login skeletons are nearly identical.
- New/edit plan/client form skeletons repeat the same structural pattern.
- Detail skeletons are tailored to their route (profile, progress, activity, plan table/list).
- Dashboard, Clients, Payments, and Meal Plans import their own special `./loading` module and render it for client-side Axios loading. This is unusual coupling between a Next special file and page implementation, but it ensures useEffect requests get a skeleton.
- Workout Plans instead uses `PlanCardSkeleton` inside the page for client fetching, while its route loading file owns a separate full-page skeleton.
- App Router route skeletons render inside the trainer layout, but the outer TrainerAuthGuard initially returns plain text and prevents the shell/skeleton from appearing during the token check.
- Clients/Payments/Meal Plans replace all static page UI during each paginated fetch. Workout Plans keeps its header and summary visible while replacing only cards.
- Skeletons use `animate-pulse`, theme border/surface tokens, `aria-busy`, and route labels. They generally approximate final layout but do not expose live status text.

## Every loading file

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/daily-activity/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/daily-activity/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /clients/[id]/daily-activity.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/edit/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/edit/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /clients/[id]/edit.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /clients/[id].

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/[id]/progress/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/[id]/progress/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /clients/[id]/progress.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /clients.

**USED BY:**  
- `web/src/app/(trainer)/clients/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/clients/new/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/clients/new/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /clients/new.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/dashboard/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/dashboard/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /dashboard.

**USED BY:**  
- `web/src/app/(trainer)/dashboard/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/meal-plans/[id]/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/meal-plans/[id]/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /meal-plans/[id].

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/meal-plans/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/meal-plans/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /meal-plans.

**USED BY:**  
- `web/src/app/(trainer)/meal-plans/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/meal-plans/new/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/meal-plans/new/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /meal-plans/new.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/payments/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/payments/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /payments.

**USED BY:**  
- `web/src/app/(trainer)/payments/page.tsx`

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/workout-plans/[id]/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/workout-plans/[id]/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /workout-plans/[id].

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/workout-plans/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/workout-plans/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /workout-plans.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/(trainer)/workout-plans/new/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/(trainer)/workout-plans/new/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /workout-plans/new.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

--------------------------------------------------
FILE: web/src/app/login/loading.tsx
ABSOLUTE PATH: /home/samifarhat/Desktop/Projects/pt-system/web/src/app/login/loading.tsx
--------------------------------------------------

**PURPOSE:**  
Route-owned skeleton fallback for /login.

**USED BY:**  
- Next.js App Router by file convention.

**IMPORTS:**  
None.

**EXPORTS:**  
- Line 1: `export default function Loading() {`

**STATE:**  
None.

**EFFECTS:**  
None.

**API USAGE:**  
None.

**TYPES:**  
None.

**DATA FLOW:**  
No business data. Static skeleton DOM is rendered by the App Router Suspense boundary; selected API-backed pages also import their local loading component for client-side fetch state.

**COMPLEXITY:**  
Low behavioral complexity, but repeated Tailwind skeleton markup increases maintenance volume.

**POTENTIAL PROBLEMS:**  
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

---

# PT System Frontend Audit — Types and Data Flow

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## Type inventory

| Type | Defined in | Notes |
|---|---|---|
| Client (API-list shape) | clients page | Includes trainerId/username/nullable email; local to page. |
| Client (mock shape) | mock-data.ts | Different shape with required email and paymentStatus; same name, different contract. |
| Stats | clients, payments, dashboard pages | Three unrelated local types reuse the generic name. |
| WorkoutPlan / WorkoutStats | workout list | Local API assumptions; exercises are `unknown[]`. |
| MealPlan / MealStats | meal list | Local API assumptions; meals are `unknown[]`. |
| Payments | payments page | Plural name describes one payment; status is an unbounded number. |
| Payment | mock-data.ts | String status and different fixture contract. |
| Dynamic route props | detail/edit/activity/progress pages | Repeated Promise<{id:string}> declarations. |
| Component prop types | component files | Mostly small and appropriately local; StatusBadge has no status union. |
| IconName | Icon.tsx | Correctly derived from icon-map keys. |

## Data-flow observations

- Axios response types are not connected to these TypeScript types, so compile-time checking stops before the network boundary.
- List pages transform almost nothing; they copy `response.data` into state and render.
- Details/forms are mostly fixtures or hardcoded state, not a continuation of list API data.
- Stats and lists load through independent effects and can temporarily disagree.
- Nullability is inconsistent: API Client email is nullable, mock Client email is required, and Avatar/name usage assumes strings.
- IDs are numbers in entities but strings in route params; conversion is performed only where needed.
- Date values are strings but their exact ISO validity is not encoded in types.

## Important flow chains

`Login form → Axios → token localStorage → TrainerAuthGuard presence check → Axios Authorization header`

`Trainer layout server date → GlobalHeader prop; local JWT → manual payload decode → trainer name → Avatar`

`List page effect → endpoint helper → Axios interceptor → API → local state → derived filter/count → shared table/cards/pagination`

`Route navigation → loading.tsx Suspense fallback → page; client useEffect pages may then render their local loading UI again`

## Exact declarations

- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx:4` — `type DailyActivityPageProps = {`
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx:9` — `type EditClientPageProps = {`
- `web/src/app/(trainer)/clients/[id]/page.tsx:10` — `type ClientPageProps = { params: Promise<{ id: string }> };`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx:7` — `type ProgressPageProps = { params: Promise<{ id: string }> };`
- `web/src/app/(trainer)/clients/page.tsx:17` — `type Client = {`
- `web/src/app/(trainer)/clients/page.tsx:28` — `type Stats = {`
- `web/src/app/(trainer)/dashboard/page.tsx:13` — `type Stats = {`
- `web/src/app/(trainer)/meal-plans/[id]/page.tsx:3` — `type MealPlanPageProps = {`
- `web/src/app/(trainer)/meal-plans/page.tsx:13` — `type MealPlan = {`
- `web/src/app/(trainer)/meal-plans/page.tsx:19` — `type MealStats = {`
- `web/src/app/(trainer)/payments/page.tsx:15` — `type StatusFilter = "All" | "Paid" | "Pending";`
- `web/src/app/(trainer)/payments/page.tsx:16` — `type Payments = {`
- `web/src/app/(trainer)/payments/page.tsx:24` — `type Stats = {`
- `web/src/app/(trainer)/workout-plans/[id]/page.tsx:3` — `type WorkoutPlanPageProps = {`
- `web/src/app/(trainer)/workout-plans/page.tsx:12` — `type WorkoutPlan = {`
- `web/src/app/(trainer)/workout-plans/page.tsx:19` — `type WorkoutStats = {`
- `web/src/components/BackLink.tsx:4` — `type BackLinkProps = { href: string; children: React.ReactNode };`
- `web/src/components/Icon.tsx:24` — `export type IconName = keyof typeof icons;`
- `web/src/components/PageHeader.tsx:3` — `type PageHeaderProps = {`
- `web/src/components/Pagination.tsx:1` — `type PaginationProps = {`
- `web/src/components/PlanCard.tsx:5` — `type PlanCardProps = {`
- `web/src/components/StatCard.tsx:1` — `type StatCardProps = {`
- `web/src/components/SummaryMetric.tsx:1` — `type SummaryMetricProps = {`
- `web/src/components/TrainerAuthGuard.tsx:6` — `type TrainerAuthGuardProps = {`
- `web/src/data/mock-data.ts:2` — `export type Client = {`
- `web/src/data/mock-data.ts:27` — `export type Payment = {`

---

# PT System Frontend Audit — Complexity, Duplication, and Problems

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## React / Next.js complexity findings (exact code locations)

1. **Manual JWT decoding and no-op external store** — `src/components/GlobalHeader.tsx:8-48`. `getTrainerName` manually normalizes base64url and parses payload; `useSyncExternalStore(subscribe, ...)` uses a subscription that can never publish changes.
2. **Theme external store plus inline boot script** — `src/components/ThemeToggle.tsx:6-45` and `src/app/layout.tsx:16-25`. This avoids hydration/theme flash and synchronizes toggles, but splits theme logic between two files.
3. **Auth guard delays the entire shared shell** — `src/components/TrainerAuthGuard.tsx:13-29`. Client effect returns plain text until localStorage is checked.
4. **Special loading modules imported by Client Components** — dashboard, clients, payments, and meal-plan pages import `./loading`. Functional, but couples Next route convention files to client-render logic.
5. **Dead PageHeader API** — `src/components/PageHeader.tsx` computes `${compact ? "mb-6" : "mb-6"}`; the prop cannot change output.
6. **Large page components** — clients, payments, workout plans, and dashboard combine request functions, effects, transformations, tables/cards, and interaction markup.
7. **No unnecessary useMemo/useCallback/context/providers found.** Derived filters/counts are calculated directly, which is appropriate at current data sizes.
8. **Repeated Client Components are mostly justified** by localStorage, router, pathname, form state, or client-side Axios. Static detail pages correctly remain Server Components.

## Duplication findings

- Date formatting appears in trainer layout, dashboard, clients, payments, and fixtures/display pages with multiple format configurations.
- List fetch pattern (loading flag, try/catch, items/total fields, page effect) is repeated in Clients, Workout Plans, Meal Plans, and Payments.
- Stats fetch runs in a second effect on Dashboard/list pages with inconsistent error handling.
- Form demo behavior (controlled name/description, submitted flag, “not saved” message) is almost identical in new workout and new meal pages.
- New/edit client form structures and submit messages overlap heavily.
- Root/login loading skeletons duplicate each other.
- Form loading skeletons and table loading rows repeat extensive Tailwind markup.
- Page-level table styling is repeated instead of a shared table abstraction; this is not necessarily wrong at the current scale.
- Status conversion exists as numeric-to-label logic in Payments while other areas use strings directly.
- Theme/localStorage knowledge is duplicated between root layout script and ThemeToggle.
- Trainer identity is represented both as decoded JWT name in GlobalHeader and hardcoded “Trainer” in Sidebar.

## Likely bugs, ordered by impact

1. Payments pagination uses `pageSize` as total page count.
2. Payments search and status filter controls do not affect displayed data.
3. Meal Plans pagination state is unused, preventing access beyond the first server page.
4. Detail/edit pages use mock/hardcoded records and can disagree with API lists.
5. Token presence allows the shell even when token is expired/invalid; subsequent 401 has no global recovery.
6. Client timestamp string splitting can throw on unexpected data.
7. Full-page loading replacement on pagination causes apparent page refreshes.
8. Dashboard can silently present zero values after request failure.
9. Global header date can become stale across midnight and may reflect server rather than user timezone.

## Inconsistent patterns

- Some screens use design tokens; Workout Plans uses many literal gray/sky/hex classes.
- Some async functions have try/catch/finally; meal/payment stats calls do not.
- Some pages are live API screens; related detail/create/edit pages are demos.
- Some tables use `workspace-table`; Clients/Payments use page-local table rules.
- Status representation alternates between numeric enum values and strings.
- Loading is full-page on some lists and sectional on Workout Plans.
- Shared Icon is used in most files, but several files import Lucide icons directly.

## Unused/dead surface

- `StatCard.tsx` has no importer.
- Many endpoint helpers have no current caller.
- `PageHeader.compact` is ineffective.
- Meal-plan `setPage` and `totalPages` are currently unused by rendering.

## All per-file concern entries

### `web/eslint.config.mjs`

- No specific defect was identified in this file during static inspection.

### `web/next-env.d.ts`

- No specific defect was identified in this file during static inspection.

### `web/next.config.ts`

- No specific defect was identified in this file during static inspection.

### `web/package.json`

- No specific defect was identified in this file during static inspection.

### `web/postcss.config.mjs`

- No specific defect was identified in this file during static inspection.

### `web/src/app/(trainer)/clients/[id]/daily-activity/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`

- The date input does not drive data loading; activities are static samples.

### `web/src/app/(trainer)/clients/[id]/edit/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/clients/[id]/edit/page.tsx`

- Form fields are hardcoded to one sample client and are not loaded from or saved to the API.
- A Client Component unwraps async route params with React `use`, but the ID is only used for navigation links.
- The success state says no changes were saved; this is intentionally a demo form.

### `web/src/app/(trainer)/clients/[id]/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/clients/[id]/not-found.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/app/(trainer)/clients/[id]/page.tsx`

- Uses static mock clients rather than the clients API, so IDs/data can disagree with the list page.
- The plan and activity content is explanatory placeholder text rather than fetched client data.

### `web/src/app/(trainer)/clients/[id]/progress/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/clients/[id]/progress/page.tsx`

- All progress values are static sample data.

### `web/src/app/(trainer)/clients/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/clients/new/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/clients/new/page.tsx`

- The form never calls the create-client endpoint; submit only toggles demo text.
- Username preview behavior is UI-only and no API validation is performed.

### `web/src/app/(trainer)/clients/page.tsx`

- Search intentionally filters only the current API page, which may surprise users expecting global search.
- `createdAt.split("T")[1].split(".")[0]` assumes a precise timestamp shape and can throw for malformed data.
- The entire page is replaced by its skeleton on every page change.
- API responses use local, unshared types and untyped Axios responses.

### `web/src/app/(trainer)/dashboard/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/dashboard/page.tsx`

- Combines live API stats with mock client/payment records, so visible sections can disagree.
- `dynamic = "force-dynamic"` is exported from a Client Component and does not make its client-side Axios request server-rendered.
- A failed request is only logged; the UI then displays default zero stats as if valid.

### `web/src/app/(trainer)/layout.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/app/(trainer)/meal-plans/[id]/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/meal-plans/[id]/page.tsx`

- Displays a hardcoded meal plan and meals; only the route ID is dynamic.

### `web/src/app/(trainer)/meal-plans/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/meal-plans/new/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/meal-plans/new/page.tsx`

- Demo-only form; submission is not persisted.

### `web/src/app/(trainer)/meal-plans/page.tsx`

- `page`, `setPage`, `totalPages`, and `setTotalPages` exist, but no pagination UI changes pages; only the first API page is reachable.
- Stats loading is not awaited by the page skeleton and has no error handling.
- API response objects are untyped; `meals` is only `unknown[]`.

### `web/src/app/(trainer)/payments/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/payments/page.tsx`

- Pagination passes `pageSize` (5) as `totalPages`, so the UI always says there are five pages regardless of the API response.
- The search input has its value/onChange commented out; it never filters.
- `statusFilter` controls the select but is never applied to data or requests.
- Changing page replaces the entire page with a skeleton because `getPayments` sets the page-level `isLoading` flag.
- The payments response is not typed and its `totalPages`/`totalCount` fields are discarded.
- Stats errors are unhandled; list errors only go to the console.
- `getPaymentStatus` uses loose equality and treats every non-1 value as Pending.

### `web/src/app/(trainer)/workout-plans/[id]/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/workout-plans/[id]/page.tsx`

- Displays a hardcoded plan and exercises; only the route ID is dynamic.

### `web/src/app/(trainer)/workout-plans/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/workout-plans/new/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/(trainer)/workout-plans/new/page.tsx`

- Demo-only form; submission is not persisted.

### `web/src/app/(trainer)/workout-plans/page.tsx`

- Search filters only the currently fetched server page, not the full workout-plan collection.
- Summary values can display zeros while stats are still loading because only card-list loading is tracked.
- The file mixes token-based colors with many hardcoded light/dark hex and sky color values.
- Async requests are not cancelled; rapid navigation can allow stale responses.

### `web/src/app/globals.css`

- Global `input, select, textarea { min-height: 48px; }` overrides smaller `min-h-11` utilities because it appears after Tailwind output.
- The broad mobile selector `main header > div:last-child > a` couples global CSS to specific page-header markup.
- Both global focus outlines and per-input focus styles can produce inconsistent/double focus treatments; login inputs require a special override.

### `web/src/app/layout.tsx`

- Inline theme script duplicates part of ThemeToggle’s theme knowledge, though it prevents a light/dark flash.

### `web/src/app/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/login/loading.tsx`

- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

### `web/src/app/login/page.tsx`

- JWT is stored in localStorage, which is accessible to injected scripts.
- The catch block treats every failure (network/server/auth) as invalid credentials.
- No token schema validation or expiry handling occurs before navigation.

### `web/src/app/page.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/components/Avatar.tsx`

- Assumes a useful non-empty name; blank values produce no initials.

### `web/src/components/BackLink.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/components/EmptyState.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/components/GlobalHeader.tsx`

- Manually decodes JWT payload data for display without verifying it; suitable only as non-authoritative UI text.
- The no-op `useSyncExternalStore` subscription never reacts if the token changes while this component remains mounted.
- The date is supplied by the server layout and will not update at midnight without a render/navigation; server timezone may differ from the browser.

### `web/src/components/Icon.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/components/PageHeader.tsx`

- The `compact` prop currently has no effect because both branches return `mb-6`.

### `web/src/components/Pagination.tsx`

- Assumes callers provide valid page bounds and totalPages; it does not clamp invalid values.

### `web/src/components/PlanCard.tsx`

- Contains two substantially different card designs and a skeleton in one file, increasing branching and styling density.

### `web/src/components/Sidebar.tsx`

- Logout is rendered disabled, so there is no way to clear the JWT through the UI.
- Trainer identity is a hardcoded `Trainer` here while GlobalHeader decodes a username.

### `web/src/components/StatCard.tsx`

- No current source file imports this component; it appears unused.

### `web/src/components/StatusBadge.tsx`

- Accepts arbitrary strings and silently maps unknown statuses to the neutral style; status values are not type-safe.

### `web/src/components/SummaryMetric.tsx`

- No specific defect was identified in this file during static inspection.

### `web/src/components/ThemeToggle.tsx`

- Uses a custom global event/store for a small theme setting; valid, but more machinery than a local toggle and shared provider in a larger app.

### `web/src/components/TrainerAuthGuard.tsx`

- Only checks token presence—not expiry, signature, role, or validity.
- Shows plain `Loading...` while checking, temporarily hiding the sidebar, global header, and route skeleton.
- No centralized handling exists for later 401 responses.

### `web/src/data/mock-data.ts`

- Mock entities overlap with live API-backed screens, enabling inconsistent records and status displays.

### `web/src/lib/api.ts`

- API origin is hardcoded to the deployed Render URL instead of environment configuration.
- No response interceptor handles 401/403, token expiry, retries, or normalized errors.
- The request interceptor directly reads localStorage and therefore assumes calls occur in a browser.

### `web/src/lib/Endpoints.ts`

- Contains many endpoint helpers not currently called by frontend pages.
- The capitalized filename is inconsistent with common lower-case module naming and can be fragile across case-sensitive tooling if imported inconsistently.

### `web/tsconfig.json`

- No specific defect was identified in this file during static inspection.

---

# PT System Frontend Audit — Full Source Part 1

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

Files in this part: 19. Source is reproduced verbatim from the audited snapshot.

---

## FILE: web/eslint.config.mjs

Purpose: Flat ESLint configuration based on Next.js core-web-vitals and TypeScript rules.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

---

## FILE: web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx

Purpose: Page implementation for /clients/[id]/daily-activity.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- The date input does not drive data loading; activities are static samples.

FULL SOURCE:

```tsx
import BackLink from "@/components/BackLink";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
type DailyActivityPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DailyActivityPage({
  params,
}: DailyActivityPageProps) {
  const { id } = await params;

  const workouts = [
    { id: 1, name: "Push Day", status: "Completed" },
    { id: 2, name: "Cardio", status: "Skipped" },
  ];

  const meals = [
    { id: 1, name: "Breakfast", status: "Completed" },
    { id: 2, name: "Lunch", status: "Pending" },
    { id: 3, name: "Dinner", status: "Completed" },
  ];

  return (
    <div className="max-w-5xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader
        title="Daily Activity"
        description="Workout and meal completion for the selected day."
      />

      <div className="mb-6 grid gap-3 rounded-xl bg-surface p-5 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
        <div>
          <label
            htmlFor="activity-date"
            className="mb-2 block text-sm font-medium"
          >
            Date
          </label>

          <input
            id="activity-date"
            aria-describedby="date-help"
            type="date"
            className="block min-h-11 w-full max-w-60 rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>
        <p className="mb-3 text-sm text-muted" id="date-help">
          Sample activity is static; changing the date does not load another
          day.
        </p>
      </div>

      <section className="mb-7">
        <h2 className="mb-3 text-lg font-semibold">Workouts</h2>

        <div className="divide-y divide-border overflow-hidden rounded-xl bg-surface">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6"
            >
              <span className="font-medium">{workout.name}</span>
              <span>
                <StatusBadge status={workout.status} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Meals</h2>

        <div className="divide-y divide-border overflow-hidden rounded-xl bg-surface">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6"
            >
              <span className="font-medium">{meal.name}</span>
              <span>
                <StatusBadge status={meal.status} />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/progress/loading.tsx

Purpose: Route-owned skeleton fallback for /clients/[id]/progress.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading client progress" aria-busy="true" className="max-w-5xl animate-pulse">
      <div className="mb-5 h-5 w-40 rounded bg-border" />
      <div className="mb-6 h-9 w-48 rounded bg-border" />
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="h-6 w-48 rounded bg-border" />
        <div className="mt-5 h-10 w-32 rounded bg-border" />
        <div className="mt-5 h-2 w-full rounded bg-border" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="min-h-32 rounded-lg border border-border bg-surface p-5">
            <div className="h-6 w-24 rounded bg-border" />
            <div className="mt-4 h-4 w-full rounded bg-border" />
            <div className="mt-5 h-8 w-10 rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/progress/page.tsx

Purpose: Page implementation for /clients/[id]/progress.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- All progress values are static sample data.

FULL SOURCE:

```tsx
import BackLink from "@/components/BackLink";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import Icon from "@/components/Icon";

type ProgressPageProps = { params: Promise<{ id: string }> };

export default async function ClientProgressPage({
  params,
}: ProgressPageProps) {
  const { id } = await params;
  return (
    <div className="max-w-5xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader
        title="Client Progress"
        description="Review workout adherence and outstanding assignments."
      >
        <Link
          href={`/clients/${id}/daily-activity`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 font-medium hover:bg-hover"
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </Link>
      </PageHeader>
      <section className="">
        <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Workout completion</h2>
          <div className="mt-5 flex items-baseline gap-3">
            <strong className="text-4xl font-semibold tracking-tight tabular-nums">
              8 <span className="text-xl font-normal text-muted">/ 13</span>
            </strong>
            <span className="text-sm text-muted">assignments completed</span>
          </div>
          <progress
            value={8}
            max={13}
            aria-label="8 of 13 workout assignments completed"
            className="mt-5 h-2 w-full appearance-none overflow-hidden rounded-sm bg-border [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:bg-primary"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              status: "Completed",
              value: 8,
              text: "Finished workout assignments",
            },
            {
              status: "Pending",
              value: 3,
              text: "Assignments awaiting completion",
            },
            {
              status: "Skipped",
              value: 2,
              text: "Assignments marked as skipped",
            },
          ].map((item) => (
            <div key={item.status} className="flex min-h-32 flex-col justify-between gap-3 rounded-lg border border-border bg-surface p-5">
              <div className="min-w-0 flex-1">
                <StatusBadge status={item.status} />
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
              <strong className="text-2xl font-semibold tabular-nums">
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-4 text-sm text-muted">
        Sample completion totals. This preview does not load client progress.
      </p>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/new/loading.tsx

Purpose: Route-owned skeleton fallback for /clients/new.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading new client form" aria-busy="true" className="max-w-3xl animate-pulse">
      <div className="mb-5 h-5 w-32 rounded bg-border" />
      <div className="mb-6 h-9 w-44 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          {Array.from({ length: 6 }).map((_, field) => (
            <div key={field} className={field === 0 ? "sm:col-span-2" : ""}>
              <div className="mb-2 h-4 w-24 rounded bg-border" />
              <div className="h-12 w-full rounded-md bg-border" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 border-t border-border bg-primary-soft/40 px-5 py-4">
          <div className="h-11 w-32 rounded-md bg-border" />
          <div className="h-11 w-24 rounded-md bg-border" />
        </div>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/dashboard/loading.tsx

Purpose: Route-owned skeleton fallback for /dashboard.

Used by:
- `web/src/app/(trainer)/dashboard/page.tsx`

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading dashboard" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-48 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-12 w-36 rounded-lg bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="min-h-28 rounded-lg border border-border bg-surface p-5">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-5 h-8 w-12 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 min-[1100px]:grid-cols-2">
        {[0, 1].map((column) => (
          <div key={column}>
            <div className="mb-3 h-6 w-36 rounded bg-border" />
            <div className="space-y-5 rounded-xl bg-surface p-5">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-border" />
                  <div className="flex-1">
                    <div className="h-4 w-36 rounded bg-border" />
                    <div className="mt-2 h-3 w-48 max-w-full rounded bg-border" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/dashboard/page.tsx

Purpose: Page implementation for /dashboard.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Combines live API stats with mock client/payment records, so visible sections can disagree.
- `dynamic = "force-dynamic"` is exported from a Client Component and does not make its client-side Axios request server-rendered.
- A failed request is only logged; the UI then displays default zero stats as if valid.

FULL SOURCE:

```tsx
"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import { clients, payments } from "@/data/mock-data";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import DashboardLoading from "./loading";

type Stats = {
  totalClients: number;
  activeClients: number;
  totalWorkoutPlans: number;
  totalMealPlans: number;
  pendingWorkoutAssignments: number;
  pendingMealStatuses: number;
  pendingPayments: number;
  pendingPaymentAmount: number;
};

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeClients: 0,
    totalWorkoutPlans: 0,
    totalMealPlans: 0,
    pendingWorkoutAssignments: 0,
    pendingMealStatuses: 0,
    pendingPayments: 0,
    pendingPaymentAmount: 0,
  });

  async function getDashboardStats() {
    try {
      const statsResponse = await api.get(Endpoints.dashboardStats);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDashboardStats();
  }, []);

  if (isLoading) {
    return <DashboardLoading />;
  }

  const today = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    new Date(),
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Let’s get your clients moving."
        metadata={today}
      >
        <Link
          href="/clients/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <p className="flex min-h-28 flex-col-reverse justify-end gap-3 rounded-lg border border-border bg-surface p-5">
          <strong className="text-[32px] leading-none font-semibold tabular-nums">
            {stats.totalClients}
          </strong>
          <span className="text-sm font-medium text-muted">
            Client profiles
          </span>
        </p>
        <p className="flex min-h-28 flex-col-reverse justify-end gap-3 rounded-lg border border-border bg-surface p-5">
          <strong className="text-[32px] leading-none font-semibold tabular-nums text-warning">
            {stats.pendingPayments}
          </strong>
          <span className="text-sm font-medium text-muted">
            Pending payments
          </span>
        </p>
        <p className="text-sm text-muted sm:col-span-2">Sample records</p>
      </div>
      <div className="grid items-start gap-6 min-[1100px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section aria-labelledby="attention-title">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="attention-title" className="text-xl font-semibold">
              Needs attention
            </h2>
            <Link
              href="/payments"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-hover dark:text-foreground hover:underline"
            >
              View Payments
              <Icon name="arrow" className="size-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-warning/25 bg-surface">
            <div className="bg-warning-soft px-5 py-3 text-sm font-semibold text-warning">
              Pending payment
            </div>
            {/* {pendingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-wrap items-center gap-4 px-5 py-5"
              >
                <Avatar name={payment.clientName} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold">
                    {payment.clientName}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Due {payment.dueDate}
                  </p>
                </div>
                <strong className="text-3xl font-semibold tabular-nums">
                  ${payment.amount}
                </strong>
              </div>
            ))} */}
            {/* {attentionClients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="flex min-h-12 items-center justify-between gap-3 px-5 pb-4 text-sm font-semibold text-primary-hover dark:text-foreground hover:underline"
              >
                Open {client.fullName}’s profile
                <Icon name="arrow" className="size-4" />
              </Link>
            ))} */}
          </div>
          <section aria-labelledby="records-title" className="mt-5">
            <h2 id="records-title" className="mb-3 text-xl font-semibold">
              Payment records
            </h2>
            <div className="rounded-xl bg-surface px-5">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center gap-3 border-b border-border/50 py-4 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <strong className="font-medium">
                      {payment.clientName}
                    </strong>
                    <p className="mt-1 text-sm text-muted">
                      Due {payment.dueDate}
                    </p>
                  </div>
                  <strong className="tabular-nums">${payment.amount}</strong>
                  <StatusBadge status={payment.status} />
                </div>
              ))}
            </div>
          </section>
        </section>
        <div>
          <section aria-labelledby="clients-title">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 id="clients-title" className="text-xl font-semibold">
                Your clients
              </h2>
              <Link
                href="/clients"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-hover dark:text-foreground hover:underline"
              >
                View Clients
              </Link>
            </div>
            <div className="rounded-xl bg-surface px-5">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="flex min-h-20 items-center gap-3 border-b border-border/50 py-4 last:border-0 hover:bg-hover"
                >
                  <Avatar name={client.fullName} />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-lg font-semibold">
                      {client.fullName}
                    </strong>
                    <span className="mt-1 block text-sm text-muted wrap-anywhere">
                      {client.email}
                    </span>
                  </span>
                  <Icon name="arrow" className="size-4 text-muted" />
                </Link>
              ))}
            </div>
          </section>
          <section
            aria-labelledby="start-title"
            className="mt-5 rounded-xl bg-primary-soft p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="start-title" className="text-xl font-semibold">
                  Plan their next session
                </h2>
                <p className="mt-2 leading-relaxed">
                  Build a workout or meal plan you can reuse with your clients.
                </p>
              </div>
              <Icon
                name="workout"
                className="size-10 shrink-0 text-primary dark:text-foreground"
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/workout-plans/new"
                className="inline-flex min-h-12 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover"
              >
                Create Workout Plan
                <Icon
                  name="arrow"
                  className="size-4 text-primary dark:text-foreground"
                />
              </Link>
              <Link
                href="/meal-plans/new"
                className="inline-flex min-h-12 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover"
              >
                Create Meal Plan
                <Icon
                  name="arrow"
                  className="size-4 text-primary dark:text-foreground"
                />
              </Link>
            </div>
          </section>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">
        Dashboard client and payment records are sample data.
      </p>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/meal-plans/new/page.tsx

Purpose: Page implementation for /meal-plans/new.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Demo-only form; submission is not persisted.

FULL SOURCE:

```tsx
"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useState } from "react";

export default function CreateMealPlanPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
      <PageHeader title="Create Meal Plan" />

      <p className="mb-4 text-sm text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <div className="grid gap-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <h2 className="text-lg font-semibold">Plan details</h2>
            <p className="mt-1 text-sm text-muted">
              Give the plan a clear name and describe its purpose.
            </p>
          </div>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Plan Name
            </label>

            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="block min-h-32 w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Meal Plan
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href="/meal-plans"
          >
            Cancel
          </Link>
        </div>
        <p
          role="status"
          className="px-5 text-sm text-muted empty:hidden sm:px-7"
        >
          {submitted
            ? "Form reviewed. No changes were saved in this demo."
            : ""}
        </p>
      </form>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/workout-plans/[id]/loading.tsx

Purpose: Route-owned skeleton fallback for /workout-plans/[id].

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading workout plan" aria-busy="true" className="max-w-5xl animate-pulse">
      <div className="mb-5 h-5 w-44 rounded bg-border" />
      <div className="mb-6 h-9 w-48 rounded bg-border" />
      <div className="mb-6 flex gap-8 border-b border-border pb-5">
        <div className="h-10 w-24 rounded bg-border" />
        <div className="h-10 w-24 rounded bg-border" />
      </div>
      <div className="mb-3 h-6 w-28 rounded bg-border" />
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-4 gap-4 bg-background px-5 py-4">
          {[0, 1, 2, 3].map((cell) => <div key={cell} className="h-4 w-16 rounded bg-border" />)}
        </div>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid grid-cols-4 gap-4 border-t border-border px-5 py-5">
            {[0, 1, 2, 3].map((cell) => <div key={cell} className="h-5 w-4/5 rounded bg-border" />)}
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/workout-plans/loading.tsx

Purpose: Route-owned skeleton fallback for /workout-plans.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading workout plans" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-52 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-44 rounded-lg bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="min-h-24 rounded-xl border border-border bg-surface p-5">
            <div className="h-3 w-28 rounded bg-border" />
            <div className="mt-3 h-7 w-36 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-6 h-11 w-full max-w-sm rounded-lg bg-border" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, card) => (
          <div key={card} className="min-h-55 rounded-2xl border border-border bg-surface p-6">
            <div className="flex justify-between gap-3">
              <div className="h-6 w-1/2 rounded bg-border" />
              <div className="h-6 w-24 rounded bg-border" />
            </div>
            <div className="mt-5 h-4 w-full rounded bg-border" />
            <div className="mt-2 h-4 w-2/3 rounded bg-border" />
            <div className="mt-8 h-10 w-full rounded-lg bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/workout-plans/new/loading.tsx

Purpose: Route-owned skeleton fallback for /workout-plans/new.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading workout plan form" aria-busy="true" className="max-w-3xl animate-pulse">
      <div className="mb-5 h-5 w-40 rounded bg-border" />
      <div className="mb-6 h-9 w-56 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="space-y-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <div className="h-6 w-36 rounded bg-border" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-border" />
          </div>
          <div><div className="mb-2 h-4 w-24 rounded bg-border" /><div className="h-12 rounded-md bg-border" /></div>
          <div><div className="mb-2 h-4 w-24 rounded bg-border" /><div className="h-32 rounded-md bg-border" /></div>
        </div>
        <div className="flex gap-3 border-t border-border bg-primary-soft/40 px-5 py-4">
          <div className="h-11 w-40 rounded-md bg-border" />
          <div className="h-11 w-24 rounded-md bg-border" />
        </div>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/workout-plans/new/page.tsx

Purpose: Page implementation for /workout-plans/new.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Demo-only form; submission is not persisted.

FULL SOURCE:

```tsx
"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useState } from "react";

export default function CreateWorkoutPlanPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader title="Create Workout Plan" />

      <p className="mb-4 text-sm text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <div className="grid gap-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <h2 className="text-lg font-semibold">Plan details</h2>
            <p className="mt-1 text-sm text-muted">
              Give the plan a clear name and describe its purpose.
            </p>
          </div>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Plan Name
            </label>

            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="block min-h-32 w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Workout Plan
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href="/workout-plans"
          >
            Cancel
          </Link>
        </div>
        <p
          role="status"
          className="px-5 text-sm text-muted empty:hidden sm:px-7"
        >
          {submitted
            ? "Form reviewed. No changes were saved in this demo."
            : ""}
        </p>
      </form>
    </div>
  );
}

```

---

## FILE: web/src/app/globals.css

Purpose: Global Tailwind import, design tokens, light/dark themes, base element rules, focus rules, and shared workspace/form styling.

Used by:
- `web/src/app/layout.tsx`

Potential concerns:
- Global `input, select, textarea { min-height: 48px; }` overrides smaller `min-h-11` utilities because it appears after Tailwind output.
- The broad mobile selector `main header > div:last-child > a` couples global CSS to specific page-header markup.
- Both global focus outlines and per-input focus styles can produce inconsistent/double focus treatments; login inputs require a special override.

FULL SOURCE:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light;
  --background: #F6F8F6;
  --surface: #FFFFFF;
  --sidebar: #FFFFFF;
  --border: #D1D5DB;
  --border-strong: var(--border);
  --input-border: var(--border);
  --primary: #2F855A;
  --primary-hover: #276749;
  --primary-soft: #EAF6EF;
  --text: #1F2937;
  --text-muted: #6B7280;
  --success: var(--primary);
  --warning: #A65B05;
  --danger: #DC2626;
  --warning-soft: color-mix(in srgb, var(--warning) 8%, var(--surface));
  --danger-soft: color-mix(in srgb, var(--danger) 8%, var(--surface));
  --hover: color-mix(in srgb, var(--primary-soft) 45%, var(--surface));
}

html.dark {
  color-scheme: dark;
  --background: #0F1115;
  --surface: #1B1F24;
  --sidebar: #15181C;
  --border: #2C3238;
  --primary: #2F855A;
  --primary-hover: #276749;
  --primary-soft: #173D2A;
  --text: #F3F4F6;
  --text-muted: #9CA3AF;
  --warning: #D97706;
  --danger: #F87171;
  --hover: color-mix(in srgb, var(--border) 45%, var(--surface));
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-sidebar: var(--sidebar);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-input-border: var(--input-border);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);
  --color-foreground: var(--text);
  --color-muted: var(--text-muted);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-warning-soft: var(--warning-soft);
  --color-danger-soft: var(--danger-soft);
  --color-hover: var(--hover);
  --font-sans: var(--font-inter), Arial, Helvetica, sans-serif;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--text);
  font-family: var(--font-inter), Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

button,
input,
select,
textarea {
  font: inherit;
}

:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.login-input:focus-visible {
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}

/* Reusable presentation for the trainer workspace. */
::selection { background: var(--primary-soft); color: var(--text); }
button:not(:disabled), select, a { -webkit-tap-highlight-color: transparent; }
input, select, textarea { min-height: 48px; }
input, textarea { box-shadow: inset 0 1px 2px color-mix(in srgb, var(--text) 3%, transparent); }
textarea { line-height: 1.65; }
.workspace-table { font-size: 1rem; }
.workspace-table thead th { background: var(--surface); border-bottom: 1px solid var(--border); color: var(--text); font-weight: 600; }
.workspace-table tbody td { line-height: 1.5; padding-top: 20px; padding-bottom: 20px; }
.workspace-table tbody tr { border-color: color-mix(in srgb, var(--border) 55%, transparent); }
.workspace-table tbody tr:hover, .workspace-table tbody tr:focus-within { background: var(--hover); }
.form-sheet { border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
.form-sheet fieldset + fieldset { border-color: color-mix(in srgb, var(--border) 55%, transparent); }
.form-sheet label { font-size: 1rem; }
.form-sheet input, .form-sheet textarea { background: var(--background); }
.form-sheet [role=status]:not(:empty) { padding-top: 16px; padding-bottom: 16px; }
@media (max-width: 760px) {
  main header > div:last-child > a { flex-grow: 1; justify-content: center; }
  .workspace-table { font-size: 0.9375rem; }
}

html.dark :focus-visible { outline-color: var(--text); }

```

---

## FILE: web/src/app/login/page.tsx

Purpose: Page implementation for /login.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- JWT is stored in localStorage, which is accessible to injected scripts.
- The catch block treats every failure (network/server/auth) as invalid credentials.
- No token schema validation or expiry handling occurs before navigation.

FULL SOURCE:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(Endpoints.trainerLogin, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      router.push("/dashboard");
    } catch {
      setError("The username or password doesn't match.");
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span
            className="mx-auto grid size-11 place-items-center rounded-lg bg-primary text-sm font-bold tracking-tight text-white"
            aria-hidden="true"
          >
            PT
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-base font-medium text-foreground"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
              disabled={isLoading}
              className="login-input w-full rounded-md border border-input-border bg-surface px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-base font-medium text-foreground"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isLoading}
              className="login-input w-full rounded-md border border-input-border bg-surface px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-base text-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-12 text-center text-base text-muted">
          Need an account?{" "}
          <span className="font-medium text-foreground">
            Contact your administrator
          </span>
        </p>
      </div>
    </main>
  );
}

```

---

## FILE: web/src/components/Pagination.tsx

Purpose: Controlled previous/next pagination navigation.

Used by:
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`

Potential concerns:
- Assumes callers provide valid page bounds and totalPages; it does not clamp invalid values.

FULL SOURCE:

```tsx
type PaginationProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) {
  const buttonClasses =
    "min-h-11 rounded-md border border-border bg-surface px-3 py-2 font-medium transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50 sm:px-4";
  return (
    <nav
      aria-label="Pagination"
      className="mt-2 flex flex-wrap items-center justify-between gap-3 py-4"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 1}
        className={buttonClasses}
      >
        Previous
      </button>
      <span
        className="text-sm text-muted tabular-nums sm:text-sm"
        aria-live="polite"
      >
        {totalPages > 0 ? `Page ${page} of ${totalPages}` : "No pages"}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className={buttonClasses}
      >
        Next
      </button>
    </nav>
  );
}

```

---

## FILE: web/src/components/StatCard.tsx

Purpose: Simple bordered label/value metric card.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No current source file imports this component; it appears unused.

FULL SOURCE:

```tsx
type StatCardProps = {
  title: string;
  value: number;
  supportingText?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function StatCard({
  title,
  value,
  supportingText,
  variant = "secondary",
  className = "",
}: StatCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`flex min-h-28 flex-col rounded-lg border border-border bg-surface p-5 ${className}`}
    >
      <p
        className="text-sm font-medium text-muted"
      >
        {title}
      </p>
      <div className="mt-auto pt-4">
        <p
          className={`leading-none font-bold tracking-[-0.04em] tabular-nums ${
            isPrimary
              ? "text-[40px]"
              : "text-[32px]"
          }`}
        >
          {value}
        </p>
        {supportingText && (
          <p className="mt-2 text-sm text-muted">{supportingText}</p>
        )}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/components/StatusBadge.tsx

Purpose: String-driven status-to-color badge.

Used by:
- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`

Potential concerns:
- Accepts arbitrary strings and silently maps unknown statuses to the neutral style; status values are not type-safe.

FULL SOURCE:

```tsx
export default function StatusBadge({ status }: { status: string }) {
  const positive = ["Paid", "Completed", "Active"].includes(status);
  const pending = status === "Pending";
  const tone = positive
    ? "bg-primary-soft text-primary-hover dark:text-foreground"
    : pending
      ? "bg-warning-soft text-warning"
      : "bg-background text-muted dark:bg-border";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium ${tone}`}
    >
      {status}
    </span>
  );
}

```

---

## FILE: web/src/components/ThemeToggle.tsx

Purpose: Global light/dark mode toggle synchronized through a custom browser event.

Used by:
- `web/src/components/GlobalHeader.tsx`

Potential concerns:
- Uses a custom global event/store for a small theme setting; valid, but more machinery than a local toggle and shared provider in a larger app.

FULL SOURCE:

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const themeChangeEvent = "pt-system-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(themeChangeEvent, callback);
  return () => window.removeEventListener(themeChangeEvent, callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggleTheme() {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";

    try {
      localStorage.setItem("pt-system-theme", nextIsDark ? "dark" : "light");
    } catch {}

    window.dispatchEvent(new Event(themeChangeEvent));
  }

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-hover dark:border-border dark:bg-surface dark:text-foreground dark:hover:bg-hover ${className}`}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}

```

---

## FILE: web/tsconfig.json

Purpose: TypeScript compiler settings and the `@/*` source alias.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```

---

# PT System Frontend Audit — Full Source Part 2

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

Files in this part: 23. Source is reproduced verbatim from the audited snapshot.

---

## FILE: web/next-env.d.ts

Purpose: Next-generated TypeScript declarations for Next.js and route types.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";
import "./.next/dev/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

## FILE: web/package.json

Purpose: Frontend package metadata, scripts, and runtime/development dependencies.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "lucide-react": "^1.43.0",
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/edit/loading.tsx

Purpose: Route-owned skeleton fallback for /clients/[id]/edit.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading client form" aria-busy="true" className="max-w-3xl animate-pulse">
      <div className="mb-5 h-5 w-36 rounded bg-border" />
      <div className="mb-6 h-9 w-40 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          {Array.from({ length: 5 }).map((_, field) => (
            <div key={field} className={field === 0 ? "sm:col-span-2" : ""}>
              <div className="mb-2 h-4 w-24 rounded bg-border" />
              <div className="h-12 w-full rounded-md bg-border" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 border-t border-border bg-primary-soft/40 px-5 py-4">
          <div className="h-11 w-32 rounded-md bg-border" />
          <div className="h-11 w-24 rounded-md bg-border" />
        </div>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/loading.tsx

Purpose: Route-owned skeleton fallback for /clients/[id].

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading client details" aria-busy="true" className="animate-pulse">
      <div className="mb-5 h-5 w-32 rounded bg-border" />
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-surface p-6">
        <div className="size-16 rounded-full bg-border" />
        <div className="flex-1">
          <div className="h-9 w-52 rounded bg-border" />
          <div className="mt-3 h-4 w-44 rounded bg-border" />
        </div>
        <div className="h-11 w-28 rounded-md bg-border" />
      </div>
      <div className="mb-7 flex gap-2">
        {[0, 1, 2].map((tab) => <div key={tab} className="h-11 w-32 rounded-md bg-border" />)}
      </div>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6 rounded-xl bg-surface p-6">
          {[0, 1, 2].map((section) => (
            <div key={section} className="border-b border-border pb-6 last:border-0">
              <div className="h-6 w-48 rounded bg-border" />
              <div className="mt-4 h-4 w-full max-w-xl rounded bg-border" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {[0, 1, 2].map((item) => <div key={item} className="h-14 rounded-md bg-border" />)}
        </div>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/not-found.tsx

Purpose: Segment-specific not-found UI for an unknown client.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import EmptyState from "@/components/EmptyState";
import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
export default function ClientNotFound() {
  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>
      <PageHeader title="Client Not Found" />
      <div className="rounded-lg border border-border bg-surface"><EmptyState icon="clients" title="Client unavailable" description="The client you are looking for does not exist. Return to Clients to choose another profile." /></div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/page.tsx

Purpose: Page implementation for /clients/[id].

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Uses static mock clients rather than the clients API, so IDs/data can disagree with the list page.
- The plan and activity content is explanatory placeholder text rather than fetched client data.

FULL SOURCE:

```tsx
import BackLink from "@/components/BackLink";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { clients } from "@/data/mock-data";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";

type ClientPageProps = { params: Promise<{ id: string }> };

export default async function ClientDetailsPage({ params }: ClientPageProps) {
  const { id } = await params;
  const client = clients.find((client) => client.id === Number(id));
  if (!client) notFound();

  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>
      <div className="mb-6 flex items-start gap-4 rounded-xl bg-surface p-5 sm:p-6 [&>span]:size-14 [&>span]:text-lg sm:gap-5 sm:[&>span]:size-16 [&_header]:mb-0">
        <Avatar name={client.fullName} />
        <div className="min-w-0 flex-1">
          <PageHeader
            title={client.fullName}
            description={client.email}
          >
            <Link
              href={`/clients/${id}/edit`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-medium hover:bg-hover"
            >
              <Icon name="edit" className="size-4" />
              Edit Client
            </Link>
          </PageHeader>
        </div>
      </div>
      <nav aria-label="Client views" className="mb-7 flex flex-wrap gap-2">
        <Link
          href={`/clients/${id}`}
          aria-current="page"
          className="inline-flex min-h-11 items-center rounded-md border border-primary bg-primary-soft px-4 font-medium text-primary-hover dark:text-foreground"
        >
          Overview
        </Link>
        <Link
          href={`/clients/${id}/progress`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-muted hover:bg-hover"
        >
          <Icon name="dashboard" className="size-4" />
          View Progress
        </Link>
        <Link
          href={`/clients/${id}/daily-activity`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-muted hover:bg-hover"
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </Link>
      </nav>
      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-xl bg-surface">
          <section className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Icon name="workout" className="text-muted" />
              <h2 className="text-lg font-semibold">Assigned Workout Plans</h2>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Assigned workouts will appear here with assignment dates and
              completion status.
            </p>
          </section>
          <section className="border-t border-border/50 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Icon name="meal" className="text-muted" />
              <h2 className="text-lg font-semibold">Assigned Meal Plans</h2>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Assigned meal plans will appear here with individual meal
              completion status.
            </p>
          </section>
          <section className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 p-5 sm:p-6">
            <div>
              <h2 className="text-base font-medium">Progress & activity</h2>
              <p className="mt-1 text-sm text-muted">
                Review completion and daily adherence.
              </p>
            </div>
            <Link
              href={`/clients/${id}/progress`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-medium text-primary-hover dark:text-foreground hover:bg-primary-soft"
            >
              View Progress
              <Icon name="arrow" className="size-4" />
            </Link>
          </section>
        </div>
        <div className="grid gap-7">
          <section>
            <h2 className="pb-1 text-base font-semibold">
              Contact information
            </h2>
            <dl className="grid gap-5 pt-5">
              <div>
                <dt className="text-sm text-muted">Full name</dt>
                <dd className="mt-1 font-medium wrap-anywhere">
                  {client.fullName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd className="mt-1 wrap-anywhere">{client.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd className="mt-1 tabular-nums">{client.phoneNumber}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-xl bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold">Payment Status</h2>
            <StatusBadge status={client.paymentStatus} />
          </section>
        </div>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/new/page.tsx

Purpose: Page implementation for /clients/new.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- The form never calls the create-client endpoint; submit only toggles demo text.
- Username preview behavior is UI-only and no API validation is performed.

FULL SOURCE:

```tsx
"use client";

import BackLink from "@/components/BackLink";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";

import { useState } from "react";

export default function AddClientPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/clients">Back to Clients</BackLink>
      <PageHeader
        title="Add Client"
        description="Set up a client profile and account details."
      />

      <p className="mb-4 text-sm text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <fieldset className="grid gap-5 p-5 sm:p-6">
          <legend className="sr-only">Personal information</legend>
          <div>
            <h2 className="text-lg font-semibold">Personal information</h2>
            <p className="mt-1 text-sm text-muted">
              How to reach your client.
            </p>
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="grid gap-5 border-t border-border p-5 sm:p-6">
          <legend className="sr-only">Client account</legend>
          <h2 className="text-lg font-semibold">Client account</h2>
          <div>
            <label
              htmlFor="username-preview"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username-preview"
              type="text"
              disabled
              placeholder="Client username"
              className="min-h-11 w-full rounded-lg border border-input-border bg-background px-3 py-2 text-muted disabled:cursor-not-allowed"
              aria-describedby="username-preview-help"
            />
            <p id="username-preview-help" className="mt-2 text-sm text-muted">
              Username field preview. Account editing is not connected in this
              form.
            </p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Client
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href="/clients"
          >
            Cancel
          </Link>
        </div>
        <p
          role="status"
          className="px-5 text-sm text-muted empty:hidden sm:px-7"
        >
          {submitted
            ? "Form reviewed. No changes were saved in this demo."
            : ""}
        </p>
      </form>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/layout.tsx

Purpose: Shared authenticated trainer shell containing the sidebar, compact global header, skip link, and main content region.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import GlobalHeader from "@/components/GlobalHeader";
import Sidebar from "@/components/Sidebar";
import TrainerAuthGuard from "@/components/TrainerAuthGuard";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <TrainerAuthGuard>
      <div className="min-h-dvh min-[761px]:grid min-[761px]:grid-cols-[248px_minmax(0,1fr)]">
        <a
          className="fixed -top-24 left-3 z-10 bg-primary p-3 text-white focus:top-3"
          href="#main-content"
        >
          Skip to content
        </a>
        <Sidebar />
        <div className="min-w-0">
          <GlobalHeader date={today} />
          <main
            id="main-content"
            className="w-full min-w-0 px-4 pt-6 pb-10 min-[761px]:p-6 min-[1001px]:px-14 min-[1001px]:pt-8 min-[1001px]:pb-10"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </TrainerAuthGuard>
  );
}

```

---

## FILE: web/src/app/(trainer)/meal-plans/[id]/loading.tsx

Purpose: Route-owned skeleton fallback for /meal-plans/[id].

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading meal plan" aria-busy="true" className="max-w-5xl animate-pulse">
      <div className="mb-5 h-5 w-36 rounded bg-border" />
      <div className="mb-6 h-9 w-52 rounded bg-border" />
      <div className="mb-6 flex gap-8 border-b border-border pb-5">
        <div className="h-10 w-24 rounded bg-border" />
        <div className="h-10 w-24 rounded bg-border" />
      </div>
      <div className="mb-3 h-6 w-20 rounded bg-border" />
      <div className="divide-y divide-border/50 rounded-xl bg-surface px-6">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid gap-4 py-6 sm:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="h-6 w-36 rounded bg-border" />
            <div className="h-4 w-full max-w-md rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/meal-plans/[id]/page.tsx

Purpose: Page implementation for /meal-plans/[id].

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Displays a hardcoded meal plan and meals; only the route ID is dynamic.

FULL SOURCE:

```tsx
import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
type MealPlanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MealPlanPage({ params }: MealPlanPageProps) {
  const { id } = await params;

  const meals = [
    {
      id: 1,
      name: "Breakfast",
      instructions: "3 eggs, oats and banana",
    },
    {
      id: 2,
      name: "Lunch",
      instructions: "Chicken, rice and salad",
    },
    {
      id: 3,
      name: "Dinner",
      instructions: "Fish, potatoes and vegetables",
    },
  ];

  return (
    <div className="max-w-5xl">
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
      <PageHeader title="Weight Loss Plan" />

      <section aria-label="Plan overview" className="mb-6 border-b border-border pb-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div><dt className="text-muted">Plan ID</dt><dd className="mt-1 font-medium tabular-nums">{id}</dd></div>
          <div><dt className="text-muted">Meals</dt><dd className="mt-1 font-medium tabular-nums">{meals.length}</dd></div>
        </dl>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Meals</h2>

      <div className="divide-y divide-border/50 rounded-xl bg-surface px-5 sm:px-6">
        {meals.map((meal) => (
          <div key={meal.id} className="grid gap-3 py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:py-6">
            <h3 className="flex items-center gap-4 text-lg font-medium"><span className="text-sm text-muted tabular-nums">{String(meal.id).padStart(2, "0")}</span>{meal.name}</h3>

            <p className="text-sm leading-relaxed text-muted sm:pt-1">{meal.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/meal-plans/new/loading.tsx

Purpose: Route-owned skeleton fallback for /meal-plans/new.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading meal plan form" aria-busy="true" className="max-w-3xl animate-pulse">
      <div className="mb-5 h-5 w-36 rounded bg-border" />
      <div className="mb-6 h-9 w-52 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="space-y-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <div className="h-6 w-32 rounded bg-border" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-border" />
          </div>
          <div><div className="mb-2 h-4 w-24 rounded bg-border" /><div className="h-12 rounded-md bg-border" /></div>
          <div><div className="mb-2 h-4 w-24 rounded bg-border" /><div className="h-32 rounded-md bg-border" /></div>
        </div>
        <div className="flex gap-3 border-t border-border bg-primary-soft/40 px-5 py-4">
          <div className="h-11 w-36 rounded-md bg-border" />
          <div className="h-11 w-24 rounded-md bg-border" />
        </div>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/payments/loading.tsx

Purpose: Route-owned skeleton fallback for /payments.

Used by:
- `web/src/app/(trainer)/payments/page.tsx`

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div
      aria-label="Loading payments"
      aria-busy="true"
      className="animate-pulse"
    >
      <div className="mb-6">
        <div className="h-9 w-40 rounded-md bg-border" />
        <div className="mt-3 h-4 w-full max-w-lg rounded bg-border" />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div
            key={card}
            className="min-h-24 rounded-lg border border-border bg-surface p-5"
          >
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-4 h-7 w-24 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-4 flex gap-4 rounded-lg border border-border bg-surface p-4">
        <div className="h-11 w-full max-w-sm rounded-md bg-border" />
        <div className="ml-auto h-11 w-40 rounded-md bg-border" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid min-w-190 grid-cols-5 gap-4 bg-background px-5 py-4">
          {[0, 1, 2, 3, 4].map((cell) => (
            <div key={cell} className="h-4 w-16 rounded bg-border" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="grid min-w-190 grid-cols-5 gap-4 border-t border-border px-5 py-5"
          >
            {[0, 1, 2, 3, 4].map((cell) => (
              <div key={cell} className="h-5 w-4/5 rounded bg-border" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/payments/page.tsx

Purpose: Page implementation for /payments.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Pagination passes `pageSize` (5) as `totalPages`, so the UI always says there are five pages regardless of the API response.
- The search input has its value/onChange commented out; it never filters.
- `statusFilter` controls the select but is never applied to data or requests.
- Changing page replaces the entire page with a skeleton because `getPayments` sets the page-level `isLoading` flag.
- The payments response is not typed and its `totalPages`/`totalCount` fields are discarded.
- Stats errors are unhandled; list errors only go to the console.
- `getPaymentStatus` uses loose equality and treats every non-1 value as Pending.

FULL SOURCE:

```tsx
"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import Pagination from "@/components/Pagination";
import Avatar from "@/components/Avatar";
import PaymentsLoading from "./loading";

type StatusFilter = "All" | "Paid" | "Pending";
type Payments = {
  id: number;
  clientName: string;
  amount: number;
  status: number;
  dueDate: string;
  paidAt: string | null;
};
type Stats = {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
};

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [payments, setPayments] = useState<Payments[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    totalPaidAmount: 0,
    totalPendingAmount: 0,
  });
  const [page, setPage] = useState(1);
  const pageSize = 5;

  async function getPayments() {
    try {
      setIsLoading(true);
      const response = await api.get(Endpoints.payments(page, pageSize));
      setPayments(response.data.items);
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function getPaymentStatus(paymentStatus: number) {
    if (paymentStatus == 1) {
      return "Paid";
    }
    return "Pending";
  }

  async function getPaymentStats() {
    const statsResponse = await api.get(Endpoints.paymentsStats);

    setStats(statsResponse.data);
  }

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPaymentStats();
  }, []);

  if (isLoading) {
    return <PaymentsLoading />;
  }

  return (
    <div className="[&>header_h1]:text-[28px] [&>header_p]:text-sm [&>header_p]:leading-relaxed">
      <PageHeader
        title="Payments"
        description="Review client payments, due dates, and paid or pending balances."
      />

      <section
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 [&>div:last-child>p:last-child]:text-warning"
        aria-label="Payment summary"
      >
        <SummaryMetric
          compact
          label="Paid amount"
          value={currencyFormatter.format(stats.totalPaidAmount)}
        />
        <SummaryMetric
          compact
          label="Pending amount"
          value={currencyFormatter.format(stats.totalPendingAmount)}
        />
      </section>

      <section
        className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between"
        aria-label="Payment tools"
      >
        <div className="min-w-0 sm:w-96">
          <label
            htmlFor="payment-search"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Search payments
          </label>
          <input
            id="payment-search"
            type="search"
            // value={query}
            // onChange={(event) => setQuery(event.target.value)}
            placeholder="Client name"
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>
        <div className="sm:w-44">
          <label
            htmlFor="payment-status-filter"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Payment status
          </label>
          <select
            id="payment-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </section>

      <p className="mb-2 text-sm text-muted" aria-live="polite">
        Payments · {payments.length} of {stats.totalPayments} shown
      </p>

      <div
        className="w-full overflow-x-auto rounded-lg border border-border bg-surface"
        role="region"
        aria-label="Payments table"
        tabIndex={0}
      >
        <table className="w-full min-w-190 border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                Client
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                Amount
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                Due Date
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => {
                const status = getPaymentStatus(payment.status);

                return (
                  <tr
                    key={payment.id}
                    className={`border-b border-border last:border-b-0 transition-colors hover:bg-hover ${
                      status === "Pending" ? "bg-warning-soft/20" : ""
                    }`}
                  >
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar name={payment.clientName} />

                        <span className="font-semibold text-foreground">
                          {payment.clientName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right align-middle font-semibold tabular-nums text-foreground">
                      {currencyFormatter.format(payment.amount)}
                    </td>

                    <td className="px-5 py-4 align-middle text-muted">
                      {new Date(payment.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <StatusBadge status={status} />
                    </td>

                    <td className="px-5 py-4 text-right align-middle">
                      {status === "Pending" ? (
                        <button
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted"
                          disabled
                          title="Payment updates are not available yet"
                        >
                          <Icon name="check" className="size-4" />
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyState
                    icon="payment"
                    title="No matching payments"
                    description="Try another client name or payment status."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={pageSize}
        onPrevious={() => setPage((previousPage) => previousPage - 1)}
        onNext={() => setPage((previousPage) => previousPage + 1)}
      />
    </div>
  );
}

```

---

## FILE: web/src/app/layout.tsx

Purpose: Root App Router layout: metadata, Inter font, global CSS, and pre-hydration theme initialization.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Inline theme script duplicates part of ThemeToggle’s theme knowledge, though it prevents a light/dark flash.

FULL SOURCE:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PT System",
  description: "Personal Trainer Management System",
};

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem("pt-system-theme");
      var isDark = theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} bg-background text-foreground dark:bg-background dark:text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

```

---

## FILE: web/src/app/loading.tsx

Purpose: Route-owned skeleton fallback for /.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <main
      aria-label="Loading"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12"
    >
      <div className="w-full max-w-md animate-pulse">
        <div className="mx-auto size-11 rounded-lg bg-border" />
        <div className="mx-auto mt-5 h-9 w-24 rounded-md bg-border" />
        <div className="mt-8 space-y-4">
          {[0, 1].map((field) => (
            <div key={field}>
              <div className="mb-2 h-5 w-20 rounded bg-border" />
              <div className="h-12 w-full rounded-md bg-border" />
            </div>
          ))}
          <div className="h-12 w-full rounded-md bg-border" />
        </div>
        <div className="mx-auto mt-12 h-5 w-64 max-w-full rounded bg-border" />
      </div>
    </main>
  );
}

```

---

## FILE: web/src/app/login/loading.tsx

Purpose: Route-owned skeleton fallback for /login.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <main
      aria-label="Loading login"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12"
    >
      <div className="w-full max-w-md animate-pulse">
        <div className="mx-auto size-11 rounded-lg bg-border" />
        <div className="mx-auto mt-5 h-9 w-24 rounded-md bg-border" />
        <div className="mt-8 space-y-4">
          {[0, 1].map((field) => (
            <div key={field}>
              <div className="mb-2 h-5 w-20 rounded bg-border" />
              <div className="h-12 w-full rounded-md bg-border" />
            </div>
          ))}
          <div className="h-12 w-full rounded-md bg-border" />
        </div>
        <div className="mx-auto mt-12 h-5 w-64 max-w-full rounded bg-border" />
      </div>
    </main>
  );
}

```

---

## FILE: web/src/app/page.tsx

Purpose: Root route that immediately redirects visitors to `/login`.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}

```

---

## FILE: web/src/components/Avatar.tsx

Purpose: Renders initials in a circular trainer/client avatar.

Used by:
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/components/GlobalHeader.tsx`
- `web/src/components/Sidebar.tsx`

Potential concerns:
- Assumes a useful non-empty name; blank values produce no initials.

FULL SOURCE:

```tsx
export default function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-hover dark:bg-primary-soft dark:text-foreground"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

```

---

## FILE: web/src/components/BackLink.tsx

Purpose: Reusable back-navigation link with a left-arrow icon.

Used by:
- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx`
- `web/src/app/(trainer)/clients/[id]/not-found.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/new/page.tsx`
- `web/src/app/(trainer)/meal-plans/[id]/page.tsx`
- `web/src/app/(trainer)/meal-plans/new/page.tsx`
- `web/src/app/(trainer)/workout-plans/[id]/page.tsx`
- `web/src/app/(trainer)/workout-plans/new/page.tsx`

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = { href: string; children: React.ReactNode };

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted transition-colors hover:text-primary-hover dark:hover:text-foreground"
    >
      <ArrowLeft className="size-5" aria-hidden="true" />
      {children}
    </Link>
  );
}

```

---

## FILE: web/src/components/GlobalHeader.tsx

Purpose: Compact trainer-wide header with date supplied by the layout, theme control, and JWT-derived trainer identity.

Used by:
- `web/src/app/(trainer)/layout.tsx`

Potential concerns:
- Manually decodes JWT payload data for display without verifying it; suitable only as non-authoritative UI text.
- The no-op `useSyncExternalStore` subscription never reacts if the token changes while this component remains mounted.
- The date is supplied by the server layout and will not update at midnight without a render/navigation; server timezone may differ from the browser.

FULL SOURCE:

```tsx
"use client";

import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { CalendarDays } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getTrainerName() {
  try {
    const token = localStorage.getItem("token");
    const encodedPayload = token?.split(".")[1];

    if (!encodedPayload) return "Trainer";

    const normalizedPayload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(normalizedPayload)) as Record<
      string,
      unknown
    >;
    const name =
      payload.unique_name ??
      payload.name ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    return typeof name === "string" && name.trim() ? name : "Trainer";
  } catch {
    return "Trainer";
  }
}

function getServerTrainerName() {
  return "Trainer";
}

export default function GlobalHeader({ date }: { date: string }) {
  const trainerName = useSyncExternalStore(
    subscribe,
    getTrainerName,
    getServerTrainerName,
  );

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 min-[761px]:px-6 min-[1001px]:px-14">
      <div className="flex min-w-0 items-center gap-2 text-sm text-muted">
        <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{date}</span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={trainerName} />
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-foreground">
              {trainerName}
            </p>
            <p className="text-xs text-muted">Trainer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

```

---

## FILE: web/src/components/PlanCard.tsx

Purpose: Workout/meal plan card variants plus a reusable plan-card skeleton.

Used by:
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`

Potential concerns:
- Contains two substantially different card designs and a skeleton in one file, increasing branching and styling density.

FULL SOURCE:

```tsx
import Link from "next/link";
import Icon from "@/components/Icon";
import { Zap, ArrowRight } from "lucide-react";

type PlanCardProps = {
  id: number;
  name: string;
  description: string;
  count: number;
  kind: "workout" | "meal";
};

export default function PlanCard({ id, name, description, count, kind }: PlanCardProps) {
  const countLabel = `${count} ${kind === "workout" ? "exercises" : "meals"}`;

  if (kind === "workout") {
    return (
      <article className="flex min-w-0 flex-col justify-between rounded-2xl border border-gray-100 dark:border-[#2C3238] bg-surface p-6 shadow-xs transition-all hover:border-gray-200 dark:hover:border-gray-700 min-h-[220px]">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-lg leading-snug font-bold tracking-tight text-[#1F2937] dark:text-[#F3F4F6] wrap-anywhere">
              {name}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 text-xs font-semibold text-[#0284c7] dark:text-sky-300 border border-sky-100/80 dark:border-sky-900/50">
              <Zap className="size-3 text-[#0284c7] dark:text-sky-300 fill-current" />
              {countLabel}
            </span>
          </div>
          <p
            className="mt-3.5 mb-6 text-sm leading-relaxed text-[#6B7280] dark:text-[#9CA3AF] line-clamp-3 min-h-[44px] wrap-anywhere"
            title={description}
          >
            {description}
          </p>
        </div>
        <Link
          href={`/workout-plans/${id}`}
          aria-label={`View ${name}`}
          className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#EFF6FF] hover:bg-sky-100/90 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 px-4 text-sm font-semibold text-[#0284c7] dark:text-sky-300 transition-colors"
        >
          View Plan <ArrowRight className="size-4 text-[#0284c7] dark:text-sky-300" />
        </Link>
      </article>
    );
  }

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary">
      <div className="relative flex h-28 items-center justify-center border-b border-border bg-primary-soft">
        <div aria-hidden="true" className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-surface/60">
          <div className="flex size-14 items-center justify-center rounded-full border border-primary/20">
            <Icon name="meal" className="size-7 text-primary dark:text-foreground" />
          </div>
        </div>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-primary-hover dark:text-foreground">
          <Icon name="meal" className="size-3.5" />{countLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 text-lg leading-snug font-semibold tracking-tight wrap-anywhere">{name}</h3>
        </div>
        <p className="mt-2 mb-5 line-clamp-3 min-h-[63px] text-sm leading-[21px] text-muted wrap-anywhere" title={description}>{description}</p>
        <Link href={`/meal-plans/${id}`} aria-label={`View ${name}`} className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-soft px-4 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary hover:text-white dark:text-foreground">
          View Plan <Icon name="arrow" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function PlanCardSkeleton({ kind = "workout" }: { kind?: "workout" | "meal" }) {
  if (kind === "workout") {
    return (
      <div aria-hidden="true" className="animate-pulse rounded-2xl border border-gray-100 dark:border-[#2C3238] bg-surface p-6 flex flex-col justify-between min-h-[220px]">
        <div className="flex justify-between items-start gap-3">
          <div className="h-6 w-1/2 rounded bg-border/60" />
          <div className="h-6 w-24 rounded-md bg-sky-50 dark:bg-sky-950/40" />
        </div>
        <div className="mt-4 mb-6 min-h-[44px] space-y-2">
          <div className="h-4 w-full rounded bg-border/40" />
          <div className="h-4 w-2/3 rounded bg-border/40" />
        </div>
        <div className="h-10 w-full rounded-lg bg-sky-50 dark:bg-sky-950/40" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="animate-pulse rounded-lg border border-border bg-surface p-5">
      <div className="flex justify-between gap-3"><div className="h-6 w-1/2 rounded bg-border" /><div className="h-6 w-20 rounded bg-border" /></div>
      <div className="mt-4 min-h-[72px]"><div className="h-4 w-full rounded bg-border" /><div className="mt-2 h-4 w-2/3 rounded bg-border" /></div>
      <div className="mt-4 h-11 rounded bg-primary-soft" />
    </div>
  );
}

```

---

## FILE: web/src/components/SummaryMetric.tsx

Purpose: Compact or regular summary metric card.

Used by:
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
type SummaryMetricProps = {
  label: string;
  value: string | number;
  compact?: boolean;
};

export default function SummaryMetric({
  label,
  value,
  compact = false,
}: SummaryMetricProps) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-lg border border-border bg-surface ${compact ? "min-h-24 gap-2 px-5 py-4" : "min-h-28 gap-3 p-5"}`}
    >
      <p
        className={
          compact
            ? "text-xs font-semibold tracking-wide text-muted uppercase"
            : "text-sm font-medium text-muted"
        }
      >
        {label}
      </p>
      <p
        className={`${compact ? "text-2xl" : "text-[32px]"} leading-none font-semibold tracking-tight text-foreground tabular-nums`}
      >
        {value}
      </p>
    </div>
  );
}

```

---

## FILE: web/src/data/mock-data.ts

Purpose: Static client and payment fixtures used by demo/static pages.

Used by:
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`

Potential concerns:
- Mock entities overlap with live API-backed screens, enabling inconsistent records and status displays.

FULL SOURCE:

```tsx
// Existing sample records, shared by the roster, profile, payments, and dashboard.
export type Client = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  paymentStatus: "Paid" | "Pending";
};

export const clients: Client[] = [
  {
    id: 1,
    fullName: "Ahmad Hassan",
    email: "ahmad@example.com",
    phoneNumber: "70123456",
    paymentStatus: "Paid",
  },
  {
    id: 2,
    fullName: "Rami Ali",
    email: "rami@example.com",
    phoneNumber: "71111222",
    paymentStatus: "Pending",
  },
];

export type Payment = {
  id: number;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending";
};

export const payments: Payment[] = [
  {
    id: 1,
    clientName: "Ahmad Hassan",
    amount: 50,
    dueDate: "2026-09-30",
    status: "Paid",
  },
  {
    id: 2,
    clientName: "Rami Ali",
    amount: 50,
    dueDate: "2026-09-30",
    status: "Pending",
  },
];


```

---

# PT System Frontend Audit — Full Source Part 3

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

Files in this part: 17. Source is reproduced verbatim from the audited snapshot.

---

## FILE: web/next.config.ts

Purpose: Next.js configuration object; currently contains no custom options.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;

```

---

## FILE: web/postcss.config.mjs

Purpose: PostCSS setup enabling the Tailwind CSS v4 plugin.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

---

## FILE: web/src/app/(trainer)/clients/[id]/daily-activity/loading.tsx

Purpose: Route-owned skeleton fallback for /clients/[id]/daily-activity.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading daily activity" aria-busy="true" className="max-w-5xl animate-pulse">
      <div className="mb-5 h-5 w-40 rounded bg-border" />
      <div className="mb-6 h-9 w-44 rounded bg-border" />
      <div className="mb-6 rounded-xl bg-surface p-5">
        <div className="h-4 w-16 rounded bg-border" />
        <div className="mt-2 h-11 w-60 rounded-md bg-border" />
      </div>
      {["Workouts", "Meals"].map((section) => (
        <div key={section} className="mb-7">
          <div className="mb-3 h-6 w-28 rounded bg-border" />
          <div className="divide-y divide-border rounded-xl bg-surface px-5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex justify-between py-5">
                <div className="h-5 w-36 rounded bg-border" />
                <div className="h-6 w-20 rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/[id]/edit/page.tsx

Purpose: Page implementation for /clients/[id]/edit.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Form fields are hardcoded to one sample client and are not loaded from or saved to the API.
- A Client Component unwraps async route params with React `use`, but the ID is only used for navigation links.
- The success state says no changes were saved; this is intentionally a demo form.

FULL SOURCE:

```tsx
"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { use, useState } from "react";

type EditClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditClientPage({ params }: EditClientPageProps) {
  const { id } = use(params);

  const [fullName, setFullName] = useState("Ahmad Hassan");
  const [email, setEmail] = useState("ahmad@example.com");
  const [phoneNumber, setPhoneNumber] = useState("70123456");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader
        title="Edit Client"
        description={`Update profile and contact details · Client ${id}`}
      />

      <p className="mb-4 text-sm text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <fieldset className="grid gap-5 p-5 sm:p-6">
          <legend className="sr-only">Personal information</legend>
          <div>
            <h2 className="text-lg font-semibold">Personal information</h2>
            <p className="mt-1 text-sm text-muted">
              How to reach your client.
            </p>
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="grid gap-5 border-t border-border p-5 sm:p-6">
          <legend className="sr-only">Client account</legend>
          <h2 className="text-lg font-semibold">Client account</h2>
          <div>
            <label
              htmlFor="username-preview"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username-preview"
              type="text"
              disabled
              placeholder="Client username"
              className="min-h-11 w-full rounded-lg border border-input-border bg-background px-3 py-2 text-muted disabled:cursor-not-allowed"
              aria-describedby="username-preview-help"
            />
            <p id="username-preview-help" className="mt-2 text-sm text-muted">
              Username field preview. Account editing is not connected in this
              form.
            </p>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Changes
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href={`/clients/${id}`}
          >
            Cancel
          </Link>
        </div>
        <p
          role="status"
          className="px-5 text-sm text-muted empty:hidden sm:px-7"
        >
          {submitted
            ? "Form reviewed. No changes were saved in this demo."
            : ""}
        </p>
      </form>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/loading.tsx

Purpose: Route-owned skeleton fallback for /clients.

Used by:
- `web/src/app/(trainer)/clients/page.tsx`

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading clients" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-36 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-28 rounded-md bg-border" />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="min-h-28 rounded-lg border border-border bg-surface p-5">
            <div className="h-4 w-24 rounded bg-border" />
            <div className="mt-5 h-8 w-14 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-4 h-11 w-full max-w-sm rounded-md bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid min-w-180 grid-cols-5 gap-4 bg-background px-5 py-4">
          {[0, 1, 2, 3, 4].map((cell) => (
            <div key={cell} className="h-4 w-16 rounded bg-border" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid min-w-180 grid-cols-5 gap-4 border-t border-border px-5 py-5">
            {[0, 1, 2, 3, 4].map((cell) => (
              <div key={cell} className="h-5 w-4/5 rounded bg-border" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/clients/page.tsx

Purpose: Page implementation for /clients.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Search intentionally filters only the current API page, which may surprise users expecting global search.
- `createdAt.split("T")[1].split(".")[0]` assumes a precise timestamp shape and can throw for malformed data.
- The entire page is replaced by its skeleton on every page change.
- API responses use local, unshared types and untyped Axios responses.

FULL SOURCE:

```tsx
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import ClientsLoading from "./loading";

type Client = {
  id: number;
  trainerId: number;
  fullName: string;
  username: string;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

type Stats = {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
};

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 5;

  async function getAllClients() {
    try {
      setIsLoading(true);

      const response = await api.get(Endpoints.clients(page, pageSize));

      setClients(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to load clients:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getClientStats() {
    try {
      const response = await api.get(Endpoints.clientsStats);

      setStats(response.data);
    } catch (error) {
      console.error("Failed to load client stats:", error);
    }
  }

  useEffect(() => {
    getAllClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  useEffect(() => {
    getClientStats();
  }, []);

  if (isLoading) {
    return <ClientsLoading />;
  }

  const normalizedQuery = query.trim().toLowerCase();

  const filteredClients = clients.filter((client) => {
    const matchesQuery =
      client.fullName.toLowerCase().includes(normalizedQuery) ||
      client.email?.toLowerCase().includes(normalizedQuery) ||
      client.phoneNumber.includes(normalizedQuery);

    return matchesQuery;
  });

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${totalCount} clients. Manage profiles, contact details, and account status.`}
      >
        <Link
          href="/clients/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>

      <section
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-label="Client summary"
      >
        <SummaryMetric label="Total" value={stats.totalClients} />
        <SummaryMetric label="Active" value={stats.activeClients} />
        <SummaryMetric label="Inactive" value={stats.inactiveClients} />
      </section>

      <section
        className="mb-5 flex flex-col gap-4 min-[761px]:flex-row min-[761px]:items-end"
        aria-label="Client tools"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="client-search"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Search this page
          </label>
          <input
            id="client-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, or phone"
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary min-[761px]:max-w-sm"
          />
        </div>
      </section>

      <p className="mb-2 text-sm text-muted" aria-live="polite">
        Clients · {filteredClients.length} of {stats.totalClients} shown on this
        page
      </p>

      <div
        className="w-full overflow-x-auto rounded-xl border border-border bg-surface dark:border-border dark:bg-surface"
        role="region"
        aria-label="Clients table"
        tabIndex={0}
      >
        <table className="w-full min-w-190 border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr className="border-b border-border bg-background">
              {["Client", "Phone", "Status", "Created At", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`bg-background px-5 py-3 align-middle text-sm font-medium text-muted dark:bg-background ${heading === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-border transition-colors last:border-b-0 hover:bg-hover focus-within:bg-hover"
                >
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.fullName} />
                      <div>
                        <span className="text-lg font-semibold">
                          {client.fullName}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {client.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle text-muted">
                    {client.phoneNumber}
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <StatusBadge
                      status={client.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(client.createdAt))}
                      </span>

                      <span className="mt-1 text-sm text-muted">
                        {client.createdAt.split("T")[1].split(".")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-hover"
                        href={`/clients/${client.id}`}
                        aria-label={`View ${client.fullName}`}
                      >
                        <Icon name="view" className="size-4" />
                        View
                      </Link>
                      <Link
                        className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-sm text-foreground transition-colors hover:bg-hover"
                        href={`/clients/${client.id}/edit`}
                        aria-label={`Edit ${client.fullName}`}
                      >
                        <Icon name="edit" className="size-4" />
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-border dark:border-border">
                <td className="p-0" colSpan={5}>
                  <EmptyState
                    icon="clients"
                    title="No clients to display"
                    description="No clients match this page and search. Try another search or page."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrevious={() => setPage((previousPage) => previousPage - 1)}
        onNext={() => setPage((previousPage) => previousPage + 1)}
      />
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/meal-plans/loading.tsx

Purpose: Route-owned skeleton fallback for /meal-plans.

Used by:
- `web/src/app/(trainer)/meal-plans/page.tsx`

Potential concerns:
- Skeleton markup is route-local as requested but heavily duplicated across routes.
- The fallback uses `aria-busy`/`aria-label` but no live status text; announcement behavior may vary.

FULL SOURCE:

```tsx
export default function Loading() {
  return (
    <div aria-label="Loading meal plans" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-4 w-36 rounded bg-border" />
          <div className="mt-3 h-9 w-44 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-40 rounded-md bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="min-h-24 rounded-lg border border-border bg-surface p-5">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-4 h-7 w-16 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1200px]:grid-cols-3">
        {Array.from({ length: 6 }).map((_, card) => (
          <div key={card} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="h-28 bg-primary-soft" />
            <div className="p-5">
              <div className="h-6 w-1/2 rounded bg-border" />
              <div className="mt-3 h-4 w-full rounded bg-border" />
              <div className="mt-2 h-4 w-2/3 rounded bg-border" />
              <div className="mt-5 h-11 rounded-md bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/meal-plans/page.tsx

Purpose: Page implementation for /meal-plans.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- `page`, `setPage`, `totalPages`, and `setTotalPages` exist, but no pagination UI changes pages; only the first API page is reachable.
- Stats loading is not awaited by the page skeleton and has no error handling.
- API response objects are untyped; `meals` is only `unknown[]`.

FULL SOURCE:

```tsx
"use client";
import PlanCard from "@/components/PlanCard";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import SummaryMetric from "@/components/SummaryMetric";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import MealPlansLoading from "./loading";


type MealPlan = {
  id: number;
  name: string;
  description: string;
  meals : unknown[];
};
type MealStats = {
  totalPlans: number;
  totalAssignments: number;
  completedMeals: number;
  pendingMeals: number;
  skippedMeals: number;
};

export default function MealPlansPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<MealStats>({
    totalPlans: 0,
    totalAssignments: 0,
    completedMeals: 0,
    pendingMeals: 0,
    skippedMeals: 0,
  });

  async function getMealPlans() {
    try {
      setIsLoading(true);
      const mealResponse = await api.get(Endpoints.mealPlans(page, pageSize));
      setMealPlans(mealResponse.data.items);
      setTotalCount(mealResponse.data.totalCount);
      setTotalPages(mealResponse.data.totalPages);
    } catch (error) {
      console.error("Failed to load meal plans:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getMealStats() {
    const mealStats = await api.get(Endpoints.mealPlansStats);

    setStats(mealStats.data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getMealPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getMealStats();
  }, []);

  if (isLoading) {
    return <MealPlansLoading />;
  }

  return (
    <div className="[&>header_h1]:text-[28px] [&>header_p]:text-sm [&>header_p]:leading-relaxed">
      <PageHeader
        eyebrow="NUTRITION GUIDANCE"
        title="Meal Plans"
        description="Reusable meal plans with clear instructions for daily nutrition."
      >
        <Link
          href="/meal-plans/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Create Meal Plan
        </Link>
      </PageHeader>
      <section
        aria-label="Meal plan summary"
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <SummaryMetric compact label="Meal plans" value={stats.totalPlans} />
        <SummaryMetric compact label="Total assigned plans" value={stats.totalAssignments} />
      </section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <h2 className="text-sm font-semibold">Meal plan library</h2>
        <p className="text-sm text-muted">{totalCount} meal plans</p>
      </div>
      <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-3">
        {mealPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            id={plan.id}
            name={plan.name}
            description={plan.description}
            count={plan.meals.length}
            kind="meal"
          />
        ))}
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/workout-plans/[id]/page.tsx

Purpose: Page implementation for /workout-plans/[id].

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Displays a hardcoded plan and exercises; only the route ID is dynamic.

FULL SOURCE:

```tsx
import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
type WorkoutPlanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutPlanPage({
  params,
}: WorkoutPlanPageProps) {
  const { id } = await params;

  const exercises = [
    {
      id: 1,
      name: "Bench Press",
      sets: 4,
      reps: 10,
      restSeconds: 90,
    },
    {
      id: 2,
      name: "Shoulder Press",
      sets: 3,
      reps: 12,
      restSeconds: 60,
    },
  ];

  return (
    <div className="max-w-5xl">
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader title="Push Day" description="Chest, shoulders and triceps workout." />

      <section aria-label="Plan overview" className="mb-6 border-b border-border pb-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div><dt className="text-muted">Plan ID</dt><dd className="mt-1 font-medium tabular-nums">{id}</dd></div>
          <div><dt className="text-muted">Exercises</dt><dd className="mt-1 font-medium tabular-nums">{exercises.length}</dd></div>
        </dl>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Exercises</h2>

      <div
        className="w-full overflow-x-auto rounded-lg border border-border bg-surface dark:border-border dark:bg-surface"
        role="region"
        aria-label="Exercises"
        tabIndex={0}
      >
        <table className="workspace-table w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              {["Exercise", "Sets", "Reps", "Rest"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`bg-background px-5 py-3 align-middle text-sm font-medium text-muted ${heading === "Exercise" ? "text-left" : "text-right"}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr
                key={exercise.id}
                className="border-t border-border transition-colors hover:bg-hover focus-within:bg-hover dark:border-border dark:hover:bg-hover dark:focus-within:bg-hover"
              >
                <td className="px-5 py-5 align-middle font-medium"><span className="mr-4 inline-block w-6 text-sm font-normal text-muted tabular-nums">{String(exercise.id).padStart(2, "0")}</span>{exercise.name}</td>
                <td className="px-5 py-5 text-right align-middle">{exercise.sets}</td>
                <td className="px-5 py-5 text-right align-middle">{exercise.reps}</td>
                <td className="px-5 py-5 text-right align-middle text-muted">
                  {exercise.restSeconds} seconds
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```

---

## FILE: web/src/app/(trainer)/workout-plans/page.tsx

Purpose: Page implementation for /workout-plans.

Used by:
- Next.js/configuration convention or currently unimported.

Potential concerns:
- Search filters only the currently fetched server page, not the full workout-plan collection.
- Summary values can display zeros while stats are still loading because only card-list loading is tracked.
- The file mixes token-based colors with many hardcoded light/dark hex and sky color values.
- Async requests are not cancelled; rapid navigation can allow stale responses.

FULL SOURCE:

```tsx
"use client";

import PlanCard, { PlanCardSkeleton } from "@/components/PlanCard";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dumbbell, Users, List, Search } from "lucide-react";

type WorkoutPlan = {
  id: number;
  name: string;
  description: string;
  exercises: unknown[];
};

type WorkoutStats = {
  totalPlans: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  skippedAssignments: number;
};

export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState<WorkoutStats>({
    totalPlans: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    skippedAssignments: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 10;

  async function getAllWorkoutPlans() {
    try {
      setIsLoading(true);

      const response = await api.get(Endpoints.workoutPlans(page, pageSize));

      setWorkoutPlans(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to load workout plans:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getWorkoutStats() {
    try {
      const response = await api.get(Endpoints.workoutPlansStats);

      setStats(response.data);
    } catch (error) {
      console.error("Failed to load workout stats:", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getAllWorkoutPlans();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getWorkoutStats();
  }, []);

  const totalDrills = workoutPlans.reduce(
    (sum, plan) => sum + (plan.exercises?.length || 0),
    0,
  );

  const filteredPlans = searchTerm.trim()
    ? workoutPlans.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : workoutPlans;

  const displayedCount = searchTerm.trim()
    ? filteredPlans.length
    : totalCount || workoutPlans.length;

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1F2937] dark:text-[#F3F4F6]">
            Workout Plans
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#6B7280] dark:text-[#9CA3AF]">
            Create, assign, and organize workout routines for your clients.
          </p>
        </div>
        <Link
          href="/workout-plans/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2F855A] hover:bg-[#276749] text-white px-4 py-2.5 text-sm font-semibold shadow-xs transition-colors shrink-0"
        >
          <span className="text-sm font-bold leading-none tracking-tight">
            + +
          </span>
          <span>Create Workout Plan</span>
        </Link>
      </div>

      {/* Compact Summary Cards */}
      <section
        aria-label="Workout plan summary"
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5"
      >
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-[#2C3238] bg-surface p-5 shadow-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wider text-[#6B7280] dark:text-[#9CA3AF] uppercase">
              TOTAL ACTIVE PLANS
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[#1F2937] dark:text-[#F3F4F6] sm:text-[26px]">
              {stats.totalPlans || totalCount} Templates
            </p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF6EF] dark:bg-[#173D2A]">
            <Dumbbell className="size-5 text-[#2F855A]" strokeWidth={2.2} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-[#2C3238] bg-surface p-5 shadow-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wider text-[#6B7280] dark:text-[#9CA3AF] uppercase">
              ASSIGNED TO CLIENTS
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[#1F2937] dark:text-[#F3F4F6] sm:text-[26px]">
              {stats.totalAssignments} Clients
            </p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50">
            <Users
              className="size-5 text-[#0284c7] dark:text-sky-400"
              strokeWidth={2}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-[#2C3238] bg-surface p-5 shadow-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wider text-[#6B7280] dark:text-[#9CA3AF] uppercase">
              EXERCISE LIBRARY
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[#1F2937] dark:text-[#F3F4F6] sm:text-[26px]">
              {totalDrills} Drills
            </p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50">
            <List
              className="size-5 text-[#0284c7] dark:text-sky-400"
              strokeWidth={2.2}
            />
          </div>
        </div>
      </section>

      {/* Search / Library Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-[#2C3238] bg-surface px-3.5 py-2 w-full max-w-sm shadow-xs">
          <Search className="size-4 shrink-0 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search workout plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg- text-sm text-[#1F2937] dark:text-[#F3F4F6] placeholder:text-[#9CA3AF]  "
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs sm:text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">
            Showing:
          </span>
          <span className="inline-flex items-center rounded-md bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 text-xs font-semibold text-[#0284c7] dark:text-sky-300 border border-sky-100/60 dark:border-sky-900/40">
            {displayedCount} Plans Available
          </span>
        </div>
      </div>

      {/* Workout cards */}
      {isLoading ? (
        <div
          aria-busy="true"
          aria-label="Loading workout plans"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2, 3, 4, 5].map((placeholder) => (
            <PlanCardSkeleton key={placeholder} />
          ))}
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              description={plan.description}
              count={plan.exercises?.length || 0}
              kind="workout"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 dark:border-[#2C3238] bg-surface p-12 text-center shadow-xs">
          <EmptyState
            icon="workout"
            title="No workout plans found"
            description="Create a plan to start your workout library."
          />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 0 && (
        <div className="mt-8 border-t border-gray-100 dark:border-[#2C3238] pt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrevious={() => setPage((previousPage) => previousPage - 1)}
            onNext={() => setPage((previousPage) => previousPage + 1)}
          />
        </div>
      )}
    </div>
  );
}

```

---

## FILE: web/src/components/EmptyState.tsx

Purpose: Reusable empty-state panel with optional icon and action content.

Used by:
- `web/src/app/(trainer)/clients/[id]/not-found.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";

export default function EmptyState({ title, description, icon, children }: {
  title: string;
  description: string;
  icon?: IconName;
  children?: ReactNode;
}) {
  return (
    <div className="px-5 py-12 text-center whitespace-normal">
      {icon && <Icon name={icon} className="mb-3 size-6 text-muted" />}
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}

```

---

## FILE: web/src/components/Icon.tsx

Purpose: Maps the application’s semantic icon names to Lucide components.

Used by:
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/new/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/new/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/new/page.tsx`
- `web/src/components/EmptyState.tsx`
- `web/src/components/PlanCard.tsx`
- `web/src/components/Sidebar.tsx`

Potential concerns:
- No specific defect was identified in this file during static inspection.

FULL SOURCE:

```tsx
import {
  LayoutDashboard, Users, Dumbbell, Utensils, CreditCard, Plus, Pencil,
  ArrowRight, CheckCircle, Clock, XCircle, LogOut, Eye, CalendarDays,
} from "lucide-react";

// Keep the existing icon prop contract; Lucide now supplies every drawing.
const icons = {
  dashboard: LayoutDashboard,
  clients: Users,
  workout: Dumbbell,
  meal: Utensils,
  payment: CreditCard,
  plus: Plus,
  edit: Pencil,
  arrow: ArrowRight,
  check: CheckCircle,
  clock: Clock,
  close: XCircle,
  logout: LogOut,
  view: Eye,
  calendar: CalendarDays,
};

export type IconName = keyof typeof icons;

export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      className={`inline-block size-5 shrink-0 align-middle ${className}`}
      strokeWidth={1.7}
      aria-hidden="true"
      focusable="false"
    />
  );
}

```

---

## FILE: web/src/components/PageHeader.tsx

Purpose: Standard page title, eyebrow, description, metadata, and action layout.

Used by:
- `web/src/app/(trainer)/clients/[id]/daily-activity/page.tsx`
- `web/src/app/(trainer)/clients/[id]/edit/page.tsx`
- `web/src/app/(trainer)/clients/[id]/not-found.tsx`
- `web/src/app/(trainer)/clients/[id]/page.tsx`
- `web/src/app/(trainer)/clients/[id]/progress/page.tsx`
- `web/src/app/(trainer)/clients/new/page.tsx`
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/[id]/page.tsx`
- `web/src/app/(trainer)/meal-plans/new/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/[id]/page.tsx`
- `web/src/app/(trainer)/workout-plans/new/page.tsx`

Potential concerns:
- The `compact` prop currently has no effect because both branches return `mb-6`.

FULL SOURCE:

```tsx
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
  metadata?: ReactNode;
};

export default function PageHeader({
  title,
  eyebrow,
  description,
  children,
  compact = false,
  metadata,
}: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col items-start justify-between gap-4 ${compact ? "mb-6" : "mb-6"} sm:flex-row sm:items-center`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-muted">{eyebrow}</p>
        )}
        <h1 className="text-3xl sm:text-[34px] leading-tight font-semibold tracking-tight wrap-anywhere">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
        {metadata && <div className="mt-3 text-sm text-muted">{metadata}</div>}
      </div>
      {children && (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
          {children}
        </div>
      )}
    </header>
  );
}

```

---

## FILE: web/src/components/Sidebar.tsx

Purpose: Responsive trainer navigation, brand area, account summary, and disabled logout control.

Used by:
- `web/src/app/(trainer)/layout.tsx`

Potential concerns:
- Logout is rendered disabled, so there is no way to clear the JWT through the UI.
- Trainer identity is a hardcoded `Trainer` here while GlobalHeader decodes a username.

FULL SOURCE:

```tsx
"use client";

import Icon, { type IconName } from "@/components/Icon";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/clients", label: "Clients", icon: "clients" },
  { href: "/workout-plans", label: "Workout Plans", icon: "workout" },
  { href: "/meal-plans", label: "Meal Plans", icon: "meal" },
  { href: "/payments", label: "Payments", icon: "payment" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <aside className="relative flex h-auto flex-col overflow-y-auto border-b border-border/60 bg-sidebar dark:border-border dark:bg-sidebar min-[761px]:sticky min-[761px]:top-0 min-[761px]:h-dvh min-[761px]:border-r min-[761px]:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 min-[761px]:pt-7 min-[761px]:pb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-[22px] font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
            <Icon name="workout" className="size-7" />
          </span>
          <span>
            PT System
            <small className="mt-1 block text-sm font-normal text-muted">
              Personal training
            </small>
          </span>
        </Link>
        <button
          className="inline-flex min-h-11 items-center rounded-sm border border-border px-3 py-2 min-[761px]:hidden"
          aria-expanded={open}
          aria-controls="trainer-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close menu" : "Menu"}
        </button>
      </div>
      <div
        id="trainer-navigation"
        className={`${open ? "flex" : "hidden"} flex-1 flex-col min-[761px]:flex`}
      >
        <nav className="px-4 pt-2 min-[761px]:pt-0" aria-label="Trainer navigation">
          {items.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`mb-2 flex min-h-13 items-center gap-3.5 rounded-lg border px-3 py-3 text-[17px] transition-colors ${
                  active
                    ? "border-transparent bg-primary font-semibold text-white dark:border-transparent dark:bg-primary dark:text-white"
                    : "border-transparent text-foreground hover:bg-hover hover:text-foreground dark:text-foreground dark:hover:bg-hover dark:hover:text-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon name={icon} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 px-4 py-4 min-[761px]:mt-auto min-[761px]:p-4">
          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <Avatar name="Trainer" />
            <div className="min-w-0 flex-1">
              <strong className="text-sm font-medium">Trainer</strong>
              <span className="mt-1 block text-sm text-muted">
                Trainer account
              </span>
            </div>
          </div>
          <button
            disabled
            className="mt-2 flex min-h-11 w-full cursor-not-allowed items-center gap-3 px-3 text-left text-muted"
            title="Logout is not available yet"
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

```

---

## FILE: web/src/components/TrainerAuthGuard.tsx

Purpose: Client-side route guard that checks for a token and redirects unauthenticated users.

Used by:
- `web/src/app/(trainer)/layout.tsx`

Potential concerns:
- Only checks token presence—not expiry, signature, role, or validity.
- Shows plain `Loading...` while checking, temporarily hiding the sidebar, global header, and route skeleton.
- No centralized handling exists for later 401 responses.

FULL SOURCE:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TrainerAuthGuardProps = {
  children: React.ReactNode;
};

export default function TrainerAuthGuard({ children }: TrainerAuthGuardProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return children;
}

```

---

## FILE: web/src/lib/api.ts

Purpose: Configured Axios client with the deployed API base URL and bearer-token request interceptor.

Used by:
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`
- `web/src/app/login/page.tsx`

Potential concerns:
- API origin is hardcoded to the deployed Render URL instead of environment configuration.
- No response interceptor handles 401/403, token expiry, retries, or normalized errors.
- The request interceptor directly reads localStorage and therefore assumes calls occur in a browser.

FULL SOURCE:

```tsx
import axios from "axios";

const api = axios.create({
  baseURL: "https://pt-system-api.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

```

---

## FILE: web/src/lib/Endpoints.ts

Purpose: Central string/path builders for frontend API endpoints.

Used by:
- `web/src/app/(trainer)/clients/page.tsx`
- `web/src/app/(trainer)/dashboard/page.tsx`
- `web/src/app/(trainer)/meal-plans/page.tsx`
- `web/src/app/(trainer)/payments/page.tsx`
- `web/src/app/(trainer)/workout-plans/page.tsx`
- `web/src/app/login/page.tsx`

Potential concerns:
- Contains many endpoint helpers not currently called by frontend pages.
- The capitalized filename is inconsistent with common lower-case module naming and can be fragile across case-sensitive tooling if imported inconsistently.

FULL SOURCE:

```tsx
export const Endpoints = {
  // Auth
  trainerLogin: "/api/trainer/login",

  // Clients
  clients: (page: number, pageSize: number) =>
    `/api/clients?page=${page}&pageSize=${pageSize}`,
  clientsStats: "/api/stats/clients",

  clientById: (id: number) => `/api/clients/${id}`,

  updateClientCredentials: (id: number) => `/api/clients/${id}/credentials`,

  // Workout Plans
  workoutPlans: (page: number, pageSize: number) =>
    `/api/workout-plans?page=${page}&pageSize=${pageSize}`,
  workoutPlansStats: "/api/stats/workouts",

  workoutPlanById: (id: number) => `/api/workout-plans/${id}`,

  addExercise: (workoutPlanId: number) =>
    `/api/workout-plans/${workoutPlanId}/exercises`,

  exerciseById: (id: number) => `/api/exercises/${id}`,

  // Meal Plans
  mealPlans: (page: number, pageSize: number) =>
    `/api/meal-plans?page=${page}&pageSize=${pageSize}`,
  mealPlansStats: "/api/stats/meals",

  mealPlanById: (id: number) => `/api/meal-plans/${id}`,

  addMeal: (mealPlanId: number) => `/api/meal-plans/${mealPlanId}/meals`,

  mealById: (id: number) => `/api/meals/${id}`,

  // Workout Assignments
  clientWorkoutPlans: (clientId: number, page: number, pageSize: number) =>
    `/api/clients/${clientId}/workout-plans?page=${page}&pageSize=${pageSize}`,

  clientWorkoutPlanById: (id: number) => `/api/client-workout-plans/${id}`,

  clientWorkoutPlanStatus: (id: number) =>
    `/api/client-workout-plans/${id}/status`,

  // Meal Assignments
  clientMealPlans: (clientId: number, page: number, pageSize: number) =>
    `/api/clients/${clientId}/meal-plans?page=${page}&pageSize=${pageSize}`,

  clientMealPlanById: (id: number) => `/api/client-meal-plans/${id}`,

  clientMealStatus: (id: number) => `/api/client-meal-statuses/${id}/status`,

  // Payments
  payments: (page: number, pageSize: number) =>
    `/api/payments?page=${page}&pageSize=${pageSize}`,
  paymentsStats: "/api/stats/payments",

  clientPayments: (clientId: number, page: number, pageSize: number) =>
    `/api/clients/${clientId}/payments?page=${page}&pageSize=${pageSize}`,

  paymentStatus: (id: number) => `/api/payments/${id}/status`,

  dashboardStats: "/api/stats/dashboard",
};

```

---

# PT System Frontend Audit — Final Summary

Generated: 2026-09-19T17:08:16.450Z

Project inspected: `/home/samifarhat/Desktop/Projects/pt-system`

This is a read-only static audit. No application file was modified by the audit.

## A. Things that are already simple and good

- App Router route structure is easy to follow.
- Presentational primitives (Avatar, BackLink, EmptyState, SummaryMetric, Pagination) have small APIs.
- Design tokens centralize the primary light/dark palette.
- Semantic labels, table headers, skip link, focus styles, and many aria attributes show accessibility intent.
- Endpoint strings are centralized.
- Static detail pages remain Server Components where interaction is unnecessary.
- There is no unnecessary global state library, context stack, or memoization layer.

## B. Things that are more complicated than necessary

- JWT display decoding plus a no-op external store in GlobalHeader.
- Repeated route-specific skeleton markup across 16 loading files.
- Large list pages combine networking, state, transformation, and dense UI.
- Theme initialization/synchronization is split across root layout and ThemeToggle.
- Divergent workout/meal variants and skeleton all live in PlanCard.

## C. Likely bugs

- Payments shows page count from pageSize rather than API totalPages.
- Payments filters are UI-only/nonfunctional.
- Meal Plans cannot navigate beyond first fetched page.
- API list vs mock detail data can disagree.
- Invalid/expired tokens remain accepted by the frontend guard until requests fail.
- Client timestamp splitting is fragile.
- Dashboard failure displays zeros without an error state.

## D. Inconsistent patterns

- Live lists vs static/demo details/forms.
- Token classes vs hardcoded colors.
- Full-page vs sectional loading.
- Numeric vs string status types.
- Uneven error handling and API typing.

## E. Duplicate logic

- List fetching and stats effects.
- Date formatting.
- Demo form state/submission.
- Loading skeleton layouts.
- Theme localStorage behavior.
- Trainer identity presentation.

## F. Components/files that deserve manual review

1. `payments/page.tsx` — pagination and inactive filters.
2. `meal-plans/page.tsx` — inaccessible pagination.
3. `TrainerAuthGuard.tsx`, `api.ts`, `GlobalHeader.tsx` — auth lifecycle and JWT handling.
4. `clients/page.tsx` — local search and timestamp assumptions.
5. `dashboard/page.tsx` — live/mock mixture.
6. Static detail/create/edit pages — decide whether demo behavior is intentional.
7. `globals.css` — broad selectors and control sizing/focus interactions.
8. Route loading files — maintenance cost and UX consistency.

## G. Things that should NOT be changed because they are already fine

- Keep the straightforward App Router hierarchy unless product requirements change.
- Keep small presentational components such as Avatar, BackLink, EmptyState, SummaryMetric, and Pagination.
- Keep endpoint path centralization.
- Keep route-level loading boundaries; only their duplication/behavior needs product review.
- Keep the pre-hydration theme application concept to avoid color flash.
- Keep derived filtering inline until data volume demonstrates a performance problem; useMemo is not currently needed.
- Keep the current absence of Redux/context/global stores; current state is page-local.

## Audit completeness

- Relevant frontend files audited: **59**.
- Full source files: `07-full-source-part-1.md`, `08-full-source-part-2.md`, `09-full-source-part-3.md`.
- Every file listed in `00-file-tree.md` appears exactly once across the full-source parts.

AUDIT COMPLETE
