import { getCompletionStatus } from "@/lib/format";

import type {
  ActivityItem,
  ClientOption,
  DailyMeal,
  ReportFormError,
} from "./report-types";

export const MAX_RANGE_DAYS = 365;
export const ACTIVITY_PAGE_SIZE = 12;

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export const generatedAtFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function getActivityStatus(item: ActivityItem) {
  return item.isMissed ? "Missed" : getCompletionStatus(item.status);
}

export function formatShortDate(value: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3]),
      )
    : new Date(value);
  return Number.isNaN(date.getTime()) ? value : shortDateFormatter.format(date);
}

export function getMealPlanName(meals: DailyMeal[]) {
  return Array.from(
    new Set(meals.map((meal) => meal.mealPlanName).filter(Boolean)),
  ).join(", ");
}

export function getMealSummaryText(meals: DailyMeal[]) {
  if (meals.length === 0) {
    return "No meals";
  }

  const total = meals.length;
  const counts = { Completed: 0, Pending: 0, Skipped: 0, Missed: 0 };

  meals.forEach((meal) => {
    counts[getActivityStatus(meal) as keyof typeof counts] += 1;
  });

  const parts = [`${counts.Completed}/${total} completed`];

  (["Skipped", "Missed", "Pending"] as const).forEach((label) => {
    if (counts[label] > 0) {
      parts.push(`${counts[label]} ${label.toLowerCase()}`);
    }
  });

  return parts.join(" · ");
}

export function validateReportInput(
  client: ClientOption | null,
  startDate: string,
  endDate: string,
): ReportFormError | null {
  if (!client) {
    return { message: "Select a client.", field: "client" };
  }
  if (!startDate || !endDate) {
    return {
      message: "Start date and end date are required.",
      field: !startDate ? "start" : "end",
    };
  }
  if (startDate > endDate) {
    return { message: "Start date cannot be after end date.", field: "start" };
  }
  const rangeDays = (Date.parse(endDate) - Date.parse(startDate)) / 86_400_000;
  if (rangeDays > MAX_RANGE_DAYS) {
    return {
      message: "Report date range cannot exceed 365 days.",
      field: "end",
    };
  }
  return null;
}
