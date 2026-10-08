import type { FormEvent, RefObject } from "react";

import { toDateKey } from "@/lib/format";

import type { ClientOption, ReportFormError } from "../report-types";
import ReportClientSelector from "./ReportClientSelector";

const inputClass =
  "min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary";

export default function ReportForm({
  isEmptyState,
  selectedClient,
  onSelectClient,
  onClearClient,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  formError,
  isGenerating,
  onSubmit,
  clientInputRef,
  startDateRef,
  endDateRef,
}: {
  isEmptyState: boolean;
  selectedClient: ClientOption | null;
  onSelectClient: (client: ClientOption) => void;
  onClearClient: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  formError: ReportFormError | null;
  isGenerating: boolean;
  onSubmit: () => void;
  clientInputRef: RefObject<HTMLInputElement | null>;
  startDateRef: RefObject<HTMLInputElement | null>;
  endDateRef: RefObject<HTMLInputElement | null>;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4 print:hidden">
      {isEmptyState && (
        <div className="mb-3">
          <h2 className="text-base font-semibold">Create Report</h2>
          <p className="text-sm text-muted">Select a client and date range.</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={
          isEmptyState
            ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
            : "flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end"
        }
      >
        <ReportClientSelector
          selectedClient={selectedClient}
          onSelect={onSelectClient}
          onClear={onClearClient}
          disabled={isGenerating}
          hasError={formError?.field === "client"}
          inputRef={clientInputRef}
          className={isEmptyState ? "sm:col-span-2" : "lg:min-w-56 lg:flex-1"}
        />

        <div
          className={
            isEmptyState
              ? "contents"
              : "grid grid-cols-2 gap-3 lg:flex lg:gap-3"
          }
        >
          <div className={isEmptyState ? undefined : "lg:w-36"}>
            <label
              htmlFor="report-start-date"
              className="mb-1 block text-sm font-medium"
            >
              Start date
            </label>
            <input
              ref={startDateRef}
              id="report-start-date"
              name="startDate"
              type="date"
              aria-invalid={formError?.field === "start" || undefined}
              aria-describedby={
                formError?.field === "start" ? "report-form-error" : undefined
              }
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => onStartDateChange(event.target.value)}
              className={inputClass}
            />
          </div>

          <div className={isEmptyState ? undefined : "lg:w-36"}>
            <label
              htmlFor="report-end-date"
              className="mb-1 block text-sm font-medium"
            >
              End date
            </label>
            <input
              ref={endDateRef}
              id="report-end-date"
              name="endDate"
              type="date"
              aria-invalid={formError?.field === "end" || undefined}
              aria-describedby={
                formError?.field === "end" ? "report-form-error" : undefined
              }
              value={endDate}
              min={startDate || undefined}
              max={toDateKey(new Date())}
              onChange={(event) => onEndDateChange(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className={isEmptyState ? "sm:col-span-2" : "lg:shrink-0"}>
          <button
            type="submit"
            disabled={isGenerating}
            aria-busy={isGenerating}
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 ${isEmptyState ? "" : "lg:w-auto"}`}
          >
            {isGenerating ? "Generating…" : "Generate Report"}
          </button>
        </div>
      </form>

      {formError && (
        <p
          id="report-form-error"
          role="alert"
          className="mt-3 text-sm text-danger"
        >
          {formError.message}
        </p>
      )}
    </section>
  );
}
