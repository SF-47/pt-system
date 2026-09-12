namespace backend.DTOs.Payments;

public class CreatePaymentRequest
{
    public decimal Amount { get; set; }

    public DateTime DueDate { get; set; }
}
