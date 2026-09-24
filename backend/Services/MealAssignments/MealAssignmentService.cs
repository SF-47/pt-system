using backend.Data;
using backend.DTOs.Common;
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

    public async Task<PagedResponse<MealAssignmentResponse>> GetByClientIdAsync(
        int clientId,
        int trainerId,
        int page,
        int pageSize,
        DateTime? startDate = null,
        DateTime? endDate = null
    )
    {
        var query = _db.ClientMealPlans.Where(assignment =>
            assignment.ClientId == clientId && assignment.Client.TrainerId == trainerId
        );

        if (startDate is not null)
        {
            query = query.Where(assignment => assignment.AssignedDate >= startDate.Value);
        }

        if (endDate is not null)
        {
            query = query.Where(assignment => assignment.AssignedDate <= endDate.Value);
        }

        var totalCount = await query.CountAsync();
        var response = new PagedResponse<MealAssignmentResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        // Calculate in long so large page numbers cannot overflow the offset.
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return response;
        }

        var items = await query
            .OrderByDescending(assignment => assignment.AssignedDate)
            .ThenByDescending(assignment => assignment.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(assignment => new MealAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                MealPlanId = assignment.MealPlanId,
                MealPlanName = assignment.MealPlan.Name,
                MealCount = assignment.MealPlan.Meals.Count,
                AssignedDate = assignment.AssignedDate,

                Meals = assignment
                    .MealStatuses.OrderBy(status => status.Meal.Position)
                    .Select(status => new MealStatusResponse
                    {
                        Id = status.Id,
                        MealId = status.MealId,
                        MealName = status.Meal.Name,
                        Position = status.Meal.Position,
                        Status = status.Status,
                        CompletedAt = status.CompletedAt,
                    })
                    .ToList(),
            })
            .ToListAsync();

        response.Items = items;
        return response;
    }

    public async Task<ServiceResult<MealAssignmentResponse>> AssignAsync(
        int clientId,
        AssignMealPlanRequest request,
        int trainerId
    )
    {
        var client = await _db.Clients.FirstOrDefaultAsync(client =>
            client.Id == clientId && client.TrainerId == trainerId
        );

        if (client is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Client not found.");
        }

        if (!client.IsActive)
        {
            return ServiceResult<MealAssignmentResponse>.BadRequest(
                "This client is inactive and cannot receive new assignments."
            );
        }

        var mealPlan = await _db
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan =>
                plan.Id == request.MealPlanId && plan.TrainerId == trainerId
            );

        if (mealPlan is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Meal plan not found.");
        }

        if (mealPlan.Meals.Count == 0)
        {
            return ServiceResult<MealAssignmentResponse>.BadRequest(
                "Meal plan must contain at least one meal before it can be assigned."
            );
        }

        var dayStart = request.AssignedDate.Date;
        var dayEnd = dayStart.AddDays(1);

        var hasConflict = await _db.ClientMealPlans.AnyAsync(existing =>
            existing.ClientId == clientId
            && existing.AssignedDate >= dayStart
            && existing.AssignedDate < dayEnd
        );

        if (hasConflict)
        {
            return ServiceResult<MealAssignmentResponse>.Conflict(
                "This client already has a meal plan assigned for this day."
            );
        }

        var assignment = new ClientMealPlan
        {
            ClientId = clientId,
            MealPlanId = request.MealPlanId,
            AssignedDate = request.AssignedDate,
        };

        _db.ClientMealPlans.Add(assignment);

        await _db.SaveChangesAsync();

        foreach (var meal in mealPlan.Meals.OrderBy(meal => meal.Position))
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

        var response = await GetAssignmentByIdAsync(assignment.Id, trainerId);

        return ServiceResult<MealAssignmentResponse>.Ok(response!);
    }

    public async Task<ServiceResult<MealAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateMealAssignmentRequest request,
        int trainerId
    )
    {
        var assignment = await _db.ClientMealPlans.FirstOrDefaultAsync(assignment =>
            assignment.Id == assignmentId && assignment.Client.TrainerId == trainerId
        );

        if (assignment is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Meal assignment not found.");
        }

        var mealPlan = await _db
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan =>
                plan.Id == request.MealPlanId && plan.TrainerId == trainerId
            );

        if (mealPlan is null)
        {
            return ServiceResult<MealAssignmentResponse>.NotFound("Meal plan not found.");
        }

        if (mealPlan.Meals.Count == 0)
        {
            return ServiceResult<MealAssignmentResponse>.BadRequest(
                "Meal plan must contain at least one meal before it can be assigned."
            );
        }

        var dayStart = request.AssignedDate.Date;
        var dayEnd = dayStart.AddDays(1);

        var hasConflict = await _db.ClientMealPlans.AnyAsync(existing =>
            existing.Id != assignment.Id
            && existing.ClientId == assignment.ClientId
            && existing.AssignedDate >= dayStart
            && existing.AssignedDate < dayEnd
        );

        if (hasConflict)
        {
            return ServiceResult<MealAssignmentResponse>.Conflict(
                "This client already has a meal plan assigned for this day."
            );
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

            foreach (var meal in mealPlan.Meals.OrderBy(meal => meal.Position))
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

        var response = await GetAssignmentByIdAsync(assignment.Id, trainerId);

        return ServiceResult<MealAssignmentResponse>.Ok(response!);
    }

    public async Task<MealStatusResponse?> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request,
        int trainerId
    )
    {
        var mealStatus = await _db
            .ClientMealStatuses.Include(status => status.Meal)
            .FirstOrDefaultAsync(status =>
                status.Id == mealStatusId && status.ClientMealPlan.Client.TrainerId == trainerId
            );

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
            Position = mealStatus.Meal.Position,
            Status = mealStatus.Status,
            CompletedAt = mealStatus.CompletedAt,
        };
    }

    private async Task<MealAssignmentResponse?> GetAssignmentByIdAsync(
        int assignmentId,
        int trainerId
    )
    {
        return await _db
            .ClientMealPlans.Where(assignment =>
                assignment.Id == assignmentId && assignment.Client.TrainerId == trainerId
            )
            .Select(assignment => new MealAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                MealPlanId = assignment.MealPlanId,
                MealPlanName = assignment.MealPlan.Name,
                MealCount = assignment.MealPlan.Meals.Count,
                AssignedDate = assignment.AssignedDate,

                Meals = assignment
                    .MealStatuses.OrderBy(status => status.Meal.Position)
                    .Select(status => new MealStatusResponse
                    {
                        Id = status.Id,
                        MealId = status.MealId,
                        MealName = status.Meal.Name,
                        Position = status.Meal.Position,
                        Status = status.Status,
                        CompletedAt = status.CompletedAt,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteAsync(int assignmentId, int trainerId)
    {
        var assignment = await _db.ClientMealPlans.FirstOrDefaultAsync(assignment =>
            assignment.Id == assignmentId && assignment.Client.TrainerId == trainerId
        );

        if (assignment is null)
        {
            return false;
        }

        // ClientMealStatuses cascade-delete at the DB level (see
        // FK_ClientMealStatuses_ClientMealPlans_ClientMealPlanId), so no
        // manual cleanup is needed here.
        _db.ClientMealPlans.Remove(assignment);
        await _db.SaveChangesAsync();

        return true;
    }
}
