namespace backend.DTOs.MealAssignments;

public class UpdateMealAssignmentRequest
{
    public int MealPlanId { get; set; }

    public DateTime AssignedDate { get; set; }
}