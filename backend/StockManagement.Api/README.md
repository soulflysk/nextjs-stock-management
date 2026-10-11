# Stock Management API

ASP.NET Core 8 + EF Core + SQL Server + JWT + Redis.

## Endpoints

- POST /api/auth/login
- POST /api/auth/seed
- GET /api/products
- POST/PUT/DELETE /api/products (Admin)
- POST /api/stock/{productId}/in
- POST /api/stock/{productId}/out
- GET /api/stock/transactions
- GET /swagger

Demo accounts after `/api/auth/seed`: `admin / Admin123!`, `user / User123!`.
Change secrets before production.
