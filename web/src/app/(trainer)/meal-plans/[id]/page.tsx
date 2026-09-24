"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Endpoints } from "@/lib/Endpoints";
import MealPlanLoading from "./loading";

type Meal = {
  id: number;
  mealPlanId: number;
  name: string;
  instructions: string;
  position: number;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = Number(params.id);
  const hasValidPlanId = Number.isInteger(planId) && planId > 0;

  // When opened from a client's weekly schedule (?fromClient=<id>), Back
  // returns to that client instead of the plans list.
  const fromClientId = Number(searchParams.get("fromClient"));
  const hasFromClient = Number.isInteger(fromClientId) && fromClientId > 0;
  const backHref = hasFromClient ? `/clients/${fromClientId}` : "/meal-plans";
  const backLabel = hasFromClient ? "Back to Client" : "Back to Meal Plans";
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isDeletePlanOpen, setIsDeletePlanOpen] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);
  const [deletePlanError, setDeletePlanError] = useState("");
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const [deletingMealId, setDeletingMealId] = useState<number | null>(null);
  const [deleteMealError, setDeleteMealError] = useState("");
  const [deleteMealMessage, setDeleteMealMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMealPlan() {
      if (!hasValidPlanId) {
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
  }, [hasValidPlanId, loadAttempt, planId]);

  async function handleDeletePlan() {
    try {
      setIsDeletingPlan(true);
      setDeletePlanError("");

      await api.delete(Endpoints.mealPlanById(planId));
      router.push("/meal-plans");
    } catch (error) {
      console.error("Failed to delete meal plan:", error);
      setDeletePlanError("Meal plan could not be deleted. Please try again.");
    } finally {
      setIsDeletingPlan(false);
    }
  }

  async function handleDeleteMeal() {
    if (!mealToDelete) {
      return;
    }

    const mealId = mealToDelete.id;

    try {
      setDeletingMealId(mealId);
      setDeleteMealError("");
      setDeleteMealMessage("");

      await api.delete(Endpoints.mealById(mealId));

      setPlan((currentPlan) =>
        currentPlan
          ? {
              ...currentPlan,
              meals: currentPlan.meals.filter((meal) => meal.id !== mealId),
            }
          : currentPlan,
      );
      setMealToDelete(null);
      setDeleteMealMessage("Meal deleted successfully.");
    } catch (error) {
      console.error("Failed to delete meal:", error);
      setDeleteMealError("Meal could not be deleted. Please try again.");
    } finally {
      setDeletingMealId(null);
    }
  }

  if (isLoading) {
    return <MealPlanLoading />;
  }

  if (error || !plan) {
    return (
      <div className="w-full">
        <BackLink href={backHref}>{backLabel}</BackLink>
        <div
          role="alert"
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          {error || "Meal plan could not be found."}
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
  const useTwoColumns = plan.meals.length > 4;
  const rowsPerColumn = useTwoColumns
    ? Math.ceil(plan.meals.length / 2)
    : plan.meals.length;

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
        eyebrow="Meal plan"
        metadata={
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <dt className="flex items-center gap-1.5 text-muted">
                <Icon name="meal" className="size-4 text-primary" />
                Total meals
              </dt>
              <dd className="font-semibold text-foreground tabular-nums">
                {plan.meals.length}
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
          href={`/meal-plans/${plan.id}/edit`}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-hover sm:w-auto"
        >
          <Icon name="edit" className="size-4" />
          Edit Plan
        </Link>
        <button
          type="button"
          onClick={() => {
            setDeletePlanError("");
            setIsDeletePlanOpen(true);
          }}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-md border border-danger/40 bg-surface px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft sm:w-auto"
        >
          Delete Plan
        </button>
      </PageHeader>

      <section aria-labelledby="meals-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <h2 id="meals-heading" className="text-xl font-semibold">
              Meals
            </h2>
            <p className="mt-1 text-sm text-muted">
              Meals and preparation instructions for this plan.
            </p>
          </div>
          <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-sm font-medium text-muted tabular-nums">
            {plan.meals.length}{" "}
            {plan.meals.length === 1 ? "meal" : "meals"}
          </span>
        </div>

        {deleteMealMessage && (
          <p role="status" className="mb-3 text-sm text-primary-hover">
            {deleteMealMessage}
          </p>
        )}

        {plan.meals.length > 0 ? (
          <ol
            aria-label="Meals in this meal plan"
            style={{ "--rows": rowsPerColumn } as React.CSSProperties}
            className={`overflow-hidden rounded-xl border border-border bg-surface ${
              useTwoColumns
                ? "min-[900px]:grid min-[900px]:grid-flow-col min-[900px]:grid-cols-2 min-[900px]:grid-rows-[repeat(var(--rows),auto)]"
                : ""
            }`}
          >
            {plan.meals.map((meal, index) => (
              <li
                key={meal.id}
                className={`flex items-center gap-3 border-t border-border px-4 py-2.5 transition-colors first:border-t-0 hover:bg-hover${dividers(index)}`}
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary-hover tabular-nums dark:text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {meal.name}
                  </p>
                  <p
                    title={meal.instructions}
                    className="truncate text-sm text-muted"
                  >
                    {meal.instructions}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteMealError("");
                    setDeleteMealMessage("");
                    setMealToDelete(meal);
                  }}
                  disabled={deletingMealId === meal.id}
                  aria-label={`Delete ${meal.name}`}
                  title="Delete meal"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-danger/40 bg-surface text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2
                    className={`size-4 ${deletingMealId === meal.id ? "animate-pulse" : ""}`}
                  />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-border bg-surface">
            <EmptyState
              icon="meal"
              title="No meals yet"
              description="This meal plan does not have any meals."
            />
          </div>
        )}
      </section>

      <DeleteConfirmDialog
        open={isDeletePlanOpen}
        title={`Delete "${plan.name}"?`}
        description="This action permanently removes the meal plan."
        isDeleting={isDeletingPlan}
        error={deletePlanError}
        onCancel={() => {
          if (!isDeletingPlan) {
            setIsDeletePlanOpen(false);
            setDeletePlanError("");
          }
        }}
        onConfirm={() => {
          void handleDeletePlan();
        }}
      />

      <DeleteConfirmDialog
        open={mealToDelete !== null}
        title={`Delete ${mealToDelete?.name ?? "meal"}?`}
        description="This action removes the meal from this meal plan."
        isDeleting={mealToDelete?.id === deletingMealId}
        error={deleteMealError}
        onCancel={() => {
          if (deletingMealId === null) {
            setMealToDelete(null);
            setDeleteMealError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteMeal();
        }}
      />
    </div>
  );
}
