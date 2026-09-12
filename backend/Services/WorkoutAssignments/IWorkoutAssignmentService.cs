using backend.DTOs.WorkoutAssignments;

namespace backend.Services.WorkoutAssignments;

public interface IWorkoutAssignmentService
{
    Task<List<WorkoutAssignmentResponse>> GetByClientIdAsync(int clientId);

    Task<WorkoutAssignmentResponse?> AssignAsync(int clientId, AssignWorkoutPlanRequest request);

    Task<WorkoutAssignmentResponse?> UpdateAsync(
        int assignmentId,
        UpdateWorkoutAssignmentRequest request
    );

    Task<WorkoutAssignmentResponse?> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request
    );
}
