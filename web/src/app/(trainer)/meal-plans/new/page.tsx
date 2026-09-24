"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MealPlanForm = {
  name: string;
  description: string;
};

type MealForm = {
  name: string;
  instructions: string;
};

const emptyMeal: MealForm = {
  name: "",
  instructions: "",
};

export default function CreateMealPlanPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [planForm, setPlanForm] = useState<MealPlanForm>({
    name: "",
    description: "",
  });

  const [mealForm, setMealForm] = useState<MealForm>(emptyMeal);

  const [meals, setMeals] = useState<MealForm[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handlePlanNext(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = planForm.name.trim();

    if (trimmedName.length < 2) {
      setError("Plan name must be at least 2 characters.");
      return;
    }

    setPlanForm((prev) => ({
      ...prev,
      name: trimmedName,
      description: prev.description.trim(),
    }));

    setError("");
    setStep(2);
  }

  function handleAddMeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mealForm.name.trim().length < 2) {
      setError("Meal name must be at least 2 characters.");
      return;
    }

    if (mealForm.instructions.trim().length < 2) {
      setError("Instructions must be at least 2 characters.");
      return;
    }

    const newMeal: MealForm = {
      name: mealForm.name.trim(),
      instructions: mealForm.instructions.trim(),
    };

    setMeals((prev) => [...prev, newMeal]);

    setMealForm(emptyMeal);
    setError("");
  }

  function handleRemoveMeal(index: number) {
    setMeals((prev) => prev.filter((_, mealIndex) => mealIndex !== index));
  }

  function handleGoToReview() {
    if (meals.length === 0) {
      setError("Add at least one meal before continuing.");
      return;
    }

    setError("");
    setStep(3);
  }

  async function handleFinish() {
    try {
      setIsSaving(true);
      setError("");

      const planResponse = await api.post(Endpoints.mealPlansBase, {
        name: planForm.name,
        description: planForm.description,
      });

      const mealPlanId = planResponse.data?.id;

      if (typeof mealPlanId !== "number") {
        throw new Error("Created meal plan did not return an ID.");
      }

      await Promise.all(
        meals.map((meal) => api.post(Endpoints.addMeal(mealPlanId), meal)),
      );

      router.push(`/meal-plans/${mealPlanId}`);
    } catch (error) {
      console.error("Failed to create meal plan:", error);

      setError(
        getErrorMessage(
          error,
          "Meal plan could not be created completely. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full">
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>

      <PageHeader
        title="Create Meal Plan"
        description="Add plan details, meals, then review."
      />

      <div className="mb-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-surface">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex min-h-12 items-center justify-center gap-2 border-r border-border px-4 text-sm transition-colors ${
            step === 1
              ? "bg-primary-soft font-semibold text-foreground"
              : step > 1
                ? "text-foreground"
                : "text-muted"
          }`}
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
              step >= 1 ? "bg-primary text-white" : "bg-background text-muted"
            }`}
          >
            1
          </span>
          Plan Info
        </button>

        <button
          type="button"
          onClick={() => {
            if (planForm.name.trim().length >= 2) {
              setError("");
              setStep(2);
            }
          }}
          className={`flex min-h-12 items-center justify-center gap-2 border-r border-border px-4 text-sm transition-colors ${
            step === 2
              ? "bg-primary-soft font-semibold text-foreground"
              : step > 2
                ? "text-foreground"
                : "text-muted"
          }`}
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
              step >= 2 ? "bg-primary text-white" : "bg-background text-muted"
            }`}
          >
            2
          </span>
          Meals
        </button>

        <button
          type="button"
          onClick={() => {
            if (planForm.name.trim().length >= 2 && meals.length > 0) {
              setError("");
              setStep(3);
            }
          }}
          className={`flex min-h-12 items-center justify-center gap-2 px-4 text-sm transition-colors ${
            step === 3
              ? "bg-primary-soft font-semibold text-foreground"
              : "text-muted"
          }`}
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
              step >= 3 ? "bg-primary text-white" : "bg-background text-muted"
            }`}
          >
            3
          </span>
          Review
        </button>
      </div>

      {step === 1 && (
        <form
          onSubmit={handlePlanNext}
          className="rounded-xl border border-border bg-surface"
        >
          <div className="grid gap-5 p-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-base font-semibold">Plan Information</h2>

              <p className="mt-1 max-w-sm text-sm text-muted">
                Give the meal plan a clear name and a short description.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="planName"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Plan Name
                </label>

                <input
                  id="planName"
                  required
                  minLength={2}
                  maxLength={100}
                  value={planForm.name}
                  onChange={(event) => {
                    setPlanForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }));

                    setError("");
                  }}
                  placeholder="Example: High Protein Plan"
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="planDescription"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="planDescription"
                  rows={3}
                  maxLength={500}
                  value={planForm.description}
                  onChange={(event) => {
                    setPlanForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }));

                    setError("");
                  }}
                  placeholder="Describe the purpose of this meal plan..."
                  className="w-full resize-none rounded-md border border-input-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <Link
              href="/meal-plans"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-hover"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Next
              <Icon name="arrow" className="size-4" />
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <form
              onSubmit={handleAddMeal}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="mb-4">
                <h2 className="text-base font-semibold">Add Meal</h2>

                <p className="mt-1 text-sm text-muted">
                  Add meals to this meal plan.
                </p>
              </div>

              <div className="grid gap-3">
                <div>
                  <label
                    htmlFor="mealName"
                    className="mb-1 block text-sm font-medium"
                  >
                    Meal Name
                  </label>

                  <input
                    id="mealName"
                    required
                    minLength={2}
                    maxLength={100}
                    value={mealForm.name}
                    onChange={(event) =>
                      setMealForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Example: Grilled Chicken Bowl"
                    className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mealInstructions"
                    className="mb-1 block text-sm font-medium"
                  >
                    Instructions
                  </label>

                  <textarea
                    id="mealInstructions"
                    rows={4}
                    required
                    minLength={2}
                    maxLength={1000}
                    value={mealForm.instructions}
                    onChange={(event) =>
                      setMealForm((prev) => ({
                        ...prev,
                        instructions: event.target.value,
                      }))
                    }
                    placeholder="Describe preparation steps and portions..."
                    className="w-full resize-none rounded-md border border-input-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-danger">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-1 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <Icon name="plus" className="size-4" />
                  Add Meal
                </button>
              </div>
            </form>

            <section className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Added Meals</h2>

                  <p className="mt-1 text-sm text-muted">
                    {meals.length} added
                  </p>
                </div>
              </div>

              {meals.length > 0 ? (
                <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                  {meals.map((meal, index) => (
                    <div
                      key={`${meal.name}-${index}`}
                      className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {meal.name}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-muted">
                          {meal.instructions}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMeal(index)}
                        className="shrink-0 rounded-md px-2 py-1 text-xs text-danger hover:bg-danger-soft"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted">No meals added yet.</p>
                </div>
              )}
            </section>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(1);
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-hover"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleGoToReview}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Review Plan
              <Icon name="arrow" className="size-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4">
          <section className="grid gap-5 rounded-xl border border-border bg-surface p-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="text-base font-semibold">Plan Details</h2>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Name
                </p>

                <p className="mt-1 font-semibold">{planForm.name}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Description
                </p>

                <p className="mt-1 text-sm text-muted">
                  {planForm.description || "No description provided."}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Meals
                <span className="ml-2 text-sm font-normal text-muted">
                  ({meals.length})
                </span>
              </h2>

              <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto pr-1">
                {meals.map((meal, index) => (
                  <div
                    key={`${meal.name}-${index}`}
                    className="rounded-lg border border-border bg-background px-3 py-3"
                  >
                    <p className="text-sm font-semibold">
                      {index + 1}. {meal.name}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {meal.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                setError("");
                setStep(2);
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-hover disabled:opacity-60"
            >
              Back
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleFinish()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="check" className="size-4" />

              {isSaving ? "Creating..." : "Create Meal Plan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
