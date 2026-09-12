using backend.Enums;

namespace backend.DTOs.Payments;

public class UpdatePaymentStatusRequest
{
    public PaymentStatus Status { get; set; }
}
