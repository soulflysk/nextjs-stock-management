"use client";
import { useEffect, useState } from "react";
import { api, Product } from "@/lib/api";
export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("User");
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    price: 0,
    stock: 0,
    lowStockThreshold: 10,
  });
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(u.role || "User");
    load();
  }, []);
  async function load() {
    try {
      setItems(
        await api<Product[]>(`/api/products?search=${encodeURIComponent(q)}`),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q]);
  async function add() {
    try {
      await api("/api/products", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({
        sku: "",
        name: "",
        category: "",
        price: 0,
        stock: 0,
        lowStockThreshold: 10,
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Products</h1>
          <div className="muted">
            EF Core + SQL Server + Redis cached product API
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="toolbar">
        <input
          className="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search product, SKU, category..."
        />
        <span className="muted">{items.length} products</span>
      </div>
      {role === "Admin" && (
        <div className="panel create-panel">
          <h2>Add Product</h2>
          <div className="form-grid">
            <div className="field">
              <label>SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="field">
              <label>Initial Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
              />
            </div>
            <div className="field">
              <label>Low Stock Threshold</label>
              <input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lowStockThreshold: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={add}>
              Create Product
            </button>
          </div>
        </div>
      )}
      <div style={{ height: 16 }} />
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              {role === "Admin" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>{p.category}</td>
                <td>฿{p.price.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>
                  {p.stock === 0 ? (
                    <span className="badge badge-danger">Out of Stock</span>
                  ) : p.stock <= p.lowStockThreshold ? (
                    <span className="badge badge-warning">Low Stock</span>
                  ) : (
                    <span className="badge badge-success">In Stock</span>
                  )}
                </td>
                {role === "Admin" && (
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
