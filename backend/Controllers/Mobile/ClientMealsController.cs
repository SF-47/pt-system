using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Common;
using backend.DTOs.MealAssignments;
using backend.DTOs.Mobile;
using backend.Services.Mobile;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/meals")]
[Authorize(Roles = "Client")]
public class ClientMealsController : ControllerBase
{
    private readonly IClientMealService _service;

    public ClientMealsController(IClientMealService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<MobileMealPlanResponse>>> GetMeals([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
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

        var mealPlans = await _service.GetMealsAsync(clientId.Value, page, pageSize);
        return Ok(mealPlans);
    }

    [HttpPatch("{mealStatusId}/status")]
    public async Task<IActionResult> UpdateMealStatus(int mealStatusId, UpdateMealStatusRequest request)
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        var updated = await _service.UpdateMealStatusAsync(mealStatusId, request, clientId.Value);
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
