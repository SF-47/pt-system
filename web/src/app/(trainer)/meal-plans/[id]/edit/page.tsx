"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import SortableList from "@/components/SortableList";
import SortableRow from "@/components/SortableRow";

type MealPlan = {
  id: number;
  name: string;
  description: string | null;
  meals: Meal[];
};

type Meal = {
  id: number;
  mealPlanId: number;
  name: string;
  instructions: string;
  position: number;
};

type MealForm = {
  name: string;
  instructions: string;
};

const emptyMealForm: MealForm = {
  name: "",
  instructions: "",
};

export default function EditMealPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const planId = Number(params.id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingMealId, setUpdatingMealId] = useState<number | null>(null);
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [mealDraft, setMealDraft] = useState<Meal | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState<MealForm>(emptyMealForm);
  const [isSavingNewMeal, setIsSavingNewMeal] = useState(false);
  const [addMealError, setAddMealError] = useState("");
  const [addMealMessage, setAddMealMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [mealError, setMealError] = useState("");
  const [mealErrorId, setMealErrorId] = useState<number | null>(null);
  const [updatedMealId, setUpdatedMealId] = useState<number | null>(null);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const [deletingMealId, setDeletingMealId] = useState<number | null>(null);
  const [deleteMealError, setDeleteMealError] = useState("");
  const [deleteMealMessage, setDeleteMealMessage] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [reorderError, setReorderError] = useState("");

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
          setMeals(response.data.meals);
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
      setSaveError(getErrorMessage(error, "Meal plan could not be updated. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditMeal(meal: Meal) {
    setIsAddingMeal(false);
    setAddMealError("");
    setEditingMealId(meal.id);
    setMealDraft({ ...meal });
    setMealError("");
    setMealErrorId(null);
    setUpdatedMealId(null);
  }

  function handleOpenAddMeal() {
    setEditingMealId(null);
    setMealDraft(null);
    setMealError("");
    setMealErrorId(null);
    setUpdatedMealId(null);
    setNewMeal(emptyMealForm);
    setAddMealError("");
    setAddMealMessage("");
    setIsAddingMeal(true);
  }

  function handleCancelAddMeal() {
    setIsAddingMeal(false);
    setNewMeal(emptyMealForm);
    setAddMealError("");
  }

  function updateNewMeal(changes: Partial<MealForm>) {
    setNewMeal((currentMeal) => ({
      ...currentMeal,
      ...changes,
    }));
    setAddMealError("");
  }

  async function handleAddMeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = newMeal.name.trim();
    const trimmedInstructions = newMeal.instructions.trim();

    if (trimmedName.length < 2) {
      setAddMealError("Meal name must be at least 2 characters.");
      return;
    }

    if (trimmedInstructions.length < 2) {
      setAddMealError("Instructions must be at least 2 characters.");
      return;
    }

    try {
      setIsSavingNewMeal(true);
      setAddMealError("");
      setAddMealMessage("");

      const response = await api.post<Meal>(Endpoints.addMeal(planId), {
        name: trimmedName,
        instructions: trimmedInstructions,
        position: meals.length + 1,
      });

      setMeals((currentMeals) => [...currentMeals, response.data]);
      setNewMeal(emptyMealForm);
      setIsAddingMeal(false);
      setAddMealMessage("Meal added successfully.");
    } catch (error) {
      console.error("Failed to add meal:", error);
      setAddMealError(getErrorMessage(error, "Meal could not be added. Please try again."));
    } finally {
      setIsSavingNewMeal(false);
    }
  }

  async function handleReorder(reordered: Meal[]) {
    const previous = meals;

    setMeals(reordered.map((meal, index) => ({ ...meal, position: index + 1 })));
    setReorderError("");
    setIsReordering(true);

    try {
      await api.put(Endpoints.reorderMeals(planId), {
        items: reordered.map((meal, index) => ({
          id: meal.id,
          position: index + 1,
        })),
      });
    } catch (error) {
      console.error("Failed to reorder meals:", error);
      setMeals(previous);
      setReorderError(
        getErrorMessage(error, "Meals could not be reordered. Please try again."),
      );
    } finally {
      setIsReordering(false);
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

      setMeals((currentMeals) =>
        currentMeals
          .filter((meal) => meal.id !== mealId)
          .map((meal, index) => ({ ...meal, position: index + 1 })),
      );

      if (editingMealId === mealId) {
        setEditingMealId(null);
        setMealDraft(null);
      }

      setMealToDelete(null);
      setDeleteMealMessage("Meal deleted successfully.");
    } catch (error) {
      console.error("Failed to delete meal:", error);
      setDeleteMealError("Meal could not be deleted. Please try again.");
    } finally {
      setDeletingMealId(null);
    }
  }

  function handleCancelMealEdit() {
    setEditingMealId(null);
    setMealDraft(null);
    setMealError("");
    setMealErrorId(null);
  }

  function updateMealDraft(changes: Partial<Omit<Meal, "id" | "mealPlanId">>) {
    setMealDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, ...changes } : currentDraft,
    );
    setMealError("");
    setMealErrorId(null);
  }

  async function handleUpdateMeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!mealDraft) {
      return;
    }

    const meal = mealDraft;
    const trimmedName = meal.name.trim();
    const trimmedInstructions = meal.instructions.trim();

    if (trimmedName.length < 2) {
      setUpdatedMealId(null);
      setMealErrorId(meal.id);
      setMealError("Meal name must be at least 2 characters.");
      return;
    }

    if (trimmedInstructions.length < 2) {
      setUpdatedMealId(null);
      setMealErrorId(meal.id);
      setMealError("Instructions must be at least 2 characters.");
      return;
    }

    try {
      setUpdatingMealId(meal.id);
      setUpdatedMealId(null);
      setMealError("");
      setMealErrorId(null);

      const response = await api.put<Meal>(Endpoints.mealById(meal.id), {
        name: trimmedName,
        instructions: trimmedInstructions,
      });

      setMeals((currentMeals) =>
        currentMeals.map((currentMeal) =>
          currentMeal.id === meal.id ? response.data : currentMeal,
        ),
      );
      setUpdatedMealId(meal.id);
      setEditingMealId(null);
      setMealDraft(null);
    } catch (error) {
      console.error("Failed to update meal:", error);
      setMealErrorId(meal.id);
      setMealError(getErrorMessage(error, "Meal could not be updated. Please try again."));
    } finally {
      setUpdatingMealId(null);
    }
  }

  if (isLoading) {
    return (
      <div
        className="w-full animate-pulse"
        role="status"
        aria-label="Loading meal plan"
        aria-busy="true"
      >
        <div className="h-5 w-40 rounded bg-border" />
        <div className="mt-6 h-10 w-64 rounded bg-border" />
        <div className="mt-3 h-5 w-80 max-w-full rounded bg-border" />

        <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="h-5 w-36 rounded bg-border" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-border" />
          </div>
          <div className="grid gap-4 p-5 sm:p-6">
            <div>
              <div className="mb-2 h-4 w-24 rounded bg-border" />
              <div className="h-11 rounded-md bg-border" />
            </div>
            <div>
              <div className="mb-2 h-4 w-24 rounded bg-border" />
              <div className="h-16 rounded-md bg-border" />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
            <div className="h-10 w-20 rounded-md bg-border" />
            <div className="h-10 w-32 rounded-md bg-border" />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-start justify-between px-5 py-4 sm:px-6">
            <div>
              <div className="h-5 w-28 rounded bg-border" />
              <div className="mt-2 h-4 w-80 max-w-full rounded bg-border" />
            </div>
            <div className="h-7 w-24 rounded-md bg-border" />
          </div>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-4 border-t border-border px-5 py-3 sm:px-6"
            >
              <div className="size-7 shrink-0 rounded-md bg-border" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-40 rounded bg-border" />
                <div className="mt-2 h-3 w-64 max-w-full rounded bg-border" />
              </div>
              <div className="h-10 w-20 rounded-md bg-border" />
            </div>
          ))}
        </div>
        </div>
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
    <div className="w-full">
      <BackLink href={`/meal-plans/${planId}`}>Back to Meal Plan</BackLink>
      <PageHeader
        title="Edit Meal Plan"
        description="Update the plan details and meals."
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface xl:sticky xl:top-24"
        >
        <div className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Icon name="meal" className="size-4 text-muted" />
            Plan details
          </h2>
          <p className="mt-1 text-sm text-muted">
            Update the basic information for this meal plan.
          </p>
        </div>

        <div className="grid flex-1 gap-4 p-5 sm:p-6">
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
              className="block min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
              rows={2}
              maxLength={500}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setSaveError("");
              }}
              className="block min-h-11 w-full resize-y rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {saveError && (
          <p
            role="alert"
            className="mx-5 mb-4 text-sm text-danger sm:mx-6"
          >
            {saveError}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
          <Link
            href={`/meal-plans/${planId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            aria-busy={isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="check" className="size-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        </form>

        <section className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <div className="shrink-0 flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Icon name="meal" className="size-4 text-muted" />
              Meals
            </h2>
            <p className="mt-1 text-sm text-muted">
              Update meal names and preparation instructions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-muted tabular-nums">
              {meals.length} {meals.length === 1 ? "meal" : "meals"}
            </span>
            <button
              type="button"
              onClick={handleOpenAddMeal}
              disabled={isAddingMeal || isSavingNewMeal}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="plus" className="size-4" />
              Add Meal
            </button>
          </div>
        </div>

        {addMealMessage && (
          <p role="status" className="shrink-0 px-5 pb-3 text-sm text-primary-hover sm:px-6">
            {addMealMessage}
          </p>
        )}

        {reorderError && (
          <p role="alert" className="shrink-0 px-5 pb-3 text-sm text-danger sm:px-6">
            {reorderError}
          </p>
        )}

        {deleteMealMessage && (
          <p role="status" className="shrink-0 px-5 pb-3 text-sm text-primary-hover sm:px-6">
            {deleteMealMessage}
          </p>
        )}

        {isAddingMeal && (
          <form
            onSubmit={(event) => void handleAddMeal(event)}
            className="shrink-0 border-t border-border bg-background px-5 py-4 sm:px-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon name="plus" className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                New meal
              </h3>
            </div>

            <div className="grid gap-3">
              <div>
                <label
                  htmlFor="newMealName"
                  className="mb-1 block text-xs font-medium text-muted"
                >
                  Meal Name
                </label>
                <input
                  id="newMealName"
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={newMeal.name}
                  onChange={(event) =>
                    updateNewMeal({ name: event.target.value })
                  }
                  placeholder="Example: Grilled Chicken Bowl"
                  className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="newMealInstructions"
                  className="mb-1 block text-xs font-medium text-muted"
                >
                  Instructions
                </label>
                <textarea
                  id="newMealInstructions"
                  name="instructions"
                  rows={3}
                  required
                  minLength={2}
                  maxLength={1000}
                  value={newMeal.instructions}
                  onChange={(event) =>
                    updateNewMeal({ instructions: event.target.value })
                  }
                  placeholder="Describe preparation steps and portions..."
                  className="w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
              {addMealError && (
                <p role="alert" className="mr-auto text-sm text-danger">
                  {addMealError}
                </p>
              )}
              <button
                type="button"
                onClick={handleCancelAddMeal}
                disabled={isSavingNewMeal}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingNewMeal}
                aria-busy={isSavingNewMeal}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="check" className="size-4" />
                {isSavingNewMeal ? "Adding..." : "Add Meal"}
              </button>
            </div>
          </form>
        )}

        {meals.length > 0 ? (
          <SortableList
            items={meals}
            disabled={isReordering}
            onReorder={(reordered) => void handleReorder(reordered)}
          >
          {meals.map((meal, index) => {
            const isUpdating = updatingMealId === meal.id;
            const isEditing =
              editingMealId === meal.id && mealDraft?.id === meal.id;

            return (
              <SortableRow key={meal.id} id={meal.id} label={meal.name}>
                {(dragHandle) => (
                <>
                <div className="flex flex-col gap-3 px-5 py-3 sm:px-6 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {dragHandle}
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary-hover tabular-nums dark:text-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {meal.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                        {meal.instructions}
                      </p>
                      {updatedMealId === meal.id && (
                        <p role="status" className="mt-1 text-xs text-primary-hover">
                          Meal updated successfully.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleEditMeal(meal)}
                      disabled={isUpdating || deletingMealId === meal.id}
                      aria-label={`Edit ${meal.name}`}
                      title="Edit meal"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Icon name="edit" className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteMealError("");
                        setDeleteMealMessage("");
                        setMealToDelete(meal);
                      }}
                      disabled={isUpdating || deletingMealId === meal.id}
                      aria-label={`Delete ${meal.name}`}
                      title="Delete meal"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-danger/40 bg-background text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2
                        className={`size-4 ${deletingMealId === meal.id ? "animate-pulse" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {isEditing && mealDraft && (
                  <form
                    onSubmit={(event) => void handleUpdateMeal(event)}
                    className="border-t border-border bg-background px-5 py-4 sm:px-6"
                  >
                    <div className="grid gap-3">
                      <div>
                        <label
                          htmlFor={`meal-${meal.id}-name`}
                          className="mb-1 block text-xs font-medium text-muted"
                        >
                          Meal Name
                        </label>
                        <input
                          id={`meal-${meal.id}-name`}
                          name="name"
                          required
                          minLength={2}
                          maxLength={100}
                          value={mealDraft.name}
                          onChange={(event) =>
                            updateMealDraft({ name: event.target.value })
                          }
                          className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`meal-${meal.id}-instructions`}
                          className="mb-1 block text-xs font-medium text-muted"
                        >
                          Instructions
                        </label>
                        <textarea
                          id={`meal-${meal.id}-instructions`}
                          name="instructions"
                          rows={3}
                          required
                          minLength={2}
                          maxLength={1000}
                          value={mealDraft.instructions}
                          onChange={(event) =>
                            updateMealDraft({
                              instructions: event.target.value,
                            })
                          }
                          className="w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                      {mealErrorId === meal.id && mealError && (
                        <p role="alert" className="mr-auto text-sm text-danger">
                          {mealError}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleCancelMealEdit}
                        disabled={isUpdating}
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        aria-busy={isUpdating}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Icon name="check" className="size-4" />
                        {isUpdating ? "Updating..." : "Update Meal"}
                      </button>
                    </div>
                  </form>
                )}
                </>
                )}
              </SortableRow>
            );
          })}
          </SortableList>
        ) : !isAddingMeal ? (
          <p className="border-t border-border px-5 py-8 text-center text-sm text-muted sm:px-6">
            This meal plan does not have any meals yet.
          </p>
        ) : null}
        </section>
      </div>

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
