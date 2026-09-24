"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { toDateKey } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";

type ClientProgress = {
  totalWorkouts: number;
  completedWorkouts: number;
  pendingWorkouts: number;
  skippedWorkouts: number;
  missedWorkouts: number;
  workoutCompletionRate: number;
  totalMeals: number;
  completedMeals: number;
  pendingMeals: number;
  skippedMeals: number;
  missedMeals: number;
  mealCompletionRate: number;
};

type ProgressPeriod = "7d" | "30d" | "all";

const periodOptions: { value: ProgressPeriod; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

const rateFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

// Ranges include today, so "last 7 days" starts 6 days back.
function getProgressRange(period: ProgressPeriod) {
  if (period === "all") {
    return {};
  }

  const days = period === "7d" ? 7 : 30;
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - (days - 1),
  );

  return { startDate: toDateKey(start), endDate: toDateKey(today) };
}

function ProgressCard({
  title,
  rate,
  total,
  totalLabel,
  completed,
  pending,
  skipped,
  missed,
}: {
  title: string;
  rate: number;
  total: number;
  totalLabel: string;
  completed: number;
  pending: number;
  skipped: number;
  missed: number;
}) {
  const stats = [
    {
      label: "Completed",
      value: completed,
      tone: "text-primary-hover dark:text-primary",
    },
    { label: "Pending", value: pending, tone: "text-warning" },
    { label: "Skipped", value: skipped, tone: "text-muted" },
    { label: "Missed", value: missed, tone: "text-danger" },
  ];

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-3xl leading-none font-semibold tracking-tight tabular-nums">
        {rateFormatter.format(rate)}%
      </p>
      <p className="mt-1 text-xs text-muted">Completion rate</p>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-hover"
        role="progressbar"
        aria-label={`${title} completion rate`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(rate)}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(Math.max(rate, 0), 100)}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-5">
        <div>
          <dd className="text-lg font-semibold tabular-nums">{total}</dd>
          <dt className="text-xs text-muted">{totalLabel}</dt>
        </div>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className={`text-lg font-semibold tabular-nums ${stat.tone}`}>
              {stat.value}
            </dd>
            <dt className="text-xs text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading progress"
      className="grid gap-4 lg:grid-cols-2"
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-lg border border-border bg-background"
        />
      ))}
    </div>
  );
}

export default function ProgressTab({ clientId }: { clientId: number }) {
  const [progress, setProgress] = useState<ClientProgress | null>(null);
  const [period, setPeriod] = useState<ProgressPeriod>("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadProgress() {
      try {
        setIsLoading(true);
        setError("");
        setProgress(null);

        const { startDate, endDate } = getProgressRange(period);
        const response = await api.get<ClientProgress>(
          Endpoints.clientProgress(clientId, startDate, endDate),
        );

        if (!ignore) {
          setProgress(response.data);
        }
      } catch (error) {
        console.error("Failed to load client progress:", error);

        if (!ignore) {
          setError(getErrorMessage(error, "Progress could not be loaded."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      ignore = true;
    };
  }, [clientId, period, refreshKey]);

  return (
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
        <div className="ml-auto">
          <label htmlFor="progress-period" className="sr-only">
            Progress period
          </label>
          <select
            id="progress-period"
            value={period}
            onChange={(event) => setPeriod(event.target.value as ProgressPeriod)}
            className="min-h-11 rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        {isLoading && <ProgressSkeleton />}

        {!isLoading && error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="min-h-9 rounded-md border border-danger/40 px-3 font-medium hover:bg-danger/10"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && progress && (
          <div className="grid gap-4 lg:grid-cols-2">
            <ProgressCard
              title="Workout Progress"
              rate={progress.workoutCompletionRate}
              total={progress.totalWorkouts}
              totalLabel="Total workouts"
              completed={progress.completedWorkouts}
              pending={progress.pendingWorkouts}
              skipped={progress.skippedWorkouts}
              missed={progress.missedWorkouts}
            />
            <ProgressCard
              title="Meal Progress"
              rate={progress.mealCompletionRate}
              total={progress.totalMeals}
              totalLabel="Total meals"
              completed={progress.completedMeals}
              pending={progress.pendingMeals}
              skipped={progress.skippedMeals}
              missed={progress.missedMeals}
            />
          </div>
        )}
      </div>
    </section>
  );
}
