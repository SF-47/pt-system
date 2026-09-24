using backend.DTOs.Progress;

namespace backend.Services.ClientProgress;

public interface IClientProgressService
{
    Task<TrainerClientProgressResponse?> GetByClientIdAsync(
        int clientId,
        int trainerId,
        DateTime? startDate,
        DateTime? endDate
    );
}
