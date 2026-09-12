using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Workouts;

public class CreateExerciseRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(1, 100)]
    public int Sets { get; set; }

    [Range(1, 1000)]
    public int Reps { get; set; }

    [Range(0, 3600)]
    public int RestSeconds { get; set; }
}
