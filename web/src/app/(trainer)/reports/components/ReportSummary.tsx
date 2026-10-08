import type { ClientReport } from "../report-types";

export default function ReportSummary({ report }: { report: ClientReport }) {
  return (
    <section className="rounded-xl border border-border bg-surface print:break-inside-avoid print:rounded-none">
      <h2 className="px-4 pt-3 pb-2 text-lg font-semibold">Summary</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] text-base print:text-sm">
          <thead>
            <tr className="border-y border-border text-xs tracking-wide text-muted uppercase">
              <th className="px-4 py-2 text-left font-semibold">Type</th>
              {[
                "Total",
                "Completed",
                "Pending",
                "Skipped",
                "Missed",
                "Rate",
              ].map((label) => (
                <th
                  key={label}
                  className="px-3 py-2 print:py-1 text-right font-semibold"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Workouts", summary: report.workoutSummary },
              { label: "Meals", summary: report.mealSummary },
            ].map(({ label, summary }) => (
              <tr
                key={label}
                className="border-b border-border last:border-b-0"
              >
                <th className="px-4 py-2 print:py-1 text-left font-medium">
                  {label}
                </th>
                <td className="px-3 py-2 print:py-1 text-right text-lg font-semibold tabular-nums print:text-sm">
                  {summary.total}
                </td>
                <td className="px-3 py-2 print:py-1 text-right text-lg font-semibold tabular-nums print:text-sm text-primary-hover dark:text-primary">
                  {summary.completed}
                </td>
                <td className="px-3 py-2 print:py-1 text-right text-lg font-semibold tabular-nums print:text-sm text-warning">
                  {summary.pending}
                </td>
                <td className="px-3 py-2 print:py-1 text-right text-lg font-semibold tabular-nums print:text-sm text-muted">
                  {summary.skipped}
                </td>
                <td className="px-3 py-2 print:py-1 text-right text-lg font-semibold tabular-nums print:text-sm text-danger">
                  {summary.missed}
                </td>
                <td className="px-3 py-2 print:py-1 text-right text-lg font-bold tabular-nums print:text-sm">
                  {summary.completionRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
