using backend.Data;
using backend.DTOs.Auth;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Auth;

public class TrainerAuthService : ITrainerAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly IJwtService _jwtService;

    public TrainerAuthService(ApplicationDbContext db, IJwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    public async Task<ServiceResult<TrainerLoginResponse>> LoginAsync(TrainerLoginRequest request)
    {
        var trainer = await _db.Trainers.FirstOrDefaultAsync(trainer =>
            trainer.Username == request.Username
        );

        if (trainer is null)
        {
            return ServiceResult<TrainerLoginResponse>.Unauthorized(
                "Invalid username or password."
            );
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, trainer.PasswordHash);

        if (!passwordValid)
        {
            return ServiceResult<TrainerLoginResponse>.Unauthorized(
                "Invalid username or password."
            );
        }

        var token = _jwtService.GenerateTrainerToken(trainer.Id, trainer.Username);

        var response = new TrainerLoginResponse
        {
            Token = token,
            TrainerId = trainer.Id,
            FullName = trainer.FullName,
            Username = trainer.Username,
        };

        return ServiceResult<TrainerLoginResponse>.Ok(response);
    }
}
