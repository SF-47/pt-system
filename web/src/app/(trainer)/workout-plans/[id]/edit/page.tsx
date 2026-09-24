"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import ExerciseFields from "@/components/workout-plans/ExerciseFields";

type WorkoutPlan = {
  id: number;
  name: string;
  description: string | null;
  exercises: Exercise[];
};

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

type ExerciseForm = {
  name: string;
  description: string;
  sets: number;
  reps: number;
  restSeconds: number;
};

const emptyExerciseForm: ExerciseForm = {
  name: "",
  description: "",
  sets: 1,
  reps: 1,
  restSeconds: 60,
};

export default function EditWorkoutPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const planId = Number(params.id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingExerciseId, setUpdatingExerciseId] = useState<number | null>(
    null,
  );
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(
    null,
  );
  const [exerciseDraft, setExerciseDraft] = useState<Exercise | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] =
    useState<ExerciseForm>(emptyExerciseForm);
  const [isSavingNewExercise, setIsSavingNewExercise] = useState(false);
  const [addExerciseError, setAddExerciseError] = useState("");
  const [addExerciseMessage, setAddExerciseMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [exerciseError, setExerciseError] = useState("");
  const [exerciseErrorId, setExerciseErrorId] = useState<number | null>(null);
  const [updatedExerciseId, setUpdatedExerciseId] = useState<number | null>(
    null,
  );
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(
    null,
  );
  const [deletingExerciseId, setDeletingExerciseId] = useState<number | null>(
    null,
  );
  const [deleteExerciseError, setDeleteExerciseError] = useState("");
  const [deleteExerciseMessage, setDeleteExerciseMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadWorkoutPlan() {
      if (Number.isNaN(planId)) {
        setLoadError("Invalid workout plan ID.");
        setIsLoading(false);
        return;
      }

      try {
        setLoadError("");
        const response = await api.get<WorkoutPlan>(
          Endpoints.workoutPlanById(planId),
        );

        if (!ignore) {
          setName(response.data.name);
          setDescription(response.data.description ?? "");
          setExercises(response.data.exercises);
        }
      } catch (error) {
        console.error("Failed to load workout plan:", error);

        if (!ignore) {
          setLoadError("Workout plan could not be loaded. Please try again.");
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

      await api.put(Endpoints.workoutPlanById(planId), {
        name: trimmedName,
        description: description.trim(),
      });

      router.push(`/workout-plans/${planId}`);
    } catch (error) {
      console.error("Failed to update workout plan:", error);
      setSaveError(getErrorMessage(error, "Workout plan could not be updated. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditExercise(exercise: Exercise) {
    setIsAddingExercise(false);
    setAddExerciseError("");
    setEditingExerciseId(exercise.id);
    setExerciseDraft({ ...exercise });
    setExerciseError("");
    setExerciseErrorId(null);
    setUpdatedExerciseId(null);
  }

  function handleOpenAddExercise() {
    setEditingExerciseId(null);
    setExerciseDraft(null);
    setExerciseError("");
    setExerciseErrorId(null);
    setUpdatedExerciseId(null);
    setNewExercise(emptyExerciseForm);
    setAddExerciseError("");
    setAddExerciseMessage("");
    setIsAddingExercise(true);
  }

  function handleCancelAddExercise() {
    setIsAddingExercise(false);
    setNewExercise(emptyExerciseForm);
    setAddExerciseError("");
  }

  function updateNewExercise(changes: Partial<ExerciseForm>) {
    setNewExercise((currentExercise) => ({
      ...currentExercise,
      ...changes,
    }));
    setAddExerciseError("");
  }

  async function handleAddExercise(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = newExercise.name.trim();

    if (trimmedName.length < 2) {
      setAddExerciseError("Exercise name must be at least 2 characters.");
      return;
    }

    try {
      setIsSavingNewExercise(true);
      setAddExerciseError("");
      setAddExerciseMessage("");

      const response = await api.post<Exercise>(Endpoints.addExercise(planId), {
        name: trimmedName,
        description: newExercise.description.trim(),
        sets: newExercise.sets,
        reps: newExercise.reps,
        restSeconds: newExercise.restSeconds,
        position: Math.max(0, ...exercises.map((item) => item.position)) + 1,
      });

      setExercises((currentExercises) => [
        ...currentExercises,
        response.data,
      ]);
      setNewExercise(emptyExerciseForm);
      setIsAddingExercise(false);
      setAddExerciseMessage("Exercise added successfully.");
    } catch (error) {
      console.error("Failed to add exercise:", error);
      setAddExerciseError(getErrorMessage(error, "Exercise could not be added. Please try again."));
    } finally {
      setIsSavingNewExercise(false);
    }
  }

  async function handleDeleteExercise() {
    if (!exerciseToDelete) {
      return;
    }

    const exerciseId = exerciseToDelete.id;

    try {
      setDeletingExerciseId(exerciseId);
      setDeleteExerciseError("");
      setDeleteExerciseMessage("");

      await api.delete(Endpoints.exerciseById(exerciseId));

      setExercises((currentExercises) =>
        currentExercises.filter((exercise) => exercise.id !== exerciseId),
      );

      if (editingExerciseId === exerciseId) {
        setEditingExerciseId(null);
        setExerciseDraft(null);
      }

      setExerciseToDelete(null);
      setDeleteExerciseMessage("Exercise deleted successfully.");
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      setDeleteExerciseError("Exercise could not be deleted. Please try again.");
    } finally {
      setDeletingExerciseId(null);
    }
  }

  function handleCancelExerciseEdit() {
    setEditingExerciseId(null);
    setExerciseDraft(null);
    setExerciseError("");
    setExerciseErrorId(null);
  }

  function updateExerciseDraft(
    changes: Partial<Omit<Exercise, "id" | "workoutPlanId">>,
  ) {
    setExerciseDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, ...changes } : currentDraft,
    );
    setExerciseError("");
    setExerciseErrorId(null);
  }

  async function handleUpdateExercise(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!exerciseDraft) {
      return;
    }

    const exercise = exerciseDraft;
    const trimmedName = exercise.name.trim();

    if (trimmedName.length < 2) {
      setUpdatedExerciseId(null);
      setExerciseErrorId(exercise.id);
      setExerciseError("Exercise name must be at least 2 characters.");
      return;
    }

    try {
      setUpdatingExerciseId(exercise.id);
      setUpdatedExerciseId(null);
      setExerciseError("");
      setExerciseErrorId(null);

      const response = await api.put<Exercise>(
        Endpoints.exerciseById(exercise.id),
        {
          name: trimmedName,
          description: exercise.description?.trim() ?? "",
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
        },
      );

      setExercises((currentExercises) =>
        currentExercises.map((currentExercise) =>
          currentExercise.id === exercise.id
            ? response.data
            : currentExercise,
        ),
      );
      setUpdatedExerciseId(exercise.id);
      setEditingExerciseId(null);
      setExerciseDraft(null);
    } catch (error) {
      console.error("Failed to update exercise:", error);
      setExerciseErrorId(exercise.id);
      setExerciseError(getErrorMessage(error, "Exercise could not be updated. Please try again."));
    } finally {
      setUpdatingExerciseId(null);
    }
  }

  if (isLoading) {
    return (
      <div
        className="w-full animate-pulse"
        role="status"
        aria-label="Loading workout plan"
        aria-busy="true"
      >
        <div className="h-5 w-44 rounded bg-border" />
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
              <div className="hidden h-4 w-64 rounded bg-border sm:block" />
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
        <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
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
      <BackLink href={`/workout-plans/${planId}`}>
        Back to Workout Plan
      </BackLink>
      <PageHeader
        title="Edit Workout Plan"
        description="Update the plan details and exercises."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
        >
        <div className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Icon name="workout" className="size-4 text-muted" />
            Plan details
          </h2>
          <p className="mt-1 text-sm text-muted">
            Update the basic information for this workout plan.
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
            href={`/workout-plans/${planId}`}
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
              <Icon name="workout" className="size-4 text-muted" />
              Exercises
            </h2>
            <p className="mt-1 text-sm text-muted">
              Update exercise instructions, sets, repetitions, and rest time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-muted tabular-nums">
              {exercises.length}{" "}
              {exercises.length === 1 ? "exercise" : "exercises"}
            </span>
            <button
              type="button"
              onClick={handleOpenAddExercise}
              disabled={isAddingExercise || isSavingNewExercise}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="plus" className="size-4" />
              Add Exercise
            </button>
          </div>
        </div>

        {addExerciseMessage && (
          <p role="status" className="shrink-0 px-5 pb-3 text-sm text-primary-hover sm:px-6">
            {addExerciseMessage}
          </p>
        )}

        {deleteExerciseMessage && (
          <p role="status" className="shrink-0 px-5 pb-3 text-sm text-primary-hover sm:px-6">
            {deleteExerciseMessage}
          </p>
        )}

        {isAddingExercise && (
          <form
            onSubmit={(event) => void handleAddExercise(event)}
            className="shrink-0 border-t border-border bg-background px-5 py-4 sm:px-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon name="plus" className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                New exercise
              </h3>
            </div>

            <ExerciseFields
              idPrefix="newExercise"
              values={newExercise}
              onChange={updateNewExercise}
              showPlaceholders
            />

            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
              {addExerciseError && (
                <p role="alert" className="mr-auto text-sm text-danger">
                  {addExerciseError}
                </p>
              )}
              <button
                type="button"
                onClick={handleCancelAddExercise}
                disabled={isSavingNewExercise}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingNewExercise}
                aria-busy={isSavingNewExercise}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="check" className="size-4" />
                {isSavingNewExercise ? "Adding..." : "Add Exercise"}
              </button>
            </div>
          </form>
        )}

        <div className="max-h-[360px] overflow-y-auto">
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => {
            const isUpdating = updatingExerciseId === exercise.id;
            const isEditing =
              editingExerciseId === exercise.id &&
              exerciseDraft?.id === exercise.id;

            return (
              <article key={exercise.id} className="border-t border-border">
                <div className="flex flex-col gap-3 px-5 py-3 sm:px-6 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary-hover tabular-nums dark:text-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {exercise.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                        {exercise.description || "No description provided."}
                      </p>
                      {updatedExerciseId === exercise.id && (
                        <p role="status" className="mt-1 text-xs text-primary-hover">
                          Exercise updated successfully.
                        </p>
                      )}
                    </div>
                  </div>

                  <dl className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1 pl-10 text-sm lg:pl-0">
                    <div className="flex gap-1.5">
                      <dt className="text-muted">Sets</dt>
                      <dd className="font-medium text-foreground tabular-nums">
                        {exercise.sets}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-muted">Reps</dt>
                      <dd className="font-medium text-foreground tabular-nums">
                        {exercise.reps}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-muted">Rest</dt>
                      <dd className="font-medium text-foreground tabular-nums">
                        {exercise.restSeconds > 0
                          ? `${exercise.restSeconds} sec`
                          : "No rest"}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleEditExercise(exercise)}
                      disabled={isUpdating || deletingExerciseId === exercise.id}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      <Icon name="edit" className="size-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteExerciseError("");
                        setDeleteExerciseMessage("");
                        setExerciseToDelete(exercise);
                      }}
                      disabled={isUpdating || deletingExerciseId === exercise.id}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-danger/40 bg-background px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      {deletingExerciseId === exercise.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                {isEditing && exerciseDraft && (
                  <form
                    onSubmit={(event) => void handleUpdateExercise(event)}
                    className="border-t border-border bg-background px-5 py-4 sm:px-6"
                  >
                    <ExerciseFields
                      idPrefix={`exercise-${exercise.id}`}
                      values={exerciseDraft}
                      onChange={updateExerciseDraft}
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                      {exerciseErrorId === exercise.id && exerciseError && (
                        <p role="alert" className="mr-auto text-sm text-danger">
                          {exerciseError}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleCancelExerciseEdit}
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
                        {isUpdating ? "Updating..." : "Update Exercise"}
                      </button>
                    </div>
                  </form>
                )}
              </article>
            );
          })
        ) : !isAddingExercise ? (
          <p className="border-t border-border px-5 py-8 text-center text-sm text-muted sm:px-6">
            This workout plan does not have any exercises yet.
          </p>
        ) : null}
        </div>
        </section>
      </div>

      <DeleteConfirmDialog
        open={exerciseToDelete !== null}
        title={`Delete ${exerciseToDelete?.name ?? "exercise"}?`}
        description="This action removes the exercise from this workout plan."
        isDeleting={exerciseToDelete?.id === deletingExerciseId}
        error={deleteExerciseError}
        onCancel={() => {
          if (deletingExerciseId === null) {
            setExerciseToDelete(null);
            setDeleteExerciseError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteExercise();
        }}
      />
    </div>
  );
}
