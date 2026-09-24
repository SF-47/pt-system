using backend.Data;
using backend.DTOs.Stats;
using backend.Enums;
using backend.Services.Payments;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Stats;

public class StatsService : IStatsService
{
    private readonly ApplicationDbContext _db;

    public StatsService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ClientStatsResponse> GetClientStatsAsync(int trainerId)
    {
        var clients = _db.Clients.Where(client => client.TrainerId == trainerId);

        var totalClients = await clients.CountAsync();

        var activeClients = await clients.CountAsync(client => client.IsActive);

        var inactiveClients = await clients.CountAsync(client => !client.IsActive);

        return new ClientStatsResponse
        {
            TotalClients = totalClients,
            ActiveClients = activeClients,
            InactiveClients = inactiveClients,
        };
    }

    public async Task<List<ClientGrowthPoint>> GetClientGrowthAsync(int trainerId)
    {
        var dailyCounts = await _db
            .Clients.Where(client => client.TrainerId == trainerId)
            .GroupBy(client => client.CreatedAt.Date)
            .Select(group => new { Period = group.Key, DailyCount = group.Count() })
            .OrderBy(point => point.Period)
            .ToListAsync();

        var cumulativeCount = 0;
        var growth = new List<ClientGrowthPoint>();

        foreach (var dailyCount in dailyCounts)
        {
            cumulativeCount += dailyCount.DailyCount;

            growth.Add(
                new ClientGrowthPoint
                {
                    Period = DateOnly.FromDateTime(dailyCount.Period),
                    Count = cumulativeCount,
                }
            );
        }

        return growth;
    }

    public async Task<WorkoutStatsResponse> GetWorkoutStatsAsync(int trainerId)
    {
        var workoutPlans = _db.WorkoutPlans.Where(plan => plan.TrainerId == trainerId);

        var assignments = _db.ClientWorkoutAssignments.Where(assignment =>
            assignment.Client.TrainerId == trainerId
        );

        var totalPlans = await workoutPlans.CountAsync();

        var totalAssignments = await assignments.CountAsync();

        var completedAssignments = await assignments.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Completed
        );

        var pendingAssignments = await assignments.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Pending
        );

        var skippedAssignments = await assignments.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Skipped
        );

        return new WorkoutStatsResponse
        {
            TotalPlans = totalPlans,
            TotalAssignments = totalAssignments,
            CompletedAssignments = completedAssignments,
            PendingAssignments = pendingAssignments,
            SkippedAssignments = skippedAssignments,
        };
    }

    public async Task<MealStatsResponse> GetMealStatsAsync(int trainerId)
    {
        var mealPlans = _db.MealPlans.Where(plan => plan.TrainerId == trainerId);

        var assignments = _db.ClientMealPlans.Where(assignment =>
            assignment.Client.TrainerId == trainerId
        );

        var mealStatuses = _db.ClientMealStatuses.Where(status =>
            status.ClientMealPlan.Client.TrainerId == trainerId
        );

        var totalPlans = await mealPlans.CountAsync();

        var totalAssignments = await assignments.CountAsync();

        var completedMeals = await mealStatuses.CountAsync(status =>
            status.Status == CompletionStatus.Completed
        );

        var pendingMeals = await mealStatuses.CountAsync(status =>
            status.Status == CompletionStatus.Pending
        );

        var skippedMeals = await mealStatuses.CountAsync(status =>
            status.Status == CompletionStatus.Skipped
        );

        return new MealStatsResponse
        {
            TotalPlans = totalPlans,
            TotalAssignments = totalAssignments,
            CompletedMeals = completedMeals,
            PendingMeals = pendingMeals,
            SkippedMeals = skippedMeals,
        };
    }

    public async Task<PaymentStatsResponse> GetPaymentStatsAsync(
        int trainerId,
        string? search = null,
        string? status = null,
        int? month = null,
        int? year = null
    )
    {
        var payments = _db
            .Payments.Where(payment => payment.Client.TrainerId == trainerId)
            .ApplyFilters(search, status, month, year);

        var totalPayments = await payments.CountAsync();

        var paidPayments = await payments.CountAsync(payment =>
            payment.Status == PaymentStatus.Paid
        );

        var pendingPayments = await payments.CountAsync(payment =>
            payment.Status == PaymentStatus.Pending
        );

        var totalPaidAmount =
            await payments
                .Where(payment => payment.Status == PaymentStatus.Paid)
                .Select(payment => (decimal?)payment.Amount)
                .SumAsync()
            ?? 0;

        var totalPendingAmount =
            await payments
                .Where(payment => payment.Status == PaymentStatus.Pending)
                .Select(payment => (decimal?)payment.Amount)
                .SumAsync()
            ?? 0;

        return new PaymentStatsResponse
        {
            TotalPayments = totalPayments,
            PaidPayments = paidPayments,
            PendingPayments = pendingPayments,
            TotalPaidAmount = totalPaidAmount,
            TotalPendingAmount = totalPendingAmount,
        };
    }

    public async Task<DashboardStatsResponse> GetDashboardStatsAsync(int trainerId)
    {
        var clients = _db.Clients.Where(client => client.TrainerId == trainerId);

        var workoutPlans = _db.WorkoutPlans.Where(plan => plan.TrainerId == trainerId);

        var mealPlans = _db.MealPlans.Where(plan => plan.TrainerId == trainerId);

        var workoutAssignments = _db.ClientWorkoutAssignments.Where(assignment =>
            assignment.Client.TrainerId == trainerId
        );

        var mealStatuses = _db.ClientMealStatuses.Where(status =>
            status.ClientMealPlan.Client.TrainerId == trainerId
        );

        var payments = _db.Payments.Where(payment => payment.Client.TrainerId == trainerId);

        var totalClients = await clients.CountAsync();

        var activeClients = await clients.CountAsync(client => client.IsActive);

        var totalWorkoutPlans = await workoutPlans.CountAsync();

        var totalMealPlans = await mealPlans.CountAsync();

        var pendingWorkoutAssignments = await workoutAssignments.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Pending
        );

        var pendingMealStatuses = await mealStatuses.CountAsync(status =>
            status.Status == CompletionStatus.Pending
        );

        var pendingPayments = await payments.CountAsync(payment =>
            payment.Status == PaymentStatus.Pending
        );

        var pendingPaymentAmount =
            await payments
                .Where(payment => payment.Status == PaymentStatus.Pending)
                .Select(payment => (decimal?)payment.Amount)
                .SumAsync()
            ?? 0;

        return new DashboardStatsResponse
        {
            TotalClients = totalClients,
            ActiveClients = activeClients,

            TotalWorkoutPlans = totalWorkoutPlans,
            TotalMealPlans = totalMealPlans,

            PendingWorkoutAssignments = pendingWorkoutAssignments,

            PendingMealStatuses = pendingMealStatuses,

            PendingPayments = pendingPayments,
            PendingPaymentAmount = pendingPaymentAmount,
        };
    }
}
