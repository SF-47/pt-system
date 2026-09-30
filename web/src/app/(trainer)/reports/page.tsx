"use client";

import { useEffect, useState, type FormEvent } from "react";

import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { currencyFormatter, formatDate, getCompletionStatus, toDateKey } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";

type ClientOption = {
  id: number;
  fullName: string;
};

type ReportSummary = {
  total: number;
  completed: number;
  pending: number;
  skipped: number;
  missed: number;
  completionRate: number;
};

type PaymentSummary = {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentsCount: number;
  overdueCount: number;
};

type ActivityItem = {
  status: number;
  isMissed: boolean;
};

type DailyWorkout = ActivityItem & {
  assignmentId: number;
  workoutPlanId: number;
  name: string;
};

type DailyMeal = ActivityItem & {
  mealStatusId: number;
  mealId: number;
  name: string;
};

type DailyActivity = {
  date: string;
  workout: DailyWorkout | null;
  meals: DailyMeal[];
};

type ClientReport = {
  client: {
    id: number;
    fullName: string;
    username: string;
    email: string | null;
    phoneNumber: string;
    isActive: boolean;
  };
  period: { startDate: string; endDate: string };
  workoutSummary: ReportSummary;
  mealSummary: ReportSummary;
  paymentSummary: PaymentSummary;
  dailyActivity: DailyActivity[];
};

const inputClass =
  "min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

function getActivityStatus(item: ActivityItem) {
  return item.isMissed ? "Missed" : getCompletionStatus(item.status);
}

function SummaryBreakdown({
  title,
  total,
  totalLabel,
  completed,
  pending,
  skipped,
  missed,
}: {
  title: string;
  total: number;
  totalLabel: string;
  completed: number;
  pending: number;
  skipped: number;
  missed: number;
}) {
  const stats = [
    { label: "Completed", value: completed, tone: "text-primary-hover dark:text-primary" },
    { label: "Pending", value: pending, tone: "text-warning" },
    { label: "Skipped", value: skipped, tone: "text-muted" },
    { label: "Missed", value: missed, tone: "text-danger" },
  ];

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-5">
        <div>
          <dd className="text-lg font-semibold tabular-nums">{total}</dd>
          <dt className="text-xs text-muted">{totalLabel}</dt>
        </div>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className={`text-lg font-semibold tabular-nums ${stat.tone}`}>{stat.value}</dd>
            <dt className="text-xs text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div role="status" aria-label="Generating report" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="h-32 animate-pulse rounded-xl border border-border bg-surface" />
      <div className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
    </div>
  );
}

