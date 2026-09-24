using backend.Data;
using backend.DTOs.Progress;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.ClientProgress;

public class ClientProgressService : IClientProgressService
{
    private readonly ApplicationDbContext _db;

    public ClientProgressService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<TrainerClientProgressResponse?> GetByClientIdAsync(
        int clientId,
        int trainerId,
        DateTime? startDate,
        DateTime? endDate
    )
    {
        var clientExists = await _db.Clients.AnyAsync(client =>
            client.Id == clientId && client.TrainerId == trainerId
        );

        if (!clientExists)
        {
            return null;
        }

        var today = DateTime.Today;
        var startDay = startDate?.Date;
        var endExclusive = endDate?.Date.AddDays(1);

        var workoutQuery = _db.ClientWorkoutAssignments.Where(assignment =>
            assignment.ClientId == clientId && assignment.Client.TrainerId == trainerId
        );

        if (startDay.HasValue)
        {
            workoutQuery = workoutQuery.Where(assignment =>
                assignment.AssignedDate >= startDay.Value
            );
        }

        if (endExclusive.HasValue)
        {
            workoutQuery = workoutQuery.Where(assignment =>
                assignment.AssignedDate < endExclusive.Value
            );
        }

        var totalWorkouts = await workoutQuery.CountAsync();

        var completedWorkouts = await workoutQuery.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Completed
        );

        var skippedWorkouts = await workoutQuery.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Skipped
        );

        var missedWorkouts = await workoutQuery.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Pending && assignment.AssignedDate < today
        );

        var pendingWorkouts = await workoutQuery.CountAsync(assignment =>
            assignment.Status == CompletionStatus.Pending && assignment.AssignedDate >= today
        );

        var mealQuery = _db.ClientMealStatuses.Where(status =>
            status.ClientMealPlan.ClientId == clientId
            && status.ClientMealPlan.Client.TrainerId == trainerId
        );

        if (startDay.HasValue)
        {
            mealQuery = mealQuery.Where(status =>
                status.ClientMealPlan.AssignedDate >= startDay.Value
            );
        }

        if (endExclusive.HasValue)
        {
            mealQuery = mealQuery.Where(status =>
                status.ClientMealPlan.AssignedDate < endExclusive.Value
            );
        }

        var totalMeals = await mealQuery.CountAsync();

        var completedMeals = await mealQuery.CountAsync(status =>
            status.Status == CompletionStatus.Completed
        );

        var skippedMeals = await mealQuery.CountAsync(status =>
            status.Status == CompletionStatus.Skipped
        );

        var missedMeals = await mealQuery.CountAsync(status =>
            status.Status == CompletionStatus.Pending && status.ClientMealPlan.AssignedDate < today
        );

        var pendingMeals = await mealQuery.CountAsync(status =>
            status.Status == CompletionStatus.Pending && status.ClientMealPlan.AssignedDate >= today
        );

        return new TrainerClientProgressResponse
        {
            TotalWorkouts = totalWorkouts,
            CompletedWorkouts = completedWorkouts,
            PendingWorkouts = pendingWorkouts,
            SkippedWorkouts = skippedWorkouts,
            MissedWorkouts = missedWorkouts,
            WorkoutCompletionRate =
                totalWorkouts == 0
                    ? 0
                    : Math.Round((double)completedWorkouts / totalWorkouts * 100, 2),

            TotalMeals = totalMeals,
            CompletedMeals = completedMeals,
            PendingMeals = pendingMeals,
            SkippedMeals = skippedMeals,
            MissedMeals = missedMeals,
            MealCompletionRate =
                totalMeals == 0 ? 0 : Math.Round((double)completedMeals / totalMeals * 100, 2),
        };
    }
}
