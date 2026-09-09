namespace backend.Models;

public class Trainer
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Client> Clients { get; set; } = new List<Client>();

    public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();

    public ICollection<MealPlan> MealPlans { get; set; } = new List<MealPlan>();
}
