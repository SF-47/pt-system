using backend.Data;
using backend.DTOs.Common;
using backend.DTOs.Mobile;
using backend.DTOs.WorkoutAssignments;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Mobile;

public class ClientWorkoutService : IClientWorkoutService
{
    private readonly ApplicationDbContext _db;

    public ClientWorkoutService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<MobileWorkoutResponse>> GetWorkoutsAsync(
        int clientId,
        int page,
        int pageSize
    )
    {
        var query = _db.ClientWorkoutAssignments.Where(a => a.ClientId == clientId);
        var totalCount = await query.CountAsync();
        var response = new PagedResponse<MobileWorkoutResponse>
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

        var workouts = await query
            .OrderByDescending(a => a.AssignedDate)
            .ThenByDescending(a => a.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(a => new MobileWorkoutResponse
            {
                AssignmentId = a.Id,
                WorkoutPlanId = a.WorkoutPlanId,
                WorkoutPlanName = a.WorkoutPlan.Name,
                Description = a.WorkoutPlan.Description,
                AssignedDate = a.AssignedDate,
                Status = a.Status,
                CompletedAt = a.CompletedAt,
            })
            .ToListAsync();

        response.Items = workouts;
        return response;
    }

    public async Task<MobileWorkoutDetailsResponse?> GetWorkoutAsync(int assignmentId, int clientId)
    {
        var workout = await _db
            .ClientWorkoutAssignments.Where(a => a.Id == assignmentId && a.ClientId == clientId)
            .Select(a => new MobileWorkoutDetailsResponse
            {
                AssignmentId = a.Id,
                WorkoutPlanId = a.WorkoutPlanId,
                WorkoutPlanName = a.WorkoutPlan.Name,
                Description = a.WorkoutPlan.Description,
                AssignedDate = a.AssignedDate,
                Status = a.Status,
                CompletedAt = a.CompletedAt,

                Exercises = a
                    .WorkoutPlan.Exercises.OrderBy(exercise => exercise.Position)
                    .Select(exercise => new MobileExerciseResponse
                    {
                        Id = exercise.Id,
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

        return workout;
    }

    public async Task<bool> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request,
        int clientId
    )
    {
        var assignment = await _db.ClientWorkoutAssignments.FirstOrDefaultAsync(a =>
            a.Id == assignmentId && a.ClientId == clientId
        );

        if (assignment is null)
        {
            return false;
        }

        assignment.Status = request.Status;

        assignment.CompletedAt =
            request.Status == CompletionStatus.Completed ? DateTime.UtcNow : null;

        await _db.SaveChangesAsync();

        return true;
    }
}
