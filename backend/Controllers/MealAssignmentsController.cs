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
        var assignment = await _mealAssignmentService.AssignAsync(clientId, request);

        if (assignment is null)
        {
            return NotFound();
        }

        return Ok(assignment);
    }

    [HttpPut("api/client-meal-plans/{id}")]
    public async Task<ActionResult<MealAssignmentResponse>> Update(
        int id,
        UpdateMealAssignmentRequest request
    )
    {
        var assignment = await _mealAssignmentService.UpdateAsync(id, request);

        if (assignment is null)
        {
            return NotFound();
        }

        return Ok(assignment);
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
