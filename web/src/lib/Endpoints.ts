export const Endpoints = {
  // Auth
  trainerLogin: "/api/trainer/login",

  // Clients
  clients: "/api/clients",
  clientById: (id: number) => `/api/clients/${id}`,
  updateClientCredentials: (id: number) => `/api/clients/${id}/credentials`,

  // Workout Plans
  workoutPlans: "/api/workout-plans",
  workoutPlanById: (id: number) => `/api/workout-plans/${id}`,
  addExercise: (workoutPlanId: number) =>
    `/api/workout-plans/${workoutPlanId}/exercises`,
  exerciseById: (id: number) => `/api/exercises/${id}`,

  // Meal Plans
  mealPlans: "/api/meal-plans",
  mealPlanById: (id: number) => `/api/meal-plans/${id}`,
  addMeal: (mealPlanId: number) => `/api/meal-plans/${mealPlanId}/meals`,
  mealById: (id: number) => `/api/meals/${id}`,

  // Workout Assignments
  clientWorkoutPlans: (clientId: number) =>
    `/api/clients/${clientId}/workout-plans`,
  clientWorkoutPlanById: (id: number) => `/api/client-workout-plans/${id}`,
  clientWorkoutPlanStatus: (id: number) =>
    `/api/client-workout-plans/${id}/status`,

  // Meal Assignments
  clientMealPlans: (clientId: number) => `/api/clients/${clientId}/meal-plans`,
  clientMealPlanById: (id: number) => `/api/client-meal-plans/${id}`,
  clientMealStatus: (id: number) => `/api/client-meal-statuses/${id}/status`,

  // Payments
  payments: "/api/payments",
  clientPayments: (clientId: number) => `/api/clients/${clientId}/payments`,
  paymentStatus: (id: number) => `/api/payments/${id}/status`,
};
