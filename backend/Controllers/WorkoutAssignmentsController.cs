using System.Security.Claims;
using backend.DTOs.WorkoutAssignments;
using backend.Services.WorkoutAssignments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Authorize(Roles = "Trainer")]
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
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var assignments = await _workoutAssignmentService.GetByClientIdAsync(
            clientId,
            trainerId.Value
        );

        return Ok(assignments);
    }

    [HttpPost("api/clients/{clientId}/workout-plans")]
    public async Task<ActionResult<WorkoutAssignmentResponse>> Assign(
        int clientId,
        AssignWorkoutPlanRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _workoutAssignmentService.AssignAsync(
            clientId,
            request,
            trainerId.Value
        );

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
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _workoutAssignmentService.UpdateAsync(id, request, trainerId.Value);

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
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var assignment = await _workoutAssignmentService.UpdateStatusAsync(
            id,
            request,
            trainerId.Value
        );

        if (assignment is null)
        {
            return NotFound();
        }

        return Ok(assignment);
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
