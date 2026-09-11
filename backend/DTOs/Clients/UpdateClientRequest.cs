namespace backend.DTOs.Clients;

public class UpdateClientRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string PhoneNumber { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}