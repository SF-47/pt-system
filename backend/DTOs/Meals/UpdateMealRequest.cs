namespace backend.DTOs.Meals;

public class UpdateMealRequest
{
    public string Name { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;
}