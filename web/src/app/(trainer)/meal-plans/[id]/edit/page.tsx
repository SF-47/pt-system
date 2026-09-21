"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";

type MealPlan = {
  id: number;
  name: string;
  description: string | null;
};

export default function EditMealPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const planId = Number(params.id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMealPlan() {
      if (Number.isNaN(planId)) {
        setLoadError("Invalid meal plan ID.");
        setIsLoading(false);
        return;
      }

      try {
        setLoadError("");
        const response = await api.get<MealPlan>(
          Endpoints.mealPlanById(planId),
        );

        if (!ignore) {
          setName(response.data.name);
          setDescription(response.data.description ?? "");
        }
      } catch (error) {
        console.error("Failed to load meal plan:", error);

        if (!ignore) {
          setLoadError("Meal plan could not be loaded. Please try again.");
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setSaveError("Plan name must be at least 2 characters.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      await api.put(Endpoints.mealPlanById(planId), {
        name: trimmedName,
        description: description.trim(),
      });

      router.push(`/meal-plans/${planId}`);
    } catch (error) {
      console.error("Failed to update meal plan:", error);
      setSaveError("Meal plan could not be updated. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl py-10 text-sm text-muted" role="status">
        Loading meal plan...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
        <div
          role="alert"
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
        >
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <BackLink href={`/meal-plans/${planId}`}>Back to Meal Plan</BackLink>
      <PageHeader
        title="Edit Meal Plan"
        description="Update the plan name and description."
      />

      <form onSubmit={handleSubmit} className="form-sheet overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <h2 className="text-lg font-semibold">Plan details</h2>
            <p className="mt-1 text-sm text-muted">
              Update the basic information for this meal plan.
            </p>
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Plan Name
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaveError("");
              }}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={500}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setSaveError("");
              }}
              className="block min-h-32 w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </div>

        {saveError && (
          <p
            role="alert"
            className="mx-5 mb-4 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger sm:mx-6"
          >
            {saveError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            disabled={isSaving}
            aria-busy={isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="check" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href={`/meal-plans/${planId}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
