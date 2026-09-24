using System.Security.Claims;
using backend.DTOs.Clients;
using backend.DTOs.Common;
using backend.DTOs.Progress;
using backend.Services.Clients;
using TrainerProgressService = backend.Services.ClientProgress.IClientProgressService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/clients")]
[Authorize(Roles = "Trainer")]
[EnableRateLimiting("authenticated")]
public class ClientController : ControllerBase
{
    private readonly IClientService _clientService;
    private readonly TrainerProgressService _progressService;

    public ClientController(
        IClientService clientService,
        TrainerProgressService progressService
    )
    {
        _clientService = clientService;
        _progressService = progressService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<ClientResponse>>> GetAll(
        int page = 1,
        int pageSize = 5,
        string? search = null,
        string? status = null
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
        var result = await _clientService.GetAllAsync(
            trainerId.Value,
            page,
            pageSize,
            search,
            status
        );

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientResponse>> GetById(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var client = await _clientService.GetByIdAsync(id, trainerId.Value);

        if (client is null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<ClientResponse>> Create(CreateClientRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _clientService.CreateAsync(request, trainerId.Value);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ClientResponse>> Update(int id, UpdateClientRequest request)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _clientService.UpdateAsync(id, request, trainerId.Value);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var deleted = await _clientService.DeleteAsync(id, trainerId.Value);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id}/credentials")]
    public async Task<IActionResult> UpdateCredentials(
        int id,
        UpdateClientCredentialsRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var result = await _clientService.UpdateCredentialsAsync(id, request, trainerId.Value);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return NoContent();
    }

    [HttpGet("{clientId}/progress")]
    public async Task<ActionResult<TrainerClientProgressResponse>> GetProgress(
        int clientId,
        DateTime? startDate = null,
        DateTime? endDate = null
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }

        if (startDate is not null && endDate is not null && startDate > endDate)
        {
            return BadRequest(new { message = "Start date cannot be after end date." });
        }

        var progress = await _progressService.GetByClientIdAsync(
            clientId,
            trainerId.Value,
            startDate,
            endDate
        );

        if (progress is null)
        {
            return NotFound(new { message = "Client not found." });
        }

        return Ok(progress);
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
