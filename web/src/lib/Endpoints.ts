export const Endpoints = {
  // Auth
  trainerLogin: "/api/trainer/login",

  // Clients
  clientsBase: "/api/clients",

  clients: (page: number, pageSize: number, search?: string, status?: string) =>
    `/api/clients?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
      search ?? "",
    )}&status=${encodeURIComponent(status ?? "")}`,
  clientsStats: "/api/stats/clients",
  clientGrowth: "/api/stats/client-growth",

  clientById: (id: number) => `/api/clients/${id}`,

  clientProgress: (clientId: number, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    const query = params.toString();

    return `/api/clients/${clientId}/progress${query ? `?${query}` : ""}`;
  },

  clientDailyActivity: (clientId: number, date: string) =>
    `/api/clients/${clientId}/activity?date=${encodeURIComponent(date)}`,

  updateClientCredentials: (id: number) => `/api/clients/${id}/credentials`,

  // Workout Plans
  workoutPlansBase: "/api/workout-plans",

  workoutPlans: (page: number, pageSize: number, search?: string) =>
    `/api/workout-plans?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
      search ?? "",
    )}`,

  workoutPlansStats: "/api/stats/workouts",

  workoutPlanById: (id: number) => `/api/workout-plans/${id}`,

  addExercise: (workoutPlanId: number) =>
    `/api/workout-plans/${workoutPlanId}/exercises`,

  exerciseById: (id: number) => `/api/exercises/${id}`,

  // Meal Plans
  mealPlansBase: "/api/meal-plans",

  mealPlans: (page: number, pageSize: number, search?: string) =>
    `/api/meal-plans?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
      search ?? "",
    )}`,

  mealPlansStats: "/api/stats/meals",

  mealPlanById: (id: number) => `/api/meal-plans/${id}`,

  addMeal: (mealPlanId: number) => `/api/meal-plans/${mealPlanId}/meals`,

  mealById: (id: number) => `/api/meals/${id}`,

  // Workout Assignments
  clientWorkoutPlansBase: (clientId: number) =>
    `/api/clients/${clientId}/workout-plans`,

  clientWorkoutPlans: (
    clientId: number,
    page: number,
    pageSize: number,
    startDate?: string,
    endDate?: string,
  ) =>
    `/api/clients/${clientId}/workout-plans?page=${page}&pageSize=${pageSize}${
      startDate ? `&startDate=${startDate}` : ""
    }${endDate ? `&endDate=${endDate}` : ""}`,

  clientWorkoutPlanById: (id: number) => `/api/client-workout-plans/${id}`,

  clientWorkoutPlanStatus: (id: number) =>
    `/api/client-workout-plans/${id}/status`,

  // Meal Assignments
  clientMealPlansBase: (clientId: number) =>
    `/api/clients/${clientId}/meal-plans`,

  clientMealPlans: (
    clientId: number,
    page: number,
    pageSize: number,
    startDate?: string,
    endDate?: string,
  ) =>
    `/api/clients/${clientId}/meal-plans?page=${page}&pageSize=${pageSize}${
      startDate ? `&startDate=${startDate}` : ""
    }${endDate ? `&endDate=${endDate}` : ""}`,

  clientMealPlanById: (id: number) => `/api/client-meal-plans/${id}`,

  clientMealStatus: (id: number) => `/api/client-meal-statuses/${id}/status`,

  // Payments
  paymentsBase: "/api/payments",

  payments: (
    page: number,
    pageSize: number,
    search?: string,
    status?: string,
    month?: number,
    year?: number,
  ) =>
    `/api/payments?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
      search ?? "",
    )}&status=${encodeURIComponent(status ?? "")}${
      month ? `&month=${month}` : ""
    }${year ? `&year=${year}` : ""}`,

  paymentsStats: "/api/stats/payments",

  // Same filters as the payments list, so totals match the table.
  paymentsStatsFiltered: (
    search?: string,
    status?: string,
    month?: number,
    year?: number,
  ) =>
    `/api/stats/payments?search=${encodeURIComponent(
      search ?? "",
    )}&status=${encodeURIComponent(status ?? "")}${
      month ? `&month=${month}` : ""
    }${year ? `&year=${year}` : ""}`,

  createClientPayment: (clientId: number) =>
    `/api/clients/${clientId}/payments`,

  clientPaymentsBase: (clientId: number) => `/api/clients/${clientId}/payments`,

  clientPayments: (clientId: number, page: number, pageSize: number) =>
    `/api/clients/${clientId}/payments?page=${page}&pageSize=${pageSize}`,

  paymentStatus: (id: number) => `/api/payments/${id}/status`,

  // Dashboard
  dashboardStats: "/api/stats/dashboard",
};
