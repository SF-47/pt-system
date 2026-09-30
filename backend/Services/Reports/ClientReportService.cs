using backend.Data;
using backend.DTOs.Reports;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Reports;

public class ClientReportService : IClientReportService
{
    private const int MaxRangeDays = 365;

    private readonly ApplicationDbContext _db;

    public ClientReportService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ServiceResult<ClientReportResponse>> GetClientReportAsync(
        int trainerId,
        int clientId,
        DateTime startDate,
        DateTime endDate
    )
    {
        var startDay = startDate.Date;
        var endDay = endDate.Date;

        if (startDay > endDay)
        {
            return ServiceResult<ClientReportResponse>.BadRequest(
                "Start date cannot be after end date."
            );
        }

        if ((endDay - startDay).TotalDays > MaxRangeDays)
        {
            return ServiceResult<ClientReportResponse>.BadRequest(
                $"Date range cannot exceed {MaxRangeDays} days."
            );
        }

        var client = await _db.Clients.FirstOrDefaultAsync(c =>
            c.Id == clientId && c.TrainerId == trainerId
        );

        if (client is null)
        {
            return ServiceResult<ClientReportResponse>.NotFound("Client not found.");
        }

        var endExclusive = endDay.AddDays(1);
        var today = DateTime.Today;

        var workoutAssignments = await _db
            .ClientWorkoutAssignments.Where(assignment =>
                assignment.ClientId == clientId
                && assignment.AssignedDate >= startDay
                && assignment.AssignedDate < endExclusive
            )
            .Select(assignment => new
            {
                assignment.Id,
                assignment.WorkoutPlanId,
                WorkoutPlanName = assignment.WorkoutPlan.Name,
                assignment.AssignedDate,
                assignment.Status,
            })
            .ToListAsync();

        var mealStatuses = await _db
            .ClientMealStatuses.Where(status =>
                status.ClientMealPlan.ClientId == clientId
                && status.ClientMealPlan.AssignedDate >= startDay
                && status.ClientMealPlan.AssignedDate < endExclusive
            )
            .Select(status => new
            {
                status.Id,
                status.MealId,
                MealName = status.Meal.Name,
                AssignedDate = status.ClientMealPlan.AssignedDate,
                status.Status,
            })
            .ToListAsync();

        var payments = await _db
            .Payments.Where(payment =>
                payment.ClientId == clientId
                && payment.DueDate >= startDay
                && payment.DueDate < endExclusive
            )
            .Select(payment => new
            {
                payment.Amount,
                payment.Status,
                payment.DueDate,
            })
            .ToListAsync();

        var totalWorkouts = workoutAssignments.Count;
        var completedWorkouts = workoutAssignments.Count(a =>
            a.Status == CompletionStatus.Completed
        );
        var skippedWorkouts = workoutAssignments.Count(a => a.Status == CompletionStatus.Skipped);
        var missedWorkouts = workoutAssignments.Count(a =>
            a.Status == CompletionStatus.Pending && a.AssignedDate.Date < today
        );
        var pendingWorkouts = workoutAssignments.Count(a =>
            a.Status == CompletionStatus.Pending && a.AssignedDate.Date >= today
        );

        var totalMeals = mealStatuses.Count;
        var completedMeals = mealStatuses.Count(m => m.Status == CompletionStatus.Completed);
        var skippedMeals = mealStatuses.Count(m => m.Status == CompletionStatus.Skipped);
        var missedMeals = mealStatuses.Count(m =>
            m.Status == CompletionStatus.Pending && m.AssignedDate.Date < today
        );
        var pendingMeals = mealStatuses.Count(m =>
            m.Status == CompletionStatus.Pending && m.AssignedDate.Date >= today
        );

        var totalAmount = payments.Sum(p => p.Amount);
        var paidAmount = payments.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.Amount);
        var pendingAmount = payments
            .Where(p => p.Status == PaymentStatus.Pending)
            .Sum(p => p.Amount);
        var overdueCount = payments.Count(p =>
            p.Status == PaymentStatus.Pending && p.DueDate.Date < today
        );

        var dailyMap = new SortedDictionary<
            DateTime,
            (
                ClientReportWorkoutActivityResponse? Workout,
                List<ClientReportMealActivityResponse> Meals
            )
        >();

        foreach (var assignment in workoutAssignments)
        {
            var day = assignment.AssignedDate.Date;

            if (!dailyMap.TryGetValue(day, out var entry))
            {
                entry = (null, new List<ClientReportMealActivityResponse>());
            }

            entry.Workout = new ClientReportWorkoutActivityResponse
            {
                AssignmentId = assignment.Id,
                WorkoutPlanId = assignment.WorkoutPlanId,
                Name = assignment.WorkoutPlanName,
                Status = (int)assignment.Status,
                IsMissed = assignment.Status == CompletionStatus.Pending && day < today,
            };

            dailyMap[day] = entry;
        }

        foreach (var meal in mealStatuses)
        {
            var day = meal.AssignedDate.Date;

            if (!dailyMap.TryGetValue(day, out var entry))
            {
                entry = (null, new List<ClientReportMealActivityResponse>());
            }

            entry.Meals.Add(
                new ClientReportMealActivityResponse
                {
                    MealStatusId = meal.Id,
                    MealId = meal.MealId,
                    Name = meal.MealName,
                    Status = (int)meal.Status,
                    IsMissed = meal.Status == CompletionStatus.Pending && day < today,
                }
            );

            dailyMap[day] = entry;
        }

        var dailyActivity = dailyMap
            .Select(entry => new ClientReportDailyActivityResponse
            {
                Date = entry.Key.ToString("yyyy-MM-dd"),
                Workout = entry.Value.Workout,
                Meals = entry.Value.Meals,
            })
            .ToList();

        var response = new ClientReportResponse
        {
            Client = new ClientReportClientResponse
            {
                Id = client.Id,
                FullName = client.FullName,
                Username = client.Username,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
                IsActive = client.IsActive,
            },
            Period = new ClientReportPeriodResponse
            {
                StartDate = startDay.ToString("yyyy-MM-dd"),
                EndDate = endDay.ToString("yyyy-MM-dd"),
            },
            WorkoutSummary = new ClientReportSummaryResponse
            {
                Total = totalWorkouts,
                Completed = completedWorkouts,
                Pending = pendingWorkouts,
                Skipped = skippedWorkouts,
                Missed = missedWorkouts,
                CompletionRate =
                    totalWorkouts == 0
                        ? 0
                        : Math.Round((double)completedWorkouts / totalWorkouts * 100, 2),
            },
            MealSummary = new ClientReportSummaryResponse
            {
                Total = totalMeals,
                Completed = completedMeals,
                Pending = pendingMeals,
                Skipped = skippedMeals,
                Missed = missedMeals,
                CompletionRate =
                    totalMeals == 0 ? 0 : Math.Round((double)completedMeals / totalMeals * 100, 2),
            },
            PaymentSummary = new ClientReportPaymentSummaryResponse
            {
                TotalAmount = totalAmount,
                PaidAmount = paidAmount,
                PendingAmount = pendingAmount,
                PaymentsCount = payments.Count,
                OverdueCount = overdueCount,
            },
            DailyActivity = dailyActivity,
        };

        return ServiceResult<ClientReportResponse>.Ok(response);
    }
}
