using System.Net;
using System.Net.Http.Json;
using backend.DTOs.MealAssignments;
using backend.Enums;
using backend.Models;
using backend.Services.MealAssignments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;

namespace backend.Tests;

[Collection(DatabaseCollection.Name)]
public class MealHistoryTests
{
    private static int _dayOffset;

    private readonly TestApp _app;

    public MealHistoryTests(TestApp app)
    {
        _app = app;
    }

    // ---------- Meal deletion ----------

    [Fact]
    public async Task DeleteMeal_WithoutHistory_Returns204_AndRenumbersPositions()
    {
        var trainer = await _app.CreateTrainerAsync();
        var plan = await CreatePlanAsync(trainer, 3);

        var response = await _app.CreateTrainerClient(trainer)
            .DeleteAsync($"/api/meals/{plan.Meals.First().Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var positions = await _app.WithDbAsync(db =>
            db.Meals.Where(meal => meal.MealPlanId == plan.Id)
                .OrderBy(meal => meal.Position)
                .Select(meal => meal.Position)
                .ToListAsync()
        );
        Assert.Equal(new[] { 1, 2 }, positions);
    }

    [Theory]
    [InlineData(CompletionStatus.Pending)]
    [InlineData(CompletionStatus.Completed)]
    [InlineData(CompletionStatus.Skipped)]
    public async Task DeleteMeal_WithAnyStatusHistory_Returns409_AndKeepsHistory(
        CompletionStatus status
    )
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var plan = await CreatePlanAsync(trainer, 2);
        var assignmentId = await AssignDirectAsync(client, plan);
        var meal = plan.Meals.First();
        await _app.WithDbAsync(async db =>
        {
            var row = await db.ClientMealStatuses.SingleAsync(s =>
                s.ClientMealPlanId == assignmentId && s.MealId == meal.Id
            );
            row.Status = status;
            row.CompletedAt = status == CompletionStatus.Completed ? DateTime.UtcNow : null;
            await db.SaveChangesAsync();
        });

