using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Meals;

public class CreateMealRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 2)]
    public string Instructions { get; set; } = string.Empty;

    // Optional. When omitted the meal is added at the end of the plan.
    [Range(1, int.MaxValue)]
    public int? Position { get; set; }
}