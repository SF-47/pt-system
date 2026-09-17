using backend.DTOs.Common;
using backend.DTOs.MealAssignments;
using backend.DTOs.Mobile;

namespace backend.Services.Mobile;

public interface IClientMealService
{
    Task<PagedResponse<MobileMealPlanResponse>> GetMealsAsync(int clientId, int page, int pageSize);

    Task<bool> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request,
        int clientId
    );
}
