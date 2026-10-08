import type { DailyActivity } from "../report-types";
import { ACTIVITY_PAGE_SIZE } from "../report-utils";
import Pagination from "@/components/Pagination";
import ActivityDay from "./ActivityDay";

export default function DailyActivityTable({
  activity,
  page,
  onPageChange,
  expandedDate,
  onToggleDay,
}: {
  activity: DailyActivity[];
  page: number;
  onPageChange: (page: number) => void;
  expandedDate: string | null;
  onToggleDay: (date: string) => void;
}) {
  const firstIndex = (page - 1) * ACTIVITY_PAGE_SIZE;
  const lastIndex = page * ACTIVITY_PAGE_SIZE;
  const pairs: DailyActivity[][] = [];
  for (let i = 0; i < activity.length; i += 2) {
    pairs.push(activity.slice(i, i + 2));
  }

  return (
    <section className="rounded-xl border border-border bg-surface print:rounded-none print:border-0">
      <h2 className="px-4 pt-3 pb-2 text-lg font-semibold print:hidden">
        Daily Activity
      </h2>

      {activity.length === 0 ? (
        <p className="border-t border-border px-4 py-3 text-sm text-muted">
          No activity found for this period.
        </p>
      ) : (
        <table className="w-full border-t border-border text-base activity-table print:border-t-0 print:text-sm">
          <thead className="bg-background text-xs tracking-wide text-muted uppercase print:table-header-group">
            <tr className="hidden print:table-row">
              <th
                colSpan={2}
                className="pt-1 pb-1 pl-2 text-left text-base font-semibold tracking-normal text-foreground normal-case"
              >
                Daily Activity
              </th>
            </tr>
            <tr className="border-b border-border">
              {[0, 1].map((column) => (
                <th
                  key={column}
                  className={`w-1/2 p-1.5 font-semibold print:p-1`}
                >
                  <div className="flex gap-3 border border-transparent px-2 print:gap-2 print:px-1.5">
                    <span className="w-14 shrink-0 print:w-12">Date</span>
                    <span className="flex-1 text-left">Activity</span>
                    <span className="w-24 text-right print:w-20">Status</span>
                    <span className="w-6 shrink-0 print:hidden" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, pairIndex) => {
              const start = pairIndex * 2;
              const visible = start >= firstIndex && start < lastIndex;
              return (
                <tr
                  key={pair[0].date}
                  className={`print:break-inside-avoid ${visible ? "" : "hidden print:table-row"}`}
                >
                  {[0, 1].map((column) => {
                    const day = pair[column];
                    return (
                      <td
                        key={column}
                        className={`w-1/2 p-1.5 align-top print:p-1`}
                      >
                        {day && (
                          <ActivityDay
                            day={day}
                            expanded={expandedDate === day.date}
                            onToggle={() => onToggleDay(day.date)}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="hidden print:table-footer-group">
            <tr>
              <td colSpan={2} className="h-[8mm] p-0" />
            </tr>
          </tfoot>
        </table>
      )}

      {activity.length > ACTIVITY_PAGE_SIZE && (
        <div className="border-t border-border px-4 print:hidden">
          <p className="pt-3 text-sm text-muted tabular-nums">
            Showing {firstIndex + 1}–{Math.min(lastIndex, activity.length)} of{" "}
            {activity.length}
          </p>
          <Pagination
            page={page}
            totalPages={Math.ceil(activity.length / ACTIVITY_PAGE_SIZE)}
            onPrevious={() => onPageChange(page - 1)}
            onNext={() => onPageChange(page + 1)}
          />
        </div>
      )}
    </section>
  );
}
