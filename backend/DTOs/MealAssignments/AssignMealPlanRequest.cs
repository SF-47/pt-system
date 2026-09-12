using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.MealAssignments;

public class AssignMealPlanRequest
{
    [Range(1, int.MaxValue)]
    public int MealPlanId { get; set; }

    [Required]
    public DateTime AssignedDate { get; set; }
}
