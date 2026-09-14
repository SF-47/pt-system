using backend.DTOs.Payments;

namespace backend.Services.Payments;

public interface IPaymentService
{
    Task<List<PaymentResponse>> GetAllAsync(int trainerId);

    Task<List<PaymentResponse>> GetByClientIdAsync(int clientId, int trainerId);

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
