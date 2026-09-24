using backend.DTOs.Stats;

namespace backend.Services.Stats;

public interface IStatsService
{
    Task<DashboardStatsResponse> GetDashboardStatsAsync(int trainerId);

    Task<ClientStatsResponse> GetClientStatsAsync(int trainerId);

    Task<List<ClientGrowthPoint>> GetClientGrowthAsync(int trainerId);

    Task<WorkoutStatsResponse> GetWorkoutStatsAsync(int trainerId);

    Task<MealStatsResponse> GetMealStatsAsync(int trainerId);

    Task<PaymentStatsResponse> GetPaymentStatsAsync(
        int trainerId,
        string? search = null,
        string? status = null,
        int? month = null,
        int? year = null
    );
}
