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

    public async Task<List<MealPlanResponse>> GetAllAsync()
    {
        return await _id
            .MealPlans.Include(plan => plan.Meals)
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

    public async Task<MealPlanResponse?> GetByIdAsync(int id)
    {
        return await _id
            .MealPlans.Include(plan => plan.Meals)
            .Where(plan => plan.Id == id)
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

    public async Task<MealPlanResponse> CreateAsync(CreateMealPlanRequest request)
    {
        var plan = new MealPlan
        {
            TrainerId = 1,
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

    public async Task<MealPlanResponse?> UpdateAsync(int id, UpdateMealPlanRequest request)
    {
        var plan = await _id
            .MealPlans.Include(plan => plan.Meals)
            .FirstOrDefaultAsync(plan => plan.Id == id);

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

    public async Task<bool> DeleteAsync(int id)
    {
        var plan = await _id.MealPlans.FindAsync(id);

        if (plan is null)
        {
            return false;
        }

        _id.MealPlans.Remove(plan);

        await _id.SaveChangesAsync();

        return true;
    }

    public async Task<MealResponse?> AddMealAsync(int mealPlanId, CreateMealRequest request)
    {
        var planExists = await _id.MealPlans.AnyAsync(plan => plan.Id == mealPlanId);

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

    public async Task<MealResponse?> UpdateMealAsync(int mealId, UpdateMealRequest request)
    {
        var meal = await _id.Meals.FindAsync(mealId);

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

    public async Task<bool> DeleteMealAsync(int mealId)
    {
        var meal = await _id.Meals.FindAsync(mealId);

        if (meal is null)
        {
            return false;
        }

        _id.Meals.Remove(meal);

        await _id.SaveChangesAsync();

        return true;
    }
}
