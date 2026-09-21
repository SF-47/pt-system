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
    <div className="w-full">
      <BackLink href="/clients">Back to Clients</BackLink>
      <PageHeader
        title="Add Client"
        description="Set up a client profile and account details."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 xl:grid-cols-2">
          <fieldset className="flex min-w-0 flex-col rounded-xl border border-border bg-surface">
            <legend className="sr-only">Personal information</legend>

            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Icon name="clients" className="size-4 text-muted" />
                Personal information
              </h2>
              <p className="mt-1 text-sm text-muted">
                Add the client&apos;s contact details.
              </p>
            </div>

            <div className="grid flex-1 content-start gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-1 2xl:grid-cols-2">
              <div className="sm:col-span-2 xl:col-span-1 2xl:col-span-2">
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
                  required
                  minLength={2}
                  autoComplete="off"
                  value={dataForm.fullName}
                  onChange={(event) =>
                    setDataForm((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={dataForm.email}
                  onChange={(event) =>
                    setDataForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
                  required
                  minLength={6}
                  maxLength={30}
                  autoComplete="off"
                  value={dataForm.phoneNumber}
                  onChange={(event) =>
                    setDataForm((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="flex min-w-0 flex-col rounded-xl border border-border bg-surface">
            <legend className="sr-only">Client account</legend>

            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Icon name="edit" className="size-4 text-muted" />
                Client account
              </h2>
              <p className="mt-1 text-sm text-muted">
                Create the credentials used to sign in.
              </p>
            </div>

            <div className="grid flex-1 content-start gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-1 2xl:grid-cols-2">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium"
                >
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  minLength={3}
                  maxLength={50}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={dataForm.username}
                  onChange={(event) =>
                    setDataForm((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                  placeholder="Client username"
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
                  required
                  minLength={8}
                  maxLength={100}
                  autoComplete="new-password"
                  value={dataForm.password}
                  onChange={(event) =>
                    setDataForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter password"
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </fieldset>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
            href="/clients"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="check" className="size-4" />
            {isSubmitting ? "Saving..." : "Save Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
