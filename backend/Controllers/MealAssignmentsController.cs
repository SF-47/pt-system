using System.Security.Claims;
using backend.DTOs.MealAssignments;
using backend.Services.MealAssignments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize(Roles = "Trainer")]
[EnableRateLimiting("authenticated")]
public class MealAssignmentsController : ControllerBase
{
    private readonly IMealAssignmentService _mealAssignmentService;

    public MealAssignmentsController(IMealAssignmentService mealAssignmentService)
    {
        _mealAssignmentService = mealAssignmentService;
    }

    [HttpGet("api/clients/{clientId}/meal-plans")]
    public async Task<ActionResult<List<MealAssignmentResponse>>> GetByClientId(int clientId)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var assignments = await _mealAssignmentService.GetByClientIdAsync(clientId, trainerId.Value);

        return Ok(assignments);
    }

    [HttpPost("api/clients/{clientId}/meal-plans")]
    public async Task<ActionResult<MealAssignmentResponse>> Assign(
        int clientId,
        AssignMealPlanRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _mealAssignmentService.AssignAsync(clientId, request, trainerId.Value);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPut("api/client-meal-plans/{id}")]
    public async Task<ActionResult<MealAssignmentResponse>> Update(
        int id,
        UpdateMealAssignmentRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _mealAssignmentService.UpdateAsync(id, request, trainerId.Value);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPut("api/client-meal-statuses/{id}/status")]
    public async Task<ActionResult<MealStatusResponse>> UpdateMealStatus(
        int id,
        UpdateMealStatusRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var mealStatus = await _mealAssignmentService.UpdateMealStatusAsync(
            id,
            request,
            trainerId.Value
        );

        if (mealStatus is null)
        {
            return NotFound();
        }

        return Ok(mealStatus);
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
