namespace backend.DTOs.Workouts;

public class CreateWorkoutPlanRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}
