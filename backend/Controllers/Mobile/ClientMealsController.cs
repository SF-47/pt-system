using System.Security.Claims;
using backend.Data;
using backend.DTOs.MealAssignments;
using backend.DTOs.Mobile;
using backend.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/meals")]
[Authorize(Roles = "Client")]
public class ClientMealsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ClientMealsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<MobileMealPlanResponse>>> GetMeals()
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

        var mealPlans = await _db
            .ClientMealPlans.Where(a => a.ClientId == clientId)
            .Select(a => new MobileMealPlanResponse
            {
                AssignmentId = a.Id,
                MealPlanId = a.MealPlanId,
                MealPlanName = a.MealPlan.Name,
                Description = a.MealPlan.Description,
                AssignedDate = a.AssignedDate,

                Meals = a
                    .MealStatuses.Select(status => new MobileMealStatusResponse
                    {
                        MealStatusId = status.Id,
                        MealId = status.MealId,
                        MealName = status.Meal.Name,
                        Instructions = status.Meal.Instructions,
                        Status = status.Status,
                        CompletedAt = status.CompletedAt,
                    })
                    .ToList(),
            })
            .ToListAsync();

        return Ok(mealPlans);
    }

    [HttpPatch("{mealStatusId}/status")]
    public async Task<IActionResult> UpdateMealStatus(
        int mealStatusId,
        UpdateMealStatusRequest request
    )
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

        var mealStatus = await _db.ClientMealStatuses.FirstOrDefaultAsync(status =>
            status.Id == mealStatusId && status.ClientMealPlan.ClientId == clientId
        );

        if (mealStatus is null)
        {
            return NotFound();
        }

        mealStatus.Status = request.Status;

        mealStatus.CompletedAt =
            request.Status == CompletionStatus.Completed ? DateTime.UtcNow : null;

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
