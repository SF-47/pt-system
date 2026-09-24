using backend.Data;
using backend.DTOs.Activity;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.ClientActivity;

public class ClientActivityService : IClientActivityService
{
    private readonly ApplicationDbContext _db;

    public ClientActivityService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<TrainerClientActivityResponse?> GetByClientIdAsync(
        int clientId,
        int trainerId,
        DateTime date
    )
    {
        var clientExists = await _db.Clients.AnyAsync(client =>
            client.Id == clientId && client.TrainerId == trainerId
        );

        if (!clientExists)
        {
            return null;
        }

        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);
        var isPastDay = dayStart < DateTime.Today;

        var workout = await _db
            .ClientWorkoutAssignments.Where(assignment =>
                assignment.ClientId == clientId
                && assignment.Client.TrainerId == trainerId
                && assignment.AssignedDate >= dayStart
                && assignment.AssignedDate < dayEnd
            )
            .Select(assignment => new
            {
                assignment.Id,
                assignment.WorkoutPlanId,
                WorkoutPlanName = assignment.WorkoutPlan.Name,
                assignment.Status,
                assignment.CompletedAt,
            })
            .FirstOrDefaultAsync();

        var meals = await _db
            .ClientMealStatuses.Where(status =>
                status.ClientMealPlan.ClientId == clientId
                && status.ClientMealPlan.Client.TrainerId == trainerId
                && status.ClientMealPlan.AssignedDate >= dayStart
                && status.ClientMealPlan.AssignedDate < dayEnd
            )
            .OrderBy(status => status.MealId)
            .Select(status => new
            {
                status.Id,
                status.MealId,
                MealName = status.Meal.Name,
                status.Status,
                status.CompletedAt,
            })
            .ToListAsync();

        return new TrainerClientActivityResponse
        {
            Date = dayStart.ToString("yyyy-MM-dd"),
            Workout = workout is null
                ? null
                : new TrainerWorkoutActivityResponse
                {
                    AssignmentId = workout.Id,
                    WorkoutPlanId = workout.WorkoutPlanId,
                    WorkoutPlanName = workout.WorkoutPlanName,
                    Status = (int)workout.Status,
                    IsMissed = isPastDay && workout.Status == CompletionStatus.Pending,
                    CompletedAt = AsUtc(workout.CompletedAt),
                },
            Meals = meals
                .Select(meal => new TrainerMealActivityResponse
                {
                    MealStatusId = meal.Id,
                    MealId = meal.MealId,
                    MealName = meal.MealName,
                    Status = (int)meal.Status,
                    IsMissed = isPastDay && meal.Status == CompletionStatus.Pending,
                    CompletedAt = AsUtc(meal.CompletedAt),
                })
                .ToList(),
        };
    }

    // CompletedAt is written with DateTime.UtcNow but read back with an
    // unspecified kind; mark it UTC so the JSON carries a "Z" and the
    // browser converts it to local time correctly.
    private static DateTime? AsUtc(DateTime? value) =>
        value.HasValue ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
}
