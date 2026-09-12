using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.MealAssignments;

public class UpdateMealAssignmentRequest
{
    [Range(1, int.MaxValue)]
    public int MealPlanId { get; set; }

    [Required]
    public DateTime AssignedDate { get; set; }
}
