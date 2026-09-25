using backend.Enums;
using backend.Models;

namespace backend.Services.Payments;

public static class PaymentQueryExtensions
{
    public static IQueryable<Payment> ApplyFilters(
        this IQueryable<Payment> query,
        string? search,
        string? status,
        int? month,
        int? year
    )
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(payment => payment.Client.FullName.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            status = status.Trim().ToLower();

            if (status == "paid")
            {
                query = query.Where(payment => payment.Status == PaymentStatus.Paid);
            }
            else if (status == "pending")
            {
                query = query.Where(payment => payment.Status == PaymentStatus.Pending);
            }
        }

        if (month.HasValue)
        {
            query = query.Where(payment => payment.DueDate.Month == month.Value);
        }

        if (year.HasValue)
        {
            query = query.Where(payment => payment.DueDate.Year == year.Value);
        }

        return query;
    }
}
