"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

import BackLink from "@/components/BackLink";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";

import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { PagedResponse } from "@/types/api";
import ClientDetailsLoading from "./loading";

type Client = {
  id: number;
  fullName: string;
  username: string;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

type AssignedWorkoutPlan = {
  id: number;
  workoutPlanId: number;
  workoutPlanName: string;
  exerciseCount: number;
  assignedDate: string;
  status: number;
  completedAt: string | null;
};

type AssignedMealPlan = {
  id: number;
  mealPlanId: number;
  mealPlanName: string;
  mealCount: number;
  assignedDate: string;
};

type Payment = {
  id: number;
  clientName: string;
  amount: number;
  status: number;
  dueDate: string;
  paidAt: string | null;
};

type WorkoutPlanOption = {
  id: number;
  name: string;
};

type MealPlanOption = {
  id: number;
  name: string;
};

type ActiveTab = "overview" | "progress" | "activity";

type ClientProgress = {
  totalWorkouts: number;
  completedWorkouts: number;
  pendingWorkouts: number;
  skippedWorkouts: number;
  missedWorkouts: number;
  workoutCompletionRate: number;
  totalMeals: number;
  completedMeals: number;
  pendingMeals: number;
  skippedMeals: number;
  missedMeals: number;
  mealCompletionRate: number;
};

type DailyActivityItem = {
  status: number;
  isMissed: boolean;
  completedAt: string | null;
};

type DailyActivityWorkout = DailyActivityItem & {
  assignmentId: number;
  workoutPlanId: number;
  workoutPlanName: string;
};

type DailyActivityMeal = DailyActivityItem & {
  mealStatusId: number;
  mealId: number;
  mealName: string;
};

type DailyActivity = {
  date: string;
  workout: DailyActivityWorkout | null;
  meals: DailyActivityMeal[];
};

type ProgressPeriod = "7d" | "30d" | "all";

const progressPeriodOptions: { value: ProgressPeriod; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

// Ranges are inclusive of today, so "last 7 days" starts 6 days back.
function getProgressRange(period: ProgressPeriod) {
  if (period === "all") {
    return {};
  }

  const days = period === "7d" ? 7 : 30;
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - (days - 1),
  );

  return { startDate: toDateKey(start), endDate: toDateKey(today) };
}

function getActivityStatus(item: DailyActivityItem) {
  return item.isMissed ? "Missed" : getWorkoutStatus(item.status);
}

const completedTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function formatCompletedTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `Completed at ${completedTimeFormatter.format(date)}`;
}

const progressRateFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Local calendar-day helpers. Deliberately avoid toISOString(), which
// converts to UTC and can shift the calendar day depending on the
// trainer's timezone.
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Assignment dates come back from the API as ISO strings; the calendar
// day is always the first 10 characters regardless of any time/offset
// suffix, so compare on that instead of constructing a Date.
function assignedDateKey(value: string) {
  return value.slice(0, 10);
}

function getWeekStart(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfWeek = start.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + diffToMonday);
  return start;
}

function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
}

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function getWorkoutStatus(status: number) {
  if (status === 1) {
    return "Completed";
  }

  if (status === 2) {
    return "Skipped";
  }

  return "Pending";
}

function getPaymentStatus(status: number) {
  if (status === 1) {
    return "Paid";
  }

  return "Pending";
}

// Weekly schedule workout cards indicate status through background/border
// tone instead of a separate visible status label. Same semantic colors
// as StatusBadge: primary (green) for completed, warning for pending,
// neutral gray for skipped.
function getWorkoutCardTone(status: number) {
  if (status === 1) {
    return "border-primary/40 bg-primary-soft hover:bg-primary-soft/70";
  }

  if (status === 2) {
    return "border-border-strong bg-background hover:bg-hover";
  }

  return "border-warning/40 bg-warning-soft hover:bg-warning-soft/70";
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProgressCard({
  title,
  rate,
  total,
  totalLabel,
  completed,
  pending,
  skipped,
  missed,
}: {
  title: string;
  rate: number;
  total: number;
  totalLabel: string;
  completed: number;
  pending: number;
  skipped: number;
  missed: number;
}) {
  const stats = [
    { label: "Completed", value: completed, tone: "text-primary-hover dark:text-primary" },
    { label: "Pending", value: pending, tone: "text-warning" },
    { label: "Skipped", value: skipped, tone: "text-muted" },
    { label: "Missed", value: missed, tone: "text-danger" },
  ];

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-3xl leading-none font-semibold tracking-tight tabular-nums">
        {progressRateFormatter.format(rate)}%
      </p>
      <p className="mt-1 text-xs text-muted">Completion rate</p>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-hover"
        role="progressbar"
        aria-label={`${title} completion rate`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(rate)}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(Math.max(rate, 0), 100)}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-5">
        <div>
          <dd className="text-lg font-semibold tabular-nums">{total}</dd>
          <dt className="text-xs text-muted">{totalLabel}</dt>
        </div>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className={`text-lg font-semibold tabular-nums ${stat.tone}`}>
              {stat.value}
            </dd>
            <dt className="text-xs text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading progress"
      className="grid gap-4 lg:grid-cols-2"
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-lg border border-border bg-background"
        />
      ))}
    </div>
  );
}

