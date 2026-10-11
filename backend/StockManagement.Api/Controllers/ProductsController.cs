using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.DTOs;
using StockManagement.Api.Models;
using StockManagement.Api.Services;

namespace StockManagement.Api.Controllers;

[ApiController, Route("api/products"), Authorize]
public class ProductsController(AppDbContext db, RedisCacheService cache) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? search)
    {
        var key = $"products:{search ?? "all"}";
        var cached = await cache.GetAsync<List<Product>>(key);
        if (cached is not null)
            return Ok(cached);
        var q = db.Products.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(x => x.Name.Contains(search) || x.Sku.Contains(search));
        var items = await q.OrderBy(x => x.Name).ToListAsync();
        await cache.SetAsync(key, items, TimeSpan.FromMinutes(5));
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var p = await db.Products.FindAsync(id);
        return p is null ? NotFound() : Ok(p);
    }

    [HttpPost, Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateProductRequest r)
    {
        if (await db.Products.AnyAsync(x => x.Sku == r.Sku))
            return Conflict(new { message = "SKU already exists" });
        var p = new Product
        {
            Sku = r.Sku,
            Name = r.Name,
            Category = r.Category,
            Price = r.Price,
            Stock = r.Stock,
            LowStockThreshold = r.LowStockThreshold,
        };
        db.Products.Add(p);
        await db.SaveChangesAsync();
        await cache.RemoveAsync("products:all");
        return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
    }

    [HttpPut("{id:int}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, UpdateProductRequest r)
    {
        var p = await db.Products.FindAsync(id);
        if (p is null)
            return NotFound();
        p.Name = r.Name;
        p.Category = r.Category;
        p.Price = r.Price;
        p.LowStockThreshold = r.LowStockThreshold;
        p.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await cache.RemoveAsync("products:all");
        return Ok(p);
    }

    [HttpDelete("{id:int}"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await db.Products.FindAsync(id);
        if (p is null)
            return NotFound();
        db.Products.Remove(p);
        await db.SaveChangesAsync();
        await cache.RemoveAsync("products:all");
        return NoContent();
    }
}
