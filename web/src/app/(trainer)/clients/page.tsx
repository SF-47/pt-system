"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import SummaryMetric from "@/components/SummaryMetric";
import { clients } from "@/data/mock-data";

type PaymentFilter = "All" | "Paid" | "Pending";

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredClients = clients.filter((client) => {
    const matchesQuery =
      client.fullName.toLowerCase().includes(normalizedQuery) ||
      client.email.toLowerCase().includes(normalizedQuery) ||
      client.phoneNumber.includes(normalizedQuery);
    const matchesPayment =
      paymentFilter === "All" || client.paymentStatus === paymentFilter;

    return matchesQuery && matchesPayment;
  });
  const paidClients = clients.filter(
    (client) => client.paymentStatus === "Paid",
  );
  const pendingClients = clients.filter(
    (client) => client.paymentStatus === "Pending",
  );

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
        <SummaryMetric label="Paid Clients" value={paidClients.length} />
        <SummaryMetric
          label="Pending Payments"
          value={pendingClients.length}
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
        <div className="min-[761px]:w-44">
          <label
            htmlFor="client-payment-filter"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Payment status
          </label>
          <select
            id="client-payment-filter"
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value as PaymentFilter)
            }
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
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
              {["Client", "Phone", "Payment", "Actions"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="bg-[#f3f7f4] px-4 py-3 text-left align-middle text-sm font-semibold text-muted dark:bg-[#20252A]"
                >
                  {heading}
                </th>
              ))}
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
                  <td className="px-4 py-3 align-middle">
                    <StatusBadge status={client.paymentStatus} />
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
                <td className="px-4 py-8 text-center text-muted" colSpan={4}>
                  No clients match your search and payment filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