export default function ReportsPage() {
  const [clientSearch, setClientSearch] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState("");

  const [report, setReport] = useState<ClientReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (selectedClient) return;

    let ignore = false;
    const timer = window.setTimeout(async () => {
      setIsLoadingClients(true);
      setClientsError("");
      try {
        const response = await api.get<PagedResponse<ClientOption>>(
          Endpoints.clients(1, 8, clientSearch.trim(), ""),
        );
        if (!ignore) setClientOptions(response.data.items);
      } catch (error) {
        console.error("Failed to load clients:", error);
        if (!ignore) {
          setClientsError(getErrorMessage(error, "Clients could not be loaded."));
        }
      } finally {
        if (!ignore) setIsLoadingClients(false);
      }
    }, 250);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [selectedClient, clientSearch]);

  async function generateReport(clientId: number, start: string, end: string) {
    try {
      setIsGenerating(true);
      setGenerateError("");

      const response = await api.get<ClientReport>(Endpoints.clientReport(clientId, start, end));

      setReport(response.data);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setReport(null);
      setGenerateError(getErrorMessage(error, "Report could not be generated."));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClient) {
      setFormError("Select a client.");
      return;
    }
    if (!startDate || !endDate) {
      setFormError("Start date and end date are required.");
      return;
    }
    if (startDate > endDate) {
      setFormError("Start date cannot be after end date.");
      return;
    }

    setFormError("");
    setHasGenerated(true);
    await generateReport(selectedClient.id, startDate, endDate);
  }

  function handleRetry() {
    if (!selectedClient || !startDate || !endDate) return;
    void generateReport(selectedClient.id, startDate, endDate);
  }

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate a client report for a selected date range."
      />

      <section className="rounded-xl border border-border bg-surface p-5">
        <form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="report-client-search" className="mb-1 block text-sm font-medium">
                Client
              </label>
              {selectedClient ? (
                <div className="flex min-h-11 items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3">
                  <span className="truncate font-medium">{selectedClient.fullName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClient(null);
                      setReport(null);
                      setHasGenerated(false);
                    }}
                    disabled={isGenerating}
                    className="shrink-0 text-sm font-medium text-primary-hover underline-offset-2 hover:underline disabled:opacity-60 dark:text-primary"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    id="report-client-search"
                    type="search"
                    value={clientSearch}
                    onChange={(event) => setClientSearch(event.target.value)}
                    placeholder="Search clients by name"
                    autoComplete="off"
                    className={inputClass}
                  />
                  <div className="mt-2 max-h-44 overflow-y-auto rounded-md border border-border bg-background">
                    {isLoadingClients ? (
                      <p role="status" className="px-3 py-2 text-sm text-muted">
                        Loading clients...
                      </p>
                    ) : clientsError ? (
                      <p role="alert" className="px-3 py-2 text-sm text-danger">
                        {clientsError}
                      </p>
                    ) : clientOptions.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-muted">No clients found.</p>
                    ) : (
                      <ul>
                        {clientOptions.map((option) => (
                          <li key={option.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedClient(option)}
                              className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-hover"
                            >
                              {option.fullName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>

            <div>
              <label htmlFor="report-start-date" className="mb-1 block text-sm font-medium">
                Start date
              </label>
              <input
                id="report-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="report-end-date" className="mb-1 block text-sm font-medium">
                End date
              </label>
              <input
                id="report-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={toDateKey(new Date())}
                onChange={(event) => setEndDate(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {formError && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {formError}
            </p>
          )}

          <div className="mt-4">
            <button
              type="submit"
              disabled={isGenerating}
              aria-busy={isGenerating}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>
      </section>

      <div className="mt-5">
        {!hasGenerated && !isGenerating && (
          <EmptyState
            icon="report"
            title="No report generated yet"
            description="Select a client and date range, then click Generate Report."
          />
        )}

        {isGenerating && <ReportSkeleton />}

        {!isGenerating && hasGenerated && generateError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            <span>{generateError}</span>
            <button
              type="button"
              onClick={handleRetry}
              className="min-h-9 rounded-md border border-danger/40 px-3 font-medium hover:bg-danger/10"
            >
              Retry
            </button>
          </div>
        )}

        {!isGenerating && !generateError && report && (
          <div className="space-y-4">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold">Client Report</h2>
              <p className="mt-1 text-sm text-muted">
                {report.client.fullName} &middot; {formatDate(report.period.startDate)} –{" "}
                {formatDate(report.period.endDate)}
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryMetric
                label="Workout Completion"
                value={`${report.workoutSummary.completionRate}%`}
              />
              <SummaryMetric
                label="Meal Completion"
                value={`${report.mealSummary.completionRate}%`}
              />
              <SummaryMetric
                label="Paid Amount"
                value={currencyFormatter.format(report.paymentSummary.paidAmount)}
              />
              <SummaryMetric
                label="Pending Amount"
                value={currencyFormatter.format(report.paymentSummary.pendingAmount)}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SummaryBreakdown
                title="Workout Summary"
                total={report.workoutSummary.total}
                totalLabel="Total workouts"
                completed={report.workoutSummary.completed}
                pending={report.workoutSummary.pending}
                skipped={report.workoutSummary.skipped}
                missed={report.workoutSummary.missed}
              />
              <SummaryBreakdown
                title="Meal Summary"
                total={report.mealSummary.total}
                totalLabel="Total meals"
                completed={report.mealSummary.completed}
                pending={report.mealSummary.pending}
                skipped={report.mealSummary.skipped}
                missed={report.mealSummary.missed}
              />
            </div>

            <section className="rounded-lg border border-border bg-background p-4">
              <h3 className="text-sm font-semibold">Payment Summary</h3>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-5">
                <div>
                  <dd className="text-lg font-semibold tabular-nums">
                    {currencyFormatter.format(report.paymentSummary.totalAmount)}
                  </dd>
                  <dt className="text-xs text-muted">Total amount</dt>
                </div>
                <div>
                  <dd className="text-lg font-semibold tabular-nums text-primary-hover dark:text-primary">
                    {currencyFormatter.format(report.paymentSummary.paidAmount)}
                  </dd>
                  <dt className="text-xs text-muted">Paid amount</dt>
                </div>
                <div>
                  <dd className="text-lg font-semibold tabular-nums text-warning">
                    {currencyFormatter.format(report.paymentSummary.pendingAmount)}
                  </dd>
                  <dt className="text-xs text-muted">Pending amount</dt>
                </div>
                <div>
                  <dd className="text-lg font-semibold tabular-nums">
                    {report.paymentSummary.paymentsCount}
                  </dd>
                  <dt className="text-xs text-muted">Payments</dt>
                </div>
                <div>
                  <dd className="text-lg font-semibold tabular-nums text-danger">
                    {report.paymentSummary.overdueCount}
                  </dd>
                  <dt className="text-xs text-muted">Overdue</dt>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-border bg-surface p-4">
              <h2 className="font-semibold">Daily Activity</h2>

              {report.dailyActivity.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted">
                  No activity found for this period.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {report.dailyActivity.map((day) => (
                    <li key={day.date} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-sm font-medium">{formatDate(day.date)}</p>
                      <div className="mt-2 space-y-1.5">
                        {day.workout && (
                          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2">
                            <span className="flex min-w-0 items-center gap-2 truncate text-sm">
                              <Icon name="workout" className="size-4 shrink-0 text-primary" />
                              <span className="truncate">{day.workout.name}</span>
                            </span>
                            <StatusBadge status={getActivityStatus(day.workout)} />
                          </div>
                        )}
                        {day.meals.map((meal) => (
                          <div
                            key={meal.mealStatusId}
                            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2"
                          >
                            <span className="flex min-w-0 items-center gap-2 truncate text-sm">
                              <Icon name="meal" className="size-4 shrink-0 text-primary" />
                              <span className="truncate">{meal.name}</span>
                            </span>
                            <StatusBadge status={getActivityStatus(meal)} />
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
