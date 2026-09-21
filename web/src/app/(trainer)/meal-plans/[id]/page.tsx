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
import MealPlanLoading from "./loading";

type Meal = {
  id: number;
  mealPlanId: number;
  name: string;
  instructions: string;
};

type MealPlan = {
  id: number;
  trainerId: number;
  name: string;
  description: string | null;
  createdAt: string;
  meals: Meal[];
};

export default function MealPlanPage() {
  const params = useParams<{ id: string }>();
  const planId = Number(params.id);
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMealPlan() {
      if (Number.isNaN(planId)) {
        setError("Invalid meal plan ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<MealPlan>(
          Endpoints.mealPlanById(planId),
        );

        if (!ignore) {
          setPlan(response.data);
        }
      } catch (error) {
        console.error("Failed to load meal plan:", error);

        if (!ignore) {
          setError("Meal plan could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMealPlan();

    return () => {
      ignore = true;
    };
  }, [planId]);

  if (isLoading) {
    return <MealPlanLoading />;
  }

  if (error || !plan) {
    return (
      <div className="max-w-5xl">
        <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
        <div
          role="alert"
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          {error || "Meal plan could not be found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
      <PageHeader
        title={plan.name}
        description={plan.description || "No description provided."}
      >
        <Link
          href={`/meal-plans/${plan.id}/edit`}
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
            <dt className="text-muted">Meals</dt>
            <dd className="mt-1 font-medium tabular-nums">
              {plan.meals.length}
            </dd>
          </div>
        </dl>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Meals</h2>

      {plan.meals.length > 0 ? (
        <div className="divide-y divide-border rounded-xl border border-border bg-surface px-5 sm:px-6">
          {plan.meals.map((meal) => (
            <div
              key={meal.id}
              className="grid gap-3 py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:py-6"
            >
              <h3 className="flex items-center gap-4 text-lg font-medium">
                <span className="text-sm text-muted tabular-nums">
                  {String(meal.id).padStart(2, "0")}
                </span>
                {meal.name}
              </h3>

              <p className="text-sm leading-relaxed text-muted sm:pt-1">
                {meal.instructions}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon="meal"
            title="No meals yet"
            description="This meal plan does not have any meals."
          />
        </div>
      )}
    </div>
  );
}
