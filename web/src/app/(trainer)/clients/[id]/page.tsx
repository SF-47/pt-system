"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import BackLink from "@/components/BackLink";
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
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);

  const [workoutPlans, setWorkoutPlans] = useState<AssignedWorkoutPlan[]>([]);

  const [mealPlans, setMealPlans] = useState<AssignedMealPlan[]>([]);

  const [payment, setPayment] = useState<Payment | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 5;

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
        setMealPlans(mealPlansResponse.data.items);
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

  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>

      {/* Client Header */}
      <div className="mb-6 flex items-start gap-4 rounded-xl border border-border bg-surface p-5 sm:gap-5 sm:p-6 [&>span]:size-14 [&>span]:text-lg sm:[&>span]:size-16 [&_header]:mb-0">
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
            </div>
          </PageHeader>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Client views" className="mb-7 flex flex-wrap gap-2">
        <Link
          href={`/clients/${client.id}`}
          aria-current="page"
          className="inline-flex min-h-11 items-center rounded-md border border-primary bg-primary-soft px-4 font-medium text-primary-hover dark:text-foreground"
        >
          Overview
        </Link>

        <Link
          href={`/clients/${client.id}/progress`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-muted transition-colors hover:bg-hover"
        >
          <Icon name="dashboard" className="size-4" />
          View Progress
        </Link>

        <Link
          href={`/clients/${client.id}/daily-activity`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-muted transition-colors hover:bg-hover"
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </Link>
      </nav>

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Main Column */}
        <div className="space-y-7">
          {/* Workout Plans */}
          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon name="workout" className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Assigned Workout Plans
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Current workout plans for this client
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
                {workoutPlans.length}
              </span>
            </div>

            {workoutPlans.length > 0 ? (
              <div className="grid gap-3">
                {workoutPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-hover"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                          <Icon name="workout" className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground">
                            {plan.workoutPlanName}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                            <span className="flex items-center gap-1.5">
                              <Icon name="calendar" className="size-4" />
                              Assigned {formatDate(plan.assignedDate)}
                            </span>

                            {plan.completedAt && (
                              <span>
                                Completed {formatDate(plan.completedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <StatusBadge status={getWorkoutStatus(plan.status)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted">
                  No workout plans assigned yet.
                </p>
              </div>
            )}
          </section>

          {/* Meal Plans */}
          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon name="meal" className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Assigned Meal Plans</h2>

                  <p className="mt-1 text-sm text-muted">
                    Nutrition plans assigned to this client
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
                {mealPlans.length}
              </span>
            </div>

            {mealPlans.length > 0 ? (
              <div className="grid gap-3">
                {mealPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="group rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                        <Icon name="meal" className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {plan.mealPlanName}
                        </h3>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                          <Icon name="calendar" className="size-4" />
                          Assigned {formatDate(plan.assignedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted">
                  No meal plans assigned yet.
                </p>
              </div>
            )}
          </section>

          {/* Progress */}
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div>
              <h2 className="text-base font-medium">Progress & activity</h2>

              <p className="mt-1 text-sm text-muted">
                Review completion and daily adherence.
              </p>
            </div>

            <Link
              href={`/clients/${client.id}/progress`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-medium text-primary-hover transition-colors hover:bg-primary-soft dark:text-foreground"
            >
              View Progress
              <Icon name="arrow" className="size-4" />
            </Link>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="grid gap-7">
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
    </div>
  );
}
