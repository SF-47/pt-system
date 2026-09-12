using backend.DTOs.Payments;
using backend.Services.Payments;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
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
        var payments = await _paymentService.GetAllAsync();

        return Ok(payments);
    }

    [HttpGet("api/clients/{clientId}/payments")]
    public async Task<ActionResult<List<PaymentResponse>>> GetByClientId(int clientId)
    {
        var payments = await _paymentService.GetByClientIdAsync(clientId);

        return Ok(payments);
    }

    [HttpPost("api/clients/{clientId}/payments")]
    public async Task<ActionResult<PaymentResponse>> Create(
        int clientId,
        CreatePaymentRequest request
    )
    {
        var payment = await _paymentService.CreateAsync(clientId, request);

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
        var payment = await _paymentService.UpdateStatusAsync(id, request);

        if (payment is null)
        {
            return NotFound();
        }

        return Ok(payment);
    }
}
