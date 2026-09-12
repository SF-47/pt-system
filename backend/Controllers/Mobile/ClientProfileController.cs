using System.Security.Claims;
using backend.Data;
using backend.DTOs.Mobile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Mobile;

[ApiController]
[Route("api/client/profile")]
[Authorize(Roles = "Client")]
public class ClientProfileController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ClientProfileController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ClientProfileResponse>> GetProfile()
    {
        var clientIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(clientIdValue, out var clientId))
        {
            return Unauthorized();
        }

        var client = await _db
            .Clients.Where(client => client.Id == clientId)
            .Select(client => new ClientProfileResponse
            {
                Id = client.Id,
                FullName = client.FullName,
                Username = client.Username,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
            })
            .FirstOrDefaultAsync();

        if (client is null)
        {
            return NotFound();
        }

        return Ok(client);
    }
}
