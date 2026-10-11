namespace StockManagement.Api.DTOs;

public record LoginRequest(string Username, string Password);

public record CreateProductRequest(
    string Sku,
    string Name,
    string Category,
    decimal Price,
    int Stock,
    int LowStockThreshold
);

public record UpdateProductRequest(
    string Name,
    string Category,
    decimal Price,
    int LowStockThreshold
);

public record StockRequest(int Quantity, string? Note);
