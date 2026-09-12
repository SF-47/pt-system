namespace backend.DTOs.Auth;

public class TrainerLoginResponse
{
    public string Token { get; set; } = string.Empty;

    public int TrainerId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
}
