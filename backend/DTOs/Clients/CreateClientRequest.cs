namespace backend.DTOs.Clients;

public class CreateClientRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string PhoneNumber { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}