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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Trainer>().HasIndex(t => t.Username).IsUnique();

        modelBuilder.Entity<Client>().HasIndex(c => c.Username).IsUnique();

        modelBuilder.Entity<Payment>().Property(p => p.Amount).HasPrecision(10, 2);

        // Client history must never be removed implicitly: the database refuses to delete a
        // client that still has payments or assignments.
        modelBuilder
            .Entity<Payment>()
            .HasOne(p => p.Client)
            .WithMany(c => c.Payments)
            .HasForeignKey(p => p.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<ClientWorkoutAssignment>()
            .HasOne(x => x.Client)
            .WithMany(c => c.WorkoutAssignments)
            .HasForeignKey(x => x.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<ClientMealPlan>()
            .HasOne(x => x.Client)
            .WithMany(c => c.MealPlans)
            .HasForeignKey(x => x.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder
            .Entity<ClientWorkoutAssignment>()
            .Property(x => x.AssignedDate)
            .HasColumnType("date");

        modelBuilder
            .Entity<ClientWorkoutAssignment>()
            .HasIndex(x => new { x.ClientId, x.AssignedDate })
            .IsUnique();

        modelBuilder.Entity<ClientMealPlan>().Property(x => x.AssignedDate).HasColumnType("date");

        modelBuilder
            .Entity<ClientMealPlan>()
            .HasIndex(x => new { x.ClientId, x.AssignedDate })
            .IsUnique();
    }
}
