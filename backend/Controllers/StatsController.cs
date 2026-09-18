using System.Security.Claims;
using backend.DTOs.Stats;
using backend.Services.Stats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/stats")]
[Authorize(Roles = "Trainer")]
[EnableRateLimiting("authenticated")]
public class StatsController : ControllerBase
{
    private readonly IStatsService _statsService;

    public StatsController(IStatsService statsService)
    {
        _statsService = statsService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsResponse>> GetDashboardStats()
    {
        var trainerId = GetTrainerId();

        if (trainerId is null)
        {
            return Unauthorized();
        }

        var stats = await _statsService.GetDashboardStatsAsync(trainerId.Value);

        return Ok(stats);
    }

    [HttpGet("clients")]
    public async Task<ActionResult<ClientStatsResponse>> GetClientStats()
    {
        var trainerId = GetTrainerId();

        if (trainerId is null)
        {
            return Unauthorized();
        }

        var stats = await _statsService.GetClientStatsAsync(trainerId.Value);

        return Ok(stats);
    }

    [HttpGet("workouts")]
    public async Task<ActionResult<WorkoutStatsResponse>> GetWorkoutStats()
    {
        var trainerId = GetTrainerId();

        if (trainerId is null)
        {
            return Unauthorized();
        }

        var stats = await _statsService.GetWorkoutStatsAsync(trainerId.Value);

        return Ok(stats);
    }

    [HttpGet("meals")]
    public async Task<ActionResult<MealStatsResponse>> GetMealStats()
    {
        var trainerId = GetTrainerId();

        if (trainerId is null)
        {
            return Unauthorized();
        }

        var stats = await _statsService.GetMealStatsAsync(trainerId.Value);

        return Ok(stats);
    }

    [HttpGet("payments")]
    public async Task<ActionResult<PaymentStatsResponse>> GetPaymentStats()
    {
        var trainerId = GetTrainerId();

        if (trainerId is null)
        {
            return Unauthorized();
        }

        var stats = await _statsService.GetPaymentStatsAsync(trainerId.Value);

        return Ok(stats);
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
