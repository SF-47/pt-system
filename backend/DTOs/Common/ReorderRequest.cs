using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Common;

public class ReorderRequest
{
    [Required]
    public List<ReorderItem> Items { get; set; } = new();
}

public class ReorderItem
{
    public int Id { get; set; }

    public int Position { get; set; }
}
