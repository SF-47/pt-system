using backend.DTOs.WorkoutAssignments;
using backend.Services;

namespace backend.Services.WorkoutAssignments;

public interface IWorkoutAssignmentService
{
    Task<List<WorkoutAssignmentResponse>> GetByClientIdAsync(int clientId);

    Task<ServiceResult<WorkoutAssignmentResponse>> AssignAsync(
        int clientId,
        AssignWorkoutPlanRequest request
    );

    Task<ServiceResult<WorkoutAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateWorkoutAssignmentRequest request
    );

    Task<WorkoutAssignmentResponse?> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request
    );
}
