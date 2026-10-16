"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Icon, { type IconName } from "@/components/Icon";
import ClientSummaryCard from "@/components/client-details/ClientSummaryCard";
import DailyActivityTab from "@/components/client-details/DailyActivityTab";
import ProgressTab from "@/components/client-details/ProgressTab";
import WeeklySchedule from "@/components/client-details/WeeklySchedule";
import type { Client, Payment } from "@/components/client-details/types";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";
import ClientDetailsLoading from "./loading";

type ActiveTab = "overview" | "progress" | "activity";

const tabs: { id: ActiveTab; label: string; icon?: IconName }[] = [
  { id: "overview", label: "Overview" },
  { id: "progress", label: "View Progress", icon: "dashboard" },
  { id: "activity", label: "Daily Activity", icon: "calendar" },
];

export default function ClientDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadClientDetails() {
      if (Number.isNaN(clientId)) {
        setError("Invalid client ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [clientResponse, paymentResponse] = await Promise.all([
          api.get<Client>(Endpoints.clientById(clientId)),
          api.get<PagedResponse<Payment>>(
            Endpoints.clientPayments(clientId, 1, 1),
          ),
        ]);

        if (ignore) {
          return;
        }

        setClient(clientResponse.data);
        setPayment(paymentResponse.data.items[0] ?? null);
      } catch (error) {
        console.error("Failed to load client details:", error);

        if (!ignore) {
          setError("Client details could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadClientDetails();

    return () => {
      ignore = true;
    };
  }, [clientId]);

  async function handleDeleteClient() {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await api.delete(Endpoints.clientById(clientId));
      router.push("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
      setDeleteError(
        getErrorMessage(error, "Client could not be deleted. Please try again."),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSetActive(isActive: boolean) {
    try {
      setIsStatusUpdating(true);
      setStatusError("");

      const response = await api.put<Client>(Endpoints.clientStatus(clientId), {
        isActive,
      });

      setClient(response.data);
      setIsDeactivateOpen(false);
    } catch (error) {
      console.error("Failed to update client status:", error);
      setStatusError(
        getErrorMessage(
          error,
          "Client status could not be updated. Please try again.",
        ),
      );
    } finally {
      setIsStatusUpdating(false);
    }
  }

  if (isLoading) {
    return <ClientDetailsLoading />;
  }

  if (error || !client) {
    return (
      <div>
        <BackLink href="/clients">Back to Clients</BackLink>

        <div
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
          role="alert"
        >
          {error || "Client could not be found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>

      <ClientSummaryCard
        client={client}
        payment={payment}
        isStatusUpdating={isStatusUpdating}
        onToggleActiveClick={() => {
          setStatusError("");

          if (client.isActive) {
            setIsDeactivateOpen(true);
          } else {
            void handleSetActive(true);
          }
        }}
        onDeleteClick={() => {
          setDeleteError("");
          setIsDeleteOpen(true);
        }}
      />

      {statusError && !isDeactivateOpen && (
        <div
          className="mb-5 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
          role="alert"
        >
          {statusError}
        </div>
      )}

      <nav
        aria-label="Client views"
        className="mb-5 flex flex-wrap gap-2"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="client-workspace-panel"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 font-medium transition-colors ${
              activeTab === tab.id
                ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
                : "text-muted hover:bg-hover"
            }`}
          >
            {tab.icon && <Icon name={tab.icon} className="size-4" />}
            {tab.label}
          </button>
        ))}
      </nav>

      <div id="client-workspace-panel" role="tabpanel" className="min-w-0">
        {activeTab === "overview" && <WeeklySchedule clientId={clientId} />}
        {activeTab === "progress" && <ProgressTab clientId={clientId} />}
        {activeTab === "activity" && <DailyActivityTab clientId={clientId} />}
      </div>

      <DeleteConfirmDialog
        open={isDeactivateOpen}
        title={`Deactivate ${client.fullName}?`}
        description="The client will no longer be able to log in or receive new plans. All payments, assigned plans and completion history are kept, and you can reactivate the client at any time."
        isDeleting={isStatusUpdating}
        error={statusError}
        confirmLabel="Deactivate"
        confirmingLabel="Deactivating..."
        confirmTone="primary"
        onCancel={() => {
          if (!isStatusUpdating) {
            setIsDeactivateOpen(false);
            setStatusError("");
          }
        }}
        onConfirm={() => {
          void handleSetActive(false);
        }}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        title={`Permanently delete ${client.fullName}?`}
        description="This cannot be undone. Permanent deletion is only possible for clients with no payments or assigned plans; otherwise use Deactivate, which keeps all history."
        requiredText={client.fullName}
        isDeleting={isDeleting}
        error={deleteError}
        confirmLabel="Delete permanently"
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
            setDeleteError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteClient();
        }}
      />
    </div>
  );
}
