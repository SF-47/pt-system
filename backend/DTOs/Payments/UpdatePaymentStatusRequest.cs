using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs.Payments;

public class UpdatePaymentStatusRequest
{
    [EnumDataType(typeof(PaymentStatus))]
    public PaymentStatus Status { get; set; }
}
