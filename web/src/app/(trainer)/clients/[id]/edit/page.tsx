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
    <div className="max-w-[720px]">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader title="Edit Client" description={`Client ID: ${id}`} />

      <p className="my-[18px] text-[13px] text-muted">
        Demo form. Submissions are not saved yet.
      </p>
      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="grid gap-[18px] rounded-[9px] border border-border bg-surface p-[22px]"
      >
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
            Full Name
          </label>

          <input
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="block min-h-[42px] w-full rounded-sm border border-input-border bg-surface px-3 py-[9px] text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block min-h-[42px] w-full rounded-sm border border-input-border bg-surface px-3 py-[9px] text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-medium">
            Phone Number
          </label>

          <input
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="block min-h-[42px] w-full rounded-sm border border-input-border bg-surface px-3 py-[9px] text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-3.5 py-[9px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Icon name="check" />
            Save Changes
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3.5 py-[9px] font-semibold text-foreground transition-colors hover:bg-hover"
            href={`/clients/${id}`}
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
