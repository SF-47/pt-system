import BackLink from "@/components/BackLink";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
type DailyActivityPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DailyActivityPage({
  params,
}: DailyActivityPageProps) {
  const { id } = await params;

  const workouts = [
    { id: 1, name: "Push Day", status: "Completed" },
    { id: 2, name: "Cardio", status: "Skipped" },
  ];

  const meals = [
    { id: 1, name: "Breakfast", status: "Completed" },
    { id: 2, name: "Lunch", status: "Pending" },
    { id: 3, name: "Dinner", status: "Completed" },
  ];

  return (
    <div className="max-w-5xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader
        title="Daily Activity"
        description="Workout and meal completion for the selected day."
      />

      <div className="mb-6 grid gap-3 rounded-xl border border-border bg-surface p-5 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
        <div>
          <label
            htmlFor="activity-date"
            className="mb-2 block text-sm font-medium"
          >
            Date
          </label>

          <input
            id="activity-date"
            aria-describedby="date-help"
            type="date"
            className="block min-h-11 w-full max-w-60 rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </div>
        <p className="mb-3 text-sm text-muted" id="date-help">
          Sample activity is static; changing the date does not load another
          day.
        </p>
      </div>

      <section className="mb-7">
        <h2 className="mb-3 text-lg font-semibold">Workouts</h2>

        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6"
            >
              <span className="font-medium">{workout.name}</span>
              <span>
                <StatusBadge status={workout.status} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Meals</h2>

        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6"
            >
              <span className="font-medium">{meal.name}</span>
              <span>
                <StatusBadge status={meal.status} />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
