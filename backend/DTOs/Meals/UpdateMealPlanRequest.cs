namespace backend.DTOs.Meals;

public class UpdateMealPlanRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}