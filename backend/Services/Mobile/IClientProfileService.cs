using backend.DTOs.Mobile;

namespace backend.Services.Mobile;

public interface IClientProfileService
{
    Task<ClientProfileResponse?> GetProfileAsync(int clientId);
}
