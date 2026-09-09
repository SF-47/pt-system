using backend.Enums;

namespace backend.Models;

public class ClientMealStatus
{
    public int Id { get; set; }

    public int ClientMealPlanId { get; set; }

    public int MealId { get; set; }

    public CompletionStatus Status { get; set; } = CompletionStatus.Pending;

    public DateTime? CompletedAt { get; set; }

    public ClientMealPlan ClientMealPlan { get; set; } = null!;

    public Meal Meal { get; set; } = null!;
}
