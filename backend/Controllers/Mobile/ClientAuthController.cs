using backend.DTOs.Auth;
using backend.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client")]
public class ClientAuthController : ControllerBase
{
    private readonly IClientAuthService _clientAuthService;

    public ClientAuthController(IClientAuthService clientAuthService)
    {
        _clientAuthService = clientAuthService;
    }

    [HttpGet("login")]
    public async Task<ActionResult<ClientLoginResponse>> Login(ClientLoginRequest request)
    {
        var result = await _clientAuthService.LoginAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }
}
