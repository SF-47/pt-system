namespace backend.Models;

public class WorkoutPlan
{
    public int Id { get; set; }

    public int TrainerId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Trainer Trainer { get; set; } = null!;

    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}