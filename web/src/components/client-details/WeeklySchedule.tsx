"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Icon from "@/components/Icon";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getCompletionStatus, toDateKey } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";
import AssignPlanModal from "./AssignPlanModal";

type AssignedWorkoutPlan = {
  id: number;
  workoutPlanId: number;
  workoutPlanName: string;
  exerciseCount: number;
  assignedDate: string;
  status: number;
  completedAt: string | null;
};

type AssignedMealPlan = {
  id: number;
  mealPlanId: number;
  mealPlanName: string;
  mealCount: number;
  assignedDate: string;
};

type AssignmentToEdit = {
  kind: "workout" | "meal";
  id: number;
  planId: number;
  planName: string;
  assignedDate: string;
};

type AssignmentToRemove = {
  kind: "workout" | "meal";
  id: number;
  name: string;
  dateLabel: string;
};

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

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

function getWorkoutCardTone(status: number) {
  if (status === 1) {
    return "border-primary/40 bg-primary-soft hover:bg-primary-soft/70";
  }

  if (status === 2) {
    return "border-border-strong bg-background hover:bg-hover";
  }

  return "border-warning/40 bg-warning-soft hover:bg-warning-soft/70";
}

const removeButtonClass =
  "absolute top-1 right-1 z-10 rounded p-0.5 text-muted opacity-0 transition-opacity group-hover:opacity-100 pointer-coarse:opacity-100 hover:bg-danger-soft hover:text-danger focus-visible:bg-danger-soft focus-visible:text-danger focus-visible:opacity-100";

const editButtonClass =
  "absolute right-1 bottom-1 z-10 rounded p-0.5 text-muted opacity-0 transition-opacity group-hover:opacity-100 pointer-coarse:opacity-100 hover:bg-hover hover:text-foreground focus-visible:bg-hover focus-visible:text-foreground focus-visible:opacity-100";

