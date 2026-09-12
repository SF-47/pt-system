using backend.DTOs.Clients;
using backend.Services;

namespace backend.Services.Clients;

public interface IClientService
{
    Task<List<ClientResponse>> GetAllAsync();

    Task<ClientResponse?> GetByIdAsync(int id);

    Task<ServiceResult<ClientResponse>> CreateAsync(CreateClientRequest request);

    Task<ServiceResult<ClientResponse>> UpdateAsync(int id, UpdateClientRequest request);

    Task<bool> DeleteAsync(int id);

    Task<ServiceResult<bool>> UpdateCredentialsAsync(
        int id,
        UpdateClientCredentialsRequest request
    );
}
