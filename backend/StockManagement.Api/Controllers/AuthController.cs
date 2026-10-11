using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.DTOs;
using StockManagement.Api.Models;
using StockManagement.Api.Services;

namespace StockManagement.Api.Controllers;

[ApiController, Route("api/auth")]
public class AuthController(AppDbContext db, AuthService auth) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        var user = auth.Validate(request.Username, request.Password);
        if (user is null)
            return Unauthorized(new { message = "Invalid username or password" });
        return Ok(
            new
            {
                token = auth.CreateToken(user),
                username = user.Username,
                role = user.Role.ToString(),
            }
        );
    }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        if (await db.Users.AnyAsync())
            return Ok(new { message = "Users already seeded" });
        db.Users.AddRange(
            new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = Role.Admin,
            },
            new User
            {
                Username = "user",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                Role = Role.User,
            }
        );
        await db.SaveChangesAsync();
        return Ok(new { message = "Seeded: admin/Admin123! and user/User123!" });
    }
}
