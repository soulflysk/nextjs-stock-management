"use client";
import { useEffect, useState } from "react";
import { api, Product } from "@/lib/api";
const money = (n: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api<Product[]>("/api/products")
      .then(setProducts)
      .catch((e) => setError(e.message));
  }, []);
  const low = products.filter((p) => p.stock <= p.lowStockThreshold);
  const value = products.reduce((s, p) => s + p.stock * p.price, 0);
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Dashboard</h1>
          <div className="muted">
            JWT + EF Core + SQL Server + Redis inventory overview
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <section className="grid">
        <div className="card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="card">
          <div className="stat-label">Total Units</div>
          <div className="stat-value">
            {products.reduce((s, p) => s + p.stock, 0)}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{low.length}</div>
        </div>
        <div className="card">
          <div className="stat-label">Inventory Value</div>
          <div className="stat-value">{money(value)}</div>
        </div>
      </section>
      <div style={{ height: 16 }} />
      <section className="panel">
        <h2>Low Stock Alert</h2>
        {low.length === 0 ? (
          <div className="empty">All products have sufficient stock.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Minimum</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {low.map((p) => (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.stock}</td>
                    <td>{p.lowStockThreshold}</td>
                    <td>
                      <span className="badge badge-warning">Low Stock</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
