export type ClientOption = {
  id: number;
  fullName: string;
};

export type ReportSummary = {
  total: number;
  completed: number;
  pending: number;
  skipped: number;
  missed: number;
  completionRate: number;
};

export type PaymentSummary = {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentsCount: number;
  overdueCount: number;
};

export type ActivityItem = {
  status: number;
  isMissed: boolean;
};

export type DailyWorkout = ActivityItem & {
  assignmentId: number;
  workoutPlanId: number;
  name: string;
};

export type DailyMeal = ActivityItem & {
  mealStatusId: number;
  mealId: number;
  name: string;
  mealPlanName: string;
};

export type DailyActivity = {
  date: string;
  workout: DailyWorkout | null;
  meals: DailyMeal[];
};

export type ClientReport = {
  client: {
    id: number;
    fullName: string;
    username: string;
    email: string | null;
    phoneNumber: string;
    isActive: boolean;
  };
  period: { startDate: string; endDate: string };
  workoutSummary: ReportSummary;
  mealSummary: ReportSummary;
  paymentSummary: PaymentSummary;
  dailyActivity: DailyActivity[];
};

export type FormErrorField = "client" | "start" | "end";

export type ReportFormError = {
  message: string;
  field: FormErrorField;
};
