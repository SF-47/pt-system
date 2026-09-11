using backend.DTOs.Clients;
using backend.Services.Clients;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/clients")]
public class ClientController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ClientResponse>>> GetAll()
    {
        var clients = await _clientService.GetAllAsync();

        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientResponse>> GetById(int id)
    {
        var client = await _clientService.GetByIdAsync(id);

        if (client is null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<ClientResponse>> Create(CreateClientRequest request)
    {
        var client = await _clientService.CreateAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ClientResponse>> Update(int id, UpdateClientRequest request)
    {
        var client = await _clientService.UpdateAsync(id, request);

        if (client is null)
        {
            return NotFound();
        }

        return Ok(client);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _clientService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
