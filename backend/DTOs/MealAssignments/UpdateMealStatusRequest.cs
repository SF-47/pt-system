using backend.Enums;

namespace backend.DTOs.MealAssignments;

public class UpdateMealStatusRequest
{
    public CompletionStatus Status { get; set; }
}