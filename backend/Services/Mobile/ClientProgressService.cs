using backend.Data;
using backend.DTOs.Mobile;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Mobile;

public class ClientProgressService : IClientProgressService
{
    private readonly ApplicationDbContext _db;

    public ClientProgressService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ClientProgressResponse> GetProgressAsync(int clientId, string period, DateTime? date)
    {
        var today = DateTime.UtcNow.Date;
        var from = period switch
        {
            "today" => today,
            "week" => today.AddDays(-6),
            "month" => today.AddDays(-29),
            "year" => today.AddDays(-364),
            _ => DateTime.MinValue,
        };
        var to = DateTime.MaxValue;

        if (date is not null)
        {
            from = date.Value.Date;
            to = from.AddDays(1);
        }

        var workouts = _db.ClientWorkoutAssignments.Where(a =>
            a.ClientId == clientId && a.AssignedDate >= from && a.AssignedDate < to
        );

        var mealStatuses = _db.ClientMealStatuses.Where(status =>
            status.ClientMealPlan.ClientId == clientId && status.ClientMealPlan.AssignedDate >= from
            && status.ClientMealPlan.AssignedDate < to
        );

        var response = new ClientProgressResponse
        {
            TotalWorkouts = await workouts.CountAsync(),

            CompletedWorkouts = await workouts.CountAsync(w =>
                w.Status == CompletionStatus.Completed
            ),

            PendingWorkouts = await workouts.CountAsync(w => w.Status == CompletionStatus.Pending),

            SkippedWorkouts = await workouts.CountAsync(w => w.Status == CompletionStatus.Skipped),

            TotalMeals = await mealStatuses.CountAsync(),

            CompletedMeals = await mealStatuses.CountAsync(m =>
                m.Status == CompletionStatus.Completed
            ),

            PendingMeals = await mealStatuses.CountAsync(m => m.Status == CompletionStatus.Pending),

            SkippedMeals = await mealStatuses.CountAsync(m => m.Status == CompletionStatus.Skipped),
        };

        return response;
    }
}
