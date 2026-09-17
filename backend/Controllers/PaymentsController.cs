using System.Security.Claims;
using backend.DTOs.Payments;
using backend.Services.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Authorize(Roles = "Trainer")]
[EnableRateLimiting("authenticated")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet("api/payments")]
    public async Task<ActionResult<List<PaymentResponse>>> GetAll()
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var payments = await _paymentService.GetAllAsync(trainerId.Value);

        return Ok(payments);
    }

    [HttpGet("api/clients/{clientId}/payments")]
    public async Task<ActionResult<List<PaymentResponse>>> GetByClientId(int clientId)
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var payments = await _paymentService.GetByClientIdAsync(clientId, trainerId.Value);

        return Ok(payments);
    }

    [HttpPost("api/clients/{clientId}/payments")]
    public async Task<ActionResult<PaymentResponse>> Create(
        int clientId,
        CreatePaymentRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var payment = await _paymentService.CreateAsync(clientId, request, trainerId.Value);

        if (payment is null)
        {
            return NotFound();
        }

        return Ok(payment);
    }

    [HttpPut("api/payments/{id}/status")]
    public async Task<ActionResult<PaymentResponse>> UpdateStatus(
        int id,
        UpdatePaymentStatusRequest request
    )
    {
        var trainerId = GetTrainerId();
        if (trainerId is null)
        {
            return Unauthorized();
        }
        var payment = await _paymentService.UpdateStatusAsync(id, request, trainerId.Value);

        if (payment is null)
        {
            return NotFound();
        }

        return Ok(payment);
    }

    private int? GetTrainerId()
    {
        var trainerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(trainerIdClaim, out var trainerId))
        {
            return null;
        }
        return trainerId;
    }
}
