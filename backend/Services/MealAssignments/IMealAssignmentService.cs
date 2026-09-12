using backend.DTOs.MealAssignments;
using backend.Services;

namespace backend.Services.MealAssignments;

public interface IMealAssignmentService
{
    Task<List<MealAssignmentResponse>> GetByClientIdAsync(int clientId);

    Task<ServiceResult<MealAssignmentResponse>> AssignAsync(
        int clientId,
        AssignMealPlanRequest request
    );

    Task<ServiceResult<MealAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateMealAssignmentRequest request
    );

    Task<MealStatusResponse?> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request
    );
}
