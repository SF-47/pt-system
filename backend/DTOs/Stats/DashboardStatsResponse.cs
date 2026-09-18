public class DashboardStatsResponse
{
    public int TotalClients { get; set; }
    public int ActiveClients { get; set; }

    public int TotalWorkoutPlans { get; set; }
    public int TotalMealPlans { get; set; }

    public int PendingWorkoutAssignments { get; set; }
    public int PendingMealStatuses { get; set; }

    public int PendingPayments { get; set; }
    public decimal PendingPaymentAmount { get; set; }
}