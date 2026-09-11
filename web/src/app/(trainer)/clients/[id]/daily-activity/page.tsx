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
    <div>
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader title="Daily Activity" />

      <p className="mb-5 text-sm text-muted">Client ID: {id}</p>

      <div className="mb-8">
        <label
          htmlFor="activity-date"
          className="mb-2 block text-sm font-medium"
        >
          Date
        </label>

        <p className="mb-3 text-[13px] text-muted" id="date-help">
          Sample activity is static; changing the date does not load another day.
        </p>
        <input
          id="activity-date"
          aria-describedby="date-help"
          type="date"
          className="block min-h-11 w-full max-w-60 rounded-md border border-input-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Workouts</h2>

        <div className="divide-y divide-border rounded-md border border-border bg-surface">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span>{workout.name}</span>
              <span>
                <StatusBadge status={workout.status} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Meals</h2>

        <div className="divide-y divide-border rounded-md border border-border bg-surface">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span>{meal.name}</span>
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
