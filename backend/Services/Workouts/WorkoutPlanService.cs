using backend.Data;
using backend.DTOs.Workouts;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Workouts;

public class WorkoutPlanService : IWorkoutPlanService
{
    private readonly ApplicationDbContext _context;

    public WorkoutPlanService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkoutPlanResponse>> GetAllAsync()
    {
        return await _context
            .WorkoutPlans.Include(plan => plan.Exercises)
            .Select(plan => new WorkoutPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Exercises = plan
                    .Exercises.Select(exercise => new ExerciseResponse
                    {
                        Id = exercise.Id,
                        WorkoutPlanId = exercise.WorkoutPlanId,
                        Name = exercise.Name,
                        Description = exercise.Description,
                        Sets = exercise.Sets,
                        Reps = exercise.Reps,
                        RestSeconds = exercise.RestSeconds,
                    })
                    .ToList(),
            })
            .ToListAsync();
    }

    public async Task<WorkoutPlanResponse?> GetByIdAsync(int id)
    {
        return await _context
            .WorkoutPlans.Include(plan => plan.Exercises)
            .Where(plan => plan.Id == id)
            .Select(plan => new WorkoutPlanResponse
            {
                Id = plan.Id,
                TrainerId = plan.TrainerId,
                Name = plan.Name,
                Description = plan.Description,
                CreatedAt = plan.CreatedAt,
                Exercises = plan
                    .Exercises.Select(exercise => new ExerciseResponse
                    {
                        Id = exercise.Id,
                        WorkoutPlanId = exercise.WorkoutPlanId,
                        Name = exercise.Name,
                        Description = exercise.Description,
                        Sets = exercise.Sets,
                        Reps = exercise.Reps,
                        RestSeconds = exercise.RestSeconds,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();
    }

    public async Task<WorkoutPlanResponse> CreateAsync(CreateWorkoutPlanRequest request)
    {
        var plan = new WorkoutPlan
        {
            TrainerId = 1,
            Name = request.Name,
            Description = request.Description,
        };

        _context.WorkoutPlans.Add(plan);

        await _context.SaveChangesAsync();

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

    public async Task<WorkoutPlanResponse?> UpdateAsync(int id, UpdateWorkoutPlanRequest request)
    {
        var plan = await _context
            .WorkoutPlans.Include(plan => plan.Exercises)
            .FirstOrDefaultAsync(plan => plan.Id == id);

        if (plan is null)
        {
            return null;
        }

        plan.Name = request.Name;
        plan.Description = request.Description;

        await _context.SaveChangesAsync();

        return new WorkoutPlanResponse
        {
            Id = plan.Id,
            TrainerId = plan.TrainerId,
            Name = plan.Name,
            Description = plan.Description,
            CreatedAt = plan.CreatedAt,
            Exercises = plan
                .Exercises.Select(exercise => new ExerciseResponse
                {
                    Id = exercise.Id,
                    WorkoutPlanId = exercise.WorkoutPlanId,
                    Name = exercise.Name,
                    Description = exercise.Description,
                    Sets = exercise.Sets,
                    Reps = exercise.Reps,
                    RestSeconds = exercise.RestSeconds,
                })
                .ToList(),
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var plan = await _context.WorkoutPlans.FindAsync(id);

        if (plan is null)
        {
            return false;
        }

        _context.WorkoutPlans.Remove(plan);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<ExerciseResponse?> AddExerciseAsync(
        int workoutPlanId,
        CreateExerciseRequest request
    )
    {
        var planExists = await _context.WorkoutPlans.AnyAsync(plan => plan.Id == workoutPlanId);

        if (!planExists)
        {
            return null;
        }

        var exercise = new Exercise
        {
            WorkoutPlanId = workoutPlanId,
            Name = request.Name,
            Description = request.Description,
            Sets = request.Sets,
            Reps = request.Reps,
            RestSeconds = request.RestSeconds,
        };

        _context.Exercises.Add(exercise);

        await _context.SaveChangesAsync();

        return new ExerciseResponse
        {
            Id = exercise.Id,
            WorkoutPlanId = exercise.WorkoutPlanId,
            Name = exercise.Name,
            Description = exercise.Description,
            Sets = exercise.Sets,
            Reps = exercise.Reps,
            RestSeconds = exercise.RestSeconds,
        };
    }

    public async Task<ExerciseResponse?> UpdateExerciseAsync(
        int exerciseId,
        UpdateExerciseRequest request
    )
    {
        var exercise = await _context.Exercises.FindAsync(exerciseId);

        if (exercise is null)
        {
            return null;
        }

        exercise.Name = request.Name;
        exercise.Description = request.Description;
        exercise.Sets = request.Sets;
        exercise.Reps = request.Reps;
        exercise.RestSeconds = request.RestSeconds;

        await _context.SaveChangesAsync();

        return new ExerciseResponse
        {
            Id = exercise.Id,
            WorkoutPlanId = exercise.WorkoutPlanId,
            Name = exercise.Name,
            Description = exercise.Description,
            Sets = exercise.Sets,
            Reps = exercise.Reps,
            RestSeconds = exercise.RestSeconds,
        };
    }

    public async Task<bool> DeleteExerciseAsync(int exerciseId)
    {
        var exercise = await _context.Exercises.FindAsync(exerciseId);

        if (exercise is null)
        {
            return false;
        }

        _context.Exercises.Remove(exercise);

        await _context.SaveChangesAsync();

        return true;
    }
}
