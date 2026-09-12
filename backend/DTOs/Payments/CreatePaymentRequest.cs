using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Payments;

public class CreatePaymentRequest
{
    [Range(typeof(decimal), "0.01", "99999999.99")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
}
