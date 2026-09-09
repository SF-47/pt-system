using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Trainer> Trainers { get; set; }

    public DbSet<Client> Clients { get; set; }

    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }

    public DbSet<Exercise> Exercises { get; set; }

    public DbSet<ClientWorkoutAssignment> ClientWorkoutAssignments { get; set; }

    public DbSet<MealPlan> MealPlans { get; set; }

    public DbSet<Meal> Meals { get; set; }

    public DbSet<ClientMealPlan> ClientMealPlans { get; set; }

    public DbSet<ClientMealStatus> ClientMealStatuses { get; set; }

    public DbSet<Payment> Payments { get; set; }
}
