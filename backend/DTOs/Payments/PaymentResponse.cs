using backend.Enums;

namespace backend.DTOs.Payments;

public class PaymentResponse
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public string ClientName { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public PaymentStatus Status { get; set; }

    public DateTime DueDate { get; set; }

    public DateTime? PaidAt { get; set; }
}
