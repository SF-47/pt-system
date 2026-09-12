using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class ClientLoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
