using System.Security.Claims;
using backend.Data;
using backend.DTOs.Mobile;
using backend.DTOs.WorkoutAssignments;
using backend.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/workouts")]
[Authorize(Roles = "Client")]
public class ClientWorkoutsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ClientWorkoutsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<MobileWorkoutResponse>>> GetWorkouts()
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

        var workouts = await _db
            .ClientWorkoutAssignments.Where(a => a.ClientId == clientId)
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

        return Ok(workouts);
    }

    [HttpGet("{assignmentId}")]
    public async Task<ActionResult<MobileWorkoutDetailsResponse>> GetWorkout(int assignmentId)
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

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
                    .WorkoutPlan.Exercises.Select(exercise => new MobileExerciseResponse
                    {
                        Id = exercise.Id,
                        Name = exercise.Name,
                        Description = exercise.Description,
                        Sets = exercise.Sets,
                        Reps = exercise.Reps,
                        RestSeconds = exercise.RestSeconds,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync();

        if (workout is null)
        {
            return NotFound();
        }

        return Ok(workout);
    }

    [HttpPatch("{assignmentId}/status")]
    public async Task<IActionResult> UpdateStatus(
        int assignmentId,
        UpdateWorkoutStatusRequest request
    )
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

        var assignment = await _db.ClientWorkoutAssignments.FirstOrDefaultAsync(a =>
            a.Id == assignmentId && a.ClientId == clientId
        );

        if (assignment is null)
        {
            return NotFound();
        }

        assignment.Status = request.Status;

        assignment.CompletedAt =
            request.Status == CompletionStatus.Completed ? DateTime.UtcNow : null;

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
