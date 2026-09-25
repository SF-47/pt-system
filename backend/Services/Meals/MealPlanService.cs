using backend.Data;
using backend.DTOs.Common;
using backend.DTOs.Meals;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Meals;

public class MealPlanService : IMealPlanService
{
    private readonly ApplicationDbContext _db;

    public MealPlanService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<MealPlanResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? search
    )
    {
        var query = _db.MealPlans.Where(plan => plan.TrainerId == trainerId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(plan =>
                plan.Name.Contains(search)
                || (plan.Description != null && plan.Description.Contains(search))
            );
        }

        var totalCount = await query.CountAsync();
        var response = new PagedResponse<MealPlanResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return response;
        }

        var plans = await query
            .OrderBy(plan => plan.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(plan => new MealPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Meals = plan
                    .Meals.OrderBy(meal => meal.Position)
                    .Select(meal => new MealResponse
                    {
                        Id = meal.Id,
                        MealPlanId = meal.MealPlanId,
                        Name = meal.Name,
                        Instructions = meal.Instructions,
                        Position = meal.Position,
                    })
                    .ToList(),
            })
            .ToListAsync();

        response.Items = plans;
        return response;
    }

    public async Task<MealPlanResponse?> GetByIdAsync(int id, int trainerId)
    {
        return await _db
            .MealPlans.Include(plan => plan.Meals)
            .Where(plan => plan.Id == id && plan.TrainerId == trainerId)
            .Select(plan => new MealPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Meals = plan
                    .Meals.OrderBy(meal => meal.Position)
                    .Select(meal => new MealResponse
                    {
                        Id = meal.Id,
                        MealPlanId = meal.MealPlanId,
                        Name = meal.Name,
                        Instructions = meal.Instructions,
                        Position = meal.Position,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ServiceResult<MealPlanResponse>> CreateAsync(
        CreateMealPlanRequest request,
        int trainerId
    )
    {
        var positions = request
            .Meals.Select((meal, index) => meal.Position ?? index + 1)
            .OrderBy(position => position);

        if (!positions.SequenceEqual(Enumerable.Range(1, request.Meals.Count)))
        {
            return ServiceResult<MealPlanResponse>.BadRequest(
                "Meal positions must be exactly 1 to N with no duplicates or gaps."
            );
        }

        var plan = new MealPlan
        {
            TrainerId = trainerId,
            Name = request.Name,
            Description = request.Description,
            Meals = request
                .Meals.Select(
                    (meal, index) =>
                        new Meal
                        {
                            Name = meal.Name,
                            Instructions = meal.Instructions,
                            Position = meal.Position ?? index + 1,
                        }
                )
                .ToList(),
        };

        _db.MealPlans.Add(plan);

        await _db.SaveChangesAsync();

        return ServiceResult<MealPlanResponse>.Ok(
            new MealPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Meals = plan
                    .Meals.OrderBy(meal => meal.Position)
                    .Select(meal => new MealResponse
                    {
                        Id = meal.Id,
                        MealPlanId = meal.MealPlanId,
                        Name = meal.Name,
                        Instructions = meal.Instructions,
                        Position = meal.Position,
                    })
                    .ToList(),
            }
        );
    }

    public async Task<MealPlanResponse?> UpdateAsync(
        int id,
        UpdateMealPlanRequest request,
        int trainerId
    )
    {
        var plan = await _db
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan => plan.Id == id && plan.TrainerId == trainerId);

        if (plan is null)
        {
            return null;
        }

        plan.Name = request.Name;
        plan.Description = request.Description;

        await _db.SaveChangesAsync();

        return new MealPlanResponse
        {
            Id = plan.Id,
            TrainerId = plan.TrainerId,
            Name = plan.Name,
            Description = plan.Description,
            CreatedAt = plan.CreatedAt,
            Meals = plan
                .Meals.OrderBy(meal => meal.Position)
                .Select(meal => new MealResponse
                {
                    Id = meal.Id,
                    MealPlanId = meal.MealPlanId,
                    Name = meal.Name,
                    Instructions = meal.Instructions,
                    Position = meal.Position,
                })
                .ToList(),
        };
    }

    public async Task<bool> DeleteAsync(int id, int trainerId)
    {
        var plan = await _db.MealPlans.FirstOrDefaultAsync(plan =>
            plan.Id == id && plan.TrainerId == trainerId
        );

        if (plan is null)
        {
            return false;
        }

        _db.MealPlans.Remove(plan);

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<MealResponse?> AddMealAsync(
        int mealPlanId,
        CreateMealRequest request,
        int trainerId
    )
    {
        var planExists = await _db.MealPlans.AnyAsync(plan =>
            plan.Id == mealPlanId && plan.TrainerId == trainerId
        );

        if (!planExists)
        {
            return null;
        }

        var position =
            request.Position
            ?? (
                await _db
                    .Meals.Where(meal => meal.MealPlanId == mealPlanId)
                    .MaxAsync(meal => (int?)meal.Position)
                ?? 0
            ) + 1;

        var meal = new Meal
        {
            MealPlanId = mealPlanId,
            Name = request.Name,
            Instructions = request.Instructions,
            Position = position,
        };

        _db.Meals.Add(meal);

        var assignments = await _db
            .ClientMealPlans.Where(assignment => assignment.MealPlanId == mealPlanId)
            .ToListAsync();

        foreach (var assignment in assignments)
        {
            var mealStatus = new ClientMealStatus { ClientMealPlanId = assignment.Id, Meal = meal };

            _db.ClientMealStatuses.Add(mealStatus);
        }

        await _db.SaveChangesAsync();

        return new MealResponse
        {
            Id = meal.Id,
            MealPlanId = meal.MealPlanId,
            Name = meal.Name,
            Instructions = meal.Instructions,
            Position = meal.Position,
        };
    }

    public async Task<MealResponse?> UpdateMealAsync(
        int mealId,
        UpdateMealRequest request,
        int trainerId
    )
    {
        var meal = await _db
            .Meals.Include(meal => meal.MealPlan)
            .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.MealPlan.TrainerId == trainerId);

        if (meal is null)
        {
            return null;
        }

        meal.Name = request.Name;
        meal.Instructions = request.Instructions;

        await _db.SaveChangesAsync();

        return new MealResponse
        {
            Id = meal.Id,
            MealPlanId = meal.MealPlanId,
            Name = meal.Name,
            Instructions = meal.Instructions,
            Position = meal.Position,
        };
    }

    public async Task<bool> DeleteMealAsync(int mealId, int trainerId)
    {
        var meal = await _db
            .Meals.Include(meal => meal.MealPlan)
            .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.MealPlan.TrainerId == trainerId);

        if (meal is null)
        {
            return false;
        }

        _db.Meals.Remove(meal);

        var remaining = await _db
            .Meals.Where(other => other.MealPlanId == meal.MealPlanId && other.Id != meal.Id)
            .OrderBy(other => other.Position)
            .ThenBy(other => other.Id)
            .ToListAsync();

        for (var index = 0; index < remaining.Count; index++)
        {
            remaining[index].Position = index + 1;
        }

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<ServiceResult<bool>> ReorderMealsAsync(
        int mealPlanId,
        ReorderRequest request,
        int trainerId
    )
    {
        var planExists = await _db.MealPlans.AnyAsync(plan =>
            plan.Id == mealPlanId && plan.TrainerId == trainerId
        );

        if (!planExists)
        {
            return ServiceResult<bool>.NotFound("Meal plan not found.");
        }

        var meals = await _db.Meals.Where(meal => meal.MealPlanId == mealPlanId).ToListAsync();

        var error = ReorderValidator.Validate(
            request.Items,
            meals.Select(meal => meal.Id).ToList()
        );

        if (error is not null)
        {
            return ServiceResult<bool>.BadRequest(error);
        }

        var positions = request.Items.ToDictionary(item => item.Id, item => item.Position);

        foreach (var meal in meals)
        {
            meal.Position = positions[meal.Id];
        }

        await _db.SaveChangesAsync();

        return ServiceResult<bool>.Ok(true);
    }
}
