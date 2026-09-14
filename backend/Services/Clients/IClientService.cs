using backend.DTOs.Clients;
using backend.Services;

namespace backend.Services.Clients;

public interface IClientService
{
    Task<List<ClientResponse>> GetAllAsync(int trainerId);

    Task<ClientResponse?> GetByIdAsync(int id , int trainerId);

    Task<ServiceResult<ClientResponse>> CreateAsync(CreateClientRequest request , int trainerId);

    Task<ServiceResult<ClientResponse>> UpdateAsync(int id, UpdateClientRequest request , int trainerId);

    Task<bool> DeleteAsync(int id , int trainerId);

    Task<ServiceResult<bool>> UpdateCredentialsAsync(
        int id,
        UpdateClientCredentialsRequest request,
        int trainerId
    );
}
