"use client";

import { useEffect, useState, type FormEvent } from "react";

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

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const generatedAtFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function getActivityStatus(item: ActivityItem) {
  return item.isMissed ? "Missed" : getCompletionStatus(item.status);
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : shortDateFormatter.format(date);
}

function getMealSummaryText(meals: DailyMeal[]) {
  if (meals.length === 0) {
    return "No meals";
  }

  const total = meals.length;
  const counts = { Completed: 0, Pending: 0, Skipped: 0, Missed: 0 };

  meals.forEach((meal) => {
    counts[getActivityStatus(meal) as keyof typeof counts] += 1;
  });

  const parts = [`${counts.Completed}/${total} Completed`];

  (["Skipped", "Missed", "Pending"] as const).forEach((label) => {
    if (counts[label] > 0) {
      parts.push(`${counts[label]} ${label}`);
    }
  });

  return parts.join(" · ");
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
    <div className="rounded-lg border border-border bg-background p-3 print:break-inside-avoid print:p-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-5">
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
    <div role="status" aria-label="Generating report" className="mt-4 space-y-3 print:hidden">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
      <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
    </div>
  );
}

function ActivityRow({
  day,
  expanded,
  onToggle,
}: {
  day: DailyActivity;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0 print:break-inside-avoid">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-left text-sm transition-colors hover:bg-hover print:hover:bg-transparent"
      >
        <span className="w-14 shrink-0 font-medium tabular-nums">{formatShortDate(day.date)}</span>
        <span className="min-w-32 flex-1 truncate">{day.workout ? day.workout.name : "—"}</span>
        <span className="w-24 shrink-0">
          {day.workout ? (
            <StatusBadge status={getActivityStatus(day.workout)} />
          ) : (
            <span className="text-xs text-muted">—</span>
          )}
        </span>
        <span className="w-full shrink-0 text-xs text-muted sm:w-44 sm:text-sm print:w-44 print:text-sm">
          {getMealSummaryText(day.meals)}
        </span>
        <Icon
          name="arrow"
          className={`ml-auto size-4 shrink-0 text-muted transition-transform print:hidden ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-border bg-background px-3 py-2.5 text-sm print:hidden">
          {day.workout && (
            <div>
              <p className="text-xs font-semibold text-muted">Workout</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="truncate">{day.workout.name}</span>
                <StatusBadge status={getActivityStatus(day.workout)} />
              </div>
            </div>
          )}
          {day.meals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted">Meals</p>
              <ul className="mt-1 space-y-1">
                {day.meals.map((meal) => (
                  <li key={meal.mealStatusId} className="flex items-center justify-between gap-3">
                    <span className="truncate">{meal.name}</span>
                    <StatusBadge status={getActivityStatus(meal)} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [clientSearch, setClientSearch] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState("");

  const [report, setReport] = useState<ClientReport | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedClient || !isClientMenuOpen) return;

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
  }, [selectedClient, clientSearch, isClientMenuOpen]);

  async function generateReport(clientId: number, start: string, end: string) {
    try {
      setIsGenerating(true);
      setGenerateError("");

      const response = await api.get<ClientReport>(Endpoints.clientReport(clientId, start, end));

      setReport(response.data);
      setGeneratedAt(new Date());
      setExpandedDates(new Set());
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

  function toggleDay(date: string) {
    setExpandedDates((current) => {
      const next = new Set(current);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl print:max-w-none">
      <div className="print:hidden">
        <PageHeader
          title="Reports"
          description="Generate a client report for a selected date range."
        />
      </div>

      <section className="rounded-xl border border-border bg-surface p-4 print:hidden">
        <form onSubmit={(event) => void handleSubmit(event)} noValidate className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div
            className="relative lg:min-w-56 lg:flex-1"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsClientMenuOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsClientMenuOpen(false);
            }}
          >
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
                    setIsClientMenuOpen(true);
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
                  onChange={(event) => {
                    setClientSearch(event.target.value);
                    setIsClientMenuOpen(true);
                  }}
                  onFocus={() => setIsClientMenuOpen(true)}
                  placeholder="Search clients by name"
                  autoComplete="off"
                  className={inputClass}
                />
                {isClientMenuOpen && (
                  <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-xl">
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
                              onClick={() => {
                                setSelectedClient(option);
                                setIsClientMenuOpen(false);
                              }}
                              className="block min-h-9 w-full truncate px-3 py-1.5 text-left text-sm hover:bg-hover"
                            >
                              {option.fullName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-3">
            <div className="lg:w-36">
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

            <div className="lg:w-36">
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

          <div className="lg:shrink-0">
            <button
              type="submit"
              disabled={isGenerating}
              aria-busy={isGenerating}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>

        {formError && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {formError}
          </p>
        )}
      </section>

      {!hasGenerated && !isGenerating && (
        <section className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-3.5 print:hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon name="report" className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">No report generated yet</p>
            <p className="text-sm text-muted">
              Select a client and date range, then click Generate Report.
            </p>
          </div>
        </section>
      )}

      {isGenerating && <ReportSkeleton />}

      {!isGenerating && hasGenerated && generateError && (
        <div
          role="alert"
          className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger print:hidden"
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
        <div className="mt-4 space-y-3 print:mt-0 print:space-y-3">
          <section className="rounded-xl border border-border bg-surface p-4 print:break-inside-avoid print:border-0 print:p-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Client Report
                </p>
                <h2 className="mt-0.5 text-lg font-semibold">{report.client.fullName}</h2>
                <p className="mt-0.5 text-sm text-muted">
                  {formatDate(report.period.startDate)} – {formatDate(report.period.endDate)}
                </p>
                {generatedAt && (
                  <p className="text-xs text-muted">
                    Generated {generatedAtFormatter.format(generatedAt)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-hover print:hidden"
              >
                <Icon name="print" className="size-4" />
                Print Report
              </button>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:break-inside-avoid">
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

          <div className="grid gap-3 lg:grid-cols-2">
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

          <section className="rounded-lg border border-border bg-background p-3 print:break-inside-avoid print:p-2">
            <h3 className="text-sm font-semibold">Payment Summary</h3>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-5">
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

          <section className="rounded-xl border border-border bg-surface p-3 print:p-0">
            <h2 className="px-1 pb-1 font-semibold print:break-after-avoid">Daily Activity</h2>

            {report.dailyActivity.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted">
                No activity found for this period.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="hidden border-b border-border bg-background px-3 py-2 text-xs font-semibold tracking-wide text-muted uppercase sm:flex sm:items-center sm:gap-x-3 print:flex">
                  <span className="w-14 shrink-0">Date</span>
                  <span className="min-w-32 flex-1">Workout</span>
                  <span className="w-24 shrink-0">Status</span>
                  <span className="w-44 shrink-0">Meals</span>
                  <span className="w-4 shrink-0 print:hidden" aria-hidden="true" />
                </div>
                {report.dailyActivity.map((day) => (
                  <ActivityRow
                    key={day.date}
                    day={day}
                    expanded={expandedDates.has(day.date)}
                    onToggle={() => toggleDay(day.date)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
