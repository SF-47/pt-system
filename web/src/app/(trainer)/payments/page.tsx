"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import type { PagedResponse } from "@/types/api";
import PaymentsLoading from "./loading";

type StatusFilter = "All" | "Paid" | "Pending";
type PaymentStatus = "Paid" | "Pending" | "Unknown";
type Payment = {
  id: number;
  clientName: string;
  amount: number;
  status: number;
  dueDate: string;
  paidAt: string | null;
};
type PaymentStats = {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getPaymentStatus(status: number): PaymentStatus {
  if (status === 0) return "Pending";
  if (status === 1) return "Paid";
  return "Unknown";
}

function PaymentsTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-surface"
      aria-label="Loading payment records"
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

export default function PaymentsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listError, setListError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [updatingPaymentId, setUpdatingPaymentId] = useState<number | null>(
    null,
  );
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function getPayments() {
      setIsFetching(true);
      setListError("");
      try {
        const response = await api.get<PagedResponse<Payment>>(
          Endpoints.payments(page, pageSize, query, statusFilter),
        );
        if (ignore) return;
        const resolvedPage = Math.min(
          response.data.page,
          Math.max(response.data.totalPages, 1),
        );
        setPayments(response.data.items);
        setPage(resolvedPage);
        setPageSize(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch {
        if (!ignore)
          setListError("Payments could not be loaded. Please try again.");
      } finally {
        if (!ignore) {
          setIsFetching(false);
          setIsInitialLoading(false);
        }
      }
    }

    void getPayments();
    return () => {
      ignore = true;
    };
  }, [page, pageSize, query, statusFilter]);

  useEffect(() => {
    let ignore = false;

    async function getPaymentStats() {
      try {
        const response = await api.get<PaymentStats>(Endpoints.paymentsStats);
        if (!ignore) setStats(response.data);
      } catch {
        if (!ignore) setStatsError("Payment totals are currently unavailable.");
      }
    }

    void getPaymentStats();
    return () => {
      ignore = true;
    };
  }, []);

  async function updatePaymentStatus(paymentId: number, status: number) {
    try {
      setUpdatingPaymentId(paymentId);
      setUpdateError("");

      await api.put(Endpoints.paymentStatus(paymentId), {
        status,
      });

      const [paymentsResponse, statsResponse] = await Promise.all([
        api.get<PagedResponse<Payment>>(
          Endpoints.payments(page, pageSize, query, statusFilter),
        ),
        api.get<PaymentStats>(Endpoints.paymentsStats),
      ]);

      const resolvedPage = Math.min(
        paymentsResponse.data.page,
        Math.max(paymentsResponse.data.totalPages, 1),
      );
      setPayments(paymentsResponse.data.items);
      setPage(resolvedPage);
      setPageSize(paymentsResponse.data.pageSize);
      setTotalPages(paymentsResponse.data.totalPages);
      setTotalCount(paymentsResponse.data.totalCount);
      setStats(statsResponse.data);
      setListError("");
      setStatsError("");
    } catch (error) {
      console.error("Failed to update payment status:", error);
      setUpdateError("Payment status could not be updated. Please try again.");
    } finally {
      setUpdatingPaymentId(null);
    }
  }

  if (isInitialLoading) return <PaymentsLoading />;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Review client payments, due dates, and paid or pending balances."
      />

      <section
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 [&>div:last-child>p:last-child]:text-warning"
        aria-label="Payment summary"
      >
        <SummaryMetric
          label="Paid amount"
          value={stats ? currencyFormatter.format(stats.totalPaidAmount) : "—"}
        />
        <SummaryMetric
          label="Pending amount"
          value={
            stats ? currencyFormatter.format(stats.totalPendingAmount) : "—"
          }
        />
      </section>

      {statsError && (
        <p className="mb-4 text-sm text-warning" role="status">
          {statsError}
        </p>
      )}

      <section
        className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between"
        aria-label="Payment tools"
      >
        <div className="min-w-0 sm:w-96">
          <label
            htmlFor="payment-search"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Search clients
          </label>
          <input
            id="payment-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Client name"
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>
        <div className="sm:w-44">
          <label
            htmlFor="payment-status-filter"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Payment status
          </label>
          <select
            id="payment-status-filter"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              setPage(1);
            }}
            className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </section>

      <p className="mb-2 text-sm text-muted" aria-live="polite">
        Payments · {payments.length} visible on this page · {totalCount} total
      </p>

      {updateError && (
        <p
          role="alert"
          className="mb-3 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          {updateError}
        </p>
      )}

      {listError ? (
        <div
          className="rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
          role="alert"
        >
          {listError}
        </div>
      ) : isFetching ? (
        <PaymentsTableSkeleton />
      ) : (
        <div
          className="w-full overflow-x-auto rounded-xl border border-border bg-surface"
          role="region"
          aria-label="Payments table"
          tabIndex={0}
        >
          <table className="workspace-table w-full min-w-180 table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[35%]" />
              <col className="w-[14%]" />
              <col className="w-[20%]" />
              <col className="w-[14%]" />
              <col className="w-[17%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-background">
                {[
                  ["Client", "text-left"],
                  ["Amount", "text-right"],
                  ["Due Date", "text-left"],
                  ["Status", "text-left"],
                  ["Action", "text-right"],
                ].map(([heading, alignment]) => (
                  <th
                    key={heading}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${alignment}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => {
                  const status = getPaymentStatus(payment.status);
                  return (
                    <tr
                      key={payment.id}
                      className={`border-b border-border last:border-b-0 transition-colors hover:bg-hover ${status === "Pending" ? "bg-warning-soft/20" : ""}`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={payment.clientName} />
                          <span className="truncate font-semibold text-foreground">
                            {payment.clientName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right align-middle font-semibold tabular-nums text-foreground">
                        {currencyFormatter.format(payment.amount)}
                      </td>
                      <td className="px-4 py-4 align-middle text-muted">
                        {new Date(payment.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-4 py-4 text-right align-middle">
                        {status === "Pending" ? (
                          <button
                            type="button"
                            disabled={updatingPaymentId === payment.id}
                            onClick={() =>
                              void updatePaymentStatus(payment.id, 1)
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingPaymentId === payment.id ? (
                              "Updating..."
                            ) : (
                              <>
                                <Icon name="check" className="size-4" />
                                Mark Paid
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingPaymentId === payment.id}
                            onClick={() => {
                              const confirmed = window.confirm(
                                "Are you sure you want to mark this payment as Pending?",
                              );

                              if (confirmed) {
                                void updatePaymentStatus(payment.id, 0);
                              }
                            }}
                            className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-hover hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingPaymentId === payment.id
                              ? "Updating..."
                              : "Mark Pending"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-0">
                    <EmptyState
                      icon="payment"
                      title="No matching payments"
                      description="Try another client name or payment status."
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
