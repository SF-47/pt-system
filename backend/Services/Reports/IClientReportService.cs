using backend.DTOs.Reports;

namespace backend.Services.Reports;

public interface IClientReportService
{
    Task<ServiceResult<ClientReportResponse>> GetClientReportAsync(
        int trainerId,
        int clientId,
        DateTime startDate,
        DateTime endDate
    );
}
