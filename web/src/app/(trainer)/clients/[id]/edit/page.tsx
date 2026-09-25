"use client";

import BackLink from "@/components/BackLink";
import FilterSelect from "@/components/FilterSelect";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditClientLoading from "./loading";

type PersonalInfoFormType = {
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
};

type CredentialsFormType = {
  username: string;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function EditClientPage() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params.id);

  const [personalInfoForm, setPersonalInfoForm] =
    useState<PersonalInfoFormType>({
      fullName: "",
      email: "",
      phoneNumber: "",
      isActive: true,
    });

  const [credentialsForm, setCredentialsForm] = useState<CredentialsFormType>({
    username: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isSavingPersonalInfo, setIsSavingPersonalInfo] = useState(false);

  const [personalInfoMessage, setPersonalInfoMessage] = useState("");

  const [personalInfoError, setPersonalInfoError] = useState("");

  const [isSavingCredentials, setIsSavingCredentials] = useState(false);

  const [credentialsMessage, setCredentialsMessage] = useState("");

  const [credentialsError, setCredentialsError] = useState("");

  async function handleSubmitPersonalInfo(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (personalInfoForm.fullName.trim().length < 2) {
      setPersonalInfoMessage("");
      setPersonalInfoError("Full name must be at least 2 characters.");
      return;
    }

    if (personalInfoForm.phoneNumber.trim().length < 6) {
      setPersonalInfoMessage("");
      setPersonalInfoError("Phone number must be at least 6 characters.");
      return;
    }

    try {
      setIsSavingPersonalInfo(true);
      setPersonalInfoMessage("");
      setPersonalInfoError("");

      await api.put(Endpoints.clientById(clientId), {
        ...personalInfoForm,
        fullName: personalInfoForm.fullName.trim(),
        phoneNumber: personalInfoForm.phoneNumber.trim(),
        username: credentialsForm.username,
      });

      setPersonalInfoMessage("Personal information updated successfully.");
    } catch (error) {
      console.error(error);

      setPersonalInfoError(
        getErrorMessage(
          error,
          "Personal information could not be updated. Please try again.",
        ),
      );
    } finally {
      setIsSavingPersonalInfo(false);
    }
  }

  async function handleSubmitCredentials(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (credentialsForm.username.trim().length < 3) {
      setCredentialsMessage("");
      setCredentialsError("Username must be at least 3 characters.");
      return;
    }

    if (credentialsForm.newPassword.length < 8) {
      setCredentialsMessage("");
      setCredentialsError("New password must be at least 8 characters.");
      return;
    }

    if (credentialsForm.newPassword !== credentialsForm.confirmNewPassword) {
      setCredentialsMessage("");
      setCredentialsError("New passwords do not match.");

      return;
    }

    try {
      setIsSavingCredentials(true);
      setCredentialsMessage("");
      setCredentialsError("");

      await api.put(Endpoints.updateClientCredentials(clientId), {
        username: credentialsForm.username.trim(),
        password: credentialsForm.newPassword,
      });

      setCredentialsMessage("Client credentials updated successfully.");
      setCredentialsForm((prev) => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      console.error(error);

      setCredentialsError(
        getErrorMessage(
          error,
          "Client credentials could not be updated. Please try again.",
        ),
      );
    } finally {
      setIsSavingCredentials(false);
    }
  }

  useEffect(() => {
    if (Number.isNaN(clientId)) {
      return;
    }

    async function loadClient() {
      try {
        setLoadError("");

        const response = await api.get(Endpoints.clientById(clientId));

        const client = response.data;

        setPersonalInfoForm({
          fullName: client.fullName,
          email: client.email ?? "",
          phoneNumber: client.phoneNumber,
          isActive: client.isActive,
        });

        setCredentialsForm((prev) => ({
          ...prev,
          username: client.username,
        }));
      } catch (error) {
        console.error(error);

        setLoadError("Failed to load client information.");
      } finally {
        setIsLoadingClient(false);
      }
    }

    void loadClient();
  }, [clientId]);

  if (Number.isNaN(clientId)) {
    return (
      <div className="w-full">
        <BackLink href="/clients">Back to Clients</BackLink>

        <p
          role="alert"
          className="mt-6 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-danger"
        >
          Invalid client ID.
        </p>
      </div>
    );
  }

  if (isLoadingClient) {
    return <EditClientLoading />;
  }

  if (loadError) {
    return (
      <div className="w-full">
        <BackLink href="/clients">Back to Clients</BackLink>

        <p
          role="alert"
          className="mt-6 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-danger"
        >
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BackLink href={`/clients/${clientId}`}>Back to Client Details</BackLink>

      <PageHeader
        title="Edit Client"
        description="Update client information and login credentials."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <form
          onSubmit={handleSubmitPersonalInfo}
          className="flex flex-col rounded-xl border border-border bg-surface"
        >
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Icon name="clients" className="size-4 text-muted" />
              Personal information
            </h2>

            <p className="mt-1 text-sm text-muted">
              Update contact details and account status.
            </p>
          </div>

          <div className="grid flex-1 content-start gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-1 2xl:grid-cols-2">
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
                required
                minLength={2}
                maxLength={100}
                value={personalInfoForm.fullName}
                onChange={(event) =>
                  setPersonalInfoForm((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
                className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <FilterSelect
              id="isActive"
              label="Account Status"
              labelClassName="mb-2 block text-sm font-medium"
              tone="background"
              value={personalInfoForm.isActive ? "active" : "inactive"}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              onChange={(value) =>
                setPersonalInfoForm((prev) => ({
                  ...prev,
                  isActive: value === "active",
                }))
              }
            />

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={personalInfoForm.email}
                onChange={(event) =>
                  setPersonalInfoForm((prev) => ({
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
                required
                minLength={6}
                maxLength={30}
                value={personalInfoForm.phoneNumber}
                onChange={(event) =>
                  setPersonalInfoForm((prev) => ({
                    ...prev,
                    phoneNumber: event.target.value,
                  }))
                }
                className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {(personalInfoError || personalInfoMessage) && (
            <div className="px-5 pb-4 sm:px-6">
              {personalInfoError && (
                <p role="alert" className="text-sm text-danger">
                  {personalInfoError}
                </p>
              )}

              {personalInfoMessage && (
                <p role="status" className="text-sm text-primary-hover">
                  {personalInfoMessage}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
            <button
              type="submit"
              disabled={isSavingPersonalInfo}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="check" className="size-4" />

              {isSavingPersonalInfo ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <form
          onSubmit={handleSubmitCredentials}
          className="flex flex-col rounded-xl border border-border bg-surface"
        >
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Icon name="edit" className="size-4 text-muted" />
              Client account
            </h2>

            <p className="mt-1 text-sm text-muted">
              Update the credentials used to sign in.
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
                value={credentialsForm.username}
                onChange={(event) =>
                  setCredentialsForm((prev) => ({
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
                Current Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentialsForm.password}
                onChange={(event) =>
                  setCredentialsForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="Enter current password"
                className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium"
              >
                New Password
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                value={credentialsForm.newPassword}
                onChange={(event) =>
                  setCredentialsForm((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="confirmNewPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm New Password
              </label>

              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                value={credentialsForm.confirmNewPassword}
                onChange={(event) =>
                  setCredentialsForm((prev) => ({
                    ...prev,
                    confirmNewPassword: event.target.value,
                  }))
                }
                placeholder="Confirm new password"
                className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {(credentialsError || credentialsMessage) && (
            <div className="px-5 pb-4 sm:px-6">
              {credentialsError && (
                <p role="alert" className="text-sm text-danger">
                  {credentialsError}
                </p>
              )}

              {credentialsMessage && (
                <p role="status" className="text-sm text-primary-hover">
                  {credentialsMessage}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
            <Link
              href={`/clients/${clientId}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSavingCredentials}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="check" className="size-4" />

              {isSavingCredentials ? "Saving..." : "Save Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
