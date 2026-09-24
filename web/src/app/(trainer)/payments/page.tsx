"use client";

import { useEffect, useState, type FormEvent } from "react";
import Avatar from "@/components/Avatar";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";
import PaymentsLoading from "./loading";

type StatusFilter = "All" | "Paid" | "Pending";
type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Unknown";
type Payment = {
  id: number;
  clientName: string;
  amount: number;
  status: number;
  dueDate: string;
  paidAt: string | null;
};
type ClientOption = {
  id: number;
  fullName: string;
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

const MAX_AMOUNT = 99999999.99;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Tells the trainer which period the two summary cards cover.
function getPeriodLabel(month: number, year: number) {
  if (month && year) return `${monthNames[month - 1]} ${year}`;
  if (month) return `${monthNames[month - 1]}, all years`;
  if (year) return String(year);
  return "All time";
}

// Local calendar day; avoids toISOString(), which converts to UTC.
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Overdue is display-only: the stored status stays Pending.
function getPaymentStatus(payment: Payment): PaymentStatus {
  if (payment.status === 1) return "Paid";
  if (payment.status === 0) {
    return payment.dueDate.slice(0, 10) < toDateKey(new Date())
      ? "Overdue"
      : "Pending";
  }
  return "Unknown";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// PaidAt is stored as UTC but serialized without an offset; treat it as UTC
// so it converts to the trainer's local date.
function formatPaidAt(value: string) {
  return formatDate(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
}

const inputClass =
  "min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

// Custom listbox instead of a native <select> so the option list has a
// fixed max height and scrolls.
function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-surface px-3 text-left text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        >
          <span className="truncate">{selected?.label}</span>
          <Icon
            name="arrow"
            className={`size-4 shrink-0 text-muted transition-transform ${
              open ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>
        {open && (
          <ul
            role="listbox"
            aria-label={label}
            className="absolute z-10 mt-1 max-h-56 w-full min-w-36 overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-xl"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                    option.value === value
                      ? "bg-primary-soft font-medium text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PaymentsTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-surface"
      aria-label="Loading payment records"
      aria-busy="true"
    >
      <div className="grid min-w-190 grid-cols-6 gap-4 bg-background px-5 py-4">
        {[0, 1, 2, 3, 4, 5].map((cell) => (
          <div
            key={cell}
            className="h-4 w-16 animate-pulse rounded bg-border"
          />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div
          key={row}
          className="grid min-w-190 grid-cols-6 gap-4 border-t border-border px-5 py-5"
        >
          {[0, 1, 2, 3, 4, 5].map((cell) => (
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
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
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
  const [paymentToRevert, setPaymentToRevert] = useState<Payment | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const currentYear = new Date().getFullYear();
  // A few future years for payments scheduled ahead, newest first.
  const yearOptions = Array.from({ length: 9 }, (_, i) => currentYear + 4 - i);

  useEffect(() => {
    let ignore = false;

    async function getPayments() {
      setIsFetching(true);
      setListError("");
      try {
        const response = await api.get<PagedResponse<Payment>>(
          Endpoints.payments(page, pageSize, query, statusFilter, month, year),
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
  }, [page, pageSize, query, statusFilter, month, year]);

  useEffect(() => {
    let ignore = false;

    async function getPaymentStats() {
      setStatsError("");
      try {
        const response = await api.get<PaymentStats>(
          Endpoints.paymentsStatsFiltered("", "", month, year),
        );
        if (!ignore) setStats(response.data);
      } catch {
        if (!ignore) setStatsError("Payment totals are currently unavailable.");
      }
    }

    void getPaymentStats();
    return () => {
      ignore = true;
    };
  }, [month, year]);

  // Refetch the current page and totals without a skeleton flash or reload.
  async function refreshData() {
    const [paymentsResponse, statsResponse] = await Promise.all([
      api.get<PagedResponse<Payment>>(
        Endpoints.payments(page, pageSize, query, statusFilter, month, year),
      ),
      api.get<PaymentStats>(
        Endpoints.paymentsStatsFiltered("", "", month, year),
      ),
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
  }

  // Client picker: server-side search so it scales past one page of clients.
  useEffect(() => {
    if (!isAddOpen || selectedClient) return;

    let ignore = false;
    const timer = window.setTimeout(async () => {
      setIsLoadingClients(true);
      setClientsError("");
      try {
        const response = await api.get<PagedResponse<ClientOption>>(
          Endpoints.clients(1, 8, clientSearch.trim(), ""),
        );
        if (!ignore) setClientOptions(response.data.items);
      } catch (error) {
        console.error("Failed to load clients:", error);
        if (!ignore) {
          setClientsError(getErrorMessage(error, "Clients could not be loaded."));
        }
      } finally {
        if (!ignore) setIsLoadingClients(false);
      }
    }, 250);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [isAddOpen, selectedClient, clientSearch]);

  function openAddModal() {
    setClientSearch("");
    setClientOptions([]);
    setClientsError("");
    setSelectedClient(null);
    setAmount("");
    setDueDate(toDateKey(new Date()));
    setCreateError("");
    setIsAddOpen(true);
  }

  function closeAddModal() {
    if (!isCreating) setIsAddOpen(false);
  }

  async function createPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!selectedClient) {
      setCreateError("Select a client.");
      return;
    }
    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount < 0.01) {
      setCreateError("Amount must be greater than 0.");
      return;
    }
    if (parsedAmount > MAX_AMOUNT) {
      setCreateError("Amount is too large.");
      return;
    }
    if (!dueDate) {
      setCreateError("Due date is required.");
      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");

      await api.post(Endpoints.createClientPayment(selectedClient.id), {
        amount: parsedAmount,
        dueDate,
      });

      setIsAddOpen(false);
      setUpdateError("");
      try {
        await refreshData();
      } catch (error) {
        console.error("Failed to refresh payments:", error);
        setUpdateError("Payment was added, but the list could not be refreshed.");
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
      setCreateError(getErrorMessage(error, "Payment could not be created."));
    } finally {
      setIsCreating(false);
    }
  }

  async function updatePaymentStatus(paymentId: number, status: number) {
    try {
      setUpdatingPaymentId(paymentId);
      setUpdateError("");

      await api.put(Endpoints.paymentStatus(paymentId), {
        status,
      });

      await refreshData();
    } catch (error) {
      console.error("Failed to update payment status:", error);
      setUpdateError(
        getErrorMessage(
          error,
          "Payment status could not be updated. Please try again.",
        ),
      );
    } finally {
      setUpdatingPaymentId(null);
    }
  }

  async function confirmRevert() {
    if (!paymentToRevert) return;
    await updatePaymentStatus(paymentToRevert.id, 0);
    setPaymentToRevert(null);
  }

  if (isInitialLoading) return <PaymentsLoading />;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Review client payments, due dates, and paid or pending balances."
      >
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Add Payment
        </button>
      </PageHeader>

      <p className="mb-2 text-sm text-muted" aria-live="polite">
        Totals for{" "}
        <span className="font-semibold text-foreground">
          {getPeriodLabel(month, year)}
        </span>
      </p>

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
        className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_8rem_8rem_9rem]"
        aria-label="Payment tools"
      >
        <div className="col-span-2 min-w-0 sm:col-span-1">
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
            className={inputClass}
          />
        </div>
        <FilterSelect
          id="payment-month-filter"
          label="Month"
          value={month}
          options={[
            { value: 0, label: "All months" },
            ...monthNames.map((name, index) => ({
              value: index + 1,
              label: name,
            })),
          ]}
          onChange={(value) => {
            setMonth(value);
            setPage(1);
          }}
        />
        <FilterSelect
          id="payment-year-filter"
          label="Year"
          value={year}
          options={[
            { value: 0, label: "All years" },
            ...yearOptions.map((option) => ({
              value: option,
              label: String(option),
            })),
          ]}
          onChange={(value) => {
            setYear(value);
            setPage(1);
          }}
        />
        <div className="col-span-2 sm:col-span-1">
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
            className={inputClass}
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
              <col className="w-[25%]" />
              <col className="w-[13%]" />
              <col className="w-[15%]" />
              <col className="w-[13%]" />
              <col className="w-[15%]" />
              <col className="w-[19%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-background">
                {[
                  ["Client", "text-left"],
                  ["Amount", "text-right"],
                  ["Due Date", "text-left"],
                  ["Status", "text-left"],
                  ["Paid At", "text-left"],
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
                  const status = getPaymentStatus(payment);
                  return (
                    <tr
                      key={payment.id}
                      className={`border-b border-border last:border-b-0 transition-colors hover:bg-hover ${status === "Pending" ? "bg-warning-soft/20" : status === "Overdue" ? "bg-danger-soft/20" : ""}`}
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
                        {formatDate(payment.dueDate)}
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-4 py-4 align-middle text-muted">
                        {payment.paidAt ? formatPaidAt(payment.paidAt) : "—"}
                      </td>
                      <td className="px-4 py-4 text-right align-middle">
                        {payment.status === 0 ? (
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
                            onClick={() => setPaymentToRevert(payment)}
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
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      icon="payment"
                      title="No matching payments"
                      description="Try another client name, month, year, or payment status."
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

      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={closeAddModal}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-payment-title"
            noValidate
            onSubmit={(event) => void createPayment(event)}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl"
          >
            <h2 id="add-payment-title" className="text-lg font-semibold">
              Add Payment
            </h2>
            <p className="mt-1 mb-4 text-sm text-muted">
              New payments start as Pending.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="payment-client-search"
                  className="mb-1 block text-sm font-medium"
                >
                  Client
                </label>
                {selectedClient ? (
                  <div className="flex min-h-11 items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3">
                    <span className="truncate font-medium">
                      {selectedClient.fullName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedClient(null)}
                      disabled={isCreating}
                      className="shrink-0 text-sm font-medium text-primary-hover underline-offset-2 hover:underline disabled:opacity-60 dark:text-primary"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      id="payment-client-search"
                      type="search"
                      value={clientSearch}
                      onChange={(event) => setClientSearch(event.target.value)}
                      placeholder="Search clients by name"
                      autoComplete="off"
                      className={inputClass}
                    />
                    <div className="mt-2 max-h-44 overflow-y-auto rounded-md border border-border bg-background">
                      {isLoadingClients ? (
                        <p role="status" className="px-3 py-2 text-sm text-muted">
                          Loading clients...
                        </p>
                      ) : clientsError ? (
                        <p role="alert" className="px-3 py-2 text-sm text-danger">
                          {clientsError}
                        </p>
                      ) : clientOptions.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-muted">
                          No clients found.
                        </p>
                      ) : (
                        <ul>
                          {clientOptions.map((option) => (
                            <li key={option.id}>
                              <button
                                type="button"
                                onClick={() => setSelectedClient(option)}
                                className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-hover"
                              >
                                {option.fullName}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="payment-amount"
                    className="mb-1 block text-sm font-medium"
                  >
                    Amount
                  </label>
                  <input
                    id="payment-amount"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    max={MAX_AMOUNT}
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment-due-date"
                    className="mb-1 block text-sm font-medium"
                  >
                    Due date
                  </label>
                  <input
                    id="payment-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {createError && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {createError}
              </p>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={isCreating}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                aria-busy={isCreating}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? "Adding..." : "Add Payment"}
              </button>
            </div>
          </form>
        </div>
      )}

      <DeleteConfirmDialog
        open={paymentToRevert !== null}
        title="Mark payment as Pending?"
        itemName={
          paymentToRevert
            ? `${paymentToRevert.clientName} · ${currencyFormatter.format(paymentToRevert.amount)}`
            : undefined
        }
        description="The paid date will be cleared and the payment will count as pending again."
        confirmLabel="Mark Pending"
        confirmingLabel="Updating..."
        isDeleting={
          paymentToRevert !== null && updatingPaymentId === paymentToRevert.id
        }
        onCancel={() => setPaymentToRevert(null)}
        onConfirm={() => void confirmRevert()}
      />
    </div>
  );
}
