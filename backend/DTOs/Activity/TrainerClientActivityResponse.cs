namespace backend.DTOs.Activity;

public class TrainerClientActivityResponse
{
    public string Date { get; set; } = string.Empty;
    public TrainerWorkoutActivityResponse? Workout { get; set; }
    public List<TrainerMealActivityResponse> Meals { get; set; } = new();
}

public class TrainerWorkoutActivityResponse
{
    public int AssignmentId { get; set; }
    public int WorkoutPlanId { get; set; }
    public string WorkoutPlanName { get; set; } = string.Empty;

    public int Status { get; set; }

    public bool IsMissed { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class TrainerMealActivityResponse
{
    public int MealStatusId { get; set; }
    public int MealId { get; set; }
    public string MealName { get; set; } = string.Empty;

    public int Status { get; set; }

    public bool IsMissed { get; set; }
    public DateTime? CompletedAt { get; set; }
}
