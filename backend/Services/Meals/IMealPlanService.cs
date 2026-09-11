using backend.DTOs.Meals;

namespace backend.Services.Meals;

public interface IMealPlanService
{
    Task<List<MealPlanResponse>> GetAllAsync();

    Task<MealPlanResponse?> GetByIdAsync(int id);

    Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request);

    Task<MealPlanResponse?> UpdateAsync(int id, UpdateMealPlanRequest request);

    Task<bool> DeleteAsync(int id);

    Task<MealResponse?> AddMealAsync(int mealPlanId, CreateMealRequest request);

    Task<MealResponse?> UpdateMealAsync(int mealId, UpdateMealRequest request);

    Task<bool> DeleteMealAsync(int mealId);
}
