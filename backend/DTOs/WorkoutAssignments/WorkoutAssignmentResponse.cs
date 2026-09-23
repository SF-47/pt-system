using backend.Enums;

namespace backend.DTOs.WorkoutAssignments;

public class WorkoutAssignmentResponse
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int WorkoutPlanId { get; set; }

    public string WorkoutPlanName { get; set; } = string.Empty;

    public int ExerciseCount { get; set; }

    public DateTime AssignedDate { get; set; }

    public CompletionStatus Status { get; set; }

    public DateTime? CompletedAt { get; set; }
}
