using System.Security.Claims;
using backend.Data;
using backend.DTOs.Mobile;
using backend.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/progress")]
[Authorize(Roles = "Client")]
public class ClientProgressController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ClientProgressController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ClientProgressResponse>> GetProgress()
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

        var workouts = _db.ClientWorkoutAssignments.Where(a => a.ClientId == clientId);

        var mealStatuses = _db.ClientMealStatuses.Where(status =>
            status.ClientMealPlan.ClientId == clientId
        );

        var response = new ClientProgressResponse
        {
            TotalWorkouts = await workouts.CountAsync(),

            CompletedWorkouts = await workouts.CountAsync(w =>
                w.Status == CompletionStatus.Completed
            ),

            PendingWorkouts = await workouts.CountAsync(w => w.Status == CompletionStatus.Pending),

            SkippedWorkouts = await workouts.CountAsync(w => w.Status == CompletionStatus.Skipped),

            TotalMeals = await mealStatuses.CountAsync(),

            CompletedMeals = await mealStatuses.CountAsync(m =>
                m.Status == CompletionStatus.Completed
            ),

            PendingMeals = await mealStatuses.CountAsync(m => m.Status == CompletionStatus.Pending),

            SkippedMeals = await mealStatuses.CountAsync(m => m.Status == CompletionStatus.Skipped),
        };

        return Ok(response);
    }
}
