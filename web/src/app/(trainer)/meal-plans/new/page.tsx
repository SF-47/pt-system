"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useState } from "react";

export default function CreateMealPlanPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-[720px]">
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
      <PageHeader title="Create Meal Plan" />

      <p className="my-[18px] text-[13px] text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="grid gap-[18px] rounded-[9px] border border-border bg-surface p-[22px]"
      >
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Plan Name
          </label>

          <input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="block min-h-[42px] w-full rounded-sm border border-input-border bg-surface px-3 py-[9px] text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="block min-h-[110px] w-full resize-y rounded-sm border border-input-border bg-surface px-3 py-[9px] text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-3.5 py-[9px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Meal Plan
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3.5 py-[9px] font-semibold text-foreground transition-colors hover:bg-hover"
            href="/meal-plans"
          >
            Cancel
          </Link>
        </div>
        <p role="status" className="text-muted">
          {submitted ? "Form reviewed. No changes were saved in this demo." : ""}
        </p>
      </form>
    </div>
  );
}
