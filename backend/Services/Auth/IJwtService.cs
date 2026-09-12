namespace backend.Services.Auth;

public interface IJwtService
{
    string GenerateClientToken(int clientId, string username);
}