        var response = await _app.CreateTrainerClient(trainer).DeleteAsync($"/api/meals/{meal.Id}");

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        Assert.Contains("completion history", await response.Content.ReadAsStringAsync());
        Assert.True(await _app.WithDbAsync(db => db.Meals.AnyAsync(m => m.Id == meal.Id)));
        Assert.Equal(
            status,
            await _app.WithDbAsync(db =>
                db.ClientMealStatuses.Where(s => s.MealId == meal.Id)
                    .Select(s => s.Status)
                    .SingleAsync()
            )
        );
    }

    [Fact]
    public async Task DeleteMeal_OtherTrainer_Returns404_AndChangesNothing()
    {
        var owner = await _app.CreateTrainerAsync();
        var other = await _app.CreateTrainerAsync();
        var plan = await CreatePlanAsync(owner, 2);
        var mealId = plan.Meals.First().Id;

        var response = await _app.CreateTrainerClient(other).DeleteAsync($"/api/meals/{mealId}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.True(await _app.WithDbAsync(db => db.Meals.AnyAsync(m => m.Id == mealId)));
    }

    [Fact]
    public async Task DeleteMeal_MissingMeal_Returns404()
    {
        var trainer = await _app.CreateTrainerAsync();
        var response = await _app.CreateTrainerClient(trainer).DeleteAsync("/api/meals/99999999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteMeal_RequiresTrainerRole()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var plan = await CreatePlanAsync(trainer, 1);
        var mealId = plan.Meals.First().Id;

        var anonymous = await _app.CreateClient().DeleteAsync($"/api/meals/{mealId}");
        var asClient = await _app.CreateClientRoleClient(client)
            .DeleteAsync($"/api/meals/{mealId}");

        Assert.Equal(HttpStatusCode.Unauthorized, anonymous.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, asClient.StatusCode);
        Assert.True(await _app.WithDbAsync(db => db.Meals.AnyAsync(m => m.Id == mealId)));
    }

    // ---------- Database rule ----------

    [Fact]
    public async Task Database_ForeignKeyToMeals_IsRestrict_AndRawDeleteIsRefused()
    {
        var rule = await _app.WithDbAsync(async db =>
        {
            await using var command = db.Database.GetDbConnection().CreateCommand();
            command.CommandText =
                @"SELECT DELETE_RULE FROM information_schema.REFERENTIAL_CONSTRAINTS
                  WHERE CONSTRAINT_SCHEMA = DATABASE()
                    AND CONSTRAINT_NAME = 'FK_ClientMealStatuses_Meals_MealId'";
            await db.Database.OpenConnectionAsync();
            return (string?)await command.ExecuteScalarAsync();
        });
        Assert.Equal("RESTRICT", rule);

        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var plan = await CreatePlanAsync(trainer, 1);
        await AssignDirectAsync(client, plan);
        var mealId = plan.Meals.Single().Id;

        var ex = await Assert.ThrowsAsync<MySqlException>(() =>
            _app.WithDbAsync(db =>
                db.Database.ExecuteSqlRawAsync("DELETE FROM Meals WHERE Id = {0}", mealId)
            )
        );
        Assert.Equal(MySqlErrorCode.RowIsReferenced2, ex.ErrorCode);

        await Assert.ThrowsAsync<DbUpdateException>(() =>
            _app.WithDbAsync(async db =>
            {
                db.Meals.Remove(await db.Meals.SingleAsync(m => m.Id == mealId));
                await db.SaveChangesAsync();
            })
        );
    }

    // ---------- Assignment atomicity ----------

    [Fact]
    public async Task Assign_PersistsAssignmentAndOnePendingStatusPerMeal_InPlanOrder()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var plan = await CreatePlanAsync(trainer, 4);

        var response = await AssignAsync(trainer, client, plan, NextDay());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = (await response.Content.ReadFromJsonAsync<MealAssignmentResponse>())!;
        Assert.Equal(4, body.Meals.Count);
        var statuses = await _app.WithDbAsync(db =>
            db.ClientMealStatuses.Where(s => s.ClientMealPlanId == body.Id)
                .OrderBy(s => s.Meal.Position)
                .ToListAsync()
        );
        Assert.Equal(
            plan.Meals.OrderBy(m => m.Position).Select(m => m.Id),
            statuses.Select(s => s.MealId)
        );
        Assert.All(statuses, s => Assert.Equal(CompletionStatus.Pending, s.Status));
        Assert.All(statuses, s => Assert.Null(s.CompletedAt));
    }

    [Fact]
    public async Task Assign_WhenStatusInsertFails_RollsBackEverything_AndDayCanBeAssignedAgain()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var plan = await CreatePlanAsync(trainer, 3);
        var failingMealId = plan.Meals.OrderBy(m => m.Position).Last().Id;
        var day = NextDay();
        var trigger = $"fail_status_insert_{failingMealId}";

        // Disposable-container-only fault injection: the last status insert fails.
        await _app.WithDbAsync(db =>
            db.Database.ExecuteSqlRawAsync(
                $@"CREATE TRIGGER {trigger} BEFORE INSERT ON ClientMealStatuses
                   FOR EACH ROW BEGIN
                     IF NEW.MealId = {failingMealId} THEN
                       SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'injected failure';
                     END IF;
                   END"
            )
        );

        try
        {
            using var scope = _app.Services.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IMealAssignmentService>();

            // An unrelated database failure is not converted into a conflict.
            var ex = await Assert.ThrowsAsync<DbUpdateException>(() =>
                service.AssignAsync(
                    client.Id,
                    new AssignMealPlanRequest { MealPlanId = plan.Id, AssignedDate = day },
                    trainer.Id
                )
            );
            Assert.IsType<MySqlException>(ex.InnerException);
        }
        finally
        {
            await _app.WithDbAsync(db => db.Database.ExecuteSqlRawAsync($"DROP TRIGGER {trigger}"));
        }

        Assert.Equal(
            0,
            await _app.WithDbAsync(db =>
                db.ClientMealPlans.CountAsync(a => a.ClientId == client.Id)
            )
        );
        Assert.Equal(
            0,
            await _app.WithDbAsync(db =>
                db.ClientMealStatuses.CountAsync(s => s.ClientMealPlan.ClientId == client.Id)
            )
        );

        var retry = await AssignAsync(trainer, client, plan, day);
        Assert.Equal(HttpStatusCode.OK, retry.StatusCode);
        Assert.Equal(
            3,
            await _app.WithDbAsync(db =>
                db.ClientMealStatuses.CountAsync(s => s.ClientMealPlan.ClientId == client.Id)
            )
        );
    }

    [Fact]
    public async Task Assign_SameDayTwice_Returns409_AndKeepsFirstAssignmentIntact()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var plan = await CreatePlanAsync(trainer, 2);
        var day = NextDay();

        Assert.Equal(HttpStatusCode.OK, (await AssignAsync(trainer, client, plan, day)).StatusCode);
        var second = await AssignAsync(trainer, client, plan, day);

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal(
            1,
            await _app.WithDbAsync(db =>
                db.ClientMealPlans.CountAsync(a => a.ClientId == client.Id)
            )
        );
        Assert.Equal(
            2,
            await _app.WithDbAsync(db =>
                db.ClientMealStatuses.CountAsync(s => s.ClientMealPlan.ClientId == client.Id)
            )
        );
    }

    [Fact]
    public async Task Assign_ConcurrentSameDay_ExactlyOneWins_Returns409ForTheOther_NeverA500()
    {
        for (var round = 0; round < 10; round++)
        {
            var trainer = await _app.CreateTrainerAsync();
            var client = await _app.CreateClientAsync(trainer);
            var plan = await CreatePlanAsync(trainer, 3);
            var day = NextDay();

            var start = new TaskCompletionSource();
            var tasks = Enumerable
                .Range(0, 4)
                .Select(async _ =>
                {
                    await start.Task;
                    return (await AssignAsync(trainer, client, plan, day)).StatusCode;
                })
                .ToList();
            start.SetResult();
            var results = await Task.WhenAll(tasks);

            Assert.Equal(1, results.Count(r => r == HttpStatusCode.OK));
            Assert.All(
                results.Where(r => r != HttpStatusCode.OK),
                r => Assert.Equal(HttpStatusCode.Conflict, r)
            );
            Assert.Equal(
                1,
                await _app.WithDbAsync(db =>
                    db.ClientMealPlans.CountAsync(a => a.ClientId == client.Id)
                )
            );
            Assert.Equal(
                3,
                await _app.WithDbAsync(db =>
                    db.ClientMealStatuses.CountAsync(s => s.ClientMealPlan.ClientId == client.Id)
                )
            );
        }
    }

    [Fact]
    public async Task Assign_OtherTrainersClientOrPlan_Returns404_AndInactiveClientReturns400()
    {
        var owner = await _app.CreateTrainerAsync();
        var other = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(owner);
        var inactive = await _app.CreateClientAsync(owner, isActive: false);
        var plan = await CreatePlanAsync(owner, 1);
        var otherPlan = await CreatePlanAsync(other, 1);

        Assert.Equal(
            HttpStatusCode.NotFound,
            (await AssignAsync(other, client, plan, NextDay())).StatusCode
        );
        Assert.Equal(
            HttpStatusCode.NotFound,
            (await AssignAsync(owner, client, otherPlan, NextDay())).StatusCode
        );
        Assert.Equal(
            HttpStatusCode.BadRequest,
            (await AssignAsync(owner, inactive, plan, NextDay())).StatusCode
        );
        Assert.Equal(
            0,
            await _app.WithDbAsync(db =>
                db.ClientMealPlans.CountAsync(a =>
                    a.ClientId == client.Id || a.ClientId == inactive.Id
                )
            )
        );
    }

    // ---------- Concurrent delete vs assign ----------

    [Fact]
    public async Task DeleteMeal_ConcurrentWithAssign_NeverLosesCommittedHistory()
    {
        for (var round = 0; round < 25; round++)
        {
            var trainer = await _app.CreateTrainerAsync();
            var client = await _app.CreateClientAsync(trainer);
            var plan = await CreatePlanAsync(trainer, 2);
            var mealId = plan.Meals.OrderBy(m => m.Position).Last().Id;
            var http = _app.CreateTrainerClient(trainer);

            var start = new TaskCompletionSource();
            var deleteTask = Task.Run(async () =>
            {
                await start.Task;
                return (await http.DeleteAsync($"/api/meals/{mealId}")).StatusCode;
            });
            var assignTask = Task.Run(async () =>
            {
                await start.Task;
                return (await AssignAsync(trainer, client, plan, NextDay())).StatusCode;
            });
            start.SetResult();
            var deleteStatus = await deleteTask;
            var assignStatus = await assignTask;

            var mealExists = await _app.WithDbAsync(db => db.Meals.AnyAsync(m => m.Id == mealId));
            var statusRows = await _app.WithDbAsync(db =>
                db.ClientMealStatuses.CountAsync(s => s.ClientMealPlan.ClientId == client.Id)
            );
            var assignments = await _app.WithDbAsync(db =>
                db.ClientMealPlans.CountAsync(a => a.ClientId == client.Id)
            );

            if (deleteStatus == HttpStatusCode.NoContent)
            {
                // Delete committed first: no status may reference the deleted meal.
                Assert.False(mealExists);
                Assert.Equal(
                    0,
                    await _app.WithDbAsync(db =>
                        db.ClientMealStatuses.CountAsync(s => s.MealId == mealId)
                    )
                );
                if (assignStatus == HttpStatusCode.OK)
                {
                    Assert.Equal(1, assignments);
                    Assert.Equal(1, statusRows); // only the surviving meal
                }
                else
                {
                    Assert.Equal(HttpStatusCode.Conflict, assignStatus);
                    Assert.Equal(0, assignments);
                    Assert.Equal(0, statusRows);
                }
            }
            else
            {
                // Assignment committed first: the delete was refused and the history is complete.
                Assert.Equal(HttpStatusCode.Conflict, deleteStatus);
                Assert.Equal(HttpStatusCode.OK, assignStatus);
                Assert.True(mealExists);
                Assert.Equal(1, assignments);
                Assert.Equal(2, statusRows);
            }
        }
    }

    // ---------- helpers ----------

    private static DateTime NextDay() =>
        new DateTime(2030, 1, 1).AddDays(Interlocked.Increment(ref _dayOffset));

    private Task<HttpResponseMessage> AssignAsync(
        Trainer trainer,
        Client client,
        MealPlan plan,
        DateTime day
    ) =>
        _app.CreateTrainerClient(trainer)
            .PostAsJsonAsync(
                $"/api/clients/{client.Id}/meal-plans",
                new AssignMealPlanRequest { MealPlanId = plan.Id, AssignedDate = day }
            );

    private async Task<MealPlan> CreatePlanAsync(Trainer trainer, int mealCount)
    {
        var plan = new MealPlan { TrainerId = trainer.Id, Name = "Plan" };
        for (var i = 1; i <= mealCount; i++)
        {
            plan.Meals.Add(
                new Meal
                {
                    Name = $"Meal {i}",
                    Instructions = "Eat",
                    Position = i,
                }
            );
        }
        await _app.WithDbAsync(async db =>
        {
            db.MealPlans.Add(plan);
            await db.SaveChangesAsync();
        });
        return plan;
    }

    private async Task<int> AssignDirectAsync(Client client, MealPlan plan)
    {
        var assignment = new ClientMealPlan
        {
            ClientId = client.Id,
            MealPlanId = plan.Id,
            AssignedDate = NextDay(),
        };
        foreach (var meal in plan.Meals)
        {
            assignment.MealStatuses.Add(new ClientMealStatus { MealId = meal.Id });
        }
        await _app.WithDbAsync(async db =>
        {
            db.ClientMealPlans.Add(assignment);
            await db.SaveChangesAsync();
        });
        return assignment.Id;
    }
}
