using backend.DTOs.Clients;

namespace backend.Services.Clients;

public interface IClientService
{
    Task<List<ClientResponse>> GetAllAsync();

    Task<ClientResponse?> GetByIdAsync(int id);

    Task<ClientResponse> CreateAsync(CreateClientRequest request);

    Task<ClientResponse?> UpdateAsync(int id, UpdateClientRequest request);

    Task<bool> DeleteAsync(int id);
}