"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getCompletionStatus, toDateKey } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";

type ActivityItem = {
  status: number;
  isMissed: boolean;
  completedAt: string | null;
};

type ActivityWorkout = ActivityItem & {
  assignmentId: number;
  workoutPlanId: number;
  workoutPlanName: string;
};

type ActivityMeal = ActivityItem & {
  mealStatusId: number;
  mealId: number;
  mealName: string;
};

type DailyActivity = {
  date: string;
  workout: ActivityWorkout | null;
  meals: ActivityMeal[];
};

const completedTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

// "Missed" is derived by the API (Pending on a past day), never stored.
function getActivityStatus(item: ActivityItem) {
  return item.isMissed ? "Missed" : getCompletionStatus(item.status);
}

function formatCompletedTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `Completed at ${completedTimeFormatter.format(date)}`;
}

export default function DailyActivityTab({ clientId }: { clientId: number }) {
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [activity, setActivity] = useState<DailyActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!date) {
      return;
    }

    let ignore = false;

    async function loadActivity() {
      try {
        setIsLoading(true);
        setError("");
        setActivity(null);

        const response = await api.get<DailyActivity>(
          Endpoints.clientDailyActivity(clientId, date),
        );

        if (!ignore) {
          setActivity(response.data);
        }
      } catch (error) {
        console.error("Failed to load daily activity:", error);

        if (!ignore) {
          setError(getErrorMessage(error, "Daily activity could not be loaded."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadActivity();

    return () => {
      ignore = true;
    };
  }, [clientId, date, refreshKey]);

  const workoutTime = formatCompletedTime(activity?.workout?.completedAt ?? null);

  return (
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
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="block min-h-11 w-full max-w-60 rounded-md border border-input-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </section>

      {isLoading && (
        <div
          role="status"
          aria-label="Loading daily activity"
          className="grid gap-4 lg:grid-cols-2"
        >
          {[0, 1].map((index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      )}

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

      {!isLoading && !error && activity && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Icon name="workout" className="size-5 text-primary" />
              <h2 className="font-semibold">Workout Activity</h2>
            </div>
            {activity.workout ? (
              <Link
                href={`/workout-plans/${activity.workout.workoutPlanId}?fromClient=${clientId}`}
                className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 hover:bg-hover"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {activity.workout.workoutPlanName}
                  </p>
                  {workoutTime && (
                    <p className="text-xs text-muted">{workoutTime}</p>
                  )}
                </div>
                <StatusBadge status={getActivityStatus(activity.workout)} />
              </Link>
            ) : (
              <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted">
                No workout scheduled for this date.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Icon name="meal" className="size-5 text-primary" />
              <h2 className="font-semibold">Meal Activity</h2>
            </div>
            {activity.meals.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {activity.meals.map((meal) => {
                  const mealTime = formatCompletedTime(meal.completedAt);

                  return (
                    <li
                      key={meal.mealStatusId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{meal.mealName}</p>
                        {mealTime && (
                          <p className="text-xs text-muted">{mealTime}</p>
                        )}
                      </div>
                      <StatusBadge status={getActivityStatus(meal)} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted">
                No meals scheduled for this date.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
