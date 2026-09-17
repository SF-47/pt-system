using backend.DTOs.Common;
using backend.DTOs.MealAssignments;
using backend.Services;

namespace backend.Services.MealAssignments;

public interface IMealAssignmentService
{
    Task<PagedResponse<MealAssignmentResponse>> GetByClientIdAsync(
        int clientId,
        int trainerId,
        int page,
        int pageSize
    );

    Task<ServiceResult<MealAssignmentResponse>> AssignAsync(
        int clientId,
        AssignMealPlanRequest request,
        int trainerId
    );

    Task<ServiceResult<MealAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateMealAssignmentRequest request,
        int trainerId
    );

    Task<MealStatusResponse?> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request,
        int trainerId
    );
}
