namespace backend.DTOs.Workouts;

public class WorkoutPlanResponse
{
    public int Id { get; set; }

    public int TrainerId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<ExerciseResponse> Exercises { get; set; } = new List<ExerciseResponse>();
}
