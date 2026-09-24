using backend.DTOs.Common;
using backend.DTOs.Meals;

namespace backend.Services.Meals;

public interface IMealPlanService
{
    Task<PagedResponse<MealPlanResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? search
    );

    Task<MealPlanResponse?> GetByIdAsync(int id, int trainerId);

    Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request, int trainerId);

    Task<MealPlanResponse?> UpdateAsync(int id, UpdateMealPlanRequest request, int trainerId);

    Task<bool> DeleteAsync(int id, int trainerId);

    Task<MealResponse?> AddMealAsync(int mealPlanId, CreateMealRequest request, int trainerId);

    Task<MealResponse?> UpdateMealAsync(int mealId, UpdateMealRequest request, int trainerId);

    Task<bool> DeleteMealAsync(int mealId, int trainerId);

    Task<ServiceResult<bool>> ReorderMealsAsync(
        int mealPlanId,
        ReorderRequest request,
        int trainerId
    );
}
