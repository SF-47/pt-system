using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services.Auth;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateClientToken(int clientId, string username)
    {
        var jwtKey = _configuration["Jwt:Key"]; //this reads "Jwt": {"key": "..."} from configuration.

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException("JWT key is not configured.");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, clientId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "Client"),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)); //This converts the JWT secret string into a cryptographic key.

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //This signature prevents someone from changing the token.

        var token = new JwtSecurityToken( //This creates the actual JWT object.
            issuer: _configuration["Jwt:Issuer"], //Issuer means who created this token.
            audience: _configuration["Jwt:Audience"], //Audience means who is this token intended for.
            claims: claims, //This puts the info inside.
            expires: DateTime.UtcNow.AddHours(1), //this makes the token valid for 7 days
            signingCredentials: credentials //This sign the token using "secret key + HMAC SHA256" which prevents someone from changing it.
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateTrainerToken(int trainerId, string username)
    {
        var key = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException("JWT key is not configured.");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, trainerId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "Trainer"),
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
