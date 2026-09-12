using backend.Enums;

namespace backend.DTOs.MealAssignments;

public class MealStatusResponse
{
    public int Id { get; set; }

    public int MealId { get; set; }

    public string MealName { get; set; } = string.Empty;

    public CompletionStatus Status { get; set; }

    public DateTime? CompletedAt { get; set; }
}