"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";

import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import type { PagedResponse } from "@/types/api";
import ClientDetailsLoading from "./loading";

type Client = {
  id: number;
  fullName: string;
  username: string;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

type AssignedWorkoutPlan = {
  id: number;
  workoutPlanName: string;
  assignedDate: string;
  status: number;
  completedAt: string | null;
};

type AssignedMealPlan = {
  id: number;
  mealPlanName: string;
  assignedDate: string;
};

type Payment = {
  id: number;
  clientName: string;
  amount: number;
  status: number;
  dueDate: string;
  paidAt: string | null;
};

type WorkoutPlanOption = {
  id: number;
  name: string;
};

type MealPlanOption = {
  id: number;
  name: string;
};

type ActiveTab = "overview" | "progress" | "activity";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Local calendar-day helpers. Deliberately avoid toISOString(), which
// converts to UTC and can shift the calendar day depending on the
// trainer's timezone.
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Assignment dates come back from the API as ISO strings; the calendar
// day is always the first 10 characters regardless of any time/offset
// suffix, so compare on that instead of constructing a Date.
function assignedDateKey(value: string) {
  return value.slice(0, 10);
}

function getWeekStart(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfWeek = start.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + diffToMonday);
  return start;
}

function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
}

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function getWorkoutStatus(status: number) {
  if (status === 1) {
    return "Completed";
  }

  if (status === 2) {
    return "Skipped";
  }

  return "Pending";
}

