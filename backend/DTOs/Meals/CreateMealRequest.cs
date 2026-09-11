namespace backend.DTOs.Meals;

public class CreateMealRequest
{
    public string Name { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;
}