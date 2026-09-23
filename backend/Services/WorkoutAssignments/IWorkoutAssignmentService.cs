using backend.DTOs.Common;
using backend.DTOs.WorkoutAssignments;
using backend.Services;

namespace backend.Services.WorkoutAssignments;

public interface IWorkoutAssignmentService
{
    Task<PagedResponse<WorkoutAssignmentResponse>> GetByClientIdAsync(
        int clientId,
        int trainerId,
        int page,
        int pageSize,
        DateTime? startDate = null,
        DateTime? endDate = null
    );

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

    Task<bool> DeleteAsync(int assignmentId, int trainerId);
}
