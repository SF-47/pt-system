namespace backend.DTOs.Reports;

public class ClientReportResponse
{
    public ClientReportClientResponse Client { get; set; } = null!;
    public ClientReportPeriodResponse Period { get; set; } = null!;
    public ClientReportSummaryResponse WorkoutSummary { get; set; } = null!;
    public ClientReportSummaryResponse MealSummary { get; set; } = null!;
    public ClientReportPaymentSummaryResponse PaymentSummary { get; set; } = null!;
    public List<ClientReportDailyActivityResponse> DailyActivity { get; set; } = new();
}

public class ClientReportClientResponse
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class ClientReportPeriodResponse
{
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
}

public class ClientReportSummaryResponse
{
    public int Total { get; set; }
    public int Completed { get; set; }
    public int Pending { get; set; }
    public int Skipped { get; set; }
    public int Missed { get; set; }
    public double CompletionRate { get; set; }
}

public class ClientReportPaymentSummaryResponse
{
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal PendingAmount { get; set; }
    public int PaymentsCount { get; set; }
    public int OverdueCount { get; set; }
}

public class ClientReportDailyActivityResponse
{
    public string Date { get; set; } = string.Empty;
    public ClientReportWorkoutActivityResponse? Workout { get; set; }
    public List<ClientReportMealActivityResponse> Meals { get; set; } = new();
}

public class ClientReportWorkoutActivityResponse
{
    public int AssignmentId { get; set; }
    public int WorkoutPlanId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Status { get; set; }
    public bool IsMissed { get; set; }
}

public class ClientReportMealActivityResponse
{
    public int MealStatusId { get; set; }
    public int MealId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Status { get; set; }
    public bool IsMissed { get; set; }
}
