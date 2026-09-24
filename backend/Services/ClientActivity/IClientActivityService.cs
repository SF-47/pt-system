using backend.DTOs.Activity;

namespace backend.Services.ClientActivity;

public interface IClientActivityService
{
    Task<TrainerClientActivityResponse?> GetByClientIdAsync(
        int clientId,
        int trainerId,
        DateTime date
    );
}
