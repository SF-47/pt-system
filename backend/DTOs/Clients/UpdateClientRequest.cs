using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Clients;

public class UpdateClientRequest
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

    public bool IsActive { get; set; }
}
