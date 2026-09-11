import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

type MealPlan = {
  id: number;
  name: string;
  description: string;
  mealCount: number;
};

const mealPlans: MealPlan[] = [
  {
    id: 1,
    name: "Weight Loss Plan",
    description: "Simple low-calorie meal plan",
    mealCount: 3,
  },
  {
    id: 2,
    name: "Muscle Gain Plan",
    description: "High-protein meal plan",
    mealCount: 4,
  },
];

export default function MealPlansPage() {
  return (
    <div>
      <PageHeader
        title="Meal Plans"
        description="Keep daily nutrition clear and easy to follow."
      >
        <Link
          href="/meal-plans/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Create Meal Plan
        </Link>
      </PageHeader>
      <div className="grid grid-cols-1 gap-4 min-[1001px]:grid-cols-2">
        {mealPlans.map((plan) => (
          <article
            key={plan.id}
            className="overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-[#9dc8ae] dark:border-[#2C3238] dark:bg-[#1B1F24] dark:hover:border-[#2F855A]"
          >
            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="mt-2 text-muted">{plan.description}</p>
              </div>
              <div className="min-w-16 border-l border-border pl-4 text-center">
                <strong className="block text-2xl text-foreground">
                  {plan.mealCount}
                </strong>
                <span className="text-xs text-muted">meals</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-[#fafcfb] px-5 py-3 dark:border-[#2C3238] dark:bg-[#20252A]">
              <Link
                href={`/meal-plans/${plan.id}`}
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
