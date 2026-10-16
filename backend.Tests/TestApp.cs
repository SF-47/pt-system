using System.Net.Http.Headers;
using backend.Data;
using backend.Enums;
using backend.Models;
using backend.Services.Auth;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MySql;

namespace backend.Tests;

/// <summary>
/// Starts a disposable MySQL container, applies the real migrations and hosts the API against it.
/// Nothing here touches development or production data.
/// </summary>
public class TestApp : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly MySqlContainer _mysql = new MySqlBuilder("mysql:8.4")
        .WithDatabase("pt_tests")
        .WithPassword("throwaway-test-password")
        .Build();

    private static int _sequence;

    public string ConnectionString => _mysql.GetConnectionString();

    public async Task InitializeAsync()
    {
        await _mysql.StartAsync();

        // Program reads configuration while building, so use environment variables.
        Environment.SetEnvironmentVariable(
            "ConnectionStrings__DefaultConnection",
            ConnectionString
        );
        Environment.SetEnvironmentVariable(
            "Jwt__Key",
            Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(48))
        );

        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }

    public new async Task DisposeAsync()
    {
        await base.DisposeAsync();
        await _mysql.DisposeAsync();
    }

    public async Task<T> WithDbAsync<T>(Func<ApplicationDbContext, Task<T>> action)
    {
        using var scope = Services.CreateScope();
        return await action(scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
    }

    public Task WithDbAsync(Func<ApplicationDbContext, Task> action) =>
        WithDbAsync<bool>(async db =>
        {
            await action(db);
            return true;
        });

    public async Task<Trainer> CreateTrainerAsync()
    {
        var n = Interlocked.Increment(ref _sequence);
        var trainer = new Trainer
        {
            FullName = $"Trainer {n}",
            Username = $"trainer{n}-{Guid.NewGuid():N}"[..40],
            Email = $"trainer{n}-{Guid.NewGuid():N}@example.test",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Trainer-pass-1", 4),
        };
        await WithDbAsync(async db =>
        {
            db.Trainers.Add(trainer);
            await db.SaveChangesAsync();
        });
        return trainer;
    }

    public async Task<Client> CreateClientAsync(
        Trainer trainer,
        bool isActive = true,
        string password = "Client-pass-1"
    )
    {
        var n = Interlocked.Increment(ref _sequence);
        var client = new Client
        {
            TrainerId = trainer.Id,
            FullName = $"Client Name {n}",
            Username = $"client{n}-{Guid.NewGuid():N}"[..40],
            PhoneNumber = "555-0100",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, 4),
            IsActive = isActive,
        };
        await WithDbAsync(async db =>
        {
            db.Clients.Add(client);
            await db.SaveChangesAsync();
        });
        return client;
    }

    public async Task AddPaymentAsync(Client client) =>
        await WithDbAsync(async db =>
        {
            db.Payments.Add(
                new Payment
                {
                    ClientId = client.Id,
                    Amount = 50m,
                    DueDate = DateTime.UtcNow.Date,
                }
            );
            await db.SaveChangesAsync();
        });

    public async Task AddWorkoutAssignmentAsync(Trainer trainer, Client client) =>
        await WithDbAsync(async db =>
        {
            var plan = new WorkoutPlan { TrainerId = trainer.Id, Name = "Plan" };
            plan.Exercises.Add(
                new Exercise
                {
                    Name = "Squat",
                    Sets = 3,
                    Reps = 5,
                    RestSeconds = 60,
                    Position = 1,
                }
            );
            db.ClientWorkoutAssignments.Add(
                new ClientWorkoutAssignment
                {
                    ClientId = client.Id,
                    WorkoutPlan = plan,
                    AssignedDate = DateTime.UtcNow.Date,
                }
            );
            await db.SaveChangesAsync();
        });

    public async Task AddMealAssignmentAsync(Trainer trainer, Client client) =>
        await WithDbAsync(async db =>
        {
            var plan = new MealPlan { TrainerId = trainer.Id, Name = "Meals" };
            var meal = new Meal
            {
                Name = "Breakfast",
                Instructions = "Eat",
                Position = 1,
            };
            plan.Meals.Add(meal);
            var assignment = new ClientMealPlan
            {
                ClientId = client.Id,
                MealPlan = plan,
                AssignedDate = DateTime.UtcNow.Date,
            };
            assignment.MealStatuses.Add(new ClientMealStatus { Meal = meal });
            db.ClientMealPlans.Add(assignment);
            await db.SaveChangesAsync();
        });

    public HttpClient CreateTrainerClient(Trainer trainer) =>
        CreateAuthorizedClient(
            Services
                .CreateScope()
                .ServiceProvider.GetRequiredService<IJwtService>()
                .GenerateTrainerToken(trainer.Id, trainer.Username, trainer.FullName)
        );

    public HttpClient CreateClientRoleClient(Client client) =>
        CreateAuthorizedClient(
            Services
                .CreateScope()
                .ServiceProvider.GetRequiredService<IJwtService>()
                .GenerateClientToken(client.Id, client.Username)
        );

    private HttpClient CreateAuthorizedClient(string token)
    {
        var http = CreateClient();
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return http;
    }
}
