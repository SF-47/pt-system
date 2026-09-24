namespace backend.Models;

public class Meal
{
    public int Id { get; set; }

    public int MealPlanId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    // Explicit order inside the plan (1 = first).
    public int Position { get; set; }

    public MealPlan MealPlan { get; set; } = null!;
}