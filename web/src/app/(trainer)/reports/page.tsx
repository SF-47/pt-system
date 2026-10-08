"use client";

import { useRef, useState } from "react";

import PageHeader from "@/components/PageHeader";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";

import DailyActivityTable from "./components/DailyActivityTable";
import PaymentsSection from "./components/PaymentsSection";
import ReportEmptyState from "./components/ReportEmptyState";
import ReportForm from "./components/ReportForm";
import ReportHeader from "./components/ReportHeader";
import ReportSkeleton from "./components/ReportSkeleton";
import ReportSummary from "./components/ReportSummary";
import type {
  ClientOption,
  ClientReport,
  ReportFormError,
} from "./report-types";
import { validateReportInput } from "./report-utils";

export default function ReportsPage() {
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
    null,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState<ReportFormError | null>(null);
  const clientInputRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const [report, setReport] = useState<ClientReport | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [activityPage, setActivityPage] = useState(1);

  async function generateReport(clientId: number, start: string, end: string) {
    try {
      setIsGenerating(true);
      setGenerateError("");

      const response = await api.get<ClientReport>(
        Endpoints.clientReport(clientId, start, end),
      );

      setReport(response.data);
      setGeneratedAt(new Date());
      setExpandedDate(null);
      setActivityPage(1);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setReport(null);
      setGenerateError(
        getErrorMessage(error, "Report could not be generated."),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  // Shared by Generate and Retry. Returns the client when input is valid.
  function validateForm() {
    const error = validateReportInput(selectedClient, startDate, endDate);
    setFormError(error);
    if (error) {
      const refs = {
        client: clientInputRef,
        start: startDateRef,
        end: endDateRef,
      };
      refs[error.field].current?.focus();
      return null;
    }
    return selectedClient;
  }

  async function handleSubmit() {
    const client = validateForm();
    if (!client) return;

    setHasGenerated(true);
    await generateReport(client.id, startDate, endDate);
  }

  function handleRetry() {
    const client = validateForm();
    if (!client) return;

    void generateReport(client.id, startDate, endDate);
  }

  function handleClearClient() {
    setSelectedClient(null);
    setReport(null);
    setHasGenerated(false);
  }

  function toggleDay(date: string) {
    setExpandedDate((current) => (current === date ? null : date));
  }

  function changeActivityPage(page: number) {
    setActivityPage(page);
    setExpandedDate(null);
  }

  const isEmptyState = !hasGenerated && !isGenerating;

  return (
    <div>
      <div className="print:hidden">
        <PageHeader
          title="Reports"
          description="Generate a client report for a selected date range."
        />
      </div>

      <div
        className={
          isEmptyState ? "grid gap-3 lg:grid-cols-[3fr_2fr]" : undefined
        }
      >
        <ReportForm
          isEmptyState={isEmptyState}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
          onClearClient={handleClearClient}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          formError={formError}
          isGenerating={isGenerating}
          onSubmit={() => void handleSubmit()}
          clientInputRef={clientInputRef}
          startDateRef={startDateRef}
          endDateRef={endDateRef}
        />
        {isEmptyState && <ReportEmptyState />}
      </div>

      {isGenerating && <ReportSkeleton />}

      {!isGenerating && hasGenerated && generateError && (
        <div
          role="alert"
          className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger print:hidden"
        >
          <span>{generateError}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="min-h-9 rounded-md border border-danger/40 px-3 font-medium hover:bg-danger/10"
          >
            Retry
          </button>
        </div>
      )}

      {!isGenerating && !generateError && report && (
        <div className="mt-3 space-y-3 print:mt-0 print:space-y-2">
          <ReportHeader report={report} generatedAt={generatedAt} />
          <ReportSummary report={report} />
          <PaymentsSection payments={report.paymentSummary} />
          <DailyActivityTable
            activity={report.dailyActivity}
            page={activityPage}
            onPageChange={changeActivityPage}
            expandedDate={expandedDate}
            onToggleDay={toggleDay}
          />
        </div>
      )}
    </div>
  );
}
