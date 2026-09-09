using backend.Enums;

namespace backend.Models;

public class ClientWorkoutAssignment
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int WorkoutPlanId { get; set; }

    public DateTime AssignedDate { get; set; }

    public CompletionStatus Status { get; set; } = CompletionStatus.Pending;

    public DateTime? CompletedAt { get; set; }

    public Client Client { get; set; } = null!;

    public WorkoutPlan WorkoutPlan { get; set; } = null!;
}
