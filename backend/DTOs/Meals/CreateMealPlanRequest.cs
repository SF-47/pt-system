namespace backend.DTOs.Meals;

public class CreateMealPlanRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}
