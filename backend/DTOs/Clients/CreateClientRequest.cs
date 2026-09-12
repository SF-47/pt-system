using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Clients;

public class CreateClientRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 6)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}
