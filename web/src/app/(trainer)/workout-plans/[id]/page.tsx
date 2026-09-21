"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BackLink from "@/components/BackLink";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
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
  const planId = Number(params.id);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadWorkoutPlan() {
      if (Number.isNaN(planId)) {
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
  }, [planId]);

  if (isLoading) {
    return <WorkoutPlanLoading />;
  }

  if (error || !plan) {
    return (
      <div className="max-w-5xl">
        <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
        <div
          role="alert"
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          {error || "Workout plan could not be found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader
        title={plan.name}
        description={plan.description || "No description provided."}
      >
        <Link
          href={`/workout-plans/${plan.id}/edit`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-medium transition-colors hover:bg-hover"
        >
          <Icon name="edit" className="size-4" />
          Edit Plan
        </Link>
      </PageHeader>

      <section
        aria-label="Plan overview"
        className="mb-6 border-b border-border pb-4"
      >
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-muted">Plan ID</dt>
            <dd className="mt-1 font-medium tabular-nums">{plan.id}</dd>
          </div>
          <div>
            <dt className="text-muted">Exercises</dt>
            <dd className="mt-1 font-medium tabular-nums">
              {plan.exercises.length}
            </dd>
          </div>
        </dl>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Exercises</h2>

      {plan.exercises.length > 0 ? (
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
              {plan.exercises.map((exercise) => (
                <tr
                  key={exercise.id}
                  className="border-t border-border transition-colors hover:bg-hover focus-within:bg-hover dark:border-border dark:hover:bg-hover dark:focus-within:bg-hover"
                >
                  <td className="px-5 py-5 align-middle font-medium">
                    <span className="mr-4 inline-block w-6 text-sm font-normal text-muted tabular-nums">
                      {String(exercise.id).padStart(2, "0")}
                    </span>
                    {exercise.name}
                  </td>
                  <td className="px-5 py-5 text-right align-middle">
                    {exercise.sets}
                  </td>
                  <td className="px-5 py-5 text-right align-middle">
                    {exercise.reps}
                  </td>
                  <td className="px-5 py-5 text-right align-middle text-muted">
                    {exercise.restSeconds} seconds
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon="workout"
            title="No exercises yet"
            description="This workout plan does not have any exercises."
          />
        </div>
      )}
    </div>
  );
}
