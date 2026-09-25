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

    [Range(1, int.MaxValue)]
    public int? Position { get; set; }
}