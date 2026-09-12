using backend.Data;
using backend.DTOs.MealAssignments;
using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.MealAssignments;

public class MealAssignmentService : IMealAssignmentService
{
    private readonly ApplicationDbContext _db;

    public MealAssignmentService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<MealAssignmentResponse>> GetByClientIdAsync(int clientId)
    {
        return await _db
            .ClientMealPlans.Where(assignment => assignment.ClientId == clientId)
            .Select(assignment => new MealAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                MealPlanId = assignment.MealPlanId,
                MealPlanName = assignment.MealPlan.Name,
                AssignedDate = assignment.AssignedDate,

                Meals = assignment
                    .MealStatuses.Select(status => new MealStatusResponse
                    {
                        Id = status.Id,
                        MealId = status.MealId,
                        MealName = status.Meal.Name,
                        Status = status.Status,
                        CompletedAt = status.CompletedAt,
                    })
                    .ToList(),
            })
            .ToListAsync();
    }

    public async Task<ServiceResult<MealAssignmentResponse>> AssignAsync(
        int clientId,
        AssignMealPlanRequest request
    )
    {
        var clientExists = await _db.Clients.AnyAsync(client => client.Id == clientId);

        if (!clientExists)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Client not found.");
        }

        var mealPlan = await _db
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan => plan.Id == request.MealPlanId);

        if (mealPlan is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Meal plan not found.");
        }

        var assignment = new ClientMealPlan
        {
            ClientId = clientId,
            MealPlanId = request.MealPlanId,
            AssignedDate = request.AssignedDate,
        };

        _db.ClientMealPlans.Add(assignment);

        await _db.SaveChangesAsync();

        foreach (var meal in mealPlan.Meals)
        {
            var mealStatus = new ClientMealStatus
            {
                ClientMealPlanId = assignment.Id,
                MealId = meal.Id,
                Status = CompletionStatus.Pending,
                CompletedAt = null,
            };

            _db.ClientMealStatuses.Add(mealStatus);
        }

        await _db.SaveChangesAsync();

        var response = await GetAssignmentByIdAsync(assignment.Id);

        return ServiceResult<MealAssignmentResponse>.Ok(response!);
    }

    public async Task<ServiceResult<MealAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateMealAssignmentRequest request
    )
    {
        var assignment = await _db.ClientMealPlans.FindAsync(assignmentId);

        if (assignment is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Meal assignment not found.");
        }

        var mealPlan = await _db
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan => plan.Id == request.MealPlanId);

        if (mealPlan is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Meal plan not found.");
        }

        bool mealPlanChanged = assignment.MealPlanId != request.MealPlanId;

        assignment.MealPlanId = request.MealPlanId;
        assignment.AssignedDate = request.AssignedDate;

        if (mealPlanChanged)
        {
            var oldStatuses = await _db
                .ClientMealStatuses.Where(status => status.ClientMealPlanId == assignment.Id)
                .ToListAsync();

            _db.ClientMealStatuses.RemoveRange(oldStatuses);

            foreach (var meal in mealPlan.Meals)
            {
                var mealStatus = new ClientMealStatus
                {
                    ClientMealPlanId = assignment.Id,
                    MealId = meal.Id,
                    Status = CompletionStatus.Pending,
                    CompletedAt = null,
                };

                _db.ClientMealStatuses.Add(mealStatus);
            }
        }

        await _db.SaveChangesAsync();

        var response = await GetAssignmentByIdAsync(assignment.Id);

        return ServiceResult<MealAssignmentResponse>.Ok(response!);
    }

    public async Task<MealStatusResponse?> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request
    )
    {
        var mealStatus = await _db
            .ClientMealStatuses.Include(status => status.Meal)
            .FirstOrDefaultAsync(status => status.Id == mealStatusId);

        if (mealStatus is null)
        {
            return null;
        }

        mealStatus.Status = request.Status;

        if (request.Status == CompletionStatus.Completed)
        {
            mealStatus.CompletedAt = DateTime.UtcNow;
        }
        else
        {
            mealStatus.CompletedAt = null;
        }

        await _db.SaveChangesAsync();

        return new MealStatusResponse
        {
            Id = mealStatus.Id,
            MealId = mealStatus.MealId,
            MealName = mealStatus.Meal.Name,
            Status = mealStatus.Status,
            CompletedAt = mealStatus.CompletedAt,
        };
    }

    private async Task<MealAssignmentResponse?> GetAssignmentByIdAsync(int assignmentId)
    {
        return await _db
            .ClientMealPlans.Where(assignment => assignment.Id == assignmentId)
            .Select(assignment => new MealAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                MealPlanId = assignment.MealPlanId,
                MealPlanName = assignment.MealPlan.Name,
                AssignedDate = assignment.AssignedDate,

                Meals = assignment
                    .MealStatuses.Select(status => new MealStatusResponse
                    {
                        Id = status.Id,
                        MealId = status.MealId,
                        MealName = status.Meal.Name,
                        Status = status.Status,
                        CompletedAt = status.CompletedAt,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();
    }
}
