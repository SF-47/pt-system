using backend.DTOs.Meals;
using backend.Services.Meals;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/meal-plans")]
public class MealPlansController : ControllerBase
{
    private readonly IMealPlanService _mealPlanService;

    public MealPlansController(IMealPlanService mealPlanService)
    {
        _mealPlanService = mealPlanService;
    }

    [HttpGet]
    public async Task<ActionResult<List<MealPlanResponse>>> GetAll()
    {
        var plans = await _mealPlanService.GetAllAsync();

        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MealPlanResponse>> GetById(int id)
    {
        var plan = await _mealPlanService.GetByIdAsync(id);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpPost]
    public async Task<ActionResult<MealPlanResponse>> Create(CreateMealPlanRequest request)
    {
        var plan = await _mealPlanService.CreateAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MealPlanResponse>> Update(int id, UpdateMealPlanRequest request)
    {
        var plan = await _mealPlanService.UpdateAsync(id, request);

        if (plan is null)
        {
            return NotFound();
        }

        return Ok(plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _mealPlanService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id}/meals")]
    public async Task<ActionResult<MealResponse>> AddMeal(int id, CreateMealRequest request)
    {
        var meal = await _mealPlanService.AddMealAsync(id, request);

        if (meal is null)
        {
            return NotFound();
        }

        return Ok(meal);
    }

    [HttpPut("/api/meals/{id}")]
    public async Task<ActionResult<MealResponse>> UpdateMeal(int id, UpdateMealRequest request)
    {
        var meal = await _mealPlanService.UpdateMealAsync(id, request);

        if (meal is null)
        {
            return NotFound();
        }

        return Ok(meal);
    }

    [HttpDelete("/api/meals/{id}")]
    public async Task<IActionResult> DeleteMeal(int id)
    {
        var deleted = await _mealPlanService.DeleteMealAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
