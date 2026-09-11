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
    <div>
      <BackLink href="/meal-plans">Back to Meal Plans</BackLink>
      <PageHeader title="Weight Loss Plan" />

      <p className="text-sm text-muted">Meal Plan ID: {id}</p>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Meals</h2>

      <div className="divide-y divide-border rounded-md border border-border bg-surface">
        {meals.map((meal) => (
          <div key={meal.id} className="p-4">
            <h3 className="text-base font-semibold">{meal.name}</h3>

            <p className="mt-2 text-muted">{meal.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
