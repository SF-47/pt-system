using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Mobile;
using backend.Services.Mobile;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/profile")]
[Authorize(Roles = "Client")]
public class ClientProfileController : ControllerBase
{
    private readonly IClientProfileService _service;

    public ClientProfileController(IClientProfileService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ClientProfileResponse>> GetProfile()
    {
        var clientId = GetClientId();
        if (clientId is null)
        {
            return Unauthorized();
        }

        var client = await _service.GetProfileAsync(clientId.Value);
        if (client is null)
        {
            return NotFound();
        }

        return Ok(client);
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