function getPaymentStatus(status: number) {
  if (status === 1) {
    return "Paid";
  }

  return "Pending";
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ClientDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);

  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [weeklyWorkoutAssignments, setWeeklyWorkoutAssignments] = useState<
    AssignedWorkoutPlan[]
  >([]);
  const [weeklyMealAssignments, setWeeklyMealAssignments] = useState<
    AssignedMealPlan[]
  >([]);
  const [isWeekLoading, setIsWeekLoading] = useState(true);
  const [weekError, setWeekError] = useState("");
  const [weekRefreshKey, setWeekRefreshKey] = useState(0);

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activityDate, setActivityDate] = useState("");

  const [payment, setPayment] = useState<Payment | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false);

  const [availableWorkoutPlans, setAvailableWorkoutPlans] = useState<
    WorkoutPlanOption[]
  >([]);

  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState("");

  const [workoutPlanSearch, setWorkoutPlanSearch] = useState("");
  const [isWorkoutPlanDropdownOpen, setIsWorkoutPlanDropdownOpen] =
    useState(false);

  const [assignedWorkoutDate, setAssignedWorkoutDate] = useState("");

  const [isAssigningWorkout, setIsAssigningWorkout] = useState(false);

  const [assignWorkoutError, setAssignWorkoutError] = useState("");

  const [isAssignMealOpen, setIsAssignMealOpen] = useState(false);

  const [availableMealPlans, setAvailableMealPlans] = useState<
    MealPlanOption[]
  >([]);

  const [selectedMealPlanId, setSelectedMealPlanId] = useState("");

  const [mealPlanSearch, setMealPlanSearch] = useState("");
  const [isMealPlanDropdownOpen, setIsMealPlanDropdownOpen] =
    useState(false);

  const [assignedMealDate, setAssignedMealDate] = useState("");

  const [isAssigningMeal, setIsAssigningMeal] = useState(false);

  const [assignMealError, setAssignMealError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadClientDetails() {
      if (Number.isNaN(clientId)) {
        setError("Invalid client ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [clientResponse, paymentResponse] = await Promise.all([
          api.get<Client>(Endpoints.clientById(clientId)),

          api.get<PagedResponse<Payment>>(
            Endpoints.clientPayments(clientId, 1, 1),
          ),
        ]);

        if (ignore) {
          return;
        }

        setClient(clientResponse.data);
        setPayment(paymentResponse.data.items[0] ?? null);
      } catch (error) {
        console.error("Failed to load client details:", error);

        if (!ignore) {
          setError("Client details could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadClientDetails();

    return () => {
      ignore = true;
    };
  }, [clientId]);

  // Separated from client/payment loading so changing the visible week
  // only refetches the weekly schedule, not the whole profile.
  const weekStart = getWeekStart(currentWeekDate);
  const weekDates = getWeekDates(weekStart);
  const weekStartKey = toDateKey(weekStart);
  const weekEndKey = toDateKey(weekDates[6]);

  useEffect(() => {
    let ignore = false;

    async function loadWeeklySchedule() {
      if (Number.isNaN(clientId)) {
        return;
      }

      try {
        setIsWeekLoading(true);
        setWeekError("");

        const [workoutResponse, mealResponse] = await Promise.all([
          api.get<PagedResponse<AssignedWorkoutPlan>>(
            Endpoints.clientWorkoutPlans(
              clientId,
              1,
              50,
              weekStartKey,
              weekEndKey,
            ),
          ),

          api.get<PagedResponse<AssignedMealPlan>>(
            Endpoints.clientMealPlans(
              clientId,
              1,
              50,
              weekStartKey,
              weekEndKey,
            ),
          ),
        ]);

        if (ignore) {
          return;
        }

        setWeeklyWorkoutAssignments(workoutResponse.data.items);
        setWeeklyMealAssignments(mealResponse.data.items);
      } catch (error) {
        console.error("Failed to load weekly schedule:", error);

        if (!ignore) {
          setWeekError("Weekly schedule could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsWeekLoading(false);
        }
      }
    }

    void loadWeeklySchedule();

    return () => {
      ignore = true;
    };
  }, [clientId, weekStartKey, weekEndKey, weekRefreshKey]);

  async function openAssignWorkoutModal() {
    try {
      setAssignWorkoutError("");
      setWorkoutPlanSearch("");
      setIsWorkoutPlanDropdownOpen(false);

      const response = await api.get<PagedResponse<WorkoutPlanOption>>(
        Endpoints.workoutPlans(1, 50),
      );

      setAvailableWorkoutPlans(response.data.items);

      setSelectedWorkoutPlanId(
        response.data.items[0]?.id ? String(response.data.items[0].id) : "",
      );

      setAssignedWorkoutDate(toDateKey(new Date()));

      setIsAssignWorkoutOpen(true);
    } catch (error) {
      console.error("Failed to load workout plans:", error);
      setAssignWorkoutError("Workout plans could not be loaded.");
    }
  }

  async function handleAssignWorkout() {
    if (!selectedWorkoutPlanId || !assignedWorkoutDate) {
      return;
    }

    try {
      setIsAssigningWorkout(true);
      setAssignWorkoutError("");

      await api.post(Endpoints.clientWorkoutPlansBase(clientId), {
        workoutPlanId: Number(selectedWorkoutPlanId),
        assignedDate: assignedWorkoutDate,
      });

      setWeekRefreshKey((current) => current + 1);

      setIsAssignWorkoutOpen(false);
      setWorkoutPlanSearch("");
      setIsWorkoutPlanDropdownOpen(false);
    } catch (error) {
      console.error("Failed to assign workout plan:", error);
      setAssignWorkoutError(
        "Workout plan could not be assigned. Please try again.",
      );
    } finally {
      setIsAssigningWorkout(false);
    }
  }

  async function openAssignMealModal() {
    try {
      setAssignMealError("");
      setMealPlanSearch("");
      setIsMealPlanDropdownOpen(false);

      const response = await api.get<PagedResponse<MealPlanOption>>(
        Endpoints.mealPlans(1, 50),
      );

      setAvailableMealPlans(response.data.items);

      setSelectedMealPlanId(
        response.data.items[0]?.id ? String(response.data.items[0].id) : "",
      );

      setAssignedMealDate(toDateKey(new Date()));

      setIsAssignMealOpen(true);
    } catch (error) {
      console.error("Failed to load meal plans:", error);
      setAssignMealError("Meal plans could not be loaded.");
    }
  }

  async function handleAssignMeal() {
    if (!selectedMealPlanId || !assignedMealDate) {
      return;
    }

    try {
      setIsAssigningMeal(true);
      setAssignMealError("");

      await api.post(Endpoints.clientMealPlansBase(clientId), {
        mealPlanId: Number(selectedMealPlanId),
        assignedDate: assignedMealDate,
      });

      setWeekRefreshKey((current) => current + 1);

      setIsAssignMealOpen(false);
      setMealPlanSearch("");
      setIsMealPlanDropdownOpen(false);
    } catch (error) {
      console.error("Failed to assign meal plan:", error);
      setAssignMealError("Meal plan could not be assigned. Please try again.");
    } finally {
      setIsAssigningMeal(false);
    }
  }

  async function handleDeleteClient() {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await api.delete(Endpoints.clientById(clientId));
      router.push("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
      setDeleteError("Client could not be deleted. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <ClientDetailsLoading />;
  }

  if (error || !client) {
    return (
      <div>
        <BackLink href="/clients">Back to Clients</BackLink>

        <div
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
          role="alert"
        >
          {error || "Client could not be found."}
        </div>
      </div>
    );
  }

  const selectedWorkoutPlanName = availableWorkoutPlans.find(
    (plan) => String(plan.id) === selectedWorkoutPlanId,
  )?.name;

  const filteredWorkoutPlans = availableWorkoutPlans.filter((plan) =>
    plan.name.toLowerCase().includes(workoutPlanSearch.trim().toLowerCase()),
  );

  const selectedMealPlanName = availableMealPlans.find(
    (plan) => String(plan.id) === selectedMealPlanId,
  )?.name;

  const filteredMealPlans = availableMealPlans.filter((plan) =>
    plan.name.toLowerCase().includes(mealPlanSearch.trim().toLowerCase()),
  );

  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>

      {/* Client Header */}
      <div className="mb-5 flex items-start gap-4 rounded-xl border border-border bg-surface p-5 sm:gap-5 sm:p-6 [&>span]:size-14 [&>span]:text-lg sm:[&>span]:size-16 [&_header]:mb-0">
        <Avatar name={client.fullName} />

        <div className="min-w-0 flex-1">
          <PageHeader
            title={client.fullName}
            description={client.email ?? "No email provided"}
          >
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={client.isActive ? "Active" : "Inactive"} />

              <Link
                href={`/clients/${client.id}/edit`}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-medium transition-colors hover:bg-hover"
              >
                <Icon name="edit" className="size-4" />
                Edit Client
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setIsDeleteOpen(true);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-danger/40 bg-surface px-4 py-2 font-medium text-danger transition-colors hover:bg-danger-soft"
              >
                Delete Client
              </button>
            </div>
          </PageHeader>
        </div>
      </div>

      {/* Client workspace tabs */}
      <nav
        aria-label="Client views"
        className="mb-5 flex flex-wrap gap-2"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          aria-controls="client-workspace-panel"
          onClick={() => setActiveTab("overview")}
          className={`inline-flex min-h-11 items-center rounded-md px-4 font-medium transition-colors ${
            activeTab === "overview"
              ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
              : "text-muted hover:bg-hover"
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "progress"}
          aria-controls="client-workspace-panel"
          onClick={() => setActiveTab("progress")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 font-medium transition-colors ${
            activeTab === "progress"
              ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
              : "text-muted hover:bg-hover"
          }`}
        >
          <Icon name="dashboard" className="size-4" />
          View Progress
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "activity"}
          aria-controls="client-workspace-panel"
          onClick={() => setActiveTab("activity")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 font-medium transition-colors ${
            activeTab === "activity"
              ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
              : "text-muted hover:bg-hover"
          }`}
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </button>
      </nav>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div id="client-workspace-panel" role="tabpanel" className="min-w-0">
          {activeTab === "overview" && (
            <section className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon name="calendar" className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold">Weekly Schedule</h2>
                    <p className="text-xs text-muted tabular-nums">
                      {shortDateFormatter.format(weekDates[0])} –{" "}
                      {shortDateFormatter.format(weekDates[6])}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center rounded-md border border-border bg-background">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentWeekDate((current) => {
                          const next = new Date(current);
                          next.setDate(next.getDate() - 7);
                          return next;
                        })
                      }
                      aria-label="Previous week"
                      className="inline-flex min-h-9 items-center px-2.5 text-xs font-medium transition-colors hover:bg-hover"
                    >
                      <Icon name="arrow" className="size-3.5 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentWeekDate(new Date())}
                      className="inline-flex min-h-9 items-center border-x border-border px-3 text-xs font-medium transition-colors hover:bg-hover"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentWeekDate((current) => {
                          const next = new Date(current);
                          next.setDate(next.getDate() + 7);
                          return next;
                        })
                      }
                      aria-label="Next week"
                      className="inline-flex min-h-9 items-center px-2.5 text-xs font-medium transition-colors hover:bg-hover"
                    >
                      <Icon name="arrow" className="size-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => void openAssignWorkoutModal()}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-hover"
                  >
                    <Icon name="workout" className="size-3.5" />
                    Schedule Workout
                  </button>
                  <button
                    type="button"
                    onClick={() => void openAssignMealModal()}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-hover"
                  >
                    <Icon name="meal" className="size-3.5" />
                    Assign Meal
                  </button>
                </div>
              </div>

              {weekError && (
                <p role="alert" className="mb-3 text-sm text-danger">
                  {weekError}
                </p>
              )}

              <div className="overflow-x-auto">
                <div className="grid min-w-[910px] grid-cols-7 gap-2">
                  {weekDates.map((date) => {
                    const dateKey = toDateKey(date);
                    const isToday = dateKey === toDateKey(new Date());

                    const dayWorkouts = weeklyWorkoutAssignments.filter(
                      (assignment) =>
                        assignedDateKey(assignment.assignedDate) === dateKey,
                    );
                    const dayMeals = weeklyMealAssignments.filter(
                      (assignment) =>
                        assignedDateKey(assignment.assignedDate) === dateKey,
                    );

                    return (
                      <div
                        key={dateKey}
                        className={`min-w-0 rounded-lg border p-2.5 ${
                          isToday
                            ? "border-primary bg-primary-soft/40"
                            : "border-border bg-background"
                        }`}
                      >
                        <p className="text-xs font-semibold text-foreground">
                          {weekdayFormatter.format(date)}
                        </p>
                        <p className="mb-2 text-xs text-muted tabular-nums">
                          {shortDateFormatter.format(date)}
                        </p>

                        <div className="space-y-1">
                          <p className="flex items-center gap-1 text-[11px] font-medium tracking-wide text-muted uppercase">
                            <Icon name="workout" className="size-3" />
                            Workout
                          </p>
                          {dayWorkouts.length > 0 ? (
                            dayWorkouts.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="rounded-md bg-surface p-1.5"
                              >
                                <p className="line-clamp-2 text-xs font-medium text-foreground wrap-anywhere">
                                  {assignment.workoutPlanName}
                                </p>
                                <div className="mt-1">
                                  <StatusBadge
                                    status={getWorkoutStatus(assignment.status)}
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted">No workout</p>
                          )}
                        </div>

                        <div className="mt-1.5 space-y-1">
                          <p className="flex items-center gap-1 text-[11px] font-medium tracking-wide text-muted uppercase">
                            <Icon name="meal" className="size-3" />
                            Meal
                          </p>
                          {dayMeals.length > 0 ? (
                            dayMeals.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="rounded-md bg-surface p-1.5"
                              >
                                <p className="line-clamp-2 text-xs font-medium text-foreground wrap-anywhere">
                                  {assignment.mealPlanName}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted">No meal</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isWeekLoading && (
                <p role="status" className="mt-3 text-center text-xs text-muted">
                  Loading weekly schedule…
                </p>
              )}
            </section>
          )}

          {activeTab === "progress" && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon name="dashboard" className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Client Progress</h2>
                  <p className="text-sm text-muted">
                    Workout and meal completion summary
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted">
                  Progress data is not available yet.
                </p>
              </div>
            </section>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <section className="rounded-xl border border-border bg-surface p-4">
                <label
                  htmlFor="activity-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Activity date
                </label>
                <input
                  id="activity-date"
                  type="date"
                  value={activityDate}
                  onChange={(event) => setActivityDate(event.target.value)}
                  className="block min-h-11 w-full max-w-60 rounded-md border border-input-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Icon name="workout" className="size-5 text-primary" />
                    <h2 className="font-semibold">Workout Activity</h2>
                  </div>
                  <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="text-sm text-muted">
                      Workout activity is not available for this date yet.
                    </p>
                  </div>
                </section>

                <section className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Icon name="meal" className="size-5 text-primary" />
                    <h2 className="font-semibold">Meal Activity</h2>
                  </div>
                  <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="text-sm text-muted">
                      Meal activity is not available for this date yet.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="grid gap-5">
          {/* Contact Information */}
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
                <dt className="text-sm text-muted">Username</dt>

                <dd className="mt-1 wrap-anywhere">{client.username}</dd>
              </div>

              <div>
                <dt className="text-sm text-muted">Email</dt>

                <dd className="mt-1 wrap-anywhere">
                  {client.email ?? "No email provided"}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-muted">Phone</dt>

                <dd className="mt-1 tabular-nums">{client.phoneNumber}</dd>
              </div>

              <div>
                <dt className="text-sm text-muted">Client since</dt>

                <dd className="mt-1">{formatDate(client.createdAt)}</dd>
              </div>
            </dl>
          </section>

          {/* Payment */}
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-base font-semibold">Payment Status</h2>

            {payment ? (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {currencyFormatter.format(payment.amount)}
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    Due {formatDate(payment.dueDate)}
                  </p>

                  {payment.paidAt && (
                    <p className="mt-1 text-xs text-muted">
                      Paid {formatDate(payment.paidAt)}
                    </p>
                  )}
                </div>

                <StatusBadge status={getPaymentStatus(payment.status)} />
              </div>
            ) : (
              <p className="text-sm text-muted">
                No payment information available.
              </p>
            )}
          </section>
        </div>
      </div>
      {isAssignWorkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Assign Workout Plan</h2>
              <p className="mt-1 text-sm text-muted">
                Choose a workout plan and assignment date.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="workout-plan"
                  className="mb-2 block text-sm font-medium"
                >
                  Workout Plan
                </label>

                <div
                  className="relative"
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget as Node,
                      )
                    ) {
                      setIsWorkoutPlanDropdownOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    id="workout-plan"
                    onClick={() =>
                      setIsWorkoutPlanDropdownOpen((open) => !open)
                    }
                    aria-haspopup="listbox"
                    aria-expanded={isWorkoutPlanDropdownOpen}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3 text-left text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <span
                      className={`truncate ${selectedWorkoutPlanName ? "" : "text-muted"}`}
                    >
                      {selectedWorkoutPlanName ?? "Select a workout plan"}
                    </span>
                    <Icon
                      name="arrow"
                      className={`size-4 shrink-0 text-muted transition-transform ${
                        isWorkoutPlanDropdownOpen ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </button>

                  {isWorkoutPlanDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                      <div className="border-b border-border p-2">
                        <input
                          type="text"
                          autoFocus
                          value={workoutPlanSearch}
                          onChange={(event) =>
                            setWorkoutPlanSearch(event.target.value)
                          }
                          placeholder="Search workout plans..."
                          className="min-h-9 w-full rounded-md border border-input-border bg-background px-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <ul role="listbox" className="max-h-[220px] overflow-y-auto py-1">
                        {filteredWorkoutPlans.length > 0 ? (
                          filteredWorkoutPlans.map((plan) => (
                            <li key={plan.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={
                                  String(plan.id) === selectedWorkoutPlanId
                                }
                                onClick={() => {
                                  setSelectedWorkoutPlanId(String(plan.id));
                                  setWorkoutPlanSearch("");
                                  setIsWorkoutPlanDropdownOpen(false);
                                }}
                                className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                                  String(plan.id) === selectedWorkoutPlanId
                                    ? "bg-primary-soft font-medium text-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {plan.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-4 text-center text-sm text-muted">
                            No workout plans found.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="assigned-workout-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Assigned Date
                </label>

                <input
                  id="assigned-workout-date"
                  type="date"
                  value={assignedWorkoutDate}
                  onChange={(event) =>
                    setAssignedWorkoutDate(event.target.value)
                  }
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {assignWorkoutError && (
                <div
                  className="rounded-md border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
                  role="alert"
                >
                  {assignWorkoutError}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAssignWorkoutOpen(false);
                  setAssignWorkoutError("");
                  setWorkoutPlanSearch("");
                  setIsWorkoutPlanDropdownOpen(false);
                }}
                className="min-h-10 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-hover"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleAssignWorkout()}
                disabled={
                  !selectedWorkoutPlanId ||
                  !assignedWorkoutDate ||
                  isAssigningWorkout
                }
                aria-busy={isAssigningWorkout}
                className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAssigningWorkout ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAssignMealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Assign Meal Plan</h2>
              <p className="mt-1 text-sm text-muted">
                Choose a meal plan and assignment date.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="meal-plan"
                  className="mb-2 block text-sm font-medium"
                >
                  Meal Plan
                </label>

                <div
                  className="relative"
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget as Node,
                      )
                    ) {
                      setIsMealPlanDropdownOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    id="meal-plan"
                    onClick={() =>
                      setIsMealPlanDropdownOpen((open) => !open)
                    }
                    aria-haspopup="listbox"
                    aria-expanded={isMealPlanDropdownOpen}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3 text-left text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <span
                      className={`truncate ${selectedMealPlanName ? "" : "text-muted"}`}
                    >
                      {selectedMealPlanName ?? "Select a meal plan"}
                    </span>
                    <Icon
                      name="arrow"
                      className={`size-4 shrink-0 text-muted transition-transform ${
                        isMealPlanDropdownOpen ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </button>

                  {isMealPlanDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                      <div className="border-b border-border p-2">
                        <input
                          type="text"
                          autoFocus
                          value={mealPlanSearch}
                          onChange={(event) =>
                            setMealPlanSearch(event.target.value)
                          }
                          placeholder="Search meal plans..."
                          className="min-h-9 w-full rounded-md border border-input-border bg-background px-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <ul role="listbox" className="max-h-[220px] overflow-y-auto py-1">
                        {filteredMealPlans.length > 0 ? (
                          filteredMealPlans.map((plan) => (
                            <li key={plan.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={
                                  String(plan.id) === selectedMealPlanId
                                }
                                onClick={() => {
                                  setSelectedMealPlanId(String(plan.id));
                                  setMealPlanSearch("");
                                  setIsMealPlanDropdownOpen(false);
                                }}
                                className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                                  String(plan.id) === selectedMealPlanId
                                    ? "bg-primary-soft font-medium text-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {plan.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-4 text-center text-sm text-muted">
                            No meal plans found.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="assigned-meal-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Assigned Date
                </label>

                <input
                  id="assigned-meal-date"
                  type="date"
                  value={assignedMealDate}
                  onChange={(event) =>
                    setAssignedMealDate(event.target.value)
                  }
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {assignMealError && (
                <div
                  className="rounded-md border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
                  role="alert"
                >
                  {assignMealError}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAssignMealOpen(false);
                  setAssignMealError("");
                  setMealPlanSearch("");
                  setIsMealPlanDropdownOpen(false);
                }}
                className="min-h-10 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-hover"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleAssignMeal()}
                disabled={
                  !selectedMealPlanId ||
                  !assignedMealDate ||
                  isAssigningMeal
                }
                aria-busy={isAssigningMeal}
                className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAssigningMeal ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={isDeleteOpen}
        title={`Delete ${client.fullName}?`}
        description="This action removes the client and related records such as payments and assigned plans."
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
            setDeleteError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteClient();
        }}
      />
    </div>
  );
}
