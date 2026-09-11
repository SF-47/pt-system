namespace backend.DTOs.Meals;

public class MealResponse
{
    public int Id { get; set; }

    public int MealPlanId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;
}
