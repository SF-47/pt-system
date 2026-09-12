using backend.DTOs.Auth;

namespace backend.Services.Auth;

public interface IClientAuthService
{
    Task<ServiceResult<ClientLoginResponse>> LoginAsync(ClientLoginRequest request);
}
