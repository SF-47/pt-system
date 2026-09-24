"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Endpoints } from "@/lib/Endpoints";
import WorkoutPlanLoading from "./loading";

type Exercise = {
  id: number;
  workoutPlanId: number;
  name: string;
  description: string | null;
  sets: number;
  reps: number;
  restSeconds: number;
  position: number;
};

type WorkoutPlan = {
  id: number;
  trainerId: number;
  name: string;
  description: string | null;
  createdAt: string;
  exercises: Exercise[];
};

export default function WorkoutPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = Number(params.id);
  const hasValidPlanId = Number.isInteger(planId) && planId > 0;

  // When opened from a client's weekly schedule (?fromClient=<id>), Back
  // returns to that client instead of the plans list.
  const fromClientId = Number(searchParams.get("fromClient"));
  const hasFromClient = Number.isInteger(fromClientId) && fromClientId > 0;
  const backHref = hasFromClient ? `/clients/${fromClientId}` : "/workout-plans";
  const backLabel = hasFromClient ? "Back to Client" : "Back to Workout Plans";
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadWorkoutPlan() {
      if (!hasValidPlanId) {
        setError("Invalid workout plan ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<WorkoutPlan>(
          Endpoints.workoutPlanById(planId),
        );

        if (!ignore) {
          setPlan(response.data);
        }
      } catch (error) {
        console.error("Failed to load workout plan:", error);

        if (!ignore) {
          setError("Workout plan could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkoutPlan();

    return () => {
      ignore = true;
    };
  }, [hasValidPlanId, loadAttempt, planId]);

  async function handleDeletePlan() {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await api.delete(Endpoints.workoutPlanById(planId));
      router.push("/workout-plans");
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
      setDeleteError("Workout plan could not be deleted. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <WorkoutPlanLoading />;
  }

  if (error || !plan) {
    return (
      <div className="w-full">
        <BackLink href={backHref}>{backLabel}</BackLink>
        <div
          role="alert"
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          {error || "Workout plan could not be found."}
        </div>
        {hasValidPlanId && (
          <button
            type="button"
            onClick={() => setLoadAttempt((current) => current + 1)}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Long plans use two columns on wide screens, filled top to bottom.
  const useTwoColumns = plan.exercises.length > 8;
  const rowsPerColumn = useTwoColumns
    ? Math.ceil(plan.exercises.length / 2)
    : plan.exercises.length;

  function dividers(index: number) {
    if (!useTwoColumns) {
      return "";
    }

    const startsColumn = index % rowsPerColumn === 0;
    const inSecondColumn = index >= rowsPerColumn;

    return `${startsColumn ? " min-[900px]:border-t-0" : ""}${
      inSecondColumn ? " min-[900px]:border-l" : ""
    }`;
  }

  return (
    <div className="w-full">
      <BackLink href={backHref}>{backLabel}</BackLink>

      <PageHeader
        title={plan.name}
        description={plan.description || "No description provided."}
        eyebrow="Workout plan"
        metadata={
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <dt className="flex items-center gap-1.5 text-muted">
                <Icon name="workout" className="size-4 text-primary" />
                Total exercises
              </dt>
              <dd className="font-semibold text-foreground tabular-nums">
                {plan.exercises.length}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="flex items-center gap-1.5 text-muted">
                <Icon name="calendar" className="size-4 text-primary" />
                Created
              </dt>
              <dd className="font-semibold text-foreground">
                {formatDate(plan.createdAt)}
              </dd>
            </div>
          </dl>
        }
      >
        <Link
          href={`/workout-plans/${plan.id}/edit`}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-hover sm:w-auto"
        >
          <Icon name="edit" className="size-4" />
          Edit Plan
        </Link>
        <button
          type="button"
          onClick={() => {
            setDeleteError("");
            setIsDeleteOpen(true);
          }}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-md border border-danger/40 bg-surface px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft sm:w-auto"
        >
          Delete Plan
        </button>
      </PageHeader>

      <section aria-labelledby="exercises-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <h2 id="exercises-heading" className="text-xl font-semibold">
              Exercises
            </h2>
            <p className="mt-1 text-sm text-muted">
              Sets, repetitions, and recovery time for this plan.
            </p>
          </div>
          <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-sm font-medium text-muted tabular-nums">
            {plan.exercises.length}{" "}
            {plan.exercises.length === 1 ? "exercise" : "exercises"}
          </span>
        </div>

        {plan.exercises.length > 0 ? (
          <ol
            aria-label="Exercises in this workout plan"
            style={{ "--rows": rowsPerColumn } as React.CSSProperties}
            className={`overflow-hidden rounded-xl border border-border bg-surface ${
              useTwoColumns
                ? "min-[900px]:grid min-[900px]:grid-flow-col min-[900px]:grid-cols-2 min-[900px]:grid-rows-[repeat(var(--rows),auto)]"
                : ""
            }`}
          >
            {plan.exercises.map((exercise, index) => (
              <li
                key={exercise.id}
                className={`flex flex-col gap-1.5 border-t border-border px-4 py-2.5 transition-colors first:border-t-0 hover:bg-hover sm:flex-row sm:items-center sm:gap-4${dividers(index)}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary-hover tabular-nums dark:text-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {exercise.name}
                    </p>
                    {exercise.description && (
                      <p
                        title={exercise.description}
                        className="truncate text-sm text-muted"
                      >
                        {exercise.description}
                      </p>
                    )}
                  </div>
                </div>

                <p className="shrink-0 pl-10 text-sm font-medium whitespace-nowrap text-foreground tabular-nums sm:pl-0">
                  {exercise.sets} sets · {exercise.reps} reps ·{" "}
                  <span className="text-muted">
                    {exercise.restSeconds > 0
                      ? `${exercise.restSeconds}s rest`
                      : "no rest"}
                  </span>
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-border bg-surface">
            <EmptyState
              icon="workout"
              title="No exercises yet"
              description="This workout plan does not have any exercises yet."
            />
          </div>
        )}
      </section>

      <DeleteConfirmDialog
        open={isDeleteOpen}
        title={`Delete "${plan.name}"?`}
        description="This action removes the workout plan, its exercises, and any client assignments for this plan."
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
            setDeleteError("");
          }
        }}
        onConfirm={() => {
          void handleDeletePlan();
        }}
      />
    </div>
  );
}
