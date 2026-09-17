"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";

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

function ClientsPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading clients">
      <PageHeader title="Clients" description="Loading your client roster..." />

      <section className="mb-4 grid animate-pulse grid-cols-1 gap-3 min-[401px]:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-24 rounded-md border border-border bg-surface p-4 dark:border-[#2C3238] dark:bg-[#1B1F24]"
          >
            <div className="h-4 w-24 rounded bg-border dark:bg-[#343B43]" />
            <div className="mt-5 h-7 w-10 rounded bg-border dark:bg-[#343B43]" />
          </div>
        ))}
      </section>

      <div className="mb-3 flex animate-pulse flex-col gap-2 min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
        <div className="w-full min-[761px]:max-w-sm">
          <div className="mb-2 h-4 w-24 rounded bg-border dark:bg-[#343B43]" />
          <div className="h-11 rounded-md bg-border dark:bg-[#343B43]" />
        </div>
        <div className="h-11 w-full rounded-md bg-border dark:bg-[#343B43] min-[761px]:w-32" />
      </div>

      <div className="mt-7 overflow-hidden rounded-md border border-border bg-surface dark:border-[#2C3238] dark:bg-[#1B1F24]">
        <div className="grid grid-cols-5 gap-4 bg-[#f3f7f4] px-4 py-3 dark:bg-[#20252A]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-4 w-16 animate-pulse rounded bg-border dark:bg-[#343B43]"
            />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-5 gap-4 border-t border-border px-4 py-5 dark:border-[#2C3238]"
          >
            {Array.from({ length: 5 }).map((_, column) => (
              <div
                key={column}
                className="h-4 animate-pulse rounded bg-border dark:bg-[#343B43]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getAllClients() {
    try {
      const response = await api.get(Endpoints.clients);
      setClients(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllClients();
  }, []);

  if (isLoading) {
    return <ClientsPageSkeleton />;
  }

  const activeClients = clients.filter((client) => client.isActive);
  const inactiveClients = clients.filter((client) => !client.isActive);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredClients = clients.filter((client) => {
    const matchesQuery =
      client.fullName.toLowerCase().includes(normalizedQuery) ||
      client.email?.toLowerCase().includes(normalizedQuery) ||
      client.phoneNumber.includes(normalizedQuery);

    return matchesQuery;
  });

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${clients.length} clients in your sample roster. Manage contact details and subscriptions.`}
      />

      <section
        className="mb-4 grid grid-cols-1 gap-3 min-[401px]:grid-cols-3"
        aria-label="Client summary"
      >
        <SummaryMetric label="Total Clients" value={clients.length} />
        <SummaryMetric label="Active Clients" value={activeClients.length} />
        <SummaryMetric
          label="Inactive Clients"
          value={inactiveClients.length}
        />
      </section>

      <section
        className="mb-3 flex flex-col gap-2 min-[761px]:flex-row min-[761px]:items-end"
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, or phone"
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary min-[761px]:max-w-sm"
          />
        </div>

        <Link
          href="/clients/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Add Client
        </Link>
      </section>

      <p className="mb-2 text-xs text-muted" aria-live="polite">
        Showing {filteredClients.length} of {clients.length} clients
      </p>

      <div
        className="w-full overflow-x-auto rounded-md border border-border bg-surface dark:border-[#2C3238] dark:bg-[#1B1F24]"
        role="region"
        aria-label="Clients table"
        tabIndex={0}
      >
        <table className="w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              {["Client", "Phone", "Status", "Created At", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="bg-[#f3f7f4] px-4 py-3 text-left align-middle text-sm font-semibold text-muted dark:bg-[#20252A]"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-border transition-colors hover:bg-hover focus-within:bg-hover dark:border-[#2C3238] dark:hover:bg-[#23292F] dark:focus-within:bg-[#23292F]"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.fullName} />
                      <div>
                        <span className="font-semibold">{client.fullName}</span>
                        <span className="mt-1 block text-xs text-muted">
                          {client.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-muted">
                    {client.phoneNumber}
                  </td>

                  <td className="px-4 py-3 align-middle  text-muted">
                    {client.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {client.createdAt.split("T")[0]}
                      </span>

                      <span className="mt-1 text-xs text-muted">
                        {client.createdAt.split("T")[1].split(".")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <Link
                        className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-hover"
                        href={`/clients/${client.id}`}
                        aria-label={`View ${client.fullName}`}
                      >
                        <Icon name="view" className="size-4" />
                        View
                      </Link>
                      <Link
                        className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-hover"
                        href={`/clients/${client.id}/edit`}
                        aria-label={`Edit ${client.fullName}`}
                      >
                        <Icon name="edit" className="size-4" />
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-border dark:border-[#2C3238]">
                <td className="px-4 py-8 text-center text-muted" colSpan={5}>
                  No clients match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
