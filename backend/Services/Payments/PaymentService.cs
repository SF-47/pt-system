using backend.Data;
using backend.DTOs.Common;
using backend.DTOs.Payments;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Payments;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _db;

    public PaymentService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<PaymentResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? search,
        string? status,
        int? month,
        int? year
    )
    {
        var query = _db
            .Payments.Where(payment => payment.Client.TrainerId == trainerId)
            .ApplyFilters(search, status, month, year);

        var totalCount = await query.CountAsync();
        var response = new PagedResponse<PaymentResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        // Calculate in long so large page numbers cannot overflow the offset.
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return response;
        }

        var items = await query
            .OrderByDescending(payment => payment.DueDate)
            .ThenByDescending(payment => payment.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(payment => new PaymentResponse
            {
                Id = payment.Id,
                ClientId = payment.ClientId,
                ClientName = payment.Client.FullName,
                Amount = payment.Amount,
                Status = payment.Status,
                DueDate = payment.DueDate,
                PaidAt = payment.PaidAt,
            })
            .ToListAsync();

        response.Items = items;
        return response;
    }

    public async Task<PagedResponse<PaymentResponse>> GetByClientIdAsync(
        int clientId,
        int trainerId,
        int page,
        int pageSize
    )
    {
        var query = _db
            .Payments.Where(payment =>
                payment.ClientId == clientId && payment.Client.TrainerId == trainerId
            );
        var totalCount = await query.CountAsync();
        var response = new PagedResponse<PaymentResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        // Calculate in long so large page numbers cannot overflow the offset.
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return response;
        }

        var items = await query
            .OrderByDescending(payment => payment.DueDate)
            .ThenByDescending(payment => payment.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(payment => new PaymentResponse
            {
                Id = payment.Id,
                ClientId = payment.ClientId,
                ClientName = payment.Client.FullName,
                Amount = payment.Amount,
                Status = payment.Status,
                DueDate = payment.DueDate,
                PaidAt = payment.PaidAt,
            })
            .ToListAsync();

        response.Items = items;
        return response;
    }

    public async Task<PaymentResponse?> CreateAsync(
        int clientId,
        CreatePaymentRequest request,
        int trainerId
    )
    {
        var client = await _db.Clients.FirstOrDefaultAsync(client =>
            client.Id == clientId && client.TrainerId == trainerId
        );

        if (client is null)
        {
            return null;
        }

        var payment = new Payment
        {
            ClientId = clientId,
            Amount = request.Amount,
            DueDate = request.DueDate,
            Status = PaymentStatus.Pending,
            PaidAt = null,
        };

        _db.Payments.Add(payment);

        await _db.SaveChangesAsync();

        return new PaymentResponse
        {
            Id = payment.Id,
            ClientId = payment.ClientId,
            ClientName = client.FullName,
            Amount = payment.Amount,
            Status = payment.Status,
            DueDate = payment.DueDate,
            PaidAt = payment.PaidAt,
        };
    }

    public async Task<PaymentResponse?> UpdateStatusAsync(
        int paymentId,
        UpdatePaymentStatusRequest request,
        int trainerId
    )
    {
        var payment = await _db
            .Payments.Include(payment => payment.Client)
            .FirstOrDefaultAsync(payment =>
                payment.Id == paymentId && payment.Client.TrainerId == trainerId
            );

        if (payment is null)
        {
            return null;
        }

        payment.Status = request.Status;

        if (request.Status == PaymentStatus.Paid)
        {
            payment.PaidAt = DateTime.UtcNow;
        }
        else
        {
            payment.PaidAt = null;
        }

        await _db.SaveChangesAsync();

        return new PaymentResponse
        {
            Id = payment.Id,
            ClientId = payment.ClientId,
            ClientName = payment.Client.FullName,
            Amount = payment.Amount,
            Status = payment.Status,
            DueDate = payment.DueDate,
            PaidAt = payment.PaidAt,
        };
    }
}
