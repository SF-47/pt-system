using backend.Enums;

namespace backend.DTOs.Mobile;

public class MobileMealStatusResponse
{
    public int MealStatusId { get; set; }

    public int MealId { get; set; }

    public string MealName { get; set; } = string.Empty;

    public string Instructions { get; set; } = string.Empty;

    public int Position { get; set; }

    public CompletionStatus Status { get; set; }

    public DateTime? CompletedAt { get; set; }
}