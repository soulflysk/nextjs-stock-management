using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using StockManagement.Api.Data;
using StockManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o =>
    o.AddPolicy(
        "web",
        p => p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod()
    )
);
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect(builder.Configuration["Redis:Connection"]!)
);
builder.Services.AddScoped<RedisCacheService>();
builder.Services.AddScoped<AuthService>();
var jwt = builder.Configuration.GetSection("Jwt");
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),
        };
    });
builder.Services.AddAuthorization();
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    for (var i = 0; i < 20; i++)
    {
        try
        {
            db.Database.EnsureCreated();
            if (!db.Users.Any())
            {
                db.Users.AddRange(
                    new StockManagement.Api.Models.User
                    {
                        Username = "admin",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                        Role = StockManagement.Api.Models.Role.Admin,
                    },
                    new StockManagement.Api.Models.User
                    {
                        Username = "user",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                        Role = StockManagement.Api.Models.Role.User,
                    }
                );
                db.Products.AddRange(
                    new StockManagement.Api.Models.Product
                    {
                        Sku = "KB-001",
                        Name = "Mechanical Keyboard",
                        Category = "Accessories",
                        Price = 1890,
                        Stock = 42,
                        LowStockThreshold = 10,
                    },
                    new StockManagement.Api.Models.Product
                    {
                        Sku = "MS-001",
                        Name = "Wireless Mouse",
                        Category = "Accessories",
                        Price = 790,
                        Stock = 7,
                        LowStockThreshold = 10,
                    },
                    new StockManagement.Api.Models.Product
                    {
                        Sku = "HB-001",
                        Name = "USB-C Hub",
                        Category = "Connectivity",
                        Price = 1290,
                        Stock = 15,
                        LowStockThreshold = 5,
                    }
                );
                db.SaveChanges();
            }
            break;
        }
        catch
        {
            await Task.Delay(2000);
        }
    }
}
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("web");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.Run();
