using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs.WorkoutAssignments;

public class UpdateWorkoutStatusRequest
{
    [EnumDataType(typeof(CompletionStatus))]
    public CompletionStatus Status { get; set; }
}