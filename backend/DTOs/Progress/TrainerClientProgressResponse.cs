namespace backend.DTOs.Progress;

public class TrainerClientProgressResponse
{
    public int TotalWorkouts { get; set; }
    public int CompletedWorkouts { get; set; }
    public int PendingWorkouts { get; set; }
    public int SkippedWorkouts { get; set; }
    public int MissedWorkouts { get; set; }
    public double WorkoutCompletionRate { get; set; }

    public int TotalMeals { get; set; }
    public int CompletedMeals { get; set; }
    public int PendingMeals { get; set; }
    public int SkippedMeals { get; set; }
    public int MissedMeals { get; set; }
    public double MealCompletionRate { get; set; }
}
