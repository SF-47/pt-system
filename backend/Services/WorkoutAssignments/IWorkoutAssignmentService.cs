using backend.DTOs.WorkoutAssignments;
using backend.Services;

namespace backend.Services.WorkoutAssignments;

public interface IWorkoutAssignmentService
{
    Task<List<WorkoutAssignmentResponse>> GetByClientIdAsync(int clientId, int trainerId);

    Task<ServiceResult<WorkoutAssignmentResponse>> AssignAsync(
        int clientId,
        AssignWorkoutPlanRequest request,
        int trainerId
    );

    Task<ServiceResult<WorkoutAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateWorkoutAssignmentRequest request,
        int trainerId
    );

    Task<WorkoutAssignmentResponse?> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request,
        int trainerId
    );
}
