"use client";

import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";

import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";

import type { ClientOption } from "../report-types";

const inputClass =
  "min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

export default function ReportClientSelector({
  selectedClient,
  onSelect,
  onClear,
  disabled,
  hasError,
  inputRef,
  className,
}: {
  selectedClient: ClientOption | null;
  onSelect: (client: ClientOption) => void;
  onClear: () => void;
  disabled: boolean;
  hasError: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  className: string;
}) {
  const [clientSearch, setClientSearch] = useState("");
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);

  useEffect(() => {
    if (selectedClient || !isClientMenuOpen) return;

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
  }, [selectedClient, clientSearch, isClientMenuOpen]);

  function selectClient(option: ClientOption) {
    onSelect(option);
    setIsClientMenuOpen(false);
    setActiveOptionIndex(-1);
  }

  function handleClientKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (clientOptions.length === 0) return;
      event.preventDefault();
      setIsClientMenuOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveOptionIndex((current) => {
        if (current < 0) return step === 1 ? 0 : clientOptions.length - 1;
        return (current + step + clientOptions.length) % clientOptions.length;
      });
    } else if (
      event.key === "Enter" &&
      isClientMenuOpen &&
      activeOptionIndex >= 0
    ) {
      const option = clientOptions[activeOptionIndex];
      if (option) {
        event.preventDefault();
        selectClient(option);
      }
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsClientMenuOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsClientMenuOpen(false);
      }}
    >
      <label
        htmlFor="report-client-search"
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
            onClick={() => {
              onClear();
              setIsClientMenuOpen(true);
            }}
            disabled={disabled}
            className="shrink-0 text-sm font-medium text-primary-hover underline-offset-2 hover:underline disabled:opacity-60 dark:text-primary"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            id="report-client-search"
            name="clientSearch"
            type="search"
            role="combobox"
            aria-expanded={isClientMenuOpen}
            aria-controls="report-client-listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              isClientMenuOpen && activeOptionIndex >= 0
                ? `report-client-option-${clientOptions[activeOptionIndex]?.id}`
                : undefined
            }
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? "report-form-error" : undefined}
            value={clientSearch}
            onChange={(event) => {
              setClientSearch(event.target.value);
              setIsClientMenuOpen(true);
              setActiveOptionIndex(-1);
            }}
            onKeyDown={handleClientKeyDown}
            onFocus={() => setIsClientMenuOpen(true)}
            placeholder="Search clients by name…"
            autoComplete="off"
            className={inputClass}
          />
          {isClientMenuOpen && (
            <div
              className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-xl"
              onMouseDown={(event) => event.preventDefault()}
            >
              {isLoadingClients ? (
                <p role="status" className="px-3 py-2 text-sm text-muted">
                  Loading clients…
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
                <ul
                  id="report-client-listbox"
                  role="listbox"
                  aria-label="Clients"
                >
                  {clientOptions.map((option, index) => (
                    <li
                      key={option.id}
                      id={`report-client-option-${option.id}`}
                      role="option"
                      aria-selected={index === activeOptionIndex}
                      onClick={() => selectClient(option)}
                      className={`block min-h-9 w-full cursor-pointer truncate px-3 py-1.5 text-left text-sm hover:bg-hover ${index === activeOptionIndex ? "bg-hover" : ""}`}
                    >
                      {option.fullName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
