namespace backend.DTOs.Meals;

public class MealPlanResponse
{
    public int Id { get; set; }

    public int TrainerId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<MealResponse> Meals { get; set; }
        = new List<MealResponse>();
}