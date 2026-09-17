using backend.Data;
using backend.DTOs.Mobile;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Mobile;

public class ClientProfileService : IClientProfileService
{
    private readonly ApplicationDbContext _db;

    public ClientProfileService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<ClientProfileResponse?> GetProfileAsync(int clientId)
    {
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

        return client;
    }
}
