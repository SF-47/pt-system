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
    public async Task<ActionResult<ClientProgressResponse>> GetProgress()
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        var response = await _service.GetProgressAsync(clientId.Value);
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
