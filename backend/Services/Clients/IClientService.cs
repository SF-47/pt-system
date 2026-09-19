using backend.DTOs.Clients;
using backend.DTOs.Common;


namespace backend.Services.Clients;

public interface IClientService
{
    Task<PagedResponse<ClientResponse>> GetAllAsync(int trainerId , int page , int pageSize , string search);

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
