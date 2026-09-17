using backend.DTOs.Common;
using backend.DTOs.Mobile;
using backend.DTOs.WorkoutAssignments;

namespace backend.Services.Mobile;

public interface IClientWorkoutService
{
    Task<PagedResponse<MobileWorkoutResponse>> GetWorkoutsAsync(
        int clientId,
        int page,
        int pageSize
    );

    Task<MobileWorkoutDetailsResponse?> GetWorkoutAsync(int assignmentId, int clientId);

    Task<bool> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request,
        int clientId
    );
}
