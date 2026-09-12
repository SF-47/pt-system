using backend.Data;
using backend.DTOs.Auth;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Auth;

public class ClientAuthService : IClientAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly IJwtService _jwtService;

    public ClientAuthService(ApplicationDbContext db, IJwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    public async Task<ServiceResult<ClientLoginResponse>> LoginAsync(ClientLoginRequest request)
    {
        var client = await _db.Clients.FirstOrDefaultAsync(client =>
            client.Username == request.Username
        );
        if (client is null)
        {
            return ServiceResult<ClientLoginResponse>.Unauthorized("Invalid username or password.");
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, client.PasswordHash);

        if (!passwordValid)
        {
            return ServiceResult<ClientLoginResponse>.Unauthorized("Invalid username or password.");
        }

        if (!client.IsActive)
        {
            return ServiceResult<ClientLoginResponse>.Unauthorized("Client account is inactive.");
        }

        var token = _jwtService.GenerateClientToken(client.Id, client.Username);

        var response = new ClientLoginResponse
        {
            Token = token,
            ClientId = client.Id,
            FullName = client.FullName,
            Username = client.Username,
        };

        return ServiceResult<ClientLoginResponse>.Ok(response);
    }
}
