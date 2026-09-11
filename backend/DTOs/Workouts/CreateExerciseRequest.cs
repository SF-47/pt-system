namespace backend.DTOs.Workouts;

public class CreateExerciseRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Sets { get; set; }

    public int Reps { get; set; }

    public int RestSeconds { get; set; }
}
