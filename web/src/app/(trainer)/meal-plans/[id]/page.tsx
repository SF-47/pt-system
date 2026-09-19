import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
type MealPlanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MealPlanPage({ params }: MealPlanPageProps) {
  const { id } = await params;

  const meals = [
    {
      id: 1,
      name: "Breakfast",
      instructions: "3 eggs, oats and banana",
    },
    {
      id: 2,
      name: "Lunch",
      instructions: "Chicken, rice and salad",
    },
    {
      id: 3,
      name: "Dinner",
      instructions: "Fish, potatoes and vegetables",
    },
  ];

  return (
    <div className="max-w-5xl">
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
      <PageHeader title="Weight Loss Plan" />

      <section aria-label="Plan overview" className="mb-6 border-b border-border pb-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div><dt className="text-muted">Plan ID</dt><dd className="mt-1 font-medium tabular-nums">{id}</dd></div>
          <div><dt className="text-muted">Meals</dt><dd className="mt-1 font-medium tabular-nums">{meals.length}</dd></div>
        </dl>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Meals</h2>

      <div className="divide-y divide-border/50 rounded-xl bg-surface px-5 sm:px-6">
        {meals.map((meal) => (
          <div key={meal.id} className="grid gap-3 py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:py-6">
            <h3 className="flex items-center gap-4 text-lg font-medium"><span className="text-sm text-muted tabular-nums">{String(meal.id).padStart(2, "0")}</span>{meal.name}</h3>

            <p className="text-sm leading-relaxed text-muted sm:pt-1">{meal.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
