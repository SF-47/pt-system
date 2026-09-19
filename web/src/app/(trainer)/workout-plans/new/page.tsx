"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useState } from "react";

export default function CreateWorkoutPlanPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader title="Create Workout Plan" />

      <p className="mb-4 text-sm text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
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
              value={name}
              onChange={(event) => setName(event.target.value)}
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
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="block min-h-32 w-full resize-y rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Workout Plan
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href="/workout-plans"
          >
            Cancel
          </Link>
        </div>
        <p
          role="status"
          className="px-5 text-sm text-muted empty:hidden sm:px-7"
        >
          {submitted
            ? "Form reviewed. No changes were saved in this demo."
            : ""}
        </p>
      </form>
    </div>
  );
}
