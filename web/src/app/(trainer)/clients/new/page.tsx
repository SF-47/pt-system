"use client";

import BackLink from "@/components/BackLink";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";

type DataFormType = {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export default function AddClientPage() {
  const [dataForm, setDataForm] = useState<DataFormType>({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const response = await api.post(Endpoints.clientsBase, dataForm);

      const newClientId = response.data.id;

      router.push(`/clients/${newClientId}`);
    } catch (error) {
      console.error("Failed to create client:", error);
      setError("Failed to create client.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/clients">Back to Clients</BackLink>
      <PageHeader
        title="Add Client"
        description="Set up a client profile and account details."
      />

      <form
        onChange={() => setSubmitted(false)}
        onSubmit={handleSubmit}
        className="form-sheet overflow-hidden"
      >
        <fieldset className="grid gap-5 p-5 sm:p-6">
          <legend className="sr-only">Personal information</legend>
          <div>
            <h2 className="text-lg font-semibold">Personal information</h2>
            <p className="mt-1 text-sm text-muted">How to reach your client.</p>
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
              type="text"
              value={dataForm.fullName}
              onChange={(event) =>
                setDataForm((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
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
                value={dataForm.email}
                onChange={(event) =>
                  setDataForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
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
                type="tel"
                value={dataForm.phoneNumber}
                onChange={(event) =>
                  setDataForm((prev) => ({
                    ...prev,
                    phoneNumber: event.target.value,
                  }))
                }
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
              value={dataForm.username}
              onChange={(event) =>
                setDataForm((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              placeholder="Client username"
              className="min-h-11 w-full rounded-lg border border-input-border bg-background px-3 py-2 text-muted disabled:cursor-not-allowed"
              aria-describedby="username-preview-help"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={dataForm.password}
              onChange={(event) =>
                setDataForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              className="block min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
            />
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-primary-soft/40 px-5 py-4 sm:px-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="check" />
            {isSubmitting ? "Saving..." : "Save Client"}
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
            href="/clients"
          >
            Cancel
          </Link>
        </div>
        <p
          role="status"
          className="px-5 text-sm text-muted empty:hidden sm:px-7"
        >
          {submitted ? "Client created successfully." : error}
        </p>
      </form>
    </div>
  );
}
