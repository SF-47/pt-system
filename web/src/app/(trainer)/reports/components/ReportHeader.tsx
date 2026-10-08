import Icon from "@/components/Icon";
import { formatDate } from "@/lib/format";

import type { ClientReport } from "../report-types";
import { generatedAtFormatter } from "../report-utils";

export default function ReportHeader({
  report,
  generatedAt,
}: {
  report: ClientReport;
  generatedAt: Date | null;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface px-4 py-3 print:break-inside-avoid print:rounded-none print:border-0 print:border-b print:border-border-strong print:px-0 print:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="hidden text-xs font-semibold tracking-wide text-muted uppercase print:block">
            PT System · Client Report
          </p>
          <h2 className="truncate text-lg font-semibold">
            {report.client.fullName}
          </h2>
          <p className="text-sm text-muted">
            {formatDate(report.period.startDate)} –{" "}
            {formatDate(report.period.endDate)}
            {generatedAt && (
              <> · Generated {generatedAtFormatter.format(generatedAt)}</>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-hover print:hidden"
        >
          <Icon name="print" className="size-4" />
          Print
        </button>
      </div>
    </section>
  );
}
