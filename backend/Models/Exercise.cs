namespace backend.Models;

public class Exercise
{
    public int Id { get; set; }

    public int WorkoutPlanId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int Sets { get; set; }

    public int Reps { get; set; }

    public int RestSeconds { get; set; }

    // Explicit order inside the plan (1 = first).
    public int Position { get; set; }

    public WorkoutPlan WorkoutPlan { get; set; } = null!;
}
