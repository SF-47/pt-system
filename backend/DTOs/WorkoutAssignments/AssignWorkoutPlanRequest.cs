namespace backend.DTOs.WorkoutAssignments;

public class AssignWorkoutPlanRequest
{
    public int WorkoutPlanId { get; set; }

    public DateTime AssignedDate { get; set; }
}
