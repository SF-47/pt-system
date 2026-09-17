using backend.Data;
using backend.DTOs.Common;
using backend.DTOs.MealAssignments;
using backend.DTOs.Mobile;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Mobile;

public class ClientMealService : IClientMealService
{
    private readonly ApplicationDbContext _db;

    public ClientMealService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<MobileMealPlanResponse>> GetMealsAsync(
        int clientId,
        int page,
        int pageSize
    )
    {
        var query = _db.ClientMealPlans.Where(a => a.ClientId == clientId);
        var totalCount = await query.CountAsync();
        var response = new PagedResponse<MobileMealPlanResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
        };

        // Calculate in long so large page numbers cannot overflow the offset.
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return response;
        }

        var mealPlans = await query
            .OrderByDescending(a => a.AssignedDate)
            .ThenByDescending(a => a.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(a => new MobileMealPlanResponse
            {
                AssignmentId = a.Id,
                MealPlanId = a.MealPlanId,
                MealPlanName = a.MealPlan.Name,
                Description = a.MealPlan.Description,
                AssignedDate = a.AssignedDate,

                Meals = a
                    .MealStatuses.Select(status => new MobileMealStatusResponse
                    {
                        MealStatusId = status.Id,
                        MealId = status.MealId,
                        MealName = status.Meal.Name,
                        Instructions = status.Meal.Instructions,
                        Status = status.Status,
                        CompletedAt = status.CompletedAt,
                    })
                    .ToList(),
            })
            .ToListAsync();

        response.Items = mealPlans;
        return response;
    }

    public async Task<bool> UpdateMealStatusAsync(
        int mealStatusId,
        UpdateMealStatusRequest request,
        int clientId
    )
    {
        var mealStatus = await _db.ClientMealStatuses.FirstOrDefaultAsync(status =>
            status.Id == mealStatusId && status.ClientMealPlan.ClientId == clientId
        );

        if (mealStatus is null)
        {
            return false;
        }

        mealStatus.Status = request.Status;

        mealStatus.CompletedAt =
            request.Status == CompletionStatus.Completed ? DateTime.UtcNow : null;

        await _db.SaveChangesAsync();

        return true;
    }
}
