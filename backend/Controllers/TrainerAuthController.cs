using backend.DTOs.Auth;
using backend.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/trainer")]
public class TrainerAuthController : ControllerBase
{
    private readonly ITrainerAuthService _trainerAuthService;

    public TrainerAuthController(ITrainerAuthService trainerAuthService)
    {
        _trainerAuthService = trainerAuthService;
    }

    [EnableRateLimiting("login")]
    [HttpPost("login")]
    public async Task<IActionResult> Login(TrainerLoginRequest request)
    {
        var result = await _trainerAuthService.LoginAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }
}
