namespace backend.DTOs.Workouts;

public class ExerciseResponse
{
    public int Id { get; set; }

    public int WorkoutPlanId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Sets { get; set; }

    public int Reps { get; set; }

    public int RestSeconds { get; set; }

    public int Position { get; set; }
}
