namespace backend.DTOs.WorkoutAssignments;

public class UpdateWorkoutAssignmentRequest
{
    public int WorkoutPlanId { get; set; }

    public DateTime AssignedDate { get; set; }
}