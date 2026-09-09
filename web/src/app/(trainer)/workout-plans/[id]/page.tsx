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
    <div>
      <BackLink href="/workout-plans">Back to Workout Plans</BackLink>
      <PageHeader title="Push Day" />

      <p className="mt-2 text-muted">Workout Plan ID: {id}</p>

      <p className="mt-2">Chest, shoulders and triceps workout.</p>

      <h2 className="mb-4 mt-8 text-xl font-semibold">Exercises</h2>

      <div
        className="w-full overflow-x-auto rounded-md border border-border-strong bg-surface dark:border-[#3A4149] dark:bg-[#1B1F24]"
        role="region"
        aria-label="Exercises"
        tabIndex={0}
      >
        <table className="w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              {['Exercise', 'Sets', 'Reps', 'Rest'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="bg-[#f3f7f4] px-4 py-3.5 text-left align-middle font-semibold dark:bg-[#20252A]"
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
                className="border-t border-border-strong transition-colors hover:bg-hover focus-within:bg-hover dark:border-[#3A4149] dark:hover:bg-[#23292F] dark:focus-within:bg-[#23292F]"
              >
                <td className="px-4 py-3.5 align-middle">{exercise.name}</td>
                <td className="px-4 py-3.5 align-middle">{exercise.sets}</td>
                <td className="px-4 py-3.5 align-middle">{exercise.reps}</td>
                <td className="px-4 py-3.5 align-middle">
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
