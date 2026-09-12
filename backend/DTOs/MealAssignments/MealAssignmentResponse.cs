namespace backend.DTOs.MealAssignments;

public class MealAssignmentResponse
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int MealPlanId { get; set; }

    public string MealPlanName { get; set; } = string.Empty;

    public DateTime AssignedDate { get; set; }

    public List<MealStatusResponse> Meals { get; set; }
        = new List<MealStatusResponse>();
}