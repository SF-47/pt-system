using backend.Enums;

namespace backend.DTOs.WorkoutAssignments;

public class UpdateWorkoutStatusRequest
{
    public CompletionStatus Status { get; set; }
}