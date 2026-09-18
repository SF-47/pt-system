public class PaymentStatsResponse
{
    public int TotalPayments { get; set; }
    public int PaidPayments { get; set; }
    public int PendingPayments { get; set; }

    public decimal TotalPaidAmount { get; set; }
    public decimal TotalPendingAmount { get; set; }
}
