namespace backend.Models;

public class Client
{
    public int Id { get; set; }

    public int TrainerId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string PhoneNumber { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Trainer Trainer { get; set; } = null!;

    public ICollection<ClientWorkoutAssignment> WorkoutAssignments { get; set; } =
        new List<ClientWorkoutAssignment>();

    public ICollection<ClientMealPlan> MealPlans { get; set; } = new List<ClientMealPlan>();

    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
