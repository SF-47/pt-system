using backend.DTOs.Payments;

namespace backend.Services.Payments;

public interface IPaymentService
{
    Task<List<PaymentResponse>> GetAllAsync();

    Task<List<PaymentResponse>> GetByClientIdAsync(int clientId);

    Task<PaymentResponse?> CreateAsync(int clientId, CreatePaymentRequest request);

    Task<PaymentResponse?> UpdateStatusAsync(int paymentId, UpdatePaymentStatusRequest request);
}
