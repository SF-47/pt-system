namespace backend.DTOs.Mobile;

public class MobileMealPlanResponse
{
    public int AssignmentId { get; set; }

    public int MealPlanId { get; set; }

    public string MealPlanName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime AssignedDate { get; set; }

    public List<MobileMealStatusResponse> Meals { get; set; }
        = new();
}