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

    public async Task<List<PaymentResponse>> GetAllAsync(int trainerId)
    {
        return await _context
            .Payments.Where(payment => payment.Client.TrainerId == trainerId)
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

    public async Task<List<PaymentResponse>> GetByClientIdAsync(int clientId, int trainerId)
    {
        return await _context
            .Payments.Where(payment =>
                payment.ClientId == clientId && payment.Client.TrainerId == trainerId
            )
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

    public async Task<PaymentResponse?> CreateAsync(
        int clientId,
        CreatePaymentRequest request,
        int trainerId
    )
    {
        var client = await _context.Clients.FirstOrDefaultAsync(client =>
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
        UpdatePaymentStatusRequest request,
        int trainerId
    )
    {
        var payment = await _context
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
