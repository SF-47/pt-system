using backend.Data;
using backend.DTOs.Common;
using backend.DTOs.Workouts;
using backend.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Workouts;

public class WorkoutPlanService : IWorkoutPlanService
{
    private readonly ApplicationDbContext _db;

    public WorkoutPlanService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<WorkoutPlanResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? search
    )
    {
        var query = _db.WorkoutPlans.Where(plan => plan.TrainerId == trainerId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(plan =>
                plan.Name.Contains(search)
                || (plan.Description != null && plan.Description.Contains(search))
            );
        }

        var totalCount = await query.CountAsync();
        var response = new PagedResponse<WorkoutPlanResponse>
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

        var plans = await query
            .OrderBy(plan => plan.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(plan => new WorkoutPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Exercises = plan
                    .Exercises.OrderBy(exercise => exercise.Position)
                    .Select(exercise => new ExerciseResponse
                    {
                        Id = exercise.Id,
                        WorkoutPlanId = exercise.WorkoutPlanId,
                        Name = exercise.Name,
                        Description = exercise.Description,
                        Sets = exercise.Sets,
                        Reps = exercise.Reps,
                        RestSeconds = exercise.RestSeconds,
                        Position = exercise.Position,
                    })
                    .ToList(),
            })
            .ToListAsync();

        response.Items = plans;
        return response;
    }

    public async Task<WorkoutPlanResponse?> GetByIdAsync(int id, int trainerId)
    {
        return await _db
            .WorkoutPlans.Include(plan => plan.Exercises)
            .Where(plan => plan.Id == id && plan.TrainerId == trainerId)
            .Select(plan => new WorkoutPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Exercises = plan
                    .Exercises.OrderBy(exercise => exercise.Position)
                    .Select(exercise => new ExerciseResponse
                    {
                        Id = exercise.Id,
                        WorkoutPlanId = exercise.WorkoutPlanId,
                        Name = exercise.Name,
                        Description = exercise.Description,
                        Sets = exercise.Sets,
                        Reps = exercise.Reps,
                        RestSeconds = exercise.RestSeconds,
                        Position = exercise.Position,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();
    }

    public async Task<WorkoutPlanResponse> CreateAsync(
        CreateWorkoutPlanRequest request,
        int trainerId
    )
    {
        var plan = new WorkoutPlan
        {
            TrainerId = trainerId,
            Name = request.Name,
            Description = request.Description,
        };

        _db.WorkoutPlans.Add(plan);

        await _db.SaveChangesAsync();

        return new WorkoutPlanResponse
        {
            Id = plan.Id,
            TrainerId = plan.TrainerId,
            Name = plan.Name,
            Description = plan.Description,
            CreatedAt = plan.CreatedAt,
            Exercises = new List<ExerciseResponse>(),
        };
    }

    public async Task<WorkoutPlanResponse?> UpdateAsync(
        int id,
        UpdateWorkoutPlanRequest request,
        int trainerId
    )
    {
        var plan = await _db
            .WorkoutPlans.Include(plan => plan.Exercises)
            .FirstOrDefaultAsync(plan => plan.Id == id && plan.TrainerId == trainerId);

        if (plan is null)
        {
            return null;
        }

        plan.Name = request.Name;
        plan.Description = request.Description;

        await _db.SaveChangesAsync();

        return new WorkoutPlanResponse
        {
            Id = plan.Id,
            TrainerId = plan.TrainerId,
            Name = plan.Name,
            Description = plan.Description,
            CreatedAt = plan.CreatedAt,
            Exercises = plan
                .Exercises.OrderBy(exercise => exercise.Position)
                .Select(exercise => new ExerciseResponse
                {
                    Id = exercise.Id,
                    WorkoutPlanId = exercise.WorkoutPlanId,
                    Name = exercise.Name,
                    Description = exercise.Description,
                    Sets = exercise.Sets,
                    Reps = exercise.Reps,
                    RestSeconds = exercise.RestSeconds,
                    Position = exercise.Position,
                })
                .ToList(),
        };
    }

    public async Task<bool> DeleteAsync(int id, int trainerId)
    {
        var plan = await _db.WorkoutPlans.FirstOrDefaultAsync(plan =>
            plan.Id == id && plan.TrainerId == trainerId
        );

        if (plan is null)
        {
            return false;
        }

        _db.WorkoutPlans.Remove(plan);

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<ExerciseResponse?> AddExerciseAsync(
        int workoutPlanId,
        CreateExerciseRequest request,
        int trainerId
    )
    {
        var planExists = await _db.WorkoutPlans.AnyAsync(plan =>
            plan.Id == workoutPlanId && plan.TrainerId == trainerId
        );

        if (!planExists)
        {
            return null;
        }

        var position =
            request.Position
            ?? (
                await _db
                    .Exercises.Where(exercise => exercise.WorkoutPlanId == workoutPlanId)
                    .MaxAsync(exercise => (int?)exercise.Position)
                ?? 0
            ) + 1;

        var exercise = new Exercise
        {
            WorkoutPlanId = workoutPlanId,
            Name = request.Name,
            Description = request.Description,
            Sets = request.Sets,
            Reps = request.Reps,
            RestSeconds = request.RestSeconds,
            Position = position,
        };

        _db.Exercises.Add(exercise);

        await _db.SaveChangesAsync();

        return new ExerciseResponse
        {
            Id = exercise.Id,
            WorkoutPlanId = exercise.WorkoutPlanId,
            Name = exercise.Name,
            Description = exercise.Description,
            Sets = exercise.Sets,
            Reps = exercise.Reps,
            RestSeconds = exercise.RestSeconds,
            Position = exercise.Position,
        };
    }

    public async Task<ExerciseResponse?> UpdateExerciseAsync(
        int exerciseId,
        UpdateExerciseRequest request,
        int trainerId
    )
    {
        var exercise = await _db
            .Exercises.Include(exercise => exercise.WorkoutPlan)
            .FirstOrDefaultAsync(exercise =>
                exercise.Id == exerciseId && exercise.WorkoutPlan.TrainerId == trainerId
            );

        if (exercise is null)
        {
            return null;
        }

        exercise.Name = request.Name;
        exercise.Description = request.Description;
        exercise.Sets = request.Sets;
        exercise.Reps = request.Reps;
        exercise.RestSeconds = request.RestSeconds;

        await _db.SaveChangesAsync();

        return new ExerciseResponse
        {
            Id = exercise.Id,
            WorkoutPlanId = exercise.WorkoutPlanId,
            Name = exercise.Name,
            Description = exercise.Description,
            Sets = exercise.Sets,
            Reps = exercise.Reps,
            RestSeconds = exercise.RestSeconds,
            Position = exercise.Position,
        };
    }

    public async Task<bool> DeleteExerciseAsync(int exerciseId, int trainerId)
    {
        var exercise = await _db
            .Exercises.Include(exercise => exercise.WorkoutPlan)
            .FirstOrDefaultAsync(exercise =>
                exercise.Id == exerciseId && exercise.WorkoutPlan.TrainerId == trainerId
            );

        if (exercise is null)
        {
            return false;
        }

        _db.Exercises.Remove(exercise);

        var remaining = await _db
            .Exercises.Where(other =>
                other.WorkoutPlanId == exercise.WorkoutPlanId && other.Id != exercise.Id
            )
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

    public async Task<ServiceResult<bool>> ReorderExercisesAsync(
        int workoutPlanId,
        ReorderRequest request,
        int trainerId
    )
    {
        var planExists = await _db.WorkoutPlans.AnyAsync(plan =>
            plan.Id == workoutPlanId && plan.TrainerId == trainerId
        );

        if (!planExists)
        {
            return ServiceResult<bool>.NotFound("Workout plan not found.");
        }

        var exercises = await _db
            .Exercises.Where(exercise => exercise.WorkoutPlanId == workoutPlanId)
            .ToListAsync();

        var error = ReorderValidator.Validate(
            request.Items,
            exercises.Select(exercise => exercise.Id).ToList()
        );

        if (error is not null)
        {
            return ServiceResult<bool>.BadRequest(error);
        }

        var positions = request.Items.ToDictionary(item => item.Id, item => item.Position);

        foreach (var exercise in exercises)
        {
            exercise.Position = positions[exercise.Id];
        }

        await _db.SaveChangesAsync();

        return ServiceResult<bool>.Ok(true);
    }
}
