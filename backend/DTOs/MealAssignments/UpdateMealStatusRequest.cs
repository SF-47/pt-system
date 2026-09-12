using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs.MealAssignments;

public class UpdateMealStatusRequest
{
    [EnumDataType(typeof(CompletionStatus))]
    public CompletionStatus Status { get; set; }
}
