namespace backend.DTOs.MealAssignments;

public class AssignMealPlanRequest
{
    public int MealPlanId { get; set; }

    public DateTime AssignedDate { get; set; }
}