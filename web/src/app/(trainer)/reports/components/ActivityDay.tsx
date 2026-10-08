import Icon from "@/components/Icon";
import ReportStatus from "./ReportStatus";

import type { DailyActivity } from "../report-types";
import {
  formatShortDate,
  getActivityStatus,
  getMealPlanName,
  getMealSummaryText,
} from "../report-utils";

export default function ActivityDay({
  day,
  expanded,
  onToggle,
}: {
  day: DailyActivity;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasMeals = day.meals.length > 0;
  const mealPlanName = getMealPlanName(day.meals);

  return (
    <div className="rounded-md border border-border print:break-inside-avoid">
      <div
        onClick={hasMeals ? onToggle : undefined}
        className={`flex items-start gap-3 rounded-md px-2 py-2 print:gap-2 print:px-1.5 print:py-1.5 ${hasMeals ? "cursor-pointer hover:bg-hover print:hover:bg-transparent" : ""}`}
      >
        <span className="w-14 shrink-0 text-base font-medium tabular-nums print:w-12 print:text-sm">
          {formatShortDate(day.date)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`min-w-0 text-base print:text-sm ${day.workout ? "font-medium" : "text-muted"}`}
            >
              {day.workout ? day.workout.name : "No workout"}
            </p>
            {day.workout ? (
              <ReportStatus status={getActivityStatus(day.workout)} />
            ) : (
              <span className="w-24 pr-1 text-right text-sm text-muted print:w-20">
                —
              </span>
            )}
          </div>
          <p className="text-sm text-muted print:text-xs">
            {mealPlanName && <>{mealPlanName} · </>}
            {getMealSummaryText(day.meals)}
          </p>
        </div>
        <div className="w-6 shrink-0 print:hidden">
          {hasMeals && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={`${expanded ? "Hide" : "Show"} meals for ${formatShortDate(day.date)}`}
              className="inline-flex size-6 items-center justify-center rounded text-muted"
            >
              <Icon
                name="arrow"
                className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {expanded && hasMeals && (
        <ul className="mx-2 mb-2 ml-[4.25rem] divide-y divide-border/50 print:hidden">
          {day.meals.map((meal) => (
            <li
              key={meal.mealStatusId}
              className="flex items-center justify-between gap-3 py-1 text-base"
            >
              <span className="min-w-0 flex-1 truncate">{meal.name}</span>
              <ReportStatus status={getActivityStatus(meal)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
