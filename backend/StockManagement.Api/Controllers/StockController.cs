using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.DTOs;
using StockManagement.Api.Models;
using StockManagement.Api.Services;

namespace StockManagement.Api.Controllers;

[ApiController, Route("api/stock"), Authorize]
public class StockController(AppDbContext db, RedisCacheService cache) : ControllerBase
{
    [HttpPost("{productId:int}/in")]
    public Task<IActionResult> In(int productId, StockRequest r) =>
        Change(productId, r, StockTransactionType.In);

    [HttpPost("{productId:int}/out")]
    public Task<IActionResult> Out(int productId, StockRequest r) =>
        Change(productId, r, StockTransactionType.Out);

    private async Task<IActionResult> Change(
        int productId,
        StockRequest r,
        StockTransactionType type
    )
    {
        if (r.Quantity <= 0)
            return BadRequest(new { message = "Quantity must be greater than zero" });
        await using var tx = await db.Database.BeginTransactionAsync();
        var p = await db.Products.SingleOrDefaultAsync(x => x.Id == productId);
        if (p is null)
            return NotFound();
        if (type == StockTransactionType.Out && p.Stock < r.Quantity)
            return BadRequest(new { message = "Insufficient stock" });
        p.Stock += type == StockTransactionType.In ? r.Quantity : -r.Quantity;
        p.UpdatedAt = DateTime.UtcNow;
        db.StockTransactions.Add(
            new StockTransaction
            {
                ProductId = p.Id,
                Quantity = r.Quantity,
                Type = type,
                Note = r.Note,
                CreatedByUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
            }
        );
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        await cache.RemoveAsync("products:all");
        return Ok(p);
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> Transactions() =>
        Ok(
            await db
                .StockTransactions.AsNoTracking()
                .Include(x => x.Product)
                .Include(x => x.CreatedByUser)
                .OrderByDescending(x => x.CreatedAt)
                .Take(100)
                .ToListAsync()
        );
}
