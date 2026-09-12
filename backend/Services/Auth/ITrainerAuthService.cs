using backend.DTOs.Auth;
using backend.Services;

namespace backend.Services.Auth;

public interface ITrainerAuthService
{
    Task<ServiceResult<TrainerLoginResponse>> LoginAsync(TrainerLoginRequest request);
}
