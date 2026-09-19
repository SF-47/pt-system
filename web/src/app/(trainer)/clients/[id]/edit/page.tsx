"use client";

import BackLink from "@/components/BackLink";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { use, useState } from "react";

type EditClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditClientPage({ params }: EditClientPageProps) {
  const { id } = use(params);

  const [fullName, setFullName] = useState("Ahmad Hassan");
  const [email, setEmail] = useState("ahmad@example.com");
  const [phoneNumber, setPhoneNumber] = useState("70123456");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader
        title="Edit Client"
        description={`Update profile and contact details · Client ${id}`}
      />

      <p className="mb-4 text-sm text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <fieldset className="grid gap-5 p-5 sm:p-6">
          <legend className="sr-only">Personal information</legend>
          <div>
            <h2 className="text-lg font-semibold">Personal information</h2>
            <p className="mt-1 text-sm text-muted">
              How to reach your client.
            </p>
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="grid gap-5 border-t border-border p-5 sm:p-6">
          <legend className="sr-only">Client account</legend>
          <h2 className="text-lg font-semibold">Client account</h2>
          <div>
            <label
              htmlFor="username-preview"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username-preview"
              type="text"
              disabled
              placeholder="Client username"
              className="min-h-11 w-full rounded-lg border border-input-border bg-background px-3 py-2 text-muted disabled:cursor-not-allowed"
              aria-describedby="username-preview-help"
            />
            <p id="username-preview-help" className="mt-2 text-sm text-muted">
              Username field preview. Account editing is not connected in this
              form.
            </p>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Changes
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href={`/clients/${id}`}
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
