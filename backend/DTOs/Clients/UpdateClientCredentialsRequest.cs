namespace backend.DTOs.Clients;

public class UpdateClientCredentialsRequest
{
    public string Username { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}