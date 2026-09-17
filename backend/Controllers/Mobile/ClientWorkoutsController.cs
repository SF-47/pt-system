using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Common;
using backend.DTOs.Mobile;
using backend.DTOs.WorkoutAssignments;
using backend.Services.Mobile;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/workouts")]
[Authorize(Roles = "Client")]
public class ClientWorkoutsController : ControllerBase
{
    private readonly IClientWorkoutService _service;

    public ClientWorkoutsController(IClientWorkoutService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<MobileWorkoutResponse>>> GetWorkouts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        if (page < 1 || pageSize < 1 || pageSize > 50)
        {
            return BadRequest(new { message = "Page must be at least 1 and pageSize must be between 1 and 50." });
        }

        var workouts = await _service.GetWorkoutsAsync(clientId.Value, page, pageSize);
        return Ok(workouts);
    }

    [HttpGet("{assignmentId}")]
    public async Task<ActionResult<MobileWorkoutDetailsResponse>> GetWorkout(int assignmentId)
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        var workout = await _service.GetWorkoutAsync(assignmentId, clientId.Value);
        if (workout is null)
        {
            return NotFound();
        }

        return Ok(workout);
    }

    [HttpPatch("{assignmentId}/status")]
    public async Task<IActionResult> UpdateStatus(int assignmentId, UpdateWorkoutStatusRequest request)
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        var updated = await _service.UpdateStatusAsync(assignmentId, request, clientId.Value);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    private int? GetClientId()
    {
        var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdClaim, out var clientId))
        {
            return null;
        }

        return clientId;
    }
}
