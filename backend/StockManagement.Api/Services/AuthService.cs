using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using StockManagement.Api.Data;
using StockManagement.Api.DTOs;
using StockManagement.Api.Models;

namespace StockManagement.Api.Services;

public class AuthService(AppDbContext db, IConfiguration config)
{
    public User? Validate(string username, string password)
    {
        var user = db.Users.SingleOrDefault(x => x.Username == username);
        return user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash) ? user : null;
    }

    public string CreateToken(User user)
    {
        var jwt = config.GetSection("Jwt");
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        return new JwtSecurityTokenHandler().WriteToken(
            new JwtSecurityToken(
                jwt["Issuer"],
                jwt["Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiresMinutes"]!)),
                signingCredentials: creds
            )
        );
    }
}
