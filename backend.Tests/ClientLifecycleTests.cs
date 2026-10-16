using System.Net;
using System.Net.Http.Json;
using backend.DTOs.Clients;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace backend.Tests;

public class ClientLifecycleTests : IClassFixture<TestApp>
{
    private readonly TestApp _app;

    public ClientLifecycleTests(TestApp app)
    {
        _app = app;
    }

    private static object Status(bool isActive) => new { isActive };

    // ---------- Deactivate / reactivate ----------

    [Fact]
    public async Task Deactivate_PreservesAllHistory_AndReactivateRestoresIt()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        await _app.AddPaymentAsync(client);
        await _app.AddWorkoutAssignmentAsync(trainer, client);
        await _app.AddMealAssignmentAsync(trainer, client);
        var http = _app.CreateTrainerClient(trainer);

        var deactivate = await http.PutAsJsonAsync(
            $"/api/clients/{client.Id}/status",
            Status(false)
        );
        Assert.Equal(HttpStatusCode.OK, deactivate.StatusCode);
        Assert.False((await deactivate.Content.ReadFromJsonAsync<ClientResponse>())!.IsActive);

        await AssertHistoryCountsAsync(
            client.Id,
            payments: 1,
            workouts: 1,
            meals: 1,
            mealStatuses: 1
        );

        var reactivate = await http.PutAsJsonAsync(
            $"/api/clients/{client.Id}/status",
            Status(true)
        );
        Assert.Equal(HttpStatusCode.OK, reactivate.StatusCode);
        Assert.True((await reactivate.Content.ReadFromJsonAsync<ClientResponse>())!.IsActive);

