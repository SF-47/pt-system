using backend.DTOs.Workouts;
using backend.Services.Workouts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/workout-plans")]
[Authorize(Roles = "Trainer")]
public class WorkoutPlansController : ControllerBase
{
    private readonly IWorkoutPlanService _workoutPlanService;

    public WorkoutPlansController(IWorkoutPlanService workoutPlanService)
    {
        _workoutPlanService = workoutPlanService;
    }

    [HttpGet]
    public async Task<ActionResult<List<WorkoutPlanResponse>>> GetAll()
    {
        var plans = await _workoutPlanService.GetAllAsync();

        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutPlanResponse>> GetById(int id)
    {
        var plan = await _workoutPlanService.GetByIdAsync(id);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutPlanResponse>> Create(CreateWorkoutPlanRequest request)
    {
        var plan = await _workoutPlanService.CreateAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkoutPlanResponse>> Update(
        int id,
        UpdateWorkoutPlanRequest request
    )
    {
        var plan = await _workoutPlanService.UpdateAsync(id, request);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _workoutPlanService.DeleteAsync(id);

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
        var exercise = await _workoutPlanService.AddExerciseAsync(id, request);

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
        var exercise = await _workoutPlanService.UpdateExerciseAsync(id, request);

        if (exercise is null)
        {
            return NotFound();
        }

        return Ok(exercise);
    }

    [HttpDelete("/api/exercises/{id}")]
    public async Task<IActionResult> DeleteExercise(int id)
    {
        var deleted = await _workoutPlanService.DeleteExerciseAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
