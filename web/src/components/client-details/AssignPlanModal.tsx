"use client";

import { useEffect, useState } from "react";

import Icon from "@/components/Icon";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { toDateKey } from "@/lib/format";
import type { PagedResponse } from "@/types/api";

type PlanOption = {
  id: number;
  name: string;
};

type AssignPlanModalProps = {
  title: string;
  planLabel: string;
  planIdField: "workoutPlanId" | "mealPlanId";
  optionsUrl: string;
  assignUrl: string;
  onClose: () => void;
  onAssigned: () => void;
};

// Used for both workout plans and meal plans. Mount it only while open so
// its state resets each time.
export default function AssignPlanModal({
  title,
  planLabel,
  planIdField,
  optionsUrl,
  assignUrl,
  onClose,
  onAssigned,
}: AssignPlanModalProps) {
  const lowerLabel = planLabel.toLowerCase();

  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [assignedDate, setAssignedDate] = useState(() => toDateKey(new Date()));
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadPlans() {
      try {
        setIsLoadingPlans(true);
        setError("");

        const response = await api.get<PagedResponse<PlanOption>>(optionsUrl);

        if (ignore) {
          return;
        }

        setPlans(response.data.items);
        setSelectedPlanId(
          response.data.items[0]?.id ? String(response.data.items[0].id) : "",
        );
      } catch (error) {
        console.error("Failed to load plans:", error);

        if (!ignore) {
          setError(getErrorMessage(error, `${planLabel}s could not be loaded.`));
        }
      } finally {
        if (!ignore) {
          setIsLoadingPlans(false);
        }
      }
    }

    void loadPlans();

    return () => {
      ignore = true;
    };
  }, [optionsUrl, planLabel, loadKey]);

  async function handleAssign() {
    if (!selectedPlanId || !assignedDate) {
      return;
    }

    try {
      setIsAssigning(true);
      setError("");

      await api.post(assignUrl, {
        [planIdField]: Number(selectedPlanId),
        assignedDate,
      });

      onAssigned();
    } catch (error) {
      console.error(`Failed to assign ${lowerLabel}:`, error);
      setError(
        getErrorMessage(
          error,
          `${planLabel} could not be assigned. Please try again.`,
        ),
      );
    } finally {
      setIsAssigning(false);
    }
  }

  const selectedPlanName = plans.find(
    (plan) => String(plan.id) === selectedPlanId,
  )?.name;

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted">
            Choose a {lowerLabel} and assignment date.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor={`${planIdField}-select`}
              className="mb-2 block text-sm font-medium"
            >
              {planLabel}
            </label>

            <div
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setIsDropdownOpen(false);
                }
              }}
            >
              <button
                type="button"
                id={`${planIdField}-select`}
                onClick={() => setIsDropdownOpen((open) => !open)}
                disabled={isLoadingPlans}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-busy={isLoadingPlans}
                className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3 text-left text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoadingPlans ? (
                  <span className="flex items-center gap-2 text-muted">
                    <span
                      aria-hidden="true"
                      className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary"
                    />
                    Loading {lowerLabel}s...
                  </span>
                ) : (
                  <span
                    className={`truncate ${selectedPlanName ? "" : "text-muted"}`}
                  >
                    {selectedPlanName ?? `Select a ${lowerLabel}`}
                  </span>
                )}
                <Icon
                  name="arrow"
                  className={`size-4 shrink-0 text-muted transition-transform ${
                    isDropdownOpen ? "-rotate-90" : "rotate-90"
                  }`}
                />
              </button>

              {isDropdownOpen && !isLoadingPlans && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                  <div className="border-b border-border p-2">
                    <input
                      type="text"
                      autoFocus
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={`Search ${lowerLabel}s...`}
                      className="min-h-9 w-full rounded-md border border-input-border bg-background px-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <ul
                    role="listbox"
                    className="max-h-[220px] overflow-y-auto py-1"
                  >
                    {filteredPlans.length > 0 ? (
                      filteredPlans.map((plan) => (
                        <li key={plan.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={String(plan.id) === selectedPlanId}
                            onClick={() => {
                              setSelectedPlanId(String(plan.id));
                              setSearch("");
                              setIsDropdownOpen(false);
                            }}
                            className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                              String(plan.id) === selectedPlanId
                                ? "bg-primary-soft font-medium text-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {plan.name}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-4 text-center text-sm text-muted">
                        No {lowerLabel}s found.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor={`${planIdField}-date`}
              className="mb-2 block text-sm font-medium"
            >
              Assigned Date
            </label>

            <input
              id={`${planIdField}-date`}
              type="date"
              value={assignedDate}
              onChange={(event) => setAssignedDate(event.target.value)}
              className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <div
              className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
              role="alert"
            >
              <span>{error}</span>
              {!isLoadingPlans && plans.length === 0 && (
                <button
                  type="button"
                  onClick={() => setLoadKey((key) => key + 1)}
                  className="shrink-0 font-medium underline underline-offset-2 hover:no-underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-hover"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleAssign()}
            disabled={
              !selectedPlanId || !assignedDate || isLoadingPlans || isAssigning
            }
            aria-busy={isAssigning}
            className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