export default function WeeklySchedule({ clientId }: { clientId: number }) {
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<AssignedWorkoutPlan[]>([]);
  const [meals, setMeals] = useState<AssignedMealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false);
  const [isAssignMealOpen, setIsAssignMealOpen] = useState(false);

  const [assignmentToEdit, setAssignmentToEdit] =
    useState<AssignmentToEdit | null>(null);

  const [assignmentToRemove, setAssignmentToRemove] =
    useState<AssignmentToRemove | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState("");

  const weekStart = getWeekStart(currentWeekDate);
  const weekDates = getWeekDates(weekStart);
  const weekStartKey = toDateKey(weekStart);
  const weekEndKey = toDateKey(weekDates[6]);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    let ignore = false;

    async function loadWeeklySchedule() {
      try {
        setIsLoading(true);
        setError("");

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

        setWorkouts(workoutResponse.data.items);
        setMeals(mealResponse.data.items);
      } catch (error) {
        console.error("Failed to load weekly schedule:", error);

        if (!ignore) {
          setError("Weekly schedule could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadWeeklySchedule();

    return () => {
      ignore = true;
    };
  }, [clientId, weekStartKey, weekEndKey, refreshKey]);

  function moveWeek(days: number) {
    setCurrentWeekDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      return next;
    });
  }

  async function handleRemove() {
    if (!assignmentToRemove) {
      return;
    }

    const { kind, id } = assignmentToRemove;

    try {
      setIsRemoving(true);
      setRemoveError("");

      await api.delete(
        kind === "workout"
          ? Endpoints.clientWorkoutPlanById(id)
          : Endpoints.clientMealPlanById(id),
      );

      setRefreshKey((key) => key + 1);
      setAssignmentToRemove(null);
    } catch (error) {
      console.error("Failed to remove assignment:", error);
      setRemoveError(
        getErrorMessage(
          error,
          `${kind === "workout" ? "Workout" : "Meal plan"} could not be removed. Please try again.`,
        ),
      );
    } finally {
      setIsRemoving(false);
    }
  }

  function askToRemove(assignment: AssignmentToRemove) {
    setRemoveError("");
    setAssignmentToRemove(assignment);
  }

  const removingWorkout = assignmentToRemove?.kind === "workout";

  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Weekly Schedule</h2>
          <p className="mt-0.5 text-sm font-medium text-muted tabular-nums">
            {shortDateFormatter.format(weekDates[0])} –{" "}
            {shortDateFormatter.format(weekDates[6])}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex items-center rounded-md border border-border bg-background">
            <button
              type="button"
              onClick={() => moveWeek(-7)}
              aria-label="Previous week"
              title="Previous week"
              className="inline-flex min-h-9 items-center gap-1 px-2.5 text-sm font-medium transition-colors hover:bg-hover"
            >
              <Icon name="arrow" className="size-4 rotate-180" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentWeekDate(new Date())}
              title="Jump to the current week"
              className="inline-flex min-h-9 items-center border-x border-border px-3 text-sm font-medium transition-colors hover:bg-hover"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => moveWeek(7)}
              aria-label="Next week"
              title="Next week"
              className="inline-flex min-h-9 items-center gap-1 px-2.5 text-sm font-medium transition-colors hover:bg-hover"
            >
              Next
              <Icon name="arrow" className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsAssignWorkoutOpen(true)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft px-3 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary-soft/70 dark:text-foreground"
            >
              <Icon name="workout" className="size-4" />
              Schedule Workout
            </button>
            <button
              type="button"
              onClick={() => setIsAssignMealOpen(true)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft px-3 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary-soft/70 dark:text-foreground"
            >
              <Icon name="meal" className="size-4" />
              Assign Meal
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="min-w-[1050px]">
          <div className="grid grid-cols-7 divide-x divide-border border-b border-border">
            {weekDates.map((date) => {
              const isToday = toDateKey(date) === todayKey;

              return (
                <div
                  key={toDateKey(date)}
                  className={`px-3 py-2.5 ${
                    isToday ? "bg-primary-soft/25" : "bg-background"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isToday
                        ? "text-primary-hover dark:text-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {weekdayFormatter.format(date)}
                  </p>
                  <p className="mt-0.5 text-xs font-normal text-muted tabular-nums">
                    {shortDateFormatter.format(date)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 items-stretch divide-x divide-border">
            {weekDates.map((date) => {
              const dateKey = toDateKey(date);
              const isToday = dateKey === todayKey;
              const dateLabel = shortDateFormatter.format(date);

              const dayWorkout = workouts.find(
                (assignment) => assignedDateKey(assignment.assignedDate) === dateKey,
              );
              const dayMeal = meals.find(
                (assignment) => assignedDateKey(assignment.assignedDate) === dateKey,
              );

              return (
                <div
                  key={dateKey}
                  className={`grid min-w-0 grid-rows-2 divide-y divide-border ${
                    isToday ? "bg-primary-soft/10" : "bg-surface"
                  }`}
                >
                  <div className="min-h-0 p-2">
                    {isLoading ? (
                      <div
                        className="h-full min-h-[72px] animate-pulse rounded-md border border-border bg-border/40"
                        aria-hidden="true"
                      />
                    ) : dayWorkout ? (
                      <div className="group relative h-full">
                        <Link
                          href={`/workout-plans/${dayWorkout.workoutPlanId}?fromClient=${clientId}`}
                          aria-label={`${dayWorkout.workoutPlanName} — ${getCompletionStatus(dayWorkout.status)}`}
                          title={getCompletionStatus(dayWorkout.status)}
                          className={`flex h-full w-full flex-col overflow-hidden rounded-md border px-3 py-2 pr-6 transition-colors ${getWorkoutCardTone(dayWorkout.status)}`}
                        >
                          <p className="flex items-start gap-1.5 text-sm font-medium text-foreground">
                            <Icon
                              name="workout"
                              className="mt-0.5 size-4 shrink-0"
                            />
                            <span className="line-clamp-2 wrap-anywhere">
                              {dayWorkout.workoutPlanName}
                            </span>
                          </p>
                          <p className="mt-auto pt-1 pl-[22px] text-xs text-muted">
                            {dayWorkout.exerciseCount}{" "}
                            {dayWorkout.exerciseCount === 1
                              ? "exercise"
                              : "exercises"}
                          </p>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            askToRemove({
                              kind: "workout",
                              id: dayWorkout.id,
                              name: dayWorkout.workoutPlanName,
                              dateLabel,
                            })
                          }
                          aria-label={`Remove ${dayWorkout.workoutPlanName} from ${dateLabel}`}
                          className={removeButtonClass}
                        >
                          <X className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setAssignmentToEdit({
                              kind: "workout",
                              id: dayWorkout.id,
                              planId: dayWorkout.workoutPlanId,
                              planName: dayWorkout.workoutPlanName,
                              assignedDate: assignedDateKey(
                                dayWorkout.assignedDate,
                              ),
                            })
                          }
                          aria-label={`Change ${dayWorkout.workoutPlanName} on ${dateLabel}`}
                          title="Change plan or date"
                          className={editButtonClass}
                        >
                          <Icon name="edit" className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-muted">—</span>
                      </div>
                    )}
                  </div>

                  <div className="min-h-0 p-2">
                    {isLoading ? (
                      <div
                        className="h-full min-h-[72px] animate-pulse rounded-md border border-border bg-border/40"
                        aria-hidden="true"
                      />
                    ) : dayMeal ? (
                      <div className="group relative h-full">
                        <Link
                          href={`/meal-plans/${dayMeal.mealPlanId}?fromClient=${clientId}`}
                          className="flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-background px-3 py-2 pr-6 transition-colors hover:bg-hover"
                        >
                          <p className="flex items-start gap-1.5 text-sm font-medium text-foreground">
                            <Icon
                              name="meal"
                              className="mt-0.5 size-4 shrink-0"
                            />
                            <span className="line-clamp-2 wrap-anywhere">
                              {dayMeal.mealPlanName}
                            </span>
                          </p>
                          <p className="mt-auto pt-1 pl-[22px] text-xs text-muted">
                            {dayMeal.mealCount}{" "}
                            {dayMeal.mealCount === 1 ? "meal" : "meals"}
                          </p>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            askToRemove({
                              kind: "meal",
                              id: dayMeal.id,
                              name: dayMeal.mealPlanName,
                              dateLabel,
                            })
                          }
                          aria-label={`Remove ${dayMeal.mealPlanName} from ${dateLabel}`}
                          className={removeButtonClass}
                        >
                          <X className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setAssignmentToEdit({
                              kind: "meal",
                              id: dayMeal.id,
                              planId: dayMeal.mealPlanId,
                              planName: dayMeal.mealPlanName,
                              assignedDate: assignedDateKey(
                                dayMeal.assignedDate,
                              ),
                            })
                          }
                          aria-label={`Change ${dayMeal.mealPlanName} on ${dateLabel}`}
                          title="Change plan or date"
                          className={editButtonClass}
                        >
                          <Icon name="edit" className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-muted">—</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading && (
        <p role="status" className="sr-only">
          Loading weekly schedule…
        </p>
      )}

      {isAssignWorkoutOpen && (
        <AssignPlanModal
          title="Assign Workout Plan"
          planLabel="Workout Plan"
          planIdField="workoutPlanId"
          optionsUrl={Endpoints.workoutPlans(1, 50)}
          assignUrl={Endpoints.clientWorkoutPlansBase(clientId)}
          onClose={() => setIsAssignWorkoutOpen(false)}
          onAssigned={() => {
            setIsAssignWorkoutOpen(false);
            setRefreshKey((key) => key + 1);
          }}
        />
      )}

      {isAssignMealOpen && (
        <AssignPlanModal
          title="Assign Meal Plan"
          planLabel="Meal Plan"
          planIdField="mealPlanId"
          optionsUrl={Endpoints.mealPlans(1, 50)}
          assignUrl={Endpoints.clientMealPlansBase(clientId)}
          onClose={() => setIsAssignMealOpen(false)}
          onAssigned={() => {
            setIsAssignMealOpen(false);
            setRefreshKey((key) => key + 1);
          }}
        />
      )}

      {assignmentToEdit && (
        <AssignPlanModal
          key={`${assignmentToEdit.kind}-${assignmentToEdit.id}`}
          title={
            assignmentToEdit.kind === "workout"
              ? "Change Workout Assignment"
              : "Change Meal Assignment"
          }
          planLabel={
            assignmentToEdit.kind === "workout" ? "Workout Plan" : "Meal Plan"
          }
          planIdField={
            assignmentToEdit.kind === "workout" ? "workoutPlanId" : "mealPlanId"
          }
          optionsUrl={
            assignmentToEdit.kind === "workout"
              ? Endpoints.workoutPlans(1, 50)
              : Endpoints.mealPlans(1, 50)
          }
          assignUrl={
            assignmentToEdit.kind === "workout"
              ? Endpoints.clientWorkoutPlanById(assignmentToEdit.id)
              : Endpoints.clientMealPlanById(assignmentToEdit.id)
          }
          currentAssignment={{
            planId: assignmentToEdit.planId,
            planName: assignmentToEdit.planName,
            assignedDate: assignmentToEdit.assignedDate,
          }}
          note={
            assignmentToEdit.kind === "meal"
              ? "Choosing a different meal plan resets its meal statuses to Pending."
              : undefined
          }
          onClose={() => setAssignmentToEdit(null)}
          onAssigned={() => {
            setAssignmentToEdit(null);
            setRefreshKey((key) => key + 1);
          }}
        />
      )}

      <DeleteConfirmDialog
        open={assignmentToRemove !== null}
        title={`Remove this ${removingWorkout ? "workout" : "meal plan"} from ${assignmentToRemove?.dateLabel ?? "this day"}?`}
        description={`This removes the ${removingWorkout ? "workout plan" : "meal plan"} from the client's weekly schedule.`}
        itemName={assignmentToRemove?.name}
        isDeleting={isRemoving}
        error={removeError}
        onCancel={() => {
          if (!isRemoving) {
            setAssignmentToRemove(null);
            setRemoveError("");
          }
        }}
        onConfirm={() => {
          void handleRemove();
        }}
      />
    </section>
  );
}
