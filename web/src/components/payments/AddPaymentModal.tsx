"use client";

import { useEffect, useState, type FormEvent } from "react";

import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { toDateKey } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";

type ClientOption = {
  id: number;
  fullName: string;
};

const MAX_AMOUNT = 99999999.99;

const inputClass =
  "min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

type AddPaymentModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

export default function AddPaymentModal({
  onClose,
  onCreated,
}: AddPaymentModalProps) {
  const [clientSearch, setClientSearch] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(() => toDateKey(new Date()));
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (selectedClient) return;

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
          setClientsError(
            getErrorMessage(error, "Clients could not be loaded."),
          );
        }
      } finally {
        if (!ignore) setIsLoadingClients(false);
      }
    }, 250);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [selectedClient, clientSearch]);

  function handleClose() {
    if (!isCreating) onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!selectedClient) {
      setCreateError("Select a client.");
      return;
    }
    if (
      !amount.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0.01
    ) {
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

      onCreated();
    } catch (error) {
      console.error("Failed to create payment:", error);
      setCreateError(getErrorMessage(error, "Payment could not be created."));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-payment-title"
        noValidate
        onSubmit={(event) => void handleSubmit(event)}
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
                    <p
                      role="status"
                      className="px-3 py-2 text-sm text-muted"
                    >
                      Loading clients...
                    </p>
                  ) : clientsError ? (
                    <p
                      role="alert"
                      className="px-3 py-2 text-sm text-danger"
                    >
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
            onClick={handleClose}
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

  );
}
