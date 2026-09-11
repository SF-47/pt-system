import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

type WorkoutPlan = {
  id: number;
  name: string;
  description: string;
  exerciseCount: number;
};

const workoutPlans: WorkoutPlan[] = [
  {
    id: 1,
    name: "Push Day",
    description: "Chest, shoulders and triceps",
    exerciseCount: 5,
  },
  {
    id: 2,
    name: "Leg Day",
    description: "Quads, hamstrings and calves",
    exerciseCount: 6,
  },
];

export default function WorkoutPlansPage() {
  return (
    <div>
      <PageHeader
        title="Workout Plans"
        description="Build purposeful sessions for every training goal."
      >
        <Link
          href="/workout-plans/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Create Workout Plan
        </Link>
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 min-[1001px]:grid-cols-2">
        {workoutPlans.map((plan) => (
          <article
            key={plan.id}
            className="overflow-hidden rounded-lg border border-border bg-surface p-5 transition-colors hover:border-[#9dc8ae] dark:border-[#2C3238] dark:bg-[#1B1F24] dark:hover:border-[#2F855A]"
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-muted">{plan.description}</p>
            <div className="mt-5 mb-4 flex items-center gap-2 text-muted">
              <strong className="text-foreground">{plan.exerciseCount}</strong>
              exercises
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <Link
                href={`/workout-plans/${plan.id}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
              >
                <Icon name="view" />
                View Plan
              </Link>
              <button
                className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-muted"
                disabled
                title="Plan editing is not available yet"
              >
                <Icon name="edit" />
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="my-4 text-[13px] text-muted">
        Plan editing is not available yet.
      </p>
    </div>
  );
}
