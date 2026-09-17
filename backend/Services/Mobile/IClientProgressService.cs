using backend.DTOs.Mobile;

namespace backend.Services.Mobile;

public interface IClientProgressService
{
    Task<ClientProgressResponse> GetProgressAsync(int clientId);
}
