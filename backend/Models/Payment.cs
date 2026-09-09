using backend.Enums;

namespace backend.Models;

public class Payment
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public decimal Amount { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public DateTime DueDate { get; set; }

    public DateTime? PaidAt { get; set; }

    public Client Client { get; set; } = null!;
}
