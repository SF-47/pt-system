using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using backend.DTOs.Mobile;
using backend.Services.Mobile;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/progress")]
[Authorize(Roles = "Client")]
[EnableRateLimiting("authenticated")]
public class ClientProgressController : ControllerBase
{
    private readonly IClientProgressService _service;

    public ClientProgressController(IClientProgressService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ClientProgressResponse>> GetProgress([FromQuery] string period = "all", [FromQuery] DateTime? date = null)
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        var allowedPeriods = new[] { "all", "today", "week", "month", "year" };
        period = period.Trim().ToLowerInvariant();
        if (!allowedPeriods.Contains(period))
        {
            return BadRequest(new { message = "Period must be one of: all, today, week, month, year." });
        }

        var response = await _service.GetProgressAsync(clientId.Value, period, date);
        return Ok(response);
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
