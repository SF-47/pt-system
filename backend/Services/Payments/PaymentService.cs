using backend.Data;
using backend.DTOs.Payments;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Payments;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PaymentResponse>> GetAllAsync()
    {
        return await _context
            .Payments.Select(payment => new PaymentResponse
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
    }

    public async Task<List<PaymentResponse>> GetByClientIdAsync(int clientId)
    {
        return await _context
            .Payments.Where(payment => payment.ClientId == clientId)
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
    }

    public async Task<PaymentResponse?> CreateAsync(int clientId, CreatePaymentRequest request)
    {
        var client = await _context.Clients.FindAsync(clientId);

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

        _context.Payments.Add(payment);

        await _context.SaveChangesAsync();

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
        UpdatePaymentStatusRequest request
    )
    {
        var payment = await _context
            .Payments.Include(payment => payment.Client)
            .FirstOrDefaultAsync(payment => payment.Id == paymentId);

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

        await _context.SaveChangesAsync();

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
