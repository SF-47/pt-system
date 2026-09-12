using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.WorkoutAssignments;

public class UpdateWorkoutAssignmentRequest
{
    [Range(1, int.MaxValue)]
    public int WorkoutPlanId { get; set; }

    [Required]
    public DateTime AssignedDate { get; set; }
}
