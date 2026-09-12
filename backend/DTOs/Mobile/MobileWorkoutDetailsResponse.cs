using backend.Enums;

namespace backend.DTOs.Mobile;

public class MobileWorkoutDetailsResponse
{
    public int AssignmentId { get; set; }

    public int WorkoutPlanId { get; set; }

    public string WorkoutPlanName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime AssignedDate { get; set; }

    public CompletionStatus Status { get; set; }

    public DateTime? CompletedAt { get; set; }

    public List<MobileExerciseResponse> Exercises { get; set; }
        = new();
}