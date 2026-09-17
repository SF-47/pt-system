using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using backend.Data;
using backend.Services.Auth;
using backend.Services.Clients;
using backend.Services.MealAssignments;
using backend.Services.Meals;
using backend.Services.Mobile;
using backend.Services.Payments;
using backend.Services.WorkoutAssignments;
using backend.Services.Workouts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IWorkoutPlanService, WorkoutPlanService>();
builder.Services.AddScoped<IMealPlanService, MealPlanService>();
builder.Services.AddScoped<IWorkoutAssignmentService, WorkoutAssignmentService>();
builder.Services.AddScoped<IMealAssignmentService, MealAssignmentService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IClientAuthService, ClientAuthService>();
builder.Services.AddScoped<ITrainerAuthService, TrainerAuthService>();

builder.Services.AddScoped<IClientProfileService, ClientProfileService>();
builder.Services.AddScoped<IClientWorkoutService, ClientWorkoutService>();
builder.Services.AddScoped<IClientMealService, ClientMealService>();
builder.Services.AddScoped<IClientProgressService, ClientProgressService>();

builder.Services.AddScoped<IJwtService, JwtService>();

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT signing key is not configured.");
}

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var role = context.Principal?.FindFirst(ClaimTypes.Role)?.Value;
                if (role != "Client")
                {
                    return;
                }

                var clientIdClaim = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(clientIdClaim, out var clientId))
                {
                    context.Fail("Invalid client ID.");
                    return;
                }

                var dbContext =
                    context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();

                var isActive = await dbContext.Clients.AnyAsync(client =>
                    client.Id == clientId && client.IsActive
                );

                if (!isActive)
                {
                    context.Fail("Client account is inactive.");
                }
            },
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
        }
    );
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";

        await context.HttpContext.Response.WriteAsJsonAsync(
            new { message = "Too many requests. Please try again later." },
            cancellationToken
        );
    };

    options.AddPolicy(
        "login",
        httpContext =>
        {
            var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: ipAddress,
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                }
            );
        }
    );

    options.AddPolicy(
        "authenticated",
        httpContext =>
        {
            var userId =
                httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
            var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value ?? "unknown";
            var key = $"{role}:{userId}";

            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: key,
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                }
            );
        }
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseRateLimiter();
app.UseAuthorization();
app.MapControllers();

app.Run();
