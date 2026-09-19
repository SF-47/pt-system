import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
type WorkoutPlanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutPlanPage({
  params,
}: WorkoutPlanPageProps) {
  const { id } = await params;

  const exercises = [
    {
      id: 1,
      name: "Bench Press",
      sets: 4,
      reps: 10,
      restSeconds: 90,
    },
    {
      id: 2,
      name: "Shoulder Press",
      sets: 3,
      reps: 12,
      restSeconds: 60,
    },
  ];

  return (
    <div className="max-w-5xl">
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader title="Push Day" description="Chest, shoulders and triceps workout." />

      <section aria-label="Plan overview" className="mb-6 border-b border-border pb-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div><dt className="text-muted">Plan ID</dt><dd className="mt-1 font-medium tabular-nums">{id}</dd></div>
          <div><dt className="text-muted">Exercises</dt><dd className="mt-1 font-medium tabular-nums">{exercises.length}</dd></div>
        </dl>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Exercises</h2>

      <div
        className="w-full overflow-x-auto rounded-lg border border-border bg-surface dark:border-border dark:bg-surface"
        role="region"
        aria-label="Exercises"
        tabIndex={0}
      >
        <table className="workspace-table w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              {["Exercise", "Sets", "Reps", "Rest"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`bg-background px-5 py-3 align-middle text-sm font-medium text-muted ${heading === "Exercise" ? "text-left" : "text-right"}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr
                key={exercise.id}
                className="border-t border-border transition-colors hover:bg-hover focus-within:bg-hover dark:border-border dark:hover:bg-hover dark:focus-within:bg-hover"
              >
                <td className="px-5 py-5 align-middle font-medium"><span className="mr-4 inline-block w-6 text-sm font-normal text-muted tabular-nums">{String(exercise.id).padStart(2, "0")}</span>{exercise.name}</td>
                <td className="px-5 py-5 text-right align-middle">{exercise.sets}</td>
                <td className="px-5 py-5 text-right align-middle">{exercise.reps}</td>
                <td className="px-5 py-5 text-right align-middle text-muted">
                  {exercise.restSeconds} seconds
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
