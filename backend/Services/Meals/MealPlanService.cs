using backend.Data;
using backend.DTOs.Meals;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Meals;

public class MealPlanService : IMealPlanService
{
    private readonly ApplicationDbContext _id;

    public MealPlanService(ApplicationDbContext id)
    {
        _id = id;
    }

    public async Task<List<MealPlanResponse>> GetAllAsync(int trainerId)
    {
        return await _id
            .MealPlans.Include(plan => plan.Meals)
            .Where(plan => plan.TrainerId == trainerId)
            .Select(plan => new MealPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Meals = plan
                    .Meals.Select(meal => new MealResponse
                    {
                        Id = meal.Id,
                        MealPlanId = meal.MealPlanId,
                        Name = meal.Name,
                        Instructions = meal.Instructions,
                    })
                    .ToList(),
            })
            .ToListAsync();
    }

    public async Task<MealPlanResponse?> GetByIdAsync(int id, int trainerId)
    {
        return await _id
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
                    .Meals.Select(meal => new MealResponse
                    {
                        Id = meal.Id,
                        MealPlanId = meal.MealPlanId,
                        Name = meal.Name,
                        Instructions = meal.Instructions,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();
    }

    public async Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request, int trainerId)
    {
        var plan = new MealPlan
        {
            TrainerId = trainerId,
            Name = request.Name,
            Description = request.Description,
        };

        _id.MealPlans.Add(plan);

        await _id.SaveChangesAsync();

        return new MealPlanResponse
        {
            Id = plan.Id,
            TrainerId = plan.TrainerId,
            Name = plan.Name,
            Description = plan.Description,
            CreatedAt = plan.CreatedAt,
            Meals = new List<MealResponse>(),
        };
    }

    public async Task<MealPlanResponse?> UpdateAsync(
        int id,
        UpdateMealPlanRequest request,
        int trainerId
    )
    {
        var plan = await _id
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan => plan.Id == id && plan.TrainerId == trainerId);

        if (plan is null)
        {
            return null;
        }

        plan.Name = request.Name;
        plan.Description = request.Description;

        await _id.SaveChangesAsync();

        return new MealPlanResponse
        {
            Id = plan.Id,
            TrainerId = plan.TrainerId,
            Name = plan.Name,
            Description = plan.Description,
            CreatedAt = plan.CreatedAt,
            Meals = plan
                .Meals.Select(meal => new MealResponse
                {
                    Id = meal.Id,
                    MealPlanId = meal.MealPlanId,
                    Name = meal.Name,
                    Instructions = meal.Instructions,
                })
                .ToList(),
        };
    }

    public async Task<bool> DeleteAsync(int id, int trainerId)
    {
        var plan = await _id.MealPlans.FirstOrDefaultAsync(plan =>
            plan.Id == id && plan.TrainerId == trainerId
        );

        if (plan is null)
        {
            return false;
        }

        _id.MealPlans.Remove(plan);

        await _id.SaveChangesAsync();

        return true;
    }

    public async Task<MealResponse?> AddMealAsync(
        int mealPlanId,
        CreateMealRequest request,
        int trainerId
    )
    {
        var planExists = await _id.MealPlans.AnyAsync(plan =>
            plan.Id == mealPlanId && plan.TrainerId == trainerId
        );

        if (!planExists)
        {
            return null;
        }

        var meal = new Meal
        {
            MealPlanId = mealPlanId,
            Name = request.Name,
            Instructions = request.Instructions,
        };

        _id.Meals.Add(meal);

        await _id.SaveChangesAsync();

        return new MealResponse
        {
            Id = meal.Id,
            MealPlanId = meal.MealPlanId,
            Name = meal.Name,
            Instructions = meal.Instructions,
        };
    }

    public async Task<MealResponse?> UpdateMealAsync(
        int mealId,
        UpdateMealRequest request,
        int trainerId
    )
    {
        var meal = await _id
            .Meals.Include(meal => meal.MealPlan)
            .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.MealPlan.TrainerId == trainerId);

        if (meal is null)
        {
            return null;
        }

        meal.Name = request.Name;
        meal.Instructions = request.Instructions;

        await _id.SaveChangesAsync();

        return new MealResponse
        {
            Id = meal.Id,
            MealPlanId = meal.MealPlanId,
            Name = meal.Name,
            Instructions = meal.Instructions,
        };
    }

    public async Task<bool> DeleteMealAsync(int mealId, int trainerId)
    {
        var meal = await _id
            .Meals.Include(meal => meal.MealPlan)
            .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.MealPlan.TrainerId == trainerId);

        if (meal is null)
        {
            return false;
        }

        _id.Meals.Remove(meal);

        await _id.SaveChangesAsync();

        return true;
    }
}
