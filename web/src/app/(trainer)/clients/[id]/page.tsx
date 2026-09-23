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

  const [workoutPlans, setWorkoutPlans] = useState<AssignedWorkoutPlan[]>([]);
  const [workoutPlanCount, setWorkoutPlanCount] = useState(0);

  const [mealPlanCount, setMealPlanCount] = useState(0);
  const [mealPlans, setMealPlans] = useState<AssignedMealPlan[]>([]);
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

  const pageSize = 10;

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

        const [
          clientResponse,
          workoutPlansResponse,
          mealPlansResponse,
          paymentResponse,
        ] = await Promise.all([
          api.get<Client>(Endpoints.clientById(clientId)),

          api.get<PagedResponse<AssignedWorkoutPlan>>(
            Endpoints.clientWorkoutPlans(clientId, 1, pageSize),
          ),

          api.get<PagedResponse<AssignedMealPlan>>(
            Endpoints.clientMealPlans(clientId, 1, pageSize),
          ),

          api.get<PagedResponse<Payment>>(
            Endpoints.clientPayments(clientId, 1, 1),
          ),
        ]);

        if (ignore) {
          return;
        }

        setClient(clientResponse.data);
        setWorkoutPlans(workoutPlansResponse.data.items);
        setWorkoutPlanCount(workoutPlansResponse.data.totalCount);
        setMealPlans(mealPlansResponse.data.items);
        setMealPlanCount(mealPlansResponse.data.totalCount);
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

      setAssignedWorkoutDate(new Date().toISOString().split("T")[0]);

      setIsAssignWorkoutOpen(true);
    } catch (error) {
      console.error("Failed to load workout plans:", error);
      setAssignWorkoutError("Workout plans could not be loaded.");
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
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="min-w-0 rounded-xl border border-border bg-surface p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon name="workout" className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold">Assigned Workout Plans</h2>
                      <p className="text-xs text-muted">
                        Current workout plans
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted tabular-nums">
                      {workoutPlanCount}
                    </span>
                    {/* TODO: Connect when workout assignment creation UI is implemented. */}
                    <button
                      type="button"
                      onClick={() => {
                        void openAssignWorkoutModal();
                      }}
                      className="inline-flex min-h-9 items-center rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-hover"
                    >
                      + Assign Workout
                    </button>
                  </div>
                </div>

                {workoutPlans.length > 0 ? (
                  <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {workoutPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-lg border border-border bg-background p-3 transition-colors hover:bg-hover"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground wrap-anywhere">
                              {plan.workoutPlanName}
                            </h3>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                              <Icon name="calendar" className="size-3.5" />
                              Assigned {formatDate(plan.assignedDate)}
                            </p>
                            {plan.completedAt && (
                              <p className="mt-1 text-xs text-muted">
                                Completed {formatDate(plan.completedAt)}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={getWorkoutStatus(plan.status)} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-5 text-center">
                    <p className="text-sm text-muted">
                      No workout plans assigned yet.
                    </p>
                  </div>
                )}
              </section>

              <section className="min-w-0 rounded-xl border border-border bg-surface p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon name="meal" className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold">Assigned Meal Plans</h2>
                      <p className="text-xs text-muted">
                        Current nutrition plans
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted tabular-nums">
                      {mealPlanCount}
                    </span>
                    {/* TODO: Connect when meal assignment creation UI is implemented. */}
                    <button
                      type="button"
                      disabled
                      title="Meal assignment is not available yet"
                      className="inline-flex min-h-9 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-muted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      + Assign Meal
                    </button>
                  </div>
                </div>

                {mealPlans.length > 0 ? (
                  <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {mealPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-lg border border-border bg-background p-3 transition-colors hover:bg-hover"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                            <Icon name="meal" className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground wrap-anywhere">
                              {plan.mealPlanName}
                            </h3>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                              <Icon name="calendar" className="size-3.5" />
                              Assigned {formatDate(plan.assignedDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-5 text-center">
                    <p className="text-sm text-muted">
                      No meal plans assigned yet.
                    </p>
                  </div>
                )}
              </section>
            </div>
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
                disabled={
                  !selectedWorkoutPlanId ||
                  !assignedWorkoutDate ||
                  isAssigningWorkout
                }
                className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Assign
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
