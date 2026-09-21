"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateWorkoutPlanPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Plan name must be at least 2 characters.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const response = await api.post(Endpoints.workoutPlansBase, {
        name: trimmedName,
        description: description.trim(),
      });

      const createdId = response.data?.id;
      router.push(
        typeof createdId === "number"
          ? `/workout-plans/${createdId}`
          : "/workout-plans",
      );
    } catch (error) {
      console.error("Failed to create workout plan:", error);
      setError("Workout plan could not be created. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader title="Create Workout Plan" />

      <form
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <div className="grid gap-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <h2 className="text-lg font-semibold">Plan details</h2>
            <p className="mt-1 text-sm text-muted">
              Give the plan a clear name and describe its purpose.
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
                setError("");
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
                setError("");
              }}
              className="block min-h-32 w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </div>
        {error && (
          <p
            role="alert"
            className="mx-5 mb-4 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger sm:mx-6"
          >
            {error}
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
            {isSaving ? "Saving..." : "Save Workout Plan"}
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href="/workout-plans"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
