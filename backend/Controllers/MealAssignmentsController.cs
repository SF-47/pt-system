using backend.DTOs.MealAssignments;
using backend.Services.MealAssignments;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
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
        var assignments = await _mealAssignmentService.GetByClientIdAsync(clientId);

        return Ok(assignments);
    }

    [HttpPost("api/clients/{clientId}/meal-plans")]
    public async Task<ActionResult<MealAssignmentResponse>> Assign(
        int clientId,
        AssignMealPlanRequest request
    )
    {
        var result = await _mealAssignmentService.AssignAsync(clientId, request);

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
        var result = await _mealAssignmentService.UpdateAsync(id, request);

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
        var mealStatus = await _mealAssignmentService.UpdateMealStatusAsync(id, request);

        if (mealStatus is null)
        {
            return NotFound();
        }

        return Ok(mealStatus);
    }
}
