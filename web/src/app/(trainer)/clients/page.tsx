"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import type { PagedResponse } from "@/types/api";
import ClientsLoading from "./loading";

type Client = {
  id: number;
  trainerId: number;
  fullName: string;
  username: string;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

type Stats = {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
};

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "Unknown date", time: "" };
  }

  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}

function formatPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length !== 8) return phoneNumber;

  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}

function ClientsTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-surface"
      aria-label="Loading client records"
      aria-busy="true"
    >
      <div className="grid min-w-190 grid-cols-5 gap-4 bg-background px-5 py-4">
        {[0, 1, 2, 3, 4].map((cell) => (
          <div
            key={cell}
            className="h-4 w-16 animate-pulse rounded bg-border"
          />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div
          key={row}
          className="grid min-w-190 grid-cols-5 gap-4 border-t border-border px-5 py-5"
        >
          {[0, 1, 2, 3, 4].map((cell) => (
            <div
              key={cell}
              className="h-5 w-4/5 animate-pulse rounded bg-border"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listError, setListError] = useState("");
  const [statsError, setStatsError] = useState("");

  const pageSize = 5;

  useEffect(() => {
    let ignore = false;

    async function getAllClients() {
      setIsFetching(true);
      setListError("");
      try {
        const response = await api.get<PagedResponse<Client>>(
          Endpoints.clients(page, pageSize, query),
        );
        if (ignore) return;
        setClients(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch {
        if (!ignore)
          setListError("Clients could not be loaded. Please try again.");
      } finally {
        if (!ignore) {
          setIsFetching(false);
          setIsInitialLoading(false);
        }
      }
    }

    void getAllClients();
    return () => {
      ignore = true;
    };
  }, [page, query]);

  useEffect(() => {
    let ignore = false;

    async function getClientStats() {
      try {
        const response = await api.get<Stats>(Endpoints.clientsStats);
        if (!ignore) setStats(response.data);
      } catch {
        if (!ignore) setStatsError("Client totals are currently unavailable.");
      }
    }

    void getClientStats();
    return () => {
      ignore = true;
    };
  }, []);

  if (isInitialLoading) {
    return <ClientsLoading />;
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${totalCount} clients. Manage profiles, contact details, and account status.`}
      >
        <Link
          href="/clients/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>

      <section
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-label="Client summary"
      >
        <SummaryMetric label="Total" value={stats?.totalClients ?? "—"} />
        <SummaryMetric label="Active" value={stats?.activeClients ?? "—"} />
        <SummaryMetric label="Inactive" value={stats?.inactiveClients ?? "—"} />
      </section>

      {statsError && (
        <p className="mb-4 text-sm text-warning" role="status">
          {statsError}
        </p>
      )}

      <section
        className="mb-5 flex flex-col gap-4 min-[761px]:flex-row min-[761px]:items-end"
        aria-label="Client tools"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="client-search"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Search clients
          </label>
          <input
            id="client-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email, or phone"
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary min-[761px]:max-w-sm"
          />
        </div>
      </section>

      <p className="mb-2 text-sm text-muted" aria-live="polite">
        Clients · {clients.length} visible on this page · {totalCount}{" "}
        total
      </p>

      {listError ? (
        <div
          className="rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
          role="alert"
        >
          {listError}
        </div>
      ) : isFetching ? (
        <ClientsTableSkeleton />
      ) : (
        <div
          className="w-full overflow-x-auto rounded-xl border border-border bg-surface dark:border-border dark:bg-surface"
          role="region"
          aria-label="Clients table"
          tabIndex={0}
        >
          <table className="w-full min-w-190 border-collapse whitespace-nowrap tabular-nums">
            <thead>
              <tr className="border-b border-border bg-background">
                {["Client", "Phone", "Status", "Created At", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className={`bg-background px-5 py-3 align-middle text-sm font-medium text-muted dark:bg-background ${heading === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => {
                  const createdAt = formatCreatedAt(client.createdAt);
                  return (
                    <tr
                      key={client.id}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-hover focus-within:bg-hover"
                    >
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar name={client.fullName} />
                          <div>
                            <span className="text-lg font-semibold">
                              {client.fullName}
                            </span>
                            <span className="mt-1 block text-sm text-muted">
                              {client.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle text-muted">
                        {formatPhoneNumber(client.phoneNumber)}
                      </td>

                      <td className="px-5 py-4 align-middle">
                        <StatusBadge
                          status={client.isActive ? "Active" : "Inactive"}
                        />
                      </td>
                      <td className="px-5 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {createdAt.date}
                          </span>

                          <span className="mt-1 text-sm text-muted">
                            {createdAt.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-hover"
                            href={`/clients/${client.id}`}
                            aria-label={`View ${client.fullName}`}
                          >
                            <Icon name="view" className="size-4" />
                            View
                          </Link>
                          <Link
                            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-sm text-foreground transition-colors hover:bg-hover"
                            href={`/clients/${client.id}/edit`}
                            aria-label={`Edit ${client.fullName}`}
                          >
                            <Icon name="edit" className="size-4" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-t border-border dark:border-border">
                  <td className="p-0" colSpan={5}>
                    <EmptyState
                      icon="clients"
                      title="No clients to display"
                      description="No clients match this page and search. Try another search or page."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        isLoading={isFetching}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
      />
    </div>
  );
}