        await AssertHistoryCountsAsync(
            client.Id,
            payments: 1,
            workouts: 1,
            meals: 1,
            mealStatuses: 1
        );
    }

    [Fact]
    public async Task Status_IsIdempotent()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer, isActive: false);
        var http = _app.CreateTrainerClient(trainer);

        for (var i = 0; i < 2; i++)
        {
            var response = await http.PutAsJsonAsync(
                $"/api/clients/{client.Id}/status",
                Status(false)
            );
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }

    [Fact]
    public async Task Deactivation_BlocksClientAccess_AndReactivationRestoresIt()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var trainerHttp = _app.CreateTrainerClient(trainer);
        var clientHttp = _app.CreateClientRoleClient(client);

        Assert.Equal(
            HttpStatusCode.OK,
            (await clientHttp.GetAsync("/api/client/profile")).StatusCode
        );

        await trainerHttp.PutAsJsonAsync($"/api/clients/{client.Id}/status", Status(false));

        // Existing token is rejected on the next request.
        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await clientHttp.GetAsync("/api/client/profile")).StatusCode
        );

        // Login is refused while inactive.
        var anonymous = _app.CreateClient();
        var blockedLogin = await anonymous.PostAsJsonAsync(
            "/api/client/login",
            new { username = client.Username, password = "Client-pass-1" }
        );
        Assert.Equal(HttpStatusCode.Unauthorized, blockedLogin.StatusCode);

        await trainerHttp.PutAsJsonAsync($"/api/clients/{client.Id}/status", Status(true));

        Assert.Equal(
            HttpStatusCode.OK,
            (await clientHttp.GetAsync("/api/client/profile")).StatusCode
        );
        var login = await anonymous.PostAsJsonAsync(
            "/api/client/login",
            new { username = client.Username, password = "Client-pass-1" }
        );
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }

    [Fact]
    public async Task LegacyUpdateEndpoint_StillTogglesActiveWithSameResult()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var http = _app.CreateTrainerClient(trainer);

        var update = await http.PutAsJsonAsync(
            $"/api/clients/{client.Id}",
            new
            {
                fullName = client.FullName,
                username = client.Username,
                phoneNumber = client.PhoneNumber,
                isActive = false,
            }
        );
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        Assert.False((await update.Content.ReadFromJsonAsync<ClientResponse>())!.IsActive);
        Assert.False(await IsActiveAsync(client.Id));
    }

    [Fact]
    public async Task InactiveClient_StillCannotReceiveNewAssignments_ButKeepsExistingBehavior()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer, isActive: false);
        var http = _app.CreateTrainerClient(trainer);

        var assign = await http.PostAsJsonAsync(
            $"/api/clients/{client.Id}/workout-plans",
            new { workoutPlanId = 1, assignedDate = "2030-01-01" }
        );
        Assert.Equal(HttpStatusCode.BadRequest, assign.StatusCode);

        // Payments can still be recorded for an inactive client (unchanged behavior).
        var payment = await http.PostAsJsonAsync(
            $"/api/clients/{client.Id}/payments",
            new { amount = 10, dueDate = "2030-01-01" }
        );
        Assert.Equal(HttpStatusCode.OK, payment.StatusCode);
    }

    // ---------- Permanent delete ----------

    [Fact]
    public async Task Delete_ClientWithoutHistory_Returns204_AndRemovesClient()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var http = _app.CreateTrainerClient(trainer);

        var response = await http.DeleteAsync($"/api/clients/{client.Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.False(await ClientExistsAsync(client.Id));
    }

    [Theory]
    [InlineData("payment")]
    [InlineData("workout")]
    [InlineData("meal")]
    public async Task Delete_ClientWithAnyHistory_Returns409_AndKeepsEverything(string kind)
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        await AddHistoryAsync(kind, trainer, client);
        var http = _app.CreateTrainerClient(trainer);

        var response = await http.DeleteAsync($"/api/clients/{client.Id}");

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Deactivate", body);
        Assert.DoesNotContain("MySql", body, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("constraint", body, StringComparison.OrdinalIgnoreCase);
        Assert.True(await ClientExistsAsync(client.Id));
        await AssertHistoryCountsAsync(
            client.Id,
            kind == "payment" ? 1 : 0,
            kind == "workout" ? 1 : 0,
            kind == "meal" ? 1 : 0,
            kind == "meal" ? 1 : 0
        );
    }

    [Fact]
    public async Task Delete_InactiveClientWithHistory_StillReturns409()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer, isActive: false);
        await _app.AddPaymentAsync(client);
        var http = _app.CreateTrainerClient(trainer);

        Assert.Equal(
            HttpStatusCode.Conflict,
            (await http.DeleteAsync($"/api/clients/{client.Id}")).StatusCode
        );
        Assert.True(await ClientExistsAsync(client.Id));
    }

    [Fact]
    public async Task Delete_MissingClient_Returns404()
    {
        var trainer = await _app.CreateTrainerAsync();
        var http = _app.CreateTrainerClient(trainer);

        Assert.Equal(
            HttpStatusCode.NotFound,
            (await http.DeleteAsync("/api/clients/2147000000")).StatusCode
        );
    }

    // ---------- Ownership and authorization ----------

    [Fact]
    public async Task OtherTrainer_CannotChangeStatusOrDelete_Returns404_AndClientUntouched()
    {
        var owner = await _app.CreateTrainerAsync();
        var other = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(owner);
        var otherHttp = _app.CreateTrainerClient(other);

        var status = await otherHttp.PutAsJsonAsync(
            $"/api/clients/{client.Id}/status",
            Status(false)
        );
        var delete = await otherHttp.DeleteAsync($"/api/clients/{client.Id}");

        Assert.Equal(HttpStatusCode.NotFound, status.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, delete.StatusCode);
        Assert.True(await ClientExistsAsync(client.Id));
        Assert.True(await IsActiveAsync(client.Id));
    }

    [Fact]
    public async Task Unauthenticated_Returns401()
    {
        var anonymous = _app.CreateClient();

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await anonymous.PutAsJsonAsync("/api/clients/1/status", Status(false))).StatusCode
        );
        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await anonymous.DeleteAsync("/api/clients/1")).StatusCode
        );
    }

    [Fact]
    public async Task ClientRoleToken_Returns403_OnTrainerEndpoints()
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        var clientHttp = _app.CreateClientRoleClient(client);

        Assert.Equal(
            HttpStatusCode.Forbidden,
            (
                await clientHttp.PutAsJsonAsync($"/api/clients/{client.Id}/status", Status(false))
            ).StatusCode
        );
        Assert.Equal(
            HttpStatusCode.Forbidden,
            (await clientHttp.DeleteAsync($"/api/clients/{client.Id}")).StatusCode
        );
        Assert.True(await ClientExistsAsync(client.Id));
    }

    // ---------- Database enforcement ----------

    [Fact]
    public async Task Migration_ConfiguresRestrictForClientHistory_AndCascadeForMealStatuses()
    {
        var rules = new Dictionary<string, string>();
        await using var connection = new MySqlConnection(_app.ConnectionString);
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText =
            "SELECT CONSTRAINT_NAME, DELETE_RULE FROM information_schema.REFERENTIAL_CONSTRAINTS "
            + "WHERE CONSTRAINT_SCHEMA = DATABASE()";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            rules[reader.GetString(0)] = reader.GetString(1);
        }

        Assert.Equal("RESTRICT", rules["FK_Payments_Clients_ClientId"]);
        Assert.Equal("RESTRICT", rules["FK_ClientWorkoutAssignments_Clients_ClientId"]);
        Assert.Equal("RESTRICT", rules["FK_ClientMealPlans_Clients_ClientId"]);
        Assert.Equal("CASCADE", rules["FK_ClientMealStatuses_ClientMealPlans_ClientMealPlanId"]);
    }

    [Theory]
    [InlineData("payment")]
    [InlineData("workout")]
    [InlineData("meal")]
    public async Task Database_RefusesRawClientDelete_WhenHistoryExists(string kind)
    {
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        await AddHistoryAsync(kind, trainer, client);

        await using var connection = new MySqlConnection(_app.ConnectionString);
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM Clients WHERE Id = @id";
        command.Parameters.AddWithValue("@id", client.Id);

        var ex = await Assert.ThrowsAsync<MySqlException>(() => command.ExecuteNonQueryAsync());
        Assert.Equal(MySqlErrorCode.RowIsReferenced2, ex.ErrorCode);
        Assert.True(await ClientExistsAsync(client.Id));
    }

    [Fact]
    public async Task EfRemoveOfClientWithHistory_FailsInDatabase_AndLosesNothing()
    {
        // Simulates the race where history appears after the service's own check passed.
        var trainer = await _app.CreateTrainerAsync();
        var client = await _app.CreateClientAsync(trainer);
        await _app.AddPaymentAsync(client);

        await Assert.ThrowsAsync<DbUpdateException>(() =>
            _app.WithDbAsync(async db =>
            {
                db.Clients.Remove(new Client { Id = client.Id });
                await db.SaveChangesAsync();
            })
        );

        await AssertHistoryCountsAsync(
            client.Id,
            payments: 1,
            workouts: 0,
            meals: 0,
            mealStatuses: 0
        );
    }

    // ---------- Concurrency ----------

    [Fact]
    public async Task ConcurrentDeleteAndPayment_NeverSilentlyLosesAPayment()
    {
        var trainer = await _app.CreateTrainerAsync();
        var http = _app.CreateTrainerClient(trainer);

        for (var attempt = 0; attempt < 25; attempt++)
        {
            var client = await _app.CreateClientAsync(trainer);
            var start = new TaskCompletionSource();

            async Task<HttpStatusCode> Delete()
            {
                await start.Task;
                return (await http.DeleteAsync($"/api/clients/{client.Id}")).StatusCode;
            }

            async Task<HttpStatusCode> Pay()
            {
                await start.Task;
                return (
                    await http.PostAsJsonAsync(
                        $"/api/clients/{client.Id}/payments",
                        new { amount = 20, dueDate = "2030-01-01" }
                    )
                ).StatusCode;
            }

            var deleteTask = Task.Run(Delete);
            var payTask = Task.Run(Pay);
            start.SetResult();
            var deleteStatus = await deleteTask;
            var payStatus = await payTask;

            var clientExists = await ClientExistsAsync(client.Id);
            var paymentCount = await _app.WithDbAsync(db =>
                db.Payments.CountAsync(payment => payment.ClientId == client.Id)
            );

            if (deleteStatus == HttpStatusCode.NoContent)
            {
                // Delete won: the client and any payment must be gone together; no success was reported for a payment.
                Assert.False(clientExists);
                Assert.Equal(0, paymentCount);
                Assert.NotEqual(HttpStatusCode.OK, payStatus);
            }
            else
            {
                // Payment won: the delete must have been refused and nothing may be lost.
                Assert.Equal(HttpStatusCode.Conflict, deleteStatus);
                Assert.True(clientExists);
                Assert.Equal(1, paymentCount);
                Assert.Equal(HttpStatusCode.OK, payStatus);
            }
        }
    }

    // ---------- helpers ----------

    private Task AddHistoryAsync(string kind, Trainer trainer, Client client) =>
        kind switch
        {
            "payment" => _app.AddPaymentAsync(client),
            "workout" => _app.AddWorkoutAssignmentAsync(trainer, client),
            _ => _app.AddMealAssignmentAsync(trainer, client),
        };

    private Task<bool> ClientExistsAsync(int id) =>
        _app.WithDbAsync(db => db.Clients.AnyAsync(client => client.Id == id));

    private Task<bool> IsActiveAsync(int id) =>
        _app.WithDbAsync(db =>
            db.Clients.Where(client => client.Id == id)
                .Select(client => client.IsActive)
                .SingleAsync()
        );

    private async Task AssertHistoryCountsAsync(
        int clientId,
        int payments,
        int workouts,
        int meals,
        int mealStatuses
    )
    {
        Assert.Equal(
            payments,
            await _app.WithDbAsync(db => db.Payments.CountAsync(x => x.ClientId == clientId))
        );
        Assert.Equal(
            workouts,
            await _app.WithDbAsync(db =>
                db.ClientWorkoutAssignments.CountAsync(x => x.ClientId == clientId)
            )
        );
        Assert.Equal(
            meals,
            await _app.WithDbAsync(db => db.ClientMealPlans.CountAsync(x => x.ClientId == clientId))
        );
        Assert.Equal(
            mealStatuses,
            await _app.WithDbAsync(db =>
                db.ClientMealStatuses.CountAsync(x => x.ClientMealPlan.ClientId == clientId)
            )
        );
    }
}
