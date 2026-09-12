namespace backend.DTOs.Auth;

public class ClientLoginResponse
{
    public string Token { get; set; } = string.Empty;

    public int ClientId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
}
