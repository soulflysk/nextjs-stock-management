# StockFlow — Full-Stack Inventory Management Portfolio

Portfolio project: **Next.js 15 + TypeScript + ASP.NET Core 8 + JWT + Role Authorization + EF Core + SQL Server + Redis + Docker Compose**.

## Architecture

```text
Next.js Web
    |
    v
ASP.NET Core Web API ----> Redis (product cache)
    |
    v
EF Core
    |
    v
SQL Server
```

## Features

- JWT authentication
- Admin/User role authorization
- Product CRUD (Admin-only writes)
- Product search with Redis cache (5-minute TTL)
- Stock In / Stock Out
- SQL database transaction for stock changes
- Insufficient-stock validation
- Stock transaction history
- SQL Server persistence
- Swagger API documentation
- Docker Compose: Web + API + SQL Server + Redis

## Run with Docker

```bash
docker compose up --build
```

Then open `http://localhost:3000`.

Demo accounts:

- Admin: `admin` / `Admin123!`
- User: `user` / `User123!`

Swagger: `http://localhost:5000/swagger`

## Local frontend

```bash
npm install
npm run dev
```

The frontend defaults to `http://localhost:5000` for the API. Override with `NEXT_PUBLIC_API_URL` when needed.

## Backend

The API source is under `backend/StockManagement.Api`.

Important endpoints:

- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (Admin)
- `PUT /api/products/{id}` (Admin)
- `DELETE /api/products/{id}` (Admin)
- `POST /api/stock/{productId}/in`
- `POST /api/stock/{productId}/out`
- `GET /api/stock/transactions`

## Production hardening

Replace demo credentials, JWT key, and SQL password with environment/secret-manager values. For production, add EF migrations, HTTPS, refresh-token rotation, rate limiting, structured logging, automated tests, and CI/CD.
