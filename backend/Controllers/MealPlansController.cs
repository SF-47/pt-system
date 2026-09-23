using System.Security.Claims;
using backend.DTOs.Common;
using backend.DTOs.Meals;
using backend.Services.Meals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/meal-plans")]
[Authorize(Roles = "Trainer")]
[EnableRateLimiting("authenticated")]
public class MealPlansController : ControllerBase
{
    private readonly IMealPlanService _mealPlanService;

    public MealPlansController(IMealPlanService mealPlanService)
    {
        _mealPlanService = mealPlanService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<MealPlanResponse>>> GetAll(
        int page = 1,
        int pageSize = 10,
        string? search = null
    )
    {
        var trainerId = GetTrainerId();

        if (trainerId is null)
        {
            return Unauthorized();
        }

        if (page < 1)
        {
            return BadRequest(new { message = "Page must be at least 1." });
        }

        if (pageSize < 1 || pageSize > 50)
        {
            return BadRequest(new { message = "Page size must be between 1 and 50." });
        }

        var result = await _mealPlanService.GetAllAsync(trainerId.Value, page, pageSize, search);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MealPlanResponse>> GetById(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var plan = await _mealPlanService.GetByIdAsync(id, trainerId.Value);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpPost]
    public async Task<ActionResult<MealPlanResponse>> Create(CreateMealPlanRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var plan = await _mealPlanService.CreateAsync(request, trainerId.Value);

        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MealPlanResponse>> Update(int id, UpdateMealPlanRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var plan = await _mealPlanService.UpdateAsync(id, request, trainerId.Value);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var deleted = await _mealPlanService.DeleteAsync(id, trainerId.Value);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id}/meals")]
    public async Task<ActionResult<MealResponse>> AddMeal(int id, CreateMealRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var meal = await _mealPlanService.AddMealAsync(id, request, trainerId.Value);

        if (meal is null)
        {
            return NotFound();
        }

        return Ok(meal);
    }

    [HttpPut("/api/meals/{id}")]
    public async Task<ActionResult<MealResponse>> UpdateMeal(int id, UpdateMealRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var meal = await _mealPlanService.UpdateMealAsync(id, request, trainerId.Value);

        if (meal is null)
        {
            return NotFound();
        }

        return Ok(meal);
    }

    [HttpDelete("/api/meals/{id}")]
    public async Task<IActionResult> DeleteMeal(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var deleted = await _mealPlanService.DeleteMealAsync(id, trainerId.Value);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
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
