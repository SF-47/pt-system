using backend.DTOs.WorkoutAssignments;
using backend.Services.WorkoutAssignments;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
public class WorkoutAssignmentsController : ControllerBase
{
    private readonly IWorkoutAssignmentService _workoutAssignmentService;

    public WorkoutAssignmentsController(IWorkoutAssignmentService workoutAssignmentService)
    {
        _workoutAssignmentService = workoutAssignmentService;
    }

    [HttpGet("api/clients/{clientId}/workout-plans")]
    public async Task<ActionResult<List<WorkoutAssignmentResponse>>> GetByClientId(int clientId)
    {
        var assignments = await _workoutAssignmentService.GetByClientIdAsync(clientId);

        return Ok(assignments);
    }

    [HttpPost("api/clients/{clientId}/workout-plans")]
    public async Task<ActionResult<WorkoutAssignmentResponse>> Assign(
        int clientId,
        AssignWorkoutPlanRequest request
    )
    {
        var result = await _workoutAssignmentService.AssignAsync(clientId, request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPut("api/client-workout-plans/{id}")]
    public async Task<ActionResult<WorkoutAssignmentResponse>> Update(
        int id,
        UpdateWorkoutAssignmentRequest request
    )
    {
        var result = await _workoutAssignmentService.UpdateAsync(id, request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPut("api/client-workout-plans/{id}/status")]
    public async Task<ActionResult<WorkoutAssignmentResponse>> UpdateStatus(
        int id,
        UpdateWorkoutStatusRequest request
    )
    {
        var assignment = await _workoutAssignmentService.UpdateStatusAsync(id, request);

        if (assignment is null)
        {
            return NotFound();
        }

        return Ok(assignment);
    }
}
