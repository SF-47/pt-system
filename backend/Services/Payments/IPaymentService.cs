using backend.DTOs.Common;
using backend.DTOs.Payments;

namespace backend.Services.Payments;

public interface IPaymentService
{
    Task<PagedResponse<PaymentResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? status
    );

    Task<PagedResponse<PaymentResponse>> GetByClientIdAsync(
        int clientId,
        int trainerId,
        int page,
        int pageSize
    );

    Task<PaymentResponse?> CreateAsync(
        int clientId,
        CreatePaymentRequest request,
        int trainerId
    );

    Task<PaymentResponse?> UpdateStatusAsync(
        int paymentId,
        UpdatePaymentStatusRequest request,
        int trainerId
    );
}
