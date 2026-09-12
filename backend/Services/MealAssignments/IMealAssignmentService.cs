using backend.DTOs.MealAssignments;

namespace backend.Services.MealAssignments;

public interface IMealAssignmentService
{
    Task<List<MealAssignmentResponse>> GetByClientIdAsync(int clientId);

    Task<MealAssignmentResponse?> AssignAsync(int clientId, AssignMealPlanRequest request);

    Task<MealAssignmentResponse?> UpdateAsync(
        int assignmentId,
        UpdateMealAssignmentRequest request
    );

    Task<MealStatusResponse?> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request
    );
}