export default function ClientDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);

  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [weeklyWorkoutAssignments, setWeeklyWorkoutAssignments] = useState<
    AssignedWorkoutPlan[]
  >([]);
  const [weeklyMealAssignments, setWeeklyMealAssignments] = useState<
    AssignedMealPlan[]
  >([]);
  const [isWeekLoading, setIsWeekLoading] = useState(true);
  const [weekError, setWeekError] = useState("");
  const [weekRefreshKey, setWeekRefreshKey] = useState(0);

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activityDate, setActivityDate] = useState(() =>
    toDateKey(new Date()),
  );
  const [activityData, setActivityData] = useState<DailyActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);

  const [progress, setProgress] = useState<ClientProgress | null>(null);
  const [progressPeriod, setProgressPeriod] = useState<ProgressPeriod>("30d");
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [progressRefreshKey, setProgressRefreshKey] = useState(0);

  const [payment, setPayment] = useState<Payment | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false);

  const [availableWorkoutPlans, setAvailableWorkoutPlans] = useState<
    WorkoutPlanOption[]
  >([]);

  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState("");
  const [isLoadingWorkoutPlanOptions, setIsLoadingWorkoutPlanOptions] =
    useState(false);

  const [workoutPlanSearch, setWorkoutPlanSearch] = useState("");
  const [isWorkoutPlanDropdownOpen, setIsWorkoutPlanDropdownOpen] =
    useState(false);

  const [assignedWorkoutDate, setAssignedWorkoutDate] = useState("");

  const [isAssigningWorkout, setIsAssigningWorkout] = useState(false);

  const [assignWorkoutError, setAssignWorkoutError] = useState("");

  const [isAssignMealOpen, setIsAssignMealOpen] = useState(false);

  const [availableMealPlans, setAvailableMealPlans] = useState<
    MealPlanOption[]
  >([]);

  const [selectedMealPlanId, setSelectedMealPlanId] = useState("");
  const [isLoadingMealPlanOptions, setIsLoadingMealPlanOptions] =
    useState(false);

  const [mealPlanSearch, setMealPlanSearch] = useState("");
  const [isMealPlanDropdownOpen, setIsMealPlanDropdownOpen] = useState(false);

  const [assignedMealDate, setAssignedMealDate] = useState("");

  const [isAssigningMeal, setIsAssigningMeal] = useState(false);

  const [assignMealError, setAssignMealError] = useState("");

  const [workoutAssignmentToDelete, setWorkoutAssignmentToDelete] = useState<{
    id: number;
    name: string;
    dateLabel: string;
  } | null>(null);
  const [deletingWorkoutAssignmentId, setDeletingWorkoutAssignmentId] =
    useState<number | null>(null);
  const [deleteWorkoutAssignmentError, setDeleteWorkoutAssignmentError] =
    useState("");

  const [mealAssignmentToDelete, setMealAssignmentToDelete] = useState<{
    id: number;
    name: string;
    dateLabel: string;
  } | null>(null);
  const [deletingMealAssignmentId, setDeletingMealAssignmentId] = useState<
    number | null
  >(null);
  const [deleteMealAssignmentError, setDeleteMealAssignmentError] =
    useState("");

  useEffect(() => {
    let ignore = false;

    async function loadClientDetails() {
      if (Number.isNaN(clientId)) {
        setError("Invalid client ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [clientResponse, paymentResponse] = await Promise.all([
          api.get<Client>(Endpoints.clientById(clientId)),

          api.get<PagedResponse<Payment>>(
            Endpoints.clientPayments(clientId, 1, 1),
          ),
        ]);

        if (ignore) {
          return;
        }

        setClient(clientResponse.data);
        setPayment(paymentResponse.data.items[0] ?? null);
      } catch (error) {
        console.error("Failed to load client details:", error);

        if (!ignore) {
          setError("Client details could not be loaded. Please try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadClientDetails();

    return () => {
      ignore = true;
    };
  }, [clientId]);

  // Separated from client/payment loading so changing the visible week
  // only refetches the weekly schedule, not the whole profile.
  const weekStart = getWeekStart(currentWeekDate);
  const weekDates = getWeekDates(weekStart);
  const weekStartKey = toDateKey(weekStart);
  const weekEndKey = toDateKey(weekDates[6]);

  useEffect(() => {
    let ignore = false;

    async function loadWeeklySchedule() {
      if (Number.isNaN(clientId)) {
        return;
      }

      try {
        setIsWeekLoading(true);
        setWeekError("");

        const [workoutResponse, mealResponse] = await Promise.all([
          api.get<PagedResponse<AssignedWorkoutPlan>>(
            Endpoints.clientWorkoutPlans(
              clientId,
              1,
              50,
              weekStartKey,
              weekEndKey,
            ),
          ),

          api.get<PagedResponse<AssignedMealPlan>>(
            Endpoints.clientMealPlans(
              clientId,
              1,
              50,
              weekStartKey,
              weekEndKey,
            ),
          ),
        ]);

        if (ignore) {
          return;
        }

        setWeeklyWorkoutAssignments(workoutResponse.data.items);
        setWeeklyMealAssignments(mealResponse.data.items);
      } catch (error) {
        console.error("Failed to load weekly schedule:", error);

        if (!ignore) {
          setWeekError(
            "Weekly schedule could not be loaded. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setIsWeekLoading(false);
        }
      }
    }

    void loadWeeklySchedule();

    return () => {
      ignore = true;
    };
  }, [clientId, weekStartKey, weekEndKey, weekRefreshKey]);

  // Own request/state so the period filter only refetches progress, not
  // the whole client profile. Loads when the Progress tab is opened.
  useEffect(() => {
    if (activeTab !== "progress" || Number.isNaN(clientId)) {
      return;
    }

    let ignore = false;

    async function loadProgress() {
      try {
        setIsProgressLoading(true);
        setProgressError("");
        setProgress(null);

        const { startDate, endDate } = getProgressRange(progressPeriod);
        const response = await api.get<ClientProgress>(
          Endpoints.clientProgress(clientId, startDate, endDate),
        );

        if (!ignore) {
          setProgress(response.data);
        }
      } catch (error) {
        console.error("Failed to load client progress:", error);

        if (!ignore) {
          setProgressError(
            getErrorMessage(error, "Progress could not be loaded."),
          );
        }
      } finally {
        if (!ignore) {
          setIsProgressLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      ignore = true;
    };
  }, [activeTab, clientId, progressPeriod, progressRefreshKey]);

  // Own request/state: changing the date only refetches that day's
  // activity. Loads when the Daily Activity tab is opened.
  useEffect(() => {
    if (activeTab !== "activity" || Number.isNaN(clientId) || !activityDate) {
      return;
    }

    let ignore = false;

    async function loadActivity() {
      try {
        setActivityLoading(true);
        setActivityError("");
        setActivityData(null);

        const response = await api.get<DailyActivity>(
          Endpoints.clientDailyActivity(clientId, activityDate),
        );

        if (!ignore) {
          setActivityData(response.data);
        }
      } catch (error) {
        console.error("Failed to load daily activity:", error);

        if (!ignore) {
          setActivityError(
            getErrorMessage(error, "Daily activity could not be loaded."),
          );
        }
      } finally {
        if (!ignore) {
          setActivityLoading(false);
        }
      }
    }

    void loadActivity();

    return () => {
      ignore = true;
    };
  }, [activeTab, clientId, activityDate, activityRefreshKey]);

  function openAssignWorkoutModal() {
    // Open immediately with the modal's own loading state; don't make the
    // button wait on the plan-library request.
    setAssignWorkoutError("");
    setWorkoutPlanSearch("");
    setIsWorkoutPlanDropdownOpen(false);
    setAvailableWorkoutPlans([]);
    setSelectedWorkoutPlanId("");
    setAssignedWorkoutDate(toDateKey(new Date()));
    setIsAssignWorkoutOpen(true);

    void loadWorkoutPlanOptions();
  }

  async function loadWorkoutPlanOptions() {
    try {
      setIsLoadingWorkoutPlanOptions(true);
      setAssignWorkoutError("");

      const response = await api.get<PagedResponse<WorkoutPlanOption>>(
        Endpoints.workoutPlans(1, 50),
      );

      setAvailableWorkoutPlans(response.data.items);

      setSelectedWorkoutPlanId(
        response.data.items[0]?.id ? String(response.data.items[0].id) : "",
      );
    } catch (error) {
      console.error("Failed to load workout plans:", error);
      setAssignWorkoutError(getErrorMessage(error, "Workout plans could not be loaded."));
    } finally {
      setIsLoadingWorkoutPlanOptions(false);
    }
  }

  async function handleAssignWorkout() {
    if (!selectedWorkoutPlanId || !assignedWorkoutDate) {
      return;
    }

    try {
      setIsAssigningWorkout(true);
      setAssignWorkoutError("");

      await api.post(Endpoints.clientWorkoutPlansBase(clientId), {
        workoutPlanId: Number(selectedWorkoutPlanId),
        assignedDate: assignedWorkoutDate,
      });

      setWeekRefreshKey((current) => current + 1);

      setIsAssignWorkoutOpen(false);
      setWorkoutPlanSearch("");
      setIsWorkoutPlanDropdownOpen(false);
    } catch (error) {
      console.error("Failed to assign workout plan:", error);
      setAssignWorkoutError(
        getErrorMessage(
          error,
          "Workout plan could not be assigned. Please try again.",
        ),
      );
    } finally {
      setIsAssigningWorkout(false);
    }
  }

  function openAssignMealModal() {
    // Open immediately with the modal's own loading state; don't make the
    // button wait on the plan-library request.
    setAssignMealError("");
    setMealPlanSearch("");
    setIsMealPlanDropdownOpen(false);
    setAvailableMealPlans([]);
    setSelectedMealPlanId("");
    setAssignedMealDate(toDateKey(new Date()));
    setIsAssignMealOpen(true);

    void loadMealPlanOptions();
  }

  async function loadMealPlanOptions() {
    try {
      setIsLoadingMealPlanOptions(true);
      setAssignMealError("");

      const response = await api.get<PagedResponse<MealPlanOption>>(
        Endpoints.mealPlans(1, 50),
      );

      setAvailableMealPlans(response.data.items);

      setSelectedMealPlanId(
        response.data.items[0]?.id ? String(response.data.items[0].id) : "",
      );
    } catch (error) {
      console.error("Failed to load meal plans:", error);
      setAssignMealError(getErrorMessage(error, "Meal plans could not be loaded."));
    } finally {
      setIsLoadingMealPlanOptions(false);
    }
  }

  async function handleAssignMeal() {
    if (!selectedMealPlanId || !assignedMealDate) {
      return;
    }

    try {
      setIsAssigningMeal(true);
      setAssignMealError("");

      await api.post(Endpoints.clientMealPlansBase(clientId), {
        mealPlanId: Number(selectedMealPlanId),
        assignedDate: assignedMealDate,
      });

      setWeekRefreshKey((current) => current + 1);

      setIsAssignMealOpen(false);
      setMealPlanSearch("");
      setIsMealPlanDropdownOpen(false);
    } catch (error) {
      console.error("Failed to assign meal plan:", error);
      setAssignMealError(
        getErrorMessage(
          error,
          "Meal plan could not be assigned. Please try again.",
        ),
      );
    } finally {
      setIsAssigningMeal(false);
    }
  }

  async function handleDeleteWorkoutAssignment() {
    if (!workoutAssignmentToDelete) {
      return;
    }

    const assignmentId = workoutAssignmentToDelete.id;

    try {
      setDeletingWorkoutAssignmentId(assignmentId);
      setDeleteWorkoutAssignmentError("");

      await api.delete(Endpoints.clientWorkoutPlanById(assignmentId));

      // Refresh only the weekly schedule, not the whole page.
      setWeekRefreshKey((current) => current + 1);
      setWorkoutAssignmentToDelete(null);
    } catch (error) {
      console.error("Failed to remove workout assignment:", error);
      setDeleteWorkoutAssignmentError(
        getErrorMessage(error, "Workout could not be removed. Please try again."),
      );
    } finally {
      setDeletingWorkoutAssignmentId(null);
    }
  }

  async function handleDeleteMealAssignment() {
    if (!mealAssignmentToDelete) {
      return;
    }

    const assignmentId = mealAssignmentToDelete.id;

    try {
      setDeletingMealAssignmentId(assignmentId);
      setDeleteMealAssignmentError("");

      await api.delete(Endpoints.clientMealPlanById(assignmentId));

      // Refresh only the weekly schedule, not the whole page.
      setWeekRefreshKey((current) => current + 1);
      setMealAssignmentToDelete(null);
    } catch (error) {
      console.error("Failed to remove meal assignment:", error);
      setDeleteMealAssignmentError(
        getErrorMessage(error, "Meal plan could not be removed. Please try again."),
      );
    } finally {
      setDeletingMealAssignmentId(null);
    }
  }

  async function handleDeleteClient() {
    try {
      setIsDeleting(true);
      setDeleteError("");

      await api.delete(Endpoints.clientById(clientId));
      router.push("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
      setDeleteError("Client could not be deleted. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <ClientDetailsLoading />;
  }

  if (error || !client) {
    return (
      <div>
        <BackLink href="/clients">Back to Clients</BackLink>

        <div
          className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger"
          role="alert"
        >
          {error || "Client could not be found."}
        </div>
      </div>
    );
  }

  const selectedWorkoutPlanName = availableWorkoutPlans.find(
    (plan) => String(plan.id) === selectedWorkoutPlanId,
  )?.name;

  const filteredWorkoutPlans = availableWorkoutPlans.filter((plan) =>
    plan.name.toLowerCase().includes(workoutPlanSearch.trim().toLowerCase()),
  );

  const selectedMealPlanName = availableMealPlans.find(
    (plan) => String(plan.id) === selectedMealPlanId,
  )?.name;

  const filteredMealPlans = availableMealPlans.filter((plan) =>
    plan.name.toLowerCase().includes(mealPlanSearch.trim().toLowerCase()),
  );

  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>

      {/* Client Header */}
      <div className="mb-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
          {/* Identity */}
          <div className="flex min-w-0 items-center gap-4 [&>span]:size-14 [&>span]:text-lg sm:[&>span]:size-16">
            <Avatar name={client.fullName} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold wrap-anywhere sm:text-2xl">
                  {client.fullName}
                </h1>
                <StatusBadge status={client.isActive ? "Active" : "Inactive"} />
              </div>
              <p className="mt-1 text-sm text-muted wrap-anywhere">
                {client.email ?? "No email provided"}
              </p>
            </div>
          </div>

          {/* Contact / account info */}
          <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm lg:grid-cols-1 lg:border-x lg:border-border lg:px-5">
            <div>
              <dt className="text-xs text-muted">Username</dt>
              <dd className="mt-0.5 font-medium wrap-anywhere">
                {client.username}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Phone</dt>
              <dd className="mt-0.5 font-medium tabular-nums">
                {client.phoneNumber}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Client since</dt>
              <dd className="mt-0.5 font-medium">
                {formatDate(client.createdAt)}
              </dd>
            </div>
          </dl>

          {/* Payment + actions */}
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="w-full">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase lg:text-right">
                Payment
              </p>

              {payment ? (
                <div className="mt-1.5 lg:text-right">
                  <div className="flex items-center gap-2 lg:flex-row-reverse">
                    <StatusBadge status={getPaymentStatus(payment.status)} />
                    <p className="text-lg font-semibold text-foreground tabular-nums">
                      {currencyFormatter.format(payment.amount)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Due {formatDate(payment.dueDate)}
                    {payment.paidAt && ` · Paid ${formatDate(payment.paidAt)}`}
                  </p>
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-muted lg:text-right">
                  No payment information available.
                </p>
              )}
            </div>

            <div className="flex w-full flex-wrap gap-2 border-t border-border pt-3 lg:justify-end">
              <Link
                href={`/clients/${client.id}/edit`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium transition-colors hover:bg-hover"
              >
                <Icon name="edit" className="size-4" />
                Edit Client
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setIsDeleteOpen(true);
                }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-danger/40 bg-surface px-3 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
              >
                <Icon name="close" className="size-4" />
                Delete Client
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Client workspace tabs */}
      <nav
        aria-label="Client views"
        className="mb-5 flex flex-wrap gap-2"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          aria-controls="client-workspace-panel"
          onClick={() => setActiveTab("overview")}
          className={`inline-flex min-h-11 items-center rounded-md px-4 font-medium transition-colors ${
            activeTab === "overview"
              ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
              : "text-muted hover:bg-hover"
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "progress"}
          aria-controls="client-workspace-panel"
          onClick={() => setActiveTab("progress")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 font-medium transition-colors ${
            activeTab === "progress"
              ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
              : "text-muted hover:bg-hover"
          }`}
        >
          <Icon name="dashboard" className="size-4" />
          View Progress
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "activity"}
          aria-controls="client-workspace-panel"
          onClick={() => setActiveTab("activity")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 font-medium transition-colors ${
            activeTab === "activity"
              ? "border border-primary bg-primary-soft text-primary-hover dark:text-foreground"
              : "text-muted hover:bg-hover"
          }`}
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </button>
      </nav>

      <div id="client-workspace-panel" role="tabpanel" className="min-w-0">
        {activeTab === "overview" && (
          <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                <p className="mt-0.5 text-sm font-medium text-muted tabular-nums">
                  {shortDateFormatter.format(weekDates[0])} –{" "}
                  {shortDateFormatter.format(weekDates[6])}
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className="flex items-center rounded-md border border-border bg-background">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentWeekDate((current) => {
                        const next = new Date(current);
                        next.setDate(next.getDate() - 7);
                        return next;
                      })
                    }
                    aria-label="Previous week"
                    title="Previous week"
                    className="inline-flex min-h-9 items-center gap-1 px-2.5 text-sm font-medium transition-colors hover:bg-hover"
                  >
                    <Icon name="arrow" className="size-4 rotate-180" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentWeekDate(new Date())}
                    title="Jump to the current week"
                    className="inline-flex min-h-9 items-center border-x border-border px-3 text-sm font-medium transition-colors hover:bg-hover"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentWeekDate((current) => {
                        const next = new Date(current);
                        next.setDate(next.getDate() + 7);
                        return next;
                      })
                    }
                    aria-label="Next week"
                    title="Next week"
                    className="inline-flex min-h-9 items-center gap-1 px-2.5 text-sm font-medium transition-colors hover:bg-hover"
                  >
                    Next
                    <Icon name="arrow" className="size-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openAssignWorkoutModal}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft px-3 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary-soft/70 dark:text-foreground"
                  >
                    <Icon name="workout" className="size-4" />
                    Schedule Workout
                  </button>
                  <button
                    type="button"
                    onClick={openAssignMealModal}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft px-3 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary-soft/70 dark:text-foreground"
                  >
                    <Icon name="meal" className="size-4" />
                    Assign Meal
                  </button>
                </div>
              </div>
            </div>

            {weekError && (
              <p role="alert" className="mb-3 text-sm text-danger">
                {weekError}
              </p>
            )}

            {/*
              CSS Grid, not a <table>: percentage/h-full heights inside
              flex children of a <td> don't reliably resolve against the
              table's computed row height (the row-height algorithm and
              the flex layout algorithm fight each other), which let each
              day's workout/meal split drift independently instead of
              matching every other column. Grid resolves row sizing and
              item stretching in one pass, so this actually works.
            */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <div className="min-w-[1050px]">
                <div className="grid grid-cols-7 divide-x divide-border border-b border-border">
                  {weekDates.map((date) => {
                    const dateKey = toDateKey(date);
                    const isToday = dateKey === toDateKey(new Date());

                    return (
                      <div
                        key={dateKey}
                        className={`px-3 py-2.5 ${
                          isToday ? "bg-primary-soft/25" : "bg-background"
                        }`}
                      >
                        <p
                          className={`text-sm font-semibold ${
                            isToday
                              ? "text-primary-hover dark:text-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {weekdayFormatter.format(date)}
                        </p>
                        <p className="mt-0.5 text-xs font-normal text-muted tabular-nums">
                          {shortDateFormatter.format(date)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-7 items-stretch divide-x divide-border">
                  {weekDates.map((date) => {
                    const dateKey = toDateKey(date);
                    const isToday = dateKey === toDateKey(new Date());

                    // At most one workout plan and one meal plan per day.
                    const dayWorkout = weeklyWorkoutAssignments.find(
                      (assignment) =>
                        assignedDateKey(assignment.assignedDate) === dateKey,
                    );
                    const dayMeal = weeklyMealAssignments.find(
                      (assignment) =>
                        assignedDateKey(assignment.assignedDate) === dateKey,
                    );

                    return (
                      <div
                        key={dateKey}
                        className={`grid min-w-0 grid-rows-2 divide-y divide-border ${
                          isToday ? "bg-primary-soft/10" : "bg-surface"
                        }`}
                      >
                        <div className="min-h-0 p-2">
                          {dayWorkout ? (
                            <div className="group relative h-full">
                              <Link
                                href={`/workout-plans/${dayWorkout.workoutPlanId}?fromClient=${clientId}`}
                                aria-label={`${dayWorkout.workoutPlanName} — ${getWorkoutStatus(dayWorkout.status)}`}
                                title={getWorkoutStatus(dayWorkout.status)}
                                className={`flex h-full w-full flex-col overflow-hidden rounded-md border px-3 py-2 pr-6 transition-colors ${getWorkoutCardTone(dayWorkout.status)}`}
                              >
                                <p className="flex items-start gap-1.5 text-sm font-medium text-foreground">
                                  <Icon
                                    name="workout"
                                    className="mt-0.5 size-4 shrink-0"
                                  />
                                  <span className="line-clamp-2 wrap-anywhere">
                                    {dayWorkout.workoutPlanName}
                                  </span>
                                </p>
                                <p className="mt-auto pt-1 pl-[22px] text-xs text-muted">
                                  {dayWorkout.exerciseCount}{" "}
                                  {dayWorkout.exerciseCount === 1
                                    ? "exercise"
                                    : "exercises"}
                                </p>
                              </Link>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setDeleteWorkoutAssignmentError("");
                                  setWorkoutAssignmentToDelete({
                                    id: dayWorkout.id,
                                    name: dayWorkout.workoutPlanName,
                                    dateLabel: shortDateFormatter.format(date),
                                  });
                                }}
                                aria-label={`Remove ${dayWorkout.workoutPlanName} from ${shortDateFormatter.format(date)}`}
                                className="absolute top-1 right-1 z-10 rounded p-0.5 text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger-soft hover:text-danger focus-visible:bg-danger-soft focus-visible:text-danger focus-visible:opacity-100"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-sm text-muted">—</span>
                            </div>
                          )}
                        </div>

                        <div className="min-h-0 p-2">
                          {dayMeal ? (
                            <div className="group relative h-full">
                              <Link
                                href={`/meal-plans/${dayMeal.mealPlanId}?fromClient=${clientId}`}
                                className="flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-background px-3 py-2 pr-6 transition-colors hover:bg-hover"
                              >
                                <p className="flex items-start gap-1.5 text-sm font-medium text-foreground">
                                  <Icon
                                    name="meal"
                                    className="mt-0.5 size-4 shrink-0"
                                  />
                                  <span className="line-clamp-2 wrap-anywhere">
                                    {dayMeal.mealPlanName}
                                  </span>
                                </p>
                                <p className="mt-auto pt-1 pl-[22px] text-xs text-muted">
                                  {dayMeal.mealCount}{" "}
                                  {dayMeal.mealCount === 1 ? "meal" : "meals"}
                                </p>
                              </Link>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setDeleteMealAssignmentError("");
                                  setMealAssignmentToDelete({
                                    id: dayMeal.id,
                                    name: dayMeal.mealPlanName,
                                    dateLabel: shortDateFormatter.format(date),
                                  });
                                }}
                                aria-label={`Remove ${dayMeal.mealPlanName} from ${shortDateFormatter.format(date)}`}
                                className="absolute top-1 right-1 z-10 rounded p-0.5 text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger-soft hover:text-danger focus-visible:bg-danger-soft focus-visible:text-danger focus-visible:opacity-100"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-sm text-muted">—</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isWeekLoading && (
              <p role="status" className="mt-3 text-center text-xs text-muted">
                Loading weekly schedule…
              </p>
            )}
          </section>
        )}

        {activeTab === "progress" && (
          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon name="dashboard" className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Client Progress</h2>
                <p className="text-sm text-muted">
                  Workout and meal completion summary
                </p>
              </div>
              <div className="ml-auto">
                <label htmlFor="progress-period" className="sr-only">
                  Progress period
                </label>
                <select
                  id="progress-period"
                  value={progressPeriod}
                  onChange={(event) =>
                    setProgressPeriod(event.target.value as ProgressPeriod)
                  }
                  className="min-h-11 rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                >
                  {progressPeriodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              {isProgressLoading && <ProgressSkeleton />}

              {!isProgressLoading && progressError && (
                <div
                  role="alert"
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
                >
                  <span>{progressError}</span>
                  <button
                    type="button"
                    onClick={() => setProgressRefreshKey((key) => key + 1)}
                    className="min-h-9 rounded-md border border-danger/40 px-3 font-medium hover:bg-danger/10"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isProgressLoading && !progressError && progress && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <ProgressCard
                    title="Workout Progress"
                    rate={progress.workoutCompletionRate}
                    total={progress.totalWorkouts}
                    totalLabel="Total workouts"
                    completed={progress.completedWorkouts}
                    pending={progress.pendingWorkouts}
                    skipped={progress.skippedWorkouts}
                    missed={progress.missedWorkouts}
                  />
                  <ProgressCard
                    title="Meal Progress"
                    rate={progress.mealCompletionRate}
                    total={progress.totalMeals}
                    totalLabel="Total meals"
                    completed={progress.completedMeals}
                    pending={progress.pendingMeals}
                    skipped={progress.skippedMeals}
                    missed={progress.missedMeals}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <section className="rounded-xl border border-border bg-surface p-4">
              <label
                htmlFor="activity-date"
                className="mb-2 block text-sm font-medium"
              >
                Activity date
              </label>
              <input
                id="activity-date"
                type="date"
                value={activityDate}
                onChange={(event) => setActivityDate(event.target.value)}
                className="block min-h-11 w-full max-w-60 rounded-md border border-input-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </section>

            {activityLoading && (
              <div
                role="status"
                aria-label="Loading daily activity"
                className="grid gap-4 lg:grid-cols-2"
              >
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-xl border border-border bg-surface"
                  />
                ))}
              </div>
            )}

            {!activityLoading && activityError && (
              <div
                role="alert"
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger"
              >
                <span>{activityError}</span>
                <button
                  type="button"
                  onClick={() => setActivityRefreshKey((key) => key + 1)}
                  className="min-h-9 rounded-md border border-danger/40 px-3 font-medium hover:bg-danger/10"
                >
                  Retry
                </button>
              </div>
            )}

            {!activityLoading && !activityError && activityData && (
              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Icon name="workout" className="size-5 text-primary" />
                    <h2 className="font-semibold">Workout Activity</h2>
                  </div>
                  {activityData.workout ? (
                    <Link
                      href={`/workout-plans/${activityData.workout.workoutPlanId}?fromClient=${clientId}`}
                      className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 hover:bg-hover"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {activityData.workout.workoutPlanName}
                        </p>
                        {formatCompletedTime(
                          activityData.workout.completedAt,
                        ) && (
                          <p className="text-xs text-muted">
                            {formatCompletedTime(
                              activityData.workout.completedAt,
                            )}
                          </p>
                        )}
                      </div>
                      <StatusBadge
                        status={getActivityStatus(activityData.workout)}
                      />
                    </Link>
                  ) : (
                    <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted">
                      No workout scheduled for this date.
                    </p>
                  )}
                </section>

                <section className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Icon name="meal" className="size-5 text-primary" />
                    <h2 className="font-semibold">Meal Activity</h2>
                  </div>
                  {activityData.meals.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {activityData.meals.map((meal) => (
                        <li
                          key={meal.mealStatusId}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {meal.mealName}
                            </p>
                            {formatCompletedTime(meal.completedAt) && (
                              <p className="text-xs text-muted">
                                {formatCompletedTime(meal.completedAt)}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={getActivityStatus(meal)} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted">
                      No meals scheduled for this date.
                    </p>
                  )}
                </section>
              </div>
            )}
          </div>
        )}
      </div>

      {isAssignWorkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Assign Workout Plan</h2>
              <p className="mt-1 text-sm text-muted">
                Choose a workout plan and assignment date.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="workout-plan"
                  className="mb-2 block text-sm font-medium"
                >
                  Workout Plan
                </label>

                <div
                  className="relative"
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    ) {
                      setIsWorkoutPlanDropdownOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    id="workout-plan"
                    onClick={() =>
                      setIsWorkoutPlanDropdownOpen((open) => !open)
                    }
                    disabled={isLoadingWorkoutPlanOptions}
                    aria-haspopup="listbox"
                    aria-expanded={isWorkoutPlanDropdownOpen}
                    aria-busy={isLoadingWorkoutPlanOptions}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3 text-left text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoadingWorkoutPlanOptions ? (
                      <span className="flex items-center gap-2 text-muted">
                        <span
                          aria-hidden="true"
                          className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary"
                        />
                        Loading workout plans...
                      </span>
                    ) : (
                      <span
                        className={`truncate ${selectedWorkoutPlanName ? "" : "text-muted"}`}
                      >
                        {selectedWorkoutPlanName ?? "Select a workout plan"}
                      </span>
                    )}
                    <Icon
                      name="arrow"
                      className={`size-4 shrink-0 text-muted transition-transform ${
                        isWorkoutPlanDropdownOpen ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </button>

                  {isWorkoutPlanDropdownOpen &&
                    !isLoadingWorkoutPlanOptions && (
                      <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                        <div className="border-b border-border p-2">
                          <input
                            type="text"
                            autoFocus
                            value={workoutPlanSearch}
                            onChange={(event) =>
                              setWorkoutPlanSearch(event.target.value)
                            }
                            placeholder="Search workout plans..."
                            className="min-h-9 w-full rounded-md border border-input-border bg-background px-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <ul
                          role="listbox"
                          className="max-h-[220px] overflow-y-auto py-1"
                        >
                          {filteredWorkoutPlans.length > 0 ? (
                            filteredWorkoutPlans.map((plan) => (
                              <li key={plan.id}>
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={
                                    String(plan.id) === selectedWorkoutPlanId
                                  }
                                  onClick={() => {
                                    setSelectedWorkoutPlanId(String(plan.id));
                                    setWorkoutPlanSearch("");
                                    setIsWorkoutPlanDropdownOpen(false);
                                  }}
                                  className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                                    String(plan.id) === selectedWorkoutPlanId
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
                              No workout plans found.
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="assigned-workout-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Assigned Date
                </label>

                <input
                  id="assigned-workout-date"
                  type="date"
                  value={assignedWorkoutDate}
                  onChange={(event) =>
                    setAssignedWorkoutDate(event.target.value)
                  }
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {assignWorkoutError && (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
                  role="alert"
                >
                  <span>{assignWorkoutError}</span>
                  {!isLoadingWorkoutPlanOptions &&
                    availableWorkoutPlans.length === 0 && (
                      <button
                        type="button"
                        onClick={() => void loadWorkoutPlanOptions()}
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
                onClick={() => {
                  setIsAssignWorkoutOpen(false);
                  setAssignWorkoutError("");
                  setWorkoutPlanSearch("");
                  setIsWorkoutPlanDropdownOpen(false);
                }}
                className="min-h-10 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-hover"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleAssignWorkout()}
                disabled={
                  !selectedWorkoutPlanId ||
                  !assignedWorkoutDate ||
                  isLoadingWorkoutPlanOptions ||
                  isAssigningWorkout
                }
                aria-busy={isAssigningWorkout}
                className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAssigningWorkout ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAssignMealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Assign Meal Plan</h2>
              <p className="mt-1 text-sm text-muted">
                Choose a meal plan and assignment date.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="meal-plan"
                  className="mb-2 block text-sm font-medium"
                >
                  Meal Plan
                </label>

                <div
                  className="relative"
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    ) {
                      setIsMealPlanDropdownOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    id="meal-plan"
                    onClick={() => setIsMealPlanDropdownOpen((open) => !open)}
                    disabled={isLoadingMealPlanOptions}
                    aria-haspopup="listbox"
                    aria-expanded={isMealPlanDropdownOpen}
                    aria-busy={isLoadingMealPlanOptions}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-background px-3 text-left text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoadingMealPlanOptions ? (
                      <span className="flex items-center gap-2 text-muted">
                        <span
                          aria-hidden="true"
                          className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary"
                        />
                        Loading meal plans...
                      </span>
                    ) : (
                      <span
                        className={`truncate ${selectedMealPlanName ? "" : "text-muted"}`}
                      >
                        {selectedMealPlanName ?? "Select a meal plan"}
                      </span>
                    )}
                    <Icon
                      name="arrow"
                      className={`size-4 shrink-0 text-muted transition-transform ${
                        isMealPlanDropdownOpen ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </button>

                  {isMealPlanDropdownOpen && !isLoadingMealPlanOptions && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                      <div className="border-b border-border p-2">
                        <input
                          type="text"
                          autoFocus
                          value={mealPlanSearch}
                          onChange={(event) =>
                            setMealPlanSearch(event.target.value)
                          }
                          placeholder="Search meal plans..."
                          className="min-h-9 w-full rounded-md border border-input-border bg-background px-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <ul
                        role="listbox"
                        className="max-h-[220px] overflow-y-auto py-1"
                      >
                        {filteredMealPlans.length > 0 ? (
                          filteredMealPlans.map((plan) => (
                            <li key={plan.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={
                                  String(plan.id) === selectedMealPlanId
                                }
                                onClick={() => {
                                  setSelectedMealPlanId(String(plan.id));
                                  setMealPlanSearch("");
                                  setIsMealPlanDropdownOpen(false);
                                }}
                                className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                                  String(plan.id) === selectedMealPlanId
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
                            No meal plans found.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="assigned-meal-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Assigned Date
                </label>

                <input
                  id="assigned-meal-date"
                  type="date"
                  value={assignedMealDate}
                  onChange={(event) => setAssignedMealDate(event.target.value)}
                  className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {assignMealError && (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
                  role="alert"
                >
                  <span>{assignMealError}</span>
                  {!isLoadingMealPlanOptions &&
                    availableMealPlans.length === 0 && (
                      <button
                        type="button"
                        onClick={() => void loadMealPlanOptions()}
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
                onClick={() => {
                  setIsAssignMealOpen(false);
                  setAssignMealError("");
                  setMealPlanSearch("");
                  setIsMealPlanDropdownOpen(false);
                }}
                className="min-h-10 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-hover"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleAssignMeal()}
                disabled={
                  !selectedMealPlanId ||
                  !assignedMealDate ||
                  isLoadingMealPlanOptions ||
                  isAssigningMeal
                }
                aria-busy={isAssigningMeal}
                className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAssigningMeal ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={isDeleteOpen}
        title={`Delete ${client.fullName}?`}
        description="This action removes the client and related records such as payments and assigned plans."
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
            setDeleteError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteClient();
        }}
      />

      <DeleteConfirmDialog
        open={workoutAssignmentToDelete !== null}
        title={`Remove this workout from ${workoutAssignmentToDelete?.dateLabel ?? "this day"}?`}
        description="This removes the workout plan from the client's weekly schedule."
        itemName={workoutAssignmentToDelete?.name}
        isDeleting={deletingWorkoutAssignmentId !== null}
        error={deleteWorkoutAssignmentError}
        onCancel={() => {
          if (deletingWorkoutAssignmentId === null) {
            setWorkoutAssignmentToDelete(null);
            setDeleteWorkoutAssignmentError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteWorkoutAssignment();
        }}
      />

      <DeleteConfirmDialog
        open={mealAssignmentToDelete !== null}
        title={`Remove this meal plan from ${mealAssignmentToDelete?.dateLabel ?? "this day"}?`}
        description="This removes the meal plan from the client's weekly schedule."
        itemName={mealAssignmentToDelete?.name}
        isDeleting={deletingMealAssignmentId !== null}
        error={deleteMealAssignmentError}
        onCancel={() => {
          if (deletingMealAssignmentId === null) {
            setMealAssignmentToDelete(null);
            setDeleteMealAssignmentError("");
          }
        }}
        onConfirm={() => {
          void handleDeleteMealAssignment();
        }}
      />
    </div>
  );
}
