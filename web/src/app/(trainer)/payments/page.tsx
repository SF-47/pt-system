"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import SummaryMetric from "@/components/SummaryMetric";
import { payments } from "@/data/mock-data";

type StatusFilter = "All" | "Paid" | "Pending";

export default function PaymentsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPayments = payments.filter((payment) => {
    const matchesQuery = payment.clientName
      .toLowerCase()
      .includes(normalizedQuery);
    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;

    return matchesQuery && matchesStatus;
  });
  const paidPayments = payments.filter((payment) => payment.status === "Paid");
  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending",
  );
  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Payment updates are not available yet."
      />

      <section
        className="mb-4 grid grid-cols-2 gap-3 min-[761px]:grid-cols-4"
        aria-label="Payment summary"
      >
        <SummaryMetric label="Total Payments" value={payments.length} />
        <SummaryMetric label="Paid" value={paidPayments.length} />
        <SummaryMetric label="Pending" value={pendingPayments.length} />
        <SummaryMetric label="Total Amount" value={`$${totalAmount}`} />
      </section>

      <section
        className="mb-3 flex flex-col gap-2 min-[761px]:flex-row min-[761px]:items-end"
        aria-label="Payment tools"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="payment-search"
            className="mb-1 block text-xs text-muted"
          >
            Search payments
          </label>
          <input
            id="payment-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Client name"
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary min-[761px]:max-w-sm"
          />
        </div>
        <div className="min-[761px]:w-44">
          <label
            htmlFor="payment-status-filter"
            className="mb-1 block text-xs text-muted"
          >
            Payment status
          </label>
          <select
            id="payment-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </section>

      <p className="mb-2 text-xs text-muted" aria-live="polite">
        Showing {filteredPayments.length} of {payments.length} payments
      </p>

      <div
        className="w-full overflow-x-auto rounded-md border border-border bg-surface dark:border-[#2C3238] dark:bg-[#1B1F24]"
        role="region"
        aria-label="Payments table"
        tabIndex={0}
      >
        <table className="w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              {["Client", "Amount", "Due Date", "Status", "Action"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className={`bg-[#f3f7f4] px-4 py-3 align-middle text-sm font-semibold text-muted dark:bg-[#20252A] ${
                      heading === "Amount" ? "text-right" : "text-left"
                    }`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-border transition-colors hover:bg-hover focus-within:bg-hover dark:border-[#2C3238] dark:hover:bg-[#23292F] dark:focus-within:bg-[#23292F]"
                >
                  <td className="px-4 py-3 align-middle font-medium">
                    {payment.clientName}
                  </td>
                  <td className="px-4 py-3 text-right align-middle font-medium">
                    ${payment.amount}
                  </td>
                  <td className="px-4 py-3 align-middle text-muted">
                    {payment.dueDate}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {payment.status === "Pending" ? (
                      <button
                        className="inline-flex min-h-9 cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-[13px] font-semibold text-muted"
                        disabled
                        title="Payment updates are not available yet"
                      >
                        <Icon name="check" className="size-4" />
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-muted" aria-label="No action available">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-border dark:border-[#2C3238]">
                <td className="px-4 py-8 text-center text-muted" colSpan={5}>
                  No payments match your search and status filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
