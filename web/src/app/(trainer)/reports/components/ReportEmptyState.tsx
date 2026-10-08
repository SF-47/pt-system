import Icon from "@/components/Icon";

const INCLUDED_ITEMS = [
  "Workout progress",
  "Meal progress",
  "Payments",
  "Daily activity",
];

export default function ReportEmptyState() {
  return (
    <section className="flex flex-col justify-center rounded-xl border border-dashed border-border bg-surface p-4 print:hidden">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon name="report" className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">No report generated yet</p>
          <p className="text-sm text-muted">
            Select a client and date range, then click Generate Report.
          </p>
        </div>
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          The report will include
        </p>
        <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted">
          {INCLUDED_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
