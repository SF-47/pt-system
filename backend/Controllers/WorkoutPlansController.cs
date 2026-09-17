using System.Security.Claims;
using backend.DTOs.Workouts;
using backend.Services.Workouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/workout-plans")]
[Authorize(Roles = "Trainer")]
[EnableRateLimiting("authenticated")]
public class WorkoutPlansController : ControllerBase
{
    private readonly IWorkoutPlanService _workoutPlanService;

    public WorkoutPlansController(IWorkoutPlanService workoutPlanService)
    {
        _workoutPlanService = workoutPlanService;
    }

    [HttpGet]
    public async Task<ActionResult<List<WorkoutPlanResponse>>> GetAll(
        int page = 1,
        int pageSize = 10
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        if (page < 1)
        {
            return BadRequest(new { message = "Page must be at least 1." });
        }

        if (pageSize < 1 || pageSize > 50)
        {
            return BadRequest(new { message = "Page size must be between 1 and 50." });
        }
        var result = await _workoutPlanService.GetAllAsync(trainerId.Value, page, pageSize);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutPlanResponse>> GetById(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var plan = await _workoutPlanService.GetByIdAsync(id, trainerId.Value);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutPlanResponse>> Create(CreateWorkoutPlanRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var plan = await _workoutPlanService.CreateAsync(request, trainerId.Value);

        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkoutPlanResponse>> Update(
        int id,
        UpdateWorkoutPlanRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var plan = await _workoutPlanService.UpdateAsync(id, request, trainerId.Value);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var deleted = await _workoutPlanService.DeleteAsync(id, trainerId.Value);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id}/exercises")]
    public async Task<ActionResult<ExerciseResponse>> AddExercise(
        int id,
        CreateExerciseRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var exercise = await _workoutPlanService.AddExerciseAsync(id, request, trainerId.Value);

        if (exercise is null)
        {
            return NotFound();
        }

        return Ok(exercise);
    }

    [HttpPut("/api/exercises/{id}")]
    public async Task<ActionResult<ExerciseResponse>> UpdateExercise(
        int id,
        UpdateExerciseRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var exercise = await _workoutPlanService.UpdateExerciseAsync(id, request, trainerId.Value);

        if (exercise is null)
        {
            return NotFound();
        }

        return Ok(exercise);
    }

    [HttpDelete("/api/exercises/{id}")]
    public async Task<IActionResult> DeleteExercise(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var deleted = await _workoutPlanService.DeleteExerciseAsync(id, trainerId.Value);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private int? GetTrainerId()
    {
        var trainerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(trainerIdClaim, out var trainerId))
        {
            return null;
        }
        return trainerId;
    }
}
